// app/auth/callback.tsx

import { router } from "expo-router";
import { supabase } from "@/utils/supabase";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useObserve, Observe } from "expo-observe";

export default function AuthCallback() {
    const { markInteractive } = useObserve();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            markInteractive();
            if (session) {
                Observe.logEvent('login_success');
                router.replace('/(tabs)'); // redirect to home after successful login
            } else {
                Observe.logEvent('login_no_session', { severity: 'warn' });
                router.replace('/login'); // redirect to login if no session
            }
        });
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
            <ActivityIndicator size="large" color="#fafafa" />
        </View>
    )
}