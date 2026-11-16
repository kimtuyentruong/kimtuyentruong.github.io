/* ĐỀU Gym 24/7 — JS dùng chung (mẫu giao diện) */
(function(){
'use strict';
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var KEY='deu-gym-2:';
var store={get:function(k,d){try{var v=localStorage.getItem(KEY+k);return v?JSON.parse(v):d}catch(e){return d}},set:function(k,v){try{localStorage.setItem(KEY+k,JSON.stringify(v))}catch(e){}}};
function money(n){return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,'.')+'đ'}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function pad(n){return (n<10?'0':'')+n}
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- dữ liệu mẫu ---------- */
var CURVE=[14,9,6,5,9,34,52,46,32,24,22,28,40,32,24,26,40,70,92,86,64,46,32,20];
var D={
 branches:[
  {id:'ben-thanh',no:1,n:'ĐỀU Bến Thành',w:'Phường Bến Thành',x:470,y:380,m2:'1.200 m²',k:1.05,f:['nu','xe','lop'],img:'photo-1534438327276-14e5300c3a48',note:'Gần chợ, dân văn phòng tập trưa đông.'},
  {id:'tan-dinh',no:2,n:'ĐỀU Tân Định',w:'Phường Tân Định',x:400,y:290,m2:'900 m²',k:.9,f:['lop','dap'],img:'photo-1571902943202-507ec2618e8f',note:'Phòng đạp xe 24 xe, lớp tối kín chỗ sớm.'},
  {id:'gia-dinh',no:3,n:'ĐỀU Gia Định',w:'Phường Gia Định',x:520,y:215,m2:'1.400 m²',k:1,f:['nu','xe','oto','lop','dap'],img:'photo-1540497077202-7c8a3999166f',note:'Chi nhánh rộng nhất trong mẫu, có bãi ô tô.'},
  {id:'phu-nhuan',no:4,n:'ĐỀU Phú Nhuận',w:'Phường Phú Nhuận',x:330,y:225,m2:'800 m²',k:.85,f:['xe','lop'],img:'photo-1599058945522-28d584b6f0ff',note:'Nhỏ, yên, hợp người thích tập một mình.'},
  {id:'go-vap',no:5,n:'ĐỀU Gò Vấp',w:'Phường Gò Vấp',x:300,y:105,m2:'1.100 m²',k:1.1,f:['nu','xe','dap'],img:'photo-1546483875-ad9014c88eba',note:'Đông sinh viên buổi tối, sáng sớm rất vắng.'},
  {id:'tan-son-nhat',no:6,n:'ĐỀU Tân Sơn Nhất',w:'Phường Tân Sơn Nhất',x:185,y:200,m2:'1.000 m²',k:.95,f:['xe','oto','lop'],img:'photo-1584735935682-2f2b69dff9d2',note:'Gần sân bay, tiện ghé trước chuyến bay sớm.'},
  {id:'thu-duc',no:7,n:'ĐỀU Thủ Đức',w:'Phường Thủ Đức',x:720,y:150,m2:'1.300 m²',k:1,f:['nu','xe','oto','lop','dap'],img:'photo-1609899537878-88d5ba429bdb',note:'Cạnh khu ký túc xá, cuối tuần sôi động.'}
 ],
 feats:{nu:'Khu tạ riêng nữ',xe:'Giữ xe máy',oto:'Bãi ô tô',lop:'Phòng lớp nhóm',dap:'Phòng đạp xe'},
 areas:[{id:'q1',n:'Trung tâm (Bến Thành, Sài Gòn)',x:480,y:400},{id:'bt',n:'Bình Thạnh, Gia Định',x:540,y:250},{id:'pn',n:'Phú Nhuận, Cầu Kiệu',x:350,y:250},{id:'gv',n:'Gò Vấp, Hạnh Thông',x:290,y:120},{id:'tb',n:'Tân Bình, Tân Sơn Nhất',x:190,y:230},{id:'td',n:'Thủ Đức, Linh Xuân',x:730,y:130}],
 plans:[
  {id:'gan-nha',n:'Gần Nhà',m:299000,for:'Tập ở một chi nhánh bạn chọn, mọi giờ, mọi ngày.',f:['Ra vào 24/7 tại 1 chi nhánh','Khu tạ, máy, cardio','Ứng dụng quét mã vào cửa','1 buổi hướng dẫn đầu tiên'],x:['Lớp nhóm','Tập ở chi nhánh khác']},
  {id:'di-khap',n:'Đi Khắp',m:399000,hot:1,for:'Tập ở cả 7 chi nhánh, gần nhà lẫn gần chỗ làm.',f:['Ra vào 24/7 tại cả 7 chi nhánh','Khu tạ, máy, cardio','Ứng dụng quét mã vào cửa','2 buổi hướng dẫn đầu tiên','Rủ 1 bạn tập cùng mỗi tháng'],x:['Lớp nhóm']},
  {id:'di-khap-lop',n:'Đi Khắp + Lớp',m:499000,for:'Như Đi Khắp, cộng thêm mọi lớp nhóm trong lịch tuần.',f:['Ra vào 24/7 tại cả 7 chi nhánh','Không giới hạn lớp nhóm','Giữ chỗ lớp trước 48 giờ','2 buổi hướng dẫn đầu tiên','Rủ 1 bạn tập cùng mỗi tháng'],x:[]}
 ],
 terms:[{m:1,l:'1 tháng',off:0},{m:3,l:'3 tháng',off:.05},{m:6,l:'6 tháng',off:.1,free:1},{m:12,l:'12 tháng',off:.15,free:1}],
 joinFee:99000,
 classes:[
  {id:'dap-xe',n:'Đạp xe theo nhạc',d:45,lv:2,room:'dap',img:'photo-1558611848-73f7eb4001a1',txt:'Đạp theo nhịp nhạc, tự chỉnh lực kháng. Mới tập vẫn theo kịp.'},
  {id:'ta-nhom',n:'Tạ nhóm',d:45,lv:2,room:'lop',img:'photo-1576678927484-cc907957088c',txt:'Thanh tạ nhẹ, nhiều lần lặp, huấn luyện viên sửa tư thế tại chỗ.'},
  {id:'hiit',n:'HIIT 30 phút',d:30,lv:3,room:'lop',img:'photo-1594737625785-a6cbdabd333c',txt:'Ngắn, nhanh, ra mồ hôi. Mỗi bài có phiên bản nhẹ hơn để chọn.'},
  {id:'nhay',n:'Nhảy cardio',d:45,lv:1,room:'lop',img:'photo-1524594152303-9fd13543fe6e',txt:'Động tác đơn giản, nhạc vui. Không cần biết nhảy.'},
  {id:'core',n:'Bụng & lưng',d:30,lv:2,room:'lop',img:'photo-1571019613454-1cb2f99b2d8b',txt:'Bài thân giữa giúp đứng ngồi vững hơn, hợp dân ngồi máy tính.'},
  {id:'gian-co',n:'Giãn cơ & di động',d:45,lv:1,room:'lop',img:'photo-1518611012118-696072aa579a',txt:'Kéo giãn, xoay khớp, thở chậm. Hợp buổi tối sau giờ làm.'}
 ],
 times:['05:30','06:30','07:30','12:00','12:45','17:30','18:30','19:30','20:30','21:30']
};
D.byId=function(list,id){for(var i=0;i<list.length;i++)if(list[i].id===id)return list[i];return null};
D.crowd=function(b,h,weekend){var v=CURVE[h];if(weekend){v=[16,10,6,5,6,14,26,40,56,62,58,48,40,34,32,36,44,52,56,50,40,30,22,16][h]}return Math.max(4,Math.min(98,Math.round(v*(b?b.k:1))))};
D.level=function(v){return v>=70?['hi','Đông']:v>=40?['mid','Vừa']:['lo','Vắng']};
/* lịch lớp: tạo ổn định từ chỉ số ngày/giờ/chi nhánh */
D.schedule=function(){var out=[],seed=7;function rnd(){seed=(seed*9301+49297)%233280;return seed/233280}
 for(var d=0;d<7;d++){D.branches.forEach(function(b){D.times.forEach(function(t){
  if(rnd()<(d>4?.28:.36)){var pool=D.classes.filter(function(c){return b.f.indexOf(c.room)>-1});if(!pool.length)return;var c=pool[Math.floor(rnd()*pool.length)];var cap=c.room==='dap'?24:20;var taken=Math.min(cap,Math.floor(rnd()*cap*1.15));
   out.push({id:'s'+d+b.no+t.replace(':',''),day:d,t:t,c:c.id,b:b.id,cap:cap,taken:taken,coach:['Huấn luyện viên Minh','Huấn luyện viên Thảo','Huấn luyện viên Khoa','Huấn luyện viên Ngân','Huấn luyện viên Phúc'][Math.floor(rnd()*5)]})}})})}
 return out};

/* ---------- glue: không ngắt dòng giữa cụm từ ---------- */
var GLUE=['24/7','24 giờ','7 ngày','7 chi nhánh','cả 7','chi nhánh','giờ cao điểm','cao điểm','bảng giá','lớp nhóm','người mới','tập thử','đăng ký','xác nhận','miễn phí','giữ chỗ','kỳ hạn','thẻ tập','buổi đầu','buổi tập','câu hỏi','thường gặp','gần nhà','đi khắp','tan làm','giờ làm','văn phòng','huấn luyện viên','huấn luyện','đạp xe','tạ nhóm','giãn cơ','khu tạ','phòng tập','mỗi ngày','mỗi tháng','một mình','sức khoẻ','thông tin','tư thế','đều đặn','lịch tuần','lịch lớp','ra vào','bảo lưu','chuyển nhượng','mã xác nhận','nửa đêm','sáng sớm','bản đồ','gần bạn','không lo','dễ chịu','bắt đầu','tự tin','dữ liệu','đến trễ','đổi gói','gửi xe','thế nào','mấy buổi','4 tuần','tối hôm','hôm trước','khỏi quên','phong trào','theo sức','đủ chỗ','tăng giá','mất tiền','công tác','chuyển nhà','bạn tập','có nhạc','người dẫn','khoá số','nước nóng','nước lọc','chỗ sạc','ra sao','đầu tiên','lý do','thanh giờ','tự tính','ghi rõ','gần nhất','Bến Thành','Tân Định','Gia Định','Phú Nhuận','Gò Vấp','Thủ Đức','Tân Sơn Nhất','làm thẻ','2 phút','60 phút','bước tiếp','quay lại','mã vào cửa','ứng dụng','lịch tập'];
var SHORT=/(^|\s)(và|hoặc|với|cho|của|ở|để|là|từ|mà|thì|các|những|một|bạn|giờ|lúc|trong|khi)\s/gi;
function glue(el){var w=document.createTreeWalker(el,4),n,a=[];while((n=w.nextNode()))a.push(n);a.forEach(function(n){var t=n.nodeValue;GLUE.forEach(function(g){var re=new RegExp(g.replace(/[.*+?^${}()|[\]\\\/]/g,'\\$&').replace(/ /g,'[ \u00a0]'),'gi');t=t.replace(re,function(m){return m.replace(/ /g,'\u00a0')})});t=t.replace(SHORT,function(m,a,b){return a+b+'\u00a0'});n.nodeValue=t})}
function glueAll(root){$$('h1,h2,h3,button,.btn,.lnk,.chip,.tag,.bx p,.lead',root||document).forEach(glue)}

/* ---------- header, menu, badge ---------- */
var body=document.body,hd=$('#hd'),badge=$('#ktBadge'),burger=$('#burger'),mnav=$('#mnav');
function onScroll(){var y=window.pageYOffset||0;if(hd)hd.classList.toggle('scrolled',y>8);if(badge)badge.classList.toggle('show',y>window.innerHeight*.85)}
window.addEventListener('scroll',onScroll,{passive:true});onScroll();
function setMenu(open){body.classList.toggle('menu-open',open);body.classList.toggle('lock',open);if(burger){burger.setAttribute('aria-expanded',open);burger.setAttribute('aria-label',open?'Đóng menu':'Mở menu')}if(mnav)mnav.setAttribute('aria-hidden',!open);if(open&&mnav){var f=mnav.querySelector('a');f&&f.focus({preventScroll:true})}}
if(burger)burger.addEventListener('click',function(){setMenu(!body.classList.contains('menu-open'))});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&body.classList.contains('menu-open')){setMenu(false);burger&&burger.focus()}});
if(mnav)mnav.addEventListener('click',function(e){if(e.target.closest('a'))setMenu(false)});
var lastW=window.innerWidth;window.addEventListener('resize',function(){if(window.innerWidth!==lastW){lastW=window.innerWidth;if(lastW>1040)setMenu(false)}});

