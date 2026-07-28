(function(global){
'use strict';
var KEY='chargenurse-master-lists-v1';
var DEFAULTS={
  providers:['McCain','Cook']
};
function parse(v,f){try{return v?JSON.parse(v):f}catch(e){return f}}
function clean(items){
  var seen={};
  return (items||[]).map(function(x){return String(x||'').trim()}).filter(function(x){
    var k=x.toLowerCase();
    if(!x||seen[k])return false;
    seen[k]=true;return true
  })
}
function load(){
  var saved=parse(localStorage.getItem(KEY),{});
  return {providers:clean(saved.providers&&saved.providers.length?saved.providers:DEFAULTS.providers)}
}
function save(data){
  var next={providers:clean(data.providers)};
  localStorage.setItem(KEY,JSON.stringify(next));
  global.dispatchEvent(new CustomEvent('chargenurse:masterlists',{detail:next}));
  return next
}
function providers(){return load().providers.slice()}
function addProvider(name){var d=load();d.providers.push(name);return save(d)}
function updateProvider(oldName,newName){
  var d=load(),oldKey=String(oldName||'').trim().toLowerCase();
  d.providers=d.providers.map(function(x){return x.toLowerCase()===oldKey?newName:x});
  return save(d)
}
function removeProvider(name){
  var d=load(),key=String(name||'').trim().toLowerCase();
  d.providers=d.providers.filter(function(x){return x.toLowerCase()!==key});
  return save(d)
}
function providerOptions(selected){
  var values=providers();
  if(selected&&!values.some(function(x){return x.toLowerCase()===String(selected).toLowerCase()}))values.push(selected);
  return values.map(function(x){return '<option value="'+String(x).replace(/"/g,'&quot;')+'"></option>'}).join('')
}
function fillProviderList(id,selected){
  var el=document.getElementById(id);
  if(el)el.innerHTML=providerOptions(selected)
}
global.ChargeNurseLists={load:load,save:save,providers:providers,addProvider:addProvider,updateProvider:updateProvider,removeProvider:removeProvider,providerOptions:providerOptions,fillProviderList:fillProviderList,defaults:DEFAULTS};
})(window);
