import React, { useState } from 'react';
import {
  StyleSheet, View, Text, TextInput, TouchableOpacity,
  StatusBar, Dimensions, SafeAreaView
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../services/theme';
import { useTheme } from '../../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const ForgotPasswordScreen = ({ navigation }) => {
  const { isDarkMode } = useTheme();
  const [email, setEmail] = useState('');

  const handleReset = () => {
    if (email) {
      alert("Password reset link sent to your email!");
      navigation.goBack();
    } else {
      alert("Please enter your email address.");
    }
  };

  return (
    <LinearGradient
      colors={isDarkMode ? ['#0F172A', '#1E1B4B', '#020617'] : ['#FFFFFF', '#F8FAFC', '#F1F5F9']}
      style={styles.background}
    >
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="chevron-left" size={30} color={COLORS.primary} />
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="lock-reset" size={50} color={COLORS.accent} />
          </View>

          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            Enter your email address and we'll send you a link to reset your password.
          </Text>

          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons name="email-outline" size={22} color={COLORS.primary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor={COLORS.placeholder}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              selectionColor={COLORS.accent}
            />
          </View>

          <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
            <Text style={styles.resetBtnText}>Send Reset Link</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { flex: 1 },
  backBtn: { padding: 20 },
  content: { flex: 1, paddingHorizontal: 30, paddingTop: 40, alignItems: 'center' },
  iconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#F0F9FF', justifyContent: 'center', alignItems: 'center', marginBottom: 30 },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.primary, marginBottom: 15 },
  subtitle: { fontSize: 15, color: '#6B7280', textAlign: 'center', lineHeight: 24, marginBottom: 40 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 20, paddingHorizontal: 15, height: 65, width: '100%', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2, borderWidth: 1, borderColor: '#F0F0F0', marginBottom: 30 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: COLORS.primary, fontWeight: '600' },
  resetBtn: { backgroundColor: COLORS.primary, width: '100%', paddingVertical: 18, borderRadius: 20, alignItems: 'center', shadowColor: COLORS.primary, shadowOpacity: 0.2, shadowRadius: 10, elevation: 5 },
  resetBtnText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
});

export default ForgotPasswordScreen;
