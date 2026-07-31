import type { BravoShiftState } from '../../types/domain';
import { buildExecutiveAnalytics, type TrendPoint } from './analytics';

function MiniBars({ points, suffix = '' }: { points: TrendPoint[]; suffix?: string }) {
  const max = Math.max(...points.map((point) => point.value), 1);
  return <div className="mini-chart" aria-label="Seven-day trend">{points.map((point) => <div key={point.label} className="mini-bar-column"><div className="mini-bar-value">{point.value}{suffix}</div><div className="mini-bar-track"><span style={{ height: `${Math.max((point.value / max) * 100, point.value ? 8 : 0)}%` }} /></div><small>{point.label}</small></div>)}</div>;
}

export function ExecutiveAnalyticsPage({ state }: { state: BravoShiftState }) {
  const analytics = buildExecutiveAnalytics(state);
  return <section className="feature-page executive-dashboard">
    <header className="page-heading no-print"><div><p className="eyebrow">Module 2.8</p><h2>Clinical Analytics & Executive Dashboard</h2><p>Leadership-level quality, staffing, treatment, transport, and census intelligence.</p></div><button className="primary-button" type="button" onClick={() => window.print()}>Print Executive Brief</button></header>

    <div className="executive-hero">
      <div className={`executive-score ${analytics.qualityScore >= 90 ? 'score-good' : analytics.qualityScore >= 75 ? 'score-watch' : 'score-risk'}`}><span>Quality Score</span><strong>{analytics.qualityScore}</strong><small>{analytics.riskLevel}</small></div>
      <div><p className="eyebrow">BravoShift leadership brief</p><h2>Unit performance is {analytics.riskLevel.toLowerCase()}.</h2><p>Score combines appointment completion, transport success, treatments, staffing coverage, and report documentation.</p></div>
    </div>

    <div className="analytics-kpis">
      {[
        ['Active Census', analytics.census, 'Veterans'],
        ['Hospital', analytics.hospitalCount, 'Current'],
        ['High Fall Risk', analytics.highFallRisk, 'Active'],
        ['Isolation', analytics.isolationCount, 'Precautions'],
        ['Appointments', `${analytics.appointmentCompletionRate}%`, 'Completion'],
        ['Transport', `${analytics.transportSuccessRate}%`, 'Success'],
        ['Treatments', `${analytics.treatmentCompletionRate}%`, 'Completion'],
        ['Staffing', `${analytics.staffingFillRate}%`, 'Fill rate'],
        ['Documentation', `${analytics.documentationRate}%`, 'Completion'],
      ].map(([label, value, helper]) => <article key={label}><span>{label}</span><strong>{value}</strong><small>{helper}</small></article>)}
    </div>

    <div className="analytics-grid">
      <article className="report-section"><h3>Seven-Day Appointment Volume</h3><MiniBars points={analytics.appointmentTrend} /></article>
      <article className="report-section"><h3>Seven-Day Transport Requests</h3><MiniBars points={analytics.transportTrend} /></article>
      <article className="report-section"><h3>Seven-Day Staff Coverage</h3><MiniBars points={analytics.staffingTrend} /></article>
      <article className="report-section"><h3>Executive Quality Alerts</h3><ul className="executive-alerts">{analytics.alerts.map((alert) => <li key={alert}>{alert}</li>)}</ul></article>
    </div>

    <article className="report-section executive-summary-table"><h3>Performance Targets</h3><table className="record-table"><thead><tr><th>Measure</th><th>Current</th><th>Target</th><th>Status</th></tr></thead><tbody>{[
      ['Appointment completion', analytics.appointmentCompletionRate, 90],
      ['Transport success', analytics.transportSuccessRate, 95],
      ['Treatment completion', analytics.treatmentCompletionRate, 90],
      ['Staffing fill', analytics.staffingFillRate, 95],
      ['Documentation', analytics.documentationRate, 95],
    ].map(([label, current, target]) => <tr key={String(label)}><td>{label}</td><td>{current}%</td><td>{target}%</td><td><span className={`status-badge ${Number(current) >= Number(target) ? 'metric-on-target' : 'metric-below-target'}`}>{Number(current) >= Number(target) ? 'On Target' : 'Needs Attention'}</span></td></tr>)}</tbody></table></article>

    <footer className="report-signatures"><span>Generated: {new Date().toLocaleString()}</span><span>Executive review: ____________________</span><span>Follow-up date: ____________________</span></footer>
  </section>;
}
