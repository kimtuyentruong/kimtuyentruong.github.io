/* IRONVERT Athletic Club (mẫu gym-1) — JS dùng chung: dữ liệu mẫu, header/footer, tìm kiếm, lưu trạng thái */
(function(){
'use strict';
var KEY='gym-1:v1';
var body=document.body,ROOT=body.getAttribute('data-root')||'./',PAGE=body.getAttribute('data-page')||'home';
function $(s,c){return (c||document).querySelector(s)}
function $$(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function fold(s){return String(s).normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase()}
function money(n){return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,'.')+'đ'}
function nb(s){return String(s).replace(/ /g,' ')}
var store={
 all:function(){try{return JSON.parse(localStorage.getItem(KEY))||{}}catch(e){return {}}},
 get:function(k,d){var a=store.all();return a[k]===undefined?d:a[k]},
 set:function(k,v){try{var a=store.all();a[k]=v;localStorage.setItem(KEY,JSON.stringify(a))}catch(e){}}
};
var U='https://images.unsplash.com/photo-';
function img(id,w,h){return U+id+'?auto=format&fit=crop&w='+(w||900)+(h?'&h='+h:'')+'&q=80'}

/* ---------- dữ liệu mẫu ---------- */
var D={};
D.groups={'suc-manh':'Sức mạnh','vo-thuat':'Võ thuật','than-tam':'Yoga & Pilates','cardio':'Cardio & HIIT','phuc-hoi':'Bơi & phục hồi','ca-nhan':'Kèm 1–1'};
D.locs=[
 {id:'ben-thanh',n:'IRONVERT Bến Thành',s:'Bến Thành',ward:'Phường Bến Thành, TP.HCM',addr:'Toà nhà mẫu, đường Lê Thánh Tôn',area:'2.400 m²',floors:4,pool:true,park:'Gửi xe máy tầng hầm, ô tô bãi lân cận',ph:'1540497077202-7c8a3999166f',x:300,y:250,am:['Hồ bơi 4 làn','Xông hơi khô','Xông hơi ướt','Phòng võ có sàn đài','Phòng Reformer','Tủ đồ khoá số','Khăn tắm','Bãi gửi xe máy'],note:'Cơ sở lớn, bốn tầng, gần chợ Bến Thành. Có sàn đài tập võ và hồ bơi trên tầng thượng.'},
 {id:'an-khanh',n:'IRONVERT An Khánh',s:'An Khánh',ward:'Phường An Khánh, TP.HCM',addr:'Khu phố mẫu, đường Trần Não',area:'3.100 m²',floors:3,pool:true,park:'Bãi ô tô và xe máy trong khuôn viên',ph:'1637666062717-1c6bcfa4a4df',x:440,y:190,am:['Hồ bơi 6 làn','Xông hơi khô','Bể ngâm lạnh','Phòng võ','Phòng Cycling','Khu Functional ngoài trời','Tủ đồ khoá số','Bãi ô tô'],note:'Khuôn viên rộng, có khu Functional ngoài trời và bãi đỗ ô tô. Thường đông vào buổi tối các ngày trong tuần.'},
 {id:'cau-giay',n:'IRONVERT Cầu Giấy',s:'Cầu Giấy',ward:'Phường Cầu Giấy, Hà Nội',addr:'Toà nhà mẫu, đường Dương Đình Nghệ',area:'1.800 m²',floors:3,pool:false,park:'Gửi xe máy tầng hầm',ph:'1593079831268-3381b0db4a77',x:0,y:0,am:['Xông hơi khô','Phòng võ','Phòng Yoga & Pilates','Phòng Cycling','Tủ đồ khoá số','Khăn tắm','Bãi gửi xe máy'],note:'Cơ sở đầu tiên ở Hà Nội. Chưa có hồ bơi; có xông hơi khô và phòng Yoga hướng cửa sổ.'}
];
D.disc=[
 {id:'gym',n:'Gym & Sức mạnh',g:'suc-manh',int:3,dur:'Tự do hoặc 60 phút',lv:'Mọi trình độ',ph:'1534438327276-14e5300c3a48',pos:'50% 50%',d:'Khu tạ tự do, máy tập và khu Strength Lab có HLV đứng sàn. Có giáo án theo tuần cho người mới.',locs:['ben-thanh','an-khanh','cau-giay'],k:'ta tạ tay máy tập cơ bắp tăng cơ strength'},
 {id:'kickboxing',n:'Kickboxing',g:'vo-thuat',int:4,dur:'60 phút',lv:'Mọi trình độ',ph:'1517438322307-e67111335449',pos:'50% 35%',d:'Đấm, đá, phối hợp đòn trên đích đỡ. Lớp chia ba cấp, người mới tập kỹ thuật trước khi vào bài cường độ cao.',locs:['ben-thanh','an-khanh','cau-giay'],k:'vo dam da găng đích đỡ',url:'kickboxing/'},
 {id:'muay-thai',n:'Muay Thái',g:'vo-thuat',int:5,dur:'75 phút',lv:'Có nền tảng',ph:'1549719386-74dfcbf7dbed',pos:'50% 50%',d:'Đòn gối, chỏ và ôm ghì. Lớp dành cho người đã tập võ hoặc học xong cấp 1 Kickboxing.',locs:['ben-thanh','cau-giay'],k:'muay thai vo goi cho'},
 {id:'boxing',n:'Boxing',g:'vo-thuat',int:4,dur:'60 phút',lv:'Mọi trình độ',ph:'1583473848882-f9a5bc7fd2ee',pos:'50% 60%',d:'Bộ chân, phòng thủ và tổ hợp đòn tay. Có buổi kỹ thuật nhẹ cho người mới và buổi bao cát cho người đã quen.',locs:['ben-thanh','an-khanh'],k:'quyen anh dam bao cat'},
 {id:'yoga',n:'Yoga',g:'than-tam',int:2,dur:'60–75 phút',lv:'Mọi trình độ',ph:'1588286840104-8957b019727f',pos:'50% 50%',d:'Hatha, Vinyasa và Yin. Lớp sáng sớm giữ yên tĩnh, lớp tối tập trung giãn cơ sau giờ làm.',locs:['ben-thanh','an-khanh','cau-giay'],k:'yoga hatha vinyasa yin gian co tho'},
 {id:'pilates',n:'Pilates',g:'than-tam',int:2,dur:'50 phút',lv:'Mọi trình độ',ph:'1518611012118-696072aa579a',pos:'50% 50%',d:'Pilates thảm và Reformer nhóm nhỏ tối đa 8 người. Tập sức mạnh vùng lõi, tư thế và kiểm soát hơi thở.',locs:['ben-thanh','an-khanh','cau-giay'],k:'pilates reformer core lung tu the'},
 {id:'hiit',n:'HIIT Circuit',g:'cardio',int:5,dur:'45 phút',lv:'Có nền tảng',ph:'1518310383802-640c2de311b2',pos:'50% 40%',d:'Bài tập ngắt quãng theo trạm, đếm giờ trên màn hình. HLV đưa phương án nhẹ hơn cho từng động tác.',locs:['ben-thanh','an-khanh','cau-giay'],k:'hiit cardio dot mo circuit'},
 {id:'cycling',n:'Indoor Cycling',g:'cardio',int:4,dur:'45 phút',lv:'Mọi trình độ',ph:'1520877880798-5ee004e3f11e',pos:'50% 40%',d:'Đạp xe trong nhà theo nhạc, chỉnh lực cản theo sức mình. Phòng tối, đèn theo nhịp, 30 xe.',locs:['ben-thanh','an-khanh','cau-giay'],k:'dap xe spin cycling'},
 {id:'functional',n:'Functional & Mobility',g:'suc-manh',int:3,dur:'50 phút',lv:'Mọi trình độ',ph:'1533681904393-9ab6eee7e408',pos:'50% 50%',d:'Kéo xe trượt, kettlebell, dây thừng và bài linh hoạt khớp. Hợp với người ngồi văn phòng nhiều.',locs:['an-khanh','ben-thanh','cau-giay'],k:'functional kettlebell mobility linh hoat'},
 {id:'boi',n:'Bơi & Phục hồi',g:'phuc-hoi',int:2,dur:'Tự do hoặc 45 phút',lv:'Mọi trình độ',ph:'1576610616656-d3aa5d1f4534',pos:'50% 50%',d:'Hồ bơi trong nhà, lớp bơi người lớn, xông hơi khô/ướt và bể ngâm lạnh (tuỳ cơ sở).',locs:['ben-thanh','an-khanh'],k:'boi ho boi xong hoi phuc hoi ngam lanh sauna'},
 {id:'pt',n:'PT 1 kèm 1',g:'ca-nhan',int:3,dur:'60 phút',lv:'Theo người tập',ph:'1571019614242-c5c5dee9f50b',pos:'50% 40%',d:'Huấn luyện viên riêng lên giáo án theo mục tiêu, theo dõi số đo và điều chỉnh mỗi bốn tuần.',locs:['ben-thanh','an-khanh','cau-giay'],k:'pt ca nhan huan luyen vien rieng kem'}
];
D.coaches=[
 {id:'khoa',n:'Trần Minh Khoa',role:'Trưởng bộ môn Võ',sp:['kickboxing','muay-thai','boxing'],loc:'ben-thanh',yrs:9,ph:'1579758629938-03607ccdbaba',pos:'50% 25%',g:'nam',cert:['Huấn luyện viên Kickboxing cấp quốc gia (mẫu)','Sơ cấp cứu thể thao (mẫu)'],q:'Kỹ thuật đúng trước, tốc độ sau. Người mới không phải vào bài nặng ngay buổi đầu.',bio:'Thi đấu Kickboxing phong trào 6 năm trước khi chuyển sang dạy. Phụ trách giáo án võ cho cả hệ thống.'},
 {id:'vy',n:'Lê Hoàng Vy',role:'Huấn luyện viên Yoga',sp:['yoga','pilates'],loc:'ben-thanh',yrs:7,ph:'1552196563-55cd4e45efb3',pos:'50% 30%',g:'nu',cert:['RYT 500 (mẫu)','Pilates Mat (mẫu)'],q:'Thở chậm lại thì cơ thể mới chịu mở.',bio:'Dạy Hatha và Yin, chuyên các lớp sáng sớm và lớp giãn cơ cho người làm văn phòng.'},
 {id:'ducanh',n:'Nguyễn Đức Anh',role:'PT trưởng – Sức mạnh',sp:['gym','functional','pt'],loc:'ben-thanh',yrs:8,ph:'1611672585731-fa10603fb9e0',pos:'50% 30%',g:'nam',cert:['NASM-CPT (mẫu)','Dinh dưỡng thể thao cơ bản (mẫu)'],q:'Tập đều ba buổi một tuần có giá trị hơn một tuần tập bảy buổi rồi nghỉ.',bio:'Lên giáo án sức mạnh cho người mới và người quay lại tập sau chấn thương nhẹ (phối hợp chỉ định của bác sĩ).'},
 {id:'mai',n:'Đặng Ngọc Mai',role:'Huấn luyện viên Cycling & HIIT',sp:['cycling','hiit'],loc:'ben-thanh',yrs:5,ph:'1594381898411-846e7d193883',pos:'50% 25%',g:'nu',cert:['Indoor Cycling Instructor (mẫu)','ACE Group Fitness (mẫu)'],q:'Nhạc lên, lực cản là của bạn. Không ai bắt bạn đạp theo người bên cạnh.',bio:'Dẫn lớp Cycling theo chủ đề nhạc, giữ nhịp lớp đều để người mới vẫn theo được.'},
 {id:'chi',n:'Bùi Lan Chi',role:'Huấn luyện viên Boxing',sp:['boxing','kickboxing','hiit'],loc:'an-khanh',yrs:6,ph:'1590556409324-aa1d726e5c3c',pos:'40% 30%',g:'nu',cert:['Huấn luyện viên Boxing phong trào (mẫu)','ACE-CPT (mẫu)'],q:'Đấm vào đích đỡ là cách xả stress rất thật.',bio:'Phụ trách lớp Boxing và Kickboxing buổi tối ở An Khánh, có lớp riêng cho nữ.'},
 {id:'thuha',n:'Phạm Thu Hà',role:'Huấn luyện viên Pilates',sp:['pilates','yoga'],loc:'an-khanh',yrs:6,ph:'1571388208497-71bedc66e932',pos:'50% 30%',g:'nu',cert:['Pilates Reformer toàn phần (mẫu)'],q:'Pilates không cần nhanh. Cần đúng và đều.',bio:'Dạy Reformer nhóm nhỏ, chú trọng tư thế và vùng lưng cho người ngồi nhiều.'},
 {id:'bao',n:'Võ Quốc Bảo',role:'Huấn luyện viên Bơi',sp:['boi','functional'],loc:'an-khanh',yrs:10,ph:'1599058945522-28d584b6f0ff',pos:'50% 35%',g:'nam',cert:['Huấn luyện viên bơi (mẫu)','Cứu hộ hồ bơi (mẫu)'],q:'Bơi là kỹ năng sống trước, rồi mới là môn tập.',bio:'Dạy bơi người lớn từ chưa biết bơi đến bơi sải liên tục 400 m, kiêm phụ trách an toàn hồ bơi.'},
 {id:'huy',n:'Huỳnh Gia Huy',role:'Huấn luyện viên Functional',sp:['functional','hiit','cycling','gym'],loc:'an-khanh',yrs:5,ph:'1597452485669-2c7bb5fef90d',pos:'50% 30%',g:'nam',cert:['Kettlebell cấp 1 (mẫu)','Mobility Coach (mẫu)'],q:'Cơ thể khoẻ là cơ thể làm việc nhà, bế con, leo cầu thang không đau.',bio:'Dẫn khu Functional ngoài trời, bài tập hướng tới chuyển động hằng ngày.'},
 {id:'tung',n:'Ngô Thanh Tùng',role:'Huấn luyện viên Võ & Sức mạnh',sp:['muay-thai','kickboxing','gym','functional'],loc:'cau-giay',yrs:7,ph:'1530822847156-5df684ec5ee1',pos:'50% 30%',g:'nam',cert:['Huấn luyện viên Muay Thái (mẫu)','NSCA-CPT (mẫu)'],q:'Giữ khoảng cách, giữ thăng bằng, rồi mới tính sức đánh.',bio:'Phụ trách bộ môn Võ và khu tạ tại Cầu Giấy, có kinh nghiệm thi đấu Muay phong trào.'},
 {id:'linh',n:'Trịnh Khánh Linh',role:'Huấn luyện viên Yoga & Pilates',sp:['yoga','pilates'],loc:'cau-giay',yrs:5,ph:'1609899537878-88d5ba429bdb',pos:'50% 30%',g:'nu',cert:['RYT 200 (mẫu)','Pilates Mat & Reformer (mẫu)'],q:'Mỗi buổi tập là một buổi hẹn với chính mình.',bio:'Dạy Vinyasa và Pilates tại Cầu Giấy, có lớp giãn cơ buổi trưa cho dân văn phòng.'}
];
var T=[
 ['kickboxing',[0,2,4],'06:00','ben-thanh','khoa','Phòng võ',20],['kickboxing',[1,3],'18:30','ben-thanh','khoa','Phòng võ',20],
 ['kickboxing',[0,3,5],'19:00','an-khanh','chi','Phòng võ',18],['kickboxing',[1,4,6],'18:00','cau-giay','tung','Phòng võ',16],
 ['muay-thai',[1,3],'19:30','ben-thanh','khoa','Sàn đài',14],['muay-thai',[0,2],'19:30','cau-giay','tung','Phòng võ',14],
 ['boxing',[0,2,4],'18:30','an-khanh','chi','Phòng võ',18],['boxing',[5],'09:00','ben-thanh','khoa','Sàn đài',16],
 ['yoga',[0,2,4],'06:15','ben-thanh','vy','Phòng Yoga',24],['yoga',[1,3],'19:00','ben-thanh','vy','Phòng Yoga',24],
 ['yoga',[5,6],'08:00','an-khanh','thuha','Phòng Yoga',22],['yoga',[0,2,4],'12:00','cau-giay','linh','Phòng Yoga',20],['yoga',[1,3,6],'19:00','cau-giay','linh','Phòng Yoga',20],
 ['pilates',[1,3,5],'07:00','an-khanh','thuha','Phòng Reformer',8],['pilates',[0,2,4],'17:30','an-khanh','thuha','Phòng Reformer',8],
 ['pilates',[1,4],'12:15','ben-thanh','vy','Phòng Reformer',8],['pilates',[2,5],'18:00','cau-giay','linh','Phòng Yoga',12],
 ['hiit',[0,2,4],'17:30','ben-thanh','mai','Studio 1',22],['hiit',[1,3,5],'06:30','an-khanh','huy','Khu ngoài trời',20],['hiit',[1,3],'06:30','cau-giay','tung','Studio',18],['hiit',[6],'09:00','an-khanh','chi','Studio 1',22],
 ['cycling',[1,3,5],'18:00','ben-thanh','mai','Phòng Cycling',30],['cycling',[0,4],'06:00','ben-thanh','mai','Phòng Cycling',30],['cycling',[0,2,4],'19:00','an-khanh','huy','Phòng Cycling',30],['cycling',[5],'17:00','cau-giay','tung','Phòng Cycling',24],
 ['functional',[0,2,4],'07:00','an-khanh','huy','Khu ngoài trời',16],['functional',[1,3],'17:30','ben-thanh','ducanh','Strength Lab',16],['functional',[2,6],'08:00','cau-giay','tung','Studio',16],
 ['gym',[0,1,2,3,4],'18:00','ben-thanh','ducanh','Strength Lab',12],['gym',[5],'08:30','an-khanh','huy','Khu tạ',12],['gym',[1,3],'17:00','cau-giay','tung','Khu tạ',12],
 ['boi',[1,3,5],'06:00','an-khanh','bao','Hồ bơi',10],['boi',[0,2,6],'19:00','ben-thanh','bao','Hồ bơi tầng thượng',10]
];
D.days=['Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy','Chủ Nhật'];
D.dshort=['T2','T3','T4','T5','T6','T7','CN'];
function hash(s){var h=7;for(var i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))%9973;return h}
D.sessions=[];
T.forEach(function(t){t[1].forEach(function(day){var id=t[0]+'-'+day+'-'+t[2].replace(':','')+'-'+t[3];var bk=Math.min(t[6],Math.round(t[6]*(.35+(hash(id)%60)/100)));D.sessions.push({id:id,disc:t[0],day:day,time:t[2],loc:t[3],coach:t[4],room:t[5],cap:t[6],bk:bk})})});
D.sessions.sort(function(a,b){return a.day-b.day||a.time.localeCompare(b.time)});
D.plans=[
 {id:'base',n:'Base',m:690000,for:'Tập gym và cardio tự do tại một cơ sở chọn sẵn.',f:['Khu tạ, máy tập, cardio','1 cơ sở chọn khi đăng ký','1 buổi định hướng với HLV','Ứng dụng đặt lịch'],x:['Lớp nhóm','Hồ bơi, xông hơi','Buổi PT hằng tháng']},
 {id:'core',n:'Core',m:1190000,hot:true,for:'Toàn bộ lớp nhóm ở cả ba cơ sở: võ, yoga, cycling, HIIT.',f:['Mọi thứ của gói Base','Lớp nhóm không giới hạn','Cả 3 cơ sở','Giữ chỗ trước 7 ngày','2 buổi đo InBody mỗi quý'],x:['Hồ bơi, xông hơi','Buổi PT hằng tháng']},
 {id:'elite',n:'Elite',m:2290000,for:'Gói đầy đủ: thêm hồ bơi, xông hơi, PT hằng tháng và tủ đồ riêng.',f:['Mọi thứ của gói Core','Hồ bơi, xông hơi, bể ngâm lạnh','4 buổi PT mỗi tháng','Tủ đồ riêng, khăn tắm','Giữ chỗ trước 14 ngày','Dẫn 1 bạn tập cùng mỗi tháng'],x:[]}
];
D.terms=[{m:1,off:0,l:'1 tháng'},{m:3,off:.05,l:'3 tháng'},{m:6,off:.1,l:'6 tháng'},{m:12,off:.18,l:'12 tháng'}];
D.addons=[
 {id:'pt10',n:'Gói 10 buổi PT 1 kèm 1',d:'Dùng trong 3 tháng, chọn HLV bất kỳ',p:4500000,once:true},
 {id:'ref8',n:'Gói 8 buổi Reformer nhóm nhỏ',d:'Dành cho gói Base/Core; Elite đã gồm 4 buổi',p:1600000,once:true},
 {id:'locker',n:'Tủ đồ riêng',d:'Giữ đồ qua đêm, khoá số riêng',p:150000,once:false},
 {id:'nutri',n:'Tư vấn dinh dưỡng',d:'2 buổi với chuyên viên dinh dưỡng (mẫu)',p:900000,once:true}
];
D.posts=[
 {id:'kickboxing-tuan-dau',t:'Tuần đầu tập Kickboxing: 7 điều nên biết trước khi đeo găng',c:'Võ thuật',dt:'12/11/2026',min:8,ph:'1517438322307-e67111335449',ex:'Mang gì, ăn gì trước buổi tập, quấn băng tay thế nào và vì sao buổi đầu bạn chưa cần đấm mạnh.',full:true},
 {id:'giu-nhip-3-buoi',t:'Ba buổi mỗi tuần: cách giữ nhịp tập khi bận việc',c:'Thói quen',dt:'05/11/2026',min:6,ph:'1541534741688-6078c6bfb5c5',ex:'Chia lịch theo khung sáng, trưa, tối và chọn lớp ngắn 45 phút cho những tuần nhiều việc.'},
 {id:'reformer-hay-mat',t:'Pilates Reformer hay Pilates thảm: khác nhau ở đâu?',c:'Yoga & Pilates',dt:'29/10/2026',min:5,ph:'1599447421416-3414500d18a5',ex:'Hai hình thức cùng gốc nhưng cảm giác tập khác nhau. Gợi ý chọn theo mục tiêu và ngân sách.'},
 {id:'an-truoc-buoi-toi',t:'Ăn gì trước buổi tập tối sau giờ làm?',c:'Dinh dưỡng',dt:'22/10/2026',min:4,ph:'1490645935967-10de6ba17061',ex:'Bữa nhẹ trước 60–90 phút, uống đủ nước và những món nên tránh. Nội dung tham khảo chung.'},
 {id:'xong-hoi-dung-cach',t:'Xông hơi và ngâm lạnh: dùng thế nào cho an toàn',c:'Phục hồi',dt:'15/10/2026',min:5,ph:'1576610616656-d3aa5d1f4534',ex:'Thời gian mỗi lượt, uống nước, ai nên hỏi bác sĩ trước khi dùng phòng xông.'},
 {id:'cycling-lan-dau',t:'Lần đầu vào lớp Cycling: chỉnh xe cho đúng',c:'Cardio',dt:'08/10/2026',min:4,ph:'1520877880798-5ee004e3f11e',ex:'Độ cao yên, khoảng cách tay lái và cách vặn lực cản để không mỏi gối.'}
];
D.pages=[
 {id:'home',u:'',n:'Trang chủ'},
 {id:'bo-mon',u:'bo-mon/',n:'Bộ môn',d:'11 bộ môn, lọc theo nhóm và cường độ',nav:1},
 {id:'lich-lop',u:'lich-lop/',n:'Lịch lớp',d:'Lịch tuần ở 3 cơ sở, giữ chỗ trước',nav:1},
 {id:'the-thanh-vien',u:'the-thanh-vien/',n:'Thẻ thành viên',d:'So sánh gói, tính giá theo kỳ hạn, chính sách',nav:1},
 {id:'huan-luyen-vien',u:'huan-luyen-vien/',n:'Huấn luyện viên',d:'10 HLV, lọc theo bộ môn và cơ sở',nav:1},
 {id:'co-so',u:'co-so/',n:'Cơ sở',d:'3 cơ sở, sơ đồ tầng, tiện ích',nav:1},
 {id:'cong-cu',u:'cong-cu/',n:'Công cụ',d:'BMI, năng lượng mỗi ngày, quiz chọn bộ môn',nav:1},
 {id:'tin-tuc',u:'tin-tuc/',n:'Tin tức',d:'Bài viết về tập luyện và phục hồi',nav:1},
 {id:'kickboxing',u:'kickboxing/',n:'Kickboxing',d:'Chi tiết bộ môn: lộ trình 3 cấp, buổi tập 60 phút'},
 {id:'tap-thu',u:'tap-thu/',n:'Đăng ký tập thử',d:'4 bước, nhận mã xác nhận'}
];
D.disc.forEach(function(x){x.url=x.url||('bo-mon/#'+x.id)});
D.loc=function(id){return D.locs.filter(function(l){return l.id===id})[0]};
D.d=function(id){return D.disc.filter(function(l){return l.id===id})[0]};
D.coach=function(id){return D.coaches.filter(function(l){return l.id===id})[0]};
D.sess=function(id){return D.sessions.filter(function(l){return l.id===id})[0]};
D.today=(new Date().getDay()+6)%7;

/* ---------- icon SVG ---------- */
var IC={
 go:'<path d="M5 12h14M13 6l6 6-6 6"/>',ur:'<path d="M7 17 17 7M8 7h9v9"/>',search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',menu:'<path d="M4 7h16M4 12h16M4 17h10"/>',x:'<path d="M6 6l12 12M18 6 6 18"/>',
 check:'<path d="m5 12 4.5 4.5L19 7"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',pin:'<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6.5 6.5 0 0 1 3.5 6"/>',
 bolt:'<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',cal:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',star:'<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"/>',
 db:'<path d="M6.5 6.5v11M17.5 6.5v11M3 9v6M21 9v6M6.5 12h11"/>',glove:'<path d="M7 11V6a3 3 0 0 1 3-3h5a4 4 0 0 1 4 4v6a6 6 0 0 1-6 6H9a2 2 0 0 1-2-2v-1"/><path d="M7 11a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2M7 21h8M11 8h6"/>',
 lotus:'<path d="M12 20c-4 0-8-2-9-6 3 0 6 1 9 4 3-3 6-4 9-4-1 4-5 6-9 6z"/><path d="M12 18c-2-2-3-5-3-8 1 1 2.2 1.8 3 3 .8-1.2 2-2 3-3 0 3-1 6-3 8zM12 4c1.5 1.5 2 3.5 2 5"/>',
 bike:'<circle cx="6" cy="17" r="3.5"/><circle cx="18" cy="17" r="3.5"/><path d="M6 17l4-8h5l3 8M10 9 8 5H6M15 9l-3 8"/>',wave:'<path d="M2 15c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2M2 20c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/><circle cx="15" cy="6" r="2"/><path d="m6 11 4-4 3 3"/>',
 timer:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 2h6"/>',shield:'<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m8.5 12 2.5 2.5 4.5-4.5"/>',info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
 alert:'<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17v.5"/>',plus:'<path d="M12 5v14M5 12h14"/>',trash:'<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
 phone:'<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"/>',mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
 fb:'<path d="M14 21v-8h3l.5-3.5H14V7.5c0-1 .4-1.8 1.9-1.8H18V2.6c-.4 0-1.6-.1-3-.1-3 0-4.6 1.8-4.6 4.9v2.1H7.5V13h2.9v8"/>',ig:'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5v.01"/>',
 yt:'<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="m10 9 5 3-5 3z"/>',tt:'<path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5M14 3c.5 2.5 2.5 4.5 5 4.8"/>',
 towel:'<path d="M5 4h11a3 3 0 0 1 3 3v13H8V7a3 3 0 0 0-3-3zm0 0a3 3 0 0 0-3 3v3h6"/><path d="M11 14h5"/>',lock:'<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14.5v2"/>',
 steam:'<path d="M8 3c-1.5 2 1.5 3 0 5M12 3c-1.5 2 1.5 3 0 5M16 3c-1.5 2 1.5 3 0 5"/><path d="M3 12h18v3a6 6 0 0 1-6 6H9a6 6 0 0 1-6-6z"/>',car:'<path d="M5 17h14v-5l-2-5H7l-2 5zM5 17v2M19 17v2M5 12h14"/><circle cx="8" cy="14.5" r="1"/><circle cx="16" cy="14.5" r="1"/>',
 drop:'<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',book:'<path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4zM20 4h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7z"/>',
 up:'<path d="M12 19V5M6 11l6-6 6 6"/>',card:'<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M2.5 10h19M6 15h4"/>',calc:'<rect x="5" y="2.5" width="14" height="19" rx="2"/><path d="M8 6.5h8M8 11h.01M12 11h.01M16 11h.01M8 14.5h.01M12 14.5h.01M16 14.5v3.5M8 18h4"/>',
 help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17v.5"/>',map:'<path d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/>',
 news:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10M7 12h10M7 16h6"/>',heart:'<path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z"/>',
 apple:'<path d="M12 7c-1.5-1-5-1.5-6.5 1.5S5 16 7.5 19c1.5 1.8 3 1.5 4.5.8 1.5.7 3 1 4.5-.8 2.5-3 2.5-8.5 1-10.5S13.5 6 12 7zM12 7c0-2 1-3.5 3-4"/>',
 run:'<circle cx="14" cy="4.5" r="2"/><path d="m6 21 4-6 3 2v5M8 11l2-4 4 1 3 3 3 1M10 7 6 9l-1 3"/>',body:'<circle cx="12" cy="4.5" r="2"/><path d="M5 9h14M12 9v6M9 21l3-6 3 6"/>'
};
var spr='<svg width="0" height="0" style="position:absolute" aria-hidden="true">'+Object.keys(IC).map(function(k){return '<symbol id="i-'+k+'" viewBox="0 0 24 24">'+IC[k]+'</symbol>'}).join('')+'</svg>';
body.insertAdjacentHTML('afterbegin',spr);
function ico(k,c){return '<svg class="ico'+(c?' '+c:'')+'" aria-hidden="true"><use href="#i-'+k+'"/></svg>'}

/* ---------- header / footer ---------- */
var LOGO='<svg viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="6" fill="#B8F23A"/><path d="M9 29 17 11h5l-8 18zM19 29l8-18h5l-8 18z" fill="#0A0D06"/></svg>';
var navActive=PAGE==='kickboxing'?'bo-mon':PAGE;
var holds=store.get('holds',[]);
var navHtml=D.pages.filter(function(p){return p.nav}).map(function(p){return '<'+'a href="'+ROOT+p.u+'"'+(p.id===navActive?' aria-current="page"':'')+'>'+nb(p.n)+'</a>'}).join('');
var hdr=document.getElementById('site-header');
if(hdr){hdr.outerHTML='<header class="hdr" id="hdr"><div class="wrap">'+
 '<'+'a class="logo" href="'+ROOT+'" aria-label="IRONVERT Athletic Club, về trang chủ">'+LOGO+'<span><b>Ironvert</b><small>Athletic Club</small></span></a>'+
 '<nav class="nav" aria-label="Menu chính">'+navHtml+'</nav>'+
 '<div class="hdr-tools"><button class="ibtn" type="button" id="openSearch" aria-label="Tìm trong trang (phím /)">'+ico('search')+'</button>'+
 '<'+'a class="ibtn" href="'+ROOT+'lich-lop/#giu-cho" aria-label="Lớp đã giữ chỗ">'+ico('cal')+'<span class="cnt" id="holdCnt"'+(holds.length?'':' hidden')+'>'+holds.length+'</span></a>'+
 '<'+'a class="btn btn-lime btn-s hdr-cta" href="'+ROOT+'tap-thu/"'+(PAGE==='tap-thu'?' aria-current="page"':'')+'>Tập&nbsp;thử 1&nbsp;buổi</a>'+
 '<button class="ibtn burger" type="button" id="burger" aria-label="Mở menu" aria-expanded="false" aria-controls="mnav">'+ico('menu')+'</button></div></div></header>'+
 '<div class="mnav" id="mnav" role="dialog" aria-modal="true" aria-label="Menu"><ol>'+
 D.pages.filter(function(p){return p.nav}).map(function(p){return '<li><'+'a href="'+ROOT+p.u+'"'+(p.id===navActive?' aria-current="page"':'')+'>'+p.n+'</a></li>'}).join('')+
 '</ol><'+'a class="btn btn-lime" href="'+ROOT+'tap-thu/">Đăng ký tập&nbsp;thử '+ico('go','go')+'</a><p class="note" style="margin-top:20px">Hotline mẫu 0900&nbsp;000&nbsp;000 · Mở cửa 05:00–22:00</p></div>';}
var ftr=document.getElementById('site-footer');
if(ftr){ftr.outerHTML='<footer class="ftr"><div class="wrap"><div class="ftr-top">'+
 '<div><'+'a class="logo" href="'+ROOT+'">'+LOGO+'<span><b>Ironvert</b><small>Athletic Club</small></span></a><p style="margin:18px 0 0;max-width:34ch">Câu lạc bộ thể hình đủ bộ môn: gym, võ, yoga, pilates, cycling, bơi. Một thẻ tập ở cả ba cơ&nbsp;sở.</p>'+
 '<div class="soc"><a href="#" aria-label="Facebook (mẫu)">'+ico('fb')+'</a><a href="#" aria-label="Instagram (mẫu)">'+ico('ig')+'</a><a href="#" aria-label="YouTube (mẫu)">'+ico('yt')+'</a><a href="#" aria-label="TikTok (mẫu)">'+ico('tt')+'</a></div></div>'+
 '<div><h3>Sơ đồ trang</h3><ul>'+D.pages.map(function(p){return '<li><'+'a href="'+ROOT+p.u+'">'+p.n+'</a></li>'}).join('')+'</ul></div>'+
 '<div><h3>Giờ mở cửa</h3><dl class="hours"><dt>T2–T6</dt><dd>05:00–22:00</dd><dt>T7</dt><dd>06:00–21:00</dd><dt>CN, lễ</dt><dd>06:00–20:00</dd></dl>'+
 '<h3 style="margin-top:28px">Liên hệ</h3><ul><li><a href="tel:0900000000">'+ico('phone','s')+' 0900&nbsp;000&nbsp;000</a></li><li><a href="mailto:hello@ironvert-mau.vn">'+ico('mail','s')+' hello@ironvert-mau.vn</a></li></ul></div>'+
 '<div><h3>Cơ sở</h3><ul>'+D.locs.map(function(l){return '<li><'+'a href="'+ROOT+'co-so/#'+l.id+'"><b style="color:var(--ink);font-weight:600">'+l.s+'</b><br><span class="muted small">'+l.ward+'</span></a></li>'}).join('')+'</ul>'+
 '<div class="fmap" aria-hidden="true"><svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#0D100D"/><path d="M0 120C60 100 90 140 150 118S250 70 320 92" stroke="#1B3A26" stroke-width="14" fill="none"/><path d="M40 0v180M120 0v180M200 0v180M280 0v180M0 40h320M0 90h320M0 140h320" stroke="#1B201B"/><circle cx="110" cy="96" r="6" fill="#B8F23A"/><circle cx="190" cy="70" r="6" fill="#B8F23A"/><text x="122" y="100" fill="#9AA597" font-size="11" font-family="Inter">Bến Thành</text><text x="202" y="74" fill="#9AA597" font-size="11" font-family="Inter">An Khánh</text></svg></div></div>'+
 '</div><div class="big" aria-hidden="true">Ironvert</div>'+
 '<div class="ftr-bot"><span>Nội dung mẫu: tên thương hiệu, giá, nhân sự, chứng chỉ, lịch lớp, đánh giá và hình ảnh chỉ để minh hoạ giao diện. Ảnh: Unsplash.</span><span>Người có bệnh lý tim mạch, huyết áp, cơ xương khớp hoặc đang mang thai nên hỏi ý kiến bác sĩ trước khi tập.</span></div></div></footer>';}

/* ---------- glue chữ trong tiêu đề, nút ---------- */
var GLUE=['sức mạnh','thành viên','huấn luyện viên','huấn luyện','tập thử','bộ môn','cơ sở','lịch lớp','giữ chỗ','phục hồi','người mới','mỗi ngày','mỗi tuần','một tuần','cơ thể','kỹ thuật','tiện ích','bài viết','xác nhận','đăng ký','thông tin','cường độ','sức khoẻ','buổi tập','kỳ hạn','thẻ tập','đúng cách','hồ bơi','xông hơi','giờ làm','văn phòng','cả ba','ba cơ sở','nhóm nhỏ','tự do','câu hỏi','thường gặp','giáo án','lộ trình','an toàn','đều đặn','lý do','địa chỉ','phòng tập','bài tập','máy tập','dễ chịu','nhẹ hẳn','đầu óc'];
var SHORT=/(^|[\s ])(&|và|cho|của|với|hoặc|là|ở|để|từ|theo|trong|một|các|những|không|có|bạn|đã|sẽ|thì|mà|rồi|khi|đến|tới|trước|sau|mỗi|cả|ba|hai|vào|ra|qua|đi|lên)\s/gi;
function glue(el){var w=document.createTreeWalker(el,4),n,a=[];while(n=w.nextNode())a.push(n);a.forEach(function(n){var t=n.nodeValue;GLUE.forEach(function(g){var re=new RegExp(g.replace(/ /g,'[ ]'),'gi');t=t.replace(re,function(m){return m.replace(/ /g,' ')})});t=t.replace(SHORT,function(m,a,b){return a+b+' '});t=t.replace(SHORT,function(m,a,b){return a+b+' '});n.nodeValue=t})}
function glueAll(root){$$('h1,h2,h3,.btn,.lnk',root||document).forEach(glue)}
glueAll();

/* ---------- menu mobile ---------- */
var burger=$('#burger'),mnav=$('#mnav'),hdrEl=$('#hdr'),badge=$('#ktBadge');
function setMenu(o){if(!mnav)return;mnav.classList.toggle('open',o);burger.setAttribute('aria-expanded',o);burger.setAttribute('aria-label',o?'Đóng menu':'Mở menu');burger.innerHTML=ico(o?'x':'menu');body.classList.toggle('lock',o);if(o){var f=$('a',mnav);f&&f.focus()}}
if(burger)burger.addEventListener('click',function(){setMenu(!mnav.classList.contains('open'))});
if(mnav)mnav.addEventListener('click',function(e){if(e.target.closest('a'))setMenu(false)});
window.addEventListener('resize',function(){if(innerWidth>1140&&mnav&&mnav.classList.contains('open'))setMenu(false)});

/* ---------- cuộn: header, badge, nút lên đầu ---------- */
body.insertAdjacentHTML('beforeend','<button class="totop" id="totop" type="button" aria-label="Lên đầu trang">'+ico('up')+'</button><div class="toast" id="toast" role="status" aria-live="polite"></div>');
var totop=$('#totop');totop.addEventListener('click',function(){window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'})});
var ticking=false;
function onScroll(){var y=window.pageYOffset;if(hdrEl)hdrEl.classList.toggle('scrolled',y>8);if(badge)badge.classList.toggle('show',y>window.innerHeight*.85);totop.classList.toggle('show',y>window.innerHeight*1.2);ticking=false}
window.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});onScroll();

/* ---------- toast ---------- */
var tt;function toast(m){var t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(tt);tt=setTimeout(function(){t.classList.remove('show')},2600)}

/* ---------- hiện dần + đếm số ---------- */
function countUp(el){var to=parseFloat(el.getAttribute('data-count')),dec=(el.getAttribute('data-count').split('.')[1]||'').length,t0=null,suf=el.getAttribute('data-suf')||'';
 if(matchMedia('(prefers-reduced-motion:reduce)').matches){el.textContent=to.toFixed(dec).replace('.',',')+suf;return}
 function f(t){if(!t0)t0=t;var p=Math.min(1,(t-t0)/1100),e=1-Math.pow(1-p,3);el.textContent=(to*e).toFixed(dec).replace('.',',')+suf;if(p<1)requestAnimationFrame(f)}requestAnimationFrame(f)}
function reveal(root){var els=$$('.rv:not(.in),[data-count]:not(.counted)',root||document);
 if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in');if(e.hasAttribute('data-count')){e.classList.add('counted');countUp(e)}});return}
 var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){var e=x.target;e.classList.add('in');if(e.hasAttribute('data-count')&&!e.classList.contains('counted')){e.classList.add('counted');countUp(e)}io.unobserve(e)}})},{rootMargin:'0px 0px -6% 0px'});
 els.forEach(function(e){io.observe(e)})}
