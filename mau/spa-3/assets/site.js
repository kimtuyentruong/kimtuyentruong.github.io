/* Ngà Skin Atelier — JS dùng chung (mẫu giao diện). Dữ liệu minh hoạ, không gửi đi đâu. */
(function(){
'use strict';
var KEY='kt_spa3_';
function get(k,d){try{var v=localStorage.getItem(KEY+k);return v?JSON.parse(v):d}catch(e){return d}}
function set(k,v){try{localStorage.setItem(KEY+k,JSON.stringify(v))}catch(e){}}
function $(s,c){return (c||document).querySelector(s)}
function $$(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function vnd(n){return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g,'.')+'đ'}
function nb(s){return String(s).replace(/ /g,' ')}
function fold(s){return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/đ/g,'d')}
function img(id,w){return 'https://images.unsplash.com/photo-'+id+'?auto=format&fit=crop&w='+(w||900)+'&q=80'}
var ROOT=(document.body&&document.body.getAttribute('data-root'))||'./';
var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- dữ liệu mẫu ---------- */
var NEEDS={am:'Cấp ẩm & phục hồi',mun:'Mụn & lỗ chân lông',sang:'Sáng da & đều màu',san:'Săn chắc & nâng cơ',nhay:'Da nhạy cảm',thugian:'Thư giãn cơ thể'};
var T=[
{id:'phuc-hoi-hang-rao-da',n:'Phục Hồi Hàng Rào Da',d:75,p:890000,need:['am','nhay'],tech:'LED đỏ · mặt nạ lạnh',img:'1570172619644-dfd03ed5d881',s:'Làm dịu, bù ẩm và nâng đỡ lớp màng bảo vệ cho da khô căng, dễ đỏ sau nắng hay sau thời gian dùng treatment.',hot:1,detail:1},
{id:'lam-sach-sau-hydro',n:'Làm Sạch Sâu Hydro',d:60,p:690000,need:['mun'],tech:'Hydro-dermabrasion',img:'1552693673-1bf958298935',s:'Dòng nước và đầu hút nhẹ làm sạch bã nhờn, tế bào chết trong lỗ chân lông, không nặn mạnh tay.'},
{id:'thong-thoang-lo-chan-long',n:'Thông Thoáng Lỗ Chân Lông',d:90,p:1150000,need:['mun'],tech:'Hydro · LED xanh',img:'1616394584738-fc6e612e71b9',s:'Liệu trình cho da dầu, lỗ chân lông dễ bít: làm sạch sâu, lấy nhân mụn nhẹ nhàng và chiếu LED xanh.'},
{id:'sang-da-vitamin-c-oxy',n:'Sáng Da Vitamin C & Oxy',d:75,p:990000,need:['sang'],tech:'Phun oxy · điện di',img:'1515377905703-c4788e51af15',s:'Đưa tinh chất vitamin C và oxy tươi vào lớp da ngoài, giúp da trông tươi và đều màu hơn theo thời gian.'},
{id:'peel-nhe-deu-mau',n:'Peel Nhẹ Đều Màu Da',d:60,p:1290000,need:['sang','mun'],tech:'AHA/PHA nồng độ thấp',img:'1576426863848-c21f53c60b19',s:'Tẩy tế bào chết bề mặt bằng acid nhẹ. Cần chuyên viên soi da và hỏi tiền sử trước khi làm.'},
{id:'nang-co-rf',n:'Nâng Cơ RF Không Xâm Lấn',d:90,p:1890000,need:['san'],tech:'Sóng RF đa cực',img:'1612817288484-6f916006741a',s:'Sóng RF làm ấm lớp da sâu, kết hợp massage nâng cơ. Không kim, không nghỉ dưỡng sau buổi làm.'},
{id:'massage-nang-co-kobido',n:'Massage Nâng Cơ Kobido',d:60,p:790000,need:['san','thugian'],tech:'Thủ pháp tay',img:'1555820585-c5ae44394b79',s:'Kỹ thuật massage mặt nhịp nhanh, dứt khoát theo trường phái Nhật, giúp gương mặt trông thư giãn và có sức sống.'},
{id:'led-diu-da-sau-nang',n:'LED Dịu Da Sau Nắng',d:45,p:550000,need:['nhay','am'],tech:'LED đỏ · mặt nạ thạch',img:'1599305090598-fe179d501227',s:'Buổi ngắn cho da vừa đi nắng, đi biển về: làm mát, cấp nước và chiếu LED bước sóng đỏ.'},
{id:'cham-soc-vung-mat',n:'Chăm Sóc Vùng Mắt',d:45,p:590000,need:['san','am'],tech:'RF mini · mặt nạ mắt',img:'1600428877878-1a0fd85beda8',s:'Massage dẫn lưu, đắp mặt nạ mắt và RF đầu nhỏ cho vùng da mỏng quanh mắt hay bị khô, thâm do thức khuya.'},
{id:'massage-da-am',n:'Massage Đá Ấm Toàn Thân',d:90,p:950000,need:['thugian'],tech:'Đá bazan · tinh dầu',img:'1600334089648-b0d9d3028eb2',s:'Đá bazan làm ấm, lăn dọc lưng và vai, kết hợp tinh dầu sả chanh. Hợp người ngồi máy tính nhiều.'},
{id:'goi-duong-sinh',n:'Gội Dưỡng Sinh Thảo Mộc',d:60,p:450000,need:['thugian'],tech:'Bồ kết · hương nhu',img:'1596178060671-7a80dc8059ea',s:'Gội bằng nước thảo mộc nấu trong ngày, massage đầu, cổ, vai gáy và chườm khăn ấm.'},
{id:'cham-soc-da-lung',n:'Chăm Sóc Da Lưng',d:60,p:750000,need:['mun'],tech:'Làm sạch · mặt nạ đất sét',img:'1544161515-4ab6ce6db874',s:'Làm sạch, tẩy da chết và đắp mặt nạ cho vùng lưng dễ nổi mụn do mồ hôi, áo bó.'},
{id:'nga-signature',n:'Liệu Trình Ngà Signature',d:120,p:2490000,need:['am','sang','san'],tech:'Hydro · RF · LED',img:'1617897903246-719242758050',s:'Hai giờ trọn vẹn: soi da, làm sạch hydro, RF nâng cơ, LED và massage vai gáy. Dành cho dịp cần chăm mình kỹ.',hot:1},
{id:'u-am-toan-than',n:'Tẩy Da Chết & Ủ Ẩm Toàn Thân',d:75,p:850000,need:['thugian','am'],tech:'Muối hồng · bơ hạt mỡ',img:'1540555700478-4be289fbecef',s:'Tẩy da chết bằng muối hồng mịn, ủ ẩm bơ hạt mỡ và tắm hơi thảo mộc. Da mềm hơn sau buổi đầu tiên.'}
];
var S=[
{id:'mai-anh',n:'Trần Mai Anh',r:'Trưởng chuyên viên da',y:9,img:'1534751516642-a1af1ef26a56',sk:['am','nhay','sang'],days:[1,2,3,5,6],q:'Tôi thích những buổi chăm da mà khách ngủ quên giữa chừng.',cert:['Chứng chỉ Kỹ thuật viên chăm sóc da (mẫu)','Khoá Soi da và tư vấn sản phẩm (mẫu)']},
{id:'thao-vy',n:'Lê Thảo Vy',r:'Chuyên viên công nghệ RF & LED',y:6,img:'1548142813-c348350df52b',sk:['san','sang'],days:[0,2,3,4,6],q:'Máy chỉ là công cụ. Đọc đúng làn da mới là phần việc chính.',cert:['Chứng nhận vận hành thiết bị RF (mẫu)','Khoá An toàn ánh sáng LED (mẫu)']},
{id:'bao-ngoc',n:'Nguyễn Bảo Ngọc',r:'Chuyên viên da mụn & làm sạch sâu',y:7,img:'1614644147724-2d4785d69962',sk:['mun','nhay'],days:[0,1,3,4,5],q:'Lấy nhân mụn có thể nhẹ tay. Tôi luôn nói trước từng bước để khách yên tâm.',cert:['Chứng chỉ Chăm sóc da mụn (mẫu)','Khoá Vô khuẩn trong spa (mẫu)']},
{id:'hoang-yen',n:'Võ Hoàng Yến',r:'Chuyên viên massage & tư vấn',y:8,img:'1529232356377-57971f020a94',sk:['thugian','san'],days:[0,1,2,4,5,6],q:'Một buổi spa tốt bắt đầu từ lúc khách bước vào và được hỏi “hôm nay bạn mệt ở đâu”.',cert:['Chứng chỉ Massage trị liệu (mẫu)','Khoá Kobido căn bản (mẫu)']}
];
var A=[
{id:'da-nhay-cam-mua-kho',t:'Da nhạy cảm mùa khô ở Sài Gòn: 6 thói quen nên đổi trước',c:'Thói quen',m:7,d:'02/11/2026',img:'1619451334792-150fd785ee74',s:'Trời hanh, máy lạnh cả ngày, da căng và đỏ nhanh hơn. Sáu thay đổi nhỏ trong cách rửa mặt, dưỡng ẩm và chống nắng.',full:1},
{id:'led-do-led-xanh',t:'LED đỏ và LED xanh khác nhau thế nào?',c:'Công nghệ',m:5,d:'26/10/2026',img:'1555820585-c5ae44394b79',s:'Hai bước sóng ánh sáng phổ biến trong phòng chăm sóc da, mỗi loại hợp với nhu cầu nào.'},
{id:'song-rf-la-gi',t:'Sóng RF là gì, ai nên và chưa nên làm?',c:'Công nghệ',m:6,d:'18/10/2026',img:'1552693673-1bf958298935',s:'Cách RF làm ấm lớp da sâu, cảm giác khi làm và những trường hợp nên hỏi bác sĩ trước.'},
{id:'thu-tu-skincare-buoi-sang',t:'Thứ tự bôi sản phẩm buổi sáng cho người bận rộn',c:'Thói quen',m:4,d:'09/10/2026',img:'1590439471364-192aa70c0b53',s:'Ba bước là đủ cho ngày đi làm. Sắp xếp sao cho sản phẩm thấm đều và không vón.'},
{id:'kem-chong-nang-bao-nhieu',t:'Kem chống nắng: bôi bao nhiêu là đủ?',c:'Chống nắng',m:4,d:'01/10/2026',img:'1609357605129-26f69add5d6e',s:'Quy tắc hai đốt ngón tay, khi nào cần bôi lại và cách bôi không bị bết.'},
{id:'sau-peel-nhe',t:'Sau peel nhẹ: 72 giờ đầu nên làm gì?',c:'Sau liệu trình',m:5,d:'22/09/2026',img:'1599305090598-fe179d501227',s:'Da hơi căng, bong nhẹ là bình thường. Những việc nên và không nên làm trong ba ngày đầu.'}
];
var PAGES=[
{u:'',t:'Trang chủ',k:'Trang'},{u:'lieu-trinh/',t:'Liệu trình',s:'Lọc theo nhu cầu, thời lượng, giá',k:'Trang'},
{u:'soi-da/',t:'Soi da',s:'6 câu hỏi, gợi ý liệu trình',k:'Công cụ'},{u:'chuyen-vien/',t:'Chuyên viên',s:'Hồ sơ và lịch làm việc',k:'Trang'},
{u:'goi-thanh-vien/',t:'Gói & thẻ thành viên',s:'So sánh gói, tính tiền nhiều buổi',k:'Trang'},{u:'the-qua-tang/',t:'Thẻ quà tặng',s:'Chọn mệnh giá, thiệp và lời nhắn',k:'Trang'},
{u:'kien-thuc/',t:'Kiến thức',s:'Bài viết chăm sóc da',k:'Trang'},{u:'dat-lich/',t:'Đặt lịch',s:'5 bước, có mã xác nhận',k:'Trang'},
{u:'lien-he/',t:'Liên hệ & hỏi đáp',s:'Địa chỉ, chính sách, câu hỏi thường gặp',k:'Trang'}
];
var FAQ=[
['Ngà có tiêm, phẫu thuật hay laser xâm lấn không?','Không. Ngà chỉ làm các liệu trình chăm sóc da không xâm lấn: làm sạch, LED, RF, phun oxy, peel nhẹ bề mặt và massage. Nhu cầu cần can thiệp y khoa, chuyên viên sẽ khuyên bạn gặp bác sĩ da liễu.'],
['Lần đầu đến có cần soi da không?','Có. Buổi đầu luôn có 10–15 phút soi da và hỏi tiền sử, không tính thêm phí. Nếu da chưa phù hợp với liệu trình đã đặt, chuyên viên sẽ đề xuất đổi.'],
['Bao lâu thì thấy da thay đổi?','Mỗi làn da khác nhau. Phần lớn khách cảm nhận da dịu và ẩm hơn ngay sau buổi làm; những thay đổi về sắc da, độ săn cần nhiều buổi đều đặn và chăm sóc tại nhà. Ngà không hứa hẹn kết quả cụ thể.'],
['Huỷ hoặc đổi lịch thế nào?','Báo trước ít nhất 4 giờ qua điện thoại, Zalo hoặc trang đặt lịch để đổi miễn phí. Huỷ sát giờ hai lần liên tiếp, lần sau cần đặt cọc 30%.'],
['Đang mang thai có làm được không?','Một số liệu trình như massage nhẹ, cấp ẩm, gội dưỡng sinh vẫn làm được; RF, peel và một số tinh dầu thì không. Hãy báo chuyên viên khi đặt lịch.'],
['Thẻ thành viên có chuyển nhượng được không?','Thẻ Gói Mùa và Gói Năm có thể tặng lại một lần cho người thân, báo trước cho lễ tân. Số buổi còn lại giữ nguyên hạn dùng.'],
['Có chỗ gửi xe không?','Có chỗ gửi xe máy trước cửa. Ô tô vui lòng gửi ở bãi xe gần đó (khoảng 3 phút đi bộ), lễ tân sẽ chỉ đường khi bạn gọi.']
];
window.NGA={T:T,S:S,A:A,NEEDS:NEEDS,FAQ:FAQ,get:get,set:set,vnd:vnd,nb:nb,esc:esc,fold:fold,img:img,$:$,$$:$$,ROOT:ROOT,RM:RM};

/* ---------- chung ---------- */
var toastT;
function toast(m){var t=$('#toast');if(!t)return;t.textContent=m;t.classList.add('show');clearTimeout(toastT);toastT=setTimeout(function(){t.classList.remove('show')},2600)}
function favs(){return get('fav',[])}
function setFavs(a){set('fav',a);$$('[data-favcount]').forEach(function(e){e.textContent=a.length||''})}
function favBtn(id){var on=favs().indexOf(id)>-1;return '<button class="fav" type="button" data-fav="'+id+'" aria-pressed="'+on+'" aria-label="Lưu liệu trình yêu thích"><svg class="ic" aria-hidden="true"><use href="#i-heart"/></svg></button>'}
function tLink(t){return ROOT+'lieu-trinh/'+(t.detail?t.id+'/':'?lt='+t.id+'#ds')}
function byId(a,id){for(var i=0;i<a.length;i++)if(a[i].id===id)return a[i];return null}
document.addEventListener('click',function(e){
  var b=e.target.closest&&e.target.closest('[data-fav]');if(!b)return;
  e.preventDefault();var id=b.getAttribute('data-fav'),a=favs(),i=a.indexOf(id);
  if(i>-1){a.splice(i,1);toast('Đã bỏ khỏi danh sách yêu thích')}else{a.push(id);toast('Đã lưu vào danh sách yêu thích')}
  setFavs(a);$$('[data-fav="'+id+'"]').forEach(function(x){x.setAttribute('aria-pressed',a.indexOf(id)>-1)});
  document.dispatchEvent(new CustomEvent('favchange'));
});
document.addEventListener('click',function(e){
  var b=e.target.closest&&e.target.closest('[data-book]');if(!b)return;
  var bk=get('booking',{});bk.t=b.getAttribute('data-book');var sp=b.getAttribute('data-spec');if(sp)bk.s=sp;bk.step=sp?3:2;set('booking',bk);
});
function card(t,o){o=o||{};
  var needs=t.need.slice(0,2).map(function(k){return '<span class="tag">'+nb(NEEDS[k])+'</span>'}).join('');
  return '<article class="tc'+(o.cls?' '+o.cls:'')+'" data-id="'+t.id+'">'+favBtn(t.id)+'<div class="tc-img"><img src="'+img(t.img,800)+'" alt="'+esc(t.n)+'" width="800" height="600" loading="lazy"></div>'+
  '<div class="tc-b"><div class="tc-meta">'+needs+'</div><h3><a href="'+tLink(t)+'">'+nb(t.n)+'</a></h3><p>'+esc(t.s)+'</p>'+
  '<div class="tc-f"><span class="dur"><svg class="ic ic-s" aria-hidden="true"><use href="#i-clock"/></svg>'+t.d+'&nbsp;phút</span><span class="price">'+vnd(t.p)+'<small>/buổi</small></span></div>'+
  '<a class="btn btn-o btn-s book" href="'+ROOT+'dat-lich/" data-book="'+t.id+'">Đặt liệu trình này</a></div></article>'}
NGA.card=card;NGA.toast=toast;NGA.favs=favs;NGA.tLink=tLink;NGA.byId=byId;

function init(){
  var d=document,hdr=$('#hdr'),badge=$('#ktBadge'),top=$('#toTop');
  setFavs(favs());
  var bk=get('booking',{});$$('[data-bookdot]').forEach(function(e){e.hidden=!bk.t});
  var lastW=innerWidth,tick=false;
  function onS(){var y=scrollY;if(hdr)hdr.classList.toggle('sc',y>8);if(top)top.classList.toggle('show',y>innerHeight*1.2);if(badge)badge.classList.toggle('show',y>innerHeight*.85);
    var pb=$('#readBar'),ab=$('.art-body');if(pb&&ab){var r=ab.getBoundingClientRect(),h=r.height-innerHeight*.5;pb.style.transform='scaleX('+Math.min(1,Math.max(0,-r.top/(h||1)))+')'}
    tick=false}
  addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(onS)}},{passive:true});onS();
  if(top)top.addEventListener('click',function(){scrollTo({top:0,behavior:RM?'auto':'smooth'})});
  /* menu điện thoại */
  var mb=$('#menuBtn'),mn=$('#mnav'),mc=$('#mnavClose');
  function setM(o){if(!mn)return;var was=mn.classList.contains('open');mn.classList.toggle('open',o);mn.setAttribute('aria-hidden',!o);if(o||was)d.body.classList.toggle('lock',o);if(mb)mb.setAttribute('aria-expanded',o);if('inert' in mn)mn.inert=!o;if(o){setTimeout(function(){mc&&mc.focus()},60)}else if(was&&mb)mb.focus()}
  if(mn&&'inert' in mn)mn.inert=true;
  mb&&mb.addEventListener('click',function(){setM(true)});mc&&mc.addEventListener('click',function(){setM(false)});
  addEventListener('resize',function(){if(innerWidth!==lastW){lastW=innerWidth;if(innerWidth>1240)setM(false)}});
  /* tìm trong site */
  var sr=$('#srch'),si=$('#srchIn'),res=$('#srchRes'),prev;
  function openS(){if(!sr)return;prev=d.activeElement;setM(false);sr.hidden=false;d.body.classList.add('lock');si.value='';render('');setTimeout(function(){si.focus()},30)}
  function closeS(){if(!sr||sr.hidden)return;sr.hidden=true;d.body.classList.remove('lock');prev&&prev.focus&&prev.focus()}
  function hl(s,q){if(!q)return esc(s);var f=fold(s),i=f.indexOf(q);if(i<0)return esc(s);return esc(s.slice(0,i))+'<mark>'+esc(s.slice(i,i+q.length))+'</mark>'+esc(s.slice(i+q.length))}
  function row(href,k,t,sub,p,q){return '<a href="'+href+'"><span class="k">'+k+'</span><span class="t">'+hl(t,q)+(sub?'<small>'+esc(sub)+'</small>':'')+'</span><span class="p">'+(p||'')+'</span></a>'}
  function render(raw){var q=fold(raw.trim()),out=[];
    if(!q){res.innerHTML='<p class="srch-empty">Gõ tên liệu trình, nhu cầu da (mụn, cấp ẩm, nâng cơ…), tên chuyên viên hay chủ đề bài viết.</p>';return}
    T.forEach(function(t){if(fold(t.n+' '+t.s+' '+t.tech+' '+t.need.map(function(k){return NEEDS[k]}).join(' ')).indexOf(q)>-1)out.push(row(tLink(t),'Liệu trình',t.n,t.tech+' · '+t.d+' phút',vnd(t.p),q))});
    S.forEach(function(s){if(fold(s.n+' '+s.r).indexOf(q)>-1)out.push(row(ROOT+'chuyen-vien/#'+s.id,'Chuyên viên',s.n,s.r,'',q))});
    A.forEach(function(a){if(fold(a.t+' '+a.s+' '+a.c).indexOf(q)>-1)out.push(row(ROOT+'kien-thuc/'+(a.full?a.id+'/':'#bai-'+a.id),'Bài viết',a.t,a.c+' · '+a.m+' phút đọc','',q))});
    PAGES.forEach(function(p){if(fold(p.t+' '+(p.s||'')).indexOf(q)>-1)out.push(row(ROOT+p.u,p.k,p.t,p.s,'',q))});
    FAQ.forEach(function(f){if(fold(f[0]+' '+f[1]).indexOf(q)>-1)out.push(row(ROOT+'lien-he/#hoi-dap','Hỏi đáp',f[0],'','',q))});
    res.innerHTML=out.length?out.slice(0,14).join(''):'<p class="srch-empty">Chưa thấy kết quả cho “'+esc(raw)+'”. Thử “cấp ẩm”, “RF” hoặc gọi 0900&nbsp;000&nbsp;000 để được tư vấn.</p>'}
  $$('[data-search]').forEach(function(b){b.addEventListener('click',openS)});
  if(sr){si.addEventListener('input',function(){render(si.value)});$('#srchClose').addEventListener('click',closeS);sr.addEventListener('click',function(e){if(e.target===sr)closeS()});
    $$('[data-q]',sr).forEach(function(b){b.addEventListener('click',function(){si.value=b.getAttribute('data-q');render(si.value);si.focus()})})}
  d.addEventListener('keydown',function(e){if(e.key==='Escape'){closeS();setM(false)}else if(e.key==='/'&&!/INPUT|TEXTAREA|SELECT/.test(d.activeElement.tagName)){e.preventDefault();openS()}});
  /* trạng thái mở cửa */
  $$('[data-open]').forEach(function(el){var n=new Date(),h=n.getHours()+n.getMinutes()/60,o=h>=9&&h<21;el.textContent=o?'Đang mở cửa · đến 21:00':'Đã đóng cửa · mở lại lúc 09:00';el.classList.toggle('off',!o)});
  /* hiện dần */
  var rv=$$('.rv');
  if(!('IntersectionObserver' in window)||d.documentElement.classList.contains('static')){rv.forEach(function(e){e.classList.add('in')})}
  else{var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}})},{rootMargin:'0px 0px -6% 0px',threshold:.04});
    rv.forEach(function(e){var r=e.getBoundingClientRect();if(r.top<innerHeight&&r.bottom>0)e.classList.add('in');else io.observe(e)})}
  /* số chạy */
  if('IntersectionObserver' in window&&!RM){var cio=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){count(en.target);cio.unobserve(en.target)}})});$$('[data-count]').forEach(function(e){cio.observe(e)})}
  /* parallax nhẹ */
  var px=$$('[data-px]');if(px.length&&!RM&&innerWidth>=900){var pt=false;function pxf(){px.forEach(function(e){var r=e.getBoundingClientRect();if(r.bottom<-200||r.top>innerHeight+200)return;var k=parseFloat(e.getAttribute('data-px'))||.06;e.style.transform='translate3d(0,'+((r.top+r.height/2-innerHeight/2)*-k).toFixed(1)+'px,0)'});pt=false}
    addEventListener('scroll',function(){if(!pt){pt=true;requestAnimationFrame(pxf)}},{passive:true});pxf()}
  var pg=d.body.getAttribute('data-page');if(NGA.pages[pg])NGA.pages[pg]();
}
function count(el){var to=parseFloat(el.getAttribute('data-count')),fmt=el.getAttribute('data-fmt'),t0=null,dur=900;
  function f(v){return fmt==='vnd'?vnd(v):Math.round(v)}
  function st(ts){if(!t0)t0=ts;var k=Math.min(1,(ts-t0)/dur),e=1-Math.pow(1-k,3);el.textContent=f(to*e);if(k<1)requestAnimationFrame(st)}
  requestAnimationFrame(st)}
