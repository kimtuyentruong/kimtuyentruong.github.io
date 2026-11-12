/* An Triều Riverside — JS dùng chung (bat-dong-san-16). JS thuần, không thư viện. */
(function () {
'use strict';
var d = document, root = d.documentElement, body = d.body;
var $ = function (s, c) { return (c || d).querySelector(s); };
var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };
var R = body.getAttribute('data-root') || './';
var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
var STATIC = root.classList.contains('static');
var hasIO = 'IntersectionObserver' in window;
var KEY = 'bds16:';
var store = {
  get: function (k, def) { try { var v = localStorage.getItem(KEY + k); return v ? JSON.parse(v) : def; } catch (e) { return def; } },
  set: function (k, v) { try { localStorage.setItem(KEY + k, JSON.stringify(v)); } catch (e) {} }
};
var NF = new Intl.NumberFormat('vi-VN');
function ty(v) { var t = v / 1e9; return (t >= 10 ? t.toFixed(1) : t.toFixed(2)).replace('.', ',') + ' tỷ'; }
function vnd(v) { return NF.format(Math.round(v / 1e6) * 1e6) + 'đ'; }
function trieu(v) { return NF.format(Math.round(v / 1e6)) + ' triệu'; }
function norm(s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd'); }
function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
function svgIc(n) { return '<svg class="ic" aria-hidden="true"><use href="#i-' + n + '"/></svg>'; }

/* ================= DỮ LIỆU CĂN HỘ (mẫu) ================= */
var TOWERS = {
  A: { name: 'Toà A · Bến', short: 'Toà A', ppm: 95e6, dir: ['Đông Nam', 'Tây Bắc'], view: ['Sông', 'Thành phố'], note: 'Gần sông, nhìn thẳng ra bến' },
  B: { name: 'Toà B · Sóng', short: 'Toà B', ppm: 88e6, dir: ['Đông Bắc', 'Tây Nam'], view: ['Sông', 'Nội khu'], note: 'Ở giữa, hướng ra hồ bơi' },
  C: { name: 'Toà C · Mây', short: 'Toà C', ppm: 84e6, dir: ['Đông Nam', 'Tây Bắc'], view: ['Công viên', 'Thành phố'], note: 'Sát công viên ven sông' }
};
var TYPES = {
  '1': { name: '1 phòng ngủ', short: '1PN' }, '2': { name: '2 phòng ngủ', short: '2PN' }, '2+': { name: '2 phòng ngủ + 1 đa năng', short: '2PN+' },
  '3': { name: '3 phòng ngủ', short: '3PN' }, 'D': { name: 'Duplex 3 phòng ngủ', short: 'Duplex' }, 'S': { name: 'Shop chân đế', short: 'Shop' }
};
// mặt bằng tầng điển hình: [số căn, loại, DT tim tường, DT thông thuỷ, hàng (0 trên/1 dưới), rộng]
var TYP = [[1, '3', 108, 99, 0, 260], [2, '2', 72, 66, 0, 200], [3, '1', 52, 47, 0, 160], [4, '2+', 84, 77, 0, 320],
           [5, '2+', 84, 77, 1, 320], [6, '1', 52, 47, 1, 160], [7, '2', 72, 66, 1, 200], [8, '3', 108, 99, 1, 260]];
var DUP = [[1, 'D', 168, 154, 0, 470], [2, 'D', 168, 154, 0, 470], [3, 'D', 168, 154, 1, 470], [4, 'D', 168, 154, 1, 470]];
var SHP = [[1, 'S', 120, 112, 0, 313], [2, 'S', 96, 90, 0, 314], [3, 'S', 120, 112, 0, 313], [4, 'S', 120, 112, 1, 313], [5, 'S', 96, 90, 1, 314], [6, 'S', 120, 112, 1, 313]];
var FLOORS = [1]; for (var f = 4; f <= 30; f++) FLOORS.push(f); FLOORS.push(31);
function layout(fl) { return fl === 1 ? SHP : fl === 31 ? DUP : TYP; }
function flName(fl) { return fl === 1 ? 'Tầng 1–2 (shop)' : fl === 31 ? 'Tầng 31–32 (duplex)' : 'Tầng ' + fl; }
function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return ((h >>> 0) % 1000) / 1000; }
function code(t, fl, n) { return t + '-' + (fl < 10 ? '0' + fl : fl) + '.' + (n < 10 ? '0' + n : n); }
function mkUnit(t, fl, s) {
  var T = TOWERS[t], n = s[0], c = code(t, fl, n), row = s[4];
  var view = T.view[row], dir = T.dir[row];
  if (row === 0 && (n === 4 || n === 1) && fl !== 1) view = view === 'Sông' ? 'Sông (căn góc)' : view + ' (căn góc)';
  var ppm = s[1] === 'S' ? 165e6 : T.ppm, k = 1 + Math.max(0, fl - 4) * 0.004;
  if (/Sông/.test(view)) k *= 1.06; if (/góc/.test(view)) k *= 1.025; if (/Công viên/.test(view)) k *= 1.03; if (s[1] === 'D') k *= 1.12;
  var price = Math.round(s[3] * ppm * k / 1e7) * 1e7;
  var r = hash(c), st = r < 0.34 ? 'sold' : r < 0.44 ? 'hold' : 'ok';
  return { code: c, t: t, fl: fl, n: n, type: s[1], area: s[2], net: s[3], row: row, w: s[5], dir: dir, view: view, price: price, st: st };
}
var UNITS = {};
Object.keys(TOWERS).forEach(function (t) { FLOORS.forEach(function (fl) { layout(fl).forEach(function (s) { var u = mkUnit(t, fl, s); UNITS[u.code] = u; }); }); });
var ST = { ok: ['st-ok', 'Còn trống'], hold: ['st-hold', 'Đang giữ chỗ'], sold: ['st-off', 'Đã bán'] };
window.ATR = { UNITS: UNITS, TOWERS: TOWERS, TYPES: TYPES, FLOORS: FLOORS, layout: layout, flName: flName, ty: ty, vnd: vnd, store: store };

/* ================= HEADER, MENU, BADGE, LÊN ĐẦU ================= */
var hdr = $('#hdr'), badge = $('#ktBadge'), totop = d.createElement('button');
totop.className = 'totop'; totop.type = 'button'; totop.setAttribute('aria-label', 'Lên đầu trang'); totop.innerHTML = svgIc('arrow-up');
body.appendChild(totop);
totop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' }); });
function onScroll() {
  var y = window.pageYOffset;
  hdr && hdr.classList.toggle('scrolled', y > 8);
  badge && badge.classList.toggle('show', y > window.innerHeight * .85);
  totop.classList.toggle('show', y > window.innerHeight * 1.2);
}
window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

var lastFocus = null;
function lock(on) { body.classList.toggle('lock', on); root.style.overflow = on ? 'hidden' : ''; }
var mnav = $('#mnav'), burger = $('#burger');
function menu(open) {
  if (!mnav) return;
  mnav.classList.toggle('open', open); burger.setAttribute('aria-expanded', open); burger.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
  lock(open); if (open) { var a = $('a', mnav); a && a.focus({ preventScroll: true }); }
}
burger && burger.addEventListener('click', function () { menu(!mnav.classList.contains('open')); });
$$('#mnav a').forEach(function (a) { a.addEventListener('click', function () { menu(false); }); });

/* ================= LỚP PHỦ: TÌM KIẾM + CĂN ĐÃ LƯU ================= */
function overlay(id, html) {
  var o = d.createElement('div'); o.className = 'ovl'; o.id = id; o.innerHTML = html; body.appendChild(o);
  o.addEventListener('click', function (e) { if (e.target === o) closeOvl(o); });
  return o;
}
var openOvlEl = null;
function openOvl(o, focusEl) { lastFocus = d.activeElement; openOvlEl = o; o.classList.add('open'); lock(true); setTimeout(function () { (focusEl || $('button', o)).focus(); }, 60); }
function closeOvl(o) { o.classList.remove('open'); openOvlEl = null; lock(false); lastFocus && lastFocus.focus && lastFocus.focus(); }
d.addEventListener('keydown', function (e) {
  if (e.key !== 'Escape') return;
  if (openOvlEl) closeOvl(openOvlEl); else if (mnav && mnav.classList.contains('open')) { menu(false); burger.focus(); }
});

var PAGES = [
  ['Trang', 'Tổng quan dự án', 'Thông số, chủ đầu tư, đơn vị thiết kế', 'tong-quan/', 'quy mo mat do so toa so tang chu dau tu thiet ke'],
  ['Trang', 'Vị trí & kết nối', 'Bản đồ, thời gian di chuyển, tiện ích quanh dự án', 'vi-tri/', 'ban do truong hoc benh vien metro san bay trung tam'],
  ['Trang', 'Mặt bằng & loại căn', 'Chọn toà, tầng, căn trên mặt bằng', 'mat-bang/', 'mat bang tang can ho chon can loc huong gia'],
  ['Loại căn', 'Căn 2 phòng ngủ hướng sông', '72 m² · mặt bằng, diện tích từng phòng, tính trả góp', 'mat-bang/can-2-phong-ngu/', '2pn hai phong ngu 72m2 tra gop'],
  ['Trang', 'Tiện ích nội khu', 'Bản đồ tầng tiện ích, giờ mở cửa', 'tien-ich/', 'ho boi gym tre em bbq vuon yoga sky lounge pickleball'],
  ['Trang', 'Tiến độ & pháp lý', 'Dòng thời gian thi công, danh mục hồ sơ', 'tien-do-phap-ly/', 'tien do thi cong cat noc giay phep xay dung so do bao lanh ngan hang'],
  ['Trang', 'Chính sách bán hàng', 'Hai phương án thanh toán, máy tính vay', 'chinh-sach-ban-hang/', 'thanh toan coc vay ngan hang lai suat phi bao tri'],
  ['Trang', 'Tin tức', 'Cập nhật dự án và kiến thức mua nhà', 'tin-tuc/', 'tin tuc bai viet'],
  ['Bài viết', 'Đọc hợp đồng mua bán căn hộ: 7 điều cần xem kỹ', 'Kiến thức mua nhà · 9 phút đọc', 'tin-tuc/doc-hop-dong-mua-ban-can-ho/', 'hop dong mua ban hdmb dien tich thong thuy bao lanh phi bao tri'],
  ['Trang', 'Liên hệ & đặt lịch xem nhà mẫu', 'Chọn ngày giờ, nhận mã lịch hẹn', 'lien-he/', 'dat lich nha mau lien he dia chi so dien thoai'],
  ['Loại căn', 'Căn 1 phòng ngủ', '52 m² · từ khoảng ' + '3,95 tỷ (giá ví dụ)', 'mat-bang/?pn=1', '1pn studio mot phong ngu'],
  ['Loại căn', 'Căn 3 phòng ngủ', '108 m² · căn góc', 'mat-bang/?pn=3', '3pn ba phong ngu can goc'],
  ['Loại căn', 'Duplex tầng 31–32', '168 m² · hai tầng, sân trời', 'mat-bang/?pn=D', 'duplex penthouse hai tang'],
  ['Loại căn', 'Shop chân đế', '90–120 m² · tầng 1–2', 'mat-bang/?pn=S', 'shop shophouse kinh doanh chan de'],
  ['Tiện ích', 'Hồ bơi tràn 50 m', 'Tầng 3 · 06:00–21:00', 'tien-ich/', 'ho boi tran be boi'],
  ['Tiện ích', 'Sky lounge tầng mái Toà A', 'Tầng mái · 16:00–22:00', 'tien-ich/', 'sky lounge tang mai ngam song']
];
var srch = overlay('srchOvl', '<div class="srch" role="dialog" aria-modal="true" aria-label="Tìm trong website"><div class="wrap">' +
  '<div class="srch-bar">' + svgIc('search') + '<label class="sr" for="srchIn">Tìm trong website</label><input id="srchIn" type="search" placeholder="Tìm căn, trang, tiện ích… ví dụ: A-12.03, duplex, hồ bơi" autocomplete="off"><button class="x-btn" type="button" data-close aria-label="Đóng tìm kiếm">' + svgIc('close') + '</button></div>' +
  '<div class="srch-hint">Gợi ý: <button class="chip" type="button">2 phòng ngủ</button><button class="chip" type="button">pháp lý</button><button class="chip" type="button">trả góp</button><button class="chip" type="button">B-18.02</button></div>' +
  '<div class="srch-res" id="srchRes" role="list"></div></div></div>');
var sIn = $('#srchIn'), sRes = $('#srchRes');
function doSearch() {
  var q = norm(sIn.value.trim()), out = [];
  if (!q) { sRes.innerHTML = ''; return; }
  var cq = q.toUpperCase().replace(/\s/g, '');
  var m = cq.match(/^([ABC])-?(\d{1,2})[.\-]?(\d{1,2})$/);
  if (m) {
    var c = code(m[1], +m[2], +m[3]), u = UNITS[c];
    if (u) out.push(['Căn hộ', 'Căn ' + c + ' · ' + TYPES[u.type].name, u.net + ' m² thông thuỷ · ' + ST[u.st][1] + ' · ' + ty(u.price) + ' (giá ví dụ)', 'mat-bang/?can=' + c]);
  }
  PAGES.forEach(function (p) { if (norm(p[1] + ' ' + p[2] + ' ' + p[4]).indexOf(q) > -1) out.push(p); });
  if (!out.length) q.split(/\s+/).forEach(function (w) { if (w.length < 2) return; PAGES.forEach(function (p) { if (out.indexOf(p) < 0 && norm(p[1] + ' ' + p[4]).indexOf(w) > -1) out.push(p); }); });
  sRes.innerHTML = out.length ? out.slice(0, 8).map(function (p) {
    return '<a role="listitem" href="' + R + p[3] + '"><em>' + esc(p[0]) + '</em><div><b>' + esc(p[1]) + '</b><span>' + esc(p[2]) + '</span></div>' + svgIc('arrow') + '</a>';
  }).join('') : '<p class="srch-empty">Chưa thấy kết quả cho “' + esc(sIn.value) + '”. Thử “2 phòng ngủ”, “hồ bơi” hoặc mã căn như A-12.03.</p>';
}
sIn.addEventListener('input', doSearch);
$$('.srch-hint .chip', srch).forEach(function (b) { b.addEventListener('click', function () { sIn.value = b.textContent; doSearch(); sIn.focus(); }); });
$('[data-close]', srch).addEventListener('click', function () { closeOvl(srch); });
var so = $('#searchOpen'); so && so.addEventListener('click', function () { openOvl(srch, sIn); });

var fav = store.get('fav', []);
var favO = overlay('favOvl', '<aside class="drawer" role="dialog" aria-modal="true" aria-labelledby="favT"><div class="drawer-h"><h2 id="favT">Căn đã lưu</h2><button class="x-btn" type="button" data-close aria-label="Đóng">' + svgIc('close') + '</button></div><div class="drawer-b" id="favList"></div><div class="drawer-f"><a class="btn btn-copper" href="' + R + 'lien-he/?tu=yeu-thich">Đặt lịch xem các căn này' + svgIc('arrow') + '</a><a class="btn btn-line" href="' + R + 'mat-bang/">Chọn thêm căn</a><p>Danh sách lưu trên trình duyệt của bạn. Giá và tình trạng căn là dữ liệu mẫu.</p></div></aside>');
$('[data-close]', favO).addEventListener('click', function () { closeOvl(favO); });
function renderFav() {
  var c = $('#favCount'); if (c) { c.textContent = fav.length; c.hidden = !fav.length; }
  var l = $('#favList');
  l.innerHTML = fav.length ? fav.map(function (k) {
    var u = UNITS[k]; if (!u) return '';
    return '<div class="fav-row"><b>Căn ' + k + '</b><span>' + TYPES[u.type].name + ' · ' + u.net + '&nbsp;m² · ' + u.view + '</span><strong>' + ty(u.price) + ' <small>(giá ví dụ)</small></strong><button type="button" data-rm="' + k + '" aria-label="Bỏ lưu căn ' + k + '">' + svgIc('close') + '</button></div>';
  }).join('') : '<div class="fav-empty">' + svgIc('heart') + '<p>Chưa lưu căn nào. Bấm “Lưu căn” trên mặt bằng để so sánh và đặt lịch xem cùng lúc.</p></div>';
  $$('[data-rm]', l).forEach(function (b) { b.addEventListener('click', function () { toggleFav(b.getAttribute('data-rm')); }); });
  d.dispatchEvent(new CustomEvent('fav:change'));
}
function toggleFav(k) {
  var i = fav.indexOf(k); if (i > -1) fav.splice(i, 1); else fav.push(k);
  store.set('fav', fav); renderFav(); toast(i > -1 ? 'Đã bỏ căn ' + k + ' khỏi danh sách' : 'Đã lưu căn ' + k + ' · xem ở biểu tượng trái tim');
  return i < 0;
}
var fo = $('#favOpen'); fo && fo.addEventListener('click', function () { openOvl(favO); });
window.ATR.fav = function () { return fav; }; window.ATR.toggleFav = toggleFav;

var toastEl = d.createElement('div'); toastEl.className = 'toast'; toastEl.setAttribute('role', 'status'); toastEl.setAttribute('aria-live', 'polite'); body.appendChild(toastEl);
var tt; function toast(m) { toastEl.textContent = m; toastEl.classList.add('show'); clearTimeout(tt); tt = setTimeout(function () { toastEl.classList.remove('show'); }, 2600); }
window.ATR.toast = toast;
renderFav();

/* ================= HIỆN DẦN ================= */
function reveal(list) {
  if (hasIO && !RM && !STATIC) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px', threshold: .06 });
    list.forEach(function (el) { var r = el.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) el.classList.add('in'); else io.observe(el); });
  } else list.forEach(function (el) { el.classList.add('in'); });
}
reveal($$('.rv,.rv-img,.draw,.meters,.tw-meters'));

