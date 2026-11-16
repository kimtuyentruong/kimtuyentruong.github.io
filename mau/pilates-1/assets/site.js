/* Lụa Pilates Atelier — JS dùng chung: menu, header, badge, hiện dần, lưu tạm */
(function(){
'use strict';
var $=function(s,c){return (c||document).querySelector(s)},$$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
window.LUA={$:$,$$:$$};
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
var ticking=false;
function onScroll(){var y=window.pageYOffset;if(hd)hd.classList.toggle('scrolled',y>8);if(badge)badge.classList.toggle('show',y>window.innerHeight*.85);ticking=false}
window.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});
onScroll();
/* hiện dần */
var rv=$$('.rv');
if('IntersectionObserver' in window){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -6% 0px',threshold:.06});
  rv.forEach(function(el){var r=el.getBoundingClientRect();if(r.top<window.innerHeight){el.classList.add('in')}else{io.observe(el)}});
}else{rv.forEach(function(el){el.classList.add('in')})}
/* lưu tạm theo mẫu */
var KEY='lua-pilates-1:';
LUA.get=function(k,d){try{var v=localStorage.getItem(KEY+k);return v?JSON.parse(v):d}catch(e){return d}};
LUA.set=function(k,v){try{localStorage.setItem(KEY+k,JSON.stringify(v))}catch(e){}};
LUA.money=function(n){return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g,'.')+'đ'};
LUA.reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
LUA.count=function(el,to,fmt){
  fmt=fmt||function(v){return Math.round(v)};
  var had=el.hasAttribute('data-v'),from=parseFloat(el.getAttribute('data-v')||0);el.setAttribute('data-v',to);
  if(!had){el.textContent=fmt(to);return}
  if(LUA.reduce||from===to){el.textContent=fmt(to);return}
  var t0=null,d=450;
  function step(t){if(!t0)t0=t;var p=Math.min(1,(t-t0)/d),e=1-Math.pow(1-p,3);el.textContent=fmt(from+(to-from)*e);if(p<1)requestAnimationFrame(step)}
  requestAnimationFrame(step);
};
var y=$('#year');if(y)y.textContent=new Date().getFullYear();
})();