function tween(el,to,fmt){var from=parseFloat(el.getAttribute('data-v')||0);el.setAttribute('data-v',to);if(RM||from===to){el.textContent=fmt(to);return}
  var t0=null;function st(ts){if(!t0)t0=ts;var k=Math.min(1,(ts-t0)/520),e=1-Math.pow(1-k,3);el.textContent=fmt(from+(to-from)*e);if(k<1)requestAnimationFrame(st)}requestAnimationFrame(st)}
NGA.count=count;NGA.tween=tween;NGA.pages={};

/* ---------- dùng chung cho nhiều trang ---------- */
function faqHtml(list,openFirst){return list.map(function(f,i){return '<details'+(openFirst&&i===0?' open':'')+'><summary><span>'+esc(f[0])+'</span><span class="pm"><svg class="ic ic-s" aria-hidden="true"><use href="#i-plus"/></svg></span></summary><div class="ans"><p>'+esc(f[1])+'</p></div></details>'}).join('')}
function jrHtml(a){return '<a class="jr" href="'+ROOT+'kien-thuc/'+(a.full?a.id+'/':'#bai-'+a.id)+'"><figure><img src="'+img(a.img,800)+'" alt="Ảnh minh hoạ bài viết: '+esc(a.t)+'" width="800" height="600" loading="lazy"></figure><span class="jr-m"><b>'+esc(a.c)+'</b><span>'+a.d+'</span><span>'+a.m+' phút đọc</span></span><h3>'+esc(a.t)+'</h3><p>'+esc(a.s)+'</p></a>'}
function teamHtml(s){return '<a class="tt rv" href="'+ROOT+'chuyen-vien/#'+s.id+'"><figure><img src="'+img(s.img,700)+'" alt="Chân dung chuyên viên '+esc(s.n)+'" width="700" height="933" loading="lazy"></figure><h3>'+nb(s.n)+'</h3><p>'+esc(s.r)+' · '+s.y+' năm</p></a>'}
NGA.faqHtml=faqHtml;NGA.jrHtml=jrHtml;
function revealNew(c){$$('.rv',c).forEach(function(e){if(!('IntersectionObserver' in window)){e.classList.add('in');return}var o=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');o.disconnect()}})});o.observe(e)})}

NGA.pages.home=function(){
  var tabs=$('#exTabs'),grid=$('#exGrid'),more=$('#exMore'),keys=['am','mun','sang','san','nhay','thugian'];
  tabs.innerHTML=keys.map(function(k,i){return '<button class="chip" type="button" role="tab" id="tab-'+k+'" aria-controls="exGrid" aria-selected="'+(i===0)+'" aria-pressed="'+(i===0)+'" data-k="'+k+'" tabindex="'+(i===0?0:-1)+'">'+nb(NEEDS[k])+'</button>'}).join('');
  function show(k){var list=T.filter(function(t){return t.need.indexOf(k)>-1}).sort(function(a,b){return (b.hot||0)-(a.hot||0)}).slice(0,3);
    grid.innerHTML=list.map(function(t){return card(t)}).join('');grid.setAttribute('aria-labelledby','tab-'+k);
    more.setAttribute('href',ROOT+'lieu-trinh/?nhu-cau='+k);
    $$('button',tabs).forEach(function(b){var on=b.getAttribute('data-k')===k;b.setAttribute('aria-selected',on);b.setAttribute('aria-pressed',on);b.tabIndex=on?0:-1})}
  tabs.addEventListener('click',function(e){var b=e.target.closest('button');if(b)show(b.getAttribute('data-k'))});
  tabs.addEventListener('keydown',function(e){if(e.key!=='ArrowRight'&&e.key!=='ArrowLeft')return;var bs=$$('button',tabs),i=bs.indexOf(document.activeElement);if(i<0)return;i=(i+(e.key==='ArrowRight'?1:-1)+bs.length)%bs.length;bs[i].focus();show(bs[i].getAttribute('data-k'))});
  show('am');
  var tt=$('#teamTease');tt.innerHTML=S.map(teamHtml).join('');revealNew(tt);
  $('#jrHome').innerHTML=A.slice(0,3).map(jrHtml).join('');
  $('#hfaq').innerHTML=faqHtml(FAQ.slice(0,4),true);
};

NGA.pages.list=function(){
  var st={q:'',need:'all',dur:'all',max:2500000,sort:'hot',fav:false},qs=new URLSearchParams(location.search);
  var keys=['all','am','mun','sang','san','nhay','thugian'];
  if(keys.indexOf(qs.get('nhu-cau'))>-1)st.need=qs.get('nhu-cau');
  if(location.hash==='#yeu-thich')st.fav=true;
  var hlId=qs.get('lt');
  var g=$('#ltGrid'),cnt=$('#fCount'),empty=$('#ltEmpty'),fl=$('#flt');
  $('#fNeed').innerHTML=keys.map(function(k){var n=k==='all'?T.length:T.filter(function(t){return t.need.indexOf(k)>-1}).length;return '<button class="chip" type="button" data-k="'+k+'" aria-pressed="'+(st.need===k)+'">'+(k==='all'?'Tất cả':nb(NEEDS[k]))+' <span class="n">'+n+'</span></button>'}).join('');
  $('#fFav').checked=st.fav;if(st.fav){fl.classList.add('adv');$('#fToggle').setAttribute('aria-expanded','true')}
  function apply(){
    var q=fold(st.q.trim()),fv=favs();
    var list=T.filter(function(t){
      if(st.need!=='all'&&t.need.indexOf(st.need)<0)return false;
      if(st.dur==='60'&&t.d>60)return false;if(st.dur==='90'&&(t.d<=60||t.d>90))return false;if(st.dur==='120'&&t.d<=90)return false;
      if(t.p>st.max)return false;if(st.fav&&fv.indexOf(t.id)<0)return false;
      if(q&&fold(t.n+' '+t.s+' '+t.tech+' '+t.need.map(function(k){return NEEDS[k]}).join(' ')).indexOf(q)<0)return false;return true});
    list.sort(function(a,b){return st.sort==='pa'?a.p-b.p:st.sort==='pd'?b.p-a.p:st.sort==='d'?a.d-b.d:((b.hot||0)-(a.hot||0))||(a.p-b.p)});
    g.innerHTML=list.map(function(t){return card(t,{cls:t.id===hlId?'hl':''})}).join('');
    tween(cnt,list.length,function(v){return Math.round(v)});empty.hidden=list.length>0;
    $$('#fNeed .chip').forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-k')===st.need)});
    $$('#fDur button').forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-v')===st.dur)});
  }
  $('#fNeed').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;st.need=b.getAttribute('data-k');apply();
    try{var u=new URL(location.href);if(st.need==='all')u.searchParams.delete('nhu-cau');else u.searchParams.set('nhu-cau',st.need);history.replaceState(null,'',u)}catch(_){}});
  $('#fDur').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;st.dur=b.getAttribute('data-v');apply()});
  var qt;$('#fQ').addEventListener('input',function(e){clearTimeout(qt);qt=setTimeout(function(){st.q=e.target.value;apply()},120)});
  $('#fPrice').addEventListener('input',function(e){st.max=+e.target.value;$('#fPriceV').textContent=vnd(st.max);apply()});
  $('#fSort').addEventListener('change',function(e){st.sort=e.target.value;apply()});
  $('#fFav').addEventListener('change',function(e){st.fav=e.target.checked;apply()});
  $('#fToggle').addEventListener('click',function(){var o=!fl.classList.contains('adv');fl.classList.toggle('adv',o);this.setAttribute('aria-expanded',o)});
  $('#fReset').addEventListener('click',function(){st={q:'',need:'all',dur:'all',max:2500000,sort:'hot',fav:false};$('#fQ').value='';$('#fPrice').value=2500000;$('#fPriceV').textContent=vnd(2500000);$('#fSort').value='hot';$('#fFav').checked=false;apply()});
  document.addEventListener('favchange',function(){if(st.fav)apply()});
  apply();
  if(hlId||st.fav){setTimeout(function(){var el=hlId?$('.tc.hl'):$('#ds');el&&el.scrollIntoView({block:'center'})},200)}
  /* bảng giá */
  var groups=[['am','nhay'],['mun'],['sang','san'],['thugian']],names=['Cấp ẩm & da nhạy cảm','Mụn & lỗ chân lông','Sáng da & nâng cơ','Thư giãn cơ thể'],used={};
  $('#menuCols').innerHTML=groups.map(function(gr,i){var items=T.filter(function(t){if(used[t.id])return false;var ok=t.need.some(function(k){return gr.indexOf(k)>-1})&&gr.indexOf(t.need[0])>-1;if(ok)used[t.id]=1;return ok});
    return '<div class="mg"><h3>'+names[i]+'</h3>'+items.map(function(t){return '<a class="mi" href="'+tLink(t)+'"><span class="mi-n">'+nb(t.n)+'</span><span class="mi-p num">'+vnd(t.p)+'</span><span class="mi-d">'+t.d+' phút · '+esc(t.tech)+'</span></a>'}).join('')+'</div>'}).join('');
};

