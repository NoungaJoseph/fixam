import React, { useState } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, ScrollView,
  Image, StatusBar, Modal, Alert
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../services/theme';
import { useAppContext } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../services/api';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';

const TaskDetailsScreen = ({ route, navigation }) => {
  const { isDarkMode, colors } = useTheme();
  const task = route.params?.task || route.params?.job || {};
  const { walletBalance, appliedJobIds, markJobApplied } = useAppContext();
  const { user } = useAuth();
  const { on } = useSocket();
  const [showConfirm, setShowConfirm] = useState(false);
  const [applicationCount, setApplicationCount] = useState(task.assignments?.length || 0);
  const [applied, setApplied] = useState(false);
  const coinCost = task.coinCost || 1;
  const clientName = typeof task.client === 'object' ? (task.client?.fullName || 'Fixam Client') : (task.client || 'Fixam Client');
  const clientId = typeof task.client === 'object' ? task.client?.id : task.clientId;
  const clientAvatar = typeof task.client === 'object' ? task.client?.avatar : null;
  const isExistingApplication = Boolean(task.assignmentId || task.assignmentStatus);
  const hasApplied = isExistingApplication || applied || appliedJobIds?.includes(task.id) || task.assignments?.some((assignment) => (
    assignment.providerId === user?.providerProfile?.id ||
    assignment.provider?.userId === user?.id ||
    assignment.provider?.user?.id === user?.id
  ));

  // Hard fix to hide tab bar when Task Details is open
  React.useLayoutEffect(() => {
    const parent = navigation.getParent();
    if (parent) {
      parent.setOptions({ tabBarStyle: { display: 'none' } });
    }
    return () => {
      if (parent) {
        parent.setOptions({
          tabBarStyle: {
            display: 'flex',
            height: 65, paddingBottom: 10, paddingTop: 10,
            backgroundColor: colors.tabBar, borderTopWidth: 1, borderTopColor: colors.border,
          },
        });
      }
    };
  }, [navigation, colors.tabBar, colors.border]);

  React.useEffect(() => {
    const off = on('job:application-count', ({ jobId, applicationCount: count }) => {
      if (jobId === task.id) setApplicationCount(count);
    });
    return () => off?.();
  }, [on, task.id]);

  const goToCoins = () => {
    navigation.getParent()?.getParent()?.navigate('Wallet', { screen: 'CoinSystem' });
  };

  const handleAccept = () => {
    if (hasApplied) {
      Alert.alert('Already Applied', 'You have already applied for this task.');
      return;
    }

    if (walletBalance < coinCost) {
      Alert.alert("Insufficient Coins", `You need ${coinCost} coin${coinCost > 1 ? 's' : ''} to apply for this task.`, [
        { text: "Cancel" },
        { text: "Buy Coins", onPress: goToCoins }
      ]);
      return;
    }
    setShowConfirm(true);
  };

  const confirmAccept = async () => {
    try {
      setShowConfirm(false);
      const res = await api.post(`/jobs/${task.id}/apply`);
      setApplied(true);
      await markJobApplied?.(task.id);
      setApplicationCount(res.data.applicationCount || applicationCount + 1);
      Alert.alert("Application Sent", `${coinCost} coin${coinCost > 1 ? 's are' : ' is'} now held for this task.`, [
        { text: "Proceed", onPress: () => navigation.navigate('LiveTaskMap', { task }) },
        { text: "Go to Chat", onPress: () => navigation.navigate('Chat', { receiverId: clientId, userName: clientName, avatar: clientAvatar, task }) }
      ]);
    } catch (error) {
      const message = error.response?.data?.message || "Please try again.";
      if (error.response?.status === 409) {
        setApplied(true);
        await markJobApplied?.(task.id);
        Alert.alert("Already Applied", message);
        return;
      }
      if (error.response?.status === 400 || error.response?.status === 403) {
        Alert.alert("Could not apply", message, [
          { text: "Cancel", style: "cancel" },
          { text: "Buy Coins", onPress: goToCoins }
        ]);
        return;
      }
      Alert.alert("Could not apply", message);
    }
  };

  return (
    <LinearGradient 
      colors={isDarkMode ? ['#0F172A', '#1E1B4B', '#020617'] : ['#FFFFFF', '#F8FAFC', '#F1F5F9']} 
      style={styles.container}
    >
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <MaterialCommunityIcons name="chevron-left" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Task Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Task Info Card */}
        <View style={styles.detailsCard}>
          <View style={[styles.catBadge, { backgroundColor: isDarkMode ? 'rgba(30,58,138,0.2)' : '#EFF6FF' }]}>
            <Text style={[styles.catText, { color: colors.accent }]}>{task.category}</Text>
          </View>
          <Text style={[styles.taskTitle, { color: colors.text }]}>{task.title}</Text>
          <Text style={[styles.budgetAmount, { color: colors.accent }]}>{task.budget}</Text>
          <View style={[styles.applicationBadge, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <MaterialCommunityIcons name="account-group-outline" size={16} color={colors.accent} />
            <Text style={[styles.applicationText, { color: colors.text }]}>{applicationCount} provider{applicationCount === 1 ? '' : 's'} applied</Text>
          </View>
          
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="map-marker" size={18} color={colors.accent} />
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>{task.location}</Text>
            </View>
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="calendar-clock" size={18} color={colors.accent} />
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                {task.scheduledTime ? new Date(task.scheduledTime).toLocaleString() : (task.time || 'Flexible')}
              </Text>
            </View>
          </View>
        </View>

        {/* Description Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
          <Text style={[styles.descriptionText, { color: colors.textSecondary }]}>
            {task.description || `I need a professional to help with ${task.title?.toLowerCase() || 'this task'}.`}
          </Text>
        </View>

        {/* Client Info */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Client Information</Text>
          <View style={[styles.clientCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Image
              source={clientAvatar ? { uri: clientAvatar } : { uri: `https://ui-avatars.com/api/?name=${clientName}&background=random` }}
              style={styles.clientAvatar}
            />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <Text style={[styles.clientName, { color: colors.text }]}>{clientName}</Text>
                {task.clientVerified && (
                  <View style={styles.verifiedBadge}>
                    <MaterialCommunityIcons name="check-decagram" size={16} color="#10B981" />
                    <Text style={styles.verifiedText}>Verified</Text>
                  </View>
                )}
              </View>
              {task.clientSpendingTier && (
                <View style={styles.spendingRow}>
                  <MaterialCommunityIcons name="cash-multiple" size={13} color={colors.accent} />
                  <Text style={[styles.spendingText, { color: colors.accent }]}>{task.clientSpendingTier}</Text>
                </View>
              )}
              {task.clientRating && task.clientReviewCount ? (
                <View style={styles.ratingRow}>
                  <MaterialCommunityIcons name="star" size={14} color="#FBBF24" />
                  <Text style={[styles.ratingVal, { color: colors.textSecondary }]}>
                    {Number(task.clientRating).toFixed(1)} ({task.clientReviewCount} Review{task.clientReviewCount === 1 ? '' : 's'})
                  </Text>
                </View>
              ) : null}
            </View>
            <TouchableOpacity
              style={styles.chatIconBtn}
              onPress={() => navigation.navigate('Chat', { receiverId: clientId, userName: clientName, avatar: clientAvatar, task })}
            >
              <MaterialCommunityIcons name="message-text" size={20} color={colors.accent} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Safety Tips */}
        <View style={styles.safetyCard}>
          <MaterialCommunityIcons name="shield-check" size={24} color="#10B981" />
          <View style={{ flex: 1 }}>
            <Text style={styles.safetyTitle}>Fixam Security</Text>
            <Text style={styles.safetyText}>Communicate within Fixam and review the task details before visiting the location.</Text>
          </View>
        </View>

      </ScrollView>

      {/* Footer CTA */}
      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <TouchableOpacity 
          style={[styles.acceptBtn, { backgroundColor: hasApplied ? '#94A3B8' : colors.accent, shadowColor: colors.accent }]}
          onPress={handleAccept}
          disabled={hasApplied}
        >
          <Text style={styles.acceptBtnText}>{hasApplied ? 'Already Applied' : `Apply for Task (${coinCost} Coin${coinCost > 1 ? 's' : ''})`}</Text>
          <MaterialCommunityIcons name={hasApplied ? "check-circle" : "database-arrow-down"} size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Confirmation Modal */}
      <Modal visible={showConfirm} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="database" size={40} color="#60A5FA" />
            </View>
            <Text style={styles.modalTitle}>Confirm Accept</Text>
            <Text style={styles.modalText}>
              Apply for this task? {coinCost} coin{coinCost > 1 ? 's will' : ' will'} be held from your wallet. If admin rejects the task later, the coin hold is refunded.
            </Text>
            
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowConfirm(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={confirmAccept}>
                <Text style={styles.confirmBtnText}>Yes, Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 60, paddingHorizontal: 20, paddingBottom: 15,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderBottomWidth: 1,
  },
  backBtn: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  placeholder: { width: 40 },
  scrollContent: { paddingBottom: 150 },
  detailsCard: { padding: 25, alignItems: 'center' },
  catBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginBottom: 15 },
  catText: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  taskTitle: { fontSize: 24, fontWeight: '800', textAlign: 'center', marginBottom: 10 },
  budgetAmount: { fontSize: 22, fontWeight: '900', marginBottom: 20 },
  applicationBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 14, borderWidth: 1, marginBottom: 18 },
  applicationText: { fontSize: 12, fontWeight: '800' },
  metaRow: { width: '100%', gap: 12 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'rgba(148, 163, 184, 0.12)', padding: 15, borderRadius: 15 },
  metaText: { fontSize: 14, fontWeight: '500' },
  section: { paddingHorizontal: 20, marginVertical: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '800', marginBottom: 12 },
  descriptionText: { fontSize: 15, lineHeight: 24 },
  clientCard: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 20, gap: 12, borderWidth: 1 },
  clientAvatar: { width: 50, height: 50, borderRadius: 15 },
  clientName: { fontSize: 16, fontWeight: '700' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  ratingVal: { fontSize: 13 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#ECFDF5', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8 },
  verifiedText: { fontSize: 11, fontWeight: '800', color: '#10B981' },
  spendingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  spendingText: { fontSize: 12, fontWeight: '700' },
  chatIconBtn: { width: 45, height: 45, borderRadius: 12, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  safetyCard: { flexDirection: 'row', alignItems: 'center', gap: 15, backgroundColor: '#ECFDF5', marginHorizontal: 20, padding: 15, borderRadius: 15, marginTop: 10 },
  safetyTitle: { fontSize: 15, fontWeight: '700', color: '#065F46' },
  safetyText: { fontSize: 12, color: '#065F46', marginTop: 2, opacity: 0.8 },
  footer: { position: 'absolute', bottom: 0, width: '100%', padding: 25, borderTopWidth: 1 },
  acceptBtn: { height: 56, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12, shadowOpacity: 0.3, shadowRadius: 10, elevation: 8 },
  acceptBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 30 },
  modalContent: { backgroundColor: '#FFF', width: '100%', borderRadius: 30, padding: 30, alignItems: 'center' },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 22, fontWeight: '800', color: COLORS.primary, marginBottom: 10 },
  modalText: { fontSize: 15, color: '#6B7280', textAlign: 'center', lineHeight: 22, marginBottom: 25 },
  modalActions: { width: '100%', gap: 12 },
  confirmBtn: { backgroundColor: COLORS.primary, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  confirmBtnText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
  cancelBtn: { height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB' },
  cancelBtnText: { color: '#6B7280', fontSize: 15, fontWeight: '600' },
});

export default TaskDetailsScreen;
