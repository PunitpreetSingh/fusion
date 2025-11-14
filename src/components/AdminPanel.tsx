import { useState } from 'react';
import { Users, FolderOpen, FileText, MessageSquare, Upload, Database } from 'lucide-react';
import UserManagement from './admin/UserManagement';
import SpaceManagement from './admin/SpaceManagement';
import PostManagement from './admin/PostManagement';
import DataMigration from './admin/DataMigration';

type Tab = 'users' | 'spaces' | 'posts' | 'migration';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<Tab>('users');

  const tabs = [
    { id: 'users' as Tab, label: 'Users', icon: Users },
    { id: 'spaces' as Tab, label: 'Spaces', icon: FolderOpen },
    { id: 'posts' as Tab, label: 'Posts', icon: FileText },
    { id: 'migration' as Tab, label: 'Data Migration', icon: Database },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Database className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-slate-900">Jive Admin Panel</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
          <div className="border-b border-slate-200">
            <nav className="flex -mb-px">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm
                      transition-colors duration-150
                      ${
                        activeTab === tab.id
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'users' && <UserManagement />}
            {activeTab === 'spaces' && <SpaceManagement />}
            {activeTab === 'posts' && <PostManagement />}
            {activeTab === 'migration' && <DataMigration />}
          </div>
        </div>
      </div>
    </div>
  );
}
