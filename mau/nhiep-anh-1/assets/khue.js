/* Lâm Khuê · sổ ảnh xoắn ốc 3D (mẫu).
   - Có WebGL và không giảm chuyển động: three.js 0.160 (ES module, tải động), 30 ảnh quanh một vòng xoắn nghiêng,
     đen trắng bằng shader, ảnh phía sau nhạt dần vào nền bằng độ sâu (không dùng CSS blur).
     Kéo/vuốt để xoay có quán tính, cuộn hoặc phím mũi tên để đi dọc, rê để ảnh nhô ra, bấm để ảnh bay lên trước.
   - Không có WebGL / giảm chuyển động / three.js tải lỗi: vòng xoắn tĩnh bằng CSS + lưới ảnh, vẫn xem chi tiết được.
   - Hiệu năng: pixelRatio ≤ 2 (điện thoại 1,5), texture ≤ 1024px, dừng vẽ khi tab ẩn, chỉ dựng lại khi chiều ngang đổi thật. */
(function () {
'use strict';
var d = document, H = d.documentElement, B = d.body;
H.classList.add('js');
var $ = function (s, c) { return (c || d).querySelector(s); };
var $$ = function (s, c) { return [].slice.call((c || d).querySelectorAll(s)); };
var mq = function (q) { return !!(window.matchMedia && matchMedia(q).matches); };
var RM = mq('(prefers-reduced-motion: reduce)');
var FINE = mq('(pointer: fine)');
var HEADLESS = /HeadlessChrome/.test(navigator.userAgent);
var THREE_URL = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.min.js';

/* ---------- dữ liệu: đọc từ lưới ảnh trong HTML ---------- */
var items = $$('#grid li').map(function (li, i) {
  var im = li.querySelector('img');
  return { i: i, li: li, id: li.dataset.id, o: li.dataset.o, t: li.dataset.t, p: li.dataset.p, dt: li.dataset.d,
    c: li.dataset.c, l: li.dataset.l, alt: im ? im.alt : '', desc: (li.querySelector('.dsc') || {}).textContent || '' };
});
var N = items.length;
function pad(n) { return (n < 10 ? '0' : '') + n; }
function src(it, size) {
  var l = it.o === 'l', w, h;
  var q = 80;
  if (size === 'hi' || size === 'xl') { w = l ? 1400 : 1120; h = l ? 933 : 1400; }
  else if (size === 'tex') { /* texture vòng xoắn: nhỏ, nhẹ */
    var tw = innerWidth < 768 ? 360 : 480; w = tw; h = Math.round(l ? tw * .667 : tw * 1.25); q = 60;
  }
  else { w = l ? 540 : 400; h = l ? 360 : 500; q = 70; }
  return 'https://images.unsplash.com/photo-' + it.id + '?auto=format&fit=crop&w=' + w + '&h=' + h + '&q=' + q;
}
function badge() { return d.getElementById('ktBadge'); }

/* ---------- thông báo nhỏ ---------- */
var toastEl = $('#toast'), toastT;
function toast(msg) {
  toastEl.textContent = msg; toastEl.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('show'); }, 2200);
}

/* ---------- sáng / tối: quét ngang ---------- */
var themeBtn = $('#themeBtn'), sweep = $('.sweep'), sweeping = false;
var onTheme = [];
function setTheme(t) {
  H.setAttribute('data-theme', t);
  try { localStorage.setItem('lk-theme', t); } catch (e) {}
  var m = $('meta[name="theme-color"]'); if (m) m.setAttribute('content', t === 'light' ? '#f2ece0' : '#17140f');
  themeBtn.setAttribute('aria-label', t === 'light' ? 'Chuyển sang giao diện tối' : 'Chuyển sang giao diện sáng');
  onTheme.forEach(function (f) { f(); });
}
themeBtn.addEventListener('click', function () {
  if (sweeping) return;
  var next = H.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  if (RM || !sweep.animate) { setTheme(next); return; }
  sweeping = true;
  sweep.style.background = next === 'light' ? '#f2ece0' : '#17140f';
  sweep.style.visibility = 'visible';
  var a = sweep.animate([{ transform: 'translateX(-125%) skewX(-14deg)' }, { transform: 'translateX(0) skewX(-14deg)' }],
    { duration: 520, easing: 'cubic-bezier(.7,0,.3,1)', fill: 'forwards' });
  a.onfinish = function () {
    setTheme(next);
    var b = sweep.animate([{ transform: 'translateX(0) skewX(-14deg)' }, { transform: 'translateX(125%) skewX(-14deg)' }],
      { duration: 640, easing: 'cubic-bezier(.7,0,.3,1)', fill: 'forwards' });
    b.onfinish = function () { sweep.style.visibility = 'hidden'; a.cancel(); b.cancel(); sweeping = false; };
  };
});
setTheme(H.getAttribute('data-theme') === 'light' ? 'light' : 'dark');

