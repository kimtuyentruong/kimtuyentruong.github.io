/* Tọa Độ Legal — mẫu giao diện. JS dùng chung + chức năng riêng từng trang (theo body[data-page]). */
(function(){
'use strict';
var root=document.documentElement,body=document.body,STATIC=root.classList.contains('static');
var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function $(s,c){return (c||document).querySelector(s)}
function $$(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))}
function money(n){return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g,'.')+'đ'}
function pad(n){return (n<10?'0':'')+n}
function dmy(d){return pad(d.getDate())+'/'+pad(d.getMonth()+1)+'/'+d.getFullYear()}
function my(d){return pad(d.getMonth()+1)+'/'+d.getFullYear()}
function addM(d,m){var x=new Date(d.getTime());var day=x.getDate();x.setDate(1);x.setMonth(x.getMonth()+m);var last=new Date(x.getFullYear(),x.getMonth()+1,0).getDate();x.setDate(Math.min(day,last));return x}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function ico(id,cls){return '<svg class="ic'+(cls?' '+cls:'')+'" aria-hidden="true"><use href="#i-'+id+'"/></svg>'}
function tween(el,to,fmt,dur){fmt=fmt||function(v){return Math.round(v)};var from=+(el.getAttribute('data-v')||0);el.setAttribute('data-v',to);if(RM||STATIC||document.hidden||from===to){el.textContent=fmt(to);return}var t0=null;dur=dur||600;clearTimeout(el._tt);el._tt=setTimeout(function(){if(el.getAttribute('data-v')==to)el.textContent=fmt(to)},dur+120);function f(t){if(!t0)t0=t;var p=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-p,3);el.textContent=fmt(from+(to-from)*e);if(p<1)requestAnimationFrame(f)}requestAnimationFrame(f)}
var toastEl=$('#toast'),toastT;
function toast(m){if(!toastEl)return;toastEl.textContent=m;toastEl.classList.add('show');clearTimeout(toastT);toastT=setTimeout(function(){toastEl.classList.remove('show')},2600)}
function store(k,v){try{if(v===undefined)return JSON.parse(localStorage.getItem('luat3:'+k));localStorage.setItem('luat3:'+k,JSON.stringify(v))}catch(e){return null}}

/* ---------- Header, badge, lên đầu trang ---------- */
var hdr=$('#hdr'),badge=$('#ktBadge'),top=$('#toTop'),ticking=false;
function onScroll(){var y=window.pageYOffset;if(hdr)hdr.classList.toggle('scrolled',y>8);if(badge)badge.classList.toggle('show',y>window.innerHeight*.85);if(top)top.classList.toggle('show',y>window.innerHeight*1.4);ticking=false;if(window.__onScroll)window.__onScroll(y)}
window.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});onScroll();
if(top)top.addEventListener('click',function(){window.scrollTo({top:0,behavior:RM?'auto':'smooth'})});

/* ---------- Menu mobile ---------- */
var mb=$('#mBtn'),mnav=$('#mNav'),mc=$('#mClose');
function lock(on){body.classList.toggle('lock',on)}
function menu(open){if(!mnav)return;mnav.classList.toggle('open',open);mnav.setAttribute('aria-hidden',open?'false':'true');mb.setAttribute('aria-expanded',open?'true':'false');lock(open);if(open){mnav.removeAttribute('inert');setTimeout(function(){mc.focus()},30)}else{mnav.setAttribute('inert','');mb.focus()}}
if(mb&&mnav){mnav.setAttribute('inert','');mb.addEventListener('click',function(){menu(true)});mc.addEventListener('click',function(){menu(false)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&mnav.classList.contains('open'))menu(false)});
  $$('a',mnav).forEach(function(a){a.addEventListener('click',function(){mnav.classList.remove('open');mnav.setAttribute('inert','');mb.setAttribute('aria-expanded','false');lock(false)})});
  var lw=window.innerWidth;window.addEventListener('resize',function(){if(window.innerWidth!==lw){lw=window.innerWidth;if(lw>1024&&mnav.classList.contains('open'))menu(false)}});}

/* ---------- Hiện dần ---------- */
var rvs=$$('.rv');
if(STATIC||RM||!('IntersectionObserver' in window)){rvs.forEach(function(e){e.classList.add('in')})}
else{var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:.08});
  rvs.forEach(function(e){var r=e.getBoundingClientRect();if(r.top<window.innerHeight*.98)e.classList.add('in');else io.observe(e)})}

