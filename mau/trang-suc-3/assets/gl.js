/* Tay Vàng — lớp 3D (three.js r160, ES module).
   1) Màn đầu: chữ "TAY VÀNG" vẽ lên texture, shader làm gợn như chất lỏng theo vệt con trỏ / ngón tay;
      phía trước là chiếc nhẫn vàng gắn hồng ngọc (vật liệu kim loại phản chiếu môi trường), tự đung đưa, kéo để xoay.
   2) Phần triết lý: khối quặng có vân vàng + vòng vàng, xoay theo tiến độ cuộn.
   Tiết kiệm pin: devicePixelRatio tối đa 2 (điện thoại 1.5), chỉ vẽ khi phần đó trong màn hình và tab đang mở,
   chỉ dựng lại khi chiều ngang đổi thật (iPhone bắn resize khi cuộn). */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const d = document, W = window;
const coarse = matchMedia('(pointer: coarse)').matches;
const DPR = Math.min(W.devicePixelRatio || 1, coarse ? 1.5 : 2);
const RED = 0xbe0d0d;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
let hidden = d.hidden;
d.addEventListener('visibilitychange', () => { hidden = d.hidden; });

function mkRenderer(canvas, alpha) {
  const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha, powerPreference: 'high-performance' });
  r.setPixelRatio(DPR);
  r.outputColorSpace = THREE.SRGBColorSpace;
  r.toneMapping = THREE.ACESFilmicToneMapping;
  r.toneMappingExposure = 1.08;
  return r;
}
function envFor(renderer) {
  const pm = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment(renderer);
  const glow = new THREE.MeshBasicMaterial({ color: new THREE.Color(RED).multiplyScalar(5) });
  const red = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), glow);   /* tấm hắt đỏ: viền đỏ trên vàng */
  red.position.set(-7, 1, 3); red.scale.set(.6, 7, 5); room.add(red);
  const warm = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: new THREE.Color(0xffd9a0).multiplyScalar(4) }));
  warm.position.set(6, 5, -2); warm.scale.set(4, .4, 4); room.add(warm);
  const t = pm.fromScene(room, 0.035).texture;
  pm.dispose();
  return t;
}
const goldMat = () => new THREE.MeshPhysicalMaterial({ color: new THREE.Color('#ecbd6a'), metalness: 1, roughness: .13, clearcoat: .3, clearcoatRoughness: .08, envMapIntensity: 1.3 });

/* Nhẫn: đai dẹt (xuyến ép theo trục) + ổ chấu + viên hồng ngọc giác cắt + 4 chấu */
function makeRing() {
  const gold = goldMat();
  const ruby = new THREE.MeshPhysicalMaterial({ color: new THREE.Color('#7d0410'), metalness: .15, roughness: .04, clearcoat: .7, clearcoatRoughness: 0,
    flatShading: true, side: THREE.DoubleSide, envMapIntensity: 1.5, emissive: new THREE.Color('#2a0004'), ior: 1.77, specularIntensity: .7 });
  const g = new THREE.Group();
  const band = new THREE.TorusGeometry(1, .078, 48, 260); band.scale(1, 1, 2.6);
  g.add(new THREE.Mesh(band, gold));
  const head = new THREE.Group(); head.position.y = 1.02; g.add(head);
  const collet = new THREE.Mesh(new THREE.CylinderGeometry(.15, .08, .2, 40), gold); collet.position.y = .1; head.add(collet);
  const prof = [[.001, -.25], [.26, -.005], [.265, .03], [.16, .13], [.001, .13]].map(p => new THREE.Vector2(p[0], p[1]));
  const gem = new THREE.Mesh(new THREE.LatheGeometry(prof, 12), ruby); gem.position.y = .46; gem.scale.setScalar(1.28); head.add(gem);
  const tip = new THREE.SphereGeometry(.032, 16, 12), pr = new THREE.CylinderGeometry(.022, .03, .46, 10);
  for (let k = 0; k < 4; k++) {
    const a = k * Math.PI / 2 + Math.PI / 4, p = new THREE.Mesh(pr, gold);
    p.position.set(Math.cos(a) * .265, .34, Math.sin(a) * .265);
    p.rotation.z = -Math.cos(a) * .29; p.rotation.x = Math.sin(a) * .29;
    head.add(p);
    const s = new THREE.Mesh(tip, gold); s.position.set(Math.cos(a) * .332, .565, Math.sin(a) * .332); head.add(s);
  }
  return g;
}