function pkgOff(n){return n>=10?.15:n>=5?.10:0}
NGA.pkgOff=pkgOff;
NGA.pages.detail=function(){
  var t=byId(T,'phuc-hoi-hang-rao-da'),n=1;
  $$('[data-fav="'+t.id+'"]').forEach(function(b){b.setAttribute('aria-pressed',favs().indexOf(t.id)>-1)});
  function calc(){var raw=t.p*n,off=Math.round(raw*pkgOff(n)),tot=raw-off;
    tween($('#dtPrice'),Math.round(tot/n),vnd);$('#dtPer').textContent='/ buổi'+(n>1?' khi mua '+n+' buổi':'');
    tween($('#dtRaw'),raw,vnd);tween($('#dtOff'),off,function(v){return (v>0?'−':'')+vnd(v)});tween($('#dtTot'),tot,vnd);
    $('#dtHint').textContent=n>=10?'Đã áp dụng giảm 15% cho gói 10 buổi. Dùng trong 12 tháng.':n>=5?'Đã áp dụng giảm 10% cho gói 5 buổi. Dùng trong 6 tháng.':'Mua từ 5 buổi giảm 10%, từ 10 buổi giảm 15%. Nên làm cách nhau 7–10 ngày.';
    $$('#dtSes button').forEach(function(b){b.setAttribute('aria-pressed',+b.getAttribute('data-n')===n)})}
  $('#dtSes').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;n=+b.getAttribute('data-n');calc()});
  $('#dtPrice').setAttribute('data-v',t.p);$('#dtRaw').setAttribute('data-v',t.p);$('#dtTot').setAttribute('data-v',t.p);calc();
  var steps=[
    ['Soi da & hỏi tiền sử',10,'Chuyên viên dùng đèn phóng đại xem độ ẩm, vùng đỏ, lỗ chân lông; hỏi về sản phẩm bạn đang dùng và các lần dị ứng trước đây.','Bạn ngồi thoải mái với tách trà gừng. Có thể hỏi bất cứ điều gì.'],
    ['Làm sạch dịu',10,'Tẩy trang bằng dầu, rửa lại bằng sữa rửa mặt pH thấp, lau bằng bông mềm. Không dùng hạt chà, không dùng máy hút.','Mát và nhẹ. Da không bị kéo căng sau khi rửa.'],
    ['Massage thư giãn cơ mặt',15,'Thủ pháp tay chậm theo đường dẫn lưu, kết hợp dầu dưỡng có squalane. Tránh vùng đang đỏ.','Phần nhiều khách ngủ thiếp đi ở bước này.'],
    ['Mặt nạ lạnh & LED đỏ',25,'Đắp mặt nạ thạch làm lạnh, sau đó chiếu LED bước sóng đỏ 15 phút. Mắt được che bằng kính bảo vệ.','Ấm nhẹ dưới mặt nạ mát. Không đau, không nóng rát.'],
    ['Dưỡng & dặn dò',15,'Thoa serum cấp ẩm, kem phục hồi và chống nắng. Chuyên viên ghi phiếu chăm da 7 ngày và hẹn lịch nếu bạn muốn.','Da mềm và ẩm. Có thể trang điểm nhẹ ngay nếu cần.']
  ],bar=$('#tlBar'),pn=$('#tlPanel'),acc=0;
  bar.innerHTML=steps.map(function(s,i){var a=acc;acc+=s[1];return '<button type="button" role="tab" aria-selected="'+(i===0)+'" tabindex="'+(i?-1:0)+'" style="--w:'+s[1]+'" data-i="'+i+'"><span class="num">'+a+'–'+acc+' phút</span><b>'+esc(s[0]).replace(' &amp; ',' &amp;\u00a0')+'</b></button>'}).join('');
  function show(i){var s=steps[i];pn.innerHTML='<div class="tl-n tl-anim">0'+(i+1)+'</div><div class="tl-anim"><h3>'+esc(s[0])+'</h3><p>'+esc(s[2])+'</p></div><div class="tl-feel tl-anim"><b>Bạn sẽ cảm thấy</b><p>'+esc(s[3])+'</p></div>';
    $$('button',bar).forEach(function(b,j){b.setAttribute('aria-selected',j===i);b.tabIndex=j===i?0:-1})}
  bar.addEventListener('click',function(e){var b=e.target.closest('button');if(b)show(+b.getAttribute('data-i'))});
  bar.addEventListener('keydown',function(e){if(e.key!=='ArrowRight'&&e.key!=='ArrowLeft')return;var bs=$$('button',bar),i=bs.indexOf(document.activeElement);i=(i+(e.key==='ArrowRight'?1:-1)+bs.length)%bs.length;bs[i].focus();show(i)});
  show(0);
  $('#dtFaq').innerHTML=faqHtml([
    ['Bao lâu nên làm một lần?','Thường cách nhau 7–10 ngày cho 3–5 buổi đầu, sau đó 3–4 tuần một lần để duy trì. Chuyên viên sẽ điều chỉnh theo tình trạng da mỗi lần soi.'],
    ['Có trang điểm được ngay sau buổi làm?','Được, nhưng nên trang điểm nhẹ và tẩy trang kỹ buổi tối. Tốt nhất để da nghỉ trong ngày đầu.'],
    ['Đang mang thai có làm được không?','Phần làm sạch, massage và mặt nạ lạnh làm được. Bước LED sẽ được thay bằng mặt nạ dưỡng thêm nếu bạn muốn thận trọng; hãy báo khi đặt lịch.'],
    ['Liệu trình có giúp hết đỏ da không?','Ngà không hứa kết quả cụ thể. Buổi làm giúp da dịu và đủ ẩm hơn; tình trạng đỏ kéo dài cần được bác sĩ da liễu thăm khám.']
  ],true);
  var rel=T.filter(function(x){return x.id!==t.id&&x.need.some(function(k){return t.need.indexOf(k)>-1})}).slice(0,3);
  $('#related').innerHTML=rel.map(function(x){return card(x)}).join('');
};

