// app/private/admin.tsx
import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTextTheme } from '@/context';
import { useAuth } from '@/store';
import { supabase } from '@/utils/supabase';
import { HEADER_HEIGHT, HEADER_PADDING_TOP } from '@/constant';

// Because only you can access this page
const ADMIN_USER_ID = process.env.EXPO_PUBLIC_ADMIN_USER_ID;

type DailySong = {
  daily_song_title: string | null;
  daily_song_artist: string | null;
  daily_song_url: string | null;
  updated_at: string | null;
};

export default function Admin() {
  const { ThemeTextStyles } = useTextTheme();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [currentSong, setCurrentSong] = useState<DailySong | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Because only admin can see this page
  useEffect(() => {
  if (user && user.id !== ADMIN_USER_ID) {
        router.replace('/(tabs)'); 
    }
  }, [user]);

  // Fetch current daily song on mount
  useEffect(() => {
    fetchCurrentSong();
  }, []);

  const fetchCurrentSong = async () => {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (!error && data) {
      setCurrentSong(data);
      setTitle(data.daily_song_title ?? '');
      setArtist(data.daily_song_artist ?? '');
    }
    setLoading(false);
  };

  const handlePickAndUpload = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'audio/mpeg',
      copyToCacheDirectory: true,
    });

    if (result.canceled) return;

    const file = result.assets[0];
    setUploading(true);

    try {
      console.log('[Admin] Uploading daily song:', file.name);

      const base64 = await FileSystem.readAsStringAsync(file.uri, {
        encoding: 'base64',
      });

      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Because daily song lives in its own folder in storage
      const filePath = `daily/daily_song.mp3`;

      const { error: uploadError } = await supabase.storage
        .from('songs-audio')
        .upload(filePath, bytes, {
          contentType: 'audio/mpeg',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('songs-audio')
        .getPublicUrl(filePath);

      console.log('[Admin] ✓ Daily song uploaded:', data.publicUrl);

      // Save URL to settings table immediately
      const { error: updateError } = await supabase
        .from('settings')
        .update({ daily_song_url: data.publicUrl, updated_at: new Date().toISOString() })
        .eq('id', 1);

      if (updateError) throw updateError;

      setCurrentSong(prev => prev ? { ...prev, daily_song_url: data.publicUrl } : null);
      console.log('[Admin] ✓ Daily song URL saved to settings');
      Alert.alert('Success', 'Audio uploaded successfully!');

    } catch (err: any) {
      console.error('[Admin] Upload error:', err.message);
      Alert.alert('Error', 'Failed to upload audio. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !artist.trim()) {
      Alert.alert('Error', 'Please fill in both title and artist.');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('settings')
        .update({
          daily_song_title: title.trim(),
          daily_song_artist: artist.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', 1);

      if (error) throw error;

      setCurrentSong(prev => prev ? {
        ...prev,
        daily_song_title: title,
        daily_song_artist: artist,
      } : null);

      console.log('[Admin] ✓ Daily song info saved');
      Alert.alert('Success', 'Daily song updated successfully!');

    } catch (err: any) {
      console.error('[Admin] Save error:', err.message);
      Alert.alert('Error', 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#FFFFFF" />
    </View>
  );

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={ThemeTextStyles.appTitle} adjustsFontSizeToFit numberOfLines={1}>
            Admin
          </Text>
        </View>
        <View style={styles.headerBtn} />
      </View>

      <View style={styles.content}>

        {/* Current Daily Song */}
        {currentSong?.daily_song_title && (
          <View style={styles.currentCard}>
            <Text style={styles.currentLabel}>Current Daily Song</Text>
            <Text style={styles.currentTitle}>{currentSong.daily_song_title}</Text>
            <Text style={styles.currentArtist}>{currentSong.daily_song_artist}</Text>
            {currentSong.daily_song_url && (
              <View style={styles.audioStatus}>
                <Ionicons name="musical-note" size={12} color="#7EC8A0" />
                <Text style={styles.audioStatusText}>Audio uploaded</Text>
              </View>
            )}
            {currentSong.updated_at && (
              <Text style={styles.updatedAt}>
                Last updated: {new Date(currentSong.updated_at).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric',
                })}
              </Text>
            )}
          </View>
        )}

        {/* Title Input */}
        <Text style={styles.label}>Song Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter song title..."
          placeholderTextColor="rgba(255,255,255,0.3)"
        />

        {/* Artist Input */}
        <Text style={styles.label}>Artist</Text>
        <TextInput
          style={styles.input}
          value={artist}
          onChangeText={setArtist}
          placeholder="Enter artist name..."
          placeholderTextColor="rgba(255,255,255,0.3)"
        />

        {/* Upload Audio */}
        <Text style={styles.label}>Audio File</Text>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handlePickAndUpload}
          disabled={uploading}
        >
          {uploading
            ? <ActivityIndicator size="small" color="#FFFFFF" />
            : <>
                <Ionicons name="musical-note-outline" size={18} color="#FFFFFF" />
                <Text style={styles.uploadText}>
                  {currentSong?.daily_song_url ? 'Replace Audio File' : 'Upload MP3'}
                </Text>
              </>
          }
        </TouchableOpacity>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, saving && { opacity: 0.7 }]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving
            ? <ActivityIndicator size="small" color="#000000" />
            : <>
                <Ionicons name="checkmark-outline" size={18} color="#000000" />
                <Text style={styles.saveText}>Save Daily Song</Text>
              </>
          }
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    height: HEADER_HEIGHT,
    paddingTop: HEADER_PADDING_TOP,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingBottom: 10,
    backgroundColor: 'rgba(15, 15, 15, 0.26)',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  headerBtn: {
    padding: 6,
  },
  content: {
    padding: 20,
    gap: 8,
  },
  currentCard: {
    backgroundColor: 'rgba(15, 15, 15, 0.53)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    gap: 4,
  },
  currentLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  currentTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  currentArtist: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
  },
  audioStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  audioStatusText: {
    color: '#7EC8A0',
    fontSize: 11,
  },
  updatedAt: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 10,
    marginTop: 2,
  },
  label: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    marginBottom: 4,
    marginTop: 8,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: 'rgba(15, 15, 15, 0.53)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 14,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  uploadText: {
    color: '#FFFFFF',
    fontSize: 13,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 8,
  },
  saveText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '700',
  },
});