/* Copperline English — JS dùng chung (mẫu giao diện) */
(function(){
var d=document,b=d.body,$=function(s,c){return (c||d).querySelector(s)},$$=function(s,c){return Array.prototype.slice.call((c||d).querySelectorAll(s))};
var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var CL=window.CL={$:$,$$:$$,RM:RM};

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

/* tiện ích */
CL.vnd=function(n){return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g,'.')+'đ'};
CL.esc=function(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
CL.count=function(el,to,fmt,dur){fmt=fmt||function(x){return Math.round(x)};dur=dur||650;var tk=(el._c=(el._c||0)+1);
 setTimeout(function(){if(el._c===tk)el.textContent=fmt(to)},dur+150);
 if(RM||d.hidden){el.textContent=fmt(to);el._v=to;return}
 var from=el._v||0,t0=null;el._v=to;
 function f(t){if(!t0)t0=t;var p=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-p,3);if(el._c!==tk)return;el.textContent=fmt(from+(to-from)*e);if(p<1)requestAnimationFrame(f)}
 requestAnimationFrame(f)};
CL.q=function(k){var m=new RegExp('[?&]'+k+'=([^&]*)').exec(location.search);return m?decodeURIComponent(m[1].replace(/\+/g,' ')):''};
})();
