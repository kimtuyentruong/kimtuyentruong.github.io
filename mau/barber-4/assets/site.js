/* Đồng Kéo Barber House: JS dùng chung (mẫu barber-4). Dữ liệu mẫu, không gửi đi đâu. */
(function(){
'use strict';
var U='https://images.unsplash.com/';
function im(id,w,h){return U+id+'?auto=format&fit=crop&w='+(w||800)+(h?'&h='+h:'')+'&q=80'}
var D={
 branches:{
  bt:{name:'Bến Thành',ward:'Phường Bến Thành',addr:'Số 18 (địa chỉ mẫu), Phường Bến Thành, TP.HCM',open:[9,21],sun:[9,20],chairs:8,note:'Gần chợ Bến Thành, có chỗ gửi xe máy.',img:'photo-1585747860715-2ba37e788b70'},
  pn:{name:'Phú Nhuận',ward:'Phường Phú Nhuận',addr:'Số 42 (địa chỉ mẫu), Phường Phú Nhuận, TP.HCM',open:[10,22],sun:[10,21],chairs:6,note:'Mở muộn đến 22:00, hợp người tan làm trễ.',img:'photo-1610475680335-dafab5475150'},
  ak:{name:'An Khánh',ward:'Phường An Khánh',addr:'Số 7 (địa chỉ mẫu), Phường An Khánh, TP.HCM',open:[9,21.5],sun:[9,21.5],chairs:10,note:'Chi nhánh lớn, có phòng riêng và học viện.',img:'photo-1592647420148-bfcc177e2117'}
 },
 services:[
  {id:'sig',cat:'cat',name:'Cắt tóc Signature',min:45,p:{bt:250,pn:220,ak:290},d:'Tư vấn dáng mặt, cắt, gội xả, tạo kiểu và hướng dẫn vuốt tại nhà.'},
  {id:'exp',cat:'cat',name:'Cắt nhanh Express',min:25,p:{bt:160,pn:140,ak:180},d:'Giữ form cũ, tỉa gọn gáy và mai cho tuần bận rộn.'},
  {id:'fade',cat:'cat',name:'Fade &amp; Taper',min:50,p:{bt:280,pn:250,ak:320},d:'Skin, low, mid hoặc high fade, chuyển màu mượt bằng tông đơ và kéo.'},
  {id:'mst',cat:'cat',name:'Cắt với thợ Master',min:60,p:{bt:380,pn:340,ak:420},d:'Thợ chính phụ trách từ tư vấn đến tạo kiểu, phù hợp lần đổi kiểu lớn.'},
  {id:'shave',cat:'rau',name:'Cạo mặt khăn nóng',min:30,p:{bt:180,pn:160,ak:200},d:'Hai lượt khăn nóng, kem cạo, dao thẳng, khăn lạnh se lỗ chân lông.'},
  {id:'beard',cat:'rau',name:'Tỉa &amp; tạo dáng râu',min:30,p:{bt:150,pn:130,ak:170},d:'Tạo đường viền râu hợp dáng hàm, dưỡng dầu râu.'},
  {id:'wash',cat:'cham',name:'Gội thảo mộc, massage cổ vai',min:25,p:{bt:120,pn:100,ak:140},d:'Gội bạc hà, bấm huyệt cổ vai gáy, sấy tạo phồng.'},
  {id:'scalp',cat:'cham',name:'Chăm sóc da đầu dầu nhờn',min:40,p:{bt:260,pn:230,ak:290},d:'Làm sạch sâu, tẩy da chết da đầu, xả cân bằng dầu.'},
  {id:'perm',cat:'mau',name:'Uốn texture / con sâu',min:120,p:{bt:650,pn:590,ak:720},d:'Uốn lạnh tạo độ rối tự nhiên, giữ nếp 6–8 tuần (tuỳ tóc).'},
  {id:'grey',cat:'mau',name:'Nhuộm phủ bạc',min:60,p:{bt:450,pn:400,ak:490},d:'Màu nâu trầm hoặc đen tự nhiên, ít mùi.'},
  {id:'color',cat:'mau',name:'Nhuộm thời trang (từ)',min:90,p:{bt:790,pn:720,ak:850},d:'Khói, nâu lạnh, bạch kim; giá theo độ dài và số lần tẩy.'},
  {id:'gent',cat:'combo',name:'Combo Quý ông',min:90,p:{bt:480,pn:430,ak:540},d:'Cắt Signature + cạo khăn nóng + gội thảo mộc.'},
  {id:'dad',cat:'combo',name:'Combo Cha &amp; con',min:70,p:{bt:400,pn:360,ak:450},d:'Hai suất cắt cùng giờ, bé dưới 12 tuổi, có ghế nâng.'},
  {id:'groom',cat:'combo',name:'Gói Chú rể',min:120,p:{bt:1200,pn:1100,ak:1350},d:'Thử kiểu trước 1 tuần, cắt, cạo, chăm da mặt, tạo kiểu ngày cưới tại tiệm.'}
 ],
 cats:{cat:'Cắt tóc',rau:'Cạo &amp; râu',cham:'Gội &amp; chăm sóc',mau:'Uốn &amp; màu',combo:'Combo'},
 barbers:[
  {id:'khoa',name:'Trần Minh Khoa',role:'Master Barber',br:'bt',yrs:11,sp:'Fade, cạo dao thẳng',img:'photo-1593702288056-7927b442d0fa',off:[1],bio:'Đứng ghế từ 2015 (mẫu), phụ trách đào tạo khoá Fade nâng cao ở học viện.'},
  {id:'phuc',name:'Lê Hoàng Phúc',role:'Senior Barber',br:'bt',yrs:7,sp:'Side part, pompadour',img:'photo-1635273051937-a0ddef9573b6',off:[3],bio:'Mê kiểu cổ điển, tay kéo chắc, nói chuyện vui.'},
  {id:'tai',name:'Nguyễn Đức Tài',role:'Senior Barber',br:'pn',yrs:6,sp:'Uốn texture, two block',img:'photo-1588771930296-88c2cb03f386',off:[2],bio:'Chuyên tóc dày, cứng; tư vấn uốn cho người mới.'},
  {id:'bao',name:'Phạm Quốc Bảo',role:'Barber',br:'pn',yrs:4,sp:'Buzz, crop, tóc học sinh',img:'photo-1605497788044-5a32c7078486',off:[4],bio:'Nhanh, gọn, hợp lịch cắt định kỳ 3 tuần.'},
  {id:'sang',name:'Võ Thanh Sang',role:'Master Barber',br:'ak',yrs:10,sp:'Râu, cạo khăn nóng',img:'photo-1647140655214-e4a2d914971f',off:[1],bio:'Giảng viên khoá Cạo khăn nóng; tỉ mỉ từng đường viền râu.'},
  {id:'huy',name:'Đặng Gia Huy',role:'Barber',br:'ak',yrs:3,sp:'Nhuộm thời trang, mullet',img:'photo-1541533848490-bc8115cd6522',off:[5],bio:'Học viên khoá đầu của học viện, thích màu khói và bạch kim.'}
 ],
 styles:[
  {id:'textured-crop',name:'Textured Crop',faces:['tron','vuong','oval'],len:'ngan',lv:1,min:3,img:'photo-1622286342621-4bd786c2447c',d:'Mái ngắn rối nhẹ, hai bên fade. Sáng vuốt 3 phút.'},
  {id:'hard-part',name:'Hard Part Fade',faces:['oval','vuong','dai'],len:'vua',lv:2,min:5,img:'photo-1622296089863-eb7fc530daa8',d:'Đường ngôi cạo rõ, gọn gàng, đậm chất barber.'},
  {id:'quiff',name:'Quiff hiện đại',faces:['tron','oval','tim'],len:'vua',lv:2,min:8,img:'photo-1583195764036-6dc248ac07d9',d:'Mái dựng cao vừa, kéo dài khuôn mặt tròn.'},
  {id:'buzz',name:'Buzz Cut',faces:['oval','vuong'],len:'ngan',lv:1,min:0,img:'photo-1507003211169-0a1dd7228f2d',d:'Gọn tối đa, hợp người chơi thể thao.'},
  {id:'pompadour',name:'Pompadour',faces:['tron','oval'],len:'vua',lv:3,min:10,img:'photo-1527980965255-d3b416303d12',d:'Phồng cao, bóng nhẹ, cần pomade gốc nước.'},
  {id:'two-block',name:'Two Block',faces:['dai','oval','tim'],len:'vua',lv:2,min:6,img:'photo-1506794778202-cad84cf45f1d',d:'Hai tầng tách rõ, mái phủ trán mềm.'},
  {id:'slick-back',name:'Slick Back',faces:['oval','vuong'],len:'vua',lv:2,min:5,img:'photo-1590540179852-2110a54f813a',d:'Vuốt ngược bóng, hợp vest và tiệc tối.'},
  {id:'mid-fade',name:'Mid Fade + Crop',faces:['vuong','oval','tron'],len:'ngan',lv:1,min:5,img:'photo-1593702275687-f8b402bf1fb5',d:'Fade cao ngang thái dương, đỉnh để dài vừa.'},
  {id:'french-crop',name:'French Crop',faces:['dai','tim'],len:'ngan',lv:1,min:4,img:'photo-1648221122323-572c13a31663',d:'Mái ngang ngắn, làm khuôn mặt dài cân đối hơn.'},
  {id:'curtain',name:'Rẽ ngôi giữa',faces:['dai','tim','oval','vuong'],len:'dai',lv:2,min:8,img:'photo-1542178243-bc20204b769f',d:'Mái chia hai bên, mềm, hợp tóc thẳng dày.'},
  {id:'perm',name:'Uốn con sâu',faces:['dai','vuong','oval'],len:'dai',lv:2,min:4,img:'photo-1605497787865-e6d4762b386f',d:'Độ rối tự nhiên, xịt muối biển là xong.'},
  {id:'ivy',name:'Ivy League',faces:['vuong','dai','oval','tron'],len:'ngan',lv:1,min:4,img:'photo-1500648767791-00dcc994a43e',d:'Cổ điển kiểu sinh viên, đi làm hay đi chơi đều hợp.'}
 ],
 faces:{tron:'Mặt tròn',vuong:'Mặt vuông',dai:'Mặt dài',oval:'Trái xoan',tim:'Trái tim'},
 lens:{ngan:'Ngắn',vua:'Vừa',dai:'Dài'},
 products:[
  {id:'clay',name:'Matte Clay',sub:'Sáp đất sét mờ · 80g',cat:'sap',p:290,c:'#B86A34',hold:4,shine:1,d:'Giữ nếp mạnh, không bóng, gội ra dễ.'},
  {id:'pomade',name:'Water Pomade',sub:'Pomade gốc nước · 100g',cat:'sap',p:320,c:'#7A3B1E',hold:3,shine:4,d:'Bóng vừa, hợp slick back và pompadour.'},
  {id:'paste',name:'Fiber Paste',sub:'Sáp sợi · 80g',cat:'sap',p:270,c:'#D9B36C',hold:3,shine:2,d:'Tạo sợi rời, vuốt lại được trong ngày.'},
  {id:'powder',name:'Volume Powder',sub:'Bột tạo phồng · 20g',cat:'phu',p:220,c:'#E6D5BC',hold:2,shine:0,d:'Rắc chân tóc để dựng phồng, nhẹ tóc.'},
  {id:'salt',name:'Sea Salt Spray',sub:'Xịt muối biển · 200ml',cat:'phu',p:260,c:'#5E7F86',hold:2,shine:1,d:'Lót trước khi sấy, tạo độ rối kiểu đi biển.'},
  {id:'oil',name:'Beard Oil Gỗ Trầm',sub:'Dầu dưỡng râu · 30ml',cat:'rau',p:280,c:'#4A2A1A',hold:0,shine:2,d:'Mềm râu, hết ngứa, mùi gỗ ấm.'},
  {id:'shampoo',name:'Dầu gội Bạc hà',sub:'Làm sạch da đầu · 250ml',cat:'cham',p:230,c:'#3F5A4A',hold:0,shine:0,d:'Mát da đầu, giảm bết dầu cuối ngày.'},
  {id:'comb',name:'Lược gỗ đàn hương',sub:'Lược bỏ túi',cat:'phu',p:150,c:'#8E5A33',hold:0,shine:0,d:'Răng thưa, chống tĩnh điện, vừa túi áo.'},
  {id:'gift',name:'Hộp quà Quý ông',sub:'Clay + dầu râu + lược',cat:'qua',p:790,c:'#CF8246',hold:4,shine:1,d:'Hộp gỗ khắc tên miễn phí (mẫu).'}
 ],
 pcats:{sap:'Sáp &amp; pomade',phu:'Tạo phồng &amp; phụ kiện',rau:'Chăm râu',cham:'Chăm tóc',qua:'Quà tặng'},
 courses:[
  {id:'co-ban',name:'Barber cơ bản',wk:12,p:18000000,lv:'Người mới',d:'Từ cầm kéo, tông đơ đến 12 kiểu tóc nam phổ biến, thực hành trên mẫu thật từ tuần 5.'},
  {id:'fade',name:'Fade nâng cao',wk:4,p:7500000,lv:'Đã biết cắt',d:'Skin fade, burst fade, taper; chuyển màu không vết và tốc độ 35 phút một khách.'},
  {id:'cao',name:'Cạo khăn nóng &amp; râu',wk:2,p:4200000,lv:'Đã biết cắt',d:'Dao thẳng, an toàn vệ sinh, tạo dáng râu theo khuôn hàm.'},
  {id:'tu-lam',name:'Workshop tự tạo kiểu',wk:0,p:450000,lv:'Ai cũng học được',d:'Một buổi 2 tiếng: chọn sáp, sấy, vuốt 3 kiểu thường ngày.'}
 ],
 intakes:{'co-ban':['04/01/2027','01/03/2027','03/05/2027'],'fade':['11/01/2027','08/03/2027','10/05/2027'],'cao':['18/01/2027','15/03/2027'],'tu-lam':['05/12/2026','19/12/2026','09/01/2027']}
};
window.DK=D;

/* ---- tiện ích ---- */
var $=function(s,c){return (c||document).querySelector(s)},$$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
var K='dk-barber4:';
var store={get:function(k,d){try{var v=localStorage.getItem(K+k);return v?JSON.parse(v):d}catch(e){return d}},set:function(k,v){try{localStorage.setItem(K+k,JSON.stringify(v))}catch(e){}}};
var RM=!!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
var me=$('script[src*="assets/site.js"]'),root=me?me.getAttribute('src').replace(/assets\/site\.js.*$/,''):'./';
function vnd(k){return (k*1000).toLocaleString('vi-VN').replace(/,/g,'.')+'đ'}
function vndFull(n){return Math.round(n).toLocaleString('vi-VN').replace(/,/g,'.')+'đ'}
function icon(n,c){return '<svg class="'+(c||'ic')+'" aria-hidden="true"><use href="#i-'+n+'"/></svg>'}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function toast(t){var el=$('#toast');if(!el)return;el.textContent=t;el.classList.add('show');clearTimeout(toast._t);toast._t=setTimeout(function(){el.classList.remove('show')},2600)}
function code(p){var c='';for(var i=0;i<5;i++)c+='ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random()*32)];return p+'-'+c}
function pad(n){return (n<10?'0':'')+n}
function hm(h){return pad(Math.floor(h))+':'+pad(Math.round((h%1)*60))}
function vnNow(){var d=new Date(),u=d.getTime()+d.getTimezoneOffset()*60000;return new Date(u+7*3600000)}
function hoursOf(b,day){var x=D.branches[b];return day===0?x.sun:x.open}
function openState(b){var n=vnNow(),h=n.getHours()+n.getMinutes()/60,r=hoursOf(b,n.getDay()),o=h>=r[0]&&h<r[1];
 return {open:o,txt:o?('Đang mở · đóng lúc '+hm(r[1])):(h<r[0]?('Đã đóng · mở lúc '+hm(r[0])):('Đã đóng · mai mở '+hm(hoursOf(b,(n.getDay()+1)%7)[0]))),range:hm(r[0])+'–'+hm(r[1])}}
var DKU=window.DKU={$:$,$$:$$,store:store,vnd:vnd,vndFull:vndFull,icon:icon,esc:esc,toast:toast,code:code,openState:openState,hm:hm,pad:pad,vnNow:vnNow,hoursOf:hoursOf,root:root,im:im,RM:RM};
/* ---- header, menu, badge, lên đầu ---- */
var hdr=$('#hdr'),badge=$('#ktBadge'),toTop=$('#toTop'),burger=$('#burger'),mnav=$('#mnav'),lastW=innerWidth;
function onScroll(){var y=window.pageYOffset;badge=badge||$('#ktBadge');if(hdr)hdr.classList.toggle('scrolled',y>8);if(badge)badge.classList.toggle('show',y>innerHeight*.85);if(toTop)toTop.classList.toggle('show',y>innerHeight*1.2)}
addEventListener('scroll',onScroll,{passive:true});onScroll();document.addEventListener('DOMContentLoaded',onScroll);
if(toTop)toTop.addEventListener('click',function(){scrollTo({top:0,behavior:RM?'auto':'smooth'})});
function setMenu(o){if(!mnav)return;mnav.classList.toggle('open',o);burger.setAttribute('aria-expanded',String(o));burger.setAttribute('aria-label',o?'Đóng menu':'Mở menu');document.body.classList.toggle('lock',o);if(hdr)hdr.classList.toggle('solid',o)}
if(burger)burger.addEventListener('click',function(){setMenu(!mnav.classList.contains('open'))});
addEventListener('keydown',function(e){if(e.key==='Escape'){if(mnav&&mnav.classList.contains('open')){setMenu(false);burger.focus()}closeSearch();closeCart()}});
addEventListener('resize',function(){if(innerWidth!==lastW){lastW=innerWidth;if(innerWidth>1180)setMenu(false)}});
/* ---- hiện dần ---- */
function revealAll(c){$$('.rv',c).forEach(function(el){el.classList.add('in')})}
DKU.reveal=function(c){if(document.documentElement.classList.contains('static')||!('IntersectionObserver' in window))return revealAll(c);$$('.rv:not(.in)',c).forEach(function(el){if(el.getBoundingClientRect().top<innerHeight)el.classList.add('in');else io.observe(el)})};
var io='IntersectionObserver' in window?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'}):null;
DKU.reveal(document);
/* ---- trạng thái chi nhánh ---- */
function paintStatus(){$$('[data-open]').forEach(function(el){var s=openState(el.getAttribute('data-open'));el.classList.toggle('open',s.open);el.classList.toggle('closed',!s.open);el.innerHTML='<i></i>'+s.txt});
 $$('[data-hours]').forEach(function(el){var x=D.branches[el.getAttribute('data-hours')];el.textContent='T2–T7 '+hm(x.open[0])+'–'+hm(x.open[1])+' · CN '+hm(x.sun[0])+'–'+hm(x.sun[1])})}
DKU.paintStatus=paintStatus;paintStatus();setInterval(paintStatus,60000);
/* ---- tab chung ---- */
DKU.tabs=function(t){var bs=$$('[role=tab]',t);function sel(i){bs.forEach(function(b,k){b.setAttribute('aria-selected',String(k===i));b.tabIndex=k===i?0:-1;var p=document.getElementById(b.getAttribute('aria-controls'));if(p)p.hidden=k!==i});t.dispatchEvent(new CustomEvent('tab',{detail:bs[i]}))}
 bs.forEach(function(b,i){b.addEventListener('click',function(){sel(i)});b.addEventListener('keydown',function(e){var j=e.key==='ArrowRight'?i+1:e.key==='ArrowLeft'?i-1:null;if(j===null)return;j=(j+bs.length)%bs.length;sel(j);bs[j].focus()})});return sel};
$$('[data-tabs]').forEach(DKU.tabs);

/* ---- ảnh sản phẩm minh hoạ (SVG) ---- */
function pack(p){var c=p.c,lab='#F2E8DA',t=esc(p.name.split(' ')[0].toUpperCase());
 if(p.cat==='sap')return '<svg viewBox="0 0 200 200" aria-hidden="true"><ellipse cx="100" cy="166" rx="70" ry="10" fill="#000" opacity=".35"/><rect x="34" y="74" width="132" height="88" rx="14" fill="'+c+'"/><rect x="30" y="56" width="140" height="30" rx="10" fill="#2A1F18"/><rect x="30" y="56" width="140" height="6" rx="3" fill="#3A2B21"/><rect x="48" y="98" width="104" height="46" rx="6" fill="'+lab+'"/><text x="100" y="116" text-anchor="middle" font-family="Bricolage Grotesque,sans-serif" font-weight="800" font-size="15" fill="#1B130E">'+t+'</text><text x="100" y="134" text-anchor="middle" font-family="Be Vietnam Pro,sans-serif" font-size="8.5" letter-spacing="2" fill="#8A4519">ĐỒNG KÉO</text></svg>';
 if(p.cat==='phu'&&p.id==='comb')return '<svg viewBox="0 0 200 200" aria-hidden="true"><g transform="rotate(-18 100 100)"><rect x="28" y="78" width="144" height="22" rx="6" fill="'+c+'"/><g fill="'+c+'">'+Array.apply(null,{length:22}).map(function(_,i){return '<rect x="'+(32+i*6.3)+'" y="98" width="3.4" height="'+(i<8?34:28)+'" rx="1.5"/>'}).join('')+'</g><text x="100" y="93" text-anchor="middle" font-family="Be Vietnam Pro,sans-serif" font-size="8" letter-spacing="2" fill="#F2E8DA">ĐỒNG KÉO</text></g></svg>';
 if(p.cat==='qua')return '<svg viewBox="0 0 200 200" aria-hidden="true"><ellipse cx="100" cy="170" rx="78" ry="9" fill="#000" opacity=".35"/><rect x="26" y="70" width="148" height="96" rx="8" fill="#5A3A24"/><rect x="26" y="56" width="148" height="26" rx="6" fill="#6E4A2F"/><rect x="92" y="56" width="16" height="110" fill="'+c+'"/><path d="M100 56c-18-22-40-10-24 0M100 56c18-22 40-10 24 0" fill="none" stroke="'+c+'" stroke-width="6" stroke-linecap="round"/><text x="140" y="132" text-anchor="middle" font-family="Bricolage Grotesque,sans-serif" font-weight="800" font-size="11" fill="#F2E8DA" opacity=".85">QUÝ ÔNG</text></svg>';
 var tall=p.cat==='rau'||p.id==='salt'||p.cat==='cham';
 if(tall)return '<svg viewBox="0 0 200 200" aria-hidden="true"><ellipse cx="100" cy="176" rx="46" ry="8" fill="#000" opacity=".35"/><rect x="84" y="'+(p.id==='oil'?46:30)+'" width="32" height="26" rx="5" fill="#2A1F18"/>'+(p.id==='oil'?'<rect x="94" y="28" width="12" height="20" rx="4" fill="#1A130F"/>':'')+'<rect x="62" y="68" width="76" height="106" rx="'+(p.id==='oil'?26:14)+'" fill="'+c+'"/><rect x="72" y="100" width="56" height="50" rx="5" fill="'+lab+'"/><text x="100" y="121" text-anchor="middle" font-family="Bricolage Grotesque,sans-serif" font-weight="800" font-size="11" fill="#1B130E">'+t+'</text><text x="100" y="137" text-anchor="middle" font-family="Be Vietnam Pro,sans-serif" font-size="6.5" letter-spacing="1.6" fill="#8A4519">ĐỒNG KÉO</text></svg>';
 return '<svg viewBox="0 0 200 200" aria-hidden="true"><ellipse cx="100" cy="172" rx="50" ry="8" fill="#000" opacity=".35"/><rect x="58" y="60" width="84" height="108" rx="10" fill="'+c+'"/><rect x="66" y="44" width="68" height="22" rx="6" fill="#2A1F18"/><rect x="68" y="96" width="64" height="44" rx="5" fill="#1B130E" opacity=".85"/><text x="100" y="116" text-anchor="middle" font-family="Bricolage Grotesque,sans-serif" font-weight="800" font-size="12" fill="#F2E8DA">'+t+'</text><text x="100" y="131" text-anchor="middle" font-family="Be Vietnam Pro,sans-serif" font-size="6.5" letter-spacing="1.6" fill="#E6AA74">ĐỒNG KÉO</text></svg>'}
DKU.pack=pack;
/* ---- giỏ hàng ---- */
function cart(){var c=store.get('cart',{}),o={};D.products.forEach(function(p){var n=+c[p.id];if(n>0)o[p.id]=Math.min(99,n)});return o}
function cartSet(c){store.set('cart',c);paintCart()}
function cartCount(){var c=cart(),n=0;for(var k in c)n+=c[k];return n}
function cartTotal(){var c=cart(),s=0;D.products.forEach(function(p){if(c[p.id])s+=c[p.id]*p.p});return s}
function addCart(id,q){if(!D.products.some(function(p){return p.id===id})||!q)return;var c=cart();c[id]=(c[id]||0)+(q||1);if(c[id]<=0)delete c[id];cartSet(c);var n=$('[data-cart-count]');if(n){n.classList.remove('bump');void n.offsetWidth;n.classList.add('bump')}}
DKU.cart={get:cart,set:cartSet,add:addCart,count:cartCount,total:cartTotal};
var drawer,dbg;
function buildDrawer(){if(drawer)return;drawer=document.createElement('aside');drawer.className='drawer';drawer.setAttribute('aria-label','Giỏ hàng');drawer.setAttribute('aria-hidden','true');
 drawer.innerHTML='<div class="drawer-h"><h2>Giỏ hàng</h2><button class="ic-btn" type="button" data-cart-close aria-label="Đóng giỏ hàng">'+icon('close')+'</button></div><div class="drawer-b" id="drawerB"></div><div class="drawer-f"><div class="summary" style="border-style:solid"><div><dt>Tạm tính</dt><dd id="drawerT" class="num">0đ</dd></div></div><a class="btn btn-block" href="'+root+'cua-hang/thanh-toan/">Thanh toán (minh hoạ) '+icon('arrow')+'</a><button class="btn btn-ghost btn-block" type="button" data-cart-close>Mua thêm</button></div>';
 dbg=document.createElement('div');dbg.className='drawer-bg';document.body.appendChild(drawer);document.body.appendChild(dbg);
 dbg.addEventListener('click',closeCart);$$('[data-cart-close]',drawer).forEach(function(b){b.addEventListener('click',closeCart)});paintCart()}
function openCart(){buildDrawer();drawer.classList.add('open');dbg.classList.add('open');drawer.setAttribute('aria-hidden','false');document.body.classList.add('lock');$('[data-cart-close]',drawer).focus()}
function closeCart(){if(!drawer||!drawer.classList.contains('open'))return;drawer.classList.remove('open');dbg.classList.remove('open');drawer.setAttribute('aria-hidden','true');document.body.classList.remove('lock')}
DKU.openCart=openCart;
function lineHTML(p,q){return '<div class="ci"><div class="pk">'+pack(p)+'</div><div><b>'+p.name+'</b><small>'+p.sub+' · '+vnd(p.p)+'</small><div class="qty"><button type="button" data-qty="-1" data-id="'+p.id+'" aria-label="Bớt 1 '+esc(p.name)+'">'+icon('minus')+'</button><span>'+q+'</span><button type="button" data-qty="1" data-id="'+p.id+'" aria-label="Thêm 1 '+esc(p.name)+'">'+icon('plus')+'</button></div></div><b class="num">'+vnd(p.p*q)+'</b></div>'}
DKU.lineHTML=lineHTML;
function paintCart(){var n=cartCount();$$('[data-cart-count]').forEach(function(el){el.textContent=n;el.classList.toggle('has',n>0)});
 var b=$('#drawerB');if(b){var c=cart(),h='';D.products.forEach(function(p){if(c[p.id])h+=lineHTML(p,c[p.id])});b.innerHTML=h||'<p class="empty">Giỏ còn trống. Ghé tủ sáp nhé.</p>';$('#drawerT').textContent=vnd(cartTotal())}
 document.dispatchEvent(new Event('dk-cart'))}
document.addEventListener('click',function(e){var q=e.target.closest('[data-qty]');if(q){addCart(q.getAttribute('data-id'),+q.getAttribute('data-qty'));return}
 var a=e.target.closest('[data-add]');if(a){addCart(a.getAttribute('data-add'),1);var p=D.products.filter(function(x){return x.id===a.getAttribute('data-add')})[0];toast('Đã thêm '+(p?p.name:'')+' vào giỏ');return}
 var o=e.target.closest('[data-cart-open]');if(o&&document.body.getAttribute('data-page')!=='tt'){e.preventDefault();openCart()}});
addEventListener('storage',paintCart);
paintCart();
/* ---- thợ yêu thích ---- */
DKU.favs=function(){return store.get('favs',[])};
function paintFav(){var f=DKU.favs();$$('[data-fav]').forEach(function(b){var on=f.indexOf(b.getAttribute('data-fav'))>-1;b.setAttribute('aria-pressed',String(on));b.classList.toggle('on',on)});document.dispatchEvent(new Event('dk-fav'))}
document.addEventListener('click',function(e){var b=e.target.closest('[data-fav]');if(!b)return;var id=b.getAttribute('data-fav'),f=DKU.favs(),i=f.indexOf(id);if(i>-1)f.splice(i,1);else f.push(id);store.set('favs',f);paintFav();var br=D.barbers.filter(function(x){return x.id===id})[0];toast(i>-1?'Đã bỏ '+br.name+' khỏi thợ yêu thích':'Đã lưu '+br.name+' vào thợ yêu thích')});
DKU.paintFav=paintFav;paintFav();

/* ---- tìm trong trang ---- */
var srch;
function idx(){var L=[],r=root;
 [['Trang','Dịch vụ &amp; bảng giá','dich-vu/','bảng giá cắt cạo nhuộm uốn combo'],['Trang','Thư viện kiểu tóc','kieu-toc/','kiểu tóc nam fade crop'],['Trang','Chọn kiểu theo dáng mặt','chon-kieu/','quiz dáng mặt tròn vuông dài'],['Trang','Đội thợ','tho/','thợ barber lịch làm'],['Trang','Chi nhánh &amp; giờ mở cửa','chi-nhanh/','bản đồ địa chỉ giờ mở cửa'],['Trang','Học viện Barber','hoc-vien/','khoá học nghề đăng ký khai giảng'],['Trang','Cửa hàng sáp, pomade','cua-hang/','sáp pomade mua'],['Trang','Đặt lịch','dat-lich/','đặt lịch hẹn giờ'],['Trang','Tạp chí &amp; hỏi đáp','tap-chi/','bài viết hỏi đáp liên hệ']].forEach(function(x){L.push({t:x[0],n:x[1],h:r+x[2],k:x[3],s:''})});
 D.services.forEach(function(s){L.push({t:'Dịch vụ',n:s.name,h:r+'dich-vu/#sv-'+s.id,k:s.d,s:'từ '+vnd(Math.min(s.p.bt,s.p.pn,s.p.ak))})});
 D.styles.forEach(function(s){L.push({t:'Kiểu tóc',n:s.name,h:r+'kieu-toc/chi-tiet/?k='+s.id,k:s.d,s:D.lens[s.len]})});
 D.barbers.forEach(function(b){L.push({t:'Thợ',n:b.name,h:r+'tho/#tho-'+b.id,k:b.sp+' '+b.role,s:D.branches[b.br].name})});
 D.products.forEach(function(p){L.push({t:'Sản phẩm',n:p.name,h:r+'cua-hang/#sp-'+p.id,k:p.sub+' '+p.d,s:vnd(p.p)})});
 D.courses.forEach(function(c){L.push({t:'Khoá học',n:c.name,h:r+'hoc-vien/#kh-'+c.id,k:c.d,s:vndFull(c.p)})});
 for(var b in D.branches)L.push({t:'Chi nhánh',n:D.branches[b].name,h:r+'chi-nhanh/?cn='+b,k:D.branches[b].addr,s:''});
 return L}
function norm(s){return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/đ/g,'d').replace(/&amp;/g,'&')}
function buildSearch(){if(srch)return;srch=document.createElement('div');srch.className='srch';srch.setAttribute('role','dialog');srch.setAttribute('aria-modal','true');srch.setAttribute('aria-label','Tìm trong trang');
 srch.innerHTML='<button class="ic-btn srch-close" type="button" aria-label="Đóng tìm kiếm">'+icon('close')+'</button><div class="srch-in"><label class="sr" for="srchQ">Tìm dịch vụ, kiểu tóc, thợ, sản phẩm</label><div class="srch-box">'+icon('search')+'<input id="srchQ" type="search" autocomplete="off" placeholder="Fade, sáp, Phú Nhuận…"></div><p class="srch-hint" id="srchHint">Gợi ý: “fade”, “râu”, “khoá học”, “An Khánh”.</p><ul class="srch-res" id="srchRes"></ul></div>';
 document.body.appendChild(srch);var L=idx(),q=$('#srchQ'),res=$('#srchRes');
 $('.srch-close',srch).addEventListener('click',closeSearch);
 function run(){var v=norm(q.value.trim());if(!v){res.innerHTML='';$('#srchHint').textContent='Gợi ý: “fade”, “râu”, “khoá học”, “An Khánh”.';return}
  var ws=v.split(/\s+/),hits=L.filter(function(x){var hay=norm(x.n+' '+x.k+' '+x.t+' '+x.s);return ws.every(function(w){return hay.indexOf(w)>-1})}).slice(0,12);
  $('#srchHint').textContent=hits.length?hits.length+' kết quả':'Không thấy kết quả. Thử từ khác hoặc gọi 0900 000 000.';
  res.innerHTML=hits.map(function(x){return '<li><a href="'+x.h+'"><small>'+x.t+'</small><span><b>'+x.n+'</b></span><em>'+x.s+'</em></a></li>'}).join('')}
 q.addEventListener('input',run);res.addEventListener('click',function(e){if(e.target.closest('a'))closeSearch()})}
function openSearch(){buildSearch();srch.classList.add('open');document.body.classList.add('lock');setTimeout(function(){$('#srchQ').focus()},30)}
function closeSearch(){if(!srch||!srch.classList.contains('open'))return;srch.classList.remove('open');if(!(mnav&&mnav.classList.contains('open')))document.body.classList.remove('lock')}
$$('[data-search]').forEach(function(b){b.addEventListener('click',openSearch)});
addEventListener('keydown',function(e){if(e.key==='/'&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)){e.preventDefault();openSearch()}});
/* ---- kiểm tra form chung ---- */
DKU.validate=function(box){var ok=true,first=null;$$('[data-req]',box).forEach(function(inp){var f=inp.closest('.field')||inp.closest('.consent'),v=inp.type==='checkbox'?inp.checked:inp.value.trim(),t=inp.getAttribute('data-req'),bad=!v;
  if(!bad&&t==='phone')bad=!/^0\d{9}$/.test(v.replace(/[\s.]/g,''));if(!bad&&t==='email')bad=!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);if(!bad&&t==='name')bad=v.length<2;
  if(f)f.classList.toggle('err',bad);inp.setAttribute('aria-invalid',String(bad));if(bad){ok=false;first=first||inp}});if(first)first.focus();return ok};
