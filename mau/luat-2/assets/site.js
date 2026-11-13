/* Hiên Nhà — JS dùng chung (mẫu). Không thư viện ngoài. */
(function(){
'use strict';
var d=document,root=d.documentElement,body=d.body;
root.classList.add('js');
function $(s,c){return (c||d).querySelector(s)}
function $$(s,c){return Array.prototype.slice.call((c||d).querySelectorAll(s))}
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function vnd(n){return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g,'.')+'đ'}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}

/* Header, menu mobile, badge */
var hdr=$('#hdr'),badge=$('#ktBadge'),burger=$('#burger'),mnav=$('#mnav');
function onScroll(){var y=window.pageYOffset;if(hdr)hdr.classList.toggle('scrolled',y>8);if(badge)badge.classList.toggle('show',y>window.innerHeight*.85)}
window.addEventListener('scroll',onScroll,{passive:true});onScroll();
function setMenu(open){if(!burger||!mnav)return;burger.setAttribute('aria-expanded',open?'true':'false');burger.setAttribute('aria-label',open?'Đóng menu':'Mở menu');mnav.classList.toggle('open',open);body.classList.toggle('lock',open);mnav.setAttribute('aria-hidden',open?'false':'true');if(open){var f=$('a',mnav);f&&f.focus()}}
if(burger){burger.addEventListener('click',function(){setMenu(burger.getAttribute('aria-expanded')!=='true')})}
d.addEventListener('keydown',function(e){if(e.key==='Escape'&&burger&&burger.getAttribute('aria-expanded')==='true'){setMenu(false);burger.focus()}});
if(mnav)$$('a',mnav).forEach(function(a){a.addEventListener('click',function(){setMenu(false)})});
var lastW=window.innerWidth;window.addEventListener('resize',function(){if(window.innerWidth!==lastW){lastW=window.innerWidth;if(window.innerWidth>1180)setMenu(false)}});
$$('[data-year]').forEach(function(e){e.textContent=new Date().getFullYear()});

/* Hiện dần */
var rv=$$('.rv');
if('IntersectionObserver' in window&&!reduce){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -5% 0px',threshold:0});
  rv.forEach(function(e){var r=e.getBoundingClientRect();if(r.top<window.innerHeight)e.classList.add('in');else io.observe(e)});
}else rv.forEach(function(e){e.classList.add('in')});

/* Đếm số mượt */
function tween(el,to,fmt){if(reduce){el.textContent=fmt(to);return}var from=parseFloat(el.getAttribute('data-v')||'0'),t0=null;el.setAttribute('data-v',to);function step(t){if(!t0)t0=t;var p=Math.min(1,(t-t0)/450),e=1-Math.pow(1-p,3);el.textContent=fmt(from+(to-from)*e);if(p<1)requestAnimationFrame(step)}requestAnimationFrame(step)}

