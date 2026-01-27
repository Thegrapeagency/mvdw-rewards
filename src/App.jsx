// =====================================================
// MEISJES VAN DE WIJN - REWARDS SYSTEEM
// VERSIE 4 - MvdW Huisstijl
// =====================================================

import React, { useState, useEffect, createContext, useContext } from 'react';
import { createClient } from '@supabase/supabase-js';

// =====================================================
// SUPABASE CLIENT
// =====================================================
const supabaseUrl = 'https://chhpryjlxbwgzjlswhch.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoaHByeWpseGJ3Z3pqbHN3aGNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0MjE4NjYsImV4cCI6MjA4NDk5Nzg2Nn0.7QAgMuTLCGUfAq-N4ha0N1zvKVN-If286JvAA3Jc_9Q';
const supabase = createClient(supabaseUrl, supabaseKey);

// =====================================================
// KLEUREN - MvdW Huisstijl
// =====================================================
const COLORS = {
  darkBlue: '#1a2744',
  mediumBlue: '#2a3a5c',
  lightBlue: '#3d5a80',
  white: '#ffffff',
  lightGrey: '#f5f5f5',
  mediumGrey: '#e0e0e0',
  darkGrey: '#6b7280',
  accent: '#c9a962', // goud accent
  success: '#22c55e',
  error: '#ef4444',
  warning: '#f59e0b',
};

// =====================================================
// SOCIAL MEDIA LINKS
// =====================================================
const SOCIAL_LINKS = {
  instagram: 'https://instagram.com/meisjesvanwijn',
  linkedin: 'https://linkedin.com/company/meisjes-van-de-wijn',
  tiktok: 'https://tiktok.com/@meisjesvanwijn',
};

// =====================================================
// MANIEREN OM DRUIFJES TE VERDIENEN
// =====================================================
const EARN_METHODS = [
  { 
    id: 'shift', 
    name: 'Dienst werken', 
    points: 10, 
    description: 'Per gewerkte dienst ontvang je 10 kurken',
    category: 'werk'
  },
  { 
    id: 'lastminute', 
    name: 'Last-minute dienst', 
    points: 25, 
    description: 'Spring je last-minute in? Dan krijg je 25 kurken extra!',
    category: 'werk'
  },
  { 
    id: 'training-attend', 
    name: 'Training bijwonen', 
    points: 15, 
    description: 'Volg een training en ontvang 15 kurken',
    category: 'ontwikkeling'
  },
  { 
    id: 'training-give', 
    name: 'Training geven', 
    points: 50, 
    description: 'Geef je zelf een training? 50 kurken!',
    category: 'ontwikkeling'
  },
  { 
    id: 'feedback', 
    name: 'Feedback geven', 
    points: 10, 
    description: 'Constructieve feedback helpt ons groeien',
    category: 'team'
  },
  { 
    id: 'referral', 
    name: 'Collega aandragen', 
    points: 100, 
    description: 'Draag een nieuwe collega aan die minimaal 3 diensten werkt',
    category: 'team'
  },
  { 
    id: 'social-like', 
    name: 'Social media interactie', 
    points: 5, 
    description: 'Like of reageer op onze posts',
    category: 'social'
  },
  { 
    id: 'social-story', 
    name: 'Story delen', 
    points: 10, 
    description: 'Deel een story met @meisjesvanwijn tag',
    category: 'social'
  },
  { 
    id: 'social-post', 
    name: 'Post plaatsen', 
    points: 20, 
    description: 'Plaats een post over MvdW op je feed',
    category: 'social'
  },
  { 
    id: 'social-video', 
    name: 'Video content', 
    points: 100, 
    description: 'Maak video content voor onze socials',
    category: 'social',
    highValue: true
  },
];

// =====================================================
// LOGO URLS
// =====================================================
const LOGO_BEELDMERK = 'https://i.imgur.com/UROTKyl.png';
const LOGO_WOORDMERK = 'https://i.imgur.com/Fclvpag.png';

// =====================================================
// LOGO COMPONENT
// =====================================================
function MvdWLogo({ size = 60, variant = 'beeldmerk' }) {
  const src = variant === 'woordmerk' ? LOGO_WOORDMERK : LOGO_BEELDMERK;
  return (
    <img 
      src={src} 
      alt="Meisjes van de Wijn" 
      style={{ 
        width: size, 
        height: variant === 'woordmerk' ? 'auto' : size,
        objectFit: 'contain'
      }} 
    />
  );
}

// =====================================================
// CONTEXT
// =====================================================
const AppContext = createContext();
const useApp = () => useContext(AppContext);

// =====================================================
// APP PROVIDER
// =====================================================
function AppProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) fetchProfile(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) fetchProfile(session.user.id);
      else { setProfile(null); setLoading(false); }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (error) throw error;
      setProfile(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = () => session?.user && fetchProfile(session.user.id);

  const signIn = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email, password, name) => {
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { name } }
    });
    if (error) throw error;
  };

  const signOut = () => supabase.auth.signOut();

  return (
    <AppContext.Provider value={{ session, profile, loading, error, supabase, signIn, signUp, signOut, refreshProfile }}>
      {children}
    </AppContext.Provider>
  );
}

// =====================================================
// HOOKS
// =====================================================
function useProfiles() {
  const [profiles, setProfiles] = useState([]);
  const { supabase } = useApp();

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('profiles').select('*').order('points', { ascending: false });
      setProfiles(data || []);
    };
    fetch();
    
    const sub = supabase.channel('profiles').on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, fetch).subscribe();
    return () => sub.unsubscribe();
  }, []);

  return { profiles };
}

function useRewards() {
  const [rewards, setRewards] = useState([]);
  const { supabase } = useApp();

  const fetch = async () => {
    const { data } = await supabase.from('rewards').select('*').order('points', { ascending: true });
    setRewards(data || []);
  };

  useEffect(() => {
    fetch();
    const sub = supabase.channel('rewards').on('postgres_changes', { event: '*', schema: 'public', table: 'rewards' }, fetch).subscribe();
    return () => sub.unsubscribe();
  }, []);

  const addReward = async (reward) => {
    const { error } = await supabase.from('rewards').insert(reward);
    if (!error) fetch();
    return !error;
  };

  const updateReward = async (id, updates) => {
    const { error } = await supabase.from('rewards').update(updates).eq('id', id);
    if (!error) fetch();
    return !error;
  };

  const deleteReward = async (id) => {
    const { error } = await supabase.from('rewards').delete().eq('id', id);
    if (!error) fetch();
    return !error;
  };

  return { rewards, addReward, updateReward, deleteReward, refetch: fetch };
}

function useActivities(userId) {
  const [activities, setActivities] = useState([]);
  const { supabase, profile } = useApp();

  useEffect(() => {
    const fetch = async () => {
      let query = supabase.from('activities').select('*').order('created_at', { ascending: false }).limit(100);
      if (userId) query = query.eq('user_id', userId);
      else if (profile && !profile.is_admin) query = query.eq('user_id', profile.id);
      const { data } = await query;
      setActivities(data || []);
    };
    if (profile) fetch();
    
    const sub = supabase.channel('activities').on('postgres_changes', { event: '*', schema: 'public', table: 'activities' }, fetch).subscribe();
    return () => sub.unsubscribe();
  }, [profile, userId]);

  return { activities };
}

function useSocialClaims() {
  const [claims, setClaims] = useState([]);
  const { supabase, profile } = useApp();

  useEffect(() => {
    const fetch = async () => {
      let query = supabase
        .from('content_submissions')
        .select('*, user:profiles!content_submissions_user_id_fkey(name, avatar)')
        .order('created_at', { ascending: false });
      
      if (profile && !profile.is_admin) {
        query = query.eq('user_id', profile.id);
      }
      
      const { data } = await query;
      setClaims(data || []);
    };
    if (profile) fetch();
    
    const sub = supabase.channel('social-claims').on('postgres_changes', { event: '*', schema: 'public', table: 'content_submissions' }, fetch).subscribe();
    return () => sub.unsubscribe();
  }, [profile]);

  const submitClaim = async (type, description, points) => {
    const { error } = await supabase.from('content_submissions').insert({
      user_id: profile.id,
      description: `[${type}] ${description}`,
      points_awarded: points,
      status: 'pending'
    });
    return !error;
  };

  const approveClaim = async (claimId, points) => {
    const claim = claims.find(c => c.id === claimId);
    if (!claim) return false;

    await supabase.from('content_submissions').update({ 
      status: 'approved',
      processed_by: profile.id,
      processed_at: new Date().toISOString()
    }).eq('id', claimId);

    await supabase.from('activities').insert({
      user_id: claim.user_id,
      action_name: claim.description,
      points: points,
      is_high_value: points >= 50,
      source: 'admin',
      added_by: profile.id
    });

    await supabase.from('notifications').insert({
      user_id: claim.user_id,
      type: 'points',
      title: `+${points} kurken goedgekeurd!`,
      message: claim.description
    });

    return true;
  };

  const rejectClaim = async (claimId) => {
    await supabase.from('content_submissions').update({ 
      status: 'rejected',
      processed_by: profile.id,
      processed_at: new Date().toISOString()
    }).eq('id', claimId);
    return true;
  };

  return { claims, submitClaim, approveClaim, rejectClaim };
}

function useRewardClaims() {
  const [claims, setClaims] = useState([]);
  const { supabase, profile } = useApp();

  useEffect(() => {
    const fetch = async () => {
      let query = supabase
        .from('claims')
        .select('*, user:profiles!claims_user_id_fkey(name, avatar)')
        .order('created_at', { ascending: false });
      
      if (profile && !profile.is_admin) query = query.eq('user_id', profile.id);
      const { data } = await query;
      setClaims(data || []);
    };
    if (profile) fetch();
    
    const sub = supabase.channel('reward-claims').on('postgres_changes', { event: '*', schema: 'public', table: 'claims' }, fetch).subscribe();
    return () => sub.unsubscribe();
  }, [profile]);

  const createClaim = async (rewardId, rewardName, pointsCost) => {
    const { error } = await supabase.from('claims').insert({
      user_id: profile.id,
      reward_id: rewardId,
      points_cost: pointsCost,
      status: 'pending'
    });
    
    if (!error) {
      await supabase.from('notifications').insert({
        user_id: profile.id,
        type: 'claim',
        title: 'Claim ingediend!',
        message: `Je hebt ${rewardName} aangevraagd voor ${pointsCost} kurken`
      });
    }
    
    return !error;
  };

  const updateClaim = async (claimId, status, rewardName) => {
    const claim = claims.find(c => c.id === claimId);
    
    await supabase.from('claims').update({ 
      status,
      processed_by: profile.id,
      processed_at: new Date().toISOString()
    }).eq('id', claimId);

    if (status === 'approved' && claim) {
      await supabase.from('notifications').insert({
        user_id: claim.user_id,
        type: 'claim',
        title: 'Beloning goedgekeurd!',
        message: `Je ${rewardName || 'beloning'} is goedgekeurd en wordt geregeld!`
      });
    }

    return true;
  };

  return { claims, createClaim, updateClaim };
}

