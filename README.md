# Jive Social Intranet Migration Solution

A complete solution for migrating Jive social intranet data to a modern platform with React frontend, Node.js backend, and PostgreSQL database (Supabase).

## Features

### Admin Panel
- User management (Create, Read, Update, Delete)
- Space management with creator assignment
- Blog post management with image upload
- Data migration tool with JSON import
- Real-time migration status tracking

### Customer Portal
- Browse all spaces
- View posts within spaces
- Read post content with comments
- Clean, modern UI with responsive design

### Backend API
- RESTful CRUD endpoints for all entities
- OneDrive integration for image uploads
- ETL script for Jive JSON data migration
- User mapping support for ID transformation
- Automatic image URL replacement

## Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: PostgreSQL (Supabase)
- **Image Storage**: OneDrive (via Microsoft Graph API)

## Prerequisites

- Node.js 18+ installed
- Supabase account (database already configured)
- Azure AD app registration for OneDrive access (optional, for image uploads)

## Environment Variables

The `.env` file should contain:

```env
# Supabase Configuration (already set)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Azure/OneDrive Configuration (optional, for image upload)
AZURE_TENANT_ID=your_tenant_id
AZURE_CLIENT_ID=your_client_id
AZURE_CLIENT_SECRET=your_client_secret
ONEDRIVE_FOLDER_PATH=/jive-migration
```

## Installation

1. Install dependencies:
```bash
npm install
```

## Database Schema

The database includes four main tables:

### users
- id (text, primary key)
- username (text, unique)
- display_name (text)
- email (text)
- enabled (boolean)
- created_at, updated_at (timestamps)

### spaces
- id (text, primary key)
- name (text)
- display_name (text)
- description (text)
- tags (text array)
- created_by (foreign key to users.id)
- published (timestamp)
- created_at, updated_at (timestamps)

### posts
- id (text, primary key)
- subject (text)
- content (text, HTML)
- author_id (foreign key to users.id)
- space_id (foreign key to spaces.id)
- tags (text array)
- like_count, view_count (integers)
- published, updated (timestamps)
- created_at, updated_at (timestamps)

### comments
- id (text, primary key)
- post_id (foreign key to posts.id)
- content (text, HTML)
- commented_by (foreign key to users.id)
- published, updated (timestamps)
- created_at, updated_at (timestamps)

All tables have Row Level Security (RLS) enabled with public read access and authenticated write access.

## Running the Application

### Development Mode

1. Start the backend server:
```bash
npm run server
```
The server will run on http://localhost:3001

2. In a new terminal, start the frontend:
```bash
npm run dev
```
The frontend will run on http://localhost:5173

### Production Build

```bash
npm run build
```

## Using the Application

### Customer Portal (Default View)

1. Browse all available spaces on the homepage
2. Click on a space to view its posts
3. Click on a post to read full content and comments
4. Use the back button to navigate

### Admin Panel

1. Click the "Admin View" button in the top-right corner
2. Navigate between tabs:
   - **Users**: Manage user accounts
   - **Spaces**: Create and manage spaces
   - **Posts**: View and manage blog posts
   - **Data Migration**: Import Jive JSON data

### Data Migration Process

1. Switch to Admin View
2. Go to the "Data Migration" tab
3. Upload JSON files in this order:
   - Users JSON (required)
   - Spaces JSON (required)
   - Posts JSON (required)
   - Comments JSON (required)
   - User Mappings JSON (optional)
4. Click "Start Migration"
5. Review the migration results

#### JSON Format Examples

**Users JSON:**
```json
[{
  "id": "2325",
  "username": "MOMFUJI",
  "displayName": "Momoko Fujita",
  "email": "momoko.fujita@example.com",
  "jive": { "enabled": true }
}]
```

**Spaces JSON:**
```json
[{
  "id": "2867",
  "name": "Company Space",
  "displayName": "company-space",
  "description": "Main company space",
  "tags": ["company", "news"]
}]
```

**Posts JSON:**
```json
[{
  "id": "175040",
  "subject": "Post Title",
  "content": { "text": "<p>Post content HTML</p>" },
  "author": { "id": "2325" },
  "parentPlace": { "id": "2867" },
  "published": "2023-11-29T02:24:45.132+0000"
}]
```

**Comments JSON:**
```json
[{
  "id": "655328",
  "content": { "text": "<p>Comment content</p>" },
  "author": { "id": "623273" },
  "parent": "https://example.com/api/core/v3/contents/175040",
  "published": "2023-11-29T03:33:15.319+0000"
}]
```

**User Mappings JSON (Optional):**
```json
{
  "RAKPURI": {
    "backingStore": {
      "store": {
        "id": { "value1": "955a0125-d667-4119-b048-7a9c78b5213b" }
      }
    }
  }
}
```

## API Endpoints

### Users
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Spaces
- `GET /api/spaces` - List all spaces
- `GET /api/spaces/:id` - Get space by ID
- `POST /api/spaces` - Create space
- `PUT /api/spaces/:id` - Update space
- `DELETE /api/spaces/:id` - Delete space

### Posts
- `GET /api/posts?space_id=:id` - List posts (optional filter by space)
- `GET /api/posts/:id` - Get post by ID
- `POST /api/posts` - Create post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### Comments
- `GET /api/comments?post_id=:id` - List comments (optional filter by post)
- `GET /api/comments/:id` - Get comment by ID
- `POST /api/comments` - Create comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

### Upload
- `POST /api/upload` - Upload single image to OneDrive
- `POST /api/upload/batch` - Upload multiple images

### ETL
- `POST /api/etl/migrate` - Run migration with JSON data
- `GET /api/etl/status` - Get current database statistics

## Image URL Replacement

During migration, all image URLs in post and comment content are automatically replaced with a placeholder image from Pexels. To use OneDrive:

1. Configure Azure AD credentials in `.env`
2. Use the upload button in the admin panel
3. Manually update post content with new URLs

## Notes

- The database schema is already created and configured
- RLS policies allow public read access for the customer portal
- Admin operations require authentication (use Supabase auth)
- All image URLs in migrated content use a single placeholder image
- User mappings help transform Jive user IDs to Azure AD user IDs

## Troubleshooting

**Backend won't start:**
- Check that port 3001 is available
- Verify environment variables are set correctly

**Frontend can't connect to backend:**
- Ensure backend is running on port 3001
- Check browser console for CORS errors

**Migration fails:**
- Verify JSON file format matches examples
- Check migration results for specific error messages
- Ensure all referenced users exist before importing spaces/posts

**Images not uploading:**
- Verify Azure credentials are configured
- Check OneDrive folder permissions
- Review server logs for detailed errors
