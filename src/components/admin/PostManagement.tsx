import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Upload } from 'lucide-react';
import { api, Post, Space, User } from '../../lib/api';

export default function PostManagement() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpace, setSelectedSpace] = useState<string>('');

  useEffect(() => {
    loadData();
  }, [selectedSpace]);

  const loadData = async () => {
    try {
      const [postsData, spacesData, usersData] = await Promise.all([
        api.getPosts(selectedSpace || undefined),
        api.getSpaces(),
        api.getUsers()
      ]);
      setPosts(postsData);
      setSpaces(spacesData);
      setUsers(usersData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        await api.deletePost(id);
        await loadData();
      } catch (error) {
        console.error('Failed to delete post:', error);
      }
    }
  };

  const handleImageUpload = async (postId: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const result = await api.uploadImage(file);
        alert(`Image uploaded successfully: ${result.url}`);
      } catch (error) {
        console.error('Failed to upload image:', error);
        alert('Failed to upload image');
      }
    };
    input.click();
  };

  if (loading) {
    return <div className="text-center py-8">Loading posts...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-900">Post Management</h2>
        <select
          value={selectedSpace}
          onChange={(e) => setSelectedSpace(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Spaces</option>
          {spaces.map((space) => (
            <option key={space.id} value={space.id}>
              {space.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{post.subject}</h3>
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  {post.author && (
                    <span>By {post.author.display_name}</span>
                  )}
                  {post.space && (
                    <span>in {post.space.name}</span>
                  )}
                  <span>{post.like_count} likes</span>
                  <span>{post.view_count} views</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleImageUpload(post.id)}
                  className="text-green-600 hover:text-green-800 p-2"
                  title="Upload image"
                >
                  <Upload className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="text-red-600 hover:text-red-800 p-2"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            {post.content && (
              <div
                className="prose prose-sm max-w-none text-slate-700"
                dangerouslySetInnerHTML={{ __html: post.content.substring(0, 500) + '...' }}
              />
            )}
            {post.tags && post.tags.length > 0 && (
              <div className="flex gap-2 mt-4">
                {post.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-8 text-slate-600">
          No posts found{selectedSpace ? ' in this space' : ''}.
        </div>
      )}
    </div>
  );
}
