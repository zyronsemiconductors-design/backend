const { supabase } = require('../config/supabase.config');

/**
 * CMS Service - Handles all CMS-related database operations
 */

// ============ PAGE CONTENT OPERATIONS ============

/**
 * Get all content for a specific page
 */
const getPageContent = async (pageIdentifier) => {
    const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .eq('page_identifier', pageIdentifier)
        .eq('is_published', true)
        .order('section_key');

    if (error) throw error;
    return data;
};

/**
 * Get content for a specific page section
 */
const getPageSection = async (pageIdentifier, sectionKey) => {
    const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .eq('page_identifier', pageIdentifier)
        .eq('section_key', sectionKey)
        .eq('is_published', true)
        .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
    return data;
};

/**
 * Get all page content (admin)
 */
const getAllPageContent = async (pageIdentifier = null) => {
    let query = supabase
        .from('page_content')
        .select('*')
        .order('page_identifier')
        .order('section_key');

    if (pageIdentifier) {
        query = query.eq('page_identifier', pageIdentifier);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
};

/**
 * Create or update page content
 */
const upsertPageContent = async (contentData) => {
    const { data, error } = await supabase
        .from('page_content')
        .upsert(contentData, { onConflict: 'page_identifier,section_key' })
        .select();

    if (error) throw error;
    return data;
};

/**
 * Delete page content
 */
const deletePageContent = async (id) => {
    const { error } = await supabase
        .from('page_content')
        .delete()
        .eq('id', id);

    if (error) throw error;
    return { success: true };
};

// ============ SOCIAL LINKS OPERATIONS ============

/**
 * Get all active social links (public)
 */
const getSocialLinks = async () => {
    const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

    if (error) throw error;
    return data;
};

/**
 * Get all social links (admin)
 */
const getAllSocialLinks = async () => {
    const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .order('display_order');

    if (error) throw error;
    return data;
};

/**
 * Create or update social link
 */
const upsertSocialLink = async (linkData) => {
    const { data, error } = await supabase
        .from('social_links')
        .upsert(linkData)
        .select();

    if (error) throw error;
    return data;
};

/**
 * Delete social link
 */
const deleteSocialLink = async (id) => {
    const { error } = await supabase
        .from('social_links')
        .delete()
        .eq('id', id);

    if (error) throw error;
    return { success: true };
};

/**
 * Update social links order
 */
const updateSocialLinksOrder = async (orderedIds) => {
    const updates = orderedIds.map((id, index) => ({
        id,
        display_order: index + 1
    }));

    const { data, error } = await supabase
        .from('social_links')
        .upsert(updates)
        .select();

    if (error) throw error;
    return data;
};

// ============ NAVIGATION OPERATIONS ============

/**
 * Get all active navigation items (public)
 */
const getNavigationItems = async () => {
    const { data, error } = await supabase
        .from('navigation_items')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

    if (error) throw error;
    return data;
};

/**
 * Get all navigation items (admin)
 */
const getAllNavigationItems = async () => {
    const { data, error } = await supabase
        .from('navigation_items')
        .select('*')
        .order('display_order');

    if (error) throw error;
    return data;
};

/**
 * Create or update navigation item
 */
const upsertNavigationItem = async (itemData) => {
    const { data, error } = await supabase
        .from('navigation_items')
        .upsert(itemData)
        .select();

    if (error) throw error;
    return data;
};

/**
 * Delete navigation item
 */
const deleteNavigationItem = async (id) => {
    const { error } = await supabase
        .from('navigation_items')
        .delete()
        .eq('id', id);

    if (error) throw error;
    return { success: true };
};

/**
 * Update navigation items order
 */
const updateNavigationOrder = async (orderedIds) => {
    const updates = orderedIds.map((id, index) => ({
        id,
        display_order: index + 1
    }));

    const { data, error } = await supabase
        .from('navigation_items')
        .upsert(updates)
        .select();

    if (error) throw error;
    return data;
};

// ============ SEO METADATA OPERATIONS ============

/**
 * Get SEO metadata for a page (public)
 */
const getSEOMetadata = async (pageIdentifier) => {
    const { data, error } = await supabase
        .from('seo_metadata')
        .select('*')
        .eq('page_identifier', pageIdentifier)
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
};

/**
 * Get all SEO metadata (admin)
 */
const getAllSEOMetadata = async () => {
    const { data, error } = await supabase
        .from('seo_metadata')
        .select('*')
        .order('page_identifier');

    if (error) throw error;
    return data;
};

/**
 * Create or update SEO metadata
 */
const upsertSEOMetadata = async (metadataData) => {
    const { data, error } = await supabase
        .from('seo_metadata')
        .upsert(metadataData, { onConflict: 'page_identifier' })
        .select();

    if (error) throw error;
    return data;
};

/**
 * Delete SEO metadata
 */
const deleteSEOMetadata = async (pageIdentifier) => {
    const { error } = await supabase
        .from('seo_metadata')
        .delete()
        .eq('page_identifier', pageIdentifier);

    if (error) throw error;
    return { success: true };
};

module.exports = {
    // Page Content
    getPageContent,
    getPageSection,
    getAllPageContent,
    upsertPageContent,
    deletePageContent,

    // Social Links
    getSocialLinks,
    getAllSocialLinks,
    upsertSocialLink,
    deleteSocialLink,
    updateSocialLinksOrder,

    // Navigation
    getNavigationItems,
    getAllNavigationItems,
    upsertNavigationItem,
    deleteNavigationItem,
    updateNavigationOrder,

    // SEO Metadata
    getSEOMetadata,
    getAllSEOMetadata,
    upsertSEOMetadata,
    deleteSEOMetadata
};
