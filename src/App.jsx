import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import FarmerDashboard from './components/FarmerDashboard';
import LenderDashboard from './components/LenderDashboard';
import LogisticsDashboard from './components/LogisticsDashboard';

function App() {
  const [activeTab, setActiveTab] = useState('farmer');

  // Shared state: loan applications pipeline
  const [loanApplications, setLoanApplications] = useState([
    {
      id: 'LN-1001',
      farmerName: 'Amina K.',
      region: 'Nakuru, Kenya',
      crop: 'Maize',
      acreage: 2.5,
      amount: 350,
      tenorMonths: 6,
      riskScore: 0.34,
      weatherRisk: 'Moderate',
      status: 'Pending',
      submittedAt: new Date().toISOString(),
    },
  ]);

  // Logistics: IoT cold unit simulated readings
  const [coldUnits, setColdUnits] = useState([
    {
      id: 'CU-01',
      location: 'Kisumu Hub',
      targetTemp: 4,
      tempC: 4.2,
      rh: 78,
      lastUpdated: new Date().toISOString(),
      status: 'OK',
    },
    {
      id: 'CU-02',
      location: 'Eldoret Mobile Truck',
      targetTemp: 6,
      tempC: 6.5,
      rh: 82,
      lastUpdated: new Date().toISOString(),
      status: 'OK',
    },
  ]);

  // Simulate continuous IoT updates
  useEffect(() => {
    const interval = setInterval(() => {
      setColdUnits((prev) =>
        prev.map((u) => {
          const tempDrift = (Math.random() - 0.5) * 0.8; // +/-0.4C
          const rhDrift = (Math.random() - 0.5) * 3; // +/-1.5%
          const tempC = +(u.tempC + tempDrift).toFixed(2);
          const rh = Math.max(60, Math.min(95, +(u.rh + rhDrift).toFixed(1)));
          const deviation = Math.abs(tempC - u.targetTemp);
          const status = deviation > 1.5 || rh < 65 || rh > 90 ? 'Alert' : 'OK';
          return { ...u, tempC, rh, status, lastUpdated: new Date().toISOString() };
        })
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Simulated weather insights for farmer regions
  const weatherInsight = useMemo(() => ({
    location: 'Nakuru, Kenya',
    next7Days: [
      { day: 'Mon', tmax: 26, tmin: 14, rainMM: 2 },
      { day: 'Tue', tmax: 25, tmin: 13, rainMM: 0 },
      { day: 'Wed', tmax: 27, tmin: 15, rainMM: 4 },
      { day: 'Thu', tmax: 28, tmin: 15, rainMM: 6 },
      { day: 'Fri', tmax: 24, tmin: 12, rainMM: 1 },
      { day: 'Sat', tmax: 25, tmin: 13, rainMM: 0 },
      { day: 'Sun', tmax: 26, tmin: 14, rainMM: 3 },
    ],
    droughtRisk: 'Low',
    floodRisk: 'Low',
    plantingWindow: 'Open (next 10 days)',
  }), []);

  const handleCreateLoan = (payload) => {
    const id = `LN-${1000 + loanApplications.length + 1}`;
    const riskScore = Math.min(0.95, Math.max(0.05, 0.2 + Math.random() * 0.5));
    const weatherRisk = weatherInsight.floodRisk === 'High' || weatherInsight.droughtRisk === 'High' ? 'High' : 'Moderate';
    const app = {
      id,
      farmerName: payload.farmerName,
      region: payload.region,
      crop: payload.crop,
      acreage: payload.acreage,
      amount: payload.amount,
      tenorMonths: payload.tenorMonths,
      riskScore,
      weatherRisk,
      status: 'Pending',
      submittedAt: new Date().toISOString(),
    };
    setLoanApplications((prev) => [app, ...prev]);
    setActiveTab('lender');
  };

  const handleUpdateLoanStatus = (id, status) => {
    setLoanApplications((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'farmer' && (
          <FarmerDashboard weather={weatherInsight} onApplyCredit={handleCreateLoan} />
        )}
        {activeTab === 'lender' && (
          <LenderDashboard applications={loanApplications} onDecision={handleUpdateLoanStatus} />
        )}
        {activeTab === 'logistics' && (
          <LogisticsDashboard coldUnits={coldUnits} />
        )}
      </main>
      <footer className="border-t bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 text-sm text-slate-500 flex items-center justify-between">
          <span>© {new Date().getFullYear()} AgroResilience Platform</span>
          <span>Empowering farmers • De-risking lenders • Protecting harvests</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
