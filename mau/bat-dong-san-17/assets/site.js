/* Vọng Hà Residences — JS dùng chung (bat-dong-san-17). JS thuần, không thư viện. */
(function () {
'use strict';
var d = document, root = d.documentElement, body = d.body;
var $ = function (s, c) { return (c || d).querySelector(s); };
var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };
var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
var HEADLESS = /HeadlessChrome/.test(navigator.userAgent);
var KEY = 'bds17:';
var store = {
  get: function (k, def) { try { var v = localStorage.getItem(KEY + k); return v ? JSON.parse(v) : def; } catch (e) { return def; } },
  set: function (k, v) { try { localStorage.setItem(KEY + k, JSON.stringify(v)); } catch (e) {} }
};
var NF = new Intl.NumberFormat('vi-VN');
function vnd(v) { return NF.format(Math.round(v)) + 'đ'; }
function ty(v) { var t = v / 1e9; return (Math.round(t * 100) / 100).toString().replace('.', ',') + ' tỷ'; }
function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
function ic(n) { return '<svg class="ic" aria-hidden="true"><use href="#i-' + n + '"/></svg>'; }
if (HEADLESS) root.classList.add('headless');
if (RM) root.classList.add('rm');

/* ---------- header, badge, lên đầu ---------- */
var hdr = $('#hdr'), badge = $('#ktBadge'), totop = d.createElement('button');
totop.className = 'totop'; totop.type = 'button'; totop.setAttribute('aria-label', 'Lên đầu trang'); totop.innerHTML = ic('up');
body.appendChild(totop);
totop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' }); });
var ticking = false;
function onScroll() {
  ticking = false;
  var y = window.pageYOffset;
  hdr && hdr.classList.toggle('scrolled', y > 8);
  badge && badge.classList.toggle('show', y > window.innerHeight * .85);
  totop.classList.toggle('show', y > window.innerHeight * 1.4);
}
window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
onScroll();

/* ---------- menu mobile ---------- */
function lock(on) { body.classList.toggle('lock', on); root.style.overflow = on ? 'hidden' : ''; }
var mnav = $('#mnav'), burger = $('#burger');
function menu(open) {
  if (!mnav) return;
  mnav.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  burger.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
  mnav.setAttribute('aria-hidden', open ? 'false' : 'true');
  lock(open);
  if (open) { var a = $('a', mnav); a && a.focus({ preventScroll: true }); } else burger.focus({ preventScroll: true });
}
burger && burger.addEventListener('click', function () { menu(!mnav.classList.contains('open')); });
mnav && $$('a', mnav).forEach(function (a) { a.addEventListener('click', function () { menu(false); }); });
d.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') { if (mnav && mnav.classList.contains('open')) menu(false); if (LB.el && LB.el.classList.contains('open')) LB.close(); }
});
var lastW = window.innerWidth;
window.addEventListener('resize', function () {
  if (window.innerWidth === lastW) return; lastW = window.innerWidth;
  if (lastW > 1120 && mnav && mnav.classList.contains('open')) menu(false);
});

/* ---------- hiện dần ---------- */
var rvs = $$('.rv');
if (!('IntersectionObserver' in window) || RM) rvs.forEach(function (e) { e.classList.add('in'); });
else {
  var io = new IntersectionObserver(function (en) {
    en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
  rvs.forEach(function (e) {
    var r = e.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) e.classList.add('in'); else io.observe(e);
  });
}

/* ---------- lightbox: [data-lb="nhóm"] ---------- */
var LB = { el: null, list: [], i: 0, last: null };
function lbBuild() {
  var el = d.createElement('div'); el.className = 'lb'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'Xem ảnh toàn màn hình');
  el.innerHTML = '<figure><img alt=""><figcaption><b></b><span class="num"></span></figcaption></figure>' +
    '<button class="lb-btn lb-x" type="button" aria-label="Đóng">' + ic('x') + '</button>' +
    '<button class="lb-btn lb-p" type="button" aria-label="Ảnh trước">' + ic('left') + '</button>' +
    '<button class="lb-btn lb-n" type="button" aria-label="Ảnh sau">' + ic('right') + '</button>';
  body.appendChild(el); LB.el = el;
  $('.lb-x', el).addEventListener('click', function () { LB.close(); });
  $('.lb-p', el).addEventListener('click', function () { LB.show(LB.i - 1); });
  $('.lb-n', el).addEventListener('click', function () { LB.show(LB.i + 1); });
  el.addEventListener('click', function (e) { if (e.target === el) LB.close(); });
  el.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') LB.show(LB.i - 1);
    if (e.key === 'ArrowRight') LB.show(LB.i + 1);
    if (e.key === 'Tab') { var f = $$('button', el), a = f[0], z = f[f.length - 1]; if (e.shiftKey && d.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && d.activeElement === z) { e.preventDefault(); a.focus(); } }
  });
  var sx = 0; el.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
  el.addEventListener('touchend', function (e) { var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) LB.show(LB.i + (dx < 0 ? 1 : -1)); });
}
LB.show = function (i) {
  var n = LB.list.length; LB.i = (i + n) % n; var it = LB.list[LB.i], img = $('img', LB.el);
  img.classList.add('ld');
  img.onload = function () { img.classList.remove('ld'); };
  img.src = it.getAttribute('data-full'); img.alt = it.getAttribute('data-alt') || '';
  $('figcaption b', LB.el).textContent = it.getAttribute('data-cap') || '';
  $('figcaption span', LB.el).textContent = (LB.i + 1) + ' / ' + n;
};
LB.open = function (group, i) {
  if (!LB.el) lbBuild();
  LB.list = $$('[data-lb="' + group + '"]'); LB.last = d.activeElement;
  LB.show(i); LB.el.classList.add('open'); lock(true); $('.lb-x', LB.el).focus();
};
LB.close = function () { LB.el.classList.remove('open'); lock(false); LB.last && LB.last.focus({ preventScroll: true }); };
$$('[data-lb]').forEach(function (b) {
  b.addEventListener('click', function (e) {
    e.preventDefault(); var g = b.getAttribute('data-lb'); LB.open(g, $$('[data-lb="' + g + '"]').indexOf(b));
  });
});

