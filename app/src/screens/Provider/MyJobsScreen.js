import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, FlatList,
  Image, StatusBar, SafeAreaView, Platform, Alert
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../services/api';

const MyJobsScreen = ({ navigation }) => {
  const { isDarkMode, colors } = useTheme();
  const [jobs, setJobs] = useState([]);
  const [activeTab, setActiveTab] = useState('Requests');
  const tabs = ['Requests', 'Active', 'Completed'];

  const fetchMyJobs = useCallback(async () => {
    try {
      const res = await api.get('/jobs/my-jobs');
      setJobs(res.data.data || []);
    } catch (error) {
      console.log('Error fetching provider jobs:', error.message);
      setJobs([]);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchMyJobs);
    fetchMyJobs();
    return unsubscribe;
  }, [fetchMyJobs, navigation]);

  const incomingJobs = (jobs || []).map(job => ({
    id: job.id,
    title: job.title,
    status: job.status === 'COMPLETED' ? 'Completed' : (job.assignmentStatus === 'PENDING' ? 'Requests' : 'Active'),
    client: job.client?.fullName || 'New Client',
    avatar: job.client?.avatar,
    time: job.scheduledTime ? new Date(job.scheduledTime).toLocaleDateString() : 'ASAP',
    budget: `${job.budget} FCFA`,
    location: job.location,
    details: job.description,
    rawJob: job
  }));

  const filteredJobs = incomingJobs.filter(job => job.status === activeTab);

  const handleUpdateStatus = async (jobId, status) => {
    try {
      await api.put(`/jobs/${jobId}/status`, { status });
      fetchMyJobs();
    } catch (error) {
      alert('Failed to update job status');
    }
  };

  const renderJob = ({ item }) => (
    <TouchableOpacity
      style={[styles.jobCard, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: isDarkMode ? 1 : 0 }]}
      onPress={() => navigation.navigate('TaskDetails', { task: item.rawJob })}
    >
      <View style={styles.jobHeader}>
        <View style={[styles.statusPill, { backgroundColor: activeTab === 'Requests' ? colors.accentSoft : isDarkMode ? 'rgba(255,255,255,0.06)' : '#F3F4F6' }]}>
          <MaterialCommunityIcons name={activeTab === 'Requests' ? 'bell-plus-outline' : activeTab === 'Active' ? 'progress-clock' : 'check-decagram-outline'} size={14} color={activeTab === 'Requests' ? colors.accent : colors.textSecondary} />
          <Text style={[styles.statusText, { color: activeTab === 'Requests' ? colors.accent : colors.textSecondary }]}>{activeTab}</Text>
        </View>
        <Text style={[styles.jobBudget, { color: colors.accent }]}>{item.budget}</Text>
      </View>
      <Text style={[styles.jobTitle, { color: colors.text }]}>{item.title}</Text>
      <Text style={[styles.jobDetails, { color: colors.textSecondary }]}>{item.details}</Text>

      <View style={styles.clientRow}>
        <Image 
          source={item.avatar ? { uri: item.avatar } : { uri: `https://ui-avatars.com/api/?name=${item.client}&background=random` }} 
          style={styles.avatar} 
        />
        <View style={{ flex: 1 }}>
          <Text style={[styles.clientLabel, { color: colors.textSecondary }]}>Client</Text>
          <Text style={[styles.clientName, { color: colors.text }]}>{item.client}</Text>
        </View>
        <View style={[styles.locationBadge, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#F8FAFC' }]}>
          <MaterialCommunityIcons name="map-marker-outline" size={13} color={colors.textSecondary} />
          <Text style={[styles.timeText, { color: colors.textSecondary }]}>{item.location}</Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity 
          style={[styles.chatBtn, { borderColor: colors.primary }]} 
          onPress={() => navigation.navigate('Chat', { receiverId: item.rawJob.clientId, userName: item.client, avatar: item.avatar, task: item.rawJob })}
        >
          <MaterialCommunityIcons name="message-outline" size={18} color={colors.primary} />
          <Text style={[styles.chatBtnText, { color: colors.text }]}>Chat</Text>
        </TouchableOpacity>
        {item.status === 'Requests' && (
          <TouchableOpacity 
            style={[styles.startBtn, { backgroundColor: colors.accent }]}
            onPress={() => navigation.navigate('TaskDetails', { task: item.rawJob })}
          >
            <Text style={styles.startBtnText}>Review Request</Text>
          </TouchableOpacity>
        )}
        {item.status === 'Active' && (
          <TouchableOpacity 
            style={[styles.startBtn, { backgroundColor: colors.success }]}
            onPress={() => {
              Alert.alert('Mark Complete', 'Is this task complete?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Yes', onPress: () => handleUpdateStatus(item.rawJob.id, 'COMPLETED') }
              ]);
            }}
          >
            <Text style={styles.startBtnText}>Mark Completed</Text>
          </TouchableOpacity>
        )}
        {item.status === 'Completed' && (
          <TouchableOpacity 
            style={[styles.startBtn, { backgroundColor: colors.accent }]}
            onPress={() => navigation.navigate('ReviewTask', { task: item.rawJob, provider: { id: item.rawJob.clientId, fullName: item.client } })}
          >
            <MaterialCommunityIcons name="star-outline" size={14} color="#FFF" style={{ marginRight: 4 }} />
            <Text style={styles.startBtnText}>Rate Client</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={isDarkMode ? ['#0F172A', '#1E1B4B', '#020617'] : ['#FFFFFF', '#F8FAFC', '#F1F5F9']}
      style={styles.container}
    >
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor="transparent" translucent />

      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>My Jobs</Text>
            <Text style={[styles.headerSub, { color: colors.textSecondary }]}>Requests, active work, and completed services</Text>
          </View>
          <TouchableOpacity style={[styles.headerIcon, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <MaterialCommunityIcons name="filter-variant" size={22} color={colors.accent} />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabBar}>
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, { backgroundColor: activeTab === tab ? colors.accent : (isDarkMode ? 'rgba(255,255,255,0.05)' : '#F3F4F6') }]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, { color: activeTab === tab ? '#FFF' : colors.textSecondary }]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={filteredJobs}
          keyExtractor={item => item.id}
          renderItem={renderJob}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="clipboard-text-outline" size={60} color={colors.border} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No {activeTab.toLowerCase()} jobs found.</Text>
            </View>
          }
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 20) + 20 : 20, 
    paddingHorizontal: 20, 
    paddingBottom: 20, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  headerTitle: { fontSize: 24, fontWeight: '800' },
  headerSub: { fontSize: 13, marginTop: 4 },
  headerIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  tabBar: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 20, gap: 10 },
  tab: { paddingVertical: 10, paddingHorizontal: 15, borderRadius: 12 },
  tabText: { fontSize: 13, fontWeight: '600' },
  listContent: { paddingHorizontal: 20, paddingBottom: 100 },
  jobCard: { borderRadius: 20, padding: 18, marginBottom: 15 },
  jobHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, alignItems: 'center' },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  statusText: { fontSize: 11, fontWeight: '900' },
  jobTitle: { fontSize: 17, fontWeight: '700' },
  jobDetails: { fontSize: 13, lineHeight: 19, marginTop: 7, marginBottom: 15 },
  jobBudget: { fontSize: 16, fontWeight: '800' },
  clientRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 15 },
  avatar: { width: 40, height: 40, borderRadius: 12 },
  clientLabel: { fontSize: 11, fontWeight: '600' },
  clientName: { fontSize: 14, fontWeight: '700' },
  locationBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 9, paddingVertical: 6, borderRadius: 8 },
  timeText: { fontSize: 12, fontWeight: '600' },
  actionRow: { flexDirection: 'row', gap: 10 },
  chatBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 44, borderRadius: 12, borderWidth: 1.5 },
  chatBtnText: { fontSize: 14, fontWeight: '700' },
  startBtn: { flex: 1.5, justifyContent: 'center', alignItems: 'center', height: 44, borderRadius: 12 },
  startBtnText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  emptyContainer: { alignItems: 'center', marginTop: 100, gap: 15 },
  emptyText: { fontSize: 15, fontWeight: '600' },
});

export default MyJobsScreen;
