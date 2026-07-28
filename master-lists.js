(function(global){
'use strict';
var KEY='chargenurse-master-lists-v3';
var LEGACY_KEYS=['chargenurse-master-lists-v2','chargenurse-master-lists-v1'];
var DEFAULTS={
  providers:['McCain','Cook'],
  transportation:['VA Vehicle','Wheelchair Van','Ambulance','Family','Private Vehicle','Taxi / Rideshare','Other'],
  escorts:['Nursing','CNA','Family','Veteran Independent','Driver Only','Other'],
  clinics:['Primary Care','Cardiology','Neurology','Dental','Audiology','Optometry / Vision','Mental Health','Community Care','Other'],
  facilities:['VA Medical Center','Community Care Facility','Hospital','Clinic','Dental Office','Other'],
  appointmentReasons:['Routine Follow-up','New Patient Visit','Procedure','Imaging','Laboratory','Dental','Mental Health','Specialty Follow-up','Other']
};
var DEFAULT_PROFILES={
  McCain:{clinic:'',facility:'',phone:'',fax:''},
  Cook:{clinic:'',facility:'',phone:'',fax:''}
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
function cleanProfile(p){
  p=p||{};
  return {
    clinic:String(p.clinic||'').trim(),
    facility:String(p.facility||'').trim(),
    phone:String(p.phone||'').trim(),
    fax:String(p.fax||'').trim()
  }
}
function normalized(data){
  data=data||{};
  var out={};
  Object.keys(DEFAULTS).forEach(function(key){
    out[key]=clean(data[key]&&data[key].length?data[key]:DEFAULTS[key])
  });
  out.providerProfiles={};
  var source=data.providerProfiles||{};
  out.providers.forEach(function(name){
    out.providerProfiles[name]=cleanProfile(source[name]||source[Object.keys(source).find(function(k){return k.toLowerCase()===name.toLowerCase()})]||DEFAULT_PROFILES[name]||{})
  });
  return out
}
function load(){
  var saved=parse(localStorage.getItem(KEY),null);
  if(!saved){
    for(var i=0;i<LEGACY_KEYS.length&&!saved;i++)saved=parse(localStorage.getItem(LEGACY_KEYS[i]),null);
    saved=saved||{};
    saved=Object.assign({},DEFAULTS,saved);
    saved.providerProfiles=saved.providerProfiles||DEFAULT_PROFILES;
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
function add(key,name){
  var d=load();d[key]=(d[key]||[]).concat([name]);
  if(key==='providers')d.providerProfiles[name]=cleanProfile({});
  return save(d)
}
function update(key,oldName,newName){
  var d=load(),oldKey=String(oldName||'').trim().toLowerCase();
  d[key]=(d[key]||[]).map(function(x){return x.toLowerCase()===oldKey?newName:x});
  if(key==='providers'){
    var actual=Object.keys(d.providerProfiles||{}).find(function(k){return k.toLowerCase()===oldKey});
    var profile=actual?d.providerProfiles[actual]:{};
    if(actual)delete d.providerProfiles[actual];
    d.providerProfiles[newName]=cleanProfile(profile)
  }
  return save(d)
}
function remove(key,name){
  var d=load(),needle=String(name||'').trim().toLowerCase();
  d[key]=(d[key]||[]).filter(function(x){return x.toLowerCase()!==needle});
  if(key==='providers'){
    Object.keys(d.providerProfiles||{}).forEach(function(k){if(k.toLowerCase()===needle)delete d.providerProfiles[k]})
  }
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
function providerProfile(name){
  var d=load(),needle=String(name||'').trim().toLowerCase(),key=Object.keys(d.providerProfiles||{}).find(function(k){return k.toLowerCase()===needle});
  return cleanProfile(key?d.providerProfiles[key]:{})
}
function saveProviderProfile(name,profile){
  var d=load(),needle=String(name||'').trim().toLowerCase(),key=d.providers.find(function(x){return x.toLowerCase()===needle})||String(name||'').trim();
  if(!key)return d;
  if(!d.providers.some(function(x){return x.toLowerCase()===needle}))d.providers.push(key);
  d.providerProfiles[key]=cleanProfile(profile);
  return save(d)
}
global.ChargeNurseLists={
  load:load,save:save,items:items,add:add,update:update,remove:remove,
  options:options,fill:fill,defaults:DEFAULTS,
  providers:function(){return items('providers')},
  addProvider:function(name){return add('providers',name)},
  updateProvider:function(oldName,newName){return update('providers',oldName,newName)},
  removeProvider:function(name){return remove('providers',name)},
  providerOptions:function(selected){return options('providers',selected)},
  fillProviderList:function(id,selected){return fill(id,'providers',selected)},
  providerProfile:providerProfile,saveProviderProfile:saveProviderProfile
};
})(window);
