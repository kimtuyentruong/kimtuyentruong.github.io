/* Template pages: turn the "Mẫu giao diện · Nhận báo giá" badge into a priced call to action that opens the
   contact form's order box (same link as the card's "Chọn mẫu này"). Tag added by pages_multi.demo_badges with
   data-mau, data-gia, data-loai (v2, 16/11/2026: badge used to say "từ 5.000.000đ" and carried no price). */
(function () {
  var me = document.currentScript, name = me && me.getAttribute('data-mau'),
      gia = me && me.getAttribute('data-gia'), loai = me && me.getAttribute('data-loai'),
      nd = me && me.getAttribute('data-nd'), setup = me && me.getAttribute('data-setup');  /* v3: per-template fees (22/11/2026) */
  function vnd(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ'; }
  function run() {
    var b = document.querySelector('a.kt-badge, a.sales-badge') || document.querySelector('a[href="/lien-he/"]');
    if (!b || !name) return;
    var q = '/lien-he/?mau=' + encodeURIComponent(name);
    if (gia) q += '&gia=' + gia + '&loai=' + (loai || 'one') + (nd ? '&nd=' + nd : '') + (setup ? '&setup=' + setup : '');
    b.setAttribute('href', q);
    var el = b.querySelector('span') || b;
    /* v4 (Tuyền 22/11/2026): "Mua ngay mẫu <Tên> (full source code) – <giá>"; under 600px the name is dropped
       ("Mua mẫu này …") so long names never wrap badly on phones */
    var esc = function (t) { var d = document.createElement('i'); d.textContent = t; return d.innerHTML.replace(/ /g, '&nbsp;'); };
    var paint = function () {
      var narrow = window.matchMedia && matchMedia('(max-width: 600px)').matches;
      el.innerHTML = gia
        ? (narrow ? 'Mua&nbsp;mẫu&nbsp;này' : 'Mua ngay mẫu <b>' + esc(name) + '</b>') + ' (full&nbsp;source&nbsp;code) –&nbsp;<b>' + vnd(gia) + '</b>'
        : 'Mua ngay mẫu ' + (narrow ? 'này' : '<b>' + esc(name) + '</b>') + ' –&nbsp;<b>Nhận&nbsp;báo&nbsp;giá</b>';
    };
    paint();
    if (window.matchMedia) { var mq = matchMedia('(max-width: 600px)'); (mq.addEventListener ? mq.addEventListener('change', paint) : mq.addListener(paint)); }
    b.setAttribute('title', gia ? 'Mua ngay mẫu ' + name + ' (full source code) – ' + vnd(gia) : 'Nhận báo giá');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
