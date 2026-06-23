// components/LyricsEditForm.tsx
import { Song } from '@/types/songs';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useModalTheme } from '@/context';

type Props = {
  visible: boolean;
  song: Song | undefined;
  onClose: () => void;
  onSave: (data: { title: string; artist: string; lyrics: string }) => void;
  onDelete: () => void;
  onUploadAudio?: (fileUri: string, fileName: string) => Promise<void>;
};

export default function LyricsEditForm({ visible, song, onClose, onSave, onDelete, onUploadAudio }: Props) {
  const [title, setTitle] = useState(song?.title || '');
  const [artist, setArtist] = useState(song?.artist || '');
  const [lyrics, setLyrics] = useState(song?.lyrics || '');
  const [uploading, setUploading] = useState(false);

  const { ThemeModalStyles } = useModalTheme();

  useEffect(() => {
    if (visible && song) {
      setTitle(song.title);
      setArtist(song.artist);
      setLyrics(song.lyrics || '');
    }
  }, [visible, song]);

  const handleSave = () => {
    onSave({ title, artist, lyrics });
  };

  const handlePickAudio = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'audio/mpeg',
      copyToCacheDirectory: true,
    });
    if (result.canceled) return;
    const file = result.assets[0];
    setUploading(true);
    await onUploadAudio?.(file.uri, file.name);
    setUploading(false);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      />

      <View style={styles.modalContainer}>
        <View style={[styles.modal, ThemeModalStyles.modal]}>

          <Text style={[styles.modalTitle, ThemeModalStyles.modalTitle]}>Edit Song</Text>

          <Text style={[styles.label, ThemeModalStyles.label]}>Title</Text>
          <TextInput
            style={[styles.input, ThemeModalStyles.input]}
            value={title}
            onChangeText={setTitle}
            placeholderTextColor='rgba(245, 240, 240, 0.54)'
            placeholder="Song title"
          />

          <Text style={[styles.label, ThemeModalStyles.label]}>Artist</Text>
          <TextInput
            style={[styles.input, ThemeModalStyles.input]}
            value={artist}
            onChangeText={setArtist}
            placeholderTextColor='rgba(245, 240, 240, 0.54)'
            placeholder="Artist name"
          />

          <Text style={[styles.label, ThemeModalStyles.label]}>Audio File</Text>
          <TouchableOpacity
            style={[styles.uploadButton, ThemeModalStyles.uploadButton]}
            onPress={handlePickAudio}
            disabled={uploading}
          >
            {uploading
              ? <ActivityIndicator size="small" color={ThemeModalStyles.modalTitle.color as string} />
              : <>
                  <Ionicons name="musical-note-outline" size={18} color={ThemeModalStyles.modalTitle.color as string} />
                  <Text style={[styles.uploadText, { color: ThemeModalStyles.input.color as string }]}>
                    {song?.mp4song ? 'Replace Audio File' : 'Upload MP3'}
                  </Text>
                </>
            }
          </TouchableOpacity>

          <Text style={[styles.label, ThemeModalStyles.label]}>Lyrics</Text>
          <TextInput
            style={[styles.input, styles.lyricsInput, ThemeModalStyles.input]}
            value={lyrics}
            onChangeText={setLyrics}
            placeholderTextColor='rgba(245, 240, 240, 0.54)'
            placeholder="Enter lyrics..."
            multiline
            textAlignVertical="top"
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.actionButton, ThemeModalStyles.cancelButton]} onPress={onClose}>
              <Text style={ThemeModalStyles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionButton, ThemeModalStyles.saveButton]} onPress={handleSave}>
              <Text style={ThemeModalStyles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={[styles.deleteButton, ThemeModalStyles.deleteButton]} onPress={onDelete}>
            <Text style={ThemeModalStyles.deleteText}>Delete Song</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modal: {
    width: '100%',
    padding: 18,
  },
  modalTitle: {
    marginBottom: 14,
    textAlign: 'center',
  },
  label: {
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
  },
  lyricsInput: {
    height: 180,
    paddingTop: 10,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  uploadText: {
    fontSize: 13,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  deleteButton: {
    marginTop: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
});