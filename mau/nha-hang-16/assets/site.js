/* Lá Nghệ — JS dùng chung cho mọi trang (mẫu giao diện, không gửi dữ liệu đi đâu) */
(function(){
'use strict';
var DATA={"dishes":[{"id":"goi-rau-mam","n":"Gỏi Rau Mầm Bơ Sáp","c":"kv","p":128000,"d":"Rau mầm, bơ sáp Đắk Lắk, cà chua bi, sốt mè rang chua dịu.","v":1,"s":0,"a":["dauanh"],"img":"1512621776951-a57141f2eefd","del":1},{"id":"bo-tai-chanh","n":"Bò Tái Chanh Rau Thơm","c":"kv","p":188000,"d":"Thăn bò tái chanh, hành tím, rau răm, đậu phộng rang giã dối.","v":0,"s":1,"a":["dauphong"],"img":"1504674900247-0877df9cc836","del":1},{"id":"banh-xeo","n":"Bánh Xèo Tôm Thịt","c":"kv","p":158000,"d":"Vỏ bánh bột gạo nghệ đổ mỏng, giòn rìa; cuốn cải xanh, chấm mắm chua ngọt.","v":0,"s":0,"a":["haisan"],"img":"1583579366799-7106fb626a54","del":1},{"id":"banh-quai-vac","n":"Bánh Quai Vạc Hấp","c":"kv","p":118000,"d":"Nhân tôm thịt băm tay, vỏ bột mỏng, ăn kèm hành phi và mắm tỏi ớt.","v":0,"s":0,"a":["haisan","gluten"],"img":"1496116218417-1a781b1c416c","del":1},{"id":"nom-ngu-sac","n":"Nộm Rau Củ Ngũ Sắc","c":"kv","p":108000,"d":"Su hào, cà rốt, bắp cải tím, xoài xanh trộn chua cay, rắc lạc rang.","v":1,"s":1,"a":["dauphong"],"img":"1540189549336-e6e99c3679fe","del":1},{"id":"tom-su-ap-chao-nghe-tuoi","n":"Tôm Sú Áp Chảo Nghệ Tươi","c":"mc","p":268000,"d":"Tôm sú Cà Mau áp chảo gang với nghệ tươi giã, tỏi và lá quế. Món đặc trưng của nhà.","v":0,"s":1,"a":["haisan"],"img":"1625943553852-781c6dd46faa","del":1},{"id":"ca-nuong-nghe","n":"Cá Nướng Nghệ Thì Là","c":"mc","p":248000,"d":"Phi lê cá ướp nghệ, riềng, mẻ; nướng than, ăn với thì là và bún lá.","v":0,"s":0,"a":["haisan"],"img":"1611599537845-1c7aca0091c0","del":1},{"id":"thit-kho-to","n":"Thịt Kho Tộ Nước Dừa","c":"mc","p":178000,"d":"Ba rọi kho liu riu ba giờ với nước dừa xiêm, tiêu sọ; lên màu cánh gián.","v":0,"s":0,"a":[],"img":"1628997323766-c846909a7049","del":1},{"id":"suon-nuong-mat-ong","n":"Sườn Nướng Mật Ong Sả","c":"mc","p":228000,"d":"Sườn cốt lết ướp sả, mật ong rừng, nướng than hoa; kèm cà tím nướng mỡ hành.","v":0,"s":1,"a":[],"img":"1432139555190-58524dae6a55","del":1},{"id":"ca-ri-ga","n":"Cà Ri Gà Lá Chanh","c":"mc","p":198000,"d":"Gà ta nấu nước cốt dừa, sả, lá chanh; cay ấm, chấm bánh mì hoặc ăn với cơm.","v":0,"s":2,"a":[],"img":"1455619452474-d2be8b1e70cd","del":1},{"id":"tom-hap-nuoc-dua","n":"Tôm Sú Hấp Nước Dừa","c":"mc","p":258000,"d":"Tôm sú hấp nước dừa tươi và sả, chấm muối tiêu chanh.","v":0,"s":0,"a":["haisan"],"img":"1559737558-2f5a35f4523b","del":0},{"id":"canh-chua-tom","n":"Canh Chua Tôm Bạc Hà","c":"mc","p":168000,"d":"Me chín, thơm, bạc hà, đậu bắp; nêm rau om, ngò gai đúng kiểu miền Tây.","v":0,"s":1,"a":["haisan"],"img":"1559847844-5315695dadae","del":1},{"id":"com-rang-nghe","n":"Cơm Rang Nghệ Rau Thơm","c":"cb","p":138000,"d":"Gạo ST25 rang nghệ tươi, trứng, hành lá, rau thơm thái nhỏ; vắt chanh khi ăn.","v":0,"s":0,"a":["trung"],"img":"1512058564366-18510be2db19","del":1},{"id":"pho-bo","n":"Phở Bò Tái Lăn","c":"cb","p":128000,"d":"Nước dùng xương ống ninh mười hai giờ, bò tái lăn tỏi gừng, hành chần.","v":0,"s":0,"a":[],"img":"1582878826629-29b7ad1cdc43","del":1},{"id":"bun-cha","n":"Bún Chả Than Hoa","c":"cb","p":138000,"d":"Chả miếng, chả viên nướng than hoa, nước chấm đu đủ xanh, rau sống đủ loại.","v":0,"s":0,"a":[],"img":"1583316175701-0bc5f25a0a44","del":1},{"id":"bun-bo-hue","n":"Bún Bò Huế","c":"cb","p":138000,"d":"Bắp bò, giò heo, chả cua; nước dùng sả và mắm ruốc, sa tế để riêng.","v":0,"s":2,"a":["haisan"],"img":"1597345637412-9fd611e758f3","del":1},{"id":"bun-rieu","n":"Bún Riêu Cua Đậu Rán","c":"cb","p":128000,"d":"Riêu cua đồng, cà chua, đậu rán giòn, mắm tôm tuỳ chọn.","v":0,"s":1,"a":["haisan","dauanh"],"img":"1555126634-323283e090fa","del":1},{"id":"bun-ga-tron","n":"Bún Gà Trộn Rau Thơm","c":"cb","p":128000,"d":"Gà xé, bún tươi, rau thơm, đồ chua, nước trộn tỏi ớt và đậu phộng.","v":0,"s":1,"a":["dauphong"],"img":"1503764654157-72d979d9af2f","del":1},{"id":"hu-tieu-xao-tom","n":"Hủ Tiếu Xào Tôm","c":"cb","p":148000,"d":"Sợi hủ tiếu dai xào lửa lớn với tôm, giá, hẹ, trứng và đậu phộng.","v":0,"s":1,"a":["haisan","dauphong","trung"],"img":"1559314809-0d155014e29e","del":1},{"id":"mi-xao-nam","n":"Mì Xào Nấm Chay","c":"cb","p":128000,"d":"Mì trứng chay xào nấm đông cô, cải ngọt, nước tương ủ.","v":1,"s":0,"a":["gluten","dauanh"],"img":"1585032226651-759b368d7246","del":1},{"id":"com-st25","n":"Cơm Gạo ST25","c":"cb","p":25000,"d":"Gạo ST25 Sóc Trăng nấu niêu, dẻo thơm. Phần một người.","v":1,"s":0,"a":[],"img":"1536304993881-ff6e9eefa2a6","del":1},{"id":"kem-sua-dua","n":"Kem Sữa Dừa Dâu Tươi","c":"tm","p":78000,"d":"Kem sữa nấu nước cốt dừa, dâu Đà Lạt ngâm đường phèn.","v":1,"s":0,"a":["sua"],"img":"1488477181946-6428a0291777","del":1},{"id":"banh-lanh-dau-rung","n":"Bánh Lạnh Sữa Chua Dâu Rừng","c":"tm","p":88000,"d":"Cốt bánh mềm, kem sữa chua, mứt dâu rừng nấu tại bếp.","v":1,"s":0,"a":["sua","trung","gluten"],"img":"1565958011703-44f9829ba187","del":0},{"id":"tra-sen","n":"Trà Sen Ấm","c":"du","p":68000,"d":"Trà xanh ướp hương sen, pha ấm cho hai người.","v":1,"s":0,"a":[],"img":"1597318181409-cf64d0b5d8a2","del":0},{"id":"tra-chanh-sa","n":"Trà Chanh Sả Bạc Hà","c":"du","p":58000,"d":"Trà xanh, chanh tươi, sả đập dập, bạc hà. Ít ngọt.","v":1,"s":0,"a":[],"img":"1621263764928-df1444c5e859","del":1},{"id":"tra-tac","n":"Trà Tắc Mật Ong","c":"du","p":58000,"d":"Trà đen ủ lạnh, tắc tươi, mật ong hoa nhãn.","v":1,"s":0,"a":[],"img":"1556679343-c7306c1976bc","del":1},{"id":"ca-phe-phin","n":"Cà Phê Phin Sữa Đá","c":"du","p":55000,"d":"Robusta Buôn Ma Thuột rang mộc, pha phin, sữa đặc.","v":1,"s":0,"a":["sua"],"img":"1566813774208-5c5cba23205a","del":0},{"id":"vang-do","n":"Vang Đỏ Theo Ly","c":"du","p":145000,"d":"Vang đỏ chọn theo tháng, hợp món nướng và món kho. Chỉ phục vụ tại bàn.","v":1,"s":0,"a":[],"img":"1553361371-9b22f78e8b1d","del":0}],"cats":{"kv":"Khai vị","mc":"Món chính","cb":"Cơm, bún, phở","tm":"Tráng miệng","du":"Đồ uống"},"alg":{"haisan":"Tôm, cua, cá","dauphong":"Đậu phộng","gluten":"Gluten","sua":"Sữa","trung":"Trứng","dauanh":"Đậu nành"},"sig":"tom-su-ap-chao-nghe-tuoi","branches":[{"id":"ben-thanh","n":"Lá Nghệ Bến Thành","city":"TP.HCM","ck":"hcm","addr":"Phường Bến Thành, TP.HCM","tel":"0900 000 001","h":[["10:30","22:00"],["10:30","22:00"],["10:30","22:00"],["10:30","22:00"],["10:30","22:00"],["10:30","22:30"],["10:30","22:30"]],"ft":["phongrieng","oto","treem"],"img":"1555396273-367ea4eb4db5","seats":120},{"id":"tan-dinh","n":"Lá Nghệ Tân Định","city":"TP.HCM","ck":"hcm","addr":"Phường Tân Định, TP.HCM","tel":"0900 000 002","h":[["10:30","22:00"],["10:30","22:00"],["10:30","22:00"],["10:30","22:00"],["10:30","22:00"],["10:30","22:00"],["10:30","22:00"]],"ft":["sanvuon","treem","thucung"],"img":"1537047902294-62a40c20a6ae","seats":90},{"id":"hoan-kiem","n":"Lá Nghệ Hoàn Kiếm","city":"Hà Nội","ck":"hn","addr":"Phường Hoàn Kiếm, Hà Nội","tel":"0900 000 003","h":[["10:00","22:00"],["10:00","22:00"],["10:00","22:00"],["10:00","22:00"],["10:00","22:00"],["10:00","22:00"],["10:00","22:00"]],"ft":["phongrieng","treem"],"img":"1550966871-3ed3cdb5ed0c","seats":110},{"id":"tay-ho","n":"Lá Nghệ Tây Hồ","city":"Hà Nội","ck":"hn","addr":"Phường Tây Hồ, Hà Nội","tel":"0900 000 004","h":[["09:00","22:30"],["10:00","22:00"],["10:00","22:00"],["10:00","22:00"],["10:00","22:00"],["10:00","22:00"],["09:00","22:30"]],"ft":["sanvuon","phongrieng","oto","treem","thucung"],"img":"1755568599643-a91d9490b059","seats":140}],"posts":[{"t":"Thực đơn mùa thu: cốm, sấu và cá nướng nghệ","cat":"Thực đơn mới","date":"20/10/2026","url":"tin-tuc/thuc-don-mua-thu/","img":"1611599537845-1c7aca0091c0","x":"Sáu món mới theo mùa lên thực đơn từ 20/10 ở cả bốn chi nhánh, kèm chuyện bếp trưởng đi chợ sớm."},{"t":"Bữa trưa văn phòng: mâm hai người 289.000đ","cat":"Ưu đãi","date":"03/11/2026","url":"tin-tuc/#uu-dai","img":"1641440615059-42c8ed3af8c8","x":"Thứ hai đến thứ sáu, 11:00–14:00, mâm ba món một canh cho hai người."},{"t":"Miễn phí giao món cho đơn từ 500.000đ","cat":"Ưu đãi","date":"01/11/2026","url":"tin-tuc/#uu-dai","img":"1583316175701-0bc5f25a0a44","x":"Áp dụng mọi khu giao trong tháng 11, không cần nhập mã."},{"t":"Lớp nấu cuối tuần: cuốn, trộn và pha nước chấm","cat":"Sự kiện","date":"15/11/2026","url":"tin-tuc/#su-kien","img":"1551218808-94e220e084d2","x":"Sáng thứ bảy tại Lá Nghệ Tây Hồ, 12 chỗ mỗi lớp, có bữa trưa sau buổi học."},{"t":"Mở đặt quà Tết doanh nghiệp 2027","cat":"Quà tặng","date":"10/11/2026","url":"tiec-su-kien/#qua-tang","img":"1607344645866-009c320b63e0","x":"Ba mẫu hộp quà, in logo từ 50 hộp, giao tận văn phòng ở TP.HCM và Hà Nội."},{"t":"Vì sao bếp nhà mình giã nghệ tươi mỗi sáng","cat":"Chuyện bếp","date":"28/10/2026","url":"cau-chuyen/#nguon","img":"1563822249548-9a72b6353cd1","x":"Nghệ bột tiện hơn, nhưng mùi và màu của củ nghệ tươi thì khó thay."}],"pages":[{"t":"Trang chủ","url":"","x":"Lá Nghệ: nhóm nhà hàng món Việt đương đại với 4 chi nhánh tại TP.HCM và Hà Nội. Đặt bàn, phòng tiệc riêng, giao món tận nơi, quà tặng doanh nghiệp."},{"t":"Thực đơn","url":"thuc-don/","x":"Xem thực đơn Lá Nghệ: khai vị, món chính, cơm bún phở, tráng miệng, đồ uống. Lọc món chay, độ cay, thành phần dễ dị ứng và tìm món theo tên."},{"t":"Món đặc trưng","url":"thuc-don/tom-su-ap-chao-nghe-tuoi/","x":"Câu chuyện món Tôm Sú Áp Chảo Nghệ Tươi của Lá Nghệ: nguyên liệu, cách bếp làm, thành phần dễ dị ứng và các món, đồ uống gợi ý ăn kèm."},{"t":"Đặt bàn","url":"dat-ban/","x":"Đặt bàn Lá Nghệ trong năm bước: chọn chi nhánh, ngày giờ, khu ngồi, điền thông tin và nhận mã xác nhận. Giữ bàn 15 phút, đổi giờ miễn phí."},{"t":"Chi nhánh","url":"chi-nhanh/","x":"Bốn chi nhánh Lá Nghệ ở Bến Thành, Tân Định (TP.HCM), Hoàn Kiếm và Tây Hồ (Hà Nội): giờ mở cửa theo giờ Việt Nam, tiện ích, bản đồ, đặt bàn."},{"t":"Tiệc & sự kiện","url":"tiec-su-kien/","x":"Tổ chức tiệc công ty, sinh nhật, họp mặt tại Lá Nghệ: tự tính chi phí theo số khách, chọn thực đơn tiệc, phòng riêng 12–80 khách, quà tặng doanh nghiệp."},{"t":"Giao món","url":"giao-mon/","x":"Đặt món Lá Nghệ giao tận nơi: chọn món, xem phí giao theo khu, miễn phí giao cho đơn từ 500.000đ, hẹn giờ nhận và theo dõi giỏ hàng ở mọi trang."},{"t":"Câu chuyện & bếp trưởng","url":"cau-chuyen/","x":"Từ một quán cơm 24 chỗ năm 2014 đến bốn nhà hàng ở hai thành phố: câu chuyện Lá Nghệ, bếp trưởng Trần Quang Vinh và nguồn nguyên liệu của bếp."},{"t":"Tin tức & ưu đãi","url":"tin-tuc/","x":"Ưu đãi đang chạy, thực đơn theo mùa, lớp nấu ăn và chuyện bếp của Lá Nghệ. Lọc theo chủ đề, sao chép mã ưu đãi để dùng khi đặt giao món."},{"t":"Bài: Thực đơn mùa thu","url":"tin-tuc/thuc-don-mua-thu/","x":"Sáu món mới theo mùa lên thực đơn Lá Nghệ từ 20/10/2026: cốm làng Vòng, sấu chín, cá nướng nghệ thì là, kèm chuyện bếp trưởng đi chợ sớm."},{"t":"Liên hệ & tuyển dụng","url":"lien-he/","x":"Liên hệ Lá Nghệ về đặt bàn, tiệc, quà tặng doanh nghiệp, góp ý; xem vị trí đang tuyển tại TP.HCM và Hà Nội và gửi thông tin ứng tuyển."}]};
var D=document,W=window,H=D.documentElement,B=D.body,ROOT=H.getAttribute('data-root')||'./',KEY='nha-hang-16:',PAGE=B.getAttribute('data-page');
var $=function(s,c){return (c||D).querySelector(s)},$$=function(s,c){return [].slice.call((c||D).querySelectorAll(s))};
var RM=W.matchMedia&&W.matchMedia('(prefers-reduced-motion: reduce)').matches,STATIC=/\bstatic\b/.test(H.className);
var store={get:function(k,d){try{var v=localStorage.getItem(KEY+k);return v==null?d:JSON.parse(v)}catch(e){return d}},set:function(k,v){try{localStorage.setItem(KEY+k,JSON.stringify(v))}catch(e){}},del:function(k){try{localStorage.removeItem(KEY+k)}catch(e){}}};
function ic(n,c){return '<svg class="ic'+(c?' '+c:'')+'" aria-hidden="true"><use href="#i-'+n+'"/></svg>'}
function fmt(n){return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,'.')+'đ'}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function norm(s){return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/đ/g,'d')}
function img(id,w,h){return 'https://images.unsplash.com/photo-'+id+'?auto=format&fit=crop&w='+w+(h?'&h='+h:'')+'&q=75'}
function pad(n){return (n<10?'0':'')+n}
function dish(id){for(var i=0;i<DATA.dishes.length;i++)if(DATA.dishes[i].id===id)return DATA.dishes[i];return null}
function branch(id){for(var i=0;i<DATA.branches.length;i++)if(DATA.branches[i].id===id)return DATA.branches[i];return null}
function dishUrl(d){return ROOT+'thuc-don/'+(d.id===DATA.sig?d.id+'/':'?mon='+d.id+'#mon-'+d.id)}
function code(prefix){var n=vnNow();return prefix+'-'+String(n.y).slice(2)+pad(n.mo)+pad(n.day)+'-'+(1000+Math.floor(Math.random()*9000))}
function animNum(el,to,f){f=f||fmt;var from=+el.getAttribute('data-v')||0;el.setAttribute('data-v',to);if(RM||STATIC||from===to){el.textContent=f(to);return}
  var t0=null,dur=450;function step(t){if(!t0)t0=t;var k=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-k,3);el.textContent=f(from+(to-from)*e);if(k<1&&+el.getAttribute('data-v')===to)requestAnimationFrame(step);else el.textContent=f(+el.getAttribute('data-v'))}requestAnimationFrame(step)}