document.addEventListener('input',function(e){var f=e.target.closest('.field.err,.consent.err');if(f){f.classList.remove('err');e.target.removeAttribute('aria-invalid')}});
document.addEventListener('change',function(e){var f=e.target.closest('.consent.err');if(f)f.classList.remove('err')});
/* ---- form liên hệ đơn giản ---- */
$$('form[data-simple]').forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();if(!DKU.validate(f))return;var c=code(f.getAttribute('data-simple'));f.innerHTML='<div class="done-box"><div class="check-ring"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg></div><h3>Đã nhận, cảm ơn bạn</h3><p class="muted">Mã minh hoạ của bạn</p><div class="code">'+c+'</div><p class="muted">Đây là mẫu giao diện: thông tin không được gửi đi đâu.</p></div>'})});
var P={};

/* ---- dáng mặt (SVG) ---- */
var FACE={tron:'M30 10c13 0 20 11 20 24s-8 24-20 24S10 47 10 34s7-24 20-24z',vuong:'M14 12h32c3 0 5 2 5 5v26c0 7-8 15-21 15S9 50 9 43V17c0-3 2-5 5-5z',dai:'M30 4c11 0 17 10 17 24v12c0 12-8 20-17 20s-17-8-17-20V28C13 14 19 4 30 4z',oval:'M30 6c12 0 19 10 19 24 0 16-9 28-19 28S11 46 11 30C11 16 18 6 30 6z',tim:'M30 8c14 0 21 8 21 18 0 14-12 30-21 32C21 56 9 40 9 26 9 16 16 8 30 8z'};
function faceSVG(k){return '<svg viewBox="0 0 60 64" aria-hidden="true"><path d="'+FACE[k]+'" fill="none" stroke="currentColor" stroke-width="2"/><path d="M23 30h.01M37 30h.01" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="M25 42c3 2 7 2 10 0" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>'}
DKU.faceSVG=faceSVG;
function styleCard(s,i,small){return '<a class="so" style="--d:'+(i*.08)+'s" href="'+root+'kieu-toc/chi-tiet/?k='+s.id+'"><img src="'+im(s.img,small?500:700,small?660:930)+'" alt="Kiểu tóc '+esc(s.name)+'" loading="lazy" width="700" height="930"><span><small>'+D.lens[s.len]+' · '+(s.min?s.min+' phút vuốt':'Không cần vuốt')+'</small><b>'+s.name+'</b></span></a>'}
DKU.styleCard=styleCard;
DKU.forFace=function(f){return D.styles.filter(function(s){return s.faces.indexOf(f)>-1})};
function barberCard(b){return '<article class="bc" id="hb-'+b.id+'"><div class="ph ph-hover"><img src="'+im(b.img,640,800)+'" alt="Thợ '+esc(b.name)+' đang làm việc" loading="lazy" width="640" height="800"></div><button class="fav" type="button" data-fav="'+b.id+'" aria-pressed="false" aria-label="Lưu '+esc(b.name)+' vào thợ yêu thích">'+icon('heart')+'</button><div><span class="tag">'+b.role+' · '+D.branches[b.br].name+'</span></div><h3><a href="'+root+'tho/#tho-'+b.id+'" style="text-decoration:none">'+b.name+'</a></h3><p>'+b.sp+' · '+b.yrs+' năm nghề (mẫu)</p></article>'}
DKU.barberCard=barberCard;
function rail(el){$$('[data-rail]').forEach(function(b){b.addEventListener('click',function(){var c=el.firstElementChild;el.scrollBy({left:(+b.getAttribute('data-rail'))*(c?c.offsetWidth+18:300),behavior:RM?'auto':'smooth'})})})}
DKU.rail=rail;
/* gợi ý giờ trống gần nhất (giả lập theo giờ thực) */
DKU.nextSlot=function(br){var n=vnNow(),h=n.getHours()+n.getMinutes()/60,r=hoursOf(br,n.getDay());var s=Math.max(r[0],Math.ceil((h+.5)*2)/2);if(s>r[1]-1){return 'mai '+hm(hoursOf(br,(n.getDay()+1)%7)[0])}return hm(s)};
P.home=function(){
 var d=vnNow(),dd=$('#heroDate');if(dd)dd.textContent=pad(d.getDate())+'/'+pad(d.getMonth()+1)+'/'+d.getFullYear();
 var hs=$('#heroSlot');if(hs)hs.textContent=DKU.nextSlot('pn')+' tại Phú\u00a0Nhuận';
 var picks=$('#facePicks'),out=$('#faceOut');
 if(picks){var cur='oval';picks.innerHTML=Object.keys(D.faces).map(function(k){return '<button class="fp" type="button" data-face="'+k+'" aria-pressed="'+(k===cur)+'">'+faceSVG(k)+D.faces[k]+'</button>'}).join('');
  function show(f){$$('.fp',picks).forEach(function(b){b.setAttribute('aria-pressed',String(b.getAttribute('data-face')===f))});out.innerHTML=DKU.forFace(f).slice(0,3).map(function(s,i){return styleCard(s,i)}).join('')}
  picks.addEventListener('click',function(e){var b=e.target.closest('.fp');if(b)show(b.getAttribute('data-face'))});show(cur)}
 var hb=$('#homeBarbers');if(hb){hb.innerHTML=D.barbers.map(barberCard).join('');DKU.paintFav();rail(hb)}
};

