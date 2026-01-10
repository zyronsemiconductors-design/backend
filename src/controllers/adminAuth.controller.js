const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = require('../config/env');
const { ADMIN_PASSWORD } = require('../middlewares/auth.middleware'); // Fallback or secret key

// JWT secret should ideally be in env, but reusing ADMIN_PASSWORD for consistency with existing code
const JWT_SECRET = process.env.ADMIN_PASSWORD || 'default_admin_password_change_me';

const setupFirstAdmin = async (req, res) => {
    try {
        const { full_name, email, password } = req.body;

        // Create service role client for admin operations
        const serviceRoleSupabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
        
        // 1. Initial Check (Frontend calls this with empty body to see if setup is done)
        const { count, error: countError } = await serviceRoleSupabase
            .from('admins')
            .select('*', { count: 'exact', head: true });

        // If table doesn't exist, countError might have PGRST205
        if (countError) {
            console.error('Check setup table error:', countError);
            if (countError.code === 'PGRST205' || countError.message.includes('relation "public.admins" does not exist')) {
                return res.status(500).json({
                    error: 'Database table "admins" missing.',
                    details: 'Please run the database.sql script in your Supabase SQL Editor to create the necessary tables.',
                    code: 'TABLE_MISSING'
                });
            }
            throw countError;
        }

        if (count > 0) {
            return res.status(400).json({ error: 'Setup already completed. First admin already exists.' });
        }

        // 2. Deployment Check
        if (!full_name || !email || !password) {
            // If it's the initial check from useEffect, we don't return 400 yet, just "Not initialized"
            return res.status(200).json({ setup_needed: true });
        }

        // 3. Create Admin
        const password_hash = await bcrypt.hash(password, 10);

        // Use direct SQL to bypass RLS during initial setup
        const { data, error } = await serviceRoleSupabase
            .from('admins')
            .insert([{
                full_name,
                email,
                password_hash,
                role: 'super'
            }])
            .select();

        if (error) {
            console.error('Insert error details:', error);
            // Check if it's specifically the RLS error
            if (error.code === '42501') {
                return res.status(500).json({
                    error: 'Row Level Security policy violation. Please ensure your service role key is correct and has proper permissions.',
                    details: error.message
                });
            }
            throw error;
        };

        res.status(201).json({ message: 'First admin created successfully', user: { email: data[0].email, role: data[0].role } });
    } catch (error) {
        console.error('Setup error details:', {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint
        });
        res.status(500).json({
            error: 'Internal server error during setup',
            details: error.message,
            code: error.code
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Create service role client for admin operations
        const serviceRoleSupabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

        const { data: admin, error } = await serviceRoleSupabase
            .from('admins')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !admin) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, admin.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: admin.id, email: admin.email, role: admin.role },
            JWT_SECRET,
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

const getMe = async (req, res) => {
    try {
        // Create service role client for admin operations
        const serviceRoleSupabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
        
        const { data: admin, error } = await serviceRoleSupabase
            .from('admins')
            .select('id, full_name, email, role')
            .eq('id', req.admin.id)
            .single();

        if (error || !admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        res.status(200).json(admin);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    setupFirstAdmin,
    login,
    getMe
};
