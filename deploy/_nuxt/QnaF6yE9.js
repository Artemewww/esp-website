import{_ as E}from"./BuzVdz0M.js";import{S as L,F as D,P as N,W,B as j,C as v,a as C,b as V,A as H,c as R,d as G,e as I}from"./HF9doCpK.js";import{_ as q,e as T,f as U,c as J,a as i,g as A,b as K,w as O,r as Q,o as X}from"#entry";const Y={class:"relative h-screen w-full bg-gradient-to-br from-gray-900 via-esp-black to-gray-900 overflow-hidden"},Z={class:"absolute inset-0 flex items-center justify-center z-10"},$={class:"text-center max-w-3xl px-6"},ee={__name:"404",setup(te){const c=Q(null);let o,t,e,a,m;const z=async()=>{if(!c.value)return;await new Promise(l=>setTimeout(l,100));const f=window.innerWidth,n=window.innerHeight;o=new L,o.fog=new D(1710618,.015),t=new N(75,f/n,.1,1e3),t.position.set(0,100,0),t.lookAt(0,0,0),e=new W({antialias:!0,alpha:!0,powerPreference:"high-performance"}),e.setSize(f,n),e.setPixelRatio(Math.min(window.devicePixelRatio,1.5)),e.setClearColor(1710618,1),c.value.appendChild(e.domElement);const s=new j,h=[],x=[],w=new v(9062),S=new v(24633),g=new v(54527);for(let l=0;l<25e3;l++){const r=Math.floor(Math.random()*4),_=Math.random()*Math.PI*2,y=15+r*8+Math.random()*5,M=Math.cos(_)*y+(Math.random()-.5)*12,F=Math.sin(_)*y+(Math.random()-.5)*12,B=r*12+(Math.random()-.5)*8+Math.sin(M*.15)*3;h.push(M,B,F);let d=r===0?w.clone():r===1?w.clone().lerp(g,.4):r===2?g.clone():S.clone();d.offsetHSL(0,0,(Math.random()-.5)*.1),x.push(d.r,d.g,d.b)}s.setAttribute("position",new C(h,3)),s.setAttribute("color",new C(x,3));const k=new V({uniforms:{time:{value:0},pointSize:{value:.4}},vertexShader:`
      uniform float time, pointSize;
      attribute vec3 color;
      varying vec3 vColor;
      varying float vDistance;
      void main() {
        vColor = color;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vDistance = length(mv.xyz);
        vec3 pos = position;
        pos.y += sin(pos.x * 0.1 + time * 0.5) * 0.5;
        pos.z += cos(pos.y * 0.08 + time * 0.3) * 0.3;
        mv = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = pointSize * (300.0 / vDistance);
        gl_Position = projectionMatrix * mv;
      }
    `,fragmentShader:`
      varying vec3 vColor;
      varying float vDistance;
      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        if (d > 0.5) discard;
        float alpha = smoothstep(0.5, 0.1, d);
        alpha *= smoothstep(100.0, 30.0, vDistance);
        vec3 col = vColor * (1.0 + 0.3 * sin(gl_FragCoord.x * 0.01));
        gl_FragColor = vec4(col, alpha * 0.9);
      }
    `,transparent:!0,blending:H,depthWrite:!1});a=new R(s,k),o.add(a),o.add(new G(16777215,.4));const b=new I(54527,.8,100);b.position.set(30,30,30),o.add(b),window.addEventListener("resize",p),u()},p=()=>{!t||!e||(t.aspect=window.innerWidth/window.innerHeight,t.updateProjectionMatrix(),e.setSize(window.innerWidth,window.innerHeight))},u=()=>{m=requestAnimationFrame(u),a?.material?.uniforms?.time&&(a.material.uniforms.time.value=performance.now()*.001),a&&(a.rotation.y+=.002),e&&o&&t&&e.render(o,t)},P=()=>{m&&cancelAnimationFrame(m),a&&(a.geometry?.dispose(),a.material?.dispose()),e&&(e.dispose(),e.domElement?.parentNode&&e.domElement.parentNode.removeChild(e.domElement)),o=null,t=null,window.removeEventListener("resize",p)};return T(()=>{z()}),U(()=>{P()}),(f,n)=>{const s=E;return X(),J("div",Y,[i("div",{ref_key:"container",ref:c,class:"absolute inset-0 w-full h-full"},null,512),i("div",Z,[i("div",$,[n[1]||(n[1]=A('<div class="mb-8 relative" data-v-a6eeffa9><h1 class="font-rounded text-[100px] md:text-[160px] lg:text-[220px] font-bold text-white/5 leading-none select-none" data-v-a6eeffa9> 404 </h1><div class="absolute inset-0 flex items-center justify-center" data-v-a6eeffa9><div class="w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 rounded-full bg-esp-lidar/10 blur-3xl animate-pulse" data-v-a6eeffa9></div></div></div><h2 class="font-rounded text-3xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight" data-v-a6eeffa9> Потеря видимости </h2><p class="text-lg md:text-xl text-white/70 font-inter leading-relaxed mb-10 max-w-2xl mx-auto" data-v-a6eeffa9> В своих проектах мы гарантируем кристальный просвет в 5 метров, но на этой странице данные пока отсутствуют. Давайте вернемся к прозрачным решениям. </p>',3)),K(s,{to:"/",class:"btn btn-lidar inline-flex items-center gap-2 px-10 py-5 text-lg"},{default:O(()=>[...n[0]||(n[0]=[i("svg",{class:"w-6 h-6",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24"},[i("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"})],-1),i("span",null,"На главную",-1)])]),_:1})])]),n[2]||(n[2]=A('<div class="absolute top-6 right-6 z-20" data-v-a6eeffa9><div class="glass-dark px-4 py-2 rounded-lg border border-white/10 backdrop-blur-md" data-v-a6eeffa9><div class="flex items-center gap-2" data-v-a6eeffa9><div class="w-2 h-2 bg-red-500 rounded-full animate-pulse" data-v-a6eeffa9></div><span class="text-white/70 text-xs font-inter font-medium" data-v-a6eeffa9>Ошибка 404</span></div></div></div>',1))])}}},ie=q(ee,[["__scopeId","data-v-a6eeffa9"]]);export{ie as default};
