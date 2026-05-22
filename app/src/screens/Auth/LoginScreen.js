import React, { useState } from 'react';
import {
  StyleSheet, View, Text, TextInput, TouchableOpacity,
  StatusBar, Image, ActivityIndicator, Alert,
  ScrollView, Dimensions, ImageBackground
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const { height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [loginMethod, setLoginMethod] = useState('phone'); // 'phone' or 'email'
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  const { loginDirect } = useAuth();
  const { isDarkMode, colors } = useTheme();

  const handleLogin = async () => {
    if (!contact.trim() || !password.trim()) {
      Alert.alert("Required", `Please enter your ${loginMethod === 'phone' ? 'phone number' : 'email address'} and password`);
      return;
    }

    setLoading(true);
    try {
      const normalizedContact = loginMethod === 'phone' ? contact.replace(/\D/g, '') : contact;
      const payload = {
        [loginMethod === 'phone' ? 'phone' : 'email']: normalizedContact,
        password
      };
      
      const res = await api.post('/auth/login', payload);
      
      if (res.data.otpRequired) {
        navigation.navigate('OTP', { contact, method: loginMethod, role: res.data.user.role });
      } else {
        loginDirect(res.data.user, res.data.token);
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Invalid credentials. Please try again.";
      Alert.alert("Login Failed", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.mainContainer, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <ImageBackground
          source={require('../../../assets/login_bg_image.png')}
          style={styles.headerBackground}
          resizeMode="cover"
        >
          <View style={styles.headerOverlay}>
            <View style={styles.welcomeTextContainer}>
              <Text style={styles.welcomeTo}>{t('login.welcome')}</Text>
              <Text style={styles.headerSub}>{t('login.subtitle')}</Text>
            </View>
          </View>
        </ImageBackground>

        <View style={[styles.contentContainer, { backgroundColor: colors.background }]}>
          <View style={styles.smallLogoContainer}>
            <Image
              source={require('../../../assets/fixam.png')}
              style={[styles.smallLogo, { opacity: isDarkMode ? 0.6 : 0.4 }]}
              resizeMode="contain"
            />
          </View>

          <View style={[styles.methodToggle, { backgroundColor: colors.card }]}>
            <TouchableOpacity 
              style={[styles.methodBtn, loginMethod === 'phone' && { backgroundColor: isDarkMode ? colors.accent : '#FFF' }]}
              onPress={() => { setLoginMethod('phone'); setContact(''); }}
            >
              <Text style={[styles.methodText, loginMethod === 'phone' && { color: isDarkMode ? '#FFF' : colors.primary, fontWeight: '700' }]}>{t('login.mobileNumber')}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.methodBtn, loginMethod === 'email' && { backgroundColor: isDarkMode ? colors.accent : '#FFF' }]}
              onPress={() => { setLoginMethod('email'); setContact(''); }}
            >
              <Text style={[styles.methodText, loginMethod === 'email' && { color: isDarkMode ? '#FFF' : colors.primary, fontWeight: '700' }]}>Email</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formContainer}>
            <View style={[styles.inputWrapper, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <MaterialIcons 
                name={loginMethod === 'phone' ? "phone-iphone" : "alternate-email"} 
                size={22} 
                color={colors.primary} 
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.textInput, { color: colors.text }]}
                placeholder={loginMethod === 'phone' ? t('login.placeholder') : "Email Address"}
                placeholderTextColor={colors.placeholder}
                value={contact}
                onChangeText={setContact}
                keyboardType={loginMethod === 'phone' ? "phone-pad" : "email-address"}
                selectionColor={colors.accent}
              />
            </View>

            <View style={[styles.inputWrapper, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <MaterialIcons name="lock-outline" size={22} color={colors.primary} style={styles.inputIcon} />
              <TextInput
                style={[styles.textInput, { color: colors.text }]}
                placeholder="Password"
                placeholderTextColor={colors.placeholder}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                selectionColor={colors.accent}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <MaterialIcons
                  name={showPassword ? "visibility-off" : "visibility"}
                  size={20}
                  color={colors.placeholder}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              onPress={handleLogin} 
              activeOpacity={0.8} 
              disabled={loading}
              style={[styles.loginButton, { backgroundColor: colors.accent }]}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Text style={styles.loginButtonText}>Login</Text>
                  <MaterialIcons name="arrow-forward" size={18} color="#FFF" />
                </>
              )}
            </TouchableOpacity>

            <View style={styles.footerLinks}>
              <TouchableOpacity onPress={() => navigation.navigate('RoleSelection')}>
                <Text style={[styles.registerLink, { color: colors.accent }]}>{t('login.registerLink')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                <Text style={[styles.forgotText, { color: colors.textSecondary }]}>Forgot password?</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  headerBackground: { width: '100%', height: height * 0.35, overflow: 'hidden' },
  headerOverlay: { flex: 1, backgroundColor: 'rgba(3,7,18,0.34)', paddingTop: 60, paddingHorizontal: 30 },
  welcomeTextContainer: { marginTop: 16, alignSelf: 'flex-start', paddingVertical: 14 },
  welcomeTo: { fontSize: 24, fontWeight: '700', color: '#EAF2FF' },
  headerSub: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.84)', marginTop: 4 },
  contentContainer: { flex: 1, paddingHorizontal: 25, paddingTop: 24 },
  smallLogoContainer: { alignItems: 'center', marginBottom: 15 },
  smallLogo: { width: 60, height: 40 },
  methodToggle: { flexDirection: 'row', borderRadius: 8, padding: 4, marginBottom: 25 },
  methodBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 6 },
  methodText: { fontSize: 14, fontWeight: '600', color: '#888' },
  formContainer: { gap: 18 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderRadius: 8, paddingHorizontal: 15, height: 60, borderBottomWidth: 1 },
  inputIcon: { marginRight: 12 },
  textInput: { flex: 1, fontSize: 15, fontWeight: '600' },
  loginButton: { height: 50, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 6, flexDirection: 'row', gap: 8 },
  loginButtonText: { color: '#FFF', fontSize: 15, fontWeight: '800' },
  footerLinks: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 10 },
  registerLink: { fontSize: 14, fontWeight: '700' },
  forgotText: { fontSize: 14, fontWeight: '600' },
});

export default LoginScreen;
