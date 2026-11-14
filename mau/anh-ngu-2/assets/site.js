/* Vellum IELTS — JS dùng chung (mẫu giao diện) */
(function(){
var d=document,b=d.body,$=function(s,c){return (c||d).querySelector(s)},$$=function(s,c){return Array.prototype.slice.call((c||d).querySelectorAll(s))};
var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
window.VL={$:$,$$:$$,RM:RM};

/* header + badge */
var hdr=$('#hdr'),badge=$('#ktBadge');
function onScroll(){var y=window.pageYOffset;if(hdr)hdr.classList.toggle('scrolled',y>8);if(badge)badge.classList.toggle('show',y>window.innerHeight*.85)}
addEventListener('scroll',onScroll,{passive:true});onScroll();

/* menu mobile */
var mn=$('#mnav'),bt=$('#burger'),cl=$('#mclose');
function openM(){mn.classList.add('open');mn.setAttribute('aria-hidden','false');bt.setAttribute('aria-expanded','true');b.classList.add('lock');setTimeout(function(){cl.focus()},60)}
function closeM(){if(!mn.classList.contains('open'))return;mn.classList.remove('open');mn.setAttribute('aria-hidden','true');bt.setAttribute('aria-expanded','false');b.classList.remove('lock');bt.focus()}
if(mn&&bt){bt.addEventListener('click',openM);cl.addEventListener('click',closeM);
 $$('a',mn).forEach(function(a){a.addEventListener('click',function(){b.classList.remove('lock')})});
 d.addEventListener('keydown',function(e){if(e.key==='Escape'){closeM();if(window.VL.closeDlg)window.VL.closeDlg()}});
 mn.addEventListener('keydown',function(e){if(e.key!=='Tab')return;var f=$$('a,button',mn),a=f[0],z=f[f.length-1];if(e.shiftKey&&d.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&d.activeElement===z){e.preventDefault();a.focus()}});
 var lw=innerWidth;addEventListener('resize',function(){if(innerWidth!==lw){lw=innerWidth;if(innerWidth>960)closeM()}});
}

/* hiện dần */
var rv=$$('.rv');
if(!('IntersectionObserver' in window)||RM){rv.forEach(function(e){e.classList.add('in')})}
else{var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:.08});
 rv.forEach(function(e){var r=e.getBoundingClientRect();if(r.top<innerHeight)e.classList.add('in');else io.observe(e)})}
requestAnimationFrame(function(){d.documentElement.classList.add('loaded')});

/* đếm số */
window.VL.count=function(el,to,dec,dur){dec=dec||0;var tk=(el._c=(el._c||0)+1);setTimeout(function(){if(el._c===tk)el.textContent=to.toFixed(dec)},(dur||700)+120);if(RM||d.hidden){el.textContent=to.toFixed(dec);return}
 var from=parseFloat(el.textContent)||0,t0=null;dur=dur||700;
 function f(t){if(!t0)t0=t;var p=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-p,3);if(el._c!==tk)return;el.textContent=(from+(to-from)*e).toFixed(dec);if(p<1)requestAnimationFrame(f)}
 requestAnimationFrame(f)};

/* làm tròn band theo cách chính thức: .25 lên .5, .75 lên số tròn */
window.VL.round=function(avg){var x=Math.round(avg*1000)/1000,fl=Math.floor(x),f=x-fl;return f<.25?fl:(f<.75?fl+.5:fl+1)};
window.VL.fmt=function(n){return n.toFixed(1)};
window.VL.esc=function(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
})();
