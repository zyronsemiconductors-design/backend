const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');
const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = require('../config/env');

// Simple admin authentication middleware using a predefined admin token
// In production, you should use a more robust authentication system
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'default_admin_password_change_me';



// Create service role client for admin operations
const serviceRoleSupabase = SUPABASE_SERVICE_ROLE_KEY ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) : null;

// Admin authentication middleware
const requireAdminAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '') || req.query.token;

    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, ADMIN_PASSWORD);

    // Verify user still exists in DB
    const { data: admin, error } = await serviceRoleSupabase
      .from('admins')
      .select('id, role')
      .eq('id', decoded.id)
      .single();

    if (error || !admin) {
      return res.status(401).json({ error: 'Invalid token or user no longer exists.' });
    }

    req.admin = admin; // Add admin info to request object
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token has expired.' });
    }
    return res.status(401).json({ error: 'Invalid token.' });
  }
};

const requireSuperAdmin = (req, res, next) => {
  if (req.admin && req.admin.role === 'super') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Super admin privileges required.' });
  }
};

// Login endpoint handler
const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  try {
    // Verify user exists in database
    const { data: admin, error } = await serviceRoleSupabase
      .from('admins')
      .select('id, full_name, email, password_hash, role')
      .eq('email', email)
      .single();
    
    if (error || !admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Verify password
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate token with actual user data
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      ADMIN_PASSWORD,
      { expiresIn: '24h' }
    );
    
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: admin.id,
        full_name: admin.full_name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get admin token info (for debugging purposes)
const getAdminToken = () => {
  return generateAdminToken();
};

module.exports = {
  requireAdminAuth,
  requireSuperAdmin,
  adminLogin,
  ADMIN_PASSWORD
};