import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function History() {
  const [history, setHistory] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);

  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem('scan_history');
      if (stored) setHistory(JSON.parse(stored));
      else setHistory([]);
    } catch (error) {
      Alert.alert('Error', 'Failed to load history');
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadHistory();
    }, [])
  );

  const deleteEntry = (id: string) => {
    Alert.alert('Delete Entry', 'Are you sure you want to delete this entry?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const filtered = history.filter(item => item.id !== id);
          setHistory(filtered);
          await AsyncStorage.setItem('scan_history', JSON.stringify(filtered));
          if (selected?.id === id) setSelected(null);
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: any }) => (
  <View style={styles.card}>
    <TouchableOpacity style={styles.cardContent} onPress={() => setSelected(item)}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.uri }} style={{ width: 40, height: 40, borderRadius: 8 }} />
      </View>
      <View style={styles.textContainer}>
        {/* Wound Name */}
        <Text style={styles.woundNameText}>{item.name || 'Unnamed Wound'}</Text>
        {/* Replaced 'disease' with 'description' */}
        <Text style={styles.diseaseText}>{item.description}</Text>
        <Text style={styles.dateText}>{item.date}</Text>
      </View>
    </TouchableOpacity>

    <TouchableOpacity onPress={() => deleteEntry(item.id)} style={styles.deleteButton}>
      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>🗑️</Text>
    </TouchableOpacity>
  </View>
);


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleWrapper}>
  <Text style={styles.title}>Scan History</Text>
</View>
      <FlatList
        data={history}
        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 40 }}>No history found.</Text>}
      />

      <Modal visible={!!selected} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selected?.disease}</Text>
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: selected?.uri }} style={{ width: 200, height: 200, borderRadius: 15 }} />
            </View>
            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Severity:</Text>
                <View
                  style={[
                    styles.severityBadge,
                    selected?.severity === 'High'
                      ? { backgroundColor: '#FF3B30' }
                      : selected?.severity === 'Medium'
                      ? { backgroundColor: '#FF9500' }
                      : { backgroundColor: '#34C759' },
                  ]}
                >
                  <Text style={styles.severityText}>{selected?.severity}</Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date:</Text>
                <Text style={styles.detailValue}>{selected?.date}</Text>
              </View>
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Description:</Text>
                <Text style={styles.detailDescription}>{selected?.description}</Text>
              </View>
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Wound Name:</Text>
                <Text style={styles.detailDescription}>{selected?.name || 'Unnamed Wound'}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.closeModalButton} onPress={() => setSelected(null)}>
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
    padding: 16,
  },
  titleWrapper: {
    backgroundColor: '#F5F9FC',
    paddingVertical: 10,
    marginBottom: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#005EB8',
    marginBottom: 16,
    paddingTop: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
    alignSelf: 'center',
    zIndex: 10,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#87CEEB',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
    flex: 1,
  },
  woundNameText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  diseaseText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 2,
  },
  dateText: {
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: 2,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: 36,
    height: 36,
    marginLeft: 10,
  },
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
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#005EB8',
    marginBottom: 20,
    textAlign: 'center',
  },
  imagePreviewContainer: {
    alignItems: 'center',
    marginBottom: 20,
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
    flexShrink: 1,
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
  },
  closeModalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});