/* ===== Trang chủ: Bạn cần chuẩn bị giấy tờ gì? ===== */
var tool=$('#docTool');
if(tool){
  var DOCS={
    'thuan-tinh':{t:'Ly hôn thuận tình',n:'Hai bên đã đồng ý ly hôn và thoả thuận được việc nuôi con, tài sản.',l:[
      ['Đơn yêu cầu công nhận thuận tình ly hôn','Có chữ ký của cả hai vợ chồng; văn phòng soạn giúp theo mẫu của toà.'],
      ['Giấy chứng nhận kết hôn (bản chính)','Nếu thất lạc, xin trích lục tại nơi đã đăng ký kết hôn.'],
      ['Căn cước của hai vợ chồng (bản sao)','Bản sao có chứng thực hoặc mang bản chính để đối chiếu.'],
      ['Thông tin nơi cư trú','Xem trên ứng dụng VNeID hoặc xin xác nhận cư trú.']]},
    'don-phuong':{t:'Ly hôn đơn phương',n:'Một bên muốn ly hôn, bên kia chưa đồng ý hoặc không liên lạc được.',l:[
      ['Đơn khởi kiện ly hôn','Nêu rõ lý do, yêu cầu về con và tài sản.'],
      ['Giấy chứng nhận kết hôn (bản chính)','Hoặc trích lục kết hôn nếu bản chính bị mất.'],
      ['Căn cước của người nộp đơn (bản sao)',''],
      ['Thông tin nơi cư trú của bên kia','Toà nhận đơn theo nơi bị đơn cư trú, làm việc.'],
      ['Tài liệu cho thấy hôn nhân trầm trọng (nếu có)','Tin nhắn, biên bản hoà giải ở tổ dân phố… chỉ nộp khi cần.']]},
    'thua-ke':{t:'Khai nhận thừa kế nhà đất',n:'Cha mẹ hoặc người thân mất, để lại nhà đất chưa sang tên.',l:[
      ['Giấy chứng tử hoặc trích lục khai tử','Của người để lại di sản.'],
      ['Di chúc (nếu có)','Bản chính; nếu không có di chúc thì chia theo pháp luật.'],
      ['Giấy tờ chứng minh quan hệ','Giấy khai sinh, giấy chứng nhận kết hôn của người thừa kế.'],
      ['Giấy chứng nhận quyền sử dụng đất (sổ đỏ, sổ hồng)','Bản chính của nhà đất là di sản.'],
      ['Căn cước của tất cả người thừa kế','Người không đến được có thể làm giấy uỷ quyền.']]},
    'tranh-chap':{t:'Tranh chấp ranh giới, lối đi',n:'Hàng xóm lấn đất, tranh chấp lối đi chung, ranh giới chưa rõ.',l:[
      ['Giấy chứng nhận hoặc giấy tờ về đất','Sổ đỏ, giấy tay mua bán, biên lai thuế đất qua các năm.'],
      ['Trích lục bản đồ địa chính','Xin tại văn phòng đăng ký đất đai.'],
      ['Ảnh chụp, video hiện trạng','Ghi ngày chụp; chụp cả mốc ranh, tường rào.'],
      ['Biên bản hoà giải tại UBND phường, xã','Nhiều loại tranh chấp đất phải qua bước này trước khi khởi kiện.'],
      ['Căn cước của người đứng tên đất','']]},
    'tang-cho':{t:'Tặng cho nhà đất cho con',n:'Bố mẹ muốn sang tên nhà đất cho con khi còn khoẻ.',l:[
      ['Giấy chứng nhận quyền sử dụng đất (bản chính)',''],
      ['Căn cước của bên tặng và bên nhận',''],
      ['Giấy chứng nhận kết hôn của bố mẹ','Hoặc giấy xác nhận tình trạng hôn nhân nếu độc thân, goá.'],
      ['Giấy khai sinh của con','Để chứng minh quan hệ cha mẹ, con khi kê khai miễn thuế.'],
      ['Dự thảo hợp đồng tặng cho (nếu đã có)','Văn phòng rà giúp trước khi ra tổ chức hành nghề công chứng.']]}
  };
  var EXTRA={
    con:['Giấy khai sinh của các con (bản sao)','Kèm thoả thuận ai nuôi con, mức cấp dưỡng.'],
    nha:['Giấy tờ nhà đất chung (bản sao)','Sổ đỏ, hợp đồng mua bán, chứng từ trả tiền.'],
    xa:['Giấy uỷ quyền hoặc thông tin liên lạc','Nếu có người ở xa, ở nước ngoài, cần trao đổi trước về cách nộp.']
  };
  var cur='thuan-tinh',list=$('#docList'),title=$('#docTitle'),note=$('#docNote'),bar=$('#docBar'),cnt=$('#docCount');
  function render(){
    var s=DOCS[cur],items=s.l.slice();
    $$('.toggles input',tool).forEach(function(c){if(c.checked&&EXTRA[c.value])items.push(EXTRA[c.value].concat(['x']))});
    title.textContent=s.t;note.textContent=s.n;
    list.innerHTML=items.map(function(it,i){return '<li style="animation-delay:'+(i*50)+'ms"><label'+(it[2]?' class="extra"':'')+'><input type="checkbox"><span><b>'+esc(it[0])+'</b>'+(it[1]?'<small>'+esc(it[1])+'</small>':'')+'</span></label></li>'}).join('');
    upd();
  }
  function upd(){var all=$$('input',list),ok=all.filter(function(c){return c.checked}).length;cnt.textContent=ok+'/'+all.length;bar.style.width=(all.length?ok/all.length*100:0)+'%'}
  list.addEventListener('change',upd);
  $$('.sit button',tool).forEach(function(b){b.addEventListener('click',function(){cur=b.getAttribute('data-k');$$('.sit button',tool).forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});render()})});
  $$('.toggles input',tool).forEach(function(c){c.addEventListener('change',render)});
  render();
}

