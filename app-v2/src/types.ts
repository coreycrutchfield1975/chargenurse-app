// Domain types for BravoShift — mirrors v1.8 data structures

export interface Veteran {
  id: string; room: number; name: string; last4: string;
  status: 'Active'|'At Appointment'|'Leave of Absence'|'Hospital'|'Discharged / Archived';
  codeStatus: string; specialty: string; providerId: string;
  admission: string; meds: string; diet: string; isolation: string;
  assist: string; mobility: string; fallRisk: string; toileting: string;
  notes: string;
  schedules: { skin: string[]; weight: string[]; vitals: string[]; shower: string[] };
  showerShift: 'Day'|'Night';
}

export interface Provider {
  id: string; name: string; specialty: string; facility: string; city: string;
  phone: string; active: boolean;
}

export interface Appointment {
  id: string; vetId: string; providerId: string;
  date: string; time: string; clinic: string; reason: string;
  destination: string; pickup: string; transport: string; escort: string;
  status: 'Upcoming'|'In Progress'|'Completed'|'Cancelled'|'No Show';
  notes: string; createdAt: string; updatedAt: string;
}

export interface TravelRequest {
  status: 'Draft'|'Confirmed'|'Cancelled'|'Failed';
  currentLocation: string; destination: string; reason: string;
  date: string; time: string; pickup: string; clinic: string;
  mode: string; escort: string; requestedBy: string; contact: string;
  reference: string; comments: string; updated: string; confirmedAt: string;
}

export interface Treatment {
  id: string; vetId: string; type: string; category: 'Licensed'|'Non-Licensed';
  frequency: 'Daily'|'Weekly'|'As Scheduled'|'PRN';
  start: string; end: string; shift: 'Day'|'Night'|'Both';
  days: string[]; instructions: string; notes: string; active: boolean;
}

export interface Ticket {
  nkda: boolean; allergies: boolean; specialNeeds: string; language: string;
  hearing: string; vision: string; respiratory: string; position: string;
  painPlan: string; lastPainMed: string; lastPainTime: string;
  lastSedationMed: string; lastSedationTime: string;
  sao2: string; rhythm: string; bp: string;
  ivAccess: string; ivLocation: string; ivRate: string; monitoringOther: string;
  sendingNurse: string; phone: string; returnStatus: string; returnNotes: string;
  recorder: string; preparedAt: string;
}

export interface ManagedListItem { id: string; value: string; active: boolean }

export interface BravoShiftDB {
  veterans: Veteran[];
  appointments: Appointment[];
  staff: Record<string, { day: Record<string,string>; night: Record<string,string> }>;
  providers: Provider[];
  travel: Record<string, TravelRequest>;
  tickets: Record<string, Ticket>;
  treatments: Treatment[];
  treatmentCompletions: Record<string, { completedAt: string }>;
  managedLists: Record<string, ManagedListItem[]>;
}