/* đếm số */
var cnts=$$('[data-count]');
function runCount(el){tween(el,+el.getAttribute('data-count'),null,1100)}
if(cnts.length){if(STATIC||RM||!('IntersectionObserver' in window))cnts.forEach(function(e){e.textContent=e.getAttribute('data-count')});
  else{var cio=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){runCount(en.target);cio.unobserve(en.target)}})},{threshold:.4});cnts.forEach(function(e){e.textContent='0';cio.observe(e)})}}

/* FAQ: mở một câu thì đóng câu khác cùng nhóm */
$$('.faq').forEach(function(g){$$('details',g).forEach(function(d){d.addEventListener('toggle',function(){if(d.open)$$('details',g).forEach(function(o){if(o!==d)o.open=false})})})});

/* năm hiện tại */
$$('[data-year]').forEach(function(e){e.textContent=new Date().getFullYear()});

/* ---------- Dữ liệu phí mẫu dùng chung ---------- */
var PLANS={
  co_ban:{name:'Cơ bản',per:1200000,desc:'Tra cứu sơ bộ, soạn và nộp đơn'},
  startup:{name:'Startup',per:1900000,desc:'Thêm tra cứu chuyên sâu, theo dõi đơn'},
  tron_goi:{name:'Đồng hành',per:2900000,desc:'Thêm trả lời thông báo thẩm định 1 lần'}
};
var DISC=.2;                 /* nhóm thứ 2 trở đi giảm 20% phí dịch vụ (mẫu) */
var GOV={base:150000,perGroup:1090000,extraItem:150000}; /* lệ phí nhà nước ước tính (mẫu) */
function svcFee(plan,n){var p=PLANS[plan].per;return p+Math.max(0,n-1)*p*(1-DISC)}
function govFee(n,items){return GOV.base+n*GOV.perGroup+n*Math.max(0,items-6)*GOV.extraItem}

var page=body.getAttribute('data-page');

/* =================== TRANG CHỦ =================== */
if(page==='home'){
  var qf=$('#qForm');
  if(qf)qf.addEventListener('submit',function(e){e.preventDefault();var v=$('#qName').value.trim();if(!v){$('#qName').focus();toast('Nhập tên thương hiệu bạn muốn kiểm tra');return}location.href='cong-cu/?q='+encodeURIComponent(v)+'#kiem-tra'});
  var bar=$('#heroBar');if(bar)setTimeout(function(){bar.style.width='72%'},STATIC?0:900);
  var STG={
    ten:{t:'Mới chốt tên thương hiệu',r:2,p:'Tên chưa đăng ký thì người nộp đơn trước có quyền ưu tiên. Việc đầu tiên là tra cứu và nộp đơn sớm, trước khi in bao bì hay làm biển hiệu.',l:['Tra cứu sơ bộ tên và logo trong nhóm sản phẩm định kinh doanh','Chọn đúng nhóm hàng hoá, dịch vụ theo Bảng phân loại Nice','Nộp đơn đăng ký nhãn hiệu để có ngày ưu tiên'],a:['cong-cu/#kiem-tra','Kiểm tra tên ngay']},
    app:{t:'Sắp ra mắt app hoặc phần mềm',r:3,p:'Mã nguồn do ai viết thì thuộc về ai? Điều khoản sử dụng và chính sách quyền riêng tư đã khớp luật chưa? Đây là lúc dễ sửa nhất.',l:['Rà hợp đồng với lập trình viên, freelancer về chuyển giao quyền','Đăng ký quyền tác giả cho chương trình máy tính','Soạn điều khoản sử dụng, chính sách quyền riêng tư cho app'],a:['dich-vu/#hop-dong','Xem dịch vụ hợp đồng']},
    von:{t:'Chuẩn bị gọi vốn',r:4,p:'Nhà đầu tư sẽ hỏi tài sản trí tuệ đứng tên ai, dữ liệu khách hàng được xử lý ra sao. Chuẩn bị bộ hồ sơ trước sẽ đỡ mất thời gian thẩm định.',l:['Kiểm kê tài sản trí tuệ: nhãn hiệu, bản quyền, tên miền','Chuyển quyền sở hữu về đúng pháp nhân của công ty','Rà soát mức tuân thủ bảo vệ dữ liệu cá nhân'],a:['kien-thuc/','Đọc hướng dẫn dữ liệu cá nhân']},
    nhai:{t:'Phát hiện bị dùng tên giống mình',r:5,p:'Đừng vội đăng bài tố cáo. Cần xác định ai có quyền trước, thu thập chứng cứ, rồi mới chọn cách xử lý phù hợp.',l:['Kiểm tra tình trạng đơn, văn bằng của hai bên','Lập vi bằng, lưu chứng cứ sử dụng','Gửi văn bản yêu cầu chấm dứt hoặc phản đối đơn'],a:['lien-he/','Đặt lịch trao đổi']}
  };
  var tabs=$$('.stage-tab'),pan=$('#stagePanel');
  function showStage(k,focus){var s=STG[k];if(!s||!pan)return;tabs.forEach(function(t){var on=t.getAttribute('data-k')===k;t.setAttribute('aria-selected',on?'true':'false');t.tabIndex=on?0:-1;if(on&&focus)t.focus()});
    var risk='';for(var i=1;i<=5;i++)risk+='<span class="'+(i<=s.r?'on':'')+'"></span>';
    pan.querySelector('.inner').innerHTML='<div class="fade"><span class="tag tag-d">Gợi ý cho bạn</span><h3 class="h-sm">'+s.t+'</h3><div class="stage-risk">Mức cần xử lý sớm <i aria-hidden="true">'+risk+'</i><span class="sr">'+s.r+' trên 5</span></div><p style="margin-top:16px">'+s.p+'</p><ul class="chk">'+s.l.map(function(x){return '<li>'+ico('check')+'<span>'+x+'</span></li>'}).join('')+'</ul><a class="btn btn-w" href="'+s.a[0]+'">'+s.a[1]+ico('arrow-r')+'</a></div>'}
  tabs.forEach(function(t,i){t.addEventListener('click',function(){showStage(t.getAttribute('data-k'))});
    t.addEventListener('keydown',function(e){var k=e.key,j=-1;if(k==='ArrowDown'||k==='ArrowRight')j=(i+1)%tabs.length;if(k==='ArrowUp'||k==='ArrowLeft')j=(i-1+tabs.length)%tabs.length;if(j>-1){e.preventDefault();showStage(tabs[j].getAttribute('data-k'),true)}})});
  showStage('ten');
}