NGA.pages.quiz=function(){
  var Q=[
   {q:'Sáng ngủ dậy, chưa thoa gì, da bạn cảm thấy thế nào?',s:'Chọn cảm giác gần nhất.',o:[['Căng, hơi rát','Nhất là vùng má',{am:3,nhay:1},'kho'],['Bình thường, dễ chịu','',{sang:1},'tb'],['Hơi nhờn ở trán và mũi','Hai má vẫn ổn',{mun:1,am:1},'hh'],['Bóng dầu khắp mặt','',{mun:3},'dau']]},
   {q:'Buổi trưa, vùng trán và mũi của bạn thường…',s:'Sau khoảng 4–5 tiếng ở văn phòng hoặc ngoài đường.',o:[['Khô, có khi bong nhẹ','',{am:2},'kho'],['Bóng nhẹ, hai má vẫn khô','',{am:1,mun:1},'hh'],['Đổ dầu, phải thấm giấy','',{mun:2},'dau'],['Gần như không thay đổi','',{},'tb']]},
   {q:'Khi thử một sản phẩm mới, da bạn thường…',s:'',o:[['Đỏ, châm chích hoặc ngứa','',{nhay:3,am:1},''],['Thỉnh thoảng nổi vài nốt nhỏ','',{mun:1,nhay:1},''],['Hầu như không phản ứng','',{},''],['Chưa thử nhiều nên chưa rõ','',{nhay:1},'']]},
   {q:'Điều bạn bận tâm nhất lúc này?',s:'Chọn tối đa hai ý.',multi:2,o:[['Mụn ẩn, lỗ chân lông','',{mun:3},''],['Da xỉn, không đều màu','',{sang:3},''],['Da chảy xệ, kém săn','',{san:3},''],['Khô, thiếu nước','',{am:3},''],['Cổ, vai, gáy mỏi','',{thugian:3},''],['Dễ đỏ, dễ kích ứng','',{nhay:3},'']]},
   {q:'Mỗi ngày bạn ở ngoài nắng bao lâu?',s:'Tính cả lúc đi xe máy.',o:[['Dưới 30 phút','',{},''],['30 phút đến 2 giờ','',{sang:1},''],['Trên 2 giờ','',{sang:2,nhay:1},''],['Vừa đi biển, đi nắng nhiều ngày','',{nhay:2,am:2},'']]},
   {q:'Tuần vừa rồi, bạn ngủ trung bình mấy tiếng mỗi đêm?',s:'',o:[['Dưới 5 tiếng','',{thugian:3,san:1},''],['5–6 tiếng','',{thugian:2},''],['7 tiếng trở lên','',{},''],['Lúc nhiều lúc ít','',{thugian:1},'']]}
  ];
  var TYPES={kho:['Da khô, thiếu ẩm','Lớp màng bảo vệ đang mỏng. Ưu tiên làm dịu và bù ẩm trước khi nghĩ tới làm sáng hay tẩy tế bào chết.'],dau:['Da dầu','Tuyến dầu hoạt động mạnh. Làm sạch sâu định kỳ, nhưng đừng rửa mặt quá nhiều lần làm da phản ứng tiết thêm dầu.'],hh:['Da hỗn hợp, thiếu nước','Vùng chữ T đổ dầu nhưng hai má lại khô. Cần cân bằng: làm sạch vùng dầu và cấp ẩm cho vùng khô.'],tb:['Da cân bằng','Da đang ổn định. Đây là lúc tốt để chăm sóc duy trì và tập trung vào điều bạn muốn cải thiện.']};
  var AVOID={am:'Tẩy da chết hạt to, rửa mặt nước nóng',mun:'Tự nặn mụn ở nhà, đắp nhiều lớp kem đặc',sang:'Ra nắng không chống nắng sau khi dùng sản phẩm làm sáng',san:'Kéo, chà xát mạnh khi rửa mặt và thoa kem',nhay:'Thử nhiều sản phẩm mới cùng lúc, nước hoa trong mỹ phẩm',thugian:'Cúi màn hình liên tục quá 2 giờ không nghỉ'};
  var ans=get('quizAns',[]),i=0,form=$('#qzForm'),box=$('#qzQ'),err=$('#qzErr'),res=$('#qzRes'),ring=$('#qzRing');
  if(!Array.isArray(ans)||ans.length!==Q.length)ans=Q.map(function(){return []});
  function prog(k){ring.style.strokeDashoffset=326.7*(1-k/Q.length);$('#qzStep').textContent=Math.min(Q.length,k+1)}
  function draw(){var q=Q[i],m=q.multi,two=q.o.length>4;
    box.innerHTML='<div class="qz-anim"><p class="qz-k">Câu '+(i+1)+' / '+Q.length+'</p><fieldset><legend>'+esc(q.q)+'</legend>'+(q.s?'<p class="qz-sub">'+esc(q.s)+'</p>':'<p class="qz-sub">Chọn một đáp án.</p>')+'<div class="qz-opts'+(two?' two':'')+'">'+
      q.o.map(function(o,j){var on=ans[i].indexOf(j)>-1;return '<label class="qz-o'+(m?' multi':'')+'"><input type="'+(m?'checkbox':'radio')+'" name="q'+i+'" value="'+j+'"'+(on?' checked':'')+'><span class="bx"><svg class="ic" aria-hidden="true"><use href="#i-check"/></svg></span><span class="t"><b>'+esc(o[0])+'</b>'+(o[1]?'<small>'+esc(o[1])+'</small>':'')+'</span></label>'}).join('')+'</div></fieldset></div>';
    $('#qzBack').disabled=i===0;$('#qzNext').querySelector('span').textContent=i===Q.length-1?'Xem gợi ý của bạn':'Câu tiếp theo';err.textContent='';prog(i)}
  box.addEventListener('change',function(e){var q=Q[i];var ch=$$('input:checked',box).map(function(x){return +x.value});
    if(q.multi&&ch.length>q.multi){e.target.checked=false;err.textContent='Chọn tối đa '+q.multi+' ý thôi nhé.';return}
    ans[i]=ch;err.textContent='';set('quizAns',ans);
    if(!q.multi&&ch.length){setTimeout(function(){if(i<Q.length-1){i++;draw();focusQ()}},260)}});
  function focusQ(){var f=$('input',box);f&&f.focus({preventScroll:true})}
  $('#qzBack').addEventListener('click',function(){if(i>0){i--;draw()}});
  form.addEventListener('submit',function(e){e.preventDefault();if(!ans[i].length){err.textContent='Bạn chọn một đáp án để tiếp tục nhé.';focusQ();return}
    if(i<Q.length-1){i++;draw();focusQ()}else result(true)});
  function score(){var sc={am:0,mun:0,sang:0,san:0,nhay:0,thugian:0},ty={};
    ans.forEach(function(a,qi){a.forEach(function(j){var o=Q[qi].o[j];for(var k in o[2])sc[k]+=o[2][k];if(o[3])ty[o[3]]=(ty[o[3]]||0)+1})});
    var type=Object.keys(ty).sort(function(a,b){return ty[b]-ty[a]})[0]||'tb';return {sc:sc,type:type}}
  function result(scroll){var r=score(),sc=r.sc,keys=Object.keys(sc).sort(function(a,b){return sc[b]-sc[a]}),max=Math.max.apply(null,keys.map(function(k){return sc[k]}))||1;
    var top=keys.filter(function(k){return sc[k]>0}).slice(0,3);if(!top.length)top=['am','sang'];
    var picks=T.map(function(t){var s=0;t.need.forEach(function(k){var p=top.indexOf(k);if(p>-1)s+=3-p});if(sc.nhay>=3&&/peel|rf/.test(t.id))s-=3;return {t:t,s:s+(t.hot?.3:0)}}).sort(function(a,b){return b.s-a.s}).slice(0,3).map(function(x){return x.t});
    var ty=TYPES[r.type];set('quizRes',{type:r.type,top:top,pick:picks[0].id,d:new Date().toLocaleDateString('vi-VN')});
    form.hidden=true;$('#qzLast').hidden=true;res.hidden=false;prog(Q.length);$('#qzStep').textContent='6';
    res.innerHTML='<div class="qr-top"><p class="qz-k">Hồ sơ da của bạn</p><h2>'+esc(ty[0])+'</h2><p>'+esc(ty[1])+'</p></div><div class="qr-body">'+
     '<div><p class="qr-h">Mức quan tâm theo nhu cầu</p><div class="qr-bars">'+keys.map(function(k,ix){return '<div class="qr-bar'+(ix<1?' top':'')+'"><span>'+esc(NEEDS[k])+'</span><i><b data-w="'+Math.round(sc[k]/max*100)+'"></b></i><span class="num">'+sc[k]+'</span></div>'}).join('')+'</div></div>'+
     '<div><p class="qr-h">Liệu trình gợi ý để bắt đầu</p><div class="qr-picks">'+picks.map(function(t,ix){return '<a class="qr-pick'+(ix===0?' first':'')+'" href="'+tLink(t)+'"><img src="'+img(t.img,300)+'" alt="'+esc(t.n)+'" width="88" height="72" loading="lazy"><span><b>'+nb(t.n)+'</b><small>'+(ix===0?'Gợi ý chính · ':'')+t.d+' phút · '+esc(t.tech)+'</small></span><span class="num">'+vnd(t.p)+'</span></a>'}).join('')+'</div></div>'+
     '<div><p class="qr-h">Nên tạm tránh</p><ul class="qr-avoid">'+top.map(function(k){return '<li><svg class="ic" aria-hidden="true"><use href="#i-close"/></svg><span>'+esc(AVOID[k])+'</span></li>'}).join('')+'</ul></div>'+
     '<div class="qr-cta"><a class="btn btn-p" href="'+ROOT+'dat-lich/" data-book="'+picks[0].id+'"><svg class="ic" aria-hidden="true"><use href="#i-cal"/></svg><span>Đặt lịch với gợi ý này</span></a><button class="btn btn-w" type="button" id="qzAgain"><svg class="ic" aria-hidden="true"><use href="#i-back"/></svg><span>Làm lại</span></button></div>'+
     '<p class="qr-note">Gợi ý dựa trên câu trả lời của bạn, không phải chẩn đoán. Kết quả chỉ để tham khảo, không thay thế tư vấn chuyên môn. Nếu da đang viêm, đau, chảy dịch hay kéo dài nhiều tuần, hãy gặp bác sĩ da liễu.</p></div>';
    requestAnimationFrame(function(){setTimeout(function(){$$('.qr-bar b',res).forEach(function(b){b.style.width=b.getAttribute('data-w')+'%'})},60)});
    $('#qzAgain').addEventListener('click',function(){ans=Q.map(function(){return []});set('quizAns',ans);i=0;res.hidden=true;form.hidden=false;draw();form.scrollIntoView({block:'start'});focusQ()});
    if(scroll){res.focus({preventScroll:true});res.scrollIntoView({behavior:RM?'auto':'smooth',block:'start'})}}
  var last=get('quizRes',null);
  if(last&&TYPES[last.type]){var lp=byId(T,last.pick);if(lp){var l=$('#qzLast');l.hidden=false;l.innerHTML='<span>Lần trước ('+esc(last.d||'')+'): <b>'+esc(TYPES[last.type][0])+'</b>, gợi ý '+esc(lp.n)+'.</span><button type="button" id="qzShow">Xem lại kết quả</button>';
    $('#qzShow').addEventListener('click',function(){if(ans.every(function(a){return a.length}))result(true);else{l.hidden=true}})}}
  draw();
};

