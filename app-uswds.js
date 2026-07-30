/* ChargeNurse USWDS — App Logic
   Bridges CLCData + master-lists to USWDS components */

// ═══ Init ═══
CLCData.init();
masterLists.init();
document.addEventListener('DOMContentLoaded',function(){
  if(!CLCData.auth() && !sessionStorage.getItem('cn-auth-override')){ CLCData.showPasswordGate();return; }
  renderHome();
});

// ═══ Navigation ═══
function showTab(id,el){
  document.querySelectorAll('.cn-section').forEach(function(s){s.classList.remove('active');});
  document.querySelectorAll('.cn-nav .usa-nav__link').forEach(function(l){l.classList.remove('usa-current');});
  document.getElementById('tab-'+id).classList.add('active');
  if(el) el.classList.add('usa-current');
  if(id==='home') renderHome();
  if(id==='appointments') renderAppointments();
  if(id==='veterans') renderVeterans();
  if(id==='transport') renderTransport();
  if(id==='reports') renderReports();
}

// ═══ Toast ═══
function toast(msg){
  var t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');
  setTimeout(function(){t.classList.remove('show');},3000);
}

// ═══ HOME ═══
function renderHome(){
  try {
    var vets=CLCData.residents();var apts=CLCData.appointments();
    var today=new Date().toISOString().slice(0,10);
    var todayApts=apts.filter(function(a){return a.date===today;});
    document.getElementById('home-vet-count').textContent=vets.length;
    document.getElementById('home-apt-count').textContent=todayApts.length;
    document.getElementById('home-transport-count').textContent=apts.filter(function(a){return a.date===today&&a.transportStatus;}).length;
    var alerts=CLCData.alerts();
    document.getElementById('home-alert-count').textContent=alerts.length;
    var html=alerts.length?alerts.map(function(a){
      return '<div class="cn-card alert-'+a.level+'"><strong>'+a.type+':</strong> '+a.message+'</div>';
    }).join(''):'<div class="cn-card">✅ No active alerts</div>';
    document.getElementById('home-alerts').innerHTML=html;
    document.getElementById('daily-wins').innerHTML=NURSING_SPARKS?NURSING_SPARKS[Math.floor(Math.random()*NURSING_SPARKS.length)]:'Great work today!';
    renderWeather();
  } catch(e) { console.error('Home render error:',e); }
}

function renderWeather(){
  var w=document.getElementById('weather-widget');
  if(typeof weatherData!=='undefined'&&weatherData){
    w.innerHTML='<div style="font-size:2rem">'+weatherData.icon+' '+weatherData.temp+'°F</div><div>'+weatherData.desc+' — '+weatherData.city+'</div>';
  } else {
    w.innerHTML='<div style="font-size:2rem">☀️ 72°F</div><div>Partly Cloudy — Poplar Bluff, MO</div>';
  }
}

// ═══ APPOINTMENTS ═══
function renderAppointments(){
  var vets=CLCData.residents();
  var vetSel=document.getElementById('m-vet');
  vetSel.innerHTML='<option value="">Select Veteran…</option>'+vets.map(function(v){
    return '<option value="'+v.last4+'" data-name="'+v.name+'">'+v.name+' ('+v.last4+') — Room '+v.room+'</option>';
  }).join('');
  var locSel=document.getElementById('m-loc');
  var locs=masterLists.getFacilities?masterLists.getFacilities():['Main Campus','CBOC A','CBOC B','VAMC Specialty'];
  locSel.innerHTML='<option value="">Select Location…</option>'+locs.map(function(l){return '<option>'+l+'</option>';}).join('');
  var docSel=document.getElementById('m-doctor');
  var docs=masterLists.getProviders?masterLists.getProviders():[];
  docSel.innerHTML='<option value="">Select Provider…</option>'+docs.map(function(d){return '<option>'+d+'</option>';}).join('');
  renderTodayAppointments();
}