/* =================== DỊCH VỤ =================== */
if(page==='dv'){
  var n=1,out=$('#grpOut'),dn=$('#grpDn'),up=$('#grpUp');
  function renderPlans(){out.innerHTML='<span class="num">'+n+'</span> nhóm';dn.disabled=n<=1;up.disabled=n>=10;
    $$('[data-plan]').forEach(function(card){var k=card.getAttribute('data-plan');tween(card.querySelector('.pv'),svcFee(k,n),money,500);card.querySelector('.pn').textContent=n>1?'Cho '+n+' nhóm, đã giảm 20% từ nhóm thứ 2':'Cho 1 nhóm hàng hoá, dịch vụ'});
    $$('[data-plan] .btn').forEach(function(b){b.href='../lien-he/?dv=nhan-hieu&goi='+b.closest('[data-plan]').getAttribute('data-plan')+'&nhom='+n})}
  if(out){dn.addEventListener('click',function(){if(n>1){n--;renderPlans()}});up.addEventListener('click',function(){if(n<10){n++;renderPlans()}});renderPlans()}
  /* lọc nhóm Nice theo lĩnh vực */
  var tbl=$('#niceTbl'),fch=$$('#niceF .chip'),nOut=$('#niceHint');
  function filt(k){fch.forEach(function(c){c.setAttribute('aria-pressed',c.getAttribute('data-f')===k?'true':'false')});
    var cnt=0,list=[];$$('tbody tr',tbl).forEach(function(tr){var on=k!=='all'&&(' '+tr.getAttribute('data-f')+' ').indexOf(' '+k+' ')>-1;tr.classList.toggle('hit',on);tr.classList.toggle('dim',k!=='all'&&!on);if(on){cnt++;list.push(tr.querySelector('.cl').textContent)}});
    tbl.classList.toggle('filtering',k!=='all');
    nOut.innerHTML=k==='all'?'Chọn lĩnh vực để xem các nhóm thường đăng ký.':'Gợi ý <b>'+cnt+' nhóm</b>: '+list.join(', ')+'. Phí dịch vụ gói Startup cho '+cnt+' nhóm (mẫu): <b class="num">'+money(svcFee('startup',cnt))+'</b>.'}
  fch.forEach(function(c){c.addEventListener('click',function(){filt(c.getAttribute('data-f'))})});
  if(tbl)filt('all');
}