var toastEl,toastT;
function toast(msg,icon){if(!toastEl){toastEl=D.createElement('div');toastEl.className='toast';toastEl.setAttribute('role','status');toastEl.setAttribute('aria-live','polite');B.appendChild(toastEl)}
  toastEl.innerHTML=ic(icon||'check')+'<span>'+msg+'</span>';toastEl.classList.add('on');clearTimeout(toastT);toastT=setTimeout(function(){toastEl.classList.remove('on')},2600)}

/* giờ Việt Nam + trạng thái mở cửa */
function vnNow(){try{var o={};new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Ho_Chi_Minh',weekday:'short',hour:'2-digit',minute:'2-digit',hour12:false,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date()).forEach(function(x){o[x.type]=x.value});
  return {d:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(o.weekday),h:(+o.hour)%24,m:+o.minute,y:+o.year,mo:+o.month,day:+o.day}}catch(e){var n=new Date();return {d:n.getDay(),h:n.getHours(),m:n.getMinutes(),y:n.getFullYear(),mo:n.getMonth()+1,day:n.getDate()}}}
function mins(t){var p=t.split(':');return +p[0]*60+ +p[1]}
function bStatus(b,now){now=now||vnNow();var hr=b.h[now.d],cur=now.h*60+now.m,o=mins(hr[0]),c=mins(hr[1]);
  if(cur<o)return {open:false,txt:'Chưa mở · mở lúc '+hr[0]};
  if(cur>=c)return {open:false,txt:'Đã đóng · mở lại '+b.h[(now.d+1)%7][0]+' ngày mai'};
  if(c-cur<=45)return {open:true,soon:true,txt:'Sắp đóng · '+hr[1]};
  return {open:true,txt:'Đang mở · đến '+hr[1]}}
function tickStatus(){var now=vnNow(),n=0;
  DATA.branches.forEach(function(b){var s=bStatus(b,now);if(s.open)n++;$$('[data-st="'+b.id+'"]').forEach(function(el){el.className='st '+(s.open?(s.soon?'soon':'on'):'off');el.innerHTML='<i></i>'+s.txt})});
  $$('[data-open-sum]').forEach(function(el){el.textContent=(n?'Đang mở '+n+'/4 chi nhánh':'Các chi nhánh đã đóng cửa')+' · '+pad(now.h)+':'+pad(now.m)+' giờ Việt Nam'});
  $$('[data-vn-clock]').forEach(function(el){el.textContent=pad(now.h)+':'+pad(now.m)});
  D.dispatchEvent(new CustomEvent('ln:tick',{detail:now}))}

/* lớp phủ: menu mobile, giỏ, tìm kiếm */
var hdr=$('#hdr'),badge=$('#ktBadge'),totop=$('#toTop'),burger=$('#burger'),mnav=$('#mnav'),layer=null,lastFocus=null,scrim,drawer,srch;
function onScroll(){var y=W.pageYOffset||H.scrollTop;hdr.classList.toggle('scrolled',y>8);if(badge)badge.classList.toggle('show',y>W.innerHeight*.85);if(totop)totop.classList.toggle('show',y>W.innerHeight*.9)}
function setLayer(name){
  if(layer==='menu'){mnav.classList.remove('open');mnav.setAttribute('aria-hidden','true');burger.setAttribute('aria-expanded','false');burger.setAttribute('aria-label','Mở trình đơn');burger.innerHTML=ic('menu')}
  if(layer==='cart'){drawer.classList.remove('open');scrim.classList.remove('on')}
  if(layer==='search'){srch.classList.remove('open')}
  var prev=layer;layer=name||null;B.classList.toggle('lock',!!layer);
  if(!layer){if(lastFocus&&prev){try{lastFocus.focus()}catch(e){}}return}
  lastFocus=D.activeElement;
  if(layer==='menu'){mnav.classList.add('open');mnav.setAttribute('aria-hidden','false');burger.setAttribute('aria-expanded','true');burger.setAttribute('aria-label','Đóng trình đơn');burger.innerHTML=ic('close')}
  if(layer==='cart'){buildDrawer();renderCart();drawer.classList.add('open');scrim.classList.add('on');setTimeout(function(){$('.drawer [data-close]').focus()},60)}
  if(layer==='search'){buildSearch();srch.classList.add('open');setTimeout(function(){$('#srchIn').focus()},60)}
}
if(burger)burger.addEventListener('click',function(){setLayer(layer==='menu'?null:'menu')});
D.addEventListener('keydown',function(e){if(e.key==='Escape'&&layer)setLayer(null);if(e.key==='/'&&!layer&&!/INPUT|TEXTAREA|SELECT/.test(D.activeElement.tagName)){e.preventDefault();setLayer('search')}});
W.addEventListener('scroll',onScroll,{passive:true});onScroll();
if(totop)totop.addEventListener('click',function(){W.scrollTo({top:0,behavior:RM?'auto':'smooth'})});
var lastW=W.innerWidth;W.addEventListener('resize',function(){if(W.innerWidth!==lastW){lastW=W.innerWidth;if(layer==='menu'&&lastW>1120)setLayer(null);D.dispatchEvent(new CustomEvent('ln:resize'))}});

