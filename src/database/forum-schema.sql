-- JuriBank Community Forum Database Schema v3.0
-- PostgreSQL database structure for anonymous peer support platform
-- Designed for educational compliance and privacy protection

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create custom types
CREATE TYPE user_type AS ENUM ('anonymous', 'student_moderator', 'professional_oversight');
CREATE TYPE post_status AS ENUM ('draft', 'published', 'moderated', 'archived', 'deleted');
CREATE TYPE moderation_status AS ENUM ('approved', 'pending', 'flagged', 'rejected');
CREATE TYPE content_type AS ENUM ('post', 'reply', 'comment');
CREATE TYPE report_status AS ENUM ('pending', 'reviewed', 'resolved', 'dismissed');

-- Categories table
CREATE TABLE categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    requires_moderation BOOLEAN DEFAULT false,
    post_count INTEGER DEFAULT 0
);

-- Anonymous sessions table for privacy protection
CREATE TABLE anonymous_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_token VARCHAR(128) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_active TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    user_agent TEXT,
    ip_hash VARCHAR(64), -- Hashed IP for privacy
    post_count INTEGER DEFAULT 0,
    reputation_score INTEGER DEFAULT 0
);

-- Forum posts table
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    content_filtered TEXT, -- Auto-filtered version
    category_id VARCHAR(50) REFERENCES categories(id),
    author_session_id UUID REFERENCES anonymous_sessions(id),
    
    -- Post metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Engagement metrics
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    reply_count INTEGER DEFAULT 0,
    
    -- Status and moderation
    status post_status DEFAULT 'published',
    moderation_status moderation_status DEFAULT 'approved',
    moderation_flags TEXT[], -- Array of moderation flags
    moderator_notes TEXT,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID,
    
    -- Educational compliance
    educational_level VARCHAR(50), -- 'educational', 'advice-seeking', 'discussion'
    contains_personal_info BOOLEAN DEFAULT false,
    auto_moderated BOOLEAN DEFAULT false,
    
    -- Post features
    is_helpful BOOLEAN DEFAULT false,
    is_pinned BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    
    -- Content analysis
    tags TEXT[], -- Array of extracted tags
    sentiment_score DECIMAL(3,2), -- -1.0 to 1.0
    complexity_level INTEGER, -- 1-5 scale
    
    -- Search indexing
    search_vector TSVECTOR
);

-- Post replies table
CREATE TABLE post_replies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    parent_reply_id UUID REFERENCES post_replies(id), -- For nested replies
    content TEXT NOT NULL,
    content_filtered TEXT,
    author_session_id UUID REFERENCES anonymous_sessions(id),
    
    -- Reply metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Engagement
    like_count INTEGER DEFAULT 0,
    
    -- Moderation
    status post_status DEFAULT 'published',
    moderation_status moderation_status DEFAULT 'approved',
    moderation_flags TEXT[],
    
    -- Educational features
    is_helpful BOOLEAN DEFAULT false,
    moderator_verified BOOLEAN DEFAULT false,
    educational_value INTEGER DEFAULT 0, -- 1-5 rating
    
    -- Nesting level for replies
    reply_depth INTEGER DEFAULT 0,
    
    -- Content analysis
    sentiment_score DECIMAL(3,2),
    search_vector TSVECTOR
);

-- User likes table for anonymous tracking
CREATE TABLE user_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES anonymous_sessions(id),
    content_id UUID NOT NULL,
    content_type content_type NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(session_id, content_id, content_type)
);

-- Content reports table
CREATE TABLE content_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id UUID NOT NULL,
    content_type content_type NOT NULL,
    reported_by_session_id UUID REFERENCES anonymous_sessions(id),
    
    -- Report details
    reason VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50), -- 'spam', 'inappropriate', 'privacy', 'legal_advice'
    
    -- Report status
    status report_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    
    -- Moderation
    assigned_moderator_id UUID,
    moderator_notes TEXT,
    action_taken VARCHAR(100),
    
    -- Priority scoring
    priority_score INTEGER DEFAULT 1, -- 1-5, 5 being highest priority
    auto_flagged BOOLEAN DEFAULT false
);