/* ================= ACCORDION ================= */
$$('.acc-btn').forEach(function (b, i) {
  var p = b.parentElement.nextElementSibling; if (!p) return;
  if (!p.id) p.id = 'acc-p' + i; b.setAttribute('aria-controls', p.id);
  b.addEventListener('click', function () { var o = b.getAttribute('aria-expanded') === 'true'; b.setAttribute('aria-expanded', !o); p.classList.toggle('open', !o); });
});

/* ================= ĐẾM SỐ ================= */
$$('[data-count]').forEach(function (el) {
  var to = parseFloat(el.getAttribute('data-count')), dec = (el.getAttribute('data-count').split('.')[1] || '').length;
  function set(v) { el.textContent = v.toFixed(dec).replace('.', ','); }
  if (RM || STATIC || !hasIO) { set(to); return; }
  set(0);
  var io = new IntersectionObserver(function (es) {
    if (!es[0].isIntersecting) return; io.disconnect();
    var t0 = performance.now();
    (function step(t) { var k = Math.min(1, (t - t0) / 1400); set(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); })(t0);
  }); io.observe(el);
});

/* ================= MÁY TÍNH VAY (dùng chung) ================= */
function loanCalc(box) {
  var q = function (n) { return $('[name=' + n + ']', box); };
  var price = q('price'), pct = q('pct'), yrs = q('yrs'), r1 = q('r1'), m1 = q('m1'), r2 = q('r2');
  function paint(inp) { var p = (inp.value - inp.min) / (inp.max - inp.min) * 100; inp.style.setProperty('--p', p + '%'); }
  function out(n, v) { var o = $('[data-o=' + n + ']', box); if (o) o.textContent = v; }
  function calc() {
    [price, pct, yrs].forEach(paint);
    var P = +price.value * 1e6, loan = P * (+pct.value) / 100, n = +yrs.value * 12;
    var a1 = (+r1.value) / 100 / 12, a2 = (+r2.value) / 100 / 12, k1 = Math.min(+m1.value, n);
    var bal = loan, gGoc = loan / n, tot = 0, first = 0, after = 0, yearly = [], ycur = 0;
    for (var i = 1; i <= n; i++) {
      var r = i <= k1 ? a1 : a2, lai = bal * r, pay = gGoc + lai; tot += lai; bal -= gGoc;
      if (i === 1) first = pay; if (i === k1 + 1) after = pay;
      ycur += pay; if (i % 12 === 0) { yearly.push([ycur, Math.ceil(i / 12) * 12 <= k1]); ycur = 0; }
    }
    out('price', NF.format(+price.value) + ' triệu'); out('pct', pct.value + '%'); out('yrs', yrs.value + ' năm');
    out('own', vnd(P - loan)); out('loan', vnd(loan)); out('first', trieu(first));
    out('after', after ? trieu(after) : '—'); out('int', vnd(tot)); out('total', vnd(loan + tot));
    var ch = $('.calc-chart', box);
    if (ch) { var mx = Math.max.apply(null, yearly.map(function (y) { return y[0]; })); ch.innerHTML = yearly.map(function (y, i) { return '<i class="' + (y[1] ? 'pre' : '') + '" style="height:' + Math.max(4, y[0] / mx * 100) + '%" title="Năm ' + (i + 1) + ': ' + trieu(y[0]) + '"></i>'; }).join(''); }
  }
  $$('input,select', box).forEach(function (i) { i.addEventListener('input', calc); });
  calc();
  return { set: function (p) { price.value = Math.round(p / 1e6); calc(); } };
}
var calcs = $$('[data-calc]').map(loanCalc);
window.ATR.calcs = calcs;

