import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { authActions } from '../store/simpleStore';

const SignupScreen = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!password.trim()) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validateField = (field, value) => {
    const newErrors = { ...errors };
    if (field === 'name') {
      if (!value.trim()) newErrors.name = 'Name is required';
      else delete newErrors.name;
    }
    if (field === 'email') {
      if (!value.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(value)) newErrors.email = 'Email is invalid';
      else delete newErrors.email;
    }
    if (field === 'password') {
      if (!value.trim()) newErrors.password = 'Password is required';
      else if (value.length < 6) newErrors.password = 'Password must be at least 6 characters';
      else delete newErrors.password;
    }
    setErrors(newErrors);
  };

  const handleEmailSignup = () => {
    if (!validateForm()) return;
    Alert.alert('Success', 'Account created! Please login to continue.');
    onSwitchToLogin();
  };

  const handleGoogleSignup = () => {
    dispatch(authActions.setUser({ 
      email: 'user@gmail.com', 
      name: 'Google User', 
      loginMethod: 'google',
      profileImage: 'https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D',
      coverImage: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&h=300&fit=crop',
    }));
  };

  const handleAppleSignup = () => {
    dispatch(authActions.setUser({ 
      email: 'user@icloud.com', 
      name: 'Apple User', 
      loginMethod: 'apple',
      profileImage: 'https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D',
      coverImage: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&h=300&fit=crop',
    }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join FotoLift</Text>
      <TextInput style={[styles.input, errors.name && styles.inputError]} placeholder="Full Name" value={name} onChangeText={(text) => { setName(text); validateField('name', text); }} />
      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
      <TextInput style={[styles.input, errors.email && styles.inputError]} placeholder="Email" value={email} onChangeText={(text) => { setEmail(text); validateField('email', text); }} keyboardType="email-address" autoCapitalize="none" />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      <TextInput style={[styles.input, errors.password && styles.inputError]} placeholder="Password" value={password} onChangeText={(text) => { setPassword(text); validateField('password', text); }} secureTextEntry />
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
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 40, color: '#663399' },
  input: { borderWidth: 1, borderColor: '#e6e6fa', padding: 15, marginBottom: 15, borderRadius: 30, fontSize: 16 },
  emailButton: { backgroundColor: '#663399', padding: 15, borderRadius: 30, alignItems: 'center', marginTop: 10 },
  googleButton: { backgroundColor: '#DB4437', padding: 15, borderRadius: 30, alignItems: 'center', marginTop: 10 },
  appleButton: { backgroundColor: '#000', padding: 15, borderRadius: 30, alignItems: 'center', marginTop: 10 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  linkButton: { marginTop: 20, alignItems: 'center' },
  linkText: { color: '#663399', fontSize: 16 },
  inputError: { borderColor: '#FF3B30' },
  errorText: { color: '#FF3B30', fontSize: 14, marginBottom: 10, marginTop: -10 },
});

export default SignupScreen;