/* ---------- reveal ---------- */
function reveal(){var els=$$('.rv:not(.in)');if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in')});return}
 var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}})},{rootMargin:'0px 0px -6% 0px',threshold:.04});
 els.forEach(function(e){var r=e.getBoundingClientRect();if(r.top<window.innerHeight&&r.bottom>0)e.classList.add('in');else io.observe(e)})}

/* ---------- toast ---------- */
var tEl;function toast(msg){if(!tEl){tEl=document.createElement('div');tEl.className='toast';tEl.setAttribute('role','status');tEl.setAttribute('aria-live','polite');body.appendChild(tEl)}tEl.textContent=msg;tEl.classList.add('show');clearTimeout(tEl._t);tEl._t=setTimeout(function(){tEl.classList.remove('show')},2600)}

/* ---------- đếm số ---------- */
function countTo(el,to,fmt,dur){fmt=fmt||function(v){return String(v)};var from=el._v||0;el._v=to;if(reduce){el.textContent=fmt(to);return}var t0=null;dur=dur||700;var tok={};el._tok=tok;function step(t){if(el._tok!==tok)return;if(!t0)t0=t;var p=Math.min(1,(t-t0)/dur);p=1-Math.pow(1-p,3);el.textContent=fmt(Math.round(from+(to-from)*p));if(p<1)requestAnimationFrame(step)}requestAnimationFrame(step);clearTimeout(el._ft);el._ft=setTimeout(function(){if(el._v===to){el._tok=null;el.textContent=fmt(to)}},dur+120)}

