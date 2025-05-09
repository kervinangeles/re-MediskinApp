import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Enhanced history item type with severity information
interface HistoryItem {
  id: string;
  disease: string;
  date: string;
  severity: 'Low' | 'Medium' | 'High';
  imageUrl?: string; // Optional URL for actual image
}

const historyData: HistoryItem[] = [
  { id: '1', disease: 'Dermatitis', date: '12 May 2023', severity: 'Medium' },
  { id: '2', disease: 'Eczema', date: '5 April 2023', severity: 'Low' },
  { id: '3', disease: 'Psoriasis', date: '28 March 2023', severity: 'High' },
  { id: '4', disease: 'Contact Rash', date: '15 February 2023', severity: 'Medium' },
];

export default function History() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  const openModal = (item: HistoryItem) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
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

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        {/* Make image container touchable to open modal */}
        <TouchableOpacity 
          style={styles.imageContainer}
          onPress={() => openModal(item)}
        >
          <Ionicons name="image-outline" size={36} color="#005EB8" />
        </TouchableOpacity>
        <View style={styles.textContainer}>
          <Text style={styles.diseaseText}>{item.disease}</Text>
          <Text style={styles.dateText}>{item.date}</Text>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => console.log(`Delete item ${item.id}`)}  
      >
        <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>History</Text>
      <FlatList
        data={historyData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />

      {/* Modal for image preview and details */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedItem?.disease}</Text>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons name="close" size={24} color="#333333" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.imagePreviewContainer}>
              {/* Replace with actual Image component when you have real images */}
              <View style={styles.imagePlaceholder}>
                <Ionicons name="image" size={80} color="#005EB8" />
              </View>
            </View>
            
            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date Scanned:</Text>
                <Text style={styles.detailValue}>{selectedItem?.date}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Severity:</Text>
                <View style={[
                  styles.severityBadge, 
                  { backgroundColor: getSeverityColor(selectedItem?.severity || '') }
                ]}>
                  <Text style={styles.severityText}>{selectedItem?.severity}</Text>
                </View>
              </View>
              
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Description</Text>
                <Text style={styles.detailDescription}>
                  This appears to be {selectedItem?.disease} with {selectedItem?.severity.toLowerCase()} severity. 
                  The condition was scanned on {selectedItem?.date}. Regular monitoring is recommended.
                </Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.closeModalButton}
              onPress={closeModal}
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
    backgroundColor: '#F5F9FC', 
    padding: 16 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#005EB8', 
    marginBottom: 16 
  },
  listContainer: { 
    paddingBottom: 16 
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#87CEEB',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardContent: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    flex: 1 
  },
  imageContainer: {
    width: 50,
    height: 50,
    backgroundColor: '#E0F0FF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: { 
    flex: 1 
  },
  diseaseText: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#FFFFFF' 
  },
  dateText: { 
    fontSize: 14, 
    color: '#FFFFFF', 
    marginTop: 4 
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    marginLeft: 10,
    alignSelf: 'center',
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
    color: '#005EB8',
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
    backgroundColor: '#005EB8',
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