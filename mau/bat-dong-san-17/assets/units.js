/* Vọng Hà Residences — bảng căn (dữ liệu mẫu), mặt bằng SVG, bộ lọc, hộp chi tiết */
(function () {
'use strict';
var VH = window.VH, d = document, $ = VH.$, $$ = VH.$$;
var TYPES = {
  '1pn': { lab: '1PN+', name: '1 phòng ngủ +', bed: '1 + đa năng', wc: 1, ppm: 128e6 },
  '2pn': { lab: '2PN', name: '2 phòng ngủ', bed: '2', wc: 2, ppm: 134e6 },
  'duplex': { lab: 'Duplex', name: 'Duplex 3 phòng ngủ', bed: '3', wc: 3, ppm: 142e6 },
  'ph': { lab: 'Penthouse', name: 'Penthouse sân vườn', bed: '4', wc: 5, ppm: 0 }
};
/* mặt bằng minh hoạ: [x, y, w, h, nhãn, loại] trong khung 400 x 260 */
var PLANS = {
  '1pn': [[0, 0, 220, 150, 'Khách + bếp'], [220, 0, 180, 150, 'Phòng ngủ'], [0, 150, 130, 110, 'Đa năng'], [130, 150, 90, 110, 'WC'], [220, 150, 180, 110, 'Ban công', 'b']],
  '2pn': [[0, 0, 200, 160, 'Phòng khách'], [200, 0, 90, 100, 'Bếp'], [290, 0, 110, 140, 'Ngủ 1'], [0, 160, 130, 100, 'Ngủ 2'], [130, 160, 80, 100, 'WC'], [210, 100, 80, 160, 'WC'], [290, 140, 110, 120, 'Ban công', 'b']],
  'duplex': [[0, 0, 190, 150, 'Khách (thông tầng)'], [0, 150, 110, 110, 'Bếp'], [110, 150, 80, 110, 'WC'], [210, 0, 190, 110, 'Ngủ chính'], [210, 110, 100, 150, 'Ngủ 2'], [310, 110, 90, 70, 'WC'], [310, 180, 90, 80, 'Ngủ 3']],
  'ph': [[0, 0, 220, 130, 'Phòng khách'], [220, 0, 180, 90, 'Bếp + ăn'], [220, 90, 90, 80, 'Ngủ 2'], [310, 90, 90, 80, 'Ngủ 3'], [0, 130, 140, 130, 'Ngủ chính'], [140, 130, 80, 130, 'WC'], [220, 170, 180, 90, 'Hồ bơi + vườn', 'p']]
};
function plan(type, big) {
  var r = PLANS[type], s = '<svg viewBox="-6 -6 412 272" role="img" aria-label="Mặt bằng minh hoạ căn ' + TYPES[type].lab + '">';
  r.forEach(function (x) {
    var fill = x[5] === 'b' ? 'rgba(212,178,122,.08)' : x[5] === 'p' ? 'rgba(80,140,150,.22)' : '#16130F';
    s += '<rect x="' + x[0] + '" y="' + x[1] + '" width="' + x[2] + '" height="' + x[3] + '" fill="' + fill + '" stroke="#D4B27A" stroke-opacity=".55" stroke-width="' + (big ? 2 : 2.5) + '"/>';
    s += '<text x="' + (x[0] + x[2] / 2) + '" y="' + (x[1] + x[3] / 2 + 5) + '" text-anchor="middle" fill="#B9AE9F" font-family="Inter,sans-serif" font-size="' + (big ? 13 : 15) + '">' + x[4] + '</text>';
  });
  if (big) s += '<path d="M380 238l10-14 10 14M390 224v30" stroke="#D4B27A" fill="none" stroke-width="1.5"/><text x="390" y="218" text-anchor="middle" fill="#D4B27A" font-size="11" font-family="Inter,sans-serif">B</text>';
  return s + '</svg>';
}
function h(str) { var x = 2166136261; for (var i = 0; i < str.length; i++) { x ^= str.charCodeAt(i); x = Math.imul(x, 16777619); } return (x >>> 0) / 4294967295; }
/* sinh bảng căn mẫu */
var UNITS = [], FLOORS = [9, 14, 20, 26, 32, 38];
var STACK = [['2pn', 86, 'Sông, căn góc', 'song', 'Đông Nam'], ['2pn', 78, 'Sông', 'song', 'Đông Nam'], ['1pn', 62, 'Sông', 'song', 'Đông'],
             ['1pn', 56, 'Thành phố', 'tp', 'Tây'], ['1pn', 62, 'Thành phố', 'tp', 'Tây Bắc'], ['2pn', 86, 'Thành phố, căn góc', 'tp', 'Tây Nam']];
function add(type, fl, st, area, view, vk, dir) {
  var code = 'VH-' + fl + '.' + ('0' + st).slice(-2), T = TYPES[type], k = 1 + (fl - 8) * 0.006;
  if (vk === 'song') k *= 1.05; if (/góc/.test(view)) k *= 1.04;
  var price = T.ppm ? Math.round(area * T.ppm * k / 1e7) * 1e7 : 0;
  UNITS.push({ code: code, type: type, fl: fl, area: area, view: view, vk: vk, dir: dir, price: price, hold: h(code) < 0.22 });
}
FLOORS.forEach(function (fl) { STACK.forEach(function (s, i) { add(s[0], fl, i + 1, s[1], s[2], s[3], s[4]); }); });
[41, 43].forEach(function (fl) { add('duplex', fl, 1, 168, 'Sông và trung tâm', 'song', 'Đông Nam'); add('duplex', fl, 2, 168, 'Thành phố', 'tp', 'Tây Bắc'); });
add('ph', 45, 1, 312, 'Trọn 360°', 'song', 'Bốn hướng'); add('ph', 45, 2, 312, 'Trọn 360°', 'tp', 'Bốn hướng');

/* ---------- bộ lọc ---------- */
var F = { type: 'all', view: 'all', fl: 'all', max: 40 };
var q = new URLSearchParams(location.search).get('loai');
if (q && TYPES[q]) F.type = q;
var grid = $('#ugrid'), cnt = $('#fcount'), rng = $('#f-max'), out = $('#f-max-o');
function priceTxt(u) { return u.price ? VH.ty(u.price) : 'Liên hệ'; }
function okFl(u) { return F.fl === 'all' || (F.fl === 'lo' && u.fl <= 20) || (F.fl === 'mid' && u.fl > 20 && u.fl <= 32) || (F.fl === 'hi' && u.fl > 32); }
function render() {
  var L = UNITS.filter(function (u) {
    return (F.type === 'all' || u.type === F.type) && (F.view === 'all' || u.vk === F.view) && okFl(u) &&
      (F.max >= 40 || (u.price && u.price <= F.max * 1e9));
  });
  cnt.textContent = L.length;
  if (!L.length) { grid.innerHTML = '<p class="empty">Chưa có căn khớp bộ lọc. Thử nới ngân sách hoặc chọn "Tất cả" ở tầm nhìn.</p>'; return; }
  grid.innerHTML = L.map(function (u, i) {
    var T = TYPES[u.type];
    return '<article class="ucard" style="animation-delay:' + Math.min(i, 12) * 30 + 'ms">' +
      '<div class="ucard-top"><span class="ucode">' + u.code + '</span><span class="ust' + (u.hold ? ' hold' : '') + '">' + (u.hold ? 'Đang giữ chỗ' : 'Còn trống') + '</span></div>' +
      '<div class="uplan">' + plan(u.type) + '</div>' +
      '<div class="umeta"><span>Loại<b>' + T.lab + '</b></span><span>Thông thuỷ<b class="num">' + u.area + ' m²</b></span><span>Tầng<b class="num">' + u.fl + '</b></span><span>Tầm nhìn<b>' + u.view + '</b></span></div>' +
      '<div class="uprice"><b class="num">' + priceTxt(u) + '</b><button class="btn btn-line" type="button" data-code="' + u.code + '">Xem chi tiết</button></div></article>';
  }).join('');
}
function syncChips() {
  $$('.chips').forEach(function (g) {
    var k = g.getAttribute('data-f');
    $$('.chip', g).forEach(function (c) { c.setAttribute('aria-pressed', c.getAttribute('data-v') === F[k] ? 'true' : 'false'); });
  });
}
$$('.chips').forEach(function (g) {
  g.addEventListener('click', function (e) {
    var c = e.target.closest('.chip'); if (!c) return;
    F[g.getAttribute('data-f')] = c.getAttribute('data-v'); syncChips(); render();
  });
});
function rngTxt() { F.max = +rng.value; out.textContent = F.max >= 40 ? 'Không giới hạn' : 'Dưới ' + F.max + ' tỷ'; }
rng.addEventListener('input', function () { rngTxt(); render(); });
syncChips(); rngTxt(); render();

/* ---------- hộp chi tiết ---------- */
var dlg = $('#dlg'), last = null;

/* ---------- xem 360° giả lập: kéo ngang ảnh toàn cảnh (ảnh + ảnh lật gương nối vòng, không lộ mối nối) ---------- */
var PANO = { '1pn': '1618221195710-dd6b41faaea6', '2pn': '1757924461488-ef9ad0670978', 'duplex': '1643376452350-97eadd2c417f', 'ph': '1776363497229-616cc7a541fe' };
var pano = $('.pano', dlg), track = $('.pano-track', pano), tabs = $$('.dlg-tabs [role=tab]', dlg), pv = { x: 0, w: 0, raf: 0, drag: null, idle: 0, on: false };
function panoSet(type) {
  var src = 'https://images.unsplash.com/photo-' + PANO[type] + '?auto=format&fit=crop&q=72&w=' + (window.innerWidth < 768 ? 1200 : 2000);
  track.innerHTML = '';
  for (var k = 0; k < 4; k++) { var im = d.createElement('img'); im.src = src; im.alt = k ? '' : 'Ảnh minh hoạ nội thất căn ' + TYPES[type].lab + ' (giả lập 360°)'; im.draggable = false; if (k % 2) im.className = 'flip'; track.appendChild(im); }
  var first = track.firstChild;
  first.onload = function () { pv.w = first.getBoundingClientRect().width; pv.x = -pv.w * .5; panoDraw(); };
}
function panoDraw() {
  if (!pv.w) return;
  var L = pv.w * 2; pv.x = ((pv.x % L) - L) % L;
  track.style.transform = 'translate3d(' + pv.x.toFixed(1) + 'px,0,0)';
}
function panoLoop(now) {
  pv.raf = 0; if (!pv.on) return;
  if (!pv.drag && now - pv.idle > 1500 && !VH.RM) { pv.x -= 0.35; panoDraw(); }
  pv.raf = requestAnimationFrame(panoLoop);
}
pano.addEventListener('pointerdown', function (e) { pv.drag = { x: e.clientX, ox: pv.x }; try { pano.setPointerCapture(e.pointerId); } catch (x) {} });
pano.addEventListener('pointermove', function (e) { if (!pv.drag) return; pv.x = pv.drag.ox + (e.clientX - pv.drag.x); pv.idle = performance.now(); panoDraw(); });
function panoUp() { pv.drag = null; pv.idle = performance.now(); }
pano.addEventListener('pointerup', panoUp); pano.addEventListener('pointercancel', panoUp);
pano.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); pv.x += e.key === 'ArrowLeft' ? 80 : -80; pv.idle = performance.now(); panoDraw(); } });
function showTab(t) {
  tabs.forEach(function (b) { var on = b.getAttribute('data-t') === t; b.setAttribute('aria-selected', on ? 'true' : 'false'); b.tabIndex = on ? 0 : -1; });
  $('#dlg-plan').hidden = t !== 'plan'; pano.hidden = t !== 'pano';
  pv.on = t === 'pano' && dlg.classList.contains('open');
  if (pv.on) { if (!pv.w) { var f = track.firstChild; if (f && f.complete) { pv.w = f.getBoundingClientRect().width; pv.x = -pv.w * .5; panoDraw(); } } pv.idle = performance.now(); if (!pv.raf) pv.raf = requestAnimationFrame(panoLoop); }
}
tabs.forEach(function (b) {
  b.addEventListener('click', function () { showTab(b.getAttribute('data-t')); });
  b.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { var o = tabs[(tabs.indexOf(b) + 1) % tabs.length]; o.focus(); showTab(o.getAttribute('data-t')); } });
});

