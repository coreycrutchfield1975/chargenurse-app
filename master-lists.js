(function(global){
'use strict';
var KEY='chargenurse-master-lists-v2';
var LEGACY_KEY='chargenurse-master-lists-v1';
var DEFAULTS={
  providers:['McCain','Cook'],
  transportation:['VA Vehicle','Wheelchair Van','Ambulance','Family','Private Vehicle','Taxi / Rideshare','Other'],
  escorts:['Nursing','CNA','Family','Veteran Independent','Driver Only','Other'],
  clinics:['Primary Care','Cardiology','Neurology','Dental','Audiology','Optometry / Vision','Mental Health','Community Care','Other'],
  facilities:['VA Medical Center','Community Care Facility','Hospital','Clinic','Dental Office','Other'],
  appointmentReasons:['Routine Follow-up','New Patient Visit','Procedure','Imaging','Laboratory','Dental','Mental Health','Specialty Follow-up','Other']
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
function normalized(data){
  data=data||{};
  var out={};
  Object.keys(DEFAULTS).forEach(function(key){
    out[key]=clean(data[key]&&data[key].length?data[key]:DEFAULTS[key])
  });
  return out
}
function load(){
  var saved=parse(localStorage.getItem(KEY),null);
  if(!saved){
    var legacy=parse(localStorage.getItem(LEGACY_KEY),{});
    saved=Object.assign({},DEFAULTS,legacy);
    localStorage.setItem(KEY,JSON.stringify(normalized(saved)))
  }
  return normalized(saved)
}
function save(data){
  var next=normalized(data);
  localStorage.setItem(KEY,JSON.stringify(next));
  global.dispatchEvent(new CustomEvent('chargenurse:masterlists',{detail:next}));
  return next
}
function items(key){return (load()[key]||[]).slice()}
function add(key,name){var d=load();d[key]=(d[key]||[]).concat([name]);return save(d)}
function update(key,oldName,newName){
  var d=load(),oldKey=String(oldName||'').trim().toLowerCase();
  d[key]=(d[key]||[]).map(function(x){return x.toLowerCase()===oldKey?newName:x});
  return save(d)
}
function remove(key,name){
  var d=load(),needle=String(name||'').trim().toLowerCase();
  d[key]=(d[key]||[]).filter(function(x){return x.toLowerCase()!==needle});
  return save(d)
}
function options(key,selected){
  var values=items(key);
  if(selected&&!values.some(function(x){return x.toLowerCase()===String(selected).toLowerCase()}))values.push(selected);
  return values.map(function(x){return '<option value="'+String(x).replace(/"/g,'&quot;')+'"></option>'}).join('')
}
function fill(id,key,selected){
  var el=document.getElementById(id);
  if(el)el.innerHTML=options(key,selected)
}
global.ChargeNurseLists={
  load:load,save:save,items:items,add:add,update:update,remove:remove,
  options:options,fill:fill,defaults:DEFAULTS,
  providers:function(){return items('providers')},
  addProvider:function(name){return add('providers',name)},
  updateProvider:function(oldName,newName){return update('providers',oldName,newName)},
  removeProvider:function(name){return remove('providers',name)},
  providerOptions:function(selected){return options('providers',selected)},
  fillProviderList:function(id,selected){return fill(id,'providers',selected)}
};
})(window);