/* ===== Dịch vụ ===== */
P.dv=function(){
 var q=new URLSearchParams(location.search),br=D.branches[q.get('cn')]?q.get('cn'):store.get('branch','bt'),cat='all',picked={};
 var board=$('#menuBoard'),chips=$('#catChips'),tabs=$('#brTabs');
 chips.innerHTML='<button class="chip" type="button" aria-pressed="true" data-cat="all">Tất cả</button>'+Object.keys(D.cats).map(function(k){return '<button class="chip" type="button" aria-pressed="false" data-cat="'+k+'">'+D.cats[k]+'</button>'}).join('');
 function draw(anim){var h='';Object.keys(D.cats).forEach(function(c,ci){if(cat!=='all'&&cat!==c)return;var ss=D.services.filter(function(s){return s.cat===c});
   h+='<div class="mg rv in"><h3>'+D.cats[c]+'<small>0'+(ci+1)+'</small></h3>'+ss.map(function(s){return '<div class="mi" id="sv-'+s.id+'"><span class="mi-n">'+s.name+'</span><b class="mi-p">'+vnd(s.p[br])+'</b><p class="mi-d">'+s.d+'</p><p class="mi-m"><span>'+s.min+'&nbsp;phút</span><a href="'+root+'dat-lich/?cn='+br+'&amp;dv='+s.id+'">Đặt dịch vụ này →&#xFE0E;</a></p></div>'}).join('')+'</div>'});
  board.innerHTML=h}
 function selBr(b){br=b;store.set('branch',b);$$('[role=tab]',tabs).forEach(function(t){var on=t.getAttribute('data-br')===b;t.setAttribute('aria-selected',String(on));t.tabIndex=on?0:-1});
  var ps=$$('.mi-p',board);ps.forEach(function(p){p.classList.add('swap')});setTimeout(function(){draw();sum()},ps.length?180:0);$('#bdBr').textContent=D.branches[b].name}
 tabs.addEventListener('click',function(e){var t=e.target.closest('[role=tab]');if(t)selBr(t.getAttribute('data-br'))});
 tabs.addEventListener('keydown',function(e){if(e.key!=='ArrowRight'&&e.key!=='ArrowLeft')return;var ts=$$('[role=tab]',tabs),i=ts.indexOf(document.activeElement),j=(i+(e.key==='ArrowRight'?1:-1)+ts.length)%ts.length;ts[j].focus();selBr(ts[j].getAttribute('data-br'))});
 chips.addEventListener('click',function(e){var c=e.target.closest('[data-cat]');if(!c)return;cat=c.getAttribute('data-cat');$$('[data-cat]',chips).forEach(function(x){x.setAttribute('aria-pressed',String(x===c))});draw()});
 /* ghép gói */
 var list=$('#bdList');list.innerHTML=D.services.filter(function(s){return s.cat!=='combo'}).map(function(s){return '<label class="opt"><input type="checkbox" value="'+s.id+'"><span class="box"><b>'+s.name+'</b><span class="num" data-bp="'+s.id+'"></span></span></label>'}).join('');
 list.addEventListener('change',function(e){picked[e.target.value]=e.target.checked;sum()});
 function sum(){var t=0,m=0,n=0,ids=[];D.services.forEach(function(s){$$('[data-bp="'+s.id+'"]',list).forEach(function(el){el.textContent=vnd(s.p[br])});if(picked[s.id]){t+=s.p[br];m+=s.min;n++;ids.push(s.id)}});
  var disc=n>=3?Math.round(t*.1):0;anim($('#bdTotal'),(t-disc)*1000);$('#bdMin').textContent=m;$('#bdN').textContent=n;
  $('#bdSave').textContent=disc?'Đã giảm '+vnd(disc)+' (từ 3 dịch vụ)':(n?'Thêm '+(3-n)+' dịch vụ để giảm 10%':'');
  $('#bdBar').style.width=Math.min(100,m/180*100)+'%';$('#bdHint').textContent=n?('Khoảng '+m+' phút trên ghế'+(m>150?', nên chọn khung sáng.':'.')):'Chọn ít nhất 1 dịch vụ.';
  $('#bdGo').href=root+'dat-lich/?cn='+br+(ids.length?'&dv='+ids.join(','):'')}
 function anim(el,to){var from=+(el.getAttribute('data-v')||0),t0=performance.now();el.setAttribute('data-v',to);if(RM){el.textContent=vndFull(to);return}
  (function step(t){var k=Math.min(1,(t-t0)/450),e=1-Math.pow(1-k,3);el.textContent=vndFull(from+(to-from)*e);if(k<1)requestAnimationFrame(step)})(t0)}
 picked.sig=true;var c0=$('input[value=sig]',list);if(c0)c0.checked=true;
 selBr(br);
 if(location.hash){setTimeout(function(){var el=document.getElementById(location.hash.slice(1));if(el){el.scrollIntoView();el.classList.add('flash');setTimeout(function(){el.classList.remove('flash')},1600)}},250)}
};

