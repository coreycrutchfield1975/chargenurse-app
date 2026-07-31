import type { Appointment, TravelRequest, Veteran } from '../../types/domain';
export function TicketToRide({request,veteran,appointment,onClose}:{request:TravelRequest;veteran?:Veteran;appointment?:Appointment;onClose:()=>void}){
 return <section className="panel ticket-to-ride">
  <div className="section-heading no-print"><div><p className="eyebrow">Printable handoff</p><h2>Ticket to Ride</h2></div><div><button className="secondary" onClick={onClose}>Close</button> <button className="primary" onClick={()=>window.print()}>Print</button></div></div>
  <div className="ticket-title"><strong>BRAVOSHIFT — TICKET TO RIDE</strong><span>Fictional test data only</span></div>
  <div className="ticket-grid">
   <div><h3>Veteran</h3><p><b>Name:</b> {veteran?.name||'—'}</p><p><b>Room:</b> {veteran?.room||'—'} &nbsp; <b>Last 4:</b> {veteran?.last4||'—'}</p><p><b>Code Status:</b> {veteran?.codeStatus||'—'}</p><p><b>Diet:</b> {veteran?.diet||'—'}</p><p><b>Mobility/Fall Risk:</b> {veteran?.mobility||'—'} / {veteran?.fallRisk||'—'}</p><p><b>Isolation:</b> {veteran?.isolation||'—'}</p></div>
   <div><h3>Appointment</h3><p><b>Date/Time:</b> {appointment?`${appointment.date} ${appointment.time}`:'—'}</p><p><b>Destination:</b> {appointment?.destination||'—'}</p><p><b>Provider:</b> {appointment?.provider||'—'}</p><p><b>Reason:</b> {appointment?.reason||'—'}</p><p><b>Contact:</b> {request.destinationContact||'—'}</p></div>
   <div><h3>Transportation</h3><p><b>Mode:</b> {request.transportMode}</p><p><b>Mobility:</b> {request.mobilityMode}</p><p><b>Pickup:</b> {request.pickupTime||'—'}</p><p><b>Estimated Return:</b> {request.estimatedReturn||'—'}</p><p><b>Driver:</b> {request.driver||'—'}</p><p><b>Escort:</b> {request.escortRequired?request.escortName||'Required':'Not required'}</p><p><b>Oxygen:</b> {request.oxygenRequired?request.oxygenDetails||'Required':'Not required'}</p></div>
   <div><h3>Handoff & Signatures</h3><p><b>Sending Nurse:</b> {request.sendingNurse||'________________'}</p><p><b>Receiving Staff:</b> {request.receivingStaff||'________________'}</p><p><b>Returned To Unit By:</b> {request.returnedToUnitBy||'________________'}</p><p><b>Status:</b> {request.status}</p><p><b>Notes:</b> {request.notes||'—'}</p></div>
  </div>
 </section>
}