/* =================== CÔNG CỤ =================== */
if(page==='cc'){
  /* Danh sách nhãn hiệu MẪU, tự đặt để minh hoạ. Không phải dữ liệu của Cục Sở hữu trí tuệ. */
  var DB=[['MÂY XANH',[29,30,43],'Đã cấp văn bằng'],['MAYXANH TECH',[9,42],'Đang thẩm định'],['NEXORA',[9,35,42],'Đã cấp văn bằng'],['NEXA HOME',[11,20],'Đang thẩm định'],['TAPTAP',[9,41],'Đã cấp văn bằng'],['TAP TAP GO',[39],'Đang thẩm định'],['BẾP NHÀ MÌNH',[29,30,43],'Đã cấp văn bằng'],['LUMIO',[9,11],'Đã cấp văn bằng'],['LUMIOS LEARN',[41],'Đang thẩm định'],['ZENTRA',[36,42],'Đã cấp văn bằng'],['KAFE GÓC',[30,43],'Đang thẩm định'],['CAFE GOC PHO',[43],'Đã cấp văn bằng'],['SEN VÀNG',[3,44],'Đã cấp văn bằng'],['SAOMAI EDU',[41],'Đã cấp văn bằng'],['SAO MAI',[16,41],'Đang thẩm định'],['HAPPI PAY',[9,36],'Đang thẩm định'],['HAPPY PAYS',[36],'Đã cấp văn bằng'],['VIETFIX',[37],'Đã cấp văn bằng'],['ORBITA',[9,38,42],'Đang thẩm định'],['MINTY',[3,5],'Đã cấp văn bằng'],['MINTI KIDS',[25,28],'Đang thẩm định'],['BOOKO',[35,41],'Đã cấp văn bằng'],['GIAO NHANH 24',[39],'Đã cấp văn bằng'],['HANA FARM',[29,31],'Đang thẩm định'],['HANAH',[3],'Đã cấp văn bằng'],['CODEMOC',[41,42],'Đã cấp văn bằng'],['COMOC',[25],'Đang thẩm định'],['TÍM LAB',[3,44],'Đã cấp văn bằng'],['KIWIO',[9,35],'Đang thẩm định'],['FINORA',[36,42],'Đã cấp văn bằng'],['PHỐ ĐI BỘ',[43],'Đã cấp văn bằng'],['AN NHIÊN',[3,44],'Đang thẩm định'],['ANNHIEN TEA',[30],'Đã cấp văn bằng'],['DATAVIET',[42],'Đã cấp văn bằng'],['VNDATA SAFE',[42,45],'Đang thẩm định'],['ECOLA',[3,21],'Đã cấp văn bằng'],['MƯA HẠ',[25,35],'Đang thẩm định'],['LOTUSI',[29,30],'Đã cấp văn bằng'],['TOMO',[9,28],'Đã cấp văn bằng'],['BEEPI',[9,35,39],'Đang thẩm định']];
  var GEN=['app','shop','store','food','cafe','coffee','spa','tech','online','viet','vietnam','pro','group','company','cong ty','store'];
  function norm(s){return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/đ/g,'d').replace(/[^a-z0-9]/g,'')}
  function phon(s){return s.replace(/ph/g,'f').replace(/[ckq]/g,'k').replace(/y/g,'i').replace(/gi|z|j/g,'d').replace(/s|x/g,'s').replace(/w/g,'v').replace(/(.)\1+/g,'$1').replace(/h(?=[^aeiou]|$)/g,'')}
  function lev(a,b){var m=a.length,n2=b.length,d=[],i,j;if(!m)return n2;if(!n2)return m;for(i=0;i<=m;i++){d[i]=[i]}for(j=1;j<=n2;j++)d[0][j]=j;for(i=1;i<=m;i++)for(j=1;j<=n2;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));return d[m][n2]}
  function sim(a,b){var A=norm(a),B=norm(b);if(!A||!B)return 0;if(A===B)return 1;var s1=1-lev(A,B)/Math.max(A.length,B.length);var pa=phon(A),pb=phon(B);var s2=1-lev(pa,pb)/Math.max(pa.length,pb.length);var s3=0;var sh=A.length<B.length?A:B,lo=A.length<B.length?B:A;if(sh.length>=4&&lo.indexOf(sh)>-1)s3=.84;if(pa===pb)s2=.95;return Math.max(s1,s2*.97,s3)}
  var sel={},grpBtns=$$('#grpChips .chip'),nmIn=$('#tmName'),outBox=$('#tmOut'),scan=$('#scan');
  grpBtns.forEach(function(b){b.addEventListener('click',function(){var g=+b.getAttribute('data-g');sel[g]=!sel[g];b.setAttribute('aria-pressed',sel[g]?'true':'false');syncEst()})});
  function selected(){return Object.keys(sel).filter(function(k){return sel[k]}).map(Number)}
  function check(){var v=nmIn.value.trim(),f=nmIn.closest('.fld');if(v.length<2){f.classList.add('err');nmIn.setAttribute('aria-invalid','true');nmIn.focus();return}
    f.classList.remove('err');nmIn.removeAttribute('aria-invalid');
    var gs=selected(),res=[];DB.forEach(function(r){var s=sim(v,r[0]);if(s<.55)return;var ov=gs.length?r[1].filter(function(g){return gs.indexOf(g)>-1}):r[1];res.push({n:r[0],g:r[1],st:r[2],s:s,ov:ov.length>0})});
    res.sort(function(a,b){return (b.ov-a.ov)||(b.s-a.s)});res=res.slice(0,5);
    var top=res.filter(function(r){return r.ov})[0],gen=GEN.indexOf(norm(v))>-1||norm(v).length<3;
    var cls,ttl,txt,ic;
    if(top&&top.s>=.8){cls='bad';ic='alert';ttl='Có thể trùng';txt='Có nhãn hiệu rất giống trong cùng nhóm bạn chọn. Nên tra cứu chuyên sâu trước khi nộp đơn.'}
    else if(top&&top.s>=.62){cls='warn';ic='info';ttl='Có điểm tương tự';txt='Có tên gần giống về cách viết hoặc cách đọc. Cần luật sư đánh giá thêm.'}
    else{cls='ok';ic='check';ttl='Chưa thấy trùng';txt='Không thấy tên giống trong danh sách mẫu'+(gs.length?' ở nhóm '+gs.join(', '):'')+'. Kết quả thật cần tra trên cơ sở dữ liệu chính thức.'}
    if(gen&&cls==='ok'){cls='warn';ic='info';ttl='Tên khó bảo hộ';txt='Tên chỉ gồm từ chung, mô tả sản phẩm thường thiếu khả năng phân biệt. Nên thêm yếu tố riêng.'}
    var h='<div class="res-st '+cls+'"><span class="ico-b">'+ico(ic)+'</span><div><b>'+ttl+'</b><span>'+txt+'</span></div></div>';
    h+=res.length?'<p class="small muted" style="margin:0 0 10px">Tên gần giống trong danh sách mẫu ('+res.length+'):</p><ul class="res-list">'+res.map(function(r,i){var pc=Math.round(r.s*100);return '<li style="animation-delay:'+(i*.06)+'s"><span class="mk">'+esc(r.n)+'</span><span class="sc num">'+pc+'%</span><span class="meter"><i style="width:'+pc+'%;background:'+(r.ov&&r.s>=.8?'#B91C1C':r.ov?'#D97706':'#A8A29B')+'"></i></span><span class="meta">Nhóm '+r.g.join(', ')+' · '+r.st+' (mẫu)'+(r.ov?'':' · khác nhóm bạn chọn')+'</span></li>'}).join('')+'</ul>':'<p class="small muted">Không có tên nào trong danh sách mẫu giống từ 55% trở lên.</p>';
    h+='<p class="small muted" style="margin:16px 0 0">Minh hoạ: so trên '+DB.length+' tên mẫu tự đặt, không phải dữ liệu của Cục Sở hữu trí tuệ.</p>';
    outBox.innerHTML=h;outBox.setAttribute('tabindex','-1');
    if(scan){scan.classList.remove('go');void scan.offsetWidth;scan.classList.add('go')}
    store('last',{n:v,g:gs});
    if(window.innerWidth<1024)outBox.scrollIntoView({behavior:RM?'auto':'smooth',block:'start'})}
  $('#tmForm').addEventListener('submit',function(e){e.preventDefault();check()});
  $$('.ex button').forEach(function(b){b.addEventListener('click',function(){nmIn.value=b.textContent;check()})});
  nmIn.addEventListener('input',function(){nmIn.closest('.fld').classList.remove('err');nmIn.removeAttribute('aria-invalid')});
  var q=new URLSearchParams(location.search).get('q');if(q){nmIn.value=q.slice(0,60);check()}
  /* ước tính phí */
  var rg=$('#estN'),it=$('#estI'),plan='startup',syncing=false;
  function est(){var n=+rg.value,items=+it.value;$('#estNv').textContent=n+' nhóm';$('#estIv').textContent=items+' sản phẩm/dịch vụ mỗi nhóm';
    var s=svcFee(plan,n),g=govFee(n,items);tween($('#bSvc'),s,money);tween($('#bGov'),g,money);tween($('#bTot'),s+g,money,700);
    $('#bPlan').textContent='Phí dịch vụ gói '+PLANS[plan].name+' ('+n+' nhóm)';$('#bExtra').textContent=items>6?'Gồm phụ phí '+(items-6)+' sản phẩm vượt mức 6 mỗi nhóm':'Mỗi nhóm tối đa 6 sản phẩm, chưa phát sinh phụ phí';
    $('#estGo').href='../lien-he/?dv=nhan-hieu&goi='+plan+'&nhom='+n}
  function syncEst(){var k=selected().length;if(k&&!syncing){rg.value=Math.min(10,k);est()}}
  rg.addEventListener('input',est);it.addEventListener('input',est);
  $$('#estPlan button').forEach(function(b){b.addEventListener('click',function(){plan=b.getAttribute('data-p');$$('#estPlan button').forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});est()})});
  est();
}