function openU(code) {
  var u = UNITS.filter(function (x) { return x.code === code; })[0]; if (!u) return;
  var T = TYPES[u.type];
  $('#dlg-t').textContent = u.code + ' · ' + T.lab;
  $('#dlg-plan').innerHTML = plan(u.type, true);
  pv.w = 0; panoSet(u.type);
  $('#dlg-d').textContent = T.name + ', tầng ' + u.fl + ', hướng ban công ' + u.dir + '. Mặt bằng minh hoạ, không theo tỉ lệ.';
  var rows = [['Thông thuỷ', u.area + ' m²'], ['Phòng ngủ / WC', T.bed + ' / ' + T.wc], ['Tầm nhìn', u.view], ['Hướng ban công', u.dir],
              ['Tình trạng', u.hold ? 'Đang giữ chỗ' : 'Còn trống'], ['Giá mẫu', priceTxt(u)]];
  $('#dlg-spec').innerHTML = rows.map(function (r) { return '<div><dt>' + r[0] + '</dt><dd>' + VH.esc(r[1]) + '</dd></div>'; }).join('');
  $('#dlg-book').setAttribute('href', '../dat-lich/?can=' + encodeURIComponent(u.code) + '&loai=' + u.type);
  last = d.activeElement; dlg.classList.add('open'); dlg.setAttribute('aria-hidden', 'false'); VH.lock(true);
  $('.dlg-x', dlg).focus();
  showTab('plan');
}
function closeU() { pv.on = false; dlg.classList.remove('open'); dlg.setAttribute('aria-hidden', 'true'); VH.lock(false); last && last.focus({ preventScroll: true }); }
grid.addEventListener('click', function (e) { var b = e.target.closest('[data-code]'); if (b) openU(b.getAttribute('data-code')); });
$('.dlg-x', dlg).addEventListener('click', closeU);
dlg.addEventListener('click', function (e) { if (e.target === dlg) closeU(); });
d.addEventListener('keydown', function (e) {
  if (!dlg.classList.contains('open')) return;
  if (e.key === 'Escape') closeU();
  if (e.key === 'Tab') { var f = $$('button, a[href]', dlg), a = f[0], z = f[f.length - 1]; if (e.shiftKey && d.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && d.activeElement === z) { e.preventDefault(); a.focus(); } }
});
})();