function renderTodayAppointments(){
  var apts=CLCData.appointments();var today=new Date().toISOString().slice(0,10);
  var list=document.getElementById('apt-list');
  var todayApts=apts.filter(function(a){return a.date===today;});
  if(!todayApts.length){list.innerHTML='<div class="cn-card">No appointments scheduled for today.</div>';return;}
  list.innerHTML='<table class="usa-table"><thead><tr><th>Time</th><th>Veteran</th><th>Location</th><th>Provider</th><th>Type</th><th>Transport</th><th>Actions</th></tr></thead><tbody>'
    +todayApts.map(function(a,i){return '<tr><td>'+a.time+'</td><td>'+a.veteran+'</td><td>'+a.location+'</td><td>'+a.provider+'</td><td>'+a.type+'</td><td>'+a.transportStatus+'</td><td><button class="usa-button usa-button--unstyled" onclick="deleteAppointment('+i+')">✕</button></td></tr>';}).join('')
    +'</tbody></table>';
}

function saveAppointment(){
  var vetEl=document.getElementById('m-vet');
  var vetName=vetEl.selectedOptions[0]?vetEl.selectedOptions[0].getAttribute('data-name')||vetEl.value:'';
  var apt={
    id:Date.now().toString(),
    date:document.getElementById('m-date').value,
    time:document.getElementById('m-time').value,
    veteran:vetName,
    last4:vetEl.value,
    location:document.getElementById('m-loc').value,
    provider:document.getElementById('m-doctor').value,
    duration:document.getElementById('m-duration').value,
    type:document.getElementById('m-type').value,
    transportStatus:document.getElementById('m-transport-status').value,
    notes:document.getElementById('m-notes').value
  };
  if(!apt.date||!apt.veteran){toast('Please select a date and veteran');return;}
  CLCData.addAppointment(apt);
  toast('Appointment saved!');
  clearAppointmentForm();renderTodayAppointments();renderHome();
}

function saveTemplate(){
  var t={
    location:document.getElementById('m-loc').value,
    provider:document.getElementById('m-doctor').value,
    duration:document.getElementById('m-duration').value,
    type:document.getElementById('m-type').value,
    transportStatus:document.getElementById('m-transport-status').value
  };
  localStorage.setItem('cn-apt-template',JSON.stringify(t));
  toast('Template saved!');
}

function printTicket(){
  var vetEl=document.getElementById('m-vet');
  var html='<div style="padding:2rem;font-family:sans-serif;">'+
    '<h2>CLC Appointment Ticket</h2>'+
    '<table style="width:100%;border-collapse:collapse"><tr><td><strong>Veteran:</strong></td><td>'+vetEl.value+'</td></tr>'+
    '<tr><td><strong>Date:</strong></td><td>'+document.getElementById('m-date').value+'</td></tr>'+
    '<tr><td><strong>Time:</strong></td><td>'+document.getElementById('m-time').value+'</td></tr>'+
    '<tr><td><strong>Location:</strong></td><td>'+document.getElementById('m-loc').value+'</td></tr>'+
    '<tr><td><strong>Provider:</strong></td><td>'+document.getElementById('m-doctor').value+'</td></tr>'+
    '<tr><td><strong>Transport:</strong></td><td>'+document.getElementById('m-transport-status').value||'None'+'</td></tr>'+
    '</table></div>';
  var w=window.open('','','width=600,height=400');
  w.document.write(html);w.document.close();w.print();
}

function clearAppointmentForm(){
  ['m-vet','m-loc','m-doctor','m-date','m-time','m-transport-status','m-notes'].forEach(function(id){
    document.getElementById(id).value='';
  });
  document.getElementById('m-duration').value='30 min';document.getElementById('m-type').value='Medical';
}

function deleteAppointment(idx){
  var apts=CLCData.appointments();apts.splice(idx,1);
  localStorage.setItem('clc-appointments',JSON.stringify(apts));
  toast('Appointment removed');renderTodayAppointments();renderHome();
}

