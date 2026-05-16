import React, { useState } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, ScrollView,
  Image, StatusBar, SafeAreaView, Alert
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const JobStatusScreen = ({ route, navigation }) => {
  const { isDarkMode, colors } = useTheme();
  const { user } = useAuth();
  const [job, setJob] = useState(route.params?.job || {});

  const normalizedStatus = String(job.status || 'PENDING').toUpperCase();
  const displayStatus = normalizedStatus.replace(/_/g, ' ');
  const selectedAssignment = job.assignments?.find((assignment) => assignment.status === 'ACCEPTED');
  const assignedProviderUser = job.provider || selectedAssignment?.provider?.user;
  const assignedProvider = assignedProviderUser ? {
    name: assignedProviderUser.fullName || assignedProviderUser.name || 'Assigned Professional',
    id: assignedProviderUser.id,
    avatar: assignedProviderUser.avatar || assignedProviderUser.image,
  } : null;
  const steps = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];
  const currentStep = Math.max(0, steps.indexOf(normalizedStatus));

  React.useEffect(() => {
    if (!route.params?.job?.id) return;

    let isMounted = true;
    api.get(`/jobs/${route.params.job.id}`)
      .then((res) => {
        if (isMounted && res.data?.data) setJob(res.data.data);
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [route.params?.job?.id]);

  const getProviderFromAssignment = (assignment) => {
    const provider = assignment?.provider || assignment?.providerProfile || null;
    const providerUser = provider?.user || assignment?.providerUser || assignment?.user || null;

    if (!provider && !providerUser) return null;

    return {
      ...(provider || {}),
      id: provider?.id || assignment?.providerId,
      user: providerUser || provider?.user || {
        id: assignment?.providerUserId || assignment?.userId,
        fullName: assignment?.providerName || 'Provider',
        avatar: assignment?.providerAvatar,
      },
    };
  };

  const chooseProvider = (assignment) => {
    const provider = getProviderFromAssignment(assignment);
    const providerName = provider?.user?.fullName || provider?.user?.name || 'this provider';
    Alert.alert(
      'Choose provider?',
      `Do you want to choose ${providerName} for this task? One coin will be deducted from your wallet.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              const res = await api.post(`/jobs/${job.id}/applications/${assignment.id}/select`);
              setJob(res.data.data);
              Alert.alert('Provider selected', `${providerName} has been assigned to your task.`, [
                { text: 'Close' },
                { text: 'Track Provider', onPress: () => navigation.navigate('LiveTaskMap', { task: res.data.data }) }
              ]);
            } catch (error) {
              Alert.alert('Could not choose provider', error.response?.data?.message || 'Please try again.');
            }
          }
        }
      ]
    );
  };

  return (
    <LinearGradient
      colors={isDarkMode ? ['#0F172A', '#1E1B4B', '#020617'] : ['#FFFFFF', '#F8FAFC', '#F1F5F9']}
      style={styles.container}
    >
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />

      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: isDarkMode ? 1 : 0 }]}>
            <MaterialCommunityIcons name="chevron-left" size={28} color={colors.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Job Details</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.jobHero}>
            <View style={[styles.idBadge, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#F3F4F6' }]}>
              <Text style={[styles.idText, { color: colors.textSecondary }]}>Job #{job.id || 'New'}</Text>
            </View>
            <Text style={[styles.jobTitle, { color: colors.text }]}>{job.title || 'Task details'}</Text>
            <View style={[styles.statusChip, { backgroundColor: isDarkMode ? 'rgba(249, 115, 22, 0.1)' : '#EFF6FF' }]}>
              <View style={[styles.statusDot, { backgroundColor: colors.primary }]} />
              <Text style={[styles.statusChipText, { color: colors.text }]}>{displayStatus}</Text>
            </View>
          </View>

          <View style={styles.trackerContainer}>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Service Progress</Text>
            <View style={styles.tracker}>
              {steps.map((step, i) => (
                <React.Fragment key={step}>
                  <View style={styles.stepContainer}>
                    <View style={[styles.stepDot, { backgroundColor: i <= currentStep ? colors.primary : (isDarkMode ? 'rgba(255,255,255,0.05)' : '#F3F4F6'), borderColor: i <= currentStep ? colors.primary : colors.border }]}>
                      {i < currentStep ? <MaterialCommunityIcons name="check" size={14} color="#FFF" /> : <View style={[styles.innerDot, { backgroundColor: i === currentStep ? colors.card : '#D1D5DB' }]} />}
                    </View>
                    <Text style={[styles.stepText, { color: i <= currentStep ? colors.text : colors.textSecondary, fontWeight: i <= currentStep ? '700' : '600' }]}>{step.replace(/_/g, ' ')}</Text>
                  </View>
                  {i < steps.length - 1 && <View style={[styles.stepLine, { backgroundColor: i < currentStep ? colors.primary : (isDarkMode ? 'rgba(255,255,255,0.05)' : '#F3F4F6') }]} />}
                </React.Fragment>
              ))}
            </View>
          </View>

          {job.assignments?.length > 0 && normalizedStatus === 'PENDING' && (
            <View style={styles.applicationsSection}>
              <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Provider Applications ({job.assignments.length})</Text>
              {job.assignments.map((assignment) => {
                const provider = getProviderFromAssignment(assignment);
                const providerUser = provider?.user || {};
                const canOpenProfile = Boolean(provider?.id || providerUser?.id);
                return (
                  <TouchableOpacity
                    key={assignment.id}
                    style={[styles.applicationCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                    activeOpacity={0.85}
                    disabled={!canOpenProfile}
                    onPress={() => navigation.navigate('ProviderProfile', { provider })}
                  >
                    <Image
                      source={providerUser.avatar ? { uri: providerUser.avatar } : { uri: `https://ui-avatars.com/api/?name=${providerUser.fullName || 'Provider'}&background=random` }}
                      style={styles.applicationAvatar}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.applicationName, { color: colors.text }]}>{providerUser.fullName || providerUser.name || 'Provider'}</Text>
                      <Text style={[styles.applicationMeta, { color: colors.textSecondary }]}>
                        {(provider?.skills || []).slice(0, 2).join(', ') || 'Professional'} | {Number(provider?.rating || 0).toFixed(1)} rating
                      </Text>
                    </View>
                    {canOpenProfile ? (
                      <TouchableOpacity style={[styles.profileBtn, { borderColor: colors.border }]} onPress={() => navigation.navigate('ProviderProfile', { provider })}>
                        <Text style={[styles.profileBtnText, { color: colors.text }]}>Profile</Text>
                      </TouchableOpacity>
                    ) : null}
                    <TouchableOpacity style={[styles.chooseBtn, { backgroundColor: colors.accent }]} onPress={() => chooseProvider(assignment)}>
                      <Text style={styles.chooseBtnText}>Choose</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          <View style={styles.detailsList}>
            <View style={[styles.detailItem, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: isDarkMode ? 1 : 0 }]}>
              <View style={[styles.detailIconWrap, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#F3F4F6' }]}>
                <MaterialCommunityIcons name="account-hard-hat" size={22} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Assigned Professional</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{assignedProvider?.name || 'Not assigned yet'}</Text>
              </View>
              <TouchableOpacity
                style={[styles.chatBtn, { backgroundColor: colors.card }]}
                disabled={!assignedProvider}
                onPress={() => navigation.navigate('Chat', { receiverId: assignedProvider.id, userName: assignedProvider.name, avatar: assignedProvider.avatar, task: job })}
              >
                <MaterialCommunityIcons name="message-text" size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>

            <Detail icon="map-marker-radius" label="Service Location" value={job.location || 'No location yet'} colors={colors} isDarkMode={isDarkMode} />
            <Detail icon="calendar-check" label="Scheduled Date & Time" value={job.scheduledTime ? new Date(job.scheduledTime).toLocaleString() : 'Not scheduled'} colors={colors} isDarkMode={isDarkMode} />
            <Detail icon="text-box-outline" label="Task Details" value={job.description || 'No description provided'} colors={colors} isDarkMode={isDarkMode} />
          </View>

          <View style={[styles.costCard, { backgroundColor: colors.primary }]}>
            <Text style={styles.costLabel}>Total Estimated Cost</Text>
            <Text style={styles.costValue}>{job.cost || `${Number(job.budget || 0).toLocaleString()} XAF`}</Text>
          </View>

          <View style={styles.actions}>
            {assignedProvider ? (
              <TouchableOpacity style={[styles.trackActionBtn, { backgroundColor: colors.accent }]} onPress={() => navigation.navigate('LiveTaskMap', { task: job })}>
                <MaterialCommunityIcons name="map-marker-path" size={18} color="#FFF" />
                <Text style={styles.completeActionBtnText}>Track Provider</Text>
              </TouchableOpacity>
            ) : null}

            {/* Mark as Completed + Rate: Client rates Provider */}
            {user?.role === 'CLIENT' && assignedProvider && (
              <TouchableOpacity
                style={[styles.completeActionBtn, { backgroundColor: '#10B981' }]}
                onPress={() => Alert.alert(
                  'Mark as Completed',
                  'This will mark the task as done. You can then rate the provider.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Complete & Rate',
                      onPress: async () => {
                        try {
                          await api.patch(`/jobs/${job.id}/status`, { status: 'COMPLETED' });
                          navigation.navigate('Rating', {
                            jobId: job.id,
                            targetUser: assignedProviderUser,
                            mode: 'rate_provider',
                          });
                        } catch (err) {
                          Alert.alert('Error', err.response?.data?.message || 'Could not complete the task.');
                        }
                      }
                    }
                  ]
                )}
              >
                <Text style={styles.completeActionBtnText}>Mark as Completed & Rate</Text>
              </TouchableOpacity>
            )}

            {/* Provider rates Client */}
            {user?.role === 'PROVIDER' && normalizedStatus === 'COMPLETED' && (
              <TouchableOpacity
                style={[styles.completeActionBtn, { backgroundColor: colors.accent }]}
                onPress={() => navigation.navigate('Rating', {
                  jobId: job.id,
                  targetUser: { id: job.clientId, fullName: job.client?.fullName, avatar: job.client?.avatar },
                  mode: 'rate_client',
                })}
              >
                <Text style={styles.completeActionBtnText}>Rate Client</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={[styles.cancelActionBtn, { borderColor: colors.error }]}>
              <Text style={[styles.cancelActionBtnText, { color: colors.error }]}>Cancel Task</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const Detail = ({ icon, label, value, colors, isDarkMode }) => (
  <View style={[styles.detailItem, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: isDarkMode ? 1 : 0 }]}>
    <View style={[styles.detailIconWrap, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#F3F4F6' }]}>
      <MaterialCommunityIcons name={icon} size={22} color={colors.primary} />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.detailValue, { color: colors.text }]}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 },
  backBtn: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '700' },
  scrollContent: { paddingBottom: 50 },
  jobHero: { alignItems: 'center', paddingVertical: 30, paddingHorizontal: 20 },
  idBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, marginBottom: 15 },
  idText: { fontSize: 12, fontWeight: '700' },
  jobTitle: { fontSize: 24, fontWeight: '800', marginBottom: 15, textAlign: 'center' },
  statusChip: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusChipText: { fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
  trackerContainer: { paddingHorizontal: 20, marginBottom: 30 },
  sectionLabel: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', marginBottom: 20 },
  tracker: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stepContainer: { alignItems: 'center', width: 80 },
  stepDot: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  innerDot: { width: 8, height: 8, borderRadius: 4 },
  stepLine: { flex: 1, height: 2, marginHorizontal: -20, marginBottom: 20 },
  stepText: { fontSize: 11, marginTop: 8 },
  detailsList: { paddingHorizontal: 20, marginBottom: 30 },
  applicationsSection: { paddingHorizontal: 20, marginBottom: 24 },
  applicationCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 18, borderWidth: 1, marginBottom: 10 },
  applicationAvatar: { width: 46, height: 46, borderRadius: 14 },
  applicationName: { fontSize: 15, fontWeight: '800' },
  applicationMeta: { fontSize: 12, fontWeight: '600', marginTop: 3 },
  chooseBtn: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 12 },
  chooseBtnText: { color: '#FFF', fontSize: 12, fontWeight: '900' },
  profileBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1 },
  profileBtnText: { fontSize: 12, fontWeight: '900' },
  detailItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 20, marginBottom: 12, gap: 15 },
  detailIconWrap: { width: 45, height: 45, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  detailLabel: { fontSize: 11, fontWeight: '600' },
  detailValue: { fontSize: 14, fontWeight: '700', marginTop: 2 },
  chatBtn: { width: 45, height: 45, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  costCard: { marginHorizontal: 20, padding: 25, borderRadius: 25, alignItems: 'center', marginBottom: 30 },
  costLabel: { fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: '600', marginBottom: 8 },
  costValue: { fontSize: 28, fontWeight: '900', color: '#FFF' },
  actions: { paddingHorizontal: 20, gap: 12 },
  trackActionBtn: { height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 8 },
  completeActionBtn: { height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  completeActionBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  cancelActionBtn: { height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5 },
  cancelActionBtnText: { fontSize: 16, fontWeight: '700' },
});

export default JobStatusScreen;