var DAYS=['T2','T3','T4','T5','T6','T7','CN'],DAYL=['Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy','Chủ Nhật'];
NGA.DAYS=DAYS;
NGA.pages.team=function(){
  var st={sk:'all',day:-1},sks=['all','am','mun','sang','san','nhay','thugian'];
  $('#tmSkill').innerHTML=sks.map(function(k){return '<button class="chip" type="button" data-k="'+k+'" aria-pressed="'+(k==='all')+'">'+(k==='all'?'Tất cả':nb(NEEDS[k]))+'</button>'}).join('');
  $('#tmDay').innerHTML='<button type="button" data-d="-1" aria-pressed="true">Mọi ngày</button>'+DAYS.map(function(d,i){return '<button type="button" data-d="'+i+'" aria-pressed="false" aria-label="'+DAYL[i]+'">'+d+'</button>'}).join('');
  function prof(s){var tr=T.filter(function(t){return t.need.some(function(k){return s.sk.indexOf(k)>-1})}).slice(0,1)[0];
    return '<article class="pf" id="'+s.id+'"><figure class="pf-img"><img src="'+img(s.img,800)+'" alt="Chân dung chuyên viên '+esc(s.n)+'" width="800" height="1000" loading="lazy"><figcaption>Hồ sơ mẫu</figcaption></figure>'+
    '<div class="pf-b"><p class="pf-yr">'+s.y+' năm làm nghề</p><h2>'+nb(s.n)+'</h2><p class="pf-role">'+esc(s.r)+'</p><blockquote>“'+esc(s.q)+'”</blockquote>'+
    '<div class="pf-tags">'+s.sk.map(function(k){return '<span class="tag peach">'+nb(NEEDS[k])+'</span>'}).join('')+'</div>'+
    '<ul class="pf-cert">'+s.cert.map(function(c){return '<li><svg class="ic" aria-hidden="true"><use href="#i-shield"/></svg><span>'+esc(c)+'</span></li>'}).join('')+'</ul>'+
    '<ul class="pf-week" aria-label="Lịch làm việc trong tuần">'+DAYS.map(function(d,i){var on=s.days.indexOf(i)>-1;return '<li class="'+(on?'on':'')+(st.day===i?' pick':'')+'"><span>'+d+'</span><b></b><span class="sr">'+(on?'có làm':'nghỉ')+'</span></li>'}).join('')+'</ul>'+
    '<div class="pf-cta"><a class="btn btn-p" href="'+ROOT+'dat-lich/" data-book="'+(tr?tr.id:'')+'" data-spec="'+s.id+'"><svg class="ic" aria-hidden="true"><use href="#i-cal"/></svg><span>Đặt lịch với '+nb(s.n.split(' ').slice(-2).join(' '))+'</span></a>'+(tr?'<a class="btn btn-w" href="'+tLink(tr)+'"><span>Liệu trình thế mạnh</span></a>':'')+'</div></div></article>'}
  function apply(){var list=S.filter(function(s){return (st.sk==='all'||s.sk.indexOf(st.sk)>-1)&&(st.day<0||s.days.indexOf(st.day)>-1)});
    $('#tmList').innerHTML=list.length?list.map(prof).join(''):'<p class="tm-empty">Chưa có chuyên viên khớp lựa chọn. Thử chọn ngày khác.</p>';
    tween($('#tmN'),list.length,function(v){return Math.round(v)});
    $$('#tmSkill .chip').forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-k')===st.sk)});
    $$('#tmDay button').forEach(function(b){b.setAttribute('aria-pressed',+b.getAttribute('data-d')===st.day)})}
  $('#tmSkill').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;st.sk=b.getAttribute('data-k');apply()});
  $('#tmDay').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;st.day=+b.getAttribute('data-d');apply()});
  apply();
  if(location.hash){var t=document.getElementById(location.hash.slice(1));if(t)setTimeout(function(){t.scrollIntoView()},100)}
};

NGA.pages.pkg=function(){
  /* trả trước / theo tháng */
  $('#pkBill').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var m=b.getAttribute('data-b');
    $$('#pkBill button').forEach(function(x){x.setAttribute('aria-pressed',x===b)});
    [['#tpMua','#tsMua',3],['#tpNam','#tsNam',12]].forEach(function(r){var el=$(r[0]),v=+el.getAttribute('data-'+m);if(!el.getAttribute('data-v'))el.setAttribute('data-v',el.getAttribute('data-pre'));
      tween(el,v,vnd);$(r[1]).textContent=m==='mon'?'mỗi tháng, trong '+r[2]+' tháng':'trả một lần'})});
  /* công cụ tính */
  var sel=$('#cT'),n=$('#cN'),add=$('#cAdd'),pre=new URLSearchParams(location.search).get('lt')||get('booking',{}).t;
  sel.innerHTML=T.map(function(t){return '<option value="'+t.id+'">'+esc(t.n)+' · '+t.d+' phút · '+vnd(t.p)+'</option>'}).join('');
  if(pre&&byId(T,pre))sel.value=pre;
  ['#cRaw','#cOff','#cTot','#cPer'].forEach(function(s){$(s).setAttribute('data-v',0)});
  function calc(){var t=byId(T,sel.value),k=+n.value,unit=t.p+(add.checked?250000:0),raw=unit*k,pct=pkgOff(k),off=Math.round(raw*pct),tot=raw-off;
    $('#cNv').textContent=k;tween($('#cRaw'),raw,vnd);tween($('#cOff'),off,function(v){return (v>0?'−':'')+vnd(v)});tween($('#cTot'),tot,vnd);tween($('#cPer'),Math.round(tot/k),vnd);
    $('#cPct').textContent=Math.round(pct*100)+'%';$('#cBar').style.width=(pct/.15*100)+'%';
    $('#cExp').textContent=k>=10?'12 tháng':k>=5?'6 tháng':'3 tháng';
    $$('#cTiers li').forEach(function(li){var a=+li.getAttribute('data-t');li.classList.toggle('on',(a===1&&k<5)||(a===5&&k>=5&&k<10)||(a===10&&k>=10))});
    $('#cBook').setAttribute('data-book',t.id);}
  sel.addEventListener('change',calc);n.addEventListener('input',calc);add.addEventListener('change',calc);
  $('#cMinus').addEventListener('click',function(){n.value=Math.max(1,+n.value-1);calc()});
  $('#cPlus').addEventListener('click',function(){n.value=Math.min(20,+n.value+1);calc()});
  $$('[data-pick]').forEach(function(a){a.addEventListener('click',function(){n.value=a.getAttribute('data-pick');calc()})});
  calc();
  $('#pkFaq').innerHTML=faqHtml([
    ['Gói có tự gia hạn không?','Không. Hết hạn hoặc hết buổi, gói kết thúc. Lễ tân sẽ nhắn bạn trước 2 tuần để bạn tự quyết định.'],
    ['Hết hạn mà chưa dùng hết buổi thì sao?','Bạn được gia hạn thêm 1 tháng miễn phí một lần, báo trước ngày hết hạn. Sau đó buổi còn lại có thể đổi thành thẻ quà tặng theo giá trị tương ứng.'],
    ['Có hoàn tiền gói không?','Gói đã mua không hoàn tiền mặt. Trường hợp sức khoẻ không thể tiếp tục (có giấy xác nhận của bác sĩ), Ngà chuyển phần còn lại thành thẻ quà tặng không thời hạn.'],
    ['Trả theo tháng thanh toán thế nào?','Chuyển khoản hoặc quẹt thẻ tại quầy trước ngày 5 mỗi tháng. Không cần thẻ tín dụng, không có phí trả chậm trong 7 ngày đầu.']
  ],true);
};

