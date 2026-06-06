// store/AuthContext.tsx

import { supabase } from "@/utils/supabase";
import { Session, User } from "@supabase/supabase-js";
import React, { useContext, useEffect } from "react";
import { createContext } from "react";
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

type AuthContextType = {
    session: Session | null;
    user: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    session: null,
    user: null,
    loading: true,
    signInWithGoogle: async () => {},
    signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = React.useState<Session | null>(null);
    const [user, setUser] = React.useState<User | null>(null);
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        // listen for auth changes (e.g. sign in, sign out)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                console.log('[Auth] Auth state changed. Event:', _event, '| User:', session?.user?.email ?? 'none');
                setSession(session);
                setUser(session?.user ?? null);
                setLoading(false);
            } );

        return () => subscription.unsubscribe();
    }, []);
    
    const signInWithGoogle = async () => {
    try {
        console.log('[Auth] Starting Google Sign-In...');

        await WebBrowser.warmUpAsync();

        const redirectUrl = AuthSession.makeRedirectUri({
        scheme: 'aimusic',
        path: 'auth/callback',
        });
        console.log('[Auth] Redirect URL:', redirectUrl);

        const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: redirectUrl,
            skipBrowserRedirect: true,
        },
        });

        if (error) throw error;
        if (!data.url) throw new Error('No OAuth URL returned');

        const result = await WebBrowser.openAuthSessionAsync(
            data.url,
            redirectUrl,
            { showInRecents: false }  
        );

        console.log('[Auth] Browser result type:', result.type);

        if (result.type === 'success' && result.url) {
        console.log('[Auth] Redirect successful, parsing tokens...');

        const url = new URL(result.url);
        const hashParams = new URLSearchParams(url.hash.substring(1));

        const access_token = hashParams.get('access_token');
        const refresh_token = hashParams.get('refresh_token');

        if (!access_token || !refresh_token) {
            throw new Error('Missing tokens in redirect URL');
        }

        const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
            access_token,
            refresh_token,
        });

        if (sessionError) throw sessionError;

        console.log('[Auth] ✓ Session set successfully');
        console.log('[Auth] ✓ Logged in as:', sessionData.user?.email);
        console.log('[Auth] ✓ User ID:', sessionData.user?.id);
        console.log('[Auth] ✓ Provider:', sessionData.user?.app_metadata?.provider);
        console.log('[Auth] ✓ Full name:', sessionData.user?.user_metadata?.full_name);

        } else if (result.type === 'cancel') {
        console.log('[Auth] ✗ User cancelled.');
        }

    } catch (error) {
        console.error('[Auth] Google sign-in error:', error);
    } finally {
        // Because cooldown must always run to release the browser
        // regardless of success or failure
        await WebBrowser.coolDownAsync();
    }
    };

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ session, user, loading, signInWithGoogle, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);