/* =================== QUY TRÌNH =================== */
if(page==='qt'){
  var di=$('#fileDate'),today=new Date();
  di.value=today.getFullYear()+'-'+pad(today.getMonth()+1)+'-'+pad(today.getDate());
  var M=[[0,'d'],[0,'d'],[1,'d'],[3,'d'],[12,'m'],[13,'m'],[14,'r'],[120,'y']];
  function plan(){var v=di.value;if(!v)return;var p=v.split('-'),d=new Date(+p[0],+p[1]-1,+p[2]);
    $$('[data-m]').forEach(function(el){var i=+el.getAttribute('data-m'),m=M[i],x=addM(d,m[0]),t;
      if(i===0){var b=new Date(d.getTime());b.setDate(b.getDate()-5);t='Trước '+dmy(d)}
      else if(m[1]==='d')t=dmy(x);
      else if(m[1]==='r')t=my(x)+' – '+my(addM(d,18));
      else if(m[1]==='y')t=dmy(x);
      else t='Khoảng '+my(x);
      el.textContent=t});
    $('#planOut').textContent=my(addM(d,14))+' – '+my(addM(d,18))}
  di.addEventListener('change',plan);di.addEventListener('input',plan);plan();
  /* đường tiến trình theo cuộn */
  var tl=$('#tl'),fill=$('#tlFill'),items=$$('#tl>li');
  function prog(){var r=tl.getBoundingClientRect(),vh=window.innerHeight,mid=vh*.55,h=Math.max(0,Math.min(r.height-16,mid-r.top));fill.style.height=h+'px';items.forEach(function(li){var t=li.getBoundingClientRect().top;li.classList.toggle('on',t<mid)})}
  if(tl){if(STATIC){fill.style.height='0px'}else{window.__onScroll=prog;prog();window.addEventListener('resize',prog)}}
}

