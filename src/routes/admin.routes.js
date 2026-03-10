const express = require('express');
const adminAuth = require('../controllers/adminAuth.controller');
const adminUser = require('../controllers/adminUser.controller');
const adminController = require('../controllers/admin.controller');
const { uploadImage } = require('../controllers/upload.controller');
const { getSettings, updateSettings } = require("../controllers/settings.controller");
const { requireAdminAuth, requireSuperAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

// Public setup and login routes
router.post('/setup', adminAuth.setupFirstAdmin);
router.post('/login', adminAuth.login);

// Protected routes (require admin authentication)
router.get('/me', requireAdminAuth, adminAuth.getMe);

// Inbox / Submission routes - READ
router.get('/contacts', requireAdminAuth, adminController.getContacts);
router.get('/careers', requireAdminAuth, adminController.getJobApplications);
router.get('/community', requireAdminAuth, adminController.getCommunityRequests);
router.get('/resources', requireAdminAuth, adminController.getResourceEnquiries);
router.get('/stats', requireAdminAuth, adminController.getSystemStats);

// Inbox / Submission routes - UPDATE
router.put('/contacts/:id', requireAdminAuth, adminController.updateContact);
router.put('/careers/:id', requireAdminAuth, adminController.updateJobApplication);
router.put('/community/:id', requireAdminAuth, adminController.updateCommunityRequest);
router.put('/resources/:id', requireAdminAuth, adminController.updateResourceEnquiry);

// Inbox / Submission routes - DELETE
router.delete('/contacts/:id', requireAdminAuth, adminController.deleteContact);
router.delete('/careers/:id', requireAdminAuth, adminController.deleteJobApplication);
router.delete('/community/:id', requireAdminAuth, adminController.deleteCommunityRequest);
router.delete('/resources/:id', requireAdminAuth, adminController.deleteResourceEnquiry);

// User management routes (require super-admin privileges)
router.get('/users', requireAdminAuth, requireSuperAdmin, adminUser.getAllAdmins);
router.post('/users', requireAdminAuth, requireSuperAdmin, adminUser.createAdmin);
router.delete('/users/:id', requireAdminAuth, requireSuperAdmin, adminUser.deleteAdmin);

// Site Settings routes
router.get("/settings", requireAdminAuth, getSettings);
router.put("/settings/:id", requireAdminAuth, requireSuperAdmin, updateSettings);

// Media upload
router.post('/upload', requireAdminAuth, uploadImage);

module.exports = router;