/* ---------- thẻ liên hệ + chép email ---------- */
var card = $('#contact'), cBtn = $('#contactBtn');
function cardOpen(v) {
  card.classList.toggle('open', v); cBtn.setAttribute('aria-expanded', v ? 'true' : 'false');
  if (v) setTimeout(function () { $('#copyBtn').focus(); }, 60);
}
cBtn.addEventListener('click', function (e) { e.stopPropagation(); cardOpen(!card.classList.contains('open')); });
d.addEventListener('click', function (e) { if (card.classList.contains('open') && !card.contains(e.target) && e.target !== cBtn) cardOpen(false); });
$('#copyBtn').addEventListener('click', function () {
  var mail = $('#mail').textContent.trim();
  var ok = function () { toast('Đã chép email ' + mail); };
  var old = function () {
    var ta = d.createElement('textarea'); ta.value = mail; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    B.appendChild(ta); ta.select(); try { d.execCommand('copy'); ok(); } catch (e) { toast(mail); } ta.remove();
  };
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(mail).then(ok, old); else old();
});

/* ---------- lớp phủ: giới thiệu / đặt lịch ---------- */
var lastFocus = null, openSheet = null;
function lock() { B.classList.toggle('lock', !!(openSheet || viewOpen())); B.classList.toggle('viewing', viewOpen() && mode === 'gl'); }
function sheetOpen(id) {
  if (openSheet && openSheet.id === id) return;
  if (openSheet) sheetClose(true);
  if (viewOpen()) closeView();
  cardOpen(false);
  var s = d.getElementById(id); if (!s) return;
  [].forEach.call(s.querySelectorAll('img[data-src]'), function (im) { im.src = im.getAttribute('data-src'); im.removeAttribute('data-src'); });
  lastFocus = d.activeElement;
  s.classList.add('open'); s.setAttribute('aria-hidden', 'false'); openSheet = s; lock();
  var p = $('.panel', s); p.scrollTop = 0;
  setTimeout(function () { var x = $('.x', s); if (x) x.focus({ preventScroll: true }); }, 80);
}
function sheetClose(silent) {
  if (!openSheet) return;
  openSheet.classList.remove('open'); openSheet.setAttribute('aria-hidden', 'true'); openSheet = null; lock();
  if (!silent && lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
}
d.addEventListener('click', function (e) {
  var o = e.target.closest('[data-open]');
  if (o) { e.preventDefault(); sheetOpen(o.getAttribute('data-open')); return; }
  if (e.target.closest('[data-close]')) sheetClose();
});
/* chọn gói */
var goi = $('#goi');
function markPlan(k) { $$('.plan').forEach(function (p) { p.classList.toggle('on', p.dataset.plan === k); }); }
$$('[data-pick]').forEach(function (b) {
  b.addEventListener('click', function () {
    var k = b.getAttribute('data-pick'); goi.value = k; markPlan(k);
    var f = $('#bookForm'); f.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'start' });
    setTimeout(function () { f.querySelector('input').focus({ preventScroll: true }); }, RM ? 0 : 450);
  });
});
goi.addEventListener('change', function () { markPlan(goi.value); });
markPlan(goi.value);
/* form đặt lịch: chặn khi chưa tick đồng ý, gửi xong hiện thông báo minh hoạ */
var form = $('#bookForm'), agree = $('#dongy');
agree.addEventListener('change', function () { if (agree.checked) form.classList.remove('bad'); });
form.addEventListener('submit', function (e) {
  e.preventDefault();
  if (!form.ten.value.trim() || !form.sdt.value.trim()) { form.reportValidity(); return; }
  if (!agree.checked) { form.classList.add('bad'); agree.focus(); return; }
  form.classList.remove('bad');
  var opt = goi.options[goi.selectedIndex].text;
  $('#doneName').textContent = form.ten.value.trim();
  $('#doneMsg').textContent = 'Gói ' + opt + (form.ngay.value ? ', ngày ' + form.ngay.value : '') +
    '. Khuê sẽ nhắn Zalo cho bạn trong ngày để chốt giờ và lộ trình. (Thông báo minh hoạ: form mẫu không gửi dữ liệu đi đâu.)';
  form.hidden = true; $('#done').classList.add('show');
});

/* ---------- xem chi tiết (chung cho 2 chế độ) ---------- */
var view = $('#view'), vTxt = $('#vTxt'), vImg = $('#vImg');
var cur = -1, mode = null; /* mode: 'gl' | 'fb' */
function viewOpen() { return view.classList.contains('open'); }
function fillText(i) {
  var it = items[i];
  $('#vK').textContent = pad(i + 1) + ' · ' + it.p;
  $('#vT').textContent = it.t;
  $('#vE').textContent = it.dt + ' · ' + it.c + ' · ' + it.l;
  $('#vD').textContent = it.desc;
  $('#vC').textContent = pad(i + 1) + ' / ' + pad(N);
}
var api = { open: null, go: null, close: null };
function openView(i) { if (api.open) api.open(i); }
function closeView() { if (api.close) api.close(); }
function stepView(s) { if (api.go) api.go((cur + s + N) % N); }
$('#vPrev').addEventListener('click', function () { stepView(-1); });
$('#vNext').addEventListener('click', function () { stepView(1); });
$('#vClose').addEventListener('click', closeView);
var vRect = { top: 0, l: 0, r: 0, t: 0, b: 0 }, openedAt = 0;
$('.v-hit').addEventListener('click', function (e) {
  /* bấm vào chính ảnh đang mở (3D) thì không đóng; bấm ra ngoài thì đóng */
  if (mode === 'gl' && (performance.now() - openedAt < 450 || (e.clientX > vRect.l && e.clientX < vRect.r && e.clientY > vRect.t && e.clientY < vRect.b))) return;
  closeView();
});