/* ===== Dịch vụ: tab cuộn + ước tính phí ===== */
var tabs=$('#svcTabs');
if(tabs){
  var links=$$('a',tabs),secs=links.map(function(a){return $(a.getAttribute('href'))});
  if('IntersectionObserver' in window){
    var so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var id='#'+e.target.id;links.forEach(function(a){var on=a.getAttribute('href')===id;a.classList.toggle('on',on);if(on){a.setAttribute('aria-current','true');var p=a.parentNode;p.scrollTo&&p.scrollTo({left:a.offsetLeft-16,behavior:reduce?'auto':'smooth'})}else a.removeAttribute('aria-current')})}})},{rootMargin:'-45% 0px -50% 0px'});
    secs.forEach(function(s){s&&so.observe(s)});
  }
}
var fee=$('#fee');
if(fee){
  var F={
    'ly-hon':{n:'Ly hôn thuận tình',base:6000000,pct:0,slider:false,days:'Khoảng 1–2 tháng',inc:'Soạn đơn, thoả thuận con và tài sản, đi cùng buổi hoà giải'},
    'chia-tai-san':{n:'Chia tài sản khi ly hôn',base:15000000,pct:.015,slider:true,days:'Khoảng 4–9 tháng',inc:'Rà soát nguồn gốc tài sản, thương lượng, đại diện tại toà'},
    'thua-ke':{n:'Khai nhận, chia thừa kế',base:5000000,pct:.004,slider:true,days:'Khoảng 1–2 tháng',inc:'Lập danh sách người thừa kế, chuẩn bị hồ sơ công chứng, sang tên'},
    'dat-dai':{n:'Tranh chấp đất đai',base:18000000,pct:.012,slider:true,days:'Khoảng 6–12 tháng',inc:'Hoà giải cơ sở, khởi kiện, theo vụ việc đến khi có bản án'},
    'cong-chung':{n:'Soạn, rà hợp đồng công chứng',base:1500000,pct:0,slider:false,days:'Khoảng 3–7 ngày',inc:'Soạn hoặc rà dự thảo, đi cùng ký tại tổ chức công chứng'}
  };
  var k='chia-tai-san',rng=$('#feeRange'),out=$('#feeVal'),tot=$('#feeTotal'),rg=$('#feeRangeTxt'),dName=$('#feeName'),dBase=$('#feeBase'),dPct=$('#feePct'),dDays=$('#feeDays'),dInc=$('#feeInc'),sl=$('#feeSlider'),cap=60000000;
  function feeCalc(){
    var s=F[k],v=+rng.value*100000000,pctFee=s.slider?Math.min(v*s.pct,cap):0,t=s.base+pctFee;
    rng.style.setProperty('--p',(rng.value/rng.max*100)+'%');
    out.textContent=+rng.value===0?'0đ':(v>=1e9?(v/1e9).toString().replace('.',',')+' tỷ đồng':vnd(v));
    rng.setAttribute('aria-valuetext',out.textContent);
    sl.style.opacity=s.slider?1:.4;rng.disabled=!s.slider;
    dName.textContent=s.n;dBase.textContent=vnd(s.base);dPct.textContent=s.slider?vnd(pctFee)+' ('+String(s.pct*100).replace('.',',')+'%)':'Không áp dụng';dDays.textContent=s.days;dInc.textContent=s.inc;
    tween(tot,t,vnd);rg.textContent='Dao động thực tế khoảng '+vnd(t*.85)+' – '+vnd(t*1.2);
  }
  $$('[data-fee]',fee).forEach(function(b){b.addEventListener('click',function(){k=b.getAttribute('data-fee');$$('[data-fee]',fee).forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});feeCalc()})});
  rng.addEventListener('input',feeCalc);feeCalc();
}