/* ================= TRANG CHỦ: TÌM CĂN NHANH ================= */
var finder = $('#finder');
if (finder) {
  var FD = {
    '1': ['1 phòng ngủ', 'Gọn cho người trẻ hoặc vợ chồng mới cưới. Bếp mở liền phòng khách, lô gia đủ chỗ phơi đồ.', '52 m²', '47 m²', '1757924461488-ef9ad0670978', 'Phòng khách căn hộ với cửa kính lớn và sofa màu kem', 'mat-bang/?pn=1'],
    '2': ['2 phòng ngủ', 'Loại căn nhiều gia đình chọn: hai phòng ngủ đều có cửa sổ, phòng khách quay ra sông.', '72 m²', '66 m²', '1583847268964-b28dc8f51f92', 'Phòng khách sáng sủa với sofa xám, gối trắng và cây xanh', 'mat-bang/can-2-phong-ngu/'],
    '3': ['3 phòng ngủ', 'Căn góc hai mặt thoáng, đủ cho gia đình ba thế hệ, có phòng giặt riêng.', '108 m²', '99 m²', '1600210492486-724fe5c67fb0', 'Phòng khách nhà mẫu sáng nắng, sofa da nâu và cây xanh', 'mat-bang/?pn=3'],
    'D': ['Duplex tầng 31–32', 'Hai tầng thông nhau, trần phòng khách cao gấp đôi, sân trời riêng nhìn trọn khúc sông.', '168 m²', '154 m²', '1643376452350-97eadd2c417f', 'Phòng khách chung có đàn piano và cửa kính lớn', 'mat-bang/?pn=D']
  };
  var img = $('img', finder), cnt = function (t) { return Object.keys(UNITS).filter(function (k) { var u = UNITS[k]; return (u.type === t || (t === '2' && u.type === '2+')) && u.st === 'ok'; }); };
  function pick(t) {
    var D = FD[t], list = cnt(t), min = Math.min.apply(null, list.map(function (k) { return UNITS[k].price; }));
    $$('[data-pn]', finder).forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-pn') === t); });
    $('#fdName').textContent = D[0]; $('#fdTxt').textContent = D[1]; $('#fdA').textContent = D[2]; $('#fdN').textContent = D[3];
    $('#fdP').textContent = list.length ? ty(min) : '—'; $('#fdLeft').textContent = list.length + ' căn còn trống (dữ liệu mẫu)';
    $('#fdGo').setAttribute('href', R + D[6]);
    img.style.opacity = 0; setTimeout(function () { img.src = 'https://images.unsplash.com/photo-' + D[4] + '?auto=format&fit=crop&w=1200&q=80'; img.alt = D[5]; img.style.opacity = 1; }, RM ? 0 : 220);
  }
  $$('[data-pn]', finder).forEach(function (b) { b.addEventListener('click', function () { pick(b.getAttribute('data-pn')); }); });
  pick('2');
}