/* ---------- 1. Màn đầu ---------- */
function hero() {
  const sec = d.getElementById('hero'), cv = d.getElementById('gl'), h1 = sec && sec.querySelector('.hero-title');
  if (!sec || !cv || !h1) return;
  const R = mkRenderer(cv, false);
  R.setClearColor(0x000000, 1); R.autoClear = false;

  /* chữ: texture + shader */
  const N = 24, P = [], L = new Array(N).fill(0);
  for (let i = 0; i < N; i++) P.push(new THREE.Vector4(-9999, -9999, 0, 0));
  const tc = d.createElement('canvas'), tx = tc.getContext('2d');
  const tex = new THREE.CanvasTexture(tc); tex.minFilter = THREE.LinearFilter; tex.generateMipmaps = false;
  const U = { uTex: { value: tex }, uRes: { value: new THREE.Vector2(1, 1) }, uP: { value: P }, uL: { value: L }, uR: { value: 120 }, uT: { value: 0 } };
  const tMat = new THREE.ShaderMaterial({
    uniforms: U, depthTest: false, depthWrite: false,
    vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}',
    fragmentShader: `precision highp float;
uniform sampler2D uTex;uniform vec2 uRes;uniform vec4 uP[${N}];uniform float uL[${N}];uniform float uR;uniform float uT;varying vec2 vUv;
void main(){
  vec2 p=vUv*uRes;vec2 dd=vec2(0.);float heat=0.;
  for(int i=0;i<${N};i++){vec2 q=p-uP[i].xy;float f=exp(-dot(q,q)/(uR*uR))*uL[i];dd+=uP[i].zw*f;heat+=f;}
  heat=clamp(heat,0.,1.);
  dd+=vec2(sin(p.y*.035+uT*3.1),cos(p.x*.03-uT*2.4))*heat*8.;
  float ld=length(dd);if(ld>160.)dd*=160./ld;
  vec2 uv=(p-dd)/uRes;vec2 o=dd/uRes*.2+vec2(heat*3./uRes.x,0.);
  float a=texture2D(uTex,uv).a,ar=texture2D(uTex,uv+o).a,ab=texture2D(uTex,uv-o).a;
  vec3 tan=vec3(.773,.655,.49),red=vec3(.745,.051,.051),brz=vec3(.58,.475,.357);
  vec3 col=mix(tan*a,red*max(a,ar),heat*.92);
  col+=red*max(ar-a,0.)*heat+brz*max(ab-a,0.)*.7*heat;
  col*=mix(.84,1.05,smoothstep(.15,.85,vUv.y));
  gl_FragColor=vec4(col,1.);
}`
  });
  const tScene = new THREE.Scene(), tCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  tScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), tMat));

  /* nhẫn */
  const scene = new THREE.Scene(); scene.environment = envFor(R);
  const key = new THREE.PointLight(0xffe2b0, 18, 30); key.position.set(3, 3, 5); scene.add(key);
  const rim = new THREE.PointLight(RED, 26, 30); rim.position.set(-4, -1, 2); scene.add(rim);
  const cam = new THREE.PerspectiveCamera(30, 1, .1, 60); cam.position.set(0, 0, 7);
  const pivot = new THREE.Group(), ring = makeRing(); pivot.add(ring); scene.add(pivot);

  let w = 0, h = 0, baseY = 0, scl = 1, cy = .5;
  function drawText() {
    const hr = sec.getBoundingClientRect(), cs = getComputedStyle(h1);
    tc.width = Math.max(2, Math.round(w * DPR)); tc.height = Math.max(2, Math.round(h * DPR));
    tx.clearRect(0, 0, tc.width, tc.height); tx.fillStyle = '#fff'; tx.textBaseline = 'alphabetic';
    tx.font = cs.fontWeight + ' ' + (parseFloat(cs.fontSize) * DPR) + 'px ' + cs.fontFamily;
    const m = tx.measureText('VÀNG'), asc = m.fontBoundingBoxAscent || parseFloat(cs.fontSize) * DPR * .97;
    const tw = d.createTreeWalker(h1, NodeFilter.SHOW_TEXT), rg = d.createRange();
    let n, top = 1e9, bot = -1e9;
    while ((n = tw.nextNode())) for (let i = 0; i < n.data.length; i++) {
      const c = n.data[i]; if (/\s/.test(c)) continue;
      rg.setStart(n, i); rg.setEnd(n, i + 1); const r = rg.getBoundingClientRect(); if (!r.width) continue;
      tx.fillText(c, (r.left - hr.left) * DPR, (r.top - hr.top) * DPR + asc);
      top = Math.min(top, r.top - hr.top); bot = Math.max(bot, r.bottom - hr.top);
    }
    tex.needsUpdate = true;
    cy = top < bot ? (top + bot) / 2 / h : .5;
    place();
  }
  function place() {
    const visH = 2 * cam.position.z * Math.tan(cam.fov * Math.PI / 360), visW = visH * cam.aspect;
    scl = Math.min(.86, visW * .34, visH * .3);
    ring.scale.setScalar(scl);
    baseY = (.5 - cy) * visH - .12 * scl;
  }
  function size() {
    w = sec.clientWidth; h = sec.clientHeight;
    R.setSize(w, h, false);
    U.uRes.value.set(w, h); U.uR.value = Math.min(w, h) * (w < 700 ? .2 : .13);
    cam.aspect = w / h; cam.updateProjectionMatrix();
    drawText();
  }
  size();
  const f = getComputedStyle(h1).fontFamily.split(',')[0].replace(/["']/g, '');
  if (d.fonts && d.fonts.load) d.fonts.load('900 100px "' + f + '"', 'TAY VÀNG').then(drawText, () => {});
  if (d.fonts && d.fonts.ready) d.fonts.ready.then(drawText);
  let lw = innerWidth, lh = innerHeight;
  addEventListener('resize', () => {
    if (innerWidth === lw && (coarse || innerHeight === lh)) return;
    lw = innerWidth; lh = innerHeight; size();
  });

  /* vệt gợn */
  let pi = 0, last = null, lastIn = -1e9, now = 0;
  function push(x, y, vx, vy, s) { P[pi].set(x, y, vx, vy); L[pi] = s; pi = (pi + 1) % N; }
  function trail(x, y, s) {
    if (last) {
      let vx = x - last.x, vy = y - last.y; const sp = Math.hypot(vx, vy);
      if (sp < 1.2) return;
      const k = Math.min(1, 42 / sp); vx *= k; vy *= k;
      push(x, y, vx * 1.7, vy * 1.7, s);
    }
    last = { x, y };
  }
  function input(cx, cy2) {
    const r = sec.getBoundingClientRect();
    if (cy2 < r.top || cy2 > r.bottom) return;
    if (now - lastIn > 400) last = null;
    lastIn = now; trail(cx - r.left, r.bottom - cy2, 1);
  }
  /* kéo xoay nhẫn */
  let drag = false, px = 0, py = 0, uY = 0, uX = 0, vY = 0;
  sec.addEventListener('pointermove', e => { if (e.pointerType !== 'touch') input(e.clientX, e.clientY); });
  sec.addEventListener('touchstart', e => { last = null; const t = e.touches[0]; input(t.clientX, t.clientY); }, { passive: true });
  sec.addEventListener('touchmove', e => { const t = e.touches[0]; input(t.clientX, t.clientY); }, { passive: true });
  sec.addEventListener('pointerdown', e => {
    if (e.target.closest('a,button,input,select,textarea')) return;
    drag = true; px = e.clientX; py = e.clientY; vY = 0; sec.classList.add('grab');
  });
  addEventListener('pointermove', e => {
    if (!drag) return;
    const dx = e.clientX - px, dy = e.clientY - py; px = e.clientX; py = e.clientY;
    uY += dx * .011; uX = clamp(uX + dy * .006, -.7, .7); vY = dx * .011;
  });
  const up = () => { if (!drag) return; drag = false; sec.classList.remove('grab'); };
  addEventListener('pointerup', up); addEventListener('pointercancel', up);

  /* chỉ vẽ khi thấy */
  let vis = true;
  if ('IntersectionObserver' in W) new IntersectionObserver(es => { vis = es[0].isIntersecting; if (vis) kick(); }, { threshold: 0 }).observe(sec);
  d.addEventListener('visibilitychange', kick);

  const clock = new THREE.Clock(); let raf = 0, gPrev = null, shown = false;
  function frame() {
    raf = 0;
    if (!vis || hidden) return;
    const dt = Math.min(clock.getDelta(), .05); now += dt * 1000; const t = now / 1000;
    U.uT.value = t;
    /* con trỏ "ma" khi không ai chạm: chữ luôn gợn nhẹ */
    if (now - lastIn > 2200) {
      const gx = w * (.5 + .4 * Math.sin(t * .55)), gy = h * (1 - cy) + h * .07 * Math.sin(t * 1.35);
      if (gPrev) { const vx = gx - gPrev[0], vy = gy - gPrev[1]; push(gx, gy, vx * 2.2, vy * 2.2, .42); }
      gPrev = [gx, gy];
    } else gPrev = null;
    const dec = Math.pow(.952, dt * 60); for (let i = 0; i < N; i++) L[i] *= dec;

    if (!drag) { uY += vY; vY *= Math.pow(.94, dt * 60); uX *= Math.pow(.96, dt * 60); }
    const hr = sec.getBoundingClientRect(), sp = clamp(-hr.top / Math.max(1, h), 0, 1);
    pivot.rotation.y = Math.sin(t * .7) * .5 + uY + sp * 2.2;
    pivot.rotation.x = .2 + Math.sin(t * .5) * .06 + uX + sp * .6;
    pivot.rotation.z = Math.sin(t * .9) * .07;
    pivot.position.y = baseY + Math.sin(t * 1.1) * .05 * scl + sp * 1.6;

    R.clear(); R.render(tScene, tCam); R.clearDepth(); R.render(scene, cam);
    if (!shown) { shown = true; sec.classList.add('gl-on'); }
    raf = requestAnimationFrame(frame);
  }
  function kick() { if (!raf && vis && !hidden) { clock.getDelta(); raf = requestAnimationFrame(frame); } }
  kick();
}

/* ---------- 2. Khối quặng vân vàng ---------- */
function hash(x, y, z) { const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return s - Math.floor(s); }
function vnoise(x, y, z) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z), xf = x - xi, yf = y - yi, zf = z - zi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), w = zf * zf * (3 - 2 * zf), lp = (a, b, t) => a + (b - a) * t;
  return lp(lp(lp(hash(xi, yi, zi), hash(xi + 1, yi, zi), u), lp(hash(xi, yi + 1, zi), hash(xi + 1, yi + 1, zi), u), v),
            lp(lp(hash(xi, yi, zi + 1), hash(xi + 1, yi, zi + 1), u), lp(hash(xi, yi + 1, zi + 1), hash(xi + 1, yi + 1, zi + 1), u), v), w);
}
function fbm(x, y, z) { let a = .5, f = 1, s = 0; for (let o = 0; o < 4; o++) { s += a * vnoise(x * f, y * f, z * f); f *= 2.03; a *= .5; } return s; }

