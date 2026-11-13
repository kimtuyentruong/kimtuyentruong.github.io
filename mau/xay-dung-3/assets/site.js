/* Khải Nguyên Design & Build (mẫu xay-dung-3) — JS dùng chung: khung trang, dữ liệu, tìm kiếm, hiệu ứng */
(function(){
'use strict';
var d=document,b=d.body,R=b.getAttribute('data-root')||'./',PG=b.getAttribute('data-page')||'home';
var KEY='kt-xay-dung-3';
function $(s,c){return (c||d).querySelector(s)}
function $$(s,c){return Array.prototype.slice.call((c||d).querySelectorAll(s))}
var store={get:function(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(e){return{}}},
set:function(k,v){try{var o=store.get();o[k]=v;localStorage.setItem(KEY,JSON.stringify(o))}catch(e){}}};
var U=function(id,w){return 'https://images.unsplash.com/photo-'+id+'?auto=format&fit=crop&w='+(w||1200)+'&q=80'};
var vnd=function(n){return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g,'.')+'đ'};
var ty=function(n){var t=n/1e9;return (t>=10?t.toFixed(1):t.toFixed(2)).replace('.',',').replace(/,?0+$/,'')+' tỷ'};

/* ---------- icon ---------- */
var P={
search:'<circle cx="11" cy="11" r="7"/><path d="m20.5 20.5-4.5-4.5"/>',menu:'<path d="M4 7h16M4 12h16M4 17h10"/>',close:'<path d="M6 6l12 12M18 6 6 18"/>',
arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',up:'<path d="M12 19V5M6 11l6-6 6 6"/>',chev:'<path d="m9 6 6 6-6 6"/>',chevl:'<path d="m15 6-6 6 6 6"/>',
phone:'<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',pin:'<path d="M12 21.5s7-6.3 7-11.5a7 7 0 0 0-14 0c0 5.2 7 11.5 7 11.5z"/><circle cx="12" cy="10" r="2.6"/>',
mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 7.5 8.5 6 8.5-6"/>',check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',plus:'<path d="M12 5v14M5 12h14"/>',minus:'<path d="M5 12h14"/>',
info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.8h.01"/>',alert:'<path d="M12 4 2.5 20h19L12 4zM12 10v4.5M12 17.3h.01"/>',
ruler:'<path d="M3 17 17 3l4 4L7 21z"/><path d="m7 13 2 2M10 10l2 2M13 7l2 2"/>',drafting:'<path d="M3 21h18M5 21V9l7-5 7 5v12"/><path d="M9 21v-6h6v6"/>',
house:'<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>',villa:'<path d="M2 20h20M4 20V10l6-4 6 4v10M16 13h4v7"/><path d="M8 14h4"/>',
crane:'<path d="M6 21V4h1l12 3H7M6 8 3 11M19 7v6"/><rect x="17" y="13" width="4" height="3"/><path d="M3 21h8"/>',hammer:'<path d="m14 7 3-3 4 4-3 3M14 7l-9.5 9.5a2.1 2.1 0 0 0 3 3L17 10"/>',
brick:'<rect x="3" y="5" width="18" height="14" rx="1"/><path d="M3 9.7h18M3 14.3h18M9 5v4.7M15 5v4.7M6 9.7v4.6M12 9.7v4.6M18 9.7v4.6M9 14.3V19M15 14.3V19"/>',
layers:'<path d="M12 2.5 3 7.5l9 5 9-5-9-5zM3 12.5l9 5 9-5M3 17l9 5 9-5"/>',shield:'<path d="M12 3l7.5 3v5c0 5-3.5 8.5-7.5 10-4-1.5-7.5-5-7.5-10V6L12 3z"/><path d="m9 12 2.2 2.2L15.2 10"/>',
file:'<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5zM14 3v5h5M9 13h6M9 17h4"/>',cal:'<rect x="3" y="4.5" width="18" height="16.5" rx="2"/><path d="M16 2.5v4M8 2.5v4M3 10h18"/>',
wallet:'<path d="M19 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6M16.5 14h.01"/>',calc:'<rect x="5" y="2.5" width="14" height="19" rx="2"/><path d="M8 6.5h8M8 11h.01M12 11h.01M16 11h.01M8 14.5h.01M12 14.5h.01M16 14.5h.01M8 18h.01M12 18h4"/>',
heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21.2l7.8-7.7 1-1.1a5.5 5.5 0 0 0 0-7.8z"/>',
users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.7a3.5 3.5 0 0 1 0 6.6M18 14.2a6.5 6.5 0 0 1 3.5 5.8"/>',
eye:'<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',expand:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
fb:'<path d="M14 8.5h3v-4h-3a4 4 0 0 0-4 4V11H7v4h3v6.5h4V15h3l1-4h-4V9a.5.5 0 0 1 .5-.5z"/>',yt:'<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="m10 9.5 5 2.5-5 2.5z"/>',
zalo:'<path d="M20 4H4a1.5 1.5 0 0 0-1.5 1.5v10A1.5 1.5 0 0 0 4 17h3v4l5-4h8a1.5 1.5 0 0 0 1.5-1.5v-10A1.5 1.5 0 0 0 20 4z"/><path d="M8 9h4l-4 4h4M15 9v4"/>',
tiktok:'<path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5M14 3c.5 2.6 2.4 4.3 5 4.5"/>',
print:'<path d="M7 8V3h10v5M7 17H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M7 14h10v7H7z"/>',
filter:'<path d="M4 6h16M7 12h10M10 18h4"/>',swap:'<path d="M7 4 3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7"/>',
bolt:'<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',drop:'<path d="M12 2.5s6.5 6.5 6.5 11.5a6.5 6.5 0 0 1-13 0C5.5 9 12 2.5 12 2.5z"/>',
door:'<path d="M5 21V3h11v18M16 5h3v16M3 21h18"/><path d="M12.5 12h.01"/>',paint:'<rect x="3" y="3" width="15" height="6" rx="1"/><path d="M18 6h3v5l-9 2v3M10 16h4v5h-4z"/>',
grid:'<rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>',stairs:'<path d="M3 21h5v-5h5v-5h5V6h3"/>',
book:'<path d="M3 5h6a3 3 0 0 1 3 3v12a2.5 2.5 0 0 0-2.5-2.5H3zM21 5h-6a3 3 0 0 0-3 3v12a2.5 2.5 0 0 1 2.5-2.5H21z"/>',
camera:'<path d="M4 7h3l2-3h6l2 3h3v13H4z"/><circle cx="12" cy="13" r="3.5"/>',copy:'<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
trash:'<path d="M4 7h16M9 7V4h6v3M6.5 7l1 13h9l1-13"/>',edit:'<path d="M4 20h4L19 9l-4-4L4 16v4z"/>',target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>'};
var sp='<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true"><defs>';
for(var k in P){sp+='<symbol id="i-'+k+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">'+P[k]+'</symbol>'}
b.insertAdjacentHTML('afterbegin',sp+'</defs></svg>');
function ic(n,c){return '<svg class="ic'+(c?' '+c:'')+'" aria-hidden="true"><use href="#i-'+n+'"/></svg>'}

/* ---------- dữ liệu ---------- */
var NAV=[['dich-vu','Dịch vụ'],['bang-gia','Bảng giá'],['du-an','Dự án'],['quy-trinh','Quy trình'],['vat-tu','Vật tư'],['bao-hanh','Bảo hành'],['kien-thuc','Kiến thức'],['lien-he','Liên hệ']];
var PROJ=[
{id:'nha-pho-go-vap',n:'Nhà phố 4 tầng hẻm xe hơi',t:'nha-pho',k:'hcm',w:'Phường Gò Vấp, TP.HCM',lot:'5 × 18 m',fl:'1 trệt, 2 lầu, sân thượng',area:290,pkg:'Trọn gói Tiêu chuẩn',bud:3.2,mo:5,y:2025,img:'1564703048291-bcf7f001d83d',alt:'Nhà phố bốn tầng mặt tiền lam gỗ, trước nhà có cây xanh',s:'Mặt tiền lam gỗ che nắng hướng Tây, giếng trời giữa nhà cho ba thế hệ cùng ở.'},
{id:'biet-thu-thu-duc',n:'Biệt thự 2 tầng sân vườn',t:'biet-thu',k:'thu-duc',w:'Phường Thủ Đức, TP.HCM',lot:'12 × 20 m',fl:'1 trệt, 1 lầu, mái bằng',area:330,pkg:'Trọn gói Cao cấp',bud:6.8,mo:7,y:2025,img:'1580587771525-78b9dba3b914',alt:'Biệt thự hai tầng hiện đại có hồ bơi phía trước',s:'Hồ bơi đặt phía Đông, phòng khách mở ra sân vườn bằng cửa kính khung nhôm.'},
{id:'cai-tao-binh-thanh',n:'Cải tạo nhà phố 3 tầng',t:'cai-tao',k:'hcm',w:'Phường Bình Thạnh, TP.HCM',lot:'4,2 × 16 m',fl:'Giữ kết cấu, làm lại toàn bộ hoàn thiện',area:190,pkg:'Cải tạo',bud:1.1,mo:3,y:2024,img:'1583847268964-b28dc8f51f92',alt:'Phòng khách sau cải tạo với sofa trắng và cây xanh',s:'Nhà 20 năm tuổi: chống thấm lại sàn mái, đi lại điện nước, mở thông tầng trệt.'},
{id:'nha-pho-thu-dau-mot',n:'Nhà phố 3 tầng mặt tiền',t:'nha-pho',k:'binh-duong',w:'Phường Thủ Dầu Một, TP.HCM (Bình Dương cũ)',lot:'5 × 20 m',fl:'1 trệt, 2 lầu',area:255,pkg:'Trọn gói Cơ bản',bud:2.4,mo:4.5,y:2025,img:'1657346088167-b982455bf29a',alt:'Nhà phố ba tầng tường trắng và ốp xám',s:'Tầng trệt cho thuê kinh doanh, hai tầng trên ở riêng có lối đi độc lập.'},
{id:'biet-thu-di-an',n:'Biệt thự hiện đại 3 tầng',t:'biet-thu',k:'binh-duong',w:'Phường Dĩ An, TP.HCM (Bình Dương cũ)',lot:'10 × 25 m',fl:'1 trệt, 2 lầu, hầm để xe',area:520,pkg:'Trọn gói Cao cấp',bud:9.5,mo:9,y:2024,img:'1600596542815-ffad4c1539a9',alt:'Biệt thự hiện đại màu trắng có hồ bơi',s:'Tầng hầm sâu 1,5 m để 2 xe, hồ bơi tràn trên sân trước.'},
{id:'nha-pho-phu-nhuan',n:'Nhà phố 5 tầng có thang máy',t:'nha-pho',k:'hcm',w:'Phường Phú Nhuận, TP.HCM',lot:'4,5 × 17 m',fl:'1 trệt, 1 lửng, 3 lầu, sân thượng',area:395,pkg:'Trọn gói Cao cấp',bud:4.6,mo:7,y:2025,img:'1600585154526-990dced4db0d',alt:'Mặt tiền nhà phố hiện đại ốp tấm màu xám đậm lúc chiều tối',s:'Thang máy gia đình 350 kg, kết cấu móng cọc ép vì sát nhà hàng xóm.'},
{id:'cai-tao-thuan-an',n:'Cải tạo bếp và\u00a0phòng khách',t:'cai-tao',k:'binh-duong',w:'Phường Thuận An, TP.HCM (Bình Dương cũ)',lot:'Trệt 60 m²',fl:'Đổi công năng, thay toàn bộ tủ bếp',area:60,pkg:'Cải tạo',bud:0.42,mo:1.5,y:2025,img:'1556911220-bff31c812dba',alt:'Gian bếp trắng có mặt đá sáng sau khi cải tạo',s:'Dời bếp ra sau, mở cửa sổ lấy gió, ốp lại sàn gạch 60 × 120 cm.'},
{id:'nha-pho-an-khanh',n:'Nhà phố góc 2 mặt tiền',t:'nha-pho',k:'thu-duc',w:'Phường An Khánh, TP.HCM',lot:'6 × 15 m',fl:'1 trệt, 3 lầu',area:340,pkg:'Trọn gói Tiêu chuẩn',bud:3.9,mo:6,y:2024,img:'1600585154340-be6161a56a0c',alt:'Nhà phố góc có vườn cỏ và cây lớn bên hông',s:'Góc hai mặt tiền xử lý lam đứng chống nắng, sân hông trồng cây.'},
{id:'biet-thu-tan-thuan',n:'Biệt thự mái bằng hồ bơi',t:'biet-thu',k:'hcm',w:'Phường Tân Thuận, TP.HCM',lot:'15 × 22 m',fl:'1 trệt, 1 lầu',area:410,pkg:'Trọn gói Cao cấp',bud:7.6,mo:8,y:2023,img:'1582268611958-ebfd161ef9cf',alt:'Biệt thự mái bằng tường trắng bên hồ bơi',s:'Mái đua sâu 2,4 m che hiên, hồ bơi dài 12 m dọc phòng sinh hoạt chung.'},
{id:'nha-2-tang-lai-thieu',n:'Nhà 2 tầng mái dốc',t:'nha-pho',k:'binh-duong',w:'Phường Lái Thiêu, TP.HCM (Bình Dương cũ)',lot:'7 × 16 m',fl:'1 trệt, 1 lầu, mái ngói',area:180,pkg:'Xây thô',bud:1.6,mo:4,y:2024,img:'1523217582562-09d0def993a6',alt:'Nhà hai tầng tường trắng cạnh cây xanh',s:'Gia chủ tự mua vật tư hoàn thiện, Khải Nguyên làm phần thô và nhân công.'}];
var TYPE={'nha-pho':'Nhà phố','biet-thu':'Biệt thự','cai-tao':'Cải tạo'};
var AREA={'hcm':'TP.HCM (nội thành cũ)','thu-duc':'Khu Thủ Đức cũ','binh-duong':'Bình Dương cũ'};
var POSTS=[
{id:'xin-phep-xay-dung',n:'Thủ tục xin phép xây dựng nhà ở riêng lẻ: hồ sơ, nơi nộp, thời gian',c:'Thủ tục',m:9,dt:'04/11/2026',img:'1503387762-592deb58ef4e',s:'Danh sách giấy tờ, bản vẽ cần nộp, nơi nộp sau khi sắp xếp chính quyền hai cấp và những lỗi khiến hồ sơ bị trả.',full:1},
{id:'dien-tich-quy-doi',n:'Cách tính diện tích xây dựng quy đổi: móng, hầm, mái, sân',c:'Chi phí',m:6,dt:'28/10/2026',img:'1560520653-9e0e4c89eb11',s:'Vì sao nhà 60 m² sàn lại được tính hơn 300 m² khi báo giá: hệ số từng phần và cách tự kiểm tra.'},
{id:'chon-mong',n:'Móng đơn, móng băng hay móng cọc: chọn theo nền đất',c:'Kỹ thuật',m:7,dt:'20/10/2026',img:'1531834685032-c34bf0d84c77',s:'Ba loại móng thường dùng cho nhà phố, khi nào cần khoan khảo sát địa chất và chi phí chênh lệch.'},
{id:'hop-dong-tron-goi',n:'5 điều khoản cần đọc kỹ trong hợp đồng xây nhà trọn gói',c:'Kinh nghiệm',m:5,dt:'12/10/2026',img:'1450101499163-c8848c66ca85',s:'Phụ lục vật tư, điều kiện phát sinh, tiến độ thanh toán, phạt chậm tiến độ và tiền giữ lại bảo hành.'},
{id:'xay-mua-mua',n:'Xây nhà mùa mưa ở TP.HCM: chuẩn bị gì để không chậm tiến độ',c:'Kinh nghiệm',m:5,dt:'01/10/2026',img:'1713593930871-e21d7f9ef4a1',s:'Thời điểm đổ bê tông, che chắn vật tư, chống thấm tạm và cách đội thi công xếp lịch theo thời tiết.'},
{id:'cai-tao-hay-xay-moi',n:'Nhà cũ 20 năm: nên cải tạo hay đập đi xây mới?',c:'Chi phí',m:6,dt:'22/09/2026',img:'1694522362256-6c907336af43',s:'Năm dấu hiệu kết cấu cần kiểm tra trước khi quyết định, kèm cách so sánh chi phí hai phương án.'}];
var FAQ=[
['Báo giá trên web đã gồm thiết kế chưa?','Các gói trọn gói đã gồm hồ sơ thiết kế kiến trúc, kết cấu, điện nước. Gói xây thô tính phí thiết kế riêng theo m² sàn.','bao-hanh'],
['Có phát sinh chi phí sau khi ký hợp đồng không?','Đơn giá và danh mục vật tư được chốt trong phụ lục hợp đồng. Chỉ phát sinh khi chủ nhà đổi thiết kế hoặc nâng vật tư, và phải ký xác nhận trước khi làm.','bao-hanh'],
['Bao lâu thì xây xong một căn nhà phố 3–4 tầng?','Thường 4–6 tháng thi công kể từ ngày khởi công, chưa tính thời gian thiết kế và xin phép.','quy-trinh'],
['Khảo sát nhà có mất phí không?','Khảo sát và tư vấn ban đầu tại TP.HCM và khu vực Bình Dương cũ không thu phí.','lien-he'],
['Có hỗ trợ xin giấy phép xây dựng không?','Có. Khải Nguyên chuẩn bị bản vẽ xin phép và hướng dẫn chủ nhà nộp hồ sơ tại phường/xã.','kien-thuc/xin-phep-xay-dung'],
['Thanh toán chia mấy đợt?','Thanh toán theo 7 đợt gắn với mốc thi công, giữ lại 5% đến hết 12 tháng bảo hành hoàn thiện.','bang-gia'],
['Kết cấu được bảo hành bao lâu?','Kết cấu chịu lực bảo hành 10 năm, chống thấm 5 năm, hoàn thiện 12 tháng (theo hợp đồng mẫu).','bao-hanh'],
['Tôi tự mua vật tư hoàn thiện được không?','Được, chọn gói Xây thô. Khải Nguyên thi công phần thô và nhân công hoàn thiện theo vật tư chủ nhà cung cấp.','dich-vu']];
var PAGES=[['dich-vu','Dịch vụ thiết kế, xây thô, trọn gói, cải tạo','So sánh 4 gói và phạm vi công việc'],['bang-gia','Bảng giá và công cụ dự toán','Tính chi phí từng hạng mục, tiến độ thanh toán'],['du-an','Dự án đã làm','Lọc theo loại nhà, khu vực, ngân sách'],['quy-trinh','Quy trình 8 bước','Từ khảo sát đến bàn giao, hồ sơ cần chuẩn bị'],['vat-tu','Bảng vật tư theo gói','Thương hiệu, quy cách từng hạng mục'],['bao-hanh','Bảo hành và cam kết','Thời hạn bảo hành, câu hỏi thường gặp'],['kien-thuc','Kiến thức xây nhà','Bài viết thủ tục, chi phí, kỹ thuật'],['lien-he','Đặt lịch khảo sát','Form nhiều bước, nhận mã xác nhận']];
window.KN={$:$,$$:$$,store:store,U:U,vnd:vnd,ty:ty,ic:ic,R:R,PROJ:PROJ,TYPE:TYPE,AREA:AREA,POSTS:POSTS,FAQ:FAQ};

/* ---------- logo ---------- */
var LOGO='<svg viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="6" fill="#14243B"/><path d="M9 29V18l11-8 11 8v11" fill="none" stroke="#fff" stroke-width="2.4" stroke-linejoin="round"/><path d="M9 32h22" stroke="#fff" stroke-width="1.2" stroke-dasharray="2 2"/><rect x="17" y="21" width="6" height="8" fill="#F4B400"/></svg>';
var logoH='<span class="logo-t"><b>Khải&nbsp;Nguyên</b><small>Design&nbsp;&amp;&nbsp;Build</small></span>';

/* ---------- header ---------- */
var hdr=$('#hdr');
if(hdr){
  var nv='';NAV.slice(0,7).forEach(function(a){nv+='<a href="'+R+a[0]+'/"'+(PG===a[0]?' aria-current="page"':'')+'>'+a[1]+'</a>'});
  hdr.insertAdjacentHTML('beforebegin','<div class="topbar"><div class="wrap topbar-in"><span>'+ic('phone')+'<a href="tel:0900000000">0900&nbsp;000&nbsp;000</a></span><span class="hide-m">'+ic('clock')+'Thứ 2 – Thứ 7: 07:30–17:30</span><span class="sp"></span><span class="hide-m">'+ic('pin')+'Thi công tại TP.HCM và khu vực Bình Dương cũ</span></div></div>');
  hdr.innerHTML='<div class="wrap hdr-in"><a class="logo" href="'+R+'" aria-label="Khải Nguyên Design &amp; Build, về trang chủ">'+LOGO+logoH+'</a><nav class="nav" aria-label="Menu chính">'+nv+'</nav><div class="hdr-act"><button class="icon-btn" id="srchBtn" type="button" aria-label="Tìm trong website" aria-haspopup="dialog">'+ic('search')+'</button><a class="btn btn-pri btn-sm hdr-cta" href="'+R+'lien-he/"><span class="l">Đặt lịch khảo sát</span><span class="s">Khảo sát</span></a><button class="icon-btn menu-btn" id="menuBtn" type="button" aria-label="Mở menu" aria-expanded="false" aria-controls="mnav">'+ic('menu')+'</button></div></div>';
  var ml='<a href="'+R+'"'+(PG==='home'?' aria-current="page"':'')+'><span><span class="n">00</span>Trang chủ</span>'+ic('chev')+'</a>';
  NAV.forEach(function(a,i){ml+='<a href="'+R+a[0]+'/"'+(PG===a[0]?' aria-current="page"':'')+'><span><span class="n">0'+(i+1)+'</span>'+a[1]+'</span>'+ic('chev')+'</a>'});
  b.insertAdjacentHTML('beforeend','<div class="mnav" id="mnav" aria-hidden="true" role="dialog" aria-modal="true" aria-label="Menu"><div class="mnav-top"><span class="logo">'+LOGO+logoH+'</span><button class="icon-btn" id="menuClose" type="button" aria-label="Đóng menu">'+ic('close')+'</button></div><nav class="mnav-links" aria-label="Menu trên điện thoại">'+ml+'</nav><div class="mnav-foot"><a class="btn btn-pri btn-block" href="'+R+'bang-gia/">'+ic('calc')+'<span>Dự toán chi phí</span></a><a class="btn btn-line btn-block" href="tel:0900000000">'+ic('phone')+'<span>Gọi 0900&nbsp;000&nbsp;000</span></a><p>Thứ 2 – Thứ 7: 07:30–17:30 · Chủ nhật hẹn trước</p></div></div>');
}
/* ---------- footer ---------- */
var ft=$('#ft');
if(ft){
  var fl='<li><a href="'+R+'">Trang chủ</a></li>';NAV.forEach(function(a){fl+='<li><a href="'+R+a[0]+'/">'+a[1]+'</a></li>'});
  fl+='<li><a href="'+R+'du-an-chi-tiet/">Chi tiết dự án</a></li><li><a href="'+R+'kien-thuc/xin-phep-xay-dung/">Bài viết: xin phép xây dựng</a></li>';
  ft.innerHTML='<div class="wrap"><div class="ft-top"><div><a class="logo" href="'+R+'">'+LOGO+logoH+'</a><p>Thiết kế và xây nhà trọn gói cho gia đình ở TP.HCM và khu vực Bình Dương cũ. Một hợp đồng, một kỹ sư phụ trách từ đầu đến cuối, vật tư ghi rõ trong phụ lục.</p><div class="soc"><a href="#" aria-label="Facebook (mẫu)">'+ic('fb')+'</a><a href="#" aria-label="Zalo (mẫu)">'+ic('zalo')+'</a><a href="#" aria-label="YouTube (mẫu)">'+ic('yt')+'</a><a href="#" aria-label="TikTok (mẫu)">'+ic('tiktok')+'</a></div></div><div><h4>Sơ đồ trang</h4><ul>'+fl.split('</li><li>').slice(0,6).join('</li><li>')+'</li></ul></div><div><h4>&nbsp;</h4><ul><li>'+fl.split('</li><li>').slice(6).join('</li><li>')+'</ul></div><div><h4>Văn phòng</h4><ul><li>'+'Văn phòng mẫu: Phường Bình Thạnh, TP.HCM'+'</li><li>Kho vật tư mẫu: Phường Thủ Dầu Một, TP.HCM</li><li><a href="tel:0900000000">0900&nbsp;000&nbsp;000</a> · <a href="mailto:lienhe@example.com">lienhe@example.com</a></li></ul><div class="hours" style="margin-top:16px"><div><span>Thứ 2 – Thứ 7</span><b class="num">07:30–17:30</b></div><div><span>Chủ nhật</span><b>Hẹn trước</b></div></div><div class="ft-map"><svg viewBox="0 0 320 120" role="img" aria-label="Bản đồ minh hoạ khu vực thi công"><defs><pattern id="fg" width="16" height="16" patternUnits="userSpaceOnUse"><path d="M16 0H0v16" fill="none" stroke="rgba(255,255,255,.07)"/></pattern></defs><rect width="320" height="120" fill="url(#fg)"/><path d="M0 92c40-8 70 6 110-6s70-34 110-30 70 18 100 10" fill="none" stroke="#2E5A8A" stroke-width="6"/><path d="M40 0v120M150 0v120M0 40h320M230 0l-40 120" stroke="rgba(255,255,255,.18)" stroke-width="2"/><circle cx="118" cy="62" r="6" fill="#F4B400"/><circle cx="118" cy="62" r="12" fill="none" stroke="#F4B400" stroke-opacity=".5"/><circle cx="214" cy="26" r="5" fill="#fff"/><text x="130" y="66" fill="#fff" font-size="11" font-family="Inter,sans-serif">Văn phòng</text><text x="224" y="30" fill="#AFC0D6" font-size="10" font-family="Inter,sans-serif">Kho vật tư</text></svg></div></div></div><div class="ft-bot"><p>© 2026 Khải Nguyên Design &amp; Build. Mã số doanh nghiệp, giấy phép và chứng chỉ năng lực: thông tin mẫu.</p><p>Nội dung mẫu: tên thương hiệu, giá, nhân sự, dự án, đánh giá và hình ảnh chỉ để minh hoạ giao diện. Ảnh: Unsplash.</p></div></div>';
}
b.insertAdjacentHTML('beforeend','<button class="totop" id="totop" type="button" aria-label="Lên đầu trang">'+ic('up')+'</button>');

/* ---------- menu, badge, header cuộn ---------- */
var mnav=$('#mnav'),mb=$('#menuBtn'),badge=$('#ktBadge'),tt=$('#totop');
function lock(on){b.classList.toggle('lock',on);d.documentElement.style.overflow=on?'hidden':''}
function menu(open){if(!mnav)return;mnav.classList.toggle('open',open);mnav.setAttribute('aria-hidden',!open);mb.setAttribute('aria-expanded',open);lock(open);if(open){$('#menuClose').focus()}else{mb.focus()}}
if(mb){mb.addEventListener('click',function(){menu(true)});$('#menuClose').addEventListener('click',function(){menu(false)});
$$('#mnav a').forEach(function(a){a.addEventListener('click',function(){mnav.classList.remove('open');lock(false)})})}
function onScroll(){var y=window.pageYOffset;if(hdr)hdr.classList.toggle('scrolled',y>8);if(badge)badge.classList.toggle('show',y>window.innerHeight*.85);tt.classList.toggle('show',y>window.innerHeight*1.2)}
window.addEventListener('scroll',onScroll,{passive:true});onScroll();
tt.addEventListener('click',function(){window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'})});

/* ---------- tìm kiếm ---------- */
var IDX=[];
PAGES.forEach(function(p){IDX.push({k:'Trang',t:p[1],s:p[2],h:R+p[0]+'/'})});
PROJ.forEach(function(p){IDX.push({k:'Dự án',t:p.n+' – '+p.w.split(',')[0],s:TYPE[p.t]+' · '+p.lot+' · '+p.pkg,h:R+'du-an-chi-tiet/?da='+p.id})});
POSTS.forEach(function(p){IDX.push({k:'Bài viết',t:p.n,s:p.s,h:p.full?R+'kien-thuc/'+p.id+'/':R+'kien-thuc/#'+p.id})});
FAQ.forEach(function(f){IDX.push({k:'Hỏi đáp',t:f[0],s:f[1],h:R+f[2]+'/'})});
[['Bê tông, thép','vat-tu'],['Gạch ốp lát','vat-tu'],['Sơn nước','vat-tu'],['Thiết bị vệ sinh','vat-tu'],['Đơn giá xây thô','bang-gia'],['Móng cọc','bang-gia'],['Tầng hầm','bang-gia'],['Bảo hành chống thấm','bao-hanh']].forEach(function(v){IDX.push({k:'Mục',t:v[0],s:'Xem trong trang '+(v[1]==='vat-tu'?'Vật tư':v[1]==='bang-gia'?'Bảng giá':'Bảo hành'),h:R+v[1]+'/'})});
function norm(s){return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/đ/g,'d')}
b.insertAdjacentHTML('beforeend','<div class="srch" id="srch" role="dialog" aria-modal="true" aria-label="Tìm trong website" hidden><div class="srch-box"><div class="srch-in">'+ic('search')+'<label class="sr" for="srchQ">Từ khoá</label><input id="srchQ" type="search" placeholder="Tìm dịch vụ, dự án, vật tư, bài viết…" autocomplete="off"><button class="icon-btn" id="srchX" type="button" aria-label="Đóng tìm kiếm">'+ic('close')+'</button></div><div class="srch-hint" id="srchHint"><button type="button">móng cọc</button><button type="button">biệt thự</button><button type="button">giấy phép</button><button type="button">bảo hành</button><button type="button">Bình Dương</button></div><div class="srch-res" id="srchRes" aria-live="polite"></div></div></div>');
var sr=$('#srch'),sq=$('#srchQ'),sres=$('#srchRes'),lastF;
function render(q){var n=norm(q.trim());if(!n){sres.innerHTML='<p class="srch-empty">Gõ từ khoá, ví dụ: “nhà phố Gò Vấp”, “gạch ốp lát”, “thanh toán”.</p>';return}
var ws=n.split(/\s+/),r=IDX.filter(function(o){var h=norm(o.t+' '+o.s+' '+o.k);return ws.every(function(w){return h.indexOf(w)>-1})}).slice(0,12);
sres.innerHTML=r.length?r.map(function(o){return '<a href="'+o.h+'"><span class="k">'+o.k+'</span><span><b>'+o.t+'</b><small>'+o.s+'</small></span></a>'}).join(''):'<p class="srch-empty">Chưa có kết quả cho “'+q.replace(/</g,'&lt;')+'”. Thử từ khoá ngắn hơn hoặc gọi 0900&nbsp;000&nbsp;000.</p>'}
function openS(){lastF=d.activeElement;sr.hidden=false;lock(true);render(sq.value);setTimeout(function(){sq.focus()},30)}
function closeS(){sr.hidden=true;lock(false);if(lastF)lastF.focus()}
$$('#srchBtn,[data-open-search]').forEach(function(x){x.addEventListener('click',openS)});
$('#srchX').addEventListener('click',closeS);
sr.addEventListener('click',function(e){if(e.target===sr)closeS()});
sq.addEventListener('input',function(){render(sq.value)});
$$('#srchHint button').forEach(function(x){x.addEventListener('click',function(){sq.value=x.textContent;render(sq.value);sq.focus()})});
d.addEventListener('keydown',function(e){
  if(e.key==='Escape'){if(!sr.hidden)closeS();else if(mnav&&mnav.classList.contains('open'))menu(false)}
  if((e.key==='/'&&!/INPUT|TEXTAREA|SELECT/.test(d.activeElement.tagName))||((e.metaKey||e.ctrlKey)&&e.key==='k')){e.preventDefault();openS()}
});

/* ---------- hiện dần + đếm số ---------- */
var st=d.documentElement.classList.contains('static'),RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
function count(el){var to=parseFloat(el.getAttribute('data-count')),dec=(el.getAttribute('data-count').split('.')[1]||'').length,t0=null;
if(st||RM){el.textContent=to.toFixed(dec).replace('.',',');return}
function f(t){if(!t0)t0=t;var p=Math.min(1,(t-t0)/1400),e=1-Math.pow(1-p,3);el.textContent=(to*e).toFixed(dec).replace('.',',');if(p<1)requestAnimationFrame(f)}requestAnimationFrame(f)}
var rv=$$('.rv'),cn=$$('[data-count]');
if(st||!('IntersectionObserver' in window)){rv.forEach(function(e){e.classList.add('in')});cn.forEach(count)}
else{var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:.01});rv.forEach(function(e){io.observe(e)});
var io2=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){count(e.target);io2.unobserve(e.target)}})},{threshold:.4});cn.forEach(function(e){io2.observe(e)})}

