/* Hải Khơi Seafood: JS dùng chung cho mọi trang (mẫu giao diện, không gửi dữ liệu đi đâu) */
(function () {
  'use strict';
  var d = document, w = window;
  function $(s, c) { return (c || d).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); }
  var RM = w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in w;
  var STATIC = /HeadlessChrome/.test(navigator.userAgent);
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function icon(id, cls) { return '<svg class="ic ' + (cls || '') + '" aria-hidden="true"><use href="#' + id + '"/></svg>'; }

  /* ---------- header, nút nổi ---------- */
  var hdr = $('#hdr'), badge = $('#ktBadge');
  function onScroll() {
    var y = w.pageYOffset;
    if (hdr) hdr.classList.toggle('scrolled', y > 8);
    if (badge) badge.classList.toggle('show', y > w.innerHeight * .85);
  }
  w.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- menu mobile ---------- */
  var mnav = $('#mnav'), mb = $('#menuBtn'), mc = $('#menuClose');
  function lock(on) {
    d.body.classList.toggle('lock', on);
    d.documentElement.style.overflow = on ? 'hidden' : '';
    d.body.style.overflow = on ? 'hidden' : '';
  }
  function menu(open, silent) {
    mnav.classList.toggle('open', open);
    mnav.setAttribute('aria-hidden', open ? 'false' : 'true');
    mb.setAttribute('aria-expanded', open ? 'true' : 'false');
    lock(open);
    if (silent) return;
    if (open) mc.focus(); else mb.focus();
  }
  if (mnav && mb && mc) {
    mb.addEventListener('click', function () { menu(true); });
    mc.addEventListener('click', function () { menu(false); });
    $$('a', mnav).forEach(function (a) { a.addEventListener('click', function () { menu(false, true); }); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && mnav.classList.contains('open')) menu(false); });
    var lastW = w.innerWidth;
    w.addEventListener('resize', function () {
      if (w.innerWidth === lastW) return; lastW = w.innerWidth;
      if (w.innerWidth > 1180 && mnav.classList.contains('open')) menu(false, true);
    });
  }

  /* ---------- nút VI / EN (minh hoạ) ---------- */
  var langNote = $('#langNote'), langT;
  $$('[data-lang-en]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (!langNote) return;
      langNote.hidden = false; clearTimeout(langT);
      langT = setTimeout(function () { langNote.hidden = true; }, 5200);
    });
  });
  d.addEventListener('click', function (e) {
    if (langNote && !langNote.hidden && !e.target.closest('.lang')) langNote.hidden = true;
  });

  /* ---------- hiện dần ---------- */
  var watch = $$('[data-r],[data-in]');
  if (hasIO && !RM && !STATIC) {
    var ro = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -7% 0px', threshold: .06 });
    watch.forEach(function (el) { ro.observe(el); });
  } else { watch.forEach(function (el) { el.classList.add('in'); }); }

  /* độ dài nét vẽ cho đường quy trình và tuyến hàng hải */
  $$('.flow-line path,.route').forEach(function (p) {
    try { p.style.setProperty('--len', Math.ceil(p.getTotalLength()) + 'px'); } catch (e) { }
  });

  /* trượt nhẹ lớp ảnh ở màn hình đầu */
  var hv = $('.hero-visual');
  if (hv && !RM && !STATIC && w.matchMedia('(min-width: 901px)').matches) {
    var sub = $('.hv-sub', hv), card = $('.hv-card', hv), tick = false;
    w.addEventListener('scroll', function () {
      if (tick) return; tick = true;
      requestAnimationFrame(function () {
        var y = Math.min(w.pageYOffset, 700);
        if (sub) sub.style.transform = 'translate3d(0,' + (-y * .06).toFixed(1) + 'px,0)';
        if (card) card.style.transform = 'translate3d(0,' + (-y * .11).toFixed(1) + 'px,0)';
        tick = false;
      });
    }, { passive: true });
  }

  /* ---------- giỏ yêu cầu báo giá (RFQ) lưu tạm ---------- */
  var KEY = 'hk_rfq_v1', mem = [];
  function getCart() {
    try { var v = JSON.parse(w.localStorage.getItem(KEY) || '[]'); return Array.isArray(v) ? v : []; } catch (e) { return mem; }
  }
  function setCart(c) {
    mem = c;
    try { w.localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) { }
    paintCart();
  }
  var cartHooks = [];
  function paintCart() {
    var c = getCart(), n = c.length;
    $$('[data-rfq-count]').forEach(function (el) { el.textContent = n; el.hidden = n === 0; });
    $$('[data-rfq-num]').forEach(function (el) { el.textContent = n; });
    var bar = $('#rfqBar');
    if (bar) { bar.classList.toggle('show', n > 0); d.body.classList.toggle('has-rfq', n > 0); }
    cartHooks.forEach(function (f) { f(c); });
  }

  /* ---------- trang Sản phẩm: lọc + thêm vào RFQ ---------- */
  var grid = $('#pgrid');
  if (grid) {
    var prods = $$('.prod', grid), chips = $$('.chip[data-f]'), pc = $('#pcount');
    var names = { all: 'tất cả nhóm', tom: 'nhóm tôm', ca: 'nhóm cá', muc: 'nhóm mực', gtgt: 'nhóm hàng giá trị gia tăng' };
    var applyFilter = function (f, animate) {
      if (!names[f]) f = 'all';
      var n = 0;
      chips.forEach(function (c) { c.setAttribute('aria-pressed', c.getAttribute('data-f') === f ? 'true' : 'false'); });
      prods.forEach(function (p) {
        var show = f === 'all' || p.getAttribute('data-g') === f;
        p.classList.toggle('hide', !show);
        p.classList.remove('pop');
        if (show) { p.style.setProperty('--n', n); n++; if (animate && !RM) { void p.offsetWidth; p.classList.add('pop'); } }
      });
      if (pc) pc.textContent = 'Đang xem ' + n + ' sản phẩm, ' + names[f];
      try { history.replaceState(null, '', f === 'all' ? location.pathname : location.pathname + '?nhom=' + f); } catch (e) { }
    };
    chips.forEach(function (c) { c.addEventListener('click', function () { applyFilter(c.getAttribute('data-f'), true); }); });
    var m = /[?&]nhom=([a-z]+)/.exec(location.search);
    applyFilter(m ? m[1] : 'all', false);

    var syncAdd = function (c) {
      var ids = c.map(function (x) { return x.id; });
      prods.forEach(function (p) {
        var b = $('.add', p), on = ids.indexOf(p.getAttribute('data-id')) > -1;
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
        $('.add-t', b).textContent = on ? 'Đã thêm vào yêu cầu' : 'Thêm vào yêu cầu báo giá';
      });
    };
    cartHooks.push(syncAdd);
    prods.forEach(function (p) {
      $('.add', p).addEventListener('click', function () {
        var c = getCart(), id = p.getAttribute('data-id'), i = -1;
        c.forEach(function (x, k) { if (x.id === id) i = k; });
        if (i > -1) c.splice(i, 1);
        else c.push({ id: id, name: p.getAttribute('data-name'), spec: p.getAttribute('data-spec'), qty: '' });
        setCart(c);
      });
    });
  }

  /* ---------- trang Nhà máy: sơ đồ quy trình ---------- */
  var proc = $('#proc');
  if (proc) {
    var STEPS = [
      { t: 'Tiếp nhận nguyên liệu', p: 'Tôm, cá, mực về nhà máy trong thùng cách nhiệt ướp đá. Mỗi xe được kiểm cảm quan, đo nhiệt độ, phân cỡ sơ bộ và gắn mã lô ngay tại cửa tiếp nhận.', b: ['Ghi nguồn gốc: ao nuôi hoặc tàu khai thác', 'Lấy mẫu kiểm nhanh trước khi nhận hàng', 'Lô không đạt được tách riêng, không nhập xưởng'], temp: '≤ 4 °C', v: 4, tl: 'Nhiệt độ nguyên liệu', time: 'Trong 30 phút', ctl: 'Cảm quan, nhiệt độ, hồ sơ lô' },
      { t: 'Sơ chế và phân cỡ', p: 'Nguyên liệu được rửa, lột vỏ, rút chỉ hoặc fillet theo quy cách từng đơn hàng. Bán thành phẩm luôn nằm trong đá vảy và đi một chiều, không quay ngược.', b: ['Phân cỡ bằng máy, kiểm lại bằng cân mẫu', 'Dụng cụ theo màu cho từng khu vực', 'Thay nước, thay đá theo giờ đã định'], temp: '≤ 10 °C', v: 10, tl: 'Nhiệt độ bán thành phẩm', time: 'Tối đa 2 giờ', ctl: 'Cỡ, tạp chất, vệ sinh ca' },
      { t: 'Cấp đông IQF', p: 'Từng con tôm, miếng cá chạy rời trên băng chuyền cấp đông nhanh. Sản phẩm không dính nhau, giữ được hình dáng và độ săn chắc khi rã đông.', b: ['Tâm sản phẩm đạt ≤ −18 °C khi ra băng chuyền', 'Tốc độ băng chuyền chỉnh theo từng cỡ', 'Nhiệt độ được ghi tự động suốt ca'], temp: '−38 °C', v: -38, tl: 'Nhiệt độ buồng đông', time: '8–15 phút', ctl: 'Nhiệt độ tâm sản phẩm' },
      { t: 'Mạ băng', p: 'Lớp băng mỏng bọc ngoài giúp sản phẩm không bị khô và cháy lạnh trong lúc lưu kho, vận chuyển. Tỉ lệ mạ băng làm theo đúng con số ghi trên hợp đồng.', b: ['Cân trước và sau mạ băng theo từng mẻ', 'Tỉ lệ mạ băng ghi rõ trên nhãn và phiếu lô', 'Khối lượng tịnh tính sau khi trừ băng'], temp: '0–2 °C', v: 1, tl: 'Nhiệt độ nước mạ băng', time: 'Vài giây mỗi lượt', ctl: 'Tỉ lệ mạ băng, khối lượng tịnh' },
      { t: 'Đóng gói và dò kim loại', p: 'Sản phẩm được cân, vào túi, hàn kín, qua máy dò kim loại rồi mới vào thùng. Nhãn in mã lô, ngày sản xuất, hạn dùng và thông tin theo yêu cầu của thị trường nhận hàng.', b: ['Túi, hộp, thùng theo thiết kế của người mua', 'Mỗi thùng một mã lô để truy xuất', 'Kiểm tra mối hàn và nhãn theo tần suất'], temp: '≤ −18 °C', v: -18, tl: 'Nhiệt độ tâm sản phẩm', time: 'Dưới 20 phút', ctl: 'Kim loại, nhãn, khối lượng' },
      { t: 'Kho lạnh và xuất container', p: 'Thành phẩm vào kho lạnh, xếp theo lô và xuất theo nguyên tắc nhập trước xuất trước. Container lạnh được kiểm tra vệ sinh, làm lạnh trước rồi mới xếp hàng.', b: ['Nhiệt độ kho ghi liên tục, có cảnh báo', 'Chụp ảnh container, số seal trước khi rời kho', 'Bộ chứng từ đi kèm theo từng lô hàng'], temp: '−20 °C ± 2', v: -20, tl: 'Nhiệt độ kho', time: 'Đến ngày xếp hàng', ctl: 'Nhiệt độ kho, seal container' }
    ];
    var tabs = $$('.pstep', proc), fill = $('.proc-fill', proc), ppT = $('#ppText'), ppR = $('#ppRead'), th = $('#thermoFill'), cur = 0;
    var show = function (i, focus) {
      cur = Math.max(0, Math.min(STEPS.length - 1, i));
      var s = STEPS[cur];
      tabs.forEach(function (t, k) {
        t.setAttribute('aria-selected', k === cur ? 'true' : 'false');
        t.tabIndex = k === cur ? 0 : -1;
        t.classList.toggle('done', k < cur);
      });
      if (focus) tabs[cur].focus();
      if (fill) fill.style.width = (cur / (STEPS.length - 1) * 83.34) + '%';
      ppT.innerHTML = '<span class="k">Bước ' + (cur + 1) + ' / ' + STEPS.length + '</span><h3>' + esc(s.t) + '</h3><p>' + esc(s.p) + '</p><ul>' +
        s.b.map(function (x) { return '<li>' + icon('i-check') + '<span>' + esc(x) + '</span></li>'; }).join('') + '</ul>';
      ppR.innerHTML = '<div><dt>' + esc(s.tl) + '</dt><dd>' + esc(s.temp) + '</dd></div><div><dt>Thời gian</dt><dd class="s">' + esc(s.time) + '</dd></div><div><dt>Điểm kiểm soát</dt><dd class="s">' + esc(s.ctl) + '</dd></div>';
      [ppT, ppR].forEach(function (el) { el.classList.remove('pp-swap'); void el.offsetWidth; el.classList.add('pp-swap'); });
      if (th) th.style.height = Math.max(6, (s.v + 40) / 50 * 100) + '%';
      $('#ppPrev').disabled = cur === 0; $('#ppNext').disabled = cur === STEPS.length - 1;
      tabs[cur].setAttribute('aria-controls', 'procPanel');
    };
    tabs.forEach(function (t, k) {
      t.addEventListener('click', function () { show(k); });
      t.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); show(cur + 1, true); }
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); show(cur - 1, true); }
        else if (e.key === 'Home') { e.preventDefault(); show(0, true); }
        else if (e.key === 'End') { e.preventDefault(); show(STEPS.length - 1, true); }
      });
    });
    $('#ppPrev').addEventListener('click', function () { show(cur - 1); });
    $('#ppNext').addEventListener('click', function () { show(cur + 1); });
    show(0);
  }

  /* ---------- trang Nhà máy: truy xuất theo mã lô (dữ liệu mẫu) ---------- */
  var tf = $('#traceForm');
  if (tf) {
    var LOTS = {
      'HK-TOM-2611-07': { sp: 'Tôm Thẻ PD IQF', size: '31/40', src: 'Ao nuôi mẫu số 12, Cà Mau', kl: '9.600 kg', st: [
        ['02/11/2026 · 05:40', 'Thu hoạch tại ao nuôi', 'Tôm được ướp đá vảy ngay tại bờ ao, xếp vào thùng cách nhiệt.', '2 °C'],
        ['02/11/2026 · 09:15', 'Tiếp nhận tại nhà máy', 'Kiểm cảm quan, đo nhiệt độ, lấy mẫu kiểm nhanh. Gắn mã lô.', '3 °C'],
        ['02/11/2026 · 10:30', 'Sơ chế: lột vỏ, rút chỉ', 'Phân cỡ 31/40, kiểm cỡ bằng cân mẫu mỗi 30 phút.', '8 °C'],
        ['02/11/2026 · 13:05', 'Cấp đông IQF', 'Dây chuyền số 2. Tâm sản phẩm đạt yêu cầu khi ra băng chuyền.', '−38 °C'],
        ['02/11/2026 · 13:40', 'Mạ băng 10%', 'Cân trước và sau mạ băng, ghi phiếu theo mẻ.', '1 °C'],
        ['02/11/2026 · 14:20', 'Đóng gói, dò kim loại', 'Túi 1 kg × 10 túi/thùng. In mã lô và hạn dùng trên từng túi.', '−18 °C'],
        ['02/11/2026 · 16:00', 'Nhập kho lạnh', 'Vị trí kệ B-07. Nhiệt độ kho ghi tự động.', '−20 °C'],
        ['09/11/2026 · 08:30', 'Xếp container lạnh', 'Container 40 feet, đã làm lạnh trước. Chụp ảnh seal trước khi rời kho.', '−18 °C']
      ] },
      'HK-CATRA-2610-12': { sp: 'Cá Tra Fillet', size: '170/220 g', src: 'Vùng nuôi mẫu, Đồng Tháp', kl: '22.000 kg', st: [
        ['18/10/2026 · 04:50', 'Thu hoạch tại vùng nuôi', 'Cá sống được chuyển bằng ghe thông thuỷ về bến nhà máy.', 'Cá sống'],
        ['18/10/2026 · 08:20', 'Tiếp nhận tại nhà máy', 'Cân, kiểm cảm quan, lấy mẫu kiểm nhanh. Gắn mã lô.', '—'],
        ['18/10/2026 · 09:10', 'Fillet, lạng da, chỉnh hình', 'Phân cỡ 170/220 g, soi ký sinh trùng trên bàn đèn.', '9 °C'],
        ['18/10/2026 · 12:30', 'Cấp đông IQF', 'Dây chuyền số 1. Tâm sản phẩm đạt yêu cầu khi ra băng chuyền.', '−38 °C'],
        ['18/10/2026 · 13:00', 'Mạ băng 5%', 'Cân trước và sau mạ băng, ghi phiếu theo mẻ.', '1 °C'],
        ['18/10/2026 · 13:45', 'Đóng gói, dò kim loại', 'Túi 1 kg × 10 túi/thùng, bọc riêng từng miếng.', '−18 °C'],
        ['18/10/2026 · 15:30', 'Nhập kho lạnh', 'Vị trí kệ D-12. Nhiệt độ kho ghi tự động.', '−20 °C'],
        ['27/10/2026 · 07:45', 'Xếp container lạnh', 'Container 40 feet, đã làm lạnh trước. Chụp ảnh seal trước khi rời kho.', '−18 °C']
      ] },
      'HK-MUC-2611-03': { sp: 'Mực Ống Làm Sạch', size: 'U10', src: 'Tàu khai thác mẫu, Khánh Hoà', kl: '6.400 kg', st: [
        ['28/10/2026 · 03:30', 'Tàu cập cảng cá', 'Mực bảo quản đá trong hầm tàu, bốc dỡ trước khi trời sáng.', '1 °C'],
        ['28/10/2026 · 13:10', 'Tiếp nhận tại nhà máy', 'Xe lạnh vận chuyển về nhà máy. Kiểm cảm quan, gắn mã lô.', '3 °C'],
        ['28/10/2026 · 14:00', 'Sơ chế: làm sạch, lột da', 'Tách đầu, bỏ nội tạng, phân cỡ U10.', '8 °C'],
        ['28/10/2026 · 16:40', 'Cấp đông IQF', 'Dây chuyền số 3. Tâm sản phẩm đạt yêu cầu khi ra băng chuyền.', '−38 °C'],
        ['28/10/2026 · 17:10', 'Mạ băng 10%', 'Cân trước và sau mạ băng, ghi phiếu theo mẻ.', '1 °C'],
        ['28/10/2026 · 17:50', 'Đóng gói, dò kim loại', 'Túi 1 kg × 10 túi/thùng. In mã lô và hạn dùng trên từng túi.', '−18 °C'],
        ['28/10/2026 · 19:20', 'Nhập kho lạnh', 'Vị trí kệ A-03. Nhiệt độ kho ghi tự động.', '−20 °C'],
        ['05/11/2026 · 09:00', 'Xếp container lạnh', 'Ghép chung container với lô tôm cùng đơn hàng.', '−18 °C']
      ] }
    };
    var tin = $('#traceCode'), tout = $('#traceOut'), tmsg = $('#traceMsg');
    var trace = function (code) {
      code = String(code || '').trim().toUpperCase().replace(/\s+/g, '');
      var L = LOTS[code];
      if (!code) { tmsg.textContent = 'Vui lòng nhập mã lô in trên thùng hàng.'; return; }
      if (!L) { tmsg.textContent = 'Không tìm thấy mã "' + code + '" trong dữ liệu mẫu. Hãy thử một mã gợi ý bên dưới.'; return; }
      tmsg.textContent = '';
      tout.innerHTML = '<dl class="trace-head"><div><dt>Mã lô</dt><dd>' + esc(code) + '</dd></div><div><dt>Sản phẩm</dt><dd>' + esc(L.sp) + ' · ' + esc(L.size) + '</dd></div><div><dt>Nguồn nguyên liệu</dt><dd>' + esc(L.src) + '</dd></div><div><dt>Khối lượng lô</dt><dd>' + esc(L.kl) + '</dd></div></dl><ol class="trace-steps">' +
        L.st.map(function (s, i) { return '<li style="--n:' + i + '"><time>' + esc(s[0]) + '</time><div><b>' + esc(s[1]) + '</b><span>' + esc(s[2]) + '</span></div><em>' + esc(s[3]) + '</em></li>'; }).join('') + '</ol>';
    };
    tf.addEventListener('submit', function (e) { e.preventDefault(); trace(tin.value); });
    $$('.code').forEach(function (b) { b.addEventListener('click', function () { tin.value = b.textContent.trim(); trace(tin.value); }); });
  }

  /* ---------- trang Giới thiệu: thanh tiến trình cột mốc ---------- */
  var tl = $('#tl');
  if (tl) {
    var bar = $('.tl-bar', tl), items = $$('li', tl), tk = false;
    var paintTl = function () {
      var r = tl.getBoundingClientRect(), mid = w.innerHeight * .62;
      var h = Math.max(0, Math.min(r.height - 16, mid - r.top - 8));
      if (bar) bar.style.height = h + 'px';
      items.forEach(function (li) { li.classList.toggle('on', li.getBoundingClientRect().top + 14 < mid); });
      tk = false;
    };
    if (STATIC || RM) { items.forEach(function (li) { li.classList.add('on'); }); if (bar) bar.style.height = 'calc(100% - 16px)'; }
    else { w.addEventListener('scroll', function () { if (!tk) { tk = true; requestAnimationFrame(paintTl); } }, { passive: true }); paintTl(); }
  }

  /* ---------- trang Thị trường: bản đồ tuyến, Incoterms, lịch mùa vụ ---------- */
  var wmap = $('#wmap');
  if (wmap) {
    var MK = {
      jp: { n: 'Nhật Bản', sp: 'Tôm PD, tôm tẩm bột, tôm tempura, mực ống làm sạch', day: '8–12 ngày', note: 'Quy cách chặt về cỡ và độ đồng đều; thường đóng túi nhỏ cho kênh bán lẻ.' },
      kr: { n: 'Hàn Quốc', sp: 'Tôm thẻ HLSO, mực nang fillet, mực cắt khoanh', day: '6–9 ngày', note: 'Đơn hàng thường chia nhiều đợt nhỏ, giao đều theo tháng.' },
      us: { n: 'Hoa Kỳ', sp: 'Tôm PD và PDTO hấp chín, cá tra fillet, cá ngừ steak', day: '22–30 ngày', note: 'Nhãn tiếng Anh và thông tin dinh dưỡng theo thiết kế của nhà nhập khẩu.' },
      eu: { n: 'Châu Âu', sp: 'Tôm sú HOSO, cá tra fillet, cá ngừ loin', day: '28–35 ngày', note: 'Thường yêu cầu hồ sơ truy xuất đầy đủ từ vùng nuôi hoặc tàu khai thác.' },
      au: { n: 'Úc', sp: 'Tôm chín, tôm tẩm bột, mực cắt khoanh tẩm bột', day: '18–24 ngày', note: 'Ưa hàng chế biến sẵn, đóng gói cho kênh siêu thị và dịch vụ ăn uống.' },
      me: { n: 'Trung Đông', sp: 'Cá tra fillet, tôm thẻ HLSO block, cá tra cắt khúc', day: '16–22 ngày', note: 'Đơn hàng container nguyên, quy cách ổn định quanh năm.' }
    };
    var wbtn = $$('.wlist button', wmap.parentNode), winfo = $('#winfo');
    var pick = function (k) {
      var o = MK[k]; if (!o) return;
      wmap.classList.add('has-on');
      $$('.route,.port', wmap).forEach(function (el) { el.classList.toggle('on', el.getAttribute('data-m') === k); });
      wbtn.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-m') === k ? 'true' : 'false'); });
      winfo.innerHTML = '<div><dt>Thị trường</dt><dd>' + esc(o.n) + '</dd><dd class="s">' + esc(o.note) + '</dd></div><div><dt>Mặt hàng thường đi</dt><dd class="s">' + esc(o.sp) + '</dd></div><div><dt>Thời gian tàu (tham khảo)</dt><dd>' + esc(o.day) + '</dd></div><div><dt>Điều kiện giao hàng</dt><dd>FOB · CFR · CIF</dd></div>';
    };
    wbtn.forEach(function (b) { b.addEventListener('click', function () { pick(b.getAttribute('data-m')); }); });
    $$('.port[data-m]', wmap).forEach(function (p) { p.addEventListener('click', function () { pick(p.getAttribute('data-m')); }); });
    pick('jp');
    if (hasIO) new IntersectionObserver(function (es) { es.forEach(function (e) { wmap.classList.toggle('paused', !e.isIntersecting); }); }).observe(wmap);
  }
  var inco = $('#inco');
  if (inco) {
    var IC = {
      FOB: { n: 3, t: 'FOB: giao hàng lên tàu tại cảng đi', p: 'Hải Khơi lo sản xuất, đưa hàng ra cảng, làm thủ tục xuất khẩu và xếp hàng lên tàu. Người mua tự thuê tàu, trả cước biển và bảo hiểm. Hợp với nhà nhập khẩu đã có hãng tàu quen.' },
      CFR: { n: 4, t: 'CFR: tiền hàng và cước biển', p: 'Như FOB, nhưng Hải Khơi thuê tàu và trả cước biển đến cảng đích. Người mua tự mua bảo hiểm cho lô hàng. Hợp khi người mua muốn một giá gồm cả cước.' },
      CIF: { n: 5, t: 'CIF: tiền hàng, bảo hiểm và cước biển', p: 'Hải Khơi trả cả cước biển và mua bảo hiểm hàng hoá đến cảng đích. Người mua chỉ lo dỡ hàng, thủ tục nhập khẩu và thuế tại nước mình.' }
    };
    var itabs = $$('.inco-tabs button', inco), irows = $$('.inco-row', inco), idesc = $('#incoDesc');
    var setInco = function (k) {
      var o = IC[k];
      itabs.forEach(function (b) { b.setAttribute('aria-selected', b.getAttribute('data-k') === k ? 'true' : 'false'); });
      irows.forEach(function (r, i) {
        var seller = i < o.n;
        $('.inco-bar i', r).style.width = seller ? '100%' : '0%';
        $('.who', r).textContent = seller ? 'Người bán' : 'Người mua';
      });
      idesc.innerHTML = '<b>' + esc(o.t) + '</b>' + esc(o.p);
    };
    itabs.forEach(function (b) { b.addEventListener('click', function () { setInco(b.getAttribute('data-k')); }); });
    setInco('FOB');
  }
  var cal = $('#cal');
  if (cal) {
    var mo = new Date().getMonth();
    $$('thead th', cal).forEach(function (th, i) { if (i === mo + 1) th.classList.add('now'); });
    $$('tbody tr', cal).forEach(function (tr) {
      $$('td', tr).forEach(function (td, i) { td.style.setProperty('--c', i); if (i === mo) td.classList.add('now'); });
    });
    var cn = $('#calNow'); if (cn) cn.textContent = 'Tháng ' + (mo + 1);
  }

  /* ---------- trang Liên hệ: form yêu cầu báo giá ---------- */
  var form = $('#rfqForm');
  if (form) {
    var list = $('#cartList'), empty = $('#cartEmpty'), sel = $('#addSel'), done = $('#rfqDone');
    var renderCart = function (c) {
      empty.hidden = c.length > 0; list.hidden = c.length === 0;
      list.innerHTML = c.map(function (x, i) {
        return '<li><div><b>' + esc(x.name) + '</b><small>' + esc(x.spec || '') + '</small></div>' +
          '<label class="qty"><span class="vh">Khối lượng dự kiến của ' + esc(x.name) + ', tính bằng tấn</span><input type="number" inputmode="decimal" min="0" step="0.5" placeholder="0" value="' + esc(x.qty || '') + '" data-i="' + i + '"><span aria-hidden="true">tấn</span></label>' +
          '<button type="button" class="rm" data-i="' + i + '" aria-label="Bỏ ' + esc(x.name) + ' khỏi yêu cầu">' + icon('i-x') + '</button></li>';
      }).join('');
      if (sel) $$('option', sel).forEach(function (o) { o.disabled = c.some(function (x) { return x.id === o.value; }); });
    };
    cartHooks.push(renderCart);
    list.addEventListener('click', function (e) {
      var b = e.target.closest('.rm'); if (!b) return;
      var c = getCart(); c.splice(+b.getAttribute('data-i'), 1); setCart(c);
    });
    list.addEventListener('change', function (e) {
      if (e.target.tagName !== 'INPUT') return;
      var c = getCart(), i = +e.target.getAttribute('data-i');
      if (c[i]) { c[i].qty = e.target.value; mem = c; try { w.localStorage.setItem(KEY, JSON.stringify(c)); } catch (er) { } }
    });
    if (sel) sel.addEventListener('change', function () {
      var o = sel.options[sel.selectedIndex]; if (!o || !o.value) return;
      var c = getCart();
      if (!c.some(function (x) { return x.id === o.value; })) c.push({ id: o.value, name: o.getAttribute('data-name'), spec: o.getAttribute('data-spec'), qty: '' });
      sel.selectedIndex = 0; setCart(c);
    });
    var consent = $('#consent'), cwrap = consent.closest('.consent');
    consent.addEventListener('change', function () { cwrap.classList.remove('bad'); $('#consentErr').hidden = true; });
    $$('.f input,.f select', form).forEach(function (el) { el.addEventListener('input', function () { el.closest('.f').classList.remove('bad'); }); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = null;
      $$('[data-req]', form).forEach(function (el) {
        var v = el.value.trim(), ok = !!v;
        if (ok && el.type === 'email') ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        el.closest('.f').classList.toggle('bad', !ok);
        el.setAttribute('aria-invalid', ok ? 'false' : 'true');
        if (!ok && !bad) bad = el;
      });
      if (!consent.checked) { cwrap.classList.add('bad'); $('#consentErr').hidden = false; if (!bad) bad = consent; }
      if (bad) { bad.focus(); return; }
      var c = getCart();
      var items = c.length ? c.map(function (x) { return x.name + (x.qty ? ' (' + x.qty + ' tấn)' : ''); }).join('; ') : 'Chưa chọn, cần tư vấn thêm';
      $('#doneList').innerHTML = '<li><b>Doanh nghiệp:</b> ' + esc($('#fCompany').value) + '</li><li><b>Sản phẩm:</b> ' + esc(items) + '</li><li><b>Điều kiện giao hàng:</b> ' + esc($('#fInco').value) + ', cảng đến ' + esc($('#fPort').value) + '</li><li><b>Thời gian nhận hàng:</b> ' + esc($('#fTime').value) + '</li>';
      form.hidden = true; done.classList.add('show'); done.hidden = false;
      setCart([]);
      done.setAttribute('tabindex', '-1'); done.focus({ preventScroll: true });
      done.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'center' });
    });
    $('#rfqAgain').addEventListener('click', function () {
      form.reset(); form.hidden = false; done.classList.remove('show'); done.hidden = true; $('#fCompany').focus();
    });
    $$('.place[data-pin]').forEach(function (b) {
      var on = function () {
        $$('.place[data-pin]').forEach(function (x) { x.classList.toggle('on', x === b); });
        $$('.lmap .pin').forEach(function (p) { p.classList.toggle('on', p.getAttribute('data-pin') === b.getAttribute('data-pin')); });
      };
      b.addEventListener('click', on); b.addEventListener('mouseenter', on); b.addEventListener('focus', on);
    });
  }

  paintCart();
})();
