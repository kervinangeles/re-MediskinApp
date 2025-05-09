import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Colors from '../../assets/utils/colors';


export default function SettingsScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  // Show the modal every time the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      setModalVisible(true);
      return () => setModalVisible(false);
    }, [])
  );

  const handleFAQPress = () => {
    setModalVisible(false);
    router.push('/(screens)/faq');
  };
  
  const handleAboutUsPress = () => {
    setModalVisible(false);
    router.push('/(screens)/aboutus');
  };

  const handleLogOutPress = () => {
    setModalVisible(false);
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Log Out",
          onPress: () => {
            // Placeholder for logout functionality
            Alert.alert('Logged Out', 'You have been logged out successfully.');
            // You can add navigation here later, such as:
            router.replace('/(tabs)');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      {/* Empty state message when modal is closed */}
      {!modalVisible && (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>
            Tap the settings tab again to view options
          </Text>
        </View>
      )}

      {/* Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View 
            style={styles.modalContent}
            // Prevent touches from propagating to parent
            onStartShouldSetResponder={() => true}
          >
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleFAQPress}
            >
              <Text style={styles.modalButtonText}>FAQ</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleAboutUsPress}
            >
              <Text style={styles.modalButtonText}>About Us</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              style={[styles.modalButton, styles.logOutButton]}
              onPress={handleLogOutPress}
            >
              <Text style={[styles.modalButtonText, styles.logOutButtonText]}>
                Log Out
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    color: Colors.black,
  },
  emptyStateContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyStateText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '70%',
    backgroundColor: Colors.secondaryLight,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalButton: {
    width: '100%',
    paddingVertical: 15,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.secondary,
    width: '100%',
  },
  logOutButton: {
    backgroundColor: Colors.error,
    borderRadius: 5,
    marginTop: 10,
  },
  logOutButtonText: {
    color: Colors.white,
  },
});