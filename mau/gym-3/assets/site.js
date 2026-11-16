/* Than Đỏ Boxing & PT — JS dùng chung (mẫu giao diện, không gửi dữ liệu đi đâu) */
(function(){
'use strict';
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var KEY='than-do-gym-3:';
var store={get:function(k,d){try{var v=localStorage.getItem(KEY+k);return v?JSON.parse(v):d}catch(e){return d}},set:function(k,v){try{localStorage.setItem(KEY+k,JSON.stringify(v))}catch(e){}}};
var reduce=!!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
function money(n){return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,'.')+'đ'}
function pad(n){return (n<10?'0':'')+n}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
var DOW=['CN','T2','T3','T4','T5','T6','T7'];
var DOWF=['Chủ nhật','Thứ hai','Thứ ba','Thứ tư','Thứ năm','Thứ sáu','Thứ bảy'];
function dmy(d){return pad(d.getDate())+'/'+pad(d.getMonth()+1)+'/'+d.getFullYear()}
function icon(id,cls){return '<svg class="ico'+(cls?' '+cls:'')+'" aria-hidden="true"><use href="#'+id+'"/></svg>'}

/* ---------- dữ liệu mẫu ---------- */
var IMG='https://images.unsplash.com/';
var COACH=[
 {id:'khang',n:'Trần Minh Khang',role:'HLV boxing',yrs:'9 năm đứng lớp',sp:['boxing','thi-dau'],img:'photo-1579758629938-03607ccdbaba',pos:'55% 35%',
  hours:[14,15,16,17,18,19,20],
  bio:'Khang tập boxing phong trào từ năm 17 tuổi, từng đấu giao hữu cấp câu lạc bộ. Anh dạy kỹ thuật theo kiểu “chậm mà chắc”: một cú jab đúng quan trọng hơn mười cú đấm vội.',
  cert:['Chứng chỉ huấn luyện boxing căn bản (mẫu)','Sơ cấp cứu thể thao (mẫu)'],good:'Người muốn học boxing bài bản, chuẩn bị đấu giao hữu'},
 {id:'vy',n:'Lê Thảo Vy',role:'HLV boxing & người mới',yrs:'6 năm đứng lớp',sp:['boxing','nguoi-moi'],img:'photo-1590556409324-aa1d726e5c3c',pos:'30% 30%',
  hours:[6,7,8,9,10,11,17,18,19,20],
  bio:'Vy phụ trách lớp boxing nhóm nhỏ buổi tối và các bạn lần đầu đeo găng. Chị nói nhiều, cười nhiều, và rất kỹ chuyện băng tay đúng cách.',
  cert:['Chứng chỉ huấn luyện cá nhân (mẫu)','Huấn luyện boxing cho người mới (mẫu)'],good:'Người mới, nữ ngại lớp đông, nhóm bạn tập chung'},
 {id:'bao',n:'Phạm Quốc Bảo',role:'HLV sức mạnh',yrs:'8 năm đứng lớp',sp:['suc-manh'],img:'photo-1611672585731-fa10603fb9e0',pos:'45% 25%',
  hours:[6,7,8,9,10,15,16,17,18,19],
  bio:'Bảo làm việc với tạ đòn và kettlebell. Anh ghi sổ từng buổi: mức tạ, số lần, cảm giác của bạn, để buổi sau tăng vừa sức, không đoán mò.',
  cert:['Chứng chỉ huấn luyện sức mạnh (mẫu)','Dinh dưỡng thể thao cơ bản (mẫu)'],good:'Người muốn khoẻ hơn, nâng tạ đúng tư thế'},
 {id:'yen',n:'Ngô Hải Yến',role:'HLV vận động & tư thế',yrs:'7 năm đứng lớp',sp:['tu-the','nguoi-moi','suc-manh'],img:'photo-1518459031867-a89b944bffe4',pos:'30% 35%',
  hours:[8,9,10,11,12,13,14,15,16],
  bio:'Yến làm việc nhiều với dân văn phòng hay mỏi cổ vai gáy, lưng dưới. Buổi đầu chị dành 15 phút quan sát cách bạn đứng, cúi, xoay người trước khi cho tập.',
  cert:['Chứng chỉ huấn luyện cá nhân (mẫu)','Vận động chỉnh tư thế (mẫu)'],good:'Người ngồi nhiều, mới quay lại tập sau thời gian dài'}
];
function coachById(id){for(var i=0;i<COACH.length;i++)if(COACH[i].id===id)return COACH[i];return null}
var GROUP={ /* lớp nhóm cố định: dow -> [{h,name,coach,left}] */
 1:[{h:18,c:'vy',name:'Boxing nền tảng',left:2},{h:7,c:'bao',name:'Sức mạnh nhóm nhỏ',left:3}],
 2:[{h:19,c:'khang',name:'Boxing theo hiệp',left:1}],
 3:[{h:18,c:'vy',name:'Boxing nền tảng',left:4},{h:7,c:'bao',name:'Sức mạnh nhóm nhỏ',left:2}],
 4:[{h:19,c:'khang',name:'Boxing theo hiệp',left:3},{h:9,c:'yen',name:'Tư thế & lưng khoẻ',left:2}],
 5:[{h:18,c:'vy',name:'Boxing nền tảng',left:0},{h:7,c:'bao',name:'Sức mạnh nhóm nhỏ',left:1}],
 6:[{h:8,c:'khang',name:'Boxing theo hiệp',left:2},{h:10,c:'yen',name:'Tư thế & lưng khoẻ',left:3}],
 0:[{h:9,c:'vy',name:'Boxing nền tảng',left:3}]
};
var OPEN={0:[8,12],1:[6,21.5],2:[6,21.5],3:[6,21.5],4:[6,21.5],5:[6,21.5],6:[7,19]};
function hash(s){var h=2166136261;for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return ((h>>>0)%1000)/1000}

/* ---------- header, menu ---------- */
var body=document.body,hd=$('#hd'),burger=$('#burger'),mnav=$('#mnav'),badge=$('#ktBadge');
function onScroll(){var y=window.scrollY||0;if(hd)hd.classList.toggle('sc',y>8);if(badge)badge.classList.toggle('show',y>innerHeight*.85)}
addEventListener('scroll',onScroll,{passive:true});onScroll();
function setMenu(open){body.classList.toggle('menu-open',open);body.classList.toggle('lock',open);if(burger){burger.setAttribute('aria-expanded',open);burger.setAttribute('aria-label',open?'Đóng menu':'Mở menu')}if(mnav){mnav.setAttribute('aria-hidden',!open);if(open)mnav.removeAttribute('inert');else mnav.setAttribute('inert','')}if(open&&mnav){var f=mnav.querySelector('a');f&&f.focus({preventScroll:true})}}
if(mnav)mnav.setAttribute('inert','');
if(burger)burger.addEventListener('click',function(){setMenu(!body.classList.contains('menu-open'))});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&body.classList.contains('menu-open')){setMenu(false);burger&&burger.focus()}});
if(mnav)$$('a',mnav).forEach(function(a){a.addEventListener('click',function(){setMenu(false)})});
var lastW=innerWidth;addEventListener('resize',function(){if(innerWidth!==lastW){lastW=innerWidth;if(innerWidth>1024&&body.classList.contains('menu-open'))setMenu(false)}});

