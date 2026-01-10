const cmsService = require('../services/cms.service');

/**
 * CMS Controller - Handles HTTP requests for CMS operations
 */

// ============ PAGE CONTENT CONTROLLERS ============

/**
 * Get all page content for admin
 */
const getAllPageContent = async (req, res, next) => {
    try {
        const { page } = req.query;
        const content = await cmsService.getAllPageContent(page);
        res.json({ success: true, data: content });
    } catch (error) {
        next(error);
    }
};

/**
 * Get specific page content
 */
const getPageContent = async (req, res, next) => {
    try {
        const { pageId } = req.params;
        const content = await cmsService.getPageContent(pageId);
        res.json({ success: true, data: content });
    } catch (error) {
        next(error);
    }
};

/**
 * Get specific page section
 */
const getPageSection = async (req, res, next) => {
    try {
        const { pageId, sectionKey } = req.params;
        const content = await cmsService.getPageSection(pageId, sectionKey);
        res.json({ success: true, data: content });
    } catch (error) {
        next(error);
    }
};

/**
 * Create or update page content
 */
const upsertPageContent = async (req, res, next) => {
    try {
        const contentData = req.body;

        // Validate required fields
        if (!contentData.page_identifier || !contentData.section_key || !contentData.content) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: page_identifier, section_key, content'
            });
        }

        const result = await cmsService.upsertPageContent(contentData);
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete page content
 */
const deletePageContent = async (req, res, next) => {
    try {
        const { id } = req.params;
        await cmsService.deletePageContent(id);
        res.json({ success: true, message: 'Content deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// ============ SOCIAL LINKS CONTROLLERS ============

/**
 * Get all social links for admin
 */
const getAllSocialLinks = async (req, res, next) => {
    try {
        const links = await cmsService.getAllSocialLinks();
        res.json({ success: true, data: links });
    } catch (error) {
        next(error);
    }
};

/**
 * Get active social links (public)
 */
const getSocialLinks = async (req, res, next) => {
    try {
        const links = await cmsService.getSocialLinks();
        res.json({ success: true, data: links });
    } catch (error) {
        next(error);
    }
};

/**
 * Create or update social link
 */
const upsertSocialLink = async (req, res, next) => {
    try {
        const linkData = req.body;

        // Validate required fields
        if (!linkData.platform || !linkData.url) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: platform, url'
            });
        }

        const result = await cmsService.upsertSocialLink(linkData);
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete social link
 */
const deleteSocialLink = async (req, res, next) => {
    try {
        const { id } = req.params;
        await cmsService.deleteSocialLink(id);
        res.json({ success: true, message: 'Social link deleted successfully' });
    } catch (error) {
        next(error);
    }
};

/**
 * Update social links order
 */
const updateSocialLinksOrder = async (req, res, next) => {
    try {
        const { orderedIds } = req.body;

        if (!Array.isArray(orderedIds)) {
            return res.status(400).json({
                success: false,
                message: 'orderedIds must be an array'
            });
        }

        const result = await cmsService.updateSocialLinksOrder(orderedIds);
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

// ============ NAVIGATION CONTROLLERS ============

/**
 * Get all navigation items for admin
 */
const getAllNavigationItems = async (req, res, next) => {
    try {
        const items = await cmsService.getAllNavigationItems();
        res.json({ success: true, data: items });
    } catch (error) {
        next(error);
    }
};

/**
 * Get active navigation items (public)
 */
const getNavigationItems = async (req, res, next) => {
    try {
        const items = await cmsService.getNavigationItems();
        res.json({ success: true, data: items });
    } catch (error) {
        next(error);
    }
};

/**
 * Create or update navigation item
 */
const upsertNavigationItem = async (req, res, next) => {
    try {
        const itemData = req.body;

        // Validate required fields
        if (!itemData.label || !itemData.path) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: label, path'
            });
        }

        const result = await cmsService.upsertNavigationItem(itemData);
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete navigation item
 */
const deleteNavigationItem = async (req, res, next) => {
    try {
        const { id } = req.params;
        await cmsService.deleteNavigationItem(id);
        res.json({ success: true, message: 'Navigation item deleted successfully' });
    } catch (error) {
        next(error);
    }
};

/**
 * Update navigation items order
 */
const updateNavigationOrder = async (req, res, next) => {
    try {
        const { orderedIds } = req.body;

        if (!Array.isArray(orderedIds)) {
            return res.status(400).json({
                success: false,
                message: 'orderedIds must be an array'
            });
        }

        const result = await cmsService.updateNavigationOrder(orderedIds);
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

// ============ SEO METADATA CONTROLLERS ============

/**
 * Get all SEO metadata for admin
 */
const getAllSEOMetadata = async (req, res, next) => {
    try {
        const metadata = await cmsService.getAllSEOMetadata();
        res.json({ success: true, data: metadata });
    } catch (error) {
        next(error);
    }
};

/**
 * Get SEO metadata for specific page (public)
 */
const getSEOMetadata = async (req, res, next) => {
    try {
        const { pageId } = req.params;
        const metadata = await cmsService.getSEOMetadata(pageId);
        res.json({ success: true, data: metadata });
    } catch (error) {
        next(error);
    }
};

/**
 * Create or update SEO metadata
 */
const upsertSEOMetadata = async (req, res, next) => {
    try {
        const metadataData = req.body;

        // Validate required fields
        if (!metadataData.page_identifier) {
            return res.status(400).json({
                success: false,
                message: 'Missing required field: page_identifier'
            });
        }

        const result = await cmsService.upsertSEOMetadata(metadataData);
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete SEO metadata
 */
const deleteSEOMetadata = async (req, res, next) => {
    try {
        const { pageId } = req.params;
        await cmsService.deleteSEOMetadata(pageId);
        res.json({ success: true, message: 'SEO metadata deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    // Page Content
    getAllPageContent,
    getPageContent,
    getPageSection,
    upsertPageContent,
    deletePageContent,

    // Social Links
    getAllSocialLinks,
    getSocialLinks,
    upsertSocialLink,
    deleteSocialLink,
    updateSocialLinksOrder,

    // Navigation
    getAllNavigationItems,
    getNavigationItems,
    upsertNavigationItem,
    deleteNavigationItem,
    updateNavigationOrder,

    // SEO Metadata
    getAllSEOMetadata,
    getSEOMetadata,
    upsertSEOMetadata,
    deleteSEOMetadata
};
