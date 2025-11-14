import { useState, useEffect } from 'react';
import { Calendar, ThumbsUp, Eye, MessageSquare, User } from 'lucide-react';
import { api, Post, Comment } from '../../lib/api';

interface PostViewProps {
  postId: string;
}

export default function PostView({ postId }: PostViewProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [postId]);

  const loadData = async () => {
    try {
      const [postData, commentsData] = await Promise.all([
        api.getPost(postId),
        api.getComments(postId)
      ]);
      setPost(postData);
      setComments(commentsData);
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Loading post...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Post not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <article className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">{post.subject}</h1>

          <div className="flex items-center gap-6 text-sm text-slate-600 mb-6 pb-6 border-b border-slate-200">
            {post.author && (
              <div className="flex items-center gap-2">
                <div className="p-2 bg-slate-100 rounded-full">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">{post.author.display_name}</p>
                  <p className="text-xs text-slate-500">@{post.author.username}</p>
                </div>
              </div>
            )}
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

          {post.space && (
            <div className="mb-6">
              <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                {post.space.name}
              </span>
            </div>
          )}

          {post.content && (
            <div
              className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-blue-600 prose-img:rounded-lg prose-img:shadow-md"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-slate-200">
              {post.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <MessageSquare className="w-6 h-6" />
          Comments ({comments.length})
        </h2>

        <div className="space-y-6">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-slate-50 rounded-lg p-6 border border-slate-200"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 bg-white rounded-full shadow-sm">
                  <User className="w-5 h-5 text-slate-600" />
                </div>
                <div className="flex-1">
                  {comment.commenter && (
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-semibold text-slate-900">
                        {comment.commenter.display_name}
                      </p>
                      <span className="text-slate-400">•</span>
                      <p className="text-sm text-slate-500">
                        {formatDate(comment.published)}
                      </p>
                    </div>
                  )}
                  {comment.content && (
                    <div
                      className="prose prose-sm prose-slate max-w-none"
                      dangerouslySetInnerHTML={{ __html: comment.content }}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {comments.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600">No comments yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
