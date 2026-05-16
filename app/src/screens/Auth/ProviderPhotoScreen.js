import React, { useState } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity,
  StatusBar, ScrollView, Dimensions,
  Image
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const ProviderPhotoScreen = ({ navigation, route }) => {
  const { isDarkMode } = useTheme();
  const [photoUploaded, setPhotoUploaded] = useState(false);

  const handleFinish = () => {
    if (!photoUploaded) {
      alert("Please upload a profile photo to complete your professional profile.");
      return;
    }
    navigation.navigate('PostRegistrationOnboarding', {
      role: 'provider',
      userData: route.params?.userData,
    });
  };

  return (
    <LinearGradient
      colors={isDarkMode ? ['#0F172A', '#1E1B4B', '#020617'] : ['#FFFFFF', '#F8FAFC', '#F1F5F9']}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>fixam</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Profile Picture</Text>
            <Text style={styles.cardDesc}>Upload a professional photo to build trust with your future clients.</Text>

            <View style={styles.photoSection}>
              <View style={[styles.photoOutline, photoUploaded && styles.photoOutlineActive]}>
                <TouchableOpacity
                  style={[styles.photoContainer, photoUploaded && styles.photoContainerActive]}
                  onPress={() => setPhotoUploaded(!photoUploaded)}
                >
                  <MaterialCommunityIcons
                    name={photoUploaded ? "account-check" : "account"}
                    size={100}
                    color={photoUploaded ? "#FFF" : "rgba(255,255,255,0.1)"}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.editBtn} onPress={() => setPhotoUploaded(!photoUploaded)}>
                  <MaterialCommunityIcons name={photoUploaded ? "check" : "camera"} size={20} color="#FFF" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.finishBtn} onPress={handleFinish}>
              <Text style={styles.finishBtnText}>Complete Registration</Text>
            </TouchableOpacity>

            <Text style={styles.infoText}>You can always change your photo later in settings.</Text>
          </View>

        </ScrollView>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1, width: width, height: height },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  scrollContent: { paddingHorizontal: 25, paddingTop: 80, paddingBottom: 40, alignItems: 'center' },
  logoContainer: { marginBottom: 40 },
  logoText: { fontSize: 34, fontWeight: '700', color: '#FFF', letterSpacing: 2 },
  card: {
    width: '100%',
    backgroundColor: 'rgba(25, 30, 40, 0.9)',
    borderRadius: 30,
    padding: 35,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
  },
  cardTitle: { fontSize: 24, fontWeight: '700', color: '#FFF', textAlign: 'center', marginBottom: 15 },
  cardDesc: { fontSize: 15, color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 22, marginBottom: 40 },
  photoSection: { marginBottom: 45 },
  photoOutline: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  photoOutlineActive: {
    borderColor: '#1E67D1',
  },
  photoContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 85,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  photoContainerActive: {
    backgroundColor: '#1E67D1',
  },
  editBtn: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#1E67D1',
    width: 45,
    height: 45,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#191E28',
  },
  finishBtn: {
    backgroundColor: '#1E67D1',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#1E67D1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  finishBtnText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  infoText: { fontSize: 12, color: 'rgba(255,255,255,0.4)', textAlign: 'center' },
});

export default ProviderPhotoScreen;
