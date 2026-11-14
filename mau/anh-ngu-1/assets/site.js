/* Sunward English (mẫu anh-ngu-1) — JS dùng chung: dữ liệu mẫu, header/footer, tìm kiếm, lưu trạng thái */
(function(){
'use strict';
var KEY='anh-ngu-1:v1';
var body=document.body, ROOT=body.getAttribute('data-root')||'./', PAGE=body.getAttribute('data-page')||'home';
function $(s,c){return (c||document).querySelector(s)}
function $$(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function fold(s){return String(s).normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase()}
function money(n){return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,'.')+'đ'}
/* ---------- lưu trạng thái ---------- */
var store={
  all:function(){try{return JSON.parse(localStorage.getItem(KEY))||{}}catch(e){return {}}},
  get:function(k,d){var a=store.all();return a[k]===undefined?d:a[k]},
  set:function(k,v){try{var a=store.all();a[k]=v;localStorage.setItem(KEY,JSON.stringify(a))}catch(e){}}
};

/* ---------- dữ liệu mẫu ---------- */
var U='https://images.unsplash.com/photo-';
function img(id,w,h){return U+id+'?auto=format&fit=crop&w='+(w||900)+(h?'&h='+h:'')+'&q=80'}
var D={};
D.campus=[
 {id:'ben-thanh',n:'Sunward Bến Thành',city:'hcm',ward:'Phường Bến Thành, TP.HCM',addr:'Toà nhà mẫu, đường Lê Lợi',rooms:14,park:'Gửi xe máy tầng hầm',x:262,y:226,ph:'1580582932707-520aed937b7b',note:'Cơ sở lớn, có phòng thư viện và khu chờ phụ huynh.'},
 {id:'phu-nhuan',n:'Sunward Phú Nhuận',city:'hcm',ward:'Phường Phú Nhuận, TP.HCM',addr:'Toà nhà mẫu, đường Phan Xích Long',rooms:10,park:'Gửi xe máy trước sảnh',x:196,y:150,ph:'1427504494785-3a9ca7044f45',note:'Gần khu dân cư, nhiều lớp Kids buổi chiều.'},
 {id:'an-khanh',n:'Sunward An Khánh',city:'hcm',ward:'Phường An Khánh, TP.HCM',addr:'Khu phố mẫu, đường Trần Não',rooms:12,park:'Bãi ô tô và xe máy',x:388,y:170,ph:'1509062522246-3755977927d7',note:'Sân chơi nhỏ trong khuôn viên, lớp Teens buổi tối.'},
 {id:'cau-giay',n:'Sunward Cầu Giấy',city:'hn',ward:'Phường Cầu Giấy, Hà Nội',addr:'Toà nhà mẫu, đường Trần Thái Tông',rooms:15,park:'Gửi xe máy tầng hầm',x:150,y:170,ph:'1524178232363-1fb2b075b655',note:'Khu luyện thi IELTS và phòng thi thử riêng.'},
 {id:'dong-da',n:'Sunward Đống Đa',city:'hn',ward:'Phường Đống Đa, Hà Nội',addr:'Toà nhà mẫu, đường Thái Hà',rooms:11,park:'Gửi xe máy trước sảnh',x:262,y:236,ph:'1546410531-bb4caa6b424d',note:'Gần trường học, lớp Kids và Teens kín cuối tuần.'},
 {id:'long-bien',n:'Sunward Long Biên',city:'hn',ward:'Phường Long Biên, Hà Nội',addr:'Khu đô thị mẫu, đường Nguyễn Văn Cừ',rooms:9,park:'Bãi ô tô và xe máy',x:420,y:150,ph:'1577896851231-70ef18881754',note:'Cơ sở mới, phòng học rộng, có góc đọc sách.'},
 {id:'online',n:'Lớp trực tuyến',city:'online',ward:'Học qua Zoom và ứng dụng Sunward',addr:'',rooms:0,park:'',x:0,y:0,ph:'1610484826967-09c5720778c7',note:'Lớp nhỏ, có giáo viên trợ giảng theo dõi.'}
];
D.hours=[['Thứ Hai – Thứ Sáu','08:00–21:00',[1,2,3,4,5],8,21],['Thứ Bảy','07:30–18:00',[6],7.5,18],['Chủ Nhật','07:30–17:00',[0],7.5,17]];
D.ages=[['4-6','4–6 tuổi'],['6-11','6–11 tuổi'],['11-17','11–17 tuổi'],['18+','Từ 18 tuổi']];
D.goals=[['nen-tang','Làm quen, nền tảng'],['giao-tiep','Giao tiếp tự tin'],['truong-lop','Học tốt ở trường'],['ielts','Luyện thi IELTS']];
D.modes=[['trung-tam','Tại trung tâm'],['online','Trực tuyến']];
D.courses=[
 {id:'sunny-starters',n:'Sunny Starters',sub:'Tiếng Anh mầm non',age:['4-6'],ages:'4–6 tuổi',goal:['nen-tang','giao-tiep'],mode:['trung-tam'],lv:'Pre-A1',len:'12 tuần/cấp',ses:'2 buổi/tuần · 60 phút',size:'Tối đa 10 bé',fee:6900000,ph:'1516627145497-ae6968895b74',d:'Bé làm quen tiếng Anh qua bài hát, kể chuyện, vận động và trò chơi; nghe nhiều trước khi nói.'},
 {id:'sunny-kids',n:'Sunny Kids',sub:'Tiếng Anh tiểu học',age:['6-11'],ages:'6–11 tuổi',goal:['giao-tiep','truong-lop'],mode:['trung-tam','online'],lv:'Pre-A1 →︎ A2',len:'12 tuần/cấp',ses:'2 buổi/tuần · 90 phút',size:'Tối đa 14 học viên',fee:7800000,ph:'1588072432904-843af37f03ed',d:'Bốn kỹ năng theo chủ đề gần gũi, dự án nhỏ mỗi tháng và bài thuyết trình cuối cấp.'},
 {id:'phonics',n:'Phát âm & Đọc sớm',sub:'Phonics cho bé',age:['4-6','6-11'],ages:'5–8 tuổi',goal:['nen-tang'],mode:['online'],lv:'Pre-A1',len:'8 tuần',ses:'2 buổi/tuần · 45 phút',size:'Tối đa 6 bé',fee:3200000,ph:'1588072432836-e10032774350',d:'Ghép âm, đọc từ và câu ngắn; phụ huynh nhận hướng dẫn luyện cùng con 10 phút mỗi tối.'},
 {id:'teens-bridge',n:'Teens Bridge',sub:'Tiếng Anh THCS',age:['11-17'],ages:'11–15 tuổi',goal:['truong-lop','giao-tiep'],mode:['trung-tam'],lv:'A2 →︎ B1',len:'12 tuần/cấp',ses:'2 buổi/tuần · 90 phút',size:'Tối đa 16 học viên',fee:8600000,ph:'1571260899304-425eee4c7efc',d:'Ngữ pháp và từ vựng bám chương trình phổ thông, kèm tranh luận, thuyết trình và viết đoạn văn.'},
 {id:'ielts-junior',n:'IELTS Junior',sub:'Làm quen IELTS sớm',age:['11-17'],ages:'14–17 tuổi',goal:['ielts','truong-lop'],mode:['trung-tam','online'],lv:'B1',len:'14 tuần',ses:'2 buổi/tuần · 120 phút',size:'Tối đa 16 học viên',fee:9400000,ph:'1529390079861-591de354faf5',d:'Cầu nối từ tiếng Anh trường lớp sang dạng bài học thuật, vừa sức học sinh cấp hai, cấp ba.'},
 {id:'ielts-foundation',n:'IELTS Foundation',sub:'Mục tiêu 4.5–5.0',age:['11-17','18+'],ages:'Từ 15 tuổi',goal:['ielts'],mode:['trung-tam','online'],lv:'A2 →︎ B1',len:'12 tuần',ses:'3 buổi/tuần · 120 phút',size:'Tối đa 18 học viên',fee:10500000,ph:'1522202176988-66273c2fd55f',d:'Lấp lỗ hổng ngữ pháp, từ vựng học thuật và làm quen cả bốn phần thi.',detail:1},
 {id:'ielts-intensive',n:'IELTS Intensive',sub:'Mục tiêu 5.5–6.5',age:['11-17','18+'],ages:'Từ 15 tuổi',goal:['ielts'],mode:['trung-tam','online'],lv:'B1 →︎ B2',len:'12 tuần',ses:'3 buổi/tuần · 120 phút',size:'Tối đa 18 học viên',fee:12800000,ph:'1531496378573-7be09a2697d8',d:'Chiến lược từng dạng câu hỏi, chữa bài Viết từng câu và luyện Nói 1 kèm 1 hằng tuần.',detail:1},
 {id:'ielts-advanced',n:'IELTS Advanced',sub:'Mục tiêu 7.0 trở lên',age:['18+'],ages:'Từ 16 tuổi',goal:['ielts'],mode:['trung-tam'],lv:'B2 →︎ C1',len:'10 tuần',ses:'3 buổi/tuần · 120 phút',size:'Tối đa 12 học viên',fee:14500000,ph:'1524178232363-1fb2b075b655',d:'Nâng độ chính xác và độ tự nhiên; thi thử có chấm chi tiết theo tiêu chí công bố.',detail:1},
 {id:'giao-tiep',n:'Giao tiếp Tự tin',sub:'Cho người mất gốc',age:['18+'],ages:'Từ 18 tuổi',goal:['giao-tiep','nen-tang'],mode:['trung-tam','online'],lv:'A1 →︎ B1',len:'10 tuần/cấp',ses:'2 buổi/tuần · 90 phút',size:'Tối đa 12 học viên',fee:6500000,ph:'1517245386807-bb43f82c33c4',d:'Nói được từ buổi đầu: phản xạ theo tình huống đời sống, phát âm và nghe hiểu tốc độ thật.'},
 {id:'cong-so',n:'Tiếng Anh Công sở',sub:'Họp, email, thuyết trình',age:['18+'],ages:'Người đi làm',goal:['giao-tiep'],mode:['online','trung-tam'],lv:'B1 →︎ B2',len:'8 tuần',ses:'2 buổi/tuần · 90 phút',size:'Tối đa 10 học viên',fee:7200000,ph:'1454165804606-c3d57bc86b40',d:'Viết email rõ ý, dẫn cuộc họp, thuyết trình ngắn; bài tập lấy từ công việc thật của học viên.'},
 {id:'kem-1-1',n:'Kèm 1 kèm 1',sub:'Lộ trình riêng',age:['6-11','11-17','18+'],ages:'Mọi lứa tuổi',goal:['giao-tiep','ielts','truong-lop'],mode:['online'],lv:'Mọi trình độ',len:'Tối thiểu 12 buổi',ses:'Lịch linh hoạt · 60 phút',size:'1 học viên',fee:450000,unit:'/buổi',ph:'1610484826967-09c5720778c7',d:'Giáo viên xây lộ trình theo mục tiêu riêng; đổi lịch trước 12 tiếng không mất buổi.'}
];
D.teachers=[
 {id:'minh-thu',n:'Ms. Nguyễn Minh Thư',c:'ben-thanh',sp:['Kids','Phát âm'],y:9,cert:'Thạc sĩ Giảng dạy tiếng Anh · CELTA',ph:'1534751516642-a1af1ef26a56',q:'Trẻ nhỏ học nhanh khi được chơi đúng cách. Tôi thiết kế mỗi buổi như một chuyến phiêu lưu nhỏ.'},
 {id:'quoc-huy',n:'Mr. Trần Quốc Huy',c:'cau-giay',sp:['IELTS'],y:11,cert:'IELTS 8.5 · Thạc sĩ Ngôn ngữ học ứng dụng',ph:'1507003211169-0a1dd7228f2d',q:'Điểm số đến từ thói quen. Tôi giúp học viên biết mình sai ở đâu và luyện đúng chỗ đó.'},
 {id:'ha-my',n:'Ms. Lê Hà My',c:'phu-nhuan',sp:['Teens'],y:7,cert:'Cử nhân Sư phạm Anh · TESOL',ph:'1541823709867-1b206113eafd',q:'Tuổi teen cần được tôn trọng ý kiến. Lớp của tôi tranh luận nhiều hơn chép bài.'},
 {id:'daniel',n:'Mr. Daniel Brooks',c:'ben-thanh',sp:['Giao tiếp','Công sở'],y:8,cert:'CELTA · Cử nhân Truyền thông',ph:'1599566150163-29194dcaad36',q:'I want learners to stop translating in their heads and start reacting. Small talk is a skill.'},
 {id:'thu-trang',n:'Ms. Phạm Thu Trang',c:'an-khanh',sp:['IELTS','Teens'],y:6,cert:'IELTS 8.0 · Cử nhân Sư phạm Anh',ph:'',q:'Bài Viết tốt là bài rõ ràng. Tôi chữa từng câu và giải thích vì sao.'},
 {id:'hannah',n:'Ms. Hannah Moore',c:'dong-da',sp:['Kids','Phát âm'],y:5,cert:'CELTA · Cử nhân Giáo dục mầm non',ph:'1580489944761-15a19d654956',q:'Songs, stories and lots of movement. Children remember what they enjoy.'},
 {id:'gia-bao',n:'Mr. Đỗ Gia Bảo',c:'long-bien',sp:['Teens','IELTS'],y:6,cert:'IELTS 8.0 · Thạc sĩ TESOL',ph:'',q:'Tôi dạy học sinh cách tự học: ghi chép, ôn tập ngắt quãng và tự chấm bài.'},
 {id:'ngoc-anh',n:'Ms. Vũ Ngọc Anh',c:'online',sp:['Giao tiếp','Công sở'],y:10,cert:'Thạc sĩ Quản trị · CELTA',ph:'1544005313-94ddf0286df2',q:'Người đi làm cần học thứ dùng được ngay sáng mai. Mỗi buổi đều có một tình huống công việc thật.'},
 {id:'rosa',n:'Ms. Rosa Martin',c:'phu-nhuan',sp:['Kids','Teens'],y:12,cert:'Thạc sĩ Giáo dục · DELTA',ph:'1573497019940-1c28c88b4f3e',q:'Every child has a voice in English. My job is to make the classroom safe enough to use it.'},
 {id:'nhat-nam',n:'Mr. Hoàng Nhật Nam',c:'cau-giay',sp:['Phát âm','Giao tiếp'],y:7,cert:'Cử nhân Ngôn ngữ Anh · TESOL',ph:'',q:'Phát âm đúng giúp nghe tốt hơn. Tôi bắt đầu từ những âm người Việt hay nhầm.'},
 {id:'khanh-linh',n:'Ms. Đặng Khánh Linh',c:'an-khanh',sp:['Kids'],y:5,cert:'Cử nhân Sư phạm Anh · TKT',ph:'',q:'Tôi gửi phụ huynh nhận xét ngắn sau mỗi buổi để bố mẹ biết hôm nay con học gì.'},
 {id:'tom',n:'Mr. Tom Fletcher',c:'dong-da',sp:['IELTS','Giao tiếp'],y:9,cert:'CELTA · Cử nhân Văn học Anh',ph:'',q:'Speaking practice should feel like a real conversation, not an interrogation.'}
];
D.specs=['Kids','Teens','IELTS','Giao tiếp','Phát âm','Công sở'];
/* lịch khai giảng: [khoá, cơ sở, ngày, lịch, giờ, buổi, tổng chỗ, đã giữ] */
D.classes=[
 ['sunny-kids','ben-thanh','21/11/2026','T7 – CN','08:30–10:00','cuoi-tuan',14,11],
 ['ielts-intensive','cau-giay','23/11/2026','T2 – T4 – T6','18:30–20:30','toi',18,15],
 ['sunny-starters','phu-nhuan','24/11/2026','T3 – T5','16:30–17:30','chieu',10,4],
 ['giao-tiep','online','24/11/2026','T3 – T5','20:00–21:30','toi',12,7],
 ['teens-bridge','dong-da','25/11/2026','T4 – T6','17:30–19:00','chieu',16,13],
 ['ielts-foundation','ben-thanh','28/11/2026','T7 – CN','14:00–16:00','cuoi-tuan',18,9],
 ['phonics','online','28/11/2026','T7 – CN','09:00–09:45','cuoi-tuan',6,5],
 ['sunny-kids','long-bien','29/11/2026','T7 – CN','15:00–16:30','cuoi-tuan',14,6],
 ['cong-so','online','30/11/2026','T2 – T4','19:30–21:00','toi',10,3],
 ['ielts-junior','an-khanh','01/12/2026','T3 – T5','18:00–20:00','toi',16,12],
 ['ielts-intensive','ben-thanh','02/12/2026','T2 – T4 – T6','18:30–20:30','toi',18,10],
 ['sunny-starters','cau-giay','05/12/2026','T7 – CN','09:00–10:00','cuoi-tuan',10,8],
 ['teens-bridge','an-khanh','05/12/2026','T7 – CN','10:15–11:45','cuoi-tuan',16,7],
 ['giao-tiep','phu-nhuan','07/12/2026','T2 – T4','08:30–10:00','sang',12,5],
 ['ielts-advanced','cau-giay','08/12/2026','T3 – T5 – T7','18:30–20:30','toi',12,10],
 ['sunny-kids','dong-da','12/12/2026','T7 – CN','14:00–15:30','cuoi-tuan',14,3],
 ['ielts-foundation','long-bien','14/12/2026','T2 – T4 – T6','18:00–20:00','toi',18,4],
 ['cong-so','ben-thanh','15/12/2026','T3 – T5','12:00–13:30','sang',10,6],
 ['ielts-junior','dong-da','19/12/2026','T7 – CN','08:30–10:30','cuoi-tuan',16,2],
 ['ielts-intensive','online','05/01/2027','T3 – T5 – T7','20:00–22:00','toi',18,5],
 ['sunny-starters','an-khanh','09/01/2027','T7 – CN','08:30–09:30','cuoi-tuan',10,1],
 ['teens-bridge','ben-thanh','11/01/2027','T2 – T4','17:30–19:00','chieu',16,4]
].map(function(r,i){return {id:'L'+(101+i),co:r[0],c:r[1],date:r[2],days:r[3],time:r[4],ses:r[5],tot:r[6],taken:r[7]}});
D.sessions=[['sang','Buổi sáng'],['chieu','Buổi chiều'],['toi','Buổi tối'],['cuoi-tuan','Cuối tuần']];
D.posts=[
 {id:'bai-viet',href:'bai-viet/',cat:'Góc phụ huynh',t:'Con nên bắt đầu học tiếng Anh lúc mấy tuổi? Gợi ý theo từng giai đoạn',d:'Không có “tuổi vàng” chung cho mọi bé. Điều quan trọng là học đúng cách ở đúng giai đoạn.',date:'10/11/2026',ph:'1503676260728-1c00da094a0b',min:8},
 {id:'long-bien',href:'tin-tuc/#tin-long-bien',cat:'Tin tức',t:'Sunward Long Biên đón học viên từ tháng 11',d:'Cơ sở thứ sáu với 9 phòng học, góc đọc sách và khu chờ có ghế cho phụ huynh.',date:'02/11/2026',ph:'1577896851231-70ef18881754',min:3},
 {id:'15-phut',href:'tin-tuc/#tin-15-phut',cat:'Góc học tập',t:'5 thói quen 15 phút mỗi ngày giúp con nghe tốt hơn',d:'Nghe lại bài hát cũ, kể lại truyện bằng tranh, chơi “đoán từ” khi đi xe… những việc nhỏ cộng dồn.',date:'28/10/2026',ph:'1588072432836-e10032774350',min:5},
 {id:'speaking-p2',href:'tin-tuc/#tin-speaking-p2',cat:'Góc học tập',t:'IELTS Speaking Part 2: nói đủ 2 phút mà không bí ý',d:'Một khung ghi chú 4 ô trong 1 phút chuẩn bị, kèm bài nói mẫu đã chú thích.',date:'21/10/2026',ph:'1531496378573-7be09a2697d8',min:6},
 {id:'trai-he',href:'tin-tuc/#tin-trai-he',cat:'Tin tức',t:'Trại hè Sunward 2027 mở đăng ký sớm',d:'Hai tuần học bằng dự án: làm phim ngắn, làm báo tường và một buổi “chợ phiên” toàn tiếng Anh.',date:'15/10/2026',ph:'1509062522246-3755977927d7',min:4},
 {id:'cong-so',href:'tin-tuc/#tin-cong-so',cat:'Góc học tập',t:'Viết email công việc: 6 câu mở đầu thay cho “I am writing to…”',d:'Mở email gọn, lịch sự và đi thẳng vào việc, kèm ví dụ cho từng tình huống.',date:'08/10/2026',ph:'1517245386807-bb43f82c33c4',min:4}
];
D.events=[
 {t:'Ngày hội Đọc sách tiếng Anh',c:'ben-thanh',date:'2026-11-22T09:00',when:'22/11/2026 · 09:00–11:30',d:'Bé chọn sách, nghe giáo viên kể chuyện và làm bookmark. Phù hợp 4–10 tuổi.'},
 {t:'Thi thử IELTS trên giấy, có chấm Viết và Nói',c:'cau-giay',date:'2026-11-29T08:00',when:'29/11/2026 · 08:00–12:00',d:'Đủ 4 kỹ năng, nhận nhận xét chi tiết sau 3 ngày. Giới hạn 40 chỗ.'},
 {t:'Workshop phụ huynh: đọc hiểu báo cáo tiến độ',c:'online',date:'2026-12-03T20:00',when:'03/12/2026 · 20:00–21:00',d:'Cách xem điểm từng kỹ năng, nhận xét của giáo viên và việc nên làm cùng con ở nhà.'},
 {t:'Christmas Show của học viên Kids',c:'dong-da',date:'2026-12-20T15:00',when:'20/12/2026 · 15:00–17:00',d:'Các lớp Kids biểu diễn kịch ngắn và hát. Phụ huynh đăng ký trước để giữ ghế.'}
];
D.pages=[
 ['','Trang chủ','Hệ thống Anh ngữ cho học viên từ 4 tuổi đến người đi làm'],
 ['khoa-hoc/','Khoá học','Lọc khoá theo độ tuổi, mục tiêu và hình thức học'],
 ['chuong-trinh-ielts/','Chương trình IELTS','Lộ trình 3 cấp, giáo trình, học phí mẫu, lịch lớp'],
 ['kiem-tra-trinh-do/','Kiểm tra trình độ','12 câu nghe, đọc, ngữ pháp; xếp cấp độ CEFR'],
 ['lich-khai-giang/','Lịch khai giảng','Lớp sắp mở theo cơ sở, khoá, buổi; giữ chỗ'],
 ['giao-vien/','Giáo viên','Đội ngũ theo cơ sở và chuyên môn'],
 ['co-so/','Cơ sở','6 cơ sở tại TP.HCM và Hà Nội, giờ mở cửa'],
 ['phu-huynh/','Góc phụ huynh','Báo cáo tiến độ, ứng dụng học tập, hỏi đáp học phí'],
 ['tin-tuc/','Tin tức & sự kiện','Tin trung tâm, sự kiện, góc học tập'],
 ['dang-ky-hoc-thu/','Đăng ký học thử','5 bước, nhận mã xác nhận']
];
D.faq=[
 ['Học phí đóng theo cấp hay theo tháng?','Mỗi cấp học khoảng 10–14 tuần, phụ huynh đóng theo cấp. Có thể chia hai lần cho các khoá từ 8.000.000đ trở lên.'],
 ['Nghỉ học có được học bù không?','Học viên nghỉ có báo trước được học bù ở lớp cùng cấp tại bất kỳ cơ sở nào, tối đa 4 buổi mỗi cấp.'],
 ['Có hoàn học phí khi chuyển nhà hoặc thôi học?','Chuyển cơ sở được giữ nguyên học phí. Thôi học trước buổi thứ ba được hoàn phần còn lại sau khi trừ giáo trình.'],
 ['Anh chị em học cùng có ưu đãi không?','Từ người thứ hai trong gia đình giảm 5% học phí mỗi cấp. Ưu đãi không cộng dồn với chương trình khác.'],
 ['Học thử có mất phí không?','Buổi học thử và bài kiểm tra trình độ đều miễn phí. Sau buổi học, giáo viên tư vấn lớp phù hợp, không bắt buộc đăng ký.']
];
D.levels=[['Pre-A1','Bắt đầu'],['A1','Sơ cấp'],['A2','Sơ trung cấp'],['B1','Trung cấp'],['B2','Trung cao cấp'],['C1','Cao cấp']];
function course(id){for(var i=0;i<D.courses.length;i++)if(D.courses[i].id===id)return D.courses[i]}
function campus(id){for(var i=0;i<D.campus.length;i++)if(D.campus[i].id===id)return D.campus[i]}

/* ---------- icon sprite ---------- */
var P={
 ar:'<path d="M5 12h14M13 6l6 6-6 6"/>',al:'<path d="M19 12H5M11 6l-6 6 6 6"/>',up:'<path d="M12 19V5M6 11l6-6 6 6"/>',dn:'<path d="m6 9 6 6 6-6"/>',
 search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',menu:'<path d="M4 7h16M4 12h16M4 17h10"/>',x:'<path d="M6 6l12 12M18 6 6 18"/>',
 check:'<path d="m5 12.5 4.5 4.5L19 7.5"/>',heart:'<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20Z"/>',
 clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',pin:'<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.4"/>',
 cal:'<rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M8 3v4M16 3v4M3.5 10h17"/>',user:'<circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20c1.3-3.6 4.2-5.4 7.5-5.4s6.2 1.8 7.5 5.4"/>',
 users:'<circle cx="9" cy="9" r="3.4"/><path d="M3 19.5c.9-3.2 3.3-4.8 6-4.8s5.1 1.6 6 4.8"/><path d="M15.5 5.8a3.2 3.2 0 0 1 0 6.3M17.5 14.8c1.9.6 3 2.1 3.5 4.7"/>',
 book:'<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15Z"/><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5"/>',
 head:'<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3.5" y="13.5" width="4" height="6.5" rx="1.6"/><rect x="16.5" y="13.5" width="4" height="6.5" rx="1.6"/>',
 play:'<path d="M8 5.5v13l10.5-6.5L8 5.5Z" fill="currentColor"/>',pause:'<path d="M8.5 5.5v13M15.5 5.5v13" stroke-width="3"/>',
 phone:'<path d="M6.6 3.5h2.6l1.4 4-2 1.3a11 11 0 0 0 6.6 6.6l1.3-2 4 1.4v2.6a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z"/>',
 mail:'<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="m4 7 8 6 8-6"/>',globe:'<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.4 2.6 3.5 5.4 3.5 8.5s-1.1 5.9-3.5 8.5c-2.4-2.6-3.5-5.4-3.5-8.5S9.6 6.1 12 3.5Z"/>',
 monitor:'<rect x="3" y="4.5" width="18" height="12" rx="2.5"/><path d="M8.5 20h7M12 16.5V20"/>',chart:'<path d="M4 20V10M10 20V4M16 20v-7M21 20H3"/>',
 chat:'<path d="M5 18.5 3.5 21l.8-4A8 8 0 1 1 8 19.6"/><path d="M8.5 11h7M8.5 14h4"/>',shield:'<path d="M12 3 5 6v5.5c0 4.4 3 8 7 9.5 4-1.5 7-5.1 7-9.5V6l-7-3Z"/><path d="m9 12 2.2 2.2L15.5 10"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/>',
 cap:'<path d="m2.5 9 9.5-4.5L21.5 9 12 13.5 2.5 9Z"/><path d="M6.5 11v5c1.6 1.6 3.4 2.4 5.5 2.4s3.9-.8 5.5-2.4v-5M21.5 9v5"/>',
 pen:'<path d="M15.5 4.5 19.5 8.5 8.5 19.5H4.5v-4l11-11Z"/><path d="m13 7 4 4"/>',target:'<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.8"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/>',
 app:'<rect x="6.5" y="2.5" width="11" height="19" rx="3"/><path d="M10.5 18.5h3"/>',bell:'<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15l1.5-2Z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
 wallet:'<rect x="3" y="6" width="18" height="13.5" rx="3"/><path d="M3 9.5h18M15.5 14h2"/>',trash:'<path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13"/>',
 park:'<rect x="4" y="3.5" width="16" height="17" rx="3"/><path d="M9.5 16.5v-9h3.2a2.6 2.6 0 0 1 0 5.2H9.5"/>',coffee:'<path d="M4.5 9h12v5a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5V9Z"/><path d="M16.5 10.5h1.5a2.5 2.5 0 0 1 0 5h-1.6M8 3.5v2.5M12 3.5v2.5"/>',
 spark:'<path d="M12 3.5 13.8 10.2 20.5 12l-6.7 1.8L12 20.5l-1.8-6.7L3.5 12l6.7-1.8L12 3.5Z"/>',ear:'<path d="M7 9.5a5 5 0 0 1 10 0c0 3-2.6 3.9-3.3 6.2-.5 1.6-1.5 3.3-3.7 3.3a3 3 0 0 1-3-3"/><path d="M10 10a2 2 0 0 1 4 0c0 1.3-1.5 1.6-1.5 3"/>',
 grid:'<rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/>',
 fb:'<path d="M14.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.6V4.4a20 20 0 0 0-2.4-.1c-2.3 0-3.9 1.4-3.9 4v2.2H8.8v3h2.6V21" fill="currentColor" stroke="none"/>',
 yt:'<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="m10 9 5 3-5 3V9Z" fill="currentColor"/>',
 tt:'<path d="M14 3.5v11.2a3.3 3.3 0 1 1-3.3-3.3M14 3.5c.4 2.6 2.1 4.2 5 4.5"/>'
};
var sp='<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">';
for(var k in P)sp+='<symbol id="i-'+k+'" viewBox="0 0 24 24">'+P[k]+'</symbol>';
body.insertAdjacentHTML('afterbegin',sp+'</svg>');
function ic(n,c){return '<svg class="ico'+(c?' '+c:'')+'" aria-hidden="true"><use href="#i-'+n+'"/></svg>'}

/* ---------- header / footer ---------- */
var LOGO='<svg viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="12" fill="#0E5E66"/><path d="M8 27a12 12 0 0 1 24 0" fill="#F2B33D"/><path d="M6 31h28" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/><path d="M20 8v4M10.5 12l2.4 2.8M29.5 12l-2.4 2.8" stroke="#F2B33D" stroke-width="2.4" stroke-linecap="round"/></svg>';
var NAV=[['khoa-hoc/','Khoá học','khoa-hoc'],['kiem-tra-trinh-do/','Kiểm tra trình độ','kiem-tra'],['lich-khai-giang/','Lịch khai giảng','lich'],['giao-vien/','Giáo viên','giao-vien'],['co-so/','Cơ sở','co-so'],['phu-huynh/','Phụ huynh','phu-huynh'],['tin-tuc/','Tin tức','tin-tuc']];
var curMap={'chuong-trinh-ielts':'khoa-hoc','bai-viet':'tin-tuc'};
var cur=curMap[PAGE]||PAGE;
function navLinks(cls){return NAV.map(function(n){return '<a class="'+cls+'" href="'+ROOT+n[0]+'"'+(cur===n[2]?' aria-current="page"':'')+'>'+n[1]+(cls==='m'?ic('ar','s'):'')+'</a>'}).join('')}
var H=$('#site-header');
if(H){H.innerHTML='<header class="hdr" id="hdr"><div class="wrap hdr-in">'+
 '<a class="logo" href="'+ROOT+'" aria-label="Sunward English, về trang chủ">'+LOGO+'<span><b>Sunward English</b><small>Hệ thống Anh&nbsp;ngữ</small></span></a>'+
 '<nav class="nav" aria-label="Menu chính">'+navLinks('')+'</nav>'+
 '<div class="hdr-act"><button class="icon-btn" type="button" id="sOpen" aria-label="Tìm trong website">'+ic('search')+'</button>'+
 '<a class="btn btn-sun btn-s hdr-cta" href="'+ROOT+'dang-ky-hoc-thu/">Học&nbsp;thử miễn&nbsp;phí</a>'+
 '<button class="icon-btn burger" type="button" id="burger" aria-label="Mở menu" aria-expanded="false" aria-controls="mnav">'+ic('menu')+'</button></div>'+
 '</div></header>'+
 '<div class="mnav" id="mnav" aria-label="Menu điện thoại">'+navLinks('m')+
 '<a class="btn btn-p" href="'+ROOT+'dang-ky-hoc-thu/">Đăng ký học&nbsp;thử</a></div>';
}
var F=$('#site-footer');
if(F){
 var cs=D.campus.filter(function(c){return c.city!=='online'});
 F.innerHTML='<footer class="ftr"><div class="wrap"><div class="ftr-top">'+
 '<div><a class="logo" href="'+ROOT+'">'+LOGO+'<span><b>Sunward English</b><small>Hệ thống Anh&nbsp;ngữ</small></span></a>'+
 '<p class="about">Tiếng Anh cho học viên từ 4 tuổi đến người đi làm, tại 6 cơ sở ở TP.HCM, Hà Nội và lớp trực tuyến.</p>'+
 '<div class="soc"><a href="#" aria-label="Facebook (mẫu)">'+ic('fb')+'</a><a href="#" aria-label="YouTube (mẫu)">'+ic('yt')+'</a><a href="#" aria-label="TikTok (mẫu)">'+ic('tt')+'</a><a href="#" aria-label="Zalo (mẫu)" style="font:700 11px/1 var(--head)">Zalo</a></div></div>'+
 '<div><h4>Sơ đồ trang</h4><ul>'+D.pages.map(function(p){return '<li><a href="'+ROOT+p[0]+'">'+p[1]+'</a></li>'}).join('')+'<li><a href="'+ROOT+'bai-viet/">Bài viết mẫu</a></li></ul></div>'+
 '<div><h4>Chương trình</h4><ul>'+D.courses.slice(0,9).map(function(c){return '<li><a href="'+ROOT+(c.detail?'chuong-trinh-ielts/':'khoa-hoc/#'+c.id)+'">'+c.n+'</a></li>'}).join('')+'</ul></div>'+
 '<div><h4>Liên hệ</h4><div class="ftr-map">'+miniMap()+'</div><ul>'+
 '<li><a href="tel:0900000000">Hotline 0900&nbsp;000&nbsp;000</a></li><li>Email: tuvan@sunward-mau.vn</li>'+
 '<li>Cơ sở mở cửa: Thứ Hai – Thứ Sáu 08:00–21:00, cuối tuần 07:30–18:00</li><li><a href="'+ROOT+'co-so/">Xem '+cs.length+' cơ sở và chỉ&nbsp;đường</a></li></ul></div>'+
 '</div><div class="ftr-bot"><p>© 2026 Sunward English (thương hiệu mẫu).</p><p>Nội dung mẫu: tên thương hiệu, học phí, giáo viên, lịch học, đánh giá và hình ảnh chỉ để minh hoạ giao diện. Ảnh: Unsplash.</p><p>IELTS là thương hiệu của các đơn vị sở hữu; mẫu này không phải đơn vị tổ chức thi.</p></div></div></footer>';
}
function miniMap(){
 return '<svg viewBox="0 0 280 120" role="img" aria-label="Bản đồ minh hoạ: cơ sở ở Hà Nội và TP.HCM"><path d="M40 20c30 10 40 30 60 40s70 10 90 30 40 18 60 20" fill="none" stroke="#2C6C72" stroke-width="2" stroke-dasharray="4 6"/>'+
 '<circle cx="40" cy="20" r="7" fill="#F2B33D"/><text x="54" y="25" fill="#E6F2F0" font-size="12" font-family="Lexend">Hà Nội · 3</text>'+
 '<circle cx="250" cy="110" r="7" fill="#F2B33D"/><text x="150" y="104" fill="#E6F2F0" font-size="12" font-family="Lexend">TP.HCM · 3</text></svg>';
}

/* ---------- header behaviour, menu ---------- */
var hdr=$('#hdr'),burger=$('#burger'),mnav=$('#mnav'),badge=$('#ktBadge');
function setMenu(o){if(!mnav)return;mnav.classList.toggle('open',o);burger.setAttribute('aria-expanded',o);burger.setAttribute('aria-label',o?'Đóng menu':'Mở menu');burger.innerHTML=ic(o?'x':'menu');body.classList.toggle('lock',o)}
if(burger)burger.addEventListener('click',function(){setMenu(!mnav.classList.contains('open'))});
if(mnav)mnav.addEventListener('click',function(e){if(e.target.closest('a'))setMenu(false)});
var lastW=innerWidth;
addEventListener('resize',function(){if(innerWidth!==lastW){lastW=innerWidth;if(innerWidth>1180)setMenu(false)}});
var tt=document.createElement('button');tt.className='totop';tt.type='button';tt.setAttribute('aria-label','Lên đầu trang');tt.innerHTML=ic('up');body.appendChild(tt);
tt.addEventListener('click',function(){scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})});
function onScroll(){var y=scrollY;if(hdr)hdr.classList.toggle('sc',y>8);if(badge)badge.classList.toggle('show',y>innerHeight*.85);tt.classList.toggle('show',y>innerHeight*1.2)}
addEventListener('scroll',onScroll,{passive:true});onScroll();

