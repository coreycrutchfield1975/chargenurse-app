import { useMemo, useState } from 'react';
import type { Appointment, MobilityMode, TransportStatus, TravelRequest, Veteran, ManagedLists } from '../../types/domain';

const statuses: TransportStatus[] = ['Draft','Pending','Confirmed','En Route','At Destination','Awaiting Return','Completed','Failed','Cancelled'];
const mobility: MobilityMode[] = ['Ambulatory','Wheelchair','Stretcher','Bariatric'];

export function TransportForm({ veterans, appointments, initial, onSave, onCancel, lists }:{veterans:Veteran[];appointments:Appointment[];initial?:TravelRequest;onSave:(r:TravelRequest)=>void;onCancel:()=>void;lists:ManagedLists}) {
  const now = new Date().toISOString();
  const [form,setForm]=useState<TravelRequest>(initial ?? {id:crypto.randomUUID(),veteranId:'',appointmentId:'',status:'Draft',transportMode:'VA Transport',mobilityMode:'Ambulatory',pickupTime:'',estimatedReturn:'',returnPickupTime:'',driver:'',escortRequired:false,escortName:'',oxygenRequired:false,oxygenDetails:'',destinationContact:'',sendingNurse:'',receivingStaff:'',returnedToUnitBy:'',notes:'',createdAt:now,updatedAt:now});
  const [error,setError]=useState('');
  const selectedAppointments=useMemo(()=>appointments.filter(a=>a.veteranId===form.veteranId),[appointments,form.veteranId]);
  function set<K extends keyof TravelRequest>(key:K,value:TravelRequest[K]){setForm(v=>({...v,[key]:value}));}
  function submit(e:React.FormEvent){e.preventDefault(); if(!form.veteranId){setError('Select a Veteran.');return;} if(!form.transportMode.trim()){setError('Transportation mode is required.');return;} if(form.escortRequired&&!form.escortName.trim()){setError('Enter the assigned escort.');return;} if(form.oxygenRequired&&!form.oxygenDetails.trim()){setError('Document oxygen requirements.');return;} onSave({...form,updatedAt:new Date().toISOString()});}
  return <form className="panel transport-form" onSubmit={submit}>
    <div className="section-heading"><div><p className="eyebrow">Transportation workflow</p><h2>{initial?'Edit Travel Request':'New Travel Request'}</h2></div><button className="secondary" type="button" onClick={onCancel}>Close</button></div>
    {error&&<div className="form-error">{error}</div>}
    <div className="form-grid">
      <label>Veteran<select value={form.veteranId} onChange={e=>{set('veteranId',e.target.value);set('appointmentId','')}}><option value="">Select Veteran</option>{veterans.filter(v=>v.status!=='Discharged / Archived').map(v=><option key={v.id} value={v.id}>{v.room} — {v.name}</option>)}</select></label>
      <label>Linked Appointment<select value={form.appointmentId} onChange={e=>set('appointmentId',e.target.value)}><option value="">No linked appointment</option>{selectedAppointments.map(a=><option key={a.id} value={a.id}>{a.date} {a.time} — {a.destination||a.reason}</option>)}</select></label>
      <label>Status<select value={form.status} onChange={e=>set('status',e.target.value as TransportStatus)}>{statuses.map(s=><option key={s}>{s}</option>)}</select></label>
      <label>Transport Mode<select value={form.transportMode} onChange={e=>set('transportMode',e.target.value)}><option value="">Select…</option>{lists.transportationModes.map(v=><option key={v}>{v}</option>)}</select></label>
      <label>Mobility<select value={form.mobilityMode} onChange={e=>set('mobilityMode',e.target.value as MobilityMode)}>{lists.mobilityOptions.map(v=><option key={v}>{v}</option>)}</select></label>
      <label>Pickup Time<input type="datetime-local" value={form.pickupTime} onChange={e=>set('pickupTime',e.target.value)}/></label>
      <label>Estimated Return<input type="datetime-local" value={form.estimatedReturn} onChange={e=>set('estimatedReturn',e.target.value)}/></label>
      <label>Return Pickup<input type="datetime-local" value={form.returnPickupTime} onChange={e=>set('returnPickupTime',e.target.value)}/></label>
      <label>Driver<input value={form.driver} onChange={e=>set('driver',e.target.value)} /></label>
      <label>Destination Contact<input value={form.destinationContact} onChange={e=>set('destinationContact',e.target.value)} /></label>
      <label className="check-row"><input type="checkbox" checked={form.escortRequired} onChange={e=>set('escortRequired',e.target.checked)}/> Escort Required</label>
      <label>Escort Name<input disabled={!form.escortRequired} value={form.escortName} onChange={e=>set('escortName',e.target.value)} /></label>
      <label className="check-row"><input type="checkbox" checked={form.oxygenRequired} onChange={e=>set('oxygenRequired',e.target.checked)}/> Oxygen Required</label>
      <label>Oxygen Details<input disabled={!form.oxygenRequired} value={form.oxygenDetails} onChange={e=>set('oxygenDetails',e.target.value)} /></label>
      <label>Sending Nurse<input value={form.sendingNurse} onChange={e=>set('sendingNurse',e.target.value)} /></label>
      <label>Receiving Staff<input value={form.receivingStaff} onChange={e=>set('receivingStaff',e.target.value)} /></label>
      <label>Returned To Unit By<input value={form.returnedToUnitBy} onChange={e=>set('returnedToUnitBy',e.target.value)} /></label>
      <label className="span-full">Notes<textarea value={form.notes} onChange={e=>set('notes',e.target.value)} /></label>
    </div>
    <div className="form-actions"><button className="primary" type="submit">Save Travel Request</button></div>
  </form>;
}
