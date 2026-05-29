// components/AddSongForm.tsx
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';

type Props = {
    visible: boolean;
    onClose: () => void;
    onSave: (data: { title: string; artist: string; themes: string[] }) => void;
};

export default function AddSongForm({ visible, onClose, onSave }: Props) {
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [selectedThemes, setSelectedThemes] = useState<string[]>([]);

    const themes = ['nostalgia', 'refreshing', 'love', 'cheerful', 'emo', 'aspire', 'determination', 'wrath'];

    const toggleTheme = (theme: string) => {
        if (selectedThemes.includes(theme)) {
            setSelectedThemes(selectedThemes.filter(t => t !== theme));
        } else {
            setSelectedThemes([...selectedThemes, theme]);
        }
    };

    const handleSave = () => {
        // Pass the local state back to the parent component
        onSave({ title, artist, themes: selectedThemes });
        
        // Reset form for next use
        setTitle('');
        setArtist('');
        setSelectedThemes([]);
        onClose();
    };

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

                    <Text style={styles.modalTitle}>Add a Song</Text>

                    {/* Song Title Input */}
                    <Text style={styles.label}>Title of a Song</Text>
                    <TextInput
                        style={styles.input}
                        placeholderTextColor="rgba(255,255,255,0.4)"
                        placeholder="Lemon"
                        value={title} //inputs a value for a data
                        onChangeText={setTitle}
                    />

                    {/* Artist Input */}
                    <Text style={styles.label}>Artist of a Song</Text>
                    <TextInput
                        style={styles.input}
                        placeholderTextColor="rgba(255,255,255,0.4)"
                        placeholder="Kenshi Yonezu"
                        value={artist}
                        onChangeText={setArtist}
                    />

                    {/* Theme Input */}
                    <Text style={styles.label}>Themes</Text>
                    <View style={styles.themeRow}>
                        {themes.map(theme => {
                            const isSelected = selectedThemes.includes(theme);
                            return (
                                <TouchableOpacity 
                                    key={theme} 
                                    style={[styles.themeChip, isSelected && styles.themeChipSelected]}
                                    onPress={() => toggleTheme(theme)}
                                >
                                    <Text style={[styles.themeChipText, isSelected && styles.themeChipTextSelected ]}>
                                        {theme}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.buttonRow}>
                        {/* Cancel */}
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>

                        {/* Save */}
                        <TouchableOpacity 
                            style={[styles.saveButton, !title && { opacity: 0.5 }]} 
                            onPress={handleSave}
                            disabled={!title} // Disable if title is empty
                        >
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
    buttonRow: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 18,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 10,
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
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
    },
    saveText: {
        color: '#000000',
        fontSize: 14,
        fontWeight: '700',
    },
});