<?php
/**
 * Серверная часть админки для шаредного хостинга hoster.by (PHP, без Node).
 *
 * Повторяет ручки Nitro из server/api один в один, поэтому страницы сайта
 * и интерфейс /admin работают с ней без изменений:
 *   GET    /api/site-content/{key}   — публичное чтение раздела
 *   GET    /api/admin/session        — состояние входа
 *   POST   /api/admin/session        — вход по паролю
 *   DELETE /api/admin/session        — выход
 *   GET    /api/admin/sections       — список разделов
 *   GET    /api/admin/content/{key}  — раздел с описанием полей
 *   PUT    /api/admin/content/{key}  — сохранить раздел
 *   DELETE /api/admin/content/{key}  — вернуть как было
 *   POST   /api/admin/upload         — загрузить фото, видео или документ
 *
 * Описание разделов и исходные данные лежат рядом в _data/ — их выгружает
 * сборка (hosting/export-content.mjs) из server/utils/contentRegistry.ts.
 * Правки заказчика пишутся в папку ВНЕ корня сайта (по умолчанию
 * ~/esp-content): выкладка новой версии сайта их не затирает.
 */
declare(strict_types=1);

const SESSION_TTL = 12 * 60 * 60;
const MAX_UPLOAD = 100 * 1024 * 1024;
const ALLOWED_EXT = '/\.(jpe?g|png|webp|gif|svg|mp4|webm|mov|pdf|docx?|pptx?)$/i';

$DATA_DIR = __DIR__ . '/_data';
$CONTENT_DIR = getenv('ESP_CONTENT_DIR') ?: dirname((string) $_SERVER['DOCUMENT_ROOT']) . '/esp-content';
$MEDIA_DIR = rtrim((string) $_SERVER['DOCUMENT_ROOT'], '/') . '/media';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('X-Content-Type-Options: nosniff');

