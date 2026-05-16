import React from 'react';
import {
  StyleSheet, View, Text, ScrollView, TouchableOpacity,
  StatusBar, SafeAreaView
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../services/theme';
import { useTheme } from '../../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

const TermsPolicyScreen = ({ navigation }) => {
  const { isDarkMode } = useTheme();
  return (
    <LinearGradient
      colors={isDarkMode ? ['#0F172A', '#1E1B4B', '#020617'] : ['#FFFFFF', '#F8FAFC', '#F1F5F9']}
      style={styles.background}
    >
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="close" size={28} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Terms & Privacy Policy</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.lastUpdated}>Last Updated: May 2024</Text>
          
          <Text style={styles.sectionTitle}>1. Terms of Service</Text>
          <Text style={styles.text}>
            Welcome to Fixam. By using our platform, you agree to comply with and be bound by the following terms and conditions of use...
          </Text>
          <Text style={styles.text}>
            We connect clients with professional service providers. Fixam is not responsible for the quality of work performed but facilitates the connection and payment process.
          </Text>

          <Text style={styles.sectionTitle}>2. Privacy Policy</Text>
          <Text style={styles.text}>
            Your privacy is important to us. It is Fixam's policy to respect your privacy regarding any information we may collect from you across our website and app...
          </Text>
          <Text style={styles.text}>
            We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.
          </Text>

          <Text style={styles.sectionTitle}>3. User Accounts</Text>
          <Text style={styles.text}>
            When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms.
          </Text>

          <Text style={styles.sectionTitle}>4. Contact Us</Text>
          <Text style={styles.text}>
            If you have any questions about these Terms, please contact us at support@fixam.com.
          </Text>
          
          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { flex: 1 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F3F4F6'
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: COLORS.primary },
  scrollContent: { padding: 25 },
  lastUpdated: { fontSize: 13, color: '#9CA3AF', marginBottom: 25 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.primary, marginTop: 20, marginBottom: 10 },
  text: { fontSize: 15, color: '#4B5563', lineHeight: 24, marginBottom: 15 },
});

export default TermsPolicyScreen;