-- Student moderators table
CREATE TABLE moderators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    
    -- Credentials and verification
    institution VARCHAR(100), -- e.g., "Cambridge", "Oxford"
    degree_program VARCHAR(100), -- e.g., "LLB", "JD"
    year_of_study INTEGER,
    verification_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'verified', 'suspended'
    verification_documents TEXT[], -- Array of document references
    
    -- Specialization
    specializations TEXT[], -- e.g., ['banking', 'consumer', 'investment']
    expertise_areas TEXT[],
    languages TEXT[] DEFAULT ARRAY['English'],
    
    -- Activity and performance
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_active TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    active_hours VARCHAR(50), -- "9:00-17:00"
    timezone VARCHAR(50) DEFAULT 'Europe/London',
    
    -- Moderation statistics
    posts_reviewed INTEGER DEFAULT 0,
    reports_handled INTEGER DEFAULT 0,
    responses_given INTEGER DEFAULT 0,
    helpfulness_rating DECIMAL(3,2) DEFAULT 0,
    
    -- Professional oversight
    oversight_level INTEGER DEFAULT 1, -- 1-3, higher = more oversight required
    requires_review BOOLEAN DEFAULT true,
    mentor_moderator_id UUID REFERENCES moderators(id)
);

-- Professional oversight table
CREATE TABLE professional_oversight (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    qualification VARCHAR(200) NOT NULL, -- e.g., "LLM, Solicitor (England & Wales)"
    registration_number VARCHAR(100), -- SRA number, etc.
    specialization TEXT[],
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    
    -- Oversight activity
    moderators_supervised INTEGER DEFAULT 0,
    cases_reviewed INTEGER DEFAULT 0,
    last_review TIMESTAMP WITH TIME ZONE,
    
    -- Contact information (encrypted)
    contact_info JSONB -- Encrypted contact details
);

-- Moderation actions log
CREATE TABLE moderation_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id UUID NOT NULL,
    content_type content_type NOT NULL,
    moderator_id UUID REFERENCES moderators(id),
    
    -- Action details
    action_type VARCHAR(50) NOT NULL, -- 'approve', 'flag', 'edit', 'delete', 'warn'
    reason VARCHAR(200),
    notes TEXT,
    
    -- Before/after content for edits
    content_before TEXT,
    content_after TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Professional review
    requires_oversight BOOLEAN DEFAULT false,
    reviewed_by_professional UUID REFERENCES professional_oversight(id),
    professional_approved BOOLEAN,
    professional_notes TEXT
);

-- Forum notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES anonymous_sessions(id),
    
    -- Notification details
    type VARCHAR(50) NOT NULL, -- 'new_reply', 'post_liked', 'mention', 'moderation'
    title VARCHAR(200) NOT NULL,
    message TEXT,
    related_content_id UUID,
    related_content_type content_type,
    
    -- Notification state
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP WITH TIME ZONE,
    is_read BOOLEAN DEFAULT false,
    
    -- Notification settings
    priority INTEGER DEFAULT 1, -- 1-3
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Forum statistics table
CREATE TABLE forum_statistics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date_recorded DATE DEFAULT CURRENT_DATE,
    
    -- Daily metrics
    posts_created INTEGER DEFAULT 0,
    replies_created INTEGER DEFAULT 0,
    active_sessions INTEGER DEFAULT 0,
    new_sessions INTEGER DEFAULT 0,
    
    -- Moderation metrics
    posts_moderated INTEGER DEFAULT 0,
    reports_filed INTEGER DEFAULT 0,
    reports_resolved INTEGER DEFAULT 0,
    
    -- Engagement metrics
    total_likes INTEGER DEFAULT 0,
    total_views INTEGER DEFAULT 0,
    avg_response_time INTERVAL,
    
    -- Category breakdown
    category_stats JSONB, -- JSON object with category-specific stats
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(date_recorded)
);

-- Educational compliance tracking
CREATE TABLE compliance_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id UUID NOT NULL,
    content_type content_type NOT NULL,
    
    -- Compliance check details
    check_type VARCHAR(50) NOT NULL, -- 'privacy', 'legal_advice', 'educational'
    result VARCHAR(20) NOT NULL, -- 'pass', 'fail', 'warning'
    confidence_score DECIMAL(3,2), -- 0.0 to 1.0
    
    -- Issue details
    issues_found TEXT[],
    suggestions TEXT[],
    auto_corrected BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Review tracking
    human_reviewed BOOLEAN DEFAULT false,
    human_reviewer_id UUID,
    human_review_result VARCHAR(20)
);

