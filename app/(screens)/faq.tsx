import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Colors from '../../assets/utils/colors';

// FAQ Item component with expandable content
interface FAQItemProps {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <View style={styles.faqItem}>
      <TouchableOpacity 
        style={styles.questionContainer}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <Text style={styles.questionText}>{question}</Text>
        <Ionicons 
          name={expanded ? 'chevron-up' : 'chevron-down'} 
          size={24} 
          color={Colors.primary}
        />
      </TouchableOpacity>
      
      {expanded && (
        <View style={styles.answerContainer}>
          <Text style={styles.answerText}>{answer}</Text>
        </View>
      )}
    </View>
  );
}

export default function FAQScreen() {
  const router = useRouter();
  
  // FAQ data
  const faqData = [
    {
      question: "What is MediskinApp?",
      answer: "MediskinApp is a mobile application designed to help users identify potential skin conditions using artificial intelligence and machine learning. By taking or uploading a photo of your skin concern, the app provides preliminary information about possible conditions."
    },
    {
      question: "How accurate is the app's diagnosis?",
      answer: "MediskinApp is designed to provide preliminary information only and is not a replacement for professional medical advice. The app has been trained on thousands of images and can suggest possible conditions, but a final diagnosis should always be made by a qualified healthcare professional."
    },
    {
      question: "Is my data secure?",
      answer: "We take data privacy very seriously. All images are encrypted and stored securely. Your personal information is never shared with third parties without your explicit consent. You can delete your data at any time through the profile settings."
    },
    {
      question: "How do I take a good photo for analysis?",
      answer: "For best results: 1) Ensure good lighting, preferably natural daylight. 2) Take photos from multiple angles if possible. 3) Make sure the affected area is clearly visible and in focus. 4) Include some surrounding healthy skin for context. 5) Avoid using filters or editing the image."
    },
    {
      question: "What skin conditions can the app detect?",
      answer: "MediskinApp can provide information on common skin conditions including acne, eczema, psoriasis, rosacea, melanoma and other skin cancers, fungal infections, hives, and many more. The app is continuously learning and improving its detection capabilities."
    },
    {
      question: "Can I use MediskinApp for children?",
      answer: "While MediskinApp can be used to analyze skin conditions for children, extra caution should be taken. Children's skin can be more sensitive and conditions may present differently. Always consult with a pediatrician or dermatologist for proper diagnosis and treatment."
    }
  ];
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Frequently Asked Questions</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.introText}>
          Find answers to common questions about MediskinApp and how to use it effectively.
        </Text>
        
        {faqData.map((item, index) => (
          <FAQItem 
            key={index}
            question={item.question}
            answer={item.answer}
          />
        ))}
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            If you have other questions, please contact our support team.
          </Text>
          <TouchableOpacity>
            <Text style={styles.contactButton}>Contact Support</Text>
          </TouchableOpacity>
        </View>
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
    width: 40, // Balance the layout with back button
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  introText: {
    fontSize: 16,
    color: Colors.black,
    marginBottom: 24,
    lineHeight: 22,
  },
  faqItem: {
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: Colors.secondaryLight,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.secondaryLight,
  },
  questionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primaryDark,
  },
  answerContainer: {
    padding: 16,
    backgroundColor: Colors.secondary,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  answerText: {
    fontSize: 15,
    color: Colors.black,
    lineHeight: 22,
  },
  footer: {
    marginTop: 30,
    marginBottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  contactButton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    padding: 8,
  },
});