/* giỏ hàng dùng chung mọi trang */
var cart=store.get('cart',{})||{};
function cartCount(){var n=0;for(var k in cart)if(dish(k))n+=cart[k];return n}
function cartTotal(){var t=0;for(var k in cart){var d=dish(k);if(d)t+=d.p*cart[k]}return t}
function cartItems(){var a=[];DATA.dishes.forEach(function(d){if(cart[d.id])a.push({d:d,q:cart[d.id]})});return a}
function saveCart(silent){store.set('cart',cart);syncCart();if(!silent)D.dispatchEvent(new CustomEvent('ln:cart'))}
function syncCart(){var n=cartCount();$$('[data-cart-count]').forEach(function(el){el.textContent=n;el.classList.toggle('on',n>0)});renderCart()}
function addToCart(id,q,quiet){var d=dish(id);if(!d||!d.del)return;cart[id]=Math.max(0,Math.min(30,(cart[id]||0)+(q||1)));if(!cart[id])delete cart[id];saveCart();
  $$('[data-cart-count]').forEach(function(el){el.classList.remove('bump');void el.offsetWidth;el.classList.add('bump')});if(!quiet&&q!==-1)toast('Đã thêm <b>'+esc(d.n)+'</b> vào giỏ')}
function buildDrawer(){if(drawer)return;scrim=D.createElement('div');scrim.className='scrim';scrim.setAttribute('data-close','');B.appendChild(scrim);
  drawer=D.createElement('aside');drawer.className='drawer';drawer.setAttribute('role','dialog');drawer.setAttribute('aria-modal','true');drawer.setAttribute('aria-label','Giỏ hàng giao món');
  drawer.innerHTML='<div class="drawer-h"><b>Giỏ giao món</b><button class="ibtn" type="button" data-close aria-label="Đóng giỏ hàng">'+ic('close')+'</button></div><div class="drawer-b" data-cart-list></div><div class="drawer-f" data-cart-foot></div>';B.appendChild(drawer)}
function renderCart(){var list=$('[data-cart-list]'),foot=$('[data-cart-foot]');if(!list)return;var items=cartItems();
  if(!items.length){list.innerHTML='<div class="empty">'+ic('bowl')+'<b>Giỏ đang trống</b><p>Chọn vài món ở trang Giao món, giỏ sẽ đi theo bạn qua mọi trang.</p><a class="btn btn-p" href="'+ROOT+'giao-mon/">Xem món giao tận nơi</a></div>';foot.hidden=true;return}
  foot.hidden=false;
  list.innerHTML=items.map(function(it){var d=it.d;return '<div class="ci"><img src="'+img(d.img,128,128)+'" alt="" width="64" height="64" loading="lazy"><div><b>'+esc(d.n)+'</b><small>'+fmt(d.p)+' × '+it.q+' = '+fmt(d.p*it.q)+'</small></div><div class="qty"><button type="button" data-step="-1" data-id="'+d.id+'" aria-label="Bớt một phần '+esc(d.n)+'">'+ic('minus')+'</button><span>'+it.q+'</span><button type="button" data-step="1" data-id="'+d.id+'" aria-label="Thêm một phần '+esc(d.n)+'">'+ic('plus')+'</button></div><button class="rm" type="button" data-rm="'+d.id+'">Bỏ món này</button></div>'}).join('');
  var t=cartTotal(),need=500000-t;
  foot.innerHTML='<div class="row"><span>Tạm tính ('+cartCount()+' phần)</span><b>'+fmt(t)+'</b></div><small>'+(need>0?'Thêm '+fmt(need)+' nữa để được miễn phí giao.':'Đơn này được miễn phí giao.')+' Phí giao tính theo khu ở bước sau.</small><a class="btn btn-p" href="'+ROOT+'giao-mon/#gio">Tới bước đặt giao'+ic('arrow','mv')+'</a>'}
W.addEventListener('storage',function(e){if(e.key===KEY+'cart'){cart=store.get('cart',{})||{};syncCart();D.dispatchEvent(new CustomEvent('ln:cart'))}if(e.key===KEY+'fav'){favs=store.get('fav',[])||[];syncFav()}});

/* món đã lưu */
var favs=store.get('fav',[])||[];
function syncFav(){$$('[data-fav]').forEach(function(b){var on=favs.indexOf(b.getAttribute('data-fav'))>-1;b.setAttribute('aria-pressed',on?'true':'false')});$$('[data-fav-count]').forEach(function(el){el.textContent=favs.length})}
function toggleFav(id){var i=favs.indexOf(id),d=dish(id);if(i>-1)favs.splice(i,1);else favs.push(id);store.set('fav',favs);syncFav();toast(i>-1?'Đã bỏ lưu <b>'+esc(d.n)+'</b>':'Đã lưu <b>'+esc(d.n)+'</b> vào món yêu thích','heart');D.dispatchEvent(new CustomEvent('ln:fav'))}

/* tìm kiếm trong site */
var IDX=null;
function buildIdx(){if(IDX)return;IDX=[];
  DATA.dishes.forEach(function(d){IDX.push({g:'Món ăn & đồ uống',t:d.n,x:d.d,k:norm(d.n+' '+d.d+' '+DATA.cats[d.c]+(d.v?' chay':'')+(d.s?' cay':'')),url:dishUrl(d),img:d.img,p:d.p})});
  DATA.branches.forEach(function(b){IDX.push({g:'Chi nhánh',t:b.n,x:b.addr+' · '+b.tel,k:norm(b.n+' '+b.addr+' '+b.city+' chi nhanh dia chi gio mo cua'),url:ROOT+'chi-nhanh/#'+b.id,img:b.img})});
  DATA.posts.forEach(function(p){IDX.push({g:'Tin tức & ưu đãi',t:p.t,x:p.cat+' · '+p.date,k:norm(p.t+' '+p.cat+' '+p.x),url:ROOT+p.url,img:p.img})});
  DATA.pages.forEach(function(p){IDX.push({g:'Trang',t:p.t,x:p.x,k:norm(p.t+' '+p.x),url:ROOT+p.url,icon:'arrow'})});
  [['Phòng riêng & phòng tiệc','Sức chứa 12–80 khách, tự tính chi phí theo số khách','tiec-su-kien/#phong','phong rieng phong tiec vip sinh nhat'],['Quà tặng doanh nghiệp','Hộp quà in logo từ 50 hộp','tiec-su-kien/#qua-tang','qua tang doanh nghiep tet hop qua'],['Phí giao món theo khu','Bảng phí và thời gian giao','giao-mon/#khu','phi giao hang ship khu vuc'],['Tuyển dụng','Vị trí đang tuyển ở TP.HCM và Hà Nội','lien-he/#tuyen-dung','tuyen dung viec lam phuc vu bep'],['Thành phần dễ dị ứng','Lọc món không chứa đậu phộng, hải sản, gluten, sữa, trứng','thuc-don/#loc','di ung dau phong gluten sua trung hai san']].forEach(function(a){IDX.push({g:'Trang',t:a[0],x:a[1],k:norm(a[0]+' '+a[1]+' '+a[3]),url:ROOT+a[2],icon:'arrow'})})}
function hi(t,q){if(!q)return esc(t);var n=norm(t),i=n.indexOf(q);if(i<0||n.length!==t.length)return esc(t);return esc(t.slice(0,i))+'<mark>'+esc(t.slice(i,i+q.length))+'</mark>'+esc(t.slice(i+q.length))}
function buildSearch(){if(srch)return;buildIdx();srch=D.createElement('div');srch.className='srch';srch.setAttribute('role','dialog');srch.setAttribute('aria-modal','true');srch.setAttribute('aria-label','Tìm trong trang web');
  srch.innerHTML='<div class="wrap"><div class="srch-top">'+ic('search')+'<input id="srchIn" type="search" autocomplete="off" placeholder="Tìm món, chi nhánh, ưu đãi…" aria-label="Từ khoá tìm kiếm"><button class="ibtn" type="button" data-close aria-label="Đóng tìm kiếm">'+ic('close')+'</button></div><div class="srch-hint"><span>Gợi ý:</span>'+['phở','món chay','tôm','phòng riêng','Tây Hồ','ưu đãi'].map(function(s){return '<button class="chip" type="button" data-sq="'+s+'">'+s+'</button>'}).join('')+'</div><div class="srch-res" id="srchRes" aria-live="polite"></div></div>';B.appendChild(srch);
  var inp=$('#srchIn'),res=$('#srchRes'),act=-1;
  function run(){var q=norm(inp.value.trim());act=-1;if(!q){res.innerHTML='<h4>Hay được tìm</h4>'+[dish(DATA.sig),dish('pho-bo'),dish('bun-cha')].map(function(d){return item({t:d.n,x:d.d,url:dishUrl(d),img:d.img,p:d.p},'')}).join('');return}
    var words=q.split(/\s+/),hits=IDX.filter(function(it){return words.every(function(w){return it.k.indexOf(w)>-1})});
    if(!hits.length){res.innerHTML='<div class="empty">'+ic('search')+'<b>Chưa thấy kết quả cho “'+esc(inp.value)+'”</b><p>Thử từ ngắn hơn như “bún”, “chay”, “tiệc”, hoặc gọi 0900&nbsp;000&nbsp;000.</p></div>';return}
    var groups={},order=[];hits.slice(0,24).forEach(function(it){if(!groups[it.g]){groups[it.g]=[];order.push(it.g)}groups[it.g].push(it)});
    res.innerHTML='<p class="sr" role="status">'+hits.length+' kết quả</p>'+order.map(function(g){return '<h4>'+g+' ('+groups[g].length+')</h4>'+groups[g].map(function(it){return item(it,words[0])}).join('')}).join('')}
  function item(it,q){return '<a class="sr-i" href="'+it.url+'">'+(it.img?'<img src="'+img(it.img,104,104)+'" alt="" width="52" height="52" loading="lazy">':'<span class="ph">'+ic(it.icon||'arrow')+'</span>')+'<span><b>'+hi(it.t,q)+'</b><small>'+esc(it.x)+'</small></span>'+(it.p?'<span class="price">'+fmt(it.p)+'</span>':'')+'</a>'}
  inp.addEventListener('input',run);
  inp.addEventListener('keydown',function(e){var its=$$('.sr-i',res);if(!its.length)return;if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();act=(act+(e.key==='ArrowDown'?1:-1)+its.length)%its.length;its.forEach(function(a,i){a.classList.toggle('act',i===act)});its[act].scrollIntoView({block:'nearest'})}if(e.key==='Enter'){e.preventDefault();(its[act<0?0:act]).click()}});
  srch.addEventListener('click',function(e){var b=e.target.closest('[data-sq]');if(b){inp.value=b.getAttribute('data-sq');run();inp.focus()}});run()}