/* =================== KIẾN THỨC =================== */
if(page==='kt'){
  var art=$('#art'),bar=$('#prog'),links=$$('.toc a'),secs=links.map(function(a){return $(a.getAttribute('href'))});
  window.__onScroll=function(){var r=art.getBoundingClientRect(),h=r.height-window.innerHeight,p=Math.max(0,Math.min(1,-r.top/Math.max(1,h)));bar.style.transform='scaleX('+p+')';
    var cur=0;secs.forEach(function(s,i){if(s&&s.getBoundingClientRect().top<window.innerHeight*.3)cur=i});links.forEach(function(a,i){a.classList.toggle('act',i===cur)})};
  window.__onScroll();
  /* tự đánh giá */
  var qs=$$('#quiz input'),ring=$('#qRing'),C=2*Math.PI*30;
  function score(){var n=qs.filter(function(x){return x.checked}).length,t=qs.length,p=n/t;ring.style.strokeDashoffset=C*(1-p);$('#qNum').textContent=n+'/'+t;
    var m=n===t?['Nền tảng khá đầy đủ','Hãy rà lại định kỳ mỗi khi thêm tính năng mới hoặc đổi nhà cung cấp.']:n>=5?['Đã có nền, còn vài lỗ hổng','Ưu tiên những mục chưa tick, nhất là đánh giá tác động và phương án khi lộ dữ liệu.']:n>=2?['Cần bổ sung nhiều','Nên lập kế hoạch tuân thủ trong 1–2 tháng tới, bắt đầu từ sơ đồ dữ liệu.']:['Mới bắt đầu','Bắt đầu từ việc liệt kê dữ liệu đang thu và sửa cơ chế xin đồng ý.'];
    $('#qT').textContent=m[0];$('#qD').textContent=m[1];store('quiz',qs.map(function(x){return x.checked}))}
  var saved=store('quiz');if(saved&&saved.length===qs.length)qs.forEach(function(x,i){x.checked=!!saved[i]});
  qs.forEach(function(x){x.addEventListener('change',score)});ring.style.strokeDasharray=C;score();
  $$('[data-copy]').forEach(function(b){b.addEventListener('click',function(){var u=location.href.split('#')[0];if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(u).then(function(){toast('Đã sao chép đường dẫn bài viết')},function(){toast(u)});else toast(u)})});
}

