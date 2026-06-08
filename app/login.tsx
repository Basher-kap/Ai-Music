// app/login.tsx
import { useTextTheme } from "@/context";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from "@/store/AuthContext";
import { useState } from "react";

export default function Login() {
  const { ThemeTextStyles } = useTextTheme();
  const { signInWithGoogle } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);

  const handleGoogleSignIn = async () => {
    setError(null);
    setSigningIn(true);

    const errorMessage = await signInWithGoogle();

    setSigningIn(false);

    if (errorMessage) {
      setError(errorMessage);
    }
  }
  return (
    <View style={styles.container}>

      {/* Branding */}
      <View style={styles.brandSection}>
        <Text style={ThemeTextStyles.appTitle}>Ai Music</Text>
        <Text style={ThemeTextStyles.tagline}>your music, your mood</Text>
      </View>

      {/* Actions */}
      <View style={styles.actionSection}>

        {/* Error message */}
        {error && (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle-outline" size={16} color="#ff4444" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.googleButton}
          activeOpacity={0.85}
          onPress={handleGoogleSignIn}
          disabled={signingIn}
        >
            {signingIn ? (
              <ActivityIndicator size="small" color="#000000" />
            ) : <>
                <Ionicons name="logo-google" size={20} color="#000000" />
                <Text style={styles.googleButtonText}>Continue with Google</Text>
              </>
          }
        </TouchableOpacity>

        <Text style={styles.termsText}>
          By continuing, you agree to discover your harmony.
        </Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
  },
  brandSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionSection: {
    marginBottom: 52,
    gap: 14,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 15,
    gap: 12,
  },
  googleButtonText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '700',
  },
  termsText: {
    color: 'rgba(255, 255, 255, 0.35)',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 68, 68, 0.3)',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    },
    errorText: {
    color: '#ff4444',
    fontSize: 13,
    flex: 1,
    },
});