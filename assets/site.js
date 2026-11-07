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

  /* portfolio: two slow marquee rows moving in opposite directions, filtered by industry */
  var src = $('pfsrc'), rowsBox = $('pfrows'), cnt = document.querySelector('.pf-count'), fInd = 'all';
  var build = function () {
    if (!src || !rowsBox) return;
    var items = [].filter.call(src.querySelectorAll('.tile'), function (t) { return fInd === 'all' || t.dataset.i === fInd; });
    if (cnt) cnt.textContent = items.length + (document.documentElement.lang === 'en' ? ' sites' : ' website');
    rowsBox.innerHTML = '';
    var still = reduce || items.length <= 4;
    rowsBox.classList.toggle('still', still); rowsBox.classList.toggle('scroll', reduce && items.length > 4);
    var nRows = still ? 1 : 2, rows = [];
    for (var r = 0; r < nRows; r++) rows.push([]);
    items.forEach(function (t, i) { rows[i % nRows].push(t); });
    rows.forEach(function (list, r) {
      var row = document.createElement('div'); row.className = 'mq-row' + (r % 2 ? ' rev' : '');
      var track = document.createElement('div'); track.className = 'mq-track';
      list.forEach(function (t) { track.appendChild(t.cloneNode(true)); });
      if (!still) {
        /* repeat the set until one half of the track is wider than the screen, then duplicate it for a seamless loop */
        var reps = Math.max(1, Math.ceil(innerWidth * 1.15 / (list.length * 240)));
        var add = function () { list.forEach(function (t) { var c = t.cloneNode(true); c.setAttribute('aria-hidden', 'true'); c.tabIndex = -1; c.querySelectorAll('a').forEach(function (a) { a.tabIndex = -1; }); track.appendChild(c); }); };
        for (var k = 1; k < reps * 2; k++) add();
        track.style.animationDuration = Math.max(40, list.length * reps * 7) + 's';
      }
      track.querySelectorAll('img').forEach(function (im) { im.decoding = 'async'; });
      row.appendChild(track); rowsBox.appendChild(row);
    });
  };
  document.querySelectorAll('.pf-ind button').forEach(function (b) {
    b.addEventListener('click', function () {
      fInd = b.dataset.i;
      document.querySelectorAll('.pf-ind button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      build();
    });
  });
  build();
  /* pause the marquee while it is off screen */
  if (rowsBox && 'IntersectionObserver' in window) new IntersectionObserver(function (es) { rowsBox.classList.toggle('off', !es[0].isIntersecting); }).observe(rowsBox);
  var rt, lastW = innerWidth; addEventListener('resize', function () { if (Math.abs(innerWidth - lastW) < 40) return; lastW = innerWidth; clearTimeout(rt); rt = setTimeout(build, 300); });

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
