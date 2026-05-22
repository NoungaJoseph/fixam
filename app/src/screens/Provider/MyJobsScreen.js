import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, FlatList,
  Image, StatusBar, SafeAreaView, Platform, Alert, ScrollView
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api';
import { useAppContext } from '../../context/AppContext';

const TABS = [
  { key: 'All Jobs', label: 'All Jobs', icon: 'all-inclusive' },
  { key: 'Booked', label: 'Booked Jobs', icon: 'calendar-clock' },
  { key: 'Active', label: 'In Progress', icon: 'progress-clock' },
  { key: 'Requests', label: 'Pending', icon: 'clock-outline' },
  { key: 'Completed', label: 'Completed', icon: 'check-circle-outline' },
  { key: 'Cancelled', label: 'Cancelled', icon: 'close-circle-outline' },
];

const STATUS_CONFIG = {
  Requests:  { label: 'Pending',     color: '#F59E0B', bg: '#FFFBEB', icon: 'clock-outline' },
  Booked:    { label: 'Booked',      color: '#8B5CF6', bg: '#F5F3FF', icon: 'calendar-clock' },
  Active:    { label: 'In Progress', color: '#2563EB', bg: '#EFF6FF', icon: 'progress-clock' },
  Completed: { label: 'Completed',   color: '#22C55E', bg: '#F0FDF4', icon: 'check-circle' },
  Cancelled: { label: 'Cancelled',   color: '#EF4444', bg: '#FEF2F2', icon: 'close-circle-outline' },
};

