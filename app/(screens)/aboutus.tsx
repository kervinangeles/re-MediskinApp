import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Image,
    Linking,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Colors from '../../assets/utils/colors';

export default function AboutUsScreen() {
  const router = useRouter();
  
  const openWebsite = () => {
    // Replace with actual website URL
    Linking.openURL('https://mediskinapp.com');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About Us</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* App Logo */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/images/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>MediskinApp</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>
        
        {/* Mission Statement */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Mission</Text>
          <Text style={styles.sectionText}>
            MediskinApp aims to make skin health information more accessible to everyone. 
            By leveraging artificial intelligence and dermatological expertise, we provide 
            a preliminary assessment tool that helps users identify potential skin conditions 
            and seek appropriate medical care when needed.
          </Text>
        </View>
        
        {/* How It Works */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <Text style={styles.sectionText}>
            MediskinApp uses advanced machine learning algorithms trained on thousands of 
            dermatological images. When you take or upload a photo of a skin concern, our 
            app analyzes the visual characteristics and provides information about potential 
            matching conditions.
          </Text>
          <Text style={[styles.sectionText, {marginTop: 10}]}>
            Please note that MediskinApp is designed to provide information only and is not 
            a replacement for professional medical diagnosis. Always consult with a qualified 
            healthcare provider for proper diagnosis and treatment.
          </Text>
        </View>
        
        {/* Our Team */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Team</Text>
          <Text style={styles.sectionText}>
            MediskinApp was developed by a diverse team of dermatologists, AI specialists, 
            and software engineers passionate about making healthcare more accessible.
            Our medical advisory board reviews and validates the app's information to 
            ensure accuracy and relevance.
          </Text>
        </View>
        
        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <Text style={styles.sectionText}>
            We value your feedback and questions. Please reach out to us at:
          </Text>
          <TouchableOpacity 
            onPress={() => Linking.openURL('mailto:support@mediskinapp.com')}
            style={styles.contactItem}
          >
            <Ionicons name="mail" size={20} color={Colors.primary} />
            <Text style={styles.contactText}>support@mediskinapp.com</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={openWebsite}
            style={styles.contactItem}
          >
            <Ionicons name="globe" size={20} color={Colors.primary} />
            <Text style={styles.contactText}>www.mediskinapp.com</Text>
          </TouchableOpacity>
        </View>
        
        {/* Legal */}
        <View style={[styles.section, styles.legalSection]}>
          <TouchableOpacity style={styles.legalButton}>
            <Text style={styles.legalText}>Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.legalButton}>
            <Text style={styles.legalText}>Terms of Service</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.copyright}>
          © {new Date().getFullYear()} MediskinApp. All rights reserved.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary,
    backgroundColor: Colors.secondaryLight,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
  },
  placeholder: {
    width: 40,
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 12,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  version: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginBottom: 28,
    backgroundColor: Colors.secondaryLight,
    borderRadius: 8,
    padding: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primaryDark,
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.black,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  contactText: {
    fontSize: 15,
    color: Colors.primary,
    marginLeft: 8,
  },
  legalSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
  },
  legalButton: {
    padding: 8,
  },
  legalText: {
    fontSize: 14,
    color: Colors.primary,
  },
  copyright: {
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
    marginBottom: 30,
    marginTop: 10,
  },
});