(function () {
  document.documentElement.classList.add('js');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (id) { return document.getElementById(id); };

  /* search-snippet editor in the hero */
  var SN = window.SNIPS || [];
  if (SN.length && $('edT')) {
    var i = 0;
    var setStatic = function (s) { $('edShot').src = s.img; $('edFav').textContent = s.fav; $('edName').textContent = s.name; $('edUrl').textContent = s.url; $('edT').textContent = s.title; $('edD').textContent = s.desc; $('edTc').textContent = s.title.length; $('edDc').textContent = s.desc.length; };
    setStatic(SN[0]);
    if (!reduce) {
      var type = function (s) {
        $('edShot').style.opacity = 0;
        setTimeout(function () { $('edShot').src = s.img; $('edShot').style.opacity = 1; }, 250);
        $('edFav').textContent = s.fav; $('edName').textContent = s.name; $('edUrl').textContent = s.url;
        var t = 0, d = 0; $('edT').textContent = ''; $('edD').textContent = '';
        (function step() {
          if (t < s.title.length) { t += 2; $('edT').textContent = s.title.slice(0, t); $('edTc').textContent = Math.min(t, s.title.length); }
          else if (d < s.desc.length) { d += 4; $('edD').textContent = s.desc.slice(0, d); $('edDc').textContent = Math.min(d, s.desc.length); }
          else { setTimeout(next, 3200); return; }
          setTimeout(step, 28);
        })();
      };
      var edOn = true, ed = $('edT').closest('.editor') || $('edT');
      if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { edOn = es[0].isIntersecting; }).observe(ed);
      var next = function () { if (!edOn || document.hidden) { setTimeout(next, 800); return; } i = (i + 1) % SN.length; type(SN[i]); };
      setTimeout(next, 3600);
    }
  }

  /* portfolio: two slow marquee rows moving in opposite directions, filtered by industry */
  /* Marquee engine: every item is its own small layer, animated on the compositor (Web Animations API).
     No giant track, so iPhone never has to re-tile a 10,000px-wide layer while it scrolls. */
  var canAnim = !!Element.prototype.animate;
  var marquee = function (box, nodes, speed, rev) {
    var inn = document.createElement('div'); inn.className = 'mq-in';
    nodes.forEach(function (n) { inn.appendChild(n); });
    box.appendChild(inn);
    /* Z: page zoom on large screens (html{zoom}); rects come back zoomed, transforms are local px */
    var ib = inn.getBoundingClientRect(), Z = (inn.offsetWidth && ib.width / inn.offsetWidth) || 1;
    var gap = parseFloat(getComputedStyle(inn).columnGap) || 0, r0 = ib.left / Z;
    var rs = nodes.map(function (n) { var b = n.getBoundingClientRect(); return { left: b.left / Z, right: b.right / Z, width: b.width / Z, height: b.height / Z }; });
    var M = 0, H = 0; rs.forEach(function (r) { M = Math.max(M, r.width); H = Math.max(H, r.height); });
    var S = rs[rs.length - 1].right - r0 + gap, vw = box.clientWidth || innerWidth;
    var sets = Math.max(1, Math.ceil((vw + M + gap) / S)), L = sets * S, T = L / speed * 1000;
    var all = [];
    for (var c = 0; c < sets; c++) nodes.forEach(function (n, j) {
      var e = n;
      if (c) { e = n.cloneNode(true); e.setAttribute('aria-hidden', 'true'); e.tabIndex = -1; e.querySelectorAll('a').forEach(function (a) { a.tabIndex = -1; }); inn.appendChild(e); }
      all.push({ e: e, o: rs[j].left - r0 + c * S });
    });
    inn.classList.add('on'); inn.style.height = H + 'px'; inn.style.setProperty('--m', -M + 'px');
    var anims = all.map(function (it) {
      var o = it.o >= L - M ? it.o - L : it.o;
      var p = rev ? (o + M) / L : (L - M - o) / L;
      var kf = [{ transform: 'translate3d(' + (rev ? 0 : L) + 'px,0,0)' }, { transform: 'translate3d(' + (rev ? L : 0) + 'px,0,0)' }];
      return it.e.animate(kf, { duration: T, iterations: Infinity, delay: -p * T, easing: 'linear' });
    });
    var hold = 0, sync = function () { anims.forEach(function (a) { if (hold) a.pause(); else a.play(); }); };
    var set = function (bit, on) { var h = on ? hold | bit : hold & ~bit; if (h !== hold) { hold = h; sync(); } };
    box.addEventListener('mouseenter', function () { set(1, true); }); box.addEventListener('mouseleave', function () { set(1, false); });
    box.addEventListener('focusin', function () { set(2, true); }); box.addEventListener('focusout', function () { set(2, false); });
    return { off: function (v) { set(4, v); }, kill: function () { anims.forEach(function (a) { a.cancel(); }); } };
  };

  /* client name ribbon */
  var rib = document.querySelector('.ribbon .track'), ribM;
  var ribBuild = function () {
    if (!rib || reduce || !canAnim) return;
    if (!rib._src) { var sp = [].slice.call(rib.children); rib._src = sp.slice(0, Math.ceil(sp.length / 2)); }
    if (ribM) ribM.kill();
    rib.innerHTML = ''; rib.classList.add('mqx');
    ribM = marquee(rib, rib._src.map(function (n) { return n.cloneNode(true); }), 55, false);
  };

  /* portfolio: two slow marquee rows moving in opposite directions, filtered by industry */
  var src = $('pfsrc'), rowsBox = $('pfrows'), cnt = document.querySelector('.pf-count'), fInd = 'all', pfM = [];
  var build = function () {
    if (!src || !rowsBox) return;
    var items = [].filter.call(src.querySelectorAll('.tile'), function (t) { return fInd === 'all' || t.dataset.i === fInd; });
    if (cnt) cnt.textContent = items.length + (document.documentElement.lang === 'en' ? ' sites' : ' website');
    pfM.forEach(function (m) { m.kill(); }); pfM = [];
    rowsBox.innerHTML = '';
    var still = reduce || !canAnim || items.length <= 4;
    rowsBox.classList.toggle('still', still); rowsBox.classList.toggle('scroll', still && items.length > 4);
    var nRows = still ? 1 : 2, rows = [];
    for (var r = 0; r < nRows; r++) rows.push([]);
    items.forEach(function (t, i) { rows[i % nRows].push(t); });
    rows.forEach(function (list, r) {
      var row = document.createElement('div'); row.className = 'mq-row' + (r % 2 ? ' rev' : '');
      rowsBox.appendChild(row);
      var nodes = list.map(function (t) { var c = t.cloneNode(true); c.querySelectorAll('img').forEach(function (im) { im.decoding = 'async'; }); return c; });
      if (still) { var track = document.createElement('div'); track.className = 'mq-track'; nodes.forEach(function (n) { track.appendChild(n); }); row.appendChild(track); return; }
      var m = marquee(row, nodes, Math.max(30, Math.min(48, innerWidth * .12)), r % 2 === 1);
      if (rowsBox.classList.contains('off')) m.off(true);
      pfM.push(m);
    });
  };
  document.querySelectorAll('.pf-ind button').forEach(function (b) {
    b.addEventListener('click', function () {
      fInd = b.dataset.i;
      document.querySelectorAll('.pf-ind button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      build();
    });
  });
  build(); ribBuild();
  /* deep link to an industry filter, e.g. /#bat-dong-san */
  var pfSlug = { 'bat-dong-san': 'realestate', 'real-estate': 'realestate', 'y-te': 'health', 'healthcare': 'health', 'lam-dep': 'beauty', 'beauty': 'beauty', 'nha-hang': 'food', 'food': 'food', 'khach-san': 'stay', 'hospitality': 'stay', 'ban-le': 'retail', 'retail': 'retail', 'xay-dung': 'build', 'construction': 'build', 'dich-vu': 'service', 'services': 'service', 'giao-duc': 'edu', 'education': 'edu', 'toc-barber': 'hair', 'barber': 'hair', 'hair': 'hair' };
  var pfHash = function (e) {
    var k = pfSlug[decodeURIComponent(location.hash.slice(1)).toLowerCase()];
    var b = k && document.querySelector('.pf-ind button[data-i="' + k + '"]');
    if (!b) return;
    b.click();
    var bar = b.parentNode; if (bar && bar.scrollWidth > bar.clientWidth) bar.scrollLeft += b.getBoundingClientRect().left - bar.getBoundingClientRect().left - (bar.clientWidth - b.offsetWidth) / 2;
    var sec = $('portfolio'); if (sec) setTimeout(function () {
      var jump = reduce || !e, de = document.documentElement, y = sec.getBoundingClientRect().top + pageYOffset - 16;
      if (jump) { de.style.scrollBehavior = 'auto'; window.scrollTo(0, y); de.style.scrollBehavior = ''; }
      else window.scrollTo({ top: y, behavior: 'smooth' });
    }, e ? 60 : 150);
  };
  pfHash(); addEventListener('hashchange', pfHash);
  if (document.fonts && document.fonts.status !== 'loaded') document.fonts.ready.then(function () { build(); ribBuild(); });
  /* pause the marquees while they are off screen */
  if ('IntersectionObserver' in window) {
    if (rowsBox) new IntersectionObserver(function (es) { var off = !es[0].isIntersecting; rowsBox.classList.toggle('off', off); pfM.forEach(function (m) { m.off(off); }); }).observe(rowsBox);
    if (rib) new IntersectionObserver(function (es) { if (ribM) ribM.off(!es[0].isIntersecting); }).observe(rib.parentNode);
  }
  var rt, lastW = innerWidth; addEventListener('resize', function () { if (Math.abs(innerWidth - lastW) < 40) return; lastW = innerWidth; clearTimeout(rt); rt = setTimeout(function () { build(); ribBuild(); }, 300); });

  /* copy email */
  var copy = $('copy');
  if (copy) copy.addEventListener('click', function () {
    var a = $('addr').textContent, ok = $('ok');
    var sel = function () { var r = document.createRange(); r.selectNodeContents($('addr')); var s = getSelection(); s.removeAllRanges(); s.addRange(r); };
    if (navigator.clipboard) navigator.clipboard.writeText(a).then(function () { ok.hidden = false; setTimeout(function () { ok.hidden = true; }, 1800); }, sel); else sel();
  });

  if (reduce) { document.querySelectorAll('.rv').forEach(function (e) { e.classList.add('in'); }); return; }

  /* pointer spotlight in the hero */
  var hero = document.querySelector('.hero');
  if (hero && matchMedia('(hover:hover)').matches) hero.addEventListener('pointermove', function (e) {
    var r = hero.getBoundingClientRect();
    hero.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    hero.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });

  /* reveal sections as they scroll in */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.rv').forEach(function (e) { io.observe(e); });
  } else document.querySelectorAll('.rv').forEach(function (e) { e.classList.add('in'); });
})();

