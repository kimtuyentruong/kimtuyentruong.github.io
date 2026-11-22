/* Vọng Hà Residences — "máy quay bay" toàn màn ngay từ pixel đầu tiên.
   Chuỗi ảnh vẽ lên <canvas>: dolly theo cuộn, chuyển cảnh zoom-through + crossfade, toà tháp tách đôi như cửa kính để vào sảnh.
   Nhìn quanh: ảnh lệch theo con trỏ (máy tính) hoặc theo vuốt ngang (điện thoại); camera tự trôi nhẹ khi chưa có thao tác.
   Điểm sáng (hotspot) trên từng cảnh mở thẻ thông tin nhỏ. Không thư viện, chỉ requestAnimationFrame; dừng vẽ khi khuất. */
(function () {
'use strict';
var d = document, root = d.documentElement, sec = d.getElementById('fly');
if (!sec) return;
var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
var HEADLESS = /HeadlessChrome/.test(navigator.userAgent);
var cv = sec.querySelector('.fly-cv'), ctx = cv.getContext && cv.getContext('2d');
if (RM || !ctx) return;               // giảm chuyển động: giữ chế độ ảnh tĩnh từng cảnh
sec.classList.remove('static');

var pin = sec.querySelector('.fly-pin'), stage = sec.querySelector('.fly-stage');
var caps = Array.prototype.slice.call(sec.querySelectorAll('.sc'));
var bars = Array.prototype.slice.call(sec.querySelectorAll('.fly-prog button'));
var hint = sec.querySelector('.fly-hint'), hsLayer = sec.querySelector('.fly-hs'), card = sec.querySelector('.hs-card');
var N = caps.length, T = 0.3, DOOR = 2;
var mobile = window.innerWidth < 768, CROP = 0.6;   // điện thoại: ảnh cắt dọc 900 x 1500
var SC = caps.map(function (li) {
  var ar = +li.getAttribute('data-ar') || 1.5, kf = mobile ? Math.min(1, CROP / ar) : 1;
  function mu(u) { return 0.5 + (u - 0.5) / kf; }  // toạ độ ảnh gốc → ảnh đã cắt
  var hs = [];
  try { hs = JSON.parse(li.getAttribute('data-hs') || '[]'); } catch (e) {}
  return { id: li.getAttribute('data-img'), fx: mu(+li.getAttribute('data-fx')), fy: +li.getAttribute('data-fy'),
           z0: +li.getAttribute('data-z0'), z1: +li.getAttribute('data-z1'), img: null, ok: false,
           hs: hs.map(function (h) { return { u: mu(h[0]), v: h[1], t: h[2], d: h[3] }; }).filter(function (h) { return h.u > 0.06 && h.u < 0.94; }) };
});

/* ---------- tải trước ảnh (cảnh đầu trước) ---------- */
function src(id) { return 'https://images.unsplash.com/photo-' + id + '?auto=format&fit=crop&q=72&' + (mobile ? 'w=900&h=1500' : 'w=1800'); }
SC.forEach(function (s, i) {
  var im = new Image(); im.decoding = 'async';
  if (i === 0 && 'fetchPriority' in im) im.fetchPriority = 'high';
  im.onload = function () { s.ok = true; if (i === 0) sec.classList.add('ready'); kick(); };
  im.src = src(s.id); s.img = im;
});

/* ---------- kích thước: DPR tối đa 2, chỉ dựng lại khi chiều ngang đổi thật ---------- */
var W = 0, H = 0, CW = 0, CH = 0, DPR = 1, lastW = -1;
function size(force) {
  var w = stage.clientWidth, h = stage.clientHeight;
  if (!force && w === lastW) return;
  lastW = w; CW = w; CH = h; DPR = Math.min(2, window.devicePixelRatio || 1);
  W = Math.round(w * DPR); H = Math.round(h * DPR); cv.width = W; cv.height = H; kick();
}
window.addEventListener('resize', function () { size(false); });
window.addEventListener('orientationchange', function () { setTimeout(function () { size(true); }, 250); });

function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
function easeIn(t) { return t * t * t; }
function target() { var r = pin.getBoundingClientRect(), span = pin.offsetHeight - stage.offsetHeight; return clamp(-r.top / (span || 1), 0, 1); }

/* ---------- nhìn quanh: con trỏ / vuốt / tự trôi ---------- */
var pan = { x: 0, y: 0 }, panT = { x: 0, y: 0 }, lastAct = -1e9, interacted = false, t0 = performance.now();
var LOOK = 1.07;                       // biên ảnh dư để nhìn quanh
function act() { lastAct = performance.now(); if (!interacted) { interacted = true; hideHint(); } kick(); }
stage.addEventListener('pointermove', function (e) {
  if (e.pointerType !== 'mouse') return;
  var r = stage.getBoundingClientRect();
  panT.x = clamp(((e.clientX - r.left) / r.width - .5) * 2, -1, 1);
  panT.y = clamp(((e.clientY - r.top) / r.height - .5) * 2, -1, 1);
  lastAct = performance.now(); kick();
});
var drag = null;
stage.addEventListener('pointerdown', function (e) {
  if (e.target.closest('button, a')) return;
  drag = { x: e.clientX, y: e.clientY, px: panT.x, py: panT.y, id: e.pointerId };
});
stage.addEventListener('pointermove', function (e) {
  if (!drag || e.pointerId !== drag.id) return;
  var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
  if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
  panT.x = clamp(drag.px - dx / (CW * .5), -1, 1);
  if (e.pointerType === 'mouse') panT.y = clamp(drag.py - dy / (CH * .5), -1, 1);
  act();
});
function endDrag() { drag = null; }
stage.addEventListener('pointerup', endDrag); stage.addEventListener('pointercancel', endDrag); stage.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') endDrag(); });
stage.addEventListener('keydown', function (e) {
  var k = { ArrowLeft: [-.25, 0], ArrowRight: [.25, 0], ArrowUp: [0, -.25], ArrowDown: [0, .25] }[e.key];
  if (!k || e.target !== stage) return;
  e.preventDefault(); panT.x = clamp(panT.x + k[0], -1, 1); panT.y = clamp(panT.y + k[1], -1, 1); act();
});

/* vẽ ảnh phủ kín (cover) với zoom z, giữ điểm nhìn, cộng độ lệch nhìn quanh; kẹp để không lộ mép */
var geo = [];
function cover(s, z, alpha, idx) {
  var im = s.img; if (!s.ok || alpha <= 0) return;
  var iw = im.naturalWidth, ih = im.naturalHeight, base = Math.max(W / iw, H / ih), sc = base * z * LOOK;
  var dw = iw * sc, dh = ih * sc;
  var fxs = (W - iw * base) / 2 + s.fx * iw * base, fys = (H - ih * base) / 2 + s.fy * ih * base;
  var x = fxs - s.fx * dw - pan.x * (dw - W) * .42, y = fys - s.fy * dh - pan.y * (dh - H) * .42;
  x = clamp(x, W - dw, 0); y = clamp(y, H - dh, 0);
  ctx.globalAlpha = alpha; ctx.drawImage(im, x, y, dw, dh); ctx.globalAlpha = 1;
  if (idx !== undefined) geo[idx] = { x: x, y: y, w: dw, h: dh };
}
function zoomAt(i, s) {
  var a = i === 0 ? 0 : i - T, b = i === N - 1 ? N : i + 1 - T;
  return SC[i].z0 + (SC[i].z1 - SC[i].z0) * clamp((s - a) / (b - a), 0, 1);
}
/* cửa kính: toà tháp tách đôi ở giữa, hai cánh trượt sang hai bên để lộ sảnh */
function doors(s, k) {
  var sc = SC[DOOR - 1]; if (!sc.ok) return;
  var half = W / 2, open = ease(clamp((k - 0.12) / 0.88, 0, 1)), off = open * (half + 60 * DPR), z = zoomAt(DOOR - 1, s) * (1 + 0.22 * easeIn(k));
  for (var side = 0; side < 2; side++) {
    var dx = side === 0 ? -off : off, x0 = (side === 0 ? 0 : half) + dx;
    ctx.save(); ctx.beginPath(); ctx.rect(x0, 0, half, H); ctx.clip();
    ctx.translate(dx, 0); cover(sc, z, 1); ctx.translate(-dx, 0);
    ctx.fillStyle = 'rgba(14,11,8,' + (0.12 + open * 0.45).toFixed(3) + ')'; ctx.fillRect(x0, 0, half, H);
    var g = ctx.createLinearGradient(x0, 0, x0 + half * 0.9, H);
    g.addColorStop(0, 'rgba(255,236,205,0)'); g.addColorStop(.45, 'rgba(255,236,205,0)');
    g.addColorStop(.52, 'rgba(255,236,205,' + (0.06 + 0.1 * Math.sin(open * Math.PI)).toFixed(3) + ')');
    g.addColorStop(.6, 'rgba(255,236,205,0)'); g.addColorStop(1, 'rgba(255,236,205,0)');
    ctx.fillStyle = g; ctx.fillRect(x0, 0, half, H);
    var fw = Math.max(2, 2.5 * DPR);
    ctx.fillStyle = 'rgba(212,178,122,' + (0.35 + 0.6 * Math.min(1, k * 4)).toFixed(3) + ')';
    ctx.fillRect(side === 0 ? x0 + half - fw : x0, 0, fw, H);
    ctx.fillRect(side === 0 ? x0 + half - 30 * DPR : x0 + 26 * DPR, H * .44, 3 * DPR, H * .14);
    ctx.restore();
  }
}

/* ---------- chữ từng cảnh ---------- */
function caption(i, s) {
  var a = i === 0 ? -1 : i + 0.04, b = i === N - 1 ? N + 1 : i + 1 - T - 0.02, f = 0.1;
  var o = s < a || s > b ? 0 : clamp(Math.min((s - a) / f, (b - s) / f), 0, 1);
  var el = caps[i]; if (el._o === o) return; el._o = o;
  el.style.opacity = o.toFixed(3);
  el.style.transform = 'translate3d(0,' + ((1 - o) * 22).toFixed(1) + 'px,0)';
  el.style.visibility = o > 0 ? 'visible' : 'hidden';
}

/* ---------- điểm sáng ---------- */
var hsScene = -1, hsBtns = [], openHs = null;
function buildHs(i) {
  hsScene = i; closeCard(); hsLayer.innerHTML = '';
  hsBtns = SC[i].hs.map(function (h, k) {
    var b = d.createElement('button');
    b.type = 'button'; b.className = 'hs'; b.setAttribute('aria-label', h.t); b.setAttribute('aria-expanded', 'false');
    b.innerHTML = '<i></i>';
    b.addEventListener('click', function (e) { e.stopPropagation(); toggleCard(b, h); act(); });
    hsLayer.appendChild(b); return b;
  });
}
function placeHs(i, vis) {
  if (i !== hsScene) buildHs(i);
  hsLayer.style.opacity = vis.toFixed(3);
  hsLayer.style.visibility = vis > 0.05 ? 'visible' : 'hidden';
  var g = geo[i]; if (!g) return;
  SC[i].hs.forEach(function (h, k) {
    var x = (g.x + h.u * g.w) / DPR, y = (g.y + h.v * g.h) / DPR, b = hsBtns[k];
    var inView = x > 24 && x < CW - 24 && y > 70 && y < CH - 120;
    b.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
    b.style.display = inView ? '' : 'none';
    if (openHs && openHs.b === b) placeCard(x, y);
  });
  if (vis < 0.2 && openHs) closeCard();
}
function toggleCard(b, h) {
  if (openHs && openHs.b === b) { closeCard(); return; }
  closeCard();
  card.querySelector('b').textContent = h.t; card.querySelector('span').textContent = h.d;
  card.hidden = false; b.setAttribute('aria-expanded', 'true'); b.classList.add('on'); openHs = { b: b };
  draw();
}
function placeCard(x, y) {
  var w = card.offsetWidth || 220, left = clamp(x + 22, 12, CW - w - 12);
  if (x + 22 + w > CW - 12) left = clamp(x - w - 22, 12, CW - w - 12);
  card.style.transform = 'translate3d(' + left.toFixed(0) + 'px,' + clamp(y - 30, 70, CH - 160).toFixed(0) + 'px,0)';
}
function closeCard() {
  if (!openHs) return;
  openHs.b.setAttribute('aria-expanded', 'false'); openHs.b.classList.remove('on'); openHs = null; card.hidden = true;
}
stage.addEventListener('click', function (e) { if (!e.target.closest('.hs, .hs-card')) closeCard(); });
d.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeCard(); });