/* sự kiện bấm dùng chung */
D.addEventListener('click',function(e){var t=e.target.closest('[data-add],[data-fav],[data-open],[data-close],[data-step],[data-rm],[data-copy]');if(!t)return;
  if(t.hasAttribute('data-add')){e.preventDefault();var q=+t.getAttribute('data-qty')||1;addToCart(t.getAttribute('data-add'),q);t.classList.add('ok');setTimeout(function(){t.classList.remove('ok')},900)}
  else if(t.hasAttribute('data-fav')){e.preventDefault();toggleFav(t.getAttribute('data-fav'))}
  else if(t.hasAttribute('data-open')){e.preventDefault();setLayer(t.getAttribute('data-open'))}
  else if(t.hasAttribute('data-close')){setLayer(null)}
  else if(t.hasAttribute('data-step')){addToCart(t.getAttribute('data-id'),+t.getAttribute('data-step'),true)}
  else if(t.hasAttribute('data-rm')){delete cart[t.getAttribute('data-rm')];saveCart()}
  else if(t.hasAttribute('data-copy')){var c=t.getAttribute('data-copy');store.set('promo',c);var done=function(){toast('Đã sao chép mã <b>'+esc(c)+'</b>. Mã sẽ tự điền ở trang Giao món.','copy')};if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(c).then(done,done);else done()}
});
/* đóng menu mobile khi bấm link trong đó */
if(mnav)mnav.addEventListener('click',function(e){if(e.target.closest('a'))setLayer(null)});

/* hiện dần */
function reveal(root){var els=$$('.rv,.rv-img',root||D);if(STATIC||RM||!('IntersectionObserver' in W)){els.forEach(function(el){el.classList.add('in')});return}
  var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}})},{rootMargin:'0px 0px -6% 0px',threshold:.06});els.forEach(function(el){io.observe(el)})}

/* kiểm tra form dùng chung */
function vField(f){var inp=$('input,select,textarea',f);if(!inp)return true;var v=inp.value.trim(),ok=true,msg='';
  if(inp.required&&!v){ok=false;msg=inp.getAttribute('data-req')||'Vui lòng điền mục này.'}
  else if(v&&inp.type==='tel'&&!/^(0|\+84)\d{9,10}$/.test(v.replace(/[\s.\-]/g,''))){ok=false;msg='Số điện thoại gồm 10 số, ví dụ 0900 000 000.'}
  else if(v&&inp.type==='email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)){ok=false;msg='Email chưa đúng dạng ten@vidu.com.'}
  else if(v&&inp.minLength>0&&v.length<inp.minLength){ok=false;msg='Cần từ '+inp.minLength+' ký tự trở lên.'}
  f.classList.toggle('bad',!ok);var er=$('.err',f);if(!er){er=D.createElement('span');er.className='err';er.id=(inp.id||inp.name)+'-err';f.appendChild(er);inp.setAttribute('aria-describedby',er.id)}er.textContent=msg;inp.setAttribute('aria-invalid',ok?'false':'true');return ok}
function vForm(form,scope){var ok=true,first=null;$$('.f',scope||form).forEach(function(f){if(f.offsetParent===null)return;if(!vField(f)){ok=false;first=first||$('input,select,textarea',f)}});
  $$('.consent',scope||form).forEach(function(c){var cb=$('input',c);if(c.offsetParent===null)return;var good=cb.checked;c.classList.toggle('bad',!good);if(!good){ok=false;first=first||cb}});
  if(first)first.focus();return ok}
D.addEventListener('focusout',function(e){var f=e.target.closest&&e.target.closest('.f');if(f&&f.classList.contains('bad'))vField(f)});
D.addEventListener('change',function(e){var c=e.target.closest&&e.target.closest('.consent');if(c&&e.target.checked)c.classList.remove('bad')});

var LN={$:$,$$:$$,store:store,fmt:fmt,esc:esc,norm:norm,ic:ic,img:img,pad:pad,dish:dish,branch:branch,toast:toast,vnNow:vnNow,bStatus:bStatus,mins:mins,animNum:animNum,vForm:vForm,vField:vField,code:code,addToCart:addToCart,cartItems:cartItems,cartTotal:cartTotal,cartCount:cartCount,clearCart:function(){cart={};saveCart()},favs:function(){return favs},reveal:reveal,dishUrl:dishUrl,ROOT:ROOT,DATA:DATA,RM:RM,STATIC:STATIC};
var PAGES={};

/* ===== Trang chủ ===== */
PAGES.home=function(){
  var stamp=$('.hero-stamp');if(stamp&&!RM&&!STATIC&&'IntersectionObserver' in W){new IntersectionObserver(function(en){stamp.classList.toggle('spin',en[0].isIntersecting)}).observe(stamp)}
  var SETS={doi:{t:'Mâm cho hai người',n:2,i:[['banh-xeo',1],['tom-su-ap-chao-nghe-tuoi',1],['canh-chua-tom',1],['com-st25',2]]},
    nha:{t:'Mâm cả nhà 4–5 người',n:5,i:[['goi-rau-mam',1],['thit-kho-to',1],['ca-nuong-nghe',1],['canh-chua-tom',1],['com-rang-nghe',1],['com-st25',4]]},
    khach:{t:'Mâm tiếp khách 4 người',n:4,i:[['bo-tai-chanh',1],['tom-su-ap-chao-nghe-tuoi',1],['suon-nuong-mat-ong',1],['ca-nuong-nghe',1],['com-st25',4],['tra-tac',4]]},
    chay:{t:'Mâm chay cho hai người',n:2,i:[['goi-rau-mam',1],['nom-ngu-sac',1],['mi-xao-nam',1],['com-st25',2],['kem-sua-dua',2]]},
    cay:{t:'Mâm cay cho hai người',n:2,i:[['bo-tai-chanh',1],['ca-ri-ga',1],['bun-bo-hue',1],['com-st25',2],['tra-chanh-sa',2]]}};
  var out=$('#moodOut'),cur='doi';
  function draw(k){cur=k;var s=SETS[k],tot=0;
    var li=s.i.map(function(x,i){var d=dish(x[0]);tot+=d.p*x[1];return '<li style="--i:'+i+'"><img src="'+img(d.img,120,120)+'" alt="" width="60" height="60"><div><b>'+esc(d.n)+'</b><small>'+x[1]+' phần'+(d.s?' · '+(d.s>1?'cay nhiều':'cay vừa'):'')+(d.v&&d.c!=='du'?' · chay':'')+'</small></div><span class="price">'+fmt(d.p*x[1])+'</span></li>'}).join('');
    out.innerHTML='<div class="mood-h"><b>'+s.t+'</b><small>'+s.i.length+' món</small></div><ul class="mood-l">'+li+'</ul><div class="mood-f"><div class="tot"><small>Tổng mâm · khoảng '+fmt(Math.round(tot/s.n/1000)*1000)+' mỗi người</small><b data-v="0">'+fmt(tot)+'</b></div><div class="acts"><button class="btn btn-g btn-s" type="button" id="moodAdd">'+ic('cart')+'Thêm cả mâm vào giỏ</button><a class="btn btn-p btn-s" href="'+ROOT+'dat-ban/">Đặt&nbsp;bàn</a></div></div>';
    animNum($('.tot b',out),tot)}
  $$('[data-mood]').forEach(function(b){b.addEventListener('click',function(){$$('[data-mood]').forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});draw(b.getAttribute('data-mood'))})});
  out.addEventListener('click',function(e){if(e.target.closest('#moodAdd')){SETS[cur].i.forEach(function(x){addToCart(x[0],x[1],true)});toast('Đã thêm <b>'+SETS[cur].t.toLowerCase()+'</b> vào giỏ giao món','cart')}});
  draw('doi');
  var qb=$('#quickBook');if(qb){var n=vnNow(),dt=$('#qbDate'),bk=store.get('booking',{})||{};var today=n.y+'-'+pad(n.mo)+'-'+pad(n.day);dt.min=today;dt.value=bk.date&&bk.date>=today?bk.date:today;if(bk.branch)$('#qbBranch').value=bk.branch;
    qb.addEventListener('submit',function(e){e.preventDefault();bk.branch=$('#qbBranch').value;bk.date=dt.value||today;bk.guests=+$('#qbGuests').value;bk.step=2;bk.time=null;store.set('booking',bk);location.href=ROOT+'dat-ban/'})}
};

/* ===== Thực đơn ===== */
PAGES.menu=function(){
  var cards=$$('#mlist .dish'),q=$('#mq'),stat=$('#mstat'),empty=$('#mempty'),reset=$('#mreset');
  var st=store.get('menuFilter',null)||{cat:'',f:[],no:[]};st.q='';
  var qs=new URLSearchParams(location.search);if(qs.get('q')){st={cat:'',f:[],no:[],q:qs.get('q')};q.value=st.q}
  function paint(){$$('[data-cat]').forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-cat')===st.cat?'true':'false')});
    $$('[data-f]').forEach(function(b){b.setAttribute('aria-pressed',st.f.indexOf(b.getAttribute('data-f'))>-1?'true':'false')});
    $$('[data-no]').forEach(function(b){b.setAttribute('aria-pressed',st.no.indexOf(b.getAttribute('data-no'))>-1?'true':'false')})}
  function apply(){var nq=norm(st.q||'').trim(),n=0,fv=LN.favs();
    cards.forEach(function(c){var d=dish(c.getAttribute('data-id')),ok=true;
      if(st.cat&&d.c!==st.cat)ok=false;
      if(ok&&st.f.indexOf('veg')>-1&&!d.v)ok=false;
      if(ok&&st.f.indexOf('mild')>-1&&d.s>0)ok=false;
      if(ok&&st.f.indexOf('hot')>-1&&d.s===0)ok=false;
      if(ok&&st.f.indexOf('fav')>-1&&fv.indexOf(d.id)<0)ok=false;
      if(ok)for(var i=0;i<st.no.length;i++)if(d.a.indexOf(st.no[i])>-1){ok=false;break}
      if(ok&&nq&&norm(d.n+' '+d.d).indexOf(nq)<0)ok=false;
      c.hidden=!ok;if(ok)n++});
    $$('.mgroup').forEach(function(g){var k=$$('.dish:not([hidden])',g).length;g.hidden=!k;$('[data-gcount]',g).textContent=k+' món'});
    var active=st.cat||st.f.length||st.no.length||nq;
    stat.innerHTML='Đang hiện <b>'+n+'</b> trên 28 món'+(st.no.length?' · đã bỏ món có '+st.no.map(function(a){return DATA.alg[a].toLowerCase()}).join(', '):'');
    empty.hidden=n>0;reset.hidden=!active;paint();store.set('menuFilter',{cat:st.cat,f:st.f,no:st.no})}
  function tog(arr,v){var i=arr.indexOf(v);if(i>-1)arr.splice(i,1);else arr.push(v)}
  $('#loc').addEventListener('click',function(e){var b=e.target.closest('.chip');if(!b)return;
    if(b.hasAttribute('data-cat'))st.cat=b.getAttribute('data-cat');
    else if(b.hasAttribute('data-f')){var v=b.getAttribute('data-f');tog(st.f,v);if(v==='mild'&&st.f.indexOf('mild')>-1&&st.f.indexOf('hot')>-1)tog(st.f,'hot');if(v==='hot'&&st.f.indexOf('hot')>-1&&st.f.indexOf('mild')>-1)tog(st.f,'mild')}
    else if(b.hasAttribute('data-no'))tog(st.no,b.getAttribute('data-no'));apply()});
  q.addEventListener('input',function(){st.q=q.value;apply()});
  function clear(){st={cat:'',f:[],no:[],q:''};q.value='';apply()}
  reset.addEventListener('click',clear);$('#mreset2').addEventListener('click',clear);
  D.addEventListener('ln:fav',function(){if(st.f.indexOf('fav')>-1)apply()});
  var mon=qs.get('mon');if(mon){st={cat:'',f:[],no:[],q:''}}
  apply();
  if(mon){var el=$('#mon-'+mon);if(el){el.classList.add('hl');setTimeout(function(){el.scrollIntoView({block:'center'})},200);setTimeout(function(){el.classList.remove('hl')},4000)}}
};

