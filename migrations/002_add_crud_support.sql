-- Migration: Add CRUD support fields to submission tables
-- Status tracking, notes, and timestamps for admin management

-- ==========================================
-- CONTACTS TABLE ENHANCEMENTS
-- ==========================================

-- Add status tracking
ALTER TABLE contacts 
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'new';

-- Add admin notes
ALTER TABLE contacts 
ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- Add response tracking
ALTER TABLE contacts 
ADD COLUMN IF NOT EXISTS responded_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE contacts 
ADD COLUMN IF NOT EXISTS responded_by UUID REFERENCES admins(id);

-- Create index for status filtering
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);

-- ==========================================
-- JOB APPLICATIONS TABLE ENHANCEMENTS
-- ==========================================

-- Add application status
ALTER TABLE job_applications 
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending';

-- Add reviewer notes
ALTER TABLE job_applications 
ADD COLUMN IF NOT EXISTS reviewer_notes TEXT;

-- Add review tracking
ALTER TABLE job_applications 
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE job_applications 
ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES admins(id);

-- Create index for status filtering
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);

-- ==========================================
-- COMMUNITY REQUESTS TABLE ENHANCEMENTS
-- ==========================================

-- Add request status
ALTER TABLE community_requests 
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending';

-- Add admin notes
ALTER TABLE community_requests 
ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- Add approval tracking
ALTER TABLE community_requests 
ADD COLUMN IF NOT EXISTS processed_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE community_requests 
ADD COLUMN IF NOT EXISTS processed_by UUID REFERENCES admins(id);

-- Create index for status filtering
CREATE INDEX IF NOT EXISTS idx_community_requests_status ON community_requests(status);

-- ==========================================
-- RESOURCE ENQUIRIES TABLE ENHANCEMENTS
-- ==========================================

-- Add enquiry status
ALTER TABLE resource_enquiries 
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending';

-- Add response notes
ALTER TABLE resource_enquiries 
ADD COLUMN IF NOT EXISTS response_notes TEXT;

-- Add response tracking
ALTER TABLE resource_enquiries 
ADD COLUMN IF NOT EXISTS responded_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE resource_enquiries 
ADD COLUMN IF NOT EXISTS responded_by UUID REFERENCES admins(id);

-- Create index for status filtering
CREATE INDEX IF NOT EXISTS idx_resource_enquiries_status ON resource_enquiries(status);

-- ==========================================
-- RLS POLICIES FOR UPDATE/DELETE
-- ==========================================

-- Contacts: Allow admins to update and delete
CREATE POLICY IF NOT EXISTS "Admins can update contacts"
ON contacts FOR UPDATE
USING (auth.uid() IN (SELECT id FROM admins));

CREATE POLICY IF NOT EXISTS "Admins can delete contacts"
ON contacts FOR DELETE
USING (auth.uid() IN (SELECT id FROM admins));

-- Job Applications: Allow admins to update and delete
CREATE POLICY IF NOT EXISTS "Admins can update job applications"
ON job_applications FOR UPDATE
USING (auth.uid() IN (SELECT id FROM admins));

CREATE POLICY IF NOT EXISTS "Admins can delete job applications"
ON job_applications FOR DELETE
USING (auth.uid() IN (SELECT id FROM admins));

-- Community Requests: Allow admins to update and delete
CREATE POLICY IF NOT EXISTS "Admins can update community requests"
ON community_requests FOR UPDATE
USING (auth.uid() IN (SELECT id FROM admins));

CREATE POLICY IF NOT EXISTS "Admins can delete community requests"
ON community_requests FOR DELETE
USING (auth.uid() IN (SELECT id FROM admins));

-- Resource Enquiries: Allow admins to update and delete
CREATE POLICY IF NOT EXISTS "Admins can update resource enquiries"
ON resource_enquiries FOR UPDATE
USING (auth.uid() IN (SELECT id FROM admins));

CREATE POLICY IF NOT EXISTS "Admins can delete resource enquiries"
ON resource_enquiries FOR DELETE
USING (auth.uid() IN (SELECT id FROM admins));

-- ==========================================
-- STATUS VALUE CONSTRAINTS (Optional)
-- ==========================================

-- Add check constraints for valid status values
ALTER TABLE contacts 
DROP CONSTRAINT IF EXISTS contacts_status_check;

ALTER TABLE contacts 
ADD CONSTRAINT contacts_status_check 
CHECK (status IN ('new', 'read', 'responded', 'archived'));

ALTER TABLE job_applications 
DROP CONSTRAINT IF EXISTS job_applications_status_check;

ALTER TABLE job_applications 
ADD CONSTRAINT job_applications_status_check 
CHECK (status IN ('pending', 'reviewed', 'shortlisted', 'rejected', 'hired'));

ALTER TABLE community_requests 
DROP CONSTRAINT IF EXISTS community_requests_status_check;

ALTER TABLE community_requests 
ADD CONSTRAINT community_requests_status_check 
CHECK (status IN ('pending', 'approved', 'active', 'declined', 'inactive'));

ALTER TABLE resource_enquiries 
DROP CONSTRAINT IF EXISTS resource_enquiries_status_check;

ALTER TABLE resource_enquiries 
ADD CONSTRAINT resource_enquiries_status_check 
CHECK (status IN ('pending', 'responded', 'fulfilled', 'closed'));

-- ==========================================
-- COMMENTS
-- ==========================================

COMMENT ON COLUMN contacts.status IS 'Contact status: new, read, responded, archived';
COMMENT ON COLUMN contacts.admin_notes IS 'Internal notes from admin about this contact';
COMMENT ON COLUMN job_applications.status IS 'Application status: pending, reviewed, shortlisted, rejected, hired';
COMMENT ON COLUMN job_applications.reviewer_notes IS 'Internal notes from reviewer';
COMMENT ON COLUMN community_requests.status IS 'Request status: pending, approved, active, declined, inactive';
COMMENT ON COLUMN resource_enquiries.status IS 'Enquiry status: pending, responded, fulfilled, closed';
