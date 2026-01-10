const express = require('express');
const router = express.Router();
const cmsController = require('../controllers/cms.controller');
const { requireAdminAuth } = require('../middlewares/auth.middleware');

// ============ ADMIN ROUTES (Protected) ============

// Page Content Management
router.get('/admin/pages', requireAdminAuth, cmsController.getAllPageContent);
router.get('/admin/pages/:pageId', requireAdminAuth, cmsController.getPageContent);
router.get('/admin/pages/:pageId/:sectionKey', requireAdminAuth, cmsController.getPageSection);
router.post('/admin/pages', requireAdminAuth, cmsController.upsertPageContent);
router.put('/admin/pages', requireAdminAuth, cmsController.upsertPageContent);
router.delete('/admin/pages/:id', requireAdminAuth, cmsController.deletePageContent);

// Social Links Management
router.get('/admin/social', requireAdminAuth, cmsController.getAllSocialLinks);
router.post('/admin/social', requireAdminAuth, cmsController.upsertSocialLink);
router.put('/admin/social', requireAdminAuth, cmsController.upsertSocialLink);
router.delete('/admin/social/:id', requireAdminAuth, cmsController.deleteSocialLink);
router.post('/admin/social/reorder', requireAdminAuth, cmsController.updateSocialLinksOrder);

// Navigation Management
router.get('/admin/navigation', requireAdminAuth, cmsController.getAllNavigationItems);
router.post('/admin/navigation', requireAdminAuth, cmsController.upsertNavigationItem);
router.put('/admin/navigation', requireAdminAuth, cmsController.upsertNavigationItem);
router.delete('/admin/navigation/:id', requireAdminAuth, cmsController.deleteNavigationItem);
router.post('/admin/navigation/reorder', requireAdminAuth, cmsController.updateNavigationOrder);

// SEO Metadata Management
router.get('/admin/seo', requireAdminAuth, cmsController.getAllSEOMetadata);
router.get('/admin/seo/:pageId', requireAdminAuth, cmsController.getSEOMetadata);
router.post('/admin/seo', requireAdminAuth, cmsController.upsertSEOMetadata);
router.put('/admin/seo', requireAdminAuth, cmsController.upsertSEOMetadata);
router.delete('/admin/seo/:pageId', requireAdminAuth, cmsController.deleteSEOMetadata);

// ============ PUBLIC ROUTES ============

// Public Page Content
router.get('/public/pages/:pageId', cmsController.getPageContent);
router.get('/public/pages/:pageId/:sectionKey', cmsController.getPageSection);

// Public Social Links
router.get('/public/social', cmsController.getSocialLinks);

// Public Navigation
router.get('/public/navigation', cmsController.getNavigationItems);

// Public SEO Metadata
router.get('/public/seo/:pageId', cmsController.getSEOMetadata);

module.exports = router;