/* ===== Chi tiết món ===== */
PAGES.dish=function(){
  var id=DATA.sig,d=dish(id),n=1,out=$('#dq'),tot=$('#dTot');
  function setQ(v){n=Math.max(1,Math.min(10,v));out.textContent=n;animNum(tot,d.p*n)}
  tot.setAttribute('data-v',d.p);
  $('#dqMinus').addEventListener('click',function(){setQ(n-1)});$('#dqPlus').addEventListener('click',function(){setQ(n+1)});
  var sp=store.get('spice','Cay vừa');
  function paintSp(){$$('[data-spice]').forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-spice')===sp?'true':'false')})}
  $$('[data-spice]').forEach(function(b){b.addEventListener('click',function(){sp=b.getAttribute('data-spice');store.set('spice',sp);paintSp();toast('Đã ghi chú mức cay: <b>'+sp.toLowerCase()+'</b>','chili')})});paintSp();
  $('#dAdd').addEventListener('click',function(){LN.addToCart(id,n,true);toast('Đã thêm <b>'+n+' phần '+esc(d.n)+'</b> ('+sp.toLowerCase()+') vào giỏ','cart')});
  var main=$('#dhImg');$$('.dh-th button').forEach(function(b){b.addEventListener('click',function(){$$('.dh-th button').forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});main.style.opacity=.2;var im=new Image();im.onload=function(){main.src=im.src;main.alt=b.getAttribute('data-alt');main.style.opacity=1};im.src=b.getAttribute('data-src')})});
  var ING=[['1559737558-2f5a35f4523b','Tôm sú tươi xếp trên đĩa trắng','Tôm sú Cà Mau','Tôm nuôi quảng canh, về bếp trong ngày. Bếp để nguyên vỏ, chỉ rút chỉ lưng, để khi áp chảo vỏ se lại giữ nước ngọt bên trong.'],
    ['1563822249548-9a72b6353cd1','Các đĩa gia vị khô và thảo mộc','Nghệ tươi','Củ nghệ vàng giã với muối hột. Nước cốt để ướp, xác nghệ đem phi dầu cho lên màu và thơm, không dùng bột nghệ.'],
    ['1762920738955-38d51d7a7645','Giỏ mây đựng rau thơm vừa hái','Lá quế, rau thơm','Lá quế thả vào sau khi tắt bếp để giữ màu xanh và mùi. Rau răm, ngò gai thái nhỏ rắc lên lúc mang ra.'],
    ['1466637574441-749b8f19452f','Thớt gỗ bày rau củ, trứng và dao bếp','Tỏi, tiêu, muối hột','Tỏi cô đơn đập dập, tiêu sọ rang lại rồi mới xay. Muối hột giúp vỏ tôm se nhanh và giòn hơn muối tinh.'],
    ['1624668430039-0175a0fbf006','Thùng gỗ đầy rau củ tươi','Chanh và rau ăn kèm','Một lát chanh để bạn tự vắt, thêm dưa leo và rau sống theo mùa. Nếu thích cay, xin thêm ớt hiểm thái lát.']];
  var pan=$('#ingrP');$('#ingrL').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;$$('#ingrL button').forEach(function(x){x.setAttribute('aria-selected',x===b?'true':'false')});var k=ING[+b.getAttribute('data-k')];
    pan.innerHTML='<img src="'+img(k[0],900,700)+'" alt="'+k[1]+'" width="900" height="700"><div><b>'+k[2]+'</b><p>'+k[3]+'</p></div>'});
  var boxes=$$('#pairL input');
  function pair(){var t=0,c=0;boxes.forEach(function(b){if(b.checked){var x=dish(b.getAttribute('data-pid'));t+=x.p*(+b.getAttribute('data-q')||1);c++}});
    animNum($('#pairT'),t);$('#pairN').textContent='Bữa cho hai người · '+c+' lựa chọn';$('#pairP').textContent=c?'Khoảng '+fmt(Math.round(t/2000)*1000)+' mỗi người':'Chưa chọn món nào';$('#pairAdd').disabled=!c}
  boxes.forEach(function(b){b.addEventListener('change',pair)});
  $('#pairAdd').addEventListener('click',function(){var c=0;boxes.forEach(function(b){if(b.checked){LN.addToCart(b.getAttribute('data-pid'),+b.getAttribute('data-q')||1,true);c++}});toast('Đã thêm <b>'+c+' lựa chọn</b> vào giỏ giao món','cart')});
};

/* ===== Đặt bàn ===== */
PAGES.booking=function(){
  var form=$('#bk'),s=store.get('booking',{})||{},step=1,err=$('#bkErr'),DN=['CN','T2','T3','T4','T5','T6','T7'],DL=['Chủ nhật','Thứ hai','Thứ ba','Thứ tư','Thứ năm','Thứ sáu','Thứ bảy'];
  var qs=new URLSearchParams(location.search);if(qs.get('cn')&&branch(qs.get('cn'))){s.branch=qs.get('cn');s.time=null;s.area=null}
  s.guests=Math.max(1,Math.min(12,s.guests||2));
  var now=vnNow(),base=new Date(Date.UTC(now.y,now.mo-1,now.day)),days=[];
  for(var i=0;i<14;i++){var dt=new Date(base.getTime()+i*864e5);days.push({iso:dt.getUTCFullYear()+'-'+pad(dt.getUTCMonth()+1)+'-'+pad(dt.getUTCDate()),d:dt.getUTCDay(),day:dt.getUTCDate(),mo:dt.getUTCMonth()+1,y:dt.getUTCFullYear()})}
  function dayOf(iso){for(var i=0;i<days.length;i++)if(days[i].iso===iso)return days[i];return null}
  if(!dayOf(s.date)){s.date=days[0].iso;s.time=null}
  function vn(iso){var d=dayOf(iso);return DL[d.d]+', '+pad(d.day)+'/'+pad(d.mo)+'/'+d.y}
  function save(){s.step=step;store.set('booking',s)}
  function full(b,iso,t){var h=0,str=b+iso+t;for(var i=0;i<str.length;i++)h=(h*31+str.charCodeAt(i))%997;return h%6===0}
  function drawDays(){$('#bkDays').innerHTML=days.map(function(d,i){return '<button class="day" type="button" data-day="'+d.iso+'" aria-pressed="'+(d.iso===s.date)+'" aria-label="'+DL[d.d]+' '+pad(d.day)+'/'+pad(d.mo)+'"><small>'+(i===0?'Hôm nay':DN[d.d])+'</small><b>'+pad(d.day)+'</b><small>Th'+d.mo+'</small></button>'}).join('');$('#bkDayLb').textContent=vn(s.date)}
  function drawSlots(){var b=branch(s.branch)||DATA.branches[0],d=dayOf(s.date),hr=b.h[d.d],o=LN.mins(hr[0]),c=LN.mins(hr[1])-90,html='',cur=vnNow(),nowM=(d.iso===days[0].iso)?cur.h*60+cur.m+30:-1,any=false;
    for(var m=o+30;m<=c;m+=30){if(m>=14*60+30&&m<17*60)continue;var t=pad(Math.floor(m/60))+':'+pad(m%60),dis=m<nowM||full(b.id,d.iso,t);if(!dis)any=true;if(dis&&s.time===t)s.time=null;html+='<button class="slot" type="button" data-t="'+t+'" aria-pressed="'+(s.time===t)+'"'+(dis?' disabled aria-label="'+t+' đã kín hoặc đã qua"':'')+'>'+t+'</button>'}
    $('#bkSlots').innerHTML=any?html:html+'<p class="demo-note" style="grid-column:1/-1">Hôm nay đã hết giờ nhận bàn ở chi nhánh này, mời bạn chọn ngày khác.</p>';
    $('#bkHoursLb').textContent=b.n.replace('Lá Nghệ ','')+' mở '+hr[0]+'–'+hr[1]+' · bếp nghỉ 14:30–17:00'}
  function drawAreas(){var b=branch(s.branch);$$('#bkAreas input').forEach(function(r){var need=r.getAttribute('data-need'),min=+r.getAttribute('data-min')||0,max=r.value==='Bên cửa sổ'?4:(r.value==='Sảnh chính'?8:99);var ok=(!need||(b&&b.ft.indexOf(need)>-1))&&s.guests>=min&&s.guests<=max;r.disabled=!ok;if(!ok&&s.area===r.value)s.area=null;r.checked=s.area===r.value})}
  function sum(){var b=branch(s.branch),v=[b?b.n.replace('Lá Nghệ ',''):null,s.date?vn(s.date):null,s.time,s.guests+' khách',s.area],k=['Chi nhánh','Ngày','Giờ','Số khách','Khu ngồi'];
    $('#bkSum').innerHTML=k.map(function(x,i){return '<dt>'+x+'</dt><dd'+(v[i]?'':' class="na"')+'>'+(v[i]||'Chưa chọn')+'</dd>'}).join('')}
  function review(){var b=branch(s.branch),rows=[['Chi nhánh',b.n+', '+b.addr],['Ngày giờ',vn(s.date)+' lúc '+s.time],['Số khách',s.guests+' khách'],['Khu ngồi',s.area],['Người đặt',esc(s.name)+' · '+esc(s.tel)],['Email',esc(s.email)||'Không có'],['Dịp',esc(s.occ)||'Bữa ăn thường'],['Ghi chú',esc(s.note)||'Không có']];
    $('#bkReview').innerHTML=rows.map(function(r){return '<div><dt>'+r[0]+'</dt><dd>'+r[1]+'</dd></div>'}).join('')}
  function valid(n){err.hidden=true;var m='';
    if(n===1&&!s.branch)m='Chọn một chi nhánh để tiếp tục.';
    if(n===2&&!s.time)m='Chọn một khung giờ còn trống.';
    if(n===3&&!s.area)m='Chọn khu ngồi bạn thích.';
    if(n===4){if(!LN.vForm(form,$('[data-step="4"]')))m='Còn mục chưa đúng, bạn xem lại các ô được tô đỏ.';else{s.name=$('#bkName').value.trim();s.tel=$('#bkTel').value.trim();s.email=$('#bkMail').value.trim();s.occ=$('#bkOcc').value;s.note=$('#bkNote').value.trim()}}
    if(m){err.textContent=m;err.hidden=false;return false}return true}
  function go(n,focus){step=n;$$('.bstep').forEach(function(f){f.hidden=+f.getAttribute('data-step')!==n});
    $$('#bkSteps li').forEach(function(li,i){var k=i+1,btn=$('button',li);li.className=k===n?'cur':(k<n?'done':'');btn.disabled=k>n;$('i',btn).innerHTML=k<n?ic('check'):k;if(k===n)btn.setAttribute('aria-current','step');else btn.removeAttribute('aria-current')});
    $('#bkBack').hidden=n===1;$('#bkNext').innerHTML=n===5?'Gửi đặt bàn'+ic('check'):'Tiếp tục'+ic('arrow','mv');err.hidden=true;
    if(n===2){drawDays();drawSlots();$('#gOut').textContent=s.guests}if(n===3)drawAreas();if(n===5)review();sum();save();
    if(focus){var lg=$('[data-step="'+n+'"] legend');lg.setAttribute('tabindex','-1');lg.focus({preventScroll:true});var y=form.getBoundingClientRect().top+W.pageYOffset-100;if(W.pageYOffset>y)W.scrollTo({top:y,behavior:LN.RM?'auto':'smooth'})}}
  $$('#bkBranches input').forEach(function(r){r.checked=r.value===s.branch;r.addEventListener('change',function(){s.branch=r.value;s.time=null;s.area=null;sum();save();err.hidden=true})});
  $('#gMinus').addEventListener('click',function(){s.guests=Math.max(1,s.guests-1);$('#gOut').textContent=s.guests;sum();save()});
  $('#gPlus').addEventListener('click',function(){if(s.guests>=12){err.innerHTML='Từ 13 khách, mời bạn đặt theo hình thức tiệc ở trang <a href="'+ROOT+'tiec-su-kien/">Tiệc &amp; sự kiện</a>.';err.hidden=false;return}s.guests++;$('#gOut').textContent=s.guests;sum();save()});
  $('#bkDays').addEventListener('click',function(e){var b=e.target.closest('.day');if(!b)return;s.date=b.getAttribute('data-day');s.time=null;drawDays();drawSlots();sum();save()});
  $('#bkSlots').addEventListener('click',function(e){var b=e.target.closest('.slot');if(!b||b.disabled)return;s.time=b.getAttribute('data-t');$$('.slot').forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});sum();save();err.hidden=true});
  $$('#bkAreas input').forEach(function(r){r.addEventListener('change',function(){s.area=r.value;sum();save();err.hidden=true})});
  ['Name','Tel','Mail','Note'].forEach(function(k){var el=$('#bk'+k),key={Name:'name',Tel:'tel',Mail:'email',Note:'note'}[k];if(s[key])el.value=s[key]});if(s.occ)$('#bkOcc').value=s.occ;
  $('#bkNext').addEventListener('click',function(){if(!valid(step))return;if(step<5){go(step+1,true);return}
    var b=branch(s.branch),c=LN.code('LN-'+b.id.split('-').map(function(x){return x[0]}).join('').toUpperCase());
    $$('.bstep').forEach(function(f){f.hidden=true});$('#bkNav').hidden=true;$('#bkSteps').hidden=true;var d=$('#bkDone');d.hidden=false;
    d.innerHTML='<div class="tick">'+ic('check')+'</div><p class="eyebrow c">Đã nhận đặt bàn</p><h2 class="h2" style="margin-top:12px">Hẹn gặp '+esc(s.name.split(' ').pop())+' tại '+b.n.replace('Lá Nghệ ','')+'</h2><p class="code">'+c+'</p><p class="txt" style="margin:8px auto 0">'+vn(s.date)+' lúc <b>'+s.time+'</b> · '+s.guests+' khách · '+s.area+'.<br>Đọc mã này cho nhân viên khi tới. Bàn được giữ 15 phút.</p><p class="demo-note" style="margin-top:14px">Trang mẫu: mã chỉ để minh hoạ, không có dữ liệu nào được gửi đi.</p><div class="acts"><a class="btn btn-p" href="'+ROOT+'thuc-don/">Xem trước thực đơn</a><a class="btn btn-g" href="'+ROOT+'chi-nhanh/#'+b.id+'">Xem đường tới chi nhánh</a><button class="btn btn-g" type="button" id="bkAgain">Đặt bàn khác</button></div>';
    store.set('booking',{branch:s.branch,guests:s.guests,name:s.name,tel:s.tel,email:s.email});store.set('lastBooking',{code:c,branch:b.n,date:vn(s.date),time:s.time});d.focus();toast('Đã nhận đặt bàn, mã <b>'+c+'</b>')});
  $('#bkBack').addEventListener('click',function(){go(step-1,true)});
  $('#bkSteps').addEventListener('click',function(e){var b=e.target.closest('[data-go]');if(b&&!b.disabled)go(+b.getAttribute('data-go'),true)});
  form.addEventListener('click',function(e){if(e.target.closest('#bkAgain')){s={branch:s.branch,guests:2,date:days[0].iso,name:s.name,tel:s.tel,email:s.email};$('#bkDone').hidden=true;$('#bkNav').hidden=false;$('#bkSteps').hidden=false;$('#bkOk').checked=false;go(1,true)}});
  form.addEventListener('submit',function(e){e.preventDefault()});
  var start=1;if(s.branch){start=2;if(s.step&&s.step>2&&s.time){start=s.area?Math.min(s.step,4):3}}
  go(Math.min(start,4));
};

