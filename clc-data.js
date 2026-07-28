(function(global){
'use strict';
var KEY='clc-command-center-v3';
var VERSION='7.3-phase30-rn9';

function parse(value,fallback){try{return value?JSON.parse(value):fallback}catch(e){return fallback}}
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,8)}
function now(){return new Date().toISOString()}
function blank(){return{
  version:VERSION,residents:[],appointments:[],completion:{},changes:[],handoff:{},
  automation:{transportWorkflow:true,dayBeforeReminder:true,admissionChecklist:true,dailyRefresh:true,lastRun:'',log:[]},
  updated:now()
}}
function normalizeResident(r,index){
  r=r||{};
  return {
    id:String(r.id||uid()),
    active:r.active!==false,
    name:r.name||('Veteran '+((index||0)+1)),
    preferredName:r.preferredName||'',
    room:r.room||'',
    last4:r.last4||'',
    dob:r.dob||'',
    specialty:r.specialty||r.program||'LTC',
    provider:r.provider||'',
    codeStatus:r.codeStatus||'',
    allergies:r.allergies||'',
    diet:r.diet||'',
    isolation:r.isolation||'None',
    emergencyContact:r.emergencyContact||'',
    transportNeeds:r.transportNeeds||'',
    fallRisk:!!r.fallRisk,
    skinRisk:!!r.skinRisk,
    behaviorPrecautions:r.behaviorPrecautions||'',
    oxygen:r.oxygen||'',
    equipment:r.equipment||'',
    notes:r.notes||'',
    createdAt:r.createdAt||now(),
    updatedAt:r.updatedAt||now(),
    bathDays:Array.isArray(r.bathDays)?r.bathDays:[],
    vitalsDays:Array.isArray(r.vitalsDays)?r.vitalsDays:[],
    weightDays:Array.isArray(r.weightDays)?r.weightDays:[],
    skinDays:Array.isArray(r.skinDays)?r.skinDays:[],
    labDays:Array.isArray(r.labDays)?r.labDays:[],

    // Charge RN clinical workspace fields now live on the shared Veteran record.
    assistance:r.assistance||'', toilet:r.toilet||'', serviceConnection:r.serviceConnection||'',
    siderail:r.siderail||'', meds:r.meds||'', ppdDate:r.ppdDate||'', ppdRead:r.ppdRead||'',
    ppdResult:r.ppdResult||'', vitalsFreq:r.vitalsFreq||'', fsbsCount:Number(r.fsbsCount||0),
    physician:r.physician||'', showerTime:r.showerTime||'AM',
    bmLog:Array.isArray(r.bmLog)?r.bmLog:[],
    neuroChecks:Array.isArray(r.neuroChecks)?r.neuroChecks:[],
    skinAssessments:r.skinAssessments&&typeof r.skinAssessments==='object'?r.skinAssessments:{Mon:'',Tue:'',Wed:'',Thu:'',Fri:''},
    weights:Array.isArray(r.weights)?r.weights:[],
    postFallVS:Array.isArray(r.postFallVS)?r.postFallVS:[],
    fsbsLog:Array.isArray(r.fsbsLog)?r.fsbsLog:[],
    oralInfo:r.oralInfo&&typeof r.oralInfo==='object'?r.oralInfo:{dental:'',notes:''},
    sbar:r.sbar||'', transferChecklist:Array.isArray(r.transferChecklist)?r.transferChecklist:[],
    skinAssigned:r.skinAssigned||'', showerAssigned:r.showerAssigned||'',
    vitalsAssigned:r.vitalsAssigned||'', weightsAssigned:r.weightsAssigned||'',
    admission:r.admission&&typeof r.admission==='object'?r.admission:{},
    nursingNotes:Array.isArray(r.nursingNotes)?r.nursingNotes:[],
    alerts:Array.isArray(r.alerts)?r.alerts:[],
    rnAppointments:r.rnAppointments||r.appointmentsText||''
  }
}
function normalizeAppointment(a){
  a=a||{};
  return {
    id:String(a.id||uid()),residentId:String(a.residentId||''),
    residentName:a.residentName||'',room:a.room||'',date:a.date||'',
    time:a.time||'',leaveTime:a.leaveTime||'',location:a.location||'',
    facilityAddress:a.facilityAddress||'',facilityPhone:a.facilityPhone||'',facilityFax:a.facilityFax||'',facilityContact:a.facilityContact||'',facilityDirections:a.facilityDirections||'',
    clinic:a.clinic||'',provider:a.provider||'',providerPhone:a.providerPhone||'',providerFax:a.providerFax||'',escort:a.escort||'',
    transportation:a.transportation||'',transportNeeded:a.transportNeeded!==false,
    emailTo:a.emailTo||'',transportPhone:a.transportPhone||'',transportFax:a.transportFax||'',transportInstructions:a.transportInstructions||'',emailDate:a.emailDate||'',reason:a.reason||'',
    wheelchair:!!a.wheelchair,oxygen:!!a.oxygen,
    notes:a.notes||'',ticketPrepared:!!a.ticketPrepared,
    travelRequestEmailed:!!a.travelRequestEmailed,confirmed:!!a.confirmed,
    departed:!!a.departed,completed:!!a.completed,notCompleted:!!a.notCompleted,
    chartFlagged:!!a.chartFlagged,returnTime:a.returnTime||'',
    createdAt:a.createdAt||now(),updatedAt:a.updatedAt||now()
  }
}
function load(){
  var d=parse(localStorage.getItem(KEY),blank())||blank();
  d.version=VERSION;
  d.residents=(Array.isArray(d.residents)?d.residents:[]).map(normalizeResident);
  d.appointments=(Array.isArray(d.appointments)?d.appointments:[]).map(normalizeAppointment);
  d.completion=d.completion||{}; d.changes=Array.isArray(d.changes)?d.changes:[];
  d.handoff=d.handoff||{}; d.automation=d.automation||blank().automation;
  return d;
}
function save(d){d.updated=now();d.version=VERSION;localStorage.setItem(KEY,JSON.stringify(d));global.dispatchEvent(new CustomEvent('clc:datachange',{detail:{updated:d.updated}}));return d}
function addChange(d,type,title,detail){
  d.changes=d.changes||[];
  d.changes.unshift({id:uid(),at:now(),type:type,title:title,detail:detail||''});
  d.changes=d.changes.slice(0,150);
}
function residents(activeOnly){
  var rows=load().residents;
  return activeOnly===false?rows:rows.filter(function(r){return r.active!==false})
}
function resident(id){return load().residents.find(function(r){return r.id===String(id)})||null}
function upsertResident(input){
  var d=load(), r=normalizeResident(input,d.residents.length);
  var i=d.residents.findIndex(function(x){return x.id===r.id});
  if(i>=0){
    r.createdAt=d.residents[i].createdAt||r.createdAt;
    r.updatedAt=now();
    d.residents[i]=r;
    addChange(d,'veteran','Veteran record updated',(r.room?('Room '+r.room+' · '):'')+r.name);
  }else{
    d.residents.push(r);
    addChange(d,'veteran','Veteran record added',(r.room?('Room '+r.room+' · '):'')+r.name);
  }
  d.appointments.forEach(function(a){
    if(a.residentId===r.id){a.residentName=r.name;a.room=r.room;a.updatedAt=now()}
  });
  save(d);return r;
}

