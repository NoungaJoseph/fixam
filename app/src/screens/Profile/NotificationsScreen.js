import React, { useState } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, ScrollView,
  StatusBar, SafeAreaView, Alert, Platform
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const ICON_CONFIG = {
  TRANSACTION:     { icon: 'wallet',         color: '#0D9488', bg: '#F0FDFA' },
  VERIFICATION:    { icon: 'shield-check',   color: '#2563EB', bg: '#EFF6FF' },
  JOB:             { icon: 'briefcase',      color: '#8B5CF6', bg: '#F5F3FF' },
  JOB_APPLICATION: { icon: 'send',           color: '#F59E0B', bg: '#FFFBEB' },
  DEFAULT:         { icon: 'bell',           color: '#64748B', bg: '#F1F5F9' },
};

const NotificationsScreen = ({ navigation }) => {
  const { isDarkMode, colors } = useTheme();
  const [filter, setFilter] = useState('All');
  const { t, currentLanguage } = useLanguage();
  const { notifications, markNotificationAsRead, archiveNotification } = useAppContext();
  const { user } = useAuth();

  const getConfig = (type) => ICON_CONFIG[type] || ICON_CONFIG.DEFAULT;

  const getTimeLabel = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = Math.floor((now - d) / 1000 / 60);
    if (diff < 1) return t('notifications.justNow');
    if (diff < 60) return t('notifications.minutesAgo', { count: diff });
    if (diff < 1440) return t('notifications.hoursAgo', { count: Math.floor(diff / 60) });
    return d.toLocaleDateString(currentLanguage === 'fr' ? 'fr-FR' : 'en-US', { month: 'short', day: 'numeric' });
  };

  const handlePress = async (notif) => {
    try {
      if (!notif.isRead) await markNotificationAsRead(notif.id);
      if (notif.data?.type === 'TRANSACTION') {
        if (user?.role === 'PROVIDER') {
          navigation.getParent()?.getParent()?.navigate('Wallet', { screen: 'CoinSystem' });
        } else {
          navigation.navigate('TopUp');
        }
      } else if (notif.data?.type === 'VERIFICATION') {
        navigation.navigate('Settings', { screen: 'Verification' });
      } else if ((notif.data?.type === 'JOB' || notif.data?.type === 'JOB_APPLICATION') && notif.data?.jobId) {
        const res = await api.get(`/jobs/${notif.data.jobId}`);
        const job = res.data.data;
        if (user?.role === 'PROVIDER') {
          navigation.getParent()?.getParent()?.navigate('MainTabs', { screen: 'Home', params: { screen: 'TaskDetails', params: { task: job } } });
        } else {
          navigation.getParent()?.getParent()?.navigate('Tasks', { screen: 'JobStatus', params: { job } });
        }
      }
    } catch (err) {
      Alert.alert(t('common.error'), err.response?.data?.message || t('common.tryAgain'));
    }
  };

  const handleArchive = async (notif) => {
    try { await archiveNotification(notif.id); }
    catch (err) { Alert.alert(t('common.error'), err.response?.data?.message || t('common.tryAgain')); }
  };

  const filtered = notifications.filter(n => {
    if (filter === 'Unread') return !n.isRead;
    if (filter === 'Archive') return n.isRead;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      <SafeAreaView style={{ flex: 1 }}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons name="arrow-left" size={20} color={colors.text} />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>{t('notifications.title')}</Text>
            {unreadCount > 0 && (
              <Text style={[styles.headerSub, { color: colors.accent }]}>{t('notifications.unreadCount', { count: unreadCount })}</Text>
            )}
          </View>
          <View style={[styles.countBadge, { backgroundColor: colors.accent }]}>
            <Text style={styles.countText}>{notifications.length}</Text>
          </View>
        </View>

        {/* Filter Chips */}
        <View style={styles.filtersRow}>
          {['All', 'Unread', 'Archive'].map(f => {
            const active = filter === f;
            return (
              <TouchableOpacity
                key={f}
                style={[styles.chip, { backgroundColor: active ? colors.accent : colors.card, borderColor: active ? colors.accent : colors.border }]}
                onPress={() => setFilter(f)}
              >
                <Text style={[styles.chipText, { color: active ? '#FFF' : colors.text }]}>{t(`notifications.filters.${f.toLowerCase()}`)}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {filtered.length === 0 ? (
            <View style={styles.empty}>
              <View style={[styles.emptyCircle, { backgroundColor: isDarkMode ? '#1E293B' : '#F1F5F9' }]}>
                <MaterialCommunityIcons name="bell-off-outline" size={56} color={colors.placeholder} />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>{t('notifications.emptyTitle')}</Text>
              <Text style={[styles.emptySub, { color: colors.textSecondary }]}>
                {filter === 'Unread' ? t('notifications.emptyUnread') : t('notifications.emptySubtitle')}
              </Text>
            </View>
          ) : (
            filtered.map(notif => {
              const cfg = getConfig(notif.data?.type);
              const darkBg = isDarkMode ? 'rgba(255,255,255,0.06)' : cfg.bg;
              return (
                <TouchableOpacity
                  key={notif.id}
                  style={[styles.notifRow, {
                    backgroundColor: !notif.isRead
                      ? (isDarkMode ? 'rgba(13,148,136,0.06)' : '#F0FDFA')
                      : colors.card,
                    borderColor: !notif.isRead ? '#0D9488' : colors.border,
                    borderLeftWidth: !notif.isRead ? 5 : 1,
                    shadowColor: isDarkMode ? 'transparent' : '#000',
                  }]}
                  onPress={() => handlePress(notif)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.notifIcon, { backgroundColor: darkBg }]}>
                    <MaterialCommunityIcons name={cfg.icon} size={22} color={cfg.color} />
                  </View>
                  <View style={styles.notifBody}>
                    <View style={styles.notifTop}>
                      <Text style={[styles.notifTitle, { color: colors.text }]} numberOfLines={1}>{notif.title}</Text>
                      <Text style={[styles.notifTime, { color: colors.placeholder }]}>{getTimeLabel(notif.createdAt)}</Text>
                    </View>
                    <Text style={[styles.notifDesc, { color: colors.textSecondary }]} numberOfLines={2}>{notif.body}</Text>
                  </View>
                  <View style={styles.notifActions}>
                    <View style={{ width: 8, height: 8 }}>
                      {!notif.isRead && <View style={[styles.unreadDot, { backgroundColor: colors.accent }]} />}
                    </View>
                    <TouchableOpacity
                      style={[styles.archiveBtn, { backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC' }]}
                      onPress={(e) => { e.stopPropagation?.(); handleArchive(notif); }}
                    >
                      <MaterialCommunityIcons name="archive-outline" size={16} color={colors.placeholder} />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 12,
    paddingBottom: 14,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  headerTitle: { fontSize: 20, fontWeight: '900' },
  headerSub: { fontSize: 12, fontWeight: '700', marginTop: 2 },
  countBadge: { minWidth: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  countText: { color: '#FFF', fontSize: 12, fontWeight: '900' },

  filtersRow: { flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 12, gap: 8 },
  chip: { flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: 22, borderWidth: 1 },
  chipText: { fontSize: 13, fontWeight: '700' },

  scroll: { paddingHorizontal: 16, paddingTop: 4 },
  notifRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1,
    shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  notifIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  notifBody: { flex: 1 },
  notifTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  notifTitle: { fontSize: 14, fontWeight: '800', flex: 1, marginRight: 6 },
  notifTime: { fontSize: 11, fontWeight: '500' },
  notifDesc: { fontSize: 13, lineHeight: 18 },
  notifActions: { alignItems: 'flex-end', gap: 8, flexShrink: 0 },
  unreadDot: { width: 8, height: 8, borderRadius: 4 },
  archiveBtn: { width: 30, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },

  empty: { alignItems: 'center', paddingTop: 80, gap: 16 },
  emptyCircle: { width: 110, height: 110, borderRadius: 55, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 20, fontWeight: '800' },
  emptySub: { fontSize: 14, textAlign: 'center', paddingHorizontal: 40, lineHeight: 20 },
});

export default NotificationsScreen;
