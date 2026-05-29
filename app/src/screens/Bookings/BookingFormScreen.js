import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../services/api';
import { translateApiError } from '../../i18n/translate';

const BookingFormScreen = ({ route, navigation }) => {
  const { colors, isDarkMode } = useTheme();
  const { t } = useLanguage();
  const { providerId, providerName, task } = route.params || {};
  const [form, setForm] = useState({
    bookingDate: '',
    bookingTime: '',
    location: task?.location || '',
    budget: String(task?.budgetMax || task?.budget || ''),
    notes: task?.description || '',
  });
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!providerId || !form.bookingDate || !form.bookingTime || !form.location || !form.budget) {
      Alert.alert(t('errors.required'), t('validation.bookingRequired'));
      return;
    }
    try {
      setSubmitting(true);
      const res = await api.post('/bookings', {
        providerId,
        taskId: task?.id,
        bookingDate: form.bookingDate,
        bookingTime: form.bookingTime,
        location: form.location,
        budget: Number(String(form.budget).replace(/[^\d.]/g, '')),
        notes: form.notes,
      });
      Alert.alert(t('bookings.sent'), t('bookings.sentBody'));
      navigation.goBack();
      return res.data;
    } catch (error) {
      Alert.alert(t('bookings.failed'), translateApiError(error, 'errors.bookingFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: colors.card }]}>
              <MaterialCommunityIcons name="chevron-left" size={28} color={colors.accent} />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={[styles.title, { color: colors.text }]}>{t('bookings.title')}</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{providerName || t('common.provider')}</Text>
            </View>
          </View>

          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Input label={t('bookings.date')} placeholder="YYYY-MM-DD" value={form.bookingDate} onChangeText={(bookingDate) => setForm({ ...form, bookingDate })} colors={colors} />
            <Input label={t('bookings.time')} placeholder="14:30" value={form.bookingTime} onChangeText={(bookingTime) => setForm({ ...form, bookingTime })} colors={colors} />
            <Input label={t('bookings.location')} placeholder={t('bookings.locationPlaceholder')} value={form.location} onChangeText={(location) => setForm({ ...form, location })} colors={colors} />
            <Input label={t('bookings.budget')} placeholder="15000" value={form.budget} onChangeText={(budget) => setForm({ ...form, budget })} keyboardType="numeric" colors={colors} />
            <Input label={t('bookings.details')} placeholder={t('bookings.detailsPlaceholder')} value={form.notes} onChangeText={(notes) => setForm({ ...form, notes })} multiline colors={colors} />
          </ScrollView>

          <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
            <TouchableOpacity onPress={submit} disabled={submitting} style={[styles.submitBtn, { opacity: submitting ? 0.65 : 1 }]}>
              <MaterialCommunityIcons name="calendar-check" size={20} color="#FFFFFF" />
              <Text style={styles.submitText}>{submitting ? t('bookings.scheduling') : t('bookings.confirm')}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const Input = ({ label, colors, style, ...props }) => (
  <View style={styles.field}>
    <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
    <TextInput
      {...props}
      placeholderTextColor={colors.placeholder}
      style={[styles.input, props.multiline && styles.textArea, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }, style]}
    />
  </View>
);

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 18, paddingVertical: 14 },
  backBtn: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '900' },
  subtitle: { fontSize: 13, fontWeight: '700', marginTop: 2 },
  content: { padding: 18, paddingBottom: 24, gap: 16 },
  field: { gap: 8 },
  label: { fontSize: 13, fontWeight: '800' },
  input: { minHeight: 52, borderWidth: 1, borderRadius: 8, paddingHorizontal: 14, fontSize: 15, fontWeight: '600' },
  textArea: { minHeight: 120, paddingTop: 14, textAlignVertical: 'top' },
  footer: { padding: 18, borderTopWidth: 1 },
  submitBtn: { height: 54, borderRadius: 8, backgroundColor: '#0D9488', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  submitText: { color: '#FFFFFF', fontSize: 16, fontWeight: '900' },
});

export default BookingFormScreen;
