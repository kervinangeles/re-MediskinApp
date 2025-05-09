import { FontAwesome } from '@expo/vector-icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const cardWidth = 150 + 20;
  const autoScrollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Store current index in a ref to access from interval
  const activeIndexRef = useRef(0);

  const carouselItems = [
    {
      icon: "picture-o" as const,
      text: "Upload photos and track it at the history screen",
    },
    {
      icon: "calendar" as const,
      text: "Schedule appointments and get reminders",
    },
    {
      icon: "line-chart" as const,
      text: "Track your skin condition progress over time",
    },
    {
      icon: "info-circle" as const,
      text: "Learn about skin conditions and treatments",
    },
  ];

  // Update ref when state changes
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  const scrollToIndex = useCallback((index: number) => {
    scrollViewRef.current?.scrollTo({
      x: index * cardWidth,
      animated: true,
    });
    setActiveIndex(index);
  }, [cardWidth]);

  const stopAutoScroll = useCallback(() => {
    if (autoScrollRef.current !== null) {
      clearInterval(autoScrollRef.current);
      autoScrollRef.current = null;
    }
  }, []);

  const startAutoScroll = useCallback(() => {
    stopAutoScroll();
    autoScrollRef.current = setInterval(() => {
      const currentIndex = activeIndexRef.current;
      if (currentIndex === carouselItems.length - 1) {
        // If we're at the last item, smoothly return to the first item
        scrollToIndex(0);
      } else {
        // Otherwise, go to the next item
        scrollToIndex(currentIndex + 1);
      }
    }, 5000);
  }, [carouselItems.length, scrollToIndex, stopAutoScroll]);

  useEffect(() => {
    startAutoScroll();
    return () => stopAutoScroll();
  }, [startAutoScroll, stopAutoScroll]);
  
  const handleScroll = (event: { nativeEvent: { contentOffset: { x: number } } }) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / cardWidth);
    
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < carouselItems.length) {
      setActiveIndex(newIndex);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Your Personal <Text style={styles.highlight}>MediSkin App</Text></Text>

        <View style={styles.carouselContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled={false}
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            snapToInterval={cardWidth}
            snapToAlignment="center"
            contentOffset={{ x: 0, y: 0 }}
            onMomentumScrollEnd={handleScroll}
            scrollEnabled={true}
            contentContainerStyle={styles.carouselContent}
          >
            {carouselItems.map((item, index) => (
              <View key={index} style={styles.card}>
                <FontAwesome name={item.icon} size={40} color="#007AFF" />
                <Text style={styles.cardText}>{item.text}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.aboutSection}>
            <Text style={[styles.aboutTitle, { textAlign: 'center', width: '100%' }]}>About App</Text>
          <View style={styles.aboutCard}>
            <View style={styles.aboutHeader}>
              <Text style={styles.aboutHeaderText}>
                Our App Helps You Detect and Analyze Skin Conditions Instantly!
              </Text>
            </View>
            <Text style={styles.aboutDescription}>
              Mediskin is an app built just for you! It helps you detect and analyze skin conditions instantly.
            </Text>
            <View style={styles.readMoreContainer}>
              <TouchableOpacity 
                style={styles.readMore}
                onPress={() => setModalVisible(true)}>
                <Text style={styles.readMoreText}>Read More</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Modal for Read More */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView contentContainerStyle={styles.modalScrollContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>About MediSkin App</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <FontAwesome name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>What is MediSkin?</Text>
                <Text style={styles.modalText}>
                  MediSkin is a cutting-edge mobile application designed to help you monitor, track, and analyze various skin conditions using artificial intelligence and machine learning technologies. Our app provides you with professional-grade tools right at your fingertips, helping you stay informed about your skin health.
                </Text>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Key Benefits</Text>
                
                <View style={styles.benefitItem}>
                  <FontAwesome name="check-circle" size={20} color="#007AFF" style={styles.benefitIcon} />
                  <Text style={styles.modalText}>
                    <Text style={styles.bold}>Early Detection:</Text> Identify potential skin issues before they become serious concerns.
                  </Text>
                </View>
                
                <View style={styles.benefitItem}>
                  <FontAwesome name="check-circle" size={20} color="#007AFF" style={styles.benefitIcon} />
                  <Text style={styles.modalText}>
                    <Text style={styles.bold}>Progress Tracking:</Text> Monitor the effectiveness of treatments over time with detailed logs.
                  </Text>
                </View>
                
                <View style={styles.benefitItem}>
                  <FontAwesome name="check-circle" size={20} color="#007AFF" style={styles.benefitIcon} />
                  <Text style={styles.modalText}>
                    <Text style={styles.bold}>Image Processing Analysis:</Text> Get instant assessments based on advanced algorithms trained on dermatological data.
                  </Text>
                </View>
                
                <View style={styles.benefitItem}>
                  <FontAwesome name="check-circle" size={20} color="#007AFF" style={styles.benefitIcon} />
                  <Text style={styles.modalText}>
                    <Text style={styles.bold}>Appointment Management:</Text> Schedule and receive reminders for doctor visits and treatments.
                  </Text>
                </View>
                
                <View style={styles.benefitItem}>
                  <FontAwesome name="check-circle" size={20} color="#007AFF" style={styles.benefitIcon} />
                  <Text style={styles.modalText}>
                    <Text style={styles.bold}>Educational Resources:</Text> Access information about different skin conditions and treatment options.
                  </Text>
                </View>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>How It Works</Text>
                <Text style={styles.modalText}>
                  1. Take photos of your skin condition using our high-quality camera interface{"\n"}
                  2. Our Image processing analyzes the images and provides an initial assessment{"\n"}
                  3. Track changes over time with organized historical data{"\n"}
                  4. Receive personalized recommendations based on your skin's unique needs{"\n"}
                  5. Share reports with healthcare professionals for more informed consultations
                </Text>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Privacy & Security</Text>
                <Text style={styles.modalText}>
                  Your privacy is our top priority. All images and personal data are encrypted and stored securely. We never share your information with third parties without your explicit consent.
                </Text>
              </View>

              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5F1F9',
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  highlight: {
    fontWeight: 'bold',
    color: '#004AAD',
  },
  carouselContainer: {
    height: 170,
    width: '100%',
    marginBottom: 30,
  },
  carouselContent: {
    paddingHorizontal: 10,
  },
  card: {
    width: 150,
    height: 150,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardText: {
    marginTop: 10,
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
  },
  aboutSection: {
    backgroundColor: '#A8C6EC',
    width: '100%',
    borderRadius: 20,
    padding: 20,
  },
  aboutTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
    color: '#1A1A1A',
  },
  aboutCard: {
    backgroundColor: '#E5F1F9',
    borderRadius: 15,
    padding: 15,
  },
  aboutHeader: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  aboutHeaderText: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  aboutDescription: {
    fontSize: 12,
    marginBottom: 10,
    color: '#333',
  },
  readMoreContainer: {
    alignItems: 'center',
    width: '100%',
  },
  readMore: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  readMoreText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    width: '90%',
    maxHeight: '80%',
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalScrollContent: {
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#004AAD',
  },
  modalSection: {
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  modalText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#444',
    marginBottom: 10,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  benefitIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  bold: {
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});