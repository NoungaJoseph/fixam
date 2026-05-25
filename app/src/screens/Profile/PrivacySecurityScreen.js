import React, { useState } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, ScrollView,
  StatusBar, SafeAreaView, Switch
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

const PrivacySecurityScreen = ({ navigation }) => {
  const { isDarkMode, colors } = useTheme();
  const { t } = useLanguage();
  const [faceId, setFaceId] = useState(true);
  const [twoStep, setTwoStep] = useState(false);

  const SecurityItem = ({ icon, title, desc, hasSwitch, value, onValueChange, onPress }) => (
    <TouchableOpacity 
      style={[styles.settingItem, { borderBottomColor: colors.border }]}
      onPress={onPress}
      disabled={hasSwitch}
    >
      <View style={styles.settingInfo}>
        <View style={styles.iconWrap}>
          <MaterialCommunityIcons name={icon} size={22} color={colors.primary} />
        </View>
        <View style={styles.settingTexts}>
          <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>{desc}</Text>
        </View>
      </View>
      {hasSwitch ? (
        <Switch value={value} onValueChange={onValueChange} trackColor={{ true: colors.accent }} />
      ) : (
        <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.background, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <MaterialCommunityIcons name="chevron-left" size={28} color={colors.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{t('profile.privacySecurity')}</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>{t('profile.loginSecurity')}</Text>
            
            <SecurityItem 
              icon="face-recognition" 
              title={t('profile.faceId')}
              desc={t('profile.faceIdDesc')}
              hasSwitch={true}
              value={faceId}
              onValueChange={setFaceId}
            />

            <SecurityItem 
              icon="key-variant" 
              title={t('profile.changePassword')}
              desc={t('profile.lastChanged')}
              onPress={() => {}}
            />

            <SecurityItem 
              icon="shield-check-outline" 
              title={t('profile.twoStep')}
              desc={t('profile.twoStepDesc')}
              hasSwitch={true}
              value={twoStep}
              onValueChange={setTwoStep}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>{t('profile.privacyControl')}</Text>
            
            <SecurityItem 
              icon="file-document-outline" 
              title={t('profile.dataUsage')}
              desc={t('profile.dataUsageDesc')}
              onPress={() => {}}
            />
          </View>

          <TouchableOpacity style={styles.deleteBtn}>
            <MaterialCommunityIcons name="delete-outline" size={20} color={colors.error} />
            <Text style={[styles.deleteText, { color: colors.error }]}>{t('profile.deleteAccount')}</Text>
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
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 15,
  },
  backBtn: { width: 40, height: 40, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  scrollContent: { padding: 20 },
  section: { marginBottom: 30 },
  sectionLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 15, textTransform: 'uppercase' },
  settingItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 17, borderBottomWidth: 1,
  },
  settingInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconWrap: { width: 34, height: 34, justifyContent: 'center', alignItems: 'flex-start', marginRight: 12 },
  settingTexts: { flex: 1 },
  settingTitle: { fontSize: 15, fontWeight: '700' },
  settingDesc: { fontSize: 12, marginTop: 2 },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 20, marginTop: 10 },
  deleteText: { fontWeight: '700', fontSize: 15 },
});

export default PrivacySecurityScreen;