// ═══ VETERANS ═══
function renderVeterans(){
  var vets=CLCData.residents();
  var html=vets.length?vets.map(function(v){
    return '<div class="cn-card" style="display:flex;justify-content:space-between;align-items:center">'+
      '<div><strong>'+v.name+'</strong> <span style="color:#5c6a7a">Room '+v.room+'</span><br><small>'+v.last4+' • DOB: '+(v.dob||'—')+'</small></div>'+
      '<div><button class="usa-button usa-button--unstyled" onclick="deleteVeteran(\''+v.last4+'\')">Remove</button></div></div>';
  }).join(''):'<div class="cn-card">No veterans added yet.</div>';
  document.getElementById('vet-roster').innerHTML=html;
}

function openNewVeteranModal(){document.getElementById('vet-modal').classList.add('is-visible');}
function closeVetModal(){document.getElementById('vet-modal').classList.remove('is-visible');}
function saveNewVeteran(){
  var v={
    name:document.getElementById('new-vet-name').value,
    last4:document.getElementById('new-vet-last4').value,
    room:document.getElementById('new-vet-room').value,
    dob:document.getElementById('new-vet-dob').value
  };
  if(!v.name||!v.last4){toast('Name and Last 4 required');return;}
  CLCData.addResident(v);
  toast('Veteran added!');closeVetModal();
  ['new-vet-name','new-vet-last4','new-vet-room','new-vet-dob'].forEach(function(id){document.getElementById(id).value='';});
  renderVeterans();renderHome();
}
function deleteVeteran(last4){
  if(!confirm('Remove this veteran?'))return;
  var vets=CLCData.residents();
  vets=vets.filter(function(v){return v.last4!==last4;});
  localStorage.setItem('clc-residents',JSON.stringify(vets));
  toast('Veteran removed');renderVeterans();renderHome();
}

// ═══ TRANSPORT ═══
function renderTransport(){
  var apts=CLCData.appointments();var today=new Date().toISOString().slice(0,10);
  var transport=apts.filter(function(a){return a.transportStatus&&a.date===today;});
  var html=transport.length?transport.map(function(a){
    return '<div class="cn-card alert-info"><strong>'+a.veteran+'</strong> — '+a.transportStatus+'<br><small>'+a.time+' • '+a.location+'</small></div>';
  }).join(''):'<div class="cn-card">No transport needed today.</div>';
  document.getElementById('transport-list').innerHTML=html;
}

// ═══ REPORTS ═══
function renderReports(){}
function generateMorningReport(){
  var vets=CLCData.residents();var apts=CLCData.appointments();var today=new Date().toISOString().slice(0,10);
  var todayApts=apts.filter(function(a){return a.date===today;});
  var report='<h3>Morning Report — '+new Date().toLocaleDateString()+'</h3>'+
    '<p><strong>'+vets.length+'</strong> residents • <strong>'+todayApts.length+'</strong> appointments today</p>'+
    '<h4>Appointments</h4>'+todayApts.map(function(a){return '<div class="cn-card">'+a.time+' — '+a.veteran+' → '+a.location+' ('+a.provider+')</div>';}).join('');
  document.getElementById('report-output').innerHTML=report;
  toast('Morning report generated!');
}

// ═══ SETTINGS ═══
function clearAllData(){
  if(!confirm('Delete ALL data? This cannot be undone.'))return;
  localStorage.removeItem('clc-residents');localStorage.removeItem('clc-appointments');
  toast('All data cleared');renderHome();
}
function exportData(){
  var data={residents:CLCData.residents(),appointments:CLCData.appointments()};
  var blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  var a=document.createElement('a');a.href=URL.createObjectURL(blob);
  a.download='chargenurse-export-'+new Date().toISOString().slice(0,10)+'.json';a.click();
  toast('Data exported!');
}
