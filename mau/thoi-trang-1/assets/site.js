/* Yên Chi — JS dùng chung: menu, tìm kiếm, giỏ hàng, yêu thích (localStorage) và chức năng từng trang. */
(function () {
  'use strict';
  var D = window.YC, body = document.body, R = body.getAttribute('data-root') || './', PAGE = body.getAttribute('data-page') || '';
  var KEY = 'thoi-trang-1:', HEADLESS = /HeadlessChrome/.test(navigator.userAgent);
  var REDUCE = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fmt(n) { return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ'; }
  function img(id, w, h) { return 'https://images.unsplash.com/photo-' + id + '?auto=format&fit=crop&w=' + w + (h ? '&h=' + h : '') + '&q=80'; }
  function ic(n) { return '<svg aria-hidden="true"><use href="#i-' + n + '"/></svg>'; }
  function P(id) { for (var i = 0; i < D.products.length; i++) if (D.products[i].id === id) return D.products[i]; return null; }
  function catName(id) { for (var i = 0; i < D.cats.length; i++) if (D.cats[i].id === id) return D.cats[i].name; return ''; }
  function plain(s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd'); }
  function url(id) { return R + 'chi-tiet/?id=' + id; }
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(KEY + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(KEY + k, JSON.stringify(v)); } catch (e) {} },
    del: function (k) { try { localStorage.removeItem(KEY + k); } catch (e) {} }
  };

  /* ---------- giỏ hàng + yêu thích ---------- */
  var mem = { cart: store.get('cart', []), wish: store.get('wish', []) };
  var cart = {
    all: function () { return mem.cart.filter(function (i) { return P(i.id); }); },
    save: function () { store.set('cart', mem.cart); syncCounts(); document.dispatchEvent(new CustomEvent('yc:cart')); },
    add: function (id, size, color, qty) {
      var p = P(id); if (!p) return;
      color = color || p.colors[0]; qty = qty || 1;
      var f = mem.cart.filter(function (i) { return i.id === id && i.size === size && i.color === color; })[0];
      if (f) f.qty = Math.min(9, f.qty + qty); else mem.cart.push({ id: id, size: size, color: color, qty: qty });
      cart.save();
    },
    setQty: function (idx, q) { if (!mem.cart[idx]) return; mem.cart[idx].qty = Math.max(1, Math.min(9, q)); cart.save(); },
    remove: function (idx) { mem.cart.splice(idx, 1); cart.save(); },
    clear: function () { mem.cart = []; cart.save(); },
    count: function () { return cart.all().reduce(function (s, i) { return s + i.qty; }, 0); },
    sub: function () { return cart.all().reduce(function (s, i) { return s + P(i.id).price * i.qty; }, 0); }
  };
  var wish = {
    has: function (id) { return mem.wish.indexOf(id) > -1; },
    toggle: function (id) { var i = mem.wish.indexOf(id); if (i > -1) mem.wish.splice(i, 1); else mem.wish.push(id); store.set('wish', mem.wish); syncCounts(); document.dispatchEvent(new CustomEvent('yc:wish')); return i < 0; }
  };
  function totals(method) {
    var sub = cart.sub(), code = store.get('coupon', ''), c = D.coupons[code], disc = 0, ship = D.ship.fee;
    if (c && c.type === 'pct') disc = Math.round(sub * c.v / 100 / 1000) * 1000;
    if (method === 'fast') ship = D.ship.fast;
    else if (method === 'pickup') ship = 0;
    else if (sub - disc >= D.ship.freeFrom || (c && c.type === 'ship')) ship = 0;
    if (!sub) ship = 0;
    return { sub: sub, disc: disc, ship: ship, total: sub - disc + ship, code: c ? code : '' };
  }
  function syncCounts() {
    var c = cart.count(), w = mem.wish.length;
    $$('[data-cart-count]').forEach(function (e) { e.textContent = c; e.hidden = !c; });
    $$('[data-wish-count]').forEach(function (e) { e.textContent = w; e.hidden = !w; });
    $$('[data-wish]').forEach(function (b) { var on = wish.has(b.getAttribute('data-wish')); b.setAttribute('aria-pressed', on); b.setAttribute('aria-label', on ? 'Bỏ khỏi yêu thích' : 'Thêm vào yêu thích'); });
  }

  /* ---------- thẻ sản phẩm ---------- */
  function priceHTML(p) { return '<span class="price' + (p.old ? ' sale' : '') + '">' + fmt(p.price) + (p.old ? '<s>' + fmt(p.old) + '</s>' : '') + '</span>'; }
  function card(p, eager) {
    var tag = p.old ? '<span class="pc-tag sale">Giảm ' + Math.round((1 - p.price / p.old) * 100) + '%</span>' : (p.tag ? '<span class="pc-tag">' + p.tag + '</span>' : '');
    var sizes = D.sizes.map(function (s) { var o = p.out.indexOf(s) > -1; return '<button type="button" data-add="' + p.id + '" data-size="' + s + '"' + (o ? ' disabled aria-label="Size ' + s + ' tạm hết"' : ' aria-label="Thêm size ' + s + ' vào giỏ"') + '>' + s + '</button>'; }).join('');
    var dots = p.colors.map(function (c) { return '<i style="background:' + D.colors[c].h + '" title="' + D.colors[c].n + '"></i>'; }).join('');
    return '<article class="pc"><a class="pc-img" href="' + url(p.id) + '" aria-label="' + esc(p.name) + '">' +
      '<img class="a" src="' + img(p.img[0], 720, 960) + '" alt="' + esc(p.name) + '" width="720" height="960"' + (eager ? '' : ' loading="lazy"') + '>' +
      '<img class="b" src="' + img(p.img[1], 720, 960) + '" alt="" width="720" height="960" loading="lazy">' + tag + '</a>' +
      '<button type="button" class="pc-wish" data-wish="' + p.id + '" aria-pressed="' + wish.has(p.id) + '" aria-label="Thêm vào yêu thích">' + ic('heart') + '</button>' +
      '<div class="pc-quick"><span>Thêm nhanh</span><div>' + sizes + '</div></div>' +
      '<div class="pc-body"><h3><a href="' + url(p.id) + '">' + esc(p.name) + '</a></h3><div class="pc-meta">' + priceHTML(p) + '<span class="dots">' + dots + '</span></div></div></article>';
  }
  function miniHTML(i) {
    var p = P(i.id);
    return '<div class="mini"><a href="' + url(p.id) + '"><img src="' + img(p.img[0], 200, 266) + '" alt="' + esc(p.name) + '" width="72" height="96" loading="lazy"></a><div><b>' + esc(p.name) + '</b><span>Size ' + i.size + ' · ' + D.colors[i.color].n + ' · SL ' + i.qty + '</span></div><span class="price">' + fmt(p.price * i.qty) + '</span></div>';
  }

  /* ---------- lớp phủ dùng chung ---------- */
  var veil, srch, drawer, toastEl, toastT, openEl = null, lastFocus = null;
  function buildChrome() {
    var d = document.createElement('div');
    d.innerHTML = '<div class="veil" id="veil"></div>' +
      '<div class="srch" id="srch" role="dialog" aria-modal="true" aria-label="Tìm kiếm"><div class="wrap srch-in"><div class="srch-bar">' + ic('search') + '<input type="search" id="srchIn" placeholder="Tìm áo, quần, đầm, bài viết…" aria-label="Từ khoá tìm kiếm" autocomplete="off"><button type="button" class="ic-btn" data-close aria-label="Đóng tìm kiếm">' + ic('close') + '</button></div>' +
      '<div class="srch-hint"><span>Gợi ý:</span>' + ['blazer', 'linen', 'đất nung', 'quần ống rộng', 'đổi trả'].map(function (k) { return '<button type="button" class="chip" data-q="' + k + '">' + k + '</button>'; }).join('') + '</div><div class="srch-res" id="srchRes"></div></div></div>' +
      '<aside class="drawer" id="drawer" role="dialog" aria-modal="true" aria-label="Giỏ hàng"><div class="drawer-hd"><h2>Giỏ hàng</h2><button type="button" class="ic-btn" data-close aria-label="Đóng giỏ hàng">' + ic('close') + '</button></div><div class="drawer-bd" id="drawerBd"></div><div class="drawer-ft" id="drawerFt"></div></aside>' +
      '<div class="toast" id="toast" role="status" aria-live="polite"></div>' +
      '<button type="button" class="totop" id="totop" aria-label="Lên đầu trang">' + ic('arrow') + '</button>';
    while (d.firstChild) body.insertBefore(d.firstChild, $('#ktBadge'));
    veil = $('#veil'); srch = $('#srch'); drawer = $('#drawer'); toastEl = $('#toast');
    veil.addEventListener('click', closeAll);
    $$('[data-close]').forEach(function (b) { b.addEventListener('click', closeAll); });
    $('#totop').addEventListener('click', function () { window.scrollTo({ top: 0, behavior: REDUCE ? 'auto' : 'smooth' }); });
    $('#srchIn').addEventListener('input', function () { renderSearch(this.value); });
    $$('.srch-hint .chip').forEach(function (c) { c.addEventListener('click', function () { $('#srchIn').value = c.getAttribute('data-q'); renderSearch(c.getAttribute('data-q')); $('#srchIn').focus(); }); });
  }
  function openPanel(el) {
    closeAll(true); lastFocus = document.activeElement; openEl = el;
    el.classList.add('on'); veil.classList.add('on'); body.classList.add('lock');
    var f = $('input,button', el); if (f) setTimeout(function () { f.focus(); }, 60);
  }
  function closeAll(keep) {
    if (openEl) { openEl.classList.remove('on'); openEl = null; }
    $$('.modal.on,.flt.on').forEach(function (m) { m.classList.remove('on'); });
    if (veil) veil.classList.remove('on');
    body.classList.remove('lock', 'menu');
    var mb = $('#menuBtn'); if (mb) { mb.setAttribute('aria-expanded', 'false'); mb.setAttribute('aria-label', 'Mở menu'); mb.innerHTML = ic('menu'); }
    if (keep !== true && lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) {} }
  }
  function toast(msg) {
    toastEl.innerHTML = ic('check') + '<span>' + msg + '</span>'; toastEl.classList.add('on');
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('on'); }, 2600);
  }
  function renderDrawer() {
    var items = cart.all(), bd = $('#drawerBd'), ft = $('#drawerFt');
    if (!items.length) {
      bd.innerHTML = '<div class="empty">' + ic('bag') + '<p>Giỏ hàng đang trống.</p><a class="btn btn-sm" href="' + R + 'san-pham/">Xem sản phẩm</a></div>'; ft.innerHTML = ''; return;
    }
    var t = totals();
    bd.innerHTML = items.map(miniHTML).join('');
    var left = D.ship.freeFrom - (t.sub - t.disc);
    ft.innerHTML = '<p class="note">' + (left > 0 ? 'Mua thêm ' + fmt(left) + ' để được miễn phí giao hàng.' : 'Đơn này được miễn phí giao hàng tiêu chuẩn.') + '</p><div class="row"><span>Tạm tính</span><span class="price">' + fmt(t.sub) + '</span></div><a class="btn btn-block" href="' + R + 'thanh-toan/">Thanh toán</a><a class="btn btn-line btn-block" href="' + R + 'gio-hang/">Xem giỏ hàng</a>';
  }
  function renderSearch(q) {
    var res = $('#srchRes'), k = plain(q.trim());
    if (k.length < 2) { res.innerHTML = '<p class="srch-empty">Gõ ít nhất 2 ký tự để tìm trong sản phẩm, bài viết và các trang.</p>'; return; }
    var ps = D.products.filter(function (p) { return plain(p.name + ' ' + catName(p.cat) + ' ' + p.fabric + ' ' + p.colors.map(function (c) { return D.colors[c].n; }).join(' ')).indexOf(k) > -1; }).slice(0, 6);
    var posts = D.posts.filter(function (p) { return plain(p.title + ' ' + p.cat + ' ' + p.sum).indexOf(k) > -1; }).slice(0, 3);
    var pages = D.pages.filter(function (p) { return plain(p.t + ' ' + p.d).indexOf(k) > -1; }).slice(0, 4);
    if (!ps.length && !posts.length && !pages.length) { res.innerHTML = '<p class="srch-empty">Chưa tìm thấy kết quả cho “' + esc(q) + '”. Thử từ khác như “blazer”, “linen” hoặc “đầm”.</p>'; return; }
    var h = '<div><h4>Sản phẩm (' + ps.length + ')</h4>' + (ps.length ? '<div class="srch-list">' + ps.map(function (p) { return '<a class="srch-item" href="' + url(p.id) + '"><img src="' + img(p.img[0], 160, 210) + '" alt="" width="58" height="76"><span><b>' + esc(p.name) + '</b><span>' + fmt(p.price) + '</span></span></a>'; }).join('') + '</div><p style="margin-top:18px"><a class="link" href="' + R + 'san-pham/?q=' + encodeURIComponent(q.trim()) + '">Xem tất cả kết quả ' + ic('arrow') + '</a></p>' : '<p class="srch-empty">Không có sản phẩm phù hợp.</p>') + '</div>';
    h += '<div class="srch-links"><h4>Bài viết và trang</h4>' + posts.map(function (p) { return '<a href="' + R + 'tap-chi/#' + (p.full ? 'bai-viet' : p.id) + '"><b>' + esc(p.title) + '</b><span>Tạp chí · ' + p.cat + '</span></a>'; }).join('') + pages.map(function (p) { return '<a href="' + R + p.u + '"><b>' + p.t + '</b><span>' + p.d + '</span></a>'; }).join('') + (!posts.length && !pages.length ? '<p class="srch-empty">Không có bài viết phù hợp.</p>' : '') + '</div>';
    res.innerHTML = h;
  }

  /* ---------- header, menu, hiện dần ---------- */
  function initHeader() {
    var hd = $('#hd'), badge = $('#ktBadge'), top = $('#totop'), mb = $('#menuBtn');
    function onScroll() {
      var y = window.pageYOffset;
      hd.classList.toggle('scrolled', y > 8);
      if (badge) badge.classList.toggle('show', y > window.innerHeight * .85);
      top.classList.toggle('show', y > window.innerHeight * 1.2);
    }
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
    mb.addEventListener('click', function () {
      var on = !body.classList.contains('menu');
      if (on) { closeAll(true); body.classList.add('menu', 'lock'); mb.setAttribute('aria-expanded', 'true'); mb.setAttribute('aria-label', 'Đóng menu'); mb.innerHTML = ic('close'); } else closeAll(true);
    });
    $$('#nav a').forEach(function (a) { a.addEventListener('click', function () { closeAll(true); }); });
    $('#searchBtn').addEventListener('click', function () { openPanel(srch); renderSearch($('#srchIn').value); });
    $('#cartBtn').addEventListener('click', function (e) { if (PAGE === 'gio-hang' || PAGE === 'thanh-toan') return; e.preventDefault(); renderDrawer(); openPanel(drawer); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(); if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); openPanel(srch); } });
    var msgs = ['Miễn phí giao hàng cho đơn từ 1.000.000đ', 'Đổi size, đổi mẫu trong 15 ngày', 'Kiểm hàng trước khi thanh toán'], mi = 0, am = $('#annMsg');
    if (am && !REDUCE && !HEADLESS) setInterval(function () { am.style.opacity = 0; setTimeout(function () { mi = (mi + 1) % msgs.length; am.textContent = msgs[mi]; am.style.opacity = 1; }, 360); }, 4200);
  }
  var io = null;
  function reveal(root) {
    var els = $$('.rv,.rv-img', root);
    if (!document.documentElement.classList.contains('anim') || !('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    if (!io) io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }); }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    els.forEach(function (e) { if (!e.classList.contains('in')) io.observe(e); });
  }
  function initGlobalClicks() {
    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-add],[data-wish],.acc-b,[data-modal]');
      if (!t) return;
      if (t.hasAttribute('data-add')) {
        var p = P(t.getAttribute('data-add')); cart.add(p.id, t.getAttribute('data-size'));
        toast('Đã thêm ' + esc(p.name) + ' (size ' + t.getAttribute('data-size') + ') vào giỏ');
      } else if (t.hasAttribute('data-wish')) {
        e.preventDefault(); var on = wish.toggle(t.getAttribute('data-wish')); toast(on ? 'Đã lưu vào mục yêu thích' : 'Đã bỏ khỏi mục yêu thích');
      } else if (t.classList.contains('acc-b')) {
        t.setAttribute('aria-expanded', t.getAttribute('aria-expanded') !== 'true');
      } else if (t.hasAttribute('data-modal')) {
        var m = $('#' + t.getAttribute('data-modal')); if (m) { lastFocus = t; m.classList.add('on'); veil.classList.add('on'); body.classList.add('lock'); var x = $('.modal-x', m); if (x) x.focus(); }
      }
    });
  }
  /* kiểm tra form */
  function check(f, rules) {
    var ok = true, first = null;
    Object.keys(rules).forEach(function (name) {
      var el = f.elements[name]; if (!el) return;
      var box = el.closest('.field') || el.closest('.check'), v = el.type === 'checkbox' ? el.checked : el.value.trim(), msg = rules[name](v);
      if (box) { box.classList.toggle('bad', !!msg); var er = $('.err', box); if (er) er.textContent = msg || ''; }
      el.setAttribute('aria-invalid', !!msg);
      if (msg) { ok = false; if (!first) first = el; }
    });
    if (first) first.focus();
    return ok;
  }
  var V = {
    req: function (m) { return function (v) { return v ? '' : m; }; },
    name: function (v) { return v.length >= 2 ? '' : 'Vui lòng nhập họ tên.'; },
    phone: function (v) { return /^0\d{9}$/.test(v.replace(/[\s.\-]/g, '')) ? '' : 'Số điện thoại gồm 10 số, bắt đầu bằng 0.'; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Email chưa đúng định dạng.'; },
    emailOpt: function (v) { return !v || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Email chưa đúng định dạng.'; },
    agree: function (v) { return v ? '' : 'Cần đồng ý trước khi gửi.'; }
  };
  function liveClear(f) { f.addEventListener('input', function (e) { var b = e.target.closest('.field,.check'); if (b) b.classList.remove('bad'); }); f.addEventListener('change', function (e) { var b = e.target.closest('.field,.check'); if (b) b.classList.remove('bad'); }); }
  function code(prefix) { var d = new Date(), z = function (n) { return (n < 10 ? '0' : '') + n; }; return prefix + String(d.getFullYear()).slice(2) + z(d.getMonth() + 1) + z(d.getDate()) + '-' + Math.floor(1000 + Math.random() * 9000); }
  function tabs(nav, onPick) {
    var bs = $$('button', nav);
    function pick(b, focus) { bs.forEach(function (x) { x.setAttribute('aria-selected', x === b); x.tabIndex = x === b ? 0 : -1; }); if (focus) b.focus(); onPick(b.getAttribute('data-k'), b); }
    bs.forEach(function (b, i) {
      b.addEventListener('click', function () { pick(b); });
      b.addEventListener('keydown', function (e) { var d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0; if (d) { e.preventDefault(); pick(bs[(i + d + bs.length) % bs.length], true); } });
    });
    return pick;
  }
  /* điểm bấm trên ảnh lookbook */
  function spots(box, list) {
    var cardEl = null;
    function close() { if (cardEl) { cardEl.remove(); cardEl = null; } $$('.spot', box).forEach(function (s) { s.setAttribute('aria-expanded', 'false'); }); }
    list.forEach(function (s) {
      var p = P(s.id); if (!p) return;
      var b = document.createElement('button'); b.type = 'button'; b.className = 'spot'; b.style.left = s.x + '%'; b.style.top = s.y + '%';
      b.setAttribute('aria-label', 'Xem ' + p.name); b.setAttribute('aria-expanded', 'false');
      b.addEventListener('click', function (e) {
        e.stopPropagation(); var was = b.getAttribute('aria-expanded') === 'true'; close(); if (was) return;
        b.setAttribute('aria-expanded', 'true');
        cardEl = document.createElement('div'); cardEl.className = 'spot-card';
        cardEl.innerHTML = '<img src="' + img(p.img[0], 160, 210) + '" alt="" width="64" height="84"><div><b>' + esc(p.name) + '</b>' + '<span class="price">' + fmt(p.price) + '</span><a href="' + url(p.id) + '">Xem chi tiết</a></div>';
        box.appendChild(cardEl);
        var W = box.clientWidth, H = box.clientHeight, cw = cardEl.offsetWidth, ch = cardEl.offsetHeight, px = W * s.x / 100, py = H * s.y / 100;
        cardEl.style.left = Math.max(8, Math.min(px - cw / 2, W - cw - 8)) + 'px';
        cardEl.style.top = (py + 26 + ch > H - 8 ? py - ch - 26 : py + 26) + 'px';
      });
      box.appendChild(b);
    });
    document.addEventListener('click', function (e) { if (cardEl && !cardEl.contains(e.target)) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  /* ================= TRANG CHỦ ================= */
  function home() {
    var row = $('#newRow');
    if (row) {
      row.innerHTML = D.products.slice(0, 8).map(function (p, i) { return card(p, i < 4); }).join('');
      $$('#newNav button').forEach(function (b, i) { b.addEventListener('click', function () { var c = row.firstElementChild; row.scrollBy({ left: (i ? 1 : -1) * (c.offsetWidth + 20) * 2, behavior: REDUCE ? 'auto' : 'smooth' }); }); });
    }
    var lb = $('#homeLook'); if (lb) spots(lb, D.looks['thu-dong'].items[0].spots);
    var jr = $('#homePosts');
    if (jr) jr.innerHTML = D.posts.slice(0, 3).map(function (p) { return '<article class="post rv"><a class="post-img" href="' + R + 'tap-chi/#' + (p.full ? 'bai-viet' : p.id) + '"><img src="' + img(p.img, 800, 600) + '" alt="' + esc(p.title) + '" width="800" height="600" loading="lazy"></a><div class="post-meta"><b>' + p.cat + '</b><span>' + p.date + '</span></div><h3><a href="' + R + 'tap-chi/#' + (p.full ? 'bai-viet' : p.id) + '">' + esc(p.title) + '</a></h3><p>' + esc(p.sum) + '</p></article>'; }).join('');
    ticker($('#tick'));
    var nf = $('#newsForm');
    if (nf) { liveClear(nf); nf.addEventListener('submit', function (e) { e.preventDefault(); if (!check(nf, { email: V.email, agree: V.agree })) return; nf.innerHTML = '<div class="ok-box">' + ic('check') + '<p>Cảm ơn bạn. Đây là form minh hoạ nên email chưa được gửi đi đâu.</p></div>'; }); }
  }
  function ticker(box) {
    if (!box || !box.animate) return;
    var words = (box.getAttribute('data-words') || '').split('|'), anims = [], lastW = 0, vis = true;
    function build() {
      var W = box.clientWidth; if (Math.abs(W - lastW) < 2) return; lastW = W;
      anims.forEach(function (a) { a.cancel(); }); anims = []; box.innerHTML = '';
      var els = [], setW = 0, total = 0, guard = 0;
      while ((total < W + setW || els.length < words.length * 2) && guard++ < 80) {
        var s = document.createElement('span'); s.textContent = words[els.length % words.length]; if (els.length >= words.length) s.setAttribute('aria-hidden', 'true');
        box.appendChild(s); var w = s.offsetWidth; els.push({ el: s, x: total, w: w }); total += w;
        if (els.length === words.length) setW = total;
      }
      els.forEach(function (o) {
        var a = o.el.animate([{ transform: 'translateX(' + o.x + 'px)' }, { transform: 'translateX(' + (o.x - setW) + 'px)' }], { duration: setW * 26, iterations: Infinity, easing: 'linear' });
        if (REDUCE || !vis) a.pause(); anims.push(a);
      });
    }
    build();
    window.addEventListener('resize', build);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { vis = en[0].isIntersecting; anims.forEach(function (a) { if (vis && !REDUCE) a.play(); else a.pause(); }); }).observe(box);
  }

  /* ================= DANH MỤC ================= */
  function listing() {
    var q = new URLSearchParams(location.search), PMIN = 500000, PMAX = 2500000;
    var st = { cat: q.get('loai') || '', sizes: (q.get('size') || '').split(',').filter(Boolean), colors: (q.get('mau') || '').split(',').filter(Boolean), min: +q.get('min') || PMIN, max: +q.get('max') || PMAX, q: q.get('q') || '', sort: q.get('sort') || 'moi', sale: q.get('sale') === '1' };
    var flt = $('#flt'), grid = $('#grid'), info = $('#shopInfo'), si = $('#shopQ'), so = $('#shopSort');
    si.value = st.q; so.value = st.sort;
    function match(p, skip) {
      if (skip !== 'cat' && st.cat && p.cat !== st.cat) return false;
      if (st.sizes.length && !st.sizes.some(function (s) { return p.out.indexOf(s) < 0; })) return false;
      if (st.colors.length && !st.colors.some(function (c) { return p.colors.indexOf(c) > -1; })) return false;
      if (p.price < st.min || p.price > st.max) return false;
      if (st.sale && !p.old) return false;
      if (st.q && plain(p.name + ' ' + catName(p.cat) + ' ' + p.fabric + ' ' + p.colors.map(function (c) { return D.colors[c].n; }).join(' ')).indexOf(plain(st.q)) < 0) return false;
      return true;
    }
    function buildFilter() {
      var base = D.products.filter(function (p) { return match(p, 'cat'); });
      var h = '<div class="flt-hd"><b>Bộ lọc</b><button type="button" class="ic-btn" id="fltClose" aria-label="Đóng bộ lọc">' + ic('close') + '</button></div>';
      h += '<div class="flt-g flt-cats"><h3>Loại sản phẩm</h3><button type="button" data-cat="" aria-pressed="' + (!st.cat) + '">Tất cả <span>' + base.length + '</span></button>' + D.cats.map(function (c) { return '<button type="button" data-cat="' + c.id + '" aria-pressed="' + (st.cat === c.id) + '">' + c.name + ' <span>' + base.filter(function (p) { return p.cat === c.id; }).length + '</span></button>'; }).join('') + '</div>';
      h += '<div class="flt-g"><h3>Size còn hàng</h3><div class="flt-sizes">' + D.sizes.map(function (s) { return '<button type="button" data-fsize="' + s + '" aria-pressed="' + (st.sizes.indexOf(s) > -1) + '">' + s + '</button>'; }).join('') + '</div></div>';
      h += '<div class="flt-g"><h3>Màu sắc</h3><div class="flt-colors">' + Object.keys(D.colors).map(function (c) { return '<button type="button" data-fcolor="' + c + '" aria-pressed="' + (st.colors.indexOf(c) > -1) + '"><i style="background:' + D.colors[c].h + '"></i>' + D.colors[c].n + '</button>'; }).join('') + '</div></div>';
      h += '<div class="flt-g"><h3>Khoảng giá</h3><div class="rng"><div class="rng-fill" id="rngFill"></div><input type="range" id="rMin" min="' + PMIN + '" max="' + PMAX + '" step="50000" value="' + st.min + '" aria-label="Giá thấp nhất"><input type="range" id="rMax" min="' + PMIN + '" max="' + PMAX + '" step="50000" value="' + st.max + '" aria-label="Giá cao nhất"></div><div class="rng-val"><span id="rMinV"></span><span id="rMaxV"></span></div></div>';
      h += '<div class="flt-g"><label class="tgl"><input type="checkbox" id="fSale"' + (st.sale ? ' checked' : '') + '><i></i>Chỉ hiện hàng đang giảm giá</label></div>';
      h += '<div class="flt-g"><button type="button" class="btn btn-line btn-block btn-sm" id="fltReset">Xoá bộ lọc</button></div>';
      flt.innerHTML = h; rng();
    }
    function rng() {
      var a = $('#rMin'), b = $('#rMax'), f = $('#rngFill');
      f.style.left = (st.min - PMIN) / (PMAX - PMIN) * 100 + '%'; f.style.right = (PMAX - st.max) / (PMAX - PMIN) * 100 + '%';
      $('#rMinV').textContent = fmt(st.min); $('#rMaxV').textContent = fmt(st.max); a.value = st.min; b.value = st.max;
    }
    function sync() {
      var u = new URLSearchParams();
      if (st.cat) u.set('loai', st.cat); if (st.sizes.length) u.set('size', st.sizes.join(',')); if (st.colors.length) u.set('mau', st.colors.join(','));
      if (st.min > PMIN) u.set('min', st.min); if (st.max < PMAX) u.set('max', st.max); if (st.q) u.set('q', st.q); if (st.sort !== 'moi') u.set('sort', st.sort); if (st.sale) u.set('sale', '1');
      var s = u.toString(); try { history.replaceState(null, '', location.pathname + (s ? '?' + s : '')); } catch (e) {}
    }
    function render() {
      var list = D.products.filter(function (p) { return match(p); });
      var idx = function (p) { return D.products.indexOf(p); };
      list.sort({ moi: function (a, b) { return idx(a) - idx(b); }, tang: function (a, b) { return a.price - b.price; }, giam: function (a, b) { return b.price - a.price; }, ten: function (a, b) { return a.name.localeCompare(b.name, 'vi'); } }[st.sort] || function () { return 0; });
      grid.innerHTML = list.length ? list.map(function (p, i) { return card(p, i < 6); }).join('') : '<div class="shop-none"><h3>Chưa có sản phẩm phù hợp</h3><p>Thử bỏ bớt điều kiện lọc hoặc tìm bằng từ khác.</p><button type="button" class="btn btn-line" id="noneReset">Xoá bộ lọc</button></div>';
      var chips = [];
      if (st.cat) chips.push(['cat', catName(st.cat)]);
      st.sizes.forEach(function (s) { chips.push(['size:' + s, 'Size ' + s]); });
      st.colors.forEach(function (c) { chips.push(['color:' + c, D.colors[c].n]); });
      if (st.min > PMIN || st.max < PMAX) chips.push(['price', fmt(st.min) + ' – ' + fmt(st.max)]);
      if (st.sale) chips.push(['sale', 'Đang giảm giá']);
      if (st.q) chips.push(['q', '“' + esc(st.q) + '”']);
      info.innerHTML = '<p><b>' + list.length + '</b> sản phẩm</p>' + chips.map(function (c) { return '<button type="button" class="chip" data-chip="' + c[0] + '" aria-label="Bỏ lọc ' + c[1].replace(/"/g, '') + '">' + c[1] + ic('close') + '</button>'; }).join('');
      var nr = $('#noneReset'); if (nr) nr.addEventListener('click', reset);
      syncCounts(); sync();
    }
    function reset() { st.cat = ''; st.sizes = []; st.colors = []; st.min = PMIN; st.max = PMAX; st.q = ''; st.sale = false; si.value = ''; buildFilter(); render(); }
    function tog(arr, v) { var i = arr.indexOf(v); if (i > -1) arr.splice(i, 1); else arr.push(v); }
    flt.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.id === 'fltClose') { flt.classList.remove('on'); veil.classList.remove('on'); body.classList.remove('lock'); return; }
      if (b.id === 'fltReset') return reset();
      if (b.hasAttribute('data-cat')) st.cat = b.getAttribute('data-cat');
      else if (b.hasAttribute('data-fsize')) tog(st.sizes, b.getAttribute('data-fsize'));
      else if (b.hasAttribute('data-fcolor')) tog(st.colors, b.getAttribute('data-fcolor'));
      else return;
      var sc = flt.scrollTop; buildFilter(); flt.scrollTop = sc; render();
    });
    flt.addEventListener('input', function (e) {
      if (e.target.id === 'rMin') st.min = Math.min(+e.target.value, st.max - 100000);
      else if (e.target.id === 'rMax') st.max = Math.max(+e.target.value, st.min + 100000);
      else if (e.target.id === 'fSale') st.sale = e.target.checked;
      else return;
      rng(); render();
    });
    info.addEventListener('click', function (e) {
      var b = e.target.closest('[data-chip]'); if (!b) return; var k = b.getAttribute('data-chip');
      if (k === 'cat') st.cat = ''; else if (k === 'price') { st.min = PMIN; st.max = PMAX; } else if (k === 'sale') st.sale = false; else if (k === 'q') { st.q = ''; si.value = ''; }
      else if (k.indexOf('size:') === 0) tog(st.sizes, k.slice(5)); else if (k.indexOf('color:') === 0) tog(st.colors, k.slice(6));
      buildFilter(); render();
    });
    si.addEventListener('input', function () { st.q = si.value.trim(); render(); });
    $('#shopSearch').addEventListener('submit', function (e) { e.preventDefault(); });
    so.addEventListener('change', function () { st.sort = so.value; render(); });
    $('#fltOpen').addEventListener('click', function () { lastFocus = this; flt.classList.add('on'); veil.classList.add('on'); body.classList.add('lock'); });
    buildFilter(); render();
  }

  /* ================= CHI TIẾT ================= */
  function detail() {
    var id = new URLSearchParams(location.search).get('id'), p = P(id) || D.products[0];
    var sel = { color: p.colors[0], size: '', qty: 1, img: 0 };
    document.title = p.name + ' | Yên Chi';
    $('#pdCrumb').textContent = p.name;
    $('#pdCat').textContent = catName(p.cat).replace(/ /g, ' '); $('#pdCat').href = R + 'san-pham/?loai=' + p.cat;
    $('#pdName').textContent = p.name; $('#pdPrice').innerHTML = priceHTML(p); $('#pdDesc').textContent = p.desc;
    $('#pdEyebrow').textContent = catName(p.cat).replace(/ /g, ' ') + (p.tag ? ' · ' + p.tag : '');
    var main = $('#pdMain'), mi = $('img', main), th = $('#pdTh');
    function setImg(i) { sel.img = i; mi.src = img(p.img[i], 1200, 1600); mi.alt = p.name + ', ảnh ' + (i + 1); $$('button', th).forEach(function (b, k) { b.setAttribute('aria-current', k === i); }); }
    th.innerHTML = p.img.map(function (im, i) { return '<button type="button" aria-label="Xem ảnh ' + (i + 1) + '"><img src="' + img(im, 180, 240) + '" alt="" width="84" height="112"></button>'; }).join('');
    $$('button', th).forEach(function (b, i) { b.addEventListener('click', function () { setImg(i); }); });
    setImg(0);
    main.addEventListener('mousemove', function (e) { var r = main.getBoundingClientRect(); main.classList.add('zoom'); mi.style.transformOrigin = ((e.clientX - r.left) / r.width * 100) + '% ' + ((e.clientY - r.top) / r.height * 100) + '%'; });
    main.addEventListener('mouseleave', function () { main.classList.remove('zoom'); });
    main.addEventListener('click', function () { if (matchMedia('(hover:none)').matches) setImg((sel.img + 1) % p.img.length); });
    var sw = $('#pdSw'), sz = $('#pdSz');
    function opts() {
      $('#pdColorName').textContent = D.colors[sel.color].n; $('#pdSizeName').textContent = sel.size ? 'Size ' + sel.size : 'Chưa chọn';
      sw.innerHTML = p.colors.map(function (c) { return '<button type="button" data-c="' + c + '" style="background:' + D.colors[c].h + '" aria-pressed="' + (c === sel.color) + '" aria-label="Màu ' + D.colors[c].n + '"></button>'; }).join('');
      sz.innerHTML = D.sizes.map(function (s) { var o = p.out.indexOf(s) > -1; return '<button type="button" data-s="' + s + '" aria-pressed="' + (s === sel.size) + '"' + (o ? ' disabled aria-label="Size ' + s + ', tạm hết"' : '') + '>' + s + '</button>'; }).join('');
    }
    sw.addEventListener('click', function (e) { var b = e.target.closest('[data-c]'); if (b) { sel.color = b.getAttribute('data-c'); opts(); } });
    sz.addEventListener('click', function (e) { var b = e.target.closest('[data-s]'); if (b && !b.disabled) { sel.size = b.getAttribute('data-s'); $('#pdErr').classList.remove('on'); opts(); } });
    opts();
    var qi = $('#pdQty');
    $$('#pdQtyBox button').forEach(function (b, i) { b.addEventListener('click', function () { sel.qty = Math.max(1, Math.min(9, sel.qty + (i ? 1 : -1))); qi.value = sel.qty; }); });
    qi.addEventListener('change', function () { sel.qty = Math.max(1, Math.min(9, parseInt(qi.value, 10) || 1)); qi.value = sel.qty; });
    $('#pdAdd').addEventListener('click', function () {
      if (!sel.size) { $('#pdErr').classList.add('on'); sz.querySelector('button:not([disabled])').focus(); return; }
      cart.add(p.id, sel.size, sel.color, sel.qty); renderDrawer(); openPanel(drawer);
    });
    var wb = $('#pdWish'); wb.setAttribute('data-wish', p.id);
    $('#pdFabric').textContent = p.fabric + '.'; $('#pdFit').textContent = p.fit;
    if (p.out.length) $('#pdStock').textContent = 'Size ' + p.out.join(', ') + ' đang tạm hết. Bạn có thể đặt lịch thử ở cửa hàng để được báo khi có hàng.';
    /* phối cùng */
    var pair = p.pair.map(P).filter(Boolean), ol = $('#outfitList'), os = $('#outfitSum');
    ol.innerHTML = pair.map(function (x) { return '<div class="outfit-i"><label><input type="checkbox" checked value="' + x.id + '" aria-label="Chọn ' + esc(x.name) + '"></label><a href="' + url(x.id) + '"><img src="' + img(x.img[0], 600, 800) + '" alt="' + esc(x.name) + '" width="600" height="800" loading="lazy"><b>' + esc(x.name) + '</b></a>' + priceHTML(x) + '</div>'; }).join('');
    function sum() {
      var ids = $$('input:checked', ol).map(function (i) { return i.value; }), t = p.price + ids.reduce(function (s, i) { return s + P(i).price; }, 0);
      os.innerHTML = '<h3>Cả bộ phối</h3><div class="row"><span>' + esc(p.name) + '</span><b>' + fmt(p.price) + '</b></div>' + ids.map(function (i) { return '<div class="row"><span>' + esc(P(i).name) + '</span><b>' + fmt(P(i).price) + '</b></div>'; }).join('') + '<div class="row tot"><span>Tổng ' + (ids.length + 1) + ' món</span><b class="price">' + fmt(t) + '</b></div><button type="button" class="btn btn-block" id="outfitAdd">Thêm cả bộ vào giỏ</button><p class="note">Các món phối được thêm theo size bạn chọn ở trên (mặc định size M).</p>';
      $('#outfitAdd').addEventListener('click', function () {
        var s = sel.size || 'M', n = 0;
        [p.id].concat(ids).forEach(function (i) { var x = P(i), ss = x.out.indexOf(s) > -1 ? D.sizes.filter(function (k) { return x.out.indexOf(k) < 0; })[0] : s; cart.add(i, ss); n++; });
        toast('Đã thêm ' + n + ' món vào giỏ'); renderDrawer(); openPanel(drawer);
      });
    }
    ol.addEventListener('change', sum); sum();
    /* đánh giá mẫu */
    var k = D.products.indexOf(p);
    $('#pdRevs').innerHTML = [0, 1, 2].map(function (i) { var r = D.reviews[(k + i) % D.reviews.length]; return '<figure class="rev"><span class="sample">Đánh giá mẫu</span><blockquote>“' + r.t + '”</blockquote><footer><b>' + r.n + '</b>' + r.w + '</footer></figure>'; }).join('');
    /* liên quan + đã xem */
    var rel = D.products.filter(function (x) { return x.cat === p.cat && x.id !== p.id; }).concat(D.products.filter(function (x) { return x.cat !== p.cat && p.pair.indexOf(x.id) < 0; })).slice(0, 4);
    $('#pdRel').innerHTML = rel.map(function (x) { return card(x); }).join('');
    var seen = store.get('seen', []).filter(function (x) { return x !== p.id && P(x); });
    if (seen.length) { $('#pdSeenWrap').hidden = false; $('#pdSeen').innerHTML = seen.slice(0, 4).map(function (x) { return card(P(x)); }).join(''); }
    seen.unshift(p.id); store.set('seen', seen.slice(0, 8));
    $$('.modal-x').forEach(function (b) { b.addEventListener('click', closeAll); });
    syncCounts();
  }

  /* ================= GIỎ HÀNG ================= */
  function cartPage() {
    var list = $('#cartList'), sum = $('#cartSum'), wl = $('#wishList'), bar = $('#shipBar');
    function render() {
      var items = cart.all(), t = totals();
      $('#tabCartN').textContent = cart.count(); $('#tabWishN').textContent = mem.wish.length;
      if (!items.length) {
        list.innerHTML = '<div class="empty">' + ic('bag') + '<p>Giỏ hàng của bạn đang trống.</p><a class="btn" href="' + R + 'san-pham/">Xem sản phẩm</a> <button type="button" class="btn btn-line" id="demoFill">Thêm 3 món mẫu</button></div>';
        bar.hidden = true;
        $('#demoFill').addEventListener('click', function () { cart.add('blazer-moc', 'M'); cart.add('so-mi-trang', 'S'); cart.add('quan-taupe', 'M'); toast('Đã thêm 3 món mẫu vào giỏ'); });
      } else {
        bar.hidden = false;
        var left = D.ship.freeFrom - (t.sub - t.disc), pct = Math.min(100, (t.sub - t.disc) / D.ship.freeFrom * 100);
        bar.innerHTML = '<span>' + (left > 0 ? 'Mua thêm <b class="price">' + fmt(left) + '</b> để được miễn phí giao hàng tiêu chuẩn.' : 'Đơn hàng của bạn được miễn phí giao hàng tiêu chuẩn.') + '</span><div><i style="width:' + pct + '%"></i></div>';
        list.innerHTML = mem.cart.map(function (i, idx) {
          var p = P(i.id); if (!p) return '';
          return '<article class="ci"><a class="ci-img" href="' + url(p.id) + '"><img src="' + img(p.img[0], 300, 400) + '" alt="' + esc(p.name) + '" width="110" height="147"></a><div><h3><a href="' + url(p.id) + '">' + esc(p.name) + '</a></h3><p class="ci-meta">Size ' + i.size + ' · ' + D.colors[i.color].n + ' · ' + fmt(p.price) + '</p><div class="ci-act"><div class="qty"><button type="button" data-q="-1" data-i="' + idx + '" aria-label="Giảm số lượng">' + ic('minus') + '</button><input type="text" inputmode="numeric" value="' + i.qty + '" readonly aria-label="Số lượng"><button type="button" data-q="1" data-i="' + idx + '" aria-label="Tăng số lượng">' + ic('plus') + '</button></div><button type="button" class="ci-rm" data-rm="' + idx + '">Xoá</button></div></div><p class="ci-tot price">' + fmt(p.price * i.qty) + '</p></article>';
        }).join('');
      }
      var c = D.coupons[t.code];
      sum.innerHTML = '<h2>Tóm tắt đơn</h2><div class="row"><span>Tạm tính (' + cart.count() + ' món)</span><span class="price">' + fmt(t.sub) + '</span></div>' + (t.disc ? '<div class="row minus"><span>Mã ' + t.code + '</span><span class="price">−' + fmt(t.disc) + '</span></div>' : '') + '<div class="row"><span>Giao hàng tiêu chuẩn</span><span class="price">' + (items.length ? (t.ship ? fmt(t.ship) : 'Miễn phí') : '—') + '</span></div>' +
        '<form class="coupon" id="couponForm"><label class="sr" for="couponIn">Mã giảm giá</label><input id="couponIn" placeholder="Mã giảm giá" value="' + (t.code || '') + '" autocomplete="off"><button class="btn btn-line btn-sm" type="submit">Áp dụng</button></form><p class="coupon-msg' + (c ? ' ok' : '') + '" id="couponMsg">' + (c ? 'Đã áp dụng: ' + c.label + '.' : 'Mã minh hoạ: YENCHI10 hoặc FREESHIP.') + '</p>' +
        '<div class="row tot"><span>Tổng cộng</span><span class="price">' + fmt(t.total) + '</span></div><p class="note">Giá đã gồm VAT. Phí giao hàng có thể đổi ở bước thanh toán.</p>' +
        (items.length ? '<a class="btn btn-block" href="' + R + 'thanh-toan/">Tiến hành thanh toán ' + ic('arrow') + '</a>' : '<button class="btn btn-block" type="button" disabled>Tiến hành thanh toán</button>') + '<a class="btn btn-line btn-block" href="' + R + 'san-pham/">Tiếp tục mua sắm</a>';
      $('#couponForm').addEventListener('submit', function (e) {
        e.preventDefault(); var v = $('#couponIn').value.trim().toUpperCase(), m = $('#couponMsg');
        if (!v) { store.del('coupon'); render(); return; }
        if (D.coupons[v]) { store.set('coupon', v); render(); toast('Đã áp dụng mã ' + v); } else { m.className = 'coupon-msg bad'; m.textContent = 'Mã chưa đúng. Thử YENCHI10 hoặc FREESHIP.'; }
      });
      var ws = mem.wish.map(P).filter(Boolean);
      wl.innerHTML = ws.length ? '<div class="grid grid-3">' + ws.map(function (p) { return card(p); }).join('') + '</div>' : '<div class="empty">' + ic('heart') + '<p>Bạn chưa lưu sản phẩm nào. Bấm biểu tượng trái tim trên sản phẩm để lưu lại.</p><a class="btn btn-line" href="' + R + 'san-pham/">Xem sản phẩm</a></div>';
      var inCart = items.map(function (i) { return i.id; });
      $('#cartSug').innerHTML = D.products.filter(function (p) { return inCart.indexOf(p.id) < 0; }).slice(4, 8).map(function (p) { return card(p); }).join('');
      syncCounts();
    }
    list.addEventListener('click', function (e) {
      var b = e.target.closest('[data-q],[data-rm]'); if (!b) return;
      if (b.hasAttribute('data-rm')) { cart.remove(+b.getAttribute('data-rm')); toast('Đã xoá khỏi giỏ'); }
      else { var i = +b.getAttribute('data-i'); cart.setQty(i, mem.cart[i].qty + (+b.getAttribute('data-q'))); }
    });
    var pick = tabs($('#cartTabs'), function (k) { $('#paneCart').hidden = k !== 'cart'; $('#paneWish').hidden = k !== 'wish'; });
    if (location.hash === '#yeu-thich') pick($('#cartTabs [data-k=wish]'));
    document.addEventListener('yc:cart', render); document.addEventListener('yc:wish', render);
    render();
  }

  /* ================= THANH TOÁN ================= */
  function checkout() {
    var f = $('#ckForm'), stepsEl = $$('#ckSteps li'), panes = $$('.ck-step'), side = $('#ckSum'), state = store.get('checkout', { step: 0, ship: 'std', pay: 'cod' }), step = 0, started = false;
    var prov = f.elements.province; prov.innerHTML = '<option value="">Chọn tỉnh, thành phố</option>' + D.provinces.map(function (p) { return '<option>' + p + '</option>'; }).join('');
    f.elements.store.innerHTML = D.stores.map(function (s) { return '<option value="' + s.id + '">' + s.name + ' · ' + s.addr + '</option>'; }).join('');
    ['name', 'phone', 'email', 'province', 'ward', 'street', 'note'].forEach(function (k) { if (state[k]) f.elements[k].value = state[k]; });
    liveClear(f);
    function method() { return { std: '', fast: 'fast', pickup: 'pickup' }[f.elements.ship.value] || ''; }
    function renderSide() {
      var items = cart.all(), t = totals(method());
      if (!items.length && step < 3) { side.innerHTML = '<h2>Đơn hàng</h2><p class="note">Giỏ hàng đang trống. Thêm vài món mẫu để thử quy trình thanh toán.</p><button type="button" class="btn btn-block" id="ckDemo">Thêm 3 món mẫu</button><a class="btn btn-line btn-block" href="' + R + 'san-pham/">Xem sản phẩm</a>'; $('#ckDemo').addEventListener('click', function () { cart.add('blazer-moc', 'M'); cart.add('so-mi-trang', 'S'); cart.add('quan-taupe', 'M'); }); return; }
      side.innerHTML = '<h2>Đơn hàng</h2><div class="sum-mini">' + items.map(miniHTML).join('') + '</div><div class="row"><span>Tạm tính</span><span class="price">' + fmt(t.sub) + '</span></div>' + (t.disc ? '<div class="row minus"><span>Mã ' + t.code + '</span><span class="price">−' + fmt(t.disc) + '</span></div>' : '') + '<div class="row"><span>Giao hàng</span><span class="price">' + (t.ship ? fmt(t.ship) : 'Miễn phí') + '</span></div><div class="row tot"><span>Tổng cộng</span><span class="price">' + fmt(t.total) + '</span></div><p class="note">Giá đã gồm VAT. <a href="' + R + 'gio-hang/" style="border-bottom:1px solid">Sửa giỏ hàng</a></p>';
    }
    function shipOpts() {
      var hcm = prov.value === 'TP. Hồ Chí Minh', t = totals(''), fast = f.querySelector('input[name=ship][value=fast]');
      fast.disabled = !hcm; if (!hcm && fast.checked) f.querySelector('input[name=ship][value=std]').checked = true;
      $('#shipStdFee').textContent = t.ship ? fmt(t.ship) : 'Miễn phí';
      $('#shipFastNote').textContent = hcm ? 'Nhận trong ngày nếu đặt trước 15:00.' : 'Chỉ áp dụng cho địa chỉ tại TP.HCM.';
      $('#storePick').hidden = f.elements.ship.value !== 'pickup';
    }
    function go(n) {
      step = n; panes.forEach(function (p, i) { p.classList.toggle('on', i === n); });
      stepsEl.forEach(function (s, i) { s.classList.toggle('on', i === n); s.classList.toggle('done', i < n); if (i === n) s.setAttribute('aria-current', 'step'); else s.removeAttribute('aria-current'); });
      if (n === 1) shipOpts(); if (n === 2) review();
      renderSide(); save();
      var top = $('#ckTop').getBoundingClientRect().top + window.pageYOffset - 90; if (window.pageYOffset > top) window.scrollTo({ top: top, behavior: REDUCE ? 'auto' : 'smooth' });
      var h = $('h2', panes[n]); if (h && started) { h.tabIndex = -1; h.focus({ preventScroll: true }); } started = true;
    }
    function save() { var o = { step: Math.min(step, 2), ship: f.elements.ship.value, pay: f.elements.pay.value }; ['name', 'phone', 'email', 'province', 'ward', 'street', 'note'].forEach(function (k) { o[k] = f.elements[k].value; }); store.set('checkout', o); }
    function review() {
      var e = f.elements, sh = { std: 'Giao tiêu chuẩn, 2–4 ngày', fast: 'Giao nhanh nội thành, trong ngày', pickup: 'Nhận tại ' + (D.stores.filter(function (s) { return s.id === e.store.value; })[0] || D.stores[0]).name }[e.ship.value];
      $('#ckReview').innerHTML = '<div><dt>Người nhận</dt><dd>' + esc(e.name.value) + ' · ' + esc(e.phone.value) + '</dd><button type="button" data-go="0">Sửa</button></div><div><dt>Địa chỉ</dt><dd>' + esc(e.street.value) + ', ' + esc(e.ward.value) + ', ' + esc(e.province.value) + '</dd><button type="button" data-go="0">Sửa</button></div><div><dt>Giao hàng</dt><dd>' + sh + '</dd><button type="button" data-go="1">Sửa</button></div>';
      $('#bankBox').hidden = e.pay.value !== 'bank';
      $('#bankAmount').textContent = fmt(totals(method()).total);
    }
    f.addEventListener('click', function (e) {
      var b = e.target.closest('[data-go],[data-next]'); if (!b) return;
      if (b.hasAttribute('data-go')) return go(+b.getAttribute('data-go'));
      if (!cart.count()) { toast('Giỏ hàng đang trống, hãy thêm sản phẩm trước'); return; }
      if (step === 0 && !check(f, { name: V.name, phone: V.phone, email: V.emailOpt, province: V.req('Vui lòng chọn tỉnh, thành phố.'), ward: V.req('Vui lòng nhập phường, xã.'), street: V.req('Vui lòng nhập số nhà, tên đường.') })) return;
      go(step + 1);
    });
    f.addEventListener('change', function (e) { if (e.target.name === 'ship' || e.target.name === 'province') { shipOpts(); renderSide(); } if (e.target.name === 'pay') review(); save(); });
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (step !== 2) return;
      if (!cart.count()) { toast('Giỏ hàng đang trống, hãy thêm sản phẩm trước'); return; }
      if (!check(f, { agree: V.agree })) return;
      var t = totals(method()), c = code('YC'), el = f.elements;
      $('#doneCode').textContent = c;
      $('#doneText').innerHTML = 'Cảm ơn ' + esc(el.name.value) + '. Đơn gồm ' + cart.count() + ' món, tổng <b class="price">' + fmt(t.total) + '</b>, ' + (el.pay.value === 'cod' ? 'thanh toán khi nhận hàng' : 'thanh toán bằng chuyển khoản') + '. Đây là đơn minh hoạ: không có hàng nào được gửi và không khoản tiền nào bị thu.';
      var done = '<h2>Đã đặt</h2><div class="sum-mini">' + cart.all().map(miniHTML).join('') + '</div><div class="row tot"><span>Tổng cộng</span><span class="price">' + fmt(t.total) + '</span></div>';
      go(3); side.innerHTML = done; cart.clear(); store.del('coupon'); store.del('checkout');
    });
    document.addEventListener('yc:cart', function () { if (step < 3) { renderSide(); if (step === 1) shipOpts(); } });
    f.querySelector('input[name=ship][value=' + (state.ship || 'std') + ']').checked = true;
    f.querySelector('input[name=pay][value=' + (state.pay || 'cod') + ']').checked = true;
    go(cart.count() && state.name ? Math.min(state.step || 0, 2) : 0);
  }

  /* ================= LOOKBOOK ================= */
  function lookbook() {
    var grid = $('#lbGrid');
    function render(k) {
      var s = D.looks[k];
      $('#lbTitle').textContent = s.title; $('#lbLead').textContent = s.lead; $('#lbCount').textContent = s.name + ' · ' + s.items.length + ' bộ phối';
      grid.innerHTML = s.items.map(function (it, i) {
        return '<figure class="look rv"><div class="look-img"><img src="' + img(it.img, 1200, 1500) + '" alt="' + esc(it.alt) + '" width="1200" height="1500"' + (i ? ' loading="lazy"' : '') + '></div><figcaption><b>' + it.cap + '</b><span>LOOK 0' + (i + 1) + '</span></figcaption><div class="look-items">' + it.spots.map(function (sp) { var p = P(sp.id); return '<a class="chip" href="' + url(p.id) + '">' + esc(p.name) + ' · ' + fmt(p.price) + '</a>'; }).join('') + '</div></figure>';
      }).join('');
      $$('.look-img', grid).forEach(function (b, i) { spots(b, s.items[i].spots); });
      reveal(grid);
      try { history.replaceState(null, '', '?mua=' + k); } catch (e) {}
    }
    var bs = $$('#lbTabs button');
    bs.forEach(function (b) { b.addEventListener('click', function () { bs.forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); render(b.getAttribute('data-k')); }); });
    var k = new URLSearchParams(location.search).get('mua'); if (!D.looks[k]) k = 'thu-dong';
    bs.forEach(function (x) { x.setAttribute('aria-pressed', x.getAttribute('data-k') === k); });
    render(k);
  }

  /* ================= THƯƠNG HIỆU ================= */
  function brand() {
    tabs($('#tlNav'), function (k) { $$('.tl-pane').forEach(function (p) { p.hidden = p.getAttribute('data-k') !== k; }); });
    var mats = {
      linen: { n: 'Linen', img: '1757382603782-839864de55d7', d: 'Dệt từ sợi lanh, thoáng và hút ẩm tốt. Nhăn tự nhiên là đặc tính của linen, không phải lỗi vải. Yên Chi giặt mềm vải trước khi cắt để hạn chế co rút.', v: [95, 60, 35], use: 'Đầm suông, sơ mi khoác, blazer mùa nóng.' },
      tencel: { n: 'Tencel', img: '1705290304455-35ffb433f560', d: 'Sợi từ bột gỗ, bề mặt mịn và mát tay. Rủ đẹp, ít nhăn hơn linen nên hợp những món cần giữ nếp cả ngày.', v: [85, 90, 75], use: 'Quần ống rộng, áo kiểu, đầm sơ mi.' },
      lua: { n: 'Lụa pha', img: '1634665810235-011d663754e7', d: 'Lụa tơ tằm pha để bền hơn và dễ chăm hơn lụa nguyên chất. Bóng nhẹ, mềm, cần giặt tay hoặc túi lưới.', v: [75, 95, 55], use: 'Áo tay bồng, chân váy cắt xéo.' },
      poplin: { n: 'Cotton poplin', img: '1646060542237-3703c30d2f7d', d: 'Cotton dệt khít, đứng phom và không lộ. Ủi dễ, bền màu, hợp sơ mi mặc hằng ngày.', v: [80, 45, 65], use: 'Sơ mi trắng, đầm sơ mi.' },
      len: { n: 'Len pha wool', img: '1523212727988-82c430c79c8e', d: 'Len pha wool mềm, ấm vừa cho phòng máy lạnh và mùa lạnh miền Bắc. Gấp khi cất, không treo móc để tránh dão vai.', v: [55, 60, 85], use: 'Cardigan, áo len cổ tròn.' }
    };
    function mat(k) { var m = mats[k]; $('#matPane').innerHTML = '<figure><img src="' + img(m.img, 800, 800) + '" alt="Cận cảnh chất liệu ' + m.n + '" width="800" height="800" loading="lazy"></figure><div><h3>' + m.n + '</h3><p>' + m.d + '</p><div class="bars">' + ['Độ thoáng', 'Độ rủ', 'Ít nhăn'].map(function (l, i) { return '<div><span>' + l + '</span><i style="--v:0%" data-v="' + m.v[i] + '"></i><span class="num">' + Math.round(m.v[i] / 20) + '/5</span></div>'; }).join('') + '</div><p class="note">Thường dùng cho: ' + m.use + ' Thang điểm do Yên Chi tự đánh giá để bạn dễ so sánh.</p></div>'; requestAnimationFrame(function () { requestAnimationFrame(function () { $$('#matPane .bars i').forEach(function (i) { i.style.setProperty('--v', i.getAttribute('data-v') + '%'); }); }); }); }
    tabs($('#matNav'), mat); mat('linen');
    var nums = $$('.stats b[data-n]');
    function run(el) { var n = +el.getAttribute('data-n'), t0 = null; if (REDUCE || HEADLESS) { el.textContent = n; return; } function f(t) { if (!t0) t0 = t; var k = Math.min(1, (t - t0) / 1200); el.textContent = Math.round(n * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(f); } requestAnimationFrame(f); }
    if ('IntersectionObserver' in window && !HEADLESS) { var o = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { run(x.target); o.unobserve(x.target); } }); }, { threshold: .5 }); nums.forEach(function (n) { o.observe(n); }); } else nums.forEach(function (n) { n.textContent = n.getAttribute('data-n'); });
  }

  /* ================= CHÍNH SÁCH ================= */
  var SIZE = [{ s: 'S', b: [80, 84], w: [62, 66], h: [86, 90] }, { s: 'M', b: [84, 88], w: [66, 70], h: [90, 94] }, { s: 'L', b: [88, 92], w: [70, 74], h: [94, 98] }, { s: 'XL', b: [92, 96], w: [74, 78], h: [98, 102] }];
  function policy() {
    var links = $$('#polNav a'), secs = links.map(function (a) { return $(a.getAttribute('href')); });
    function spy() { var y = window.pageYOffset + 160, cur = 0; secs.forEach(function (s, i) { if (s && s.offsetTop <= y) cur = i; }); links.forEach(function (a, i) { a.classList.toggle('on', i === cur); }); }
    window.addEventListener('scroll', spy, { passive: true }); spy();
    /* phí giao hàng */
    var sf = $('#shipCalc'); sf.elements.province.innerHTML = D.provinces.map(function (p) { return '<option>' + p + '</option>'; }).join('');
    function ship() {
      var p = sf.elements.province.value, v = +sf.elements.total.value, out = $('#shipOut'), hcm = p === 'TP. Hồ Chí Minh', near = ['Hà Nội', 'Đà Nẵng', 'Đồng Nai', 'Tây Ninh', 'Cần Thơ'].indexOf(p) > -1;
      var fee = v >= D.ship.freeFrom ? 0 : D.ship.fee, eta = hcm ? '1–2 ngày' : near ? '2–3 ngày' : '3–4 ngày';
      out.classList.add('on');
      out.innerHTML = '<b class="big price">' + (fee ? fmt(fee) : 'Miễn phí') + '</b><p>Giao tiêu chuẩn tới ' + p + ': dự kiến ' + eta + ' làm việc.' + (hcm ? ' Giao nhanh trong ngày: ' + fmt(D.ship.fast) + ' nếu đặt trước 15:00.' : '') + (fee ? ' Mua thêm ' + fmt(D.ship.freeFrom - v) + ' để được miễn phí.' : '') + '</p>';
    }
    sf.addEventListener('change', ship); sf.addEventListener('input', function (e) { if (e.target.name === 'total') { $('#shipTotalV').textContent = fmt(+e.target.value); ship(); } }); ship();
    /* gợi ý size */
    var zf = $('#sizeForm'), fit = 'vua'; liveClear(zf);
    $$('#fitSeg button').forEach(function (b) { b.addEventListener('click', function () { fit = b.getAttribute('data-k'); $$('#fitSeg button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); }); });
    zf.addEventListener('submit', function (e) {
      e.preventDefault();
      var num = function (lo, hi, m, opt) { return function (v) { if (!v && opt) return ''; var n = parseFloat(String(v).replace(',', '.')); return n >= lo && n <= hi ? '' : m; }; };
      if (!check(zf, { height: num(140, 190, 'Nhập chiều cao từ 140 đến 190 cm.'), weight: num(35, 95, 'Nhập cân nặng từ 35 đến 95 kg.'), bust: num(70, 110, 'Vòng ngực từ 70 đến 110 cm.', true), waist: num(54, 95, 'Vòng eo từ 54 đến 95 cm.', true), hip: num(78, 115, 'Vòng mông từ 78 đến 115 cm.', true) })) return;
      var g = function (k) { return parseFloat(String(zf.elements[k].value).replace(',', '.')) || 0; }, H = g('height'), Wt = g('weight'), B = g('bust'), Wa = g('waist'), Hi = g('hip');
      function idx(v, key) { for (var i = 0; i < SIZE.length; i++) if (v <= SIZE[i][key][1]) return i; return SIZE.length; }
      var by = [], out = $('#sizeOut'), i;
      if (B) by.push(['vòng ngực', idx(B, 'b')]); if (Wa) by.push(['vòng eo', idx(Wa, 'w')]); if (Hi) by.push(['vòng mông', idx(Hi, 'h')]);
      var basis;
      if (by.length) { i = Math.max.apply(null, by.map(function (x) { return x[1]; })); var top = by.filter(function (x) { return x[1] === i; }).map(function (x) { return x[0]; }); basis = 'Tính theo ' + top.join(' và ') + ', số đo lớn nhất so với bảng size.'; }
      else { i = Wt < 48 ? 0 : Wt < 54 ? 1 : Wt < 60 ? 2 : Wt <= 66 ? 3 : 4; if (H >= 168 && i < 3 && Wt >= 46) i += 0; basis = 'Ước lượng theo chiều cao và cân nặng. Thêm ba số đo vòng để kết quả sát hơn.'; }
      if (fit === 'rong' && i < 4) i++;
      out.classList.add('on');
      $$('#sizeTable tbody tr').forEach(function (r, k) { r.classList.toggle('hit', k === i); });
      if (i > 3) { out.innerHTML = '<b class="big">Cần tư vấn</b><p>Số đo của bạn nằm ngoài bảng size S–XL hiện có. Yên Chi nhận may theo số đo với một số mẫu; nhắn cửa hàng để được tư vấn.</p><a class="btn btn-sm" href="' + R + 'cua-hang/#dat-lich">Đặt lịch tư vấn</a>'; return; }
      var s = SIZE[i].s, tall = H >= 168 ? ' Bạn cao từ 1m68: quần và đầm dài có thể ngắn hơn ảnh mẫu khoảng 2–3 cm.' : H && H < 155 ? ' Bạn cao dưới 1m55: quần ống rộng có thể cần lên lai, hai cửa hàng nhận lên lai trong ngày.' : '';
      out.innerHTML = '<b class="big">Size ' + s + '</b><p>' + basis + (fit === 'rong' ? ' Đã cộng một size vì bạn thích mặc rộng.' : '') + tall + '</p><a class="btn btn-sm" href="' + R + 'san-pham/?size=' + s + '">Xem đồ còn size ' + s + ' ' + ic('arrow') + '</a>';
      store.set('size', s);
    });
    /* tìm trong hỏi đáp */
    var fq = $('#faqQ');
    fq.addEventListener('input', function () { var k = plain(fq.value.trim()), n = 0; $$('#faq .acc-i').forEach(function (it) { var hit = !k || plain(it.textContent).indexOf(k) > -1; it.hidden = !hit; if (hit) n++; }); $('#faqNone').hidden = n > 0; });
  }

  /* ================= TẠP CHÍ ================= */
  function journal() {
    var list = $('#jrList'), cats = ['Tất cả'].concat(D.posts.map(function (p) { return p.cat; }).filter(function (c, i, a) { return a.indexOf(c) === i; })), cur = 'Tất cả';
    function render() {
      $('#jrFilter').innerHTML = cats.map(function (c) { return '<button type="button" class="chip" aria-pressed="' + (c === cur) + '" data-c="' + c + '">' + c + '</button>'; }).join('');
      var ps = D.posts.filter(function (p) { return !p.full && (cur === 'Tất cả' || p.cat === cur); });
      list.innerHTML = ps.length ? ps.map(function (p) { return '<article class="post" id="' + p.id + '"><div class="post-img"><img src="' + img(p.img, 800, 600) + '" alt="' + esc(p.title) + '" width="800" height="600" loading="lazy"></div><div class="post-meta"><b>' + p.cat + '</b><span>' + p.date + '</span><span>' + p.read + '</span></div><h3>' + esc(p.title) + '</h3><p>' + esc(p.sum) + '</p><div class="quick"><button type="button" aria-expanded="false">Đọc nhanh 3 ý chính ' + ic('plus') + '</button><ol>' + p.quick.map(function (q) { return '<li>' + esc(q) + '</li>'; }).join('') + '</ol></div></article>'; }).join('') : '<p class="muted">Mục này hiện có bài nổi bật ở phía trên. Chọn mục khác để xem thêm.</p>';
    }
    $('#jrFilter').addEventListener('click', function (e) { var b = e.target.closest('[data-c]'); if (b) { cur = b.getAttribute('data-c'); render(); } });
    list.addEventListener('click', function (e) { var b = e.target.closest('.quick button'); if (b) b.setAttribute('aria-expanded', b.getAttribute('aria-expanded') !== 'true'); });
    render();
    if (location.hash && location.hash !== '#bai-viet') { var t = $(location.hash); if (t) { var b = $('.quick button', t); if (b) b.setAttribute('aria-expanded', 'true'); setTimeout(function () { t.scrollIntoView({ block: 'center' }); }, 80); } }
    $('#artShop').innerHTML = ['blazer-moc', 'so-mi-trang', 'quan-kaki'].map(function (i) { return card(P(i)); }).join('');
    var art = $('#bai-viet'), bar = $('#readBar'), toc = $$('#artToc a'), heads = toc.map(function (a) { return $(a.getAttribute('href')); });
    function prog() {
      var r = art.getBoundingClientRect(), k = Math.max(0, Math.min(1, (-r.top + 120) / (r.height - window.innerHeight * .5)));
      bar.style.transform = 'scaleX(' + (r.top < 200 && r.bottom > 0 ? k : 0) + ')';
      var cur = -1; heads.forEach(function (h, i) { if (h && h.getBoundingClientRect().top < 180) cur = i; }); toc.forEach(function (a, i) { a.classList.toggle('on', i === cur); });
    }
    window.addEventListener('scroll', prog, { passive: true }); prog();
    $('#copyLink').addEventListener('click', function () { var u = location.origin + location.pathname + '#bai-viet'; if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(u).then(function () { toast('Đã sao chép đường dẫn bài viết'); }, function () { toast('Không sao chép được, hãy chép từ thanh địa chỉ'); }); else toast('Trình duyệt không hỗ trợ sao chép tự động'); });
    syncCounts();
  }

  /* ================= CỬA HÀNG ================= */
  function stores() {
    var map = $('#stMap'), list = $('#stList'), now = new Date(), h = now.getHours() + now.getMinutes() / 60;
    list.innerHTML = D.stores.map(function (s) { var op = h >= s.open && h < s.close; return '<article class="st-card" data-s="' + s.id + '" tabindex="0"><img src="' + img(s.img, 600, 700) + '" alt="Không gian cửa hàng ' + s.name + '" width="600" height="700" loading="lazy"><div><span class="open-now' + (op ? '' : ' off') + '">' + (op ? 'Đang mở cửa' : 'Đã đóng cửa') + '</span><h3>' + s.name + '</h3><p>' + ic('pin') + '<span>' + s.addr + '</span></p><p>' + ic('clock') + '<span>' + s.hours + '</span></p><p>' + ic('phone') + '<a href="tel:' + s.tel.replace(/\s/g, '') + '">' + s.tel + '</a></p><p class="note">' + s.note + '</p></div></article>'; }).join('');
    D.stores.forEach(function (s) { var b = document.createElement('button'); b.type = 'button'; b.className = 'pin'; b.style.left = s.x + '%'; b.style.top = s.y + '%'; b.setAttribute('data-s', s.id); b.setAttribute('aria-pressed', 'false'); b.innerHTML = '<i>' + ic('bag') + '</i><b>' + s.name.replace('Yên Chi ', '') + '</b>'; b.setAttribute('aria-label', 'Chọn ' + s.name); map.appendChild(b); });
    function pick(id) { $$('.pin', map).forEach(function (p) { p.setAttribute('aria-pressed', p.getAttribute('data-s') === id); }); $$('.st-card', list).forEach(function (c) { c.classList.toggle('on', c.getAttribute('data-s') === id); }); var sel = $('#bkForm').elements.store; if (sel) sel.value = id; }
    map.addEventListener('click', function (e) { var b = e.target.closest('.pin'); if (b) pick(b.getAttribute('data-s')); });
    list.addEventListener('click', function (e) { var c = e.target.closest('.st-card'); if (c && !e.target.closest('a')) pick(c.getAttribute('data-s')); });
    list.addEventListener('keydown', function (e) { if (e.key === 'Enter' && e.target.classList.contains('st-card')) pick(e.target.getAttribute('data-s')); });
    /* đặt lịch thử đồ */
    var f = $('#bkForm'), slot = '', sl = $('#bkSlots'), z = function (n) { return (n < 10 ? '0' : '') + n; };
    f.elements.store.innerHTML = D.stores.map(function (s) { return '<option value="' + s.id + '">' + s.name + '</option>'; }).join('');
    var d0 = new Date(now.getTime() + 864e5), iso = function (d) { return d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate()); };
    f.elements.date.min = iso(d0); f.elements.date.max = iso(new Date(now.getTime() + 30 * 864e5)); f.elements.date.value = iso(d0);
    function slots() {
      var d = new Date(f.elements.date.value + 'T00:00:00'), seed = (d.getDate() || 1) + (f.elements.store.value === 'pasteur' ? 0 : 3); slot = '';
      sl.innerHTML = ['10:00', '11:00', '14:00', '15:00', '16:00', '17:30', '19:00', '20:00'].map(function (t, i) { var full = (i * 7 + seed) % 5 === 0; return '<button type="button" data-t="' + t + '" aria-pressed="false"' + (full ? ' disabled aria-label="' + t + ', đã kín"' : '') + '>' + t + '</button>'; }).join('');
    }
    sl.addEventListener('click', function (e) { var b = e.target.closest('[data-t]'); if (!b || b.disabled) return; slot = b.getAttribute('data-t'); $$('button', sl).forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); $('#bkSlotErr').style.display = 'none'; });
    f.elements.date.addEventListener('change', slots); f.elements.store.addEventListener('change', function () { slots(); pick(f.elements.store.value); });
    liveClear(f); slots(); pick('pasteur');
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = check(f, { date: V.req('Vui lòng chọn ngày.'), name: V.name, phone: V.phone, agree: V.agree });
      if (!slot) { $('#bkSlotErr').style.display = 'block'; ok = false; }
      if (!ok) return;
      var d = f.elements.date.value.split('-'), s = D.stores.filter(function (x) { return x.id === f.elements.store.value; })[0];
      f.innerHTML = '<div class="done-box"><div class="tick-o">' + ic('check') + '</div><h2>Đã ghi nhận lịch hẹn</h2><p class="done-code">' + code('TD') + '</p><p class="lead" style="margin:0 auto">' + s.name + ', ' + slot + ' ngày ' + d[2] + '/' + d[1] + '/' + d[0] + '. Đây là form minh hoạ nên lịch chưa được gửi tới cửa hàng.</p></div>';
    });
  }

  /* ---------- khởi động ---------- */
  buildChrome(); initHeader(); initGlobalClicks();
  $$('[data-products]').forEach(function (el) { var ids = el.getAttribute('data-products').split(','); el.innerHTML = ids.map(function (i) { var p = P(i); return p ? card(p) : ''; }).join(''); });
  var mods = { 'trang-chu': home, 'san-pham': listing, 'chi-tiet': detail, 'gio-hang': cartPage, 'thanh-toan': checkout, 'lookbook': lookbook, 'thuong-hieu': brand, 'chinh-sach': policy, 'tap-chi': journal, 'cua-hang': stores };
  if (mods[PAGE]) mods[PAGE]();
  syncCounts(); reveal(document);
  document.addEventListener('yc:cart', function () { if (openEl === drawer) renderDrawer(); });
})();
