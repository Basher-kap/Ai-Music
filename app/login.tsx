// app/login.tsx
import { useTextTheme } from "@/context";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from "@/store/AuthContext";

export default function Login() {
  const { ThemeTextStyles } = useTextTheme();
  const { signInWithGoogle } = useAuth();

  return (
    <View style={styles.container}>

      {/* Branding */}
      <View style={styles.brandSection}>
        <Text style={ThemeTextStyles.appTitle}>Ai Music</Text>
        <Text style={ThemeTextStyles.tagline}>your music, your mood</Text>
      </View>

      {/* Actions */}
      <View style={styles.actionSection}>
        <TouchableOpacity
          style={styles.googleButton}
          activeOpacity={0.85}
          onPress={signInWithGoogle}
        >
          <Ionicons name="logo-google" size={20} color="#000000" />
          <Text style={styles.googleButtonText}>Continue with Google</Text>
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
});