import { useState, useEffect } from 'react';
import { Upload, Database, CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '../../lib/api';

export default function DataMigration() {
  const [migrationStatus, setMigrationStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      const status = await api.getMigrationStatus();
      setMigrationStatus(status);
    } catch (error) {
      console.error('Failed to load status:', error);
    }
  };

  const handleFileUpload = async (type: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const data = JSON.parse(text);

        (window as any)[`${type}Data`] = data;
        alert(`${type} data loaded successfully`);
      } catch (error) {
        console.error(`Failed to load ${type} data:`, error);
        alert(`Failed to load ${type} data`);
      }
    };
    input.click();
  };

  const handleMigration = async () => {
    const usersData = (window as any).usersData;
    const spacesData = (window as any).spacesData;
    const postsData = (window as any).postsData;
    const commentsData = (window as any).commentsData;
    const userMappings = (window as any).userMappingsData;

    if (!usersData || !spacesData || !postsData || !commentsData) {
      alert('Please upload all required JSON files first');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const migrationResult = await api.migrateData({
        users: Array.isArray(usersData) ? usersData : [usersData],
        spaces: Array.isArray(spacesData) ? spacesData : [spacesData],
        posts: Array.isArray(postsData) ? postsData : [postsData],
        comments: Array.isArray(commentsData) ? commentsData : [commentsData],
        userMappings: userMappings
      });

      setResult(migrationResult);
      await loadStatus();
    } catch (error: any) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Data Migration</h2>
        <p className="text-slate-600">
          Upload Jive JSON exports to migrate data into the system
        </p>
      </div>

      {migrationStatus && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <Database className="w-5 h-5" />
            Current Database Status
          </h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{migrationStatus.users}</div>
              <div className="text-sm text-slate-600">Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{migrationStatus.spaces}</div>
              <div className="text-sm text-slate-600">Spaces</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{migrationStatus.posts}</div>
              <div className="text-sm text-slate-600">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{migrationStatus.comments}</div>
              <div className="text-sm text-slate-600">Comments</div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Upload JSON Files</h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleFileUpload('users')}
            className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <Upload className="w-5 h-5" />
            <span>Upload Users JSON</span>
          </button>
          <button
            onClick={() => handleFileUpload('spaces')}
            className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <Upload className="w-5 h-5" />
            <span>Upload Spaces JSON</span>
          </button>
          <button
            onClick={() => handleFileUpload('posts')}
            className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <Upload className="w-5 h-5" />
            <span>Upload Posts JSON</span>
          </button>
          <button
            onClick={() => handleFileUpload('comments')}
            className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <Upload className="w-5 h-5" />
            <span>Upload Comments JSON</span>
          </button>
          <button
            onClick={() => handleFileUpload('userMappings')}
            className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors col-span-2"
          >
            <Upload className="w-5 h-5" />
            <span>Upload User Mappings JSON (Optional)</span>
          </button>
        </div>

        <div className="mt-6">
          <button
            onClick={handleMigration}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            <Database className="w-5 h-5" />
            {loading ? 'Migrating...' : 'Start Migration'}
          </button>
        </div>
      </div>

      {result && (
        <div className={`border rounded-lg p-6 ${result.error ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            {result.error ? (
              <>
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-900">Migration Failed</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-900">Migration Results</span>
              </>
            )}
          </h3>

          {result.error ? (
            <p className="text-red-800">{result.error}</p>
          ) : (
            <div className="space-y-4">
              {Object.keys(result.results || {}).map((key) => (
                <div key={key} className="bg-white rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 capitalize mb-2">{key}</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-green-600 font-semibold">
                        {result.results[key].success} successful
                      </span>
                    </div>
                    <div>
                      <span className="text-red-600 font-semibold">
                        {result.results[key].failed} failed
                      </span>
                    </div>
                  </div>
                  {result.results[key].errors.length > 0 && (
                    <div className="mt-2 text-xs text-red-600">
                      <details>
                        <summary className="cursor-pointer">View errors</summary>
                        <pre className="mt-2 p-2 bg-red-100 rounded overflow-x-auto">
                          {JSON.stringify(result.results[key].errors, null, 2)}
                        </pre>
                      </details>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
