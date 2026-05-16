import React from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity,
  StatusBar, ScrollView, Dimensions
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const ProviderDocUploadScreen = ({ navigation, route }) => {
  const { isDarkMode } = useTheme();
  const [frontUploaded, setFrontUploaded] = React.useState(false);
  const [backUploaded, setBackUploaded] = React.useState(false);

  const handleNext = () => {
    if (!frontUploaded || !backUploaded) {
      alert("Please upload both sides of your ID to continue.");
      return;
    }
    navigation.navigate('ProviderPhoto', { userData: route.params?.userData });
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
            <Text style={styles.cardTitle}>Identity Verification</Text>
            <Text style={styles.cardDesc}>To ensure safety and trust, please upload a clear photo of your National ID or Passport.</Text>

            <View style={styles.uploadSection}>
              <Text style={styles.label}>Front Side of ID</Text>
              <TouchableOpacity
                style={[styles.uploadBox, frontUploaded && styles.uploadBoxActive]}
                onPress={() => setFrontUploaded(!frontUploaded)}
              >
                <MaterialCommunityIcons
                  name={frontUploaded ? "check-circle" : "camera-plus-outline"}
                  size={40}
                  color={frontUploaded ? "#1E67D1" : "rgba(255,255,255,0.4)"}
                />
                <Text style={[styles.uploadText, frontUploaded && styles.uploadTextActive]}>
                  {frontUploaded ? "Front ID Uploaded" : "Click to upload front"}
                </Text>
              </TouchableOpacity>

              <Text style={styles.label}>Back Side of ID</Text>
              <TouchableOpacity
                style={[styles.uploadBox, backUploaded && styles.uploadBoxActive]}
                onPress={() => setBackUploaded(!backUploaded)}
              >
                <MaterialCommunityIcons
                  name={backUploaded ? "check-circle" : "camera-plus-outline"}
                  size={40}
                  color={backUploaded ? "#1E67D1" : "rgba(255,255,255,0.4)"}
                />
                <Text style={[styles.uploadText, backUploaded && styles.uploadTextActive]}>
                  {backUploaded ? "Back ID Uploaded" : "Click to upload back"}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
              <Text style={styles.nextBtnText}>Next: Profile Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.skipLink} onPress={() => navigation.navigate('ProviderPhoto', { userData: route.params?.userData })}>
              <Text style={styles.skipText}>Skip for now</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1, width: width, height: height },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  scrollContent: { paddingHorizontal: 25, paddingTop: 60, paddingBottom: 40, alignItems: 'center' },
  logoContainer: { marginBottom: 30 },
  logoText: { fontSize: 34, fontWeight: '700', color: '#FFF', letterSpacing: 2 },
  card: {
    width: '100%',
    backgroundColor: 'rgba(25, 30, 40, 0.9)',
    borderRadius: 30,
    padding: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cardTitle: { fontSize: 24, fontWeight: '700', color: '#FFF', textAlign: 'center', marginBottom: 15 },
  cardDesc: { fontSize: 14, color: 'rgba(255,255,255,0.6)', textAlign: 'center', lineHeight: 20, marginBottom: 30 },
  uploadSection: { gap: 20, marginBottom: 35 },
  label: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.9)', marginBottom: 8 },
  uploadBox: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    height: 140,
    borderRadius: 20,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  uploadBoxActive: {
    backgroundColor: 'rgba(30, 103, 209, 0.1)',
    borderColor: '#1E67D1',
    borderStyle: 'solid',
  },
  uploadText: { fontSize: 14, color: 'rgba(255,255,255,0.4)', fontWeight: '500' },
  uploadTextActive: { color: '#FFF', fontWeight: '700' },
  nextBtn: {
    backgroundColor: '#1E67D1',
    padding: 18,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#1E67D1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  nextBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  skipLink: { alignItems: 'center', marginTop: 15 },
  skipText: { color: 'rgba(255,255,255,0.4)', fontSize: 13, textDecorationLine: 'underline' },
});

export default ProviderDocUploadScreen;