function respond($data, int $code = 200): void
{
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function fail(int $code, string $message): void
{
    respond(['statusCode' => $code, 'statusMessage' => $message, 'message' => $message], $code);
}

function read_json(string $file)
{
    if (!is_file($file)) return null;
    $data = json_decode((string) file_get_contents($file), true);
    return is_array($data) ? $data : null;
}

/** Атомарная запись: сначала во временный файл, потом rename. */
function write_json(string $file, $data): void
{
    $dir = dirname($file);
    if (!is_dir($dir) && !mkdir($dir, 0750, true)) fail(500, 'Не удалось создать папку для правок');
    $tmp = $file . '.' . bin2hex(random_bytes(4)) . '.tmp';
    $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    if (file_put_contents($tmp, $json, LOCK_EX) === false || !rename($tmp, $file)) {
        @unlink($tmp);
        fail(500, 'Не удалось сохранить правки');
    }
}

function registry(): array
{
    global $DATA_DIR;
    $reg = read_json($DATA_DIR . '/registry.json');
    if (!$reg) fail(500, 'Нет описания разделов: сайт собран без hosting/export-content.mjs');
    return $reg;
}

function section_spec(string $key): ?array
{
    foreach (registry() as $s) if (($s['key'] ?? null) === $key) return $s;
    return null;
}

function section_key(string $raw): string
{
    if (!preg_match('/^[a-z0-9-]{1,40}$/', $raw) || !section_spec($raw)) fail(404, 'Такого раздела нет');
    return $raw;
}

function saved_items(string $key): ?array
{
    global $CONTENT_DIR;
    $items = read_json($CONTENT_DIR . '/' . $key . '.json');
    return is_array($items) ? $items : null;
}

function read_section(string $key): array
{
    global $DATA_DIR;
    return saved_items($key) ?? (read_json($DATA_DIR . '/defaults/' . $key . '.json') ?? []);
}

/* ---------- вход ---------- */

function password_hash_value(): string
{
    global $CONTENT_DIR;
    $cfg = read_json($CONTENT_DIR . '/admin.json');
    return is_array($cfg) ? (string) ($cfg['passwordHash'] ?? '') : '';
}

function start_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) return;
    session_name('esp_admin');
    session_set_cookie_params([
        'lifetime' => SESSION_TTL,
        'path' => '/',
        'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
    session_start();
}

function is_authed(): bool
{
    if (empty($_COOKIE['esp_admin'])) return false;
    start_session();
    return !empty($_SESSION['esp_until']) && $_SESSION['esp_until'] > time();
}

function require_admin(): void
{
    if (!is_authed()) fail(401, 'Нужно войти');
}

/* ---------- маршрутизация ---------- */

$route = trim((string) ($_GET['route'] ?? ''), '/');
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$parts = explode('/', $route);

if ($parts[0] === 'site-content' && isset($parts[1]) && $method === 'GET') {
    respond(read_section(section_key($parts[1])));
}

if ($parts[0] !== 'admin') fail(404, 'Нет такого адреса');
$action = $parts[1] ?? '';

if ($action === 'session') {
    if ($method === 'GET') {
        respond([
            'authed' => is_authed(),
            'configured' => password_hash_value() !== '',
            'local' => false,
            'storage' => 'fs',
            'target' => 'hoster.by',
        ]);
    }
    if ($method === 'POST') {
        $hash = password_hash_value();
        if ($hash === '') fail(503, 'Админка не настроена: не задан пароль (esp-content/admin.json)');
        $body = json_decode((string) file_get_contents('php://input'), true);
        $password = is_array($body) ? (string) ($body['password'] ?? '') : '';
        if ($password === '' || !password_verify($password, $hash)) {
            usleep(400000);
            fail(401, 'Неверный пароль');
        }
        start_session();
        session_regenerate_id(true);
        $_SESSION['esp_until'] = time() + SESSION_TTL;
        respond(['ok' => true]);
    }
    if ($method === 'DELETE') {
        start_session();
        $_SESSION = [];
        session_destroy();
        setcookie('esp_admin', '', ['expires' => time() - 3600, 'path' => '/']);
        respond(['ok' => true]);
    }
    fail(405, 'Метод не поддерживается');
}

require_admin();

if ($action === 'sections' && $method === 'GET') {
    $out = [];
    foreach (registry() as $s) {
        $saved = saved_items($s['key']);
        $out[] = [
            'key' => $s['key'],
            'group' => $s['group'],
            'title' => $s['title'],
            'subtitle' => $s['subtitle'],
            'where' => $s['where'],
            'count' => $saved !== null ? count($saved) : (int) ($s['count'] ?? 0),
            'edited' => $saved !== null,
        ];
    }
    respond($out);
}

if ($action === 'content' && isset($parts[2])) {
    $key = section_key($parts[2]);
    if ($method === 'GET') {
        $spec = section_spec($key);
        unset($spec['count']);
        respond(['section' => $spec, 'items' => read_section($key)]);
    }
    if ($method === 'PUT') {
        $body = json_decode((string) file_get_contents('php://input'), true);
        $items = is_array($body) ? ($body['items'] ?? null) : null;
        if (!is_array($items) || array_values($items) !== $items) fail(400, 'Ожидался список записей');
        foreach ($items as $item) {
            if (!is_array($item) || ($item !== [] && array_values($item) === $item)) fail(400, 'Ожидался список записей');
        }
        write_json($CONTENT_DIR . '/' . $key . '.json', $items);
        respond(['ok' => true, 'count' => count($items), 'confirmed' => true]);
    }
    if ($method === 'DELETE') {
        @unlink($CONTENT_DIR . '/' . $key . '.json');
        respond(['ok' => true]);
    }
    fail(405, 'Метод не поддерживается');
}

if ($action === 'upload' && $method === 'POST') {
    $file = $_FILES['file'] ?? null;
    if (!$file || ($file['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) fail(400, 'Файл не пришёл');
    if (in_array($file['error'], [UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE], true) || $file['size'] > MAX_UPLOAD) {
        fail(413, 'Файл больше допустимого размера');
    }
    if ($file['error'] !== UPLOAD_ERR_OK) fail(400, 'Файл не загрузился, попробуйте ещё раз');
    $original = (string) $file['name'];
    if (!preg_match(ALLOWED_EXT, $original)) fail(415, 'Такой тип файла загрузить нельзя');

    $ext = strtolower((string) pathinfo($original, PATHINFO_EXTENSION));
    $stem = mb_strtolower((string) pathinfo($original, PATHINFO_FILENAME));
    $map = ['а'=>'a','б'=>'b','в'=>'v','г'=>'g','д'=>'d','е'=>'e','ё'=>'e','ж'=>'zh','з'=>'z','и'=>'i','й'=>'y',
        'к'=>'k','л'=>'l','м'=>'m','н'=>'n','о'=>'o','п'=>'p','р'=>'r','с'=>'s','т'=>'t','у'=>'u','ф'=>'f',
        'х'=>'h','ц'=>'c','ч'=>'ch','ш'=>'sh','щ'=>'sch','ъ'=>'','ы'=>'y','ь'=>'','э'=>'e','ю'=>'yu','я'=>'ya',
        'і'=>'i','ў'=>'u',' '=>'-'];
    $stem = strtr($stem, $map);
    $stem = trim((string) preg_replace('/-{2,}/', '-', (string) preg_replace('/[^a-z0-9._-]+/', '-', $stem)), '-');
    $stem = substr($stem !== '' ? $stem : 'file', 0, 48);
    $name = base_convert((string) time(), 10, 36) . bin2hex(random_bytes(2)) . '-' . $stem . '.' . $ext;

    if (!is_dir($MEDIA_DIR) && !mkdir($MEDIA_DIR, 0755, true)) fail(500, 'Не удалось создать папку для файлов');
    if (!move_uploaded_file($file['tmp_name'], $MEDIA_DIR . '/' . $name)) fail(500, 'Не удалось сохранить файл');
    respond(['url' => '/media/' . $name, 'name' => $name]);
}

fail(404, 'Нет такого адреса');