function code(prefix){var c='ABCDEFGHJKLMNPQRSTUVWXYZ23456789',s='';for(var i=0;i<4;i++)s+=c[Math.floor(Math.random()*c.length)];return prefix+s}
function isoDate(d){return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)}
function vnDate(iso){var p=iso.split('-');return p[2]+'/'+p[1]+'/'+p[0]}
function phoneOk(v){return /^0\d{9}$/.test(v.replace(/[\s.]/g,''))}
function fldErr(inp,bad){var f=inp.closest('.fld');if(f)f.classList.toggle('err',bad);inp.setAttribute('aria-invalid',bad?'true':'false');return bad}
NGA.code=code;NGA.isoDate=isoDate;NGA.vnDate=vnDate;NGA.phoneOk=phoneOk;NGA.fldErr=fldErr;
NGA.pages.gift=function(){
  var st={mode:'val',val:1000000,tr:'massage-da-am',th:'kem'},card=$('#gCard'),AM=[500000,1000000,2000000,3000000];
  $('#gAmts').innerHTML=AM.map(function(v){return '<button type="button" data-v="'+v+'" aria-pressed="'+(v===st.val)+'">'+vnd(v)+'</button>'}).join('');
  $('#gTr').innerHTML=T.map(function(t){return '<option value="'+t.id+'">'+esc(t.n)+' · '+vnd(t.p)+'</option>'}).join('');$('#gTr').value=st.tr;
  var today=new Date();$('#gDate').min=isoDate(today);$('#gDate').value=isoDate(today);
  $('#gVal').setAttribute('data-v',st.val);
  function amount(){return st.mode==='val'?st.val:byId(T,st.tr).p}
  function sync(pop){var a=amount();
    if(st.mode==='val'){tween($('#gVal'),a,vnd)}else{$('#gVal').textContent=byId(T,st.tr).n;$('#gVal').setAttribute('data-v',0)}
    var to=$('#gTo').value.trim(),fr=$('#gFromI').value.trim(),msg=$('#gMsgI').value.trim();
    $('#gForT').textContent=to?'Dành tặng '+to:'Dành tặng bạn';$('#gMsg').textContent=msg||'Chúc bạn một buổi chiều thật thư thái.';$('#gFrom').textContent=fr?'Từ '+fr:'Từ một người thương bạn';
    $('#gCnt').textContent=$('#gMsgI').value.length;card.setAttribute('data-th',st.th);
    var del=$('input[name=gd]:checked').value,dl={quay:'Nhận tại quầy',email:'Gửi qua email',zalo:'Gửi qua Zalo'}[del];
    $('#gSum').innerHTML='<div><span>Quà tặng</span><b>'+(st.mode==='val'?vnd(a):esc(byId(T,st.tr).n)+' ('+vnd(a)+')')+'</b></div><div><span>Mẫu thiệp</span><b>'+{kem:'Kem ngà',dat:'Đất nung',la:'Lá non'}[st.th]+'</b></div><div><span>Nhận thẻ</span><b>'+dl+($('#gDate').value?' · '+vnDate($('#gDate').value):'')+'</b></div><div><span>Thanh toán</span><b>'+vnd(a)+'</b></div>';
    if(pop){card.classList.remove('gc-pop');void card.offsetWidth;card.classList.add('gc-pop')}}
  $('#gAmts').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;st.val=+b.getAttribute('data-v');$('#gCustom').value='';fldErr($('#gCustom'),false);
    $$('#gAmts button').forEach(function(x){x.setAttribute('aria-pressed',x===b)});sync(true)});
  $('#gCustom').addEventListener('input',function(e){var v=+e.target.value.replace(/\D/g,'');e.target.value=v?v.toString().replace(/\B(?=(\d{3})+(?!\d))/g,'.'):'';
    $$('#gAmts button').forEach(function(x){x.setAttribute('aria-pressed',+x.getAttribute('data-v')===v)});
    if(v>=300000&&v<=10000000){st.val=v;fldErr(e.target,false);sync()}});
  $('#gCustom').addEventListener('blur',function(e){var v=+e.target.value.replace(/\D/g,'');if(e.target.value)fldErr(e.target,!(v>=300000&&v<=10000000))});
  $('#gMode').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;st.mode=b.getAttribute('data-m');
    $$('#gMode button').forEach(function(x){x.setAttribute('aria-pressed',x===b)});$('#gValBox').hidden=st.mode!=='val';$('#gTrBox').hidden=st.mode==='val';sync(true)});
  $('#gTr').addEventListener('change',function(e){st.tr=e.target.value;sync(true)});
  $('#gTh').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;st.th=b.getAttribute('data-th');$$('#gTh button').forEach(function(x){x.setAttribute('aria-pressed',x===b)});sync(true)});
  ['#gTo','#gFromI','#gMsgI','#gDate'].forEach(function(s){$(s).addEventListener('input',function(){sync();if($(s).closest('.fld').classList.contains('err'))fldErr($(s),!$(s).value.trim())})});
  $('#gDel').addEventListener('change',function(){sync()});
  $('#gSug').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;$('#gMsgI').value=b.textContent;sync(true);
    if(card.classList.contains('flip')===false)$('#gFlip').click()});
  $('#gFlip').addEventListener('click',function(){var f=card.classList.toggle('flip');this.setAttribute('aria-pressed',f);this.querySelector('span').textContent=f?'Xem mặt trước':'Xem mặt sau'});
  $('#gMsgI').addEventListener('focus',function(){if(!card.classList.contains('flip'))$('#gFlip').click()});
  $('#gForm').addEventListener('submit',function(e){e.preventDefault();var bad=[];
    if(st.mode==='val'&&$('#gCustom').value){var v=+$('#gCustom').value.replace(/\D/g,'');if(fldErr($('#gCustom'),!(v>=300000&&v<=10000000)))bad.push($('#gCustom'))}
    if(fldErr($('#gTo'),!$('#gTo').value.trim()))bad.push($('#gTo'));
    if(fldErr($('#gFromI'),!$('#gFromI').value.trim()))bad.push($('#gFromI'));
    if(fldErr($('#gPhone'),!phoneOk($('#gPhone').value)))bad.push($('#gPhone'));
    if(fldErr($('#gDate'),!$('#gDate').value||$('#gDate').value<isoDate(new Date())))bad.push($('#gDate'));
    var ok=$('#gOk').checked;$('#gOkL').classList.toggle('err',!ok);if(!ok)bad.push($('#gOk'));
    if(bad.length){bad[0].focus();toast('Còn '+bad.length+' mục cần kiểm tra lại');return}
    var c=code('NGA-QT-');$('#gCode').textContent=c;
    var d=$('#gDone');$('#gForm').hidden=true;d.hidden=false;
    d.innerHTML='<div class="ok"><svg class="ic" aria-hidden="true"><use href="#i-check"/></svg></div><h2>Đã ghi nhận thẻ quà&nbsp;tặng</h2><p>Ngà sẽ gọi số '+esc($('#gPhone').value)+' để xác nhận và hướng dẫn thanh toán trong giờ làm việc. (Minh hoạ: không có đơn nào được gửi đi.)</p><div class="code"><span>Mã thẻ minh hoạ</span><b class="num">'+c+'</b><button class="btn btn-w btn-s" type="button" id="gCopy"><svg class="ic" aria-hidden="true"><use href="#i-copy"/></svg><span>Sao chép</span></button></div><div class="acts"><button class="btn btn-o" type="button" id="gNew">Tạo thẻ khác</button><a class="btn btn-p" href="'+ROOT+'lieu-trinh/">Xem liệu trình để gợi ý</a></div>';
    d.focus();$('#gCopy').addEventListener('click',function(){try{navigator.clipboard.writeText(c);toast('Đã sao chép mã '+c)}catch(_){toast(c)}});
    $('#gNew').addEventListener('click',function(){d.hidden=true;$('#gForm').hidden=false;$('#gOk').checked=false;$('#gCode').textContent='NGA-QT-••••'})});
  $('#gFaq').innerHTML=faqHtml([
    ['Thẻ quà tặng có hạn dùng bao lâu?','12 tháng kể từ ngày mua. Có thể gia hạn thêm 3 tháng một lần nếu báo trước ngày hết hạn.'],
    ['Thẻ mệnh giá có dùng cho gói thành viên được không?','Được. Thẻ trừ dần vào bất kỳ liệu trình, gói hay sản phẩm nào tại Ngà.'],
    ['Có đổi thẻ ra tiền mặt không?','Không. Phần dư được giữ theo mã thẻ để dùng cho lần sau.']
  ],false);
  sync();
};

var SUM={
 'led-do-led-xanh':['LED đỏ thường dùng để làm dịu, hỗ trợ phục hồi sau các bước làm sạch.','LED xanh thường dùng trong quy trình cho da dầu, dễ nổi mụn.','Cả hai không thay thế điều trị y khoa; cần che mắt khi chiếu.'],
 'song-rf-la-gi':['RF làm ấm lớp da sâu bằng sóng điện từ, không dùng kim.','Cảm giác ấm như chườm khăn nóng; không cần nghỉ dưỡng.','Không làm khi mang thai, có máy tạo nhịp tim, kim loại cấy trong vùng mặt.'],
 'thu-tu-skincare-buoi-sang':['Sữa rửa mặt dịu, hoặc chỉ rửa nước nếu da khô.','Serum hoặc kem dưỡng, chờ thấm khoảng một phút.','Kem chống nắng là bước cuối, trước khi trang điểm.'],
 'kem-chong-nang-bao-nhieu':['Khoảng hai đốt ngón tay cho mặt và cổ.','Bôi lại sau 2–3 giờ nếu ở ngoài trời, ra mồ hôi nhiều.','Đi xe máy: thêm nón, khẩu trang chống nắng.'],
 'sau-peel-nhe':['Da căng, bong nhẹ trong 2–3 ngày là thường gặp.','Không tự bóc vảy da, không tẩy da chết, không xông hơi.','Đỏ rát kéo dài, nổi mụn nước: liên hệ chuyên viên và gặp bác sĩ.']};