/* giờ mở cửa */
(function(){var now=new Date(),d=now.getDay(),h=now.getHours()+now.getMinutes()/60,o=OPEN[d],isOpen=h>=o[0]&&h<o[1];
 $$('[data-open]').forEach(function(el){el.classList.toggle('closed',!isOpen);var t=el.querySelector('span');if(t)t.textContent=isOpen?'Đang mở cửa':'Đang đóng cửa'});})();

/* hiện dần */
var rvs=$$('.rv,.steps');
if('IntersectionObserver' in window&&!reduce){
 var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:.08});
 rvs.forEach(function(el){var r=el.getBoundingClientRect();if(r.top<innerHeight)el.classList.add('in');else io.observe(el)});
}else rvs.forEach(function(el){el.classList.add('in')});

/* đếm số */
function countUp(el){var to=+el.getAttribute('data-count'),suf=el.getAttribute('data-suf')||'',t0=null;if(reduce||document.documentElement.classList.contains('no-intro')){el.textContent=to+suf;return}
 function f(t){if(!t0)t0=t;var p=Math.min(1,(t-t0)/1100),e=1-Math.pow(1-p,3);el.textContent=Math.round(to*e)+suf;if(p<1)requestAnimationFrame(f)}requestAnimationFrame(f)}
var cnt=$$('[data-count]');
if(cnt.length){if('IntersectionObserver' in window){var io2=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){countUp(e.target);io2.unobserve(e.target)}})});cnt.forEach(function(c){io2.observe(c)})}else cnt.forEach(countUp)}

/* parallax nhẹ (transform, không blur) */
var px=$$('[data-px]');
if(px.length&&!reduce){var tick=false;function pxRun(){tick=false;px.forEach(function(el){var r=el.parentNode.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;var k=+el.getAttribute('data-px')||.06;el.style.transform='translate3d(0,'+(r.top*-k).toFixed(1)+'px,0) scale(1.08)'})}
 addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(pxRun)}},{passive:true});pxRun()}

