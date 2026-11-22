/* Vọng Hà Residences — SA BÀN 3D tương tác (three.js r128, dựng hoàn toàn bằng code).
   - Bàn sa bàn đen bóng viền đồng, chữ khắc tên dự án; bán đảo, sông bao ba mặt, cầu dây văng, đường nội khu,
     công viên, bến thuyền, khối đế thương mại, 3 toà tháp có tầng lùi + vát góc, hồ bơi tầng thượng.
   - Kéo để xoay, cuộn (khi đang tương tác) / chụm để zoom có giới hạn; rê/chạm toà: viền vàng + nhãn; bấm: camera bay tới.
   - Ngày/Đêm, Tham quan tự động (1 vòng), điểm tiện ích bấm được.
   - Hiệu năng: vẽ theo yêu cầu (chỉ khi có thay đổi), dừng khi khuất/tab ẩn, pixelRatio ≤ 2 (điện thoại 1,5),
     bóng đổ chất lượng thấp trên điện thoại; không có WebGL hoặc giảm chuyển động: ảnh tĩnh. */
(function () {
'use strict';
var d = document, sec = d.getElementById('saban');
if (!sec) return;
var HEADLESS = /HeadlessChrome/.test(navigator.userAgent);
var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
var THREE_URL = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
var stage = sec.querySelector('.sb-stage'), host = sec.querySelector('.sb-cv');
sec.classList.add('sb-js');
var intro = d.getElementById('vhIntro');
var COARSE = window.matchMedia && matchMedia('(pointer: coarse)').matches;

/* ---------- màn mở đầu ---------- */
var introDone = !intro;
function closeIntro() {
  if (introDone) return; introDone = true;
  if (!intro) return;
  intro.classList.add('out');
  setTimeout(function () { if (intro.parentNode) intro.remove(); }, 1100);
}
if (intro) {
  if (HEADLESS || RM) { intro.remove(); introDone = true; }
  else {
    var sk = intro.querySelector('.intro-skip'); if (sk) sk.addEventListener('click', closeIntro);
    setTimeout(closeIntro, 3200);
  }
}
function introPct(p) {
  if (!intro || introDone) return;
  var b = intro.querySelector('.intro-bar i'), t = intro.querySelector('.intro-p');
  if (b) b.style.transform = 'scaleX(' + p.toFixed(3) + ')';
  if (t) t.textContent = Math.round(p * 100);
}

function hasGL() {
  try { var c = d.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl'))); }
  catch (e) { return false; }
}
function still() { sec.classList.add('sb-static'); closeIntro(); }
if (!hasGL()) { still(); return; }
if (RM) {
  still(); sec.classList.add('sb-rm');
  var ob = sec.querySelector('.sb-open');
  if (ob) ob.addEventListener('click', function () { sec.classList.remove('sb-static', 'sb-rm'); boot(); });
  return;
}
boot();

function boot() {
  introPct(.15);
  if (window.THREE) return start();
  var s = d.createElement('script'); s.src = THREE_URL; s.async = true; s.crossOrigin = 'anonymous';
  s.onload = function () { introPct(.55); try { start(); } catch (e) { still(); if (window.console) console.warn('Sa bàn: ' + e.message); } };
  s.onerror = still;
  d.head.appendChild(s);
}

function start() {
var T = window.THREE;
var mobile = window.innerWidth < 768;
var DPR = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);

/* ---------- dữ liệu mẫu ---------- */
var TOWERS = [
  { code: 'T1', name: 'Tháp Vọng', fl: 46, types: '1PN+ · 2PN · Duplex · Penthouse', price: 'từ 7,4 tỷ', x: -6.5, z: -7, w: 6.2, dp: 5.2, rot: .12, href: 'can-ho/' },
  { code: 'T2', name: 'Tháp Hà', fl: 40, types: '2PN · 3PN · Duplex', price: 'từ 11,2 tỷ', x: 5.2, z: -9.5, w: 5.6, dp: 5, rot: -.2, href: 'can-ho/?loai=2pn' },
  { code: 'T3', name: 'Tháp Lam', fl: 32, types: '1PN+ · 2PN', price: 'từ 6,9 tỷ', x: 6.4, z: 1.2, w: 5, dp: 4.6, rot: .35, href: 'can-ho/?loai=1pn' }
];
var FH = 0.4; // cao 1 tầng (đơn vị cảnh)
var PINS = [
  { k: 'pool', t: 'Hồ bơi vô cực tầng thượng', s: 'Dài 38 m trên mái Tháp Vọng, mở 06:00–22:00 (mẫu)', href: 'tien-ich/', p: [-6.5, 46 * FH + .9, -7] },
  { k: 'park', t: 'Công viên ven sông', s: 'Đường dạo bộ 1,2 km quanh mũi bán đảo (mẫu)', href: 'tien-ich/', p: [-4, 1.4, 5] },
  { k: 'marina', t: 'Bến thuyền cư dân', s: 'Bến nhỏ cho thuyền kayak và thuyền dạo sông (minh hoạ)', href: 'tien-ich/', p: [1, .9, 11.6] },
  { k: 'mall', t: 'Khối đế thương mại', s: 'Cà phê, nhà hàng, cửa hàng tiện lợi ở tầng 1–3 (mẫu)', href: 'tien-ich/', p: [-.6, 2.2, -12.6] },
  { k: 'bridge', t: 'Cầu nối trung tâm', s: 'Qua một cây cầu, khoảng 8 phút tới trung tâm (mẫu)', href: 'vi-tri/', p: [19, 8.6, -2.5] }
];

/* ---------- renderer ---------- */
var renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance', preserveDrawingBuffer: HEADLESS });
renderer.setPixelRatio(DPR);
renderer.outputEncoding = T.sRGBEncoding;
renderer.toneMapping = T.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = mobile ? T.PCFShadowMap : T.PCFSoftShadowMap;
renderer.setClearColor(0x000000, 0);
var cv = renderer.domElement; cv.className = 'sb-canvas';
host.appendChild(cv);

var scene = new T.Scene();
scene.fog = new T.Fog(0x0d0b09, 300, 620);
var cam = new T.PerspectiveCamera(30, 1, 1, 600);

/* ---------- vật liệu ---------- */
function std(o) { return new T.MeshStandardMaterial(o); }
var M = {
  table: std({ color: 0x0b0a09, roughness: .22, metalness: .55 }),
  tableSide: std({ color: 0x090807, roughness: .5, metalness: .3 }),
  brass: std({ color: 0xc19a5b, roughness: .32, metalness: .85, emissive: 0x2a1a08, emissiveIntensity: .25 }),
  land: std({ color: 0xa99c86, roughness: .85, metalness: 0 }),
  bank: std({ color: 0x877d6d, roughness: .9 }),
  lawn: std({ color: 0x6b7454, roughness: .95 }),
  road: std({ color: 0x2c2925, roughness: .9 }),
  roof: std({ color: 0xd9d0c0, roughness: .7 }),
  ctx: std({ color: 0x8f877b, roughness: .85, emissive: 0x6a4a20, emissiveIntensity: 0 }),
  tree: std({ color: 0x55603f, roughness: .9 }),
  trunk: std({ color: 0x8a7a64, roughness: .9 }),
  pool: std({ color: 0x7fc4c9, roughness: .15, metalness: .1, emissive: 0x2fa8c0, emissiveIntensity: .05 }),
  boat: std({ color: 0xf2ede4, roughness: .5 }),
  water: std({ color: 0x31525a, roughness: .12, metalness: .35, transparent: true, opacity: .7 }),
  bed: new T.MeshBasicMaterial({ color: 0x07090a }),
  lamp: new T.MeshBasicMaterial({ color: 0x5a4a36 }),
  edge: new T.LineBasicMaterial({ color: 0xe6c27f, transparent: true, opacity: 0 }),
  cable: new T.LineBasicMaterial({ color: 0xd9cfbf, transparent: true, opacity: .55 })
};

/* ---------- texture mặt đứng (vẽ canvas): ngày + đèn đêm ---------- */
var BAYS = 20, FLS = 32;
function facadeTex(seed) {
  var cw = 256, ch = 512, bw = cw / BAYS, bh = ch / FLS;
  var a = d.createElement('canvas'); a.width = cw; a.height = ch;
  var g = a.getContext('2d');
  g.fillStyle = '#ddd4c4'; g.fillRect(0, 0, cw, ch);
  var e = d.createElement('canvas'); e.width = cw; e.height = ch;
  var h = e.getContext('2d'); h.fillStyle = '#000'; h.fillRect(0, 0, cw, ch);
  function r(i) { var x = Math.sin((i + seed * 97) * 12.9898) * 43758.5453; return x - Math.floor(x); }
  for (var y = 0; y < FLS; y++) for (var x = 0; x < BAYS; x++) {
    var px = x * bw + 1.5, py = y * bh + 3, pw = bw - 3, ph = bh - 6;
    var grd = g.createLinearGradient(0, py, 0, py + ph);
    grd.addColorStop(0, '#5d686e'); grd.addColorStop(1, '#343b3f');
    g.fillStyle = grd; g.fillRect(px, py, pw, ph);
    // đèn đêm theo từng căn (4 ô cửa một căn), độ sáng khác nhau
    var apt = Math.floor(x / 4), ka = r(y * 31 + apt * 7);
    if (ka > .38) {
      var br = .35 + r(apt * 11 + y * 3) * .55 + (r(x * 5 + y) - .5) * .15;
      var cool = r(y * 7 + apt * 3) < .12;
      h.fillStyle = cool ? 'rgba(200,220,255,' + (br * .6).toFixed(2) + ')' : 'rgba(255,' + (190 + Math.round(br * 30)) + ',' + (110 + Math.round(br * 40)) + ',' + br.toFixed(2) + ')';
    } else h.fillStyle = 'rgba(70,80,110,.18)';
    h.fillRect(px, py, pw, ph);
  }
  // dải sàn (spandrel) sáng
  g.fillStyle = 'rgba(255,255,255,.35)';
  for (var f = 0; f < FLS; f++) g.fillRect(0, f * bh, cw, 1);
  var tm = new T.CanvasTexture(a), te = new T.CanvasTexture(e);
  [tm, te].forEach(function (t) { t.wrapS = t.wrapT = T.RepeatWrapping; t.anisotropy = 4; });
  tm.encoding = T.sRGBEncoding; te.encoding = T.sRGBEncoding;
  return { map: tm, em: te };
}

/* ---------- tiện ích hình học ---------- */
function chamfer(w, dp, c) {
  var s = new T.Shape(), x = w / 2, y = dp / 2;
  s.moveTo(-x + c, -y); s.lineTo(x - c, -y); s.lineTo(x, -y + c); s.lineTo(x, y - c);
  s.lineTo(x - c, y); s.lineTo(-x + c, y); s.lineTo(-x, y - c); s.lineTo(-x, -y + c); s.closePath();
  return s;
}
function prism(shape, h, y0) {
  var g = new T.ExtrudeGeometry(shape, { depth: h, bevelEnabled: false, curveSegments: 24 });
  g.rotateX(-Math.PI / 2); g.translate(0, y0, 0);
  return g;
}
function shapeXZ(pts, smooth) {
  var s = new T.Shape();
  if (smooth) {
    s.moveTo(pts[0][0], -pts[0][1]);
    s.splineThru(pts.slice(1).map(function (p) { return new T.Vector2(p[0], -p[1]); }));
  } else {
    pts.forEach(function (p, i) { if (i) s.lineTo(p[0], -p[1]); else s.moveTo(p[0], -p[1]); });
  }
  s.closePath(); return s;
}
function mesh(g, m, cast, recv) { var o = new T.Mesh(g, m); o.castShadow = !!cast; o.receiveShadow = recv !== false; return o; }
function inPoly(x, z, P) {
  var c = false;
  for (var i = 0, j = P.length - 1; i < P.length; j = i++) {
    if (((P[i][1] > z) !== (P[j][1] > z)) && (x < (P[j][0] - P[i][0]) * (z - P[i][1]) / (P[j][1] - P[i][1]) + P[i][0])) c = !c;
  }
  return c;
}
function ribbon(curve, n, wdt, y, mat, closed) {
  var pts = curve.getSpacedPoints(n), pos = [], idx = [];
  for (var i = 0; i < pts.length; i++) {
    var a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    var tx = b.x - a.x, tz = b.z - a.z, l = Math.hypot(tx, tz) || 1, nx = -tz / l * wdt / 2, nz = tx / l * wdt / 2;
    pos.push(pts[i].x + nx, y, pts[i].z + nz, pts[i].x - nx, y, pts[i].z - nz);
    if (i < pts.length - 1) { var k = i * 2; idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); }
  }
  var g = new T.BufferGeometry();
  g.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
  var o = new T.Mesh(g, mat); o.receiveShadow = true; return o;
}
var world = new T.Group(); scene.add(world);
var reflect = new T.Group(); reflect.scale.y = -1; reflect.position.y = .24; scene.add(reflect); // phản chiếu dưới mặt nước

/* ---------- bàn sa bàn ---------- */
var PW = 56, PD = 36, TW = 68, TD = 48, TOP = 0;
(function table() {
  // khung mặt bàn (rỗng ở giữa để thấy phản chiếu dưới nước)
  var fr = [[0, (PD / 2 + TD / 2) / 2, TW, (TD - PD) / 2], [0, -(PD / 2 + TD / 2) / 2, TW, (TD - PD) / 2],
            [(PW / 2 + TW / 2) / 2, 0, (TW - PW) / 2, PD], [-(PW / 2 + TW / 2) / 2, 0, (TW - PW) / 2, PD]];
  fr.forEach(function (f) { var o = mesh(new T.BoxGeometry(f[2], 1.6, f[3]), M.table, false, true); o.position.set(f[0], TOP - .8, f[1]); world.add(o); });
  [[0, TD / 2 - .3, TW, .6], [0, -TD / 2 + .3, TW, .6], [TW / 2 - .3, 0, .6, TD], [-TW / 2 + .3, 0, .6, TD]].forEach(function (f) {
    var o = mesh(new T.BoxGeometry(f[2], 7, f[3]), M.tableSide, false, false); o.position.set(f[0], -1.6 - 3.5, f[1]); world.add(o);
  });
  var bed = new T.Mesh(new T.PlaneGeometry(PW, PD), M.bed); bed.rotation.x = -Math.PI / 2; bed.position.y = -24; world.add(bed);
  // nẹp đồng: mép bàn + khung quanh mô hình
  var bz = [[0, TD / 2, TW + .3, .3], [0, -TD / 2, TW + .3, .3], [TW / 2, 0, .3, TD + .3], [-TW / 2, 0, .3, TD + .3]];
  bz.forEach(function (f) { var o = mesh(new T.BoxGeometry(f[2], .5, f[3]), M.brass, false, false); o.position.set(f[0], TOP - .2, f[1]); world.add(o); });
  var iz = [[0, PD / 2 + .15, PW + .6, .3], [0, -PD / 2 - .15, PW + .6, .3], [PW / 2 + .15, 0, .3, PD], [-PW / 2 - .15, 0, .3, PD]];
  iz.forEach(function (f) { var o = mesh(new T.BoxGeometry(f[2], .9, f[3]), M.brass, false, true); o.position.set(f[0], TOP + .05, f[1]); world.add(o); });
})();

/* chữ khắc trên mặt bàn (canvas → texture đồng) */
function plaque() {
  var c = d.createElement('canvas'); c.width = 2048; c.height = 200;
  var g = c.getContext('2d');
  g.clearRect(0, 0, 2048, 200);
  g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = '400 92px "Noto Serif Display", "Playfair Display", Georgia, serif';
  if ('letterSpacing' in g) g.letterSpacing = '28px';
  g.fillText('VỌNG HÀ RESIDENCES', 1024, 86);
  g.font = '500 30px "Barlow Condensed", Inter, sans-serif';
  if ('letterSpacing' in g) g.letterSpacing = '12px';
  g.fillText('SA BÀN DỰ ÁN · TỈ LỆ 1:500 · MÔ HÌNH MINH HOẠ', 1024, 168);
  g.fillRect(140, 86, 260, 2); g.fillRect(1648, 86, 260, 2);
  var t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding; t.anisotropy = 8;
  var m = std({ color: 0xd2ac6c, metalness: .9, roughness: .3, emissive: 0x3b2810, emissiveIntensity: .6, map: t, transparent: true });
  var o = new T.Mesh(new T.PlaneGeometry(34, 3.32), m); o.rotation.x = -Math.PI / 2; o.position.set(0, TOP + .02, PD / 2 + 3.4); world.add(o);
  // la bàn khắc góc phải
  var cc = d.createElement('canvas'); cc.width = cc.height = 256; var k = cc.getContext('2d');
  k.strokeStyle = '#fff'; k.fillStyle = '#fff'; k.lineWidth = 3;
  k.beginPath(); k.arc(128, 128, 90, 0, Math.PI * 2); k.stroke();
  k.beginPath(); k.arc(128, 128, 70, 0, Math.PI * 2); k.lineWidth = 1.5; k.stroke();
  k.beginPath(); k.moveTo(128, 30); k.lineTo(146, 128); k.lineTo(128, 226); k.lineTo(110, 128); k.closePath(); k.fill();
  k.font = '600 34px "Barlow Condensed", Inter, sans-serif'; k.textAlign = 'center'; k.fillText('B', 128, 22);
  var tc = new T.CanvasTexture(cc); tc.encoding = T.sRGBEncoding;
  var mc = std({ color: 0xd2ac6c, metalness: .9, roughness: .3, emissive: 0x3b2810, emissiveIntensity: .6, map: tc, transparent: true });
  var oc = new T.Mesh(new T.PlaneGeometry(4.6, 4.6), mc); oc.rotation.x = -Math.PI / 2; oc.position.set(TW / 2 - 4, TOP + .02, PD / 2 + 3.3); world.add(oc);
}

/* ---------- đất, sông ---------- */
var PEN = [[-15, -18], [-15.5, -8], [-14, 1], [-10, 7.2], [-4, 10.2], [2, 10.6], [8, 8.6], [13, 3], [15.5, -6], [15, -18]];
var BANK = [[-28, -18], [-21, -18], [-20.6, -6], [-20, 4], [-16, 11.2], [-8, 14.6], [4, 15.1], [14, 13], [19.6, 7], [21, -4], [21, -18], [28, -18], [28, 18], [-28, 18]];
var LANDY = .55;
world.add(mesh(prism(shapeXZ(PEN, true), LANDY + 1.4, -1.4), M.land, false, true));
(function () {
  // bờ đối diện hình chữ U: dựng bằng điểm thẳng + spline phần mép sông
  var s = new T.Shape(), inner = BANK.slice(1, 12);
  s.moveTo(-28, 18); s.lineTo(-21, 18);
  s.splineThru(inner.map(function (p) { return new T.Vector2(p[0], -p[1]); }));
  s.lineTo(21, 18); s.lineTo(28, 18); s.lineTo(28, -18); s.lineTo(-28, -18); s.closePath();
  world.add(mesh(prism(s, LANDY + 1.4, -1.4), M.bank, false, true));
})();
var water = new T.Mesh(new T.PlaneGeometry(PW, PD), M.water); water.rotation.x = -Math.PI / 2; water.position.y = .12; water.renderOrder = 2; world.add(water);

/* bãi cỏ + công viên mũi bán đảo */
var lawnPts = [[-12, -2], [-11, 3.6], [-6.5, 7.6], [0, 8.6], [4.2, 6.2], [1, 2], [-4, -1.4], [-9, -3.4]];
world.add(mesh(prism(shapeXZ(lawnPts, true), .08, LANDY), M.lawn, false, true));
var lawn2 = [[-13.2, -16.5], [-13.2, -12], [-10.5, -11.5], [-10.4, -16.5]];
world.add(mesh(prism(shapeXZ(lawn2, false), .08, LANDY), M.lawn, false, true));

/* đường nội khu + đường ven sông + lối ra cầu */
var Y_ROAD = LANDY + .03;
var ringRd = new T.CatmullRomCurve3([[-12.5, -15], [-13, -4], [-9.5, 4.5], [-2, 8.4], [6, 7], [11.5, 1.6], [13.2, -6], [12.6, -15.5]].map(function (p) { return new T.Vector3(p[0], 0, p[1]); }), false, 'catmullrom', .5);
world.add(ribbon(ringRd, 140, 1.15, Y_ROAD, M.road));
var spine = new T.CatmullRomCurve3([[-1, -17.5], [-.5, -4], [1.4, 3], [6, 7]].map(function (p) { return new T.Vector3(p[0], 0, p[1]); }));
world.add(ribbon(spine, 60, .9, Y_ROAD + .005, M.road));
var toBridge = new T.CatmullRomCurve3([[13.2, -4], [14.8, -3.4], [15.6, -3]].map(function (p) { return new T.Vector3(p[0], 0, p[1]); }));
world.add(ribbon(toBridge, 10, 1.4, Y_ROAD + .006, M.road));
var embank = new T.CatmullRomCurve3(BANK.slice(1, 12).map(function (p) { var dx = p[0] < -10 ? -1.2 : p[0] > 10 ? 1.2 : 0, dz = Math.abs(p[0]) < 16 && p[1] > 8 ? 1.2 : 0; return new T.Vector3(p[0] + dx, 0, p[1] + dz); }));
world.add(ribbon(embank, 160, .9, Y_ROAD, M.road));

/* đèn đường: chấm sáng dọc các tuyến (ban ngày là cột đèn sẫm) */
var lampGeo = new T.SphereGeometry(.13, 6, 4), lampPts = [];
function lampsOn(curve, n, off) {
  curve.getSpacedPoints(n).forEach(function (p, i) {
    var a = curve.getTangent(Math.min(.999, i / n)); var nx = -a.z, nz = a.x;
    lampPts.push([p.x + nx * off, p.z + nz * off], [p.x - nx * off, p.z - nz * off]);
  });
}
lampsOn(ringRd, 46, .78); lampsOn(spine, 16, .62); lampsOn(embank, 60, .66);
var lamps = new T.InstancedMesh(lampGeo, M.lamp, lampPts.length), _m = new T.Matrix4();
lampPts.forEach(function (p, i) { _m.makeTranslation(p[0], Y_ROAD + .2, p[1]); lamps.setMatrixAt(i, _m); });
world.add(lamps);

/* cây xanh dạng khối (instanced) */
function rr(i) { var x = Math.sin(i * 78.233 + 1.7) * 43758.5453; return x - Math.floor(x); }
var treePts = [];
for (var i = 0; i < 900 && treePts.length < (mobile ? 120 : 170); i++) {
  var tx = -15 + rr(i) * 30, tz = -18 + rr(i + 500) * 29;
  if (!inPoly(tx, tz, PEN)) continue;
  // tránh toà nhà, khối đế, đường
  var bad = TOWERS.some(function (t) { return Math.abs(tx - t.x) < t.w * .72 && Math.abs(tz - t.z) < t.dp * .72; }) || (tx > -10 && tx < 9 && tz > -15 && tz < -5.5);
  var pl = ringRd.getSpacedPoints(60).some(function (p) { return Math.hypot(p.x - tx, p.z - tz) < 1.05; });
  var ps = spine.getSpacedPoints(30).some(function (p) { return Math.hypot(p.x - tx, p.z - tz) < .9; });
  if (bad || pl || ps) continue;
  treePts.push([tx, tz, .36 + rr(i + 900) * .4]);
}
// hàng cây trên bờ đối diện
embank.getSpacedPoints(70).forEach(function (p, k) { if (k % 2) treePts.push([p.x + (p.x < -10 ? -1.1 : p.x > 10 ? 1.1 : 0), p.z + (Math.abs(p.x) < 15 && p.z > 8 ? 1.1 : 0), .42]); });
var crown = new T.InstancedMesh(new T.IcosahedronGeometry(1, 0), M.tree, treePts.length);
var trunk = new T.InstancedMesh(new T.CylinderGeometry(.06, .08, 1, 5), M.trunk, treePts.length);
crown.castShadow = true; crown.receiveShadow = true;
var _q = new T.Quaternion(), _s = new T.Vector3(), _p = new T.Vector3(), _e = new T.Euler();
treePts.forEach(function (t, k) {
  _e.set(0, rr(k) * 6, 0); _q.setFromEuler(_e);
  _s.set(t[2], t[2] * 1.15, t[2]); _p.set(t[0], LANDY + .55 + t[2] * .8, t[1]); _m.compose(_p, _q, _s); crown.setMatrixAt(k, _m);
  _s.set(1, .7, 1); _p.set(t[0], LANDY + .35, t[1]); _m.compose(_p, _q, _s); trunk.setMatrixAt(k, _m);
});
world.add(crown); world.add(trunk);

/* nhà phố xung quanh (khối trắng thấp, làm nền cho 3 toà) */
var ctxPts = [];
for (var gx = -27; gx <= 27; gx += 2.3) for (var gz = -17; gz <= 17; gz += 2.3) {
  var jx = gx + (rr(gx * 13 + gz) - .5) * .6, jz = gz + (rr(gz * 7 + gx) - .5) * .6;
  if (inPoly(jx, jz, PEN)) continue;
  // phải nằm trên bờ: cách mép sông đủ xa
  var inner = BANK.slice(1, 12);
  var near = inner.some(function (p) { return Math.hypot(p[0] - jx, p[1] - jz) < 3.6; }) || embank.getSpacedPoints(80).some(function (p) { return Math.hypot(p.x - jx, p.z - jz) < 2.4; });
  var river = jx > -20.5 && jx < 20.5 && jz < 13.5;
  if (near || river) continue;
  if (rr(jx * 3 + jz) < .38) continue;
  var hh = .5 + Math.pow(rr(jx + jz * 5), 2.4) * (Math.abs(jx) > 24 || jz > 16 ? 3.2 : 1.8);
  ctxPts.push([jx, jz, 1.2 + rr(jz) * .8, 1.2 + rr(jx) * .8, hh]);
}
var ctx = new T.InstancedMesh(new T.BoxGeometry(1, 1, 1), M.ctx, ctxPts.length);
ctx.castShadow = true; ctx.receiveShadow = true;
ctxPts.forEach(function (c, k) {
  _e.set(0, (rr(k) - .5) * .3, 0); _q.setFromEuler(_e); _s.set(c[2], c[4], c[3]); _p.set(c[0], LANDY + c[4] / 2, c[1]);
  _m.compose(_p, _q, _s); ctx.setMatrixAt(k, _m);
});
world.add(ctx);

/* ---------- cầu dây văng ---------- */
var bridge = new T.Group(); world.add(bridge);
(function () {
  var x0 = 14.6, x1 = 23.4, z = -3, yd = 1.25, len = x1 - x0, cx = (x0 + x1) / 2;
  var deck = mesh(new T.BoxGeometry(len, .32, 1.6), M.roof, true, true); deck.position.set(cx, yd, z); bridge.add(deck);
  [-.75, .75].forEach(function (o) {
    var rail = mesh(new T.BoxGeometry(len, .12, .08), M.brass, false, false); rail.position.set(cx, yd + .2, z + o); bridge.add(rail);
  });
  var pyl = 18.6, top = 9.4;
  [-1.1, 1.1].forEach(function (o) {
    var leg = mesh(new T.BoxGeometry(.34, top, .34), M.roof, true, true);
    leg.position.set(pyl, top / 2 - .2, z + o * .55); leg.rotation.x = o * .06; bridge.add(leg);
  });
  var cap = mesh(new T.BoxGeometry(.5, .5, .9), M.brass, true, false); cap.position.set(pyl, top - .3, z); bridge.add(cap);
  var cp = [];
  for (var k = 1; k <= 6; k++) {
    var off = k * .68;
    [-1, 1].forEach(function (sg) {
      [-.7, .7].forEach(function (o) { cp.push(pyl, top - .4 - k * .12, z + o * .3, pyl + sg * off, yd + .18, z + o); });
    });
  }
  var cg = new T.BufferGeometry(); cg.setAttribute('position', new T.Float32BufferAttribute(cp, 3));
  bridge.add(new T.LineSegments(cg, M.cable));
  // chân cầu
  [16.4, 20.8].forEach(function (px) { var p = mesh(new T.BoxGeometry(.4, 1.3, 1.1), M.roof, true, true); p.position.set(px, .5, z); bridge.add(p); });
})();

/* ---------- bến thuyền ---------- */
(function () {
  var pier = mesh(new T.BoxGeometry(.5, .18, 3.2), M.roof, true, true); pier.position.set(1, .3, 12); world.add(pier);
  [[-.6, 11.2], [-.6, 12.4], [2.6, 11.4], [2.6, 12.6]].forEach(function (b, k) {
    var f = mesh(new T.BoxGeometry(1.8, .12, .3), M.roof, false, true); f.position.set(k < 2 ? .1 : 1.9, .28, b[1]); world.add(f);
  });
  [[-.5, 11.65, .2], [-.4, 12.85, -.1], [2.5, 11.85, .1], [2.7, 13.05, 0]].forEach(function (b) {
    var g = new T.Group();
    var hull = mesh(new T.BoxGeometry(1.5, .26, .46), M.boat, true, true); g.add(hull);
    var cab = mesh(new T.BoxGeometry(.6, .2, .32), M.boat, false, true); cab.position.set(-.1, .22, 0); g.add(cab);
    g.position.set(b[0], .3, b[1]); g.rotation.y = b[2]; world.add(g);
  });
})();

/* ---------- 3 toà tháp ---------- */
var towerObjs = [], pickables = [], night = 0;
var facades = [];
TOWERS.forEach(function (t, ti) {
  var grp = new T.Group(); grp.position.set(t.x, 0, t.z); grp.rotation.y = t.rot; world.add(grp);
  var ft = facadeTex(ti + 1);
  var fm = std({ color: 0xffffff, map: ft.map, roughness: .42, metalness: .12, emissive: 0xffffff, emissiveMap: ft.em, emissiveIntensity: 0 });
  ft.map.repeat.set(1 / (BAYS * .36), 1 / (FLS * FH)); ft.em.repeat.copy(ft.map.repeat);
  ft.map.offset.set(ti * .31, -ft.map.repeat.y); ft.em.offset.copy(ft.map.offset);
  facades.push(fm);
  var mats = [M.roof, fm];
  // tầng lùi: thân chính → tầng lùi → vương miện
  var n = t.fl, s1 = Math.round(n * .62), s2 = n - 4;
  var segs = [[0, s1, 0, .9], [s1, s2, .55, 1.15], [s2, n, 1.1, 1.4]];
  var y0 = LANDY;
  var edges = [];
  segs.forEach(function (sg, k) {
    var h = (sg[1] - sg[0]) * FH, sh = chamfer(t.w - sg[2] * 2, t.dp - sg[2] * 2, sg[3]);
    var g = prism(sh, h, y0 + sg[0] * FH);
    var m = mesh(g, mats, true, true); m.userData.t = ti; grp.add(m); pickables.push(m);
    var eg = new T.LineSegments(new T.EdgesGeometry(g, 25), M.edge.clone()); grp.add(eg); edges.push(eg);
    // gờ đồng giữa các tầng lùi
    var lip = mesh(prism(chamfer(t.w - sg[2] * 2 + .22, t.dp - sg[2] * 2 + .22, sg[3] + .08), .12, y0 + sg[1] * FH - .06), M.brass, true, false);
    grp.add(lip);
  });
  var topY = y0 + n * FH;
  // vương miện đèn + lan can kính
  var crownM = std({ color: 0xc19a5b, roughness: .3, metalness: .8, emissive: 0xd99a48, emissiveIntensity: 0 });
  var cr = mesh(prism(chamfer(t.w - 2.6, t.dp - 2.6, 1.0), .9, topY), crownM, true, false); grp.add(cr);
  var ped = mesh(new T.BoxGeometry(.25, 2.2, .25), M.brass, true, false); ped.position.set(0, topY + 1.6, 0);
  if (ti === 0) grp.add(ped);
  if (ti === 0) { // hồ bơi vô cực tầng thượng
    var pool = mesh(new T.BoxGeometry(t.w - 3.2, .1, 1.1), M.pool, false, false); pool.position.set(0, topY + .06, t.dp / 2 - 1.75); grp.add(pool);
  }
  // sảnh kính tầng trệt (sáng ấm khi đêm)
  var lobbyM = std({ color: 0x8a8f8c, roughness: .2, metalness: .3, emissive: 0xffc98a, emissiveIntensity: 0 });
  var lob = mesh(prism(chamfer(t.w + .3, t.dp + .3, 1), .7, y0), lobbyM, false, true); grp.add(lob);
  // phản chiếu
  var rg = grp.clone(true); reflect.add(rg);
  towerObjs.push({ fm: fm, grp: grp, edges: edges, top: topY, crown: crownM, lobby: lobbyM, data: t, hl: 0, hlT: 0 });
});

/* khối đế thương mại nối T1–T2 */
var podM = std({ color: 0xe6dfd2, roughness: .6, emissive: 0xffc27a, emissiveIntensity: 0 });
(function () {
  var s = shapeXZ([[-9.6, -12.2], [8, -14.6], [9, -11], [2, -5.6], [-3, -4.6], [-10.2, -4.8]], false);
  var g = prism(s, 1.25, LANDY);
  var m = mesh(g, [M.roof, podM], true, true); world.add(m);
  var glass = std({ color: 0x5f696c, roughness: .15, metalness: .5, emissive: 0xffc98a, emissiveIntensity: 0 });
  var band = mesh(prism(shapeXZ([[-9.75, -12.35], [8.15, -14.75], [9.15, -10.95], [2.05, -5.45], [-3, -4.45], [-10.35, -4.65]], false), .5, LANDY), glass, false, true);
  world.add(band); M.shop = glass;
  // sân vườn + hồ bơi trên mái khối đế
  var deckPool = mesh(new T.BoxGeometry(5.4, .08, 1.5), M.pool, false, false); deckPool.position.set(-1.6, LANDY + 1.3, -8.8); deckPool.rotation.y = .1; world.add(deckPool);
  var deckLawn = mesh(new T.BoxGeometry(4, .06, 2.4), M.lawn, false, true); deckLawn.position.set(3.4, LANDY + 1.29, -10.6); deckLawn.rotation.y = -.25; world.add(deckLawn);
})();
var podRef = new T.Group(); reflect.add(podRef);

plaque();
if (d.fonts && d.fonts.load) {
  Promise.all([d.fonts.load('400 92px "Noto Serif Display"'), d.fonts.load('500 30px "Barlow Condensed"')]).then(function () {
    // vẽ lại chữ khắc khi font tiếng Việt đã tải
    var old = world.children.filter(function (o) { return o.geometry && o.geometry.type === 'PlaneGeometry' && o.material && o.material.map && o.position.z > PD / 2; });
    old.forEach(function (o) { world.remove(o); });
    plaque(); linAll(); dirty();
  }).catch(function () {});
}

/* đèn mặt cầu (instanced) */
var bl = []; for (var q = 0; q <= 14; q++) [-.82, .82].forEach(function (o) { bl.push([14.6 + q * 8.8 / 14, -3 + o]); });
var bLamps = new T.InstancedMesh(lampGeo, M.lamp, bl.length);
bl.forEach(function (p, k) { _m.makeTranslation(p[0], 1.62, p[1]); bLamps.setMatrixAt(k, _m); });
world.add(bLamps);
var bridgeRef = bridge.clone(true); reflect.add(bridgeRef);

/* ---------- ánh sáng phòng trưng bày ---------- */
var hemi = new T.HemisphereLight(0xfff1dc, 0x1b140e, .42); scene.add(hemi);
var spot = new T.SpotLight(0xffe0b0, 3.2, 0, .52, .8, 1);
spot.position.set(22, 80, 34); spot.target.position.set(0, 0, -1); scene.add(spot); scene.add(spot.target);
spot.castShadow = true;
spot.shadow.mapSize.set(mobile ? 1024 : 2048, mobile ? 1024 : 2048);
spot.shadow.camera.near = 40; spot.shadow.camera.far = 140; spot.shadow.bias = -.0004; spot.shadow.radius = 4;
var rim = new T.DirectionalLight(0x9fb3cf, .45); rim.position.set(-40, 26, -36); scene.add(rim);
var fill = new T.DirectionalLight(0xffe7c7, .25); fill.position.set(-20, 30, 40); scene.add(fill);
var moon = new T.DirectionalLight(0x6f86b8, 0); moon.position.set(-30, 50, 20); scene.add(moon);

/* ---------- camera: điều khiển quỹ đạo tự viết ---------- */
var target = new T.Vector3(0, 2, 0), tgtGoal = target.clone();
var R0 = 108, th = .62, ph = .98, rad = R0;  // góc phương vị, góc từ đỉnh, bán kính
var goal = { th: th, ph: ph, rad: rad };
var LIM = { phMin: .32, phMax: 1.28, rMin: 34, rMax: 240 };
var vel = { th: 0, ph: 0 };
var FIT = R0, V = new T.Vector3();
function fitR() { return FIT; }
/* căn khung: tính bán kính + dời tâm hình để cả bàn sa bàn nằm gọn trong vùng trống (không đè chữ, nút) */
var STACK = window.matchMedia('(max-width: 1023px)');
var FITPTS = [];
[-1, 1].forEach(function (sx) { [-1, 1].forEach(function (sz) { FITPTS.push(new T.Vector3(sx * TW / 2, 0, sz * TD / 2), new T.Vector3(sx * TW / 2, -2.5, sz * TD / 2)); }); });
TOWERS.forEach(function (t) { FITPTS.push(new T.Vector3(t.x, t.fl * FH + 2, t.z)); });
function fitView() {
  var w = W, h = H, x0, x1, y0, y1, hdr = 70;
  if (STACK.matches) { x0 = w * .02; x1 = w * .98; y0 = h * .04; y1 = h * .98; }
  else {
    var hd = sec.querySelector('.sb-head').getBoundingClientRect(), st = stage.getBoundingClientRect();
    var tw = sec.querySelector('.sb-tw').getBoundingClientRect();
    x0 = Math.max(w * .3, hd.right - st.left + 12, tw.left - st.left < w / 2 ? tw.right - st.left + 12 : 0); x1 = w - 24; y0 = hdr + 12; y1 = h - 128;
  }
  var rw = x1 - x0, rh = y1 - y0;
  cam.clearViewOffset(); cam.updateProjectionMatrix();
  var r = R0, sp = Math.sin(.98), bx;
  for (var it = 0; it < 5; it++) {
    cam.position.set(r * sp * Math.sin(.62), 2 + r * Math.cos(.98), r * sp * Math.cos(.62)); cam.lookAt(0, 2, 0); cam.updateMatrixWorld();
    bx = [1e9, -1e9, 1e9, -1e9];
    FITPTS.forEach(function (p) { V.copy(p).project(cam); var px = (V.x * .5 + .5) * w, py = (-V.y * .5 + .5) * h; bx[0] = Math.min(bx[0], px); bx[1] = Math.max(bx[1], px); bx[2] = Math.min(bx[2], py); bx[3] = Math.max(bx[3], py); });
    r *= Math.max((bx[1] - bx[0]) / rw, (bx[3] - bx[2]) / rh);
  }
  FIT = r;
  var cx = (bx[0] + bx[1]) / 2, cy = (bx[2] + bx[3]) / 2;
  cam.setViewOffset(w, h, cx - (x0 + x1) / 2, cy - (y0 + y1) / 2, w, h);
  cam.updateProjectionMatrix();
}
function clampGoal() {
  goal.ph = Math.max(LIM.phMin, Math.min(LIM.phMax, goal.ph));
  goal.rad = Math.max(LIM.rMin, Math.min(LIM.rMax * (cam.aspect < 1 ? 1.6 : 1), goal.rad));
}
function applyCam() {
  var sp = Math.sin(ph);
  cam.position.set(target.x + rad * sp * Math.sin(th), target.y + rad * Math.cos(ph), target.z + rad * sp * Math.cos(th));
  cam.lookAt(target);
}

/* ---------- kích thước ---------- */
var W = 0, H = 0, OX = 0, OY = 0, touchBtn = sec.querySelector('.sb-touch');
function size(force) {
  var w = host.clientWidth, h = host.clientHeight;
  if (!force && w === W && Math.abs(h - H) < 120) return;   // iPhone: thanh địa chỉ co giãn khi cuộn → bỏ qua
  W = w; H = h;
  renderer.setSize(w, h, false); cv.style.width = w + 'px'; cv.style.height = h + 'px';
  cam.aspect = w / h; cam.fov = cam.aspect < 1 ? 36 : 30;
  fitView();
  if (focusT == null) { goal.rad = fitR(); clampGoal(); }
  dirty();
}
var lw = window.innerWidth;
window.addEventListener('resize', function () { if (window.innerWidth !== lw) { lw = window.innerWidth; size(true); } else size(false); });

/* ---------- vòng vẽ theo yêu cầu ---------- */
var running = false, visible = true, need = true, raf = 0, last = 0;
function dirty() { need = true; kick(); }
function kick() { if (!running && visible && !d.hidden) { running = true; last = performance.now(); raf = requestAnimationFrame(loop); } }
var tour = null, introCam = null, nightGoal = 0, focusT = null, hover = -1, sel = -1;
function loop(now) {
  var dt = Math.min(.05, (now - last) / 1000); last = now;
  var moving = false;
  if (introCam) {
    var k = Math.min(1, (now - introCam.t0) / introCam.dur), e = 1 - Math.pow(1 - k, 3);
    th = introCam.a.th + (introCam.b.th - introCam.a.th) * e; ph = introCam.a.ph + (introCam.b.ph - introCam.a.ph) * e; rad = introCam.a.rad + (introCam.b.rad - introCam.a.rad) * e;
    goal.th = th; goal.ph = ph; goal.rad = rad;
    if (k >= 1) { introCam = null; setTimeout(function () { startCoach(false); }, 300); } moving = true;
  } else {
    if (coach) { coachStep(now); moving = true; }
    if (tour) {
      var tk = (now - tour.t0) / tour.dur;
      goal.th = tour.th0 + tk * Math.PI * 2; goal.ph = tour.ph + Math.sin(tk * Math.PI * 2) * .08;
      if (tk >= 1) stopTour();
      moving = true;
    }
    if (!drag) { goal.th += vel.th; goal.ph += vel.ph; vel.th *= .9; vel.ph *= .9; if (Math.abs(vel.th) + Math.abs(vel.ph) < 1e-4) { vel.th = vel.ph = 0; } else moving = true; }
    clampGoal();
    var f = 1 - Math.pow(.0015, dt);
    var dth = goal.th - th, dph = goal.ph - ph, dr = goal.rad - rad;
    th += dth * f; ph += dph * f; rad += dr * f;
    var dtg = tgtGoal.clone().sub(target); target.addScaledVector(dtg, f);
    if (Math.abs(dth) + Math.abs(dph) + Math.abs(dr) * .02 + dtg.length() * .05 > 1e-4) moving = true;
  }
  // ngày/đêm
  if (Math.abs(nightGoal - night) > .002) { night += (nightGoal - night) * Math.min(1, dt * 3.2); setNight(night); moving = true; }
  else if (night !== nightGoal) { night = nightGoal; setNight(night); }
  // viền vàng
  towerObjs.forEach(function (o, i) {
    var want = (i === hover || i === sel) ? 1 : 0;
    if (Math.abs(o.hl - want) > .01) { o.hl += (want - o.hl) * Math.min(1, dt * 9); moving = true; o.edges.forEach(function (e) { e.material.opacity = o.hl; }); tint(o); }
  });
  if (moving || need) { applyCam(); renderer.render(scene, cam); placeUI(); need = false; }
  if (moving && visible && !d.hidden) raf = requestAnimationFrame(loop); else running = false;
  if (!firstFrame) { firstFrame = true; onFirstFrame(); }
}
var firstFrame = false;

/* ---------- gợi ý thao tác: tay/chuột tự diễn, mô hình lắc theo; ẩn sau thao tác đầu tiên hoặc ~6 giây ---------- */
var coachEl = sec.querySelector('.sb-coach'), coach = null, CK = 'bds17:sb-coach';
function seen() { try { return localStorage.getItem(CK) === '1'; } catch (e) { return false; } }
function startCoach(force) {
  if (!coachEl || coach || (!force && (seen() || HEADLESS))) return;
  coach = { t0: performance.now(), th0: goal.th, r0: goal.rad, keep: !!force && HEADLESS };
  coachEl.classList.add('on'); dirty();
}
function endCoach() {
  if (!coach) return;
  coach = null; coachEl.classList.remove('on');
  try { localStorage.setItem(CK, '1'); } catch (e) {}
}
function coachStep(now) {
  var t = now - coach.t0, k = (t % 3000) / 3000, hx = 0, zf = 1;
  // khớp với keyframe cHand / cMouse trong CSS
  if (k < .15) hx = -62 * (k / .15); else if (k < .38) hx = -62 + 124 * ((k - .15) / .23); else if (k < .52) hx = 62 * (1 - (k - .38) / .14);
  else if (k > .62 && k < .94) zf = 1 - .1 * Math.sin((k - .62) / .32 * Math.PI);
  if (!RM) { goal.th = coach.th0 - hx / 62 * .32; goal.rad = coach.r0 * zf; }
  if (t > 6000 && !coach.keep) endCoach();
}
function onFirstFrame() {
  sec.classList.add('sb-ready'); introPct(1); size(true);
  setTimeout(closeIntro, HEADLESS ? 0 : 450);
}

/* ---------- ngày ↔ đêm ---------- */
var C = function (h) { return new T.Color(h); };
var lampDay = C(0x5a4a36).convertSRGBToLinear(), lampNight = C(0xffd59a).convertSRGBToLinear(), tmpC = new T.Color();
function linAll() {
  scene.traverse(function (o) {
    if (!o.material) return;
    (Array.isArray(o.material) ? o.material : [o.material]).forEach(function (m) {
      if (m.userData.lin) return; m.userData.lin = true;
      if (m.color) { m.color.convertSRGBToLinear(); m.userData.base = m.color.clone(); }
      if (m.emissive) m.emissive.convertSRGBToLinear();
    });
  });
}
var GOLD = new T.Color(0xe9b86a).convertSRGBToLinear();
function tint(o) { o.fm.color.setScalar(1 - .72 * night).lerp(GOLD, o.hl * (.5 + .3 * night)); o.lobby.emissiveIntensity = 1.2 * night + o.hl * .6; }
function base(m, k) { if (m.userData.base) m.color.copy(m.userData.base).multiplyScalar(k); }
function setNight(k) {
  spot.intensity = 1.9 - 1.25 * k; spot.color.setHex(0xffe0b0).lerp(C(0xd8c4a8), k);
  hemi.intensity = .42 - .28 * k; rim.intensity = .45 - .2 * k; fill.intensity = .25 * (1 - k); moon.intensity = .35 * k;
  facades.forEach(function (m) { m.emissiveIntensity = 2.4 * k; });
  towerObjs.forEach(function (o) { o.crown.emissiveIntensity = .55 * k; tint(o); });
  podM.emissiveIntensity = .05 * k; if (M.shop) M.shop.emissiveIntensity = 1.1 * k;
  M.ctx.emissiveIntensity = .2 * k; base(M.ctx, 1 - .6 * k);
  M.pool.emissiveIntensity = .05 + 1.6 * k;
  tmpC.copy(lampDay).lerp(lampNight, k); M.lamp.color.copy(tmpC);
  M.cable.opacity = .55 + .35 * k;
  base(M.water, 1 - .5 * k); base(M.land, 1 - .55 * k); base(M.bank, 1 - .55 * k); base(M.roof, 1 - .72 * k); base(M.lawn, 1 - .5 * k); base(M.tree, 1 - .5 * k);
  renderer.toneMappingExposure = 1.15 + .1 * k;
  need = true;
}

/* ---------- giao diện HTML đặt theo toạ độ 3D ---------- */
var lab = sec.querySelector('.sb-label'), pinWrap = sec.querySelector('.sb-pins'), card = sec.querySelector('.sb-card');
var compass = sec.querySelector('.sb-compass i'), roHead = sec.querySelector('[data-ro=hd]'), roScale = sec.querySelector('[data-ro=sc]');
var chips = Array.prototype.slice.call(sec.querySelectorAll('.sb-tw button'));
var pinEls = PINS.map(function (p, i) {
  var b = d.createElement('button'); b.type = 'button'; b.className = 'sb-pin'; b.setAttribute('data-i', i);
  b.setAttribute('aria-label', p.t);
  b.innerHTML = '<span class="num">' + (i + 1 < 10 ? '0' : '') + (i + 1) + '</span><em>' + p.t + '</em>';
  pinWrap.appendChild(b);
  b.addEventListener('click', function (ev) { ev.stopPropagation(); openPin(i); });
  return b;
});
function proj(x, y, z) { V.set(x, y, z).project(cam); return { x: OX + (V.x * .5 + .5) * W, y: OY + (-V.y * .5 + .5) * H, ok: V.z < 1 }; }
function placeUI() {
  PINS.forEach(function (p, i) {
    var s = proj(p.p[0], p.p[1], p.p[2]), el = pinEls[i];
    el.style.transform = 'translate3d(' + s.x.toFixed(1) + 'px,' + s.y.toFixed(1) + 'px,0)';
    el.classList.toggle('off', !s.ok || s.x < OX + 8 || s.x > OX + W - 8 || s.y < OY + 30 || s.y > OY + H - 30);
  });
  if (coach && coachEl) { var cs = proj(0, 3, 2); coachEl.style.left = cs.x.toFixed(1) + 'px'; coachEl.style.top = cs.y.toFixed(1) + 'px'; }
  var li = hover >= 0 ? hover : sel;
  if (li >= 0) {
    var o = towerObjs[li], t = o.data, s = proj(t.x, o.top + 2.4, t.z);
    var lx = Math.max(OX + 120, Math.min(OX + W - 120, s.x)), ly = Math.max(OY + (W < 768 ? 150 : 210), s.y);
    lab.style.transform = 'translate3d(' + lx.toFixed(1) + 'px,' + ly.toFixed(1) + 'px,0)';
    if (lab.getAttribute('data-t') !== String(li)) {
      lab.setAttribute('data-t', li);
      lab.innerHTML = '<span class="sb-l-code">' + t.code + '</span><b>' + t.name + '</b>' +
        '<span class="sb-l-row"><i class="num">' + t.fl + '</i> tầng</span><span class="sb-l-row">' + t.types + '</span>' +
        '<span class="sb-l-pr">Giá ' + t.price + ' <small>(mẫu)</small></span>';
    }
    lab.hidden = false;
  } else lab.hidden = true;
  var deg = ((th * 180 / Math.PI) % 360 + 360) % 360;
  if (compass) compass.style.transform = 'rotate(' + (-deg).toFixed(1) + 'deg)';
  if (roHead) roHead.textContent = String(Math.round(deg)).padStart(3, '0') + '°';
  if (roScale) roScale.textContent = '1:' + Math.round(500 * rad / fitR() / 10) * 10;
}

/* ---------- chọn toà, bay tới ---------- */
function focusTower(i) {
  stopTour(); sel = i; hover = -1; closeCard();
  var t = TOWERS[i], o = towerObjs[i];
  tgtGoal.set(t.x, o.top * .5, t.z);
  goal.rad = (cam.aspect < 1 ? 30 : 0) + 56 + o.top * 1.7; goal.ph = .98;
  // nhìn từ phía có nhiều khoảng trống (hướng ra sông)
  goal.th = nearest(th, .45 + t.x * .035);
  focusT = i;
  chips.forEach(function (c, k) { c.setAttribute('aria-pressed', k === i ? 'true' : 'false'); });
  sec.classList.add('sb-focus');
  dirty();
}
function nearest(cur, a) { var t = a; while (t - cur > Math.PI) t -= Math.PI * 2; while (cur - t > Math.PI) t += Math.PI * 2; return t; }
function resetView() {
  stopTour(); sel = -1; focusT = null; closeCard();
  tgtGoal.set(0, 2, 0); goal.rad = fitR(); goal.ph = .98; goal.th = nearest(th, .62);
  chips.forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
  sec.classList.remove('sb-focus'); dirty();
}
chips.forEach(function (c, i) { c.addEventListener('click', function () { if (sel === i) resetView(); else focusTower(i); }); });

function openPin(i) {
  var p = PINS[i]; stopTour();
  card.innerHTML = '<span class="sb-c-n num">' + (i < 9 ? '0' : '') + (i + 1) + ' / 0' + PINS.length + '</span><b>' + p.t + '</b><span>' + p.s + '</span>' +
    '<' + 'a class="link" href="' + p.href + '">Xem chi tiết <svg class="ic" aria-hidden="true"><use href="#i-arrow"/></svg></a>' +
    '<button type="button" class="sb-c-x" aria-label="Đóng"><svg class="ic" aria-hidden="true"><use href="#i-x"/></svg></button>';
  card.hidden = false;
  card.querySelector('.sb-c-x').addEventListener('click', closeCard);
  pinEls.forEach(function (b, k) { b.classList.toggle('on', k === i); });
  tgtGoal.set(p.p[0] * .7, Math.min(p.p[1], 10) * .5, p.p[2] * .7); goal.rad = cam.aspect < 1 ? 92 : 78; sec.classList.add('sb-focus');
  dirty();
}
function closeCard() { if (sel < 0) sec.classList.remove('sb-focus'); card.hidden = true; pinEls.forEach(function (b) { b.classList.remove('on'); }); }

/* ---------- con trỏ / chạm ---------- */
var ray = new T.Raycaster(), ndc = new T.Vector2();
function pick(cx, cy) {
  var r = cv.getBoundingClientRect();
  ndc.set(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1);
  ray.setFromCamera(ndc, cam);
  var h = ray.intersectObjects(pickables, false);
  return h.length ? h[0].object.userData.t : -1;
}
var drag = null, pts = {}, pinch = null, active = !COARSE; // điện thoại: chỉ xoay khi đã bấm "Chạm để xoay"
function setActive(on) {
  active = on; sec.classList.toggle('sb-on', on); sec.classList.add('sb-touched'); endCoach();
  if (touchBtn) { touchBtn.setAttribute('aria-pressed', on ? 'true' : 'false'); touchBtn.querySelector('span').textContent = on ? 'Xong, cuộn tiếp' : 'Chạm để xoay'; }
}
if (touchBtn) touchBtn.addEventListener('click', function () { setActive(!active); });
cv.addEventListener('pointerdown', function (e) {
  if (!(e.pointerType !== 'mouse' && !active)) stopTour(); introCam = null;
  pts[e.pointerId] = { x: e.clientX, y: e.clientY };
  var ids = Object.keys(pts);
  if (e.pointerType !== 'mouse' && !active) { drag = { x: e.clientX, y: e.clientY, t: performance.now(), tap: true, passive: true }; return; }
  if (ids.length === 2) {
    var a = pts[ids[0]], b = pts[ids[1]]; pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), r: goal.rad }; drag = null; return;
  }
  drag = { x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, t: performance.now(), tap: true };
  try { cv.setPointerCapture(e.pointerId); } catch (er) {}
  sec.classList.add('sb-grab');
});
cv.addEventListener('pointermove', function (e) {
  if (pts[e.pointerId]) pts[e.pointerId] = { x: e.clientX, y: e.clientY };
  if (pinch && active) {
    var ids = Object.keys(pts); if (ids.length < 2) return;
    var a = pts[ids[0]], b = pts[ids[1]], dd = Math.hypot(a.x - b.x, a.y - b.y);
    goal.rad = pinch.r * pinch.d / Math.max(20, dd); clampGoal(); dirty(); return;
  }
  if (drag) {
    var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (Math.abs(e.clientX - (drag.sx || drag.x)) + Math.abs(e.clientY - (drag.sy || drag.y)) > 7) drag.tap = false;
    if (drag.passive) return;
    drag.x = e.clientX; drag.y = e.clientY;
    vel.th = -dx * .0042; vel.ph = -dy * .0032;
    goal.th += vel.th; goal.ph += vel.ph; dirty();
    return;
  }
  if (e.pointerType === 'mouse') {
    var h = pick(e.clientX, e.clientY);
    if (h !== hover) { hover = h; cv.style.cursor = h >= 0 ? 'pointer' : 'grab'; dirty(); }
  }
});
function up(e) {
  delete pts[e.pointerId];
  if (pinch && Object.keys(pts).length < 2) { pinch = null; return; }
  if (drag && drag.tap && performance.now() - drag.t < 450) {
    var h = pick(e.clientX, e.clientY);
    if (h >= 0) focusTower(h);
    else if (sel >= 0 && !drag.passive) { /* giữ nguyên */ }
  }
  drag = null; sec.classList.remove('sb-grab'); kick();
}
cv.addEventListener('pointerup', up);
cv.addEventListener('pointercancel', function (e) { delete pts[e.pointerId]; drag = null; pinch = null; sec.classList.remove('sb-grab'); });
cv.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse' && hover >= 0) { hover = -1; dirty(); } });
// cuộn chuột: chỉ zoom khi đã bấm vào mô hình (tránh chặn cuộn trang); hết giới hạn thì trả lại cho trang
var wheelArmed = false;
cv.addEventListener('pointerdown', function (e) { if (e.pointerType === 'mouse') { wheelArmed = true; sec.classList.add('sb-armed'); } });
stage.addEventListener('mouseleave', function () { wheelArmed = false; sec.classList.remove('sb-armed'); });
cv.addEventListener('wheel', function (e) {
  if (wheelArmed || e.ctrlKey) endCoach();
  if (!(wheelArmed || e.ctrlKey)) return;
  var nr = goal.rad * (1 + Math.max(-.3, Math.min(.3, e.deltaY * .0016)));
  var lo = LIM.rMin, hi = LIM.rMax;
  if ((nr <= lo && goal.rad <= lo + .01) || (nr >= hi && goal.rad >= hi - .01)) return; // ở giới hạn: để trang cuộn
  e.preventDefault(); stopTour(); goal.rad = nr; clampGoal(); dirty();
}, { passive: false });
// phím mũi tên khi khung sa bàn đang được chọn
stage.addEventListener('keydown', function (e) {
  var k = e.key, used = true;
  if (k === 'ArrowLeft') goal.th -= .18; else if (k === 'ArrowRight') goal.th += .18;
  else if (k === 'ArrowUp') goal.ph -= .08; else if (k === 'ArrowDown') goal.ph += .08;
  else if (k === '+' || k === '=') goal.rad *= .9; else if (k === '-') goal.rad *= 1.1;
  else if (k === 'Escape') resetView(); else used = false;
  if (used && e.target === stage) { e.preventDefault(); stopTour(); clampGoal(); dirty(); }
});

