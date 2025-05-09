import { useFocusEffect } from '@react-navigation/native';
import { CameraType, CameraView, FlashMode, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import React, { useRef, useState } from 'react';
import {
    Alert,
    Image,
    Modal,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function CameraScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<FlashMode>('off');
  const [photo, setPhoto] = useState<any>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);

  // Show modal whenever the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      setModalVisible(true);
      return () => {
        // Cleanup when tab loses focus
        if (!photo) {
          setModalVisible(false);
        }
      };
    }, [photo])
  );

  const handleCameraPress = async () => {
    setModalVisible(false);
    
    // Request camera permissions if not already granted
    if (!permission?.granted) {
      const status = await requestPermission();
      if (!status.granted) {
        Alert.alert(
          "Permission Required", 
          "Camera permissions are needed to use this feature.",
          [{ text: "OK" }]
        );
        return;
      }
    }
    
    setCameraActive(true);
  };

  const handleUploadPress = async () => {
    setModalVisible(false);
    
    // Request media library permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        "Permission Required", 
        "Media Library access is needed to upload photos.",
        [{ text: "OK" }]
      );
      return;
    }
    
    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPhoto({ uri: result.assets[0].uri });
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlash(current => (current === 'off' ? 'on' : 'off'));
  };

  const takePicture = async () => {
    if (!cameraRef.current) return;
    
    try {
      const photo = await cameraRef.current.takePictureAsync();
      setPhoto(photo);
      setCameraActive(false);
    } catch (error) {
      console.error('Failed to take picture:', error);
      Alert.alert('Error', 'Failed to take picture');
    }
  };

  // Photo preview screen (after taking a photo)
  if (photo) {
    return (
      <View style={styles.previewContainer}>
        <Image
          source={{ uri: photo.uri }}
          style={styles.previewImage}
        />
        <View style={styles.previewControls}>
          <TouchableOpacity 
            style={styles.previewButton}
            onPress={() => {
              setPhoto(null);
              setModalVisible(true);
            }}
          >
            <Text style={styles.previewButtonText}>Discard</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.previewButton, styles.previewSaveButton]}
            onPress={() => {
              Alert.alert('Photo Selected', 'Processing your image...');
              // Here you would implement the actual processing or uploading logic
              setPhoto(null);
              setModalVisible(true);
            }}
          >
            <Text style={styles.previewButtonText}>Use Photo</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Camera view when active
  if (cameraActive) {
    if (!permission?.granted) {
      return (
        <View style={styles.container}>
          <Text style={styles.message}>We need your permission to show the camera</Text>
          <TouchableOpacity style={styles.actionButton} onPress={requestPermission}>
            <Text style={styles.actionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.actionButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <SafeAreaView style={styles.cameraContainer}>
        <StatusBar barStyle="light-content" />
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
          flash={flash}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.button} 
              onPress={() => {
                setCameraActive(false);
                setModalVisible(true);
              }}
            >
              <Text style={styles.text}>Back</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={takePicture} 
              style={styles.captureButton}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.button} 
              onPress={toggleCameraFacing}
            >
              <Text style={styles.text}>Flip</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.flashButton}
              onPress={toggleFlash}
            >
              <Text style={styles.text}>
                {flash === 'off' ? '⚡ Off' : '⚡ On'}
              </Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </SafeAreaView>
    );
  }

  // Default view with modal - removed the button to show modal since it now shows automatically
  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Take a photo of your skin</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleCameraPress}
            >
              <Text style={styles.modalButtonText}>Camera</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleUploadPress}
            >
              <Text style={styles.modalButtonText}>Upload Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.modalButtonText, styles.cancelButtonText]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Optional empty state message when modal is closed but no actions taken */}
      {!modalVisible && (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>
            Tap the camera tab again to take or upload a photo
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    fontSize: 16,
  },
  actionButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 5,
    margin: 10,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  modalButton: {
    width: '100%',
    paddingVertical: 15,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#005EB8',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 5,
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#FFFFFF',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    width: '100%',
    marginVertical: 5,
  },
  // Camera styles - unchanged
  cameraContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 20,
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 50,
    padding: 10,
    width: 70,
    height: 50,
    justifyContent: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 5,
    borderColor: '#FFF',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF',
  },
  flashButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 50,
    padding: 10,
    width: 80,
    height: 50,
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  // Preview screen styles - unchanged
  previewContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  previewImage: {
    flex: 1,
    resizeMode: 'contain',
  },
  previewControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  previewButton: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#666',
    width: '45%',
    alignItems: 'center',
  },
  previewSaveButton: {
    backgroundColor: '#005EB8',
  },
  previewButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});