NGA.pages.blog=function(){
  var st={c:'all',q:''},cats=['all'];A.forEach(function(a){if(cats.indexOf(a.c)<0)cats.push(a.c)});
  $('#ktCats').innerHTML=cats.map(function(c){return '<button class="chip" type="button" data-c="'+esc(c)+'" aria-pressed="'+(c==='all')+'">'+(c==='all'?'Tất cả':esc(c))+'</button>'}).join('');
  function item(a){if(a.full)return '<div class="kt-it">'+jrHtml(a)+'</div>';
    return '<article class="kt-it" id="bai-'+a.id+'"><div class="jr"><figure><img src="'+img(a.img,800)+'" alt="Ảnh minh hoạ bài viết: '+esc(a.t)+'" width="800" height="600" loading="lazy"></figure><span class="jr-m"><b>'+esc(a.c)+'</b><span>'+a.d+'</span><span>'+a.m+' phút đọc</span></span><h3>'+esc(a.t)+'</h3><p>'+esc(a.s)+'</p></div>'+
    '<details class="kt-sum"><summary>Xem nhanh 3 ý chính</summary><ul>'+SUM[a.id].map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ul><p class="kt-soon">Bài đầy đủ đang được chuyên viên hoàn thiện. Bài mẫu đầy đủ: <a href="'+ROOT+'kien-thuc/da-nhay-cam-mua-kho/">Da nhạy cảm mùa khô</a>.</p></details></article>'}
  function apply(){var q=fold(st.q.trim()),list=A.filter(function(a){return (st.c==='all'||a.c===st.c)&&(!q||fold(a.t+' '+a.s+' '+(SUM[a.id]||[]).join(' ')).indexOf(q)>-1)});
    $('#ktGrid').innerHTML=list.length?list.map(item).join(''):'<p class="kt-empty">Chưa có bài phù hợp. Thử từ khoá khác như “chống nắng” hoặc “LED”.</p>';
    $$('#ktCats .chip').forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-c')===st.c)})}
  $('#ktCats').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;st.c=b.getAttribute('data-c');apply()});
  $('#ktQ').addEventListener('input',function(e){st.q=e.target.value;apply()});
  apply();
  if(/^#bai-/.test(location.hash)){var t=document.getElementById(location.hash.slice(1));if(t){var d=$('details',t);if(d)d.open=true;setTimeout(function(){t.scrollIntoView({block:'center'})},100)}}
  $('#newsF').addEventListener('submit',function(e){e.preventDefault();var m=$('#nMail'),bad=fldErr(m,!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(m.value.trim())),ok=$('#nOk').checked;
    $('#nOkL').classList.toggle('err',!ok);if(bad){m.focus();return}if(!ok){$('#nOk').focus();return}
    $('#newsOk').textContent='Cảm ơn bạn! (Minh hoạ: email chưa được gửi đi đâu.)';m.value='';$('#nOk').checked=false});
};
NGA.pages.article=function(){
  var toc=$('#toc'),hs=$$('.art-body h2');
  toc.innerHTML=hs.map(function(h,i){h.id=h.id||'muc-'+(i+1);return '<li><a href="#'+h.id+'"><span class="num">'+('0'+(i+1)).slice(-2)+'</span>'+esc(h.textContent.replace(/^\d+\.\s*/,''))+'</a></li>'}).join('');
  if('IntersectionObserver' in window){var links=$$('a',toc),io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){links.forEach(function(l){l.classList.toggle('on',l.getAttribute('href')==='#'+en.target.id)})}})},{rootMargin:'-20% 0px -70% 0px'});hs.forEach(function(h){io.observe(h)})}
  var cb=$('#artCheck');if(cb){var saved=get('artChk',[]);$$('input',cb).forEach(function(c,i){c.checked=saved.indexOf(i)>-1;c.addEventListener('change',function(){var s=$$('input',cb).map(function(x,j){return x.checked?j:-1}).filter(function(j){return j>-1});set('artChk',s);$('#artChkN').textContent=s.length})});$('#artChkN').textContent=saved.length}
  var sh=$('#artShare');sh&&sh.addEventListener('click',function(){var u=location.href;if(navigator.share){navigator.share({title:document.title,url:u}).catch(function(){})}else{try{navigator.clipboard.writeText(u);toast('Đã sao chép đường dẫn bài viết')}catch(_){toast(u)}}});
  $('#artRel').innerHTML=A.filter(function(a){return !a.full}).slice(0,3).map(jrHtml).join('');
  var tr=['phuc-hoi-hang-rao-da','led-diu-da-sau-nang'];$('#artTr').innerHTML=tr.map(function(id){var t=byId(T,id);return '<a class="qr-pick" href="'+tLink(t)+'"><img src="'+img(t.img,300)+'" alt="'+esc(t.n)+'" width="88" height="72" loading="lazy"><span><b>'+nb(t.n)+'</b><small>'+t.d+' phút</small></span><span class="num">'+vnd(t.p)+'</span></a>'}).join('');
};

