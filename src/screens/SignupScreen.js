import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { signup } from '../store/slices/authSlice';

const SignupScreen = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
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

  const showToast = (message) => {
    Alert.alert('Success', message, [{ text: 'OK' }]);
  };

  const handleEmailSignup = () => {
    if (!validateForm()) return;
    
    console.log('📧 User signed up via Email:', email);
    console.log('➡️ Redirecting to login screen for email verification');
    showToast('Account created! Please login to continue.');
    // For email signup, just redirect to login (don't authenticate yet)
    onSwitchToLogin();
  };

  const handleGoogleSignup = () => {
    console.log('🔍 User signed up via Google');
    console.log('✅ Auto-authenticating Google user');
    showToast('Google signup successful!');
    // For Google signup, directly authenticate
    dispatch(signup({ 
      signupMethod: 'google',
      user: { email: 'user@gmail.com', name: 'Google User', signupMethod: 'google' } 
    }));
  };

  const handleAppleSignup = () => {
    console.log('🍎 User signed up via Apple');
    console.log('✅ Auto-authenticating Apple user');
    showToast('Apple signup successful!');
    // For Apple signup, directly authenticate
    dispatch(signup({ 
      signupMethod: 'apple',
      user: { email: 'user@icloud.com', name: 'Apple User', signupMethod: 'apple' } 
    }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join FotoLift</Text>
      
      <TextInput
        style={[styles.input, errors.name && styles.inputError]}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />
      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
      
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
      
      <TouchableOpacity style={styles.emailButton} onPress={handleEmailSignup}>
        <Text style={styles.buttonText}>Sign Up with Email</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignup}>
        <Text style={styles.buttonText}>Sign Up with Google</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.appleButton} onPress={handleAppleSignup}>
        <Text style={styles.buttonText}>Sign Up with Apple</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.linkButton} onPress={onSwitchToLogin}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
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
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  emailButton: {
    backgroundColor: '#007AFF',
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
    color: '#007AFF',
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
});

export default SignupScreen;