export type VeteranStatus =
  | 'Active'
  | 'At Appointment'
  | 'Leave of Absence'
  | 'Hospital'
  | 'Discharged / Archived';

export type FallRisk = 'Low' | 'Moderate' | 'High' | '';

export interface Veteran {
  id: string;
  name: string;
  last4: string;
  room: string;
  status: VeteranStatus;
  admissionDate: string;
  provider: string;
  specialty: string;
  codeStatus: string;
  mobility: string;
  fallRisk: FallRisk;
  medicationMethod: string;
  diet: string;
  isolation: string;
  assistLevel: string;
  toileting: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
}

export type AppointmentStatus =
  | 'Upcoming'
  | 'In Progress'
  | 'Completed'
  | 'Cancelled'
  | 'No Show';

export interface Appointment {
  id: string;
  veteranId: string;
  date: string;
  time: string;
  destination: string;
  provider?: string;
  transport?: string;
  pickupTime?: string;
  status: AppointmentStatus;
}

export interface Treatment {
  id: string;
  veteranId: string;
  name: string;
  category: 'Licensed' | 'Non-licensed';
  shift: 'Day' | 'Night' | 'Any';
  dueDate: string;
  completedAt?: string;
  active: boolean;
}

export interface ShiftAssignment {
  role: string;
  staffName: string;
  shift: 'Day' | 'Night';
}

export interface BravoShiftState {
  veterans: Veteran[];
  appointments: Appointment[];
  treatments: Treatment[];
  shiftAssignments: ShiftAssignment[];
}