/* ---------- parallax nhẹ ---------- */
var px=$$('[data-px]');
if(px.length&&!RM&&!st){var tk=false;window.addEventListener('scroll',function(){if(tk)return;tk=true;requestAnimationFrame(function(){px.forEach(function(el){var r=el.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;var v=parseFloat(el.getAttribute('data-px'))||.08;el.style.transform='translate3d(0,'+((r.top+r.height/2-innerHeight/2)*-v).toFixed(1)+'px,0)'});tk=false})},{passive:true})}

/* ---------- lightbox dùng chung ---------- */
window.KN.lightbox=function(list,i){var lb=$('#lb');if(!lb){b.insertAdjacentHTML('beforeend','<figure class="lb" id="lb" role="dialog" aria-modal="true" aria-label="Xem ảnh lớn" hidden><img id="lbImg" alt=""><figcaption id="lbCap"></figcaption><button class="icon-btn x" type="button" aria-label="Đóng">'+ic('close')+'</button><button class="icon-btn pv" type="button" aria-label="Ảnh trước">'+ic('chevl')+'</button><button class="icon-btn nx" type="button" aria-label="Ảnh sau">'+ic('chev')+'</button></figure>');lb=$('#lb')}
var cur=i,last=d.activeElement;function show(){var o=list[cur];$('#lbImg').src=U(o.id,1800);$('#lbImg').alt=o.alt;$('#lbCap').textContent=(cur+1)+' / '+list.length+' · '+o.alt}
function close(){lb.hidden=true;lock(false);d.removeEventListener('keydown',key);if(last)last.focus()}
function key(e){if(e.key==='Escape')close();if(e.key==='ArrowRight'){cur=(cur+1)%list.length;show()}if(e.key==='ArrowLeft'){cur=(cur-1+list.length)%list.length;show()}}
$('.x',lb).onclick=close;$('.nx',lb).onclick=function(){cur=(cur+1)%list.length;show()};$('.pv',lb).onclick=function(){cur=(cur-1+list.length)%list.length;show()};
lb.onclick=function(e){if(e.target===lb)close()};show();lb.hidden=false;lock(true);d.addEventListener('keydown',key);$('.x',lb).focus()};

/* ---------- trạng thái dùng chung: dự án đã lưu ---------- */
window.KN.saved=function(){return store.get().saved||[]};
window.KN.toggleSave=function(id){var s=window.KN.saved(),i=s.indexOf(id);if(i>-1)s.splice(i,1);else s.push(id);store.set('saved',s);return i===-1};
})();
