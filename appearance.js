(function(){
'use strict';
var KEY='clcAppearanceV1';
var defaults={source:'',name:'System Default',overlay:58,fit:'cover',position:'center center'};
function get(){try{return Object.assign({},defaults,JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(e){return Object.assign({},defaults)}}
function save(v){localStorage.setItem(KEY,JSON.stringify(Object.assign({},get(),v)));apply()}
function apply(){var a=get(),b=document.body;if(!b)return;var base='radial-gradient(circle at 10% 5%,#123d60 0,transparent 30%),linear-gradient(145deg,#06101b,#0b1d2c 55%,#07131f)';if(a.source){var shade=Math.max(0,Math.min(90,Number(a.overlay)||0))/100;b.style.backgroundImage='linear-gradient(rgba(3,12,20,'+shade+'),rgba(3,12,20,'+shade+')),url("'+String(a.source).replace(/"/g,'%22')+'")';b.style.backgroundSize=a.fit||'cover';b.style.backgroundPosition=a.position||'center center';b.style.backgroundAttachment='fixed';b.style.backgroundRepeat='no-repeat'}else{b.style.backgroundImage=base;b.style.backgroundSize='auto';b.style.backgroundPosition='initial';b.style.backgroundAttachment='initial';b.style.backgroundRepeat='initial'}document.documentElement.dataset.customBackground=a.source?'true':'false';window.dispatchEvent(new CustomEvent('clcappearancechange',{detail:a}))}
function reset(){localStorage.removeItem(KEY);apply()}
window.CLCAppearance={key:KEY,get:get,save:save,apply:apply,reset:reset};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();
})();