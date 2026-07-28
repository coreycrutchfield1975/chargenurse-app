(function(global){
'use strict';
var KEY='clc-command-center-v3';
var VERSION='5.9';

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
    labDays:Array.isArray(r.labDays)?r.labDays:[]
  }
}
function normalizeAppointment(a){
  a=a||{};
  return {
    id:String(a.id||uid()),residentId:String(a.residentId||''),
    residentName:a.residentName||'',room:a.room||'',date:a.date||'',
    time:a.time||'',leaveTime:a.leaveTime||'',location:a.location||'',
    clinic:a.clinic||'',provider:a.provider||'',escort:a.escort||'',
    transportation:a.transportation||'',transportNeeded:a.transportNeeded!==false,
    emailTo:a.emailTo||'',emailDate:a.emailDate||'',reason:a.reason||'',
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
  upsertResident:upsertResident,setResidentActive:setResidentActive,
  appointments:appointments,appointmentsForDate:appointmentsForDate,
  upsertAppointment:upsertAppointment,removeAppointment:removeAppointment,
  normalizeAppointment:normalizeAppointment};
})(window);
