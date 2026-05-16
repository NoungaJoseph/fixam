import React, { useState } from 'react';
import {
  StyleSheet, View, Text, TextInput, TouchableOpacity,
  StatusBar, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';

const RegisterScreen = ({ navigation, route }) => {
  const { isDarkMode, colors } = useTheme();
  const { role } = route.params || { role: 'client' };
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    referral: '',
    location: '',
    password: '',
    repeatPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);

  const setField = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));
  
  const handleRegister = () => {
    // Normalize phone: remove spaces and non-digits
    const normalizedPhone = formData.phone.replace(/\D/g, '');
    const userData = { ...formData, phone: normalizedPhone, fullName: `${formData.firstName} ${formData.lastName}`.trim() };

    if (!agree) {
      alert("Please agree to the terms and conditions");
      return;
    }
    if (formData.password !== formData.repeatPassword) {
      alert("Passwords do not match");
      return;
    }
    if (role === 'provider') {
      navigation.navigate('ProviderSkills', { userData });
    } else {
      navigation.navigate('PostRegistrationOnboarding', { role: 'client', userData });
    }
  };

  const inputStyle = { backgroundColor: colors.card, borderColor: colors.border, color: colors.text };

  return (
    <LinearGradient colors={isDarkMode ? ['#0F172A', '#1E1B4B', '#020617'] : ['#FFFFFF', '#F8FAFC', '#F1F5F9']} style={styles.background}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.safe}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <View>
                <Text style={[styles.title, { color: colors.text }]}>Create {role === 'client' ? 'Client' : 'Provider'} Account</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Set up your Fixam account details.</Text>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.half}>
                <Text style={[styles.label, { color: colors.text }]}>First Name</Text>
                <TextInput style={[styles.input, inputStyle]} placeholder="First Name" placeholderTextColor={colors.placeholder} value={formData.firstName} onChangeText={(value) => setField('firstName', value)} />
              </View>
              <View style={styles.half}>
                <Text style={[styles.label, { color: colors.text }]}>Last Name</Text>
                <TextInput style={[styles.input, inputStyle]} placeholder="Last Name" placeholderTextColor={colors.placeholder} value={formData.lastName} onChangeText={(value) => setField('lastName', value)} />
              </View>
            </View>

            <Text style={[styles.label, { color: colors.text }]}>Email</Text>
            <TextInput style={[styles.input, inputStyle]} placeholder="Email Address" placeholderTextColor={colors.placeholder} keyboardType="email-address" value={formData.email} onChangeText={(value) => setField('email', value)} />

            <Text style={[styles.label, { color: colors.text }]}>Phone Number</Text>
            <TextInput style={[styles.input, inputStyle]} placeholder="6XX XXX XXX" placeholderTextColor={colors.placeholder} keyboardType="phone-pad" value={formData.phone} onChangeText={(value) => setField('phone', value)} />

            <Text style={[styles.label, { color: colors.text }]}>Referral Code</Text>
            <TextInput style={[styles.input, inputStyle]} placeholder="Optional referral code" placeholderTextColor={colors.placeholder} value={formData.referral} onChangeText={(value) => setField('referral', value)} />

            <Text style={[styles.label, { color: colors.text }]}>Your Location</Text>
            <TextInput style={[styles.input, inputStyle]} placeholder="e.g. Akwa, Douala" placeholderTextColor={colors.placeholder} value={formData.location} onChangeText={(value) => setField('location', value)} />

            <Text style={[styles.label, { color: colors.text }]}>Password</Text>
            <View style={[styles.inputWrapper, inputStyle]}>
              <TextInput 
                style={[styles.flexInput, { color: colors.text }]} 
                placeholder="Password" 
                placeholderTextColor={colors.placeholder} 
                secureTextEntry={!showPassword} 
                value={formData.password} 
                onChangeText={(value) => setField('password', value)} 
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <MaterialCommunityIcons name={showPassword ? 'eye-off' : 'eye'} size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.label, { color: colors.text }]}>Repeat Password</Text>
            <View style={[styles.inputWrapper, inputStyle]}>
              <TextInput 
                style={[styles.flexInput, { color: colors.text }]} 
                placeholder="Repeat Password" 
                placeholderTextColor={colors.placeholder} 
                secureTextEntry={!showPassword} 
                value={formData.repeatPassword} 
                onChangeText={(value) => setField('repeatPassword', value)} 
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <MaterialCommunityIcons name={showPassword ? 'eye-off' : 'eye'} size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.termsRow} onPress={() => setAgree(!agree)}>
              <MaterialCommunityIcons name={agree ? 'checkbox-marked' : 'checkbox-blank-outline'} size={22} color={agree ? colors.accent : colors.textSecondary} />
              <Text style={[styles.termsText, { color: colors.textSecondary }]}>I agree to the Terms of Service and Privacy Policy</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.registerBtn, { backgroundColor: colors.accent }]} onPress={handleRegister} activeOpacity={0.85}>
              <Text style={styles.registerBtnText}>Register</Text>
              <MaterialCommunityIcons name="arrow-right" size={20} color="#FFF" />
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  safe: { flex: 1 },
  scrollContent: { padding: 22, paddingBottom: 42 },
  header: { 
    flexDirection: 'row', 
    gap: 14, 
    alignItems: 'center', 
    marginBottom: 22,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 20) + 10 : 0
  },
  backBtn: { width: 42, height: 42, borderRadius: 14, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  title: { fontSize: 24, fontWeight: '900' },
  subtitle: { fontSize: 14, marginTop: 5 },
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  label: { fontSize: 13, fontWeight: '900', marginBottom: 9, marginTop: 12 },
  input: { height: 56, borderRadius: 8, borderWidth: 0, borderBottomWidth: 1, paddingHorizontal: 4, fontSize: 15 },
  inputWrapper: { height: 56, borderRadius: 8, borderWidth: 0, borderBottomWidth: 1, paddingHorizontal: 4, flexDirection: 'row', alignItems: 'center' },
  flexInput: { flex: 1, height: '100%', fontSize: 15 },
  termsRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 18 },
  termsText: { flex: 1, fontSize: 13, lineHeight: 19 },
  registerBtn: { height: 58, borderRadius: 8, marginTop: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  registerBtnText: { color: '#FFF', fontSize: 17, fontWeight: '900' },
});

export default RegisterScreen;
