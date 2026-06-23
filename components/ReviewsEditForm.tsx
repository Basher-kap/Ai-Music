// components/ReviewsEditForm.tsx
import { THEME_KEYS } from "@/constant";
import { Song } from "@/types/songs";
import { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useModalTheme } from '@/context';

type Props = {
  visible: boolean;
  song: Song | undefined;
  onClose: () => void;
  onSave: (data: { song_theme: string[], review: string }) => void;
};

export default function ReviewsEditForm({ visible, song, onClose, onSave }: Props) {
  const [selectedThemes, setSelectedThemes] = useState<string[]>(song?.song_theme ?? []);
  const [review, setReview] = useState(song?.review || '');

  const { ThemeModalStyles } = useModalTheme();

  const toggleTheme = (theme: string) => {
    if (selectedThemes.includes(theme)) {
      setSelectedThemes(selectedThemes.filter(t => t !== theme));
    } else {
      setSelectedThemes([...selectedThemes, theme]);
    }
  };

  useEffect(() => {
    if (visible && song) {
      setSelectedThemes(song.song_theme ?? []);
      setReview(song.review || '');
    }
  }, [visible, song]);

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

          <Text style={[styles.modalTitle, ThemeModalStyles.modalTitle]}>Edit Review Song</Text>

          {/* Song title and artist — read only */}
          <Text style={[styles.songTitle, ThemeModalStyles.modalTitle]}>{song?.title}</Text>
          <Text style={[styles.songArtist, ThemeModalStyles.label]}>{song?.artist}</Text>

          <Text style={[styles.label, ThemeModalStyles.label]}>Themes</Text>
          <View style={styles.themeRow}>
            {THEME_KEYS.map(theme => {
              const isSelected = selectedThemes.includes(theme);
              return (
<TouchableOpacity
    key={theme}
    style={[
        ThemeModalStyles.themeChip,
        isSelected && ThemeModalStyles.themeChipSelected,
    ]}
    onPress={() => toggleTheme(theme)}
>
    <Text style={[
        ThemeModalStyles.themeChipText,
        isSelected && ThemeModalStyles.themeChipTextSelected,
    ]}>
        {theme}
    </Text>
</TouchableOpacity>
              );
            })}
          </View>

          <Text style={[styles.label, ThemeModalStyles.label]}>Review</Text>
          <TextInput
            style={[styles.input, styles.reviewInput, ThemeModalStyles.input]}
            placeholderTextColor={ThemeModalStyles.input.color as string}
            placeholder="Enter your review..."
            value={review}
            onChangeText={setReview}
            multiline
            textAlignVertical="top"
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.actionButton, ThemeModalStyles.cancelButton]} onPress={onClose}>
              <Text style={ThemeModalStyles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, ThemeModalStyles.saveButton]}
              onPress={() => onSave({ song_theme: selectedThemes, review })}
            >
              <Text style={ThemeModalStyles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>

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
  songTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  songArtist: {
    fontSize: 10,
    marginTop: 2,
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
  reviewInput: {
    height: 180,
    paddingTop: 10,
  },
  themeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
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
});