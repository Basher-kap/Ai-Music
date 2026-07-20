// app/generate-lyrics-format.tsx
import { HEADER_HEIGHT, HEADER_PADDING_TOP } from '@/constant';
import { useTextTheme } from '@/context';
import { supabase } from '@/utils/supabase';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import { Observe } from 'expo-observe';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Define the response type matching our schema
interface LyricGroup {
  kanji: string;
  romaji: string;
  english: string;
}

export default function GenerateLyricsFormat() {
  const { ThemeTextStyles } = useTextTheme();

  const [kanji, setKanji] = useState('');
  const [romaji, setRomaji] = useState('');
  const [english, setEnglish] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!kanji.trim() || !romaji.trim() || !english.trim()) {
      setError('Please fill in all three fields.');
      return;
    }

    setLoading(true);
    setError(null);
    setOutput('');

    try {
        const { data, error: fnError } = await supabase.functions.invoke('format-lyrics', {
        body: { kanji, romaji, english },
      });

      if (fnError) {
        let message = fnError.message ?? 'Failed to reach the lyrics formatter.';
        try {
          const body = await fnError.context?.json();
          if (body?.error) message = body.error;
        } catch {
          // context wasn't readable/JSON — fall back to the generic message
        }
        throw new Error(message);
      }
      if (data?.error) {
        throw new Error(data.error);
      }

      const groups: LyricGroup[] = data?.groups ?? [];

      if (groups.length === 0) {
        throw new Error('No structured lyric pairs could be configured.');
      }

      // Format clean multi-line block text structure locally
      const formattedOutput = groups
        .map(group => `${group.kanji.trim()}\n${group.english.trim()}\n${group.romaji.trim()}`)
        .join('\n\n');

      setOutput(formattedOutput);
      Observe.logEvent('lyrics_formatted', {
        attributes: { group_count: groups.length },
      });

    } catch (err: any) {
      console.error('[Gemini] Error:', err.message ?? err);
      const errorMsg = err.message ?? '';
        if (errorMsg.includes('high demand') || errorMsg.includes('quota')) {
            setError('Google servers are busy right now. Please wait a few seconds and try again!');
        } else if (errorMsg.toLowerCase().includes('network') || errorMsg.toLowerCase().includes('fetch')) {
            setError('Could not reach the lyrics formatter. Check your internet connection and try again.');
        } else {
            setError(errorMsg || 'Something went wrong. Please try again.');
        }
        Observe.logEvent('lyrics_format_failed', {
          severity: 'error',
          body: errorMsg || undefined,
        });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setKanji('');
    setRomaji('');
    setEnglish('');
    setOutput('');
    setError(null);
  };

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={ThemeTextStyles.appTitle} adjustsFontSizeToFit numberOfLines={1}>
            Lyrics Formatter
          </Text>
        </View>
        <TouchableOpacity style={styles.headerBtn} onPress={handleClear}>
          <Ionicons name="refresh-outline" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scroll} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* Kanji Input */}
        <Text style={styles.label}>Kanji</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          value={kanji}
          onChangeText={setKanji}
          placeholder="Paste Japanese lyrics here..."
          placeholderTextColor="rgba(255,255,255,0.3)"
          multiline
          textAlignVertical="top"
        />

        {/* Romaji Input */}
        <Text style={styles.label}>Romaji</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          value={romaji}
          onChangeText={setRomaji}
          placeholder="Paste Romaji lyrics here..."
          placeholderTextColor="rgba(255,255,255,0.3)"
          multiline
          textAlignVertical="top"
        />

        {/* English Input */}
        <Text style={styles.label}>English</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          value={english}
          onChangeText={setEnglish}
          placeholder="Paste English translation here..."
          placeholderTextColor="rgba(255,255,255,0.3)"
          multiline
          textAlignVertical="top"
        />

        {/* Error */}
        {error && (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle-outline" size={16} color="#ff4444" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Generate Button */}
        <TouchableOpacity
          style={[styles.generateButton, loading && { opacity: 0.7 }]}
          onPress={handleGenerate}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#000000" />
          ) : (
            <>
              <Ionicons name="sparkles" size={18} color="#000000" />
              <Text style={styles.generateButtonText}>Generate Format</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Output */}
        {output !== '' && (
          <View style={styles.outputContainer}>
            <View style={styles.outputHeader}>
              <Text style={styles.outputLabel}>Formatted Output</Text>
              <TouchableOpacity style={styles.copyButton} onPress={handleCopy}>
                <Ionicons 
                  name={copied ? 'checkmark-outline' : 'copy-outline'} 
                  size={16} 
                  color={copied ? '#7EC8A0' : '#FFFFFF'} 
                />
                <Text style={[styles.copyText, copied && { color: '#7EC8A0' }]}>
                  {copied ? 'Copied!' : 'Copy'}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.outputText}>{output}</Text>
          </View>
        )}

      </ScrollView>
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 8,
    paddingBottom: 40,
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
    fontSize: 13,
  },
  multilineInput: {
    height: 100,
    paddingTop: 10,
    textAlignVertical: 'top',
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
    marginTop: 4,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 13,
    flex: 1,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
    marginTop: 8,
  },
  generateButtonText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '700',
  },
  outputContainer: {
    marginTop: 16,
    backgroundColor: 'rgba(15, 15, 15, 0.53)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 16,
  },
  outputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  outputLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  copyText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  outputText: {
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 22,
  },
});