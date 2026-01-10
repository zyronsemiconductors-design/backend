const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');
const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = require('../config/env');

const getAllAdmins = async (req, res) => {
    try {
        const serviceRoleSupabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
        
        const { data, error } = await serviceRoleSupabase
            .from('admins')
            .select('id, full_name, email, role, created_at')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch admins' });
    }
};

const createAdmin = async (req, res) => {
    try {
        const { full_name, email, password, role } = req.body;
        
        const serviceRoleSupabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

        const password_hash = await bcrypt.hash(password, 10);

        const { data, error } = await serviceRoleSupabase
            .from('admins')
            .insert([{ full_name, email, password_hash, role: role || 'admin' }])
            .select('id, full_name, email, role, created_at');

        if (error) {
            if (error.code === '23505') return res.status(400).json({ error: 'Email already exists' });
            throw error;
        }

        res.status(201).json(data[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create admin' });
    }
};

const deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        
        const serviceRoleSupabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

        // Prevent deleting self
        if (id === req.admin.id) {
            return res.status(400).json({ error: 'You cannot delete your own account' });
        }

        const { error } = await serviceRoleSupabase
            .from('admins')
            .delete()
            .eq('id', id);

        if (error) throw error;
        res.status(200).json({ message: 'Admin deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete admin' });
    }
};

module.exports = {
    getAllAdmins,
    createAdmin,
    deleteAdmin
};
