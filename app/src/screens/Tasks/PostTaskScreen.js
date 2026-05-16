// Post Task Screen with multi-step form and admin approval flow
import React, { useEffect, useState } from 'react';
import {
  StyleSheet, View, Text, TextInput, TouchableOpacity,
  ScrollView, StatusBar, Modal, Alert
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { COLORS } from '../../services/theme';
import { useAppContext } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../services/api';

const TASK_CATS = [
  { id: '1', name: 'PLUMBING', icon: 'pipe-wrench' },
  { id: '2', name: 'ELECTRICAL', icon: 'lightning-bolt-circle' },
  { id: '3', name: 'REPAIR', icon: 'wrench' },
  { id: '4', name: 'OTHER', icon: 'dots-horizontal-circle' },
];

const pad2 = (value) => String(value).padStart(2, '0');

const formatDateInput = (date) => {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
};

const formatTimeInput = (date) => {
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
};

const PostTaskScreen = ({ route, navigation }) => {
  const { isDarkMode, colors } = useTheme();
  const { jobs, fetchAppData } = useAppContext();
  
  const [step, setStep] = useState('details'); // 'details', 'review', 'success'
  const [taskMode, setTaskMode] = useState(route?.params?.startOnPost ? 'post' : 'tasks');
  const [editingJob, setEditingJob] = useState(null);
  const [selectedCat, setSelectedCat] = useState('PLUMBING');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('50000');
  const [loading, setLoading] = useState(false);
  
  const [scheduledDate, setScheduledDate] = useState(new Date());
  const [scheduledTime, setScheduledTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [dateDraft, setDateDraft] = useState(formatDateInput(new Date()));
  const [timeDraft, setTimeDraft] = useState(formatTimeInput(new Date()));

  useEffect(() => {
    if (route?.params?.startOnPost) {
      startNewTask();
    } else {
      setTaskMode('tasks');
      setStep('details');
    }
  }, [route?.params?.startOnPost]);

  const resetForm = () => {
    setEditingJob(null);
    setSelectedCat('PLUMBING');
    setTitle('');
    setDescription('');
    setLocation('');
    setBudget('50000');
    setScheduledDate(new Date());
    setScheduledTime(new Date());
  };

  const startNewTask = () => {
    resetForm();
    setTaskMode('post');
    setStep('details');
  };

  const startEditTask = (job) => {
    const scheduled = job.scheduledTime ? new Date(job.scheduledTime) : new Date();
    setEditingJob(job);
    setSelectedCat(job.category || 'PLUMBING');
    setTitle(job.title || '');
    setDescription(job.description || '');
    setLocation(job.location || '');
    setBudget(String(job.budget || '50000'));
    setScheduledDate(Number.isNaN(scheduled.getTime()) ? new Date() : scheduled);
    setScheduledTime(Number.isNaN(scheduled.getTime()) ? new Date() : scheduled);
    setTaskMode('post');
    setStep('details');
  };

  const openDatePicker = () => {
    setDateDraft(formatDateInput(scheduledDate));
    setShowDatePicker(true);
  };

  const openTimePicker = () => {
    setTimeDraft(formatTimeInput(scheduledTime));
    setShowTimePicker(true);
  };

  const applyDateDraft = () => {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateDraft.trim());
    if (!match) {
      Alert.alert('Invalid Date', 'Please enter the date as YYYY-MM-DD.');
      return;
    }

    const nextDate = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (Number.isNaN(nextDate.getTime()) || nextDate < today) {
      Alert.alert('Invalid Date', 'Please choose today or a future date.');
      return;
    }

    setScheduledDate(nextDate);
    setShowDatePicker(false);
  };

  const applyTimeDraft = () => {
    const match = /^(\d{1,2}):(\d{2})$/.exec(timeDraft.trim());
    if (!match) {
      Alert.alert('Invalid Time', 'Please enter the time as HH:MM.');
      return;
    }

    const hours = Number(match[1]);
    const minutes = Number(match[2]);
    if (hours > 23 || minutes > 59) {
      Alert.alert('Invalid Time', 'Please enter a valid 24-hour time.');
      return;
    }

    const nextTime = new Date(scheduledTime);
    nextTime.setHours(hours, minutes, 0, 0);
    setScheduledTime(nextTime);
    setShowTimePicker(false);
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need location permission to get your current location.');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = loc.coords;
      setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
    } catch (error) {
      Alert.alert('Error', 'Unable to get your location. Please try again.');
    }
  };

  const validateForm = () => {
    if (!title.trim()) return 'Task title is required';
    if (!description.trim()) return 'Description is required';
    if (!location.trim()) return 'Location is required';
    if (!budget || parseInt(budget) <= 0) return 'Budget must be greater than 0';
    return null;
  };

  const handleNext = () => {
    const error = validateForm();
    if (error) {
      Alert.alert('Validation Error', error);
      return;
    }
    setStep('review');
  };

  const handlePublish = async () => {
    setLoading(true);
    try {
      const scheduledDateTime = new Date(
        scheduledDate.getFullYear(),
        scheduledDate.getMonth(),
        scheduledDate.getDate(),
        scheduledTime.getHours(),
        scheduledTime.getMinutes()
      );

      const payload = {
        title,
        description,
        location,
        budget: parseInt(budget),
        category: selectedCat,
        scheduledTime: scheduledDateTime.toISOString(),
      };

      if (editingJob) {
        await api.put(`/jobs/${editingJob.id}`, payload);
      } else {
        await api.post('/jobs', payload);
      }

      await fetchAppData?.();

      setStep('success');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to publish task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (job, status) => {
    try {
      await api.put(`/jobs/${job.id}/status`, { status });
      await fetchAppData?.();
      Alert.alert('Updated', status === 'COMPLETED' ? 'Task marked as completed.' : 'Task updated.');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Could not update this task.');
    }
  };

  const renderTaskCard = (job) => {
    const canEdit = job.status !== 'COMPLETED' && job.status !== 'CANCELLED';
    const statusLabel = job.approvalStatus === 'PENDING_APPROVAL'
      ? 'Awaiting admin approval'
      : job.approvalStatus === 'REJECTED'
        ? 'Rejected'
        : job.status;

    return (
      <View key={job.id} style={styles.taskCard}>
        <View style={styles.taskCardHeader}>
          <View style={styles.catBadge}>
            <Text style={styles.catBadgeText}>{job.category || 'TASK'}</Text>
          </View>
          <Text style={styles.taskStatus}>{statusLabel}</Text>
        </View>
        <Text style={styles.reviewTitle}>{job.title}</Text>
        <Text style={styles.reviewDescription}>{job.description}</Text>
        <View style={styles.taskMetaRow}>
          <MaterialCommunityIcons name="map-marker-outline" size={16} color="#6B7280" />
          <Text style={styles.taskMetaText}>{job.location}</Text>
        </View>
        <View style={styles.taskMetaRow}>
          <MaterialCommunityIcons name="calendar-clock" size={16} color="#6B7280" />
          <Text style={styles.taskMetaText}>
            {job.scheduledTime ? new Date(job.scheduledTime).toLocaleString() : 'Not scheduled'}
          </Text>
        </View>
        <Text style={styles.taskBudget}>{Number(job.budget || 0).toLocaleString()} XAF</Text>

        {job.rejectionReason ? (
          <View style={styles.rejectionBox}>
            <Text style={styles.rejectionText}>Reason: {job.rejectionReason}</Text>
          </View>
        ) : null}

        <View style={styles.taskActions}>
          <TouchableOpacity style={styles.taskOutlineBtn} onPress={() => navigation.navigate('JobStatus', { job })}>
            <MaterialCommunityIcons name="eye-outline" size={16} color={COLORS.primary} />
            <Text style={styles.taskOutlineText}>Details</Text>
          </TouchableOpacity>
          {canEdit ? (
            <TouchableOpacity style={styles.taskOutlineBtn} onPress={() => startEditTask(job)}>
              <MaterialCommunityIcons name="pencil-outline" size={16} color={COLORS.primary} />
              <Text style={styles.taskOutlineText}>Edit</Text>
            </TouchableOpacity>
          ) : null}
          {job.status !== 'COMPLETED' ? (
            <TouchableOpacity
              style={styles.taskSolidBtn}
              onPress={() => Alert.alert('Complete Task', 'Mark this task as complete?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Complete', onPress: () => updateTaskStatus(job, 'COMPLETED') }
              ])}
            >
              <MaterialCommunityIcons name="check" size={16} color="#FFF" />
              <Text style={styles.taskSolidText}>Complete</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={isDarkMode ? ['#0F172A', '#1E1B4B', '#020617'] : ['#FFFFFF', '#F8FAFC', '#F1F5F9']}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" />

      {taskMode === 'tasks' && (
        <>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <MaterialCommunityIcons name="chevron-left" size={28} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>My Tasks</Text>
            <TouchableOpacity onPress={startNewTask} style={styles.backBtn}>
              <MaterialCommunityIcons name="plus" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <View style={styles.myTasksHero}>
              <Text style={styles.mainTitle}>Your posted tasks</Text>
              <Text style={styles.successSubtitle}>View approval progress, edit pending work, and mark jobs complete.</Text>
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={startNewTask}>
              <Text style={styles.submitBtnText}>Post New Task</Text>
              <MaterialCommunityIcons name="plus" size={20} color="#FFF" />
            </TouchableOpacity>

            <View style={styles.taskList}>
              {(jobs || []).length === 0 ? (
                <View style={styles.emptyTasks}>
                  <MaterialCommunityIcons name="clipboard-text-outline" size={56} color="#CBD5E1" />
                  <Text style={styles.emptyTasksTitle}>No tasks yet</Text>
                  <Text style={styles.emptyTasksText}>Post your first task and it will appear here for tracking.</Text>
                </View>
              ) : (
                (jobs || []).map(renderTaskCard)
              )}
            </View>
          </ScrollView>
        </>
      )}

      {taskMode === 'post' && step === 'details' && (
        <>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <MaterialCommunityIcons name="chevron-left" size={28} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{editingJob ? 'Edit Task' : 'Post a Task'}</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Step Indicator */}
            <View style={styles.stepRow}>
              <View style={[styles.stepItem, styles.stepActive]}>
                <Text style={styles.stepNum}>1</Text>
              </View>
              <View style={styles.stepLine} />
              <View style={styles.stepItem}>
                <Text style={styles.stepNumInactive}>2</Text>
              </View>
            </View>

            <Text style={styles.mainTitle}>{editingJob ? 'Update task details' : 'What needs fixing?'}</Text>

            {/* Category Grid */}
            <View style={styles.catGrid}>
              {TASK_CATS.map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.catCard, selectedCat === cat.name && styles.catCardActive]}
                  onPress={() => setSelectedCat(cat.name)}
                >
                  <View style={[styles.catIconWrap, selectedCat === cat.name && styles.catIconWrapActive]}>
                    <MaterialCommunityIcons
                      name={cat.icon}
                      size={24}
                      color={selectedCat === cat.name ? '#FFF' : COLORS.primary}
                    />
                  </View>
                  <Text style={[styles.catName, selectedCat === cat.name && styles.catNameActive]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Inputs */}
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>TASK TITLE</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Fix my kitchen light"
                  placeholderTextColor="#6B7280"
                  value={title}
                  onChangeText={setTitle}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>DESCRIPTION</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Detail what needs to be done..."
                  placeholderTextColor="#6B7280"
                  value={description}
                  onChangeText={setDescription}
                  multiline={true}
                  numberOfLines={4}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>LOCATION</Text>
                <View style={styles.locationInputWrap}>
                  <MaterialCommunityIcons name="map-marker-outline" size={20} color={COLORS.primary} />
                  <TextInput
                    style={styles.locationInput}
                    placeholder="Enter street address"
                    placeholderTextColor="#6B7280"
                    value={location}
                    onChangeText={setLocation}
                  />
                  <TouchableOpacity onPress={getCurrentLocation}>
                    <MaterialCommunityIcons name="crosshairs-gps" size={20} color={COLORS.accent} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>BUDGET</Text>
                  <View style={styles.budgetInputWrap}>
                    <Text style={styles.currency}>XAF</Text>
                    <TextInput
                      style={styles.budgetInput}
                      value={budget}
                      onChangeText={setBudget}
                      keyboardType="numeric"
                      placeholder="50000"
                    />
                  </View>
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>DATE</Text>
                  <TouchableOpacity style={styles.datePickerBtn} onPress={openDatePicker}>
                    <Text style={styles.dateText}>{scheduledDate.toLocaleDateString()}</Text>
                    <MaterialCommunityIcons name="calendar-month" size={20} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>TIME</Text>
                  <TouchableOpacity style={styles.datePickerBtn} onPress={openTimePicker}>
                    <Text style={styles.dateText}>{scheduledTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                    <MaterialCommunityIcons name="clock-outline" size={20} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={handleNext}>
              <Text style={styles.submitBtnText}>Review Details</Text>
              <MaterialCommunityIcons name="arrow-right" size={20} color="#FFF" />
            </TouchableOpacity>
          </ScrollView>

          <Modal visible={showDatePicker} transparent animationType="fade" onRequestClose={() => setShowDatePicker(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.pickerModal}>
                <Text style={styles.modalTitle}>Choose date</Text>
                <TextInput
                  style={styles.modalInput}
                  value={dateDraft}
                  onChangeText={setDateDraft}
                  placeholder="YYYY-MM-DD"
                  keyboardType="numbers-and-punctuation"
                />
                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setShowDatePicker(false)}>
                    <Text style={styles.modalCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalApplyBtn} onPress={applyDateDraft}>
                    <Text style={styles.modalApplyText}>Apply</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <Modal visible={showTimePicker} transparent animationType="fade" onRequestClose={() => setShowTimePicker(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.pickerModal}>
                <Text style={styles.modalTitle}>Choose time</Text>
                <TextInput
                  style={styles.modalInput}
                  value={timeDraft}
                  onChangeText={setTimeDraft}
                  placeholder="HH:MM"
                  keyboardType="numbers-and-punctuation"
                />
                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setShowTimePicker(false)}>
                    <Text style={styles.modalCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalApplyBtn} onPress={applyTimeDraft}>
                    <Text style={styles.modalApplyText}>Apply</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </>
      )}

      {taskMode === 'post' && step === 'review' && (
        <>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setStep('details')} style={styles.backBtn}>
              <MaterialCommunityIcons name="chevron-left" size={28} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Review Task</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Step Indicator */}
            <View style={styles.stepRow}>
              <View style={[styles.stepItem, styles.stepActive]}>
                <Text style={styles.stepNum}>1</Text>
              </View>
              <View style={styles.stepLine} />
              <View style={[styles.stepItem, styles.stepActive]}>
                <Text style={styles.stepNum}>2</Text>
              </View>
            </View>

            <Text style={styles.mainTitle}>Review Your Task</Text>

            {/* Task Preview */}
            <View style={styles.reviewCard}>
              <View style={styles.catBadge}>
                <Text style={styles.catBadgeText}>{selectedCat}</Text>
              </View>
              <Text style={styles.reviewTitle}>{title}</Text>
              <Text style={styles.reviewDescription}>{description}</Text>

              <View style={styles.reviewGrid}>
                <View style={styles.reviewItem}>
                  <Text style={styles.reviewLabel}>📍 Location</Text>
                  <Text style={styles.reviewValue}>{location}</Text>
                </View>
                <View style={styles.reviewItem}>
                  <Text style={styles.reviewLabel}>💰 Budget</Text>
                  <Text style={styles.reviewValue}>{parseInt(budget).toLocaleString()} XAF</Text>
                </View>
                <View style={styles.reviewItem}>
                  <Text style={styles.reviewLabel}>📅 Date</Text>
                  <Text style={styles.reviewValue}>{scheduledDate.toLocaleDateString()}</Text>
                </View>
                <View style={styles.reviewItem}>
                  <Text style={styles.reviewLabel}>⏰ Time</Text>
                  <Text style={styles.reviewValue}>{scheduledTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                </View>
              </View>

              <View style={styles.infoBox}>
                <MaterialCommunityIcons name="information-outline" size={18} color="#92400E" />
                <Text style={styles.infoText}>Your task will be sent to our admin team for verification before being shown to professionals.</Text>
              </View>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.backBtn2} onPress={() => setStep('details')}>
                <MaterialCommunityIcons name="chevron-left" size={20} color={COLORS.primary} />
                <Text style={styles.backBtnText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.submitBtn, { flex: 1 }]} onPress={handlePublish} disabled={loading}>
                <Text style={styles.submitBtnText}>{loading ? 'Saving...' : editingJob ? 'Save Changes' : 'Publish Task'}</Text>
                <MaterialCommunityIcons name="arrow-right" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </>
      )}

      {taskMode === 'post' && step === 'success' && (
        <View style={styles.successContainer}>
          <View style={styles.iconWrap}>
            <MaterialCommunityIcons name="check-circle" size={90} color={COLORS.success} />
          </View>
          <Text style={styles.successTitle}>{editingJob ? 'Task Updated Successfully!' : 'Task Posted Successfully!'}</Text>
          <Text style={styles.successSubtitle}>
            Your task has been sent to our admin team for verification. Once approved, professionals in your area will be able to see and quote on your task.
          </Text>

          <TouchableOpacity style={styles.primaryBtn} onPress={() => {
            setTaskMode('tasks');
            setStep('details');
          }}>
            <Text style={styles.primaryBtnText}>View Job Status</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryBtn} onPress={() => {
            startNewTask();
          }}>
            <Text style={styles.secondaryBtnText}>Post Another Task</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.secondaryBtn, { marginTop: 12 }]} onPress={() => navigation.getParent()?.navigate('MainTabs', { screen: 'Home' })}>
            <Text style={styles.secondaryBtnText}>Return Home</Text>
          </TouchableOpacity>
        </View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: {
    paddingTop: 60, paddingHorizontal: 20, paddingBottom: 15,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  backBtn: { width: 40, height: 40, borderRadius: 8, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  backBtn2: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#FFF', borderRadius: 8, paddingVertical: 15, borderWidth: 1, borderColor: '#E5E7EB' },
  backBtnText: { color: COLORS.primary, fontSize: 14, fontWeight: '700' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.primary },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
  stepRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 20 },
  stepItem: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  stepActive: { backgroundColor: COLORS.primary },
  stepNum: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  stepNumInactive: { color: '#6B7280', fontSize: 14, fontWeight: '700' },
  stepLine: { width: 40, height: 2, backgroundColor: '#F3F4F6', marginHorizontal: 5 },
  mainTitle: { fontSize: 24, fontWeight: '800', color: COLORS.primary, marginBottom: 25 },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 25 },
  catCard: {
    width: '23%', backgroundColor: '#FFF', borderRadius: 8,
    paddingVertical: 12, alignItems: 'center', gap: 6,
    borderWidth: 1, borderColor: '#F3F4F6',
  },
  catCardActive: { borderColor: COLORS.primary, backgroundColor: '#F0F9FF' },
  catIconWrap: { width: 40, height: 40, borderRadius: 8, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  catIconWrapActive: { backgroundColor: COLORS.primary },
  catName: { fontSize: 10, fontWeight: '700', color: '#6B7280', textTransform: 'uppercase' },
  catNameActive: { color: COLORS.primary },
  form: { gap: 20, marginBottom: 30 },
  inputGroup: { gap: 8 },
  inputLabel: { fontSize: 11, fontWeight: '700', color: '#6B7280', letterSpacing: 1 },
  input: {
    backgroundColor: '#F9FAFB', borderRadius: 8, padding: 15,
    fontSize: 16, color: COLORS.primary, borderWidth: 0, borderBottomWidth: 1, borderColor: '#DADDE1',
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  locationInputWrap: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB',
    borderRadius: 8, paddingHorizontal: 15, borderWidth: 0, borderBottomWidth: 1, borderColor: '#DADDE1', minHeight: 50,
  },
  locationInput: { flex: 1, height: 50, color: COLORS.primary, fontSize: 16, marginLeft: 10 },
  row: { flexDirection: 'row', gap: 15 },
  budgetInputWrap: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB',
    borderRadius: 8, paddingHorizontal: 15, height: 50, borderWidth: 0, borderBottomWidth: 1, borderColor: '#DADDE1',
  },
  currency: { fontSize: 18, fontWeight: '700', color: COLORS.primary, marginRight: 5 },
  budgetInput: { flex: 1, fontSize: 16, fontWeight: '700', color: COLORS.primary },
  datePickerBtn: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#F9FAFB', borderRadius: 8, paddingHorizontal: 15, height: 50, borderWidth: 0, borderBottomWidth: 1, borderColor: '#DADDE1',
  },
  dateText: { fontSize: 15, color: COLORS.primary, fontWeight: '600' },
  submitBtn: {
    backgroundColor: COLORS.primary, borderRadius: 8, paddingVertical: 18,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 5,
  },
  submitBtnText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  buttonRow: { flexDirection: 'row', gap: 12, marginBottom: 100 },
  reviewCard: { backgroundColor: '#FFF', borderRadius: 8, padding: 25, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 20 },
  catBadge: { backgroundColor: '#EEF4FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, alignSelf: 'flex-start', marginBottom: 12 },
  catBadgeText: { fontSize: 12, fontWeight: '700', color: COLORS.primary, textTransform: 'uppercase' },
  reviewTitle: { fontSize: 22, fontWeight: '800', color: COLORS.primary, marginBottom: 12 },
  reviewDescription: { fontSize: 15, color: '#6B7280', lineHeight: 22, marginBottom: 16 },
  reviewGrid: { marginBottom: 16 },
  reviewItem: { marginBottom: 12 },
  reviewLabel: { fontSize: 12, fontWeight: '700', color: '#6B7280', marginBottom: 4 },
  reviewValue: { fontSize: 15, fontWeight: '600', color: COLORS.primary },
  infoBox: { flexDirection: 'row', gap: 10, backgroundColor: '#FEF3C7', padding: 12, borderRadius: 10, borderLeftWidth: 4, borderLeftColor: '#F59E0B' },
  infoText: { fontSize: 12, color: '#92400E', fontWeight: '500', flex: 1 },
  successContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30 },
  iconWrap: { marginBottom: 24 },
  successTitle: { fontSize: 24, fontWeight: '800', color: COLORS.primary, textAlign: 'center', marginBottom: 12 },
  successSubtitle: { fontSize: 15, color: '#6B7280', textAlign: 'center', lineHeight: 22, marginBottom: 40 },
  primaryBtn: {
    backgroundColor: COLORS.accent, borderRadius: 10,
    paddingVertical: 16, width: '100%', alignItems: 'center', marginBottom: 14, flexDirection: 'row', justifyContent: 'center', gap: 8,
  },
  primaryBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  secondaryBtn: {
    borderWidth: 1.5, borderColor: COLORS.primary, borderRadius: 10,
    paddingVertical: 15, width: '100%', alignItems: 'center',
  },
  secondaryBtnText: { color: COLORS.primary, fontSize: 16, fontWeight: '700' },
  myTasksHero: { marginTop: 10 },
  taskList: { marginTop: 20, gap: 14 },
  taskCard: { backgroundColor: '#FFF', borderRadius: 0, paddingVertical: 18, borderBottomWidth: 1, borderColor: '#E5E7EB' },
  taskCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  taskStatus: { fontSize: 11, color: '#F97316', fontWeight: '800', textTransform: 'uppercase', flexShrink: 1, textAlign: 'right' },
  taskMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  taskMetaText: { flex: 1, color: '#6B7280', fontSize: 13, fontWeight: '600' },
  taskBudget: { marginTop: 12, color: COLORS.primary, fontSize: 18, fontWeight: '900' },
  taskActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 },
  taskOutlineBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, minWidth: 86, height: 40, borderRadius: 8, borderWidth: 1, borderColor: '#CBD5E1' },
  taskOutlineText: { color: COLORS.primary, fontSize: 13, fontWeight: '800' },
  taskSolidBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, minWidth: 104, height: 40, borderRadius: 8, backgroundColor: '#10B981' },
  taskSolidText: { color: '#FFF', fontSize: 13, fontWeight: '800' },
  emptyTasks: { alignItems: 'center', paddingVertical: 50, paddingHorizontal: 20 },
  emptyTasksTitle: { marginTop: 12, color: COLORS.primary, fontSize: 18, fontWeight: '900' },
  emptyTasksText: { marginTop: 6, color: '#6B7280', fontSize: 13, textAlign: 'center', lineHeight: 19 },
  rejectionBox: { marginTop: 12, padding: 10, borderRadius: 10, backgroundColor: '#FEF2F2' },
  rejectionText: { color: '#B91C1C', fontSize: 12, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.45)', justifyContent: 'center', paddingHorizontal: 24 },
  pickerModal: { backgroundColor: '#FFF', borderRadius: 18, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: COLORS.primary, marginBottom: 14 },
  modalInput: {
    height: 52, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB',
    paddingHorizontal: 14, color: COLORS.primary, fontSize: 16, fontWeight: '700',
    backgroundColor: '#F9FAFB',
  },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 18 },
  modalCancelBtn: {
    flex: 1, height: 48, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB',
    justifyContent: 'center', alignItems: 'center',
  },
  modalApplyBtn: {
    flex: 1, height: 48, borderRadius: 12, backgroundColor: COLORS.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  modalCancelText: { color: COLORS.primary, fontWeight: '800' },
  modalApplyText: { color: '#FFF', fontWeight: '800' },
});

export default PostTaskScreen;
