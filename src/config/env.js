require('dotenv').config();

// Validate required environment variables
const requiredEnvVars = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY', 'DATABASE_URL', 'CLOUDINARY_URL', 'EMAIL_USER', 'EMAIL_PASS'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars);
  process.exit(1);
}

// Log warning if service role key is not provided (for better security)
if (!process.env.VITE_SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('⚠️  SUPABASE_SERVICE_ROLE_KEY not provided. Using anon key for backend operations. For better security, provide a service role key.');
}

module.exports = {
  PORT: process.env.PORT || 5000,
  SUPABASE_URL: process.env.VITE_SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
  DATABASE_URL: process.env.DATABASE_URL, // Remove hardcoded fallback to force environment variable usage
  CLOUDINARY_URL: process.env.CLOUDINARY_URL,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  CLIENT_URL: process.env.CLIENT_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.VITE_SUPABASE_SERVICE_ROLE_KEY, // For backend operations
};
