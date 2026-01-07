import { Routes, Route } from 'react-router-dom';

function Dashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Backtester Dashboard</h1>
      <p className="mt-4">Welcome to the Trading Algorithm Backtester POC.</p>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;