/* Template pages: turn the "Mẫu giao diện · Nhận báo giá" badge into a priced call to action
   that opens the contact form prefilled with this template's name. Added by build.py to every /mau/ page. */
(function () {
  var me = document.currentScript, name = me && me.getAttribute('data-mau');
  function run() {
    var b = document.querySelector('a.kt-badge, a.sales-badge') || document.querySelector('a[href="/lien-he/"]');
    if (!b) return;
    if (name) b.setAttribute('href', '/lien-he/?mau=' + encodeURIComponent(name));
    var el = b.querySelector('span') || b;
    var h = el.innerHTML, i = h.indexOf('<b');
    var lead = 'Làm web giống mẫu này từ&nbsp;5.000.000đ — ';
    el.innerHTML = i > -1 ? lead + h.slice(i) : lead + '<b>Nhận&nbsp;báo&nbsp;giá</b>';
    b.setAttribute('title', 'Website theo mẫu 5.000.000đ, xong trong 2–3 ngày khi có đủ thông tin');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