-- Indexes for performance

-- Posts table indexes
CREATE INDEX idx_posts_category_created ON posts(category_id, created_at DESC);
CREATE INDEX idx_posts_author_created ON posts(author_session_id, created_at DESC);
CREATE INDEX idx_posts_status_moderation ON posts(status, moderation_status);
CREATE INDEX idx_posts_search ON posts USING gin(search_vector);
CREATE INDEX idx_posts_tags ON posts USING gin(tags);
CREATE INDEX idx_posts_last_activity ON posts(last_activity DESC);

-- Replies table indexes
CREATE INDEX idx_replies_post_created ON post_replies(post_id, created_at);
CREATE INDEX idx_replies_author ON post_replies(author_session_id);
CREATE INDEX idx_replies_parent ON post_replies(parent_reply_id);
CREATE INDEX idx_replies_search ON post_replies USING gin(search_vector);

-- Other performance indexes
CREATE INDEX idx_sessions_token ON anonymous_sessions(session_token);
CREATE INDEX idx_sessions_active ON anonymous_sessions(last_active) WHERE is_active = true;
CREATE INDEX idx_likes_session_content ON user_likes(session_id, content_type);
CREATE INDEX idx_reports_status_priority ON content_reports(status, priority_score DESC);
CREATE INDEX idx_moderation_actions_content ON moderation_actions(content_id, content_type);
CREATE INDEX idx_notifications_session_unread ON notifications(session_id, is_read, created_at DESC);

-- Triggers for updating search vectors
CREATE FUNCTION update_post_search_vector() RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := to_tsvector('english', COALESCE(NEW.title, '') || ' ' || COALESCE(NEW.content, ''));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_post_search_vector_trigger
    BEFORE INSERT OR UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_post_search_vector();

CREATE FUNCTION update_reply_search_vector() RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := to_tsvector('english', COALESCE(NEW.content, ''));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_reply_search_vector_trigger
    BEFORE INSERT OR UPDATE ON post_replies
    FOR EACH ROW EXECUTE FUNCTION update_reply_search_vector();

-- Function to update post reply count
CREATE FUNCTION update_post_reply_count() RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE posts SET reply_count = reply_count + 1, last_activity = CURRENT_TIMESTAMP WHERE id = NEW.post_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE posts SET reply_count = reply_count - 1, last_activity = CURRENT_TIMESTAMP WHERE id = OLD.post_id;
        RETURN OLD;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_post_reply_count_trigger
    AFTER INSERT OR DELETE ON post_replies
    FOR EACH ROW EXECUTE FUNCTION update_post_reply_count();

-- Function to update category post count
CREATE FUNCTION update_category_post_count() RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE categories SET post_count = post_count + 1 WHERE id = NEW.category_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE categories SET post_count = post_count - 1 WHERE id = OLD.category_id;
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' AND OLD.category_id != NEW.category_id THEN
        UPDATE categories SET post_count = post_count - 1 WHERE id = OLD.category_id;
        UPDATE categories SET post_count = post_count + 1 WHERE id = NEW.category_id;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_category_post_count_trigger
    AFTER INSERT OR DELETE OR UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_category_post_count();

-- Initial category data
INSERT INTO categories (id, name, description, icon, color, requires_moderation) VALUES
('banking', 'Banking Issues', 'Overdraft charges, account problems, banking disputes', 'fas fa-university', 'blue', false),
('payments', 'Payment Problems', 'Card disputes, transaction issues, payment failures', 'fas fa-credit-card', 'green', false),
('ppi', 'PPI Claims', 'Payment protection insurance experiences and guidance', 'fas fa-shield-alt', 'purple', true),
('investment', 'Investment Issues', 'Investment advice complaints, pension issues', 'fas fa-chart-line', 'orange', true),
('mortgage', 'Mortgage Help', 'Mortgage applications, payment difficulties, advice complaints', 'fas fa-home', 'red', false),
('success', 'Success Stories', 'Share your positive outcomes and experiences', 'fas fa-trophy', 'yellow', false);

-- Views for common queries

-- Active forum summary view
CREATE VIEW forum_summary AS
SELECT 
    c.id as category_id,
    c.name as category_name,
    c.post_count,
    COUNT(p.id) FILTER (WHERE p.created_at >= CURRENT_DATE) as posts_today,
    COUNT(pr.id) FILTER (WHERE pr.created_at >= CURRENT_DATE) as replies_today,
    MAX(p.last_activity) as last_activity
