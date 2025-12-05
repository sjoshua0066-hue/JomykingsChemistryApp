import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, ActivityIndicator, Dimensions } from 'react-native';
import { useSecureStartupChecks } from '../utils/Security'; // Import our custom security hook
import { Ionicons } from '@expo/vector-icons'; // Assuming Expo icons are available

const { width } = Dimensions.get('window');

// --- Helper Components ---

// Button component for the main menu links
const MenuButton = ({ title, iconName, onPress }) => (
  <TouchableOpacity style={styles.menuButton} onPress={onPress}>
    <Ionicons name={iconName} size={30} color="#007bff" />
    <Text style={styles.menuButtonText}>{title}</Text>
  </TouchableOpacity>
);

// The Modal for the File Conversion Tool (currently a mock)
const FileConversionModal = ({ visible, onClose }) => {
    const [conversionStatus, setConversionStatus] = useState('');
    const [fileType, setFileType] = useState('PDF');

    const startConversion = () => {
        setConversionStatus('Converting...');
        // Mocking a conversion process delay
        setTimeout(() => {
            setConversionStatus(`Conversion Complete! Output: ${fileType} file.`);
        }, 2000);
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>File Conversion Tool</Text>
                    <Text style={styles.modalSubtext}>Convert lab reports or notes to a printable format.</Text>

                    {/* Simple Mock File Type Selector */}
                    <View style={styles.fileTypeContainer}>
                        <TouchableOpacity 
                            style={[styles.typeButton, fileType === 'PDF' && styles.typeButtonActive]}
                            onPress={() => setFileType('PDF')}
                        >
                            <Text style={fileType === 'PDF' && styles.typeButtonTextActive}>PDF</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.typeButton, fileType === 'DOCX' && styles.typeButtonActive]}
                            onPress={() => setFileType('DOCX')}
                        >
                            <Text style={fileType === 'DOCX' && styles.typeButtonTextActive}>DOCX</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity 
                        style={styles.convertButton} 
                        onPress={startConversion}
                        disabled={conversionStatus === 'Converting...'}
                    >
                        <Text style={styles.convertButtonText}>
                            {conversionStatus === 'Converting...' ? 'Processing...' : 'Start Conversion'}
                        </Text>
                    </TouchableOpacity>

                    {conversionStatus && conversionStatus !== 'Converting...' && (
                        <Text style={styles.statusText}>{conversionStatus}</Text>
                    )}

                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

// --- Main Home Screen Component ---

const HomeScreen = ({ navigation }) => {
  const { isLoading, licenseStatus } = useSecureStartupChecks(); // Run security checks
  const [isModalVisible, setIsModalVisible] = useState(false);

  // If still loading, show the security check screen
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Running Security and License Checks...</Text>
        <Text style={styles.loadingStatus}>{licenseStatus}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.welcomeText}>Welcome, Jomy Kings!</Text>
      <Text style={styles.subTitle}>Explore the world of Chemistry.</Text>

      <View style={styles.buttonGrid}>
        <MenuButton 
            title="Periodic Table" 
            iconName="grid" 
            onPress={() => navigation.navigate('PeriodicTable')} 
        />
        <MenuButton 
            title="Elements Explorer" 
            iconName="search" 
            onPress={() => navigation.navigate('Elements')} 
        />
        <MenuButton 
            title="Quick Notes" 
            iconName="pencil" 
            onPress={() => navigation.navigate('Notes')} 
        />
        <MenuButton 
            title="Reaction Balancer" 
            iconName="flask" 
            onPress={() => navigation.navigate('Reactions')} 
        />
        <MenuButton 
            title="File Conversion Tool" 
            iconName="document" 
            onPress={() => setIsModalVisible(true)} 
        />
      </View>

      <FileConversionModal 
          visible={isModalVisible} 
          onClose={() => setIsModalVisible(false)} 
      />
    </ScrollView>
  );
};

// --- Styling ---

const styles = StyleSheet.create({
  // Security Check / Loading Styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: 18,
    marginTop: 15,
    color: '#007bff',
    fontWeight: '600',
  },
  loadingStatus: {
    fontSize: 14,
    marginTop: 5,
    color: '#666',
  },
  // Main Screen Styles
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#343a40',
    marginTop: 10,
  },
  subTitle: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 30,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 500, // Max width for tablet view
  },
  menuButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%', // Allows two buttons per row on smaller screens
    aspectRatio: 1, // Makes the button square
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderBottomWidth: 4,
    borderColor: '#007bff',
  },
  menuButtonText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#343a40',
    textAlign: 'center',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: width * 0.9,
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#007bff',
  },
  modalSubtext: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 20,
    textAlign: 'center',
  },
  fileTypeContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: 8,
  },
  typeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  typeButtonActive: {
    backgroundColor: '#007bff',
  },
  typeButtonTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  convertButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 15,
  },
  convertButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 14,
    color: '#007bff',
    marginBottom: 15,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
  },
  closeButtonText: {
    color: '#dc3545',
    fontSize: 16,
  },
});

export default HomeScreen;