function useReferrals() {
  const [referrals, setReferrals] = useState([]);
  const { supabase, profile } = useApp();

  useEffect(() => {
    const fetch = async () => {
      let query = supabase
        .from('referrals')
        .select('*, referrer:profiles!referrals_referrer_id_fkey(name, avatar)')
        .order('created_at', { ascending: false });
      
      if (profile && !profile.is_admin) query = query.eq('referrer_id', profile.id);
      const { data } = await query;
      setReferrals(data || []);
    };
    if (profile) fetch();
    
    const sub = supabase.channel('referrals').on('postgres_changes', { event: '*', schema: 'public', table: 'referrals' }, fetch).subscribe();
    return () => sub.unsubscribe();
  }, [profile]);

  const submitReferral = async (name, contact) => {
    const { error } = await supabase.from('referrals').insert({
      referrer_id: profile.id,
      colleague_name: name,
      colleague_contact: contact
    });
    return !error;
  };

  const updateReferral = async (id, updates) => {
    await supabase.from('referrals').update(updates).eq('id', id);
    return true;
  };

  const completeReferral = async (referral) => {
    await supabase.from('referrals').update({ 
      status: 'completed',
      completed_at: new Date().toISOString()
    }).eq('id', referral.id);

    await supabase.from('activities').insert({
      user_id: referral.referrer_id,
      action_name: `Collega aangedragen: ${referral.colleague_name}`,
      points: 100,
      is_high_value: true,
      source: 'referral',
      added_by: profile.id
    });

    await supabase.from('notifications').insert({
      user_id: referral.referrer_id,
      type: 'points',
      title: '+100 kurken!',
      message: `Referral ${referral.colleague_name} voltooid!`
    });

    return true;
  };

  return { referrals, submitReferral, updateReferral, completeReferral };
}

function useRecognitions() {
  const [recognitions, setRecognitions] = useState([]);
  const { supabase, profile } = useApp();

  useEffect(() => {
    const fetch = async () => {
      if (!profile) return;
      const { data } = await supabase
        .from('recognitions')
        .select('*')
        .or(`from_user_id.eq.${profile.id},to_user_id.eq.${profile.id}`);
      setRecognitions(data || []);
    };
    fetch();
  }, [profile]);

  // Maandelijks ipv kwartaal
  const getMonth = () => `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
  
  const canGive = () => !recognitions.find(r => r.from_user_id === profile?.id && r.quarter === getMonth());

  const give = async (toUserId, toUserName) => {
    const month = getMonth();
    
    await supabase.from('recognitions').insert({
      from_user_id: profile.id,
      to_user_id: toUserId,
      quarter: month,
      points: 20
    });

    await supabase.from('activities').insert({
      user_id: toUserId,
      action_name: `Waardering van ${profile.name}`,
      points: 20,
      source: 'peer',
      added_by: profile.id
    });

    await supabase.from('notifications').insert({
      user_id: toUserId,
      type: 'recognition',
      title: 'Je bent gewaardeerd!',
      message: `${profile.name} heeft je 20 kurken gegeven`
    });

    return true;
  };

  return { recognitions, canGive, give };
}

function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const { supabase, profile } = useApp();

  useEffect(() => {
    const fetch = async () => {
      if (!profile) return;
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(50);
      setNotifications(data || []);
    };
    fetch();
    
    const sub = supabase.channel('notifs').on('postgres_changes', { 
      event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${profile?.id}` 
    }, fetch).subscribe();
    return () => sub.unsubscribe();
  }, [profile]);

  const markRead = async () => {
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', profile.id).eq('is_read', false);
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return { notifications, unreadCount, markRead };
}

function useAdminPoints() {
  const { supabase, profile } = useApp();

  const addPoints = async (userId, actionName, points, isHighValue = false) => {
    await supabase.from('activities').insert({
      user_id: userId,
      action_name: actionName,
      points,
      is_high_value: isHighValue,
      source: 'admin',
      added_by: profile.id
    });

    await supabase.from('notifications').insert({
      user_id: userId,
      type: 'points',
      title: `+${points} kurken!`,
      message: actionName
    });

    return true;
  };

  return { addPoints };
}

// =====================================================
// AUTH SCREEN
// =====================================================
function AuthScreen() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useApp();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') await signIn(email, password);
      else await signUp(email, password, name);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div style={styles.authScreen}>
      <div style={styles.authContainer}>
        <div style={styles.authHeader}>
          <div style={styles.authLogoWrap}>
            <MvdWLogo size={80} />
          </div>
          <h1 style={styles.authTitle}>Rewards</h1>
          <p style={styles.authSubtitle}>Spaar kurken, kies beloningen</p>
        </div>

        <div style={styles.authCard}>
          <div style={styles.authTabs}>
            <button onClick={() => setMode('login')} style={mode === 'login' ? styles.authTabActive : styles.authTab}>Inloggen</button>
            <button onClick={() => setMode('signup')} style={mode === 'signup' ? styles.authTabActive : styles.authTab}>Registreren</button>
          </div>

          <form onSubmit={handleSubmit} style={styles.authForm}>
            {mode === 'signup' && (
              <input type="text" placeholder="Je naam" value={name} onChange={e => setName(e.target.value)} required style={styles.authInput} />
            )}
            <input type="email" placeholder="E-mailadres" value={email} onChange={e => setEmail(e.target.value)} required style={styles.authInput} />
            <input type="password" placeholder="Wachtwoord" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} style={styles.authInput} />
            {error && <p style={styles.authError}>{error}</p>}
            <button type="submit" disabled={loading} style={styles.authButton}>
              {loading ? 'Even geduld...' : mode === 'login' ? 'Inloggen' : 'Account aanmaken'}
            </button>
          </form>
        </div>

        {/* Social Links */}
        <div style={styles.authSocials}>
          <p style={styles.authSocialsLabel}>Volg ons</p>
          <div style={styles.authSocialLinks}>
            <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" style={styles.authSocialLink}>Instagram</a>
            <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" style={styles.authSocialLink}>LinkedIn</a>
            <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener noreferrer" style={styles.authSocialLink}>TikTok</a>
          </div>
        </div>

        <p style={styles.authTagline}>Wijn is geen zonde. Geen wijn wel.</p>
      </div>
    </div>
  );
}

