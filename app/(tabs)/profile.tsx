import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Sample user data (replace with actual user data from your app)
const userData = {
  fullname: 'Fullname',
  age: 'Age',
  gender: 'Gender',
  stats: {
    photosUploaded: 0,
    withoutProblems: 0,
    diagnosedProblems: 0
  },
  lastScans: [
    { id: '1', date: 'Date', disease: 'Dermatitis', severity: 'Medium' },
    { id: '2', date: 'Date', disease: 'Eczema', severity: 'Low' }
  ]
};

export default function Profile() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedScan, setSelectedScan] = useState<typeof userData.lastScans[0] | null>(null);
  const [pressedIndex, setPressedIndex] = useState<number | null>(null);

  const navigateToHistory = () => {
    // Navigate to the history tab
    router.push('/history');
  };

  const openScanModal = (scan: typeof userData.lastScans[0], index: number) => {
    setPressedIndex(index);
    setSelectedScan(scan);
    setModalVisible(true);
    
    // Reset pressed state after a short delay for animation
    setTimeout(() => {
      setPressedIndex(null);
    }, 300);
  };

  const closeScanModal = () => {
    setModalVisible(false);
    setSelectedScan(null);
  };

  // Get severity color based on severity level
  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'Low': return '#4CD964'; // Green
      case 'Medium': return '#FF9500'; // Orange
      case 'High': return '#FF3B30'; // Red
      default: return '#8E8E93'; // Gray for unknown
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <FontAwesome name="user-circle" size={60} color="#fff" />
        </View>
        <Text style={styles.headerText}>USERS PROFILE</Text>
        <View style={styles.userInfoContainer}>
          <Text style={styles.infoText}>{userData.fullname}</Text>
          <Text style={styles.infoText}>{userData.age}</Text>
          <Text style={styles.infoText}>{userData.gender}</Text>
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statText}>Photos{"\n"}Uploaded</Text>
          <Text style={styles.statValue}>{userData.stats.photosUploaded}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statBox}>
          <Text style={styles.statText}>Without{"\n"}Problems</Text>
          <Text style={styles.statValue}>{userData.stats.withoutProblems}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statBox}>
          <Text style={styles.statText}>Diagnosed{"\n"}Problems</Text>
          <Text style={styles.statValue}>{userData.stats.diagnosedProblems}</Text>
        </View>
      </View>

      {/* Last Scanning Section with enhanced header */}
      <View style={styles.sectionBackground}>
        <TouchableOpacity 
          style={styles.lastScanningHeader}
          activeOpacity={0.7}
          onPress={navigateToHistory}
        >
          <Text style={styles.sectionTitle}>Your Last Scanning</Text>
          <FontAwesome name="angle-right" size={16} color="#0066CC" />
        </TouchableOpacity>
        
        <View style={styles.scanningImagesContainer}>
          {userData.lastScans.map((scan, index) => (
            <View key={index} style={styles.scanItem}>
              <TouchableOpacity 
                style={[
                  styles.imageBox,
                  pressedIndex === index && styles.imageBoxPressed
                ]}
                activeOpacity={0.7}
                onPress={() => openScanModal(scan, index)}
              >
                <View style={styles.imageInnerShadow}>
                  <FontAwesome name="image" size={40} color="#0066CC" />
                </View>
              </TouchableOpacity>
              <Text style={styles.imageDate}>{scan.date}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Modal for scan preview */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeScanModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedScan?.disease || "Scan Details"}</Text>
              <TouchableOpacity onPress={closeScanModal}>
                <FontAwesome name="close" size={24} color="#333333" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.imagePreviewContainer}>
              {/* Replace with actual Image component when you have real images */}
              <View style={styles.imagePlaceholder}>
                <FontAwesome name="image" size={80} color="#0066CC" />
              </View>
            </View>
            
            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date Scanned:</Text>
                <Text style={styles.detailValue}>{selectedScan?.date}</Text>
              </View>
              
              {selectedScan?.severity && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Severity:</Text>
                  <View style={[
                    styles.severityBadge, 
                    { backgroundColor: getSeverityColor(selectedScan?.severity || '') }
                  ]}>
                    <Text style={styles.severityText}>{selectedScan?.severity}</Text>
                  </View>
                </View>
              )}
              
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Description</Text>
                <Text style={styles.detailDescription}>
                  This appears to be {selectedScan?.disease} with {selectedScan?.severity?.toLowerCase()} severity. 
                  The condition was scanned on {selectedScan?.date}. Regular monitoring is recommended.
                </Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.closeModalButton}
              onPress={closeScanModal}
            >
              <Text style={styles.closeModalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f0f0f0' 
  },
  header: {
    backgroundColor: '#5B9BD5',
    padding: 15,
    paddingTop: 20,
    paddingBottom: 20,
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#3672B6',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 5,
  },
  headerText: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 5,
  },
  userInfoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 5,
    padding: 10,
  },
  infoText: { 
    fontSize: 14, 
    color: '#FFFFFF', 
    marginBottom: 2 
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  statBox: { 
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 15,
  },
  statText: { 
    fontSize: 14, 
    color: '#0066CC', 
    marginBottom: 5,
    textAlign: 'center',
  },
  statValue: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#0066CC' 
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: '#e0e0e0',
  },
  // Enhanced styling for Last Scanning section
  sectionBackground: {
    backgroundColor: 'rgba(216, 237, 255, 0.3)',
    marginTop: 10,
    paddingBottom: 15,
  },
  lastScanningHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: 'rgba(216, 237, 255, 0.6)',
  },
  sectionTitle: { 
    fontSize: 16, 
    color: '#0066CC',
    fontWeight: '500',
  },
  scanningImagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  scanItem: {
    alignItems: 'center',
  },
  imageBox: {
    width: 80,
    height: 80,
    borderWidth: 2,
    borderColor: '#0066CC',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    padding: 2,
  },
  imageInnerShadow: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#F5FAFF',
  },
  imageBoxPressed: {
    backgroundColor: '#E0F0FF',
    transform: [{ scale: 0.96 }],
  },
  imageDate: { 
    fontSize: 14, 
    color: '#0066CC',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    width: '100%',
    maxHeight: '80%',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0066CC',
  },
  imagePreviewContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: '#E0F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#0066CC',
  },
  detailsContainer: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    width: 110,
  },
  detailValue: {
    fontSize: 16,
    color: '#555555',
  },
  severityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  severityText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  detailSection: {
    marginTop: 10,
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  detailDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: '#555555',
  },
  closeModalButton: {
    backgroundColor: '#0066CC',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  closeModalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});