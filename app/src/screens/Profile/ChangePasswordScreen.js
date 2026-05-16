import React, { useState } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, ScrollView,
  StatusBar, SafeAreaView, TextInput, Alert
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const ChangePasswordScreen = ({ navigation }) => {
  const { colors, isDarkMode } = useTheme();
  const { updateProfile } = useAuth();
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const strength = newPass.length === 0 ? 0 : newPass.length < 6 ? 1 : newPass.length < 10 ? 2 : 3;
  const strengthColor = ['#E5E7EB', '#EF4444', '#F97316', '#22C55E'][strength];
  const strengthLabel = ['', 'Weak', 'Fair', 'Strong'][strength];

  const handleSave = async () => {
    if (!current) { Alert.alert('Required', 'Please enter your current password.'); return; }
    if (newPass.length < 6) { Alert.alert('Too short', 'Password must be at least 6 characters.'); return; }
    if (newPass !== confirm) { Alert.alert('Mismatch', 'New passwords do not match.'); return; }
    setLoading(true);
    try {
      await updateProfile({ currentPassword: current, password: newPass });
      Alert.alert('Success', 'Your password has been updated successfully.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Update failed', error.response?.data?.message || 'Could not update password.');
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ label, value, onChange, show, onToggle, placeholder }) => (
    <View style={styles.field}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <View style={[styles.inputWrap, { borderColor: colors.border }]}>
        <TextInput
          style={[styles.input, { color: colors.text }]}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          secureTextEntry={!show}
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={onToggle}>
          <MaterialCommunityIcons name={show ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.placeholder} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.background, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <MaterialCommunityIcons name="arrow-left" size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Change Password</Text>
          <View style={{ width: 42 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.lockIcon}>
            <MaterialCommunityIcons name="lock-reset" size={36} color={colors.accent} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Update Your Password</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Choose a strong password with a mix of letters, numbers and symbols.
          </Text>

          <InputField label="Current Password" value={current} onChange={setCurrent} show={showCurrent} onToggle={() => setShowCurrent(v => !v)} placeholder="Enter current password" />
          <InputField label="New Password" value={newPass} onChange={setNewPass} show={showNew} onToggle={() => setShowNew(v => !v)} placeholder="Enter new password" />

          {/* Strength indicator */}
          {newPass.length > 0 && (
            <View style={styles.strengthRow}>
              {[1, 2, 3].map(i => (
                <View key={i} style={[styles.strengthBar, { backgroundColor: i <= strength ? strengthColor : colors.border }]} />
              ))}
              <Text style={[styles.strengthLabel, { color: strengthColor }]}>{strengthLabel}</Text>
            </View>
          )}

          <InputField label="Confirm New Password" value={confirm} onChange={setConfirm} show={showConfirm} onToggle={() => setShowConfirm(v => !v)} placeholder="Re-enter new password" />

          {confirm.length > 0 && newPass !== confirm && (
            <Text style={styles.matchError}>Passwords do not match</Text>
          )}

          <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.accent, opacity: loading ? 0.7 : 1 }]} onPress={handleSave} disabled={loading}>
            <MaterialCommunityIcons name="lock-check-outline" size={20} color="#FFF" />
            <Text style={styles.saveBtnText}>{loading ? 'Updating...' : 'Update Password'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14 },
  backBtn: { width: 42, height: 42, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  content: { padding: 24, paddingBottom: 48 },
  lockIcon: { width: 70, height: 70, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 18, alignSelf: 'center' },
  title: { fontSize: 22, fontWeight: '900', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 14, lineHeight: 21, textAlign: 'center', marginBottom: 30 },
  field: { marginBottom: 18 },
  label: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5, marginBottom: 8, textTransform: 'uppercase' },
  inputWrap: { flexDirection: 'row', alignItems: 'center', borderRadius: 8, borderWidth: 1, paddingHorizontal: 16, height: 52 },
  input: { flex: 1, fontSize: 15, fontWeight: '500' },
  strengthRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: -8, marginBottom: 16 },
  strengthBar: { flex: 1, height: 4, borderRadius: 2 },
  strengthLabel: { fontSize: 12, fontWeight: '700' },
  matchError: { color: '#EF4444', fontSize: 12, fontWeight: '600', marginTop: -12, marginBottom: 12 },
  saveBtn: { height: 56, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 10 },
  saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: '900' },
});

export default ChangePasswordScreen;