/* ===== Kiểu tóc: thư viện ===== */
P.kt=function(){
 var st={face:'all',len:'all',q:'',sort:'az'},grid=$('#libGrid');
 var q=new URLSearchParams(location.search);if(D.faces[q.get('mat')])st.face=q.get('mat');
 function chipset(el,map,key){el.innerHTML='<button class="chip" type="button" data-v="all">Tất cả</button>'+Object.keys(map).map(function(k){return '<button class="chip" type="button" data-v="'+k+'">'+map[k]+'</button>'}).join('');
  el.addEventListener('click',function(e){var b=e.target.closest('[data-v]');if(!b)return;st[key]=b.getAttribute('data-v');draw()})}
 chipset($('#fFace'),D.faces,'face');chipset($('#fLen'),D.lens,'len');
 $('#fQ').addEventListener('input',function(e){st.q=e.target.value;draw()});
 $('#fSort').addEventListener('change',function(e){st.sort=e.target.value;draw()});
 function reset(){st.face='all';st.len='all';st.q='';$('#fQ').value='';draw()}
 $('#libReset').addEventListener('click',reset);$('#libReset2').addEventListener('click',reset);
 function norm(s){return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/đ/g,'d')}
 function draw(){
  $$('#fFace [data-v]').forEach(function(b){b.setAttribute('aria-pressed',String(b.getAttribute('data-v')===st.face))});
  $$('#fLen [data-v]').forEach(function(b){b.setAttribute('aria-pressed',String(b.getAttribute('data-v')===st.len))});
  var L=D.styles.filter(function(s){return (st.face==='all'||s.faces.indexOf(st.face)>-1)&&(st.len==='all'||s.len===st.len)&&(!st.q||norm(s.name+' '+s.d).indexOf(norm(st.q))>-1)});
  L.sort(function(a,b){return st.sort==='easy'?a.lv-b.lv:st.sort==='fast'?a.min-b.min:a.name.localeCompare(b.name,'vi')});
  grid.innerHTML=L.map(function(s,i){return DKU.styleCard(s,i%8,true)}).join('');
  $('#libN').textContent=L.length;$('#libEmpty').hidden=!!L.length;$('#libReset').hidden=st.face==='all'&&st.len==='all'&&!st.q}
 draw();
};
/* ===== Kiểu tóc: chi tiết ===== */
var CUT={ngan:[['Chia vùng','Tách phần đỉnh và hai bên theo xoáy tóc, đánh dấu điểm cao của fade.'],['Fade hai bên','Tông đơ từ cữ 0.5 lên 2, chuyển màu trong khoảng 3 cm.'],['Cắt đỉnh bằng kéo','Point cut tạo sợi so le, giữ 4–6 cm để còn độ rối.'],['Tạo kiểu và chỉ bạn','Sấy hướng ra trước, chà sáp ở đầu ngón tay, bóp nhẹ từng cụm.']],
 vua:[['Đọc xoáy và đường ngôi','Chọn bên rẽ ngôi theo xoáy tự nhiên để tóc không bật ngược.'],['Taper hai bên','Giữ độ dày vừa ở mai, gáy chuyển mượt bằng tông đơ và kéo trên lược.'],['Tỉa đỉnh theo lớp','Cắt dài dần về phía trước để mái có độ dựng.'],['Sấy và tạo kiểu','Sấy lược tròn tạo phồng, chốt bằng sáp hoặc pomade.']],
 dai:[['Giữ độ dài','Chỉ tỉa ngọn, giữ khung tóc để mái che trán mềm.'],['Tỉa mỏng','Kéo tỉa giảm độ dày ở hai bên, tóc rơi tự nhiên.'],['Tạo đường viền','Viền gáy và quanh tai gọn, không cạo sát.'],['Sấy tạo nếp','Xịt muối biển, sấy hướng ra sau và sang hai bên.']]};
