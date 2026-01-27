-- =====================================================
-- MEISJES VAN DE WIJN - REWARDS SYSTEEM
-- Supabase Database Schema - PRODUCTIE
-- =====================================================
-- 
-- INSTRUCTIES:
-- 1. Ga naar supabase.com en maak een nieuw project
-- 2. Ga naar SQL Editor
-- 3. Plak dit HELE bestand
-- 4. Klik "Run"
-- 5. Done!
--
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. USERS TABLE (koppelt aan Supabase Auth)
-- =====================================================
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'Sommelier' CHECK (role IN ('Founder', 'Head Sommelier', 'Sommelier', 'Junior Sommelier', 'Eventcoördinator', 'Stagiair', 'Marketing')),
    is_admin BOOLEAN DEFAULT FALSE,
    points INTEGER DEFAULT 0 CHECK (points >= 0),
    avatar TEXT DEFAULT '👤',
    streak INTEGER DEFAULT 0,
    milestones TEXT[] DEFAULT '{}',
    last_active DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_points ON public.profiles(points DESC);

-- =====================================================
-- 2. POINT ACTIONS (configureerbaar door admin)
-- =====================================================
CREATE TABLE public.point_actions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    points INTEGER NOT NULL CHECK (points > 0),
    emoji TEXT DEFAULT '⭐',
    category TEXT DEFAULT 'regular' CHECK (category IN ('regular', 'social', 'high_value', 'ambassador')),
    is_self_claimable BOOLEAN DEFAULT FALSE,
    monthly_limit INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Default actions
INSERT INTO public.point_actions (id, name, points, emoji, category, is_self_claimable, monthly_limit) VALUES
    ('shift', 'Gewerkte shift', 20, '👔', 'regular', FALSE, NULL),
    ('lastminute', 'Last-minute shift', 25, '⚡', 'regular', FALSE, NULL),
    ('training', 'Training bijgewoond', 10, '📚', 'regular', FALSE, NULL),
    ('training_given', 'Training gegeven', 30, '🎓', 'regular', FALSE, NULL),
    ('borrel', 'Teamavond / borrel', 5, '🎉', 'regular', FALSE, NULL),
    ('feedback', 'Waardevolle feedback', 15, '💡', 'regular', FALSE, NULL),
    ('social_like', 'Social media like/comment', 5, '👍', 'social', TRUE, NULL),
    ('social_story', 'Story met @MvdW tag', 10, '📱', 'social', TRUE, 4),
    ('social_post', 'Feed post over MvdW', 20, '📸', 'social', TRUE, 2),
    ('content_video', 'Video voor socials', 100, '🎬', 'high_value', FALSE, 1),
    ('new_client', 'Nieuwe klant aangebracht', 1000, '🤝', 'high_value', FALSE, NULL),
    ('new_colleague', 'Nieuwe collega aangedragen', 100, '👥', 'ambassador', FALSE, NULL),
    ('peer_recognition', 'Waardering van collega', 20, '❤️', 'regular', FALSE, NULL);

-- =====================================================
-- 3. ACTIVITIES LOG (punten geschiedenis)
-- =====================================================
CREATE TABLE public.activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    action_id TEXT REFERENCES public.point_actions(id),
    action_name TEXT NOT NULL,
    points INTEGER NOT NULL,
    is_high_value BOOLEAN DEFAULT FALSE,
    source TEXT DEFAULT 'admin' CHECK (source IN ('admin', 'self', 'peer', 'system', 'referral', 'content')),
    note TEXT,
    added_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_activities_user ON public.activities(user_id);
CREATE INDEX idx_activities_date ON public.activities(created_at DESC);
CREATE INDEX idx_activities_high_value ON public.activities(is_high_value) WHERE is_high_value = TRUE;

-- =====================================================
-- 4. REWARDS (shop items)
-- =====================================================
CREATE TABLE public.rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    points INTEGER NOT NULL CHECK (points > 0),
    category TEXT DEFAULT 'klein' CHECK (category IN ('klein', 'middel', 'groot', 'wijnreis')),
    emoji TEXT DEFAULT '🎁',
    image_url TEXT,
    stock INTEGER,
    is_popular BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Default rewards
