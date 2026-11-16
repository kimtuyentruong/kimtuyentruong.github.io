/* Lá Me English — JS dùng chung (mẫu giao diện) */
(function(){
var d=document,b=d.body,$=function(s,c){return (c||d).querySelector(s)},$$=function(s,c){return Array.prototype.slice.call((c||d).querySelectorAll(s))};
var RM=!!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
var LM=window.LM={$:$,$$:$$,RM:RM};
LM.esc=function(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
LM.pad=function(n){return (n<10?'0':'')+n};
LM.date=function(dt){return LM.pad(dt.getDate())+'/'+LM.pad(dt.getMonth()+1)+'/'+dt.getFullYear()};
LM.money=function(n){return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,'.')+'đ'};

/* header + badge */
var hdr=$('#hdr'),badge=$('#ktBadge');
function onScroll(){var y=window.pageYOffset;if(hdr)hdr.classList.toggle('scrolled',y>8);if(badge)badge.classList.toggle('show',y>window.innerHeight*.85)}
addEventListener('scroll',onScroll,{passive:true});onScroll();

/* menu mobile */
var mn=$('#mnav'),bt=$('#burger'),cl=$('#mclose');
function openM(){mn.classList.add('open');mn.setAttribute('aria-hidden','false');bt.setAttribute('aria-expanded','true');b.classList.add('lock');setTimeout(function(){cl.focus()},60)}
function closeM(){if(!mn.classList.contains('open'))return;mn.classList.remove('open');mn.setAttribute('aria-hidden','true');bt.setAttribute('aria-expanded','false');b.classList.remove('lock');bt.focus()}
LM.closeMenu=closeM;
if(mn&&bt&&cl){bt.addEventListener('click',openM);cl.addEventListener('click',closeM);
 $$('a',mn).forEach(function(a){a.addEventListener('click',function(){b.classList.remove('lock')})});
 d.addEventListener('keydown',function(e){if(e.key==='Escape')closeM()});
 mn.addEventListener('keydown',function(e){if(e.key!=='Tab')return;var f=$$('a,button',mn),a=f[0],z=f[f.length-1];if(e.shiftKey&&d.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&d.activeElement===z){e.preventDefault();a.focus()}});
 var lw=innerWidth;addEventListener('resize',function(){if(innerWidth!==lw){lw=innerWidth;if(innerWidth>1080)closeM()}});
}

/* hiện dần */
var rv=$$('.rv');
if(!('IntersectionObserver' in window)||RM){d.documentElement.classList.add('no-io');rv.forEach(function(e){e.classList.add('in')})}
else{var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:.06});
 rv.forEach(function(e){var r=e.getBoundingClientRect();if(r.top<innerHeight)e.classList.add('in');else io.observe(e)})}
requestAnimationFrame(function(){requestAnimationFrame(function(){d.documentElement.classList.add('loaded')})});

/* độ dài nét vẽ tay */
$$('.sq').forEach(function(p){try{var l=Math.ceil(p.getTotalLength());p.style.setProperty('--len',l)}catch(e){}});

/* hỏi đáp */
LM.acc=function(root){$$('.acc-b',root).forEach(function(btn){btn.addEventListener('click',function(){var it=btn.closest('.acc-i'),o=!it.classList.contains('open');it.classList.toggle('open',o);btn.setAttribute('aria-expanded',o)})})};
$$('.acc').forEach(LM.acc);

/* đếm số */
LM.count=function(el,to,dur){var tk=(el._c=(el._c||0)+1);if(RM||d.hidden){el.textContent=to;return}
 var from=parseFloat(el.textContent)||0,t0=null;dur=dur||600;
 setTimeout(function(){if(el._c===tk)el.textContent=to},dur+150);
 function f(t){if(el._c!==tk)return;if(!t0)t0=t;var p=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-p,3);el.textContent=Math.round(from+(to-from)*e);if(p<1)requestAnimationFrame(f)}
 requestAnimationFrame(f)};

/* tab có bàn phím */
LM.tabs=function(list,onSel){var ts=$$('[role="tab"]',list);
 function sel(t,focus){ts.forEach(function(x){var on=x===t;x.setAttribute('aria-selected',on);x.tabIndex=on?0:-1;var p=d.getElementById(x.getAttribute('aria-controls'));if(p){p.hidden=!on;if(on){p.classList.remove('swap');void p.offsetWidth;p.classList.add('swap')}}});if(focus)t.focus();if(onSel)onSel(t)}
 ts.forEach(function(t,i){t.addEventListener('click',function(){sel(t)});t.addEventListener('keydown',function(e){var k=e.key,n=null;if(k==='ArrowRight'||k==='ArrowDown')n=ts[(i+1)%ts.length];else if(k==='ArrowLeft'||k==='ArrowUp')n=ts[(i-1+ts.length)%ts.length];else if(k==='Home')n=ts[0];else if(k==='End')n=ts[ts.length-1];if(n){e.preventDefault();sel(n,true)}})});
 return sel};
})();