var STB={'textured-crop':['bao','khoa','huy'],'hard-part':['khoa','phuc','sang'],quiff:['phuc','tai','khoa'],buzz:['bao','khoa','sang'],pompadour:['phuc','khoa','tai'],'two-block':['tai','huy','bao'],'slick-back':['phuc','sang','khoa'],'mid-fade':['khoa','bao','sang'],'french-crop':['bao','huy','tai'],curtain:['tai','huy','phuc'],perm:['tai','huy','phuc'],ivy:['phuc','bao','khoa']};
function prodsFor(s){var ids=s.lv>=3||s.id==='slick-back'?['pomade','comb']:(s.len==='dai'||s.id==='perm')?['salt','paste']:['clay','powder'];return D.products.filter(function(p){return ids.indexOf(p.id)>-1})}
P.ktd=function(){
 var q=new URLSearchParams(location.search),i=0;D.styles.forEach(function(s,k){if(s.id===q.get('k'))i=k});var s=D.styles[i],n=D.styles.length;
 document.title=s.name+': cách cắt, cách vuốt | Đồng Kéo';
 $('#h1').textContent=s.name;$('#sdCrumb').textContent=s.name;$('#sdDesc').textContent=s.d;
 $('#sdImg').src=im(s.img,1100,1400);$('#sdImg').alt='Kiểu tóc '+s.name;
 var lvT=['Rất dễ','Dễ','Vừa','Cần luyện'][s.lv];$('#sdLen').textContent='Tóc '+D.lens[s.len].toLowerCase()+' · '+lvT+' vuốt';
 $('#sdFaces').innerHTML=s.faces.map(function(f){return '<span>'+DKU.faceSVG(f)+D.faces[f]+'</span>'}).join('');
 var re={ngan:'3–4 tuần',vua:'4–5 tuần',dai:'6–8 tuần'}[s.len];
 $('#sdMeter').innerHTML=[['Độ khó tự vuốt',(s.lv+1)/4,lvT],['Thời gian mỗi sáng',Math.max(.05,s.min/12),s.min?s.min+' phút':'0 phút'],['Cắt lại sau',{ngan:.4,vua:.6,dai:.9}[s.len],re]].map(function(m){return '<div><dt>'+m[0]+'</dt><dd><span class="mt"><i style="--v:'+m[1]+'"></i></span><b class="num">'+m[2]+'</b></dd></div>'}).join('');
 $('#sdBook').href=root+'dat-lich/?style='+s.id;
 $('#sdPos').textContent=pad(i+1)+' / '+n;
 $('#sdPrev').href='./?k='+D.styles[(i-1+n)%n].id;$('#sdNext').href='./?k='+D.styles[(i+1)%n].id;
 $('#sdCut').innerHTML=CUT[s.len].map(function(c){return '<li><b>'+c[0]+'</b><span>'+c[1]+'</span></li>'}).join('');
 $('#sdProds').innerHTML=prodsFor(s).map(function(p){return '<div class="mp"><div class="pk">'+DKU.pack(p)+'</div><div><b>'+p.name+'</b><small>'+p.sub+' · '+vnd(p.p)+'</small></div><button class="btn" type="button" data-add="'+p.id+'" aria-label="Thêm '+esc(p.name)+' vào giỏ">Thêm</button></div>'}).join('');
 $('#sdBarbers').innerHTML=(STB[s.id]||['khoa','tai','sang']).map(function(id){return DKU.barberCard(D.barbers.filter(function(b){return b.id===id})[0])}).join('');
 DKU.paintFav();
 var rel=D.styles.filter(function(x){return x.id!==s.id&&x.faces.some(function(f){return s.faces.indexOf(f)>-1})}).slice(0,4);
 $('#sdRel').innerHTML=rel.map(function(x,k){return DKU.styleCard(x,k,true)}).join('');
 addEventListener('keydown',function(e){if(/INPUT|TEXTAREA/.test(document.activeElement.tagName))return;if(e.key==='ArrowRight')location.href=$('#sdNext').href;if(e.key==='ArrowLeft')location.href=$('#sdPrev').href});
};

/* ===== Chọn kiểu (quiz) ===== */
P.ck=function(){
 var f=$('#quiz'),qs=$$('.qz-q',f),i=0,A={};
 $('#qzFaces').innerHTML=Object.keys(D.faces).map(function(k){return '<label class="opt"><input type="radio" name="face" value="'+k+'"><span class="box">'+DKU.faceSVG(k)+'<b>'+D.faces[k]+'</b></span></label>'}).join('');
 function show(n){i=n;qs.forEach(function(q,k){q.classList.toggle('on',k===i)});$('#qzBar').style.width=((i+1)/qs.length*100)+'%';$('#qzStep').textContent='Câu '+(i+1)+' / '+qs.length;$('#qzNum').textContent=pad(i+1);
  $('#qzBack').style.visibility=i?'visible':'hidden';$('#qzNext').innerHTML=(i===qs.length-1?'Xem kết quả ':'Câu tiếp ')+icon('arrow');$('#qzErr').classList.remove('show')}
 f.addEventListener('change',function(e){A[e.target.name]=e.target.value;$('#qzErr').classList.remove('show');
  if(e.target.name==='face'){$('#qzPath').setAttribute('d',FACE[e.target.value])}
  if(!RM&&e.target.type==='radio')setTimeout(next,320)});
 function next(){var nm=qs[i].getAttribute('data-q');if(!A[nm]){$('#qzErr').classList.add('show');var r=$('input',qs[i]);r&&r.focus();return}if(i<qs.length-1)show(i+1);else result()}
 $('#qzNext').addEventListener('click',next);$('#qzBack').addEventListener('click',function(){if(i)show(i-1)});
 function score(s){var p=0,why=[];if(s.faces.indexOf(A.face)>-1){p+=4;why.push('cân đối cho '+D.faces[A.face].toLowerCase())}
  if(A.len==='any'||s.len===A.len){p+=2;if(A.len!=='any')why.push('đúng độ dài bạn muốn')}
  var t=+A.time;if(s.min<=t){p+=2;why.push(s.min?'vuốt khoảng '+s.min+' phút':'không cần vuốt')}else p-=2;
  var H={mong:['textured-crop','quiff','french-crop','perm','mid-fade'],vua:['hard-part','ivy','pompadour','two-block','slick-back'],day:['buzz','two-block','perm','curtain','mid-fade']};
  if(H[A.hair].indexOf(s.id)>-1){p+=1.5;why.push(A.hair==='mong'?'tạo phồng cho tóc mỏng':A.hair==='day'?'dễ trị tóc dày, cứng':'hợp chất tóc vừa')}
  var L={office:['hard-part','ivy','slick-back','side-part','pompadour'],creative:['curtain','perm','two-block','quiff','textured-crop'],sport:['buzz','mid-fade','french-crop','textured-crop']};
  if(L[A.life].indexOf(s.id)>-1){p+=1.5;why.push(A.life==='office'?'lịch sự nơi công sở':A.life==='creative'?'có cá tính':'gọn khi vận động')}
  return {s:s,p:p,why:why}}
 function result(){var R=D.styles.map(score).sort(function(a,b){return b.p-a.p}).slice(0,3),max=11;
  store.set('quiz',{a:A,top:R.map(function(x){return x.s.id})});
  $('#qzSum').textContent=D.faces[A.face]+' · tóc '+{mong:'mỏng',vua:'vừa',day:'dày'}[A.hair]+' · '+(A.time==='0'?'không vuốt':'vuốt tới '+A.time+' phút')+'.';
  $('#qzList').innerHTML=R.map(function(x,k){var pc=Math.max(52,Math.min(96,Math.round(x.p/max*100)+12-k*5));return '<li class="qr" style="--d:'+(k*.12)+'s"><div class="ph"><img src="'+im(x.s.img,300,300)+'" alt="Kiểu '+esc(x.s.name)+'" width="300" height="300" loading="lazy"></div><div><h3><a href="'+root+'kieu-toc/chi-tiet/?k='+x.s.id+'">'+pad(k+1)+'. '+x.s.name+'</a><span class="pct num">Hợp '+pc+'%</span></h3><span class="mt"><i style="--v:'+(pc/100)+'"></i></span><p>'+(x.why.length?'Vì '+x.why.join(', ')+'.':x.s.d)+'</p></div></li>'}).join('');
  $('#qzBook').href=root+'dat-lich/?style='+R[0].s.id;f.hidden=true;var rs=$('#qzRes');rs.hidden=false;rs.focus({preventScroll:true});rs.scrollIntoView({behavior:RM?'auto':'smooth',block:'start'})}
 $('#qzAgain').addEventListener('click',function(){A={};f.reset();f.hidden=false;$('#qzRes').hidden=true;show(0)});
 show(0);
};