/* ================= TỔNG QUAN: SƠ ĐỒ KHU ĐẤT ================= */
var site = $('#siteMap');
if (site) {
  var SI = {
    A: ['Toà A · Bến', '32 tầng nổi, gần mép sông. Tầng mái có sky lounge và đài ngắm sông.', '220 căn hộ · 6 shop', '1 PN – Duplex'],
    B: ['Toà B · Sóng', '32 tầng nổi, nằm giữa khu đất, mở ra hồ bơi tràn và vườn tầng 3.', '220 căn hộ · 6 shop', '1 PN – Duplex'],
    C: ['Toà C · Mây', '32 tầng nổi, sát công viên ven sông, có nhà trẻ ở khối đế.', '220 căn hộ · 6 shop', '1 PN – Duplex'],
    P: ['Khối đế & sân tiện ích', 'Tầng 1–2 là shop chân đế, tầng 3 là sân tiện ích chung nối ba toà.', '18 shop · 1,1 ha cảnh quan', 'Hồ bơi, gym, vườn, sân chơi']
  };
  function sel(k) {
    $$('.tw', site).forEach(function (g) { g.classList.toggle('on', g.getAttribute('data-k') === k); g.setAttribute('aria-pressed', g.getAttribute('data-k') === k); });
    var s = SI[k]; $('#siName').textContent = s[0]; $('#siTxt').textContent = s[1]; $('#siU').textContent = s[2]; $('#siT').textContent = s[3];
  }
  $$('.tw', site).forEach(function (g) {
    g.addEventListener('click', function () { sel(g.getAttribute('data-k')); });
    g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); sel(g.getAttribute('data-k')); } });
  });
  sel('A');
}