/* ---------- nút điều khiển ---------- */
var dnBtn = sec.querySelector('.sb-dn'), tourBtn = sec.querySelector('.sb-tour'), homeBtn = sec.querySelector('.sb-home');
var zin = sec.querySelector('.sb-zin'), zout = sec.querySelector('.sb-zout');
if (dnBtn) dnBtn.addEventListener('click', function () {
  var on = dnBtn.getAttribute('aria-pressed') !== 'true';
  dnBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
  dnBtn.querySelector('.sb-b-l').textContent = on ? 'Đêm' : 'Ngày';
  nightGoal = on ? 1 : 0; sec.classList.toggle('sb-night', on); dirty();
});
function stopTour() {
  endCoach();
  if (!tour) return; tour = null;
  if (tourBtn) { tourBtn.setAttribute('aria-pressed', 'false'); }
}
if (tourBtn) tourBtn.addEventListener('click', function () {
  if (tour) { stopTour(); return; }
  if (sel >= 0) resetView();
  closeCard();
  tour = { t0: performance.now(), dur: 26000, th0: goal.th, ph: Math.max(.82, Math.min(1.12, goal.ph)) };
  tourBtn.setAttribute('aria-pressed', 'true'); dirty();
});
if (homeBtn) homeBtn.addEventListener('click', resetView);
if (zin) zin.addEventListener('click', function () { stopTour(); goal.rad *= .82; clampGoal(); dirty(); });
if (zout) zout.addEventListener('click', function () { stopTour(); goal.rad *= 1.2; clampGoal(); dirty(); });