/* ===== Chi nhánh ===== */
PAGES.branches=function(){
  var city='hcm',need=[],sel=null,note=$('#bfNote');
  function paint(){$('#mapHcm').toggleAttribute('hidden',city!=='hcm');$('#mapHn').toggleAttribute('hidden',city!=='hn');
    $$('[data-city]').forEach(function(b){b.setAttribute('aria-selected',b.getAttribute('data-city')===city?'true':'false')});
    $$('[data-ft]').forEach(function(b){b.setAttribute('aria-pressed',need.indexOf(b.getAttribute('data-ft'))>-1?'true':'false')});
    var match=[];DATA.branches.forEach(function(b){var ok=need.every(function(f){return b.ft.indexOf(f)>-1});if(ok)match.push(b);
      var m=$('[data-mini="'+b.id+'"]');m.hidden=b.ck!==city;m.classList.toggle('dim',!ok);m.classList.toggle('on',sel===b.id);
      var p=$('[data-pin="'+b.id+'"]');p.classList.toggle('on',sel===b.id);p.style.opacity=ok?1:.3;
      var c=$('#'+b.id);c.hidden=!ok});
    note.textContent=need.length?(match.length?match.length+' chi nhánh có đủ tiện ích đã chọn: '+match.map(function(b){return b.n.replace('Lá Nghệ ','')}).join(', ')+'.':'Chưa có chi nhánh nào đủ cả các tiện ích này. Bỏ bớt một lựa chọn nhé.'):''}
  function pick(id,scroll){var b=branch(id);sel=id;city=b.ck;paint();if(scroll){var c=$('#'+id);if(!c.hidden)c.scrollIntoView({behavior:LN.RM?'auto':'smooth',block:'center'})}}
  $$('[data-city]').forEach(function(b){b.addEventListener('click',function(){city=b.getAttribute('data-city');sel=null;paint()})});
  $$('[data-ft]').forEach(function(b){b.addEventListener('click',function(){var v=b.getAttribute('data-ft'),i=need.indexOf(v);if(i>-1)need.splice(i,1);else need.push(v);paint()})});
  $$('[data-mini]').forEach(function(b){b.addEventListener('click',function(){pick(b.getAttribute('data-mini'),true)});b.addEventListener('mouseenter',function(){sel=b.getAttribute('data-mini');paint()})});
  $$('[data-pin]').forEach(function(p){function f(){pick(p.getAttribute('data-pin'),true)}p.addEventListener('click',f);p.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();f()}})});
  $$('[data-book]').forEach(function(a){a.addEventListener('click',function(){var bk=store.get('booking',{})||{};bk.branch=a.getAttribute('data-book');bk.time=null;bk.area=null;bk.step=2;store.set('booking',bk)})});
  var n=vnNow(),DL=['chủ nhật','thứ hai','thứ ba','thứ tư','thứ năm','thứ sáu','thứ bảy'];$('#todayName').textContent=DL[n.d];var tr=$('#hoursTbl tr[data-d="'+n.d+'"]');if(tr)tr.classList.add('today');
  var h=location.hash.slice(1);if(h&&branch(h)){sel=h;city=branch(h).ck}paint();
};

/* ===== Tiệc & sự kiện ===== */
PAGES.events=function(){
  var SET={nha:['Mâm Nhà',450000],mua:['Mâm Mùa',650000],langhe:['Mâm Lá Nghệ',890000]},g=$('#evG'),st=store.get('event',{})||{};
  if(st.g)g.value=st.g;if(st.set){var r=$('input[name=evSet][value="'+st.set+'"]');if(r)r.checked=true}
  function calc(){var n=+g.value,set=$('input[name=evSet]:checked').value,drEl=$('input[name=evDr]:checked'),dr=Math.max(0,+drEl.value),food=n*SET[set][1],drink=n*dr,ex=0;
    $$('input[name=evX]:checked').forEach(function(x){ex+=+x.value});var svc=Math.round((food+drink)*.05),tot=food+drink+svc+ex;
    g.style.setProperty('--p',((n-10)/190*100)+'%');$('#evGOut').innerHTML=n+'<small>khách</small>';var tb=Math.ceil(n/10);$('#evTables').textContent=tb+' bàn tròn 10 người';
    $('#evAge').hidden=!drEl.hasAttribute('data-alc');
    $('#evRows').innerHTML=[[SET[set][0]+' × '+n+' khách',fmt(food)],['Đồ uống',drink?fmt(drink):(+drEl.value<0?'Tự mang':'Đã gồm')],['Phí phục vụ 5%',fmt(svc)],['Dịch vụ thêm',ex?fmt(ex):'Không']].map(function(r){return '<div><dt>'+r[0]+'</dt><dd>'+r[1]+'</dd></div>'}).join('');
    animNum($('#evTotal'),tot);$('#evPer').textContent='Khoảng '+fmt(Math.round(tot/n/1000)*1000)+' mỗi khách, đã gồm VAT';
    var fit=[];$$('.room').forEach(function(rm){var ok=n>=+rm.getAttribute('data-min')&&n<=+rm.getAttribute('data-max');rm.classList.toggle('yes',ok);rm.classList.toggle('no',!ok);if(ok)fit.push($('b',rm).textContent)});
    $('#evFit').innerHTML=fit.length?'Vừa với <b>'+fit.join('</b>, <b>')+'</b>.':(n>80?'Trên 80 khách: nhà hàng tổ chức <b>tiệc ngoài</b> tại địa điểm của bạn, hoặc bao trọn chi nhánh Tây Hồ.':'Chưa có phòng vừa số khách này, nhà hàng sẽ tư vấn ghép phòng.');
    store.set('event',{g:n,set:set});return {n:n,set:SET[set][0],tot:tot}}
  g.addEventListener('input',calc);$$('input[name=evSet],input[name=evDr],input[name=evX]').forEach(function(x){x.addEventListener('change',calc)});calc();
  var now=vnNow(),dt=$('#evDate');dt.min=now.y+'-'+pad(now.mo)+'-'+pad(now.day);
  $('#evForm').addEventListener('submit',function(e){e.preventDefault();if(!LN.vForm(this))return;var c=calc(),code=LN.code('LN-TIEC'),p=dt.value.split('-');this.hidden=true;var d=$('#evDone');d.hidden=false;
    d.innerHTML='<div class="okbox">'+ic('check')+'<div><b>Đã ghi nhận yêu cầu báo giá</b>'+esc($('#evName').value.trim())+', bộ phận tiệc sẽ gọi lại trong ngày. '+c.set+' cho '+c.n+' khách, ngày '+p[2]+'/'+p[1]+'/'+p[0]+', ước tính '+fmt(c.tot)+'.<br><span class="code">'+code+'</span><p class="demo-note" style="margin-top:10px">Trang mẫu: không có dữ liệu nào được gửi đi.</p></div></div>';d.focus()});
  var box=$('#gfBox'),qty=$('#gfQty');function gift(){var q=Math.max(20,Math.min(2000,+qty.value||20)),p=+box.value,off=q>=100?.1:(q>=50?.05:0);animNum($('#gfTot'),q*p*(1-off));$('#gfNote').textContent=q+' hộp · '+(off?'giảm '+(off*100)+'%':'chưa có mức giảm')+(q>=50?', có in logo':', chưa in logo')}
  box.addEventListener('change',gift);qty.addEventListener('input',gift);qty.addEventListener('blur',function(){if(+qty.value<20)qty.value=20;gift()});gift();
};