/* phím */
d.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    if (card.classList.contains('open')) { cardOpen(false); cBtn.focus(); return; }
    if (openSheet) { sheetClose(); return; }
    if (viewOpen()) { closeView(); return; }
  }
  if (viewOpen() && !openSheet) {
    if (e.key === 'ArrowRight') { e.preventDefault(); stepView(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); stepView(-1); }
  }
  /* giữ Tab trong lớp phủ đang mở */
  if (e.key === 'Tab' && (openSheet || viewOpen())) {
    var box = openSheet || view;
    var f = $$('button:not([tabindex="-1"]),a[href],input,select,textarea,summary', box).filter(function (x) { return x.offsetParent !== null || getComputedStyle(x).position === 'fixed'; });
    if (!f.length) return;
    var a = f[0], z = f[f.length - 1];
    if (e.shiftKey && d.activeElement === a) { e.preventDefault(); z.focus(); }
    else if (!e.shiftKey && d.activeElement === z) { e.preventDefault(); a.focus(); }
  }
});

/* ======================================================================
   BẢN TĨNH: vòng xoắn CSS (không chuyển động) + lưới ảnh + xem chi tiết DOM
   ====================================================================== */
var fbReady = false;
function initFallback() {
  if (fbReady) return; fbReady = true; mode = 'fb';
  H.classList.remove('gl'); H.classList.add('ready');
  /* vòng xoắn tĩnh */
  /* 17 ảnh đầu, ảnh 01 ở chính giữa phía trước; ảnh sau nằm bên phải, thấp dần (giống bản 3D) */
  var hx = $('#helix'), MID = 8;
  var nodes = items.slice(N - MID).concat(items.slice(0, MID + 1)).map(function (it, n) {
    var b = d.createElement('button');
    b.type = 'button'; b.tabIndex = -1;
    b.innerHTML = '<img alt="" src="' + src(it, 'lo') + '" decoding="async"><span class="fade"></span>';
    b.addEventListener('click', function () { openView(it.i); });
    hx.appendChild(b); return { b: b, it: it, rel: n - MID };
  });
  /* xếp lại để ảnh gần màn hình nằm sau cùng trong DOM (vẽ đè lên ảnh xa) */
  nodes.slice().sort(function (p, q) { return Math.cos(p.rel * Math.PI * 2 / 9) - Math.cos(q.rel * Math.PI * 2 / 9); })
    .forEach(function (o) { hx.appendChild(o.b); });
  function layoutPoster() {
    var box = hx.parentNode.getBoundingClientRect(), W = box.width, Hh = box.height;
    var s = Math.max(.68, Math.min(1.05, W / 640)), r = 330 * s, step = Math.PI * 2 / 9, rise = 62 * s;
    nodes.forEach(function (o) {
      var a = o.rel * step, l = o.it.o === 'l', w = (l ? 228 : 152) * s, h = (l ? 152 : 190) * s;
      var y = o.rel * rise, c = Math.cos(a);
      var edge = Math.max(0, Math.abs(y) / (Hh / 2) - .55) * 1.5;
      o.b.style.width = w.toFixed(1) + 'px'; o.b.style.height = h.toFixed(1) + 'px';
      o.b.style.transform = 'translate(-50%,-50%) translateY(' + y.toFixed(1) + 'px) rotateY(' + a.toFixed(3) + 'rad) translateZ(' + r.toFixed(1) + 'px)';
      o.b.lastChild.style.opacity = Math.max(0, Math.min(.92, (1 - c) * .5 * .95 + edge)).toFixed(2);
      o.b.style.pointerEvents = c > .3 ? 'auto' : 'none';
    });
  }
  layoutPoster();
  var w0 = innerWidth;
  addEventListener('resize', function () { if (innerWidth !== w0) { w0 = innerWidth; layoutPoster(); } });
  /* lưới */
  items.forEach(function (it) { it.li.querySelector('button').addEventListener('click', function () { openView(it.i); }); });
  /* xem chi tiết */
  api.open = function (i) {
    lastFocus = d.activeElement; cur = i; show(i);
    view.classList.add('open', 'txt'); view.setAttribute('aria-hidden', 'false'); view.scrollTop = 0; lock();
    setTimeout(function () { $('#vClose').focus({ preventScroll: true }); }, 30);
  };
  api.go = function (i) { cur = i; show(i); view.scrollTop = 0; };
  api.close = function () {
    view.classList.remove('open', 'txt'); view.setAttribute('aria-hidden', 'true'); lock();
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  };
  function show(i) {
    var it = items[i]; fillText(i);
    vImg.removeAttribute('src');
    vImg.width = it.o === 'l' ? 1600 : 1280; vImg.height = 1600 * (it.o === 'l' ? .667 : 1) | 0;
    vImg.src = src(it, 'xl'); vImg.alt = it.alt;
  }
  /* nút báo giá trên điện thoại: hiện khi cuộn qua 85% màn đầu */
  var onS = function () { var b = badge(); if (b) b.classList.toggle('show', (window.pageYOffset || 0) > innerHeight * .85); };
  addEventListener('scroll', onS, { passive: true }); onS();
}

