import { useState, useEffect } from 'react';
import { FileText, ThumbsUp, Eye, Calendar } from 'lucide-react';
import { api, Space, Post } from '../../lib/api';

interface SpaceViewProps {
  spaceId: string;
  onPostClick: (postId: string) => void;
}

export default function SpaceView({ spaceId, onPostClick }: SpaceViewProps) {
  const [space, setSpace] = useState<Space | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [spaceId]);

  const loadData = async () => {
    try {
      const [spaceData, postsData] = await Promise.all([
        api.getSpace(spaceId),
        api.getPosts(spaceId)
      ]);
      setSpace(spaceData);
      setPosts(postsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Loading space...</p>
      </div>
    );
  }

  if (!space) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Space not found</p>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-3">{space.name}</h2>
        {space.display_name && (
          <p className="text-lg text-slate-600 mb-4">@{space.display_name}</p>
        )}
        <p className="text-slate-700 leading-relaxed mb-4">{space.description}</p>
        {space.creator && (
          <p className="text-sm text-slate-500">Created by {space.creator.display_name}</p>
        )}
        {space.tags && space.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {space.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Blog Posts</h3>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <button
            key={post.id}
            onClick={() => onPostClick(post.id)}
            className="w-full bg-white rounded-xl p-6 shadow-sm hover:shadow-md border border-slate-200 transition-all duration-200 text-left group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3 flex-1">
                <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-blue-100 transition-colors">
                  <FileText className="w-5 h-5 text-slate-600 group-hover:text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                    {post.subject}
                  </h4>
                  {post.author && (
                    <p className="text-sm text-slate-600 mb-2">
                      By {post.author.display_name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.published)}</span>
              </div>
              <div className="flex items-center gap-1">
                <ThumbsUp className="w-4 h-4" />
                <span>{post.like_count}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{post.view_count}</span>
              </div>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {post.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </button>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No posts yet</h3>
          <p className="text-slate-600">This space doesn't have any posts yet</p>
        </div>
      )}
    </div>
  );
}