/* ===== Giao món ===== */
PAGES.delivery=function(){
  var FEES=[15000,25000,35000],ETA=['30–40','40–50','50–65'],rows=$$('#dList .drow'),cat='',q=$('#dq'),promo=null,o=store.get('order',{})||{};
  function filt(){var nq=norm(q.value.trim()),n=0;rows.forEach(function(r){var d=dish(r.getAttribute('data-id')),ok=(!cat||d.c===cat)&&(!nq||norm(d.n+' '+d.d).indexOf(nq)>-1);r.hidden=!ok;if(ok)n++});$('#dEmpty').hidden=n>0;$('#dStat').textContent=n+' món giao được'+(cat?' trong nhóm '+DATA.cats[cat].toLowerCase():'')+'. Một số món chỉ phục vụ tại bàn.'}
  $('#dCats').addEventListener('click',function(e){var b=e.target.closest('[data-dc]');if(!b)return;cat=b.getAttribute('data-dc');$$('[data-dc]').forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});filt()});
  q.addEventListener('input',filt);filt();
  var sel=$('#oTime');(function(){var n=vnNow(),m=n.h*60+n.m+45,opts=[],start=Math.max(11*60,Math.ceil(m/30)*30);if(m<=21*60)opts.push(['som','Giao ngay khi bếp xong']);for(var t=start;t<=21*60+30&&opts.length<12;t+=30)opts.push([pad(Math.floor(t/60))+':'+pad(t%60),'Hôm nay, '+pad(Math.floor(t/60))+':'+pad(t%60)]);if(opts.length<2)for(var t2=11*60;t2<=13*60;t2+=30)opts.push(['mai-'+t2,'Ngày mai, '+pad(Math.floor(t2/60))+':'+pad(t2%60)]);sel.innerHTML=opts.map(function(x){return '<option value="'+x[0]+'">'+x[1]+'</option>'}).join('')})();
  if(o.city)$('#oCity').value=o.city;if(o.zone)$('#oZone').value=o.zone;['Name','Tel','Addr'].forEach(function(k){if(o[k])$('#o'+k).value=o[k]});
  var saved=store.get('promo','');if(saved){$('#oPromo').value=saved;applyPromo(true)}
  function applyPromo(quiet){var v=$('#oPromo').value.trim().toUpperCase(),msg=$('#oPromoMsg');if(!v){promo=null;msg.textContent='';}
    else if(v==='LANGHE10'){promo=v;msg.textContent='Đã áp dụng: giảm 10% tiền món, tối đa 80.000đ (mã mẫu).';msg.style.color='#1C6B45'}
    else{promo=null;msg.textContent='Mã chưa đúng hoặc đã hết hạn. Thử mã mẫu LANGHE10.';msg.style.color='';if(!quiet)$('#oPromo').focus()}draw()}
  $('#oApply').addEventListener('click',function(){applyPromo()});
  function draw(){var items=LN.cartItems(),sub=LN.cartTotal(),cnt=LN.cartCount(),box=$('#oItems'),done=!$('#oDone').hidden;
    $('#oCount').textContent=cnt+' phần';$('#mCartN').textContent=cnt;$('#mCartT').textContent=fmt(sub);$('#mCart').classList.toggle('show',cnt>0);
    rows.forEach(function(r){var id=r.getAttribute('data-id'),qn=0;items.forEach(function(it){if(it.d.id===id)qn=it.q});var tag=$('.inq',r);if(qn){if(!tag){tag=D.createElement('span');tag.className='inq';$('.drow-a',r).insertBefore(tag,$('.add',r))}tag.textContent='Trong giỏ: '+qn}else if(tag)tag.remove()});
    if(done)return;
    if(!items.length){box.innerHTML='<div class="empty">'+ic('bowl')+'<b>Chưa có món nào</b><p>Bấm “Thêm” ở món bạn muốn. Đơn tối thiểu 150.000đ.</p></div>';$('#oRest').hidden=true;return}
    $('#oRest').hidden=false;
    box.innerHTML=items.map(function(it){var d=it.d;return '<div class="ci"><img src="'+img(d.img,96,96)+'" alt="" width="48" height="48"><div><b>'+esc(d.n)+'</b><small>'+fmt(d.p*it.q)+'</small></div><div class="qty"><button type="button" data-step="-1" data-id="'+d.id+'" aria-label="Bớt một phần '+esc(d.n)+'">'+ic('minus')+'</button><span>'+it.q+'</span><button type="button" data-step="1" data-id="'+d.id+'" aria-label="Thêm một phần '+esc(d.n)+'">'+ic('plus')+'</button></div></div>'}).join('');
    var z=+$('#oZone').value,free=sub>=500000,ship=free?0:FEES[z],dis=promo?Math.min(80000,Math.round(sub*.1/1000)*1000):0,all=sub-dis+ship,pg=$('#oProg');
    pg.className='prog'+(free?' ok':'');$('span',pg).textContent=free?'Đơn này được miễn phí giao.':'Thêm '+fmt(500000-sub)+' nữa để được miễn phí giao.';$('i',pg).style.setProperty('--w',Math.min(100,sub/5000)+'%');
    $('#tSub').textContent=fmt(sub);$('#tDisRow').hidden=!dis;$('#tDis').textContent='−'+fmt(dis);$('#tShipLb').textContent='Phí giao · khu '+(z+1)+' · '+ETA[z]+' phút';$('#tShip').textContent=free?'Miễn phí':fmt(ship);animNum($('#tAll'),all);$('#tBtn').textContent=fmt(all);
    return {sub:sub,all:all,z:z}}
  D.addEventListener('ln:cart',draw);$('#oZone').addEventListener('change',draw);$('#oCity').addEventListener('change',draw);draw();
  $('#oForm').addEventListener('submit',function(e){e.preventDefault();var er=$('#oErr'),r=draw();er.hidden=true;if(r.sub<150000){er.textContent='Đơn tối thiểu 150.000đ, bạn thêm '+fmt(150000-r.sub)+' nữa nhé.';er.hidden=false;return}
    if(!LN.vForm(this))return;var code=LN.code('LN-GIAO'),name=$('#oName').value.trim(),t=sel.options[sel.selectedIndex].text,n=LN.cartCount();
    store.set('order',{city:$('#oCity').value,zone:$('#oZone').value,Name:name,Tel:$('#oTel').value.trim(),Addr:$('#oAddr').value.trim()});
    $('#oRest').hidden=true;$('#oItems').innerHTML='';var d=$('#oDone');d.hidden=false;
    d.innerHTML='<div class="done" style="border:0;padding:28px 4px"><div class="tick">'+ic('check')+'</div><p class="eyebrow c">Đã nhận đơn</p><h2 class="h3" style="margin-top:10px">Cảm ơn '+esc(name.split(' ').pop())+', bếp bắt đầu nấu</h2><p class="code">'+code+'</p><p class="txt" style="margin:6px auto 0">'+n+' phần · '+fmt(r.all)+' · nhận: '+t.toLowerCase()+' · dự kiến '+ETA[r.z]+' phút sau khi bếp xong.</p><p class="demo-note" style="margin-top:12px">Trang mẫu: mã chỉ để minh hoạ, đơn không được gửi đi.</p><div class="acts"><button class="btn btn-g btn-s" type="button" id="oAgain">Đặt đơn khác</button></div></div>';
    LN.clearCart();d.focus();toast('Đã nhận đơn <b>'+code+'</b>','truck')});
  $('#gio').addEventListener('click',function(e){if(e.target.closest('#oAgain')){$('#oDone').hidden=true;$('#oForm .consent input').checked=false;draw()}});
};

/* ===== Câu chuyện ===== */
PAGES.story=function(){
  var TL=[['2014','1641440615059-42c8ed3af8c8','Mâm cơm Việt với rau luộc, thịt luộc và cơm trắng','Quán cơm 24 chỗ ở Tân Định','Một bếp gas hai lò, bảy món mỗi ngày viết phấn lên bảng. Tôm áp chảo nghệ tươi có mặt từ tuần đầu tiên.'],
    ['2017','1537047902294-62a40c20a6ae','Dãy ghế băng xanh lá giữa nhiều cây xanh','Dời sang căn biệt thự cũ','Quán chuyển tới căn biệt thự có hiên xanh, tăng lên 90 chỗ và lần đầu có thực đơn in.'],
    ['2019','1555396273-367ea4eb4db5','Không gian nhà hàng hai tầng nhiều ánh sáng','Mở Lá Nghệ Bến Thành','Chi nhánh thứ hai, có bếp mở và hai phòng riêng. Bắt đầu nhận tiệc công ty.'],
    ['2022','1550966871-3ed3cdb5ed0c','Phòng ăn với bàn ghế gỗ bên ô cửa kính lớn','Ra Hà Nội: Hoàn Kiếm','Bếp trưởng ở lại Hà Nội sáu tháng để chỉnh thực đơn theo khẩu vị miền Bắc: bớt ngọt, thêm món nước.'],
    ['2024','1755568599643-a91d9490b059','Khu sân vườn nhiều cây xanh','Tây Hồ và sảnh tiệc 80 khách','Chi nhánh rộng rãi hơn cả, có sân vườn, sảnh tiệc và lớp nấu cuối tuần.'],
    ['2026','1512909006721-3d6018887383','Hộp quà gói giấy kraft buộc dây','Giao món và quà tặng doanh nghiệp','Bếp trung tâm làm gia vị theo mẻ cho bốn chi nhánh, mở thêm giao món và hộp quà từ bếp.']];
  var card=$('#tlCard'),bar=$('#tlBar'),btns=$$('#tlYears button'),cur=0;
  function show(i,focus){cur=i;var t=TL[i];btns.forEach(function(b,k){b.setAttribute('aria-selected',k===i?'true':'false');b.tabIndex=k===i?0:-1});if(focus)btns[i].focus();bar.style.setProperty('--w',((i+1)/TL.length*100)+'%');
    card.classList.remove('sw');card.innerHTML='<img src="'+img(t[1],700,800)+'" alt="'+t[2]+'" width="700" height="800"><div><span class="yr">'+t[0]+'</span><b>'+t[3]+'</b><p>'+t[4]+'</p></div>';void card.offsetWidth;card.classList.add('sw')}
  btns.forEach(function(b,i){b.addEventListener('click',function(){show(i)});b.addEventListener('keydown',function(e){if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();show((cur+(e.key==='ArrowRight'?1:-1)+TL.length)%TL.length,true)}})});
  var SRC=[['1563822249548-9a72b6353cd1','Các đĩa gia vị khô và thảo mộc','Nghệ tươi · Hưng Yên','Củ nghệ vàng giã với muối hột mỗi sáng. Nước cốt để ướp, xác nghệ phi dầu lấy màu. Bếp không dùng bột nghệ đóng sẵn.'],
    ['1559737558-2f5a35f4523b','Tôm sú xếp trên đĩa trắng','Tôm sú · Cà Mau','Tôm cỡ 20–25 con một ký, về bếp trong ngày bằng xe lạnh. Dùng cho món áp chảo, hấp nước dừa và canh chua.'],
    ['1536304993881-ff6e9eefa2a6','Chén cơm trắng vừa nấu xong','Gạo ST25 · Sóc Trăng','Nấu niêu từng mẻ nhỏ để cơm lúc nào cũng mới. Cơm nguội hôm trước để riêng cho món cơm rang nghệ.'],
    ['1628997323766-c846909a7049','Niêu đất thịt kho tộ màu cánh gián','Nước mắm cá cơm · Phú Quốc','Mắm nhĩ cho món chấm, mắm độ đạm vừa cho món kho. Mỗi món có công thức pha riêng, ghi trên bảng bếp.'],
    ['1624668430039-0175a0fbf006','Thùng gỗ đầy rau củ tươi','Rau, dâu, bơ · Đà Lạt, Đắk Lắk','Nhận hàng ba lần mỗi tuần. Bơ sáp chỉ lên thực đơn khi vào vụ, hết vụ bếp đổi sang món khác.'],
    ['1762920738955-38d51d7a7645','Giỏ mây đựng rau thơm vừa hái','Rau thơm · vườn quanh thành phố','Húng quế, rau răm, ngò gai, thì là hái buổi sáng, tới bếp trước mười giờ, dùng hết trong ngày.']];
  var pan=$('#srcP');$('#srcL').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;$$('#srcL button').forEach(function(x){x.setAttribute('aria-selected',x===b?'true':'false')});var k=SRC[+b.getAttribute('data-k')];pan.innerHTML='<img src="'+img(k[0],900,800)+'" alt="'+k[1]+'" width="900" height="800"><div><b>'+k[2]+'</b><p>'+k[3]+'</p></div>'});
};

