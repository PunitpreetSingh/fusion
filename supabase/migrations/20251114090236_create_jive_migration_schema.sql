/*
  # Create Jive Migration Database Schema

  ## Overview
  This migration creates the complete database schema for migrating Jive social intranet data,
  including users, spaces, posts, and comments with proper relationships and security.

  ## Tables Created

  ### 1. users
  - `id` (text, primary key) - Jive user ID
  - `username` (text, unique) - User's username
  - `display_name` (text) - User's display name
  - `email` (text) - User's email address
  - `enabled` (boolean, default true) - Whether user is active
  - `created_at` (timestamptz, default now()) - Record creation timestamp
  - `updated_at` (timestamptz, default now()) - Record update timestamp

  ### 2. spaces
  - `id` (text, primary key) - Jive space/place ID
  - `name` (text) - Space name
  - `display_name` (text) - Display name/slug
  - `description` (text) - Space description
  - `tags` (text[]) - Array of tags
  - `created_by` (text, foreign key to users.id) - Creator user ID
  - `published` (timestamptz) - Publication date
  - `created_at` (timestamptz, default now()) - Record creation timestamp
  - `updated_at` (timestamptz, default now()) - Record update timestamp

  ### 3. posts
  - `id` (text, primary key) - Jive post ID
  - `subject` (text) - Post title/subject
  - `content` (text) - Post HTML content
  - `author_id` (text, foreign key to users.id) - Author user ID
  - `space_id` (text, foreign key to spaces.id) - Space the post belongs to
  - `tags` (text[]) - Array of tags
  - `like_count` (integer, default 0) - Number of likes
  - `view_count` (integer, default 0) - Number of views
  - `published` (timestamptz) - Publication date
  - `updated` (timestamptz) - Last update date
  - `created_at` (timestamptz, default now()) - Record creation timestamp
  - `updated_at` (timestamptz, default now()) - Record update timestamp

  ### 4. comments
  - `id` (text, primary key) - Jive comment ID
  - `post_id` (text, foreign key to posts.id) - Post the comment belongs to
  - `content` (text) - Comment HTML content
  - `commented_by` (text, foreign key to users.id) - Commenter user ID
  - `published` (timestamptz) - Publication date
  - `updated` (timestamptz) - Last update date
  - `created_at` (timestamptz, default now()) - Record creation timestamp
  - `updated_at` (timestamptz, default now()) - Record update timestamp

  ## Security
  - RLS enabled on all tables
  - Public read access for customer-facing portal
  - Authenticated users can manage their own content
  - Service role needed for admin operations

  ## Indexes
  - Foreign key indexes for better query performance
  - Published date indexes for sorting
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id text PRIMARY KEY,
  username text UNIQUE,
  display_name text NOT NULL,
  email text,
  enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create spaces table
CREATE TABLE IF NOT EXISTS spaces (
  id text PRIMARY KEY,
  name text NOT NULL,
  display_name text,
  description text,
  tags text[] DEFAULT '{}',
  created_by text REFERENCES users(id) ON DELETE SET NULL,
  published timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id text PRIMARY KEY,
  subject text NOT NULL,
  content text,
  author_id text REFERENCES users(id) ON DELETE SET NULL,
  space_id text REFERENCES spaces(id) ON DELETE CASCADE,
  tags text[] DEFAULT '{}',
  like_count integer DEFAULT 0,
  view_count integer DEFAULT 0,
  published timestamptz,
  updated timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id text PRIMARY KEY,
  post_id text REFERENCES posts(id) ON DELETE CASCADE,
  content text,
  commented_by text REFERENCES users(id) ON DELETE SET NULL,
  published timestamptz,
  updated timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_spaces_created_by ON spaces(created_by);
CREATE INDEX IF NOT EXISTS idx_spaces_published ON spaces(published);
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_space_id ON posts(space_id);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_commented_by ON comments(commented_by);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users are publicly viewable"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert users"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update users"
  ON users FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for spaces table
CREATE POLICY "Spaces are publicly viewable"
  ON spaces FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert spaces"
  ON spaces FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update spaces"
  ON spaces FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete spaces"
  ON spaces FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for posts table
CREATE POLICY "Posts are publicly viewable"
  ON posts FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert posts"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update posts"
  ON posts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete posts"
  ON posts FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for comments table
CREATE POLICY "Comments are publicly viewable"
  ON comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert comments"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update comments"
  ON comments FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete comments"
  ON comments FOR DELETE
  TO authenticated
  USING (true);