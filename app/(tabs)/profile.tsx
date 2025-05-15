import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native'; // <-- Import this

type Scan = {
  id?: string;
  date: string;
  disease: string;
  name?: string;       
  uri: string;
  severity?: string;
};

export default function Profile() {
  const [history, setHistory] = useState<Scan[]>([]);
  const [healthyCount, setHealthyCount] = useState(0);
  const [diagnosedCount, setDiagnosedCount] = useState(0);
  const [lastScan, setLastScan] = useState<Scan | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const isFocused = useIsFocused();  // <-- Hook to detect screen focus

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const stored = await AsyncStorage.getItem('scan_history');
        if (stored) {
          const parsed: Scan[] = JSON.parse(stored);
          setHistory(parsed);

          // Set the latest scan
          const sorted = [...parsed].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          setLastScan(sorted[0] || null);
        } else {
          setHistory([]);
          setLastScan(null);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load scan history.');
      }
    };

    if (isFocused) {
      loadHistory(); // reload when screen is focused
    }
  }, [isFocused]); // re-run when focus changes

  // Count updates whenever history changes
  useEffect(() => {
    let healthy = 0;
    let diagnosed = 0;

    history.forEach(({ name}) => {
      const lowerName = name?.toLowerCase().trim() || '';
      if (lowerName.includes('healthy') || lowerName.includes('normal')) {
        healthy++;
      } else {
        diagnosed++;
      }
    });

    setHealthyCount(healthy);
    setDiagnosedCount(diagnosed);
  }, [history]);

  const lastTwoScans = [...history]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 2);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <FontAwesome name="user-circle" size={60} color="#fff" />
        </View>
        <Text style={styles.headerText}>USER'S PROFILE</Text>
        <View style={styles.userInfoContainer}>
          <Text style={styles.infoText}>Fullname: John Doe</Text>
          <Text style={styles.infoText}>Age: 29</Text>
          <Text style={styles.infoText}>Gender: Male</Text>
        </View>
      </View>

      {/* Stats */}
<View style={styles.statsRow}>
  <View style={styles.statBox}>
    <Text style={styles.stat}>Total Scans</Text>
    <Text style={styles.statNumber}>{history.length}</Text>
  </View>
  <View style={styles.statBox}>
    <Text style={styles.stat}>Healthy</Text>
    <Text style={styles.statNumber}>{healthyCount}</Text>
  </View>
  <View style={styles.statBox}>
    <Text style={styles.stat}>Diagnosed</Text>
    <Text style={styles.statNumber}>{diagnosedCount}</Text>
  </View>
</View>

      {/* Last Scans */}
      <Text style={styles.lastScanTitle}>Last Scans</Text>
      {lastTwoScans.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.lastScansRow}>
          {lastTwoScans.map((scan) => (
            <TouchableOpacity
              key={scan.id || scan.date}
              style={styles.lastScanBox}
              onPress={() => {
                setLastScan(scan);
                setModalVisible(true);
              }}
            >
              <Image source={{ uri: scan.uri }} style={styles.lastImage} />
              <View>
                <Text style={styles.disease}>{scan.disease}</Text>
                <Text style={styles.date}>{scan.date}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>No scan found</Text>
      )}

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{ alignSelf: 'flex-end' }}
            >
              <FontAwesome name="close" size={24} color="gray" />
            </TouchableOpacity>

            {lastScan && (
              <>
                <Image source={{ uri: lastScan.uri }} style={styles.modalImage} />
                <Text style={styles.modalDisease}>{lastScan.disease}</Text>
                <Text style={styles.modalDate}>Date: {lastScan.date}</Text>
                {lastScan.severity && (
                  <Text style={styles.modalSeverity}>Severity: {lastScan.severity}</Text>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },

  // Header
  header: {
    backgroundColor: '#5B9BD5',
    paddingTop: 30,
    paddingBottom: 20,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#3672B6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  userInfoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 10,
    marginHorizontal: 15,
    width: '100%',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 3,
  },

  // Stats
statsRow: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  marginVertical: 10,
},

statBox: {
  backgroundColor: '#5B9BD5',
  paddingVertical: 15,
  paddingHorizontal: 20,
  borderRadius: 12,
  alignItems: 'center',
  minWidth: 100,
  elevation: 3, // subtle shadow on Android
  shadowColor: '#000', // shadow for iOS
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3,
},

stat: {
  fontSize: 14,
  color: '#FFFFFF',
  fontWeight: '600',
},

statNumber: {
  fontSize: 22,
  fontWeight: 'bold',
  color: '#FFFFFF',
  marginTop: 4,
},

  // Last Scan Section
  lastScanTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  lastScansRow: {
    paddingHorizontal: 15,
   maxHeight: 80,
  },
  lastScanBox: {
    width: 180,
    flexDirection: 'row',
    padding: 10,
    marginRight: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ccc',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  lastImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
  },
  disease: {
    fontSize: 14,
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
    color: '#666',
  },

  // Modal Styles
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
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 15,
  },
  modalDisease: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  modalDate: {
    fontSize: 16,
    color: '#888',
    marginBottom: 5,
  },
  modalSeverity: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#e91e63',
  },
});