// =====================================================
// EARN SECTION COMPONENT
// =====================================================
function EarnSection({ onSubmitClaim, myClaims }) {
  const [showForm, setShowForm] = useState(null);
  const [description, setDescription] = useState('');

  const socialActions = EARN_METHODS.filter(m => m.category === 'social');
  const pendingCount = (type) => myClaims?.filter(c => c.description?.includes(`[${type}]`) && c.status === 'pending').length || 0;

  const handleSubmit = async (action) => {
    if (!description.trim()) return;
    const success = await onSubmitClaim(action.id, description, action.points);
    if (success) {
      setDescription('');
      setShowForm(null);
    }
  };

  const categories = [
    { id: 'werk', title: 'Werk', icon: 'W' },
    { id: 'ontwikkeling', title: 'Ontwikkeling', icon: 'O' },
    { id: 'team', title: 'Team', icon: 'T' },
    { id: 'social', title: 'Social Media', icon: 'S' },
  ];

  return (
    <div style={styles.earnSection}>
      {/* Info banner */}
      <div style={styles.infoBanner}>
        <div style={styles.infoBannerIcon}>i</div>
        <div>
          <strong>Hoe werkt het?</strong>
          <p style={styles.infoBannerText}>
            Wij kennen eens per maand de kurken toe op basis van je gewerkte diensten, trainingen en andere activiteiten. 
            Social media claims kun je zelf indienen - wij controleren en keuren goed.
          </p>
        </div>
      </div>

      {/* Alle manieren per categorie */}
      {categories.map(cat => (
        <div key={cat.id} style={styles.earnCategory}>
          <h3 style={styles.earnCategoryTitle}>
            <span style={styles.earnCategoryIcon}>{cat.icon}</span>
            {cat.title}
          </h3>
          
          <div style={styles.earnList}>
            {EARN_METHODS.filter(m => m.category === cat.id).map(method => (
              <div key={method.id} style={method.highValue ? styles.earnItemHV : styles.earnItem}>
                {method.highValue && <span style={styles.hvBadge}>HIGH VALUE</span>}
                <div style={styles.earnItemContent}>
                  <div style={styles.earnItemHeader}>
                    <span style={styles.earnItemName}>{method.name}</span>
                    <span style={styles.earnItemPoints}>+{method.points}</span>
                  </div>
                  <p style={styles.earnItemDesc}>{method.description}</p>
                  
                  {/* Alleen social items kunnen zelf geclaimed worden */}
                  {method.category === 'social' && (
                    <>
                      {pendingCount(method.id) > 0 && (
                        <span style={styles.pendingBadge}>{pendingCount(method.id)} in review</span>
                      )}
                      
                      <button 
                        onClick={() => setShowForm(showForm === method.id ? null : method.id)} 
                        style={styles.claimSmallBtn}
                      >
                        {showForm === method.id ? 'Sluiten' : 'Aanmelden'}
                      </button>

                      {showForm === method.id && (
                        <div style={styles.claimForm}>
                          <textarea
                            placeholder="Beschrijf kort wat je hebt gedaan..."
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            style={styles.claimTextarea}
                            rows={3}
                          />
                          <button onClick={() => handleSubmit(method)} style={styles.submitBtn} disabled={!description.trim()}>
                            Versturen ter controle
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Social Links */}
      <div style={styles.socialLinksSection}>
        <h3 style={styles.sectionTitle}>Onze Socials</h3>
        <div style={styles.socialLinksGrid}>
          <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" style={styles.socialLinkCard}>
            <span style={styles.socialLinkName}>Instagram</span>
            <span style={styles.socialLinkHandle}>@meisjesvanwijn</span>
          </a>
          <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" style={styles.socialLinkCard}>
            <span style={styles.socialLinkName}>LinkedIn</span>
            <span style={styles.socialLinkHandle}>Meisjes van de Wijn</span>
          </a>
          <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener noreferrer" style={styles.socialLinkCard}>
            <span style={styles.socialLinkName}>TikTok</span>
            <span style={styles.socialLinkHandle}>@meisjesvanwijn</span>
          </a>
        </div>
      </div>
    </div>
  );
}

// =====================================================
// SHOP COMPONENT
// =====================================================
function Shop({ rewards, profile, claims, onClaim }) {
  const [selectedReward, setSelectedReward] = useState(null);
  const [claimSuccess, setClaimSuccess] = useState(false);

  const isPending = (rewardId) => claims.find(c => c.reward_id === rewardId && c.status === 'pending');
  const canAfford = (points) => profile.points >= points;

  const handleClaim = async () => {
    if (!selectedReward || !canAfford(selectedReward.points)) return;
    const success = await onClaim(selectedReward.id, selectedReward.name, selectedReward.points);
    if (success) {
      setClaimSuccess(true);
      setTimeout(() => {
        setClaimSuccess(false);
        setSelectedReward(null);
      }, 2500);
    }
  };

  const activeRewards = rewards.filter(r => r.is_active !== false);

  return (
    <div style={styles.shopContainer}>
      {/* Header */}
      <div style={styles.shopHeader}>
        <div>
          <h2 style={styles.pageTitle}>Shop</h2>
          <p style={styles.pageSubtitle}>Wissel je kurken in voor beloningen</p>
        </div>
        <div style={styles.shopBalance}>
          <span style={styles.shopBalanceLabel}>Jouw saldo</span>
          <span style={styles.shopBalanceValue}>{profile.points}</span>
          <span style={styles.shopBalanceUnit}>kurken</span>
        </div>
      </div>

      {activeRewards.length === 0 ? (
        <div style={styles.emptyState}>
          <p>Er zijn nog geen beloningen beschikbaar.</p>
          <p style={styles.emptyStateSmall}>De admin kan beloningen toevoegen via het admin panel.</p>
        </div>
      ) : (
        <div style={styles.shopGrid}>
          {activeRewards.map((reward) => {
            const affordable = canAfford(reward.points);
            const pending = isPending(reward.id);
            const progress = Math.min(100, (profile.points / reward.points) * 100);
            
            return (
              <div key={reward.id} style={styles.productCard}>
                {/* Image */}
                <div style={styles.productImageWrap}>
                  {reward.image_url ? (
                    <img src={reward.image_url} alt={reward.name} style={styles.productImage} />
                  ) : (
                    <div style={styles.productImagePlaceholder}>
                      <span style={styles.productImagePlaceholderText}>{reward.name?.charAt(0) || '?'}</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div style={styles.productInfo}>
                  <span style={styles.productCategory}>{reward.category}</span>
                  <h3 style={styles.productName}>{reward.name}</h3>
                  <p style={styles.productDesc}>{reward.description}</p>
                </div>

                {/* Price & Action */}
                <div style={styles.productFooter}>
                  <div style={styles.productPrice}>
                    <span style={styles.priceValue}>{reward.points}</span>
                    <span style={styles.priceUnit}>kurken</span>
                  </div>

                  {pending ? (
                    <div style={styles.pendingStatus}>Aangevraagd</div>
                  ) : affordable ? (
                    <button onClick={() => setSelectedReward(reward)} style={styles.claimBtn}>
                      Claim
                    </button>
                  ) : (
                    <div style={styles.needMore}>
                      Nog {reward.points - profile.points} nodig
                    </div>
                  )}
                </div>

                {/* Progress bar */}
                {!affordable && !pending && (
                  <div style={styles.progressBarWrap}>
                    <div style={{...styles.progressBarFill, width: `${progress}%`}} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Claim Modal */}
      {selectedReward && (
        <div style={styles.modalOverlay} onClick={() => !claimSuccess && setSelectedReward(null)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            {claimSuccess ? (
              <div style={styles.successAnimation}>
                <div style={styles.successIcon}>✓</div>
                <h3 style={styles.successTitle}>Aangevraagd!</h3>
                <p style={styles.successText}>We regelen je {selectedReward.name}</p>
              </div>
            ) : (
              <>
                <div style={styles.modalHeader}>
                  {selectedReward.image_url ? (
                    <img src={selectedReward.image_url} alt={selectedReward.name} style={styles.modalImage} />
                  ) : (
                    <div style={styles.modalImagePlaceholder}>{selectedReward.name?.charAt(0)}</div>
                  )}
                  <div>
                    <span style={styles.modalCategory}>{selectedReward.category}</span>
                    <h3 style={styles.modalTitle}>{selectedReward.name}</h3>
                  </div>
                </div>

                <p style={styles.modalDesc}>{selectedReward.description}</p>

                <div style={styles.modalPriceBox}>
                  <div style={styles.modalPriceRow}>
                    <span>Kosten</span>
                    <span style={styles.modalPriceValue}>{selectedReward.points} kurken</span>
                  </div>
                  <div style={styles.modalPriceRow}>
                    <span>Jouw saldo</span>
                    <span>{profile.points} kurken</span>
                  </div>
                  <div style={styles.modalDivider} />
                  <div style={styles.modalPriceRow}>
                    <span>Na claim</span>
                    <span style={{ color: COLORS.success, fontWeight: 700 }}>
                      {profile.points - selectedReward.points} kurken
                    </span>
                  </div>
                </div>

                <div style={styles.modalActions}>
                  <button onClick={() => setSelectedReward(null)} style={styles.modalCancel}>
                    Annuleren
                  </button>
                  <button onClick={handleClaim} style={styles.modalConfirm}>
                    Bevestig claim
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// =====================================================
// ADMIN PANEL COMPONENT
// =====================================================
function AdminPanel({ 
  profiles, 
  socialClaims, 
  rewardClaims, 
  referrals, 
  rewards,
  onApproveSocial, 
  onRejectSocial, 
  onApproveReward,
  onRejectReward,
  onUpdateReferral,
  onCompleteReferral,
  onAddPoints,
  onAddReward,
  onUpdateReward,
  onDeleteReward,
  refreshProfile
}) {
  const [tab, setTab] = useState('social');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedAction, setSelectedAction] = useState('');
  const [customPoints, setCustomPoints] = useState('');
  const [customAction, setCustomAction] = useState('');
  
  // Product form
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '', description: '', points: '', category: '', image_url: ''
  });

  const pendingSocial = socialClaims.filter(c => c.status === 'pending');
  const pendingRewards = rewardClaims.filter(c => c.status === 'pending');
  const pendingReferrals = referrals.filter(r => r.status !== 'completed' && r.status !== 'rejected');

  const handleAddPoints = async () => {
    if (!selectedUser || (!selectedAction && !customPoints)) return;
    
    let points, actionName;
    if (customPoints && customAction) {
      points = parseInt(customPoints);
      actionName = customAction;
    } else {
      const method = EARN_METHODS.find(m => m.id === selectedAction);
      points = method.points;
      actionName = method.name;
    }
    
    const user = profiles.find(p => p.id === selectedUser);
    await onAddPoints(selectedUser, actionName, points);
    setSelectedUser('');
    setSelectedAction('');
    setCustomPoints('');
    setCustomAction('');
    refreshProfile();
  };

  const handleSaveProduct = async () => {
    const data = {
      name: productForm.name,
      description: productForm.description,
      points: parseInt(productForm.points),
      category: productForm.category,
      image_url: productForm.image_url || null,
      is_active: true
    };

    if (editingProduct) {
      await onUpdateReward(editingProduct.id, data);
    } else {
      await onAddReward(data);
    }

    setProductForm({ name: '', description: '', points: '', category: '', image_url: '' });
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name || '',
      description: product.description || '',
      points: product.points?.toString() || '',
      category: product.category || '',
      image_url: product.image_url || ''
    });
    setShowProductForm(true);
  };

  return (
    <div style={styles.adminContainer}>
      <h2 style={styles.pageTitle}>Admin Panel</h2>

      {/* Tabs */}
      <div style={styles.adminTabs}>
        {[
          { id: 'social', label: `Social Claims (${pendingSocial.length})` },
          { id: 'rewards', label: `Shop Claims (${pendingRewards.length})` },
          { id: 'referrals', label: `Referrals (${pendingReferrals.length})` },
          { id: 'points', label: 'Kurken Geven' },
          { id: 'products', label: 'Producten Beheren' },
        ].map(t => (
          <button 
            key={t.id} 
            onClick={() => setTab(t.id)} 
            style={tab === t.id ? styles.adminTabActive : styles.adminTab}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Social Claims Tab */}
      {tab === 'social' && (
        <div style={styles.adminSection}>
          <h3 style={styles.adminSectionTitle}>Social Media Claims</h3>
          {pendingSocial.length === 0 ? (
            <p style={styles.emptyText}>Geen openstaande claims</p>
          ) : (
            <div style={styles.adminList}>
              {pendingSocial.map(c => {
                const type = c.description.match(/\[(.*?)\]/)?.[1] || 'onbekend';
                const desc = c.description.replace(/\[.*?\]\s*/, '');
                const method = EARN_METHODS.find(m => m.id === type);
                const points = method?.points || 5;
                
                return (
                  <div key={c.id} style={styles.adminCard}>
                    <div style={styles.adminCardHeader}>
                      <strong>{c.user?.name}</strong>
                      <span style={styles.adminCardMeta}>{type} · +{points} kurken</span>
                    </div>
                    <p style={styles.adminCardDesc}>{desc}</p>
                    <div style={styles.adminCardActions}>
                      <button onClick={() => onApproveSocial(c, points)} style={styles.approveBtn}>
                        Goedkeuren (+{points})
                      </button>
                      <button onClick={() => onRejectSocial(c)} style={styles.rejectBtn}>
                        Afwijzen
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Reward Claims Tab */}
      {tab === 'rewards' && (
        <div style={styles.adminSection}>
          <h3 style={styles.adminSectionTitle}>Shop Aanvragen</h3>
          {pendingRewards.length === 0 ? (
            <p style={styles.emptyText}>Geen openstaande aanvragen</p>
          ) : (
            <div style={styles.adminList}>
              {pendingRewards.map(c => {
                const reward = rewards.find(r => r.id === c.reward_id);
                return (
                  <div key={c.id} style={styles.adminCard}>
                    <div style={styles.adminCardHeader}>
                      <strong>{c.user?.name}</strong>
                      <span style={styles.adminCardMeta}>wil {reward?.name || 'onbekend'}</span>
                    </div>
                    <p style={styles.adminCardDesc}>{c.points_cost} kurken</p>
                    <div style={styles.adminCardActions}>
                      <button onClick={() => onApproveReward(c, reward?.name)} style={styles.approveBtn}>
                        Leveren
                      </button>
                      <button onClick={() => onRejectReward(c.id)} style={styles.rejectBtn}>
                        Afwijzen
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Referrals Tab */}
      {tab === 'referrals' && (
        <div style={styles.adminSection}>
          <h3 style={styles.adminSectionTitle}>Referral Programma</h3>
          {referrals.length === 0 ? (
            <p style={styles.emptyText}>Geen referrals</p>
          ) : (
            <div style={styles.adminList}>
              {referrals.map(r => (
                <div key={r.id} style={styles.adminCard}>
                  <div style={styles.adminCardHeader}>
                    <strong>{r.colleague_name}</strong>
                    <span style={styles.adminCardMeta}>via {r.referrer?.name}</span>
                  </div>
                  <div style={styles.shiftsTracker}>
                    <span>Shifts: {r.shifts_worked || 0} / {r.shifts_required || 3}</span>
                    <div style={styles.shiftsBar}>
                      <div style={{
                        ...styles.shiftsFill, 
                        width: `${((r.shifts_worked || 0) / (r.shifts_required || 3)) * 100}%`
                      }} />
                    </div>
                  </div>
                  <div style={styles.adminCardActions}>
                    {r.status === 'submitted' && (
                      <button onClick={() => onUpdateReferral(r.id, { status: 'active' })} style={styles.approveBtn}>
                        Markeer als aangenomen
                      </button>
                    )}
                    {r.status === 'active' && (
                      <>
                        <button 
                          onClick={() => onUpdateReferral(r.id, { shifts_worked: (r.shifts_worked || 0) + 1 })} 
                          style={styles.secondaryBtn}
                        >
                          +1 Shift
                        </button>
                        {(r.shifts_worked || 0) >= (r.shifts_required || 3) && (
                          <button onClick={() => onCompleteReferral(r)} style={styles.approveBtn}>
                            Uitkeren (+100)
                          </button>
                        )}
                      </>
                    )}
                    {r.status === 'completed' && (
                      <span style={styles.completedBadge}>Voltooid</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Points Tab */}
      {tab === 'points' && (
        <div style={styles.adminSection}>
          <h3 style={styles.adminSectionTitle}>Kurken Toekennen</h3>
          
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Teamlid</label>
            <select 
              value={selectedUser} 
              onChange={e => setSelectedUser(e.target.value)} 
              style={styles.select}
            >
              <option value="">Selecteer teamlid...</option>
              {profiles.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.points} kurken)</option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Standaard actie</label>
            <select 
              value={selectedAction} 
              onChange={e => { setSelectedAction(e.target.value); setCustomPoints(''); setCustomAction(''); }} 
              style={styles.select}
            >
              <option value="">Selecteer actie...</option>
              {EARN_METHODS.filter(m => m.category !== 'social').map(m => (
                <option key={m.id} value={m.id}>{m.name} (+{m.points})</option>
              ))}
            </select>
          </div>

          <div style={styles.formDivider}>
            <span>of aangepast</span>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Omschrijving</label>
              <input 
                type="text" 
                value={customAction} 
                onChange={e => { setCustomAction(e.target.value); setSelectedAction(''); }}
                placeholder="Bijv. Extra inzet festival"
                style={styles.input}
              />
            </div>
            <div style={{...styles.formGroup, maxWidth: '120px'}}>
              <label style={styles.formLabel}>Kurken</label>
              <input 
                type="number" 
                value={customPoints} 
                onChange={e => { setCustomPoints(e.target.value); setSelectedAction(''); }}
                placeholder="25"
                style={styles.input}
              />
            </div>
          </div>

          <button 
            onClick={handleAddPoints} 
            disabled={!selectedUser || (!selectedAction && (!customPoints || !customAction))}
            style={styles.primaryBtn}
          >
            Toekennen
          </button>
        </div>
      )}

      {/* Products Tab */}
      {tab === 'products' && (
        <div style={styles.adminSection}>
          <div style={styles.adminSectionHeader}>
            <h3 style={styles.adminSectionTitle}>Producten Beheren</h3>
            <button 
              onClick={() => { setShowProductForm(true); setEditingProduct(null); setProductForm({ name: '', description: '', points: '', category: '', image_url: '' }); }}
              style={styles.addBtn}
            >
              + Nieuw product
            </button>
          </div>

          {/* Product Form */}
          {showProductForm && (
            <div style={styles.productFormCard}>
              <h4 style={styles.productFormTitle}>
                {editingProduct ? 'Product bewerken' : 'Nieuw product'}
              </h4>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Naam</label>
                <input 
                  type="text" 
                  value={productForm.name}
                  onChange={e => setProductForm({...productForm, name: e.target.value})}
                  placeholder="Fles wijn"
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Beschrijving</label>
                <textarea 
                  value={productForm.description}
                  onChange={e => setProductForm({...productForm, description: e.target.value})}
                  placeholder="Kies een heerlijke fles uit ons assortiment"
                  style={styles.textarea}
                  rows={2}
                />
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Prijs (kurken)</label>
                  <input 
                    type="number" 
                    value={productForm.points}
                    onChange={e => setProductForm({...productForm, points: e.target.value})}
                    placeholder="100"
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Categorie</label>
                  <select 
                    value={productForm.category}
                    onChange={e => setProductForm({...productForm, category: e.target.value})}
                    style={styles.select}
                  >
                    <option value="">Kies...</option>
                    <option value="klein">Klein</option>
                    <option value="middel">Middel</option>
                    <option value="groot">Groot</option>
                    <option value="premium">Premium</option>
                    <option value="ultiem">Ultiem</option>
                  </select>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Afbeelding URL</label>
                <input 
                  type="text" 
                  value={productForm.image_url}
                  onChange={e => setProductForm({...productForm, image_url: e.target.value})}
                  placeholder="https://..."
                  style={styles.input}
                />
                <span style={styles.formHint}>Tip: Upload een afbeelding naar imgur.com en plak de link hier</span>
              </div>

              {productForm.image_url && (
                <div style={styles.imagePreview}>
                  <img src={productForm.image_url} alt="Preview" style={styles.imagePreviewImg} />
                </div>
              )}

              <div style={styles.formActions}>
                <button onClick={() => setShowProductForm(false)} style={styles.secondaryBtn}>
                  Annuleren
                </button>
                <button 
                  onClick={handleSaveProduct}
                  disabled={!productForm.name || !productForm.points}
                  style={styles.primaryBtn}
                >
                  {editingProduct ? 'Opslaan' : 'Toevoegen'}
                </button>
              </div>
            </div>
          )}

          {/* Product List */}
          <div style={styles.productList}>
            {rewards.length === 0 ? (
              <p style={styles.emptyText}>Nog geen producten. Voeg je eerste product toe!</p>
            ) : (
              rewards.map(product => (
                <div key={product.id} style={styles.productListItem}>
                  <div style={styles.productListImage}>
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} style={styles.productListImg} />
                    ) : (
                      <div style={styles.productListPlaceholder}>{product.name?.charAt(0)}</div>
                    )}
                  </div>
                  <div style={styles.productListInfo}>
                    <strong>{product.name}</strong>
                    <span style={styles.productListMeta}>
                      {product.points} kurken · {product.category || 'Geen categorie'}
                    </span>
                  </div>
                  <div style={styles.productListActions}>
                    <button onClick={() => handleEditProduct(product)} style={styles.editBtn}>
                      Bewerk
                    </button>
                    <button onClick={() => onDeleteReward(product.id)} style={styles.deleteBtn}>
                      Verwijder
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// =====================================================
// MAIN APP
// =====================================================
function MainApp() {
  const { profile, signOut, refreshProfile } = useApp();
  const { profiles } = useProfiles();
  const { rewards, addReward, updateReward, deleteReward } = useRewards();
  const { activities } = useActivities(profile?.id);
  const { claims: socialClaims, submitClaim, approveClaim, rejectClaim } = useSocialClaims();
  const { claims: rewardClaims, createClaim, updateClaim } = useRewardClaims();
  const { referrals, submitReferral, updateReferral, completeReferral } = useReferrals();
  const { canGive, give } = useRecognitions();
  const { notifications, unreadCount, markRead } = useNotifications();
  const { addPoints } = useAdminPoints();

  const [view, setView] = useState('dashboard');
  const [toast, setToast] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);

  const notify = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' });

  // Computed
  const myActivities = activities.filter(a => a.user_id === profile?.id);
  const pendingCount = socialClaims.filter(c => c.status === 'pending').length + 
                       rewardClaims.filter(c => c.status === 'pending').length;

  // Handlers
  const handleSocialSubmit = async (type, desc, points) => {
    const success = await submitClaim(type, desc, points);
    if (success) notify('Aangemeld! We controleren het zo snel mogelijk.');
    return success;
  };

  const handleRewardClaim = async (rewardId, rewardName, points) => {
    const success = await createClaim(rewardId, rewardName, points);
    if (success) notify('Beloning aangevraagd!');
    refreshProfile();
    return success;
  };

  const handleApproveSocial = async (claim, points) => {
    await approveClaim(claim.id, points);
    notify(`Goedgekeurd! +${points} kurken voor ${claim.user?.name}`);
    refreshProfile();
  };

  const handleRejectSocial = async (claim) => {
    await rejectClaim(claim.id);
    notify('Afgewezen');
  };

  const handleApproveReward = async (claim, rewardName) => {
    await updateClaim(claim.id, 'approved', rewardName);
    notify(`${rewardName || 'Beloning'} goedgekeurd`);
    refreshProfile();
  };

  const handleRejectReward = async (claimId) => {
    await updateClaim(claimId, 'rejected');
    notify('Afgewezen');
  };

  const handleGiveRecognition = async (userId, userName) => {
    await give(userId, userName);
    notify(`Je hebt ${userName} gewaardeerd!`);
    refreshProfile();
  };

  const handleSubmitReferral = async (name, contact) => {
    await submitReferral(name, contact);
    notify('Collega aangedragen!');
  };

  const handleAddPoints = async (userId, actionName, points) => {
    await addPoints(userId, actionName, points);
    const user = profiles.find(p => p.id === userId);
    notify(`+${points} kurken voor ${user?.name}`);
    refreshProfile();
  };

  if (!profile) return <div style={styles.loading}>Laden...</div>;

  return (
    <div style={styles.app}>
      {/* Toast */}
      {toast && (
        <div style={{
          ...styles.toast,
          background: toast.type === 'error' ? COLORS.error : COLORS.darkBlue
        }}>
          {toast.msg}
        </div>
      )}

      {/* Notifications Panel */}
      {showNotifications && (
        <div style={styles.notifOverlay} onClick={() => setShowNotifications(false)}>
          <div style={styles.notifPanel} onClick={e => e.stopPropagation()}>
            <div style={styles.notifHeader}>
              <h3>Notificaties</h3>
              <button onClick={markRead} style={styles.notifMarkRead}>Alles gelezen</button>
            </div>
            {notifications.length === 0 ? (
              <p style={styles.notifEmpty}>Geen notificaties</p>
            ) : (
              <div style={styles.notifList}>
                {notifications.slice(0, 20).map(n => (
                  <div key={n.id} style={n.is_read ? styles.notifItem : styles.notifItemUnread}>
                    <strong>{n.title}</strong>
                    <span>{n.message}</span>
                    <span style={styles.notifTime}>{formatDate(n.created_at)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <MvdWLogo size={36} />
          <span style={styles.headerTitle}>Rewards</span>
        </div>
        <div style={styles.headerRight}>
          <div style={styles.headerPoints}>
            <span style={styles.headerPointsValue}>{profile.points}</span>
            <span style={styles.headerPointsLabel}>kurken</span>
          </div>
          <button onClick={() => { setShowNotifications(true); markRead(); }} style={styles.headerBtn}>
            <span style={styles.headerBtnIcon}>●</span>
            {unreadCount > 0 && <span style={styles.badge}>{unreadCount}</span>}
          </button>
          <button onClick={signOut} style={styles.headerBtn}>
            <span style={styles.headerBtnIcon}>→</span>
          </button>
        </div>
      </header>

      {/* Nav */}
      <nav style={styles.nav}>
        {[
          { id: 'dashboard', label: 'Home' },
          { id: 'earn', label: 'Verdienen' },
          { id: 'shop', label: 'Shop' },
          { id: 'team', label: 'Team' },
        ].map(item => (
          <button 
            key={item.id} 
            onClick={() => setView(item.id)} 
            style={view === item.id ? styles.navActive : styles.navBtn}
          >
            {item.label}
          </button>
        ))}
        {profile.is_admin && (
          <button 
            onClick={() => setView('admin')} 
            style={view === 'admin' ? styles.navActive : styles.navBtn}
          >
            Admin
            {pendingCount > 0 && <span style={styles.navBadge}>{pendingCount}</span>}
          </button>
        )}
      </nav>

      {/* Main */}
      <main style={styles.main}>
        
        {/* DASHBOARD */}
        {view === 'dashboard' && (
          <div style={styles.dashboard}>
            {/* Hero */}
            <div style={styles.heroCard}>
              <div style={styles.heroContent}>
                <span style={styles.heroGreeting}>Welkom, {profile.name}</span>
                <div style={styles.heroPointsRow}>
                  <span style={styles.heroPoints}>{profile.points}</span>
                  <span style={styles.heroLabel}>kurken</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div style={styles.statsRow}>
              <div style={styles.statCard}>
                <span style={styles.statValue}>{myActivities.length}</span>
                <span style={styles.statLabel}>acties</span>
              </div>
              <div style={styles.statCard}>
                <span style={styles.statValue}>{myActivities.filter(a => a.is_high_value).length}</span>
                <span style={styles.statLabel}>high value</span>
              </div>
              <div style={styles.statCard}>
                <span style={styles.statValue}>{rewardClaims.filter(c => c.user_id === profile.id && c.status === 'approved').length}</span>
                <span style={styles.statLabel}>beloningen</span>
              </div>
            </div>

            {/* Pending claims */}
            {socialClaims.filter(c => c.user_id === profile.id && c.status === 'pending').length > 0 && (
              <div style={styles.pendingCard}>
                <strong>Claims in review</strong>
                <span style={styles.pendingCount}>
                  {socialClaims.filter(c => c.user_id === profile.id && c.status === 'pending').length} wachten op goedkeuring
                </span>
              </div>
            )}

            {/* Recent Activity */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Recente activiteit</h3>
              {myActivities.length === 0 ? (
                <p style={styles.emptyText}>Nog geen activiteit</p>
              ) : (
                <div style={styles.activityList}>
                  {myActivities.slice(0, 5).map(a => (
                    <div key={a.id} style={styles.activityItem}>
                      <div style={styles.activityInfo}>
                        {a.is_high_value && <span style={styles.hvBadge}>HIGH VALUE</span>}
                        <span style={styles.activityName}>{a.action_name}</span>
                        <span style={styles.activityDate}>{formatDate(a.created_at)}</span>
                      </div>
                      <span style={styles.activityPoints}>+{a.points}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* EARN */}
        {view === 'earn' && (
          <EarnSection 
            onSubmitClaim={handleSocialSubmit} 
            myClaims={socialClaims.filter(c => c.user_id === profile.id)} 
          />
        )}

        {/* SHOP */}
        {view === 'shop' && (
          <Shop 
            rewards={rewards}
            profile={profile}
            claims={rewardClaims}
            onClaim={handleRewardClaim}
          />
        )}

        {/* TEAM */}
        {view === 'team' && (
          <div style={styles.teamView}>
            <h2 style={styles.pageTitle}>Team</h2>

            {/* Recognition */}
            <div style={styles.recognitionCard}>
              <h3 style={styles.recognitionTitle}>Waardeer een collega</h3>
              <p style={styles.recognitionDesc}>
                Geef +20 kurken aan iemand die het verdient (1x per maand)
              </p>
              <span style={canGive() ? styles.canRecognize : styles.cantRecognize}>
                {canGive() ? 'Je kunt nog waarderen' : 'Al gewaardeerd deze maand'}
              </span>
            </div>

            <div style={styles.colleagueGrid}>
              {profiles.filter(p => p.id !== profile.id).map(p => (
                <div key={p.id} style={styles.colleagueCard}>
                  <div style={styles.colleagueAvatar}>{p.name?.charAt(0) || '?'}</div>
                  <h4 style={styles.colleagueName}>{p.name}</h4>
                  <span style={styles.colleaguePoints}>{p.points} kurken</span>
                  <button 
                    onClick={() => handleGiveRecognition(p.id, p.name)}
                    disabled={!canGive()}
                    style={canGive() ? styles.giveBtn : styles.giveBtnDisabled}
                  >
                    Waardeer
                  </button>
                </div>
              ))}
            </div>

            {/* Referral */}
            <div style={styles.referralSection}>
              <h3 style={styles.sectionTitle}>Collega aandragen</h3>
              <p style={styles.sectionDesc}>
                Draag een nieuwe collega aan en verdien 100 kurken als zij 3 shifts hebben gewerkt!
              </p>
              
              <div style={styles.referralForm}>
                <input type="text" placeholder="Naam" id="refName" style={styles.input} />
                <input type="text" placeholder="Telefoon of email" id="refContact" style={styles.input} />
                <button onClick={() => {
                  const name = document.getElementById('refName');
                  const contact = document.getElementById('refContact');
                  if (name.value && contact.value) {
                    handleSubmitReferral(name.value, contact.value);
                    name.value = '';
                    contact.value = '';
                  }
                }} style={styles.primaryBtn}>
                  Aandragen
                </button>
              </div>

              {/* My referrals */}
              {referrals.filter(r => r.referrer_id === profile.id).length > 0 && (
                <div style={styles.myReferrals}>
                  <h4 style={styles.myReferralsTitle}>Jouw referrals</h4>
                  {referrals.filter(r => r.referrer_id === profile.id).map(r => (
                    <div key={r.id} style={styles.referralItem}>
                      <strong>{r.colleague_name}</strong>
                      <span style={styles.referralStatus}>
                        {r.status === 'submitted' && 'Aangemeld'}
                        {r.status === 'active' && `${r.shifts_worked || 0}/${r.shifts_required || 3} shifts`}
                        {r.status === 'completed' && 'Voltooid! +100 kurken'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Leaderboard */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Leaderboard</h3>
              <div style={styles.leaderboard}>
                {[...profiles].sort((a, b) => b.points - a.points).map((p, i) => (
                  <div key={p.id} style={p.id === profile.id ? styles.leaderRowMe : styles.leaderRow}>
                    <span style={styles.leaderRank}>{i + 1}</span>
                    <div style={styles.leaderAvatar}>{p.name?.charAt(0) || '?'}</div>
                    <div style={styles.leaderInfo}>
                      <span style={styles.leaderName}>{p.name} {p.id === profile.id && '(jij)'}</span>
                    </div>
                    <span style={styles.leaderPoints}>{p.points}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ADMIN */}
        {view === 'admin' && profile.is_admin && (
          <AdminPanel 
            profiles={profiles}
            socialClaims={socialClaims}
            rewardClaims={rewardClaims}
            referrals={referrals}
            rewards={rewards}
            onApproveSocial={handleApproveSocial}
            onRejectSocial={handleRejectSocial}
            onApproveReward={handleApproveReward}
            onRejectReward={handleRejectReward}
            onUpdateReferral={updateReferral}
            onCompleteReferral={completeReferral}
            onAddPoints={handleAddPoints}
            onAddReward={addReward}
            onUpdateReward={updateReward}
            onDeleteReward={deleteReward}
            refreshProfile={refreshProfile}
          />
        )}
      </main>
    </div>
  );
}

// =====================================================
// ROOT
// =====================================================
export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

function AppContent() {
  const { session, loading } = useApp();
  
  if (loading) {
    return (
      <div style={styles.loadingScreen}>
        <MvdWLogo size={80} />
        <span style={styles.loadingText}>Laden...</span>
      </div>
    );
  }

  return session ? <MainApp /> : <AuthScreen />;
}

// =====================================================
// STYLES - MvdW Huisstijl
// =====================================================
const styles = {
  // Loading
  loadingScreen: { 
    minHeight: '100vh', 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center', 
    background: COLORS.darkBlue, 
    gap: '1.5rem' 
  },
  loadingText: { 
    color: COLORS.white, 
    fontFamily: 'Poppins, sans-serif', 
    fontSize: '1rem',
    opacity: 0.7
  },
  loading: { 
    padding: '2rem', 
    textAlign: 'center', 
    color: COLORS.white, 
    background: COLORS.darkBlue, 
    minHeight: '100vh',
    fontFamily: 'Poppins, sans-serif'
  },

  // Auth
  authScreen: { 
    minHeight: '100vh', 
    background: COLORS.darkBlue, 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: '1rem', 
    fontFamily: 'Poppins, sans-serif'
  },
  authContainer: { 
    width: '100%', 
    maxWidth: '400px' 
  },
  authHeader: { 
    textAlign: 'center', 
    marginBottom: '2rem' 
  },
  authLogoWrap: { 
    marginBottom: '1rem' 
  },
  authTitle: { 
    color: COLORS.white, 
    fontSize: '1.75rem', 
    fontFamily: 'DM Serif Display, serif',
    fontWeight: 400,
    margin: '0.5rem 0 0' 
  },
  authSubtitle: { 
    color: 'rgba(255,255,255,0.6)', 
    marginTop: '0.5rem',
    fontSize: '0.9rem'
  },
  authCard: { 
    background: COLORS.white, 
    borderRadius: '12px', 
    padding: '1.5rem'
  },
  authTabs: { 
    display: 'flex', 
    marginBottom: '1.5rem', 
    borderRadius: '8px', 
    overflow: 'hidden', 
    background: COLORS.lightGrey 
  },
  authTab: { 
    flex: 1, 
    padding: '0.75rem', 
    background: 'transparent', 
    border: 'none', 
    color: COLORS.darkGrey, 
    cursor: 'pointer', 
    fontFamily: 'Poppins, sans-serif', 
    fontSize: '0.9rem', 
    transition: 'all 0.2s' 
  },
  authTabActive: { 
    flex: 1, 
    padding: '0.75rem', 
    background: COLORS.darkBlue, 
    border: 'none', 
    color: COLORS.white, 
    cursor: 'pointer', 
    fontFamily: 'Poppins, sans-serif', 
    fontSize: '0.9rem', 
    fontWeight: 600 
  },
  authForm: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '1rem' 
  },
  authInput: { 
    padding: '0.875rem 1rem', 
    background: COLORS.lightGrey, 
    border: `1px solid ${COLORS.mediumGrey}`, 
    borderRadius: '8px', 
    color: COLORS.darkBlue, 
    fontFamily: 'Poppins, sans-serif', 
    fontSize: '1rem', 
    outline: 'none'
  },
  authError: { 
    color: COLORS.error, 
    fontSize: '0.85rem', 
    margin: 0, 
    padding: '0.75rem', 
    background: 'rgba(239,68,68,0.1)', 
    borderRadius: '8px'
  },
  authButton: { 
    padding: '1rem', 
    background: COLORS.darkBlue, 
    border: 'none', 
    borderRadius: '8px', 
    color: COLORS.white, 
    fontWeight: 600, 
    cursor: 'pointer', 
    fontFamily: 'Poppins, sans-serif', 
    fontSize: '1rem', 
    transition: 'opacity 0.2s'
  },
  authSocials: { 
    textAlign: 'center', 
    marginTop: '2rem' 
  },
  authSocialsLabel: { 
    color: 'rgba(255,255,255,0.5)', 
    fontSize: '0.8rem', 
    marginBottom: '0.75rem' 
  },
  authSocialLinks: { 
    display: 'flex', 
    justifyContent: 'center', 
    gap: '1rem' 
  },
  authSocialLink: { 
    color: COLORS.white, 
    textDecoration: 'none', 
    fontSize: '0.85rem',
    opacity: 0.7,
    transition: 'opacity 0.2s'
  },
  authTagline: { 
    color: 'rgba(255,255,255,0.4)', 
    textAlign: 'center', 
    marginTop: '2rem', 
    fontStyle: 'italic', 
    fontSize: '0.85rem' 
  },

  // App
  app: { 
    minHeight: '100vh', 
    background: COLORS.lightGrey, 
    fontFamily: 'Poppins, sans-serif', 
    color: COLORS.darkBlue 
  },

  // Toast
  toast: { 
    position: 'fixed', 
    top: '1rem', 
    left: '50%', 
    transform: 'translateX(-50%)', 
    padding: '1rem 1.5rem', 
    borderRadius: '8px', 
    color: COLORS.white, 
    fontWeight: 500, 
    fontSize: '0.9rem', 
    zIndex: 9999, 
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
  },

  // Header
  header: { 
    background: COLORS.darkBlue, 
    padding: '0.75rem 1rem', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    position: 'sticky', 
    top: 0, 
    zIndex: 100 
  },
  headerLeft: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '0.75rem' 
  },
  headerTitle: { 
    color: COLORS.white, 
    fontSize: '1.1rem', 
    fontFamily: 'DM Serif Display, serif',
    fontWeight: 400
  },
  headerRight: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '0.5rem' 
  },
  headerPoints: { 
    background: 'rgba(255,255,255,0.1)', 
    padding: '0.4rem 0.75rem', 
    borderRadius: '20px', 
    display: 'flex', 
    alignItems: 'center', 
    gap: '0.35rem' 
  },
  headerPointsValue: { 
    color: COLORS.white, 
    fontWeight: 700, 
    fontSize: '1rem' 
  },
  headerPointsLabel: { 
    color: 'rgba(255,255,255,0.7)', 
    fontSize: '0.75rem' 
  },
  headerBtn: { 
    background: 'rgba(255,255,255,0.1)', 
    border: 'none', 
    width: '40px', 
    height: '40px', 
    borderRadius: '8px', 
    cursor: 'pointer', 
    position: 'relative', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  headerBtnIcon: {
    color: COLORS.white,
    fontSize: '1rem'
  },
  badge: { 
    position: 'absolute', 
    top: '-4px', 
    right: '-4px', 
    background: COLORS.error, 
    color: COLORS.white, 
    fontSize: '0.65rem', 
    fontWeight: 700, 
    padding: '2px 6px', 
    borderRadius: '10px', 
    minWidth: '18px', 
    textAlign: 'center' 
  },

  // Nav
  nav: { 
    background: COLORS.white, 
    padding: '0.5rem', 
    display: 'flex', 
    gap: '0.25rem', 
    borderBottom: `1px solid ${COLORS.mediumGrey}` 
  },
  navBtn: { 
    flex: 1, 
    padding: '0.75rem 0.5rem', 
    background: 'transparent', 
    border: 'none', 
    borderRadius: '8px', 
    cursor: 'pointer', 
    color: COLORS.darkGrey, 
    fontFamily: 'Poppins, sans-serif', 
    fontSize: '0.85rem',
    position: 'relative',
    transition: 'all 0.2s' 
  },
  navActive: { 
    flex: 1, 
    padding: '0.75rem 0.5rem', 
    background: COLORS.darkBlue, 
    border: 'none', 
    borderRadius: '8px', 
    cursor: 'pointer', 
    color: COLORS.white, 
    fontFamily: 'Poppins, sans-serif', 
    fontSize: '0.85rem',
    fontWeight: 600,
    position: 'relative'
  },
  navBadge: { 
    position: 'absolute', 
    top: '4px', 
    right: '8px', 
    background: COLORS.error, 
    color: COLORS.white, 
    fontSize: '0.6rem', 
    fontWeight: 700, 
    padding: '1px 5px', 
    borderRadius: '6px' 
  },

  // Main
  main: { 
    padding: '1rem', 
    maxWidth: '600px', 
    margin: '0 auto' 
  },

  // Page titles
  pageTitle: {
    fontFamily: 'DM Serif Display, serif',
    fontSize: '1.5rem',
    fontWeight: 400,
    color: COLORS.darkBlue,
    margin: '0 0 0.25rem'
  },
  pageSubtitle: {
    color: COLORS.darkGrey,
    fontSize: '0.9rem',
    margin: 0
  },

  // Dashboard
  dashboard: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '1rem' 
  },

  // Hero
  heroCard: { 
    background: COLORS.darkBlue, 
    borderRadius: '12px', 
    padding: '1.5rem'
  },
  heroContent: {},
  heroGreeting: { 
    color: 'rgba(255,255,255,0.7)', 
    fontSize: '0.9rem' 
  },
  heroPointsRow: { 
    display: 'flex', 
    alignItems: 'baseline', 
    gap: '0.5rem', 
    marginTop: '0.25rem' 
  },
  heroPoints: { 
    fontSize: '3rem', 
    fontWeight: 700, 
    color: COLORS.white,
    fontFamily: 'DM Serif Display, serif'
  },
  heroLabel: { 
    color: 'rgba(255,255,255,0.7)', 
    fontSize: '1rem' 
  },

  // Stats
  statsRow: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(3, 1fr)', 
    gap: '0.75rem' 
  },
  statCard: { 
    background: COLORS.white, 
    borderRadius: '12px', 
    padding: '1rem', 
    textAlign: 'center',
    border: `1px solid ${COLORS.mediumGrey}`
  },
  statValue: { 
    display: 'block', 
    fontSize: '1.5rem', 
    fontWeight: 700, 
    color: COLORS.darkBlue,
    fontFamily: 'DM Serif Display, serif'
  },
  statLabel: { 
    fontSize: '0.75rem', 
    color: COLORS.darkGrey 
  },

  // Section
  section: { 
    background: COLORS.white, 
    borderRadius: '12px', 
    padding: '1rem',
    border: `1px solid ${COLORS.mediumGrey}`
  },
  sectionTitle: { 
    fontFamily: 'DM Serif Display, serif',
    fontSize: '1.1rem', 
    fontWeight: 400, 
    marginBottom: '0.75rem',
    color: COLORS.darkBlue
  },
  sectionDesc: {
    color: COLORS.darkGrey,
    fontSize: '0.85rem',
    marginBottom: '1rem'
  },

  // Empty states
  emptyText: { 
    color: COLORS.darkGrey, 
    textAlign: 'center', 
    padding: '1.5rem',
    fontSize: '0.9rem'
  },
  emptyState: {
    background: COLORS.white,
    borderRadius: '12px',
    padding: '3rem 1.5rem',
    textAlign: 'center',
    border: `1px solid ${COLORS.mediumGrey}`
  },
  emptyStateSmall: {
    color: COLORS.darkGrey,
    fontSize: '0.85rem',
    marginTop: '0.5rem'
  },

  // Pending Card
  pendingCard: { 
    background: COLORS.white, 
    border: `1px solid ${COLORS.warning}`, 
    borderRadius: '12px', 
    padding: '1rem'
  },
  pendingCount: { 
    display: 'block', 
    color: COLORS.darkGrey, 
    fontSize: '0.85rem',
    marginTop: '0.25rem'
  },

  // Activity
  activityList: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '0.5rem' 
  },
  activityItem: { 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: '0.75rem', 
    background: COLORS.lightGrey, 
    borderRadius: '8px' 
  },
  activityInfo: { 
    flex: 1, 
    minWidth: 0 
  },
  activityName: { 
    display: 'block', 
    fontSize: '0.9rem', 
    fontWeight: 500, 
    whiteSpace: 'nowrap', 
    overflow: 'hidden', 
    textOverflow: 'ellipsis' 
  },
  activityDate: { 
    display: 'block', 
    fontSize: '0.75rem', 
    color: COLORS.darkGrey 
  },
  activityPoints: { 
    fontWeight: 700, 
    color: COLORS.success, 
    fontSize: '0.95rem', 
    marginLeft: '1rem' 
  },
  hvBadge: { 
    display: 'inline-block', 
    background: COLORS.accent, 
    color: COLORS.darkBlue, 
    fontSize: '0.6rem', 
    fontWeight: 700, 
    padding: '2px 6px', 
    borderRadius: '4px', 
    marginBottom: '0.25rem' 
  },

  // Earn Section
  earnSection: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '1rem' 
  },
  infoBanner: {
    background: COLORS.white,
    border: `1px solid ${COLORS.mediumGrey}`,
    borderRadius: '12px',
    padding: '1rem',
    display: 'flex',
    gap: '1rem',
    alignItems: 'flex-start'
  },
  infoBannerIcon: {
    background: COLORS.darkBlue,
    color: COLORS.white,
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.8rem',
    fontWeight: 700,
    flexShrink: 0
  },
  infoBannerText: {
    color: COLORS.darkGrey,
    fontSize: '0.85rem',
    marginTop: '0.25rem'
  },
  earnCategory: {
    background: COLORS.white,
    borderRadius: '12px',
    padding: '1rem',
    border: `1px solid ${COLORS.mediumGrey}`
  },
  earnCategoryTitle: {
    fontFamily: 'DM Serif Display, serif',
    fontSize: '1.1rem',
    fontWeight: 400,
    marginBottom: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  earnCategoryIcon: {
    background: COLORS.darkBlue,
    color: COLORS.white,
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.8rem',
    fontWeight: 600
  },
  earnList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  earnItem: {
    background: COLORS.lightGrey,
    borderRadius: '8px',
    padding: '0.875rem'
  },
  earnItemHV: {
    background: `linear-gradient(135deg, ${COLORS.lightGrey}, rgba(201,169,98,0.1))`,
    borderRadius: '8px',
    padding: '0.875rem',
    border: `1px solid ${COLORS.accent}`,
    position: 'relative'
  },
  earnItemContent: {},
  earnItemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.25rem'
  },
  earnItemName: {
    fontWeight: 600,
    fontSize: '0.95rem'
  },
  earnItemPoints: {
    fontWeight: 700,
    color: COLORS.success
  },
  earnItemDesc: {
    color: COLORS.darkGrey,
    fontSize: '0.8rem',
    margin: 0
  },
  pendingBadge: {
    display: 'inline-block',
    background: 'rgba(245,158,11,0.1)',
    color: COLORS.warning,
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    marginTop: '0.5rem'
  },
  claimSmallBtn: {
    background: COLORS.darkBlue,
    color: COLORS.white,
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif',
    marginTop: '0.5rem'
  },
  claimForm: {
    marginTop: '0.75rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  claimTextarea: {
    padding: '0.75rem',
    background: COLORS.white,
    border: `1px solid ${COLORS.mediumGrey}`,
    borderRadius: '8px',
    color: COLORS.darkBlue,
    fontFamily: 'Poppins, sans-serif',
    fontSize: '0.9rem',
    resize: 'none',
    outline: 'none'
  },
  submitBtn: {
    background: COLORS.success,
    color: COLORS.white,
    border: 'none',
    padding: '0.75rem',
    borderRadius: '8px',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif'
  },

  // Social Links
  socialLinksSection: {
    background: COLORS.white,
    borderRadius: '12px',
    padding: '1rem',
    border: `1px solid ${COLORS.mediumGrey}`
  },
  socialLinksGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '0.75rem'
  },
  socialLinkCard: {
    background: COLORS.lightGrey,
    borderRadius: '8px',
    padding: '1rem',
    textDecoration: 'none',
    color: COLORS.darkBlue,
    textAlign: 'center',
    transition: 'background 0.2s'
  },
  socialLinkName: {
    display: 'block',
    fontWeight: 600,
    fontSize: '0.85rem'
  },
  socialLinkHandle: {
    display: 'block',
    color: COLORS.darkGrey,
    fontSize: '0.7rem',
    marginTop: '0.25rem'
  },

  // Shop
  shopContainer: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '1rem' 
  },
  shopHeader: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start', 
    gap: '1rem' 
  },
  shopBalance: { 
    background: COLORS.darkBlue, 
    borderRadius: '12px', 
    padding: '0.75rem 1rem', 
    textAlign: 'center' 
  },
  shopBalanceLabel: { 
    display: 'block', 
    color: 'rgba(255,255,255,0.7)', 
    fontSize: '0.7rem' 
  },
  shopBalanceValue: { 
    display: 'block', 
    color: COLORS.white, 
    fontSize: '1.5rem', 
    fontWeight: 700,
    fontFamily: 'DM Serif Display, serif'
  },
  shopBalanceUnit: { 
    display: 'block', 
    color: 'rgba(255,255,255,0.7)', 
    fontSize: '0.7rem' 
  },
  shopGrid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(2, 1fr)', 
    gap: '1rem' 
  },
  productCard: { 
    background: COLORS.white, 
    border: `1px solid ${COLORS.mediumGrey}`, 
    borderRadius: '12px', 
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  },
  productImageWrap: {
    height: '120px',
    background: COLORS.lightGrey,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  productImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  productImagePlaceholder: {
    width: '60px',
    height: '60px',
    background: COLORS.mediumGrey,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  productImagePlaceholderText: {
    fontSize: '1.5rem',
    color: COLORS.darkGrey,
    fontFamily: 'DM Serif Display, serif'
  },
  productInfo: { 
    flex: 1,
    padding: '0.875rem'
  },
  productCategory: { 
    fontSize: '0.65rem', 
    color: COLORS.darkGrey, 
    textTransform: 'uppercase', 
    letterSpacing: '0.5px' 
  },
  productName: { 
    fontSize: '0.95rem', 
    fontWeight: 600, 
    margin: '0.25rem 0',
    fontFamily: 'DM Serif Display, serif'
  },
  productDesc: { 
    fontSize: '0.75rem', 
    color: COLORS.darkGrey, 
    lineHeight: 1.4,
    margin: 0
  },
  productFooter: { 
    padding: '0.875rem',
    borderTop: `1px solid ${COLORS.lightGrey}`
  },
  productPrice: { 
    marginBottom: '0.5rem' 
  },
  priceValue: { 
    fontSize: '1.25rem', 
    fontWeight: 700, 
    color: COLORS.darkBlue,
    fontFamily: 'DM Serif Display, serif'
  },
  priceUnit: { 
    fontSize: '0.75rem', 
    color: COLORS.darkGrey, 
    marginLeft: '0.25rem' 
  },
  pendingStatus: { 
    background: COLORS.lightGrey, 
    color: COLORS.darkGrey, 
    padding: '0.5rem', 
    borderRadius: '8px', 
    fontSize: '0.8rem', 
    textAlign: 'center' 
  },
  claimBtn: { 
    width: '100%', 
    background: COLORS.darkBlue, 
    color: COLORS.white, 
    border: 'none', 
    padding: '0.6rem', 
    borderRadius: '8px', 
    fontWeight: 600, 
    cursor: 'pointer', 
    fontFamily: 'Poppins, sans-serif', 
    fontSize: '0.9rem'
  },
  needMore: { 
    background: COLORS.lightGrey, 
    color: COLORS.darkGrey, 
    padding: '0.5rem', 
    borderRadius: '8px', 
    fontSize: '0.8rem', 
    textAlign: 'center' 
  },
  progressBarWrap: { 
    height: '4px', 
    background: COLORS.mediumGrey, 
    borderRadius: '2px', 
    margin: '0.5rem 0.875rem 0.875rem', 
    overflow: 'hidden' 
  },
  progressBarFill: { 
    height: '100%', 
    background: COLORS.darkBlue, 
    borderRadius: '2px', 
    transition: 'width 0.5s ease' 
  },

  // Modal
  modalOverlay: { 
    position: 'fixed', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    background: 'rgba(0,0,0,0.5)', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    zIndex: 1000, 
    padding: '1rem' 
  },
  modal: { 
    background: COLORS.white, 
    borderRadius: '16px', 
    padding: '1.5rem', 
    maxWidth: '400px', 
    width: '100%'
  },
  modalHeader: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '1rem', 
    marginBottom: '1rem' 
  },
  modalImage: {
    width: '64px',
    height: '64px',
    borderRadius: '12px',
    objectFit: 'cover'
  },
  modalImagePlaceholder: {
    width: '64px',
    height: '64px',
    background: COLORS.lightGrey,
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    color: COLORS.darkGrey,
    fontFamily: 'DM Serif Display, serif'
  },
  modalCategory: { 
    fontSize: '0.75rem', 
    color: COLORS.darkGrey,
    textTransform: 'uppercase'
  },
  modalTitle: { 
    fontSize: '1.25rem', 
    fontWeight: 600, 
    margin: '0.25rem 0 0',
    fontFamily: 'DM Serif Display, serif'
  },
  modalDesc: { 
    color: COLORS.darkGrey, 
    fontSize: '0.9rem', 
    marginBottom: '1rem', 
    lineHeight: 1.5 
  },
  modalPriceBox: { 
    background: COLORS.lightGrey, 
    borderRadius: '12px', 
    padding: '1rem', 
    marginBottom: '1rem' 
  },
  modalPriceRow: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    padding: '0.5rem 0', 
    fontSize: '0.9rem' 
  },
  modalPriceValue: { 
    fontWeight: 700 
  },
  modalDivider: { 
    height: '1px', 
    background: COLORS.mediumGrey, 
    margin: '0.25rem 0' 
  },
  modalActions: { 
    display: 'flex', 
    gap: '0.75rem' 
  },
  modalCancel: { 
    flex: 1, 
    background: COLORS.lightGrey, 
    color: COLORS.darkBlue, 
    border: 'none', 
    padding: '0.875rem', 
    borderRadius: '8px', 
    fontWeight: 500, 
    cursor: 'pointer', 
    fontFamily: 'Poppins, sans-serif' 
  },
  modalConfirm: { 
    flex: 1, 
    background: COLORS.darkBlue, 
    color: COLORS.white, 
    border: 'none', 
    padding: '0.875rem', 
    borderRadius: '8px', 
    fontWeight: 600, 
    cursor: 'pointer', 
    fontFamily: 'Poppins, sans-serif' 
  },
  successAnimation: { 
    textAlign: 'center', 
    padding: '2rem 0' 
  },
  successIcon: {
    width: '64px',
    height: '64px',
    background: COLORS.success,
    color: COLORS.white,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    margin: '0 auto 1rem'
  },
  successTitle: { 
    fontSize: '1.5rem', 
    fontWeight: 600, 
    margin: 0,
    fontFamily: 'DM Serif Display, serif'
  },
  successText: { 
    color: COLORS.darkGrey, 
    marginTop: '0.5rem' 
  },

  // Team
  teamView: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '1rem' 
  },
  recognitionCard: { 
    background: COLORS.white, 
    border: `1px solid ${COLORS.mediumGrey}`,
    borderRadius: '12px', 
    padding: '1.25rem', 
    textAlign: 'center' 
  },
  recognitionTitle: {
    fontFamily: 'DM Serif Display, serif',
    fontSize: '1.1rem',
    fontWeight: 400,
    margin: '0 0 0.5rem'
  },
  recognitionDesc: {
    color: COLORS.darkGrey,
    fontSize: '0.85rem',
    margin: 0
  },
  canRecognize: { 
    display: 'inline-block', 
    background: 'rgba(34,197,94,0.1)', 
    color: COLORS.success, 
    padding: '0.5rem 1rem', 
    borderRadius: '20px', 
    fontSize: '0.8rem', 
    marginTop: '0.75rem' 
  },
  cantRecognize: { 
    display: 'inline-block', 
    background: COLORS.lightGrey, 
    color: COLORS.darkGrey, 
    padding: '0.5rem 1rem', 
    borderRadius: '20px', 
    fontSize: '0.8rem', 
    marginTop: '0.75rem' 
  },
  colleagueGrid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(2, 1fr)', 
    gap: '0.75rem' 
  },
  colleagueCard: { 
    background: COLORS.white, 
    border: `1px solid ${COLORS.mediumGrey}`, 
    borderRadius: '12px', 
    padding: '1rem', 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    textAlign: 'center' 
  },
  colleagueAvatar: { 
    width: '48px',
    height: '48px',
    background: COLORS.darkBlue,
    color: COLORS.white,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.25rem',
    fontFamily: 'DM Serif Display, serif',
    marginBottom: '0.5rem' 
  },
  colleagueName: { 
    fontWeight: 600, 
    margin: 0, 
    fontSize: '0.95rem' 
  },
  colleaguePoints: { 
    color: COLORS.darkGrey, 
    fontSize: '0.8rem', 
    marginBottom: '0.5rem' 
  },
  giveBtn: { 
    width: '100%', 
    background: COLORS.darkBlue, 
    color: COLORS.white, 
    border: 'none', 
    padding: '0.6rem', 
    borderRadius: '8px', 
    fontWeight: 600, 
    cursor: 'pointer', 
    fontFamily: 'Poppins, sans-serif', 
    fontSize: '0.85rem' 
  },
  giveBtnDisabled: { 
    width: '100%', 
    background: COLORS.lightGrey, 
    color: COLORS.darkGrey, 
    border: 'none', 
    padding: '0.6rem', 
    borderRadius: '8px', 
    fontFamily: 'Poppins, sans-serif', 
    fontSize: '0.85rem', 
    cursor: 'not-allowed' 
  },

  // Referral
  referralSection: {
    background: COLORS.white,
    border: `1px solid ${COLORS.mediumGrey}`,
    borderRadius: '12px',
    padding: '1rem'
  },
  referralForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  myReferrals: {
    marginTop: '1rem',
    paddingTop: '1rem',
    borderTop: `1px solid ${COLORS.mediumGrey}`
  },
  myReferralsTitle: {
    fontSize: '0.9rem',
    fontWeight: 600,
    marginBottom: '0.5rem'
  },
  referralItem: {
    background: COLORS.lightGrey,
    borderRadius: '8px',
    padding: '0.75rem',
    marginBottom: '0.5rem'
  },
  referralStatus: {
    display: 'block',
    color: COLORS.darkGrey,
    fontSize: '0.8rem',
    marginTop: '0.25rem'
  },

  // Leaderboard
  leaderboard: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '0.5rem' 
  },
  leaderRow: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '0.75rem', 
    padding: '0.75rem', 
    background: COLORS.lightGrey, 
    borderRadius: '8px' 
  },
  leaderRowMe: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '0.75rem', 
    padding: '0.75rem', 
    background: COLORS.darkBlue, 
    borderRadius: '8px',
    color: COLORS.white
  },
  leaderRank: { 
    width: '24px', 
    height: '24px', 
    borderRadius: '50%', 
    background: COLORS.mediumGrey, 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    fontSize: '0.75rem', 
    fontWeight: 700
  },
  leaderAvatar: { 
    width: '32px',
    height: '32px',
    background: COLORS.darkBlue,
    color: COLORS.white,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.9rem',
    fontFamily: 'DM Serif Display, serif'
  },
  leaderInfo: { 
    flex: 1 
  },
  leaderName: { 
    display: 'block', 
    fontWeight: 600, 
    fontSize: '0.9rem' 
  },
  leaderPoints: { 
    fontWeight: 700 
  },

  // Notifications
  notifOverlay: { 
    position: 'fixed', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    background: 'rgba(0,0,0,0.5)', 
    zIndex: 1000 
  },
  notifPanel: { 
    position: 'absolute', 
    right: 0, 
    top: 0, 
    bottom: 0, 
    width: '100%', 
    maxWidth: '360px', 
    background: COLORS.white, 
    padding: '1rem', 
    overflowY: 'auto'
  },
  notifHeader: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: '1rem', 
    paddingBottom: '1rem', 
    borderBottom: `1px solid ${COLORS.mediumGrey}` 
  },
  notifMarkRead: { 
    background: 'none', 
    border: 'none', 
    color: COLORS.darkGrey, 
    fontSize: '0.8rem', 
    cursor: 'pointer' 
  },
  notifEmpty: { 
    color: COLORS.darkGrey, 
    textAlign: 'center', 
    padding: '2rem' 
  },
  notifList: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '0.5rem' 
  },
  notifItem: { 
    padding: '0.75rem', 
    background: COLORS.lightGrey, 
    borderRadius: '8px', 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '0.25rem', 
    fontSize: '0.85rem' 
  },
  notifItemUnread: { 
    padding: '0.75rem', 
    background: COLORS.lightGrey, 
    borderRadius: '8px', 
    borderLeft: `3px solid ${COLORS.darkBlue}`, 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '0.25rem', 
    fontSize: '0.85rem' 
  },
  notifTime: { 
    fontSize: '0.7rem', 
    color: COLORS.darkGrey 
  },

  // Admin
  adminContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  adminTabs: { 
    display: 'flex', 
    gap: '0.25rem', 
    flexWrap: 'wrap',
    background: COLORS.white,
    padding: '0.5rem',
    borderRadius: '8px',
    border: `1px solid ${COLORS.mediumGrey}`
  },
  adminTab: { 
    background: 'transparent', 
    border: 'none', 
    padding: '0.5rem 0.75rem', 
    borderRadius: '6px', 
    color: COLORS.darkGrey, 
    fontSize: '0.8rem', 
    cursor: 'pointer', 
    fontFamily: 'Poppins, sans-serif'
  },
  adminTabActive: { 
    background: COLORS.darkBlue, 
    border: 'none', 
    padding: '0.5rem 0.75rem', 
    borderRadius: '6px', 
    color: COLORS.white, 
    fontSize: '0.8rem', 
    fontWeight: 600, 
    cursor: 'pointer', 
    fontFamily: 'Poppins, sans-serif' 
  },
  adminSection: { 
    background: COLORS.white, 
    border: `1px solid ${COLORS.mediumGrey}`, 
    borderRadius: '12px', 
    padding: '1rem' 
  },
  adminSectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  adminSectionTitle: { 
    fontFamily: 'DM Serif Display, serif',
    fontSize: '1.1rem', 
    fontWeight: 400, 
    margin: 0
  },
  adminList: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '0.75rem' 
  },
  adminCard: { 
    background: COLORS.lightGrey, 
    borderRadius: '8px', 
    padding: '1rem' 
  },
  adminCardHeader: { 
    marginBottom: '0.5rem' 
  },
  adminCardMeta: { 
    display: 'block', 
    color: COLORS.darkGrey, 
    fontSize: '0.8rem' 
  },
  adminCardDesc: { 
    color: COLORS.darkGrey, 
    fontSize: '0.9rem', 
    marginBottom: '0.75rem' 
  },
  adminCardActions: { 
    display: 'flex', 
    gap: '0.5rem', 
    flexWrap: 'wrap' 
  },

  // Buttons
  primaryBtn: {
    background: COLORS.darkBlue,
    color: COLORS.white,
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif',
    fontSize: '0.9rem'
  },
  secondaryBtn: {
    background: COLORS.lightGrey,
    color: COLORS.darkBlue,
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif',
    fontSize: '0.85rem'
  },
  approveBtn: { 
    background: COLORS.success, 
    color: COLORS.white, 
    border: 'none', 
    padding: '0.5rem 1rem', 
    borderRadius: '6px', 
    fontWeight: 600, 
    cursor: 'pointer', 
    fontFamily: 'Poppins, sans-serif', 
    fontSize: '0.8rem' 
  },
  rejectBtn: { 
    background: COLORS.lightGrey, 
    color: COLORS.error, 
    border: 'none', 
    padding: '0.5rem 1rem', 
    borderRadius: '6px', 
    fontWeight: 600, 
    cursor: 'pointer', 
    fontFamily: 'Poppins, sans-serif', 
    fontSize: '0.8rem' 
  },
  addBtn: {
    background: COLORS.darkBlue,
    color: COLORS.white,
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif',
    fontSize: '0.8rem'
  },
  editBtn: {
    background: COLORS.lightGrey,
    color: COLORS.darkBlue,
    border: 'none',
    padding: '0.4rem 0.75rem',
    borderRadius: '6px',
    fontSize: '0.75rem',
    cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif'
  },
  deleteBtn: {
    background: 'transparent',
    color: COLORS.error,
    border: 'none',
    padding: '0.4rem 0.75rem',
    borderRadius: '6px',
    fontSize: '0.75rem',
    cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif'
  },
  completedBadge: { 
    background: 'rgba(34,197,94,0.1)', 
    color: COLORS.success, 
    padding: '0.4rem 0.75rem', 
    borderRadius: '20px', 
    fontSize: '0.8rem', 
    fontWeight: 500 
  },

  // Shifts tracker
  shiftsTracker: { 
    marginBottom: '0.75rem' 
  },
  shiftsBar: { 
    height: '6px', 
    background: COLORS.mediumGrey, 
    borderRadius: '3px', 
    marginTop: '0.5rem', 
    overflow: 'hidden' 
  },
  shiftsFill: { 
    height: '100%', 
    background: COLORS.success, 
    borderRadius: '3px', 
    transition: 'width 0.3s ease' 
  },

  // Form elements
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.375rem',
    flex: 1
  },
  formLabel: {
    fontSize: '0.8rem',
    fontWeight: 500,
    color: COLORS.darkGrey
  },
  formRow: {
    display: 'flex',
    gap: '0.75rem'
  },
  formDivider: {
    textAlign: 'center',
    color: COLORS.darkGrey,
    fontSize: '0.8rem',
    margin: '0.5rem 0'
  },
  formActions: {
    display: 'flex',
    gap: '0.75rem',
    marginTop: '1rem'
  },
  formHint: {
    fontSize: '0.7rem',
    color: COLORS.darkGrey,
    marginTop: '0.25rem'
  },
  input: { 
    padding: '0.75rem', 
    background: COLORS.lightGrey, 
    border: `1px solid ${COLORS.mediumGrey}`, 
    borderRadius: '8px', 
    color: COLORS.darkBlue, 
    fontFamily: 'Poppins, sans-serif', 
    fontSize: '0.9rem', 
    outline: 'none' 
  },
  textarea: {
    padding: '0.75rem',
    background: COLORS.lightGrey,
    border: `1px solid ${COLORS.mediumGrey}`,
    borderRadius: '8px',
    color: COLORS.darkBlue,
    fontFamily: 'Poppins, sans-serif',
    fontSize: '0.9rem',
    outline: 'none',
    resize: 'none'
  },
  select: { 
    padding: '0.75rem', 
    background: COLORS.lightGrey, 
    border: `1px solid ${COLORS.mediumGrey}`, 
    borderRadius: '8px', 
    color: COLORS.darkBlue, 
    fontFamily: 'Poppins, sans-serif', 
    fontSize: '0.9rem', 
    outline: 'none' 
  },

  // Product management
  productFormCard: {
    background: COLORS.lightGrey,
    borderRadius: '12px',
    padding: '1rem',
    marginBottom: '1rem'
  },
  productFormTitle: {
    fontFamily: 'DM Serif Display, serif',
    fontSize: '1rem',
    marginBottom: '1rem'
  },
  imagePreview: {
    marginTop: '0.5rem',
    borderRadius: '8px',
    overflow: 'hidden',
    maxHeight: '150px'
  },
  imagePreviewImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  productList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  productListItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem',
    background: COLORS.lightGrey,
    borderRadius: '8px'
  },
  productListImage: {
    width: '48px',
    height: '48px',
    borderRadius: '8px',
    overflow: 'hidden',
    flexShrink: 0
  },
  productListImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  productListPlaceholder: {
    width: '100%',
    height: '100%',
    background: COLORS.mediumGrey,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: COLORS.darkGrey,
    fontFamily: 'DM Serif Display, serif'
  },
  productListInfo: {
    flex: 1,
    minWidth: 0
  },
  productListMeta: {
    display: 'block',
    fontSize: '0.75rem',
    color: COLORS.darkGrey
  },
  productListActions: {
    display: 'flex',
    gap: '0.5rem'
  }
};

// Fonts
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Poppins:wght@400;500;600;700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    input::placeholder, textarea::placeholder { color: ${COLORS.darkGrey}; opacity: 0.7; }
    button:hover:not(:disabled) { opacity: 0.9; }
    button:disabled { opacity: 0.5; cursor: not-allowed; }
    a:hover { opacity: 0.8; }
  `;
  document.head.appendChild(style);
}
