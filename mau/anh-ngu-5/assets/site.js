/* Nhà Gạch English — JS dùng chung (mẫu giao diện) */
(function(){
var d=document,b=d.body,$=function(s,c){return (c||d).querySelector(s)},$$=function(s,c){return Array.prototype.slice.call((c||d).querySelectorAll(s))};
var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var NG=window.NG={$:$,$$:$$,RM:RM};

/* header + badge */
var hdr=$('#hdr'),badge=$('#ktBadge');
function onScroll(){var y=window.pageYOffset;if(hdr)hdr.classList.toggle('scrolled',y>8);if(badge)badge.classList.toggle('show',y>window.innerHeight*.85)}
addEventListener('scroll',onScroll,{passive:true});onScroll();

/* menu mobile */
var mn=$('#mnav'),bt=$('#burger'),cl=$('#mclose');
function openM(){mn.classList.add('open');mn.setAttribute('aria-hidden','false');bt.setAttribute('aria-expanded','true');b.classList.add('lock');setTimeout(function(){cl.focus()},60)}
function closeM(){if(!mn.classList.contains('open'))return;mn.classList.remove('open');mn.setAttribute('aria-hidden','true');bt.setAttribute('aria-expanded','false');b.classList.remove('lock');bt.focus()}
if(mn&&bt&&cl){bt.addEventListener('click',openM);cl.addEventListener('click',closeM);
 $$('a',mn).forEach(function(a){a.addEventListener('click',function(){b.classList.remove('lock')})});
 d.addEventListener('keydown',function(e){if(e.key==='Escape')closeM()});
 mn.addEventListener('keydown',function(e){if(e.key!=='Tab')return;var f=$$('a,button',mn),a=f[0],z=f[f.length-1];if(e.shiftKey&&d.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&d.activeElement===z){e.preventDefault();a.focus()}});
 var lw=innerWidth;addEventListener('resize',function(){if(innerWidth!==lw){lw=innerWidth;if(innerWidth>1180)closeM()}});
}

/* hiện dần */
var rv=$$('.rv');
if(!('IntersectionObserver' in window)||RM){rv.forEach(function(e){e.classList.add('in')})}
else{var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:.06});
 rv.forEach(function(e){var r=e.getBoundingClientRect();if(r.top<innerHeight)e.classList.add('in');else io.observe(e)})}
requestAnimationFrame(function(){d.documentElement.classList.add('loaded')});

/* con dấu xoay: dừng khi ra khỏi màn hình */
var seal=$('.seal .ring');
if(seal&&'IntersectionObserver' in window){new IntersectionObserver(function(es){seal.style.animationPlayState=es[0].isIntersecting?'running':'paused'}).observe(seal)}

/* tiện ích */
NG.vnd=function(n){return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g,'.')+'đ'};
NG.esc=function(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
NG.q=function(k){var m=new RegExp('[?&]'+k+'=([^&]*)').exec(location.search);return m?decodeURIComponent(m[1].replace(/\+/g,' ')):''};
NG.count=function(el,to,fmt,dur){fmt=fmt||function(x){return Math.round(x)};dur=dur||600;var tk=(el._c=(el._c||0)+1);
 setTimeout(function(){if(el._c===tk)el.textContent=fmt(to)},dur+150);
 if(RM||d.hidden){el.textContent=fmt(to);el._v=to;return}
 var from=el._v||0,t0=null;el._v=to;
 function f(t){if(!t0)t0=t;var p=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-p,3);if(el._c!==tk)return;el.textContent=fmt(from+(to-from)*e);if(p<1)requestAnimationFrame(f)}
 requestAnimationFrame(f)};

/* dữ liệu lớp dùng chung (mẫu) */
NG.LV={a1:'Khởi động · A1',a2:'Nền tảng · A2',b1:'Tự tin · B1',b2:'Vững vàng · B2',tn:'Thiếu niên 11–15'};
NG.CLS=[
 {id:'A1-S',lv:'a1',days:[1,3],t:'18:00',dur:90,ca:'chieu',on:5,tch:'Cô Ngọc Lan',seat:5},
 {id:'A1-T',lv:'a1',days:[2,4],t:'19:45',dur:90,ca:'toi',on:6,tch:'Thầy Oliver',seat:8},
 {id:'A2-S',lv:'a2',days:[2,4],t:'08:30',dur:90,ca:'sang',on:6,tch:'Cô Ngọc Lan',seat:3},
 {id:'A2-T',lv:'a2',days:[1,3],t:'19:45',dur:90,ca:'toi',on:5,tch:'Cô Amara',seat:6},
 {id:'A2-W',lv:'a2',days:[6],t:'09:00',dur:120,ca:'tuan',on:3,tch:'Thầy Minh Đức',seat:2},
 {id:'B1-T',lv:'b1',days:[2,4],t:'18:00',dur:90,ca:'chieu',on:5,tch:'Thầy Oliver',seat:4},
 {id:'B1-W',lv:'b1',days:[6,7],t:'14:00',dur:90,ca:'tuan',on:3,tch:'Cô Amara',seat:7},
 {id:'B1-N',lv:'b1',days:[3,5],t:'19:45',dur:90,ca:'toi',on:1,tch:'Thầy Minh Đức',seat:8},
 {id:'B2-T',lv:'b2',days:[1,5],t:'19:45',dur:90,ca:'toi',on:3,tch:'Thầy Oliver',seat:1},
 {id:'B2-W',lv:'b2',days:[7],t:'09:00',dur:120,ca:'tuan',on:4,tch:'Cô Amara',seat:5},
 {id:'TN-1',lv:'tn',days:[1,3],t:'17:00',dur:75,ca:'chieu',on:5,tch:'Cô Ngọc Lan',seat:4},
 {id:'TN-2',lv:'tn',days:[6],t:'15:30',dur:120,ca:'tuan',on:3,tch:'Thầy Minh Đức',seat:8}
];
NG.DN=['','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy','Chủ Nhật'];
NG.DS=['','T2','T3','T4','T5','T6','T7','CN'];
NG.cls=function(id){for(var i=0;i<NG.CLS.length;i++)if(NG.CLS[i].id===id)return NG.CLS[i];return null};
NG.days=function(c){return c.days.map(function(x){return NG.DS[x]}).join(', ')};
})();