/* ---------- toast ---------- */
var toastEl=document.createElement('div');toastEl.className='toast';toastEl.setAttribute('role','status');toastEl.setAttribute('aria-live','polite');body.appendChild(toastEl);
var tT;function toast(m){toastEl.textContent=m;toastEl.classList.add('show');clearTimeout(tT);tT=setTimeout(function(){toastEl.classList.remove('show')},2800)}

/* ---------- tìm kiếm trong site ---------- */
var IDX=[];
D.pages.forEach(function(p){IDX.push({k:'Trang',t:p[1],d:p[2],h:ROOT+p[0]})});
D.courses.forEach(function(c){IDX.push({k:'Khoá học',t:c.n+' · '+c.sub,d:c.ages+' · '+c.d,h:ROOT+(c.detail?'chuong-trinh-ielts/':'khoa-hoc/#'+c.id)})});
D.teachers.forEach(function(t){IDX.push({k:'Giáo viên',t:t.n,d:t.sp.join(', ')+' · '+campus(t.c).n,h:ROOT+'giao-vien/#'+t.id})});
D.campus.forEach(function(c){IDX.push({k:'Cơ sở',t:c.n,d:c.ward,h:ROOT+'co-so/#'+c.id})});
D.posts.forEach(function(p){IDX.push({k:p.cat,t:p.t,d:p.d,h:ROOT+p.href})});
D.events.forEach(function(e){IDX.push({k:'Sự kiện',t:e.t,d:e.when,h:ROOT+'tin-tuc/#su-kien'})});
D.faq.forEach(function(f){IDX.push({k:'Hỏi đáp',t:f[0],d:f[1],h:ROOT+'phu-huynh/#hoi-dap'})});
IDX.forEach(function(r){r.f=fold(r.t+' '+r.d+' '+r.k)});
var sd=document.createElement('div');sd.className='sdlg';sd.id='sdlg';sd.setAttribute('role','dialog');sd.setAttribute('aria-modal','true');sd.setAttribute('aria-label','Tìm trong website');
sd.innerHTML='<div class="sbox"><div class="sin">'+ic('search')+'<label class="sr" for="sQ">Từ khoá</label><input id="sQ" type="search" placeholder="Tìm khoá học, giáo viên, cơ sở, bài viết…" autocomplete="off"><button class="icon-btn" type="button" id="sClose" aria-label="Đóng tìm kiếm">'+ic('x')+'</button></div><div class="sres" id="sRes" role="listbox"></div><div class="shint">Gợi ý: <button class="chip" type="button" data-q="IELTS">IELTS</button><button class="chip" type="button" data-q="4 tuổi">4 tuổi</button><button class="chip" type="button" data-q="Cầu Giấy">Cầu Giấy</button><button class="chip" type="button" data-q="học phí">học phí</button></div></div>';
body.appendChild(sd);
var sQ=$('#sQ'),sRes=$('#sRes'),sSel=0,lastFocus=null;
function hiL(t,q){if(!q)return esc(t);var ft=fold(t),i=ft.indexOf(q);return i<0?esc(t):esc(t.slice(0,i))+'<mark>'+esc(t.slice(i,i+q.length))+'</mark>'+esc(t.slice(i+q.length))}
function runSearch(){
 var q=fold(sQ.value.trim()),words=q.split(/\s+/).filter(Boolean),r;
 if(!words.length)r=IDX.filter(function(x){return x.k==='Trang'}).slice(1);
 else r=IDX.filter(function(x){return words.every(function(w){return x.f.indexOf(w)>-1})});
 sSel=0;
 sRes.innerHTML=r.length?r.slice(0,12).map(function(x,i){return '<a href="'+x.h+'" role="option"'+(i===0?' class="on"':'')+'><span class="k">'+esc(x.k)+'</span><span><b>'+hiL(x.t,q)+'</b><small>'+esc(x.d.slice(0,110))+'</small></span></a>'}).join(''):'<p class="empty">Chưa tìm thấy “'+esc(sQ.value)+'”. Thử từ khoá ngắn hơn, ví dụ “Kids” hoặc “Hà Nội”.</p>';
}
function openS(){lastFocus=document.activeElement;sd.classList.add('open');body.classList.add('lock');sQ.value='';runSearch();setTimeout(function(){sQ.focus()},30)}
function closeS(){sd.classList.remove('open');if(!(mnav&&mnav.classList.contains('open')))body.classList.remove('lock');if(lastFocus)lastFocus.focus()}
document.addEventListener('click',function(e){if(e.target.closest('#sOpen,[data-search]')){e.preventDefault();openS()}});
$('#sClose',sd).addEventListener('click',closeS);
sd.addEventListener('click',function(e){if(e.target===sd)closeS();var c=e.target.closest('[data-q]');if(c){sQ.value=c.getAttribute('data-q');runSearch();sQ.focus()}});
sQ.addEventListener('input',runSearch);
sQ.addEventListener('keydown',function(e){var a=$$('a',sRes);if(!a.length)return;
 if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();a[sSel].classList.remove('on');sSel=(sSel+(e.key==='ArrowDown'?1:-1)+a.length)%a.length;a[sSel].classList.add('on');a[sSel].scrollIntoView({block:'nearest'})}
 if(e.key==='Enter'){e.preventDefault();location.href=a[sSel].getAttribute('href')}});
