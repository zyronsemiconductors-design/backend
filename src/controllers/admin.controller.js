const dbService = require('../services/db.service');

const adminController = {
  // Get all contacts
  getContacts: async (req, res) => {
    try {
      // Verify admin authentication has been performed by middleware
      if (!req.admin || (req.admin.role !== 'admin' && req.admin.role !== 'super')) {
        return res.status(403).json({ error: 'Access forbidden' });
      }

      const contacts = await dbService.getAllContacts();
      // Sanitize response data to prevent any potential data leakage
      const sanitizedContacts = contacts.map(contact => ({
        id: contact.id,
        name: contact.name,
        email: contact.email,
        message: contact.message,
        created_at: contact.created_at
      }));
      res.status(200).json(sanitizedContacts);
    } catch (err) {
      console.error('Server error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get all job applications
  getJobApplications: async (req, res) => {
    try {
      // Verify admin authentication has been performed by middleware
      if (!req.admin || (req.admin.role !== 'admin' && req.admin.role !== 'super')) {
        return res.status(403).json({ error: 'Access forbidden' });
      }

      const applications = await dbService.getAllJobApplications();
      // Sanitize response data to prevent any potential data leakage
      const sanitizedApplications = applications.map(app => ({
        id: app.id,
        name: app.name,
        email: app.email,
        phone: app.phone,
        position: app.position,
        message: app.message,
        resume_url: app.resume_url,
        resume_name: app.resume_name,
        created_at: app.created_at
      }));
      res.status(200).json(sanitizedApplications);
    } catch (err) {
      console.error('Server error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get all community requests
  getCommunityRequests: async (req, res) => {
    try {
      // Verify admin authentication has been performed by middleware
      if (!req.admin || (req.admin.role !== 'admin' && req.admin.role !== 'super')) {
        return res.status(403).json({ error: 'Access forbidden' });
      }

      const requests = await dbService.getAllCommunityRequests();
      // Sanitize response data to prevent any potential data leakage
      const sanitizedRequests = requests.map(req => ({
        id: req.id,
        name: req.name,
        email: req.email,
        interest: req.interest,
        message: req.message,
        created_at: req.created_at
      }));
      res.status(200).json(sanitizedRequests);
    } catch (err) {
      console.error('Server error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get all resource enquiries
  getResourceEnquiries: async (req, res) => {
    try {
      // Verify admin authentication has been performed by middleware
      if (!req.admin || (req.admin.role !== 'admin' && req.admin.role !== 'super')) {
        return res.status(403).json({ error: 'Access forbidden' });
      }

      const enquiries = await dbService.getAllResourceEnquiries();
      // Sanitize response data to prevent any potential data leakage
      const sanitizedEnquiries = enquiries.map(enq => ({
        id: enq.id,
        name: enq.name,
        email: enq.email,
        topic: enq.topic,
        message: enq.message,
        created_at: enq.created_at
      }));
      res.status(200).json(sanitizedEnquiries);
    } catch (err) {
      console.error('Server error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get system statistics for dashboard
  getSystemStats: async (req, res) => {
    try {
      if (!req.admin || (req.admin.role !== 'admin' && req.admin.role !== 'super')) {
        return res.status(403).json({ error: 'Access forbidden' });
      }

      // 1. Get counts for all tables
      const [contacts, careers, community, resources] = await Promise.all([
        dbService.getAllContacts(),
        dbService.getAllJobApplications(),
        dbService.getAllCommunityRequests(),
        dbService.getAllResourceEnquiries()
      ]);

      // 2. Combine into a "System Logs" format
      const allLogs = [
        ...contacts.map(c => ({ id: `con-${c.id}`, type: 'contact', title: `New inquiry from ${c.name}`, time: c.created_at })),
        ...careers.map(c => ({ id: `car-${c.id}`, type: 'career', title: `Job application: ${c.position}`, time: c.created_at })),
        ...community.map(c => ({ id: `com-${c.id}`, type: 'community', title: `Community join request: ${c.name}`, time: c.created_at })),
        ...resources.map(c => ({ id: `res-${c.id}`, type: 'resource', title: `Resource inquiry: ${c.topic}`, time: c.created_at }))
      ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 10);

      // 3. Check health status
      const dbStatus = dbService.isSupabaseAvailable ? 'NOMINAL' : 'OFFLINE';

      let mailStatus = 'STABLE';
      try {
        const transporter = require('../config/mail.config');
        await transporter.verify();
      } catch (e) {
        mailStatus = 'UNSTABLE';
      }

      res.status(200).json({
        stats: {
          contacts: contacts.length,
          careers: careers.length,
          community: community.length,
          resources: resources.length
        },
        logs: allLogs,
        health: {
          database: dbStatus,
          auth: 'STABLE', // Managed by Supabase
          email: mailStatus
        }
      });
    } catch (err) {
      console.error('Stats fetch error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // ==========================================
  // UPDATE OPERATIONS
  // ==========================================

  // Update contact status/notes
  updateContact: async (req, res) => {
    try {
      if (!req.admin || (req.admin.role !== 'admin' && req.admin.role !== 'super')) {
        return res.status(403).json({ error: 'Access forbidden' });
      }

      const { id } = req.params;
      const { status, admin_notes } = req.body;

      const updateData = { status, admin_notes };
      if (status === 'responded') {
        updateData.responded_at = new Date().toISOString();
        updateData.responded_by = req.admin.id;
      }

      const updated = await dbService.updateContact(id, updateData);
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      console.error('Update contact error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Update job application status/notes
  updateJobApplication: async (req, res) => {
    try {
      if (!req.admin || (req.admin.role !== 'admin' && req.admin.role !== 'super')) {
        return res.status(403).json({ error: 'Access forbidden' });
      }

      const { id } = req.params;
      const { status, reviewer_notes } = req.body;

      const updateData = { status, reviewer_notes };
      if (status === 'reviewed' || status === 'shortlisted' || status === 'rejected') {
        updateData.reviewed_at = new Date().toISOString();
        updateData.reviewed_by = req.admin.id;
      }

      const updated = await dbService.updateJobApplication(id, updateData);
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      console.error('Update job application error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Update community request status/notes
  updateCommunityRequest: async (req, res) => {
    try {
      if (!req.admin || (req.admin.role !== 'admin' && req.admin.role !== 'super')) {
        return res.status(403).json({ error: 'Access forbidden' });
      }

      const { id } = req.params;
      const { status, admin_notes } = req.body;

      const updateData = { status, admin_notes };
      if (status === 'approved' || status === 'declined') {
        updateData.processed_at = new Date().toISOString();
        updateData.processed_by = req.admin.id;
      }

      const updated = await dbService.updateCommunityRequest(id, updateData);
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      console.error('Update community request error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Update resource enquiry status/notes
  updateResourceEnquiry: async (req, res) => {
    try {
      if (!req.admin || (req.admin.role !== 'admin' && req.admin.role !== 'super')) {
        return res.status(403).json({ error: 'Access forbidden' });
      }

      const { id } = req.params;
      const { status, response_notes } = req.body;

      const updateData = { status, response_notes };
      if (status === 'responded' || status === 'fulfilled') {
        updateData.responded_at = new Date().toISOString();
        updateData.responded_by = req.admin.id;
      }

      const updated = await dbService.updateResourceEnquiry(id, updateData);
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      console.error('Update resource enquiry error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // ==========================================
  // DELETE OPERATIONS
  // ==========================================

  // Delete contact
  deleteContact: async (req, res) => {
    try {
      if (!req.admin || (req.admin.role !== 'admin' && req.admin.role !== 'super')) {
        return res.status(403).json({ error: 'Access forbidden' });
      }

      const { id } = req.params;
      await dbService.deleteContact(id);
      res.status(200).json({ success: true, message: 'Contact deleted successfully' });
    } catch (err) {
      console.error('Delete contact error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Delete job application
  deleteJobApplication: async (req, res) => {
    try {
      if (!req.admin || (req.admin.role !== 'admin' && req.admin.role !== 'super')) {
        return res.status(403).json({ error: 'Access forbidden' });
      }

      const { id } = req.params;
      await dbService.deleteJobApplication(id);
      res.status(200).json({ success: true, message: 'Job application deleted successfully' });
    } catch (err) {
      console.error('Delete job application error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Delete community request
  deleteCommunityRequest: async (req, res) => {
    try {
      if (!req.admin || (req.admin.role !== 'admin' && req.admin.role !== 'super')) {
        return res.status(403).json({ error: 'Access forbidden' });
      }

      const { id } = req.params;
      await dbService.deleteCommunityRequest(id);
      res.status(200).json({ success: true, message: 'Community request deleted successfully' });
    } catch (err) {
      console.error('Delete community request error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Delete resource enquiry
  deleteResourceEnquiry: async (req, res) => {
    try {
      if (!req.admin || (req.admin.role !== 'admin' && req.admin.role !== 'super')) {
        return res.status(403).json({ error: 'Access forbidden' });
      }

      const { id } = req.params;
      await dbService.deleteResourceEnquiry(id);
      res.status(200).json({ success: true, message: 'Resource enquiry deleted successfully' });
    } catch (err) {
      console.error('Delete resource enquiry error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = adminController;