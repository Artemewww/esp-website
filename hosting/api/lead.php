<?php
/**
 * Приём заявок с форм сайта на шаредном хостинге hoster.by (PHP, без Node).
 *
 *   POST /api/lead   multipart/form-data или JSON
 *
 * Повторяет server/api/lead.post.ts. Каждая заявка сначала пишется в журнал
 * ВНЕ корня сайта (~/esp-content/leads/ГГГГ-ММ.jsonl, файлы — рядом), и только
 * потом рассылается: даже если почта и Telegram недоступны, заявка не теряется.
 *
 * Куда слать — ~/esp-content/leads.json (не в git, правится на хостинге):
 *   {
 *     "emailTo": "ecoservisproekt@mail.ru",
 *     "careerEmailTo": "",                 // отклики на вакансии, пусто — в emailTo
 *     "emailFrom": "site@ecoservisproekt.by",
 *     "telegramToken": "123456:ABC…",       // бот от @BotFather
 *     "telegramChatIds": ["-100…"]          // чат отдела продаж, бот в нём участник
 *   }
 */
declare(strict_types=1);

const MAX_FILES = 5;
const MAX_FILE = 10 * 1024 * 1024;
const LEAD_EXT = '/\.(pdf|docx?|xlsx?|dwg|dxf|jpe?g|png|webp|heic|zip|rar|7z)$/i';
const RATE_WINDOW = 10 * 60;
const RATE_LIMIT = 6;
const FORMS = [
    'contact' => 'Заявка с сайта',
    'technology-pdf' => 'Запрос PDF о технологии',
    'webinar' => 'Регистрация на вебинар',
    'subscribe' => 'Подписка на новости',
    'career' => 'Отклик на вакансию',
];

$CONTENT_DIR = getenv('ESP_CONTENT_DIR') ?: dirname((string) $_SERVER['DOCUMENT_ROOT']) . '/esp-content';
$LEADS_DIR = $CONTENT_DIR . '/leads';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function respond(array $data, int $code = 200): void
{
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function fail(int $code, string $message): void
{
    respond(['ok' => false, 'statusCode' => $code, 'message' => $message], $code);
}

function clean($value, int $max = 2000): string
{
    $s = trim(preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', (string) $value) ?? '');
    return mb_substr($s, 0, $max);
}

function config(): array
{
    global $CONTENT_DIR;
    $cfg = is_file($CONTENT_DIR . '/leads.json')
        ? json_decode((string) file_get_contents($CONTENT_DIR . '/leads.json'), true)
        : null;
    return array_merge([
        'emailTo' => 'ecoservisproekt@mail.ru',
        'careerEmailTo' => '',
        'emailFrom' => 'site@' . preg_replace('/^www\./', '', (string) ($_SERVER['HTTP_HOST'] ?? 'ecoservisproekt.by')),
        'telegramToken' => '',
        'telegramChatIds' => [],
    ], is_array($cfg) ? $cfg : []);
}

/** Не больше RATE_LIMIT заявок с одного адреса за RATE_WINDOW секунд. */
function rate_limited(string $dir): bool
{
    $file = $dir . '/.rate.json';
    $ip = hash('sha256', (string) ($_SERVER['REMOTE_ADDR'] ?? ''));
    $now = time();
    $fh = fopen($file, 'c+');
    if (!$fh) return false;
    flock($fh, LOCK_EX);
    $data = json_decode((string) stream_get_contents($fh), true) ?: [];
    foreach ($data as $k => $hits) {
        $data[$k] = array_values(array_filter($hits, fn ($t) => $t > $now - RATE_WINDOW));
        if (!$data[$k]) unset($data[$k]);
    }
    $limited = count($data[$ip] ?? []) >= RATE_LIMIT;
    if (!$limited) $data[$ip][] = $now;
    ftruncate($fh, 0);
    rewind($fh);
    fwrite($fh, json_encode($data));
    flock($fh, LOCK_UN);
    fclose($fh);
    return $limited;
}

function lead_text(array $lead): string
{
    $labels = [
        'name' => 'Имя', 'company' => 'Компания', 'phone' => 'Телефон', 'email' => 'E-mail',
        'contact' => 'Контакт', 'topic' => 'Тема', 'position' => 'Вакансия', 'link' => 'Ссылка',
        'subject' => 'Материал', 'message' => 'Сообщение',
    ];
    $lines = [FORMS[$lead['form']] . ' · ' . $lead['id']];
    foreach ($labels as $k => $label) {
        if (($lead['fields'][$k] ?? '') !== '') $lines[] = $label . ': ' . $lead['fields'][$k];
    }
    if ($lead['files']) $lines[] = 'Файлы: ' . implode(', ', array_column($lead['files'], 'name'));
    $lines[] = '';
    $lines[] = 'Страница: ' . ($lead['page'] ?: '—');
    if ($lead['landing'] !== '' && $lead['landing'] !== $lead['page']) $lines[] = 'Первый заход: ' . $lead['landing'];
    if ($lead['utm']) {
        $lines[] = 'Источник: ' . implode(', ', array_map(fn ($k, $v) => "$k=$v", array_keys($lead['utm']), $lead['utm']));
    }
    if ($lead['referrer'] !== '') $lines[] = 'Переход с: ' . $lead['referrer'];
    $lines[] = 'Время: ' . $lead['date'];
    return implode("\n", $lines);
}

function send_telegram(array $cfg, array $lead, string $text): bool
{
    $token = (string) $cfg['telegramToken'];
    $chats = array_filter((array) $cfg['telegramChatIds']);
    if ($token === '' || !$chats || !function_exists('curl_init')) return false;
    $ok = true;
    foreach ($chats as $chat) {
        $ok = tg_call($token, 'sendMessage', ['chat_id' => $chat, 'text' => $text]) && $ok;
        foreach ($lead['files'] as $f) {
            $ok = tg_call($token, 'sendDocument', [
                'chat_id' => $chat,
                'caption' => $lead['id'],
                'document' => new CURLFile($f['path'], 'application/octet-stream', $f['name']),
            ]) && $ok;
        }
    }
    return $ok;
}

function tg_call(string $token, string $method, array $payload): bool
{
    $ch = curl_init("https://api.telegram.org/bot{$token}/{$method}");
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $payload,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 15,
    ]);
    $res = json_decode((string) curl_exec($ch), true);
    curl_close($ch);
    return !empty($res['ok']);
}

