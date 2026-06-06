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

        // get current session on app load
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // listen for auth changes (e.g. sign in, sign out)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session);
                setUser(session?.user ?? null);
                setLoading(false);
            } );

        return () => subscription.unsubscribe();
    }, []);
    
    const signInWithGoogle = async () => {
        try {
            const redirectUrl = AuthSession.makeRedirectUri({
                scheme: 'aimusic',
                path: 'auth/callback',
            });

            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: redirectUrl,
                    skipBrowserRedirect: true,
                },
            });

            if (error) throw error;
            if (!data.url) throw new Error('No OAuth URL returned');

            const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

            if (result.type === 'success' && result.url) {
                const url = new URL(result.url);
                const hashParams = new URLSearchParams(url.hash.substring(1)); // strip the '#'

                const access_token = hashParams.get('access_token');
                const refresh_token = hashParams.get('refresh_token');

                if (!access_token || !refresh_token) {
                    throw new Error('Missing tokens in redirect URL');
                }

                const { error: sessionError } = await supabase.auth.setSession({
                    access_token,
                    refresh_token,
                });

                if (sessionError) throw sessionError;
            }
        } catch (error) {
            console.error('Google sign-in error:', error);
        }
    };

    const signOut = async () => {
        setLoading(true);
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ session, user, loading, signInWithGoogle, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);