function stone() {
  const sec = d.getElementById('triet-ly'), cv = d.getElementById('stone');
  if (!sec || !cv) return;
  const R = mkRenderer(cv, true); R.setClearColor(0x000000, 0);
  const scene = new THREE.Scene(); scene.environment = envFor(R);
  const key = new THREE.DirectionalLight(0xffe0b0, 2.2); key.position.set(3, 4, 5); scene.add(key);
  const rim = new THREE.PointLight(RED, 30, 20); rim.position.set(-3.5, -1.5, 2.5); scene.add(rim);
  const cam = new THREE.PerspectiveCamera(32, 1, .1, 50); cam.position.set(0, 0, 6.2);

  const geo = new THREE.IcosahedronGeometry(1, 6), pos = geo.attributes.position, col = new Float32Array(pos.count * 3);
  const v = new THREE.Vector3(), c = new THREE.Color(), dark = new THREE.Color('#15110e'), mid = new THREE.Color('#3b3129');
  /* mặt cắt phẳng: khối đá đẽo thô */
  const cuts = [];
  for (let k = 0; k < 9; k++) { const a = hash(k, 7, 1) * Math.PI * 2, z = hash(k, 2, 9) * 2 - 1, q = Math.sqrt(1 - z * z); cuts.push([new THREE.Vector3(Math.cos(a) * q, z, Math.sin(a) * q), .74 + hash(k, 4, 4) * .16]); }
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const o = v.clone(), n = fbm(v.x * 1.3 + 3, v.y * 1.3, v.z * 1.3);
    v.multiplyScalar(.8 + n * .45);
    for (const [nn, dd] of cuts) { const t = v.dot(nn) - dd; if (t > 0) v.addScaledVector(nn, -t); }
    v.y *= 1.12;
    pos.setXYZ(i, v.x, v.y, v.z);
    c.copy(dark).lerp(mid, clamp((n - .35) * 2.2, 0, 1));
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  geo.computeVertexNormals();
  const rmat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .5, metalness: .55, flatShading: true, envMapIntensity: 1.1 });
  /* vân vàng mảnh vẽ theo từng điểm ảnh (không theo đỉnh, tránh thành mảng lục giác) */
  rmat.onBeforeCompile = sh => {
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vOP;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvOP = position;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', `#include <common>
varying vec3 vOP;
float h3(vec3 p){p=fract(p*.3183099+.1);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float n3(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);
 return mix(mix(mix(h3(i),h3(i+vec3(1,0,0)),f.x),mix(h3(i+vec3(0,1,0)),h3(i+vec3(1,1,0)),f.x),f.y),
            mix(mix(h3(i+vec3(0,0,1)),h3(i+vec3(1,0,1)),f.x),mix(h3(i+vec3(0,1,1)),h3(i+vec3(1,1,1)),f.x),f.y),f.z);}
float fb3(vec3 p){float s=0.,a=.5;for(int i=0;i<4;i++){s+=a*n3(p);p*=2.03;a*=.5;}return s;}`)
      .replace('#include <color_fragment>', `#include <color_fragment>
float vm=vOP.y*1.9+vOP.x*.7+fb3(vOP*1.7+vec3(11.,-4.,7.))*3.2, vs=abs(sin(vm*3.14159)), vw=fwidth(vs);
float vt=.015+.06*smoothstep(.35,.75,n3(vOP*2.3+3.));
float vein=(1.-smoothstep(vt,vt+vw*1.5+.02,vs))*smoothstep(.2,.5,n3(vOP*1.3-5.));
diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.86,.6,.24),vein);`)
      .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor=mix(roughnessFactor,.2,vein);')
      .replace('#include <metalnessmap_fragment>', '#include <metalnessmap_fragment>\nmetalnessFactor=mix(metalnessFactor,1.,vein);')
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance+=vec3(.3,.17,.04)*vein;');
  };
  const rock = new THREE.Mesh(geo, rmat);
  const grp = new THREE.Group(); grp.add(rock); scene.add(grp);
  const hoop = new THREE.Mesh(new THREE.TorusGeometry(1.55, .04, 24, 260), goldMat()); grp.add(hoop);
  /* bụi vàng */
  const pc = 240, pp = new Float32Array(pc * 3);
  for (let i = 0; i < pc; i++) { const a = hash(i, 1, 2) * Math.PI * 2, rr = 1.7 + hash(i, 3, 4) * 1.4, y = (hash(i, 5, 6) - .5) * 3; pp[i * 3] = Math.cos(a) * rr; pp[i * 3 + 1] = y; pp[i * 3 + 2] = Math.sin(a) * rr; }
  const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pp, 3));
  const dust = new THREE.Points(pg, new THREE.PointsMaterial({ color: 0xd9b26a, size: .028, transparent: true, opacity: .8, depthWrite: false }));
  scene.add(dust);

  function size() {
    const w = cv.clientWidth, h = cv.clientHeight; if (!w || !h) return;
    R.setSize(w, h, false); cam.aspect = w / h;
    cam.position.z = w / h < .9 ? 6.2 / Math.max(.62, w / h * 1.05) : 6.2;
    cam.updateProjectionMatrix();
  }
  size();
  let lw = innerWidth, lh = innerHeight;
  addEventListener('resize', () => { if (innerWidth === lw && (coarse || innerHeight === lh)) return; lw = innerWidth; lh = innerHeight; size(); });

  let vis = false, raf = 0, t = 0, sp = 0;
  const clock = new THREE.Clock();
  if ('IntersectionObserver' in W) new IntersectionObserver(es => { vis = es[0].isIntersecting; if (vis) kick(); }, { rootMargin: '100px 0px' }).observe(sec);
  else vis = true;
  d.addEventListener('visibilitychange', kick);
  function frame() {
    raf = 0; if (!vis || hidden) return;
    const dt = Math.min(clock.getDelta(), .05); t += dt;
    const r = sec.getBoundingClientRect(), p = clamp(-r.top / Math.max(1, r.height - innerHeight), 0, 1);
    sp += (p - sp) * Math.min(1, dt * 6);
    grp.rotation.y = sp * Math.PI * 2.4 + t * .08;
    grp.rotation.x = Math.sin(sp * Math.PI) * .45 - .1;
    hoop.rotation.x = 1.15 + sp * 1.1; hoop.rotation.y = .35 - sp * .9;
    dust.rotation.y = -t * .04 - sp * 1.2;
    grp.position.y = Math.sin(t * .9) * .05;
    R.render(scene, cam);
    raf = requestAnimationFrame(frame);
  }
  function kick() { if (!raf && vis && !hidden) { clock.getDelta(); raf = requestAnimationFrame(frame); } }
  kick();
  sec.classList.add('gl-on');
}

try { hero(); } catch (e) { d.documentElement.classList.add('no-gl'); }
try { stone(); } catch (e) { /* giữ ảnh dự phòng */ }
export { makeRing, envFor, mkRenderer };