/* certificates (v10): hover/tap brings one forward, click opens <dialog> */
(function () {
  var stack = document.querySelector('.cstack'), lb = document.getElementById('certLb');
  if (!stack) return;
  var capEl = document.querySelector('.certs-cap'), hint = capEl ? capEl.innerHTML : '';
  var items = stack.querySelectorAll('.cs'), touch = matchMedia('(hover:none)').matches;
  if (touch && capEl && capEl.getAttribute('data-touch')) { hint = capEl.getAttribute('data-touch'); capEl.innerHTML = hint; }
  function on(a) {
    items.forEach(function (x) { x.classList.toggle('on', x === a); });
    stack.classList.toggle('has-on', !!a);
    if (capEl) { if (a) capEl.textContent = a.getAttribute('data-cap'); else capEl.innerHTML = hint; }
  }
  items.forEach(function (a) {
    a.addEventListener('mouseenter', function () { if (!touch) on(a); });
    a.addEventListener('focus', function () { if (!touch) on(a); });
    a.addEventListener('click', function (e) {
      if (touch && !a.classList.contains('on')) { e.preventDefault(); on(a); return; }
      if (!lb || typeof lb.showModal !== 'function') return;
      e.preventDefault(); open(a);
    });
  });
  stack.addEventListener('mouseleave', function () { on(null); });
  if (!lb || typeof lb.showModal !== 'function') return;
  var img = lb.querySelector('img'), cap = lb.querySelector('.lb-cap span'), ver = lb.querySelector('.lb-cap a');
  function open(a) {
    img.src = a.getAttribute('href');
    var t = a.getAttribute('data-cap') || ''; cap.textContent = t; img.alt = t;
    var v = a.getAttribute('data-verify'); ver.hidden = !v; if (v) ver.href = v; else ver.removeAttribute('href');
    lb.showModal();
  }
  lb.querySelector('.lb-x').addEventListener('click', function () { lb.close(); });
  lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
})();

