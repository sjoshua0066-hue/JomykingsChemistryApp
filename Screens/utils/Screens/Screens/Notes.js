import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';
import { validateFilePath } from '../utils/Security'; // Import path validator

const { width } = Dimensions.get('window');
const NOTES_DIR = FileSystem.documentDirectory + 'notes/';
const NOTES_FILE = NOTES_DIR + 'chemistry_notes.json';

// --- Helper Functions for File System Persistence ---

// Ensures the notes directory exists
const ensureDirExists = async () => {
    const dirInfo = await FileSystem.getInfoAsync(NOTES_DIR);
    if (!dirInfo.isDirectory) {
        await FileSystem.makeDirectoryAsync(NOTES_DIR, { intermediates: true });
    }
};

// Loads notes from the file system
const loadNotes = async () => {
    try {
        await ensureDirExists();
        const fileInfo = await FileSystem.getInfoAsync(NOTES_FILE);
        if (fileInfo.exists) {
            const notesJson = await FileSystem.readAsStringAsync(NOTES_FILE);
            return JSON.parse(notesJson);
        }
        return [];
    } catch (e) {
        console.error("Failed to load notes:", e);
        // Fallback to empty array on read failure
        return [];
    }
};

// Saves notes to the file system
const saveNotes = async (notes) => {
    try {
        await ensureDirExists();
        const notesJson = JSON.stringify(notes);
        await FileSystem.writeAsStringAsync(NOTES_FILE, notesJson);
    } catch (e) {
        console.error("Failed to save notes:", e);
        Alert.alert("Save Error", "Could not save notes due to a file system issue.");
    }
};

// --- Main Component ---

