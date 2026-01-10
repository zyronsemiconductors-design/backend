# Security Implementation

This document outlines the security measures implemented in the Zyron Semiconductors backend application.

## 1. Rate Limiting

Rate limiting has been implemented to prevent abuse and brute force attacks:

- **General API Rate Limiting**: 100 requests per 15 minutes per IP address for all API endpoints
- **Form Submission Rate Limiting**: 5 form submissions per 15 minutes per IP address to prevent spam
- **Admin Login Rate Limiting**: 5 login attempts per 15 minutes per IP address to prevent brute force attacks

## 2. Input Validation & Sanitization

Comprehensive input validation and sanitization has been implemented:

- **Contact Form Validation**:
  - Name: 2-100 characters, letters/spaces/hyphens/apostrophes/periods only
  - Email: Valid email format, max 254 characters
  - Message: 10-2000 characters

- **Job Application Validation**:
  - Name: 2-100 characters, letters/spaces/hyphens/apostrophes/periods only
  - Email: Valid email format, max 254 characters
  - Phone: Valid phone number format (US/UK formats)
  - Position: 2-100 characters
  - Message: Optional, max 2000 characters
  - Resume Name: Optional, max 255 characters

- **Community Request Validation**:
  - Name: 2-100 characters, letters/spaces/hyphens/apostrophes/periods only
  - Email: Valid email format, max 254 characters
  - Interest: Optional, max 200 characters
  - Message: Optional, max 2000 characters

- **Resource Enquiry Validation**:
  - Name: 2-100 characters, letters/spaces/hyphens/apostrophes/periods only
  - Email: Valid email format, max 254 characters
  - Topic: 2-200 characters
  - Message: Optional, max 2000 characters

- **Field Sanitization**:
  - Unexpected fields are rejected
  - MongoDB injection prevention via express-mongo-sanitize
  - XSS prevention via xss-clean

## 3. Secure API Key Handling

- Removed hardcoded database URL
- Added environment variable validation
- Added warning for missing service role key
- Recommended use of service role key for backend operations

## 4. Admin Authentication

- Added JWT-based admin authentication
- Admin login endpoint with rate limiting
- Protected admin endpoints requiring valid JWT token
- Token expiration after 24 hours
- Access forbidden responses for unauthorized requests

## 5. Additional Security Measures

- Content Security Policy (CSP) headers
- Referrer policy set to same-origin
- Helmet.js security headers
- Sanitized responses in admin endpoints to prevent data leakage

## Environment Variables Required

The following environment variables are now required:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key (optional but recommended)
CLOUDINARY_URL=your_cloudinary_url
EMAIL_USER=your_email
EMAIL_PASS=your_email_app_password
CLIENT_URL=your_client_url
ADMIN_PASSWORD=your_admin_password (default: 'default_admin_password_change_me')
```

## Admin Authentication

To access admin endpoints, you must first authenticate:

1. Send POST request to `/api/admin/login` with:
   ```json
   {
     "password": "your_admin_password"
   }
   ```

2. Use the returned token in subsequent requests:
   - In header: `Authorization: Bearer <token>`
   - Or in query: `?token=<token>`

## Security Best Practices

- Change the default admin password before production deployment
- Use strong, unique passwords for all services
- Regularly rotate API keys and tokens
- Monitor logs for suspicious activity
- Keep dependencies up to date