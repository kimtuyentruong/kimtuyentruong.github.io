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
      var next = function () { i = (i + 1) % SN.length; type(SN[i]); };
      setTimeout(next, 3600);
    }
  }

  /* gallery filters */
  var grid = $('grid'), more = null;
  if (grid) {
    var sb = document.querySelectorAll('.sl-btn');
    var upd = function () { if (sb.length) { sb[0].disabled = grid.scrollLeft < 8; sb[1].disabled = grid.scrollLeft + grid.clientWidth > grid.scrollWidth - 8; } };
    sb.forEach(function (b) { b.addEventListener('click', function () { grid.scrollBy({ left: +b.dataset.dir * grid.clientWidth * 0.9, behavior: reduce ? 'auto' : 'smooth' }); }); });
    grid.addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); setTimeout(upd, 300);
    /* autoplay: one card every 3.5s, loops, pauses on hover/touch/focus or when off screen */
    if (!reduce) {
      var paused = false, onScreen = false, step = function () {
        if (paused || !onScreen || document.hidden) return;
        var card = grid.querySelector('.tile:not([hidden])'); if (!card) return;
        var w = card.getBoundingClientRect().width + 20;
        if (grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 8) grid.scrollTo({ left: 0, behavior: 'smooth' });
        else grid.scrollBy({ left: w, behavior: 'smooth' });
      };
      ['pointerenter', 'focusin', 'touchstart'].forEach(function (e) { grid.addEventListener(e, function () { paused = true; }, { passive: true }); });
      ['pointerleave', 'focusout', 'touchend'].forEach(function (e) { grid.addEventListener(e, function () { paused = false; }, { passive: true }); });
      if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { onScreen = es[0].isIntersecting; }).observe(grid); else onScreen = true;
      setInterval(step, 3500);
    }
  }
  /* portfolio: filter by industry (data-i) and type (data-k) */
  var fInd = 'all', fKind = 'all', cnt = document.querySelector('.pf-count');
  var applyF = function () {
    var shown = 0;
    document.querySelectorAll('#grid .tile').forEach(function (t) {
      var ok = (fInd === 'all' || t.dataset.i === fInd) && (fKind === 'all' || t.dataset.k === fKind);
      t.hidden = !ok; if (ok) shown++;
    });
    if (cnt) cnt.textContent = shown + (document.documentElement.lang === 'en' ? ' sites' : ' website');
    if (grid) { grid.scrollLeft = 0; grid.dispatchEvent(new Event('scroll')); }
  };
  var bindF = function (sel, attr, set) {
    document.querySelectorAll(sel).forEach(function (b) {
      b.addEventListener('click', function () {
        set(b.dataset[attr]);
        document.querySelectorAll(sel).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        applyF();
      });
    });
  };
  bindF('.pf-ind button', 'i', function (v) { fInd = v; });
  bindF('.kinds button', 'k', function (v) { fKind = v; });
  applyF();

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
