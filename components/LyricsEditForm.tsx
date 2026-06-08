// components/LyricsEditForm.tsx
import { Song } from '@/types/songs';
import { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Props = {
  visible: boolean;
  song: Song | undefined;
  onClose: () => void;
  onSave: (data: { title: string; artist: string; lyrics: string }) => void;
  onDelete: () => void;
};

export default function LyricsEditForm({ visible, song, onClose, onSave, onDelete }: Props) {
  const [title, setTitle] = useState(song?.title || '');
  const [artist, setArtist] = useState(song?.artist || '');
  const [lyrics, setLyrics] = useState(song?.lyrics || '');

  //reset state whenever the song changes or modal opens
  useEffect(() => {
    if (visible && song) {
      setTitle(song.title);
      setArtist(song.artist);
      setLyrics(song.lyrics || '');
    }
  }, [visible, song]);

  const handleSave = () => {
    onSave({title, artist, lyrics });
  }
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Overlay */}
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      />

      {/* Modal Box */}
      <View style={styles.modalContainer}>
        <View style={styles.modal}>

          <Text style={styles.modalTitle}>Edit Song</Text>

          {/* Song Title Input */}
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="rgba(255,255,255,0.4)"
            placeholder="Song title"
          />

          {/* Artist Input */}
          <Text style={styles.label}>Artist</Text>
          <TextInput
            style={styles.input}
            value={artist}
            onChangeText={setArtist}
            placeholderTextColor="rgba(255,255,255,0.4)"
            placeholder="Artist name"
          />

          {/* Lyrics Input */}
          <Text style={styles.label}>Lyrics</Text>
          <TextInput
            style={[styles.input, styles.lyricsInput]}
            value={lyrics}
            onChangeText={setLyrics}
            placeholderTextColor="rgba(255,255,255,0.4)"
            placeholder="Enter lyrics..."
            multiline
            textAlignVertical="top"
          />

          {/* Action Buttons */}
          <View style={styles.buttonRow}>

            {/* Cancel */}
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            {/* Save */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>

          </View>

          {/* Delete — separate and destructive */}
          <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
            <Text style={styles.deleteText}>Delete Song</Text>
          </TouchableOpacity>

        </View>
      </View>

    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    backgroundColor: 'rgba(20, 20, 20, 0.97)',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 14,
    textAlign: 'center',
  },
  label: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#FFFFFF',
    fontSize: 13,
  },
  lyricsInput: {
    height: 180,
    paddingTop: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
  },
  cancelText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  saveText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '700',
  },
  deleteButton: {
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ff4444',
    alignItems: 'center',
  },
  deleteText: {
    color: '#ff4444',
    fontSize: 14,
  },
});