function upsertResidents(inputs){
  var d=load(), changed=[];
  (Array.isArray(inputs)?inputs:[]).forEach(function(input){
    var r=normalizeResident(input,d.residents.length);
    var i=d.residents.findIndex(function(x){return x.id===r.id});
    if(i>=0){
      r.createdAt=d.residents[i].createdAt||r.createdAt;
      r.updatedAt=now();
      d.residents[i]=r;
    }else{
      d.residents.push(r);
    }
    d.appointments.forEach(function(a){
      if(a.residentId===r.id){a.residentName=r.name;a.room=r.room;a.updatedAt=now()}
    });
    changed.push(r);
  });
  if(changed.length){
    addChange(d,'veteran','Clinical workspace updated',changed.length+' Veteran record'+(changed.length===1?'':'s'));
    save(d);
  }
  return changed;
}

function patchResident(id,patch,changeMeta){
  var d=load(), key=String(id||''), i=d.residents.findIndex(function(x){return x.id===key});
  if(i<0)return null;
  var current=d.residents[i], merged=Object.assign({},current,patch||{}, {
    id:current.id,
    createdAt:current.createdAt,
    updatedAt:now()
  });
  var normalized=normalizeResident(merged,i);
  normalized.createdAt=current.createdAt;
  normalized.updatedAt=merged.updatedAt;
  d.residents[i]=normalized;
  d.appointments.forEach(function(a){
    if(a.residentId===normalized.id){a.residentName=normalized.name;a.room=normalized.room;a.updatedAt=now()}
  });
  if(changeMeta!==false){
    var title=(changeMeta&&changeMeta.title)||'Veteran clinical record updated';
    var detail=(changeMeta&&changeMeta.detail)||((normalized.room?('Room '+normalized.room+' · '):'')+normalized.name);
    addChange(d,(changeMeta&&changeMeta.type)||'clinical',title,detail);
  }
  save(d);return normalized;
}
function patchResidents(items,changeMeta){
  var d=load(), changed=[];
  (Array.isArray(items)?items:[]).forEach(function(item){
    if(!item)return;
    var key=String(item.id||''), i=d.residents.findIndex(function(x){return x.id===key});
    if(i<0)return;
    var current=d.residents[i];
    var normalized=normalizeResident(Object.assign({},current,item.patch||{}, {
      id:current.id,createdAt:current.createdAt,updatedAt:now()
    }),i);
    normalized.createdAt=current.createdAt;
    d.residents[i]=normalized;
    d.appointments.forEach(function(a){
      if(a.residentId===normalized.id){a.residentName=normalized.name;a.room=normalized.room;a.updatedAt=now()}
    });
    changed.push(normalized);
  });
  if(changed.length){
    if(changeMeta!==false)addChange(d,(changeMeta&&changeMeta.type)||'clinical',(changeMeta&&changeMeta.title)||'Clinical workspace updated',(changeMeta&&changeMeta.detail)||(changed.length+' Veteran record'+(changed.length===1?'':'s')));
    save(d);
  }
  return changed;
}


