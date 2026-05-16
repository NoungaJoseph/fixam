import React, { useState } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, ScrollView,
  StatusBar, SafeAreaView, Alert
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const NotificationsScreen = ({ navigation }) => {
  const { isDarkMode, colors } = useTheme();
  const [filter, setFilter] = useState('All');
  const { t } = useLanguage();
  const { notifications, markNotificationAsRead, archiveNotification } = useAppContext();
  const { user } = useAuth();

  const getIcon = (type) => {
    switch (type) {
      case 'TRANSACTION': return 'wallet';
      case 'VERIFICATION': return 'shield-check';
      case 'JOB': return 'briefcase';
      default: return 'bell';
    }
  };

  const getTimeLabel = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = Math.floor((now - d) / 1000 / 60);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff} mins ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
    return d.toLocaleDateString();
  };

  const handleNotificationPress = async (notif) => {
    try {
      if (!notif.isRead) {
        await markNotificationAsRead(notif.id);
      }

      if (notif.data?.type === 'TRANSACTION') {
        navigation.getParent()?.getParent()?.navigate('Wallet', {
          screen: user?.role === 'PROVIDER' ? 'CoinSystem' : 'WalletMain'
        });
      } else if (notif.data?.type === 'VERIFICATION') {
        navigation.navigate('Verification');
      } else if ((notif.data?.type === 'JOB' || notif.data?.type === 'JOB_APPLICATION') && notif.data?.jobId) {
        const res = await api.get(`/jobs/${notif.data.jobId}`);
        const job = res.data.data;
        if (user?.role === 'PROVIDER') {
          navigation.getParent()?.getParent()?.navigate('MainTabs', {
            screen: 'Home',
            params: { screen: 'TaskDetails', params: { task: job } }
          });
        } else {
          navigation.getParent()?.getParent()?.navigate('Tasks', {
            screen: 'JobStatus',
            params: { job }
          });
        }
      }
    } catch (error) {
      Alert.alert('Could not open notification', error.response?.data?.message || 'Please try again.');
    }
  };

  const handleArchive = async (notif) => {
    try {
      await archiveNotification(notif.id);
    } catch (error) {
      Alert.alert('Could not archive notification', error.response?.data?.message || 'Please try again.');
    }
  };

  const filteredNotifs = notifications.filter(n => {
    if (filter === 'All') return true;
    if (filter === 'Unread') return !n.isRead;
    if (filter === 'Archive') return n.isRead;
    return true;
  });

  return (
    <View style={[styles.background, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <MaterialCommunityIcons name="chevron-left" size={28} color={colors.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{t('notifications.title')}</Text>
          <View style={styles.markBtn} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <View style={styles.filterRow}>
              {[
                { key: 'All', label: t('notifications.all') },
                { key: 'Unread', label: t('notifications.unread') },
                { key: 'Archive', label: t('notifications.archive') },
              ].map(item => (
                <TouchableOpacity
                  key={item.key}
                  onPress={() => setFilter(item.key)}
                  style={[styles.filterChip, { backgroundColor: filter === item.key ? colors.accent : colors.background, borderColor: colors.border }]}
                >
                  <Text style={[styles.filterText, { color: filter === item.key ? '#FFF' : colors.textSecondary }]}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>{t('notifications.recent')}</Text>
            
            {filteredNotifs.length === 0 ? (
              <View style={styles.emptyState}>
                <View style={[styles.emptyIconCircle, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#F8FAFC' }]}>
                  <MaterialCommunityIcons name="bell-off-outline" size={64} color={colors.placeholder} />
                </View>
                <Text style={[styles.emptyTitle, { color: colors.text }]}>No notifications</Text>
                <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>
                  {filter === 'Unread' ? "You've read all your notifications!" : "We'll notify you when something important happens."}
                </Text>
              </View>
            ) : (
              filteredNotifs.map(notif => (
                <TouchableOpacity 
                  key={notif.id} 
                  onPress={() => handleNotificationPress(notif)}
                  style={[
                    styles.notifCard, 
                    { borderBottomColor: colors.border }
                  ]}
                >
                  <View style={styles.notifIcon}>
                    <MaterialCommunityIcons name={getIcon(notif.data?.type)} size={24} color={!notif.isRead ? colors.accent : colors.primary} />
                  </View>
                  <View style={styles.notifInfo}>
                    <View style={styles.notifHeader}>
                      <Text style={[styles.notifTitle, { color: colors.text }]}>{notif.title}</Text>
                      <Text style={[styles.notifTime, { color: colors.textSecondary }]}>{getTimeLabel(notif.createdAt)}</Text>
                    </View>
                    <Text style={[styles.notifDesc, { color: colors.textSecondary }]}>{notif.body}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={(event) => {
                      event.stopPropagation?.();
                      handleArchive(notif);
                    }}
                    style={styles.archiveBtn}
                  >
                    <MaterialCommunityIcons name="archive-outline" size={18} color={colors.textSecondary} />
                  </TouchableOpacity>
                  {!notif.isRead && <View style={[styles.unreadDot, { backgroundColor: colors.accent }]} />}
                </TouchableOpacity>
              ))
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 },
  backBtn: { width: 40, height: 40, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  markBtn: { padding: 5 },
  markText: { fontSize: 13, fontWeight: '700' },
  filterRow: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  filterChip: { flex: 1, alignItems: 'center', paddingVertical: 11, borderRadius: 8, borderWidth: 1 },
  filterText: { fontSize: 13, fontWeight: '800' },
  scrollContent: { padding: 20 },
  section: { marginBottom: 30 },
  sectionLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 15, textTransform: 'uppercase' },
  divider: { height: 1 },
  notifCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1 },
  notifIcon: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  notifInfo: { flex: 1, marginLeft: 15 },
  notifHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  notifTitle: { fontSize: 15, fontWeight: '700' },
  notifTime: { fontSize: 11 },
  notifDesc: { fontSize: 13 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, marginLeft: 10 },
  archiveBtn: { width: 34, height: 34, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, paddingHorizontal: 40 },
  emptyIconCircle: { width: 120, height: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  emptyTitle: { fontSize: 20, fontWeight: '800', marginBottom: 12 },
  emptyDesc: { fontSize: 14, textAlign: 'center', lineHeight: 22 },
});

export default NotificationsScreen;