const NotesScreen = () => {
    const [notes, setNotes] = useState([]);
    const [newNoteText, setNewNoteText] = useState('');
    const [speaking, setSpeaking] = useState(false);
    const [currentlyReadingId, setCurrentlyReadingId] = useState(null);

    // Load notes on startup
    useEffect(() => {
        loadNotes().then(setNotes);
    }, []);

    // Function to add a new note
    const addNote = async () => {
        if (newNoteText.trim() === '') {
            Alert.alert("Empty Note", "Please write something before saving.");
            return;
        }

        const newNote = {
            id: Date.now().toString(),
            text: newNoteText.trim(),
            date: new Date().toLocaleDateString(),
        };

        const updatedNotes = [newNote, ...notes];
        setNotes(updatedNotes);
        await saveNotes(updatedNotes);
        setNewNoteText('');
        Alert.alert("Note Saved!", "Your note has been securely saved to the app.");
    };

    // Function to delete a note
    const deleteNote = async (id) => {
        const updatedNotes = notes.filter(note => note.id !== id);
        setNotes(updatedNotes);
        await saveNotes(updatedNotes);
        if (currentlyReadingId === id) {
             Speech.stop();
             setSpeaking(false);
             setCurrentlyReadingId(null);
        }
        Alert.alert("Note Deleted", "The note has been permanently removed.");
    };

    // Function to handle Text-to-Speech
    const speakNote = (note) => {
        if (speaking && currentlyReadingId === note.id) {
            Speech.stop();
            setSpeaking(false);
            setCurrentlyReadingId(null);
        } else {
            // Stop any existing speech first
            if (speaking) {
                 Speech.stop();
            }

            Speech.speak(note.text, {
                language: 'en-US',
                pitch: 1.0,
                rate: 1.0,
                // These functions update state after speech starts/stops
                onStart: () => {
                    setSpeaking(true);
                    setCurrentlyReadingId(note.id);
                },
                onDone: () => {
                    setSpeaking(false);
                    setCurrentlyReadingId(null);
                },
                onError: (e) => {
                    console.error("TTS Error:", e);
                    setSpeaking(false);
                    setCurrentlyReadingId(null);
                    Alert.alert("TTS Error", "Could not read the note.");
                }
            });
        }
    };

    // Stop all speech when component unmounts
    useEffect(() => {
        return () => {
            if (speaking) {
                Speech.stop();
            }
        };
    }, [speaking]);

    // --- Note Card Component ---
    const NoteCard = ({ note }) => {
        const isReading = speaking && currentlyReadingId === note.id;

        return (
            <View style={styles.noteCard}>
                <Text style={styles.noteText}>{note.text}</Text>
                <Text style={styles.noteDate}>Saved on: {note.date}</Text>
                <View style={styles.noteActions}>
                    <TouchableOpacity 
                        style={[styles.actionButton, isReading ? styles.actionButtonStop : styles.actionButtonRead]} 
                        onPress={() => speakNote(note)}
                    >
                        <Ionicons 
                            name={isReading ? "volume-mute" : "volume-high"} 
                            size={20} 
                            color="#fff" 
                        />
                        <Text style={styles.actionButtonText}>
                            {isReading ? 'Stop Reading' : 'Read Note'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.actionButtonDelete} 
                        onPress={() => Alert.alert(
                            "Confirm Delete", 
                            "Are you sure you want to delete this note?", 
                            [
                                { text: "Cancel", style: "cancel" },
                                { text: "Delete", style: "destructive", onPress: () => deleteNote(note.id) }
                            ]
                        )}
                    >
                        <Ionicons name="trash" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };


    return (
        <KeyboardAvoidingView 
            style={styles.container} 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.header}>Quick Notes & TTS Reader</Text>
                <Text style={styles.subHeader}>Secure storage for your chemistry concepts and observations.</Text>
                
                {/* Input Area */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Write your observation or concept here..."
                        placeholderTextColor="#aaa"
                        multiline
                        value={newNoteText}
                        onChangeText={setNewNoteText}
                    />
                    <TouchableOpacity 
                        style={styles.saveButton} 
                        onPress={addNote}
                    >
                        <Ionicons name="save" size={20} color="#fff" style={{marginRight: 5}}/>
                        <Text style={styles.saveButtonText}>Save Note</Text>
                    </TouchableOpacity>
                </View>

                {/* Notes List */}
                <Text style={styles.listHeader}>Your Saved Notes ({notes.length})</Text>
                {notes.length === 0 ? (
                    <Text style={styles.emptyText}>No notes found. Start writing!</Text>
                ) : (
                    <View style={styles.notesList}>
                        {notes.map(note => (
                            <NoteCard key={note.id} note={note} />
                        ))}
                    </View>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

// --- Styling ---

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    scrollContent: {
        padding: 20,
        alignItems: 'center',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#007bff',
        marginBottom: 5,
        textAlign: 'center',
    },
    subHeader: {
        fontSize: 14,
        color: '#6c757d',
        marginBottom: 20,
        textAlign: 'center',
    },
    inputContainer: {
        width: width * 0.9,
        maxWidth: 500,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    textInput: {
        minHeight: 100,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        fontSize: 16,
        textAlignVertical: 'top',
    },
    saveButton: {
        backgroundColor: '#28a745',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    listHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#343a40',
        marginBottom: 15,
        alignSelf: 'flex-start',
        marginLeft: width * 0.05,
    },
    notesList: {
        width: width * 0.9,
        maxWidth: 500,
    },
    noteCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    noteText: {
        fontSize: 16,
        marginBottom: 10,
        lineHeight: 22,
    },
    noteDate: {
        fontSize: 12,
        color: '#999',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 8,
        marginBottom: 8,
    },
    noteActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 6,
    },
    actionButtonRead: {
        backgroundColor: '#007bff',
    },
    actionButtonStop: {
        backgroundColor: '#ffc107',
    },
    actionButtonDelete: {
        backgroundColor: '#dc3545',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 6,
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButtonText: {
        color: 'white',
        fontSize: 14,
        marginLeft: 5,
    },
    emptyText: {
        fontSize: 16,
        color: '#6c757d',
        marginTop: 10,
    }
});

export default NotesScreen;