/* ===== Thợ ===== */
var DOW=['CN','T2','T3','T4','T5','T6','T7'];
function shift(b,dow){if(b.off.indexOf(dow)>-1)return null;var r=hoursOf(b.br,dow),k=(dow+b.id.length)%2;return k?[r[0],Math.min(r[1],r[0]+8)]:[Math.max(r[0],r[1]-8),r[1]]}
DKU.shift=shift;DKU.DOW=DOW;
P.th=function(){
 var br='all',onlyFav=false,list=$('#thList'),today=vnNow().getDay();
 $('#thBr').innerHTML='<button class="chip" type="button" data-b="all" aria-pressed="true">Cả 3 chi nhánh</button>'+Object.keys(D.branches).map(function(k){return '<button class="chip" type="button" data-b="'+k+'" aria-pressed="false">'+D.branches[k].name+'</button>'}).join('');
 $('#thBr').addEventListener('click',function(e){var c=e.target.closest('[data-b]');if(!c)return;br=c.getAttribute('data-b');$$('[data-b]').forEach(function(x){x.setAttribute('aria-pressed',String(x===c))});draw()});
 $('#thFav').addEventListener('change',function(e){onlyFav=e.target.checked;draw()});
 function week(b){var h='';[1,2,3,4,5,6,0].forEach(function(d){var s=shift(b,d);h+='<div class="day'+(s?'':' off')+(d===today?' today':'')+'"><b>'+DOW[d]+'</b><span class="sh">'+(s?hm(s[0])+'<br>'+hm(s[1]):'Nghỉ')+'</span>'+(s?'':'<span class="sr">nghỉ</span>')+'</div>'});return h}
 function draw(){var f=DKU.favs(),L=D.barbers.filter(function(b){return (br==='all'||b.br===br)&&(!onlyFav||f.indexOf(b.id)>-1)});
  list.innerHTML=L.map(function(b,i){var s=shift(b,today);return '<article class="th" id="tho-'+b.id+'" style="--d:'+(i*.06)+'s"><div class="th-media"><div class="ph"><img src="'+im(b.img,600,750)+'" alt="Thợ '+esc(b.name)+' đang cắt tóc cho khách" width="600" height="750" loading="lazy"></div><button class="fav" type="button" data-fav="'+b.id+'" aria-pressed="false" aria-label="Lưu '+esc(b.name)+' vào thợ yêu thích">'+icon('heart')+'</button></div>'+
   '<div><div class="th-top"><span class="tag">'+b.role+' · '+D.branches[b.br].name+'</span><span class="status '+(s?'open':'closed')+'"><i></i>'+(s?'Hôm nay làm '+hm(s[0])+'–'+hm(s[1]):'Hôm nay nghỉ')+'</span></div><h3>'+b.name+'</h3><p class="th-bio">'+b.bio+'</p>'+
   '<dl class="th-stats"><div><dt>Thế mạnh</dt><dd>'+b.sp+'</dd></div><div><dt>Kinh nghiệm</dt><dd class="num">'+b.yrs+' năm (mẫu)</dd></div><div><dt>Chứng chỉ</dt><dd>Nội bộ học viện (mẫu)</dd></div></dl>'+
   '<p class="flabel" style="margin-bottom:10px">Lịch làm tuần này</p><div class="week" aria-label="Lịch làm trong tuần của '+esc(b.name)+'">'+week(b)+'</div>'+
   '<div class="th-acts"><a class="btn" href="'+root+'dat-lich/?cn='+b.br+'&amp;tho='+b.id+'">Đặt với '+esc(b.name.split(' ').pop())+' '+icon('arrow')+'</a><a class="btn btn-ghost" href="'+root+'chi-nhanh/?cn='+b.br+'">Chi nhánh '+D.branches[b.br].name+'</a></div></div></article>'}).join('');
  $('#thEmpty').hidden=!!L.length;DKU.paintFav()}
 function favBox(){var f=DKU.favs(),h=D.barbers.filter(function(b){return f.indexOf(b.id)>-1}).map(function(b){return '<a href="#tho-'+b.id+'"><img src="'+im(b.img,80,80)+'" alt="" width="36" height="36">'+b.name+'</a>'}).join('');$('#favList').innerHTML=h||'Chưa lưu thợ nào. Bấm trái tim trên hồ sơ bên dưới.'}
 document.addEventListener('dk-fav',favBox);list.addEventListener('click',function(e){if(onlyFav&&e.target.closest('[data-fav]'))setTimeout(draw,0)});draw();favBox();
 if(location.hash){var el=document.getElementById(location.hash.slice(1));if(el)setTimeout(function(){el.scrollIntoView()},100)}
};

/* ===== Chi nhánh ===== */
P.cn=function(){
 var q=new URLSearchParams(location.search),cur=D.branches[q.get('cn')]?q.get('cn'):store.get('branch','bt'),day=vnNow().getDay();
 function sel(b,focusTab){cur=b;store.set('branch',b);var x=D.branches[b];
  $$('#cnTabs [role=tab]').forEach(function(t){var on=t.getAttribute('data-br')===b;t.setAttribute('aria-selected',String(on));t.tabIndex=on?0:-1;if(on&&focusTab)t.focus()});
  $$('.pin').forEach(function(p){p.classList.toggle('on',p.getAttribute('data-pin')===b)});
  $('#cnName').textContent=x.name;$('#cnAddr').textContent=x.addr;$('#cnNote').textContent=x.note+' '+x.chairs+' ghế.';
  var img=$('#cnImg');img.src=im(x.img,900,560);img.alt='Không gian chi nhánh '+x.name;
  $('#cnStatus').setAttribute('data-open',b);DKU.paintStatus();$('#cnBook').href=root+'dat-lich/?cn='+b;
  var t=vnNow().getDay();$('#cnHrs').innerHTML=[1,2,3,4,5,6,0].map(function(d){var r=hoursOf(b,d);return '<tr'+(d===t?' class="now"':'')+'><th scope="row">'+(d?'Thứ '+(d+1):'Chủ nhật')+'</th><td>'+hm(r[0])+'–'+hm(r[1])+'</td></tr>'}).join('');
  busy()}
 $('#cnTabs').addEventListener('click',function(e){var t=e.target.closest('[role=tab]');if(t)sel(t.getAttribute('data-br'))});
 $('#cnTabs').addEventListener('keydown',function(e){if(e.key!=='ArrowRight'&&e.key!=='ArrowLeft')return;var k=Object.keys(D.branches),i=k.indexOf(cur);sel(k[(i+(e.key==='ArrowRight'?1:-1)+3)%3],true)});
 $$('.pin').forEach(function(p){p.addEventListener('click',function(){sel(p.getAttribute('data-pin'))});p.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();sel(p.getAttribute('data-pin'))}})});
 var DN=['CN','T2','T3','T4','T5','T6','T7'];
 $('#bzDays').innerHTML=[1,2,3,4,5,6,0].map(function(d){return '<button class="chip" type="button" data-d="'+d+'" aria-pressed="'+(d===day)+'">'+DN[d]+'</button>'}).join('');
 $('#bzDays').addEventListener('click',function(e){var c=e.target.closest('[data-d]');if(!c)return;day=+c.getAttribute('data-d');$$('#bzDays [data-d]').forEach(function(x){x.setAttribute('aria-pressed',String(x===c))});busy()});
 function busy(){var r=hoursOf(cur,day),n=vnNow(),h0=Math.floor(r[0]),h1=Math.ceil(r[1]),we=day===0||day===6,html='',peak=0,ph=0;
  for(var h=h0;h<h1;h++){var v=.18+.25*Math.exp(-Math.pow(h-12,2)/3)+.55*Math.exp(-Math.pow(h-(we?16:18.5),2)/(we?8:3))+(cur==='pn'&&h>=20?.15:0);v=Math.min(1,v);if(v>peak){peak=v;ph=h}
   var now=day===n.getDay()&&h===n.getHours();html+='<div class="bz-b'+(now?' now':'')+'" style="--v:'+v.toFixed(2)+';--d:'+((h-h0)*.03)+'s"><i></i><span aria-hidden="true">'+pad(h)+'h</span><span class="sr">'+pad(h)+' giờ: '+(v>.7?'đông':v>.45?'vừa':'vắng')+'</span></div>'}
  $('#bzBars').innerHTML=html;$('#bzCap').textContent='Đông nhất khoảng '+pad(ph)+':00–'+pad(ph+1)+':00 tại '+D.branches[cur].name+'. Vắng nhất: ngay sau giờ mở cửa.'}
 sel(cur);
};

/* ===== Bộ máy form nhiều bước (dùng chung) ===== */
DKU.wizard=function(o){var f=o.form,panes=$$('.pane',f),steps=$$('li',o.steps),i=0,back=o.back,next=o.next;
 function go(n,focus){i=n;panes.forEach(function(p,k){p.classList.toggle('on',k===i)});steps.forEach(function(s,k){s.classList.toggle('done',k<i);s.classList.toggle('cur',k===i);if(k===i)s.setAttribute('aria-current','step');else s.removeAttribute('aria-current')});
  back.style.visibility=i?'visible':'hidden';next.innerHTML=(i===panes.length-1?(o.finalLabel||'Gửi đăng ký')+' ':'Tiếp tục ')+icon(i===panes.length-1?'check':'arrow');
  if(o.onStep)o.onStep(i);if(focus){var t=f.getBoundingClientRect().top;if(t<80||t>innerHeight*.6)scrollTo({top:pageYOffset+t-110,behavior:RM?'auto':'smooth'});var h=$('.flabel,legend,input,select',panes[i]);}}
 function err(k,show){var e=$('[data-err="'+k+'"]',f);if(e)e.classList.toggle('show',show)}
 next.addEventListener('click',function(){var ok=o.check(i,panes[i]);err(i,!ok);if(!ok)return;if(i<panes.length-1)go(i+1,true);else o.done()});
 back.addEventListener('click',function(){if(i)go(i-1,true)});
 f.addEventListener('change',function(){err(i,false)});f.addEventListener('submit',function(e){e.preventDefault()});
 go(0);return {go:go,cur:function(){return i}}};
function val(f,n){var x=$('[name="'+n+'"]:checked',f)||$('[name="'+n+'"]',f);return x&&(x.type!=='radio'||x.checked)?x.value:''}
DKU.val=val;
function doneHTML(title,c,lines,extra){return '<div class="done-box"><div class="check-ring"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg></div><h3>'+title+'</h3><p class="muted">Mã xác nhận (minh hoạ)</p><div class="code">'+c+'</div><p class="muted" style="max-width:52ch">'+lines+'</p>'+(extra||'')+'<p class="muted small">Đây là mẫu giao diện: thông tin không được gửi đi đâu.</p></div>'}
DKU.doneHTML=doneHTML;
/* ===== Học viện ===== */
var SYL={'co-ban':['Tuần 1–2: dụng cụ, vệ sinh, cầm kéo và lược','Tuần 3–4: tông đơ, cữ, taper cơ bản','Tuần 5–8: 12 kiểu tóc nam trên mẫu thật','Tuần 9–10: cạo, tạo kiểu, tư vấn dáng mặt','Tuần 11–12: tốc độ, giao tiếp khách, bài thi cuối'],
 fade:['Tuần 1: đọc đầu, chia vùng, chọn điểm fade','Tuần 2: skin fade, low/mid/high','Tuần 3: burst fade, taper, kết hợp kéo','Tuần 4: tốc độ 35 phút, chụp ảnh tác phẩm'],
 cao:['Tuần 1: dao thẳng, an toàn, khăn nóng','Tuần 2: tạo dáng râu theo khuôn hàm, dưỡng'],
 'tu-lam':['Chọn sáp theo chất tóc','Sấy định hướng','Vuốt 3 kiểu thường ngày']};
