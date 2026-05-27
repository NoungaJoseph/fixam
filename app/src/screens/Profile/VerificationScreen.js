import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, StatusBar, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useTheme } from '../../context/ThemeContext';

const DOCS = [
  {
    id: 'id',
    title: 'National ID Card',
    subtitle: 'Front & back required',
    icon: 'card-account-details-outline',
    sides: 2,
  },
  {
    id: 'passport',
    title: 'Passport',
    subtitle: 'Data page only',
    icon: 'passport',
    sides: 1,
  },
  {
    id: 'license',
    title: "Driver's License",
    subtitle: 'Front & back required',
    icon: 'card-account-details',
    sides: 2,
  },
];

const VerificationScreen = ({ navigation }) => {
  const { colors, isDarkMode } = useTheme();
  const [selectedDoc, setSelectedDoc] = useState(null);

  const handleContinue = () => {
    if (!selectedDoc) {
      Alert.alert('Select a Document', 'Please select an identity document type to continue.');
      return;
    }
    navigation.navigate('DocUpload', { docType: selectedDoc });
  };

  return (
    <View 
      style={[styles.background, { backgroundColor: colors.background }]}
    >
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: colors.card }]}>
            <MaterialCommunityIcons name="arrow-left" size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Verify Identity</Text>
          <View style={{ width: 42 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Progress indicator */}
          <View style={styles.progressRow}>
            {[1, 2, 3].map(step => (
              <View key={step} style={styles.progressItem}>
                <View style={[styles.progressDot, { backgroundColor: step === 1 ? colors.accent : colors.border }]}>
                  <Text style={[styles.progressNum, { color: step === 1 ? '#FFF' : colors.textSecondary }]}>{step}</Text>
                </View>
                <Text style={[styles.progressLabel, { color: step === 1 ? colors.accent : colors.textSecondary }]}>
                  {step === 1 ? 'Document' : step === 2 ? 'Selfie' : 'Done'}
                </Text>
                {step < 3 && <View style={[styles.progressLine, { backgroundColor: colors.border }]} />}
              </View>
            ))}
          </View>

          <Text style={[styles.title, { color: colors.text }]}>Choose Document Type</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Select the official identity document you'd like to submit. Make sure it is valid and not expired.
          </Text>

          {/* Document cards */}
          {DOCS.map(doc => {
            const isSelected = selectedDoc?.id === doc.id;
            return (
              <TouchableOpacity
                key={doc.id}
                onPress={() => setSelectedDoc(doc)}
                style={[styles.docCard, { borderBottomColor: colors.border }]}
              >
                <View style={styles.docIcon}>
                  <MaterialCommunityIcons name={doc.icon} size={26} color={isSelected ? colors.accent : colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.docTitle, { color: colors.text }]}>{doc.title}</Text>
                  <Text style={[styles.docSubtitle, { color: colors.textSecondary }]}>{doc.subtitle}</Text>
                </View>
                <MaterialCommunityIcons
                  name={isSelected ? 'check-circle' : 'circle-outline'}
                  size={24}
                  color={isSelected ? colors.accent : colors.border}
                />
              </TouchableOpacity>
            );
          })}

          {/* Info box */}
          <View style={[styles.infoBox, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#EEF4FF', borderColor: colors.accent + '40' }]}>
            <MaterialCommunityIcons name="information-outline" size={20} color={colors.accent} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              Your documents are encrypted and stored securely. They are only used for identity verification and will not be shared with third parties.
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.continueBtn, { backgroundColor: selectedDoc ? colors.accent : colors.border }]}
            onPress={handleContinue}
          >
            <Text style={styles.continueBtnText}>Continue</Text>
            <MaterialCommunityIcons name="arrow-right" size={20} color="#FFF" />
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14,
  },
  backBtn: { width: 42, height: 42, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  content: { padding: 22, paddingBottom: 42 },
  progressRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 30 },
  progressItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  progressDot: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  progressNum: { fontSize: 14, fontWeight: '800' },
  progressLabel: { fontSize: 12, fontWeight: '700' },
  progressLine: { width: 32, height: 2, borderRadius: 1, marginHorizontal: 4 },
  title: { fontSize: 24, fontWeight: '900', marginBottom: 10 },
  subtitle: { fontSize: 14, lineHeight: 22, marginBottom: 24 },
  docCard: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 18, gap: 14, borderBottomWidth: 1,
  },
  docIcon: { width: 42, height: 42, justifyContent: 'center', alignItems: 'flex-start' },
  docTitle: { fontSize: 16, fontWeight: '800', marginBottom: 3 },
  docSubtitle: { fontSize: 13 },
  infoBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    padding: 16, borderRadius: 8, borderWidth: 1, marginVertical: 20,
  },
  infoText: { flex: 1, fontSize: 13, lineHeight: 20 },
  continueBtn: {
    height: 56, borderRadius: 8, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 10,
  },
  continueBtnText: { color: '#FFF', fontSize: 16, fontWeight: '900' },
});

export default VerificationScreen;
