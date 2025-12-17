import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { login, setError } from '../store/slices/authSlice';

const LoginScreen = ({ onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  const validateForm = () => {
    const newErrors = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showToast = (message, type = 'success') => {
    Alert.alert(
      type === 'success' ? 'Success' : 'Error',
      message,
      [{ text: 'OK' }]
    );
  };

  const handleEmailLogin = () => {
    if (!validateForm()) return;
    
    // Simulate credential check
    if (email === 'test@test.com' && password === 'password') {
      console.log('📧 User logged in via Email:', email);
      dispatch(login({ 
        loginMethod: 'email',
        user: { email, name: 'Email User', loginMethod: 'email' } 
      }));
      showToast('Login successful!');
    } else {
      showToast('Invalid email or password', 'error');
      dispatch(setError('Invalid credentials'));
    }
  };

  const handleGoogleLogin = () => {
    console.log('🔍 User logged in via Google');
    dispatch(login({ 
      loginMethod: 'google',
      user: { email: 'user@gmail.com', name: 'Google User', loginMethod: 'google' } 
    }));
    showToast('Google login successful!');
  };

  const handleAppleLogin = () => {
    console.log('🍎 User logged in via Apple');
    dispatch(login({ 
      loginMethod: 'apple',
      user: { email: 'user@icloud.com', name: 'Apple User', loginMethod: 'apple' } 
    }));
    showToast('Apple login successful!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>FotoLift</Text>
      
      <TextInput
        style={[styles.input, errors.email && styles.inputError]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      
      <TextInput
        style={[styles.input, errors.password && styles.inputError]}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
      
      <Text style={styles.hintText}>Test credentials: test@test.com / password</Text>
      
      <TouchableOpacity style={styles.emailButton} onPress={handleEmailLogin}>
        <Text style={styles.buttonText}>Login with Email</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
        <Text style={styles.buttonText}>Continue with Google</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.appleButton} onPress={handleAppleLogin}>
        <Text style={styles.buttonText}>Continue with Apple</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.linkButton} onPress={onSwitchToSignup}>
        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: '#663399',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e6e6fa',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  emailButton: {
    backgroundColor: '#663399',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  googleButton: {
    backgroundColor: '#DB4437',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  appleButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#663399',
    fontSize: 16,
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginBottom: 10,
    marginTop: -10,
  },
  hintText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default LoginScreen;