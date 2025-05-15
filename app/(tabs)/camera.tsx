import {
  CameraType,
  CameraView,
  FlashMode,
  useCameraPermissions,
} from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import React, { useRef, useState, useEffect } from 'react';
import {
  Alert,
  Image,
  Modal,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CameraScreen() {
  const isFocused = useIsFocused();
  const [modalVisible, setModalVisible] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<FlashMode>('off');
  const [photo, setPhoto] = useState<any>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [selectedResult, setSelectedResult] = useState<any>(null);

  useEffect(() => {
    if (isFocused) {
      setModalVisible(true);
      setCameraActive(false);
      setPhoto(null);
      setSelectedResult(null);
    }
  }, [isFocused]);

  const handleUploadPress = async () => {
    setModalVisible(false);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Media access is needed to upload photos.');
      setModalVisible(true);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setPhoto({ uri: result.assets[0].uri });
    } else {
      setPhoto(null);
      setModalVisible(true);
    }
  };

  const handleCameraPress = async () => {
    setModalVisible(false);
    if (!permission?.granted) {
      const status = await requestPermission();
      if (!status.granted) {
        Alert.alert('Permission Required', 'Camera access is needed.');
        setModalVisible(true);
        return;
      }
    }
    setCameraActive(true);
  };

  const takePicture = async () => {
    if (!cameraRef.current) return;
    try {
      const pic = await cameraRef.current.takePictureAsync();
      setPhoto(pic);
      setCameraActive(false);
    } catch (err) {
      Alert.alert('Error', 'Failed to take picture');
    }
  };

  const processImage = async () => {
    try {
      const base64 = await FileSystem.readAsStringAsync(photo.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const response = await fetch('https://model-api-ngyl.onrender.com/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([base64]),
      });

      const result = await response.json();

      let name = '';
      let severity = '';
      let description = '';
      const date = new Date().toISOString().split('T')[0];

      switch (result.result) {
        case 'Normal Skin':
          name = 'Healthy Skin';
          severity = 'No severity';
          description = 'Skin appears to be healthy and normal.';
          break;
        case 'Bruises':
          name = 'Bruise';
          severity = 'Normal Wound';
          description = 'A bruise detected; mild and manageable.';
          break;
        case 'Abrasions':
        case 'Cuts':
          name = result.result === 'Abrasions' ? 'Abrasion' : 'Cut';
          severity = 'Moderate Wound';
          description = `Detected ${name.toLowerCase()} with moderate severity.`;
          break;
        case 'Diabetic Wounds':
          name = 'Diabetic Wound';
          severity = 'Dangerous Wound';
          description = 'A diabetic wound detected; needs immediate care.';
          break;
        default:
          name = result.result;
          severity = 'Unknown';
          description = 'No detailed description available.';
      }

      const newEntry = {
        id: Date.now().toString(), // unique ID added here
        uri: photo.uri,
        name,
        severity,
        description,
        date,
      };

      // Save to local history
      const history = await AsyncStorage.getItem('scan_history');
      const parsedHistory = history ? JSON.parse(history) : [];
      parsedHistory.push(newEntry);
      await AsyncStorage.setItem('scan_history', JSON.stringify(parsedHistory));

      setSelectedResult(newEntry);
      setResultModalVisible(true);
    } catch (error) {
      Alert.alert('Error', 'Prediction failed');
    } finally {
      setPhoto(null);
    }
  };

  if (photo) {
    return (
      <View style={styles.previewContainer}>
        <Image source={{ uri: photo.uri }} style={styles.previewImage} />
        <View style={styles.previewControls}>
          <TouchableOpacity
            style={styles.previewButton}
            onPress={() => {
              setPhoto(null);
              setSelectedResult(null);
              setModalVisible(true);
            }}
          >
            <Text style={styles.previewButtonText}>Discard</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.previewButton, styles.useButton]}
            onPress={processImage}
          >
            <Text style={styles.previewButtonText}>Use Photo</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (cameraActive) {
    return (
      <SafeAreaView style={styles.cameraContainer}>
        <StatusBar barStyle="light-content" />
        <CameraView ref={cameraRef} style={styles.camera} facing={facing} flash={flash}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setCameraActive(false);
                setModalVisible(true);
                setPhoto(null);
                cameraRef.current = null;
              }}
            >
              <Text style={styles.text}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setFacing(f => (f === 'back' ? 'front' : 'back'))}
            >
              <Text style={styles.text}>Flip</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <Modal animationType="slide" transparent visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Take or upload a photo</Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleCameraPress}>
              <Text style={styles.modalButtonText}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={handleUploadPress}>
              <Text style={styles.modalButtonText}>Upload Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => {
                setModalVisible(false);
                setPhoto(null);
              }}
            >
              <Text style={[styles.modalButtonText, styles.cancelText]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent
        visible={resultModalVisible}
        onRequestClose={() => {
          setResultModalVisible(false);
          setSelectedResult(null);
          setModalVisible(true);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.resultModal}>
            <Text style={styles.resultTitle}>{selectedResult?.name}</Text>
            <View style={styles.resultImageBox}>
              <Image source={{ uri: selectedResult?.uri }} style={{ width: 100, height: 100 }} />
            </View>
            <Text style={styles.resultText}>
              <Text style={{ fontWeight: 'bold' }}>Date Scanned:</Text> {selectedResult?.date}
            </Text>
            <Text style={styles.resultText}>
              <Text style={{ fontWeight: 'bold' }}>Severity:</Text>{' '}
              <Text
                style={{
                  backgroundColor:
                    selectedResult?.severity === 'Moderate Wound'
                      ? '#FFA500'
                      : selectedResult?.severity === 'Dangerous Wound'
                      ? '#FF6347'
                      : '#ccc',
                  paddingHorizontal: 8,
                  borderRadius: 4,
                  color: '#fff',
                }}
              >
                {selectedResult?.severity}
              </Text>
            </Text>
            <Text style={styles.resultText}>
              <Text style={{ fontWeight: 'bold' }}>Description:</Text> {selectedResult?.description}
</Text>

        <TouchableOpacity
          style={styles.modalButton}
          onPress={() => {
            setResultModalVisible(false);
            setSelectedResult(null);
            setModalVisible(true);
          }}
        >
          <Text style={styles.modalButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
</View>

);
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000099' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%', alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  modalButton: { paddingVertical: 12 },
  modalButtonText: { fontSize: 16, color: '#005EB8' },
  cancelButton: { marginTop: 10 },
  cancelText: { color: 'red' },
  historyHeader: { fontSize: 20, fontWeight: 'bold', marginVertical: 10 },
  card: { flexDirection: 'row', backgroundColor: '#f9f9f9', borderRadius: 10, padding: 10, marginBottom: 10 },
  thumb: { width: 60, height: 60, borderRadius: 10, marginRight: 10 },
  details: { flex: 1 },
  name: { fontWeight: 'bold' },
  severity: { color: '#c43' },
  date: { fontSize: 12, color: '#888' },
  empty: { textAlign: 'center', color: '#999', marginTop: 20 },
  previewContainer: { flex: 1, backgroundColor: '#000' },
  previewImage: { flex: 1, resizeMode: 'contain' },
  previewControls: { flexDirection: 'row', justifyContent: 'space-around', padding: 20, backgroundColor: 'rgba(0,0,0,0.6)' },
  previewButton: { padding: 15, borderRadius: 8, backgroundColor: '#666', width: '45%', alignItems: 'center' },
  useButton: { backgroundColor: '#005EB8' },
  previewButtonText: { color: '#fff', fontWeight: 'bold' },
  cameraContainer: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  buttonContainer: {
    position: 'absolute', bottom: 20, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
  },
  button: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 10,
  },
  text: { color: '#fff', fontWeight: 'bold' },
  captureButton: {
    width: 70, height: 70, borderRadius: 35, borderWidth: 4, borderColor: '#fff',
    justifyContent: 'center', alignItems: 'center',
  },
  captureButtonInner: {
    width: 50, height: 50, borderRadius: 25, backgroundColor: '#fff',
  },
  resultModal: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '85%',
    alignItems: 'center',
    elevation: 5,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  resultImageBox: {
    backgroundColor: '#e6f0ff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  resultText: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  resultCloseButton: {
    marginTop: 15,
    backgroundColor: '#005EB8',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  resultCloseButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
