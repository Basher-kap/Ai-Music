import { Song } from "@/models/songs";
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';


type Props = {
    visible: boolean;
    song: Song | undefined;
    onClose: () => void;
    onSave: () => void; 
}

export default function ReviewsEditForm({ visible, song, onClose, onSave} : Props) {
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
                 <Text style={styles.label}> {song?.title} </Text>
       
                 {/* Artist Input, not inputtable */}
                 <Text style={styles.label}> {song?.title} </Text>
       
                 {/* Review Input */}
                 <Text style={styles.label}>Review</Text>
                 <TextInput
                   style={[styles.input, styles.reviewsInput]}
                   defaultValue={song?.review}
                   placeholderTextColor="rgba(255,255,255,0.4)"
                   placeholder="Enter your review..."
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
                   <TouchableOpacity style={styles.saveButton} onPress={onSave}>
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
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 14,
  },
  reviewsInput: {
    height: 120,
    paddingTop: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
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
    paddingVertical: 12,
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
    marginTop: 12,
    paddingVertical: 12,
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