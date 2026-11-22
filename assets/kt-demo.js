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
/* v5 (Tuyền 22/11/2026): "Quay lại · Trang chủ" pill on every template page. Back = the same-site page the visitor came from
   (not another page of this template), else this template's industry page (/mau-website/<ngành>/, data-nganh), else "/".
   Sits above the buy badge at the bottom-left, moved further up if it would cover another fixed element; z-index under template menus. */
(function () {
  var me = document.currentScript, ng = me && me.getAttribute('data-nganh');
  function run() {
    if (document.querySelector('.kt-back')) return;
    var en = (document.documentElement.lang || '').slice(0, 2) === 'en';
    var slug = location.pathname.split('/')[2] || '', back = ng ? '/mau-website/' + ng + '/' : (en ? '/en/' : '/');
    try {
      var r = document.referrer && new URL(document.referrer);
      if (r && r.origin === location.origin && r.pathname.indexOf('/mau/' + slug + '/') !== 0) back = r.pathname + r.search + r.hash;
    } catch (e) {}
    var css = document.createElement('style');
    css.textContent = '.kt-back{position:fixed;left:12px;bottom:60px;z-index:89;display:inline-flex;align-items:center;gap:2px;padding:4px;border-radius:999px;background:rgba(24,18,14,.88);box-shadow:0 8px 24px -10px rgba(0,0,0,.6);font:600 13px/1.2 system-ui,-apple-system,"Segoe UI",sans-serif}' +
      '.kt-back a{display:inline-flex;align-items:center;gap:6px;min-height:34px;padding:0 12px;border-radius:999px;color:#fff;text-decoration:none;white-space:nowrap}' +
      '.kt-back a:hover,.kt-back a:focus-visible{background:rgba(255,255,255,.14);outline:none}' +
      '.kt-back i{width:1px;height:16px;background:rgba(255,255,255,.25)}' +
      '.kt-back svg{flex:none}';
    document.head.appendChild(css);
    var nav = document.createElement('nav'); nav.className = 'kt-back'; nav.setAttribute('aria-label', en ? 'Back' : 'Quay lại');
    var arrow = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';
    var home = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/></svg>';
    nav.innerHTML = '<a href="' + back + '">' + arrow + (en ? 'Back' : 'Quay lại') + '</a><i></i><a href="' + (en ? '/en/' : '/') + '">' + home + (en ? 'Home' : 'Trang chủ') + '</a>';
    document.body.appendChild(nav);
    place(nav);
    var w0 = innerWidth; addEventListener('resize', function () { if (innerWidth !== w0) { w0 = innerWidth; place(nav); } });
  }
  function place(nav) {
    var badge = document.querySelector('a.kt-badge, a.sales-badge');
    var bottom = 12;
    if (badge) { var br = badge.getBoundingClientRect(); if (br.height && br.left < 260) bottom = Math.round(innerHeight - br.top) + 8; }
    nav.style.bottom = bottom + 'px';
    for (var k = 0; k < 4; k++) {  /* move up past any other fixed element it would cover (chat button, cookie bar, toast) */
      var r = nav.getBoundingClientRect(), hit = null;
      [].forEach.call(document.body.querySelectorAll('*'), function (e) {
        if (hit || e === nav || nav.contains(e) || e === badge || (badge && badge.contains(e))) return;
        var cs = getComputedStyle(e); if (cs.position !== 'fixed' || cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) return;
        var o = e.getBoundingClientRect(); if (!o.width || !o.height || o.height > innerHeight * .5) return;
        if (o.left < r.right && o.right > r.left && o.top < r.bottom && o.bottom > r.top) hit = o;
      });
      if (!hit) break;
      bottom = Math.round(innerHeight - hit.top) + 8; nav.style.bottom = bottom + 'px';
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();

