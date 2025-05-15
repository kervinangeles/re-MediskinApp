import { NativeStackNavigationProp } from '@react-navigation/native-stack'; // Importing correct type for navigation
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import colors from '../../assets/utils/colors';
import { FIREBASE_AUTH } from '../../FirebaseConfig';

// Define the parameter list for your navigator
type RootStackParamList = {
  Home: undefined;
  ForgotPassword: undefined;
  Signup: undefined;
  // Add other screens if needed
};

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const LoginScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const auth = FIREBASE_AUTH;

  const logIn = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Login Successful!', 'You have successfully logged in.');
      navigation.navigate('Home'); // Navigate to home after successful login
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert('Login Failed', error.message);
      } else {
        Alert.alert('Login Failed', 'An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/images/logo.png")} style={styles.bannerImage} />
      <View style={styles.formContainer}>
        <Image source={require("../../assets/images/avatar.png")} style={styles.avatarImage} />
        <Text style={styles.title}>LOGIN</Text>
        <TextInput
          value={email}
          placeholder="EMAIL"
          placeholderTextColor={colors.secondary}
          style={styles.input}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          value={password}
          placeholder="PASSWORD"
          placeholderTextColor={colors.secondary}
          secureTextEntry
          style={styles.input}
          onChangeText={setPassword}
        />
        
        <View style={styles.rememberMeContainer}>
          <TouchableOpacity
            style={[styles.checkbox, { backgroundColor: rememberMe ? colors.primary : colors.secondaryLight }]}
            onPress={() => setRememberMe(!rememberMe)}
          />
          <Text style={styles.rememberMeText}>Remember me</Text>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={logIn} disabled={loading}>
          {loading ? <ActivityIndicator color={colors.white} /> : <Text style={styles.loginButtonText}>LOGIN</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.signUpText}>
          Don't have an account? <Text style={styles.signUpLink}>Sign up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerImage: {
    width: 238,
    height: 282,
    marginBottom: 20,
  },
  avatarImage: {
    width: 100,
    height: 100,
  },
  formContainer: {
    width: '90%',
    backgroundColor: colors.secondary,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: colors.secondaryLight,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.secondary,
    marginRight: 8,
  },
  rememberMeText: {
    color: colors.primary,
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: colors.primary,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  loginButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPasswordText: {
    color: colors.primary,
    textDecorationLine: 'underline',
    marginBottom: 15,
  },
  signUpText: {
    marginTop: 20,
    color: colors.primary,
  },
  signUpLink: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    color: colors.primaryDark,
  },
});
