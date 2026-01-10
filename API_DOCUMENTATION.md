# Zyron Semiconductors API Documentation

## Base URL
`http://localhost:5000/api` (or your deployed URL)

## Public Contact Endpoints

### 1. General Contact Form
- **Endpoint**: `POST /contact`
- **Description**: Submit a general contact form
- **Request Body**:
  ```json
  {
    "name": "string (2-100 chars)",
    "email": "valid email address",
    "message": "string (10-2000 chars)"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Message sent successfully"
  }
  ```
- **Validation**: Name, email, and message are validated

### 2. Job Application
- **Endpoint**: `POST /contact/apply`
- **Description**: Submit a job application with optional resume
- **Request Body**:
  ```json
  {
    "name": "string (2-100 chars)",
    "email": "valid email address",
    "phone": "optional, valid phone number",
    "position": "string (2-100 chars)",
    "message": "optional, string (max 2000 chars)",
    "resumeBase64": "optional, base64 encoded file",
    "resumeName": "optional, string (max 255 chars)"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Job application sent successfully"
  }
  ```

### 3. Community Join Request
- **Endpoint**: `POST /contact/community`
- **Description**: Request to join the community
- **Request Body**:
  ```json
  {
    "name": "string (2-100 chars)",
    "email": "valid email address",
    "interest": "optional, string (max 200 chars)",
    "message": "optional, string (max 2000 chars)"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Community join request sent successfully"
  }
  ```

### 4. Resource Enquiry
- **Endpoint**: `POST /contact/resources/enquiry`
- **Description**: Submit a resource enquiry
- **Request Body**:
  ```json
  {
    "name": "string (2-100 chars)",
    "email": "valid email address",
    "topic": "string (2-200 chars)",
    "message": "optional, string (max 2000 chars)"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Resources enquiry sent successfully"
  }
  ```

## Admin Endpoints

### Authentication Endpoints

#### 1. Setup First Admin
- **Endpoint**: `POST /admin/setup`
- **Description**: Create the first admin account (only works if no admin exists)
- **Request Body**:
  ```json
  {
    "full_name": "string",
    "email": "valid email",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "message": "First admin created successfully",
    "user": {
      "email": "admin email",
      "role": "super"
    }
  }
  ```
- **Special**: Can be called with empty body to check if setup is needed

#### 2. Admin Login
- **Endpoint**: `POST /admin/login`
- **Description**: Authenticate admin user
- **Request Body**:
  ```json
  {
    "email": "admin email",
    "password": "admin password"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Login successful",
    "token": "JWT token",
    "user": {
      "id": "admin id",
      "full_name": "admin name",
      "email": "admin email",
      "role": "admin role"
    }
  }
  ```

### Protected Admin Endpoints
All protected endpoints require `Authorization: Bearer <token>` header

#### 3. Get Current Admin Info
- **Endpoint**: `GET /admin/me`
- **Description**: Get information about the current authenticated admin
- **Response**:
  ```json
  {
    "id": "admin id",
    "full_name": "admin name",
    "email": "admin email",
    "role": "admin role"
  }
  ```

### Data Retrieval Endpoints

#### 4. Get All Contacts
- **Endpoint**: `GET /admin/contacts`
- **Description**: Get all contact form submissions
- **Response**: Array of contact objects

#### 5. Get All Job Applications
- **Endpoint**: `GET /admin/careers`
- **Description**: Get all job applications
- **Response**: Array of job application objects

#### 6. Get All Community Requests
- **Endpoint**: `GET /admin/community`
- **Description**: Get all community join requests
- **Response**: Array of community request objects

#### 7. Get All Resource Enquiries
- **Endpoint**: `GET /admin/resources`
- **Description**: Get all resource enquiries
- **Response**: Array of resource enquiry objects

### User Management Endpoints (Super Admin Only)
These endpoints require super admin privileges

#### 8. Get All Admins
- **Endpoint**: `GET /admin/users`
- **Description**: Get list of all admin accounts
- **Response**: Array of admin objects

#### 9. Create New Admin
- **Endpoint**: `POST /admin/users`
- **Description**: Create a new admin account
- **Request Body**:
  ```json
  {
    "full_name": "string",
    "email": "valid email",
    "password": "string",
    "role": "admin or super (default: admin)"
  }
  ```
- **Response**: Created admin object

#### 10. Delete Admin
- **Endpoint**: `DELETE /admin/users/:id`
- **Description**: Delete an admin account (cannot delete self)
- **Response**:
  ```json
  {
    "message": "Admin deleted successfully"
  }
  ```

### Settings Endpoints (Super Admin Only)

#### 11. Get Site Settings
- **Endpoint**: `GET /admin/settings`
- **Description**: Get all site settings
- **Response**: Object with settings by ID

#### 12. Update Site Settings
- **Endpoint**: `PUT /admin/settings/:id`
- **Description**: Update specific site setting
- **Request Body**:
  ```json
  {
    "value": "any valid JSON value"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Settings updated successfully",
    "data": "updated setting object"
  }
  ```

## Health Check Endpoint

#### 13. API Health Check
- **Endpoint**: `GET /api`
- **Description**: Check if the API is running
- **Response**:
  ```json
  {
    "status": "OK",
    "message": "Zyron Semiconductors API is running",
    "timestamp": "ISO date string",
    "uptime": "seconds",
    "version": "1.0.0"
  }
  ```

## Error Responses
All error responses follow this format:
```json
{
  "error": "Error message",
  "details": "Optional detailed error information (for some errors)"
}
```

## Security Features
- Rate limiting on all API endpoints
- Rate limiting specifically for form submissions (5 per 15 minutes per IP)
- Rate limiting for login attempts (5 per 15 minutes per IP)
- CORS configured for allowed origins
- Input validation on all endpoints
- JWT-based authentication for admin endpoints
- Role-based access control (admin vs super admin)
- Password hashing for admin accounts
- Database sanitization of responses