INSERT INTO public.rewards (name, description, points, category, emoji, is_popular, sort_order) VALUES
    ('Fles huiswijn', 'Kies een fles uit ons assortiment', 50, 'klein', '🍷', FALSE, 1),
    ('Wijn accessoire set', 'Kurkentrekker, schenktuit en stopper', 75, 'klein', '🎁', FALSE, 2),
    ('Luxe chocoladepakket', 'Ambachtelijke bonbons met wijnvulling', 100, 'klein', '🍫', TRUE, 3),
    ('MvdW Hoodie', 'Comfy hoodie met ons logo', 150, 'middel', '👕', TRUE, 4),
    ('Wijnworkshop voor 2', 'Privé proeverij met sommelier', 250, 'middel', '🥂', FALSE, 5),
    ('Restaurant bon €50', 'Uit eten bij partner restaurant', 300, 'middel', '🍽️', FALSE, 6),
    ('Premium wijndoos (3)', 'Drie premium wijnen naar keuze', 400, 'groot', '📦', FALSE, 7),
    ('Wijn klimaatkast', 'Compacte wijnkoeler voor 8 flessen', 500, 'groot', '🧊', TRUE, 8),
    ('Luxe wijnpakket (6)', 'Zes premium wijnen door sommeliers', 750, 'groot', '🏆', FALSE, 9),
    ('Dinerbon €100', 'Fine dining experience voor twee', 1000, 'groot', '⭐', FALSE, 10),
    ('Wijnreis Spanje', '3-daagse reis naar Rioja', 2000, 'wijnreis', '🇪🇸', FALSE, 11),
    ('Wijnreis Frankrijk', '4-daagse reis door Bourgogne', 2500, 'wijnreis', '🇫🇷', FALSE, 12),
    ('Wijnreis Italië', '5-daagse reis door Toscane', 3000, 'wijnreis', '🇮🇹', FALSE, 13);

-- =====================================================
-- 5. CLAIMS (reward requests)
-- =====================================================
CREATE TABLE public.claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reward_id UUID NOT NULL REFERENCES public.rewards(id),
    points_cost INTEGER NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'delivered')),
    admin_note TEXT,
    processed_by UUID REFERENCES public.profiles(id),
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_claims_user ON public.claims(user_id);
CREATE INDEX idx_claims_status ON public.claims(status);

-- =====================================================
-- 6. RECOGNITIONS (peer waardering)
-- =====================================================
CREATE TABLE public.recognitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    to_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    points INTEGER DEFAULT 20,
    quarter TEXT NOT NULL,
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT no_self_recognition CHECK (from_user_id != to_user_id),
    CONSTRAINT one_per_quarter UNIQUE (from_user_id, quarter)
);

CREATE INDEX idx_recognitions_to ON public.recognitions(to_user_id);

-- =====================================================
-- 7. CONTENT SUBMISSIONS (high-value content)
-- =====================================================
CREATE TABLE public.content_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    content_url TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    points_awarded INTEGER DEFAULT 100,
    admin_note TEXT,
    processed_by UUID REFERENCES public.profiles(id),
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_content_status ON public.content_submissions(status);

-- =====================================================
-- 8. REFERRALS (collega referrals)
-- =====================================================
CREATE TABLE public.referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referrer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    colleague_name TEXT NOT NULL,
    colleague_contact TEXT,
    status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'hired', 'active', 'completed', 'rejected')),
    shifts_worked INTEGER DEFAULT 0,
    shifts_required INTEGER DEFAULT 3,
    points_awarded INTEGER DEFAULT 100,
    hired_user_id UUID REFERENCES public.profiles(id),
    admin_note TEXT,
    processed_by UUID REFERENCES public.profiles(id),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_referrals_referrer ON public.referrals(referrer_id);
CREATE INDEX idx_referrals_status ON public.referrals(status);

-- =====================================================
-- 9. WISHLIST
-- =====================================================
CREATE TABLE public.wishlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reward_id UUID NOT NULL REFERENCES public.rewards(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_wishlist_item UNIQUE (user_id, reward_id)
);

-- =====================================================
-- 10. NOTIFICATIONS
-- =====================================================
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT DEFAULT 'info' CHECK (type IN ('points', 'milestone', 'recognition', 'claim', 'info')),
    title TEXT NOT NULL,
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_unread ON public.notifications(user_id, is_read) WHERE is_read = FALSE;

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update user points after activity
CREATE OR REPLACE FUNCTION public.update_user_points()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.profiles SET 
            points = points + NEW.points,
            updated_at = NOW()
        WHERE id = NEW.user_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.profiles SET 
            points = GREATEST(0, points - OLD.points),
            updated_at = NOW()
        WHERE id = OLD.user_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for activities