FROM categories c
LEFT JOIN posts p ON c.id = p.category_id AND p.status = 'published'
LEFT JOIN post_replies pr ON p.id = pr.post_id AND pr.status = 'published'
GROUP BY c.id, c.name, c.post_count;

-- Moderation queue view
CREATE VIEW moderation_queue AS
SELECT 
    cr.id,
    cr.content_id,
    cr.content_type,
    cr.reason,
    cr.priority_score,
    cr.created_at,
    CASE 
        WHEN cr.content_type = 'post' THEN p.title
        WHEN cr.content_type = 'reply' THEN SUBSTRING(pr.content, 1, 100) || '...'
    END as content_preview,
    cr.status
FROM content_reports cr
LEFT JOIN posts p ON cr.content_id = p.id AND cr.content_type = 'post'
LEFT JOIN post_replies pr ON cr.content_id = pr.id AND cr.content_type = 'reply'
WHERE cr.status = 'pending'
ORDER BY cr.priority_score DESC, cr.created_at ASC;

-- Educational compliance summary view
CREATE VIEW compliance_summary AS
SELECT 
    DATE_TRUNC('day', created_at) as date,
    check_type,
    result,
    COUNT(*) as check_count,
    AVG(confidence_score) as avg_confidence
FROM compliance_log
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', created_at), check_type, result
ORDER BY date DESC;

-- Database maintenance procedures

-- Procedure to clean up old anonymous sessions
CREATE OR REPLACE FUNCTION cleanup_old_sessions() RETURNS void AS $$
BEGIN
    -- Delete sessions older than 30 days with no activity
    DELETE FROM anonymous_sessions 
    WHERE last_active < CURRENT_TIMESTAMP - INTERVAL '30 days' 
    AND post_count = 0;
    
    -- Mark inactive sessions as inactive
    UPDATE anonymous_sessions 
    SET is_active = false 
    WHERE last_active < CURRENT_TIMESTAMP - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- Procedure to update daily statistics
CREATE OR REPLACE FUNCTION update_daily_statistics() RETURNS void AS $$
BEGIN
    INSERT INTO forum_statistics (
        date_recorded,
        posts_created,
        replies_created,
        active_sessions,
        new_sessions,
        posts_moderated,
        reports_filed,
        reports_resolved
    )
    SELECT 
        CURRENT_DATE,
        COUNT(p.id) FILTER (WHERE p.created_at >= CURRENT_DATE),
        COUNT(pr.id) FILTER (WHERE pr.created_at >= CURRENT_DATE),
        COUNT(DISTINCT s.id) FILTER (WHERE s.last_active >= CURRENT_DATE),
        COUNT(s.id) FILTER (WHERE s.created_at >= CURRENT_DATE),
        COUNT(ma.id) FILTER (WHERE ma.created_at >= CURRENT_DATE),
        COUNT(cr.id) FILTER (WHERE cr.created_at >= CURRENT_DATE),
        COUNT(cr.id) FILTER (WHERE cr.resolved_at >= CURRENT_DATE)
    FROM posts p
    FULL OUTER JOIN post_replies pr ON 1=1
    FULL OUTER JOIN anonymous_sessions s ON 1=1
    FULL OUTER JOIN moderation_actions ma ON 1=1
    FULL OUTER JOIN content_reports cr ON 1=1
    ON CONFLICT (date_recorded) DO UPDATE SET
        posts_created = EXCLUDED.posts_created,
        replies_created = EXCLUDED.replies_created,
        active_sessions = EXCLUDED.active_sessions,
        new_sessions = EXCLUDED.new_sessions,
        posts_moderated = EXCLUDED.posts_moderated,
        reports_filed = EXCLUDED.reports_filed,
        reports_resolved = EXCLUDED.reports_resolved;
END;
$$ LANGUAGE plpgsql;

-- Set up automated maintenance (requires pg_cron extension)
-- SELECT cron.schedule('cleanup-sessions', '0 2 * * *', 'SELECT cleanup_old_sessions();');
-- SELECT cron.schedule('daily-stats', '0 1 * * *', 'SELECT update_daily_statistics();');

COMMENT ON DATABASE CURRENT_DATABASE() IS 'JuriBank Community Forum Database - Anonymous peer support platform with educational compliance';