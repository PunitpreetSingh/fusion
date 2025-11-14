import { useState, useEffect } from 'react';
import { FolderOpen, ArrowLeft } from 'lucide-react';
import { api, Space } from '../lib/api';
import SpaceView from './customer/SpaceView';
import PostView from './customer/PostView';

type View = 'home' | 'space' | 'post';

export default function CustomerPortal() {
  const [view, setView] = useState<View>('home');
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSpaces();
  }, []);

  const loadSpaces = async () => {
    try {
      const data = await api.getSpaces();
      setSpaces(data);
    } catch (error) {
      console.error('Failed to load spaces:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSpaceClick = (spaceId: string) => {
    setSelectedSpaceId(spaceId);
    setView('space');
  };

  const handlePostClick = (postId: string) => {
    setSelectedPostId(postId);
    setView('post');
  };

  const handleBack = () => {
    if (view === 'post') {
      setView('space');
      setSelectedPostId(null);
    } else if (view === 'space') {
      setView('home');
      setSelectedSpaceId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              {view !== 'home' && (
                <button
                  onClick={handleBack}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-6 h-6 text-slate-600" />
                </button>
              )}
              <FolderOpen className="w-10 h-10 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Knowledge Portal</h1>
                <p className="text-sm text-slate-600">Explore spaces and discover content</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {view === 'home' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">All Spaces</h2>
              <p className="text-slate-600">Browse through our knowledge spaces</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {spaces.map((space) => (
                <button
                  key={space.id}
                  onClick={() => handleSpaceClick(space.id)}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg border border-slate-200 transition-all duration-200 text-left group"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <FolderOpen className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {space.name}
                      </h3>
                      {space.display_name && (
                        <p className="text-sm text-slate-500 mb-2">@{space.display_name}</p>
                      )}
                      <p className="text-sm text-slate-600 line-clamp-3">
                        {space.description || 'No description available'}
                      </p>
                      {space.tags && space.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {space.tags.slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {spaces.length === 0 && (
              <div className="text-center py-16">
                <FolderOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No spaces available</h3>
                <p className="text-slate-600">Check back later for new content</p>
              </div>
            )}
          </div>
        )}

        {view === 'space' && selectedSpaceId && (
          <SpaceView spaceId={selectedSpaceId} onPostClick={handlePostClick} />
        )}

        {view === 'post' && selectedPostId && (
          <PostView postId={selectedPostId} />
        )}
      </main>
    </div>
  );
}
