import express from 'express';
import { supabase } from '../db.js';

const router = express.Router();

const PLACEHOLDER_IMAGE_URL = 'https://images.pexels.com/photos/1427107/pexels-photo-1427107.jpeg';

const cleanHtmlContent = (html) => {
  if (!html) return html;

  const imageRegex = /<img[^>]+src="([^"]+)"[^>]*>/gi;
  return html.replace(imageRegex, (match, url) => {
    return match.replace(url, PLACEHOLDER_IMAGE_URL);
  });
};

router.post('/migrate', async (req, res) => {
  try {
    const { users, spaces, posts, comments, userMappings } = req.body;

    if (!users || !spaces || !posts || !comments) {
      return res.status(400).json({
        error: 'Missing required data. Need users, spaces, posts, and comments arrays'
      });
    }

    const results = {
      users: { success: 0, failed: 0, errors: [] },
      spaces: { success: 0, failed: 0, errors: [] },
      posts: { success: 0, failed: 0, errors: [] },
      comments: { success: 0, failed: 0, errors: [] }
    };

    const userIdMap = {};

    if (userMappings) {
      Object.keys(userMappings).forEach(key => {
        const mapping = userMappings[key];
        if (mapping.backingStore?.store?.id?.value1) {
          userIdMap[key] = mapping.backingStore.store.id.value1;
        }
      });
    }

    for (const user of users) {
      try {
        const mappedUserId = userIdMap[user.username] || user.id;

        const userData = {
          id: mappedUserId,
          username: user.username || user.jive?.username,
          display_name: user.displayName || user.display_name || user.username,
          email: user.email,
          enabled: user.jive?.enabled !== false,
        };

        const { error } = await supabase
          .from('users')
          .upsert([userData], { onConflict: 'id' });

        if (error) throw error;
        results.users.success++;
      } catch (error) {
        results.users.failed++;
        results.users.errors.push({ user: user.id, error: error.message });
      }
    }

    for (const space of spaces) {
      try {
        const creatorId = space.createdBy || space.created_by;
        const mappedCreatorId = creatorId ? (userIdMap[creatorId] || creatorId) : null;

        const spaceData = {
          id: space.id,
          name: space.name,
          display_name: space.displayName || space.display_name,
          description: space.description,
          tags: space.tags || [],
          created_by: mappedCreatorId,
          published: space.published,
        };

        const { error } = await supabase
          .from('spaces')
          .upsert([spaceData], { onConflict: 'id' });

        if (error) throw error;
        results.spaces.success++;
      } catch (error) {
        results.spaces.failed++;
        results.spaces.errors.push({ space: space.id, error: error.message });
      }
    }

    for (const post of posts) {
      try {
        const authorId = post.author?.id || post.author_id;
        const mappedAuthorId = authorId ? (userIdMap[authorId] || authorId) : null;

        const spaceId = post.parentPlace?.id || post.space_id || post.placeID;

        let cleanedContent = post.content?.text || post.content || '';
        cleanedContent = cleanHtmlContent(cleanedContent);

        const postData = {
          id: post.id,
          subject: post.subject,
          content: cleanedContent,
          author_id: mappedAuthorId,
          space_id: spaceId,
          tags: post.tags || [],
          like_count: post.likeCount || post.like_count || 0,
          view_count: post.viewCount || post.view_count || 0,
          published: post.published,
          updated: post.updated,
        };

        const { error } = await supabase
          .from('posts')
          .upsert([postData], { onConflict: 'id' });

        if (error) throw error;
        results.posts.success++;
      } catch (error) {
        results.posts.failed++;
        results.posts.errors.push({ post: post.id, error: error.message });
      }
    }

    for (const comment of comments) {
      try {
        const commenterId = comment.author?.id || comment.commented_by;
        const mappedCommenterId = commenterId ? (userIdMap[commenterId] || commenterId) : null;

        const postId = comment.parent?.split('/').pop() || comment.post_id;

        let cleanedContent = comment.content?.text || comment.content || '';
        cleanedContent = cleanHtmlContent(cleanedContent);

        const commentData = {
          id: comment.id,
          post_id: postId,
          content: cleanedContent,
          commented_by: mappedCommenterId,
          published: comment.published,
          updated: comment.updated,
        };

        const { error } = await supabase
          .from('comments')
          .upsert([commentData], { onConflict: 'id' });

        if (error) throw error;
        results.comments.success++;
      } catch (error) {
        results.comments.failed++;
        results.comments.errors.push({ comment: comment.id, error: error.message });
      }
    }

    res.json({
      message: 'Migration completed',
      results
    });
  } catch (error) {
    console.error('Migration error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/status', async (req, res) => {
  try {
    const [usersCount, spacesCount, postsCount, commentsCount] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('spaces').select('*', { count: 'exact', head: true }),
      supabase.from('posts').select('*', { count: 'exact', head: true }),
      supabase.from('comments').select('*', { count: 'exact', head: true })
    ]);

    res.json({
      users: usersCount.count || 0,
      spaces: spacesCount.count || 0,
      posts: postsCount.count || 0,
      comments: commentsCount.count || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
