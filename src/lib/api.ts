const API_BASE_URL = 'http://localhost:3001/api';

export interface User {
  id: string;
  username: string;
  display_name: string;
  email?: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface Space {
  id: string;
  name: string;
  display_name?: string;
  description?: string;
  tags: string[];
  created_by?: string;
  published?: string;
  creator?: User;
}

export interface Post {
  id: string;
  subject: string;
  content?: string;
  author_id?: string;
  space_id?: string;
  tags: string[];
  like_count: number;
  view_count: number;
  published?: string;
  updated?: string;
  author?: User;
  space?: Space;
}

export interface Comment {
  id: string;
  post_id?: string;
  content?: string;
  commented_by?: string;
  published?: string;
  updated?: string;
  commenter?: User;
}

class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  async getUsers(): Promise<User[]> {
    return this.request<User[]>('/users');
  }

  async getUser(id: string): Promise<User> {
    return this.request<User>(`/users/${id}`);
  }

  async createUser(user: Partial<User>): Promise<User> {
    return this.request<User>('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  async updateUser(id: string, user: Partial<User>): Promise<User> {
    return this.request<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(user),
    });
  }

  async deleteUser(id: string): Promise<void> {
    await this.request(`/users/${id}`, { method: 'DELETE' });
  }

  async getSpaces(): Promise<Space[]> {
    return this.request<Space[]>('/spaces');
  }

  async getSpace(id: string): Promise<Space> {
    return this.request<Space>(`/spaces/${id}`);
  }

  async createSpace(space: Partial<Space>): Promise<Space> {
    return this.request<Space>('/spaces', {
      method: 'POST',
      body: JSON.stringify(space),
    });
  }

  async updateSpace(id: string, space: Partial<Space>): Promise<Space> {
    return this.request<Space>(`/spaces/${id}`, {
      method: 'PUT',
      body: JSON.stringify(space),
    });
  }

  async deleteSpace(id: string): Promise<void> {
    await this.request(`/spaces/${id}`, { method: 'DELETE' });
  }

  async getPosts(spaceId?: string): Promise<Post[]> {
    const query = spaceId ? `?space_id=${spaceId}` : '';
    return this.request<Post[]>(`/posts${query}`);
  }

  async getPost(id: string): Promise<Post> {
    return this.request<Post>(`/posts/${id}`);
  }

  async createPost(post: Partial<Post>): Promise<Post> {
    return this.request<Post>('/posts', {
      method: 'POST',
      body: JSON.stringify(post),
    });
  }

  async updatePost(id: string, post: Partial<Post>): Promise<Post> {
    return this.request<Post>(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(post),
    });
  }

  async deletePost(id: string): Promise<void> {
    await this.request(`/posts/${id}`, { method: 'DELETE' });
  }

  async getComments(postId?: string): Promise<Comment[]> {
    const query = postId ? `?post_id=${postId}` : '';
    return this.request<Comment[]>(`/comments${query}`);
  }

  async createComment(comment: Partial<Comment>): Promise<Comment> {
    return this.request<Comment>('/comments', {
      method: 'POST',
      body: JSON.stringify(comment),
    });
  }

  async uploadImage(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return response.json();
  }

  async migrateData(data: {
    users: any[];
    spaces: any[];
    posts: any[];
    comments: any[];
    userMappings?: any;
  }): Promise<any> {
    return this.request('/etl/migrate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMigrationStatus(): Promise<{
    users: number;
    spaces: number;
    posts: number;
    comments: number;
  }> {
    return this.request('/etl/status');
  }
}

export const api = new ApiClient();