/* số tiền động */
function animMoney(el,to){var from=+(el.getAttribute('data-v')||0);el.setAttribute('data-v',to);if(reduce||from===to||document.documentElement.classList.contains('no-intro')){el.textContent=money(to);return}
 var t0=null;function f(t){if(!t0)t0=t;var p=Math.min(1,(t-t0)/600),e=1-Math.pow(1-p,3);el.textContent=money(Math.round((from+(to-from)*e)/1000)*1000);if(p<1)requestAnimationFrame(f)}requestAnimationFrame(f)}

/* ================= TRANG CHỦ: đồng hồ hiệp ================= */
(function(){
 var face=$('#tmFace');if(!face)return;
 var ring=$('#tmRing'),tEl=$('#tmTime'),phEl=$('#tmPhase'),rdEl=$('#tmRound'),cbEl=$('#tmCombo'),go=$('#tmGo'),rs=$('#tmReset');
 var C=2*Math.PI*190;ring.style.strokeDasharray=C;
 var COMBOS=[['1 – 2','Jab, cross. Thu tay về che cằm sau mỗi cú.'],['1 – 1 – 2','Jab đôi rồi cross. Bước chân trước khi đấm.'],['1 – 2 – 3','Jab, cross, hook trái. Xoay hông, không vung tay.'],['2 – 3 – 2','Cross, hook trái, cross. Giữ cằm thấp.'],['1 – 2 – né – 2','Đấm, né sang phải, phản bằng cross.'],['1 – 6 – 3 – 2','Jab, uppercut phải, hook trái, cross.']];
 var cfg={work:180,rest:60,rounds:3},st={phase:'idle',left:180,round:1,run:false,end:0},timer=null;
 function fmt(s){s=Math.max(0,Math.ceil(s));return pad(Math.floor(s/60))+':'+pad(s%60)}
 function draw(){var total=st.phase==='rest'?cfg.rest:cfg.work;var p=st.left/total;ring.style.strokeDashoffset=C*(1-p);tEl.textContent=fmt(st.left);
  face.classList.toggle('rest',st.phase==='rest');
  phEl.textContent=st.phase==='rest'?'Nghỉ giữa hiệp':st.phase==='done'?'Xong buổi':st.phase==='idle'?'Sẵn sàng':'Đang đấm';
  rdEl.textContent='Hiệp '+st.round+' / '+cfg.rounds;
  var c=COMBOS[(st.round-1)%COMBOS.length];
  if(st.phase==='rest'){cbEl.innerHTML='<b>Thở đều</b><span>Đi lại nhẹ, uống một ngụm nước. Hiệp sau: '+c[0].replace(/ /g,'&nbsp;')+'</span>'}
  else if(st.phase==='done'){cbEl.innerHTML='<b>Hết '+cfg.rounds+' hiệp</b><span>Giãn vai, cổ tay 3 phút. Muốn có người sửa từng cú? Đặt buổi thử bên dưới.</span>'}
  else cbEl.innerHTML='<b>'+c[0]+'</b><span>'+c[1]+'</span>';
  go.innerHTML=st.run?icon('i-pause')+'Tạm dừng':icon('i-play')+(st.phase==='idle'||st.phase==='done'?'Bắt đầu':'Chạy tiếp');
 }
 function step(){var now=Date.now();st.left=(st.end-now)/1000;
  if(st.left<=0){
   if(st.phase==='work'){if(st.round>=cfg.rounds){st.phase='done';st.left=0;stop();draw();return}st.phase='rest';st.left=cfg.rest}
   else{st.round++;st.phase='work';st.left=cfg.work}
   st.end=now+st.left*1000;face.classList.remove('flash');void face.offsetWidth;face.classList.add('flash')}
  draw()}
 function start(){if(st.phase==='idle'||st.phase==='done'){st.phase='work';st.round=1;st.left=cfg.work}st.end=Date.now()+st.left*1000;st.run=true;timer=setInterval(step,250);draw()}
 function stop(){st.run=false;clearInterval(timer);timer=null;draw()}
 function reset(){stop();st.phase='idle';st.round=1;st.left=cfg.work;draw()}
 go.addEventListener('click',function(){st.run?stop():start()});
 rs.addEventListener('click',reset);
 $$('[data-tm]').forEach(function(b){b.addEventListener('click',function(){var k=b.getAttribute('data-tm'),v=+b.getAttribute('data-v');cfg[k]=v;$$('[data-tm="'+k+'"]').forEach(function(x){x.setAttribute('aria-pressed',x===b)});reset()})});
 document.addEventListener('visibilitychange',function(){if(!document.hidden&&st.run)step()});
 reset();
})();
/* đồng hồ nhỏ ở đầu trang chủ: chạy khi đang thấy */
(function(){var el=$('#heroClock');if(!el||reduce)return;var s=180,iv=null;
 function tk(){s=s<=0?180:s-1;el.textContent=pad(Math.floor(s/60))+':'+pad(s%60)}
 if('IntersectionObserver' in window){new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting&&!iv)iv=setInterval(tk,1000);else if(!e.isIntersecting&&iv){clearInterval(iv);iv=null}})}).observe(el)}})();