/* ---------- vẽ một khung ---------- */
var cur = 0, tgt = 0, active = false, raf = 0;
function draw() {
  var s = clamp(cur * N, 0, N - 0.0001), i = Math.floor(s), t = s - i;
  ctx.fillStyle = '#070605'; ctx.fillRect(0, 0, W, H);
  var inTrans = i < N - 1 && t > 1 - T, k = inTrans ? (t - (1 - T)) / T : 0;
  if (!inTrans) cover(SC[i], zoomAt(i, s), 1, i);
  else {
    var j = i + 1;
    cover(SC[j], zoomAt(j, s), 1, j);
    if (j === DOOR) doors(s, k);
    else {
      var fa = clamp((k - 0.15) / 0.7, 0, 1);
      cover(SC[i], zoomAt(i, s) * (1 + 1.1 * easeIn(k)), 1 - fa * fa * (3 - 2 * fa));
    }
  }
  ctx.globalCompositeOperation = 'soft-light';
  ctx.fillStyle = 'rgba(255,170,100,.16)'; ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'source-over';

  for (var c = 0; c < N; c++) caption(c, s);
  // điểm sáng chỉ hiện khi cảnh đã đứng yên (không trong chuyển cảnh)
  var hv = inTrans ? 0 : (i === 0 ? 1 : clamp((t - 0.06) / 0.08, 0, 1)) * clamp((1 - T - t) / 0.06, 0, 1);
  if (i === N - 1) hv = i === 0 ? 1 : clamp((t - 0.06) / 0.08, 0, 1);
  placeHs(i, hv);
  for (var b = 0; b < N; b++) {
    var f = clamp(s - b, 0, 1);
    if (bars[b]._f !== f) { bars[b]._f = f; bars[b].firstChild.firstChild.style.transform = 'scaleX(' + f.toFixed(3) + ')'; }
    var on = b === (inTrans && k > .5 ? i + 1 : i);
    if (bars[b]._on !== on) { bars[b]._on = on; bars[b].classList.toggle('on', on); on ? bars[b].setAttribute('aria-current', 'step') : bars[b].removeAttribute('aria-current'); }
  }
}