/* ================= VỊ TRÍ: BẢN ĐỒ ================= */
var lmap = $('#locMap');
if (lmap) {
  var mode = 'car';
  $$('.map-bar .chip').forEach(function (c) {
    c.addEventListener('click', function () {
      var on = c.getAttribute('aria-pressed') !== 'true'; c.setAttribute('aria-pressed', on);
      $$('.poi[data-c=' + c.getAttribute('data-c') + ']', lmap).forEach(function (p) { p.classList.toggle('off', !on); p.setAttribute('tabindex', on ? 0 : -1); });
      var n = $$('.poi:not(.off)', lmap).length; $('#poiN').textContent = n;
    });
  });
  function tip(b, t, x) { $('#mapTip').innerHTML = '<b>' + b + '</b>' + t + (x ? ' <em>' + x + '</em>' : ''); }
  $$('.poi', lmap).forEach(function (p) {
    function go() { $$('.poi', lmap).forEach(function (q) { q.classList.remove('on'); }); p.classList.add('on'); tip(p.getAttribute('data-n'), p.getAttribute('data-t'), p.getAttribute('data-m')); }
    p.addEventListener('click', go); p.addEventListener('focus', go);
    p.addEventListener('keydown', function (e) { if (e.key === 'Enter') go(); });
  });
  function dest(b) {
    $$('.dest button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
    $$('.route', lmap).forEach(function (r) { r.classList.remove('on'); });
    var r = $('#rt-' + b.getAttribute('data-r'), lmap);
    if (r) { void r.getBoundingClientRect(); requestAnimationFrame(function () { r.classList.add('on'); }); }
    var v = b.getAttribute('data-' + mode); tip(b.getAttribute('data-n'), v === '—' ? 'Chưa có tuyến metro thuận tiện, nên đi ô tô hoặc xe máy.' : 'Khoảng ' + v + ' phút bằng ' + (mode === 'car' ? 'ô tô' : mode === 'bike' ? 'xe máy' : 'metro và đi bộ') + ' ngoài giờ cao điểm.', 'Ước tính, chỉ để minh hoạ');
  }
  function paintMode() {
    $$('.dest button').forEach(function (b) { var v = b.getAttribute('data-' + mode); $('strong', b).innerHTML = (v === '—' ? '—' : v + '<small>phút</small>'); });
    var on = $('.dest button[aria-pressed=true]'); on && dest(on);
  }
  $$('#modeSeg button').forEach(function (b) { b.addEventListener('click', function () { mode = b.getAttribute('data-m'); $$('#modeSeg button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); paintMode(); }); });
  $$('.dest button').forEach(function (b) { b.addEventListener('click', function () { dest(b); }); });
  paintMode(); dest($('.dest button'));
}

/* ================= MẶT BẰNG ================= */
var plate = $('#plate');
if (plate) {
  var S = store.get('plan', { t: 'A', fl: 18, pn: 'all', dir: 'all', max: 20 }), qs = new URLSearchParams(location.search), sel = null;
  if (qs.get('pn')) S.pn = qs.get('pn');
  if (qs.get('can') && UNITS[qs.get('can')]) { var cu = UNITS[qs.get('can')]; S.t = cu.t; S.fl = cu.fl; sel = cu.code; }
  if (FLOORS.indexOf(S.fl) < 0) S.fl = 18;
  function match(u) {
    if (S.pn !== 'all' && !(u.type === S.pn || (S.pn === '2' && u.type === '2+'))) return false;
    if (S.dir !== 'all' && u.dir !== S.dir) return false;
    return u.price <= S.max * 1e9;
  }
  function unitsOn(t, fl) { return layout(fl).map(function (s) { return UNITS[code(t, fl, s[0])]; }); }
  function drawPlate() {
    var us = unitsOn(S.t, S.fl), x0 = { 0: 30, 1: 30 }, h = '';
    h += '<defs><pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" fill="#E7E1D4"/><line x1="0" y1="0" x2="0" y2="7" stroke="#C9C0AD" stroke-width="2"/></pattern></defs>';
    var side = TOWERS[S.t].view[0];
    h += '<path d="M30 30 Q 130 16 230 30 T 430 30 T 630 30 T 830 30 T 970 26" fill="none" stroke="#2B5F8E" stroke-width="2" opacity=".55"/><path d="M30 42 Q 130 28 230 42 T 430 42 T 630 42 T 830 42 T 970 38" fill="none" stroke="#2B5F8E" stroke-width="1.2" opacity=".35"/>';
    h += '<text x="500" y="20" text-anchor="middle" font-family="Inter" font-size="12" font-weight="600" fill="#2B5F8E" letter-spacing="2">PHÍA ' + (side === 'Sông' ? 'SÔNG SÀI GÒN' : 'CÔNG VIÊN VEN SÔNG') + ' · HƯỚNG ' + TOWERS[S.t].dir[0].toUpperCase() + '</text>';
    h += '<text x="500" y="548" text-anchor="middle" font-family="Inter" font-size="12" font-weight="600" fill="#515F76" letter-spacing="2">PHÍA ' + TOWERS[S.t].view[1].toUpperCase() + ' · HƯỚNG ' + TOWERS[S.t].dir[1].toUpperCase() + '</text>';
    h += '<rect x="30" y="262" width="940" height="36" fill="#EEE7D8" stroke="#0E2A47" stroke-width="1.5"/><text x="500" y="285" text-anchor="middle" font-family="Inter" font-size="11" font-weight="600" fill="#515F76" letter-spacing="1.5">HÀNH LANG · LÕI THANG (4 THANG MÁY, 2 THANG BỘ)</text>';
    us.forEach(function (u) {
      var y = u.row === 0 ? 60 : 298, x = x0[u.row]; x0[u.row] += u.w;
      var cls = 'u ' + (u.st === 'sold' ? 'sold' : u.st === 'hold' ? 'hold' : '') + (match(u) ? '' : ' dim') + (fav.indexOf(u.code) > -1 ? ' fav' : '') + (sel === u.code ? ' on' : '');
      var cx = x + u.w / 2;
      h += '<g class="' + cls + '" data-code="' + u.code + '" tabindex="0" role="button" aria-label="Căn ' + u.code + ', ' + TYPES[u.type].name + ', ' + u.net + ' mét vuông, ' + ST[u.st][1] + '">' +
        '<rect class="b" x="' + x + '" y="' + y + '" width="' + u.w + '" height="202"/>' +
        '<text class="t1" x="' + cx + '" y="' + (y + 86) + '" text-anchor="middle">' + u.code.split('.')[1] + ' · ' + TYPES[u.type].short + '</text>' +
        '<text class="t2" x="' + cx + '" y="' + (y + 112) + '" text-anchor="middle">' + u.net + ' m² · ' + u.dir + '</text>' +
        '<text class="t3" x="' + cx + '" y="' + (y + 136) + '" text-anchor="middle">' + (u.st === 'sold' ? 'Đã bán' : ty(u.price).replace(' ', ' ')) + '</text>' +
        '<path class="fv" transform="translate(' + (x + u.w - 26) + ',' + (y + 10) + ') scale(.7)" d="M12 20s-7-4.4-7-9.6A4 4 0 0 1 12 8a4 4 0 0 1 7 2.4C19 15.6 12 20 12 20z"/></g>';
    });
    plate.innerHTML = h;
    $$('.u', plate).forEach(function (g) {
      g.addEventListener('click', function () { pickUnit(g.getAttribute('data-code')); });
      g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pickUnit(g.getAttribute('data-code')); } });
    });
    var ok = us.filter(function (u) { return u.st === 'ok'; }).length, m = us.filter(function (u) { return u.st === 'ok' && match(u); }).length;
    $('#plTitle').textContent = TOWERS[S.t].name + ' · ' + flName(S.fl);
    $('#plSub').textContent = ok + '/' + us.length + ' căn còn trống · ' + m + ' căn hợp bộ lọc';
    $('#flOut').innerHTML = '<small>Tầng</small>' + (S.fl === 1 ? '1–2' : S.fl === 31 ? '31–32' : S.fl);
  }
  function drawElev() {
    var el = $('#elev'), n = FLOORS.length, H = n * 11 + 40, h = '<rect class="pod" x="22" y="' + (H - 24) + '" width="96" height="14"/>', y = 8;
    FLOORS.slice().reverse().forEach(function (fl) {
      var us = unitsOn(S.t, fl), m = us.filter(function (u) { return u.st === 'ok' && match(u); }).length, k = m === 0 ? '' : m <= 1 ? ' m1' : m <= 3 ? ' m2' : ' m3';
      var hh = fl === 31 ? 18 : 9.5;
      h += '<rect class="f' + k + (fl === S.fl ? ' on' : '') + '" data-fl="' + fl + '" x="30" y="' + y + '" width="80" height="' + hh + '"><title>' + flName(fl) + ': ' + m + ' căn hợp lọc</title></rect>';
      if (fl === 31 || fl === 1 || fl % 5 === 0) h += '<text x="24" y="' + (y + hh - 1.5) + '" text-anchor="end">' + (fl === 31 ? '31' : fl) + '</text>';
      y += hh + 1.5; if (fl === 4) { h += '<text x="70" y="' + (y + 8) + '" text-anchor="middle">tầng 3: tiện ích</text>'; y += 12; }
    });
    el.setAttribute('viewBox', '0 0 120 ' + (y + 10)); el.innerHTML = h;
    $$('rect.f', el).forEach(function (r) { r.addEventListener('click', function () { S.fl = +r.getAttribute('data-fl'); sel = null; all(); }); });
  }
  function pickUnit(c) {
    sel = c; var u = UNITS[c]; $$('.u', plate).forEach(function (g) { g.classList.toggle('on', g.getAttribute('data-code') === c); });
    var p = $('#unitPanel'), isF = fav.indexOf(c) > -1, dl = u.type === '2' ? '<a class="btn btn-line" href="' + R + 'mat-bang/can-2-phong-ngu/?can=' + c + '">Xem chi tiết loại căn' + svgIc('arrow') + '</a>' : '';
    p.innerHTML = '<p class="eyebrow" style="margin:0"><i>' + TOWERS[u.t].short + '</i>' + flName(u.fl) + '</p><h3>Căn ' + c + '</h3>' +
      '<span class="st ' + ST[u.st][0] + '">' + ST[u.st][1] + '</span>' +
      '<dl class="spec"><div><dt>Loại căn</dt><dd>' + TYPES[u.type].name + '</dd></div><div><dt>Diện tích tim tường</dt><dd>' + u.area + '&nbsp;m²</dd></div><div><dt>Diện tích thông thuỷ</dt><dd>' + u.net + '&nbsp;m²</dd></div><div><dt>Hướng ban công</dt><dd>' + u.dir + '</dd></div><div><dt>Tầm nhìn</dt><dd>' + u.view + '</dd></div></dl>' +
      '<p class="pl-gia-big">' + (u.st === 'sold' ? 'Đã bán' : ty(u.price)) + '<small>' + (u.st === 'sold' ? 'Căn này đã có chủ. Xem các căn cùng loại còn trống bên dưới.' : 'Giá ví dụ đã gồm VAT, chưa gồm 2% phí bảo trì · ' + NF.format(Math.round(u.price / u.net / 1e5) / 10) + '&nbsp;triệu/m² thông thuỷ') + '</small></p>' +
      '<div class="pl-unit-act"><button class="btn btn-line btn-fav" type="button" aria-pressed="' + isF + '">' + svgIc('heart') + '<span>' + (isF ? 'Đã lưu căn' : 'Lưu căn') + '</span></button>' + dl +
      '<a class="btn btn-copper" href="' + R + 'lien-he/?can=' + c + '">Đặt lịch xem căn này</a></div>';
    $('.btn-fav', p).addEventListener('click', function () { toggleFav(c); });
    store.set('pick', c);
  }
  function drawList() {
    var key = $('#plSort').value, arr = Object.keys(UNITS).map(function (k) { return UNITS[k]; }).filter(function (u) { return u.t === S.t && u.st === 'ok' && match(u); });
    arr.sort(function (a, b) { return key === 'price' ? a.price - b.price : key === 'area' ? b.net - a.net : b.fl - a.fl; });
    $('#plCount').textContent = arr.length;
    $('#plRows').innerHTML = arr.slice(0, 12).map(function (u) {
      var isF = fav.indexOf(u.code) > -1;
      return '<tr><td>' + u.code + '</td><td>' + TYPES[u.type].short + '</td><td class="num">' + u.net + '&nbsp;m²</td><td>' + u.dir + '</td><td>' + u.view + '</td><td class="num">' + ty(u.price) + '</td><td class="r"><button class="row-btn" type="button" data-go="' + u.code + '">Xem</button> <button class="row-btn" type="button" data-fv="' + u.code + '" aria-pressed="' + isF + '" aria-label="Lưu căn ' + u.code + '">' + svgIc('heart') + '</button></td></tr>';
    }).join('') || '<tr><td colspan="7">Không còn căn trống hợp bộ lọc ở toà này. Thử nới khoảng giá hoặc chọn toà khác.</td></tr>';
    $$('[data-go]').forEach(function (b) { b.addEventListener('click', function () { var u = UNITS[b.getAttribute('data-go')]; S.fl = u.fl; sel = u.code; all(); pickUnit(u.code); $('#pl').scrollIntoView({ behavior: RM ? 'auto' : 'smooth' }); }); });
    $$('[data-fv]').forEach(function (b) { b.addEventListener('click', function () { b.setAttribute('aria-pressed', toggleFav(b.getAttribute('data-fv'))); }); });
  }
  function syncUI() {
    $$('[data-tw]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-tw') === S.t); });
    $$('[data-fpn]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-fpn') === S.pn); });
    $$('[data-fdir]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-fdir') === S.dir); });
    var g = $('#fGia'); g.value = S.max; g.style.setProperty('--p', (S.max - g.min) / (g.max - g.min) * 100 + '%'); $('#fGiaO').textContent = 'Đến ' + S.max + ' tỷ';
  }
  function all() {
    if (S.pn === 'D' && S.fl !== 31) S.fl = 31; else if (S.pn === 'S' && S.fl !== 1) S.fl = 1; else if (S.pn !== 'all' && S.pn !== 'D' && S.pn !== 'S' && (S.fl === 1 || S.fl === 31)) S.fl = 18;
    store.set('plan', S); syncUI(); drawPlate(); drawElev(); drawList();
    if (!sel) { var f1 = unitsOn(S.t, S.fl).filter(function (u) { return u.st === 'ok' && match(u); })[0] || unitsOn(S.t, S.fl)[0]; sel = f1.code; }
    pickUnit(sel);
  }
  $$('[data-tw]').forEach(function (b) { b.addEventListener('click', function () { S.t = b.getAttribute('data-tw'); sel = null; all(); }); });
  $$('[data-fpn]').forEach(function (b) { b.addEventListener('click', function () { S.pn = b.getAttribute('data-fpn'); sel = null; all(); }); });
  $$('[data-fdir]').forEach(function (b) { b.addEventListener('click', function () { S.dir = b.getAttribute('data-fdir'); sel = null; all(); }); });
  $('#fGia').addEventListener('input', function () { S.max = +this.value; sel = null; all(); });
  $('#flUp').addEventListener('click', function () { var i = FLOORS.indexOf(S.fl); if (i < FLOORS.length - 1) { S.fl = FLOORS[i + 1]; sel = null; all(); } });
  $('#flDn').addEventListener('click', function () { var i = FLOORS.indexOf(S.fl); if (i > 0) { S.fl = FLOORS[i - 1]; sel = null; all(); } });
  $('#plSort').addEventListener('change', drawList);
  $('#plReset').addEventListener('click', function () { S = { t: S.t, fl: 18, pn: 'all', dir: 'all', max: 20 }; sel = null; all(); });
  d.addEventListener('fav:change', function () { $$('.u', plate).forEach(function (g) { g.classList.toggle('fav', fav.indexOf(g.getAttribute('data-code')) > -1); }); if (sel) { var b = $('#unitPanel .btn-fav'); if (b) { var on = fav.indexOf(sel) > -1; b.setAttribute('aria-pressed', on); $('span', b).textContent = on ? 'Đã lưu căn' : 'Lưu căn'; } } $$('[data-fv]').forEach(function (b) { b.setAttribute('aria-pressed', fav.indexOf(b.getAttribute('data-fv')) > -1); }); });
  all();
}