/* ===== Luật sư: lọc + hồ sơ ===== */
var lf=$('#lawFilter');
if(lf){
  var cards=$$('.law'),info=$('#lawCount');
  $$('button',lf).forEach(function(b){b.addEventListener('click',function(){var f=b.getAttribute('data-f'),n=0;$$('button',lf).forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});cards.forEach(function(c){var on=f==='all'||c.getAttribute('data-areas').indexOf(f)>-1;c.classList.toggle('hide',!on);if(on)n++});info.textContent='Đang hiện '+n+' luật sư'})});
  var dlg=$('#lawDlg');
  $$('[data-open]').forEach(function(b){b.addEventListener('click',function(){var t=$('#'+b.getAttribute('data-open'));if(!t||!dlg)return;$('#dlgBody').innerHTML=t.innerHTML;if(dlg.showModal){dlg.showModal();body.classList.add('lock')}else dlg.setAttribute('open','')})});
  if(dlg){dlg.addEventListener('close',function(){body.classList.remove('lock')});dlg.addEventListener('click',function(e){if(e.target===dlg||e.target.closest('.dlg-x'))dlg.close()})}
}

/* ===== Hỏi đáp: tìm + lọc ===== */
var faq=$('#faq');
if(faq){
  var qas=$$('.qa',faq),q=$('#faqQ'),sw=$('#faqSearch'),meta=$('#faqMeta'),empty=$('#faqEmpty'),topic='all';
  qas.forEach(function(it){var b=$('button',it);$$('[data-orig]',it).forEach(function(){});it._t=$('.q',it).textContent;it._a=$$('.ans p',it).map(function(p){return p.innerHTML});b.addEventListener('click',function(){var o=b.getAttribute('aria-expanded')!=='true';b.setAttribute('aria-expanded',o?'true':'false');it.classList.toggle('open',o)})});
  function norm(s){return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/đ/g,'d')}
  function hl(text,term){if(!term)return esc(text);var nt=norm(text),i=nt.indexOf(term);if(i<0)return esc(text);return esc(text.slice(0,i))+'<mark>'+esc(text.slice(i,i+term.length))+'</mark>'+esc(text.slice(i+term.length))}
  function run(){
    var term=norm(q.value.trim()),n=0;sw.classList.toggle('has',!!q.value);
    qas.forEach(function(it){
      var okT=topic==='all'||it.getAttribute('data-t')===topic,txt=norm(it._t+' '+$('.ans',it).textContent),okQ=!term||txt.indexOf(term)>-1,on=okT&&okQ;
      it.classList.toggle('hide',!on);$('.q',it).innerHTML=hl(it._t,term);
      if(on){n++;if(term&&n<=2){it.classList.add('open');$('button',it).setAttribute('aria-expanded','true')}}
    });
    meta.textContent=n?('Có '+n+' câu hỏi'+(term?' khớp “'+q.value.trim()+'”':'')):'';
    empty.classList.toggle('show',n===0);
  }
  q.addEventListener('input',run);
  $('.clr',sw).addEventListener('click',function(){q.value='';run();q.focus()});
  $$('#faqTopics button').forEach(function(b){b.addEventListener('click',function(){topic=b.getAttribute('data-t');$$('#faqTopics button').forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});run()})});
  $$('[data-suggest]').forEach(function(b){b.addEventListener('click',function(){q.value=b.getAttribute('data-suggest');run()})});
  run();
}

