import { useMemo, useState } from 'react';
import { Banknote, AlertTriangle, CheckCircle, XCircle, Calendar, MapPin } from 'lucide-react';

function RiskPill({ score }) {
  const label = score < 0.3 ? 'Low' : score < 0.6 ? 'Moderate' : 'High';
  const color = score < 0.3 ? 'emerald' : score < 0.6 ? 'amber' : 'rose';
  return (
    <span className={`inline-flex items-center rounded-full bg-${color}-50 text-${color}-700 px-2 py-0.5 text-xs font-medium`}>{label} ({(score*100).toFixed(0)})</span>
  );
}

function LoanRow({ app, onDecision }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-3 rounded-lg border bg-white p-3">
      <div className="sm:col-span-3">
        <div className="font-medium">{app.farmerName}</div>
        <div className="text-xs text-slate-500 flex items-center gap-1"><MapPin size={12}/> {app.region}</div>
      </div>
      <div className="sm:col-span-2">
        <div className="text-sm">{app.crop}</div>
        <div className="text-xs text-slate-500">{app.acreage} acres</div>
      </div>
      <div className="sm:col-span-2">
        <div className="text-sm font-semibold">${app.amount}</div>
        <div className="text-xs text-slate-500 flex items-center gap-1"><Calendar size={12}/> {app.tenorMonths} mo</div>
      </div>
      <div className="sm:col-span-3 flex items-center gap-2">
        <RiskPill score={app.riskScore} />
        {app.weatherRisk === 'High' && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-700 px-2 py-0.5 text-xs"><AlertTriangle size={12}/>Weather</span>
        )}
      </div>
      <div className="sm:col-span-2 flex gap-2 justify-end">
        <button
          onClick={() => onDecision(app.id, 'Approved')}
          className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
        >
          <CheckCircle size={16}/> Approve
        </button>
        <button
          onClick={() => onDecision(app.id, 'Declined')}
          className="inline-flex items-center gap-1 rounded-md bg-rose-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-rose-700"
        >
          <XCircle size={16}/> Decline
        </button>
      </div>
    </div>
  );
}

export default function LenderDashboard({ applications, onDecision }) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    return applications.filter((a) =>
      [a.farmerName, a.region, a.crop, a.status].join(' ').toLowerCase().includes(query.toLowerCase())
    );
  }, [applications, query]);

  const portfolio = useMemo(() => {
    const total = applications.length;
    const approved = applications.filter((a) => a.status === 'Approved');
    const declined = applications.filter((a) => a.status === 'Declined');
    const pending = applications.filter((a) => a.status === 'Pending');
    const exposure = approved.reduce((s, a) => s + a.amount, 0);
    const avgRisk = applications.length ? applications.reduce((s, a) => s + a.riskScore, 0) / applications.length : 0;
    return { total, exposure, avgRisk, pending: pending.length, declined: declined.length, approved: approved.length };
  }, [applications]);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-700">
            <Banknote size={18} />
            <span className="font-medium">Credit pipeline</span>
          </div>
          <input
            placeholder="Search farmer, region, crop..."
            className="rounded-md border px-3 py-2 text-sm w-64"
            value={query}
            onChange={(e)=>setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="text-sm text-slate-500">Applications</div>
          <div className="text-2xl font-semibold">{portfolio.total}</div>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="text-sm text-slate-500">Approved</div>
          <div className="text-2xl font-semibold">{portfolio.approved}</div>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="text-sm text-slate-500">Exposure (USD)</div>
          <div className="text-2xl font-semibold">${portfolio.exposure}</div>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="text-sm text-slate-500">Avg risk</div>
          <div className="text-2xl font-semibold">{(portfolio.avgRisk*100).toFixed(0)}%</div>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="rounded-lg border bg-white p-6 text-center text-slate-500">No applications match your search.</div>
        )}
        {filtered.map((app) => (
          <LoanRow key={app.id} app={app} onDecision={onDecision} />
        ))}
      </div>
    </div>
  );
}
