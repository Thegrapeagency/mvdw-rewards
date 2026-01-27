// =====================================================
// 🍷 MEISJES VAN DE WIJN - REWARDS SYSTEEM
// PRODUCTIE VERSIE v3 - Druifjes & Nieuwe Shop
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
// SOCIAL MEDIA LINKS - PAS DEZE AAN!
// =====================================================
const SOCIAL_LINKS = {
  instagram: 'https://instagram.com/meisjesvanwijn',
  facebook: 'https://facebook.com/meisjesvanwijn',
  linkedin: 'https://linkedin.com/company/meisjes-van-de-wijn',
  tiktok: 'https://tiktok.com/@meisjesvanwijn',
};

// =====================================================
// SHOP ITEMS - Hardcoded voor snelle setup
// =====================================================
const SHOP_ITEMS = [
  // Klein (50-150 druifjes)
  { id: 'wijnpomp', name: 'Vacuvin Wijnpomp', description: 'Houd je wijn langer vers met deze handige vacuümpomp', points: 50, category: 'klein', emoji: '🍾', popular: false },
  { id: 'wijn', name: 'Fles Wijn naar keuze', description: 'Kies een heerlijke fles uit ons assortiment', points: 75, category: 'klein', emoji: '🍷', popular: true },
  { id: 'active-koeler', name: 'Vacuvin Active Wijnkoeler', description: 'Houdt je wijn perfect op temperatuur', points: 100, category: 'klein', emoji: '❄️', popular: false },
  
  // Middel (150-400 druifjes)
  { id: 'zieher', name: 'Zieher Wijnglazen (2st)', description: 'Prachtige design wijnglazen, set van 2', points: 150, category: 'middel', emoji: '🥂', popular: false },
  { id: 'koeler-kistje', name: 'MvdW Wijnkoeler Houten Kistje', description: 'Stijlvolle houten wijnkoeler met MvdW logo', points: 200, category: 'middel', emoji: '🪵', popular: true },
  { id: 'carafe', name: 'Vacuvin Swirling Carafe', description: 'Elegante decanteerkaraf voor optimale beluchting', points: 250, category: 'middel', emoji: '⚱️', popular: false },
  { id: 'gusto', name: 'Guts & Gusto Bon €50', description: 'Shoptegoed bij Guts & Gusto', points: 300, category: 'middel', emoji: '👗', popular: false },
  { id: 'maaltuin', name: 'Tegoedbon De Maaltuin', description: 'Heerlijk uit eten in de tuin', points: 350, category: 'middel', emoji: '🌿', popular: false },
  
  // Groot (400-1000 druifjes)
  { id: 'stellae', name: 'Tickets Stellae Ligconcert', description: 'Unieke muziekbeleving onder de sterren', points: 400, category: 'groot', emoji: '🎵', popular: true },
  { id: 'festival', name: 'Festivaltickets', description: 'Toegang tot een top festival naar keuze', points: 500, category: 'groot', emoji: '🎪', popular: true },
  { id: 'sabreur', name: 'MvdW Sabreersabel', description: 'Officiële MvdW champagnesabel - sabrage in stijl!', points: 600, category: 'groot', emoji: '⚔️', popular: true },
  { id: 'riedel', name: 'Riedel Wijnglazen (12st)', description: 'Complete set premium Riedel glazen', points: 750, category: 'groot', emoji: '✨', popular: false },
  { id: 'leoleo', name: 'Dinerbon Leo Leo €100', description: 'Fine dining ervaring in Utrecht', points: 800, category: 'groot', emoji: '🍽️', popular: false },
  { id: 'wijncursus', name: 'Wijncursus SDEN3', description: 'Professionele wijncursus bij Hart voor Wijn', points: 1000, category: 'groot', emoji: '📚', popular: false },
  
  // Premium (1000-3000 druifjes)
  { id: 'klimaatkast', name: 'Wijn Klimaatkast', description: 'Bewaar je wijncollectie op de perfecte temperatuur', points: 1500, category: 'premium', emoji: '🧊', popular: false },
  { id: 'driebergen', name: 'Kookworkshop Heeren van Driebergen', description: 'Luxe kookworkshop t.w.v. €500', points: 2000, category: 'premium', emoji: '👨‍🍳', popular: false },
  { id: 'iphone', name: 'iPhone 15 (Refurbished)', description: 'Apple iPhone 15 in nieuwstaat', points: 2500, category: 'premium', emoji: '📱', popular: true },
  { id: 'macbook-air', name: 'MacBook Air M1 (Refurbished)', description: 'Apple MacBook Air met M1 chip', points: 3000, category: 'premium', emoji: '💻', popular: false },
  
  // Ultiem (3000+ druifjes)
  { id: 'macbook-pro', name: 'MacBook Pro M1 (Refurbished)', description: 'Apple MacBook Pro met M1 chip - het werkpaard', points: 4000, category: 'ultiem', emoji: '🖥️', popular: false },
  { id: 'veloretti', name: 'Veloretti Caferacer', description: 'Stijlvolle Veloretti stadsfiets', points: 5000, category: 'ultiem', emoji: '🚲', popular: true },
];

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

function usePointActions() {
  const [actions, setActions] = useState([]);
  const { supabase } = useApp();

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('point_actions').select('*').eq('is_active', true);
      setActions(data || []);
    };
    fetch();
  }, []);

  return { actions };
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
      title: `+${points} druifjes goedgekeurd! 🍇`,
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
    // Store reward info in the claim since we're using hardcoded items
    const { error } = await supabase.from('claims').insert({
      user_id: profile.id,
      reward_id: rewardId, // This will be the string ID
      points_cost: pointsCost,
      status: 'pending'
    });
    
    // Also add a note about what they claimed
    if (!error) {
      await supabase.from('notifications').insert({
        user_id: profile.id,
        type: 'claim',
        title: '🛍️ Claim ingediend!',
        message: `Je hebt ${rewardName} aangevraagd voor ${pointsCost} druifjes`
      });
    }
    
    return !error;
  };

  const updateClaim = async (claimId, status, rewardName, userId) => {
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
        title: '🎉 Beloning goedgekeurd!',
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
      title: '+100 druifjes! 🍇',
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

  const getQuarter = () => `Q${Math.ceil((new Date().getMonth() + 1) / 3)}-${new Date().getFullYear()}`;
  
  const canGive = () => !recognitions.find(r => r.from_user_id === profile?.id && r.quarter === getQuarter());

  const give = async (toUserId, toUserName) => {
    const quarter = getQuarter();
    
    await supabase.from('recognitions').insert({
      from_user_id: profile.id,
      to_user_id: toUserId,
      quarter,
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
      title: '❤️ Je bent gewaardeerd!',
      message: `${profile.name} heeft je 20 druifjes gegeven`
    });

    return true;
  };

  return { recognitions, canGive, give };
}

