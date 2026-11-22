/* Vọng Hà Residences — "máy quay bay" toàn màn ngay từ pixel đầu tiên (bản 3).
   - Màn tải: logo vẽ nét + % tải ảnh thật, mở bằng hai tấm màn trượt; có nút bỏ qua, tối đa ~2 giây.
   - Chuỗi ảnh trên <canvas>: dolly theo cuộn, zoom-through + crossfade, toà tháp tách đôi như cửa kính.
   - Chiều sâu: lớp hậu cảnh (ảnh) + lớp tiền cảnh vẽ tay (mây, hạt sáng, mép rèm) lệch nhiều tầng khi nhìn quanh.
   - Ngày ↔ đêm ở cảnh ngoài trời: lọc màu đêm, đèn cửa sổ bật dần, hồ bơi phát sáng.
   - Điểm sáng mở thẻ; chữ tiêu đề hiện từng ký tự, số liệu đếm lên khi vào cảnh.
   Không thư viện, chỉ requestAnimationFrame; dừng vẽ khi khuất. */
(function () {
'use strict';
var d = document, root = d.documentElement, sec = d.getElementById('fly');
if (!sec) return;
var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
var HEADLESS = /HeadlessChrome/.test(navigator.userAgent);
var intro = d.getElementById('intro');
var cv = sec.querySelector('.fly-cv'), ctx = cv.getContext && cv.getContext('2d');
if (RM || !ctx) { if (intro) intro.remove(); return; }   // giảm chuyển động: ảnh tĩnh từng cảnh
sec.classList.remove('static');

var pin = sec.querySelector('.fly-pin'), stage = sec.querySelector('.fly-stage');
var caps = Array.prototype.slice.call(sec.querySelectorAll('.sc'));
var bars = Array.prototype.slice.call(sec.querySelectorAll('.fly-prog button'));
var hint = sec.querySelector('.fly-hint'), hsLayer = sec.querySelector('.fly-hs'), card = sec.querySelector('.hs-card');
var dnBtn = sec.querySelector('.dn');
var N = caps.length, T = 0.3, DOOR = 2;
var mobile = window.innerWidth < 768, CROP = 0.6;
function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
function easeIn(t) { return t * t * t; }
function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
function rnd(seed) { var x = Math.sin(seed * 9301 + 49297) * 233280; return x - Math.floor(x); }

var SC = caps.map(function (li) {
  var ar = +li.getAttribute('data-ar') || 1.5, kf = mobile ? Math.min(1, CROP / ar) : 1;
  function mu(u) { return 0.5 + (u - 0.5) / kf; }
  var hs = []; try { hs = JSON.parse(li.getAttribute('data-hs') || '[]'); } catch (e) {}
  return { id: li.getAttribute('data-img'), fx: mu(+li.getAttribute('data-fx')), fy: +li.getAttribute('data-fy'),
           z0: +li.getAttribute('data-z0'), z1: +li.getAttribute('data-z1'), fg: li.getAttribute('data-fg') || '',
           ext: li.getAttribute('data-ext') === '1', img: null, ok: false, mu: mu,
           hs: hs.map(function (h) { return { u: mu(h[0]), v: h[1], t: h[2], d: h[3] }; }).filter(function (h) { return h.u > 0.06 && h.u < 0.94; }) };
});

/* ---------- chữ tiêu đề: tách từng ký tự (giữ nguyên từ để không ngắt giữa từ) ---------- */
function splitChars(el) {
  var n = 0, label = el.textContent;
  (function walk(node) {
    Array.prototype.slice.call(node.childNodes).forEach(function (c) {
      if (c.nodeType === 3) {
        var frag = d.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach(function (w) {
          if (!w) return;
          if (/^\s+$/.test(w)) { frag.appendChild(d.createTextNode(' ')); return; }
          var ws = d.createElement('span'); ws.className = 'w'; ws.setAttribute('aria-hidden', 'true');
          w.split('').forEach(function (ch) { var s = d.createElement('span'); s.className = 'ch'; s.style.setProperty('--i', n++); s.textContent = ch; ws.appendChild(s); });
          frag.appendChild(ws);
        });
        c.parentNode.replaceChild(frag, c);
      } else if (c.nodeType === 1) walk(c);
    });
  })(el);
  var sr = d.createElement('span'); sr.className = 'sr'; sr.textContent = label; el.appendChild(sr);
}
caps.forEach(function (li) { var t = li.querySelector('.sc-t'); if (t) splitChars(t); });
function countUp(li) {
  li.querySelectorAll('.sc-stats b').forEach(function (b) {
    var raw = b.getAttribute('data-v') || b.textContent; b.setAttribute('data-v', raw);
    var m = raw.match(/^([\d.]+)(?:,(\d+))?(.*)$/); if (!m) return;
    var intp = +m[1].replace(/\./g, ''), dec = m[2] || '', target = +(intp + (dec ? '.' + dec : '')), t0 = performance.now();
    (function step(now) {
      var k = clamp((now - t0) / 900, 0, 1), v = target * easeOut(k);
      var s = dec ? v.toFixed(dec.length).replace('.', ',') : Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      b.textContent = s + m[3];
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  });
}

/* ---------- tải ảnh + màn mở đầu ---------- */
var loadedN = 0, introDone = !intro, introStart = performance.now(), introZ = 0, introT0 = 0;
function src(id) { return 'https://images.unsplash.com/photo-' + id + '?auto=format&fit=crop&q=72&' + (mobile ? 'w=900&h=1500' : 'w=1800'); }
SC.forEach(function (s, i) {
  var im = new Image(); im.decoding = 'async';
  if (i === 0 && 'fetchPriority' in im) im.fetchPriority = 'high';
  im.onload = im.onerror = function () { if (im.naturalWidth) s.ok = true; loadedN++; if (i === 0) sec.classList.add('ready'); progress(); kick(); };
  im.src = src(s.id); s.img = im;
});
var pEl = intro && intro.querySelector('.intro-p'), pBar = intro && intro.querySelector('.intro-bar i'), shown = 0;
function progress() {
  if (introDone) return;
  var tg = loadedN / N * 100;
  if (pBar) pBar.style.transform = 'scaleX(' + (tg / 100).toFixed(3) + ')';
  (function tick() {
    if (introDone) return;
    shown += (tg - shown) * 0.25; if (tg - shown < 0.6) shown = tg;
    if (pEl) pEl.textContent = Math.round(shown);
    if (shown < tg) requestAnimationFrame(tick);
  })();
  if (loadedN >= N && SC[0].ok) setTimeout(openIntro, Math.max(0, 1100 - (performance.now() - introStart)));
}
function openIntro() {
  if (introDone) return; introDone = true;
  if (!intro) return;
  intro.classList.add('out'); introZ = 1; introT0 = performance.now(); kick();
  setTimeout(function () { if (intro.parentNode) intro.remove(); }, 1100);
}
if (intro) {
  if (HEADLESS) { intro.remove(); introDone = true; }
  else {
    intro.querySelector('.intro-skip').addEventListener('click', openIntro);
    setTimeout(function () {
      if (SC[0].ok) { openIntro(); return; }
      var w = setInterval(function () { if (SC[0].ok) { clearInterval(w); openIntro(); } }, 100);
      setTimeout(function () { clearInterval(w); openIntro(); }, 3000);
    }, 2000);
  }
}

/* ---------- kích thước: DPR ≤ 2, chỉ dựng lại khi chiều ngang đổi thật ---------- */
var W = 0, H = 0, CW = 0, CH = 0, DPR = 1, lastW = -1;
function size(force) {
  var w = stage.clientWidth, h = stage.clientHeight;
  if (!force && w === lastW) return;
  lastW = w; CW = w; CH = h; DPR = Math.min(2, window.devicePixelRatio || 1);
  W = Math.round(w * DPR); H = Math.round(h * DPR); cv.width = W; cv.height = H; buildFx(); kick();
}
window.addEventListener('resize', function () { size(false); });
window.addEventListener('orientationchange', function () { setTimeout(function () { size(true); }, 250); });
function target() { var r = pin.getBoundingClientRect(), span = pin.offsetHeight - stage.offsetHeight; return clamp(-r.top / (span || 1), 0, 1); }

/* ---------- nhìn quanh ---------- */
var pan = { x: 0, y: 0 }, panT = { x: 0, y: 0 }, lastAct = -1e9, interacted = false, t0 = performance.now();
var LOOK = 1.07;
function act() { lastAct = performance.now(); if (!interacted) { interacted = true; hideHint(); } kick(); }
stage.addEventListener('pointermove', function (e) {
  if (e.pointerType !== 'mouse') return;
  var r = stage.getBoundingClientRect();
  panT.x = clamp(((e.clientX - r.left) / r.width - .5) * 2, -1, 1);
  panT.y = clamp(((e.clientY - r.top) / r.height - .5) * 2, -1, 1);
  lastAct = performance.now(); kick();
});
var drag = null;
stage.addEventListener('pointerdown', function (e) { if (e.target.closest('button, a')) return; drag = { x: e.clientX, y: e.clientY, px: panT.x, py: panT.y, id: e.pointerId }; });
stage.addEventListener('pointermove', function (e) {
  if (!drag || e.pointerId !== drag.id) return;
  var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
  if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
  panT.x = clamp(drag.px - dx / (CW * .5), -1, 1);
  if (e.pointerType === 'mouse') panT.y = clamp(drag.py - dy / (CH * .5), -1, 1);
  act();
});
function endDrag() { drag = null; }
stage.addEventListener('pointerup', endDrag); stage.addEventListener('pointercancel', endDrag);
stage.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') endDrag(); });
stage.addEventListener('keydown', function (e) {
  var k = { ArrowLeft: [-.25, 0], ArrowRight: [.25, 0], ArrowUp: [0, -.25], ArrowDown: [0, .25] }[e.key];
  if (!k || e.target !== stage) return;
  e.preventDefault(); panT.x = clamp(panT.x + k[0], -1, 1); panT.y = clamp(panT.y + k[1], -1, 1); act();
});

/* ---------- ngày ↔ đêm ---------- */
var night = 0, nightT = 0;
if (dnBtn) dnBtn.addEventListener('click', function () {
  nightT = nightT > .5 ? 0 : 1;
  dnBtn.setAttribute('aria-pressed', nightT ? 'true' : 'false');
  dnBtn.querySelector('.dn-l').textContent = nightT ? 'Đêm' : 'Ngày';
  act();
});

/* ---------- lớp tiền cảnh: mây, hạt sáng, đèn cửa sổ (dựng sẵn, chỉ dựng lại khi đổi khổ) ---------- */
var FX = {};
function buildFx() {
  var i;
  FX.clouds = []; for (i = 0; i < 7; i++) FX.clouds.push({ x: rnd(i + 1), y: .05 + rnd(i + 11) * .35, r: .18 + rnd(i + 21) * .22, d: .6 + rnd(i + 31) * 1.4, a: .05 + rnd(i + 41) * .07, s: .004 + rnd(i + 51) * .006 });
  FX.bokeh = []; for (i = 0; i < (mobile ? 14 : 24); i++) FX.bokeh.push({ x: rnd(i + 61), y: rnd(i + 71), r: 2 + rnd(i + 81) * 9, d: .4 + rnd(i + 91) * 2, a: .12 + rnd(i + 101) * .28, ph: rnd(i + 111) * 6.28 });
  // đèn cửa sổ toà tháp (ảnh gốc: thân tháp u .31–.61, v .15–.97; khối thấp bên phải u .67–.97, v .5–.97)
  // lưới cửa sổ theo hàng tầng; mỗi ô có ngưỡng bật đèn riêng để đèn bật dần
  FX.win = [];
  var cu, rv;
  for (rv = 0; rv < 52; rv++) for (cu = 0; cu < 14; cu++) {
    var sd = rv * 31 + cu * 7 + 1; if (rnd(sd) > .3) continue;
    FX.win.push({ u: SC[1] ? SC[1].mu(.335 + cu * .019) : .335 + cu * .019, v: .16 + rv * .0155, th: rnd(sd + 3) * .85, w: .009 });
  }
  for (rv = 0; rv < 20; rv++) for (cu = 0; cu < 12; cu++) {
    var sd2 = 900 + rv * 17 + cu * 5; if (rnd(sd2) > .25) continue;
    FX.win.push({ u: SC[1] ? SC[1].mu(.7 + cu * .024) : .7 + cu * .024, v: .64 + rv * .0155, th: rnd(sd2 + 3) * .85, w: .011 });
  }
  FX.city = []; for (i = 0; i < 60; i++) FX.city.push({ u: rnd(i + 701), v: .55 + rnd(i + 801) * .4, th: rnd(i + 901) * .7 });
}

/* vẽ ảnh phủ kín (cover), giữ điểm nhìn, cộng độ lệch nhìn quanh; kẹp để không lộ mép */
var geo = [];
function cover(s, z, alpha, idx) {
  var im = s.img; if (!s.ok || alpha <= 0) return;
  var iw = im.naturalWidth, ih = im.naturalHeight, base = Math.max(W / iw, H / ih), sc = base * z * LOOK;
  var dw = iw * sc, dh = ih * sc;
  var fxs = (W - iw * base) / 2 + s.fx * iw * base, fys = (H - ih * base) / 2 + s.fy * ih * base;
  var x = clamp(fxs - s.fx * dw - pan.x * (dw - W) * .42, W - dw, 0), y = clamp(fys - s.fy * dh - pan.y * (dh - H) * .42, H - dh, 0);
  ctx.globalAlpha = alpha; ctx.drawImage(im, x, y, dw, dh); ctx.globalAlpha = 1;
  if (idx !== undefined) geo[idx] = { x: x, y: y, w: dw, h: dh };
}
function zoomAt(i, s) {
  var a = i === 0 ? 0 : i - T, b = i === N - 1 ? N : i + 1 - T;
  return SC[i].z0 + (SC[i].z1 - SC[i].z0) * clamp((s - a) / (b - a), 0, 1);
}
function doors(s, k) {
  var sc = SC[DOOR - 1]; if (!sc.ok) return;
  var half = W / 2, open = ease(clamp((k - 0.12) / 0.88, 0, 1)), off = open * (half + 60 * DPR), z = zoomAt(DOOR - 1, s) * (1 + 0.22 * easeIn(k));
  for (var side = 0; side < 2; side++) {
    var dx = side === 0 ? -off : off, x0 = (side === 0 ? 0 : half) + dx;
    ctx.save(); ctx.beginPath(); ctx.rect(x0, 0, half, H); ctx.clip();
    ctx.translate(dx, 0); cover(sc, z, 1); ctx.translate(-dx, 0);
    if (night > 0.01) nightTint(night);
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

/* ---------- tiền cảnh theo loại cảnh (lệch nhiều hơn hậu cảnh để có chiều sâu) ---------- */
function fgLayer(i, alpha, now) {
  if (alpha <= 0.01) return;
  var type = SC[i].fg, tt = now / 1000, g, k, x, y, r;
  if (type === 'clouds') {
    for (k = 0; k < FX.clouds.length; k++) {
      var c = FX.clouds[k];
      x = ((c.x + tt * c.s) % 1.4 - .2) * W - pan.x * c.d * W * .06; y = c.y * H - pan.y * c.d * H * .04; r = c.r * W;
      var ca = c.a * alpha * (1 - night * .6);
      g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, 'rgba(255,238,220,' + ca.toFixed(3) + ')'); g.addColorStop(1, 'rgba(255,238,220,0)');
      ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }
  } else if (type === 'bokeh') {
    ctx.globalCompositeOperation = 'lighter';
    for (k = 0; k < FX.bokeh.length; k++) {
      var b = FX.bokeh[k];
      x = b.x * W - pan.x * b.d * W * .05; y = ((b.y - tt * .006 * b.d) % 1 + 1) % 1 * H - pan.y * b.d * H * .04;
      r = b.r * DPR * (0.7 + b.d * .4);
      var ba = b.a * alpha * (0.6 + 0.4 * Math.sin(tt * 1.3 + b.ph));
      g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, 'rgba(255,214,150,' + ba.toFixed(3) + ')'); g.addColorStop(1, 'rgba(255,214,150,0)');
      ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }
    ctx.globalCompositeOperation = 'source-over';
  } else if (type === 'frame') {
    var off = -pan.x * W * .05, fw = W * .1;
    g = ctx.createLinearGradient(off, 0, off + fw, 0);
    g.addColorStop(0, 'rgba(8,6,5,' + (.75 * alpha).toFixed(3) + ')'); g.addColorStop(1, 'rgba(8,6,5,0)');
    ctx.fillStyle = g; ctx.fillRect(off - W * .05, 0, fw + W * .05, H);
    g = ctx.createLinearGradient(W + off - fw, 0, W + off, 0);
    g.addColorStop(0, 'rgba(8,6,5,0)'); g.addColorStop(1, 'rgba(8,6,5,' + (.6 * alpha).toFixed(3) + ')');
    ctx.fillStyle = g; ctx.fillRect(W + off - fw, 0, fw + W * .05, H);
  }
}
/* lớp đêm cho cảnh ngoài trời */
function nightTint(n) {
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillStyle = 'rgb(' + Math.round(255 - 205 * n) + ',' + Math.round(255 - 190 * n) + ',' + Math.round(255 - 140 * n) + ')';
  ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'source-over';
}
function nightLayer(i, alpha) {
  if (night < 0.01 || alpha <= 0.01 || !SC[i].ext) return;
  var n = night * alpha, gm = geo[i], k, x, y, g;
  nightTint(n * (i === N - 1 ? .72 : i === 0 ? .85 : 1));
  if (!gm) return;
  ctx.globalCompositeOperation = 'lighter';
  if (i === 1) {
    for (k = 0; k < FX.win.length; k++) {
      var w = FX.win[k], a = clamp((night - w.th) * 3, 0, 1) * alpha; if (a <= 0) continue;
      x = gm.x + w.u * gm.w; y = gm.y + w.v * gm.h;
      ctx.fillStyle = 'rgba(255,190,115,' + (a * .5).toFixed(3) + ')';
      ctx.fillRect(x, y, gm.w * w.w, gm.h * .0045);
    }
  } else if (i === 0) {
    for (k = 0; k < FX.city.length; k++) {
      var c = FX.city[k], ca = clamp((night - c.th) * 3, 0, 1) * alpha; if (ca <= 0) continue;
      x = gm.x + c.u * gm.w; y = gm.y + c.v * gm.h;
      g = ctx.createRadialGradient(x, y, 0, x, y, 7 * DPR);
      g.addColorStop(0, 'rgba(255,200,130,' + (ca * .6).toFixed(3) + ')'); g.addColorStop(1, 'rgba(255,200,130,0)');
      ctx.fillStyle = g; ctx.fillRect(x - 7 * DPR, y - 7 * DPR, 14 * DPR, 14 * DPR);
    }
  } else if (i === N - 1) {
    x = gm.x + SC[i].mu(.42) * gm.w; y = gm.y + .8 * gm.h;
    g = ctx.createRadialGradient(x, y, 0, x, y, gm.w * .35);
    g.addColorStop(0, 'rgba(60,170,200,' + (.35 * n).toFixed(3) + ')'); g.addColorStop(1, 'rgba(60,170,200,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    for (k = 0; k < FX.city.length; k++) {           // thành phố bên kia lên đèn dọc chân trời
      var cc = FX.city[k], a2 = clamp((night - cc.th) * 3, 0, 1) * alpha; if (a2 <= 0) continue;
      x = gm.x + cc.u * gm.w; y = gm.y + (.44 + (cc.v - .55) * .3) * gm.h;
      g = ctx.createRadialGradient(x, y, 0, x, y, 5 * DPR);
      g.addColorStop(0, 'rgba(255,205,140,' + (a2 * .7).toFixed(3) + ')'); g.addColorStop(1, 'rgba(255,205,140,0)');
      ctx.fillStyle = g; ctx.fillRect(x - 5 * DPR, y - 5 * DPR, 10 * DPR, 10 * DPR);
    }
    g = ctx.createLinearGradient(0, gm.y + .42 * gm.h, 0, gm.y + .6 * gm.h);
    g.addColorStop(0, 'rgba(255,150,80,0)'); g.addColorStop(.6, 'rgba(255,150,80,' + (.22 * n).toFixed(3) + ')'); g.addColorStop(1, 'rgba(255,150,80,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }
  ctx.globalCompositeOperation = 'source-over';
}

/* ---------- chữ từng cảnh: hiện theo ký tự, số đếm lên ---------- */
function caption(i, s) {
  var a = i === 0 ? -1 : i + 0.04, b = i === N - 1 ? N + 1 : i + 1 - T - 0.02, f = 0.1;
  var o = s < a || s > b ? 0 : clamp(Math.min((s - a) / f, (b - s) / f), 0, 1);
  if (!introDone) o = 0;
  var el = caps[i]; if (el._o === o) return; el._o = o;
  if (o > 0.5 && !el._on) { el._on = true; el.classList.add('on'); countUp(el); }
  else if (o < 0.5 && el._on) { el._on = false; el.classList.remove('on'); }
}

/* ---------- điểm sáng ---------- */
var hsScene = -1, hsBtns = [], openHs = null;
function buildHs(i) {
  hsScene = i; closeCard(); hsLayer.innerHTML = '';
  hsBtns = SC[i].hs.map(function (h) {
    var b = d.createElement('button');
    b.type = 'button'; b.className = 'hs'; b.setAttribute('aria-label', h.t); b.setAttribute('aria-expanded', 'false');
    b.innerHTML = '<i></i>';
    b.addEventListener('click', function (e) { e.stopPropagation(); toggleCard(b, h); act(); });
    hsLayer.appendChild(b); return b;
  });
}
function placeHs(i, vis) {
  if (i !== hsScene) buildHs(i);
  if (!introDone) vis = 0;
  hsLayer.style.opacity = vis.toFixed(3);
  hsLayer.style.visibility = vis > 0.05 ? 'visible' : 'hidden';
  var g = geo[i]; if (!g) return;
  SC[i].hs.forEach(function (h, k) {
    var x = (g.x + h.u * g.w) / DPR, y = (g.y + h.v * g.h) / DPR, b = hsBtns[k];
    b.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
    b.style.display = x > 24 && x < CW - 24 && y > 90 && y < CH - 130 ? '' : 'none';
    if (openHs && openHs.b === b) placeCard(x, y);
  });
  if (vis < 0.2 && openHs) closeCard();
}
function toggleCard(b, h) {
  if (openHs && openHs.b === b) { closeCard(); return; }
  closeCard();
  card.querySelector('b').textContent = h.t; card.querySelector('span').textContent = h.d;
  card.hidden = false; b.setAttribute('aria-expanded', 'true'); b.classList.add('on'); openHs = { b: b };
  draw(performance.now());
}
function placeCard(x, y) {
  var w = card.offsetWidth || 220, left = clamp(x + 24, 12, CW - w - 12);
  if (x + 24 + w > CW - 12) left = clamp(x - w - 24, 12, CW - w - 12);
  card.style.transform = 'translate3d(' + left.toFixed(0) + 'px,' + clamp(y - 30, 90, CH - 170).toFixed(0) + 'px,0)';
}
function closeCard() { if (!openHs) return; openHs.b.setAttribute('aria-expanded', 'false'); openHs.b.classList.remove('on'); openHs = null; card.hidden = true; }
stage.addEventListener('click', function (e) { if (!e.target.closest('.hs, .hs-card')) closeCard(); });
d.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeCard(); });

/* ---------- một khung hình ---------- */
var cur = 0, tgt = 0, active = false, raf = 0, curScene = -1;
function draw(now) {
  var s = clamp(cur * N, 0, N - 0.0001), i = Math.floor(s), t = s - i;
  ctx.fillStyle = '#070605'; ctx.fillRect(0, 0, W, H);
  var inTrans = i < N - 1 && t > 1 - T, k = inTrans ? (t - (1 - T)) / T : 0;
  var iz = 1;                                        // mở màn: camera lùi từ gần ra
  if (introZ) { var q = clamp((now - introT0) / 1400, 0, 1); iz = 1 + 0.16 * (1 - easeOut(q)); if (q >= 1) introZ = 0; }
  var main = i;
  if (!inTrans) { cover(SC[i], zoomAt(i, s) * iz, 1, i); nightLayer(i, 1); fgLayer(i, 1, now); }
  else {
    var j = i + 1;
    cover(SC[j], zoomAt(j, s), 1, j); nightLayer(j, 1); fgLayer(j, k, now);
    if (j === DOOR) doors(s, k);
    else {
      var fa = clamp((k - 0.15) / 0.7, 0, 1), al = 1 - fa * fa * (3 - 2 * fa);
      if (al > 0.01) {
        // vẽ cảnh trước lên lớp riêng bằng clip-alpha: đơn giản hoá bằng vẽ ảnh + phủ đêm theo alpha
        cover(SC[i], zoomAt(i, s) * (1 + 1.1 * easeIn(k)), al, i);
        if (SC[i].ext && night > 0.01) { ctx.globalAlpha = al; nightTint(night); ctx.globalAlpha = 1; }
      }
    }
    main = k > .5 ? j : i;
  }
  ctx.globalCompositeOperation = 'soft-light';
  ctx.fillStyle = 'rgba(255,170,100,.16)'; ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'source-over';

  for (var c = 0; c < N; c++) caption(c, s);
  var hv = inTrans ? 0 : (i === 0 ? 1 : clamp((t - 0.06) / 0.08, 0, 1)) * (i === N - 1 ? 1 : clamp((1 - T - t) / 0.06, 0, 1));
  placeHs(i, hv);
  if (main !== curScene) { curScene = main; if (dnBtn) dnBtn.classList.toggle('show', SC[main].ext); }
  for (var b = 0; b < N; b++) {
    var f = clamp(s - b, 0, 1);
    if (bars[b]._f !== f) { bars[b]._f = f; bars[b].firstChild.firstChild.style.transform = 'scaleX(' + f.toFixed(3) + ')'; }
    var on = b === main;
    if (bars[b]._on !== on) { bars[b]._on = on; bars[b].classList.toggle('on', on); on ? bars[b].setAttribute('aria-current', 'step') : bars[b].removeAttribute('aria-current'); }
  }
}

/* ---------- vòng lặp: chỉ chạy khi đoạn bay trong khung nhìn ---------- */
function loop(now) {
  raf = 0; if (!active) return;
  tgt = target();
  var diff = tgt - cur; cur = Math.abs(diff) < 0.0004 ? tgt : cur + diff * 0.14;
  var idle = now - lastAct > 2600;
  if (idle && !HEADLESS) { var tt = (now - t0) / 1000; panT.x = Math.sin(tt * 0.23) * 0.55; panT.y = Math.sin(tt * 0.31) * 0.28; }
  var lk = idle ? 0.025 : 0.09;
  pan.x += (panT.x - pan.x) * lk; pan.y += (panT.y - pan.y) * lk;
  night += (nightT - night) * 0.05; if (Math.abs(nightT - night) < 0.002) night = nightT;
  draw(now);
  root.classList.toggle('flying', tgt > 0.002 && tgt < 0.998);
  if (!HEADLESS || cur !== tgt || night !== nightT || introZ) raf = requestAnimationFrame(loop);
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

bars.forEach(function (b, i) {
  b.addEventListener('click', function () {
    var span = pin.offsetHeight - stage.offsetHeight, top = pin.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({ top: top + span * (i === 0 ? 0 : (i + 0.18) / N), behavior: 'smooth' });
    hideHint();
  });
});

size(true);
cur = tgt = target(); draw(performance.now());
var r0 = stage.parentNode.getBoundingClientRect(); active = r0.top < window.innerHeight && r0.bottom > 0; kick();
})();
