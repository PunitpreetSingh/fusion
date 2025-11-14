import { useState } from 'react';
import AdminPanel from './components/AdminPanel';
import CustomerPortal from './components/CustomerPortal';
import { Settings } from 'lucide-react';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <button
        onClick={() => setIsAdmin(!isAdmin)}
        className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg shadow-lg hover:bg-slate-700 transition-colors"
      >
        <Settings className="w-4 h-4" />
        {isAdmin ? 'Customer View' : 'Admin View'}
      </button>

      {isAdmin ? <AdminPanel /> : <CustomerPortal />}
    </div>
  );
}

export default App;
