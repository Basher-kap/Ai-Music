// components/AddSongForm.tsx
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { THEME_KEYS } from '@/constant';
import { useModalTheme } from '@/context';
import { Observe } from 'expo-observe';

type Props = {
    visible: boolean;
    onClose: () => void;
    onSave: (data: { title: string; artist: string; themes: string[] }) => Promise<void>;
};

export default function AddSongForm({ visible, onClose, onSave }: Props) {
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    const { ThemeModalStyles } = useModalTheme();

    const toggleTheme = (theme: string) => {
        if (selectedThemes.includes(theme)) {
            setSelectedThemes(selectedThemes.filter(t => t !== theme));
        } else {
            setSelectedThemes([...selectedThemes, theme]);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setSaveError(null);
        try {
            await onSave({ title, artist, themes: selectedThemes });
            Observe.logEvent('song_added', {
                attributes: { theme_count: selectedThemes.length },
            });
            setTitle('');
            setArtist('');
            setSelectedThemes([]);
            onClose();
        } catch (err: any) {
            setSaveError(err.message || 'Failed to save song.');
            Observe.logEvent('song_add_failed', {
                severity: 'error',
                body: err.message,
            });
        } finally {
            setSaving(false);
        }
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

                    <Text style={[styles.modalTitle, ThemeModalStyles.modalTitle]}>Add a Song</Text>

                    <Text style={[styles.label, ThemeModalStyles.label]}>Title of a Song</Text>
                    <TextInput
                        style={[styles.input, ThemeModalStyles.input]}
                        placeholderTextColor='rgba(245, 240, 240, 0.54)'
                        value={title}
                        onChangeText={setTitle}
                    />

                    <Text style={[styles.label, ThemeModalStyles.label]}>Artist of a Song</Text>
                    <TextInput
                        style={[styles.input, ThemeModalStyles.input]}
                        placeholderTextColor='rgba(245, 240, 240, 0.54)'
                        value={artist}
                        onChangeText={setArtist}
                    />

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

                    {saveError && (
                        <Text style={styles.errorText}>{saveError}</Text>
                    )}

                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={[styles.actionButton, ThemeModalStyles.cancelButton]}
                            onPress={onClose}
                        >
                            <Text style={ThemeModalStyles.cancelText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionButton, ThemeModalStyles.saveButton, (!title || saving) && styles.disabled]}
                            onPress={handleSave}
                            disabled={!title || saving}
                        >
                            <Text style={ThemeModalStyles.saveText}>
                                {saving ? 'Saving...' : 'Save'}
                            </Text>
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
    label: {
        marginBottom: 4,
        marginTop: 8,
    },
    input: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 13,
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
        marginTop: 18,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
    },
    errorText: {
        color: '#ff6b6b',
        fontSize: 13,
        marginTop: 8,
    },
    disabled: {
        opacity: 0.5,
    },
});