import React, { useState } from 'react';
import {
  StyleSheet, View, Text, TextInput, TouchableOpacity,
  StatusBar, Image, ActivityIndicator, Alert,
  ScrollView, Dimensions, ImageBackground
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../services/theme';
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
      
      // If backend says OTP is required (occasionally), we could redirect to OTP
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
    <View style={styles.mainContainer}>
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

        <View style={styles.contentContainer}>
          <View style={styles.smallLogoContainer}>
            <Image
              source={require('../../../assets/fixam.png')}
              style={styles.smallLogo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.methodToggle}>
            <TouchableOpacity 
              style={[styles.methodBtn, loginMethod === 'phone' && styles.methodBtnActive]}
              onPress={() => { setLoginMethod('phone'); setContact(''); }}
            >
              <Text style={[styles.methodText, loginMethod === 'phone' && styles.methodTextActive]}>{t('login.mobileNumber')}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.methodBtn, loginMethod === 'email' && styles.methodBtnActive]}
              onPress={() => { setLoginMethod('email'); setContact(''); }}
            >
              <Text style={[styles.methodText, loginMethod === 'email' && styles.methodTextActive]}>Email</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputWrapper}>
              <MaterialIcons 
                name={loginMethod === 'phone' ? "phone-iphone" : "alternate-email"} 
                size={22} 
                color={COLORS.primary} 
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder={loginMethod === 'phone' ? t('login.placeholder') : "Email Address"}
                placeholderTextColor={COLORS.placeholder}
                value={contact}
                onChangeText={setContact}
                keyboardType={loginMethod === 'phone' ? "phone-pad" : "email-address"}
                selectionColor={COLORS.accent}
              />
            </View>

            <View style={styles.inputWrapper}>
              <MaterialIcons name="lock-outline" size={22} color={COLORS.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Password"
                placeholderTextColor={COLORS.placeholder}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                selectionColor={COLORS.accent}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <MaterialIcons
                  name={showPassword ? "visibility-off" : "visibility"}
                  size={20}
                  color={COLORS.placeholder}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={handleLogin} activeOpacity={0.8} disabled={loading}>
              <LinearGradient
                colors={['#1E67D1', '#1E67D1']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.loginButton}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <>
                    <Text style={styles.loginButtonText}>Login</Text>
                    <MaterialIcons name="arrow-forward" size={18} color="#FFF" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.footerLinks}>
              <TouchableOpacity onPress={() => navigation.navigate('RoleSelection')}>
                <Text style={styles.registerLink}>{t('login.registerLink')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#0D1B2A' },
  headerBackground: { width: '100%', height: height * 0.35, overflow: 'hidden' },
  headerOverlay: { flex: 1, backgroundColor: 'rgba(3,7,18,0.34)', paddingTop: 60, paddingHorizontal: 30 },
  welcomeTextContainer: { marginTop: 16, alignSelf: 'flex-start', paddingVertical: 14 },
  welcomeTo: { fontSize: 24, fontWeight: '700', color: '#EAF2FF' },
  headerSub: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.84)', marginTop: 4 },
  contentContainer: { flex: 1, backgroundColor: '#F8F9FB', paddingHorizontal: 25, paddingTop: 24 },
  smallLogoContainer: { alignItems: 'center', marginBottom: 15 },
  smallLogo: { width: 60, height: 40, opacity: 0.4 },
  methodToggle: { flexDirection: 'row', backgroundColor: '#EEE', borderRadius: 8, padding: 4, marginBottom: 25 },
  methodBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 6 },
  methodBtnActive: { backgroundColor: '#FFF' },
  methodText: { fontSize: 14, fontWeight: '600', color: '#888' },
  methodTextActive: { color: COLORS.primary, fontWeight: '700' },
  formContainer: { gap: 18 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 8, paddingHorizontal: 15, height: 60, borderBottomWidth: 1, borderColor: '#DADDE1' },
  inputIcon: { marginRight: 12 },
  textInput: { flex: 1, fontSize: 15, color: COLORS.primary, fontWeight: '600' },
  loginButton: { height: 50, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 6, flexDirection: 'row', gap: 8 },
  loginButtonText: { color: '#FFF', fontSize: 15, fontWeight: '800' },
  footerLinks: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 10 },
  registerLink: { fontSize: 14, fontWeight: '700', color: '#4A69BD' },
  forgotText: { fontSize: 14, fontWeight: '600', color: '#888' },
});

export default LoginScreen;
