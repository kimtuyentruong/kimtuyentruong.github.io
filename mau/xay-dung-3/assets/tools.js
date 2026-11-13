/* Khải Nguyên (mẫu xay-dung-3) — chức năng từng trang: dự toán, lọc dự án, vật tư, form... (chạy sau site.js) */
(function(){
'use strict';
var K=window.KN;if(!K)return;
var $=K.$,$$=K.$$,store=K.store,vnd=function(n){return K.vnd(Math.round(n/1000)*1000)},ty=K.ty,ic=K.ic,R=K.R,U=K.U,d=document;
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function nf(n,dg){return Number(n).toFixed(dg==null?1:dg).replace('.',',').replace(/,0$/,'')}
function anim(el,to,fmt){if(!el)return;var from=parseFloat(el.getAttribute('data-v')||0),t0=null,RM=matchMedia('(prefers-reduced-motion:reduce)').matches;el.setAttribute('data-v',to);
if(RM||d.documentElement.classList.contains('static')){el.textContent=fmt(to);return}
function f(t){if(!t0)t0=t;var p=Math.min(1,(t-t0)/600),e=1-Math.pow(1-p,3);el.textContent=fmt(from+(to-from)*e);if(p<1)requestAnimationFrame(f)}requestAnimationFrame(f)}

/* ================= BỘ TÍNH DỰ TOÁN (đơn giá mẫu) ================= */
var PKG={tho:{n:'Xây thô',p:3600000},co:{n:'Trọn gói Cơ bản',p:5600000},tc:{n:'Trọn gói Tiêu chuẩn',p:6500000},cc:{n:'Trọn gói Cao cấp',p:7900000}};
var TM={'nha-pho':[1,'Nhà phố'],'biet-thu':[1.1,'Biệt thự'],'cap-4':[.94,'Nhà 1 tầng']};
var MONG={don:[.2,'Móng đơn'],bang:[.5,'Móng băng'],coc:[.4,'Móng cọc']};
var HAM={'0':[0,''],'1.5':[1.5,'Hầm sâu 1,0–1,3 m'],'1.7':[1.7,'Hầm sâu 1,3–1,7 m'],'2':[2,'Hầm sâu trên 1,7 m']};
var MAI={ton:[.3,'Mái tôn'],btct:[.5,'Mái bê tông cốt thép'],ngoi:[.7,'Mái ngói kèo thép']};
function compute(o){
  var S=o.w*o.l,F=S*o.dens/100,rows=[];
  rows.push([MONG[o.mong][1],F,MONG[o.mong][0]]);
  if(+o.ham)rows.push([HAM[o.ham][1],F,HAM[o.ham][0]]);
  rows.push(['Tầng trệt',F,1]);
  if(o.lung)rows.push(['Tầng lửng (≈60% sàn)',F*.6,1]);
  if(o.fl>1)rows.push([o.fl===2?'Lầu 1':'Lầu 1 – Lầu '+(o.fl-1),F*(o.fl-1),1]);
  if(o.tum){rows.push(['Tum thang',F*.2,1]);rows.push(['Sân thượng không mái',F*.8,.5]);rows.push([MAI[o.mai][1]+' (tum)',F*.2,MAI[o.mai][0]])}
  else rows.push([MAI[o.mai][1],F,MAI[o.mai][0]]);
  if(S-F>0.5)rows.push(['Sân trước, sân sau',S-F,.5]);
  var A=0;rows.forEach(function(r){r[3]=r[1]*r[2];A+=r[3]});
  var mult=TM[o.type][0]*(o.hem?1.04:1),pk=PKG[o.pkg],base=A*pk.p*mult;
  var tho=A*3600000*mult,fin=base-tho;
  var items=[['Móng, khung bê tông cốt thép',tho*.46],['Xây tường, tô trát, cán nền',tho*.3],['Điện nước âm tường, ống thoát',tho*.12],['Nhân công hoàn thiện',tho*.12]];
  if(o.pkg!=='tho'){items.push(['Gạch ốp lát, đá cầu thang',fin*.3],['Sơn bả trong ngoài',fin*.14],['Cửa đi, cửa sổ, cổng',fin*.2],['Thiết bị vệ sinh, bếp',fin*.16],['Thiết bị điện, đèn',fin*.12],['Lan can, tay vịn, trần thạch cao',fin*.08])}
  var floorA=F*(o.fl+(o.lung?.6:0)+(o.tum?.2:0));
  if(o.mong==='coc')items.push(['Ép cọc bê tông (ước tính theo sàn trệt)',F*320000]);
  if(o.pkg==='tho'&&o.design)items.push(['Thiết kế kiến trúc, kết cấu, điện nước',floorA*180000]);
  var total=0;items.forEach(function(i){total+=i[1]});
  var months=Math.round((2.5+o.fl*.7+(+o.ham?1.5:0)+(o.lung?.3:0)+(o.pkg==='tho'?0:1)+(o.type==='biet-thu'?1:0))*2)/2;
  var PAY=[['Ký hợp đồng, khởi công',10],['Xong phần móng'+(+o.ham?' và tầng hầm':''),15],['Xong sàn '+(o.fl>2?'lầu 1':'trệt'),20],['Xong sàn mái',20],['Xong xây tô, điện nước âm',15],['Hoàn thiện, bàn giao',15],['Hết 12 tháng bảo hành',5]];
  var pay=PAY.map(function(p){return [p[0],p[1],total*p[1]/100]});
  return {S:S,F:F,rows:rows,A:A,mult:mult,pk:pk,items:items,total:total,months:months,pay:pay,floorA:floorA};
}
K.compute=compute;K.PKG=PKG;

/* ---------- trang chủ: dự toán nhanh ---------- */
var qe=$('#quickEst');
if(qe){
  var qa=$('#qeArea'),qf=$('#qeFl'),qo=$('#qeOut');
  function q(){var pkg=($('input[name=qePkg]:checked',qe)||{}).value||'tc',S=+qa.value,fl=+qf.value;
    $('#qeAreaV').textContent=S+' m²';$('#qeFlV').textContent=fl+' tầng';
    var r=compute({type:'nha-pho',w:5,l:S/5,dens:100,fl:fl,lung:false,ham:'0',mong:'bang',mai:'btct',tum:fl>2,pkg:pkg,hem:false});
    anim(qo,r.total/1e9,function(v){return nf(v,2).replace(/,?0+$/,'')+' tỷ'});
    $('#qeA').textContent=nf(r.A,0)+' m²';$('#qeM').textContent=nf(r.months)+' tháng';
    $('#qePrice').textContent=vnd(r.pk.p)+'/m²';}
  qe.addEventListener('input',q);q();
}

/* ---------- trang bảng giá: công cụ dự toán ---------- */
var est=$('#est');
if(est){
  var sv=store.get().est;
  function val(n){var x=$('[name='+n+']:checked',est);return x?x.value:null}
  if(sv&&sv.o){var o=sv.o;['type','mong','mai','pkg'].forEach(function(n){var x=$('[name='+n+'][value="'+o[n]+'"]',est);if(x)x.checked=true});
    $('#w').value=o.w;$('#l').value=o.l;$('#dens').value=o.dens;$('#fl').value=o.fl;$('#ham').value=o.ham;$('#lung').checked=o.lung;$('#tum').checked=o.tum;$('#hem').checked=o.hem;$('#design').checked=!!o.design;$('#estRestored').hidden=false}
  var flv=$('#flV');
  $$('[data-step]',est).forEach(function(bt){bt.addEventListener('click',function(){var f=$('#fl'),v=+f.value+(+bt.getAttribute('data-step'));f.value=Math.max(1,Math.min(7,v));run()})});
  function read(){return {type:val('type'),w:Math.max(3,Math.min(40,+$('#w').value||5)),l:Math.max(5,Math.min(60,+$('#l').value||18)),dens:+$('#dens').value,fl:+$('#fl').value,lung:$('#lung').checked,ham:$('#ham').value,mong:val('mong'),mai:val('mai'),tum:$('#tum').checked,pkg:val('pkg'),hem:$('#hem').checked,design:$('#design').checked}}
  function run(){
    var o=read();if(o.type==='cap-4'){$('#fl').value=1;o.fl=1}
    $('#fl').closest('.stepper').classList.toggle('dis',o.type==='cap-4');
    flv.textContent=o.fl;$('#densV').textContent=o.dens+'%';$('#designRow').hidden=o.pkg!=='tho';
    var r=compute(o);
    $('#rS').textContent=nf(r.S)+' m²';$('#rF').textContent=nf(r.F)+' m²';
    $('#rowsBody').innerHTML=r.rows.map(function(x){return '<tr><td>'+x[0]+'</td><td class="r num">'+nf(x[1])+'</td><td class="r num">'+Math.round(x[2]*100)+'%</td><td class="r num"><b>'+nf(x[3])+'</b></td></tr>'}).join('')+'<tr class="sum"><td colspan="3">Tổng diện tích quy đổi</td><td class="r num"><b>'+nf(r.A)+' m²</b></td></tr>';
    var mx=0;r.items.forEach(function(i){if(i[1]>mx)mx=i[1]});
    $('#itemsList').innerHTML=r.items.map(function(i){return '<li><div class="it-top"><span>'+i[0]+'</span><b class="num">'+vnd(i[1])+'</b></div><span class="bar"><i style="width:'+(i[1]/mx*100).toFixed(1)+'%"></i></span></li>'}).join('');
    anim($('#rTotal'),r.total,vnd);
    $('#rPkg').textContent=r.pk.n+' · '+vnd(r.pk.p)+'/m²'+(r.mult!==1?' × hệ số '+nf(r.mult,2):'');
    $('#rA').textContent=nf(r.A,0)+' m²';$('#rM').textContent=nf(r.months)+' tháng';$('#rPer').textContent=vnd(r.total/r.floorA)+'/m²';
    $('#payBody').innerHTML=r.pay.map(function(p,i){return '<li><span class="pn num">'+(i+1)+'</span><span class="pt">'+p[0]+'</span><span class="pp num">'+p[1]+'%</span><b class="num">'+vnd(p[2])+'</b></li>'}).join('');
    $('#payBar').innerHTML=r.pay.map(function(p,i){return '<i style="flex:'+p[1]+'" title="Đợt '+(i+1)+': '+p[1]+'%"></i>'}).join('');
    store.set('est',{o:o,pk:r.pk.n,type:TM[o.type][1],S:r.S,fl:o.fl,A:Math.round(r.A),total:Math.round(r.total),months:r.months});
  }
  est.addEventListener('input',run);est.addEventListener('change',run);run();
  var rs=$('#estReset');if(rs)rs.addEventListener('click',function(){store.set('est',null);location.reload()});
  var pr=$('#estPrint');if(pr)pr.addEventListener('click',function(){window.print()});
}

/* ---------- dịch vụ: tab + so sánh + trước/sau ---------- */
var tabs=$('#svcTabs');
if(tabs){
  var tb=$$('[role=tab]',tabs);
  function sel(t,f){tb.forEach(function(x){var on=x===t;x.setAttribute('aria-selected',on);x.tabIndex=on?0:-1;$('#'+x.getAttribute('aria-controls')).hidden=!on});if(f)t.focus();try{history.replaceState(null,'','#'+t.id.replace('t-',''))}catch(e){}}
  tb.forEach(function(t,i){t.addEventListener('click',function(){sel(t)});t.addEventListener('keydown',function(e){var n=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;if(n){e.preventDefault();sel(tb[(i+n+tb.length)%tb.length],true)}})});
  var h=location.hash.slice(1),m=h&&$('#t-'+h);if(m)sel(m);
}
var cmp=$('#cmpDiff');
if(cmp){cmp.addEventListener('change',function(){$('#cmpTbl').classList.toggle('only-diff',cmp.checked)})}
$$('.ba').forEach(function(ba){var r=$('input',ba);function s(){ba.style.setProperty('--x',r.value+'%')}r.addEventListener('input',s);s()});
$$('[data-pick-pkg]').forEach(function(a){a.addEventListener('click',function(){var o=(store.get().est||{}).o||{type:'nha-pho',w:5,l:18,dens:100,fl:4,lung:false,ham:'0',mong:'bang',mai:'btct',tum:true,hem:false};o.pkg=a.getAttribute('data-pick-pkg');store.set('est',{o:o})})});

/* ---------- danh sách dự án ---------- */
var pg=$('#projGrid');
if(pg){
  var F={t:'all',k:'all',b:'all',sort:'new',saved:false};
  var pr0=new URLSearchParams(location.search);if(pr0.get('loai'))F.t=pr0.get('loai');
  function card(p,i){var sv=K.saved().indexOf(p.id)>-1;
    return '<article class="pcard card rv in" style="--i:'+i+'"><a class="pc-link" href="'+R+'du-an-chi-tiet/?da='+p.id+'"><div class="ph-img r43"><img src="'+U(p.img,900)+'" alt="'+esc(p.alt)+'" loading="lazy" width="900" height="675"><span class="pc-type">'+K.TYPE[p.t]+'</span></div><div class="pc-body"><span class="pc-loc">'+ic('pin')+esc(p.w)+'</span><h3>'+esc(p.n)+'</h3><dl class="pc-spec"><div><dt>Khu đất</dt><dd class="num">'+p.lot+'</dd></div><div><dt>Sàn</dt><dd class="num">'+p.area+'&nbsp;m²</dd></div><div><dt>Ngân sách</dt><dd class="num">'+ty(p.bud*1e9)+'</dd></div></dl></div></a><button class="save'+(sv?' on':'')+'" type="button" data-id="'+p.id+'" aria-pressed="'+sv+'" aria-label="Lưu dự án '+esc(p.n)+'">'+ic('heart')+'</button></article>'}
  function draw(){
    var L=K.PROJ.filter(function(p){return (F.t==='all'||p.t===F.t)&&(F.k==='all'||p.k===F.k)&&(F.b==='all'||(F.b==='lt2'?p.bud<2:F.b==='2-5'?p.bud>=2&&p.bud<=5:p.bud>5))&&(!F.saved||K.saved().indexOf(p.id)>-1)});
    L.sort(function(a,b){return F.sort==='asc'?a.bud-b.bud:F.sort==='desc'?b.bud-a.bud:b.y-a.y});
    pg.innerHTML=L.length?L.map(card).join(''):'<div class="empty">'+ic('filter')+'<p><b>Chưa có dự án khớp bộ lọc.</b><br>Thử bỏ bớt điều kiện, hoặc gửi yêu cầu để kỹ sư gửi hồ sơ công trình tương tự.</p><button class="btn btn-line btn-sm" type="button" id="clearF">Xoá bộ lọc</button></div>';
    $('#projCount').textContent=L.length;var sc=K.saved().length;$('#savedN').textContent=sc;
    var cf=$('#clearF');if(cf)cf.onclick=reset;
    $$('.save',pg).forEach(function(bt){bt.addEventListener('click',function(){var on=K.toggleSave(bt.getAttribute('data-id'));bt.classList.toggle('on',on);bt.setAttribute('aria-pressed',on);$('#savedN').textContent=K.saved().length;if(F.saved)draw()})});
  }
  function reset(){F={t:'all',k:'all',b:'all',sort:F.sort,saved:false};$$('#pf input').forEach(function(i){if(i.type==='radio')i.checked=i.value==='all';if(i.type==='checkbox')i.checked=false});$('#pfK').value='all';draw()}
  $('#pf').addEventListener('change',function(e){var t=e.target;if(t.name==='pt')F.t=t.value;if(t.name==='pb')F.b=t.value;if(t.id==='pfK')F.k=t.value;if(t.id==='pfS')F.sort=t.value;if(t.id==='pfSaved')F.saved=t.checked;draw()});
  var r0=$('[name=pt][value="'+F.t+'"]');if(r0)r0.checked=true;
  $('#pfReset').addEventListener('click',reset);draw();
}

/* ---------- chi tiết dự án ---------- */
var det=$('#projDetail');
if(det){
  var id=new URLSearchParams(location.search).get('da')||'nha-pho-go-vap';
  var p=K.PROJ.filter(function(x){return x.id===id})[0]||K.PROJ[0];
  var GAL={'nha-pho':[[p.img,p.alt],['1600566753086-00f18fb6b3ea','Phòng khách thông tầng, cầu thang gỗ và cửa kính lớn'],['1556911220-bff31c812dba','Gian bếp trắng có mặt đá sáng'],['1600607687644-c7171b42498f','Phòng ngủ tông xám trắng, cửa kính ra ban công'],['1600566752355-35792bedcfea','Phòng tắm tông xám, bồn tắm trắng và cửa sổ lấy sáng'],['1621511075938-f03482369feb','Công trình đang thi công phần thô với giàn giáo']],
   'biet-thu':[[p.img,p.alt],['1600573472550-8090b5e0745e','Không gian sinh hoạt chung nhìn ra hồ bơi qua vách kính'],['1600607687939-ce8a6c25118c','Phòng khách rộng với sofa trắng và vách ốp gỗ'],['1602002418082-a4443e081dd1','Phòng tắm đá tự nhiên, bồn tắm cạnh cửa kính'],['1600607687644-c7171b42498f','Phòng ngủ tông xám trắng, cửa kính ra ban công'],['1508450859948-4e04fabaa4ea','Khung bê tông công trình đang xây dựng']],
   'cai-tao':[[p.img,p.alt],['1618832515490-e181c4794a45','Căn bếp trong lúc tháo dỡ để cải tạo'],['1694522362256-6c907336af43','Thợ dùng máy cắt xử lý bê tông khi cải tạo nhà'],['1613545325278-f24b0cae1224','Phòng khách sáng sủa sau khi cải tạo'],['1556911220-bff31c812dba','Gian bếp trắng có mặt đá sáng'],['1600566752355-35792bedcfea','Phòng tắm làm lại toàn bộ']]};
  var g=GAL[p.t];
  if(p.id!=='nha-pho-go-vap'){
    d.title=p.n+' – '+p.w.split(',')[0]+' | Khải Nguyên';
    $$('[data-f]').forEach(function(el){var k=el.getAttribute('data-f'),v={n:p.n,w:p.w,lot:p.lot,fl:p.fl,area:p.area+' m²',pkg:p.pkg,bud:ty(p.bud*1e9),mo:nf(p.mo)+' tháng',y:p.y,type:K.TYPE[p.t],s:p.s}[k];if(v!=null)el.textContent=v});
    var mo=p.mo,ms=$$('.ms-list li');ms.forEach(function(li,i){var w=$('.ms-w',li);if(w)w.textContent='Tuần '+Math.max(0,Math.round(+w.getAttribute('data-r')*mo*4.3))});
  }
  $('#galMain').innerHTML='<img src="'+U(g[0][0],1600)+'" alt="'+esc(g[0][1])+'" width="1600" height="1067" fetchpriority="high">';
  $('#galThumbs').innerHTML=g.map(function(x,i){return '<button type="button" class="gt'+(i===0?' on':'')+'" data-i="'+i+'" aria-label="Xem ảnh '+(i+1)+': '+esc(x[1])+'"><img src="'+U(x[0],400)+'" alt="" loading="lazy" width="400" height="300"></button>'}).join('');
  var gi=0,list=g.map(function(x){return{id:x[0],alt:x[1]}});
  $$('#galThumbs .gt').forEach(function(bt){bt.addEventListener('click',function(){gi=+bt.getAttribute('data-i');var im=$('#galMain img');im.src=U(g[gi][0],1600);im.alt=g[gi][1];$$('#galThumbs .gt').forEach(function(x){x.classList.toggle('on',x===bt)});$('#galCap').textContent=g[gi][1]})});
  $('#galCap').textContent=g[0][1];
  $('#galOpen').addEventListener('click',function(){K.lightbox(list,gi)});
  var sb=$('#saveProj');function ss(){var on=K.saved().indexOf(p.id)>-1;sb.setAttribute('aria-pressed',on);$('span',sb).textContent=on?'Đã lưu dự án':'Lưu dự án này'}
  sb.addEventListener('click',function(){K.toggleSave(p.id);ss()});ss();
  var rel=K.PROJ.filter(function(x){return x.id!==p.id&&x.t===p.t}).concat(K.PROJ.filter(function(x){return x.t!==p.t})).slice(0,3);
  $('#related').innerHTML=rel.map(function(x){return '<a class="rel card" href="?da='+x.id+'"><div class="ph-img r32"><img src="'+U(x.img,700)+'" alt="'+esc(x.alt)+'" loading="lazy" width="700" height="467"></div><div class="rel-b"><span>'+K.TYPE[x.t]+' · '+esc(x.w.split(',')[0])+'</span><b>'+esc(x.n)+'</b></div></a>'}).join('');
  var ca=$('#detCta');if(ca)ca.addEventListener('click',function(){store.set('ref',p.n+' ('+p.w.split(',')[0]+')')});
}

/* ---------- quy trình: chọn bước + hồ sơ ---------- */
var steps=$('#steps');
if(steps){
  var sbt=$$('.st-btn',steps);
  function pick(bt,f){sbt.forEach(function(x){var on=x===bt;x.setAttribute('aria-selected',on);x.tabIndex=on?0:-1;$('#'+x.getAttribute('aria-controls')).hidden=!on});$('#stProg').style.setProperty('--p',(sbt.indexOf(bt)/(sbt.length-1)*100).toFixed(1));if(f)bt.focus()}
  sbt.forEach(function(bt,i){bt.addEventListener('click',function(){pick(bt)});bt.addEventListener('keydown',function(e){var n=/Right|Down/.test(e.key)?1:/Left|Up/.test(e.key)?-1:0;if(n){e.preventDefault();pick(sbt[(i+n+sbt.length)%sbt.length],true)}})});
  pick(sbt[0]);
}
var docs=$('#docs');
if(docs){
  var cb=$$('input[type=checkbox]',docs),saved=store.get().docs||[];
  cb.forEach(function(c){if(saved.indexOf(c.value)>-1)c.checked=true});
  function up(){var n=cb.filter(function(c){return c.checked}).length;$('#docN').textContent=n+'/'+cb.length;$('#docBar').style.width=(n/cb.length*100)+'%';store.set('docs',cb.filter(function(c){return c.checked}).map(function(c){return c.value}));$('#docDone').hidden=n<cb.length}
  docs.addEventListener('change',up);up();
}

/* ---------- vật tư ---------- */
var mt=$('#matTool');
if(mt){
  var MAT=[
  ['ket-cau','Kết cấu','Thép','Hoà Phát hoặc Việt Nhật CB300','Việt Nhật / Pomina CB300–CB400','Việt Nhật CB400, thép chủ phi lớn hơn'],
  ['ket-cau','Kết cấu','Bê tông','Bê tông tươi mác 250','Bê tông tươi mác 250, có phụ gia','Bê tông tươi mác 300, phụ gia chống thấm'],
  ['ket-cau','Kết cấu','Xi măng xây tô','Hà Tiên đa dụng','Hà Tiên / INSEE','INSEE đa dụng'],
  ['ket-cau','Kết cấu','Gạch xây','Gạch ống Tuynel 8×8×18','Gạch Tuynel Phước Thành','Gạch Tuynel kèm gạch không nung tường bao'],
  ['dien-nuoc','Điện nước','Dây điện','Cadivi lõi đồng','Cadivi lõi đồng','Cadivi, đi ống luồn chống cháy'],
  ['dien-nuoc','Điện nước','Ống nước','Bình Minh PVC','Bình Minh PVC + PPR nước nóng','Bình Minh PPR toàn bộ cấp nước'],
  ['dien-nuoc','Điện nước','Công tắc, ổ cắm','Panasonic dòng phổ thông','Panasonic Wide','Schneider / Legrand mặt kính'],
  ['hoan-thien','Hoàn thiện','Gạch nền','Gạch men 60×60 cm, đến 220.000đ/m²','Gạch bóng kiếng 80×80 cm, đến 350.000đ/m²','Gạch khổ lớn 60×120 cm, đến 650.000đ/m²'],
  ['hoan-thien','Hoàn thiện','Sơn nước','Maxilite (Dulux) nội thất','Dulux Inspire, ngoại thất Weathershield','Jotun Majestic, ngoại thất Jotashield'],
  ['hoan-thien','Hoàn thiện','Chống thấm','Kova CT-11A sàn vệ sinh, mái','Sika gốc xi măng sàn vệ sinh, mái','Màng khò nóng mái + Sika toàn bộ khu ướt'],
  ['hoan-thien','Hoàn thiện','Cửa đi, cửa sổ','Nhôm Xingfa hệ 55 trong nước, kính 6,38 mm','Nhôm Xingfa nhập khẩu, kính 8,38 mm','Nhôm hệ cao cấp, kính hộp cách nhiệt'],
  ['hoan-thien','Hoàn thiện','Cầu thang','Đá granite tự nhiên, tay vịn gỗ','Đá granite, lan can kính cường lực','Mặt bậc gỗ tự nhiên, lan can kính'],
  ['thiet-bi','Thiết bị','Bồn cầu, lavabo','Inax dòng phổ thông','Inax / Viglacera dòng trung','TOTO một khối'],
  ['thiet-bi','Thiết bị','Vòi sen, vòi lavabo','Inax nóng lạnh','Inax / Caesar nóng lạnh','TOTO / Grohe'],
  ['thiet-bi','Thiết bị','Đèn chiếu sáng','Đèn LED âm trần Rạng Đông','Đèn LED Philips','Đèn LED Philips + hắt trần trang trí'],
  ['thiet-bi','Thiết bị','Máy nước nóng','Ariston 20 lít','Ariston 30 lít','Năng lượng mặt trời + điện dự phòng']];
  var PN={co:'Cơ bản',tc:'Tiêu chuẩn',cc:'Cao cấp'},PI={co:3,tc:4,cc:5},S2={a:'tc',b:'cc',cat:'all',mode:'one'};
  var initP=(store.get().est||{}).o;if(initP&&PI[initP.pkg])S2.a=initP.pkg;
  function draw2(){
    var L=MAT.filter(function(m){return S2.cat==='all'||m[0]===S2.cat});
    var h;
    if(S2.mode==='one'){h='<table class="tbl mat"><thead><tr><th>Nhóm</th><th>Hạng mục</th><th>Gói '+PN[S2.a]+' (mẫu)</th></tr></thead><tbody>'+L.map(function(m){return '<tr><td class="muted">'+m[1]+'</td><td><b>'+m[2]+'</b></td><td>'+m[PI[S2.a]]+'</td></tr>'}).join('')+'</tbody></table>'}
    else{var diff=0;h='<table class="tbl mat"><thead><tr><th>Hạng mục</th><th>Gói '+PN[S2.a]+'</th><th>Gói '+PN[S2.b]+'</th></tr></thead><tbody>'+L.map(function(m){var x=m[PI[S2.a]]!==m[PI[S2.b]];if(x)diff++;return '<tr'+(x?' class="df"':'')+'><td><b>'+m[2]+'</b><br><span class="muted small">'+m[1]+'</span></td><td>'+m[PI[S2.a]]+'</td><td>'+(x?'<mark>'+m[PI[S2.b]]+'</mark>':m[PI[S2.b]])+'</td></tr>'}).join('')+'</tbody></table>';
      h='<p class="cmp-note">'+ic('swap')+'<span><b class="num">'+diff+'</b> trên <b class="num">'+L.length+'</b> hạng mục khác nhau giữa hai gói (được tô màu).</span></p>'+h}
    $('#matOut').innerHTML='<div class="tbl-wrap">'+h+'</div>';
    $$('#matPkg [data-p]').forEach(function(x){x.setAttribute('aria-pressed',x.getAttribute('data-p')===S2.a)});
    $('#matB').hidden=S2.mode!=='two';$('#matPick').textContent='Dự toán với gói '+PN[S2.a];
  }
  $$('#matPkg [data-p]').forEach(function(x){x.addEventListener('click',function(){S2.a=x.getAttribute('data-p');if(S2.a===S2.b)S2.b=S2.a==='cc'?'co':'cc';$('#matBsel').value=S2.b;draw2()})});
  $('#matMode').addEventListener('change',function(e){S2.mode=e.target.checked?'two':'one';draw2()});
  $('#matBsel').addEventListener('change',function(e){S2.b=e.target.value;draw2()});
  $$('#matCat input').forEach(function(x){x.addEventListener('change',function(){S2.cat=x.value;draw2()})});
  $('#matPick').addEventListener('click',function(){var o=(store.get().est||{}).o||{type:'nha-pho',w:5,l:18,dens:100,fl:4,lung:false,ham:'0',mong:'bang',mai:'btct',tum:true,hem:false};o.pkg=S2.a;store.set('est',{o:o})});
  draw2();
}

/* ---------- bảo hành: tra cứu + hỏi đáp ---------- */
var wl=$('#wLook');
if(wl){
  var W={ket:['10 năm','Móng, cột, dầm, sàn bê tông cốt thép','Nứt kết cấu, lún, võng sàn do thi công. Không gồm tác động bên ngoài như đào móng nhà kế bên, cơi nới tự ý.'],tham:['5 năm','Chống thấm mái, sân thượng, khu vệ sinh','Thấm dột tại vị trí đã chống thấm theo hợp đồng. Không gồm hư hỏng do khoan đục sau bàn giao.'],dien:['24 tháng','Hệ điện nước âm tường','Rò rỉ ống, chập điện do thi công. Thiết bị gắn ngoài bảo hành theo hãng.'],hoan:['12 tháng','Tô trát, sơn, ốp lát, cửa','Bong tróc, nứt chân chim lớn, cửa kẹt do lắp đặt.'],tb:['Theo hãng','Thiết bị vệ sinh, đèn, máy nước nóng','Khải Nguyên hỗ trợ liên hệ hãng và lắp lại miễn phí trong 12 tháng đầu.']};
  function wr(){var k=wl.value,w=W[k];anim($('#wY'),parseFloat(w[0])||0,function(v){return isNaN(parseFloat(w[0]))?w[0]:Math.round(v)+(/năm/.test(w[0])?' năm':' tháng')});$('#wScope').textContent=w[1];$('#wCond').textContent=w[2]}
  wl.addEventListener('change',wr);wr();
}
var fq=$('#faqQ');
if(fq){
  var items=$$('#faqList details'),cat='all';
  function ff(){var q=fq.value.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/đ/g,'d'),n=0;
    items.forEach(function(it){var t=it.textContent.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/đ/g,'d'),ok=(!q||t.indexOf(q)>-1)&&(cat==='all'||it.getAttribute('data-c')===cat);it.hidden=!ok;if(ok)n++;if(q&&ok)it.open=true});
    $('#faqN').textContent=n;$('#faqEmpty').hidden=n>0}
  fq.addEventListener('input',ff);$$('#faqCat input').forEach(function(x){x.addEventListener('change',function(){cat=x.value;ff()})});ff();
}

