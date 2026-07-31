import type { ScheduledDay, Treatment, TreatmentCompletion, TreatmentShift } from '../../types/domain';

const DAYS: ScheduledDay[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function localDateKey(date = new Date()): string {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

export function treatmentDueOn(treatment: Treatment, dateKey: string, shift?: 'Day' | 'Night'): boolean {
  if (!treatment.active || treatment.frequency === 'PRN') return false;
  if (treatment.startDate && dateKey < treatment.startDate) return false;
  if (treatment.endDate && dateKey > treatment.endDate) return false;
  if (shift && treatment.shift !== 'Both' && treatment.shift !== shift) return false;
  if (treatment.frequency === 'Daily') return true;
  const day = DAYS[new Date(`${dateKey}T12:00:00`).getDay()];
  if (treatment.frequency === 'Weekly' || treatment.frequency === 'As Scheduled') {
    return treatment.scheduledDays.includes(day);
  }
  return false;
}

export function expectedShifts(treatment: Treatment): Array<'Day' | 'Night'> {
  return treatment.shift === 'Both' ? ['Day', 'Night'] : [treatment.shift];
}

export function completionFor(completions: TreatmentCompletion[], treatmentId: string, dateKey: string, shift: 'Day' | 'Night') {
  return completions.find(item => item.treatmentId === treatmentId && item.completionDate === dateKey && item.shift === shift);
}

export function isTreatmentCompleteForDate(treatment: Treatment, completions: TreatmentCompletion[], dateKey: string): boolean {
  return expectedShifts(treatment).every(shift => Boolean(completionFor(completions, treatment.id, dateKey, shift)));
}

export function isOverdue(treatment: Treatment, completions: TreatmentCompletion[], dateKey: string, now = new Date()): boolean {
  if (!treatmentDueOn(treatment, dateKey) || isTreatmentCompleteForDate(treatment, completions, dateKey)) return false;
  const today = localDateKey(now);
  if (dateKey < today) return true;
  if (dateKey > today) return false;
  const currentHour = now.getHours();
  if (treatment.shift === 'Day') return currentHour >= 15;
  if (treatment.shift === 'Night') return currentHour >= 23;
  return currentHour >= 23;
}

export function treatmentScheduleLabel(treatment: Treatment): string {
  if (treatment.frequency === 'Daily' || treatment.frequency === 'PRN') return treatment.frequency;
  const days = treatment.scheduledDays.map(day => day.slice(0, 3)).join(', ');
  return days ? `${treatment.frequency}: ${days}` : treatment.frequency;
}

export function countDueByCategory(treatments: Treatment[], dateKey: string, category: Treatment['category']): number {
  return treatments.filter(item => item.category === category && treatmentDueOn(item, dateKey)).length;
}

export function normalizeShiftFilter(value: TreatmentShift | 'All'): TreatmentShift | undefined {
  return value === 'All' ? undefined : value;
}
