import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../config/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session (this will process the OAuth callback if present in URL hash)
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
      }
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // If we have a session from OAuth callback, log it
      if (session?.user) {
        console.log('Session restored:', session.user.email);
      }
    });

    // Listen for auth changes (including OAuth callbacks)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔔 Auth state changed:', {
        event,
        hasSession: !!session,
        userEmail: session?.user?.email,
        userId: session?.user?.id
      });
      
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // When user signs in via OAuth, sync to our backend database
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('✅ User signed in via OAuth:', {
          email: session.user.email,
          id: session.user.id,
          provider: session.user.app_metadata?.provider
        });
        
        // Sync user to our backend database
        (async () => {
          try {
            const { authApi } = await import('../services/api');
            await authApi.syncUser(
              session.user.id,
              session.user.email || '',
              session.user.user_metadata?.full_name || session.user.user_metadata?.name
            );
            console.log('✅ User synced to backend database');
          } catch (error) {
            console.error('❌ Error syncing user to backend:', error);
          }
        })();
      }
      
      if (event === 'TOKEN_REFRESHED') {
        console.log('🔄 Token refreshed');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      if (error) throw error;
      // Note: The actual redirect happens automatically
      // After OAuth callback, the session will be set via onAuthStateChange
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value = {
    user,
    session,
    loading,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