function send_email(array $cfg, array $lead, string $text): bool
{
    $to = $lead['form'] === 'career' && $cfg['careerEmailTo'] !== '' ? $cfg['careerEmailTo'] : $cfg['emailTo'];
    if ($to === '') return false;
    $subject = '=?UTF-8?B?' . base64_encode(FORMS[$lead['form']] . ' — ' . ($lead['fields']['name'] ?: $lead['id'])) . '?=';
    $headers = [
        'From: ESP сайт <' . $cfg['emailFrom'] . '>',
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
    ];
    $reply = $lead['fields']['email'] ?? '';
    if (filter_var($reply, FILTER_VALIDATE_EMAIL)) $headers[] = 'Reply-To: ' . $reply;
    $body = $text . ($lead['files'] ? "\n\nФайлы лежат на хостинге: esp-content/leads/files/{$lead['id']}/" : '');
    return @mail($to, $subject, $body, implode("\r\n", $headers));
}

/* ---------- приём ---------- */

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') fail(405, 'Только POST');

$input = $_POST;
if (!$input && strpos((string) ($_SERVER['CONTENT_TYPE'] ?? ''), 'json') !== false) {
    $input = json_decode((string) file_get_contents('php://input'), true) ?: [];
}

// Ловушка для ботов: поле скрыто от людей, робот его заполняет.
if (clean($input['website'] ?? '') !== '') respond(['ok' => true]);

$form = clean($input['form'] ?? 'contact', 40);
if (!isset(FORMS[$form])) fail(400, 'Неизвестная форма');
if (empty($input['consent']) || $input['consent'] === 'false') fail(400, 'Нужно согласие на обработку персональных данных');

$fields = [];
foreach (['name', 'company', 'phone', 'email', 'contact', 'topic', 'position', 'link', 'subject'] as $k) {
    $fields[$k] = clean($input[$k] ?? '', 300);
}
$fields['message'] = clean($input['message'] ?? '', 5000);
if ($fields['email'] !== '' && !filter_var($fields['email'], FILTER_VALIDATE_EMAIL)) fail(400, 'Проверьте e-mail');
if ($fields['email'] === '' && $fields['phone'] === '' && $fields['contact'] === '') fail(400, 'Оставьте телефон или e-mail');

if (!is_dir($LEADS_DIR) && !mkdir($LEADS_DIR, 0750, true)) fail(500, 'Заявка не сохранена, позвоните нам: +375 29 165-60-61');
if (rate_limited($LEADS_DIR)) fail(429, 'Слишком много заявок подряд, попробуйте через несколько минут');

$id = 'L' . date('ymd-His') . '-' . bin2hex(random_bytes(2));
$utm = [];
foreach (['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as $k) {
    if (clean($input[$k] ?? '') !== '') $utm[$k] = clean($input[$k], 200);
}

$files = [];
// Один файл без [] в имени поля PHP отдаёт не массивом — приводим к массиву.
if (!empty($_FILES['files']['name']) && !is_array($_FILES['files']['name'])) {
    $_FILES['files'] = array_map(fn ($v) => [$v], $_FILES['files']);
}
if (!empty($_FILES['files']['name']) && is_array($_FILES['files']['name'])) {
    $dir = $LEADS_DIR . '/files/' . $id;
    foreach ($_FILES['files']['name'] as $i => $name) {
        if (count($files) >= MAX_FILES) break;
        if (($_FILES['files']['error'][$i] ?? 1) !== UPLOAD_ERR_OK) continue;
        if ($_FILES['files']['size'][$i] > MAX_FILE || !preg_match(LEAD_EXT, (string) $name)) continue;
        if (!is_dir($dir)) mkdir($dir, 0750, true);
        $safe = preg_replace('/[^\p{L}\p{N}._-]+/u', '_', basename((string) $name));
        $path = $dir . '/' . $safe;
        if (move_uploaded_file($_FILES['files']['tmp_name'][$i], $path)) $files[] = ['name' => $safe, 'path' => $path];
    }
}

$lead = [
    'id' => $id,
    'date' => date('Y-m-d H:i:s'),
    'form' => $form,
    'fields' => $fields,
    'files' => $files,
    'page' => clean($input['page'] ?? '', 300),
    'landing' => clean($input['landing'] ?? '', 300),
    'referrer' => clean($input['referrer'] ?? '', 300),
    'utm' => $utm,
];

$journal = $LEADS_DIR . '/' . date('Y-m') . '.jsonl';
if (file_put_contents($journal, json_encode($lead, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n", FILE_APPEND | LOCK_EX) === false) {
    fail(500, 'Заявка не сохранена, позвоните нам: +375 29 165-60-61');
}

$cfg = config();
$text = lead_text($lead);
$delivered = ['telegram' => send_telegram($cfg, $lead, $text), 'email' => send_email($cfg, $lead, $text)];
file_put_contents($LEADS_DIR . '/delivery.log', $id . ' ' . json_encode($delivered) . "\n", FILE_APPEND | LOCK_EX);

respond(['ok' => true, 'id' => $id]);
