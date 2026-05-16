import React, { useEffect, useState } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, ScrollView,
  StatusBar, SafeAreaView, Switch, Alert, Platform
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

const SettingsScreen = ({ navigation }) => {
  const { isDarkMode, colors, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [location, setLocation] = useState(true);

  useEffect(() => {
    if (user?.role?.toUpperCase() === 'PROVIDER' && user?.providerProfile?.verification !== 'VERIFIED') {
      Alert.alert(
        'Verification required',
        'Please verify your account so clients can trust your profile and admin can approve your documents.',
        [
          { text: 'Later', style: 'cancel' },
          { text: 'Verify now', onPress: () => navigation.navigate('Verification') },
        ]
      );
    }
  }, [navigation, user?.providerProfile?.verification, user?.role]);

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out of your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', style: 'destructive', onPress: () => logout() },
      ]
    );
  };

  const SettingItem = ({ icon, title, desc, onPress, right, danger }) => (
    <TouchableOpacity
      style={[styles.settingItem, { borderBottomColor: colors.border }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingInfo}>
        <View style={styles.iconWrap}>
          <MaterialCommunityIcons name={icon} size={22} color={danger ? '#EF4444' : colors.primary} />
        </View>
        <View style={styles.settingTexts}>
          <Text style={[styles.settingTitle, { color: danger ? '#EF4444' : colors.text }]}>{title}</Text>
          {desc && <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>{desc}</Text>}
        </View>
      </View>
      {right || (onPress && <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />)}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.background, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          <View style={styles.standaloneHeader}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>{t('settings.title')}</Text>
          </View>

          {/* Account Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>{t('settings.account')}</Text>

            <SettingItem
              icon="account-circle-outline"
              title={t('settings.profile')}
              desc={t('settings.profileDesc')}
              onPress={() => navigation.navigate('UserProfile')}
            />

            <SettingItem
              icon="lock-outline"
              title={t('settings.changePassword')}
              desc={t('settings.changePasswordDesc')}
              onPress={() => navigation.navigate('ChangePassword')}
            />

            <SettingItem
              icon="check-decagram-outline"
              title={t('settings.verification')}
              desc={user?.providerProfile?.verification === 'VERIFIED' ? 'Verified account' : user?.providerProfile?.verification === 'PENDING' ? 'Verification pending review' : 'Not verified yet'}
              onPress={() => navigation.navigate('Verification')}
              right={
                <View style={[styles.statusPill, { backgroundColor: user?.providerProfile?.verification === 'VERIFIED' ? '#DCFCE7' : user?.providerProfile?.verification === 'PENDING' ? '#DBEAFE' : '#FEF2F2' }]}>
                  <Text style={[styles.statusText, { color: user?.providerProfile?.verification === 'VERIFIED' ? '#166534' : user?.providerProfile?.verification === 'PENDING' ? '#1E40AF' : '#B91C1C' }]}>
                    {user?.providerProfile?.verification || 'UNVERIFIED'}
                  </Text>
                </View>
              }
            />
          </View>

          {/* Preferences Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>{t('settings.preferences')}</Text>

            <SettingItem
              icon="translate"
              title={t('settings.language')}
              desc={t('settings.languageDesc')}
              onPress={() => navigation.navigate('LanguageSelection')}
            />

            <SettingItem
              icon="weather-night"
              title={t('settings.darkMode')}
              desc={t('settings.darkModeDesc')}
              right={<Switch value={isDarkMode} onValueChange={toggleTheme} trackColor={{ true: colors.accent }} />}
            />

            <SettingItem
              icon="map-marker-outline"
              title={t('settings.location')}
              desc={t('settings.locationDesc')}
              right={<Switch value={location} onValueChange={setLocation} trackColor={{ true: colors.accent }} />}
            />

            <SettingItem
              icon="eye-off-outline"
              title={t('settings.hiddenProfile')}
              desc={t('settings.hiddenProfileDesc')}
              onPress={() => navigation.navigate('HiddenProfile')}
            />

            <SettingItem
              icon="shield-check-outline"
              title={t('settings.privacy')}
              onPress={() => navigation.navigate('PrivacySecurity')}
            />
          </View>

          {/* Notifications Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>{t('settings.notifications')}</Text>
            <SettingItem icon="bell-outline" title={t('settings.push')} onPress={() => navigation.navigate('Notifications')} />
          </View>

          {/* Support Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>{t('settings.support')}</Text>

            <SettingItem
              icon="help-circle-outline"
              title={t('settings.help')}
              onPress={() => navigation.navigate('HelpCenter')}
            />

            <SettingItem
              icon="message-draw"
              title={t('settings.feedback')}
              onPress={() => navigation.navigate('Feedback')}
            />
          </View>

          {/* Actions Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>{t('settings.actions')}</Text>

            <SettingItem
              icon="logout"
              title={t('settings.logout')}
              onPress={handleLogout}
              danger
            />

          </View>

          <Text style={[styles.versionText, { color: colors.textSecondary }]}>Fixam Version 1.0.4 (Stable)</Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { 
    flex: 1, 
    paddingTop: Platform.OS === 'android' ? 10 : 0 
  },
  scrollContent: { paddingHorizontal: 22, paddingTop: 10 },
  standaloneHeader: { marginBottom: 24, paddingTop: 10 },
  headerTitle: { fontSize: 34, fontWeight: '900' },
  section: { marginBottom: 30 },
  sectionLabel: { fontSize: 13, fontWeight: '900', letterSpacing: 0.4, marginBottom: 8, textTransform: 'uppercase' },
  settingItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 17, borderBottomWidth: 1,
  },
  settingInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconWrap: { width: 34, height: 34, justifyContent: 'center', alignItems: 'flex-start', marginRight: 12 },
  settingTexts: { flex: 1 },
  settingTitle: { fontSize: 17, fontWeight: '800' },
  settingDesc: { fontSize: 13, marginTop: 4, opacity: 0.7 },
  statusPill: { paddingHorizontal: 9, paddingVertical: 5, borderRadius: 999 },
  statusText: { fontSize: 10, fontWeight: '900' },
  versionText: { textAlign: 'center', fontSize: 11, marginTop: 10, marginBottom: 30, fontWeight: '600' },
});

export default SettingsScreen;
