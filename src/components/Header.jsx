import { Rocket, Leaf, Banknote, Truck } from 'lucide-react';

function Header({ activeTab, onTabChange }) {
  return (
    <header className="sticky top-0 z-40 border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Rocket size={18} />
            </div>
            <div>
              <div className="text-lg font-semibold tracking-tight">AgroResilience</div>
              <div className="text-xs text-slate-500 -mt-1">Data-driven finance and cold chain for smallholders</div>
            </div>
          </div>
          <nav className="flex items-center gap-1">
            <button
              onClick={() => onTabChange('farmer')}
              className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
                activeTab === 'farmer' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-100'
              }`}
              aria-current={activeTab === 'farmer' ? 'page' : undefined}
            >
              <Leaf size={16} /> Farmer
            </button>
            <button
              onClick={() => onTabChange('lender')}
              className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
                activeTab === 'lender' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-100'
              }`}
              aria-current={activeTab === 'lender' ? 'page' : undefined}
            >
              <Banknote size={16} /> Lender
            </button>
            <button
              onClick={() => onTabChange('logistics')}
              className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
                activeTab === 'logistics' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-100'
              }`}
              aria-current={activeTab === 'logistics' ? 'page' : undefined}
            >
              <Truck size={16} /> Logistics
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
