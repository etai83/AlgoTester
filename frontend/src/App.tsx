import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Simulator from './components/Simulator';
import History from './components/History';
import Settings from './components/Settings';
import { LayoutDashboard, History as HistoryIcon, Settings as SettingsIcon } from 'lucide-react';

function Dashboard() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'history' | 'settings'>('simulator');

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">AlgoTester</h1>
          <p className="text-gray-400">Backtest your strategies with ease.</p>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('simulator')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all ${
            activeTab === 'simulator' 
              ? 'bg-blue-600 text-white shadow' 
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
        >
          <LayoutDashboard size={18} />
          <span>Simulator</span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all ${
            activeTab === 'history' 
              ? 'bg-blue-600 text-white shadow' 
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
        >
          <HistoryIcon size={18} />
          <span>History</span>
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all ${
            activeTab === 'settings' 
              ? 'bg-blue-600 text-white shadow' 
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
        >
          <SettingsIcon size={18} />
          <span>Settings</span>
        </button>
      </div>

      <div className="min-h-[600px]">
        {activeTab === 'simulator' && <Simulator />}
        {activeTab === 'history' && <History />}
        {activeTab === 'settings' && <Settings />}
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans selection:bg-blue-500/30">
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
      <div className="fixed bottom-2 right-2 text-xs text-gray-500">
        v{__APP_VERSION__}
      </div>
    </div>
  );
}

export default App;