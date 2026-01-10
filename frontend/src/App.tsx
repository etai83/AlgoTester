import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Simulator from './components/Simulator';
import History from './components/History';
import Settings from './components/Settings';
import StrategyEditor from './components/StrategyEditor';

// Placeholder for Live Trading
const LiveTrading = () => <div className="p-8 text-white">Live Trading - Coming Soon</div>;

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Simulator />} />
        <Route path="/history" element={<History />} />
        <Route path="/editor" element={<StrategyEditor />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/live" element={<LiveTrading />} />
        {/* Redirect unknown routes to dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;