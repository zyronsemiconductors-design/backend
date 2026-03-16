const { createClient } = require('@supabase/supabase-js');
const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = require('../config/env');

class DBService {
  constructor() {
    // Use service role key for admin operations
    this.supabase = SUPABASE_SERVICE_ROLE_KEY ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) : null;
    this.isSupabaseAvailable = !!this.supabase;
  }

  // Site settings
  async getSetting(id) {
    if (!this.isSupabaseAvailable) {
      return null;
    }

    try {
      const { data, error } = await this.supabase
        .from('site_settings')
        .select('value')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching site setting:', error);
        return null;
      }

      return data?.value || null;
    } catch (error) {
      console.error('Unexpected error fetching site setting:', error);
      return null;
    }
  }

  // Contact form submissions
  async createContact(data) {
    if (!this.isSupabaseAvailable) {
      console.warn('Supabase is not configured, skipping database save');
      return null;
    }

    try {
      const { data: contact, error } = await this.supabase
        .from('contacts')
        .insert([{
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: data.message,
          created_at: new Date().toISOString()
        }]);

      if (error) {
        console.error('Error saving contact:', error);
        // Check if it's a table not found error
        if (error.code === '42P01' || error.code === 'PGRST205') {
          console.error('Table "contacts" does not exist in Supabase. Please create the table first.');
        }
        return null; // Don't throw, just return null to allow email to still send
      }

      return contact;
    } catch (error) {
      console.error('Unexpected error saving contact:', error);
      return null; // Don't throw, just return null to allow email to still send
    }
  }

  // Job applications
  async createJobApplication(data) {
    if (!this.isSupabaseAvailable) {
      console.warn('Supabase is not configured, skipping database save');
      return null;
    }

    try {
      const { data: application, error } = await this.supabase
        .from('job_applications')
        .insert([{
          name: data.name,
          email: data.email,
          phone: data.phone,
          position: data.position,
          message: data.message,
          resume_url: data.resume_url,
          resume_name: data.resume_name,
          created_at: new Date().toISOString()
        }]);

      if (error) {
        console.error('Error saving job application:', error);
        // Check if it's a table not found error
        if (error.code === '42P01' || error.code === 'PGRST205') {
          console.error('Table "job_applications" does not exist in Supabase. Please create the table first.');
        }
        return null; // Don't throw, just return null to allow email to still send
      }

      return application;
    } catch (error) {
      console.error('Unexpected error saving job application:', error);
      return null; // Don't throw, just return null to allow email to still send
    }
  }

  // Community join requests
  async createCommunityRequest(data) {
    if (!this.isSupabaseAvailable) {
      console.warn('Supabase is not configured, skipping database save');
      return null;
    }

    try {
      const { data: community, error } = await this.supabase
        .from('community_requests')
        .insert([{
          name: data.name,
          email: data.email,
          interest: data.interest,
          message: data.message,
          created_at: new Date().toISOString()
        }]);

      if (error) {
        console.error('Error saving community request:', error);
        // Check if it's a table not found error
        if (error.code === '42P01' || error.code === 'PGRST205') {
          console.error('Table "community_requests" does not exist in Supabase. Please create the table first.');
        }
        return null; // Don't throw, just return null to allow email to still send
      }

      return community;
    } catch (error) {
      console.error('Unexpected error saving community request:', error);
      return null; // Don't throw, just return null to allow email to still send
    }
  }

  // Resource enquiries
  async createResourceEnquiry(data) {
    if (!this.isSupabaseAvailable) {
      console.warn('Supabase is not configured, skipping database save');
      return null;
    }

    try {
      const { data: resource, error } = await this.supabase
        .from('resource_enquiries')
        .insert([{
          name: data.name,
          email: data.email,
          topic: data.topic,
          message: data.message,
          created_at: new Date().toISOString()
        }]);

      if (error) {
        console.error('Error saving resource enquiry:', error);
        // Check if it's a table not found error
        if (error.code === '42P01' || error.code === 'PGRST205') {
          console.error('Table "resource_enquiries" does not exist in Supabase. Please create the table first.');
        }
        return null; // Don't throw, just return null to allow email to still send
      }

      return resource;
    } catch (error) {
      console.error('Unexpected error saving resource enquiry:', error);
      return null; // Don't throw, just return null to allow email to still send
    }
  }

  // Fetch all contacts
  async getAllContacts() {
    if (!this.isSupabaseAvailable) {
      console.warn('Supabase is not configured, returning empty array');
      return [];
    }

    try {
      const { data, error } = await this.supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching contacts:', error);
        return [];
      }

      return data;
    } catch (error) {
      console.error('Unexpected error fetching contacts:', error);
      return [];
    }
  }

  // Fetch all job applications
  async getAllJobApplications() {
    if (!this.isSupabaseAvailable) {
      console.warn('Supabase is not configured, returning empty array');
      return [];
    }

    try {
      const { data, error } = await this.supabase
        .from('job_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching job applications:', error);
        return [];
      }

      return data;
    } catch (error) {
      console.error('Unexpected error fetching job applications:', error);
      return [];
    }
  }

  // Fetch all community requests
  async getAllCommunityRequests() {
    if (!this.isSupabaseAvailable) {
      console.warn('Supabase is not configured, returning empty array');
      return [];
    }

    try {
      const { data, error } = await this.supabase
        .from('community_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching community requests:', error);
        return [];
      }

      return data;
    } catch (error) {
      console.error('Unexpected error fetching community requests:', error);
      return [];
    }
  }

  // Fetch all resource enquiries
  async getAllResourceEnquiries() {
    if (!this.isSupabaseAvailable) {
      console.warn('Supabase is not configured, returning empty array');
      return [];
    }

    try {
      const { data, error } = await this.supabase
        .from('resource_enquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching resource enquiries:', error);
        return [];
      }

      return data;
    } catch (error) {
      console.error('Unexpected error fetching resource enquiries:', error);
      return [];
    }
  }

  // ==========================================
  // UPDATE OPERATIONS
  // ==========================================

  async updateContact(id, updateData) {
    if (!this.isSupabaseAvailable) {
      throw new Error('Supabase is not configured');
    }

    try {
      const { data, error } = await this.supabase
        .from('contacts')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  }

  async updateJobApplication(id, updateData) {
    if (!this.isSupabaseAvailable) {
      throw new Error('Supabase is not configured');
    }

    try {
      const { data, error } = await this.supabase
        .from('job_applications')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating job application:', error);
      throw error;
    }
  }

  async updateCommunityRequest(id, updateData) {
    if (!this.isSupabaseAvailable) {
      throw new Error('Supabase is not configured');
    }

    try {
      const { data, error } = await this.supabase
        .from('community_requests')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating community request:', error);
      throw error;
    }
  }

  async updateResourceEnquiry(id, updateData) {
    if (!this.isSupabaseAvailable) {
      throw new Error('Supabase is not configured');
    }

    try {
      const { data, error } = await this.supabase
        .from('resource_enquiries')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating resource enquiry:', error);
      throw error;
    }
  }

  // ==========================================
  // DELETE OPERATIONS
  // ==========================================

  async deleteContact(id) {
    if (!this.isSupabaseAvailable) {
      throw new Error('Supabase is not configured');
    }

    try {
      const { error } = await this.supabase
        .from('contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  }

  async deleteJobApplication(id) {
    if (!this.isSupabaseAvailable) {
      throw new Error('Supabase is not configured');
    }

    try {
      const { error } = await this.supabase
        .from('job_applications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting job application:', error);
      throw error;
    }
  }

  async deleteCommunityRequest(id) {
    if (!this.isSupabaseAvailable) {
      throw new Error('Supabase is not configured');
    }

    try {
      const { error } = await this.supabase
        .from('community_requests')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting community request:', error);
      throw error;
    }
  }

  async deleteResourceEnquiry(id) {
    if (!this.isSupabaseAvailable) {
      throw new Error('Supabase is not configured');
    }

    try {
      const { error } = await this.supabase
        .from('resource_enquiries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting resource enquiry:', error);
      throw error;
    }
  }
}

module.exports = new DBService();