/* ================= CHI TIẾT LOẠI CĂN ================= */
var gal = $('#gal');
if (gal) {
  var gm = $('.gal-main img', gal);
  $$('.gal-th button', gal).forEach(function (b) {
    b.addEventListener('click', function () {
      $$('.gal-th button', gal).forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
      var im = $('img', b); gm.style.opacity = 0;
      setTimeout(function () { gm.src = im.src.replace(/w=\d+/, 'w=1400'); gm.alt = im.alt; $('#galCap').textContent = im.alt; gm.style.opacity = 1; }, RM ? 0 : 200);
    });
  });
}
var plan = $('#unitPlan');
if (plan) {
  function room(k) {
    $$('.rm', plan).forEach(function (g) { g.classList.toggle('on', g.getAttribute('data-k') === k); });
    $$('.rooms tr[data-k]').forEach(function (t) { t.classList.toggle('on', t.getAttribute('data-k') === k); });
  }
  $$('.rm', plan).forEach(function (g) {
    var k = g.getAttribute('data-k');
    g.addEventListener('click', function () { room(k); }); g.addEventListener('focus', function () { room(k); });
    g.addEventListener('mouseenter', function () { room(k); });
  });
  $$('.rooms tr[data-k]').forEach(function (t) { t.addEventListener('mouseenter', function () { room(t.getAttribute('data-k')); }); t.addEventListener('click', function () { room(t.getAttribute('data-k')); }); });
  var ft = $('#furnT'); ft && ft.addEventListener('click', function () { var on = ft.getAttribute('aria-pressed') !== 'true'; ft.setAttribute('aria-pressed', on); $('.furn', plan).classList.toggle('hide', !on); });
  // căn 2PN còn trống
  var av = Object.keys(UNITS).map(function (k) { return UNITS[k]; }).filter(function (u) { return u.type === '2' && u.st === 'ok'; });
  var qc = new URLSearchParams(location.search).get('can'), cur = UNITS[qc] && UNITS[qc].type === '2' ? UNITS[qc] : null;
  av.sort(function (a, b) { return b.fl - a.fl; });
  $('#avN').textContent = av.length;
  $('#avRows').innerHTML = av.slice(0, 8).map(function (u) { return '<tr' + (cur && cur.code === u.code ? ' class="hi"' : '') + '><td>' + u.code + '</td><td>' + flName(u.fl) + '</td><td>' + u.dir + '</td><td>' + u.view + '</td><td class="num">' + ty(u.price) + '</td><td class="r"><a class="row-btn" href="' + R + 'mat-bang/?can=' + u.code + '">Trên mặt bằng</a></td></tr>'; }).join('');
  var minP = Math.min.apply(null, av.map(function (u) { return u.price; })), maxP = Math.max.apply(null, av.map(function (u) { return u.price; }));
  $('#udRange').textContent = ty(minP) + ' – ' + ty(maxP);
  if (cur) { $('#udCur').innerHTML = 'Bạn đang xem căn <b>' + cur.code + '</b> · ' + ty(cur.price) + ' (giá ví dụ)'; $('#udCur').hidden = false; }
  if (calcs[0]) calcs[0].set(cur ? cur.price : minP);
}

