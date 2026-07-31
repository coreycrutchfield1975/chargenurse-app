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

export type TravelRequestStatus =
  | 'Not Created'
  | 'Draft'
  | 'Confirmed'
  | 'Failed'
  | 'Cancelled';

export interface Appointment {
  id: string;
  veteranId: string;
  date: string;
  time: string;
  pickupTime: string;
  reason: string;
  specialty: string;
  destination: string;
  provider: string;
  transport: string;
  travelStatus: TravelRequestStatus;
  status: AppointmentStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type TransportStatus = 'Draft' | 'Pending' | 'Confirmed' | 'En Route' | 'At Destination' | 'Awaiting Return' | 'Completed' | 'Failed' | 'Cancelled';
export type MobilityMode = 'Ambulatory' | 'Wheelchair' | 'Stretcher' | 'Bariatric';

export interface TravelRequest {
  id: string;
  veteranId: string;
  appointmentId: string;
  status: TransportStatus;
  transportMode: string;
  mobilityMode: MobilityMode;
  pickupTime: string;
  estimatedReturn: string;
  returnPickupTime: string;
  driver: string;
  escortRequired: boolean;
  escortName: string;
  oxygenRequired: boolean;
  oxygenDetails: string;
  destinationContact: string;
  sendingNurse: string;
  receivingStaff: string;
  returnedToUnitBy: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
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
  travelRequests: TravelRequest[];
  shiftAssignments: ShiftAssignment[];
  staffAssignmentRecords: StaffAssignmentRecord[];
}

export type StaffRole = 'RN' | 'LPN' | 'CNA' | 'Charge Nurse' | 'Unit Clerk' | 'Other';
export type StaffShift = 'Day' | 'Evening' | 'Night';
export type AssignmentStatus = 'Scheduled' | 'Present' | 'Break' | 'Off Unit' | 'Called Off' | 'Completed';

export interface StaffAssignmentRecord {
  id: string;
  staffName: string;
  role: StaffRole;
  shift: StaffShift;
  assignmentDate: string;
  status: AssignmentStatus;
  zone: string;
  veteranIds: string[];
  treatmentCategories: Array<'Licensed' | 'Non-licensed'>;
  isChargeNurse: boolean;
  startTime: string;
  endTime: string;
  phoneExtension: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}
