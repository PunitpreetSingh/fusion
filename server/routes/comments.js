import express from 'express';
import { supabase } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { post_id } = req.query;
    let query = supabase
      .from('comments')
      .select(`
        *,
        commenter:users!comments_commented_by_fkey(id, display_name, username),
        post:posts!comments_post_id_fkey(id, subject)
      `)
      .order('published', { ascending: true });

    if (post_id) {
      query = query.eq('post_id', post_id);
    }

    const { data, error } = await query;

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        commenter:users!comments_commented_by_fkey(id, display_name, username),
        post:posts!comments_post_id_fkey(id, subject)
      `)
      .eq('id', req.params.id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Comment not found' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('comments')
      .insert([req.body])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('comments')
      .update({ ...req.body, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