/* =================== LIÊN HỆ =================== */
if(page==='lh'){
  var form=$('#wiz'),steps=$$('.step',form),bar2=$$('.steps li'),cur=0,back=$('#wBack'),next=$('#wNext');
  var LBL={nhan_hieu:'Đăng ký nhãn hiệu',ban_quyen:'Bản quyền, phần mềm',du_lieu:'Bảo vệ dữ liệu cá nhân',hop_dong:'Hợp đồng phần mềm',khac:'Việc khác'};
  var STG2={y:'Đang lên ý tưởng',l:'Sắp ra mắt',r:'Đã hoạt động',g:'Chuẩn bị gọi vốn'};
  var MODE={online:'Gọi video 30 phút',office:'Gặp tại văn phòng',phone:'Gọi điện thoại'};
  /* đọc tham số từ trang khác */
  var ps=new URLSearchParams(location.search),dv=ps.get('dv');
  if(dv){var mp={'nhan-hieu':'nhan_hieu','ban-quyen':'ban_quyen','du-lieu':'du_lieu','hop-dong':'hop_dong'};var r=form.querySelector('input[name=need][value='+(mp[dv]||'khac')+']');if(r)r.checked=true;
    var gp=ps.get('goi'),nh=ps.get('nhom');if(gp&&PLANS[gp]){$('#fMsg').value='Tôi quan tâm gói '+PLANS[gp].name+(nh?' cho '+nh+' nhóm':'')+'. '}}
  var dd=$('#fDate'),t=new Date();t.setDate(t.getDate()+1);dd.min=t.getFullYear()+'-'+pad(t.getMonth()+1)+'-'+pad(t.getDate());
  function err(f,on,msg){var w=f.closest('.fld');if(!w)return;w.classList.toggle('err',on);if(msg){var e=w.querySelector('.em span');if(e)e.textContent=msg}if(f.setAttribute)on?f.setAttribute('aria-invalid','true'):f.removeAttribute('aria-invalid')}
  function val(i){var ok=true,first=null;function bad(el,m){ok=false;err(el,true,m);if(!first)first=el}
    if(i===0){var r=form.querySelector('input[name=need]:checked');var w=$('#needFld');w.classList.toggle('err',!r);if(!r){ok=false;first=form.querySelector('input[name=need]')}
      var s=$('#fStage');if(!s.value)bad(s,'Chọn giai đoạn hiện tại');else err(s,false)}
    if(i===1){var nm=$('#fName');if(nm.value.trim().length<2)bad(nm,'Nhập họ tên, ít nhất 2 ký tự');else err(nm,false);
      var em=$('#fEmail');if(!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(em.value.trim()))bad(em,'Email chưa đúng định dạng, ví dụ ten@congty.vn');else err(em,false);
      var ph=$('#fPhone'),pv=ph.value.replace(/[\s.]/g,'');if(!/^(0|\+84)\d{9}$/.test(pv))bad(ph,'Số điện thoại gồm 10 số, ví dụ 0900 000 000');else err(ph,false)}
    if(i===2){var md=form.querySelector('input[name=mode]:checked');$('#modeFld').classList.toggle('err',!md);if(!md){ok=false;first=first||form.querySelector('input[name=mode]')}
      if(!dd.value)bad(dd,'Chọn ngày hẹn');else{var p=dd.value.split('-'),x=new Date(+p[0],+p[1]-1,+p[2]);if(x.getDay()===0)bad(dd,'Chủ nhật văn phòng nghỉ, chọn ngày khác');else if(dd.value<dd.min)bad(dd,'Chọn từ ngày mai trở đi');else err(dd,false)}
      var tm=$('#fTime');if(!tm.value)bad(tm,'Chọn khung giờ');else err(tm,false)}
    if(i===3){var c=$('#fOk');$('#okFld').classList.toggle('err',!c.checked);if(!c.checked){ok=false;first=c}}
    if(first&&first.focus)first.focus();return ok}
  function sum(){var need=form.querySelector('input[name=need]:checked'),md=form.querySelector('input[name=mode]:checked'),p=dd.value.split('-');
    var rows=[['Nhu cầu',need?LBL[need.value]:'',0],['Giai đoạn',STG2[$('#fStage').value]||'',0],['Họ tên',$('#fName').value.trim(),1],['Email',$('#fEmail').value.trim(),1],['Điện thoại',$('#fPhone').value.trim(),1],['Công ty',$('#fCo').value.trim()||'Không ghi',1],['Hình thức',md?MODE[md.value]:'',2],['Thời gian',(p.length===3?p[2]+'/'+p[1]+'/'+p[0]:'')+', '+$('#fTime').value,2],['Ghi chú',$('#fMsg').value.trim()||'Không có',2]];
    $('#sum').innerHTML=rows.map(function(r){return '<div><dt>'+r[0]+'</dt><dd>'+esc(r[1])+'</dd><dd><button type="button" data-go="'+r[2]+'">Sửa<span class="sr"> '+r[0]+'</span></button></dd></div>'}).join('');
    $$('#sum [data-go]').forEach(function(b){b.addEventListener('click',function(){go(+b.getAttribute('data-go'))})})}
  function go(i,init){steps[cur].classList.remove('cur');cur=i;steps[cur].classList.add('cur');
    bar2.forEach(function(li,j){li.classList.toggle('done',j<cur);li.classList.toggle('cur',j===cur);if(j===cur)li.setAttribute('aria-current','step');else li.removeAttribute('aria-current')});
    back.style.visibility=cur===0?'hidden':'visible';next.innerHTML=cur===3?'Gửi yêu cầu'+ico('arrow-r'):'Tiếp tục'+ico('arrow-r');
    if(cur===3)sum();var h=steps[cur].querySelector('legend');if(h&&!init){h.setAttribute('tabindex','-1');h.focus({preventScroll:true})}
    var tp=form.getBoundingClientRect().top;if(!init&&tp<0)form.scrollIntoView({behavior:RM?'auto':'smooth',block:'start'})}
  next.addEventListener('click',function(){if(!val(cur))return;if(cur<3)go(cur+1);else done()});
  back.addEventListener('click',function(){if(cur>0)go(cur-1)});
  form.addEventListener('submit',function(e){e.preventDefault();next.click()});
  $$('input,select,textarea',form).forEach(function(el){el.addEventListener('input',function(){var w=el.closest('.fld');if(w&&w.classList.contains('err')){w.classList.remove('err');el.removeAttribute('aria-invalid')}});el.addEventListener('change',function(){var w=el.closest('.fld');if(w)w.classList.remove('err')})});
  function done(){var ch='ABCDEFGHJKLMNPQRSTUVWXYZ23456789',c='TD-';for(var i=0;i<6;i++)c+=ch[Math.floor(Math.random()*ch.length)];
    var p=dd.value.split('-'),md=form.querySelector('input[name=mode]:checked');
    $('#wizWrap').innerHTML='<div class="done"><svg class="seal" viewBox="0 0 96 96" aria-hidden="true"><circle cx="48" cy="48" r="44" fill="#FFF1EA"/><circle cx="48" cy="48" r="44" fill="none" stroke="#C2410C" stroke-width="2" stroke-dasharray="4 6"/><path d="M32 49l11 11 22-24" fill="none" stroke="#C2410C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg><h2 class="h-sm" tabindex="-1" id="doneH">Đã ghi nhận yêu cầu (minh hoạ)</h2><p class="muted" style="margin:10px auto 0;max-width:46ch">Lịch hẹn '+esc(MODE[md.value].toLowerCase())+' ngày '+p[2]+'/'+p[1]+'/'+p[0]+', '+esc($('#fTime').value)+'. Đây là mẫu giao diện nên thông tin không được gửi đi đâu.</p><div class="code"><span>'+c+'</span><button type="button" id="cpy" aria-label="Sao chép mã">'+ico('copy')+'</button></div><p class="small muted" style="margin:0 auto 20px">Mã xác nhận minh hoạ. Trên website thật, mã này gửi kèm email xác nhận.</p><a class="btn btn-o" href="../">Về trang chủ'+ico('arrow-r')+'</a></div>';
    $('#doneH').focus();$('#cpy').addEventListener('click',function(){if(navigator.clipboard)navigator.clipboard.writeText(c).catch(function(){});toast('Đã sao chép mã '+c)});toast('Đã ghi nhận (minh hoạ)')}
  go(0,true);
  /* giờ làm việc: tô hôm nay + trạng thái */
  var now=new Date(),wd=now.getDay(),hr=now.getHours()+now.getMinutes()/60,row=$('#hrs tr[data-d~="'+wd+'"]');if(row)row.classList.add('today');
  var open=(wd>=1&&wd<=5&&hr>=8.5&&hr<18)||(wd===6&&hr>=8.5&&hr<12);var os=$('#openSt');if(os){os.classList.toggle('on',open);os.querySelector('span').textContent=open?'Đang trong giờ làm việc':'Ngoài giờ làm việc, sẽ phản hồi ngày làm việc kế tiếp'}
}
})();