function seats(cid,k){var s=(cid.length*7+k*5)%8;return s}
P.hv=function(){
 var f=$('#regForm'),list=$('#crsList'),near=[];
 list.innerHTML=D.courses.map(function(c,i){return '<article class="crs rv" id="kh-'+c.id+'" style="--d:'+(i*.06)+'s"><span class="crs-no num">0'+(i+1)+'</span><div class="crs-main"><span class="tag">'+c.lv+'</span><h3>'+c.name+'</h3><p>'+c.d+'</p>'+
  '<details class="syl"><summary>Xem giáo trình</summary><ol>'+SYL[c.id].map(function(w){return '<li>'+w+'</li>'}).join('')+'</ol></details></div>'+
  '<dl class="crs-meta"><div><dt>Thời lượng</dt><dd>'+(c.wk?c.wk+' tuần':'1 buổi, 2 tiếng')+'</dd></div><div><dt>Học phí (mẫu)</dt><dd class="num">'+vndFull(c.p)+'</dd></div></dl><button class="btn btn-ghost crs-btn" type="button" data-pick="'+c.id+'">Chọn khoá này</button></article>'}).join('');
 var rows='';D.courses.forEach(function(c){D.intakes[c.id].forEach(function(d,k){var s=seats(c.id,k);near.push(d.split('/').reverse().join(''));rows+='<tr><th scope="row">'+c.name+'</th><td class="num">'+d+'</td><td>'+(c.wk?['Sáng','Tối','Cuối tuần'][k%3]:'Thứ 7, 09:00')+'</td><td><span class="seat'+(s<3?' low':'')+'">'+(s?s+' chỗ':'Hết chỗ')+'</span></td><td>'+(s?'<button class="link" type="button" data-pick="'+c.id+'" data-date="'+d+'">Giữ chỗ</button>':'')+'</td></tr>'})});
 $('#itBody').innerHTML=rows;near.sort();var n0=near[0];$('#hvNext').textContent=n0.slice(6)+'/'+n0.slice(4,6)+'/'+n0.slice(0,4);
 $('#hvMentors').innerHTML=['khoa','sang'].map(function(id){var b=D.barbers.filter(function(x){return x.id===id})[0];return '<article class="mentor rv"><div class="ph"><img src="'+im(b.img,700,520)+'" alt="Giảng viên '+esc(b.name)+'" width="700" height="520" loading="lazy"></div><div><span class="tag">'+(id==='khoa'?'Khoá Fade nâng cao':'Khoá Cạo khăn nóng')+'</span><h3>'+b.name+'</h3><p class="muted">'+b.bio+'</p></div></article>'}).join('');
 $('#regCourses').innerHTML=D.courses.map(function(c){return '<label class="opt"><input type="radio" name="course" value="'+c.id+'"><span class="box"><b>'+c.name+'</b><small>'+(c.wk?c.wk+' tuần':'1 buổi')+' · '+vndFull(c.p)+'</small></span></label>'}).join('');
 var ys=$('#rgYear');for(var y=2008;y>=1970;y--)ys.insertAdjacentHTML('beforeend','<option>'+y+'</option>');
 function dates(){var c=val(f,'course');$('#regDates').innerHTML=c?D.intakes[c].map(function(d,k){var s=seats(c,k);return '<label class="opt"><input type="radio" name="date" value="'+d+'"'+(s?'':' disabled')+'><span class="box"><b class="num">'+d+'</b><small>'+(s?'Còn '+s+' chỗ':'Hết chỗ')+'</small></span></label>'}).join(''):''}
 f.addEventListener('change',function(e){if(e.target.name==='course')dates()});
 var W=DKU.wizard({form:f,steps:$('#regSteps'),back:$('#regBack'),next:$('#regNext'),
  check:function(i,p){if(i===0)return !!val(f,'course');if(i===1)return !!val(f,'date')&&!!val(f,'ca');if(i===2)return DKU.validate(p);if(i===3)return !!val(f,'exp');return DKU.validate(p)},
  onStep:function(i){if(i===4){var c=D.courses.filter(function(x){return x.id===val(f,'course')})[0];$('#regSum').innerHTML=[['Khoá',c.name],['Học phí (mẫu)',vndFull(c.p)],['Khai giảng',val(f,'date')],['Ca',val(f,'ca')],['Họ tên',esc(val(f,'name'))],['Điện thoại',esc(val(f,'phone'))],['Email',esc(val(f,'email'))],['Kinh nghiệm',val(f,'exp')]].map(function(r){return '<div><dt>'+r[0]+'</dt><dd>'+r[1]+'</dd></div>'}).join('')}},
  done:function(){var c=code('HV');store.set('hv',{code:c,course:val(f,'course'),date:val(f,'date')});f.innerHTML=doneHTML('Đã giữ chỗ cho bạn',c,'Khoá '+D.courses.filter(function(x){return x.id===val(f,'course')})[0].name+', khai giảng '+val(f,'date')+'. Tư vấn viên sẽ gọi lại để xác nhận (minh hoạ).');f.scrollIntoView({block:'center'})}});
 document.addEventListener('click',function(e){var b=e.target.closest('[data-pick]');if(!b)return;var r=$('input[name=course][value="'+b.getAttribute('data-pick')+'"]',f);if(!r)return;r.checked=true;dates();var d=b.getAttribute('data-date');W.go(0);if(d){var x=$('input[name=date][value="'+d+'"]',f);if(x){x.checked=true;W.go(1)}}else W.go(1);$('#dang-ky').scrollIntoView({behavior:RM?'auto':'smooth'});toast('Đã chọn khoá, điền tiếp thông tin nhé')});
};

/* ===== Cửa hàng ===== */
function dots(n,label){var h='<span class="dots" aria-label="'+label+' '+n+' trên 5">';for(var i=1;i<=5;i++)h+='<i'+(i<=n?' class="on"':'')+'></i>';return h+'</span>'}
var FIT={clay:'Textured Crop, Quiff',pomade:'Slick Back, Pompadour',paste:'Two Block, Side Part',powder:'Quiff, tóc mỏng',salt:'Uốn, Rẽ ngôi giữa'};
P.ch=function(){
 var cat='all',sort='pop',g=$('#shGrid');
 var ft=D.products[0];$('#shFeat').innerHTML='<div class="sf-art">'+DKU.pack(ft)+'</div><div class="sf-txt"><span class="tag">Thợ dùng nhiều</span><h2>'+ft.name+'</h2><p>'+ft.d+'</p><div class="sf-bars"><span>Giữ nếp</span>'+dots(ft.hold,'Giữ nếp')+'<span>Độ bóng</span>'+dots(ft.shine,'Độ bóng')+'</div><div class="sf-buy"><b class="price">'+vnd(ft.p)+'</b><button class="btn" type="button" data-add="'+ft.id+'">'+icon('bag')+'Thêm vào giỏ</button></div></div>';
 $('#shCats').innerHTML='<button class="chip" type="button" data-c="all" aria-pressed="true">Tất cả</button>'+Object.keys(D.pcats).map(function(k){return '<button class="chip" type="button" data-c="'+k+'" aria-pressed="false">'+D.pcats[k]+'</button>'}).join('');
 $('#shCats').addEventListener('click',function(e){var c=e.target.closest('[data-c]');if(!c)return;cat=c.getAttribute('data-c');$$('#shCats [data-c]').forEach(function(x){x.setAttribute('aria-pressed',String(x===c))});draw()});
 $('#shSort').addEventListener('change',function(e){sort=e.target.value;draw()});
 function draw(){var c=DKU.cart.get(),L=D.products.filter(function(p){return cat==='all'||p.cat===cat}).slice();
  if(sort==='asc')L.sort(function(a,b){return a.p-b.p});if(sort==='desc')L.sort(function(a,b){return b.p-a.p});if(sort==='hold')L.sort(function(a,b){return b.hold-a.hold});
  g.innerHTML=L.map(function(p,i){var q=c[p.id]||0;return '<article class="pc" id="sp-'+p.id+'" style="--d:'+(i*.05)+'s"><div class="pc-art" style="--c:'+p.c+'">'+DKU.pack(p)+(q?'<span class="pc-in num">'+q+' trong giỏ</span>':'')+'</div><div class="pc-body"><p class="pc-sub">'+p.sub+'</p><h3>'+p.name+'</h3><p class="pc-d">'+p.d+'</p>'+(p.hold||p.shine?'<div class="pc-meta"><span>Giữ nếp</span>'+dots(p.hold,'Giữ nếp')+'<span>Bóng</span>'+dots(p.shine,'Độ bóng')+'</div>':'')+'<div class="pc-foot"><b class="price">'+vnd(p.p)+'</b><button class="btn btn-sm" type="button" data-add="'+p.id+'" aria-label="Thêm '+esc(p.name)+' vào giỏ">'+icon('plus')+'Thêm</button></div><span class="mau">Sản phẩm mẫu</span></div></article>'}).join('')}
 document.addEventListener('dk-cart',draw);draw();
 $('#cmpBody').innerHTML=D.products.filter(function(p){return p.cat==='sap'||p.id==='powder'||p.id==='salt'}).map(function(p){return '<tr><th scope="row">'+p.name+'<br><small style="font:400 13px var(--sans);color:var(--ink-2)">'+p.sub+'</small></th><td>'+dots(p.hold,'Giữ nếp')+'</td><td>'+dots(p.shine,'Độ bóng')+'</td><td>'+(FIT[p.id]||'')+'</td><td><button class="link" type="button" data-add="'+p.id+'">'+vnd(p.p)+' · Thêm</button></td></tr>'}).join('');
 if(location.hash){var el=document.getElementById(location.hash.slice(1));if(el)setTimeout(function(){el.scrollIntoView({block:'center'});el.classList.add('flash')},150)}
};
/* ===== Thanh toán (minh hoạ) ===== */
P.tt=function(){
 var f=$('#coForm'),coupon=store.get('coupon','');
 function sums(){var sub=DKU.cart.total()*1000,disc=coupon==='DONGKEO10'?Math.round(sub*.1):0,ship=val(f,'ship')==='ship'&&sub-disc<500000&&sub>0?30000:0;return {sub:sub,disc:disc,ship:ship,all:sub-disc+ship}}
 function paint(){var c=DKU.cart.get(),h='',m='';D.products.forEach(function(p){if(c[p.id]){h+=DKU.lineHTML(p,c[p.id]);m+='<div class="co-li"><span>'+p.name+' <small>× '+c[p.id]+'</small></span><b class="num">'+vnd(p.p*c[p.id])+'</b></div>'}});
  if(!$('#coLines')){$('#coMini').innerHTML='<p class="muted small">Đơn đã tạo.</p>';return}
  $('#coLines').innerHTML=h||'<div class="empty"><p>Giỏ còn trống.</p><a class="btn btn-ghost" href="../">Về cửa hàng</a></div>';$('#coMini').innerHTML=m||'<p class="muted small">Chưa có sản phẩm.</p>';
  var s=sums();$('#tSub').textContent=vndFull(s.sub);$('#tDisc').textContent=s.disc?'−'+vndFull(s.disc):'0đ';$('#tShip').textContent=s.ship?vndFull(s.ship):'Miễn phí';$('#tAll').textContent=vndFull(s.all);
  $('#tFree').textContent=val(f,'ship')==='ship'&&s.sub-s.disc<500000&&s.sub?'Mua thêm '+vndFull(500000-s.sub+s.disc)+' để được miễn phí giao.':'';
  var up=D.products.filter(function(p){return !c[p.id]}).slice(0,3);$('#coUp').innerHTML=up.length?'<p class="flabel" style="margin:24px 0 10px">Khách hay mua kèm</p><div class="mini-prods">'+up.map(function(p){return '<div class="mp"><div class="pk">'+DKU.pack(p)+'</div><div><b>'+p.name+'</b><small>'+vnd(p.p)+'</small></div><button class="btn" type="button" data-add="'+p.id+'">Thêm</button></div>'}).join('')+'</div>':''}
 document.addEventListener('dk-cart',paint);
 if(coupon)$('#coCoupon').value=coupon;
 $('#coApply').addEventListener('click',function(){var v=$('#coCoupon').value.trim().toUpperCase();if(v==='DONGKEO10'){coupon=v;store.set('coupon',v);toast('Đã áp dụng mã giảm 10% (mẫu)')}else{coupon='';store.set('coupon','');toast(v?'Mã không hợp lệ. Thử DONGKEO10':'Nhập mã giảm giá')}paint()});
 f.addEventListener('change',function(e){if(e.target.name==='ship'){var s=e.target.value==='ship';$('#coShip').hidden=!s;$('#coPick').hidden=s;var a=$('#coAddr');if(s)a.setAttribute('data-req','1');else{a.removeAttribute('data-req');a.closest('.field').classList.remove('err')}paint()}});
 DKU.wizard({form:f,steps:$('#coSteps'),back:$('#coBack'),next:$('#coNext'),finalLabel:'Đặt hàng (minh hoạ)',
  check:function(i,p){if(i===0)return DKU.cart.count()>0;if(i===1)return DKU.validate(p);if(i===2)return !!val(f,'pay');return DKU.validate(p)},
  onStep:function(i){if(i===3){var s=sums(),sh=val(f,'ship')==='ship';$('#coSum').innerHTML=[['Sản phẩm',DKU.cart.count()+' món'],['Nhận hàng',sh?'Giao tới: '+esc(val(f,'addr')):'Lấy tại '+D.branches[val(f,'br')].name],['Người nhận',esc(val(f,'name'))+' · '+esc(val(f,'phone'))],['Thanh toán',val(f,'pay')],['Tổng cộng',vndFull(s.all)]].map(function(r){return '<div><dt>'+r[0]+'</dt><dd>'+r[1]+'</dd></div>'}).join('')}},
  done:function(){var c=code('DK'),s=sums(),pay=val(f,'pay');DKU.cart.set({});store.set('coupon','');
   f.innerHTML=doneHTML('Đơn hàng mẫu đã được tạo',c,'Tổng '+vndFull(s.all)+' · '+pay+'. Không có khoản tiền nào bị trừ.',pay.indexOf('Chuyển khoản')===0?'<div class="qr-mock" aria-label="Mã QR minh hoạ">'+Array.apply(null,{length:49}).map(function(_,k){return '<i'+(((k*7+3)%5<2||[0,6,42,48].indexOf(k)>-1)?' class="on"':'')+'></i>'}).join('')+'</div><p class="small muted">Mã QR minh hoạ, không quét được.</p>':'');
   paint()}});
 paint();
};