reveal();

/* ---------- tìm kiếm trong site ---------- */
var IDX=[];
D.pages.forEach(function(p){IDX.push({k:'Trang',t:p.n,s:p.d||'Trang chủ IRONVERT',u:ROOT+p.u})});
D.disc.forEach(function(x){IDX.push({k:'Bộ môn',t:x.n,s:D.groups[x.g]+' · '+x.dur,u:ROOT+x.url,x:x.k+' '+x.d})});
D.coaches.forEach(function(c){IDX.push({k:'HLV',t:c.n,s:c.role+' · '+D.loc(c.loc).s,u:ROOT+'huan-luyen-vien/#'+c.id,x:c.sp.map(function(s){return D.d(s).n}).join(' ')})});
D.locs.forEach(function(l){IDX.push({k:'Cơ sở',t:l.n,s:l.ward,u:ROOT+'co-so/#'+l.id,x:l.am.join(' ')})});
D.posts.forEach(function(p){IDX.push({k:'Bài viết',t:p.t,s:p.c+' · '+p.dt,u:ROOT+'tin-tuc/'+(p.full?'':'#'+p.id),x:p.ex})});
D.plans.forEach(function(p){IDX.push({k:'Thẻ',t:'Gói '+p.n,s:money(p.m)+'/tháng',u:ROOT+'the-thanh-vien/#goi-'+p.id,x:p.f.join(' ')})});
body.insertAdjacentHTML('beforeend','<div class="srch" id="srch" role="dialog" aria-modal="true" aria-label="Tìm kiếm"><div class="wrap"><div class="srch-top">'+ico('search','l')+'<label class="vh" for="sq">Tìm bộ môn, huấn luyện viên, cơ sở, bài viết</label><input id="sq" type="search" placeholder="Tìm bộ môn, HLV, cơ sở…" autocomplete="off"><button class="ibtn" type="button" id="closeSearch" aria-label="Đóng tìm kiếm">'+ico('x')+'</button></div><p class="note" id="sqn" style="margin-top:12px">Gợi ý tìm nhanh:</p><div class="srch-sug" id="sqs"></div><ul class="srch-res" id="sqr"></ul></div></div>');
var srch=$('#srch'),sq=$('#sq'),sqr=$('#sqr');
['kickboxing','yoga','hồ bơi','reformer','cycling','PT','Cầu Giấy','muay'].forEach(function(s){var b=document.createElement('button');b.type='button';b.className='chip';b.textContent=s;b.addEventListener('click',function(){sq.value=s;doSearch()});$('#sqs').appendChild(b)});
function doSearch(){var q=fold(sq.value.trim());if(!q){sqr.innerHTML='';$('#sqn').textContent='Gợi ý tìm nhanh:';return}
 var terms=q.split(/\s+/),r=IDX.map(function(it){var h=fold(it.t+' '+it.s+' '+(it.x||'')),ht=fold(it.t),sc=0;terms.forEach(function(w){if(ht.indexOf(w)>-1)sc+=3;else if(h.indexOf(w)>-1)sc+=1;else sc-=99});return {it:it,sc:sc}}).filter(function(x){return x.sc>0}).sort(function(a,b){return b.sc-a.sc}).slice(0,12);
 $('#sqn').textContent=r.length?r.length+' kết quả':'Không thấy kết quả. Thử từ khác, ví dụ "yoga" hoặc "bơi".';
 sqr.innerHTML=r.map(function(x){return '<li><'+'a href="'+x.it.u+'"><span class="k">'+esc(x.it.k)+'</span><span><b>'+esc(x.it.t)+'</b><span>'+esc(x.it.s)+'</span></span>'+ico('go')+'</a></li>'}).join('')}
