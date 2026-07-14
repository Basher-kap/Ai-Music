// app/auth/callback.tsx

import { router } from "expo-router";
import { supabase } from "@/utils/supabase";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { AppMetrics } from "expo-observe";

export default function AuthCallback() {
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            AppMetrics.markInteractive();
            if (session) {
                router.replace('/(tabs)'); // redirect to home after successful login
            } else {
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