/* ===== Đặt lịch ===== */
function seed(s){var h=0;for(var i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return Math.abs(h)}
P.dl=function(){
 var f=$('#bkForm'),q=new URLSearchParams(location.search),S=store.get('book',{}),day0=vnNow();
 if(q.get('cn')&&D.branches[q.get('cn')])S.br=q.get('cn');
 if(q.get('dv'))S.sv=q.get('dv').split(',').filter(function(id){return D.services.some(function(s){return s.id===id})});
 if(q.get('tho'))S.bb=q.get('tho');if(q.get('style'))S.style=q.get('style');
 if(!S.sv||!S.sv.length)S.sv=['sig'];
 function save(){store.set('book',{br:S.br,sv:S.sv,bb:S.bb,style:S.style})}
 $('#bkBr').innerHTML=Object.keys(D.branches).map(function(k){var x=D.branches[k],o=openState(k);return '<label class="opt"><input type="radio" name="br" value="'+k+'"'+(S.br===k?' checked':'')+'><span class="box"><b>'+x.name+'</b><small>'+x.ward+' · '+x.chairs+' ghế</small><small class="status '+(o.open?'open':'closed')+'"><i></i>'+o.txt+'</small></span></label>'}).join('');
 function svList(){var br=S.br||'bt';$('#bkSv').innerHTML=Object.keys(D.cats).map(function(c){return '<p class="bk-cat">'+D.cats[c]+'</p><div class="opt-grid">'+D.services.filter(function(s){return s.cat===c}).map(function(s){return '<label class="opt"><input type="checkbox" name="sv" value="'+s.id+'"'+(S.sv.indexOf(s.id)>-1?' checked':'')+'><span class="box"><b>'+s.name+'</b><small>'+s.min+' phút · '+vnd(s.p[br])+'</small></span></label>'}).join('')+'</div>'}).join('')}
 function bbList(){var fav=DKU.favs(),L=D.barbers.filter(function(b){return b.br===S.br}).sort(function(a,b){return (fav.indexOf(b.id)>-1?0:1)-(fav.indexOf(a.id)>-1?0:1)});
  if(S.bb&&S.bb!=='any'&&!L.some(function(b){return b.id===S.bb}))S.bb=null;
  $('#bkBb').innerHTML='<label class="opt"><input type="radio" name="bb" value="any"'+(S.bb==='any'?' checked':'')+'><span class="box bb-box"><span class="bb-av any">'+icon('scissors')+'</span><span><b>Thợ nào cũng được</b><small>Nhiều giờ trống</small></span></span></label>'+L.map(function(b){var on=fav.indexOf(b.id)>-1;return '<label class="opt"><input type="radio" name="bb" value="'+b.id+'"'+(S.bb===b.id?' checked':'')+'><span class="box bb-box"><img class="bb-av" src="'+im(b.img,120,120)+'" alt="" width="56" height="56" loading="lazy"><span><b>'+b.name+(on?' <span class="tag">Yêu thích</span>':'')+'</b><small>'+b.role+' · '+b.sp+'</small></span></span></label>'}).join('')}
 var dsel=S.day||0;
 function dateOf(k){var d=new Date(day0.getFullYear(),day0.getMonth(),day0.getDate()+k);return d}
 function dlabel(d){return pad(d.getDate())+'/'+pad(d.getMonth()+1)+'/'+d.getFullYear()}
 function dates(){var h='';for(var k=0;k<7;k++){var d=dateOf(k);h+='<label class="opt dt"><input type="radio" name="day" value="'+k+'"'+(k===dsel?' checked':'')+'><span class="box"><small>'+(k===0?'Hôm nay':k===1?'Ngày mai':DKU.DOW[d.getDay()])+'</small><b class="num">'+pad(d.getDate())+'/'+pad(d.getMonth()+1)+'</b></span></label>'}$('#bkDates').innerHTML=h}
 function mins(){return S.sv.reduce(function(a,id){var s=D.services.filter(function(x){return x.id===id})[0];return a+(s?s.min:0)},0)}
 function slots(){var d=dateOf(dsel),dow=d.getDay(),r=hoursOf(S.br,dow),need=mins()/60,now=vnNow(),h='',cnt=0;
  var bb=D.barbers.filter(function(b){return b.id===S.bb})[0],sh=bb?DKU.shift(bb,dow):r;
  if(!sh){$('#bkSlots').innerHTML='<p class="muted">'+bb.name+' nghỉ ngày này. Chọn ngày khác hoặc “Thợ nào cũng được”.</p>';return}
  for(var t=sh[0];t+need<=sh[1]+.001;t+=.5){var past=dsel===0&&t<=now.getHours()+now.getMinutes()/60+.25,taken=seed((S.bb||'x')+dsel+t)%(bb?3:5)===0,dis=past||taken;if(!dis)cnt++;
   h+='<label class="opt sl"><input type="radio" name="time" value="'+hm(t)+'"'+(dis?' disabled':'')+(S.time===hm(t)&&!dis?' checked':'')+'><span class="box"><b class="num">'+hm(t)+'</b>'+(taken&&!past?'<small>Đã kín</small>':'')+'</span></label>'}
  $('#bkSlots').innerHTML=cnt?h:'<p class="muted">Ngày này đã kín lịch. Chọn ngày khác nhé.</p>'+h}
 var ss=$('#bkStyle');D.styles.forEach(function(s){ss.insertAdjacentHTML('beforeend','<option value="'+s.id+'"'+(S.style===s.id?' selected':'')+'>'+s.name+'</option>')});
 function ticket(){var br=S.br,b=D.barbers.filter(function(x){return x.id===S.bb})[0],sv=S.sv.map(function(id){return D.services.filter(function(x){return x.id===id})[0]}).filter(Boolean);
  $('#tkBr').textContent=br?D.branches[br].name:'Chưa chọn';$('#tkSv').textContent=sv.length?sv.map(function(s){return s.name.replace('&amp;','&')}).join(', '):'Chưa chọn';
  $('#tkBb').textContent=S.bb==='any'?'Thợ nào cũng được':b?b.name:'Chưa chọn';$('#tkTime').textContent=S.time?S.time+' · '+dlabel(dateOf(dsel)):'Chưa chọn';
  $('#tkMin').textContent=mins()+' phút';$('#tkTotal').textContent=br?vnd(sv.reduce(function(a,s){return a+s.p[br]},0)):'—';$('#tkNo').textContent='N° '+pad(dsel+1)+(S.time?S.time.replace(':',''):'----')}
 f.addEventListener('change',function(e){var n=e.target.name;
  if(n==='br'){S.br=e.target.value;svList();bbList();S.time=null}
  if(n==='sv'){S.sv=$$('input[name=sv]:checked',f).map(function(x){return x.value});S.time=null;slots()}
  if(n==='bb'){S.bb=e.target.value;S.time=null;slots()}
  if(n==='day'){dsel=+e.target.value;S.time=null;slots()}
  if(n==='time')S.time=e.target.value;if(n==='style')S.style=e.target.value;save();ticket()});
 svList();bbList();dates();
 var start=0;if(S.br)start=1;if(S.br&&q.get('dv'))start=2;if(S.br&&q.get('tho'))start=3;
 var W=DKU.wizard({form:f,steps:$('#bkSteps'),back:$('#bkBack'),next:$('#bkNext'),finalLabel:'Xác nhận đặt lịch',
  check:function(i,p){if(i===0)return !!S.br;if(i===1)return S.sv.length>0;if(i===2)return !!S.bb;if(i===3)return !!S.time;return DKU.validate(p)},
  onStep:function(i){if(i===2)bbList();if(i===3)slots();if(i===5){var b=D.barbers.filter(function(x){return x.id===S.bb})[0],st=D.styles.filter(function(x){return x.id===S.style})[0];
   $('#bkSum').innerHTML=[['Chi nhánh',D.branches[S.br].name],['Địa chỉ',D.branches[S.br].addr],['Dịch vụ',$('#tkSv').textContent],['Thợ',b?b.name:'Thợ nào cũng được'],['Thời gian',S.time+', '+dlabel(dateOf(dsel))],['Kiểu tóc',st?st.name:'Thợ tư vấn tại ghế'],['Khách',esc(val(f,'name'))+' · '+esc(val(f,'phone'))],['Tạm tính',$('#tkTotal').textContent]].map(function(r){return '<div><dt>'+r[0]+'</dt><dd>'+r[1]+'</dd></div>'}).join('')}},
  done:function(){var c=code('DK'),b=D.barbers.filter(function(x){return x.id===S.bb})[0],rec={code:c,br:S.br,time:S.time,date:dlabel(dateOf(dsel)),bb:b?b.name:'Thợ nào cũng được',sv:$('#tkSv').textContent};store.set('last',rec);
   f.innerHTML=doneHTML('Đã giữ ghế cho bạn',c,rec.sv+' · '+rec.bb+' · '+rec.time+', '+rec.date+' tại '+D.branches[S.br].name+'. Đến trước 5 phút, đọc mã này cho lễ tân.','<div class="hero-acts" style="justify-content:center"><a class="btn btn-ghost" href="'+root+'chi-nhanh/?cn='+S.br+'">Xem đường đến chi nhánh</a></div>');last()}});
 if(start)W.go(start);
 if(S.time&&start===3)slots();
 function last(){var L=store.get('last',null),el=$('#bkLast');if(!L){el.hidden=true;return}el.hidden=false;el.innerHTML='<div><span class="idx">Lịch hẹn gần nhất của bạn</span><p><b class="num">'+L.code+'</b> · '+L.time+', '+L.date+' · '+D.branches[L.br].name+' · '+L.bb+'</p></div><button class="btn btn-ghost btn-sm" type="button" id="bkCancel">Huỷ lịch này</button>';
  $('#bkCancel').addEventListener('click',function(){store.set('last',null);last();toast('Đã huỷ lịch hẹn mẫu '+L.code)})}
 last();ticket();
};

/* ===== Tạp chí ===== */
P.tc=function(){
 var bar=$('#readBar'),art=$('.prose'),links=$$('#toc a'),heads=links.map(function(a){return document.getElementById(a.getAttribute('href').slice(1))}),tick=false;
 function upd(){tick=false;var r=art.getBoundingClientRect(),p=Math.min(1,Math.max(0,(innerHeight*.4-r.top)/r.height));bar.style.transform='scaleX('+p+')';
  var cur=0;heads.forEach(function(h,i){if(h&&h.getBoundingClientRect().top<140)cur=i});links.forEach(function(a,i){a.classList.toggle('on',i===cur);if(i===cur)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current')})}
 addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(upd)}},{passive:true});upd();
 var cp=$('[data-copy]');if(cp)cp.addEventListener('click',function(){try{navigator.clipboard.writeText(location.href.split('#')[0]).then(function(){toast('Đã sao chép đường dẫn bài viết')},function(){toast('Không sao chép được, hãy sao chép thanh địa chỉ')})}catch(e){toast('Không sao chép được, hãy sao chép thanh địa chỉ')}});
 var fq=$('#faqQ'),items=$$('#faqList details');
 function norm(s){return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/đ/g,'d')}
 fq.addEventListener('input',function(){var v=norm(fq.value.trim()),n=0;items.forEach(function(d){var ok=!v||norm(d.textContent).indexOf(v)>-1;d.hidden=!ok;if(ok)n++;if(v&&ok)d.open=true});$('#faqEmpty').hidden=!!n});
};

/* ---- chạy module trang ---- */
var pg=document.body.getAttribute('data-page');if(P[pg])P[pg]();
DKU.reveal(document);
})();