sq.addEventListener('input',doSearch);
var lastFocus;
function openSearch(){lastFocus=document.activeElement;srch.classList.add('open');body.classList.add('lock');setTimeout(function(){sq.focus()},30)}
function closeSearch(){srch.classList.remove('open');if(!(mnav&&mnav.classList.contains('open')))body.classList.remove('lock');lastFocus&&lastFocus.focus&&lastFocus.focus()}
$('#openSearch')&&$('#openSearch').addEventListener('click',openSearch);
$('#closeSearch').addEventListener('click',closeSearch);
sqr.addEventListener('click',function(e){if(e.target.closest('a'))closeSearch()});
document.addEventListener('keydown',function(e){
 if(e.key==='Escape'){if(srch.classList.contains('open'))closeSearch();else if(mnav&&mnav.classList.contains('open')){setMenu(false);burger.focus()}}
 if(e.key==='/'&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)&&!srch.classList.contains('open')){e.preventDefault();openSearch()}
});

/* ---------- giữ chỗ (dùng chung) ---------- */
function setHolds(h){holds=h;store.set('holds',h);var c=$('#holdCnt');if(c){c.textContent=h.length;c.hidden=!h.length}}

/* ---------- xuất ---------- */
window.IV={D:D,$:$,$$:$$,esc:esc,fold:fold,money:money,nb:nb,store:store,img:img,ico:ico,toast:toast,reveal:reveal,glue:glueAll,ROOT:ROOT,
 holds:function(){return holds.slice()},setHolds:setHolds};
})();
