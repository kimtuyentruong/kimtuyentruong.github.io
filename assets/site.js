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
          else { setTimeout(next, 7500); return; }
          setTimeout(step, 45);
        })();
      };
      var edOn = true, ed = $('edT').closest('.editor') || $('edT');
      if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { edOn = es[0].isIntersecting; }).observe(ed);
      var next = function () { if (!edOn || document.hidden) { setTimeout(next, 800); return; } i = (i + 1) % SN.length; type(SN[i]); };
      setTimeout(next, 6500);
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
  var pfSlug = { 'bat-dong-san': 'realestate', 'real-estate': 'realestate', 'y-te': 'health', 'healthcare': 'health', 'lam-dep': 'beauty', 'beauty': 'beauty', 'nha-hang': 'food', 'food': 'food', 'khach-san': 'stay', 'hospitality': 'stay', 'ban-le': 'retail', 'retail': 'retail', 'xay-dung': 'build', 'construction': 'build', 'luat': 'law', 'law': 'law', 'dich-vu': 'service', 'services': 'service', 'giao-duc': 'edu', 'education': 'edu', 'toc-barber': 'hair', 'barber': 'hair', 'hair': 'hair' };
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
  /* homepage industry chips on phones (v37): two slow rows moving in opposite directions; wider screens keep the wrapped chips */
  var chipBox = document.querySelector('.pick .chips'), chipM = [];
  var chipsBuild = function () {
    if (!chipBox) return;
    if (!chipBox._src) chipBox._src = [].slice.call(chipBox.children);
    chipM.forEach(function (m) { m.kill(); }); chipM = [];
    var on = innerWidth <= 600 && !reduce && canAnim, src = chipBox._src;
    chipBox.innerHTML = ''; chipBox.classList.toggle('mqc', on);
    if (!on) { src.forEach(function (n) { chipBox.appendChild(n); }); return; }
    var half = Math.ceil(src.length / 2);
    [src.slice(0, half), src.slice(half)].forEach(function (part, r) {
      var row = document.createElement('div'); row.className = 'chips-row'; chipBox.appendChild(row);
      chipM.push(marquee(row, part.map(function (n) { return n.cloneNode(true); }), 20, r === 1));
    });
  };
  chipsBuild();
  if (document.fonts && document.fonts.status !== 'loaded') document.fonts.ready.then(chipsBuild);
  if (chipBox && 'IntersectionObserver' in window) new IntersectionObserver(function (es) { chipM.forEach(function (m) { m.off(!es[0].isIntersecting); }); }).observe(chipBox);
  var rt, lastW = innerWidth; addEventListener('resize', function () { if (Math.abs(innerWidth - lastW) < 40) return; lastW = innerWidth; clearTimeout(rt); rt = setTimeout(function () { build(); ribBuild(); chipsBuild(); }, 300); });

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
  links.forEach(function (a, i) {
    var li = document.createElement('li'), c = a.cloneNode(true); c.removeAttribute('style'); c.removeAttribute('class');
    if (a.className) { li.className = a.className; var nx = links[i + 1]; if (!nx || !nx.classList.contains('s')) li.classList.add('s-last'); }
    li.appendChild(c); ol.appendChild(li);
  });
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

