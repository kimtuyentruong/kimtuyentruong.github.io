/* Vọng Hà Residences — trang chủ: mở màn, vòng cung loại căn 3D */
(function () {
'use strict';
var VH = window.VH, d = document, $ = VH.$, $$ = VH.$$;

/* ---------- mở màn: thanh letterbox rút, chữ trồi theo nhịp (≤ 1,2 giây) ---------- */
var hero = $('#hero');
if (hero) {
  if (VH.HEADLESS || VH.RM) hero.classList.add('on');
  else requestAnimationFrame(function () { requestAnimationFrame(function () { hero.classList.add('on'); }); });
  // parallax nhẹ cho ảnh nền theo cuộn (transform, không blur), dừng khi ra khỏi màn hình đầu
  var img = $('.hero-bg img', hero), heroH = hero.offsetHeight, pr = 0;
  if (!VH.RM && img) {
    window.addEventListener('scroll', function () {
      if (pr) return;
      pr = requestAnimationFrame(function () {
        pr = 0; var y = window.pageYOffset;
        if (y > heroH) return;
        img.style.transform = 'translate3d(0,' + (y * 0.18).toFixed(1) + 'px,0) scale(1.03)';
      });
    }, { passive: true });
  }
}

/* ---------- vòng cung 3D các loại căn ---------- */
var ring = $('#arcRing'), info = $('#arcInfo');
if (ring && info) {
  var U = window.VH_UNITS || [], cards = $$('.arc-card', ring), n = cards.length, cur = 1;
  var STEP = 19, RAD = 720, tiltX = 0, tiltY = 0;
  var mq = window.matchMedia('(max-width: 767px)');
  function place() {
    if (mq.matches) { cards.forEach(function (c) { c.style.transform = ''; }); ring.style.transform = ''; return; }
    cards.forEach(function (c, i) {
      c.style.transform = 'rotateY(' + (i * STEP) + 'deg) translateZ(' + RAD + 'px)';
    });
    ring.style.transform = 'translateZ(' + (-RAD) + 'px) rotateX(' + tiltX.toFixed(2) + 'deg) rotateY(' + (-cur * STEP + tiltY).toFixed(2) + 'deg)';
  }
  function show(i, fromScroll) {
    cur = (i + n) % n;
    cards.forEach(function (c, k) { c.setAttribute('aria-pressed', k === cur ? 'true' : 'false'); });
    var u = U[cur]; if (!u) return;
    $('.arc-name', info).textContent = u.name;
    var ad = $('.arc-d', info); if (ad) ad.textContent = u.d;
    $('[data-f=area]', info).textContent = u.area + ' m²';
    $('[data-f=fl]', info).textContent = u.fl;
    $('[data-f=view]', info).textContent = u.view;
    $('[data-f=price]', info).textContent = u.price;
    var lk = $('.link', info); if (lk) lk.setAttribute('href', 'can-ho/?loai=' + ['1pn', '2pn', 'duplex', 'ph'][cur]);
    info.classList.remove('fade'); void info.offsetWidth; info.classList.add('fade');
    if (mq.matches && !fromScroll) cards[cur].scrollIntoView({ behavior: VH.RM ? 'auto' : 'smooth', inline: 'center', block: 'nearest' });
    place();
  }
  cards.forEach(function (c, i) { c.addEventListener('click', function () { show(i); }); });
  $$('.arc-btn').forEach(function (b) { b.addEventListener('click', function () { show(cur + (+b.getAttribute('data-step'))); }); });
  ring.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); show(cur + 1); cards[cur].focus(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(cur - 1); cards[cur].focus(); }
  });
  // nghiêng nhẹ theo con trỏ (desktop)
  var arc = $('#arc'), pf = 0;
  if (!VH.RM) {
    arc.addEventListener('pointermove', function (e) {
      if (mq.matches || e.pointerType !== 'mouse' || pf) return;
      var r = arc.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
      pf = requestAnimationFrame(function () { pf = 0; tiltY = px * 8; tiltX = -py * 4; ring.style.transition = 'transform .5s cubic-bezier(.22,.8,.2,1)'; place(); });
    });
    arc.addEventListener('pointerleave', function () { tiltX = tiltY = 0; ring.style.transition = ''; place(); });
  }
  // điện thoại: thẻ nằm giữa dải trượt là thẻ đang chọn
  var st = 0;
  ring.addEventListener('scroll', function () {
    if (!mq.matches) return; clearTimeout(st);
    st = setTimeout(function () {
      var mid = ring.getBoundingClientRect().left + ring.clientWidth / 2, best = 0, bd = 1e9;
      cards.forEach(function (c, i) { var r = c.getBoundingClientRect(), dd = Math.abs(r.left + r.width / 2 - mid); if (dd < bd) { bd = dd; best = i; } });
      if (best !== cur) show(best, true);
    }, 120);
  }, { passive: true });
  var lw = window.innerWidth;
  window.addEventListener('resize', function () { if (window.innerWidth !== lw) { lw = window.innerWidth; place(); } });
  show(1, true);
}

/* ---------- header: trong suốt khi đang bay, đặc khi ra khỏi đoạn bay ---------- */
var hdr = $('#hdr'), pinEl = $('.fly-pin');
if (hdr && pinEl) {
  var hq = 0;
  var hs = function () { hq = 0; hdr.classList.toggle('solid', pinEl.getBoundingClientRect().bottom < 64); };
  window.addEventListener('scroll', function () { if (!hq) hq = requestAnimationFrame(hs); }, { passive: true }); hs();
}

/* ---------- vòng tiến độ: chạy số khi thấy ---------- */
var ringV = $('.ring-v');
if (ringV && 'IntersectionObserver' in window && !VH.RM && !VH.HEADLESS) {
  ringV.style.strokeDasharray = '0 100';
  new IntersectionObserver(function (en, o) {
    if (en[0].isIntersecting) { ringV.style.strokeDasharray = '62 100'; o.disconnect(); }
  }, { threshold: .4 }).observe(ringV);
}
})();
