import React, { useEffect, useState } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, ScrollView,
  StatusBar, SafeAreaView, Switch, Alert, Platform, Image
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

const SettingsScreen = ({ navigation, route }) => {
  const { isDarkMode, colors, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [location, setLocation] = useState(true);
  const isProviderMode = user?.providerProfile?.profileMode === 'WORK';

  useEffect(() => {
    if (user?.role?.toUpperCase() === 'PROVIDER' && user?.providerProfile?.verification !== 'VERIFIED') {
      Alert.alert(
        'Verification Required',
        'Verify your account so clients can trust your profile.',
        [
          { text: 'Later', style: 'cancel' },
          { text: 'Verify Now', onPress: () => navigation.navigate('Verification') },
        ]
      );
    }
  }, [navigation, user?.providerProfile?.verification, user?.role]);

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => logout() },
    ]);
  };

  const verStatus = user?.providerProfile?.verification;
  const verColor = verStatus === 'VERIFIED' ? '#22C55E' : verStatus === 'PENDING' ? '#F59E0B' : '#EF4444';
  const verBg = verStatus === 'VERIFIED' ? '#F0FDF4' : verStatus === 'PENDING' ? '#FFFBEB' : '#FEF2F2';
  const verLabel = verStatus || 'UNVERIFIED';

  // Icon config: [iconName, bgColor]
  const ICON_COLORS = {
    'account-circle-outline': ['#0D9488', '#F0FDFA'],
    'lock-outline':            ['#8B5CF6', '#F5F3FF'],
    'check-decagram-outline':  ['#F59E0B', '#FFFBEB'],
    'translate':               ['#2563EB', '#EFF6FF'],
    'weather-night':           ['#6366F1', '#EEF2FF'],
    'map-marker-outline':      ['#0D9488', '#F0FDFA'],
    'eye-off-outline':         ['#64748B', '#F1F5F9'],
    'shield-check-outline':    ['#0D9488', '#F0FDFA'],
    'bell-outline':            ['#EF4444', '#FEF2F2'],
    'help-circle-outline':     ['#0D9488', '#F0FDFA'],
    'message-draw':            ['#8B5CF6', '#F5F3FF'],
    'logout':                  ['#EF4444', '#FEF2F2'],
  };

  const SettingItem = ({ icon, title, desc, onPress, right, danger }) => {
    const [iconColor, iconBg] = ICON_COLORS[icon] || [colors.accent, colors.accentSoft];
    return (
      <TouchableOpacity
        style={[styles.settingRow, { borderBottomColor: colors.divider }]}
        onPress={onPress}
        disabled={!onPress}
        activeOpacity={0.7}
      >
        <View style={[styles.iconBox, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.07)' : iconBg }]}>
          <MaterialCommunityIcons name={icon} size={20} color={danger ? '#EF4444' : iconColor} />
        </View>
        <View style={styles.settingBody}>
          <Text style={[styles.settingTitle, { color: danger ? '#EF4444' : colors.text }]}>{title}</Text>
          {desc ? <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>{desc}</Text> : null}
        </View>
        {right || (onPress && (
          <MaterialCommunityIcons name="chevron-right" size={20} color={colors.placeholder} />
        ))}
      </TouchableOpacity>
    );
  };

  const SectionHeader = ({ icon, label }) => (
    <View style={styles.sectionHeader}>
      <MaterialCommunityIcons name={icon} size={15} color={colors.placeholder} />
      <Text style={[styles.sectionLabel, { color: colors.placeholder }]}>{label}</Text>
    </View>
  );

  const SectionCard = ({ children }) => (
    <View style={[styles.sectionCard, {
      backgroundColor: colors.card,
      borderColor: colors.border,
      shadowColor: isDarkMode ? 'transparent' : '#000',
    }]}>
      {children}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* Page Title */}
          <View style={styles.pageHeader}>
            <View style={styles.headerTopRow}>
              <Text style={[styles.pageTitle, { color: colors.text }]}>Settings</Text>
              <TouchableOpacity style={[styles.bellBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => navigation.navigate('Notifications')}>
                <MaterialCommunityIcons name="bell-outline" size={22} color={colors.text} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.pageSub, { color: colors.textSecondary }]}>Manage your account and preferences</Text>
          </View>

          {/* Hero Profile Card */}
          <TouchableOpacity
            onPress={() => navigation.navigate('UserProfile')}
            activeOpacity={0.9}
            style={styles.heroWrapper}
          >
            <LinearGradient
              colors={['#0D9488', '#2563EB']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={styles.heroCard}
            >
              {/* Decorative gear */}
              <View style={styles.gearDecor}>
                <MaterialCommunityIcons name="cog" size={100} color="rgba(255,255,255,0.08)" />
              </View>

              <View style={styles.heroLeft}>
                <View style={styles.heroAvatarWrap}>
                  {user?.avatar ? (
                    <Image source={{ uri: user.avatar }} style={styles.heroAvatar} />
                  ) : (
                    <View style={[styles.heroAvatarFallback, { backgroundColor: 'rgba(255,255,255,0.3)' }]}>
                      <Text style={styles.heroInitial}>{(user?.fullName || 'U').charAt(0)}</Text>
                    </View>
                  )}
                  <View style={[styles.editDot, { backgroundColor: colors.accent }]}>
                    <MaterialCommunityIcons name="pencil" size={10} color="#FFF" />
                  </View>
                </View>
                <View>
                  <Text style={styles.heroName}>{user?.fullName || 'Your Name'}</Text>
                  <Text style={styles.heroRole}>{isProviderMode ? 'Provider Account' : 'Client Account'}</Text>
                  <View style={[styles.verBadge, { backgroundColor: verBg }]}>
                    <MaterialCommunityIcons name="shield-check" size={12} color={verColor} />
                    <Text style={[styles.verText, { color: verColor }]}>{verLabel}</Text>
                  </View>
                </View>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color="rgba(255,255,255,0.7)" />
            </LinearGradient>
          </TouchableOpacity>

          {/* ACCOUNT */}
          <SectionHeader icon="account-outline" label="ACCOUNT" />
          <SectionCard>
            <SettingItem icon="account-circle-outline" title="Profile" desc="View and edit your public profile" onPress={() => navigation.navigate('UserProfile')} />
            <SettingItem icon="lock-outline" title="Change Password" desc="Update your security credentials" onPress={() => navigation.navigate('ChangePassword')} />
            {user?.role === 'PROVIDER' && (
              <SettingItem
                icon="check-decagram-outline"
                title="Verification"
                desc="Verify your identity to build trust"
                onPress={() => navigation.navigate('Verification')}
                right={
                  <View style={[styles.statusPill, { backgroundColor: verBg }]}>
                    <Text style={[styles.statusPillText, { color: verColor }]}>{verLabel}</Text>
                  </View>
                }
              />
            )}
          </SectionCard>

          {/* PREFERENCES */}
          <SectionHeader icon="tune" label="PREFERENCES" />
          <SectionCard>
            <SettingItem icon="translate" title="Language" desc="English / French" onPress={() => navigation.navigate('LanguageSelection')} />
            <SettingItem
              icon="weather-night"
              title="Dark Mode"
              desc="Switch the app appearance"
              right={
                <Switch
                  value={isDarkMode}
                  onValueChange={toggleTheme}
                  trackColor={{ true: '#0D9488', false: '#CBD5E1' }}
                  thumbColor="#FFF"
                />
              }
            />
            <SettingItem
              icon="map-marker-outline"
              title="Location Services"
              desc="For nearby task discovery"
              right={
                <Switch
                  value={location}
                  onValueChange={setLocation}
                  trackColor={{ true: '#0D9488', false: '#CBD5E1' }}
                  thumbColor="#FFF"
                />
              }
            />
             <SettingItem icon="shield-check-outline" title="Privacy & Security" desc="Manage your privacy and security" onPress={() => navigation.navigate('PrivacySecurity')} />
          </SectionCard>

          {/* NOTIFICATIONS */}
          <SectionHeader icon="bell-outline" label="NOTIFICATION PREFERENCES" />
          <SectionCard>
            <SettingItem icon="bell-outline" title="Push Notifications" desc="Manage push notification settings" onPress={() => navigation.navigate('Notifications')} />
          </SectionCard>

          {/* SUPPORT */}
          <SectionHeader icon="help-circle-outline" label="SUPPORT" />
          <SectionCard>
            <SettingItem icon="help-circle-outline" title="Help Center" desc="Get help and support" onPress={() => navigation.navigate('HelpCenter')} />
            <SettingItem icon="message-draw" title="Send Feedback" desc="Share your feedback with us" onPress={() => navigation.navigate('Feedback')} />
          </SectionCard>

          {/* ACTIONS */}
          <SectionHeader icon="power" label="ACTIONS" />
          <SectionCard>
            <SettingItem icon="logout" title="Log Out" desc="Sign out from your account" onPress={handleLogout} danger />
          </SectionCard>

          <Text style={[styles.version, { color: colors.placeholder }]}>Fixam v1.0.4 · Production</Text>
          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingBottom: 20 },

  pageHeader: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 16 : 8,
    paddingBottom: 12,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 4,
  },
  pageTitle: { fontSize: 28, fontWeight: '900' },
  pageSub: { fontSize: 13 },
  bellBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },

  // Hero card
  heroWrapper: { marginHorizontal: 16, marginBottom: 24, borderRadius: 20, overflow: 'hidden' },
  heroCard: { flexDirection: 'row', alignItems: 'center', padding: 20, position: 'relative', overflow: 'hidden' },
  gearDecor: { position: 'absolute', right: 40, top: -20 },
  heroLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 14 },
  heroAvatarWrap: { position: 'relative' },
  heroAvatar: { width: 66, height: 66, borderRadius: 33, borderWidth: 3, borderColor: 'rgba(255,255,255,0.5)' },
  heroAvatarFallback: { width: 66, height: 66, borderRadius: 33, alignItems: 'center', justifyContent: 'center' },
  heroInitial: { fontSize: 26, fontWeight: '900', color: '#FFF' },
  editDot: { position: 'absolute', bottom: 0, right: 0, width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#FFF' },
  heroName: { fontSize: 18, fontWeight: '800', color: '#FFF' },
  heroRole: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  verBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6, alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  verText: { fontSize: 11, fontWeight: '800' },

  // Section
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 20, marginBottom: 8 },
  sectionLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 0.8, textTransform: 'uppercase' },
  sectionCard: {
    marginHorizontal: 16, marginBottom: 20, borderRadius: 18, borderWidth: 1,
    shadowOpacity: 0.05, shadowRadius: 10, elevation: 2, overflow: 'hidden',
  },

  // Row
  settingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, gap: 12 },
  iconBox: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  settingBody: { flex: 1 },
  settingTitle: { fontSize: 15, fontWeight: '700' },
  settingDesc: { fontSize: 12, marginTop: 2 },
  statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusPillText: { fontSize: 10, fontWeight: '900' },

  version: { textAlign: 'center', fontSize: 12, fontWeight: '600', marginTop: 10 },
});

export default SettingsScreen;