function importLegacyRN(legacy){
  if(!legacy||!Array.isArray(legacy.patients))return {imported:0,updated:0,settings:legacy&&legacy.settings||{}};
  var d=load(), imported=0, updated=0;
  legacy.patients.forEach(function(patient){
    if(!patient)return;
    var raw=Object.assign({},patient);
    raw.id=String(raw.id||uid());
    raw.active=raw.active!==false;
    raw.rnAppointments=typeof raw.appointments==='string'?raw.appointments:(raw.rnAppointments||'');
    delete raw.appointments;
    var normalized=normalizeResident(raw,d.residents.length);
    var i=d.residents.findIndex(function(r){return r.id===normalized.id});
    if(i>=0){
      normalized.createdAt=d.residents[i].createdAt||normalized.createdAt;
      normalized.updatedAt=now();
      d.residents[i]=normalized;
      updated++;
    }else{
      d.residents.push(normalized);
      imported++;
    }
  });
  if(imported||updated){
    addChange(d,'migration','Legacy RN data consolidated',(imported+' added · '+updated+' updated'));
    save(d);
  }
  return {imported:imported,updated:updated,settings:legacy.settings||{}};
}

function archiveAllResidents(){
  var d=load(), count=0;
  d.residents.forEach(function(r){
    if(r.active!==false){r.active=false;r.updatedAt=now();count++}
  });
  if(count){addChange(d,'veteran','Active roster cleared',count+' Veteran record'+(count===1?'':'s')+' archived');save(d)}
  return count;
}
function setResidentActive(id,active){
  var d=load(),r=d.residents.find(function(x){return x.id===String(id)});
  if(!r)return null;
  r.active=active!==false;r.updatedAt=now();
  addChange(d,'veteran',r.active?'Veteran reactivated':'Veteran archived',(r.room?('Room '+r.room+' · '):'')+r.name);
  save(d);return r;
}
function appointments(){
  return load().appointments.slice().sort(function(a,b){return (a.date+' '+a.time).localeCompare(b.date+' '+b.time)})
}
function appointmentsForDate(date){return appointments().filter(function(a){return a.date===date})}
function upsertAppointment(input){
  var d=load(), a=normalizeAppointment(input), r=resident(a.residentId);
  if(r){a.residentName=r.name;a.room=r.room}
  var i=d.appointments.findIndex(function(x){return x.id===a.id});
  if(i>=0){a.createdAt=d.appointments[i].createdAt||a.createdAt;d.appointments[i]=a;addChange(d,'appointment','Appointment updated',(a.room?('Room '+a.room+' · '):'')+a.residentName+' · '+a.date)}
  else{d.appointments.push(a);addChange(d,'appointment','Appointment added',(a.room?('Room '+a.room+' · '):'')+a.residentName+' · '+a.date)}
  save(d);return a;
}
function removeAppointment(id){
  var d=load(), a=d.appointments.find(function(x){return x.id===String(id)});
  d.appointments=d.appointments.filter(function(x){return x.id!==String(id)});
  if(a)addChange(d,'appointment','Appointment deleted',a.residentName+' · '+a.date);
  save(d);
}
global.CLCData={KEY:KEY,VERSION:VERSION,uid:uid,load:load,save:save,
  residents:residents,resident:resident,normalizeResident:normalizeResident,
  upsertResident:upsertResident,upsertResidents:upsertResidents,
  patchResident:patchResident,patchResidents:patchResidents,
  setResidentActive:setResidentActive,archiveAllResidents:archiveAllResidents,
  appointments:appointments,appointmentsForDate:appointmentsForDate,
  upsertAppointment:upsertAppointment,removeAppointment:removeAppointment,
  normalizeAppointment:normalizeAppointment};
})(window);