/* mobile header (v18): fixed bar + full-screen menu built from the page's own nav links */
(function () {
  var nav = document.querySelector('.nav'); if (!nav) return;
  var links = nav.querySelectorAll('nav a'); if (!links.length) return;
  var en = document.documentElement.lang === 'en';
  var right = nav.querySelector('.right') || nav;
  var btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'mnav-btn'; btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-controls', 'mnav');
  btn.setAttribute('aria-label', en ? 'Open menu' : 'Mở menu');
  btn.innerHTML = '<svg class="b" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10"/></svg>' +
    '<svg class="x" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  right.appendChild(btn);
  var panel = document.createElement('div'); panel.className = 'mnav'; panel.id = 'mnav';
  panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', en ? 'Menu' : 'Menu trang');
  var ol = document.createElement('ol');
  links.forEach(function (a) { var li = document.createElement('li'), c = a.cloneNode(true); c.removeAttribute('style'); li.appendChild(c); ol.appendChild(li); });
  panel.appendChild(ol);
  var zalo = '<svg class="zl" viewBox="0 0 24 24" aria-hidden="true"><path fill="#fff" stroke="none" d="M7.5 3h9a6 6 0 016 6v2.5a6 6 0 01-6 6H9.2l-4.1 3.1c-.5.4-1.2 0-1.1-.6l.5-3A6 6 0 011.5 11.5V9a6 6 0 016-6z"/><text x="12" y="12.9" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="800" font-size="7" fill="#E4471B" stroke="none" letter-spacing="-.2">Zalo</text></svg>';
  var tele = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.2 3.6L2.9 10.7c-.9.4-.9 1.6.1 1.9l4.6 1.5 1.8 5.5c.3.9 1.4 1.1 2 .4l2.6-2.7 4.7 3.5c.7.5 1.7.1 1.9-.8l3-14.9c.2-1-.7-1.8-1.6-1.5z"/></svg>';
  var mail = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>';
  var cta = document.createElement('div'); cta.className = 'cta';
  cta.innerHTML = en
    ? '<a class="p" href="mailto:kimtuyentb97@gmail.com">' + mail + 'Email me</a><a class="g" href="https://t.me/kimtuyen21297" target="_blank" rel="noopener">' + tele + 'Telegram</a>'
    : '<a class="p" href="https://zalo.me/0901432113" target="_blank" rel="noopener">' + zalo + 'Nhắn Zalo 0901 432 113</a><a class="g" href="https://t.me/kimtuyen21297" target="_blank" rel="noopener">' + tele + 'Telegram</a>';
  panel.appendChild(cta);
  var note = document.createElement('p'); note.className = 'note'; note.textContent = en ? 'Kim Tuyen Truong · Web design, SEO & AI search' : 'Kim Tuyen Truong · Thiết kế website, SEO & AIO';
  panel.appendChild(note);
  document.body.appendChild(panel);
  var root = document.documentElement;
  function set(open) {
    root.classList.toggle('mnav-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? (en ? 'Close menu' : 'Đóng menu') : (en ? 'Open menu' : 'Mở menu'));
  }
  btn.addEventListener('click', function () { set(!root.classList.contains('mnav-open')); });
  panel.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
  var lw = innerWidth; addEventListener('resize', function () { if (innerWidth !== lw) { lw = innerWidth; if (innerWidth > 900) set(false); } });
  addEventListener('pageshow', function () { set(false); });
})();

/* scroll-to-top button (v15): sits on top of the floating contact dock, shows after the first screen */
(function () {
  var dock = document.querySelector('.dock'); if (!dock) return;
  var en = document.documentElement.lang === 'en';
  var b = document.createElement('button');
  b.type = 'button'; b.className = 'totop'; b.setAttribute('aria-label', en ? 'Back to top' : 'Lên đầu trang');
  b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5.5 11.5L12 5l6.5 6.5"/></svg><span>' + (en ? 'Top' : 'Lên đầu trang') + '</span>';
  dock.insertBefore(b, dock.firstChild);
  var on = false, tk = 0;
  var upd = function () { tk = 0; var v = pageYOffset > innerHeight * 0.9; if (v !== on) { on = v; b.classList.toggle('on', v); } };
  addEventListener('scroll', function () { if (!tk) tk = requestAnimationFrame(upd); }, { passive: true }); upd();
  b.addEventListener('click', function () {
    var smooth = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
  });
})();

/* homepage package quiz (v16) */
(function () {
  var qz = document.getElementById('quiz'); if (!qz) return;
  var box = document.getElementById('qrIn'), Z = 'https://zalo.me/0901432113';
  var P = {
    lp: ['Landing Page', '3.500.000đ', 'Một trang tập trung vào một sản phẩm hoặc dịch vụ, có form và nút gọi, Zalo, gắn sẵn mã quảng cáo. Làm trong 7–10 ngày.'],
    mau: ['Website Theo Mẫu', '5.000.000đ', 'Chọn một mẫu có sẵn theo ngành, tôi đổi màu, logo, nội dung và hình ảnh theo thương hiệu của bạn. Làm trong 2–3 ngày sau khi nhận đủ thông tin.'],
    cb: ['Website Cơ Bản', '9.500.000đ', 'Tối đa 7 trang: Trang chủ, Giới thiệu, Dịch vụ, Liên hệ…, có trang quản trị để bạn tự sửa nội dung và giá. Làm trong 2–4 tuần.'],
    dn: ['Website Doanh Nghiệp', '18.500.000đ', 'Website chuyên nghiệp, đầy đủ chức năng, tối đa 20 trang, tặng 5 bài blog chuẩn SEO, AIO. Làm trong 5–8 tuần.'],
    bh: ['Website Bán Hàng', '22.500.000đ', 'Cửa hàng online có danh mục, giỏ hàng, đặt hàng, thanh toán và quản lý đơn hàng trong trang quản trị. Làm trong 6–9 tuần.']
  };
  var val = function (n) { var c = qz.querySelector('input[name="' + n + '"]:checked'); return c ? c.value : ''; };
  var esc = function (s) { return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var S1 = ['SEO & AIO Khởi Đầu', '10.500.000đ/tháng', 'Mỗi tháng 4 bài viết chuẩn SEO, AIO, sửa lỗi kỹ thuật, tối ưu Google Maps và báo cáo dễ hiểu. Tối thiểu 3 tháng.'];
  var S2 = ['SEO & AIO Tăng Trưởng', '25.000.000đ/tháng', 'Mỗi tháng 8 bài viết, thêm trang dịch vụ và khu vực, xây dựng liên kết, theo dõi hiển thị trong ChatGPT, Gemini. Tối thiểu 3 tháng.'];
  qz.addEventListener('change', function () {
    var a = val('q1'), b = val('q2'), c = val('q3'); if (!a && !b && !c) return;
    var main, add = null, big = a === 'dn' || a === 'bh';
    if (b === 'seo') main = big || c === 'high' ? S2 : S1;
    else {
      var k = a || 'cb';
      if (c === 'high') { k = a === 'bh' ? 'bh' : 'dn'; add = big ? S2 : S1; }
      else if (c === 'mid' && (k === 'lp' || k === 'mau')) k = 'cb';
      main = P[k];
    }
    var isSeo = main === S1 || main === S2;
    var link = isSeo ? '/dich-vu/seo-aio/#bang-gia-seo' : main[0] === 'Website Theo Mẫu' ? '/mau-website/' : '/dich-vu/thiet-ke-website/#bang-gia';
    var html = '<div class="rec"><small>Gợi ý cho bạn</small><h3>' + esc(main[0]) + '</h3><div class="price">' + esc(main[1]) + '</div><p>' + esc(main[2]) + '</p>';
    if (add) html += '<div class="addon"><b>Nên làm kèm: ' + esc(add[0]) + '</b><span>' + esc(add[1]) + '</span><p>' + esc(add[2]) + '</p><a href="/dich-vu/seo-aio/#bang-gia-seo">Xem gói SEO &amp; AIO&nbsp;&#x2192;&#xFE0E;</a></div>';
    html += '<p class="cta"><a class="btn" href="/lien-he/?goi=' + encodeURIComponent(main[0]) + '">Nhận báo giá gói này</a><a class="btn ghost" href="' + link + '">Xem chi tiết</a></p></div>';
    box.innerHTML = html;
  });
})();

/* contact form prefill from ?mau= ?nganh= ?goi= ?dv= (v16) */
(function () {
  var f = document.getElementById('lhForm'); if (!f || !window.URLSearchParams) return;
  var q = new URLSearchParams(location.search), mau = q.get('mau'), ng = q.get('nganh'), goi = q.get('goi'), dv = q.get('dv');
  if (ng && f.nganh) f.nganh.value = ng;
  if (goi && f.goi) [].forEach.call(f.goi.options, function (o) { if (o.text.indexOf(goi) === 0) f.goi.value = o.value || o.text; });
  if (dv && f.goi && /SEO|Google|AIO|ChatGPT/.test(dv)) [].forEach.call(f.goi.options, function (o) { if (o.text.indexOf('SEO & AIO Khởi Đầu') === 0) f.goi.value = o.value || o.text; });
  var msg = mau ? 'Tôi thích mẫu "' + mau + '", muốn làm website theo mẫu này.' : dv ? 'Tôi quan tâm dịch vụ ' + dv + '.' : '';
  if (msg && f.nd && !f.nd.value) f.nd.value = msg;
  if (mau || ng || goi || dv) { var h = f.querySelector('h2'); if (h) h.textContent = mau ? 'Nhận báo giá theo mẫu ' + mau : 'Gửi yêu cầu báo giá'; }
})();