/* homepage package finder (v27): a wizard. One step is on screen; answering it shows the next step in the same place; after step 3 the answers and the result are shown */
(function () {
  var qz = document.getElementById('quiz'), D = window.QZ; if (!qz || !D) return;
  var box = document.getElementById('qrIn'), wait = box.innerHTML, wrap = qz.querySelector('.qz');
  var steps = [].slice.call(qz.querySelectorAll('.qstep')), prog = qz.querySelectorAll('.qz-prog li'), view = 0;
  var sum = document.createElement('div'); sum.className = 'qz-sum'; wrap.appendChild(sum); qz.classList.add('js');
  var val = function (n) { var c = qz.querySelector('input[name="' + n + '"]:checked'); return c ? c.value : ''; };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var list = function (p) { return '<ul class="inc">' + p.b.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + (p.t ? '<li>Thời gian làm: ' + esc(p.t) + '</li>' : '') + '</ul>'; };
  function render(toResult) {
    var ans = [val('q1'), val('q2'), val('q3')], all = ans[0] && ans[1] && ans[2];
    steps.forEach(function (f, i) { f.classList.toggle('on', i === view); f.classList.toggle('done', !!ans[i] && i !== view); });
    [].forEach.call(prog, function (li, i) { li.classList.toggle('on', i === view); li.classList.toggle('done', !!ans[i] && i !== view); });
    sum.classList.toggle('on', view === 3);
    if (view === 3) sum.innerHTML = '<b>Câu trả lời của bạn</b><ol>' + steps.map(function (f, i) {
      var c = f.querySelector('input:checked'), l = f.querySelector('h3');
      return '<li><span>' + esc(l.textContent.trim()) + '</span><em>' + esc(c ? c.parentNode.textContent.trim() : '') + '</em><button type="button" data-go="' + i + '">Đổi</button></li>';
    }).join('') + '</ol>';
    if (!all) {
      box.innerHTML = wait;
      var left = 3 - ans.filter(Boolean).length, b = box.querySelector('.qr-wait b');
      if (b && left < 3) b.textContent = 'Còn ' + left + ' bước nữa';
      return;
    }
    var a = ans[0], main, add = null, big = a === 'dn' || a === 'bh';
    if (ans[1] === 'seo') main = D[big || ans[2] === 'high' ? 's2' : 's1'];
    else {
      var k = a;
      if (ans[2] === 'high') { k = a === 'bh' ? 'bh' : 'dn'; add = D[big ? 's2' : 's1']; }
      else if (ans[2] === 'mid' && (k === 'lp' || k === 'mau')) k = 'cb';
      main = D[k];
    }
    var html = '<div class="rec"><small>Gói hợp với bạn</small><h3>' + esc(main.n) + '</h3><p class="for">' + esc(main.f) + '</p><b class="inc-h">Gói này gồm</b>' + list(main);
    if (add) html += '<div class="addon"><b>Nên làm kèm: ' + esc(add.n) + '</b><p>' + esc(add.f) + '</p><a href="' + add.u + '">Xem giá gói SEO &amp; AIO&nbsp;&#x2192;&#xFE0E;</a></div>';
    html += '<p class="cta"><a class="btn" href="' + main.u + '">Xem giá gói này</a><a class="btn ghost" href="/lien-he/?goi=' + encodeURIComponent(main.n) + '">Nhận tư vấn</a></p>' +
      '<button type="button" class="again">Chọn lại từ đầu</button></div>';
    box.innerHTML = html;
    if (toResult && innerWidth <= 900) { var r = document.getElementById('qr'); if (r && r.scrollIntoView) r.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }); }
  }
  function go(i) { view = i; render(false); }
  qz.addEventListener('change', function (e) {
    var f = e.target.closest('.qstep'), i = steps.indexOf(f), ans = [val('q1'), val('q2'), val('q3')], n = -1;
    for (var k = 1; k <= 3; k++) { var j = (i + k) % 3; if (!ans[j]) { n = j; break; } }
    setTimeout(function () { view = n < 0 ? 3 : n; render(n < 0); }, 220);
  });
  qz.addEventListener('click', function (e) {
    var t = e.target; if (!t.closest) return;
    var g = t.closest('[data-go]'); if (g) return go(+g.getAttribute('data-go'));
    var li = t.closest('.qz-prog li'); if (li) return go([].indexOf.call(prog, li));
    if (t.closest('.again')) { [].forEach.call(qz.querySelectorAll('input:checked'), function (x) { x.checked = false; }); go(0); if (innerWidth <= 900 && qz.scrollIntoView) qz.scrollIntoView({ block: 'start' }); }
  });
  addEventListener('pageshow', function () { var ans = [val('q1'), val('q2'), val('q3')]; view = ans[0] ? ans[1] ? ans[2] ? 3 : 2 : 1 : 0; render(false); });
  render(false);
})();