document.addEventListener('keydown',function(e){
 if(e.key==='Escape'){if(sd.classList.contains('open'))closeS();else if(mnav&&mnav.classList.contains('open')){setMenu(false);burger.focus()}else{var dl=$('.dlg.open');if(dl&&window.SW.closeDlg)window.SW.closeDlg()}}
 if(e.key==='/'&&!/input|textarea|select/i.test(document.activeElement.tagName)&&!sd.classList.contains('open')){e.preventDefault();openS()}
});

/* ---------- hiện dần, đếm số ---------- */
var rv=$$('.rv');
if('IntersectionObserver' in window){
 var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'});
 rv.forEach(function(el){var r=el.getBoundingClientRect();if(r.top<innerHeight)el.classList.add('in');else io.observe(el)});
}else rv.forEach(function(el){el.classList.add('in')});
function countUp(el){var to=+el.getAttribute('data-count'),t0=null,dur=1100;if(matchMedia('(prefers-reduced-motion: reduce)').matches){el.textContent=to;return}
 function f(t){if(!t0)t0=t;var p=Math.min(1,(t-t0)/dur);el.textContent=Math.round(to*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)}requestAnimationFrame(f)}
var cn=$$('[data-count]');
if('IntersectionObserver' in window){var io2=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){countUp(e.target);io2.unobserve(e.target)}})});cn.forEach(function(el){io2.observe(el)})}

/* ---------- xuất cho từng trang ---------- */
window.SW={D:D,$:$,$$:$$,esc:esc,fold:fold,money:money,store:store,img:img,ic:ic,toast:toast,course:course,campus:campus,ROOT:ROOT};
})();
