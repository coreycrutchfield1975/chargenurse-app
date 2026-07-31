import type { BravoShiftDB, ManagedListItem } from './types';

const KEY = 'cn-spectrum-db';
const D = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export const EMPTY: BravoShiftDB = {
  veterans: [], appointments: [], staff: {}, providers: [
    { id:'p1', name:'Example Cardiology Clinic', specialty:'Cardiology', facility:'VA Medical Center', city:'Example City', phone:'555-0101', active:true },
    { id:'p2', name:'Example Eye Clinic', specialty:'Ophthalmology', facility:'Community Clinic', city:'Example City', phone:'555-0102', active:true }
  ], travel: {}, tickets: {}, treatments: [], treatmentCompletions: {}, managedLists: {}
};

const LIST_DEFAULTS: Record<string,string[]> = {
  specialties:['LTC','RESP','EOL','SSR','Cardiology','Ophthalmology'],
  medicationMethods:['Whole','Crushed','Whole in Applesauce','Crushed in Applesauce','Whole in Pudding','Crushed in Pudding','Liquid','Via PEG/G-Tube','Other'],
  diets:['Regular','Low NA','Low Fat','Finger Foods','Puree','PEG','G-Tube','Soft and Bite Sized','Other'],
  isolationTypes:['Standard','Contact','Enhanced','Airborne','Droplet','Reverse'],
  assistLevels:['Independent','1','2','1 to 2','Total','SBA'],
  mobilityOptions:['Ambulatory','Wheelchair','Walker','Cane','Bedbound','Mechanical Lift','Other'],
  fallRiskLevels:['Standard','Moderate','High','See Current Care Plan'],
  toiletingOptions:['Continent','Incontinent','Incontinent at Times','Incontinent of BM'],
  transportationModes:['JC Shuttle Bus','Wheelchair Van','Ambulance - ALS','Ambulance - BLS','JJP - VTS','Other'],
  appointmentReasons:['Consult','Procedure','Discharge','Admission','Follow Up','Testing'],
  facilities:['VA Medical Center','Community Clinic'],
  treatmentTypes:['PICC','Foley','PEG','Trach','Wound Care','Oral Care','Lotion','Range of Motion','TED Hose','Shampoo']
};

export const LIST_LABELS: Record<string,string> = {
  specialties:'Specialties',medicationMethods:'Medication Methods',diets:'Diets',
  isolationTypes:'Isolation Types',assistLevels:'Assist Levels',mobilityOptions:'Mobility Options',
  fallRiskLevels:'Fall Risk Levels',toiletingOptions:'Toileting Options',
  transportationModes:'Transportation Modes',appointmentReasons:'Appointment Reasons',
  facilities:'Facilities / Destinations',treatmentTypes:'Treatment Types'
};

function defaultLists(): Record<string,ManagedListItem[]> {
  const r: Record<string,ManagedListItem[]> = {};
  for (const [k,v] of Object.entries(LIST_DEFAULTS)) {
    r[k] = v.map((val,i) => ({ id: `${k}-${i+1}`, value: val, active: true }));
  }
  return r;
}

export function load(): BravoShiftDB {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...EMPTY, managedLists: defaultLists() };
    const db = JSON.parse(raw) as Partial<BravoShiftDB>;
    // Ensure managedLists exist
    if (!db.managedLists || Object.keys(db.managedLists).length === 0) {
      db.managedLists = defaultLists();
    } else {
      // Fill in any missing list types
      for (const k of Object.keys(LIST_DEFAULTS)) {
        if (!db.managedLists[k]) {
          db.managedLists[k] = LIST_DEFAULTS[k].map((v,i) => ({id:`${k}-${i+1}`,value:v,active:true}));
        }
      }
    }
    // Normalize legacy string values to objects
    for (const k of Object.keys(db.managedLists)) {
      db.managedLists[k] = db.managedLists[k].map(item =>
        typeof item === 'string' ? { id: `${k}-${Date.now()}`, value: item as string, active: true } : item
      );
    }
    // Ensure all arrays exist
    return {
      veterans: db.veterans || [],
      appointments: db.appointments || [],
      staff: db.staff || {},
      providers: db.providers || EMPTY.providers,
      travel: db.travel || {},
      tickets: db.tickets || {},
      treatments: db.treatments || [],
      treatmentCompletions: db.treatmentCompletions || {},
      managedLists: db.managedLists || defaultLists()
    };
  } catch {
    return { ...EMPTY, managedLists: defaultLists() };
  }
}

export function save(db: BravoShiftDB): void {
  localStorage.setItem(KEY, JSON.stringify(db));
}

export function activeList(db: BravoShiftDB, key: string): string[] {
  return (db.managedLists[key] || []).filter(x => x.active).map(x => x.value);
}

export function today(): string { return new Date().toISOString().slice(0,10); }

export function daysOnUnit(admission: string): string {
  if (!admission) return '';
  return String(Math.max(0, Math.floor((Date.now() - new Date(admission+'T12:00:00').getTime()) / 86400000)));
}

export function vetLabel(db: BravoShiftDB, id: string): string {
  const v = db.veterans.find(x => x.id === id);
  return v ? `Room ${v.room} — ${v.name}` : 'Unknown Veteran';
}

export function esc(s: unknown): string {
  return String(s ?? '').replace(/[&<>"']/g, c =>
    ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c as '&']));
}

export function treatmentDueOn(t: {active:boolean;start:string;end:string;frequency:string;days:string[]}, date: string): boolean {
  if (!t.active) return false;
  if (t.start && date < t.start) return false;
  if (t.end && date > t.end) return false;
  if (t.frequency === 'PRN') return false;
  if (t.frequency === 'Daily') return true;
  const day = D[new Date(date+'T12:00:00').getDay()];
  return (t.days || []).includes(day);
}
