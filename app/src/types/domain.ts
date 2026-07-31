export type VeteranStatus =
  | 'Active'
  | 'At Appointment'
  | 'Leave of Absence'
  | 'Hospital'
  | 'Discharged / Archived';

export type FallRisk = string;

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
export type MobilityMode = string;

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

export type TreatmentCategory = 'Licensed' | 'Non-Licensed';
export type TreatmentFrequency = 'Daily' | 'Weekly' | 'As Scheduled' | 'PRN';
export type TreatmentShift = 'Day' | 'Night' | 'Both';
export type ScheduledDay = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export interface Treatment {
  id: string;
  veteranId: string;
  name: string;
  category: TreatmentCategory;
  frequency: TreatmentFrequency;
  shift: TreatmentShift;
  startDate: string;
  endDate: string;
  scheduledDays: ScheduledDay[];
  instructions: string;
  notes: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
}

export interface TreatmentCompletion {
  id: string;
  treatmentId: string;
  completionDate: string;
  shift: 'Day' | 'Night';
  completedAt: string;
  completedBy: string;
}

export interface ShiftAssignment {
  role: string;
  staffName: string;
  shift: 'Day' | 'Night';
}

export type ManagedListKey =
  | 'specialties' | 'medicationMethods' | 'diets' | 'isolationTypes'
  | 'assistLevels' | 'mobilityOptions' | 'fallRiskLevels' | 'toiletingOptions'
  | 'transportationModes' | 'appointmentReasons' | 'facilities' | 'treatmentTypes';

export type ManagedLists = Record<ManagedListKey, string[]>;

export interface BravoShiftState {
  veterans: Veteran[];
  appointments: Appointment[];
  treatments: Treatment[];
  treatmentCompletions: TreatmentCompletion[];
  travelRequests: TravelRequest[];
  shiftAssignments: ShiftAssignment[];
  staffAssignmentRecords: StaffAssignmentRecord[];
  morningReportNotes: MorningReportNote[];
  managedLists: ManagedLists;
}

export interface MorningReportNote {
  id: string;
  reportDate: string;
  shift: StaffShift;
  category: 'Clinical' | 'Staffing' | 'Transport' | 'Appointment' | 'Family / Provider' | 'Operations';
  priority: 'Routine' | 'Urgent' | 'Critical';
  text: string;
  createdAt: string;
  updatedAt: string;
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