/* ---------- form nhanh (trang chủ, trang con): [data-quick] ---------- */
function vPhone(v) { return /^0\d{9}$/.test(v.replace(/[\s.]/g, '')); }
function fieldErr(f, msg) {
  var w = f.closest('.field') || f.closest('.consent'); if (!w) return;
  w.classList.toggle('err', !!msg);
  var e = $('.ferr', w.closest('.field') ? w : w.parentNode);
  if (e) e.textContent = msg || '';
  f.setAttribute('aria-invalid', msg ? 'true' : 'false');
}
$$('form[data-quick]').forEach(function (fm) {
  fm.addEventListener('submit', function (e) {
    e.preventDefault(); var ok = true;
    $$('[required]', fm).forEach(function (f) {
      var msg = '';
      if (f.type === 'checkbox') msg = f.checked ? '' : 'Vui lòng đồng ý để chúng tôi liên hệ lại.';
      else if (!f.value.trim()) msg = 'Vui lòng nhập thông tin này.';
      else if (f.type === 'tel' && !vPhone(f.value)) msg = 'Số điện thoại gồm 10 số, bắt đầu bằng 0.';
      fieldErr(f, msg); if (msg && ok) { ok = false; f.focus(); }
    });
    if (!ok) return;
    var done = $('.qdone', fm.parentNode);
    fm.hidden = true; if (done) { done.hidden = false; done.focus(); }
  });
});


/* ---------- con trỏ tuỳ biến (chỉ máy có chuột), nút từ tính, chuyển trang ---------- */
var FINE = window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches;
if (FINE && !RM && !HEADLESS) {
  var cur = d.createElement('div'); cur.className = 'cur'; cur.setAttribute('aria-hidden', 'true'); cur.innerHTML = '<i></i><b><svg viewBox="0 0 64 64"><path d="M14 24a20 20 0 0 1 34-6M50 40a20 20 0 0 1-34 6"/><path d="M48 8v10H38M16 56V46h10"/></svg></b><span></span>';
  body.appendChild(cur); root.classList.add('has-cur');
  var cx = -100, cy = -100, mxT = -100, myT = -100, cRaf = 0, lab = cur.querySelector('span'), mode = '';
  var cLoop = function () {
    cRaf = 0; cx += (mxT - cx) * .22; cy += (myT - cy) * .22;
    cur.style.transform = 'translate3d(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px,0)';
    if (Math.abs(mxT - cx) > .3 || Math.abs(myT - cy) > .3) cRaf = requestAnimationFrame(cLoop);
  };
  var setMode = function (m, t) { if (m === mode) return; mode = m; cur.className = 'cur' + (m ? ' ' + m : '') + ' vis'; lab.textContent = t || ''; };
  d.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return;
    mxT = e.clientX; myT = e.clientY; cur.classList.add('vis');
    var el = e.target.closest ? e.target : null;
    if (el && el.closest('.hs')) setMode('c-hs', 'Xem');
    else if (el && el.closest('a, button, input, select, textarea, label, summary, [data-lb]')) setMode('c-link');
    else if (el && el.closest('.sb-canvas')) setMode('c-rot', 'Kéo');
    else if (el && el.closest('.fly-stage, .pano')) setMode('c-drag', 'Kéo');
    else setMode('');
    if (!cRaf) cRaf = requestAnimationFrame(cLoop);
  }, { passive: true });
  d.addEventListener('pointerleave', function () { cur.classList.remove('vis'); });
  d.addEventListener('pointerdown', function () { cur.classList.add('down'); });
  d.addEventListener('pointerup', function () { cur.classList.remove('down'); });
  // nút từ tính: dịch nhẹ theo con trỏ
  $$('.btn-gold, .arc-btn, .lb-btn, .totop').forEach(function (b) {
    b.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      var r = b.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      b.style.transform = 'translate3d(' + (dx * .18).toFixed(1) + 'px,' + (dy * .28).toFixed(1) + 'px,0)';
    });
    b.addEventListener('pointerleave', function () { b.style.transform = ''; });
  });
}
/* chuyển trang: trình duyệt có view-transition giữa trang thì dùng CSS; nếu không, che màn đen ngả màu rồi mới chuyển */
if (!RM && !('onpagereveal' in window)) {
  var pt = d.createElement('div'); pt.className = 'pt'; pt.setAttribute('aria-hidden', 'true'); body.appendChild(pt);
  d.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target || a.hasAttribute('download')) return;
    var u = new URL(a.href, location.href);
    if (u.origin !== location.origin || (u.pathname === location.pathname && u.hash) || !/\/mau\/bat-dong-san-17\//.test(u.pathname)) return;
    e.preventDefault(); pt.classList.add('on');
    setTimeout(function () { location.href = u.href; }, 320);
  });
  window.addEventListener('pageshow', function (e) { if (e.persisted) pt.classList.remove('on'); });
}

window.VH = { $: $, $$: $$, RM: RM, HEADLESS: HEADLESS, store: store, vnd: vnd, ty: ty, esc: esc, ic: ic, lock: lock, LB: LB, vPhone: vPhone, fieldErr: fieldErr, NF: NF };
})();
