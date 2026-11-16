/* Gieo Pilates & Yoga — JS dùng chung: menu, header, badge, hiện dần, lưu tạm, đếm số, tab */
(function(){
'use strict';
var $=function(s,c){return (c||document).querySelector(s)},$$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
var G=window.GIEO={$:$,$$:$$};
G.reduce=!!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);
var body=document.body,hd=$('#hd'),badge=$('#ktBadge'),burger=$('#burger'),mnav=$('#mnav');
function setMenu(open){
  body.classList.toggle('menu-open',open);body.classList.toggle('lock',open);
  if(burger){burger.setAttribute('aria-expanded',open);burger.setAttribute('aria-label',open?'Đóng menu':'Mở menu')}
  if(mnav){mnav.setAttribute('aria-hidden',!open);if(open){mnav.removeAttribute('inert')}else{mnav.setAttribute('inert','')}}
  if(open&&mnav){var f=mnav.querySelector('a');f&&f.focus({preventScroll:true})}
}
if(burger){burger.addEventListener('click',function(){setMenu(!body.classList.contains('menu-open'))})}
if(mnav){$$('a',mnav).forEach(function(a){a.addEventListener('click',function(){setMenu(false)})})}
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&body.classList.contains('menu-open')){setMenu(false);burger&&burger.focus()}});
var lastW=window.innerWidth;
window.addEventListener('resize',function(){if(window.innerWidth===lastW)return;lastW=window.innerWidth;if(lastW>1024&&body.classList.contains('menu-open'))setMenu(false)});
var ticking=false,par=$$('[data-par]');
function onScroll(){
  var y=window.pageYOffset;
  if(hd)hd.classList.toggle('scrolled',y>8);
  if(badge)badge.classList.toggle('show',y>window.innerHeight*.85);
  if(!G.reduce&&y<window.innerHeight*1.4){par.forEach(function(el){el.style.transform='translate3d(0,'+(y*parseFloat(el.getAttribute('data-par'))).toFixed(1)+'px,0)'})}
  ticking=false;
}
window.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});
onScroll();
/* hiện dần */
var rv=$$('.rv');
if('IntersectionObserver' in window){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -6% 0px',threshold:.06});
  rv.forEach(function(el){var r=el.getBoundingClientRect();if(r.top<window.innerHeight){el.classList.add('in')}else{io.observe(el)}});
}else{rv.forEach(function(el){el.classList.add('in')})}
/* lưu tạm theo mẫu (khoá riêng) */
var KEY='gieo-pilates-2:';
G.get=function(k,d){try{var v=localStorage.getItem(KEY+k);return v?JSON.parse(v):d}catch(e){return d}};
G.set=function(k,v){try{localStorage.setItem(KEY+k,JSON.stringify(v))}catch(e){}};
G.money=function(n){return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g,'.')+'đ'};
G.count=function(el,to,fmt){
  fmt=fmt||function(v){return Math.round(v)};
  var had=el.hasAttribute('data-v'),from=parseFloat(el.getAttribute('data-v')||0);el.setAttribute('data-v',to);
  if(!had||G.reduce||from===to){el.textContent=fmt(to);return}
  var t0=null,d=480;
  function step(t){if(!t0)t0=t;var p=Math.min(1,(t-t0)/d),e=1-Math.pow(1-p,3);el.textContent=fmt(from+(to-from)*e);if(p<1)requestAnimationFrame(step)}
  requestAnimationFrame(step);
};
/* tab dùng chung (role=tablist, phím mũi tên) */
G.tabs=function(list,onChange){
  var tabs=$$('[role=tab]',list);
  function sel(t,focus){
    tabs.forEach(function(x){var on=x===t;x.setAttribute('aria-selected',on);x.tabIndex=on?0:-1;var p=document.getElementById(x.getAttribute('aria-controls'));if(p){p.hidden=!on}});
    if(focus)t.focus();if(onChange)onChange(t);
  }
  tabs.forEach(function(t,i){
    t.addEventListener('click',function(){sel(t)});
    t.addEventListener('keydown',function(e){var k=e.key,n=null;if(k==='ArrowRight'||k==='ArrowDown')n=tabs[(i+1)%tabs.length];if(k==='ArrowLeft'||k==='ArrowUp')n=tabs[(i-1+tabs.length)%tabs.length];if(k==='Home')n=tabs[0];if(k==='End')n=tabs[tabs.length-1];if(n){e.preventDefault();sel(n,true)}});
  });
  return sel;
};
var y=$('#year');if(y)y.textContent=new Date().getFullYear();
})();
