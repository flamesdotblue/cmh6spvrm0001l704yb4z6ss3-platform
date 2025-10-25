import { useMemo, useState } from 'react';
import { CloudSun, Droplets, Calendar, MapPin, TrendingUp, CheckCircle } from 'lucide-react';

function StatCard({ title, value, icon: Icon, accent = 'emerald' }) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-500">{title}</div>
          <div className="mt-1 text-xl font-semibold">{value}</div>
        </div>
        <div className={`rounded-lg p-2 bg-${accent}-50 text-${accent}-600`}> 
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}

function WeatherStrip({ weather }) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-slate-700">
          <CloudSun size={18} />
          <span className="font-medium">7-day outlook</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-slate-500">
          <MapPin size={14} />
          {weather.location}
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {weather.next7Days.map((d) => (
          <div key={d.day} className="rounded-lg border p-2 text-center">
            <div className="text-xs font-medium text-slate-600">{d.day}</div>
            <div className="text-sm font-semibold">{d.tmax}° / {d.tmin}°C</div>
            <div className="text-xs text-sky-600 flex items-center justify-center gap-1 mt-1">
              <Droplets size={12} /> {d.rainMM}mm
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AIAdvisor({ crop, stage, weather }) {
  const tips = useMemo(() => {
    const rainSoon = weather.next7Days.some((d) => d.rainMM >= 5);
    const advisory = [];
    if (stage === 'Pre-planting') {
      advisory.push('Prepare seedbed and ensure access to certified seed.');
      if (weather.plantingWindow.includes('Open')) advisory.push('Planting window is open next 10 days—schedule planting within 3–5 days.');
    }
    if (stage === 'Vegetative') {
      advisory.push('Apply first top-dress nitrogen before expected rains.');
      if (!rainSoon) advisory.push('Irrigate lightly in the next 48h to support nutrient uptake.');
    }
    if (stage === 'Reproductive') {
      advisory.push('Monitor for fall armyworm after rains; scout twice weekly.');
    }
    return advisory;
  }, [stage, weather]);

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-slate-700 mb-2">
        <TrendingUp size={18} />
        <span className="font-medium">AI agronomy advisor</span>
      </div>
      <div className="text-sm text-slate-600 mb-3">Crop: <span className="font-medium text-slate-700">{crop}</span> • Stage: <span className="font-medium text-slate-700">{stage}</span></div>
      <ul className="space-y-2">
        {tips.map((t, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <CheckCircle size={16} className="text-emerald-600 mt-0.5" />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function FarmerDashboard({ weather, onApplyCredit }) {
  const [form, setForm] = useState({
    farmerName: 'Amina K.',
    region: 'Nakuru, Kenya',
    crop: 'Maize',
    acreage: 2.5,
    amount: 450,
    tenorMonths: 6,
    stage: 'Pre-planting',
  });

  const riskIndex = useMemo(() => {
    const rainAvg = weather.next7Days.reduce((a, b) => a + b.rainMM, 0) / weather.next7Days.length;
    const base = 0.35;
    const adjustment = rainAvg < 2 ? 0.1 : rainAvg > 5 ? -0.05 : 0;
    return Math.max(0.1, Math.min(0.85, base + adjustment));
  }, [weather]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Farm size" value={`${form.acreage} acres`} icon={Calendar} accent="emerald" />
        <StatCard title="Crop" value={form.crop} icon={TrendingUp} accent="sky" />
        <StatCard title="Climate risk index" value={(riskIndex * 100).toFixed(0) + '%'} icon={CloudSun} accent="amber" />
        <StatCard title="Planting window" value={weather.plantingWindow} icon={Calendar} accent="violet" />
      </div>

      <WeatherStrip weather={weather} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-700 mb-3">
            <Calendar size={18} />
            <span className="font-medium">Season plan and credit</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Farmer name</label>
              <input value={form.farmerName} onChange={(e)=>setForm({...form, farmerName:e.target.value})} className="w-full rounded-md border px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Region</label>
              <input value={form.region} onChange={(e)=>setForm({...form, region:e.target.value})} className="w-full rounded-md border px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Crop</label>
              <select value={form.crop} onChange={(e)=>setForm({...form, crop:e.target.value})} className="w-full rounded-md border px-3 py-2 text-sm">
                <option>Maize</option>
                <option>Rice</option>
                <option>Beans</option>
                <option>Tomato</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Growth stage</label>
              <select value={form.stage} onChange={(e)=>setForm({...form, stage:e.target.value})} className="w-full rounded-md border px-3 py-2 text-sm">
                <option>Pre-planting</option>
                <option>Vegetative</option>
                <option>Reproductive</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Acreage (acres)</label>
              <input type="number" step="0.1" value={form.acreage} onChange={(e)=>setForm({...form, acreage:parseFloat(e.target.value) || 0})} className="w-full rounded-md border px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Loan amount (USD)</label>
              <input type="number" step="10" value={form.amount} onChange={(e)=>setForm({...form, amount:parseFloat(e.target.value) || 0})} className="w-full rounded-md border px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Tenor (months)</label>
              <select value={form.tenorMonths} onChange={(e)=>setForm({...form, tenorMonths:parseInt(e.target.value)})} className="w-full rounded-md border px-3 py-2 text-sm">
                <option value={3}>3</option>
                <option value={6}>6</option>
                <option value={9}>9</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-slate-600">Based on current weather, risk-adjusted APR could be <span className="font-medium text-slate-700">{(8 + riskIndex*10).toFixed(1)}%</span>.</div>
            <button
              onClick={() => onApplyCredit(form)}
              className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Apply for credit
            </button>
          </div>
        </div>

        <AIAdvisor crop={form.crop} stage={form.stage} weather={weather} />
      </div>
    </div>
  );
}