NGA.pages.book=function(){
  var TV={id:'tu-van',n:'Soi Da Và Tư Vấn',d:20,p:0,need:[],tech:'Đèn phóng đại',img:'1534751516642-a1af1ef26a56'};
  var LIST=[TV].concat(T),bk=get('booking',{}),step=1,need='all',dayOff=0;
  bk.first=bk.first||'moi';
  if(bk.t&&!byId(LIST,bk.t))bk.t=null;if(bk.s&&bk.s!=='any'&&!byId(S,bk.s))bk.s=null;
  if(bk.date&&bk.date<isoDate(new Date())){bk.date=null;bk.time=null}
  function save(){set('booking',bk);side()}
  function tr(){return byId(LIST,bk.t)}
  function spec(){return bk.s==='any'?{n:'Ai cũng được',days:[0,1,2,3,4,5,6]}:byId(S,bk.s)}
  function dow(d){return (d.getDay()+6)%7}
  function hash(s){var h=0;for(var i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return Math.abs(h)}
  var ICN={t:'leaf',s:'user',d:'cal',c:'phone'};
  function side(){var t=tr(),sp=bk.s?spec():null,price=t?t.p+(bk.add?250000:0):0;
    function row(k,v){return '<div><svg class="ic" aria-hidden="true"><use href="#i-'+ICN[k]+'"/></svg><dt>'+k+'</dt><dd'+(v?'':' class="empty"')+'>'+(v||'Chưa chọn')+'</dd></div>'}
    $('#bkSum').innerHTML=row('t',t?esc(t.n)+' · '+t.d+' phút'+(bk.add?'<br>+ Massage vai gáy 30 phút':''):'')+row('s',sp?esc(sp.n):'')+row('d',bk.date&&bk.time?DAYL[dow(new Date(bk.date+'T00:00'))]+', '+vnDate(bk.date)+' lúc '+bk.time:'')+row('c',bk.name?esc(bk.name)+(bk.phone?'<br>'+esc(bk.phone):''):'');
    tween($('#bkTot'),price,function(v){return t&&t.p===0&&!bk.add?'Miễn phí':vnd(v)})}
  /* bước 1 */
  var keys=['all','am','mun','sang','san','nhay','thugian'];
  $('#bkNeeds').innerHTML=keys.map(function(k){return '<button class="chip" type="button" data-k="'+k+'" aria-pressed="'+(k==='all')+'">'+(k==='all'?'Tất cả':nb(NEEDS[k]))+'</button>'}).join('');
  function drawTr(){var l=LIST.filter(function(t){return need==='all'||t.id==='tu-van'||t.need.indexOf(need)>-1});
    $('#bkTr').innerHTML=l.map(function(t){return '<label class="opt-c"><input type="radio" name="bt" value="'+t.id+'"'+(bk.t===t.id?' checked':'')+'><span><img src="'+img(t.img,200)+'" alt="" width="56" height="56" loading="lazy"><b>'+nb(t.n)+'</b><small>'+t.d+' phút · '+(t.p?vnd(t.p):'Miễn phí khi làm liệu trình')+'</small></span></label>'}).join('');
    $$('#bkNeeds .chip').forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-k')===need)})}
  $('#bkNeeds').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;need=b.getAttribute('data-k');drawTr()});
  $('#bkTr').addEventListener('change',function(e){bk.t=e.target.value;err('');save()});
  $('#bkAdd').checked=!!bk.add;$('#bkAdd').addEventListener('change',function(e){bk.add=e.target.checked;save()});
  /* bước 2 */
  function drawSp(){$('#bkSp').innerHTML='<label class="opt-c"><input type="radio" name="bs" value="any"'+(bk.s==='any'?' checked':'')+'><span><span class="ini"><svg class="ic" aria-hidden="true"><use href="#i-spark"/></svg></span><b>Ai cũng được</b><small>Ngà xếp người phù hợp, nhiều giờ trống hơn</small></span></label>'+
    S.map(function(s){return '<label class="opt-c"><input type="radio" name="bs" value="'+s.id+'"'+(bk.s===s.id?' checked':'')+'><span><img src="'+img(s.img,200)+'" alt="" width="56" height="56" loading="lazy"><b>'+nb(s.n)+'</b><small>'+esc(s.r)+'<span class="bk-wk">'+DAYS.map(function(d,i){return '<i class="'+(s.days.indexOf(i)>-1?'on':'')+'">'+d+'</i>'}).join('')+'</span></small></span></label>'}).join('')}
  $('#bkSp').addEventListener('change',function(e){bk.s=e.target.value;var sp=spec();if(bk.date&&sp.days.indexOf(dow(new Date(bk.date+'T00:00')))<0){bk.date=null;bk.time=null}err('');save()});
  /* bước 3 */
  function drawDays(){var sp=spec()||{days:[0,1,2,3,4,5,6]},out='',d0=new Date();d0.setHours(0,0,0,0);
    for(var i=0;i<14;i++){var d=new Date(d0);d.setDate(d0.getDate()+i);var iso=isoDate(d),off=sp.days.indexOf(dow(d))<0;
      out+='<button type="button" role="radio" data-d="'+iso+'" aria-checked="'+(bk.date===iso)+'"'+(off?' disabled':'')+' aria-label="'+DAYL[dow(d)]+' '+vnDate(iso)+(off?', nghỉ':'')+'"><span>'+(i===0?'Hôm nay':DAYS[dow(d)])+'</span><b class="num">'+d.getDate()+'</b><span>Th'+(d.getMonth()+1)+'</span></button>'}
    $('#bkDays').innerHTML=out;$('#bkDaySub').textContent=bk.s&&bk.s!=='any'?'14 ngày tới. Ngày mờ là ngày '+spec().n+' nghỉ.':'14 ngày tới, chọn ngày bạn rảnh.';drawSlots()}
  function drawSlots(){var box=$('#bkSlots');if(!bk.date){$('#bkDayL').textContent='Chọn một ngày';box.innerHTML='<p class="none">Chọn ngày ở trên để xem giờ còn trống.</p>';return}
    var t=tr(),dur=t?t.d+(bk.add?30:0):60,now=new Date(),isToday=bk.date===isoDate(now),out=[],free=0;
    for(var m=9*60;m+dur<=21*60&&m<=19*60+30;m+=30){var hh=('0'+Math.floor(m/60)).slice(-2)+':'+('0'+m%60).slice(-2),past=isToday&&m<=now.getHours()*60+now.getMinutes()+60,full=hash(bk.date+hh+(bk.s||''))%4===0,dis=past||full;if(!dis)free++;
      out.push('<button type="button" role="radio" data-t="'+hh+'" aria-checked="'+(bk.time===hh)+'"'+(dis?' disabled aria-label="'+hh+', '+(past?'đã qua':'đã kín')+'"':'')+'>'+hh+'</button>')}
    $('#bkDayL').textContent=DAYL[dow(new Date(bk.date+'T00:00'))]+', '+vnDate(bk.date)+' · còn '+free+' khung giờ';
    box.innerHTML=free?out.join(''):'<p class="none">Ngày này đã kín. Bạn thử ngày khác nhé.</p>'}
  $('#bkDays').addEventListener('click',function(e){var b=e.target.closest('button');if(!b||b.disabled)return;bk.date=b.getAttribute('data-d');bk.time=null;$$('#bkDays button').forEach(function(x){x.setAttribute('aria-checked',x===b)});drawSlots();err('');save()});
  $('#bkSlots').addEventListener('click',function(e){var b=e.target.closest('button');if(!b||b.disabled)return;bk.time=b.getAttribute('data-t');$$('#bkSlots button').forEach(function(x){x.setAttribute('aria-checked',x===b)});err('');save()});
  $('#dPrev').addEventListener('click',function(){$('#bkDays').scrollLeft-=228});$('#dNext').addEventListener('click',function(){$('#bkDays').scrollLeft+=228});
  /* bước 4 */
  var F={bName:'name',bPhone:'phone',bMail:'mail',bNote:'note'};
  Object.keys(F).forEach(function(id){var el=$('#'+id);el.value=bk[F[id]]||'';el.addEventListener('input',function(){bk[F[id]]=el.value;if(el.closest('.fld').classList.contains('err'))check4(id);save()});el.addEventListener('blur',function(){if(el.value)check4(id)})});
  $$('#bFirst button').forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-v')===bk.first)});
  $('#bFirst').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;bk.first=b.getAttribute('data-v');$$('#bFirst button').forEach(function(x){x.setAttribute('aria-pressed',x===b)});save()});
  function check4(only){var bad=[];
    if((!only||only==='bName')&&fldErr($('#bName'),$('#bName').value.trim().length<2))bad.push($('#bName'));
    if((!only||only==='bPhone')&&fldErr($('#bPhone'),!phoneOk($('#bPhone').value)))bad.push($('#bPhone'));
    if((!only||only==='bMail')&&fldErr($('#bMail'),!!$('#bMail').value.trim()&&!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test($('#bMail').value.trim())))bad.push($('#bMail'));
    if(!only){var ok=$('#bOk').checked;$('#bOkL').classList.toggle('err',!ok);if(!ok)bad.push($('#bOk'))}return bad}
  /* bước 5 */
  function review(){var t=tr(),sp=spec();
    function r(k,v,s){return '<div><dt>'+k+'</dt><dd>'+v+'</dd><button type="button" data-go="'+s+'">Sửa</button></div>'}
    $('#bkRev').innerHTML=r('Liệu trình',esc(t.n)+' · '+t.d+' phút'+(bk.add?' + massage vai gáy':''),1)+r('Chuyên viên',esc(sp.n),2)+r('Thời gian',DAYL[dow(new Date(bk.date+'T00:00'))]+', '+vnDate(bk.date)+' lúc '+bk.time,3)+r('Liên hệ',esc(bk.name)+' · '+esc(bk.phone)+(bk.mail?' · '+esc(bk.mail):''),4)+r('Lần đến',bk.first==='moi'?'Lần đầu (có soi da 10–15 phút)':'Đã từng đến',4)+(bk.note?r('Ghi chú',esc(bk.note),4):'')+'<div><dt>Tạm tính</dt><dd>'+(t.p+(bk.add?250000:0)?vnd(t.p+(bk.add?250000:0)):'Miễn phí')+'</dd><span></span></div>'}
  $('#bkRev').addEventListener('click',function(e){var b=e.target.closest('[data-go]');if(b)go(+b.getAttribute('data-go'))});
  /* điều hướng */
  function err(m){$('#bkErr').textContent=m}
  function valid(s){if(s===1&&!bk.t)return 'Bạn chọn một liệu trình để tiếp tục nhé.';if(s===2&&!bk.s)return 'Bạn chọn chuyên viên, hoặc “Ai cũng được”.';if(s===3&&!(bk.date&&bk.time))return bk.date?'Bạn chọn một khung giờ còn trống.':'Bạn chọn ngày và giờ hẹn.';
    if(s===4){var b=check4();if(b.length){b[0].focus();return 'Còn '+b.length+' mục cần kiểm tra lại.'}}return ''}
  function maxOk(){for(var s=1;s<=4;s++)if(valid2(s))return s;return 5}
  function valid2(s){if(s===4)return !(bk.name&&bk.name.trim().length>=2&&phoneOk(bk.phone||'')&&$('#bOk').checked);return !!valid(s)}
  function go(s,focus){step=s;$$('.bk-pane').forEach(function(p){p.hidden=+p.getAttribute('data-p')!==s});err('');
    var mx=maxOk();$$('#bkSteps button').forEach(function(b){var n=+b.getAttribute('data-s');b.classList.toggle('done',n<s||n<mx);if(n===s)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');b.disabled=n>mx&&n>s});
    if(s===1)drawTr();if(s===2)drawSp();if(s===3)drawDays();if(s===5)review();
    $('#bkBack').style.visibility=s===1?'hidden':'visible';$('#bkNext').querySelector('span').textContent=s===5?'Gửi yêu cầu đặt lịch':s===4?'Xem lại':'Tiếp tục';
    bk.step=s;save();if(focus!==false){var h=$('.bk-pane:not([hidden]) .bk-t');var top=$('#bkSteps').getBoundingClientRect().top;if(top<0||top>innerHeight*.6)$('#bkSteps').scrollIntoView({behavior:RM?'auto':'smooth',block:'start'})}}
  $('#bkSteps').addEventListener('click',function(e){var b=e.target.closest('button');if(b&&!b.disabled)go(+b.getAttribute('data-s'))});
  $('#bkBack').addEventListener('click',function(){if(step>1)go(step-1)});
  $('#bkForm').addEventListener('submit',function(e){e.preventDefault();var m=valid(step);if(m){err(m);return}if(step<5){go(step+1);return}done()});
  $('#bkClear').addEventListener('click',function(){bk={first:'moi'};set('booking',bk);Object.keys(F).forEach(function(id){$('#'+id).value=''});$('#bOk').checked=false;$('#bkAdd').checked=false;go(1);toast('Đã xoá lựa chọn')});
  function done(){var c=code('NGA-'),t=tr(),sp=spec();$('#bkForm').hidden=true;$('#bkSteps').hidden=true;var d=$('#bkDone');d.hidden=false;
    d.innerHTML='<div class="ok"><svg class="ic" aria-hidden="true"><use href="#i-check"/></svg></div><h2>Đã nhận yêu cầu đặt&nbsp;lịch</h2><p>Cảm ơn '+esc(bk.name)+'. Ngà sẽ gọi hoặc nhắn Zalo số '+esc(bk.phone)+' để xác nhận trong vòng 30 phút (giờ làm việc).</p>'+
    '<div class="code"><span>Mã lịch hẹn minh hoạ</span><b class="num">'+c+'</b><button class="btn btn-w btn-s" type="button" id="bkCopy"><svg class="ic" aria-hidden="true"><use href="#i-copy"/></svg><span>Sao chép</span></button></div>'+
    '<ul><li><svg class="ic" aria-hidden="true"><use href="#i-leaf"/></svg><span>'+esc(t.n)+' · '+t.d+' phút với '+esc(sp.n)+'</span></li><li><svg class="ic" aria-hidden="true"><use href="#i-cal"/></svg><span>'+DAYL[dow(new Date(bk.date+'T00:00'))]+', '+vnDate(bk.date)+' lúc '+bk.time+'</span></li><li><svg class="ic" aria-hidden="true"><use href="#i-pin"/></svg><span>48 Trần Quốc Thảo, Phường Xuân Hoà, TP.HCM. Đến sớm 10 phút để uống trà và điền phiếu.</span></li></ul>'+
    '<p class="bk-sub">Đây là mẫu giao diện: yêu cầu không được gửi đi đâu.</p><div class="acts"><button class="btn btn-o" type="button" id="bkPrint"><svg class="ic" aria-hidden="true"><use href="#i-print"/></svg><span>In phiếu hẹn</span></button><a class="btn btn-p" href="'+ROOT+'kien-thuc/da-nhay-cam-mua-kho/">Đọc trước khi đến</a></div>';
    d.focus();$('#bkCopy').addEventListener('click',function(){try{navigator.clipboard.writeText(c);toast('Đã sao chép mã '+c)}catch(_){toast(c)}});$('#bkPrint').addEventListener('click',function(){print()});
    set('booking',{first:'moi'});$$('[data-bookdot]').forEach(function(e){e.hidden=true})}
  side();
  var start=Math.min(bk.step||1,maxOk());if(bk.t&&!bk.step)start=Math.min(2,maxOk());go(start,false);
};

NGA.pages.contact=function(){
  var W={xe:['Đi vào hẻm 48 Trần Quốc Thảo, cửa gỗ màu kem bên tay phải.','Gửi xe máy miễn phí ngay trước cửa, bảo vệ dắt xe giúp.','Từ Hồ Con Rùa khoảng 5 phút.'],oto:['Ô tô không vào được hẻm. Gửi tại bãi xe gần đó, khoảng 3 phút đi bộ.','Gọi lễ tân khi tới bãi, Ngà ra đón nếu trời mưa.','Phí gửi xe theo bảng giá của bãi.'],grab:['Đặt điểm đến “Ngà Skin Atelier, hẻm 48 Trần Quốc Thảo”.','Xe máy công nghệ vào tận cửa; ô tô dừng đầu hẻm.','Đến sớm 10 phút để uống trà và điền phiếu.']};
  function way(k){$('#wayP').innerHTML='<ul>'+W[k].map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ul>';$('#wayP').style.animation='none';void $('#wayP').offsetWidth;$('#wayP').style.animation='';
    $$('#wayTabs button').forEach(function(b){var on=b.getAttribute('data-w')===k;b.setAttribute('aria-selected',on);b.setAttribute('aria-pressed',on)})}
  $('#wayTabs').addEventListener('click',function(e){var b=e.target.closest('button');if(b)way(b.getAttribute('data-w'))});way('xe');
  /* hỏi đáp */
  var list=$('#faqList');
  function drawFaq(q){q=fold(q.trim());var items=FAQ.filter(function(f){return !q||fold(f[0]+' '+f[1]).indexOf(q)>-1});
    list.innerHTML=items.length?faqHtml(items,!!q||true):'<p class="kt-empty">Chưa thấy câu hỏi này. Gửi cho Ngà ở mẫu phía trên nhé.</p>';
    if(q)$$('details',list).forEach(function(d){d.open=true});tween($('#faqN'),items.length,function(v){return Math.round(v)})}
  $('#faqQ').addEventListener('input',function(e){drawFaq(e.target.value)});drawFaq('');
  /* chính sách */
  var tabs=$$('#polTabs button');
  function pol(i){tabs.forEach(function(b,j){b.setAttribute('aria-selected',j===i);b.tabIndex=j===i?0:-1;$('#'+b.getAttribute('aria-controls')).hidden=j!==i})}
  tabs.forEach(function(b,i){b.addEventListener('click',function(){pol(i)})});
  $('#polTabs').addEventListener('keydown',function(e){var k=e.key,i=tabs.indexOf(document.activeElement);if(i<0||['ArrowDown','ArrowUp','ArrowLeft','ArrowRight'].indexOf(k)<0)return;e.preventDefault();i=(i+(k==='ArrowDown'||k==='ArrowRight'?1:-1)+tabs.length)%tabs.length;tabs[i].focus();pol(i)});
  /* form */
  var topic=new URLSearchParams(location.search).get('chu-de');if(topic&&$('#cTopic option[value="'+topic+'"]'))$('#cTopic').value=topic;
  ['#cName','#cPhone','#cMsg'].forEach(function(s){$(s).addEventListener('input',function(){if($(s).closest('.fld').classList.contains('err'))chk()})});
  function chk(){var bad=[];if(fldErr($('#cName'),$('#cName').value.trim().length<2))bad.push($('#cName'));if(fldErr($('#cPhone'),!phoneOk($('#cPhone').value)))bad.push($('#cPhone'));if(fldErr($('#cMsg'),$('#cMsg').value.trim().length<10))bad.push($('#cMsg'));return bad}
  $('#ctForm').addEventListener('submit',function(e){e.preventDefault();var bad=chk(),ok=$('#cOk').checked;$('#cOkL').classList.toggle('err',!ok);if(!ok)bad.push($('#cOk'));
    if(bad.length){bad[0].focus();$('#ctOk').textContent='';return}
    $('#ctOk').textContent='Đã nhận câu hỏi, mã '+code('HD-')+'. Ngà sẽ trả lời trong 1 ngày làm việc. (Minh hoạ: chưa gửi đi đâu.)';this.reset()});
  if(location.hash==='#chinh-sach'||location.hash==='#hoi-dap'||location.hash==='#lien-he-form'){var t=$(location.hash);setTimeout(function(){t.scrollIntoView()},120)}
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
