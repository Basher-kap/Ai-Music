// store/AuthContext.tsx

import { supabase } from "@/utils/supabase";
import { Session, User } from "@supabase/supabase-js";
import React, { useContext, useEffect } from "react";
import { createContext } from "react";
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import * as Linking from 'expo-linking';
import { logger } from "@/utils/logger";
import { Platform } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

type AuthContextType = {
    session: Session | null;
    user: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<string | null>;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    session: null,
    user: null,
    loading: true,
    signInWithGoogle: async () => null,
    signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = React.useState<Session | null>(null);
    const [user, setUser] = React.useState<User | null>(null);
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                logger.log('[Auth] Auth state changed. Event:', _event, '| User:', session?.user?.email ?? 'none');
                setSession(session);
                setUser(session?.user ?? null);
                setLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    // Catch the deep link redirect on Android
    useEffect(() => {
        const handleDeepLink = async (event: { url: string }) => {
        const url = event.url;
        logger.log('[Auth] Deep link received:', url);

        if (!url.includes('auth/callback')) return;

        try {
            const parsed = new URL(url);
            const hashParams = new URLSearchParams(parsed.hash.substring(1));

            const access_token = hashParams.get('access_token');
            const refresh_token = hashParams.get('refresh_token');
            const code = parsed.searchParams.get('code');

            if (access_token && refresh_token) {
                // Implicit flow — tokens are directly in the hash
                const { data: sessionData, error: sessionError } =
                    await supabase.auth.setSession({ access_token, refresh_token });

                if (sessionError) throw sessionError;
                logger.log('[Auth] ✓ Session set via hash tokens');
                logger.log('[Auth] ✓ Logged in as:', sessionData.user?.email);

            } else if (code) {
                // PKCE flow — only if a `code` param is actually present
                const { data, error } = await supabase.auth.exchangeCodeForSession(code);
                if (error) throw error;
                logger.log('[Auth] ✓ Session set via PKCE code');
                logger.log('[Auth] ✓ Logged in as:', data.session?.user?.email);

            } else {
                logger.log('[Auth] ✗ No access_token or code found in deep link');
            }
        } catch (err) {
            logger.log('[Auth] ✗ Failed to handle deep link:', err);
        }
    };

        // Handle deep link when app is already open
        const subscription = Linking.addEventListener('url', handleDeepLink);

        // Handle deep link when app was cold-started from the link
        Linking.getInitialURL().then((url) => {
            if (url) handleDeepLink({ url });
        });

        return () => subscription.remove();
    }, []);

    const signInWithGoogle = async (): Promise<string | null> => {
          if (Platform.OS === 'web') {
            // Web: use Supabase's built-in OAuth redirect
            const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
            });
            if (error) console.error(error);
            return null;
        }

        try {
            logger.log('[Auth] Starting Google Sign-In...');

            await WebBrowser.warmUpAsync();

            const redirectUrl = AuthSession.makeRedirectUri({
                scheme: 'aimusic',
                path: 'auth/callback',
            });
            logger.log('[Auth] Redirect URL:', redirectUrl);

            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: redirectUrl,
                    skipBrowserRedirect: true,
                },
            });

            if (error) throw error;
            if (!data.url) throw new Error('No OAuth URL returned');

            logger.log('[Auth] Opening browser...');

            // On Android, openAuthSessionAsync often returns 'dismiss' even on success.
            // The actual session is handled by the Linking deep link listener above.
            const result = await WebBrowser.openAuthSessionAsync(
                data.url,
                redirectUrl,
                { showInRecents: false }
            ) as any;

            logger.log('[Auth] Browser result type:', result.type);

            // 'dismiss' on Android is normal — session arrives via deep link
            if (result.type === 'cancel') {
                return 'Sign in was cancelled.';
            }

            // Don't treat 'dismiss' as an error on Android
            return null;

        } catch (error) {
            console.error('[Auth] Google sign-in error:', error);
            return 'Something went wrong. Please try again.';
        } finally {
            await WebBrowser.coolDownAsync();
        }
    };

    const signOut = async () => {
        try {
            logger.log('[Auth] Signing out...');

            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('signOut timed out')), 8000)
            );

            const { error } = await Promise.race([
                supabase.auth.signOut(),
                timeoutPromise,
            ]) as any;

            if (error) {
                logger.log('[Auth] ✗ signOut error:', error.message);
            } else {
                logger.log('[Auth] ✓ Signed out successfully');
            }
        } catch (err: any) {
            logger.log('[Auth] ✗ signOut failed/timed out:', err.message);
            // Force local sign-out even if network call hangs/fails,
            // so the UI doesn't stay stuck waiting on a dead request
            setSession(null);
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ session, user, loading, signInWithGoogle, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);