/* ===== Tin tức ===== */
PAGES.news=function(){
  var cards=$$('#nGrid .ncard');$('#nCats').addEventListener('click',function(e){var b=e.target.closest('[data-nc]');if(!b)return;var c=b.getAttribute('data-nc'),n=0;$$('[data-nc]').forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});cards.forEach(function(a){var ok=!c||a.getAttribute('data-cat')===c;a.hidden=!ok;if(ok){n++;a.classList.add('in')}});$('#nStat').textContent=n+' bài viết'+(c?' trong chủ đề '+c:'')});
  var now=vnNow(),today=Date.UTC(now.y,now.mo-1,now.day);$$('[data-end]').forEach(function(el){var p=el.getAttribute('data-end').split('-'),left=Math.round((Date.UTC(+p[0],+p[1]-1,+p[2])-today)/864e5);el.textContent=left<0?'Đã kết thúc ngày '+p[2]+'/'+p[1]+'/'+p[0]:(left===0?'Hết hạn hôm nay':'Còn '+left+' ngày · đến hết '+p[2]+'/'+p[1]+'/'+p[0])});
};
PAGES.article=function(){
  var bar=$('#rProg'),body=$('#artBody'),links=$$('#toc a'),heads=links.map(function(a){return $(a.getAttribute('href'))});
  function prog(){var r=body.getBoundingClientRect(),h=r.height-W.innerHeight*.6,k=Math.max(0,Math.min(1,(-r.top+W.innerHeight*.3)/h));bar.style.transform='scaleX('+k+')';var on=0;heads.forEach(function(h,i){if(h.getBoundingClientRect().top<W.innerHeight*.35)on=i});links.forEach(function(a,i){a.classList.toggle('on',i===on)})}
  W.addEventListener('scroll',prog,{passive:true});prog();
  $('#rTime').textContent=Math.max(1,Math.round(body.textContent.trim().split(/\s+/).length/220))+' phút đọc';
  $('#shareBtn').addEventListener('click',function(){var done=function(){toast('Đã sao chép liên kết bài viết','copy')};if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(location.href).then(done,done);else done()});
};

/* ===== Liên hệ & tuyển dụng ===== */
PAGES.contact=function(){
  var DEP={ban:['Bộ phận đặt bàn','Nhanh hơn cả là đặt trực tuyến; cần đổi giờ hoặc huỷ, bạn gọi thẳng chi nhánh.','0900 000 000','datban@langhe.example','đặt bàn, đổi giờ'],
    tiec:['Bộ phận tiệc & sự kiện','Cho chúng tôi biết số khách và ngày dự kiến, báo giá gửi lại trong ngày làm việc.','0900 000 005','tiec@langhe.example','tiệc & sự kiện'],
    qua:['Quà tặng doanh nghiệp','Nhận đặt từ 20 hộp, in logo từ 50 hộp. Có hộp mẫu gửi tới văn phòng để xem trước.','0900 000 006','quatang@langhe.example','quà tặng doanh nghiệp'],
    khac:['Chăm sóc khách hàng','Góp ý về bữa ăn, đề nghị hợp tác, báo chí. Quản lý chi nhánh trực tiếp phản hồi.','0900 000 000','xinchao@langhe.example','góp ý, báo chí, việc khác']},dep='ban';
  function setDep(k){if(!DEP[k])return;dep=k;var d=DEP[k];$$('[data-dep]').forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-dep')===k?'true':'false')});
    $('#depInfo').innerHTML='<b>'+esc(d[0])+'</b>'+d[1]+'<ul><li>'+ic('phone')+'<a href="tel:'+d[2].replace(/\s/g,'')+'">'+d[2].replace(/ /g,'&nbsp;')+'</a></li><li>'+ic('mail')+'<a href="mailto:'+d[3]+'">'+d[3]+'</a></li></ul>';
    $('#ctSub').textContent='Về việc: '+d[4]+'.';$$('#ctForm [data-for]').forEach(function(f){f.hidden=f.getAttribute('data-for').split(' ').indexOf(k)<0})}
  $('#deps').addEventListener('click',function(e){var b=e.target.closest('[data-dep]');if(b)setDep(b.getAttribute('data-dep'))});
  var bp=new URLSearchParams(location.search).get('bp');if(bp)setDep(bp);
  $('#ctForm').addEventListener('submit',function(e){e.preventDefault();if(!LN.vForm(this))return;var c=LN.code('LN-LH');this.hidden=true;var d=$('#ctDone');d.hidden=false;d.innerHTML='<div class="okbox">'+ic('check')+'<div><b>Đã nhận lời nhắn của '+esc($('#ctName').value.trim())+'</b>'+DEP[dep][0]+' sẽ gọi lại số '+esc($('#ctTel').value.trim())+' trong ngày.<br><span class="code">'+c+'</span><p class="demo-note" style="margin-top:10px">Trang mẫu: không có dữ liệu nào được gửi đi.</p></div></div>';d.focus()});
  var JOBS=[['Phụ bếp nóng','TP.HCM','Bếp','Bến Thành','Toàn thời gian','9.000.000đ–12.000.000đ',['Sơ chế, đứng line món áp chảo và nướng','Giữ vệ sinh khu bếp theo ca'],['Từ 1 năm kinh nghiệm bếp Việt hoặc Á','Làm được ca tối và cuối tuần']],
    ['Bếp bánh, tráng miệng','TP.HCM','Bếp','Tân Định','Toàn thời gian','10.000.000đ–14.000.000đ',['Làm các món tráng miệng trên thực đơn','Thử món mới theo mùa cùng bếp trưởng'],['Có nền tảng bánh lạnh, chè','Cẩn thận về định lượng']],
    ['Nhân viên phục vụ','TP.HCM','Phục vụ','Bến Thành, Tân Định','Toàn hoặc bán thời gian','7.000.000đ–9.000.000đ + phí phục vụ',['Đón khách, giới thiệu món, lên món','Ghi nhận dị ứng và báo bếp'],['Giao tiếp tốt, nhớ thực đơn','Biết tiếng Anh cơ bản là điểm cộng']],
    ['Giám sát ca','TP.HCM','Phục vụ','Bến Thành','Toàn thời gian','13.000.000đ–16.000.000đ',['Điều phối bàn và nhân sự trong ca','Xử lý phản hồi của khách tại chỗ'],['Từ 2 năm ở vị trí tương đương','Bình tĩnh giờ cao điểm']],
    ['Phụ bếp nguội','Hà Nội','Bếp','Hoàn Kiếm','Toàn thời gian','8.500.000đ–11.000.000đ',['Làm gỏi, nộm, cuốn và nước chấm','Nhận và kiểm rau mỗi sáng'],['Dao thớt chắc tay','Ưu tiên người đã làm bếp Việt']],
    ['Bếp chính ca tối','Hà Nội','Bếp','Tây Hồ','Toàn thời gian','18.000.000đ–24.000.000đ',['Chịu trách nhiệm chất lượng món ca tối','Kèm phụ bếp, lên món tiệc'],['Từ 4 năm kinh nghiệm, 1 năm ở vị trí bếp chính','Quen làm tiệc 50 khách trở lên']],
    ['Nhân viên phục vụ tiệc','Hà Nội','Phục vụ','Tây Hồ','Bán thời gian','35.000đ–45.000đ mỗi giờ',['Chuẩn bị sảnh, phục vụ tiệc cuối tuần','Hỗ trợ lớp nấu ăn sáng thứ bảy'],['Sắp xếp được lịch cuối tuần','Nhanh nhẹn, đúng giờ']],
    ['Điều phối tiệc & quà tặng','Hà Nội','Văn phòng','Tây Hồ','Toàn thời gian','12.000.000đ–15.000.000đ',['Nhận yêu cầu, làm báo giá tiệc và quà tặng','Theo khách từ lúc hỏi đến sau sự kiện'],['Dùng tốt bảng tính','Viết email rõ ràng, chu đáo']]];
  var jc='',jd='',box=$('#jobs'),pos=$('#jbPos');
  pos.innerHTML+=JOBS.map(function(j){return '<option>'+j[0]+' · '+j[1]+'</option>'}).join('')+'<option>Vị trí khác</option>';
  function draw(){var list=JOBS.filter(function(j){return (!jc||j[1]===jc)&&(!jd||j[2]===jd)});$('#jobsN').textContent=list.length+' vị trí';$('#jobsEmpty').hidden=list.length>0;
    box.innerHTML=list.map(function(j,i){return '<details class="job"'+(i===0?' open':'')+'><summary><b>'+j[0]+'</b><span>'+j[1]+' · '+j[3]+'</span><span>'+j[4]+'</span><i></i></summary><div class="job-b"><div><h4>Công việc</h4><ul>'+j[6].map(function(x){return '<li>'+x+'</li>'}).join('')+'</ul></div><div><h4>Cần có</h4><ul>'+j[7].map(function(x){return '<li>'+x+'</li>'}).join('')+'<li>Thu nhập: '+j[5]+'</li></ul></div><button class="btn btn-p btn-s" type="button" data-apply="'+j[0]+' · '+j[1]+'">Ứng tuyển</button></div></details>'}).join('')}
  $('#jobsBar').addEventListener('click',function(e){var b=e.target.closest('.chip');if(!b)return;if(b.hasAttribute('data-jc')){jc=b.getAttribute('data-jc');$$('[data-jc]').forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false')})}else{jd=b.getAttribute('data-jd');$$('[data-jd]').forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false')})}draw()});
  box.addEventListener('click',function(e){var b=e.target.closest('[data-apply]');if(!b)return;pos.value=b.getAttribute('data-apply');$('#ung-tuyen').scrollIntoView({behavior:LN.RM?'auto':'smooth',block:'start'});setTimeout(function(){$('#jbName').focus({preventScroll:true})},500);toast('Đã chọn vị trí <b>'+esc(b.getAttribute('data-apply'))+'</b>')});
  draw();
  $('#jbForm').addEventListener('submit',function(e){e.preventDefault();if(!LN.vForm(this))return;var c=LN.code('LN-TD');this.hidden=true;var d=$('#jbDone');d.hidden=false;d.innerHTML='<div class="okbox">'+ic('check')+'<div><b>Cảm ơn '+esc($('#jbName').value.trim())+'</b>Đã nhận thông tin ứng tuyển vị trí '+esc(pos.value)+'. Quản lý chi nhánh sẽ gọi lại trong 3 ngày làm việc.<br><span class="code">'+c+'</span><p class="demo-note" style="margin-top:10px">Trang mẫu: không có dữ liệu nào được gửi đi.</p></div></div>';d.focus()});
};

/* khởi động */
syncCart();syncFav();tickStatus();setInterval(tickStatus,30000);
if(PAGES[PAGE]){try{PAGES[PAGE]()}catch(err){if(W.console)console.error(err)}}
reveal();
})();
