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
    var gap = parseFloat(getComputedStyle(inn).columnGap) || 0, r0 = inn.getBoundingClientRect().left;
    var rs = nodes.map(function (n) { return n.getBoundingClientRect(); });
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
  var pfSlug = { 'bat-dong-san': 'realestate', 'real-estate': 'realestate', 'y-te': 'health', 'healthcare': 'health', 'lam-dep': 'beauty', 'beauty': 'beauty', 'nha-hang': 'food', 'food': 'food', 'khach-san': 'stay', 'hospitality': 'stay', 'ban-le': 'retail', 'retail': 'retail', 'xay-dung': 'build', 'construction': 'build', 'dich-vu': 'service', 'services': 'service', 'giao-duc': 'edu', 'education': 'edu' };
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