/* ---------- chỉ vẽ khi thấy ---------- */
if ('IntersectionObserver' in window) {
  new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) dirty(); }, { rootMargin: '80px' }).observe(stage);
}
d.addEventListener('visibilitychange', function () { if (!d.hidden) dirty(); });

/* ---------- khởi động ---------- */
linAll();
size(true);
goal.rad = fitR(); rad = goal.rad;
if (HEADLESS) {
  // ảnh chụp tự động: trạng thái cuối, cho phép ép ngày/đêm + góc qua hash (#sb=dem,th,ph,r)
  var hm = /sb=([a-z]+)(?:,([-\d.]+),([-\d.]+),([-\d.]+))?/.exec(location.hash);
  if (hm) {
    if (hm[1] === 'dem') { nightGoal = night = 1; setNight(1); sec.classList.add('sb-night'); if (dnBtn) { dnBtn.setAttribute('aria-pressed', 'true'); dnBtn.querySelector('.sb-b-l').textContent = 'Đêm'; } }
    if (hm[2]) { th = goal.th = +hm[2]; ph = goal.ph = +hm[3]; rad = goal.rad = fitR() * +hm[4]; }
  }
} else {
  introCam = { t0: performance.now() + 250, dur: 2600, a: { th: th - .9, ph: .42, rad: rad * 1.3 }, b: { th: th, ph: ph, rad: rad } };
  th = introCam.a.th; ph = introCam.a.ph; rad = introCam.a.rad;
}
if (HEADLESS && /coach/.test(location.hash)) startCoach(true);
window.VH_SABAN = { focus: focusTower, reset: resetView, pin: openPin, night: function (on) { if (!!on !== (nightGoal === 1)) dnBtn.click(); } };
applyCam(); dirty();
window.addEventListener('load', function () { size(true); });
}
})();
