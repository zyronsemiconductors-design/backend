-- CMS Tables Migration
-- This migration creates tables for the Content Management System

-- Create page_content table
CREATE TABLE IF NOT EXISTS page_content (
    id SERIAL PRIMARY KEY,
    page_identifier VARCHAR(100) NOT NULL,
    section_key VARCHAR(100) NOT NULL,
    content_type VARCHAR(20) NOT NULL DEFAULT 'json', -- 'text', 'html', 'json'
    content JSONB NOT NULL,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(page_identifier, section_key)
);

-- Create social_links table
CREATE TABLE IF NOT EXISTS social_links (
    id SERIAL PRIMARY KEY,
    platform VARCHAR(50) NOT NULL,
    url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    icon VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create navigation_items table
CREATE TABLE IF NOT EXISTS navigation_items (
    id SERIAL PRIMARY KEY,
    label VARCHAR(100) NOT NULL,
    path VARCHAR(255) NOT NULL,
    parent_id INTEGER REFERENCES navigation_items(id) ON DELETE CASCADE,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create seo_metadata table
CREATE TABLE IF NOT EXISTS seo_metadata (
    id SERIAL PRIMARY KEY,
    page_identifier VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255),
    description TEXT,
    keywords TEXT,
    og_image TEXT,
    og_title VARCHAR(255),
    og_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_page_content_page_identifier ON page_content(page_identifier);
CREATE INDEX IF NOT EXISTS idx_page_content_published ON page_content(is_published);
CREATE INDEX IF NOT EXISTS idx_social_links_active ON social_links(is_active);
CREATE INDEX IF NOT EXISTS idx_social_links_order ON social_links(display_order);
CREATE INDEX IF NOT EXISTS idx_navigation_items_active ON navigation_items(is_active);
CREATE INDEX IF NOT EXISTS idx_navigation_items_order ON navigation_items(display_order);
CREATE INDEX IF NOT EXISTS idx_navigation_items_parent ON navigation_items(parent_id);
CREATE INDEX IF NOT EXISTS idx_seo_metadata_page ON seo_metadata(page_identifier);

-- Create updated_at triggers
CREATE TRIGGER update_page_content_updated_at 
    BEFORE UPDATE ON page_content 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_links_updated_at 
    BEFORE UPDATE ON social_links 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_navigation_items_updated_at 
    BEFORE UPDATE ON navigation_items 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_seo_metadata_updated_at 
    BEFORE UPDATE ON seo_metadata 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE navigation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_metadata ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
DROP POLICY IF EXISTS "Allow public read for published page_content" ON page_content;
CREATE POLICY "Allow public read for published page_content" 
    ON page_content FOR SELECT 
    TO anon, authenticated 
    USING (is_published = true);

DROP POLICY IF EXISTS "Allow public read for active social_links" ON social_links;
CREATE POLICY "Allow public read for active social_links" 
    ON social_links FOR SELECT 
    TO anon, authenticated 
    USING (is_active = true);

DROP POLICY IF EXISTS "Allow public read for active navigation_items" ON navigation_items;
CREATE POLICY "Allow public read for active navigation_items" 
    ON navigation_items FOR SELECT 
    TO anon, authenticated 
    USING (is_active = true);

DROP POLICY IF EXISTS "Allow public read for seo_metadata" ON seo_metadata;
CREATE POLICY "Allow public read for seo_metadata" 
    ON seo_metadata FOR SELECT 
    TO anon, authenticated 
    USING (true);

-- Admin full access policies
DROP POLICY IF EXISTS "Admin full access to page_content" ON page_content;
CREATE POLICY "Admin full access to page_content" 
    ON page_content FOR ALL 
    TO service_role 
    USING (true);

DROP POLICY IF EXISTS "Admin full access to social_links" ON social_links;
CREATE POLICY "Admin full access to social_links" 
    ON social_links FOR ALL 
    TO service_role 
    USING (true);

DROP POLICY IF EXISTS "Admin full access to navigation_items" ON navigation_items;
CREATE POLICY "Admin full access to navigation_items" 
    ON navigation_items FOR ALL 
    TO service_role 
    USING (true);

DROP POLICY IF EXISTS "Admin full access to seo_metadata" ON seo_metadata;
CREATE POLICY "Admin full access to seo_metadata" 
    ON seo_metadata FOR ALL 
    TO service_role 
    USING (true);

-- Insert default social links
INSERT INTO social_links (platform, url, display_order, is_active, icon) VALUES
    ('LinkedIn', 'https://linkedin.com/company/zyron', 1, true, 'linkedin'),
    ('Twitter', 'https://twitter.com/zyron', 2, true, 'twitter'),
    ('Facebook', 'https://facebook.com/zyron', 3, true, 'facebook'),
    ('Instagram', 'https://instagram.com/zyron', 4, true, 'instagram')
ON CONFLICT DO NOTHING;

-- Insert default navigation items
INSERT INTO navigation_items (label, path, display_order, is_active) VALUES
    ('Home', '/', 1, true),
    ('About', '/about', 2, true),
    ('Services', '/services', 3, true),
    ('Why Zyron', '/why-zyron', 4, true),
    ('Careers', '/careers', 5, true),
    ('Community', '/community', 6, true),
    ('Resources', '/resources', 7, true),
    ('Contact', '/contact', 8, true)
ON CONFLICT DO NOTHING;

-- Insert default SEO metadata
INSERT INTO seo_metadata (page_identifier, title, description, keywords, og_title, og_description) VALUES
    ('home', 'Zyron Semiconductors - Advanced Chip Solutions', 'Leading provider of cutting-edge semiconductor solutions for the next generation of technology', 'semiconductors, chips, technology, innovation, zyron', 'Zyron Semiconductors', 'Advanced Chip Solutions for Tomorrow''s Technology'),
    ('about', 'About Us - Zyron Semiconductors', 'Learn about Zyron''s mission, vision, and commitment to innovation in semiconductor technology', 'about zyron, semiconductor company, chip manufacturer', 'About Zyron', 'Innovation in Semiconductor Technology'),
    ('services', 'Our Services - Zyron Semiconductors', 'Explore our comprehensive range of semiconductor services and solutions', 'semiconductor services, chip design, manufacturing', 'Zyron Services', 'Comprehensive Semiconductor Solutions'),
    ('why-zyron', 'Why Choose Zyron - Zyron Semiconductors', 'Discover what makes Zyron the preferred choice for semiconductor solutions', 'why choose zyron, semiconductor benefits, innovation', 'Why Zyron', 'The Future of Semiconductors'),
    ('contact', 'Contact Us - Zyron Semiconductors', 'Get in touch with Zyron for inquiries, partnerships, and support', 'contact zyron, semiconductor inquiry, support', 'Contact Zyron', 'Let''s Build the Future Together')
ON CONFLICT (page_identifier) DO NOTHING;

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON page_content TO service_role;
GRANT ALL PRIVILEGES ON social_links TO service_role;
GRANT ALL PRIVILEGES ON navigation_items TO service_role;
GRANT ALL PRIVILEGES ON seo_metadata TO service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO service_role;