/* ======================================================================
   BẢN 3D
   ====================================================================== */
if (!H.classList.contains('gl')) { initFallback(); return; }
var giveUp = setTimeout(function () { if (mode !== 'gl') initFallback(); }, 9000);
import(THREE_URL).then(function (T) {
  if (fbReady) return;
  clearTimeout(giveUp);
  try { startGL(T); }
  catch (err) { if (window.console) console.warn('Vòng xoắn 3D: ' + err.message); initFallback(); }
}, function () { clearTimeout(giveUp); initFallback(); });

function startGL(T) {
  mode = 'gl';
  var stage = $('#stage');
  var W = innerWidth, Hh = innerHeight, mobile = W < 768;
  var renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance', preserveDrawingBuffer: HEADLESS });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2));
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(W, Hh);
  stage.appendChild(renderer.domElement);
  var maxAniso = Math.min(4, renderer.capabilities.getMaxAnisotropy ? renderer.capabilities.getMaxAnisotropy() : 1);

  var scene = new T.Scene();
  var cam = new T.PerspectiveCamera(34, W / Hh, .1, 120);
  var tilt = new T.Group(); scene.add(tilt);

  /* màu nền / tông ảnh theo giao diện (giá trị sRGB thô, shader không đổi không gian màu) */
  var U = { bg: new T.Vector3(), ph: new T.Vector3(), tone: new T.Vector3() };
  function hex3(h, v) { h = h.trim().replace('#', ''); v.set(parseInt(h.substr(0, 2), 16) / 255, parseInt(h.substr(2, 2), 16) / 255, parseInt(h.substr(4, 2), 16) / 255); return v; }
  function readTheme() {
    var cs = getComputedStyle(H), light = H.getAttribute('data-theme') === 'light';
    hex3(cs.getPropertyValue('--bg') || (light ? '#f2ece0' : '#17140f'), U.bg);
    U.ph.copy(U.bg).addScalar(light ? -.06 : .05);
    if (light) U.tone.set(.97, .94, .89); else U.tone.set(.96, .93, .88);
  }
  readTheme(); onTheme.push(readTheme);

  var VS = [
    'uniform float uW;uniform float uBend;',
    'varying vec2 vUv;varying float vDepth;varying float vNy;varying float vNx;',
    'void main(){vUv=uv;vec3 p=position;float x=p.x*uW;p.z-=x*x*uBend;',
    'vec4 mv=modelViewMatrix*vec4(p,1.0);vDepth=-mv.z;gl_Position=projectionMatrix*mv;vNy=gl_Position.y/gl_Position.w;vNx=gl_Position.x/gl_Position.w;}'
  ].join('\n');
  var FS = [
    'uniform sampler2D map;uniform float uReady,uHover,uDim,uShow,uFocus,uNear,uFar;',
    'uniform vec3 uBg,uPh,uTone;uniform vec2 uBlur;uniform vec4 uSide;uniform vec2 uSideK;uniform vec3 uTopF;',
    'varying vec2 vUv;varying float vDepth;varying float vNy;varying float vNx;',
    'vec3 tx(vec2 u){return texture2D(map,clamp(u,0.001,0.999)).rgb;}',
    'void main(){vec2 uv=vUv;if(!gl_FrontFacing)uv.x=1.0-uv.x;',
    'vec3 c;if(length(uBlur)>0.0004){c=vec3(0.0);for(int k=-4;k<=4;k++){c+=tx(uv+uBlur*float(k)/4.0);}c/=9.0;}else{c=tx(uv);}',
    'float l=dot(c,vec3(0.299,0.587,0.114));l=smoothstep(0.02,0.98,l);',
    'l=mix(l,min(1.0,l*1.1+0.035),uHover);',
    'vec3 col=mix(uPh,vec3(l)*uTone,uReady);',
    'float fog=smoothstep(uNear,uFar,vDepth)*0.92;float edge=smoothstep(0.55,1.08,abs(vNy));',
    'float side=max(smoothstep(uSide.x,uSide.y,-vNx)*uSideK.x,smoothstep(uSide.z,uSide.w,vNx)*uSideK.y);side=max(side,smoothstep(uTopF.x,uTopF.y,vNy)*uTopF.z);',
    'float f=max(max(fog,edge),side);if(!gl_FrontFacing)f=max(f,0.6);f=mix(f,0.0,uFocus);f=max(f,uDim);f=max(f,1.0-uShow);',
    'gl_FragColor=vec4(mix(col,uBg,clamp(f,0.0,1.0)),1.0);}'
  ].join('\n');

  var SIDE = new T.Vector4(.5, .95, .55, .92), SIDEK = new T.Vector2(0, 0), TOPF = new T.Vector3(2, 3, 0);
  var geo = new T.PlaneGeometry(1, 1, 24, 1);
  var loader = new T.TextureLoader(); loader.setCrossOrigin('anonymous');
  var meshes = items.map(function (it) {
    var l = it.o === 'l';
    var m = new T.ShaderMaterial({
      vertexShader: VS, fragmentShader: FS, side: T.DoubleSide,
      uniforms: { map: { value: null }, uW: { value: 1 }, uBend: { value: 0 }, uReady: { value: 0 }, uHover: { value: 0 }, uDim: { value: 0 },
        uShow: { value: 0 }, uFocus: { value: 0 }, uNear: { value: 10 }, uFar: { value: 20 }, uBg: { value: U.bg }, uPh: { value: U.ph },
        uTone: { value: U.tone }, uBlur: { value: new T.Vector2() }, uSide: { value: SIDE }, uSideK: { value: SIDEK }, uTopF: { value: TOPF } }
    });
    var mesh = new T.Mesh(geo, m);
    mesh.userData = { it: it, w: l ? 2.85 : 1.9, h: l ? 1.9 : 2.375, hov: 0, f: 0, ft: 0, ready: 0, hi: false };
    tilt.add(mesh);
    return mesh;
  });
  /* thứ tự tải: gần ảnh 01 (đang ở giữa mặt trước) trước; mỗi ảnh hiện dần khi texture của nó về */
  var queue = meshes.slice().sort(function (a, b) {
    function dd(m) { var r = m.userData.it.i; return Math.min(r, N - r); }
    return dd(a) - dd(b);
  }), inflight = 0, front = 0, FRONT = 8;
  function pump() {
    while (inflight < (front < FRONT ? FRONT : 6) && queue.length) {
      (function (mesh) {
        inflight++;
        var done = function () { inflight--; if (mesh.userData.front && ++front === FRONT) H.classList.add('tex'); pump(); };
        loader.load(src(mesh.userData.it, 'tex'), function (tex) {
          prep(tex); var old = mesh.material.uniforms.map.value;
          if (!mesh.userData.hi || old === blank) mesh.material.uniforms.map.value = tex; else tex.dispose();
          mesh.userData.loaded = true; done();
        }, undefined, function () { mesh.userData.loaded = true; done(); });
      })(queue.shift());
    }
  }
  queue.slice(0, FRONT).forEach(function (m) { m.userData.front = true; });
  /* chưa có ảnh thì dùng ô 1px màu nền để shader không lỗi */
  var blank = new T.DataTexture(new Uint8Array([40, 36, 30, 255]), 1, 1); blank.needsUpdate = true;
  meshes.forEach(function (m) { m.material.uniforms.map.value = blank; });
  function prep(tex) { tex.anisotropy = maxAniso; tex.minFilter = T.LinearMipmapLinearFilter; tex.generateMipmaps = true; tex.needsUpdate = true; }
  function loadHi(mesh) {
    if (mesh.userData.hi) return; mesh.userData.hi = true;
    loader.load(src(mesh.userData.it, 'hi'), function (tex) {
      prep(tex); var old = mesh.material.uniforms.map.value;
      mesh.material.uniforms.map.value = tex; mesh.userData.loaded = true; if (old && old !== blank) old.dispose();
    });
  }

  /* ---------- bố cục theo khổ màn hình ---------- */
  var L = {};
  function layout() {
    W = innerWidth; Hh = innerHeight; mobile = W < 768;
    var asp = W / Hh;
    renderer.setSize(W, Hh);
    cam.aspect = asp;
    if (asp < .85) { L.R = 3.4; L.s = .92; L.camZ = 15.5; cam.fov = 38; L.tx = 0; L.ty = mobile ? -.1 : -.6; }
    else if (asp < 1.25) { L.R = 4.2; L.s = .92; L.camZ = 15.5; cam.fov = 35; L.tx = .6; L.ty = -.2; }
    else if (asp <= 1.5) { L.R = 4.3; L.s = .9; L.camZ = 16.5; cam.fov = 34; L.tx = 2; L.ty = 0; }
    else { L.R = 5; L.s = 1; L.camZ = 15; cam.fov = 34; L.tx = 1.9; L.ty = 0; }
    L.step = Math.PI * 2 / 9; L.rise = .66 * L.s + .08;
    /* làm nhạt ảnh ở vùng có chữ (lời mở đầu bên trái, bảng thông tin bên phải) */
    var topLede = mobile || (W < 1100 && asp < 1.1); /* lời mở đầu nằm trên cùng (điện thoại, máy tính bảng dọc) */
    TOPF.set(2, 3, 0);
    if (topLede) { SIDEK.set(0, 0); TOPF.set(mobile ? .42 : .5, mobile ? .74 : .8, .85); }
    else if (W > 1100) { SIDE.set(.42, .9, .5, .9); SIDEK.set(.62, .88); }
    else { SIDE.set(.22, .7, .55, .95); SIDEK.set(.86, .6); }
    cam.position.set(0, 0, L.camZ); cam.lookAt(0, 0, 0); cam.updateProjectionMatrix();
    tilt.position.set(L.tx, L.ty, 0);
    meshes.forEach(function (m) {
      var u = m.material.uniforms; u.uNear.value = L.camZ - L.R * .1; u.uFar.value = L.camZ + L.R * .95;
    });
  }
  layout();
  var w0 = W, h0 = Hh;
  addEventListener('resize', function () {
    if (innerWidth === w0 && Math.abs(innerHeight - h0) < 140) return; /* iPhone bắn resize khi thanh địa chỉ co giãn */
    w0 = innerWidth; h0 = innerHeight; layout();
  });

  /* ---------- trạng thái chuyển động ---------- */
  var pos = 0, target = 0, vel = 0, lastInput = 0, dragging = false, pos0 = 0;
  var hovered = -1, active = -1, shown = -1, t0 = performance.now(), last = t0, introDone = false;
  var ray = new T.Raycaster(), ndc = new T.Vector2(), hasPtr = false;
  function now() { return performance.now(); }

  /* cuộn: đi dọc vòng xoắn */
  addEventListener('wheel', function (e) {
    if (openSheet || viewOpen() || card.contains(e.target)) return;
    var dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
    var dx = e.deltaMode === 1 ? e.deltaX * 16 : e.deltaX;
    var v = Math.abs(dx) > Math.abs(dy) ? dx : dy;
    target += Math.max(-140, Math.min(140, v)) / 240; vel = 0; lastInput = now();
  }, { passive: true });

  /* kéo / vuốt: xoay có quán tính, chạm nhanh để xem */
  var px = 0, py = 0, sx = 0, sy = 0, st = 0, moved = 0, vHist = [];
  var curEl = $('.cur'), curN = $('#curN');
  stage.addEventListener('pointerdown', function (e) {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    dragging = true; moved = 0; px = sx = e.clientX; py = sy = e.clientY; st = now(); vel = 0; vHist = [];
    try { stage.setPointerCapture(e.pointerId); } catch (er) {}
    curEl.classList.add('down'); lastInput = st;
  });
  stage.addEventListener('pointermove', function (e) {
    ndc.set(e.clientX / W * 2 - 1, -(e.clientY / Hh) * 2 + 1); hasPtr = e.pointerType === 'mouse';
    if (FINE && e.pointerType === 'mouse') { curEl.style.transform = 'translate3d(' + e.clientX + 'px,' + e.clientY + 'px,0)'; curEl.classList.add('on'); }
    if (!dragging) return;
    var dx = e.clientX - px, dy = e.clientY - py; px = e.clientX; py = e.clientY;
    moved += Math.abs(dx) + Math.abs(dy);
    var dv = Math.abs(dx) >= Math.abs(dy) ? -dx : -dy, per = mobile ? 90 : 170;
    target += dv / per; lastInput = now();
    vHist.push([lastInput, dv / per]); if (vHist.length > 6) vHist.shift();
  });
  function endDrag(e) {
    if (!dragging) return; dragging = false; curEl.classList.remove('down');
    var t = now();
    if (moved < 9 && t - st < 450) { /* chạm/bấm */
      ndc.set(e.clientX / W * 2 - 1, -(e.clientY / Hh) * 2 + 1);
      var h = pickAt(); if (h >= 0) openGL(h);
      return;
    }
    /* vận tốc thả tay: quãng đã kéo trong 100ms cuối, đổi ra mỗi khung hình (16,7ms) */
    var sum = 0, t1 = t; vHist.forEach(function (v) { if (t - v[0] < 100) { sum += v[1]; t1 = Math.min(t1, v[0]); } });
    var span = Math.max(32, t - t1 + 16);
    vel = sum / span * 16.7;
    vel = Math.max(-.32, Math.min(.32, vel));
  }
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', function () { dragging = false; curEl.classList.remove('down'); });
  stage.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') { curEl.classList.remove('on', 'big'); hasPtr = false; } });

  /* phím khi đang ở màn vòng xoắn */
  d.addEventListener('keydown', function (e) {
    if (openSheet || viewOpen() || card.classList.contains('open')) return;
    var t = e.target; if (t && /INPUT|TEXTAREA|SELECT/.test(t.tagName)) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); target = Math.round(target) + 1; vel = 0; lastInput = now(); }
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); target = Math.round(target) - 1; vel = 0; lastInput = now(); }
    else if ((e.key === 'Enter' || e.key === ' ') && d.activeElement === stage) { e.preventDefault(); openGL(idx(Math.round(pos))); }
  });

  function idx(k) { return ((k % N) + N) % N; }
  function relOf(i) { var r = i - pos; r = ((r + N / 2) % N + N) % N - N / 2; return r; }
  function pickAt() {
    ray.setFromCamera(ndc, cam);
    var cand = meshes.filter(function (m) { return Math.abs(relOf(m.userData.it.i)) < 6 && m.userData.f < .01; });
    var hit = ray.intersectObjects(cand, false);
    for (var k = 0; k < hit.length; k++) { var r = relOf(hit[k].object.userData.it.i); if (Math.cos(r * L.step) > .05) return hit[k].object.userData.it.i; }
    return -1;
  }

  /* ---------- bảng thông tin ---------- */
  var meta = $('#meta'), mcap = $('#mcap'), swapT;
  function showMeta(i) {
    if (i === shown) return; shown = i;
    var it = items[i];
    meta.classList.add('swap'); clearTimeout(swapT);
    swapT = setTimeout(function () {
      $('#mN').innerHTML = pad(i + 1) + '<small>/' + N + '</small>';
      $('#mT').textContent = it.t; $('#mP').textContent = it.p; $('#mD').textContent = it.dt; $('#mC').textContent = it.c; $('#mL').textContent = it.l;
      meta.classList.remove('swap');
    }, 160);
    mcap.innerHTML = '<b></b>'; mcap.firstChild.textContent = pad(i + 1) + ' · ' + it.t; mcap.appendChild(d.createTextNode(it.p));
    $('#pN').textContent = pad(i + 1);
    var bar = $('#pBar'); bar.style.width = (100 / N) + '%'; bar.style.left = (i / (N - 1) * (100 - 100 / N)) + '%';
  }

  /* ---------- mở ảnh: bay lên phía trước ---------- */
  var vq = new T.Quaternion(), tq = new T.Quaternion(), hq = new T.Quaternion(), ey = new T.Euler(), tmp = new T.Vector3(), vpos = new T.Vector3();
  function viewPose(m) {
    var a = m.userData.w / m.userData.h;
    var top = mobile ? 66 : 70, txt = mobile ? 270 : 200, side = mobile ? 32 : 200;
    var maxH = Math.max(160, Hh - top - txt - (mobile ? 60 : 40)), maxW = Math.min(W - side, 1100);
    var hp = Math.min(maxH, maxW / a), wp = hp * a;
    var D = 6, k = 2 * D * Math.tan(cam.fov * Math.PI / 360) / Hh;
    vpos.set(0, -((top + hp / 2) - Hh / 2) * k, -D).applyMatrix4(cam.matrixWorld);
    tilt.updateMatrixWorld(); tilt.worldToLocal(vpos);
    tilt.getWorldQuaternion(tq); vq.copy(tq).invert().multiply(cam.quaternion);
    vRect.top = top + hp + (mobile ? 14 : 20); vRect.l = (W - wp) / 2; vRect.r = (W + wp) / 2; vRect.t = top; vRect.b = top + hp;
    return { w: wp * k, h: hp * k };
  }
  var txtT;
  function openGL(i) {
    if (i < 0) return;
    if (!viewOpen()) { lastFocus = d.activeElement; openedAt = performance.now(); }
    var prev = cur; cur = i;
    meshes.forEach(function (m) { if (m.userData.it.i !== i) m.userData.ft = 0; });
    var m = meshes[i]; m.userData.ft = 1; m.userData.dir = prev >= 0 && viewOpen() ? (i === idx(prev + 1) ? 1 : -1) : 0;
    loadHi(m);
    target = pos + relOf(i); vel = 0; /* vòng xoắn đi theo phía sau */
    view.classList.remove('txt'); fillText(i);
    view.classList.add('open'); view.setAttribute('aria-hidden', 'false'); lock();
    curEl.classList.remove('big', 'on');
    clearTimeout(txtT); txtT = setTimeout(function () { vTxt.style.top = vRect.top + 'px'; view.classList.add('txt'); }, viewOpen() && prev >= 0 ? 420 : 620);
    setTimeout(function () { if (viewOpen()) $('#vClose').focus({ preventScroll: true }); }, 40);
  }
  api.open = openGL; api.go = openGL;
  api.close = function () {
    clearTimeout(txtT);
    meshes.forEach(function (m) { m.userData.ft = 0; });
    view.classList.remove('txt', 'open'); view.setAttribute('aria-hidden', 'true'); lock();
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true }); else stage.focus({ preventScroll: true });
    lastInput = now();
  };

  /* ---------- vòng vẽ ---------- */
  var raf = 0, running = false;
  function ease(x) { return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
  function frame(t) {
    raf = requestAnimationFrame(frame);
    var dt = Math.min(.05, (t - last) / 1000); last = t;
    var el = (t - t0) / 1000;

    /* vị trí dọc vòng xoắn */
    var open = viewOpen();
    if (!dragging && !open) {
      if (Math.abs(vel) > .0008) { target += vel; vel *= Math.pow(.9, dt * 60); }
      else {
        vel = 0;
        var idle = t - lastInput;
        if (introDone && idle > 6000 && !openSheet && hovered < 0) target += dt * .16; /* trôi chậm khi không ai chạm */
        else if (idle > 160) target += (Math.round(target) - target) * Math.min(1, dt * 5);
      }
    }
    pos += (target - pos) * Math.min(1, dt * (open ? 4 : 6.5));

    /* rê chuột */
    var h = -1;
    if (hasPtr && !dragging && !open && introDone && !openSheet) h = pickAt();
    if (h !== hovered) {
      hovered = h; curEl.classList.toggle('big', h >= 0);
      if (h >= 0) curN.textContent = pad(h + 1) + ' / ' + N;
    }
    var a = idx(Math.round(pos));
    if (a !== active) active = a;
    showMeta(hovered >= 0 ? hovered : (open ? cur : active));

    /* nút báo giá trên điện thoại: hiện khi đã đi dọc vòng xoắn một đoạn */
    if (Math.abs(pos - pos0) > 2.5) { var bg = badge(); if (bg && !bg.classList.contains('show')) bg.classList.add('show'); }

    tilt.rotation.set(.1 + Math.sin(el * .21) * .015, 0, -.17 + Math.sin(el * .27) * .02);
    tilt.updateMatrixWorld();
    var anyF = 0;
    meshes.forEach(function (m) { anyF = Math.max(anyF, m.userData.f); });

    meshes.forEach(function (m) {
      var u = m.userData, U2 = m.material.uniforms, i = u.it.i;
      var rel = relOf(i), ang = rel * L.step;
      /* lúc tải: dâng lên theo thứ tự */
      var sp = Math.max(0, Math.min(1, (el - .1 - (Math.max(-6, Math.min(6, rel)) + 6) * .035) / 1.05)); sp = 1 - Math.pow(1 - sp, 3);
      u.hov += ((hovered === i ? 1 : 0) - u.hov) * Math.min(1, dt * 9);
      var r = L.R + u.hov * .7;
      var hx = r * Math.sin(ang), hy = -rel * L.rise - (1 - sp) * 7, hz = r * Math.cos(ang);
      var sc = L.s * (1 + u.hov * .05);
      /* bay lên trước / về chỗ */
      var spd = u.ft > u.f ? 1.25 : 1.6;
      u.f += Math.max(-dt * spd, Math.min(dt * spd, u.ft - u.f));
      if (u.f > .0001) {
        var pz = viewPose(m);
        var e = ease(u.f);
        ey.set(0, ang, 0); hq.setFromEuler(ey);
        m.position.set(hx + (vpos.x - hx) * e, hy + (vpos.y - hy) * e, hz + (vpos.z - hz) * e + Math.sin(Math.PI * e) * 1.2);
        m.quaternion.copy(hq).slerp(vq, e);
        m.scale.set(u.w * sc + (pz.w - u.w * sc) * e, u.h * sc + (pz.h - u.h * sc) * e, 1);
        var moving = Math.abs(u.ft - u.f) > .002;
        U2.uBlur.value.set(0, moving ? Math.sin(Math.PI * u.f) * .022 : 0);
        U2.uFocus.value = e; U2.uDim.value = 0;
        m.renderOrder = 10; m.material.depthTest = false;
        U2.uBend.value = (1 - e) * 1 / (2 * L.R);
      } else {
        m.position.set(hx, hy, hz); m.rotation.set(0, ang, 0);
        m.scale.set(u.w * sc, u.h * sc, 1);
        U2.uBlur.value.set(0, 0); U2.uFocus.value = 0; m.renderOrder = 0; m.material.depthTest = true;
        U2.uDim.value = ease(anyF) * .86;
        U2.uBend.value = 1 / (2 * L.R);
      }
      U2.uW.value = m.scale.x;
      U2.uHover.value = u.hov; U2.uShow.value = sp;
      if (u.loaded && u.ready < 1) u.ready = Math.min(1, u.ready + dt * 2.2);
      U2.uReady.value = u.ready;
    });
    if (!introDone && el > 1.8) { introDone = true; lastInput = t; }
    renderer.render(scene, cam);
    if (!H.classList.contains('ready')) H.classList.add('ready');
  }
  function play() { if (running) return; running = true; last = performance.now(); raf = requestAnimationFrame(frame); }
  function stop() { running = false; cancelAnimationFrame(raf); }
  d.addEventListener('visibilitychange', function () { if (d.hidden) stop(); else play(); });
  pump();
  last = performance.now(); frame(last); cancelAnimationFrame(raf); running = false; /* khung đầu vẽ ngay */
  play();
  setTimeout(function () { H.classList.add('tex'); }, 8000); /* mạng quá chậm: vẫn ẩn nhãn sau 8 giây */
  stage.addEventListener('focus', function () { lastInput = now(); });
}
})();