/* ================= HUẤN LUYỆN: chọn gói ================= */
(function(){
 var root=$('#picker');if(!root)return;
 var GOALS={
  'suc-khoe':{pk:'Gói Khởi Động Lại',why:'Bắt đầu nhẹ, sửa tư thế, tập các động tác nền để cơ thể quen vận động trở lại.',c:'yen'},
  'suc-manh':{pk:'Gói Sức Mạnh',why:'Học squat, deadlift, đẩy, kéo đúng kỹ thuật, tăng mức tạ theo sổ ghi từng buổi.',c:'bao'},
  'san-chac':{pk:'Gói Săn Chắc',why:'Kết hợp tạ và bài tim mạch ngắt quãng, kèm gợi ý thói quen ăn uống. Kết quả mỗi người khác nhau.',c:'bao'},
  'boxing':{pk:'Gói Boxing Nền',why:'Đi hết cấp 1 trong lộ trình: thế đứng, bước chân, jab, cross, phòng thủ cơ bản.',c:'vy'},
  'thi-dau':{pk:'Gói Lên Sàn',why:'Dành cho người đã qua cấp 2, muốn đấu tập có bảo hộ hoặc chuẩn bị giao hữu phong trào.',c:'khang'}
 };
 var st={goal:'suc-khoe',fmt:'pt',spw:2,weeks:8};
 var saved=store.get('pick',null);if(saved&&GOALS[saved.goal]){st.goal=saved.goal;st.fmt=saved.fmt||'pt';st.spw=saved.spw||2;st.weeks=saved.weeks||8}
 var rng=$('#pkSpw'),out=$('#pkSpwOut');
 function price(){var base=st.fmt==='pt'?450000:190000;if(st.fmt==='pt'&&(st.goal==='boxing'||st.goal==='thi-dau'))base+=50000;var n=st.spw*st.weeks,disc=n>=36?.12:n>=24?.08:n>=12?.05:0;var per=Math.round(base*(1-disc)/1000)*1000;return {base:base,n:n,disc:disc,per:per,total:per*n}}
 function render(flash){
  $$('[data-pk]',root).forEach(function(b){b.setAttribute('aria-pressed',String(st[b.getAttribute('data-pk')])===b.getAttribute('data-v'))});
  rng.value=st.spw;out.textContent=st.spw+' buổi/tuần';
  var g=GOALS[st.goal],p=price(),c=coachById(g.c);
  $('#pkName').textContent=g.pk+(st.fmt==='pt'?' · 1 kèm 1':' · nhóm nhỏ');
  var why=g.why;if(st.goal==='thi-dau'&&st.fmt!=='pt')why+=' Mục tiêu này nên tập 1 kèm 1 để HLV theo sát.';
  $('#pkWhy').textContent=why;
  $('#pkN').textContent=p.n+' buổi trong '+st.weeks+' tuần';
  $('#pkPer').textContent=money(p.per);
  $('#pkDisc').textContent=p.disc?'−'+Math.round(p.disc*100)+'% (từ '+money(p.base)+')':'Chưa áp dụng';
  $('#pkCoach').textContent=c.n;
  animMoney($('#pkTotal'),p.total);
  if(flash){var o=$('#pkOut');o.classList.remove('flash');void o.offsetWidth;o.classList.add('flash')}
  store.set('pick',{goal:st.goal,fmt:st.fmt,spw:st.spw,weeks:st.weeks,pk:g.pk,coach:g.c,n:p.n,total:p.total});
 }
 $$('[data-pk]',root).forEach(function(b){b.addEventListener('click',function(){var k=b.getAttribute('data-pk'),v=b.getAttribute('data-v');st[k]=(k==='weeks')?+v:v;render(true)})});
 rng.addEventListener('input',function(){st.spw=+rng.value;render(true)});
 render(false);
})();