/* pricing table: a package opened by its own link (#goi-…) is highlighted */
(function () {
  function mark() {
    var id = location.hash.slice(1); if (id.indexOf('goi-') !== 0) return;
    var el = document.getElementById(id); if (!el) return;
    [].forEach.call(document.querySelectorAll('.plan.target'), function (p) { p.classList.remove('target'); });
    el.classList.add('target');
    var go = function () { var r = el.getBoundingClientRect(); if (r.top < 0 || r.top > innerHeight * .6) el.scrollIntoView({ block: 'start' }); };
    setTimeout(go, 80); addEventListener('load', function () { setTimeout(go, 60); });
  }
  addEventListener('hashchange', mark); mark();
})();

/* contact form prefill from ?mau= ?nganh= ?goi= ?dv= (v16) */
(function () {
  var f = document.getElementById('lhForm'); if (!f || !window.URLSearchParams) return;
  var q = new URLSearchParams(location.search), mau = q.get('mau'), ng = q.get('nganh'), goi = q.get('goi'), dv = q.get('dv');
  if (ng && f.nganh) f.nganh.value = ng;
  if (goi && f.goi) [].forEach.call(f.goi.options, function (o) { if (o.text.indexOf(goi) === 0) f.goi.value = o.value || o.text; });
  if (dv && f.goi && /SEO|Google|AIO|ChatGPT/.test(dv)) [].forEach.call(f.goi.options, function (o) { if (o.text.indexOf('SEO & AIO Khởi Đầu') === 0) f.goi.value = o.value || o.text; });
  var msg = mau ? 'Mình thích mẫu "' + mau + '", muốn làm website theo mẫu này.' : dv ? 'Mình quan tâm dịch vụ ' + dv + '.' : '';
  if (msg && f.nd && !f.nd.value) f.nd.value = msg;
  if (mau || ng || goi || dv) { var h = f.querySelector('h2'); if (h) h.textContent = mau ? 'Nhận báo giá theo mẫu ' + mau : 'Gửi yêu cầu báo giá'; }
  if (mau) {
    if (f.goi) [].forEach.call(f.goi.options, function (o) { if (o.text.indexOf('Website Theo Mẫu') === 0) f.goi.value = o.value || o.text; });
    var box = document.createElement('div'); box.className = 'lh-pick';
    var b = document.createElement('b'); b.textContent = 'Mẫu bạn chọn: ' + mau; box.appendChild(b);
    box.insertAdjacentHTML('beforeend', '<span>Website Theo Mẫu <strong>5.000.000đ</strong> · xong trong 2–3 ngày khi có đủ thông tin. Đã gồm hosting, tên miền năm đầu, SEO, AIO.</span>' +
      '<span class="lk"><a href="/mau-website/">Xem mẫu khác</a><a href="/dich-vu/thiet-ke-website/#bang-gia">So sánh 6 gói</a></span>');
    var h2 = f.querySelector('h2'); if (h2) h2.insertAdjacentElement('afterend', box);
  }
})();

/* email links (v25): on a computer open Gmail's compose window in a new tab; phones keep mailto so the mail app opens */
(function () {
  if (!window.matchMedia || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="mailto:"]'); if (!a) return;
    var h = a.getAttribute('href').slice(7), i = h.indexOf('?'), to = i < 0 ? h : h.slice(0, i); if (!to) return;
    var u = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(decodeURIComponent(to));
    if (i > -1 && window.URLSearchParams) { var q = new URLSearchParams(h.slice(i + 1)); if (q.get('subject')) u += '&su=' + encodeURIComponent(q.get('subject')); if (q.get('body')) u += '&body=' + encodeURIComponent(q.get('body')); }
    e.preventDefault(); window.open(u, '_blank', 'noopener');
  });
})();