/* ===== Kiến thức: thanh đọc, mục lục, phản hồi ===== */
var art=$('#art');
if(art){
  var rb=$('#readBar'),toc=$$('.toc a'),hs=toc.map(function(a){return $(a.getAttribute('href'))}),tick=false;
  function prog(){tick=false;var r=art.getBoundingClientRect(),h=art.offsetHeight-window.innerHeight,p=Math.min(1,Math.max(0,-r.top/(h>0?h:1)));rb.style.transform='scaleX('+p+')';var cur=0;hs.forEach(function(h,i){if(h&&h.getBoundingClientRect().top<140)cur=i});toc.forEach(function(a,i){a.classList.toggle('on',i===cur)})}
  window.addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(prog)}},{passive:true});prog();
  var ck=$$('.art-check input'),ckOut=$('#ckOut');
  function ckU(){var n=ck.filter(function(c){return c.checked}).length;ckOut.textContent='Đã có '+n+'/'+ck.length+' giấy tờ'}
  ck.forEach(function(c){c.addEventListener('change',ckU)});ckU();
  var pr=$('#printBtn');pr&&pr.addEventListener('click',function(){window.print()});
  var cp=$('#copyBtn');cp&&cp.addEventListener('click',function(){var m=$('#fbMsg');function ok(){m.textContent='Đã chép đường dẫn bài viết.'}try{navigator.clipboard.writeText(location.href).then(ok,function(){m.textContent='Trình duyệt chưa cho chép, bạn chép trên thanh địa chỉ nhé.'})}catch(e){m.textContent='Trình duyệt chưa cho chép, bạn chép trên thanh địa chỉ nhé.'}});
  $$('[data-fb]').forEach(function(b){b.addEventListener('click',function(){$$('[data-fb]').forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});$('#fbMsg').textContent=b.getAttribute('data-fb')==='y'?'Cảm ơn bạn. Chúng tôi sẽ viết thêm các bài cùng chủ đề.':'Cảm ơn bạn. Bạn cần thêm phần nào, gửi câu hỏi ở trang Liên hệ nhé.'})});
}

