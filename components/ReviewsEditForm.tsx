// components/ReviewEditForm.tsx
import { THEME_KEYS } from "@/constant";
import { Song } from "@/types/songs";
import { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';


type Props = {
  visible: boolean;
  song: Song | undefined;
  onClose: () => void;
  onSave: (data: {song_theme: string[], review: string}) => void;
};

export default function ReviewsEditForm({ visible, song, onClose, onSave} : Props) {
  const [selectedThemes, setSelectedThemes] = useState<string[]>(song?.song_theme ?? []);
  const [review, setReview] = useState(song?.review || '');

  const toggleTheme = (theme: string) => {
    if (selectedThemes.includes(theme)) {
      setSelectedThemes(selectedThemes.filter(t => t !== theme));
    } else {
      setSelectedThemes([...selectedThemes, theme]);
    }
  }; 

  useEffect(() => {

    setSelectedThemes(song?.song_theme ?? []);
  }, [song]);
  
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
       
                 <Text style={styles.modalTitle}>Edit Review Song</Text>
       
                 {/* Song Title, not inputtable anymore */}
                 <Text style={styles.songModalTitle}> {song?.title} </Text>
       
                 {/* Artist Input, not inputtable */}
                 <Text style={styles.artistModalTitle}> {song?.artist} </Text>
       
                {/* Theme */}
                <Text style={styles.label}>Themes</Text>
                <View style={styles.themeRow}>
                  {THEME_KEYS.map(theme => {
                    const isSelected = selectedThemes.includes(theme);
                    return (
                      <TouchableOpacity
                        key={theme}
                        style={[styles.themeChip, isSelected && styles.themeChipSelected]}
                        onPress={() => toggleTheme(theme)}
                      >
                        <Text style={[styles.themeChipText, isSelected && styles.themeChipTextSelected]}>
                          {theme}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                 {/* Review Input */}
                 <Text style={styles.label}>Review</Text>
                 <TextInput
                   style={[styles.input, styles.reviewsInput]}
                   placeholderTextColor="rgba(255,255,255,0.4)"
                   placeholder="Enter your review..."
                   value={review}
                   onChangeText={setReview}
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
                   <TouchableOpacity style={styles.saveButton} onPress= {() => onSave({ song_theme: selectedThemes, review })}>
                     <Text style={styles.saveText}>Save</Text>
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
  songModalTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  artistModalTitle: {
    color: '#FFFFFF',
    fontSize: 10,
  },
  input: {
    color: '#FFFFFF',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  themeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  themeChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  themeChipSelected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  themeChipText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  themeChipTextSelected: {
    color: '#000000',
    fontWeight: '600',
  },
  reviewsInput: {
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