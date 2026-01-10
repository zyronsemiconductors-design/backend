# Zyron Semiconductors Backend

This is the backend repository for Zyron Semiconductors, separated from the original monorepo.

## API Endpoints

### Public Contact Endpoints
- `POST /api/contact` - General contact form
- `POST /api/contact/apply` - Job applications
- `POST /api/contact/community` - Community join requests
- `POST /api/contact/resources/enquiry` - Resource enquiries

### Admin Endpoints
- `POST /api/admin/setup` - Setup first admin account
- `POST /api/admin/login` - Admin login
- `GET /api/admin/me` - Get current admin info
- `GET /api/admin/contacts` - Get all contact submissions
- `GET /api/admin/careers` - Get all job applications
- `GET /api/admin/community` - Get all community requests
- `GET /api/admin/resources` - Get all resource enquiries
- `GET /api/admin/users` - Get all admins (super admin only)
- `POST /api/admin/users` - Create admin (super admin only)
- `DELETE /api/admin/users/:id` - Delete admin (super admin only)
- `GET /api/admin/settings` - Get site settings
- `PUT /api/admin/settings/:id` - Update site settings (super admin only)

## Deployment

This backend is designed to be deployed to https://server.zyronsemiconductors.com

Environment variables needed:
- VITE_SUPABASE_URL: Your Supabase project URL
- VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY: Your Supabase anon key
- VITE_SUPABASE_SERVICE_ROLE_KEY: Your Supabase service role key
- DATABASE_URL: Your database connection string
- CLOUDINARY_URL: Your Cloudinary URL for file uploads
- EMAIL_USER: Your email address for notifications
- EMAIL_PASS: Your email app password
- CLIENT_URL: The frontend domain (https://zyronsemiconductors.com)

## Tech Stack
- Node.js + Express
- Supabase
- Cloudinary
- Nodemailer
