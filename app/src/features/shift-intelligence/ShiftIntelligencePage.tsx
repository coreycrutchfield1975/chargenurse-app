import { useMemo, useState } from 'react';
import type { BravoShiftState, StaffShift } from '../../types/domain';
import { buildShiftForecast } from './shiftIntelligence';

interface Props { state: BravoShiftState; }

const today = new Date().toISOString().slice(0, 10);

function scoreClass(score: number) { return score >= 85 ? 'score-good' : score >= 65 ? 'score-watch' : 'score-risk'; }

export function ShiftIntelligencePage({ state }: Props) {
  const [date, setDate] = useState(today);
  const [shift, setShift] = useState<StaffShift>('Day');
  const forecast = useMemo(() => buildShiftForecast(state, date, shift), [state, date, shift]);

  return <section className="feature-page intelligence-page">
    <div className="page-heading">
      <div><p className="eyebrow">Predictive Operations</p><h2>Shift Intelligence Engine</h2><p>Detect coverage gaps, forecast bottlenecks, and prioritize the work most likely to delay shift completion.</p></div>
      <button className="secondary-button no-print" type="button" onClick={() => window.print()}>Print Intelligence Brief</button>
    </div>

    <div className="report-controls no-print">
      <label>Date<input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
      <label>Shift<select value={shift} onChange={(e) => setShift(e.target.value as StaffShift)}><option>Day</option><option>Evening</option><option>Night</option></select></label>
    </div>

    <div className="intelligence-hero">
      <div className={`readiness-score ${scoreClass(forecast.readinessScore)}`}><span>Shift Readiness</span><b>{forecast.readinessScore}</b><small>/100</small></div>
      <div><h3>{forecast.readinessScore >= 85 ? 'Shift is positioned for on-time completion.' : forecast.readinessScore >= 65 ? 'Shift is workable but needs active coordination.' : 'Shift requires immediate charge-nurse intervention.'}</h3><p>Forecasted completion probability: <strong>{forecast.completionForecast}%</strong></p></div>
    </div>

    <div className="metric-grid intelligence-metrics">
      <article><span>Workload Pressure</span><strong>{forecast.workloadScore}%</strong><small>{forecast.workloadScore > 75 ? 'High demand' : 'Manageable demand'}</small></article>
      <article><span>Staffing Readiness</span><strong>{forecast.staffingScore}%</strong><small>Coverage and call-offs</small></article>
      <article><span>Predicted Bottlenecks</span><strong>{forecast.predictedBottlenecks}</strong><small>High or critical</small></article>
      <article><span>Uncovered Veterans</span><strong>{forecast.uncoveredVeterans}</strong><small>Need assignment</small></article>
      <article><span>Treatments Pending</span><strong>{forecast.overdueTreatments}</strong><small>Due this shift</small></article>
      <article><span>Transport Risks</span><strong>{forecast.atRiskTransports}</strong><small>Pending or failed</small></article>
    </div>

    <div className="report-grid">
      <article className="report-section">
        <h3>Risk Queue</h3>
        {forecast.risks.length === 0 ? <p className="good-text">No active operational risks detected.</p> : <div className="risk-queue">{forecast.risks.map((risk) => <div className={`risk-card severity-${risk.severity.toLowerCase()}`} key={risk.id}><div><span>{risk.category}</span><b>{risk.severity}</b></div><h4>{risk.title}</h4><p>{risk.detail}</p><strong>Action: {risk.recommendedAction}</strong></div>)}</div>}
      </article>
      <article className="report-section">
        <h3>Recommended Charge-Nurse Actions</h3>
        <ol className="recommendation-list">{forecast.recommendations.map((item, index) => <li key={`${item}-${index}`}><span>{index + 1}</span><p>{item}</p></li>)}</ol>
      </article>
    </div>

    <article className="report-section">
      <h3>Mid-Shift Reassessment</h3>
      <div className="decision-grid">
        <div><b>Rebalance threshold</b><p>Reassign workload when uncovered Veterans remain or workload pressure exceeds 75%.</p></div>
        <div><b>Escalation threshold</b><p>Escalate critical staffing, licensed-treatment, or failed-transport risks immediately.</p></div>
        <div><b>Completion checkpoint</b><p>At mid-shift, compare actual completion against the {forecast.completionForecast}% forecast.</p></div>
      </div>
    </article>
  </section>;
}
