(function(global){
'use strict';
var KEY='chargenurse-master-lists-v5';
var LEGACY_KEYS=['chargenurse-master-lists-v4','chargenurse-master-lists-v3','chargenurse-master-lists-v2','chargenurse-master-lists-v1'];
var DEFAULTS={
  providers:['McCain MD','Cook MD','Patel MD','Williams NP','Johnson PA','Rivera MD','Thompson MD','Southeast Eye Physicians MD','Cape Dental Associates DDS','Missouri Cancer Associates MD','Saint Francis Neurology MD','OrthoMississippi MD','Mercy Primary Care NP','Barnes-Jewish Neurology MD','Baxter Health Cardiology MD','North Arkansas Orthopedics MD','White River Medical Center NP'],
  transportation:['VA Vehicle','Wheelchair Van','Ambulance','Family Transport','Private Vehicle','Taxi / Rideshare','Community Shuttle','Other'],
  escorts:['Nursing Escort','CNA Escort','Family Member','Veteran Independent','Driver Only','VA Volunteer','Other'],
  clinics:['Primary Care','Cardiology','Neurology','Dental','Audiology','Optometry / Vision','Mental Health','Community Care','Podiatry','Pulmonary','Dermatology','Endocrinology','Gastroenterology','Oncology','Orthopedics','Pain Management','Physical Therapy','Rheumatology','Urology','Other'],
  facilities:['VA Medical Center - Main','VA Medical Center - North','Community Care Clinic - Libertyville','Lake County Hospital','Midwest Specialty Clinic','Dental Associates','University Medical Center','VA Community Based Outpatient Clinic','Other','Southeast Health Medical Center','Saint Francis Medical Center','Missouri Delta Medical Center','Poplar Bluff Regional Medical Center','Ozarks Medical Center','Mercy Hospital St. Louis','Barnes-Jewish Hospital','Baxter Health','North Arkansas Regional Medical Center','White River Medical Center'],
  appointmentReasons:['Routine Follow-up','New Patient Visit','Pre-Op Evaluation','Post-Op Follow-up','Procedure','Imaging / X-Ray','MRI / CT Scan','Laboratory / Blood Work','Dental Cleaning','Dental Procedure','Mental Health Visit','Physical Therapy','Specialty Consultation','Annual Physical','Other']
};
var DEFAULT_FACILITY_PROFILES={
  'VA Medical Center - Main':{address:'3001 Green Bay Road, North Chicago, IL 60064',phone:'(847) 688-1900',fax:'(847) 578-6906',contact:'VA Scheduling Desk',directions:'Enter through main entrance. Check in at desk 3.'},
  'VA Medical Center - North':{address:'5000 W National Ave, Milwaukee, WI 53295',phone:'(414) 384-2000',fax:'(414) 382-5303',contact:'VA North Scheduling',directions:'Take I-94 West to Exit 305B. Visitor parking in Lot A.'},
  'Community Care Clinic - Libertyville':{address:'890 Garfield Ave, Libertyville, IL 60048',phone:'(224) 555-0140',fax:'(224) 555-0141',contact:'Front Desk',directions:'Corner of Garfield and 4th. Parking behind building.'},
  'Lake County Hospital':{address:'1000 Lakeview Parkway, Waukegan, IL 60085',phone:'(847) 360-2000',fax:'(847) 360-2001',contact:'Outpatient Scheduling',directions:'Enter through Outpatient Pavilion, east entrance.'},
  'Midwest Specialty Clinic':{address:'2500 Washington St, Gurnee, IL 60031',phone:'(847) 555-0230',fax:'(847) 555-0231',contact:'Specialty Referral Desk',directions:'Suite 300, third floor.'},
  'Dental Associates':{address:'412 Center Street, Grayslake, IL 60030',phone:'(847) 555-3500',fax:'(847) 555-3501',contact:'Dental Reception',directions:'Ground floor, wheelchair accessible.'},
  'Southeast Health Medical Center':{address:'1701 Lacey St, Cape Girardeau, MO 63701',phone:'(573) 651-5000',fax:'(573) 651-5001',contact:'Main Scheduling',directions:'Main hospital entrance, check-in at front desk.'},
  'Saint Francis Medical Center':{address:'211 Saint Francis Dr, Cape Girardeau, MO 63703',phone:'(573) 331-3000',fax:'(573) 331-3001',contact:'Outpatient Scheduling',directions:'Park in visitor lot, entrance B for clinics.'},
  'Missouri Delta Medical Center':{address:'1008 N Main St, Sikeston, MO 63801',phone:'(573) 471-1600',fax:'(573) 471-1601',contact:'Scheduling Desk',directions:'Enter through main entrance, turn left for outpatient registration.'},
  'Poplar Bluff Regional Medical Center':{address:'2620 N Westwood Blvd, Poplar Bluff, MO 63901',phone:'(573) 686-4151',fax:'(573) 686-4152',contact:'Clinic Scheduling',directions:'Use Westwood entrance, follow signs to Outpatient Services.'},
  'Ozarks Medical Center':{address:'1100 Kentucky Ave, West Plains, MO 65775',phone:'(417) 256-9111',fax:'(417) 256-9112',contact:'Medical Records',directions:'Main hospital entrance, ground floor clinic wing.'},
  'Mercy Hospital St. Louis':{address:'615 S New Ballas Rd, St. Louis, MO 63141',phone:'(314) 251-6000',fax:'(314) 251-6001',contact:'Mercy Scheduling',directions:'Park in parking garage, take elevator to level 2 for clinics.'},
  'Barnes-Jewish Hospital':{address:'1 Barnes Jewish Hospital Plaza, St. Louis, MO 63110',phone:'(314) 747-3000',fax:'(314) 747-3001',contact:'Barnes-Jewish Scheduling',directions:'Enter through the north entrance, check-in at the Central Registration desk.'},
  'Baxter Health':{address:'624 Hospital Dr, Mountain Home, AR 72653',phone:'(870) 508-1000',fax:'(870) 508-1001',contact:'Baxter Scheduling',directions:'Main hospital entrance, turn right for outpatient clinics.'},
  'North Arkansas Regional Medical Center':{address:'620 N Main St, Harrison, AR 72601',phone:'(870) 365-2000',fax:'(870) 365-2001',contact:'North Arkansas Scheduling',directions:'Use Main Street entrance, registration desk on first floor.'},
  'White River Medical Center':{address:'1710 Harrison St, Batesville, AR 72501',phone:'(870) 262-1200',fax:'(870) 262-1201',contact:'White River Scheduling',directions:'Harrison Street entrance, follow signs to Outpatient Registration.'}
};
var DEFAULT_PROVIDER_PROFILES={
  'McCain MD':{clinic:'Primary Care',facility:'VA Medical Center - Main',phone:'(847) 688-1900 ext 4421',fax:'(847) 578-6906'},
  'Cook MD':{clinic:'Primary Care',facility:'VA Medical Center - Main',phone:'(847) 688-1900 ext 5512',fax:'(847) 578-6906'},
  'Patel MD':{clinic:'Cardiology',facility:'VA Medical Center - Main',phone:'(847) 688-1900 ext 3320',fax:'(847) 578-6907'},
  'Williams NP':{clinic:'Primary Care',facility:'Community Care Clinic - Libertyville',phone:'(224) 555-0140',fax:'(224) 555-0141'},
  'Johnson PA':{clinic:'Mental Health',facility:'VA Medical Center - North',phone:'(414) 384-2000 ext 2210',fax:'(414) 382-5303'},
  'Rivera MD':{clinic:'Neurology',facility:'Midwest Specialty Clinic',phone:'(847) 555-0230',fax:'(847) 555-0231'},
  'Thompson MD':{clinic:'Primary Care',facility:'Lake County Hospital',phone:'(847) 360-2000 ext 450',fax:'(847) 360-2001'},
  'Southeast Eye Physicians MD':{clinic:'Optometry / Vision',facility:'Southeast Health Medical Center',phone:'(573) 651-5000 ext 2100',fax:'(573) 651-5001'},
  'Cape Dental Associates DDS':{clinic:'Dental',facility:'Saint Francis Medical Center',phone:'(573) 331-3000 ext 1550',fax:'(573) 331-3001'},
  'Missouri Cancer Associates MD':{clinic:'Oncology',facility:'Missouri Delta Medical Center',phone:'(573) 471-1600 ext 3200',fax:'(573) 471-1601'},
  'Saint Francis Neurology MD':{clinic:'Neurology',facility:'Saint Francis Medical Center',phone:'(573) 331-3000 ext 2400',fax:'(573) 331-3001'},
  'OrthoMississippi MD':{clinic:'Orthopedics',facility:'Poplar Bluff Regional Medical Center',phone:'(573) 686-4151 ext 1800',fax:'(573) 686-4152'},
  'Mercy Primary Care NP':{clinic:'Primary Care',facility:'Mercy Hospital St. Louis',phone:'(314) 251-6000 ext22',fax:'(314) 251-6001'},
  'Barnes-Jewish Neurology MD':{clinic:'Neurology',facility:'Barnes-Jewish Hospital',phone:'(314) 747-3000 ext 5500',fax:'(314) 747-3001'},
  'Baxter Health Cardiology MD':{clinic:'Cardiology',facility:'Baxter Health',phone:'(870) 508-1000 ext 3100',fax:'(870) 508-1001'},
  'North Arkansas Orthopedics MD':{clinic:'Orthopedics',facility:'North Arkansas Regional Medical Center',phone:'(870) 365-2000 ext 2700',fax:'(870) 365-2001'},
  'White River Medical Center NP':{clinic:'Primary Care',facility:'White River Medical Center',phone:'(870) 262-1200 ext 1200',fax:'(870) 262-1201'}
};
var DEFAULT_TRANSPORT_CONTACT={email:'transportation@va.gov',phone:'(847) 688-1900 ext 7100',fax:'(847) 578-6910',instructions:'Call 48 hours in advance to schedule. Confirm pickup time the day before.'};
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
    out.providerProfiles[name]=cleanProfile(source[name]||source[Object.keys(source).find(function(k){return k.toLowerCase()===name.toLowerCase()})]||DEFAULT_PROVIDER_PROFILES[name]||{})
  });
  return out
}
function load(){
  var saved=parse(localStorage.getItem(KEY),null);
  if(!saved){
    for(var i=0;i<LEGACY_KEYS.length&&!saved;i++)saved=parse(localStorage.getItem(LEGACY_KEYS[i]),null);
    saved=saved||{};
    saved=Object.assign({},DEFAULTS,saved);
    saved.providerProfiles=saved.providerProfiles||DEFAULT_PROVIDER_PROFILES;
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
  return values.map(function(x){return '<option value=\"'+String(x).replace(/\"/g,'&quot;')+'\">'+String(x).replace(/</g,'&lt;')+'</option>'}).join('')
}
function selectOptions(key,selected){
  var values=items(key);
  if(selected&&!values.some(function(x){return x.toLowerCase()===String(selected).toLowerCase()}))values.unshift(selected);
  return '<option value=\"\">Select...</option>'+values.map(function(x){var s=String(x).replace(/\"/g,'&quot;');return '<option value=\"'+s+'\"'+(String(selected||'')===String(x)?' selected':'')+'>'+s+'</option>'}).join('')
}
function fill(id,key,selected){
  var el=document.getElementById(id);
  if(el)el.innerHTML=selectOptions(key,selected)
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
  options:options,selectOptions:selectOptions,fill:fill,defaults:DEFAULTS,
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
