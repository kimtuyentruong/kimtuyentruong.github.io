/* VietQR for template orders (Tuyền 16/11/2026: pay 100% right after the order form, QR always on screen).
   Builds the EMVCo/NAPAS payload in the browser (same account data as Tuyền's Techcombank QR, decoded and CRC-checked),
   adds the amount (tag 54) and the transfer note (tag 62/08), and draws it with qrcode-generator from cdnjs.
   Used by /lien-he/ (after a template order is sent) and /thanh-toan/ (link in the customer's email). */
(function () {
  var BANK = { bin: '970407', acc: '19032272332029', name: 'TRUONG BIEN KIM TUYEN', bank: 'Techcombank' };
  var LIB = 'https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js';
  function f(id, v) { v = String(v); return id + (v.length < 10 ? '0' : '') + v.length + v; }
  function crc(s) {
    var c = 0xFFFF;
    for (var i = 0; i < s.length; i++) {
      c ^= s.charCodeAt(i) << 8;
      for (var k = 0; k < 8; k++) c = c & 0x8000 ? ((c << 1) ^ 0x1021) & 0xFFFF : (c << 1) & 0xFFFF;
    }
    return ('000' + c.toString(16).toUpperCase()).slice(-4);
  }
  // transfer note: plain ASCII, no accents, max 25 characters (what every bank app accepts)
  function note(s) {
    return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D')
      .replace(/[^A-Za-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim().toUpperCase().slice(0, 25);
  }
  function payload(amount, memo) {
    var s = f('00', '01') + f('01', amount ? '12' : '11') +
      f('38', f('00', 'A000000727') + f('01', f('00', BANK.bin) + f('01', BANK.acc)) + f('02', 'QRIBFTTA')) +
      f('53', '704') + (amount ? f('54', String(Math.round(amount))) : '') + f('58', 'VN') +
      (memo ? f('62', f('08', memo)) : '') + '6304';
    return s + crc(s);
  }
  function vnd(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ'; }
  var loading;
  function lib(cb) {
    if (window.qrcode) return cb();
    if (!loading) {
      loading = [];
      var s = document.createElement('script'); s.src = LIB; s.async = true;
      s.onload = function () { loading.forEach(function (f) { f(); }); };
      s.onerror = function () { loading.forEach(function (f) { f(true); }); };
      document.head.appendChild(s);
    }
    loading.push(cb);
  }
  function copyBtn(text) {
    return '<button type="button" class="cp" data-cp="' + text.replace(/"/g, '') + '">Sao chép</button>';
  }
  // box: element to fill; amount: VND number; memo: transfer note (raw, cleaned here)
  window.ktPay = function (box, amount, memo) {
    memo = note(memo);
    box.innerHTML = '<div class="kp-qr" aria-label="Mã VietQR chuyển khoản ' + vnd(amount) + '"><span class="kp-wait">Đang tạo mã QR…</span></div>' +
      '<dl class="kp-info">' +
      '<div><dt>Số tiền</dt><dd><b>' + vnd(amount) + '</b>' + copyBtn(String(Math.round(amount))) + '</dd></div>' +
      '<div><dt>Nội dung</dt><dd><b>' + memo + '</b>' + copyBtn(memo) + '</dd></div>' +
      '<div><dt>Ngân hàng</dt><dd>' + BANK.bank + '</dd></div>' +
      '<div><dt>Số tài khoản</dt><dd><b>' + BANK.acc + '</b>' + copyBtn(BANK.acc) + '</dd></div>' +
      '<div><dt>Chủ tài khoản</dt><dd>' + BANK.name + '</dd></div></dl>';
    box.addEventListener('click', function (e) {
      var b = e.target.closest('.cp'); if (!b) return;
      var t = b.getAttribute('data-cp'), ok = function () { b.textContent = 'Đã chép'; setTimeout(function () { b.textContent = 'Sao chép'; }, 1600); };
      if (navigator.clipboard) navigator.clipboard.writeText(t).then(ok, ok); else ok();
    });
    lib(function (err) {
      var q = box.querySelector('.kp-qr');
      if (err || !window.qrcode) { q.innerHTML = '<span class="kp-wait">Chưa tải được mã QR. Anh/chị chuyển khoản theo thông tin bên dưới giúp tôi.</span>'; return; }
      var qr = window.qrcode(0, 'M'); qr.addData(payload(amount, memo)); qr.make();
      q.innerHTML = qr.createSvgTag({ cellSize: 6, margin: 3, scalable: true }) +
        '<span class="kp-logo">VietQR · quét bằng app ngân hàng bất kỳ</span>';
    });
  };
  window.ktPay.note = note;
})();
