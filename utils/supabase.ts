// utils/supabase.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// AsyncStorage's web implementation reads/writes `window.localStorage`.
// During Expo Router's static export, pages are pre-rendered once in plain
// Node.js (no `window`), so calling straight into AsyncStorage there throws
// "window is not defined". This adapter no-ops when there's no window
// (i.e. only during that one-time SSR pass) and otherwise behaves exactly
// like AsyncStorage — on native, `window` always exists, so this is a no-op
// change there.
const isBrowser = typeof window !== 'undefined';

const ssrSafeStorage = {
    getItem: (key: string) => (isBrowser ? AsyncStorage.getItem(key) : Promise.resolve(null)),
    setItem: (key: string, value: string) => (isBrowser ? AsyncStorage.setItem(key, value) : Promise.resolve()),
    removeItem: (key: string) => (isBrowser ? AsyncStorage.removeItem(key) : Promise.resolve()),
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: ssrSafeStorage,
        autoRefreshToken: isBrowser,
        persistSession: true,
        detectSessionInUrl: false,
        flowType: 'pkce',
    },
});