DROP TRIGGER IF EXISTS trigger_update_points ON public.activities;
CREATE TRIGGER trigger_update_points
    AFTER INSERT OR DELETE ON public.activities
    FOR EACH ROW EXECUTE FUNCTION public.update_user_points();

-- Function to deduct points on approved claim
CREATE OR REPLACE FUNCTION public.process_claim_approval()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'approved' AND OLD.status = 'pending' THEN
        UPDATE public.profiles SET 
            points = GREATEST(0, points - NEW.points_cost),
            updated_at = NOW()
        WHERE id = NEW.user_id;
        
        NEW.processed_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for claims
DROP TRIGGER IF EXISTS trigger_process_claim ON public.claims;
CREATE TRIGGER trigger_process_claim
    BEFORE UPDATE ON public.claims
    FOR EACH ROW EXECUTE FUNCTION public.process_claim_approval();

-- Function to get current quarter
CREATE OR REPLACE FUNCTION public.get_current_quarter()
RETURNS TEXT AS $$
BEGIN
    RETURN 'Q' || CEIL(EXTRACT(MONTH FROM NOW()) / 3.0)::INTEGER || '-' || EXTRACT(YEAR FROM NOW())::INTEGER;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recognitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.point_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: iedereen kan lezen, eigen profiel updaten
CREATE POLICY "Profiles viewable by authenticated users" ON public.profiles
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Activities: eigen zien, admins alles
CREATE POLICY "Users can view own activities" ON public.activities
    FOR SELECT USING (
        user_id = auth.uid() OR 
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

CREATE POLICY "Users can insert own activities" ON public.activities
    FOR INSERT WITH CHECK (user_id = auth.uid() OR added_by = auth.uid());

-- Admins can insert activities for anyone
CREATE POLICY "Admins can insert any activity" ON public.activities
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- Claims
CREATE POLICY "Users can view own claims" ON public.claims
    FOR SELECT USING (
        user_id = auth.uid() OR 
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

CREATE POLICY "Users can insert own claims" ON public.claims
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can update claims" ON public.claims
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- Rewards: iedereen kan lezen
CREATE POLICY "Rewards viewable by all" ON public.rewards
    FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage rewards" ON public.rewards
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- Point actions: iedereen kan lezen
CREATE POLICY "Point actions viewable by all" ON public.point_actions
    FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage point actions" ON public.point_actions
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- Wishlist
CREATE POLICY "Users manage own wishlist" ON public.wishlist
    FOR ALL USING (user_id = auth.uid());

-- Recognitions
CREATE POLICY "Recognitions viewable by all authenticated" ON public.recognitions
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can give recognition" ON public.recognitions
    FOR INSERT WITH CHECK (from_user_id = auth.uid());

-- Content submissions
CREATE POLICY "Users can view own content" ON public.content_submissions
    FOR SELECT USING (
        user_id = auth.uid() OR 
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

CREATE POLICY "Users can submit content" ON public.content_submissions
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can update content" ON public.content_submissions
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- Referrals
CREATE POLICY "Users can view own referrals" ON public.referrals
    FOR SELECT USING (
        referrer_id = auth.uid() OR 
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

CREATE POLICY "Users can submit referrals" ON public.referrals
    FOR INSERT WITH CHECK (referrer_id = auth.uid());

CREATE POLICY "Admins can update referrals" ON public.referrals
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- Notifications
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "System can insert notifications" ON public.notifications
    FOR INSERT WITH CHECK (TRUE);

-- =====================================================
-- ADMIN FULL ACCESS
-- =====================================================

CREATE POLICY "Admins full access profiles" ON public.profiles
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

CREATE POLICY "Admins full access activities" ON public.activities
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- =====================================================
-- VIEWS
-- =====================================================

-- Leaderboard view
CREATE OR REPLACE VIEW public.leaderboard AS
SELECT 
    p.id,
    p.name,
    p.role,
    p.points,
    p.avatar,
    p.streak,
    p.milestones,
    COALESCE(hv.high_value_count, 0) as high_value_count,
    RANK() OVER (ORDER BY p.points DESC) as rank
FROM public.profiles p
LEFT JOIN (
    SELECT user_id, COUNT(*) as high_value_count
    FROM public.activities
    WHERE is_high_value = TRUE
    GROUP BY user_id
) hv ON hv.user_id = p.id
ORDER BY p.points DESC;

-- =====================================================
-- DONE!
-- =====================================================
