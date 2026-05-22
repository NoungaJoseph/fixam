import React, { useState } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, ScrollView,
  StatusBar, SafeAreaView, TextInput, Alert
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const DeleteAccountScreen = ({ navigation }) => {
  const { colors, isDarkMode } = useTheme();
  const { logout } = useAuth();
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleDelete = () => {
    if (!confirmed) {
      Alert.alert('Please confirm', 'You must check the confirmation box before deleting your account.');
      return;
    }
    if (!password) {
      Alert.alert('Password required', 'Enter your current password to confirm deletion.');
      return;
    }
    Alert.alert(
      '⚠️ Final Confirmation',
      'This action is IRREVERSIBLE. All your data, tasks, wallet balance and messages will be permanently deleted. Are you absolutely sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Forever',
          style: 'destructive',
          onPress: () => { logout(); },
        },
      ]
    );
  };

  return (
    <View style={[styles.background, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: colors.card }]}>
            <MaterialCommunityIcons name="arrow-left" size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: '#EF4444' }]}>Danger Zone</Text>
          <View style={{ width: 42 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Warning badge */}
          <View style={[styles.warningBadge, { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }]}>
            <MaterialCommunityIcons name="alert-octagon" size={42} color="#EF4444" />
          </View>

          <Text style={[styles.title, { color: colors.text }]}>Delete Your Account</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            This action is permanent and cannot be undone. Once deleted, all your data will be erased forever.
          </Text>

          {/* What gets deleted */}
          <View style={[styles.dangerCard, { backgroundColor: isDarkMode ? '#1A0A0A' : '#FEF2F2', borderColor: '#FECACA' }]}>
            <Text style={[styles.dangerCardTitle, { color: '#EF4444' }]}>⚠️ What will be permanently deleted:</Text>
            {[
              'Your profile and personal information',
              'All active and completed tasks',
              'Your entire chat history and messages',
              'Your wallet balance and coin history',
              'All reviews and ratings you have received',
              'Your professional portfolio and photos',
            ].map((item, i) => (
              <View key={i} style={styles.dangerItem}>
                <MaterialCommunityIcons name="close-circle" size={16} color="#EF4444" />
                <Text style={[styles.dangerItemText, { color: isDarkMode ? '#FCA5A5' : '#991B1B' }]}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Alternatives */}
          <View style={[styles.altCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.altTitle, { color: colors.text }]}>💡 Consider these alternatives first:</Text>
            <TouchableOpacity style={styles.altRow}>
              <MaterialCommunityIcons name="pause-circle-outline" size={18} color={colors.primary} />
              <Text style={[styles.altText, { color: colors.text }]}>Pause your account temporarily</Text>
              <MaterialCommunityIcons name="chevron-right" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Confirmation checkbox */}
          <TouchableOpacity style={styles.checkRow} onPress={() => setConfirmed(v => !v)}>
            <View style={[styles.checkbox, { borderColor: confirmed ? '#EF4444' : colors.border, backgroundColor: confirmed ? '#EF4444' : 'transparent' }]}>
              {confirmed && <MaterialCommunityIcons name="check" size={14} color="#FFF" />}
            </View>
            <Text style={[styles.checkText, { color: colors.textSecondary }]}>
              I understand this is permanent and cannot be reversed.
            </Text>
          </TouchableOpacity>

          {/* Password field */}
          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>CONFIRM WITH YOUR PASSWORD</Text>
          <View style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: confirmed ? '#EF4444' : colors.border }]}>
            <MaterialCommunityIcons name="lock-outline" size={20} color={colors.placeholder} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor={colors.placeholder}
              secureTextEntry={!showPw}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowPw(v => !v)}>
              <MaterialCommunityIcons name={showPw ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.placeholder} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.deleteBtn, { backgroundColor: confirmed && password ? '#EF4444' : '#9CA3AF', opacity: confirmed && password ? 1 : 0.6 }]}
            onPress={handleDelete}
          >
            <MaterialCommunityIcons name="delete-forever-outline" size={22} color="#FFF" />
            <Text style={styles.deleteBtnText}>Delete My Account Forever</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
            <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>Cancel — Keep My Account</Text>
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
  backBtn: { width: 42, height: 42, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  content: { padding: 22, paddingBottom: 50 },
  warningBadge: { width: 80, height: 80, borderRadius: 24, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 18, borderWidth: 2 },
  title: { fontSize: 22, fontWeight: '900', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 14, lineHeight: 22, textAlign: 'center', marginBottom: 22 },
  dangerCard: { borderWidth: 1, borderRadius: 20, padding: 18, marginBottom: 18 },
  dangerCardTitle: { fontSize: 14, fontWeight: '800', marginBottom: 14 },
  dangerItem: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  dangerItemText: { fontSize: 13, flex: 1, lineHeight: 19 },
  altCard: { borderWidth: 1, borderRadius: 20, padding: 18, marginBottom: 22 },
  altTitle: { fontSize: 14, fontWeight: '800', marginBottom: 14 },
  altRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
  altText: { fontSize: 14, flex: 1, fontWeight: '600' },
  checkRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 20 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, justifyContent: 'center', alignItems: 'center', marginTop: 1, flexShrink: 0 },
  checkText: { fontSize: 14, flex: 1, lineHeight: 21 },
  fieldLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 10 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, borderWidth: 1.5, paddingHorizontal: 16, height: 52, marginBottom: 22, gap: 10 },
  input: { flex: 1, fontSize: 15 },
  deleteBtn: { height: 56, borderRadius: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 14 },
  deleteBtnText: { color: '#FFF', fontSize: 15, fontWeight: '900' },
  cancelBtn: { alignItems: 'center', paddingVertical: 14 },
  cancelBtnText: { fontSize: 15, fontWeight: '700' },
});

export default DeleteAccountScreen;
