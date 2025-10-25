import { Thermometer, AlertTriangle, Truck } from 'lucide-react';

function UnitCard({ unit }) {
  const isAlert = unit.status === 'Alert';
  return (
    <div className={`rounded-xl border p-4 shadow-sm bg-white ${isAlert ? 'ring-1 ring-rose-200' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-slate-700">{unit.id}</div>
          <div className="text-xs text-slate-500">{unit.location}</div>
        </div>
        <div className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${isAlert ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
          {isAlert ? <AlertTriangle size={14}/> : <Thermometer size={14}/>} {unit.status}
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg border p-2">
          <div className="text-xs text-slate-500">Target</div>
          <div className="text-lg font-semibold">{unit.targetTemp}°C</div>
        </div>
        <div className="rounded-lg border p-2">
          <div className="text-xs text-slate-500">Temp</div>
          <div className={`text-lg font-semibold ${isAlert ? 'text-rose-600' : 'text-slate-800'}`}>{unit.tempC}°C</div>
        </div>
        <div className="rounded-lg border p-2">
          <div className="text-xs text-slate-500">Humidity</div>
          <div className={`text-lg font-semibold ${isAlert ? 'text-amber-600' : 'text-slate-800'}`}>{unit.rh}%</div>
        </div>
      </div>
      <div className="mt-3 text-xs text-slate-500">Updated: {new Date(unit.lastUpdated).toLocaleTimeString()}</div>
    </div>
  );
}

export default function LogisticsDashboard({ coldUnits }) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 text-slate-700">
          <Truck size={18} />
          <span className="font-medium">Cold chain monitor</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {coldUnits.map((u) => (
          <UnitCard key={u.id} unit={u} />
        ))}
      </div>

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="text-sm text-slate-600">
          SLA: Maintain temperature within ±1.5°C and RH 65–90%. Alerts trigger if thresholds are breached and are logged for audit.
        </div>
      </div>
    </div>
  );
}