function useWishlist() {
  const [wishlist, setWishlist] = useState([]);
  const { profile } = useApp();

  // Local storage based wishlist for hardcoded items
  useEffect(() => {
    if (profile) {
      const stored = localStorage.getItem(`wishlist_${profile.id}`);
      setWishlist(stored ? JSON.parse(stored) : []);
    }
  }, [profile]);

  const toggle = (itemId) => {
    const newList = wishlist.includes(itemId) 
      ? wishlist.filter(id => id !== itemId)
      : [...wishlist, itemId];
    setWishlist(newList);
    if (profile) {
      localStorage.setItem(`wishlist_${profile.id}`, JSON.stringify(newList));
    }
  };

  const isWishlisted = (id) => wishlist.includes(id);

  return { wishlist, toggle, isWishlisted };
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

  const addPoints = async (userId, actionId, actionName, points, isHighValue = false) => {
    await supabase.from('activities').insert({
      user_id: userId,
      action_id: actionId,
      action_name: actionName,
      points,
      is_high_value: isHighValue,
      source: 'admin',
      added_by: profile.id
    });

    await supabase.from('notifications').insert({
      user_id: userId,
      type: 'points',
      title: `+${points} druifjes! 🍇`,
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
      {/* Animated grapes background */}
      <div style={styles.grapesBackground}>
        {[...Array(12)].map((_, i) => (
          <span key={i} style={{
            ...styles.floatingGrape,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${15 + Math.random() * 10}s`,
            opacity: 0.1 + Math.random() * 0.15,
            fontSize: `${1.5 + Math.random() * 2}rem`
          }}>🍇</span>
        ))}
      </div>

      <div style={styles.authContainer}>
        <div style={styles.authHeader}>
          <div style={styles.authLogoWrap}>
            <span style={styles.authLogo}>🍇</span>
          </div>
          <h1 style={styles.authTitle}>MvdW Rewards</h1>
          <p style={styles.authSubtitle}>Spaar druifjes, kies beloningen</p>
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
              {loading ? '⏳' : mode === 'login' ? 'Inloggen' : 'Account aanmaken'}
            </button>
          </form>
        </div>

        {/* Social Links */}
        <div style={styles.authSocials}>
          <p style={styles.authSocialsLabel}>Volg ons:</p>
          <div style={styles.authSocialLinks}>
            <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" style={styles.authSocialLink}>📸</a>
            <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" style={styles.authSocialLink}>👍</a>
            <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" style={styles.authSocialLink}>💼</a>
            <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener noreferrer" style={styles.authSocialLink}>🎵</a>
          </div>
        </div>

        <p style={styles.authTagline}>Wijn is geen zonde. Geen wijn wel.</p>
      </div>
    </div>
  );
}

// =====================================================
// SOCIAL SECTION COMPONENT
// =====================================================
function SocialSection({ onSubmitClaim, myClaims }) {
  const [showForm, setShowForm] = useState(null);
  const [description, setDescription] = useState('');

  const socialActions = [
    { id: 'like', emoji: '👍', name: 'Like/Comment', points: 5, desc: 'Like of reageer op een MvdW post' },
    { id: 'story', emoji: '📱', name: 'Story', points: 10, desc: 'Deel een story met @meisjesvanwijn tag' },
    { id: 'post', emoji: '📸', name: 'Feed Post', points: 20, desc: 'Plaats een post over MvdW op je feed' },
    { id: 'video', emoji: '🎬', name: 'Video Content', points: 100, desc: 'Maak video content voor onze socials', highValue: true },
  ];

  const pendingCount = (type) => myClaims?.filter(c => c.description?.includes(`[${type}]`) && c.status === 'pending').length || 0;

  const handleSubmit = async (action) => {
    if (!description.trim()) return;
    const success = await onSubmitClaim(action.id, description, action.points);
    if (success) {
      setDescription('');
      setShowForm(null);
    }
  };

  return (
    <div style={styles.socialSection}>
      {/* Platform Links */}
      <div style={styles.platformLinks}>
        <h3 style={styles.sectionTitle}>📱 Onze Socials</h3>
        <p style={styles.sectionDesc}>Klik om direct naar onze pagina te gaan</p>
        <div style={styles.platformGrid}>
          <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" style={styles.platformCard}>
            <span style={styles.platformIcon}>📸</span>
            <span style={styles.platformName}>Instagram</span>
            <span style={styles.platformHandle}>@meisjesvanwijn</span>
          </a>
          <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" style={styles.platformCard}>
            <span style={styles.platformIcon}>👍</span>
            <span style={styles.platformName}>Facebook</span>
            <span style={styles.platformHandle}>Meisjes van de Wijn</span>
          </a>
          <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" style={styles.platformCard}>
            <span style={styles.platformIcon}>💼</span>
            <span style={styles.platformName}>LinkedIn</span>
            <span style={styles.platformHandle}>Company page</span>
          </a>
          <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener noreferrer" style={styles.platformCard}>
            <span style={styles.platformIcon}>🎵</span>
            <span style={styles.platformName}>TikTok</span>
            <span style={styles.platformHandle}>@meisjesvanwijn</span>
          </a>
        </div>
      </div>

      {/* Earn Points */}
      <div style={styles.earnSection}>
        <h3 style={styles.sectionTitle}>🍇 Druifjes Verdienen</h3>
        <p style={styles.sectionDesc}>Meld je actie aan → wij controleren → jij krijgt druifjes!</p>
        
        <div style={styles.actionGrid}>
          {socialActions.map(action => (
            <div key={action.id} style={action.highValue ? styles.actionCardHV : styles.actionCard}>
              {action.highValue && <span style={styles.hvBadgeSmall}>HIGH VALUE</span>}
              <span style={styles.actionEmoji}>{action.emoji}</span>
              <span style={styles.actionName}>{action.name}</span>
              <span style={styles.actionPoints}>+{action.points} 🍇</span>
              <span style={styles.actionDesc}>{action.desc}</span>
              
              {pendingCount(action.id) > 0 && (
                <span style={styles.pendingBadge}>⏳ {pendingCount(action.id)} in review</span>
              )}
              
              <button onClick={() => setShowForm(showForm === action.id ? null : action.id)} style={styles.actionBtn}>
                {showForm === action.id ? '✕ Sluiten' : '+ Aanmelden'}
              </button>

              {showForm === action.id && (
                <div style={styles.actionForm}>
                  <textarea
                    placeholder={`Beschrijf kort wat je hebt gedaan...\n\nBijv: "Gereageerd op de Lakedance post" of "Story gedeeld van wijnproeverij"`}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    style={styles.actionTextarea}
                    rows={3}
                  />
                  <button onClick={() => handleSubmit(action)} style={styles.submitBtn} disabled={!description.trim()}>
                    📤 Versturen ter controle
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =====================================================
// BEAUTIFUL SHOP COMPONENT
// =====================================================
function BeautifulShop({ profile, claims, onClaim, wishlist }) {
  const [filter, setFilter] = useState('all');
  const [selectedReward, setSelectedReward] = useState(null);
  const [claimSuccess, setClaimSuccess] = useState(false);

  const categories = [
    { id: 'all', label: '✨ Alles', color: '#8b5cf6' },
    { id: 'klein', label: '🎁 Klein', color: '#22c55e' },
    { id: 'middel', label: '🎯 Middel', color: '#f59e0b' },
    { id: 'groot', label: '🏆 Groot', color: '#ec4899' },
    { id: 'premium', label: '💎 Premium', color: '#6366f1' },
    { id: 'ultiem', label: '🚀 Ultiem', color: '#ef4444' },
    { id: 'wishlist', label: '❤️ Wishlist', color: '#ec4899' },
  ];

  const filteredRewards = SHOP_ITEMS.filter(r => {
    if (filter === 'all') return true;
    if (filter === 'wishlist') return wishlist.isWishlisted(r.id);
    return r.category === filter;
  });

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

  const getCategoryColor = (cat) => {
    const colors = {
      klein: '#22c55e',
      middel: '#f59e0b',
      groot: '#ec4899',
      premium: '#6366f1',
      ultiem: '#ef4444'
    };
    return colors[cat] || '#8b5cf6';
  };

  return (
    <div style={styles.shopContainer}>
      {/* Header */}
      <div style={styles.shopHeader}>
        <div>
          <h2 style={styles.shopTitle}>🛍️ Beloningen Shop</h2>
          <p style={styles.shopSubtitle}>Wissel je druifjes in voor gave beloningen</p>
        </div>
        <div style={styles.shopBalance}>
          <span style={styles.shopBalanceIcon}>🍇</span>
          <div>
            <span style={styles.shopBalanceValue}>{profile.points}</span>
            <span style={styles.shopBalanceLabel}>druifjes</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={styles.shopFilters}>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            style={{
              ...styles.shopFilterBtn,
              ...(filter === cat.id ? { background: cat.color, color: '#fff', borderColor: cat.color } : {})
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div style={styles.shopGrid}>
        {filteredRewards.map((reward, index) => {
          const affordable = canAfford(reward.points);
          const pending = isPending(reward.id);
          const wishlisted = wishlist.isWishlisted(reward.id);
          const progress = Math.min(100, (profile.points / reward.points) * 100);
          
          return (
            <div 
              key={reward.id} 
              style={{
                ...styles.productCard,
                animationDelay: `${index * 0.05}s`,
              }}
            >
              {/* Category ribbon */}
              <div style={{
                ...styles.categoryRibbon,
                background: getCategoryColor(reward.category)
              }}>
                {reward.category}
              </div>

              {/* Badges */}
              {reward.popular && <span style={styles.popularBadge}>🔥 Populair</span>}

              {/* Wishlist */}
              <button onClick={() => wishlist.toggle(reward.id)} style={styles.wishlistBtn}>
                {wishlisted ? '❤️' : '🤍'}
              </button>

              {/* Image/Emoji */}
              <div style={styles.productVisual}>
                <span style={styles.productEmoji}>{reward.emoji}</span>
                <div style={{
                  ...styles.productGlow,
                  background: `radial-gradient(circle, ${getCategoryColor(reward.category)}40 0%, transparent 70%)`
                }} />
              </div>

              {/* Info */}
              <div style={styles.productInfo}>
                <h3 style={styles.productName}>{reward.name}</h3>
                <p style={styles.productDesc}>{reward.description}</p>
              </div>

              {/* Price & Action */}
              <div style={styles.productFooter}>
                <div style={styles.productPrice}>
                  <span style={styles.priceValue}>{reward.points}</span>
                  <span style={styles.priceGrape}>🍇</span>
                </div>

                {pending ? (
                  <div style={styles.pendingStatus}>
                    <span>⏳ Aangevraagd</span>
                  </div>
                ) : affordable ? (
                  <button onClick={() => setSelectedReward(reward)} style={styles.claimBtn}>
                    Claim! →
                  </button>
                ) : (
                  <div style={styles.needMore}>
                    <span>Nog {reward.points - profile.points} 🍇</span>
                  </div>
                )}
              </div>

              {/* Progress bar */}
              {!affordable && !pending && (
                <div style={styles.progressBarWrap}>
                  <div style={{
                    ...styles.progressBarFill,
                    width: `${progress}%`,
                    background: `linear-gradient(90deg, ${getCategoryColor(reward.category)}, ${getCategoryColor(reward.category)}99)`
                  }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredRewards.length === 0 && (
        <div style={styles.emptyShop}>
          <span style={styles.emptyEmoji}>🍇</span>
          <p>Geen items in deze categorie</p>
        </div>
      )}

      {/* Claim Modal */}
      {selectedReward && (
        <div style={styles.modalOverlay} onClick={() => !claimSuccess && setSelectedReward(null)}>
          <div style={styles.claimModal} onClick={e => e.stopPropagation()}>
            {claimSuccess ? (
              <div style={styles.successAnimation}>
                <div style={styles.successConfetti}>
                  {[...Array(20)].map((_, i) => (
                    <span key={i} style={{
                      ...styles.confettiPiece,
                      left: `${10 + Math.random() * 80}%`,
                      animationDelay: `${Math.random() * 0.5}s`,
                      background: ['#8b5cf6', '#22c55e', '#f59e0b', '#ec4899', '#6366f1'][Math.floor(Math.random() * 5)]
                    }} />
                  ))}
                </div>
                <span style={styles.successEmoji}>🎉</span>
                <h3 style={styles.successTitle}>Aangevraagd!</h3>
                <p style={styles.successText}>We regelen je {selectedReward.name}!</p>
              </div>
            ) : (
              <>
                <div style={styles.modalHeader}>
                  <div style={styles.modalEmojiWrap}>
                    <span style={styles.modalEmoji}>{selectedReward.emoji}</span>
                  </div>
                  <div>
                    <span style={{
                      ...styles.modalCategory,
                      color: getCategoryColor(selectedReward.category)
                    }}>{selectedReward.category}</span>
                    <h3 style={styles.modalTitle}>{selectedReward.name}</h3>
                  </div>
                </div>

                <p style={styles.modalDesc}>{selectedReward.description}</p>

                <div style={styles.modalPriceBox}>
                  <div style={styles.modalPriceRow}>
                    <span>Kosten</span>
                    <span style={styles.modalPriceValue}>{selectedReward.points} 🍇</span>
                  </div>
                  <div style={styles.modalPriceRow}>
                    <span>Je saldo</span>
                    <span>{profile.points} 🍇</span>
                  </div>
                  <div style={styles.modalDivider} />
                  <div style={styles.modalPriceRow}>
                    <span>Na claim</span>
                    <span style={{
                      color: profile.points - selectedReward.points >= 0 ? '#22c55e' : '#ef4444',
                      fontWeight: 700
                    }}>
                      {profile.points - selectedReward.points} 🍇
                    </span>
                  </div>
                </div>

                <div style={styles.modalActions}>
                  <button onClick={() => setSelectedReward(null)} style={styles.modalCancel}>
                    Annuleren
                  </button>
                  <button onClick={handleClaim} style={styles.modalConfirm}>
                    🍇 Claim deze beloning!
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
// MAIN APP
// =====================================================
function MainApp() {
  const { profile, signOut, refreshProfile } = useApp();
  const { profiles } = useProfiles();
  const { actions } = usePointActions();
  const { activities } = useActivities(profile?.id);
  const { claims: socialClaims, submitClaim, approveClaim, rejectClaim } = useSocialClaims();
  const { claims: rewardClaims, createClaim, updateClaim } = useRewardClaims();
  const { referrals, submitReferral, updateReferral, completeReferral } = useReferrals();
  const { canGive, give } = useRecognitions();
  const wishlist = useWishlist();
  const { notifications, unreadCount, markRead } = useNotifications();
  const { addPoints } = useAdminPoints();

  const [view, setView] = useState('dashboard');
  const [adminTab, setAdminTab] = useState('social');
  const [toast, setToast] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);

  const notify = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' });

  // Computed
  const myActivities = activities.filter(a => a.user_id === profile?.id);
  const pendingSocialClaims = socialClaims.filter(c => c.status === 'pending');
  const pendingRewardClaims = rewardClaims.filter(c => c.status === 'pending');
  const pendingReferrals = referrals.filter(r => r.status !== 'completed' && r.status !== 'rejected');

  // Get reward info from hardcoded list
  const getRewardInfo = (rewardId) => SHOP_ITEMS.find(i => i.id === rewardId);

  // Handlers
  const handleSocialSubmit = async (type, desc, points) => {
    const success = await submitClaim(type, desc, points);
    if (success) notify('📤 Aangemeld! We controleren het zo snel mogelijk.');
    return success;
  };

  const handleRewardClaim = async (rewardId, rewardName, points) => {
    const success = await createClaim(rewardId, rewardName, points);
    if (success) notify('🍇 Beloning aangevraagd!');
    refreshProfile();
    return success;
  };

  const handleApproveSocial = async (claim) => {
    const points = parseInt(claim.description.match(/\d+/)?.[0]) || 
      (claim.description.includes('[video]') ? 100 : 
       claim.description.includes('[post]') ? 20 : 
       claim.description.includes('[story]') ? 10 : 5);
    
    await approveClaim(claim.id, points);
    notify(`✅ Goedgekeurd! +${points} druifjes voor ${claim.user?.name}`);
    refreshProfile();
  };

  const handleRejectSocial = async (claim) => {
    await rejectClaim(claim.id);
    notify('❌ Afgewezen');
  };

  const handleApproveReward = async (claim) => {
    const reward = getRewardInfo(claim.reward_id);
    await updateClaim(claim.id, 'approved', reward?.name);
    notify(`✅ ${reward?.name || 'Beloning'} goedgekeurd voor ${claim.user?.name}`);
    refreshProfile();
  };

  const handleGiveRecognition = async (userId, userName) => {
    await give(userId, userName);
    notify(`❤️ Je hebt ${userName} gewaardeerd!`);
    refreshProfile();
  };

  const handleSubmitReferral = async (name, contact) => {
    await submitReferral(name, contact);
    notify('👥 Collega aangedragen!');
  };

  if (!profile) return <div style={styles.loading}>Laden...</div>;

  return (
    <div style={styles.app}>
      {/* Toast */}
      {toast && (
        <div style={{
          ...styles.toast,
          background: toast.type === 'error' ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #8b5cf6, #6366f1)'
        }}>
          {toast.msg}
        </div>
      )}

      {/* Notifications Panel */}
      {showNotifications && (
        <div style={styles.notifOverlay} onClick={() => setShowNotifications(false)}>
          <div style={styles.notifPanel} onClick={e => e.stopPropagation()}>
            <div style={styles.notifHeader}>
              <h3>🔔 Notificaties</h3>
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
          <span style={styles.headerLogo}>🍇</span>
          <h1 style={styles.headerTitle}>MvdW Rewards</h1>
        </div>
        <div style={styles.headerRight}>
          <div style={styles.headerPoints}>
            <span style={styles.headerPointsValue}>{profile.points}</span>
            <span style={styles.headerPointsIcon}>🍇</span>
          </div>
          <button onClick={() => { setShowNotifications(true); markRead(); }} style={styles.headerBtn}>
            🔔{unreadCount > 0 && <span style={styles.badge}>{unreadCount}</span>}
          </button>
          <button onClick={signOut} style={styles.headerBtn}>{profile.avatar || '👤'}</button>
        </div>
      </header>

      {/* Nav */}
      <nav style={styles.nav}>
        {[
          { id: 'dashboard', icon: '🏠', label: 'Home' },
          { id: 'earn', icon: '🍇', label: 'Verdienen' },
          { id: 'shop', icon: '🛍️', label: 'Shop' },
          { id: 'team', icon: '👥', label: 'Team' },
        ].map(item => (
          <button key={item.id} onClick={() => setView(item.id)} style={view === item.id ? styles.navActive : styles.navBtn}>
            <span style={styles.navIcon}>{item.icon}</span>
            <span style={styles.navLabel}>{item.label}</span>
          </button>
        ))}
        {profile.is_admin && (
          <button onClick={() => setView('admin')} style={view === 'admin' ? styles.navActive : styles.navBtn}>
            <span style={styles.navIcon}>🔐</span>
            <span style={styles.navLabel}>Admin</span>
            {(pendingSocialClaims.length + pendingRewardClaims.length) > 0 && (
              <span style={styles.navBadge}>{pendingSocialClaims.length + pendingRewardClaims.length}</span>
            )}
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
                <span style={styles.heroGreeting}>Hey {profile.name}! 👋</span>
                <div style={styles.heroPointsRow}>
                  <span style={styles.heroPoints}>{profile.points}</span>
                  <span style={styles.heroGrape}>🍇</span>
                </div>
                <span style={styles.heroLabel}>druifjes gespaard</span>
              </div>
              <div style={styles.heroDecor}>
                <span style={styles.heroGrapeLarge}>🍇</span>
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

            {/* Quick Social Links */}
            <div style={styles.quickSocials}>
              <h3 style={styles.quickSocialsTitle}>📱 Snel naar onze socials</h3>
              <div style={styles.quickSocialGrid}>
                <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" style={styles.quickSocialBtn}>📸 Instagram</a>
                <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" style={styles.quickSocialBtn}>👍 Facebook</a>
                <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" style={styles.quickSocialBtn}>💼 LinkedIn</a>
                <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener noreferrer" style={styles.quickSocialBtn}>🎵 TikTok</a>
              </div>
            </div>

            {/* Pending claims */}
            {socialClaims.filter(c => c.user_id === profile.id && c.status === 'pending').length > 0 && (
              <div style={styles.pendingCard}>
                <span style={styles.pendingIcon}>⏳</span>
                <div>
                  <strong>Je hebt claims in review</strong>
                  <span style={styles.pendingCount}>
                    {socialClaims.filter(c => c.user_id === profile.id && c.status === 'pending').length} wachten op goedkeuring
                  </span>
                </div>
              </div>
            )}

            {/* Recent Activity */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>📜 Recente activiteit</h3>
              {myActivities.length === 0 ? (
                <p style={styles.empty}>Nog geen activiteit - begin met druifjes verdienen! 🍇</p>
              ) : (
                <div style={styles.activityList}>
                  {myActivities.slice(0, 5).map(a => (
                    <div key={a.id} style={a.is_high_value ? styles.activityItemHV : styles.activityItem}>
                      <div style={styles.activityInfo}>
                        {a.is_high_value && <span style={styles.hvBadge}>HIGH VALUE</span>}
                        <span style={styles.activityName}>{a.action_name}</span>
                        <span style={styles.activityDate}>{formatDate(a.created_at)}</span>
                      </div>
                      <span style={styles.activityPoints}>+{a.points} 🍇</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* EARN */}
        {view === 'earn' && (
          <div style={styles.earnView}>
            <SocialSection 
              onSubmitClaim={handleSocialSubmit} 
              myClaims={socialClaims.filter(c => c.user_id === profile.id)} 
            />

            {/* Referral */}
            <div style={styles.referralSection}>
              <h3 style={styles.sectionTitle}>👥 Ambassadeur Programma</h3>
              <p style={styles.sectionDesc}>Draag een nieuwe collega aan en verdien <strong>100 druifjes</strong> als zij 3 shifts hebben gewerkt!</p>
              
              <div style={styles.referralForm}>
                <input type="text" placeholder="Naam van de persoon" id="refName" style={styles.input} />
                <input type="text" placeholder="Telefoonnummer of email" id="refContact" style={styles.input} />
                <button onClick={() => {
                  const name = document.getElementById('refName');
                  const contact = document.getElementById('refContact');
                  if (name.value && contact.value) {
                    handleSubmitReferral(name.value, contact.value);
                    name.value = '';
                    contact.value = '';
                  }
                }} style={styles.referralBtn}>
                  👥 Aandragen
                </button>
              </div>

              {/* My referrals */}
              {referrals.filter(r => r.referrer_id === profile.id).length > 0 && (
                <div style={styles.myReferrals}>
                  <h4 style={styles.myReferralsTitle}>Jouw referrals:</h4>
                  {referrals.filter(r => r.referrer_id === profile.id).map(r => (
                    <div key={r.id} style={styles.referralCard}>
                      <div>
                        <strong>{r.colleague_name}</strong>
                        <span style={styles.referralStatus}>
                          {r.status === 'submitted' && '📝 Aangemeld'}
                          {r.status === 'hired' && '✅ Aangenomen'}
                          {r.status === 'active' && `👔 ${r.shifts_worked}/${r.shifts_required} shifts`}
                          {r.status === 'completed' && '🎉 Voltooid! +100 🍇'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SHOP */}
        {view === 'shop' && (
          <BeautifulShop 
            profile={profile}
            claims={rewardClaims}
            onClaim={handleRewardClaim}
            wishlist={wishlist}
          />
        )}

        {/* TEAM */}
        {view === 'team' && (
          <div style={styles.teamView}>
            <h2 style={styles.pageTitle}>👥 Team</h2>

            {/* Recognition */}
            <div style={styles.recognitionCard}>
              <h3>❤️ Waardeer een collega</h3>
              <p>Geef +20 druifjes aan iemand die het verdient (1x per kwartaal)</p>
              <span style={canGive() ? styles.canRecognize : styles.cantRecognize}>
                {canGive() ? '✅ Je kunt nog waarderen' : '⏳ Al gewaardeerd dit kwartaal'}
              </span>
            </div>

            <div style={styles.colleagueGrid}>
              {profiles.filter(p => p.id !== profile.id).map(p => (
                <div key={p.id} style={styles.colleagueCard}>
                  <span style={styles.colleagueAvatar}>{p.avatar || '👤'}</span>
                  <h4 style={styles.colleagueName}>{p.name}</h4>
                  <span style={styles.colleagueRole}>{p.role}</span>
                  <span style={styles.colleaguePoints}>{p.points} 🍇</span>
                  <button 
                    onClick={() => handleGiveRecognition(p.id, p.name)}
                    disabled={!canGive()}
                    style={canGive() ? styles.giveBtn : styles.giveBtnDisabled}
                  >
                    ❤️ Waardeer
                  </button>
                </div>
              ))}
            </div>

            {/* Leaderboard */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>🏆 Leaderboard</h3>
              <div style={styles.leaderboard}>
                {[...profiles].sort((a, b) => b.points - a.points).map((p, i) => (
                  <div key={p.id} style={p.id === profile.id ? styles.leaderRowMe : styles.leaderRow}>
                    <span style={i < 3 ? styles[`rank${i + 1}`] : styles.rank}>{i + 1}</span>
                    <span style={styles.leaderAvatar}>{p.avatar || '👤'}</span>
                    <div style={styles.leaderInfo}>
                      <span style={styles.leaderName}>{p.name} {p.id === profile.id && '(jij)'}</span>
                      <span style={styles.leaderRole}>{p.role}</span>
                    </div>
                    <span style={styles.leaderPoints}>{p.points} 🍇</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ADMIN */}
        {view === 'admin' && profile.is_admin && (
          <div style={styles.adminView}>
            <h2 style={styles.pageTitle}>🔐 Admin Panel</h2>

            <div style={styles.adminTabs}>
              {[
                { id: 'social', label: `Social (${pendingSocialClaims.length})` },
                { id: 'rewards', label: `Shop (${pendingRewardClaims.length})` },
                { id: 'referrals', label: `Referrals (${pendingReferrals.length})` },
                { id: 'points', label: 'Druifjes Geven' },
              ].map(t => (
                <button key={t.id} onClick={() => setAdminTab(t.id)} style={adminTab === t.id ? styles.adminTabActive : styles.adminTabBtn}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Social Claims */}
            {adminTab === 'social' && (
              <div style={styles.adminSection}>
                <h3 style={styles.adminSectionTitle}>Social Media Claims ter controle</h3>
                {pendingSocialClaims.length === 0 ? (
                  <p style={styles.empty}>Geen claims in de wacht 🎉</p>
                ) : (
                  <div style={styles.adminList}>
                    {pendingSocialClaims.map(c => {
                      const type = c.description.match(/\[(.*?)\]/)?.[1] || 'onbekend';
                      const desc = c.description.replace(/\[.*?\]\s*/, '');
                      const points = type === 'video' ? 100 : type === 'post' ? 20 : type === 'story' ? 10 : 5;
                      
                      return (
                        <div key={c.id} style={styles.adminCard}>
                          <div style={styles.adminCardHeader}>
                            <span style={styles.adminCardAvatar}>{c.user?.avatar || '👤'}</span>
                            <div>
                              <strong>{c.user?.name}</strong>
                              <span style={styles.adminCardType}>{type} • +{points} 🍇</span>
                            </div>
                          </div>
                          <p style={styles.adminCardDesc}>{desc}</p>
                          <div style={styles.adminCardActions}>
                            <button onClick={() => handleApproveSocial(c)} style={styles.approveBtn}>✅ +{points} 🍇</button>
                            <button onClick={() => handleRejectSocial(c)} style={styles.rejectBtn}>❌</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Reward Claims */}
            {adminTab === 'rewards' && (
              <div style={styles.adminSection}>
                <h3 style={styles.adminSectionTitle}>Beloning Aanvragen</h3>
                {pendingRewardClaims.length === 0 ? (
                  <p style={styles.empty}>Geen aanvragen</p>
                ) : (
                  <div style={styles.adminList}>
                    {pendingRewardClaims.map(c => {
                      const reward = getRewardInfo(c.reward_id);
                      return (
                        <div key={c.id} style={styles.adminCard}>
                          <div style={styles.adminCardHeader}>
                            <span style={styles.adminCardEmoji}>{reward?.emoji || '🎁'}</span>
                            <div>
                              <strong>{c.user?.name}</strong> wil
                              <span style={styles.adminCardReward}>{reward?.name || 'Onbekend'}</span>
                              <span style={styles.adminCardType}>{c.points_cost} 🍇</span>
                            </div>
                          </div>
                          <div style={styles.adminCardActions}>
                            <button onClick={() => handleApproveReward(c)} style={styles.approveBtn}>✅ Leveren</button>
                            <button onClick={() => updateClaim(c.id, 'rejected')} style={styles.rejectBtn}>❌</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Referrals */}
            {adminTab === 'referrals' && (
              <div style={styles.adminSection}>
                <h3 style={styles.adminSectionTitle}>Referral Programma</h3>
                {referrals.length === 0 ? (
                  <p style={styles.empty}>Geen referrals</p>
                ) : (
                  <div style={styles.adminList}>
                    {referrals.map(r => (
                      <div key={r.id} style={styles.adminCard}>
                        <div style={styles.adminCardHeader}>
                          <span style={styles.adminCardAvatar}>{r.referrer?.avatar || '👤'}</span>
                          <div>
                            <strong>{r.colleague_name}</strong>
                            <span style={styles.adminCardType}>Aangedragen door {r.referrer?.name}</span>
                          </div>
                        </div>
                        <div style={styles.shiftsTracker}>
                          <span>Shifts: {r.shifts_worked} / {r.shifts_required}</span>
                          <div style={styles.shiftsBar}>
                            <div style={{...styles.shiftsFill, width: `${(r.shifts_worked / r.shifts_required) * 100}%`}} />
                          </div>
                        </div>
                        <div style={styles.adminCardActions}>
                          {r.status === 'submitted' && (
                            <button onClick={() => updateReferral(r.id, { status: 'active' })} style={styles.hireBtn}>
                              ✅ Aangenomen
                            </button>
                          )}
                          {r.status === 'active' && (
                            <>
                              <button onClick={() => updateReferral(r.id, { shifts_worked: r.shifts_worked + 1 })} style={styles.shiftBtn}>
                                +1 Shift
                              </button>
                              {r.shifts_worked >= r.shifts_required && (
                                <button onClick={() => completeReferral(r)} style={styles.awardBtn}>
                                  🎉 +100 🍇
                                </button>
                              )}
                            </>
                          )}
                          {r.status === 'completed' && <span style={styles.completedBadge}>✅ Voltooid</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Manual Points */}
            {adminTab === 'points' && (
              <div style={styles.adminSection}>
                <h3 style={styles.adminSectionTitle}>Druifjes Toekennen</h3>
                <div style={styles.pointsForm}>
                  <select id="adminUser" style={styles.select}>
                    <option value="">Selecteer teamlid...</option>
                    {profiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                  <select id="adminAction" style={styles.select}>
                    <option value="">Selecteer actie...</option>
                    {actions.filter(a => !a.is_self_claimable).map(a => (
                      <option key={a.id} value={`${a.id}|${a.name}|${a.points}`}>
                        {a.emoji} {a.name} (+{a.points})
                      </option>
                    ))}
                  </select>
                  <button onClick={() => {
                    const userEl = document.getElementById('adminUser');
                    const actionEl = document.getElementById('adminAction');
                    if (userEl.value && actionEl.value) {
                      const [actionId, actionName, points] = actionEl.value.split('|');
                      const user = profiles.find(p => p.id === userEl.value);
                      addPoints(userEl.value, actionId, actionName, parseInt(points));
                      notify(`✅ +${points} druifjes voor ${user?.name}!`);
                      userEl.value = '';
                      actionEl.value = '';
                      refreshProfile();
                    }
                  }} style={styles.adminBtn}>
                    🍇 Toekennen
                  </button>
                </div>
              </div>
            )}
          </div>
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
        <span style={styles.loadingLogo}>🍇</span>
        <span style={styles.loadingText}>Laden...</span>
      </div>
    );
  }

  return session ? <MainApp /> : <AuthScreen />;
}

// =====================================================
// STYLES
// =====================================================
const styles = {
  // Loading
  loadingScreen: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1a0a2e, #0a0a1a)', gap: '1rem' },
  loadingLogo: { fontSize: '4rem', animation: 'pulse 1.5s ease-in-out infinite' },
  loadingText: { color: 'rgba(255,255,255,0.5)', fontSize: '1rem' },
  loading: { padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.5)', background: '#0a0a1a', minHeight: '100vh' },

  // Auth
  authScreen: { minHeight: '100vh', background: 'linear-gradient(135deg, #1a0a2e 0%, #0a0a1a 50%, #1a0a2e 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', fontFamily: "'Inter', -apple-system, sans-serif", position: 'relative', overflow: 'hidden' },
  grapesBackground: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none' },
  floatingGrape: { position: 'absolute', top: '-10%', animation: 'floatDown 20s linear infinite' },
  authContainer: { width: '100%', maxWidth: '400px', position: 'relative', zIndex: 1 },
  authHeader: { textAlign: 'center', marginBottom: '2rem' },
  authLogoWrap: { width: '90px', height: '90px', background: 'linear-gradient(135deg, rgba(139,92,246,0.4), rgba(99,102,241,0.2))', borderRadius: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', backdropFilter: 'blur(10px)', border: '1px solid rgba(139,92,246,0.3)', boxShadow: '0 8px 32px rgba(139,92,246,0.3)' },
  authLogo: { fontSize: '2.75rem' },
  authTitle: { color: '#fff', fontSize: '1.75rem', fontWeight: 700, margin: 0 },
  authSubtitle: { color: 'rgba(255,255,255,0.5)', marginTop: '0.5rem' },
  authCard: { background: 'rgba(255,255,255,0.05)', borderRadius: '24px', padding: '1.5rem', border: '1px solid rgba(139,92,246,0.2)', backdropFilter: 'blur(10px)' },
  authTabs: { display: 'flex', marginBottom: '1.5rem', borderRadius: '12px', overflow: 'hidden', background: 'rgba(255,255,255,0.05)' },
  authTab: { flex: 1, padding: '0.75rem', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.9rem', transition: 'all 0.2s' },
  authTabActive: { flex: 1, padding: '0.75rem', background: 'linear-gradient(135deg, rgba(139,92,246,0.5), rgba(99,102,241,0.5))', border: 'none', color: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.9rem', fontWeight: 600 },
  authForm: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  authInput: { padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '12px', color: '#fff', fontFamily: 'inherit', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s' },
  authError: { color: '#ef4444', fontSize: '0.85rem', margin: 0, padding: '0.75rem', background: 'rgba(239,68,68,0.1)', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)' },
  authButton: { padding: '1rem', background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', border: 'none', borderRadius: '12px', color: '#fff', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', fontSize: '1rem', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: '0 4px 20px rgba(139,92,246,0.4)' },
  authSocials: { textAlign: 'center', marginTop: '2rem' },
  authSocialsLabel: { color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginBottom: '0.75rem' },
  authSocialLinks: { display: 'flex', justifyContent: 'center', gap: '0.75rem' },
  authSocialLink: { width: '48px', height: '48px', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', textDecoration: 'none', transition: 'transform 0.2s, background 0.2s' },
  authTagline: { color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: '2rem', fontStyle: 'italic', fontSize: '0.85rem' },

  // App
  app: { minHeight: '100vh', background: 'linear-gradient(180deg, #1a0a2e, #0a0a1a)', fontFamily: "'Inter', -apple-system, sans-serif", color: '#fff' },

  // Toast
  toast: { position: 'fixed', top: '1rem', left: '50%', transform: 'translateX(-50%)', padding: '1rem 1.5rem', borderRadius: '50px', color: '#fff', fontWeight: 600, fontSize: '0.9rem', zIndex: 9999, boxShadow: '0 10px 40px rgba(139,92,246,0.4)', animation: 'slideDown 0.3s ease' },

  // Notifications
  notifOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000 },
  notifPanel: { position: 'absolute', right: 0, top: 0, bottom: 0, width: '100%', maxWidth: '360px', background: 'linear-gradient(180deg, #1a0a2e, #0a0a1a)', padding: '1rem', overflowY: 'auto', borderLeft: '1px solid rgba(139,92,246,0.2)' },
  notifHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(139,92,246,0.2)' },
  notifMarkRead: { background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', cursor: 'pointer' },
  notifEmpty: { color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '2rem' },
  notifList: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  notifItem: { padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.85rem' },
  notifItemUnread: { padding: '0.75rem', background: 'rgba(139,92,246,0.15)', borderRadius: '12px', borderLeft: '3px solid #8b5cf6', display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.85rem' },
  notifTime: { fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' },

  // Header
  header: { background: 'rgba(26,10,46,0.95)', backdropFilter: 'blur(10px)', padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(139,92,246,0.15)', position: 'sticky', top: 0, zIndex: 100 },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  headerLogo: { fontSize: '1.5rem' },
  headerTitle: { fontSize: '1.1rem', fontWeight: 700, margin: 0, background: 'linear-gradient(135deg, #fff, #c4b5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  headerPoints: { background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(139,92,246,0.1))', border: '1px solid rgba(139,92,246,0.4)', padding: '0.4rem 0.75rem', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '0.35rem' },
  headerPointsValue: { color: '#c4b5fd', fontWeight: 700, fontSize: '1rem' },
  headerPointsIcon: { fontSize: '1rem' },
  headerBtn: { background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.2)', width: '40px', height: '40px', borderRadius: '12px', cursor: 'pointer', fontSize: '1.2rem', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: '-2px', right: '-2px', background: '#ef4444', color: '#fff', fontSize: '0.55rem', fontWeight: 700, padding: '2px 5px', borderRadius: '10px', minWidth: '16px', textAlign: 'center' },

  // Nav
  nav: { background: 'rgba(139,92,246,0.05)', padding: '0.5rem', display: 'flex', gap: '0.25rem', borderBottom: '1px solid rgba(139,92,246,0.1)' },
  navBtn: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.15rem', padding: '0.6rem 0.25rem', background: 'transparent', border: 'none', borderRadius: '12px', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', fontFamily: 'inherit', position: 'relative', transition: 'all 0.2s' },
  navActive: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.15rem', padding: '0.6rem 0.25rem', background: 'linear-gradient(135deg, rgba(139,92,246,0.4), rgba(139,92,246,0.15))', border: 'none', borderRadius: '12px', cursor: 'pointer', color: '#fff', fontFamily: 'inherit', position: 'relative' },
  navIcon: { fontSize: '1.25rem' },
  navLabel: { fontSize: '0.65rem', fontWeight: 500 },
  navBadge: { position: 'absolute', top: '2px', right: '10%', background: '#ef4444', color: '#fff', fontSize: '0.55rem', fontWeight: 700, padding: '1px 4px', borderRadius: '6px' },

  // Main
  main: { padding: '1rem', maxWidth: '600px', margin: '0 auto' },

  // Dashboard
  dashboard: { display: 'flex', flexDirection: 'column', gap: '1rem' },

  // Hero
  heroCard: { background: 'linear-gradient(135deg, #2d1b4e, #1a0a2e)', borderRadius: '24px', padding: '1.5rem', position: 'relative', overflow: 'hidden', border: '1px solid rgba(139,92,246,0.3)' },
  heroContent: { position: 'relative', zIndex: 1 },
  heroGreeting: { color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' },
  heroPointsRow: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' },
  heroPoints: { fontSize: '3.5rem', fontWeight: 800, background: 'linear-gradient(135deg, #c4b5fd, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  heroGrape: { fontSize: '2rem' },
  heroLabel: { color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', display: 'block', marginTop: '0.25rem' },
  heroDecor: { position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.15 },
  heroGrapeLarge: { fontSize: '8rem' },

  // Stats
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' },
  statCard: { background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '16px', padding: '1rem', textAlign: 'center' },
  statValue: { display: 'block', fontSize: '1.5rem', fontWeight: 700, color: '#c4b5fd' },
  statLabel: { fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' },

  // Quick Socials
  quickSocials: { background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '16px', padding: '1rem' },
  quickSocialsTitle: { fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem' },
  quickSocialGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' },
  quickSocialBtn: { background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '12px', padding: '0.75rem 0.5rem', textAlign: 'center', color: '#fff', textDecoration: 'none', fontSize: '0.7rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', transition: 'all 0.2s' },

  // Pending Card
  pendingCard: { background: 'linear-gradient(135deg, rgba(251,191,36,0.15), rgba(251,191,36,0.05))', border: '1px solid rgba(251,191,36,0.3)', borderRadius: '16px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' },
  pendingIcon: { fontSize: '2rem' },
  pendingCount: { display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' },

  // Section
  section: { background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '16px', padding: '1rem' },
  sectionTitle: { fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' },
  sectionDesc: { color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginBottom: '1rem' },
  empty: { color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '2rem' },

  // Activity
  activityList: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  activityItem: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' },
  activityItemHV: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'linear-gradient(90deg, rgba(251,191,36,0.15), rgba(251,191,36,0.02))', borderRadius: '12px', border: '1px solid rgba(251,191,36,0.3)' },
  activityInfo: { flex: 1, minWidth: 0 },
  activityName: { display: 'block', fontSize: '0.85rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  activityDate: { display: 'block', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' },
  activityPoints: { fontWeight: 700, color: '#c4b5fd', fontSize: '0.95rem', marginLeft: '1rem' },
  hvBadge: { display: 'inline-block', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', fontSize: '0.55rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', marginRight: '0.5rem', marginBottom: '0.125rem' },
  hvBadgeSmall: { position: 'absolute', top: '0.5rem', left: '0.5rem', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', fontSize: '0.5rem', fontWeight: 700, padding: '2px 5px', borderRadius: '4px' },

  // Social Section
  socialSection: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  platformLinks: { background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '20px', padding: '1.25rem' },
  platformGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' },
  platformCard: { background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(139,92,246,0.05))', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '16px', padding: '1rem', textDecoration: 'none', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', transition: 'all 0.2s' },
  platformIcon: { fontSize: '2rem' },
  platformName: { fontWeight: 600, fontSize: '0.9rem' },
  platformHandle: { color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' },

  // Earn Section
  earnView: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  earnSection: { background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '20px', padding: '1.25rem' },
  actionGrid: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  actionCard: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '16px', padding: '1rem', position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  actionCardHV: { background: 'linear-gradient(135deg, rgba(251,191,36,0.1), rgba(251,191,36,0.02))', border: '1px solid rgba(251,191,36,0.3)', borderRadius: '16px', padding: '1rem', position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  actionEmoji: { fontSize: '1.5rem' },
  actionName: { fontWeight: 600, fontSize: '1rem' },
  actionPoints: { color: '#c4b5fd', fontWeight: 700, fontSize: '0.9rem' },
  actionDesc: { color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' },
  pendingBadge: { background: 'rgba(251,191,36,0.15)', color: '#fbbf24', padding: '0.25rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', alignSelf: 'flex-start' },
  actionBtn: { background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', color: '#fff', border: 'none', padding: '0.6rem 1rem', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.85rem', alignSelf: 'flex-start', marginTop: '0.25rem' },
  actionForm: { marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  actionTextarea: { padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '10px', color: '#fff', fontFamily: 'inherit', fontSize: '0.9rem', resize: 'none', outline: 'none' },
  submitBtn: { background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#fff', border: 'none', padding: '0.75rem', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },

  // Referral
  referralSection: { background: 'linear-gradient(135deg, rgba(236,72,153,0.1), rgba(236,72,153,0.02))', border: '1px solid rgba(236,72,153,0.2)', borderRadius: '20px', padding: '1.25rem' },
  referralForm: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  input: { padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '10px', color: '#fff', fontFamily: 'inherit', fontSize: '0.9rem', outline: 'none' },
  referralBtn: { background: 'linear-gradient(135deg, #ec4899, #db2777)', color: '#fff', border: 'none', padding: '0.75rem', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
  myReferrals: { marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(236,72,153,0.2)' },
  myReferralsTitle: { fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' },
  referralCard: { background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '0.75rem', marginBottom: '0.5rem' },
  referralStatus: { display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', marginTop: '0.25rem' },

  // Shop
  shopContainer: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  shopHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' },
  shopTitle: { fontSize: '1.5rem', fontWeight: 700, margin: 0 },
  shopSubtitle: { color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginTop: '0.25rem' },
  shopBalance: { background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(139,92,246,0.1))', border: '1px solid rgba(139,92,246,0.4)', borderRadius: '16px', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' },
  shopBalanceIcon: { fontSize: '1.5rem' },
  shopBalanceValue: { display: 'block', color: '#c4b5fd', fontSize: '1.25rem', fontWeight: 800 },
  shopBalanceLabel: { display: 'block', color: 'rgba(196,181,253,0.7)', fontSize: '0.65rem' },
  shopFilters: { display: 'flex', gap: '0.375rem', flexWrap: 'wrap' },
  shopFilterBtn: { background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', padding: '0.5rem 0.875rem', borderRadius: '50px', color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' },
  shopGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' },
  productCard: { background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '20px', padding: '1rem', position: 'relative', display: 'flex', flexDirection: 'column', transition: 'all 0.3s', animation: 'fadeIn 0.5s ease forwards', overflow: 'hidden' },
  categoryRibbon: { position: 'absolute', top: '12px', left: '-30px', padding: '2px 30px', fontSize: '0.55rem', fontWeight: 700, color: '#fff', textTransform: 'uppercase', transform: 'rotate(-45deg)', letterSpacing: '0.5px' },
  popularBadge: { position: 'absolute', top: '0.5rem', right: '2.5rem', background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: '#fff', fontSize: '0.55rem', fontWeight: 700, padding: '3px 6px', borderRadius: '6px' },
  wishlistBtn: { position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'rgba(255,255,255,0.1)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', zIndex: 2 },
  productVisual: { position: 'relative', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem', marginTop: '0.5rem' },
  productEmoji: { fontSize: '3rem', position: 'relative', zIndex: 1 },
  productGlow: { position: 'absolute', width: '70px', height: '70px', borderRadius: '50%' },
  productInfo: { flex: 1 },
  productName: { fontSize: '0.9rem', fontWeight: 600, margin: '0.25rem 0' },
  productDesc: { fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 },
  productFooter: { marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(139,92,246,0.15)' },
  productPrice: { marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' },
  priceValue: { fontSize: '1.25rem', fontWeight: 800, color: '#c4b5fd' },
  priceGrape: { fontSize: '1rem' },
  pendingStatus: { background: 'rgba(251,191,36,0.15)', color: '#fbbf24', padding: '0.5rem', borderRadius: '10px', fontSize: '0.75rem', textAlign: 'center' },
  claimBtn: { width: '100%', background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', color: '#fff', border: 'none', padding: '0.6rem', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.85rem', transition: 'all 0.2s' },
  needMore: { background: 'rgba(139,92,246,0.1)', color: 'rgba(196,181,253,0.7)', padding: '0.5rem', borderRadius: '10px', fontSize: '0.75rem', textAlign: 'center' },
  progressBarWrap: { height: '4px', background: 'rgba(139,92,246,0.2)', borderRadius: '2px', marginTop: '0.5rem', overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: '2px', transition: 'width 0.5s ease' },
  emptyShop: { textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.4)' },
  emptyEmoji: { fontSize: '3rem', display: 'block', marginBottom: '1rem', opacity: 0.5 },

  // Claim Modal
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' },
  claimModal: { background: 'linear-gradient(135deg, #1a0a2e, #0a0a1a)', borderRadius: '24px', padding: '1.5rem', maxWidth: '400px', width: '100%', border: '1px solid rgba(139,92,246,0.3)', position: 'relative', overflow: 'hidden' },
  modalHeader: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' },
  modalEmojiWrap: { width: '64px', height: '64px', background: 'rgba(139,92,246,0.2)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modalEmoji: { fontSize: '2.5rem' },
  modalCategory: { fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase' },
  modalTitle: { fontSize: '1.25rem', fontWeight: 700, margin: '0.25rem 0 0' },
  modalDesc: { color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: 1.5 },
  modalPriceBox: { background: 'rgba(139,92,246,0.1)', borderRadius: '12px', padding: '1rem', marginBottom: '1rem' },
  modalPriceRow: { display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', fontSize: '0.9rem' },
  modalPriceValue: { color: '#c4b5fd', fontWeight: 700 },
  modalDivider: { height: '1px', background: 'rgba(139,92,246,0.2)', margin: '0.25rem 0' },
  modalActions: { display: 'flex', gap: '0.75rem' },
  modalCancel: { flex: 1, background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', padding: '0.875rem', borderRadius: '12px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' },
  modalConfirm: { flex: 1, background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', color: '#fff', border: 'none', padding: '0.875rem', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
  successAnimation: { textAlign: 'center', padding: '2rem 0', position: 'relative' },
  successConfetti: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' },
  confettiPiece: { position: 'absolute', width: '8px', height: '8px', borderRadius: '2px', animation: 'confettiFall 1s ease-out forwards' },
  successEmoji: { fontSize: '4rem', display: 'block', marginBottom: '1rem', animation: 'bounce 0.5s ease' },
  successTitle: { fontSize: '1.5rem', fontWeight: 700, margin: 0 },
  successText: { color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem' },

  // Team
  teamView: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  pageTitle: { fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' },
  recognitionCard: { background: 'linear-gradient(135deg, rgba(236,72,153,0.15), rgba(236,72,153,0.05))', border: '1px solid rgba(236,72,153,0.3)', borderRadius: '20px', padding: '1.25rem', textAlign: 'center' },
  canRecognize: { display: 'inline-block', background: 'rgba(34,197,94,0.15)', color: '#22c55e', padding: '0.5rem 1rem', borderRadius: '50px', fontSize: '0.8rem', marginTop: '0.5rem' },
  cantRecognize: { display: 'inline-block', background: 'rgba(251,191,36,0.15)', color: '#fbbf24', padding: '0.5rem 1rem', borderRadius: '50px', fontSize: '0.8rem', marginTop: '0.5rem' },
  colleagueGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' },
  colleagueCard: { background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '16px', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' },
  colleagueAvatar: { fontSize: '2.5rem', marginBottom: '0.5rem' },
  colleagueName: { fontWeight: 600, margin: 0, fontSize: '0.95rem' },
  colleagueRole: { color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' },
  colleaguePoints: { color: '#c4b5fd', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' },
  giveBtn: { width: '100%', background: 'linear-gradient(135deg, #ec4899, #db2777)', color: '#fff', border: 'none', padding: '0.6rem', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.8rem' },
  giveBtnDisabled: { width: '100%', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)', border: 'none', padding: '0.6rem', borderRadius: '10px', fontFamily: 'inherit', fontSize: '0.8rem', cursor: 'not-allowed' },
  leaderboard: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  leaderRow: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' },
  leaderRowMe: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'linear-gradient(90deg, rgba(139,92,246,0.2), rgba(139,92,246,0.05))', borderRadius: '12px', border: '1px solid rgba(139,92,246,0.4)' },
  rank: { width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)' },
  rank1: { width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#fff' },
  rank2: { width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg, #9ca3af, #6b7280)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#fff' },
  rank3: { width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg, #d97706, #b45309)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#fff' },
  leaderAvatar: { fontSize: '1.5rem' },
  leaderInfo: { flex: 1 },
  leaderName: { display: 'block', fontWeight: 600, fontSize: '0.9rem' },
  leaderRole: { display: 'block', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' },
  leaderPoints: { fontWeight: 700, color: '#c4b5fd' },

  // Admin
  adminView: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  adminTabs: { display: 'flex', gap: '0.375rem', flexWrap: 'wrap' },
  adminTabBtn: { background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', padding: '0.5rem 0.75rem', borderRadius: '10px', color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' },
  adminTabActive: { background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', border: '1px solid transparent', padding: '0.5rem 0.75rem', borderRadius: '10px', color: '#fff', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
  adminSection: { background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '16px', padding: '1rem' },
  adminSectionTitle: { fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' },
  adminList: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  adminCard: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '12px', padding: '1rem' },
  adminCardHeader: { display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' },
  adminCardAvatar: { fontSize: '2rem' },
  adminCardEmoji: { fontSize: '2rem' },
  adminCardType: { display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' },
  adminCardReward: { display: 'block', fontWeight: 600, color: '#c4b5fd' },
  adminCardDesc: { color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '0.75rem', padding: '0.5rem', background: 'rgba(139,92,246,0.1)', borderRadius: '8px' },
  adminCardActions: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' },
  approveBtn: { background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.8rem' },
  rejectBtn: { background: 'rgba(239,68,68,0.2)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.8rem' },
  hireBtn: { background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.8rem' },
  shiftBtn: { background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', padding: '0.5rem 0.75rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.8rem' },
  awardBtn: { background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.8rem' },
  completedBadge: { background: 'rgba(34,197,94,0.15)', color: '#22c55e', padding: '0.5rem 1rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 600 },
  shiftsTracker: { marginBottom: '0.75rem' },
  shiftsBar: { height: '6px', background: 'rgba(139,92,246,0.2)', borderRadius: '3px', marginTop: '0.5rem', overflow: 'hidden' },
  shiftsFill: { height: '100%', background: 'linear-gradient(90deg, #22c55e, #16a34a)', borderRadius: '3px', transition: 'width 0.3s ease' },
  pointsForm: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  select: { padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '10px', color: '#fff', fontFamily: 'inherit', fontSize: '0.9rem', outline: 'none' },
  adminBtn: { background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', color: '#fff', border: 'none', padding: '0.875rem', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.9rem' },
};

// Fonts & Animations
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.05); } }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideDown { from { opacity: 0; transform: translate(-50%, -20px); } to { opacity: 1; transform: translate(-50%, 0); } }
    @keyframes bounce { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); } }
    @keyframes floatDown { 0% { transform: translateY(-10vh) rotate(0deg); } 100% { transform: translateY(110vh) rotate(360deg); } }
    @keyframes confettiFall { 0% { opacity: 1; transform: translateY(0) rotate(0deg); } 100% { opacity: 0; transform: translateY(100px) rotate(720deg); } }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.3); }
    a:hover { transform: translateY(-2px); }
    button:hover:not(:disabled) { transform: translateY(-1px); }
    button:active:not(:disabled) { transform: translateY(0); }
    select option { background: #1a0a2e; color: #fff; }
  `;
  document.head.appendChild(style);
}