/* ---------- kiến thức ---------- */
var kl=$('#postGrid');
if(kl){
  var kc='all';
  function kd(){var q=($('#postQ').value||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/đ/g,'d'),n=0;
    $$('.post',kl).forEach(function(p){var ok=(kc==='all'||p.getAttribute('data-c')===kc)&&(!q||p.textContent.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/đ/g,'d').indexOf(q)>-1);p.hidden=!ok;if(ok)n++});
    $('#postN').textContent=n;$('#postEmpty').hidden=n>0}
  $$('#postCat input').forEach(function(x){x.addEventListener('change',function(){kc=x.value;kd()})});$('#postQ').addEventListener('input',kd);kd();
  var hh=location.hash.slice(1);if(hh){var t=d.getElementById(hh);if(t&&t.tagName==='ARTICLE'){var dt=$('details',t);if(dt)dt.open=true}}
}
var art=$('#art');
if(art){
  var hs=$$('h2[id]',art),tl=$$('#toc a'),bar=$('#readBar');
  function sp(){var y=window.pageYOffset,cur=hs[0];hs.forEach(function(h){if(h.getBoundingClientRect().top<140)cur=h});tl.forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+cur.id)});
    var r=art.getBoundingClientRect(),dn=r.height-innerHeight,p=dn>0?Math.min(1,Math.max(0,-r.top/dn)):0;bar.style.transform='scaleX('+p.toFixed(3)+')'}
  window.addEventListener('scroll',sp,{passive:true});sp();
  var cp=$('#copyLink');if(cp)cp.addEventListener('click',function(){var u=location.href;function ok(){cp.querySelector('span').textContent='Đã chép đường dẫn'}if(navigator.clipboard)navigator.clipboard.writeText(u).then(ok,ok);else ok()});
  var pp=$('#printArt');if(pp)pp.addEventListener('click',function(){window.print()});
}