const MyJobsScreen = ({ navigation }) => {
  const { isDarkMode, colors } = useTheme();
  const { transactions, notificationCount } = useAppContext();
  const [jobs, setJobs] = useState([]);
  const [activeTab, setActiveTab] = useState('All Jobs');

  const fetchMyJobs = useCallback(async () => {
    try {
      const res = await api.get('/jobs/my-jobs');
      setJobs(res.data.data || []);
    } catch (e) {
      setJobs([]);
    }
  }, []);

  useEffect(() => {
    const unsub = navigation.addListener('focus', fetchMyJobs);
    fetchMyJobs();
    return unsub;
  }, [fetchMyJobs, navigation]);

  const mapped = jobs.map(job => {
    let statusVal = 'Active';
    if (job.status === 'COMPLETED') statusVal = 'Completed';
    else if (job.status === 'CANCELLED') statusVal = 'Cancelled';
    else if (job.status === 'SCHEDULED' || job.status === 'BOOKED' || (job.status === 'ASSIGNED' && job.scheduledTime)) statusVal = 'Booked';
    else if (job.assignmentStatus === 'PENDING' || job.status === 'PENDING') statusVal = 'Requests';
    return {
      id: job.id,
      title: job.title,
      status: statusVal,
      client: job.client?.fullName || 'Client',
      avatar: job.client?.avatar,
      time: job.scheduledTime ? new Date(job.scheduledTime).toLocaleString() : 'ASAP',
      budget: Number(job.budget || 0),
      location: job.location || 'On-site',
      description: job.description,
      category: job.category,
      rawJob: job,
    };
  });

  const totalJobs = mapped.length;
  const bookedCount = mapped.filter(j => j.status === 'Booked').length;
  const inProgress = mapped.filter(j => j.status === 'Active').length;
  const completed = mapped.filter(j => j.status === 'Completed').length;
  const totalEarned = mapped.filter(j => j.status === 'Completed').reduce((s, j) => s + j.budget, 0);
  const liveEarned = totalEarned > 0 ? totalEarned : transactions
    .filter(t => ['CREDIT', 'EARNING'].includes(t.type?.toUpperCase()))
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const filtered = activeTab === 'All Jobs' ? mapped : mapped.filter(j => j.status === activeTab);

  const handleUpdateStatus = async (jobId, status) => {
    try {
      await api.put(`/jobs/${jobId}/status`, { status });
      fetchMyJobs();
    } catch {
      alert('Failed to update job status');
    }
  };

  const StatCard = ({ icon, value, label, sub, color, bg }) => (
    <View style={[styles.statCard, { backgroundColor: colors.card, shadowColor: isDarkMode ? 'transparent' : '#000' }]}>
      <View style={[styles.statIcon, { backgroundColor: bg || '#F0FDFA' }]}>
        <MaterialCommunityIcons name={icon} size={22} color={color || colors.accent} />
      </View>
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
      {sub && <Text style={[styles.statSub, { color: color || colors.accent }]}>{sub}</Text>}
    </View>
  );

  const renderJob = ({ item }) => {
    const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.Requests;
    const darkBg = isDarkMode ? 'rgba(255,255,255,0.06)' : cfg.bg;
    return (
      <TouchableOpacity
        style={[styles.jobCard, { backgroundColor: colors.card, shadowColor: isDarkMode ? 'transparent' : '#000' }]}
        onPress={() => navigation.navigate('TaskDetails', { task: item.rawJob })}
        activeOpacity={0.85}
      >
        <View style={styles.jobRow}>
          <Image
            source={{ uri: `https://source.unsplash.com/160x120/?${item.category || 'work'}` }}
            style={styles.jobImg}
          />
          <View style={styles.jobContent}>
            <Text style={[styles.jobTitle, { color: colors.text }]} numberOfLines={2}>{item.title}</Text>
            <View style={styles.metaRow}>
              <MaterialCommunityIcons name="map-marker-outline" size={12} color={colors.textSecondary} />
              <Text style={[styles.metaText, { color: colors.textSecondary }]} numberOfLines={1}>{item.location}</Text>
            </View>
            <View style={styles.metaRow}>
              <MaterialCommunityIcons name="clock-outline" size={12} color={colors.textSecondary} />
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>{item.time}</Text>
            </View>
            <View style={styles.jobFooter}>
              <View style={[styles.budgetBox, { backgroundColor: isDarkMode ? 'rgba(13,148,136,0.15)' : '#F0FDFA' }]}>
                <Text style={[styles.budgetText, { color: colors.accent }]}>
                  {item.budget.toLocaleString()} FCFA
                </Text>
                <Text style={[styles.estimatedText, { color: colors.textSecondary }]}>Estimated</Text>
              </View>
              <View>
                <View style={[styles.statusBadge, { backgroundColor: darkBg }]}>
                  <MaterialCommunityIcons name={cfg.icon} size={11} color={cfg.color} />
                  <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
                </View>
                <Text style={[styles.statusSub, { color: colors.textSecondary }]}>{item.time}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.actionRow, { borderTopColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.chatBtn, { borderColor: colors.border }]}
            onPress={() => navigation.navigate('Chat', {
              receiverId: item.rawJob.clientId,
              userName: item.client,
              avatar: item.avatar,
              task: item.rawJob,
            })}
          >
            <MaterialCommunityIcons name="message-text-outline" size={16} color={colors.accent} />
            <Text style={[styles.chatBtnText, { color: colors.accent }]}>Chat</Text>
          </TouchableOpacity>

          {item.status === 'Requests' && (
            <TouchableOpacity
              style={[styles.primaryBtn, { backgroundColor: colors.accent }]}
              onPress={() => navigation.navigate('TaskDetails', { task: item.rawJob })}
            >
              <Text style={styles.primaryBtnText}>Review</Text>
            </TouchableOpacity>
          )}
          {item.status === 'Booked' && (
            <TouchableOpacity
              style={[styles.primaryBtn, { backgroundColor: colors.accent }]}
              onPress={() => Alert.alert('Start Job', 'Are you ready to start this scheduled job now?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Start', onPress: () => handleUpdateStatus(item.rawJob.id, 'IN_PROGRESS') },
              ])}
            >
              <Text style={styles.primaryBtnText}>Start Job</Text>
            </TouchableOpacity>
          )}
          {item.status === 'Active' && (
            <TouchableOpacity
              style={[styles.primaryBtn, { backgroundColor: '#22C55E' }]}
              onPress={() => Alert.alert('Mark Complete', 'Mark this job as completed?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Complete', onPress: () => handleUpdateStatus(item.rawJob.id, 'COMPLETED') },
              ])}
            >
              <Text style={styles.primaryBtnText}>Mark Completed</Text>
            </TouchableOpacity>
          )}
          {item.status === 'Completed' && (
            <TouchableOpacity
              style={[styles.primaryBtn, { backgroundColor: colors.accent }]}
              onPress={() => navigation.navigate('ReviewTask', { task: item.rawJob, provider: { id: item.rawJob.clientId, fullName: item.client } })}
            >
              <MaterialCommunityIcons name="star-outline" size={13} color="#FFF" />
              <Text style={styles.primaryBtnText}>Rate Client</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />

      {/* Header Top Row */}
      <View style={styles.headerTop}>
        {/* Hamburger circular menu */}
        <TouchableOpacity style={[styles.menuBtn, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => navigation.openDrawer()}>
          <MaterialCommunityIcons name="menu" size={24} color={colors.text} />
        </TouchableOpacity>

        {/* Title Area */}
        <View style={styles.titleArea}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>My Jobs</Text>
          <Text style={[styles.headerSub, { color: colors.textSecondary }]}>Manage your jobs and track progress</Text>
        </View>

        {/* Bell Icon with badge */}
        <TouchableOpacity style={[styles.bellBtn, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => navigation.navigate('Notifications')}>
          <MaterialCommunityIcons name="bell-outline" size={22} color={colors.text} />
          {notificationCount > 0 && (
            <View style={styles.bellBadge}>
              <Text style={styles.bellBadgeText}>{notificationCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Stat Cards Grid (2-row grid for balance and breathing room) */}
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <StatCard icon="clipboard-check" value={totalJobs}    label="Total Jobs"    sub="All time"  color="#22C55E" bg="#E6FDF3" />
          <StatCard icon="calendar-clock"  value={bookedCount}   label="Booked"        sub="Scheduled" color="#8B5CF6" bg="#F5F3FF" />
          <StatCard icon="clock"           value={inProgress}   label="In Progress"  sub="Active now" color="#2563EB" bg="#EFF6FF" />
        </View>
        <View style={[styles.statsRow, { marginTop: 8 }]}>
          <StatCard icon="check-decagram"  value={completed}    label="Completed"    sub="All time"  color="#F59E0B" bg="#FFFBEB" />
          <StatCard icon="wallet"          value={liveEarned.toLocaleString()} label="Total Earned" sub="FCFA" color="#0D9488" bg="#E6FDF3" />
        </View>
      </View>

      {/* Tabs Row */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {TABS.map(tab => {
            const active = activeTab === tab.key;
            if (active) {
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[styles.tabActive, { backgroundColor: isDarkMode ? 'rgba(13,148,136,0.15)' : '#E6FDF3' }]}
                  onPress={() => setActiveTab(tab.key)}
                >
                  <View style={styles.tabContent}>
                    <MaterialCommunityIcons name={tab.icon} size={14} color="#0D9488" />
                    <Text style={styles.tabTextActive}>{tab.label}</Text>
                  </View>
                  <View style={styles.tabIndicator} />
                </TouchableOpacity>
              );
            }
            return (
              <TouchableOpacity
                key={tab.key}
                style={styles.tab}
                onPress={() => setActiveTab(tab.key)}
              >
                <View style={styles.tabContent}>
                  <MaterialCommunityIcons name={tab.icon} size={14} color={colors.textSecondary} />
                  <Text style={[styles.tabText, { color: colors.textSecondary }]}>{tab.label}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        renderItem={renderJob}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialCommunityIcons name="clipboard-text-outline" size={64} color={colors.border} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No jobs found</Text>
            <Text style={[styles.emptySub, { color: colors.textSecondary }]}>Jobs will appear here once assigned</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Header
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 50,
    paddingBottom: 12,
  },
  menuBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  titleArea: {
    flex: 1,
    marginLeft: 15,
  },
  headerTitle: { fontSize: 26, fontWeight: '900' },
  headerSub: { fontSize: 12, marginTop: 1, color: '#64748B' },
  bellBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  bellBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#EF4444',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellBadgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '900',
  },

  // Stats
  statsContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    marginHorizontal: 3,
    borderRadius: 14,
    padding: 8,
    justifyContent: 'space-between',
    height: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 0.5,
    borderColor: '#E2E8F0',
  },
  statIcon: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  statValue: { fontSize: 16, fontWeight: '900', marginTop: 8 },
  statLabel: { fontSize: 8.5, fontWeight: '800', marginTop: 1 },
  statSub: { fontSize: 8, fontWeight: '700', marginTop: 1 },

  // Tabs
  tabsContainer: {
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tabsScroll: { paddingHorizontal: 16, gap: 8, alignItems: 'center' },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFF',
  },
  tabActive: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    position: 'relative',
  },
  tabContent: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  tabText: { fontSize: 11, fontWeight: '700' },
  tabTextActive: { fontSize: 11, fontWeight: '900', color: '#0D9488' },
  tabIndicator: {
    position: 'absolute',
    bottom: -8,
    left: '30%',
    right: '30%',
    height: 2,
    backgroundColor: '#0D9488',
    borderRadius: 1,
  },

  // Jobs
  listContent: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 110 },
  jobCard: { borderRadius: 18, marginBottom: 14, overflow: 'hidden', shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  jobRow: { flexDirection: 'row' },
  jobImg: { width: 110, height: 130 },
  jobContent: { flex: 1, padding: 12 },
  jobTitle: { fontSize: 14, fontWeight: '800', marginBottom: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 3 },
  metaText: { fontSize: 12, flex: 1 },
  jobFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 8 },
  budgetBox: { borderRadius: 10, padding: 6, alignItems: 'center' },
  budgetText: { fontSize: 13, fontWeight: '800' },
  estimatedText: { fontSize: 10, fontWeight: '500', marginTop: 1 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 10, fontWeight: '800' },
  statusSub: { fontSize: 10, textAlign: 'right', marginTop: 2 },
  actionRow: { flexDirection: 'row', gap: 8, padding: 12, borderTopWidth: 1 },
  chatBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, height: 38, borderRadius: 12, borderWidth: 1.5 },
  chatBtnText: { fontSize: 13, fontWeight: '700' },
  primaryBtn: { flex: 1.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, height: 38, borderRadius: 12 },
  primaryBtnText: { color: '#FFF', fontSize: 13, fontWeight: '800' },

  // Empty
  empty: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700' },
  emptySub: { fontSize: 14 },
});

export default MyJobsScreen;
