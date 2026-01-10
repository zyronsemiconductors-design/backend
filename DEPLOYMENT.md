# Backend Deployment Guide

This document provides instructions for deploying the backend application separately from the frontend.

## Environment Configuration

### Local Development
For local development, create a `.env` file in the backend root directory:

```env
# Server Configuration
PORT=5000

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database Configuration
DATABASE_URL=your_database_url

# Cloudinary Configuration
CLOUDINARY_URL=your_cloudinary_url

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Client URL (Frontend domain)
CLIENT_URL=http://localhost:5173

# Admin Password
ADMIN_PASSWORD=your_secure_admin_password
```

### Production Deployment
For production deployment, set the environment variables in your hosting platform:

```env
# Server Configuration
PORT=5000

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database Configuration
DATABASE_URL=your_production_database_url

# Cloudinary Configuration
CLOUDINARY_URL=your_cloudinary_url

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Client URL (Frontend domain)
CLIENT_URL=https://your-frontend-domain.com

# Admin Password
ADMIN_PASSWORD=your_secure_admin_password
```

## Deployment to Vercel

### Prerequisites
- Vercel account
- GitHub account
- Domain for backend (e.g., `server.zyronsemiconductors.com`)

### Steps
1. Push the backend code to a GitHub repository
2. Import the project to Vercel
3. In the Vercel dashboard, set the following environment variables:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY`: Your Supabase anon key
   - `VITE_SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
   - `DATABASE_URL`: Your database connection string
   - `CLOUDINARY_URL`: Your Cloudinary URL
   - `EMAIL_USER`: Your email address
   - `EMAIL_PASS`: Your email app password
   - `CLIENT_URL`: Your frontend domain (e.g., `https://zyronsemiconductors.com`)
   - `ADMIN_PASSWORD`: Your admin password
4. Add your custom domain in the Vercel dashboard
5. Update your DNS settings as per Vercel's instructions

## Deployment to Heroku

### Prerequisites
- Heroku account
- GitHub account or Heroku CLI

### Steps
1. Create a new Heroku app
2. Connect to your GitHub repository or deploy using the CLI
3. In the Heroku dashboard, set the config vars with the same environment variables as listed above
4. Deploy the application

## Deployment to Other Platforms

For other Node.js hosting platforms, ensure you:
1. Set all required environment variables
2. Install dependencies with `npm install`
3. Start the server with `npm start`

## Required Services

### Supabase Setup
- Ensure your Supabase project is properly configured with the required tables
- Run the SQL from `supabase/migrations/01_create_tables.sql` in your Supabase SQL editor

### Cloudinary Setup
- Create a Cloudinary account
- Configure your Cloudinary URL in the format: `cloudinary://api_key:api_secret@cloud_name`

### Email Setup
- For Gmail, use an App Password (not your regular password)
- To get an App Password:
  1. Enable 2-Factor Authentication on your Google account
  2. Go to Google Account settings -> Security -> App passwords
  3. Generate a new app password for 'Mail'
  4. Use that 16-character password

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | Yes |
| `VITE_SUPABASE_URL` | Supabase project URL | Yes |
| `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Supabase anon key | Yes |
| `VITE_SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Recommended |
| `DATABASE_URL` | Database connection string | Yes |
| `CLOUDINARY_URL` | Cloudinary URL for file uploads | For file uploads |
| `EMAIL_USER` | Email address for notifications | For email functionality |
| `EMAIL_PASS` | Email app password | For email functionality |
| `CLIENT_URL` | Frontend domain for CORS | Yes |
| `ADMIN_PASSWORD` | Admin panel password | Yes |

## CORS Configuration

The backend automatically configures CORS based on the `CLIENT_URL` environment variable. Make sure this matches your frontend domain exactly.

## Troubleshooting

### CORS Issues
- Ensure `CLIENT_URL` in backend environment variables matches your frontend domain exactly
- Check that the domain includes the protocol (http:// or https://)

### Database Connection Issues
- Verify that your database URL is correctly formatted
- Ensure your database allows connections from the deployment environment
- Check that all required tables have been created

### Email Issues
- Verify that email credentials are correctly set
- Ensure you're using an App Password for Gmail, not your regular password
- Check that your email provider allows connections from your deployment environment