/* ================= BOXING ================= */
(function(){
 var tabs=$$('.lv-tab');if(!tabs.length)return;
 function sel(i,focus){tabs.forEach(function(t,j){var on=i===j;t.setAttribute('aria-selected',on);t.tabIndex=on?0:-1;var p=$('#'+t.getAttribute('aria-controls'));if(p)p.hidden=!on});
  var m=$('#lvp'+(i+1)+' .meter i');if(m){m.style.width='0';requestAnimationFrame(function(){requestAnimationFrame(function(){m.style.width=m.getAttribute('data-w')})})}
  if(focus)tabs[i].focus()}
 tabs.forEach(function(t,i){t.addEventListener('click',function(){sel(i)});t.addEventListener('keydown',function(e){var k=e.key,n=null;if(k==='ArrowDown'||k==='ArrowRight')n=(i+1)%tabs.length;if(k==='ArrowUp'||k==='ArrowLeft')n=(i-1+tabs.length)%tabs.length;if(k==='Home')n=0;if(k==='End')n=tabs.length-1;if(n!==null){e.preventDefault();sel(n,true)}})});
 sel(0);
 window.__lvSel=sel;
 /* tự đánh giá */
 var cks=$$('#selfList input');
 function judge(){var pts=0;cks.forEach(function(c){if(c.checked)pts+=+c.getAttribute('data-w')});
  var lv=pts>=9?4:pts>=6?3:pts>=3?2:1;var names=['','Cấp 1 · Than','Cấp 2 · Lửa','Cấp 3 · Đồng','Cấp 4 · Thép'];
  var txt=['','Bắt đầu từ thế đứng và bước chân. Đừng lo, ai cũng từng đứng sai tay ở buổi đầu.','Bạn đã có nền. Cấp 2 tập combo dài hơn và học chặn, né cơ bản.','Bạn đã quen găng. Cấp 3 tập phản đòn và đánh bao theo hiệp có người cầm đích.','Bạn có thể vào cấp 4 sau một buổi kiểm tra với HLV: đấu tập nhẹ, có bảo hộ.'];
  $('#selfLv').textContent=names[lv];$('#selfTxt').textContent=txt[lv];$('#selfPts').textContent=pts+' / 12 điểm';
  $('#selfMeter').style.width=Math.round(pts/12*100)+'%';$('#selfGo').setAttribute('data-lv',lv);
  store.set('boxlv',lv)}
 cks.forEach(function(c){c.addEventListener('change',judge)});judge();
 var sg=$('#selfGo');if(sg)sg.addEventListener('click',function(){var lv=+sg.getAttribute('data-lv');sel(lv-1,true);$('#lo-trinh').scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'})});
 /* combo */
 var POOL={1:['1','2','1','2'],2:['1','2','3','4'],3:['1','2','3','4','5','6'],4:['1','2','3','4','5','6']},DEF={2:['Chặn'],3:['Chặn','Né'],4:['Chặn','Né','Lắc']};
 var clv=1,seqEl=$('#comboSeq'),cardEls=$$('.pch');
 $$('[data-clv]').forEach(function(b){b.addEventListener('click',function(){clv=+b.getAttribute('data-clv');$$('[data-clv]').forEach(function(x){x.setAttribute('aria-pressed',x===b)});make()})});
 function make(){var len=clv===1?2+Math.floor(Math.random()*2):clv===2?3+Math.floor(Math.random()*2):4+Math.floor(Math.random()*2);var pool=POOL[clv],seq=[];
  for(var i=0;i<len;i++){var d=DEF[clv];if(d&&i>0&&i<len-1&&Math.random()<.25){seq.push(d[Math.floor(Math.random()*d.length)]);continue}var last=null;for(var k=seq.length-1;k>=0;k--){if(!isNaN(+seq[k])){last=seq[k];break}}var opts=pool.filter(function(x){return x!==last});var p=(i===0&&clv===1)?'1':opts[Math.floor(Math.random()*opts.length)];seq.push(p)}
  seqEl.innerHTML=seq.map(function(s,i){return '<b class="'+(isNaN(+s)?'def':'')+'" style="animation-delay:'+(i*.08)+'s">'+s+'</b>'}).join('');
  var said=seq.map(function(s){return isNaN(+s)?s.toLowerCase():s}).join(', ');$('#comboSay').textContent='Đọc to: '+said+'. Lặp lại 10 lần mỗi bên, nghỉ 30 giây.';
  cardEls.forEach(function(c){c.classList.toggle('hit',seq.indexOf(c.getAttribute('data-p'))>-1)})}
 var cb=$('#comboBtn');if(cb){cb.addEventListener('click',make);make()}
})();

/* ================= HUẤN LUYỆN VIÊN ================= */
(function(){
 var grid=$('#coaches');if(!grid)return;
 $$('[data-f]').forEach(function(b){b.addEventListener('click',function(){var f=b.getAttribute('data-f');$$('[data-f]').forEach(function(x){x.setAttribute('aria-pressed',x===b)});var n=0;
  $$('.coach',grid).forEach(function(c){var on=f==='all'||c.getAttribute('data-sp').split(' ').indexOf(f)>-1;c.classList.toggle('off',!on);if(on)n++});$('#coachCount').textContent=n+' huấn luyện viên'})});
 var dlg=$('#prof');
 function open(id){var c=coachById(id);if(!c||!dlg)return;
  var slots=c.hours.slice(0,8).map(function(h){return '<span>'+pad(h)+':00</span>'}).join('');
  $('#profBody').innerHTML='<div class="prof-in"><figure><img src="'+IMG+c.img+'?auto=format&fit=crop&w=900&q=80" alt="Ảnh huấn luyện viên '+esc(c.n)+' (ảnh minh hoạ)" style="object-position:'+c.pos+'" width="900" height="1100"></figure><div class="prof-b"><span class="eyebrow">'+esc(c.role)+' · '+esc(c.yrs)+'</span><h2 id="profTitle">'+esc(c.n)+'</h2><p>'+esc(c.bio)+'</p><h4>Hợp với</h4><p>'+esc(c.good)+'</p><h4>Chứng chỉ</h4><ul class="ticks">'+c.cert.map(function(x){return '<li>'+icon('i-check')+'<span>'+esc(x)+'</span></li>'}).join('')+'</ul><h4>Khung giờ thường nhận PT</h4><div class="slots-mini">'+slots+'</div><div class="nav-btns" style="justify-content:flex-start"><'+'a class="btn" href="../lich/?hlv='+c.id+'">Xem giờ trống của '+esc(c.n.split(' ').pop())+icon('i-arrow')+'</a></div></div></div>';
  if(dlg.showModal){dlg.showModal();body.classList.add('lock')}else{dlg.setAttribute('open','')}}
 $$('[data-prof]').forEach(function(b){b.addEventListener('click',function(){open(b.getAttribute('data-prof'))})});
 if(dlg){dlg.addEventListener('close',function(){body.classList.remove('lock')});$('#profX').addEventListener('click',function(){dlg.close()});dlg.addEventListener('click',function(e){if(e.target===dlg)dlg.close()})}
})();

/* ================= LỊCH & ĐẶT BUỔI ================= */
(function(){
 var slotsEl=$('#slots');if(!slotsEl)return;
 var q=new URLSearchParams(location.search),coach=q.get('hlv');if(!coachById(coach))coach=store.get('coach','all');if(coach!=='all'&&!coachById(coach))coach='all';
 var today=new Date();today.setHours(0,0,0,0);
 var days=[];for(var i=0;i<7;i++){var d=new Date(today);d.setDate(today.getDate()+i);days.push(d)}
 var di=0,pick=null;
 $('#days').innerHTML=days.map(function(d,i){return '<button type="button" class="day" data-d="'+i+'" aria-pressed="'+(i===0)+'" aria-label="'+DOWF[d.getDay()]+' '+dmy(d)+'"><small>'+(i===0?'Hôm nay':DOW[d.getDay()])+'</small><b>'+pad(d.getDate())+'/'+pad(d.getMonth()+1)+'</b></button>'}).join('');
 function list(){var d=days[di],dow=d.getDay(),o=OPEN[dow],res=[],nowH=new Date().getHours();
  for(var h=Math.ceil(o[0]);h<Math.floor(o[1]);h++){
   if(di===0&&h<=nowH)continue;
   var g=(GROUP[dow]||[]).filter(function(x){return x.h===h&&(coach==='all'||x.c===coach)})[0];
   if(g){res.push({h:h,grp:g,ok:g.left>0,c:g.c});continue}
   var cs=(coach==='all'?COACH:[coachById(coach)]).filter(function(c){return c.hours.indexOf(h)>-1});
   if(!cs.length)continue;
   var free=cs.filter(function(c){return hash(c.id+dmy(d)+h)>.42});
   res.push({h:h,ok:free.length>0,c:free.length?free[0].id:cs[0].id,n:free.length})}
  return res}
 function render(){
  $$('[data-coach]').forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-coach')===coach)});
  $$('.day').forEach(function(b,i){b.setAttribute('aria-pressed',i===di)});
  var L=list();
  if(!L.length){slotsEl.innerHTML='<p class="note" style="grid-column:1/-1">Hôm nay không còn khung giờ cho lựa chọn này. Thử ngày khác hoặc chọn “Tất cả HLV”.</p>';return}
  slotsEl.innerHTML=L.map(function(s){var c=coachById(s.c),lab=s.grp?(s.ok?s.grp.name+' · còn '+s.grp.left+' chỗ':s.grp.name+' · đã kín'):(s.ok?(coach==='all'?(s.n>1?s.n+' HLV trống':c.n.split(' ').pop()+' trống'):'Còn trống'):'Đã kín');
   var on=pick&&pick.di===di&&pick.h===s.h;
   return '<button type="button" class="slot'+(s.grp?' grp':'')+'" data-h="'+s.h+'" data-c="'+s.c+'"'+(s.grp?' data-g="'+esc(s.grp.name)+'"':'')+(s.ok?'':' disabled')+' aria-pressed="'+!!on+'"><b>'+pad(s.h)+':00–'+pad(s.h+1)+':00</b><span>'+esc(lab)+'</span></button>'}).join('');
 }
 function sum(){var box=$('#sum');if(!pick){$('#sumC').textContent='Chưa chọn';$('#sumD').textContent='Chưa chọn';$('#sumH').textContent='Chưa chọn';$('#sumT').textContent='—';$('#sumGo').setAttribute('aria-disabled','true');$('#sumGo').classList.add('off');return}
  var d=days[pick.di],c=coachById(pick.c);$('#sumC').textContent=c.n;$('#sumD').textContent=DOWF[d.getDay()]+', '+dmy(d);$('#sumH').textContent=pad(pick.h)+':00–'+pad(pick.h+1)+':00';$('#sumT').textContent=pick.g?'Lớp nhóm: '+pick.g:'PT 1 kèm 1';
  $('#sumGo').removeAttribute('aria-disabled');$('#sumGo').classList.remove('off');box.classList.remove('flash');void box.offsetWidth;box.classList.add('flash');
  store.set('slot',{coach:c.id,cn:c.n,date:dmy(d),dow:DOWF[d.getDay()],time:pad(pick.h)+':00–'+pad(pick.h+1)+':00',type:pick.g?'Lớp nhóm: '+pick.g:'PT 1 kèm 1'})}
 $$('[data-coach]').forEach(function(b){b.addEventListener('click',function(){coach=b.getAttribute('data-coach');store.set('coach',coach);pick=null;render();sum()})});
 $('#days').addEventListener('click',function(e){var b=e.target.closest('.day');if(!b)return;di=+b.getAttribute('data-d');render()});
 slotsEl.addEventListener('click',function(e){var b=e.target.closest('.slot');if(!b||b.disabled)return;pick={di:di,h:+b.getAttribute('data-h'),c:b.getAttribute('data-c'),g:b.getAttribute('data-g')};render();sum()});
 $('#sumGo').addEventListener('click',function(e){if(!pick){e.preventDefault();var n=$('#sumNote');n.textContent='Chọn một khung giờ còn trống trước nhé.';n.classList.remove('flash');void n.offsetWidth;n.classList.add('flash')}});
 if(list().length<4)di=1;
 render();sum();
})();

/* ================= ĐẶT BUỔI THỬ: form nhiều bước ================= */
(function(){
 var f=$('#bookForm');if(!f)return;
 var steps=$$('.step',f),prog=$$('#prog li'),cur=0;
 var slot=store.get('slot',null),pick=store.get('pick',null);
 /* ngày, giờ */
 var dsel=$('#fDate'),hsel=$('#fTime'),today=new Date();today.setHours(0,0,0,0);
 for(var i=1;i<=10;i++){var d=new Date(today);d.setDate(today.getDate()+i);var o=document.createElement('option');o.value=dmy(d);o.textContent=DOWF[d.getDay()]+', '+dmy(d);dsel.appendChild(o)}
 ['06:00','07:00','08:00','09:00','10:00','15:00','16:00','17:00','18:00','19:00','20:00'].forEach(function(t){var o=document.createElement('option');o.value=t;o.textContent=t+'–'+pad(+t.slice(0,2)+1)+':00';hsel.appendChild(o)});
 var csel=$('#fCoach');COACH.forEach(function(c){var o=document.createElement('option');o.value=c.id;o.textContent=c.n+' · '+c.role;csel.appendChild(o)});
 if(slot){var pre=$('#fromLich');pre.hidden=false;$('#fromLichTxt').textContent=slot.type+', '+slot.dow+' '+slot.date+', '+slot.time+' với HLV '+slot.cn+'.';
  var has=false;$$('option',dsel).forEach(function(o){if(o.value===slot.date)has=true});if(!has){var o2=document.createElement('option');o2.value=slot.date;o2.textContent=slot.dow+', '+slot.date;dsel.insertBefore(o2,dsel.options[1])}
  dsel.value=slot.date;var t=slot.time.slice(0,5);var hh=false;$$('option',hsel).forEach(function(o){if(o.value===t)hh=true});if(!hh){var o3=document.createElement('option');o3.value=t;o3.textContent=slot.time;hsel.appendChild(o3)}hsel.value=t;csel.value=slot.coach;
  var tp=$('input[name="type"][value="'+(/nhóm/i.test(slot.type)?'nhom':/Boxing/i.test(slot.type)?'boxing':'pt')+'"]');if(tp)tp.checked=true}
 if(pick){var pg=$('select[name="goal"]');if(pg){$$('option',pg).forEach(function(o){if(o.value===pick.goal)pg.value=pick.goal})}var pp=$('#fromPick');if(pp){pp.hidden=false;$('#fromPickTxt').textContent=pick.pk+', '+pick.n+' buổi, tạm tính '+money(pick.total)+'.'}
  if(!slot){var tp2=$('input[name="type"][value="'+(pick.fmt==='nhom'?'nhom':(pick.goal==='boxing'||pick.goal==='thi-dau')?'boxing':'pt')+'"]');if(tp2)tp2.checked=true;if(pick.coach)csel.value=pick.coach}}
 function show(i,init){cur=i;steps.forEach(function(s,j){s.hidden=j!==i});prog.forEach(function(p,j){p.className=j<i?'done':j===i?'on':''});
  if(i===3)review();var h=steps[i].querySelector('h2');if(init)return;if(h){h.setAttribute('tabindex','-1');h.focus({preventScroll:true})}
  var top=f.getBoundingClientRect().top+scrollY-90;if(Math.abs(scrollY-top)>120)scrollTo({top:top,behavior:reduce?'auto':'smooth'})}
 function setErr(el,msg){var w=el.closest('.fld');if(!w)return;w.classList.toggle('bad',!!msg);var e=w.querySelector('.err');if(e)e.textContent=msg||'';el.setAttribute('aria-invalid',msg?'true':'false')}
 function valid(i){var ok=true;
  if(i===0){var t=f.querySelector('input[name="type"]:checked'),e=$('#typeErr');e.textContent=t?'':'Chọn một hình thức muốn thử.';if(!t)ok=false;var g=f.goal;setErr(g,g.value?'':'Chọn mục tiêu để HLV chuẩn bị bài.');if(!g.value)ok=false}
  if(i===1){[dsel,hsel].forEach(function(el){setErr(el,el.value?'':'Chọn '+(el===dsel?'ngày':'giờ')+' bạn đến được.');if(!el.value)ok=false})}
  if(i===2){var n=f.fullname,p=f.phone,c=f.consent;var nv=n.value.trim();setErr(n,nv.length<2?'Nhập họ tên để studio gọi đúng tên bạn.':'');if(nv.length<2)ok=false;
   var pv=p.value.replace(/[\s.]/g,'');var pok=/^0\d{9}$/.test(pv);setErr(p,pok?'':'Số điện thoại gồm 10 số, bắt đầu bằng 0.');if(!pok)ok=false;
   var ce=$('#consentErr');ce.textContent=c.checked?'':'Cần đồng ý để studio liên hệ xác nhận buổi thử.';if(!c.checked)ok=false}
  if(!ok){var first=steps[i].querySelector('[aria-invalid="true"]')||steps[i].querySelector('input');if(first&&first.focus)first.focus()}
  return ok}
 $$('[data-next]',f).forEach(function(b){b.addEventListener('click',function(){if(valid(cur))show(cur+1)})});
 $$('[data-prev]',f).forEach(function(b){b.addEventListener('click',function(){show(cur-1)})});
 $$('input,select',f).forEach(function(el){el.addEventListener('change',function(){if(el.closest('.fld.bad'))setErr(el,'')})});
 function label(sel){return sel.options[sel.selectedIndex]?sel.options[sel.selectedIndex].text:''}
 function review(){var t=f.querySelector('input[name="type"]:checked');var TY={pt:'PT 1 kèm 1',nhom:'Nhóm nhỏ 3–6 người',boxing:'Boxing 1 kèm 1'};
  var rows=[['Hình thức',t?TY[t.value]:'',0],['Mục tiêu',label(f.goal),0],['Thời gian',label(dsel)+', '+label(hsel),1],['Huấn luyện viên',csel.value?label(csel):'Studio xếp HLV phù hợp',1],['Họ tên',f.fullname.value.trim(),2],['Điện thoại',f.phone.value.trim(),2]];
  if(f.note.value.trim())rows.push(['Ghi chú sức khoẻ',f.note.value.trim(),2]);
  $('#review').innerHTML=rows.map(function(r){return '<div><dt>'+r[0]+'</dt><dd>'+esc(r[1])+'</dd><button type="button" data-go="'+r[2]+'">Sửa</button></div>'}).join('');
  $$('#review [data-go]').forEach(function(b){b.addEventListener('click',function(){show(+b.getAttribute('data-go'))})})}
 f.addEventListener('submit',function(e){e.preventDefault();if(!valid(2))return show(2);
  var A='ABCDEFGHJKLMNPQRSTUVWXYZ23456789',c='';for(var i=0;i<4;i++)c+=A[Math.floor(Math.random()*A.length)];
  var d=dsel.value.split('/');var code='TD-'+d[0]+d[1]+'-'+c;
  $('#doneCode').textContent=code;$('#doneWhen').textContent=label(dsel)+', '+label(hsel);$('#doneName').textContent=f.fullname.value.trim().split(' ').pop();
  steps.forEach(function(s){s.hidden=true});$('#prog').hidden=true;var dn=$('#done');dn.hidden=false;var h=dn.querySelector('h2');h.setAttribute('tabindex','-1');h.focus();
  try{localStorage.removeItem(KEY+'slot')}catch(err){}});
 $('#again').addEventListener('click',function(){f.reset();$('#done').hidden=true;$('#prog').hidden=false;show(0)});
 show(0,true);
})();
})();