/* ===== Liên hệ: form đặt lịch ===== */
var form=$('#bookForm');
if(form){
  var capEl=$('#capCode'),capVal='';
  function newCap(){var ch='ABCDEFGHJKMNPQRSTUVWXYZ23456789';capVal='';for(var i=0;i<5;i++)capVal+=ch[Math.floor(Math.random()*ch.length)];capEl.innerHTML=capVal.split('').map(function(c,i){return '<span style="transform:rotate('+((i%2?1:-1)*(4+i*2))+'deg) translateY('+(i%2?2:-2)+'px)">'+c+'</span>'}).join('');capEl.setAttribute('aria-label','Mã xác nhận: '+capVal.split('').join(' '))}
  newCap();$('#capRe').addEventListener('click',function(){newCap();$('#fCap').value='';$('#fCap').focus()});
  var date=$('#fDate'),t=new Date();t.setDate(t.getDate()+1);var iso=function(x){return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0')};date.min=iso(t);var mx=new Date();mx.setDate(mx.getDate()+45);date.max=iso(mx);
  var slotBox=$('#slots'),slot='';
  var SL=['08:30','09:30','10:30','14:00','15:00','16:00'];
  function drawSlots(){var v=date.value;slot='';if(!v){slotBox.innerHTML='<span class="muted" style="font-size:.92rem">Chọn ngày trước để xem giờ còn trống.</span>';return}var dt=new Date(v+'T00:00:00'),wd=dt.getDay();if(wd===0){slotBox.innerHTML='<span class="muted" style="font-size:.92rem">Chủ nhật văn phòng nghỉ, bạn vui lòng chọn ngày khác.</span>';return}var seed=dt.getDate();slotBox.innerHTML=SL.map(function(s,i){var off=(wd===6&&i>2)||((seed+i)%4===0);return '<button type="button" class="chip" aria-pressed="false" data-s="'+s+'"'+(off?' disabled aria-label="'+s+' đã kín"':'')+'>'+s+'</button>'}).join('')}
  date.addEventListener('change',function(){drawSlots();clr('fDate')});drawSlots();
  slotBox.addEventListener('click',function(e){var b=e.target.closest('button');if(!b||b.disabled)return;slot=b.getAttribute('data-s');$$('button',slotBox).forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});clr('slots')});
  var msg=$('#fMsg'),mc=$('#msgCount');msg.addEventListener('input',function(){mc.textContent=msg.value.length+'/500'});
  function fld(id){return $('#'+id).closest('.fld')}
  function setErr(id,m){var f=fld(id);f.classList.add('err');$('.msg',f).textContent=m;var i=$('#'+id);i.setAttribute&&i.setAttribute('aria-invalid','true')}
  function clr(id){var f=fld(id);if(!f)return;f.classList.remove('err');$('.msg',f).textContent='';var i=$('#'+id);i.removeAttribute&&i.removeAttribute('aria-invalid')}
  ['fName','fPhone','fEmail','fTopic','fCap','fAgree'].forEach(function(id){var e=$('#'+id);e.addEventListener('input',function(){clr(id)});e.addEventListener('change',function(){clr(id)})});
  form.addEventListener('submit',function(e){
    e.preventDefault();var errs=[];
    var nm=$('#fName').value.trim(),ph=$('#fPhone').value.replace(/[\s.-]/g,''),em=$('#fEmail').value.trim();
    if(nm.length<2){setErr('fName','Vui lòng nhập họ tên (ít nhất 2 ký tự).');errs.push('fName')}
    if(!/^(0|\+84)(3|5|7|8|9)\d{8}$/.test(ph)){setErr('fPhone','Số điện thoại chưa đúng, ví dụ 0900 000 000.');errs.push('fPhone')}
    if(em&&!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)){setErr('fEmail','Email chưa đúng định dạng.');errs.push('fEmail')}
    if(!$('#fTopic').value){setErr('fTopic','Vui lòng chọn việc cần tư vấn.');errs.push('fTopic')}
    if(!date.value){setErr('fDate','Bạn chọn ngày hẹn.');errs.push('fDate')}
    else if(!slot){setErr('slots','Bạn chọn một khung giờ còn trống.');errs.push('slots')}
    if($('#fCap').value.trim().toUpperCase()!==capVal){setErr('fCap','Mã xác nhận chưa khớp, bạn nhập lại hoặc đổi mã khác.');errs.push('fCap')}
    if(!$('#fAgree').checked){setErr('fAgree','Bạn cần đồng ý với cách xử lý dữ liệu để gửi yêu cầu.');errs.push('fAgree')}
    var sum=$('#formSum');
    if(errs.length){sum.textContent='Còn '+errs.length+' mục cần sửa. Các mục đó được đánh dấu đỏ bên dưới.';sum.classList.add('show');var first=$('#'+errs[0]);(first.tagName==='DIV'?$('button:not([disabled])',first)||first:first).focus();return}
    sum.classList.remove('show');
    var code='HN-'+String(Date.now()).slice(-5),ty=$('input[name=kieu]:checked',form);
    var dv=date.value.split('-');
    $('#doneCode').textContent=code;
    $('#doneList').innerHTML='<dt>Người hẹn</dt><dd>'+esc(nm)+'</dd><dt>Việc cần tư vấn</dt><dd>'+esc($('#fTopic').selectedOptions[0].text)+'</dd><dt>Thời gian</dt><dd>'+slot+', '+dv[2]+'/'+dv[1]+'/'+dv[0]+'</dd><dt>Hình thức</dt><dd>'+esc(ty?ty.getAttribute('data-n'):'')+'</dd>';
    $('#formWrap').hidden=true;var dn=$('#done');dn.classList.add('show');dn.setAttribute('tabindex','-1');dn.focus();dn.scrollIntoView({behavior:reduce?'auto':'smooth',block:'center'});
  });
  $('#again').addEventListener('click',function(){form.reset();slot='';drawSlots();newCap();mc.textContent='0/500';$('#done').classList.remove('show');$('#formWrap').hidden=false;$('#fName').focus()});
}
})();
