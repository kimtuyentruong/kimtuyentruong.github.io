/* Vọng Hà Residences — đoạn "máy quay bay" trên trang chủ.
   Chuỗi ảnh vẽ lên <canvas>: mỗi cảnh dolly (zoom dần theo điểm nhìn), chuyển cảnh zoom-through + crossfade,
   cảnh sảnh đón mở bằng hai cánh cửa kính (hai nửa ảnh trượt ra hai bên). Không thư viện, chỉ requestAnimationFrame. */
(function () {
'use strict';
var d = document, sec = d.getElementById('fly');
if (!sec) return;
var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
var cv = sec.querySelector('.fly-cv'), ctx = cv.getContext && cv.getContext('2d');
if (RM || !ctx) return;               // giảm chuyển động: giữ chế độ ảnh tĩnh từng cảnh
sec.classList.remove('static');

var pin = sec.querySelector('.fly-pin'), stage = sec.querySelector('.fly-stage');
var caps = Array.prototype.slice.call(sec.querySelectorAll('.sc'));
var bars = Array.prototype.slice.call(sec.querySelectorAll('.fly-prog button'));
var tc = d.getElementById('flyTc');
var N = caps.length, T = 0.3;         // T: phần cuối mỗi cảnh dành cho chuyển cảnh
var DOOR = 2;                         // cảnh sảnh đón: mở cửa kính
var mobile = window.innerWidth < 768;
var SC = caps.map(function (li) {
  return { id: li.getAttribute('data-img'), fx: +li.getAttribute('data-fx'), fy: +li.getAttribute('data-fy'),
           z0: +li.getAttribute('data-z0'), z1: +li.getAttribute('data-z1'), img: null, ok: false };
});

/* ---------- tải trước ảnh: điện thoại w=900 (cắt dọc), máy tính w=1800 ---------- */
function src(id) {
  return 'https://images.unsplash.com/photo-' + id + '?auto=format&fit=crop&q=72&' + (mobile ? 'w=900&h=1500' : 'w=1800');
}
var loaded = 0;
SC.forEach(function (s, i) {
  var im = new Image(); im.decoding = 'async';
  im.onload = function () { s.ok = true; loaded++; if (i === 0 || loaded === N) sec.classList.add('ready'); need(); };
  im.src = src(s.id); s.img = im;
});

/* ---------- kích thước canvas: theo devicePixelRatio (tối đa 2), chỉ đổi khi chiều ngang đổi thật ---------- */
var W = 0, H = 0, DPR = 1, lastW = -1;
function size(force) {
  var w = stage.clientWidth, h = stage.clientHeight;
  if (!force && w === lastW) return;
  lastW = w; DPR = Math.min(2, window.devicePixelRatio || 1);
  W = Math.round(w * DPR); H = Math.round(h * DPR);
  cv.width = W; cv.height = H; need(true);
}
window.addEventListener('resize', function () { size(false); });
window.addEventListener('orientationchange', function () { setTimeout(function () { size(true); }, 250); });

/* ---------- vị trí cuộn → tiến độ ---------- */
function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
function target() {
  var r = pin.getBoundingClientRect(), span = pin.offsetHeight - stage.offsetHeight;
  return clamp(-r.top / (span || 1), 0, 1);
}
var cur = 0, tgt = 0, active = false, raf = 0, dirty = true;
function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
function easeIn(t) { return t * t * t; }
function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

/* vẽ ảnh phủ kín khung (cover) với độ zoom z, giữ điểm nhìn (fx,fy) đứng yên; kẹp để không bao giờ lộ mép ảnh */
function cover(s, z, alpha) {
  var im = s.img; if (!s.ok || alpha <= 0) return;
  var iw = im.naturalWidth, ih = im.naturalHeight, base = Math.max(W / iw, H / ih), sc = base * z;
  var dw = iw * sc, dh = ih * sc;
  var fxs = (W - iw * base) / 2 + s.fx * iw * base, fys = (H - ih * base) / 2 + s.fy * ih * base;
  var x = clamp(fxs - s.fx * dw, W - dw, 0), y = clamp(fys - s.fy * dh, H - dh, 0);
  ctx.globalAlpha = alpha;
  ctx.drawImage(im, x, y, dw, dh);
  ctx.globalAlpha = 1;
}
function zoomAt(i, s) {             // dolly liên tục suốt cửa sổ hiển thị của cảnh i
  var a = i === 0 ? 0 : i - T, b = i === N - 1 ? N : i + 1 - T;
  var k = clamp((s - a) / (b - a), 0, 1);
  return SC[i].z0 + (SC[i].z1 - SC[i].z0) * k;
}

/* cửa kính: toà tháp tách đôi ở giữa như hai cánh cửa kính, trượt sang hai bên để lộ sảnh đón */
function doors(s, k) {
  var sc = SC[DOOR - 1]; if (!sc.ok) return;
  var half = W / 2, open = ease(clamp((k - 0.12) / 0.88, 0, 1)), off = open * (half + 60 * DPR);
  var z = zoomAt(DOOR - 1, s) * (1 + 0.22 * easeIn(k));
  for (var side = 0; side < 2; side++) {
    var dx = side === 0 ? -off : off, x0 = (side === 0 ? 0 : half) + dx;
    ctx.save();
    ctx.beginPath(); ctx.rect(x0, 0, half, H); ctx.clip();
    ctx.translate(dx, 0); cover(sc, z, 1); ctx.translate(-dx, 0);
    ctx.fillStyle = 'rgba(14,11,8,' + (0.12 + open * 0.45).toFixed(3) + ')'; ctx.fillRect(x0, 0, half, H);   // kính tối dần khi mở
    var g = ctx.createLinearGradient(x0, 0, x0 + half * 0.9, H);                                               // vệt phản quang
    g.addColorStop(0, 'rgba(255,236,205,0)'); g.addColorStop(.45, 'rgba(255,236,205,0)');
    g.addColorStop(.52, 'rgba(255,236,205,' + (0.06 + 0.1 * Math.sin(open * Math.PI)).toFixed(3) + ')');
    g.addColorStop(.6, 'rgba(255,236,205,0)'); g.addColorStop(1, 'rgba(255,236,205,0)');
    ctx.fillStyle = g; ctx.fillRect(x0, 0, half, H);
    var fw = Math.max(2, 2.5 * DPR), sx = side === 0 ? x0 + half - fw : x0;
    ctx.fillStyle = 'rgba(212,178,122,' + (0.35 + 0.6 * Math.min(1, k * 4)).toFixed(3) + ')';
    ctx.fillRect(sx, 0, fw, H);                                                                                 // nẹp đồng mép giữa
    ctx.fillRect(side === 0 ? x0 + half - 30 * DPR : x0 + 26 * DPR, H * .44, 3 * DPR, H * .14);                 // tay nắm
    ctx.restore();
  }
}

function caption(i, s) {
  var a = i === 0 ? -1 : i + 0.04, b = i === N - 1 ? N + 1 : i + 1 - T - 0.02, f = 0.1, o;
  if (s < a || s > b) o = 0; else o = Math.min(1, (s - a) / f, (b - s) / f);
  if (i === 0 && s <= b) o = Math.min(1, (b - s) / f);
  o = clamp(o, 0, 1);
  var el = caps[i];
  if (el._o === o) return; el._o = o;
  el.style.opacity = o.toFixed(3);
  el.style.transform = 'translate3d(0,' + ((1 - o) * 26).toFixed(1) + 'px,0)';
  el.style.visibility = o > 0 ? 'visible' : 'hidden';
}

function draw() {
  var s = clamp(cur * N, 0, N - 0.0001), i = Math.floor(s), t = s - i;
  ctx.fillStyle = '#070605'; ctx.fillRect(0, 0, W, H);
  var inTrans = i < N - 1 && t > 1 - T;
  var k = inTrans ? (t - (1 - T)) / T : 0;
  if (!inTrans) {
    cover(SC[i], zoomAt(i, s), 1);
  } else {
    var j = i + 1;
    cover(SC[j], zoomAt(j, s), 1);                                   // cảnh sau đã dolly sẵn bên dưới
    if (j === DOOR) doors(s, k);                                     // toà tháp mở ra như cửa kính
    else {
      var zt = zoomAt(i, s) * (1 + 1.1 * easeIn(k));                 // cảnh trước lao vào (zoom-through)
      var fa = clamp((k - 0.15) / 0.7, 0, 1);
      cover(SC[i], zt, 1 - fa * fa * (3 - 2 * fa));
    }
  }
  // grade màu ấm chung cho cả đoạn phim
  ctx.globalCompositeOperation = 'soft-light';
  ctx.fillStyle = 'rgba(255,170,100,.16)'; ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'source-over';

  for (var c = 0; c < N; c++) caption(c, s);
  for (var b = 0; b < N; b++) {
    var f = clamp(s - b, 0, 1);
    if (bars[b]._f !== f) { bars[b]._f = f; bars[b].firstChild.firstChild.style.transform = 'scaleX(' + f.toFixed(3) + ')'; }
    bars[b].classList.toggle('on', b === i);
  }
  if (tc) { var sec2 = Math.floor(cur * 48); tc.textContent = '00:' + ('0' + Math.floor(sec2 / 24)).slice(-2) + ':' + ('0' + (sec2 % 24)).slice(-2); }
}

/* ---------- vòng lặp: chỉ chạy khi đoạn bay nằm trong khung nhìn ---------- */
function loop() {
  raf = 0;
  tgt = target();
  var diff = tgt - cur;
  cur = Math.abs(diff) < 0.0004 ? tgt : cur + diff * 0.14;
  draw(); dirty = false;
  d.documentElement.classList.toggle('flying', active && tgt > 0.002 && tgt < 0.998);
  if (active && (cur !== tgt)) raf = requestAnimationFrame(loop);
}
function need(force) {
  if (force) dirty = true;
  if (active && !raf) raf = requestAnimationFrame(loop);
}
if ('IntersectionObserver' in window) {
  new IntersectionObserver(function (en) {
    active = en[0].isIntersecting;
    if (active) { cur = tgt = target(); need(true); }
    else { d.documentElement.classList.remove('flying'); if (raf) { cancelAnimationFrame(raf); raf = 0; } }
  }, { rootMargin: '100px 0px' }).observe(pin);
} else active = true;
window.addEventListener('scroll', function () { need(); }, { passive: true });

/* ---------- thanh tiến độ: bấm để bay tới cảnh ---------- */
bars.forEach(function (b, i) {
  b.addEventListener('click', function () {
    var span = pin.offsetHeight - stage.offsetHeight, top = pin.getBoundingClientRect().top + window.pageYOffset;
    var p = i === 0 ? 0.02 : (i + 0.18) / N;
    window.scrollTo({ top: top + span * p, behavior: 'smooth' });
  });
});

size(true);
cur = tgt = target(); active = true; draw(); active = false;
if ('IntersectionObserver' in window) { var r = pin.getBoundingClientRect(); active = r.top < window.innerHeight + 100 && r.bottom > -100; }
else active = true;
})();
