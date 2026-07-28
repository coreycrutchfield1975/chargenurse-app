(function(global){
'use strict';
var KEY='chargenurse-master-lists-v5';
var LEGACY_KEYS=['chargenurse-master-lists-v4','chargenurse-master-lists-v3','chargenurse-master-lists-v2','chargenurse-master-lists-v1'];
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
var DEFAULT_TRANSPORT_CONTACT={email:'',phone:'',fax:'',instructions:''};
var DEFAULT_FACILITY_PROFILES={};
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

function cleanFacilityProfile(p){
  p=p||{};
  return {
    address:String(p.address||'').trim(),
    phone:String(p.phone||'').trim(),
    fax:String(p.fax||'').trim(),
    contact:String(p.contact||'').trim(),
    directions:String(p.directions||'').trim()
  }
}
function normalized(data){
  data=data||{};
  var out={};
  Object.keys(DEFAULTS).forEach(function(key){
    out[key]=clean(data[key]&&data[key].length?data[key]:DEFAULTS[key])
  });
  out.transportContact={
    email:String((data.transportContact||{}).email||'').trim(),
    phone:String((data.transportContact||{}).phone||'').trim(),
    fax:String((data.transportContact||{}).fax||'').trim(),
    instructions:String((data.transportContact||{}).instructions||'').trim()
  };
  out.facilityProfiles={};
  var facilitySource=data.facilityProfiles||{};
  out.facilities.forEach(function(name){
    var match=Object.keys(facilitySource).find(function(k){return k.toLowerCase()===name.toLowerCase()});
    out.facilityProfiles[name]=cleanFacilityProfile(match?facilitySource[match]:DEFAULT_FACILITY_PROFILES[name]||{})
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
    saved.transportContact=saved.transportContact||DEFAULT_TRANSPORT_CONTACT;
    saved.facilityProfiles=saved.facilityProfiles||DEFAULT_FACILITY_PROFILES;
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
  if(key==='facilities')d.facilityProfiles[name]=cleanFacilityProfile({});
  return save(d)
}
function update(key,oldName,newName){
  var d=load(),oldKey=String(oldName||'').trim().toLowerCase();
  d[key]=(d[key]||[]).map(function(x){return x.toLowerCase()===oldKey?newName:x});
  if(key==='facilities'){
    var facilityActual=Object.keys(d.facilityProfiles||{}).find(function(k){return k.toLowerCase()===oldKey});
    var facilityProfile=facilityActual?d.facilityProfiles[facilityActual]:{};
    if(facilityActual)delete d.facilityProfiles[facilityActual];
    d.facilityProfiles[newName]=cleanFacilityProfile(facilityProfile)
  }
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
  if(key==='facilities'){
    Object.keys(d.facilityProfiles||{}).forEach(function(k){if(k.toLowerCase()===needle)delete d.facilityProfiles[k]})
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

function facilityProfile(name){
  var d=load(),needle=String(name||'').trim().toLowerCase(),key=Object.keys(d.facilityProfiles||{}).find(function(k){return k.toLowerCase()===needle});
  return cleanFacilityProfile(key?d.facilityProfiles[key]:{})
}
function saveFacilityProfile(name,profile){
  var d=load(),needle=String(name||'').trim().toLowerCase(),key=d.facilities.find(function(x){return x.toLowerCase()===needle})||String(name||'').trim();
  if(!key)return d;
  if(!d.facilities.some(function(x){return x.toLowerCase()===needle}))d.facilities.push(key);
  d.facilityProfiles[key]=cleanFacilityProfile(profile);
  return save(d)
}
function transportContact(){return load().transportContact||Object.assign({},DEFAULT_TRANSPORT_CONTACT)}
function saveTransportContact(contact){
  var d=load();
  d.transportContact={
    email:String((contact||{}).email||'').trim(),
    phone:String((contact||{}).phone||'').trim(),
    fax:String((contact||{}).fax||'').trim(),
    instructions:String((contact||{}).instructions||'').trim()
  };
  return save(d)
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
  providerProfile:providerProfile,saveProviderProfile:saveProviderProfile,
  facilityProfile:facilityProfile,saveFacilityProfile:saveFacilityProfile,
  transportContact:transportContact,saveTransportContact:saveTransportContact
};
})(window);