/* ---------- liên hệ: form nhiều bước ---------- */
var fm=$('#survey');
if(fm){
  var stepsF=$$('.fs',fm),cur=0,dots=$$('#fsDots li');
  var S=store.get(),e0=S.est;
  if(e0&&e0.total){$('#estNote').hidden=false;$('#estNoteT').innerHTML='<b>'+esc(e0.type)+'</b>, '+esc(e0.pk)+', '+e0.fl+' tầng, đất '+nf(e0.S)+' m², ước tính <b class="num">'+vnd(e0.total)+'</b>';
    var sv=$('[name=svc][value="'+(e0.pk==='Xây thô'?'xay-tho':'tron-goi')+'"]',fm);if(sv)sv.checked=true;
    $('#fArea').value=Math.round(e0.S);$('#fFl').value=e0.fl;
    var bd=e0.total<2e9?'lt2':e0.total<=5e9?'2-5':'gt5';var bx=$('#fBud');if(bx)bx.value=bd;}
  if(S.ref){$('#fNote').value='Muốn tham khảo dự án: '+S.ref}
  var sav=K.saved();if(sav.length){$('#savedNote').hidden=false;$('#savedNoteT').textContent=sav.map(function(id){var p=K.PROJ.filter(function(x){return x.id===id})[0];return p?p.n:''}).filter(Boolean).join(', ')}
  var mn=new Date();mn.setDate(mn.getDate()+1);var dd=$('#fDate');dd.min=mn.toISOString().slice(0,10);
  function err(el,msg){var f=el.closest('.field')||el.closest('fieldset');var m=f&&$('.err-msg',f);if(m)m.textContent=msg||'';if(el.setAttribute)el.setAttribute('aria-invalid',msg?'true':'false');return !msg}
  function vstep(i){var ok=true,first=null;
    function chk(el,msg){if(!err(el,msg)){ok=false;if(!first)first=el}}
    if(i===0){var s=$('[name=svc]:checked',fm),h=$('[name=house]:checked',fm);chk($('[name=svc]',fm),s?'':'Chọn dịch vụ bạn cần.');err($('[name=svc]',fm),s?'':'Chọn dịch vụ bạn cần.');chk($('[name=house]',fm),h?'':'Chọn loại công trình.')}
    if(i===1){var a=$('#fArea'),v=+a.value;chk($('#fReg'),$('#fReg').value?'':'Chọn khu vực công trình.');chk($('#fWard'),$('#fWard').value.trim().length>=3?'':'Nhập phường/xã nơi có khu đất.');chk(a,v>=15&&v<=2000?'':'Diện tích đất từ 15 đến 2.000 m².')}
    if(i===2){var dv=dd.value;chk(dd,!dv?'Chọn ngày khảo sát.':(dv<dd.min?'Chọn từ ngày mai trở đi.':(new Date(dv).getDay()===0?'Chủ nhật cần hẹn riêng qua điện thoại, vui lòng chọn ngày khác.':'')));var sl=$('[name=slot]:checked',fm);chk($('[name=slot]',fm),sl?'':'Chọn buổi khảo sát.')}
    if(i===3){var n=$('#fName'),ph=$('#fPhone'),em=$('#fEmail'),cs=$('#fConsent');chk(n,n.value.trim().length>=2?'':'Nhập họ tên người liên hệ.');var pv=ph.value.replace(/[\s.]/g,'');chk(ph,/^0\d{9}$/.test(pv)?'':'Số điện thoại gồm 10 số, bắt đầu bằng 0.');chk(em,!em.value||/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em.value)?'':'Email chưa đúng định dạng.');chk(cs,cs.checked?'':'Cần đồng ý để Khải Nguyên liên hệ lại.')}
    if(first&&first.focus)first.focus();return ok}
  function go(i){stepsF.forEach(function(s,k){s.hidden=k!==i});cur=i;dots.forEach(function(x,k){x.classList.toggle('on',k===i);x.classList.toggle('done',k<i);if(k===i)x.setAttribute('aria-current','step');else x.removeAttribute('aria-current')});
    $('#fsPrev').hidden=i===0||i===5;$('#fsNext').hidden=i>=4;$('#fsSend').hidden=i!==4;$('#fsNav').hidden=i===5;$('#fsNum').textContent=Math.min(i+1,5);
    if(i===4)sum();var h=$('h3',stepsF[i]);if(h){h.tabIndex=-1;h.focus({preventScroll:true})}
    var top=fm.getBoundingClientRect().top+window.pageYOffset-90;if(window.pageYOffset>top)window.scrollTo(0,top)}
  function lab(n){var x=$('[name='+n+']:checked',fm);return x?x.closest('label').textContent.trim():'—'}
  function sum(){var rows=[['Dịch vụ',lab('svc')],['Công trình',lab('house')],['Khu vực',$('#fReg').selectedOptions[0].text+', '+$('#fWard').value],['Diện tích đất',$('#fArea').value+' m²'+($('#fFl').value?' · '+$('#fFl').value+' tầng dự kiến':'')],['Ngân sách',$('#fBud').selectedOptions[0].text],['Lịch khảo sát',dd.value.split('-').reverse().join('/')+' · '+lab('slot')],['Người liên hệ',$('#fName').value+' · '+$('#fPhone').value],['Ghi chú',$('#fNote').value||'Không có']];
    $('#sumList').innerHTML=rows.map(function(r,i){var st=i<2?0:i<5?1:i<6?2:3;return '<div><dt>'+r[0]+'</dt><dd>'+esc(r[1])+'</dd><button type="button" class="ed" data-go="'+st+'" aria-label="Sửa '+r[0]+'">Sửa</button></div>'}).join('');
    $$('#sumList .ed').forEach(function(x){x.addEventListener('click',function(){go(+x.getAttribute('data-go'))})})}
  $('#fsNext').addEventListener('click',function(){if(vstep(cur))go(cur+1)});
  $('#fsPrev').addEventListener('click',function(){go(cur-1)});
  fm.addEventListener('change',function(e){var t=e.target;if(t.getAttribute('aria-invalid')==='true'||t.type==='radio'||t.type==='checkbox')err(t,'')});
  fm.addEventListener('submit',function(e){e.preventDefault();if(cur!==4)return;
    var c='KN-'+new Date().toISOString().slice(2,10).replace(/-/g,'')+'-'+Math.random().toString(36).slice(2,6).toUpperCase();
    $('#okCode').textContent=c;$('#okWhen').textContent=dd.value.split('-').reverse().join('/')+', '+lab('slot').toLowerCase();$('#okPhone').textContent=$('#fPhone').value;
    store.set('lastReq',{code:c,at:Date.now()});go(5)});
  $('#okCopy').addEventListener('click',function(){var t=$('#okCode').textContent,bt=this;function ok(){$('span',bt).textContent='Đã chép mã'}if(navigator.clipboard)navigator.clipboard.writeText(t).then(ok,ok);else ok()});
  go(0);
}
})();

/* bản đồ khu vực trên trang dự án */
(function(){var K=window.KN,z=K&&K.$$('.zmap .z');if(!z||!z.length)return;var sel=K.$('#pfK');
function mark(){z.forEach(function(x){var on=x.getAttribute('data-zone')===sel.value;x.classList.toggle('on',on);x.setAttribute('aria-pressed',on)})}
function set(v){sel.value=v;sel.dispatchEvent(new Event('change',{bubbles:true}));mark()}
z.forEach(function(x){var k=x.getAttribute('data-zone'),n=K.PROJ.filter(function(p){return p.k===k}).length,c=x.querySelector('.cnt');if(c)c.textContent=n;
x.addEventListener('click',function(){set(sel.value===k?'all':k)});
x.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();set(sel.value===k?'all':k)}})});
sel.addEventListener('change',mark);var pr=K.$('#pfReset');if(pr)pr.addEventListener('click',function(){setTimeout(mark,0)});mark()})();