/* ---------- vòng lặp: chạy khi đang trong khung nhìn; tự trôi nhẹ khi chưa có thao tác ---------- */
function loop(now) {
  raf = 0; if (!active) return;
  tgt = target();
  var diff = tgt - cur; cur = Math.abs(diff) < 0.0004 ? tgt : cur + diff * 0.14;
  var idle = now - lastAct > 2600;
  if (idle && !HEADLESS) {                // camera trôi: vẽ hình số 8 rất chậm
    var tt = (now - t0) / 1000;
    panT.x = Math.sin(tt * 0.23) * 0.55; panT.y = Math.sin(tt * 0.31) * 0.28;
  }
  var lk = idle ? 0.025 : 0.09;
  pan.x += (panT.x - pan.x) * lk; pan.y += (panT.y - pan.y) * lk;
  draw();
  root.classList.toggle('flying', tgt > 0.002 && tgt < 0.998);
  if (!HEADLESS || cur !== tgt) raf = requestAnimationFrame(loop);
}
function kick() { if (active && !raf) raf = requestAnimationFrame(loop); }
if ('IntersectionObserver' in window) {
  new IntersectionObserver(function (en) {
    active = en[0].isIntersecting;
    if (active) { cur = tgt = target(); kick(); }
    else { root.classList.remove('flying'); closeCard(); if (raf) { cancelAnimationFrame(raf); raf = 0; } }
  }).observe(stage.parentNode);
} else active = true;
window.addEventListener('scroll', function () { if (window.pageYOffset > 40) hideHint(); kick(); }, { passive: true });
d.addEventListener('visibilitychange', function () { if (d.hidden && raf) { cancelAnimationFrame(raf); raf = 0; } else kick(); });

function hideHint() { if (hint && !hint.classList.contains('gone')) hint.classList.add('gone'); }

/* ---------- thanh cảnh ---------- */
bars.forEach(function (b, i) {
  b.addEventListener('click', function () {
    var span = pin.offsetHeight - stage.offsetHeight, top = pin.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({ top: top + span * (i === 0 ? 0 : (i + 0.18) / N), behavior: 'smooth' });
    hideHint();
  });
});

size(true);
cur = tgt = target(); draw();
var r0 = stage.parentNode.getBoundingClientRect(); active = r0.top < window.innerHeight && r0.bottom > 0; kick();
})();