/* ---------- giờ mở cửa trực tiếp ---------- */
function vnNow(){var d=new Date();var utc=d.getTime()+d.getTimezoneOffset()*60000;return new Date(utc+7*3600000)}
$$('[data-now]').forEach(function(el){function tick(){var n=vnNow();el.textContent=pad(n.getHours())+':'+pad(n.getMinutes())}tick();setInterval(tick,15000)});

$$('[data-year]').forEach(function(el){el.textContent=vnNow().getFullYear()});

/* chốt hiệu ứng mở màn: nếu khung hình chạy chậm (máy yếu, tab nền, ảnh chụp tự động) thì cho về trạng thái cuối */
function settle(){if(!document.getAnimations)return;document.getAnimations().forEach(function(a){try{var t=a.effect&&a.effect.getComputedTiming();if(t&&isFinite(t.endTime)&&t.endTime<2500)a.finish()}catch(e){}})}
window.addEventListener('load',function(){setTimeout(settle,1300)});setTimeout(settle,1800);
window.DEU={D:D,$:$,$$:$$,esc:esc,money:money,pad:pad,store:store,toast:toast,reveal:reveal,glue:glueAll,countTo:countTo,vnNow:vnNow,reduce:reduce,
 img:function(id,w){return 'https://images.unsplash.com/'+id+'?auto=format&fit=crop&w='+(w||900)+'&q=80'}};
glueAll();
if(!reduce)window.addEventListener('load',function(){setTimeout(function(){document.documentElement.classList.add('live')},1600)});
document.addEventListener('DOMContentLoaded',function(){reveal()});
if(document.readyState!=='loading')reveal();
})();