/* ================= TIỆN ÍCH ================= */
var am = $('#amMap');
if (am) {
  var AD = JSON.parse($('#amData').textContent), amLv = 'p', amCat = 'all';
  function amPick(k) {
    var a = AD[k]; if (!a) return;
    $$('.zn', am).forEach(function (z) { z.classList.toggle('on', z.getAttribute('data-k') === k); });
    $$('.am-list button').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-k') === k); });
    var im = $('#amImg'); im.style.opacity = 0;
    setTimeout(function () { im.src = 'https://images.unsplash.com/photo-' + a.img + '?auto=format&fit=crop&w=900&q=80'; im.alt = a.alt; im.style.opacity = 1; }, RM ? 0 : 180);
    $('#amName').textContent = a.n; $('#amTxt').textContent = a.t; $('#amHr').textContent = a.h;
  }
  function amLevel(lv) {
    amLv = lv; $$('[data-lv]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-lv') === lv); });
    $$('.am-lv', am).forEach(function (g) { g.style.display = g.getAttribute('data-lv') === lv ? '' : 'none'; });
    amFilter(); var first = $('.am-list button:not(.off)'); first && amPick(first.getAttribute('data-k'));
  }
  function amFilter() {
    $$('.zn', am).forEach(function (z) { var c = AD[z.getAttribute('data-k')].c; z.classList.toggle('dim', amCat !== 'all' && c !== amCat); });
    $$('.am-list button').forEach(function (b) { var a = AD[b.getAttribute('data-k')]; b.classList.toggle('off', a.lv !== amLv || (amCat !== 'all' && a.c !== amCat)); });
  }
  $$('.zn', am).forEach(function (z) {
    z.addEventListener('click', function () { amPick(z.getAttribute('data-k')); });
    z.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); amPick(z.getAttribute('data-k')); } });
  });
  $$('.am-list button').forEach(function (b) { b.addEventListener('click', function () { amPick(b.getAttribute('data-k')); }); });
  $$('[data-lv]').forEach(function (b) { b.addEventListener('click', function () { amLevel(b.getAttribute('data-lv')); }); });
  $$('[data-cat]').forEach(function (b) { b.addEventListener('click', function () { amCat = b.getAttribute('data-cat'); $$('[data-cat]').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); amFilter(); }); });
  amLevel('p');
}

/* ================= TIẾN ĐỘ ================= */
$$('[data-tl]').forEach(function (b) {
  b.addEventListener('click', function () {
    var f = b.getAttribute('data-tl'); $$('[data-tl]').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
    $$('.tl-item').forEach(function (it) { it.classList.toggle('off', f !== 'all' && !it.classList.contains(f)); });
  });
});
var diary = $('#diary');
if (diary) {
  $$('[data-dy]', diary).forEach(function (b) {
    b.addEventListener('click', function () {
      $$('[data-dy]', diary).forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
      var im = $('img', diary); im.style.opacity = 0;
      setTimeout(function () { im.src = 'https://images.unsplash.com/photo-' + b.getAttribute('data-img') + '?auto=format&fit=crop&w=1200&q=80'; im.alt = b.getAttribute('data-alt'); im.style.opacity = 1; }, RM ? 0 : 200);
      $('#dyT').textContent = b.getAttribute('data-t'); $('#dyM').textContent = b.textContent;
    });
  });
}
var docs = $('#docs');
if (docs) {
  var seen = store.get('docs', []);
  function docProg() { var n = $$('.doc', docs).length; $('#docN').textContent = seen.length + '/' + n; $('#docBar').style.setProperty('--v', seen.length / n); }
  $$('.doc .acc-btn', docs).forEach(function (b) {
    var k = b.closest('.doc').getAttribute('data-k');
    if (seen.indexOf(k) > -1) b.closest('.doc').classList.add('seen');
    b.addEventListener('click', function () { if (seen.indexOf(k) < 0) { seen.push(k); store.set('docs', seen); docProg(); } });
  });
  docProg();
}

/* ================= CHÍNH SÁCH: PHƯƠNG ÁN THANH TOÁN ================= */
var payBar = $('#payBar');
if (payBar) {
  var PL = JSON.parse($('#payData').textContent), cur = 'a', base = 6.6e9;
  function payDraw() {
    var P = PL[cur], acc = 0;
    $$('[data-plan]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-plan') === cur); });
    payBar.innerHTML = P.rows.map(function (r) { var h = '<span class="seg-b ' + (r[3] || '') + '" style="left:' + acc + '%;width:' + r[1] + '%" title="' + r[0] + ': ' + r[1] + '%"></span>'; acc += r[1]; return h; }).join('') +
      '<span class="pay-mark" style="left:5%"><b>Cọc ≤ 5%</b><span>khi ký thoả thuận</span></span>' +
      '<span class="pay-mark" style="left:70%"><b>≤ 70% trước bàn giao</b><span>gồm cả phần vay</span></span>' +
      '<span class="pay-mark rt" style="left:95%"><b>5% khi có sổ</b><span>sổ hồng cấp cho bạn</span></span>';
    acc = 0;
    $('#payRows').innerHTML = P.rows.map(function (r, i) { acc += r[1]; return '<tr><td>' + (i + 1 < 10 ? '0' + (i + 1) : i + 1) + '</td><td>' + r[0] + '<small>' + r[2] + '</small></td><td class="pc">' + r[1] + '%</td><td class="num">' + acc + '%</td><td class="r num">' + vnd(base * r[1] / 100) + '</td></tr>'; }).join('');
    $('#payNote').innerHTML = P.note;
  }
  $$('[data-plan]').forEach(function (b) { b.addEventListener('click', function () { cur = b.getAttribute('data-plan'); payDraw(); }); });
  var ps = $('#payBase'); ps && ps.addEventListener('change', function () { base = +ps.value; payDraw(); if (calcs[0]) calcs[0].set(base); });
  payDraw(); if (calcs[0]) calcs[0].set(base);
}

/* ================= TIN TỨC ================= */
var nw = $('#nwGrid');
if (nw) {
  var cat = 'all', nq = $('#nwQ');
  function nwF() {
    var q = norm(nq.value.trim()), n = 0;
    $$('.n-card', nw).forEach(function (c) { var ok = (cat === 'all' || c.getAttribute('data-c') === cat) && (!q || norm(c.textContent).indexOf(q) > -1); c.classList.toggle('off', !ok); if (ok) n++; });
    $('#nwNone').hidden = n > 0; $('#nwN').textContent = n;
  }
  $$('[data-nc]').forEach(function (b) { b.addEventListener('click', function () { cat = b.getAttribute('data-nc'); $$('[data-nc]').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); nwF(); }); });
  nq.addEventListener('input', nwF); nwF();
}
var art = $('#art');
if (art) {
  var bar = $('.art-prog'), hs = $$('.prose h2[id]', art), tl = $$('.art-toc a');
  function ap() {
    var r = art.getBoundingClientRect(), k = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
    bar.style.transform = 'scaleX(' + k + ')';
    var cur = hs[0]; hs.forEach(function (h) { if (h.getBoundingClientRect().top < 160) cur = h; });
    tl.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + cur.id); });
  }
  window.addEventListener('scroll', ap, { passive: true }); ap();
  var cp = $('#copyLink'); cp && cp.addEventListener('click', function () { try { navigator.clipboard.writeText(location.href).then(function () { toast('Đã chép đường dẫn bài viết'); }, function () { toast('Không chép được, hãy chép từ thanh địa chỉ'); }); } catch (e) { toast('Không chép được, hãy chép từ thanh địa chỉ'); } });
  var pr = $('#printArt'); pr && pr.addEventListener('click', function () { window.print(); });
}