/* projects slider on the hire page (v26): native scroll-snap strip that advances by itself; pauses on hover, touch, focus and while off screen */
(function () {
  var t = document.getElementById('pjTrack'); if (!t) return;
  var wrap = t.parentNode, paused = false, seen = false, timer = 0, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function step(d) {
    var c = t.querySelector('li'); if (!c) return;
    var w = c.offsetWidth + parseFloat(getComputedStyle(t).columnGap || 18), max = t.scrollWidth - t.clientWidth, x = t.scrollLeft + d * w;
    if (x > max + 8) x = 0; if (x < -8) x = max;
    t.scrollTo({ left: x, behavior: reduce ? 'auto' : 'smooth' });
  }
  wrap.querySelector('.prev').addEventListener('click', function () { step(-1); });
  wrap.querySelector('.next').addEventListener('click', function () { step(1); });
  if (reduce) return;
  ['pointerenter', 'focusin', 'touchstart'].forEach(function (e) { wrap.addEventListener(e, function () { paused = true; }, { passive: true }); });
  ['pointerleave', 'focusout'].forEach(function (e) { wrap.addEventListener(e, function () { paused = false; }); });
  wrap.addEventListener('touchend', function () { setTimeout(function () { paused = false; }, 6000); }, { passive: true });
  if (window.IntersectionObserver) new IntersectionObserver(function (es) { seen = es[0].isIntersecting; }, { threshold: .3 }).observe(wrap); else seen = true;
  timer = setInterval(function () { if (seen && !paused && !document.hidden) step(1); }, 3200);
})();

/* hire page (v30): skill cards orbit slowly around the portrait on desktop; hovering or focusing a card pauses the orbit and enlarges that card */
(function () {
  var g = document.querySelector('.dp-grid'); if (!g) return;
  var cards = [].slice.call(g.querySelectorAll('.dp')); if (cards.length < 4) return;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, on = false, seen = true, hot = null, ang = -Math.PI / 2, last = 0, raf = 0;
  var PERIOD = 150000; // ms for one full turn
  var NS = 'http://www.w3.org/2000/svg', svgl = null, lines = [];
  function wires() {
    if (svgl) return;
    svgl = document.createElementNS(NS, 'svg'); svgl.setAttribute('class', 'dp-lines'); svgl.setAttribute('aria-hidden', 'true');
    cards.forEach(function () { var l = document.createElementNS(NS, 'line'); svgl.appendChild(l); lines.push(l); });
    g.insertBefore(svgl, g.firstChild);
  }
  function place() {
    var w = g.clientWidth, h = g.clientHeight, rx = Math.min(470, w / 2 - 130), ry = 405, n = cards.length, cx = w / 2, cy = h / 2;
    cards.forEach(function (c, i) {
      var a = ang + i * 2 * Math.PI / n, s = c === hot ? 1.14 : 1, x = Math.cos(a) * rx, y = Math.sin(a) * ry;
      c.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0) scale(' + s + ')';
      var l = lines[i]; if (l) { l.setAttribute('x1', cx); l.setAttribute('y1', cy); l.setAttribute('x2', (cx + x).toFixed(1)); l.setAttribute('y2', (cy + y).toFixed(1)); l.setAttribute('class', c === hot ? 'hot' : ''); }
    });
  }
  function tick(t) {
    raf = 0; if (!on) return;
    if (last && !hot && seen && !document.hidden) ang += (t - last) / PERIOD * 2 * Math.PI;
    last = t; place(); raf = requestAnimationFrame(tick);
  }
  function setOn(v) {
    if (v === on) return; on = v; g.classList.toggle('orbit', v);
    if (v) { last = 0; wires(); place(); if (!reduce && !raf) raf = requestAnimationFrame(tick); }
    else cards.forEach(function (c) { c.style.transform = ''; c.classList.remove('hot'); });
  }
  function check() { setOn(innerWidth >= 1100); }
  cards.forEach(function (c) {
    c.tabIndex = 0;
    var en = function () { hot = c; c.classList.add('hot'); if (on) place(); }, lv = function () { if (hot === c) hot = null; c.classList.remove('hot'); if (on) place(); };
    c.addEventListener('pointerenter', en); c.addEventListener('pointerleave', lv); c.addEventListener('focus', en); c.addEventListener('blur', lv);
  });
  if (window.IntersectionObserver) new IntersectionObserver(function (es) { seen = es[0].isIntersecting; }).observe(g);
  var lw = innerWidth; addEventListener('resize', function () { if (innerWidth !== lw) { lw = innerWidth; check(); if (on) place(); } });
  check();
})();
