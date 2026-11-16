/* Template pages: turn the "Mẫu giao diện · Nhận báo giá" badge into a priced call to action that opens the
   contact form's order box (same link as the card's "Chọn mẫu này"). Tag added by pages_multi.demo_badges with
   data-mau, data-gia, data-loai (v2, 16/11/2026: badge used to say "từ 5.000.000đ" and carried no price). */
(function () {
  var me = document.currentScript, name = me && me.getAttribute('data-mau'),
      gia = me && me.getAttribute('data-gia'), loai = me && me.getAttribute('data-loai');
  function vnd(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ'; }
  function run() {
    var b = document.querySelector('a.kt-badge, a.sales-badge') || document.querySelector('a[href="/lien-he/"]');
    if (!b || !name) return;
    var q = '/lien-he/?mau=' + encodeURIComponent(name);
    if (gia) q += '&gia=' + gia + '&loai=' + (loai || 'one');
    b.setAttribute('href', q);
    var el = b.querySelector('span') || b;
    el.innerHTML = gia ? 'Làm web giống mẫu này: <b>' + vnd(gia) + '</b> — <b>Chọn&nbsp;mẫu&nbsp;này</b>'
                       : 'Làm web giống mẫu này — <b>Nhận&nbsp;báo&nbsp;giá</b>';
    b.setAttribute('title', gia ? 'Giá mẫu ' + vnd(gia) + ': nhận source code và hướng dẫn cài' : 'Nhận báo giá');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