/* ================= LIÊN HỆ: ĐẶT LỊCH NHIỀU BƯỚC ================= */
var bk = $('#bk');
if (bk) {
  var step = 0, panes = $$('.bk-pane', bk), lis = $$('.bk-steps li', bk), B = { day: null, slot: null };
  var qp = new URLSearchParams(location.search), preset = qp.get('can') || (qp.get('tu') === 'yeu-thich' && fav.length ? fav.join(', ') : '') || '';
  if (preset) { $('#bkCan').value = preset; }
  var want = [], LV = { '1': '1 phòng ngủ', '2': '2 phòng ngủ', '2+': '2 phòng ngủ', '3': '3 phòng ngủ', 'D': 'Duplex', 'S': 'Shop chân đế' };
  if (qp.get('loai') === '2pn') want.push('2 phòng ngủ');
  preset.split(',').forEach(function (k) { k = k.trim(); if (UNITS[k]) want.push(LV[UNITS[k].type]); });
  $$('[name=loai]', bk).forEach(function (c) { if (want.indexOf(c.value) > -1) c.checked = true; });
  // ngày: 14 ngày tới, bỏ qua hôm nay
  var DN = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'], days = $('#bkDays'), now = new Date(), dh = '';
  for (var i = 1; i <= 14; i++) { var dt = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i); dh += '<button type="button" aria-pressed="false" data-d="' + dt.toISOString().slice(0, 10) + '" aria-label="' + DN[dt.getDay()] + ' ' + dt.getDate() + '/' + (dt.getMonth() + 1) + '"><small>' + DN[dt.getDay()] + '</small><b>' + dt.getDate() + '</b><small>' + ('0' + (dt.getMonth() + 1)).slice(-2) + '</small></button>'; }
  days.innerHTML = dh;
  var SL = ['08:30', '09:30', '10:30', '13:30', '14:30', '15:30', '16:30', '17:15'];
  function slots() {
    $('#bkSlots').innerHTML = SL.map(function (s) { var full = B.day && hash(B.day + s) < .28; return '<button type="button" aria-pressed="' + (B.slot === s && !full) + '" data-s="' + s + '"' + (full ? ' disabled aria-label="' + s + ' đã kín"' : '') + '>' + s + '</button>'; }).join('');
    $$('#bkSlots button').forEach(function (b) { b.addEventListener('click', function () { B.slot = b.getAttribute('data-s'); $$('#bkSlots button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); err('slot', ''); }); });
  }
  $$('button', days).forEach(function (b) { b.addEventListener('click', function () { B.day = b.getAttribute('data-d'); B.slot = null; $$('button', days).forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); slots(); err('day', ''); }); });
  slots();
  function err(n, m) { var e = $('#e-' + n, bk); if (e) e.textContent = m; var f = bk.querySelector('[name=' + n + ']'); if (f && f.type !== 'radio') f.setAttribute('aria-invalid', m ? 'true' : 'false'); return !m; }
  function val(n) { var f = bk.querySelector('[name=' + n + ']:checked') || bk.querySelector('[name=' + n + ']'); return f ? (f.type === 'checkbox' ? f.checked : f.value.trim()) : ''; }
  function check(s) {
    var ok = true;
    if (s === 0) { ok = err('loai', bk.querySelector('[name=loai]:checked') ? '' : 'Chọn ít nhất một loại căn bạn muốn xem.') && ok; }
    if (s === 1) { ok = err('day', B.day ? '' : 'Chọn ngày bạn muốn đến.') && ok; ok = err('slot', B.slot ? '' : 'Chọn một khung giờ còn trống.') && ok; }
    if (s === 2) {
      ok = err('ten', val('ten').length >= 2 ? '' : 'Nhập họ và tên (ít nhất 2 ký tự).') && ok;
      ok = err('sdt', /^0\d{9}$/.test(val('sdt').replace(/[\s.]/g, '')) ? '' : 'Số điện thoại gồm 10 số, bắt đầu bằng 0.') && ok;
      var em = val('email'); ok = err('email', !em || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em) ? '' : 'Email chưa đúng định dạng.') && ok;
    }
    if (s === 3) { ok = err('dongy', val('dongy') ? '' : 'Bạn cần đồng ý để chúng tôi liên hệ xác nhận lịch.') && ok; var c = $('[name=dongy]', bk); c.setAttribute('aria-invalid', val('dongy') ? 'false' : 'true'); }
    if (!ok) { var f = $('[aria-invalid=true]', panes[s]) || $('.err:not(:empty)', panes[s]); f && f.focus && f.focus(); }
    return ok;
  }
  function summary() {
    var loai = $$('[name=loai]:checked', bk).map(function (c) { return c.value; }).join(', ');
    var dd = B.day ? B.day.split('-').reverse().join('/') : '';
    var rows = [['Loại căn muốn xem', loai], ['Căn cụ thể', val('can') || 'Chưa chọn, tư vấn viên gợi ý'], ['Mục đích', val('mucdich')], ['Ngày giờ', dd + ' lúc ' + B.slot], ['Số người đi cùng', val('songuoi')], ['Họ tên', val('ten')], ['Điện thoại', val('sdt')], ['Email', val('email') || 'Không điền'], ['Ghi chú', val('ghichu') || 'Không có']];
    return rows.map(function (r) { return '<div><dt>' + r[0] + '</dt><dd>' + esc(r[1]) + '</dd></div>'; }).join('');
  }
  function go(n) {
    step = n; panes.forEach(function (p, i) { p.classList.toggle('on', i === n); });
    lis.forEach(function (l, i) { l.classList.toggle('on', i === n); l.classList.toggle('ok', i < n); });
    if (n === 3) $('#bkSum').innerHTML = summary();
    var h = $('h2', panes[n]); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    var top = bk.getBoundingClientRect().top; if (top < 80) window.scrollTo({ top: window.pageYOffset + top - 110, behavior: RM ? 'auto' : 'smooth' });
    store.set('bk', { step: n });
  }
  $$('[data-next]', bk).forEach(function (b) { b.addEventListener('click', function () { if (check(step)) go(step + 1); }); });
  $$('[data-prev]', bk).forEach(function (b) { b.addEventListener('click', function () { go(step - 1); }); });
  $$('[name=loai]', bk).forEach(function (c) { c.addEventListener('change', function () { err('loai', ''); }); });
  ['ten', 'sdt', 'email'].forEach(function (n) { var f = bk.querySelector('[name=' + n + ']'); f.addEventListener('blur', function () { if (f.value) check(2) || null; }); f.addEventListener('input', function () { if (f.getAttribute('aria-invalid') === 'true') err(n, ''); }); });
  $('[name=dongy]', bk).addEventListener('change', function () { if (this.checked) { err('dongy', ''); this.setAttribute('aria-invalid', 'false'); } });
  bk.addEventListener('submit', function (e) {
    e.preventDefault(); if (!check(3)) return;
    var c = 'ATR-' + B.day.slice(8, 10) + B.day.slice(5, 7) + '-' + String(Math.floor(1000 + Math.random() * 9000));
    $('#bkCode').textContent = c; $('#bkSum2').innerHTML = summary();
    panes.forEach(function (p) { p.classList.remove('on'); }); $('#bkDone').classList.add('on');
    lis.forEach(function (l) { l.classList.remove('on'); l.classList.add('ok'); });
    $('#bkDone h2').focus({ preventScroll: true });
    store.set('booking', { code: c, day: B.day, slot: B.slot });
  });
  var again = $('#bkAgain'); again && again.addEventListener('click', function () { bk.reset(); B = { day: null, slot: null }; $$('button', days).forEach(function (x) { x.setAttribute('aria-pressed', 'false'); }); slots(); $('#bkDone').classList.remove('on'); go(0); });
}

/* ================= PARALLAX NHẸ ================= */
var px = $$('[data-px]');
if (px.length && !RM && !STATIC) {
  var tick = false;
  function pxRun() { tick = false; px.forEach(function (el) { var r = el.parentElement.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return; var k = (r.top + r.height / 2 - innerHeight / 2) / innerHeight; el.style.transform = 'translate3d(0,' + (k * -parseFloat(el.getAttribute('data-px'))).toFixed(1) + 'px,0) scale(1.08)'; }); }
  window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(pxRun); } }, { passive: true }); pxRun();
}
})();
