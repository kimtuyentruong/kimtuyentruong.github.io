/* Vọng Hà Residences — đặt lịch xem nhà mẫu 4 bước, mã xác nhận minh hoạ (không gửi dữ liệu) */
(function () {
'use strict';
var VH = window.VH, d = document, $ = VH.$, $$ = VH.$$;
var F = $('#bkF'), steps = $$('.step', F), dots = $$('.steps li'), prev = $('#bPrev'), next = $('#bNext'), serr = $('#serr');
var cur = 0, S = { day: null, slot: null };
var LOAI = { '1pn': '1PN+', '2pn': '2PN', 'duplex': 'Duplex', 'ph': 'Penthouse' };
var DOW = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
var SLOTS = ['08:30', '09:30', '10:30', '13:30', '14:30', '15:30', '17:00', '18:30'];

/* điền sẵn từ trang Căn hộ (?loai=&can=) */
var qs = new URLSearchParams(location.search);
if (qs.get('loai') && LOAI[qs.get('loai')]) { var r = F.querySelector('input[name=loai][value="' + qs.get('loai') + '"]'); if (r) r.checked = true; }
if (qs.get('can')) $('#b-can').value = qs.get('can').slice(0, 12);

/* ngày: lịch tháng, chọn trong 45 ngày tới */
var days = $('#days'), today = new Date(); today.setHours(0, 0, 0, 0);
var DL = [];
for (var i = 1; i <= 45; i++) { var x = new Date(today); x.setDate(x.getDate() + i); DL.push(x); }
function dd(x) { return ('0' + x.getDate()).slice(-2) + '/' + ('0' + (x.getMonth() + 1)).slice(-2) + '/' + x.getFullYear(); }
var calY = DL[0].getFullYear(), calMo = DL[0].getMonth(), lastD = DL[DL.length - 1];
function idxOf(dt) { var n = Math.round((dt - today) / 864e5) - 1; return n >= 0 && n < DL.length ? n : -1; }
function renderCal() {
  $('#calM').textContent = 'Tháng ' + (calMo + 1) + '/' + calY;
  var first = new Date(calY, calMo, 1), lead = (first.getDay() + 6) % 7, nd = new Date(calY, calMo + 1, 0).getDate(), h = '';
  for (var k = 0; k < lead; k++) h += '<span></span>';
  for (var dn = 1; dn <= nd; dn++) {
    var dt = new Date(calY, calMo, dn), ix = idxOf(dt), cls = (dt.getDay() === 0 ? 'sun' : '') + (+dt === +today ? ' today' : '');
    h += '<button type="button" class="' + cls + '"' + (ix < 0 ? ' disabled' : ' data-i="' + ix + '"') + ' aria-pressed="' + (ix >= 0 && ix === S.day ? 'true' : 'false') + '" aria-label="' + DOW[dt.getDay()] + ' ' + dd(dt) + (ix < 0 ? ', không nhận lịch' : '') + '">' + dn + '</button>';
  }
  days.innerHTML = h;
  $('#calPrev').disabled = calY === DL[0].getFullYear() && calMo === DL[0].getMonth();
  $('#calNext').disabled = calY === lastD.getFullYear() && calMo === lastD.getMonth();
}
$('#calPrev').addEventListener('click', function () { calMo--; if (calMo < 0) { calMo = 11; calY--; } renderCal(); });
$('#calNext').addEventListener('click', function () { calMo++; if (calMo > 11) { calMo = 0; calY++; } renderCal(); });
function full(di, si) { var v = (di * 7 + si * 13) % 11; return v === 3 || v === 7; }
function slots() {
  $('#slots').innerHTML = SLOTS.map(function (s, si) {
    var dis = S.day === null || full(S.day, si);
    return '<button type="button" data-s="' + s + '" aria-pressed="' + (S.slot === s ? 'true' : 'false') + '"' + (dis ? ' disabled' : '') + '>' + s + '</button>';
  }).join('');
}
days.addEventListener('click', function (e) {
  var b = e.target.closest('button'); if (!b || b.disabled) return;
  S.day = +b.getAttribute('data-i'); S.slot = null;
  $$('button', days).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
  $('#calSel').innerHTML = 'Đã chọn <b>' + DOW[DL[S.day].getDay()] + ', ' + dd(DL[S.day]) + '</b>. Chọn giờ bên dưới.';
  slots(); serr.textContent = '';
});
renderCal();
$('#slots').addEventListener('click', function (e) {
  var b = e.target.closest('button'); if (!b || b.disabled) return;
  S.slot = b.getAttribute('data-s');
  $$('#slots button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
  serr.textContent = '';
});
slots();

function check(n) {
  serr.textContent = '';
  if (n === 1 && (S.day === null || !S.slot)) { serr.textContent = S.day === null ? 'Vui lòng chọn ngày xem nhà mẫu.' : 'Vui lòng chọn giờ.'; return false; }
  if (n === 2) {
    var ok = true;
    [['#b-name', function (v) { return v.trim().length >= 2 ? '' : 'Vui lòng nhập họ tên.'; }],
     ['#b-phone', function (v) { return !v.trim() ? 'Vui lòng nhập số điện thoại.' : VH.vPhone(v) ? '' : 'Số điện thoại gồm 10 số, bắt đầu bằng 0.'; }],
     ['#b-mail', function (v) { return !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Email chưa đúng định dạng.'; }],
     ['#b-ok', function () { return $('#b-ok').checked ? '' : 'Vui lòng đồng ý để chúng tôi liên hệ xác nhận lịch.'; }]
    ].forEach(function (c) { var el = $(c[0]), m = c[1](el.value); VH.fieldErr(el, m); if (m && ok) { ok = false; el.focus(); } });
    return ok;
  }
  return true;
}
function review() {
  var loai = F.querySelector('input[name=loai]:checked').value, can = $('#b-can').value.trim();
  var rows = [['Loại căn', LOAI[loai] + (can ? ' · ' + can : ''), 0], ['Ngày giờ', DOW[DL[S.day].getDay()] + ', ' + dd(DL[S.day]) + ' lúc ' + S.slot, 1],
              ['Họ tên', $('#b-name').value.trim(), 2], ['Điện thoại', $('#b-phone').value.trim(), 2], ['Số người', $('#b-ppl').value, 2]];
  if ($('#b-mail').value.trim()) rows.push(['Email', $('#b-mail').value.trim(), 2]);
  $('#review').innerHTML = rows.map(function (r) { return '<div><dt>' + r[0] + '</dt><dd>' + VH.esc(r[1]) + '</dd><button type="button" data-go="' + r[2] + '">Sửa</button></div>'; }).join('');
}
function go(n) {
  cur = n;
  steps.forEach(function (s, i) { s.classList.toggle('on', i === n); });
  dots.forEach(function (li, i) { li.classList.toggle('on', i === n); li.classList.toggle('done', i < n); if (i === n) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current'); });
  prev.hidden = n === 0;
  next.innerHTML = (n === 3 ? 'Gửi đặt lịch ' : 'Tiếp tục ') + VH.ic('arrow');
  if (n === 3) review();
  var top = $('#bk').getBoundingClientRect().top + window.pageYOffset - 90;
  if (window.pageYOffset > top) window.scrollTo({ top: top, behavior: VH.RM ? 'auto' : 'smooth' });
  var h = steps[n].querySelector('h2'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
}
F.addEventListener('submit', function (e) {
  e.preventDefault();
  if (!check(cur)) return;
  if (cur < 3) { go(cur + 1); return; }
  var code = 'VH-' + (DL[S.day].getMonth() + 1) + ('0' + DL[S.day].getDate()).slice(-2) + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
  $('#conf-c').textContent = code;
  $('#conf-t').textContent = 'Hẹn bạn ' + DOW[DL[S.day].getDay()] + ', ' + dd(DL[S.day]) + ' lúc ' + S.slot + ' tại nhà mẫu. Chuyên viên sẽ gọi số ' + $('#b-phone').value.trim() + ' để xác nhận.';
  VH.store.set('booking', { code: code, day: dd(DL[S.day]), slot: S.slot });
  F.hidden = true; $('.steps').hidden = true; var c = $('#conf'); c.hidden = false; c.focus();
});
prev.addEventListener('click', function () { if (cur > 0) go(cur - 1); });
$('#review').addEventListener('click', function (e) { var b = e.target.closest('[data-go]'); if (b) go(+b.getAttribute('data-go')); });
$('#copy').addEventListener('click', function () {
  var t = $('#conf-c').textContent, b = this;
  function ok() { b.setAttribute('aria-label', 'Đã sao chép'); b.innerHTML = VH.ic('check'); setTimeout(function () { b.innerHTML = VH.ic('copy'); b.setAttribute('aria-label', 'Sao chép mã xác nhận'); }, 1600); }
  if (navigator.clipboard) navigator.clipboard.writeText(t).then(ok, ok); else ok();
});
$('#again').addEventListener('click', function () {
  F.reset(); S = { day: null, slot: null }; renderCal(); $('#calSel').textContent = 'Chọn một ngày trong 45 ngày tới.'; slots();
  $('#conf').hidden = true; F.hidden = false; $('.steps').hidden = false; go(0);
});
})();
