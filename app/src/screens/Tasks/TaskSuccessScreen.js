import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../services/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';

const TaskSuccessScreen = ({ navigation }) => {
  const { isDarkMode, colors } = useTheme();

  return (
    <LinearGradient 
      colors={isDarkMode ? ['#0F172A', '#1E1B4B', '#020617'] : ['#FFFFFF', '#F8FAFC', '#F1F5F9']}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <MaterialCommunityIcons name="check-circle" size={90} color={COLORS.success} />
        </View>

        <Text style={[styles.title, { color: colors.text }]}>Task Posted Successfully!</Text>
        
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Your task has been sent to our admin team for verification. Once approved, professionals in your area will be able to see and quote on your task.
        </Text>

        <View style={[styles.infoBox, { backgroundColor: colors.accentSoft }]}>
          <MaterialCommunityIcons name="clock-outline" size={16} color={colors.accent} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={[styles.infoTitle, { color: colors.accent }]}>What happens next?</Text>
            <Text style={[styles.infoText, { color: colors.accent }]}>
              You'll receive a notification once an admin approves your task.
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: COLORS.primary }]}
            onPress={() => navigation.navigate('MyJobs')}
          >
            <MaterialCommunityIcons name="eye-outline" size={18} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.primaryBtnText}>View Job Status</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryBtn, { borderColor: colors.primary }]}
            onPress={() => navigation.navigate('PostTask')}
          >
            <MaterialCommunityIcons name="plus" size={18} color={colors.primary} style={{ marginRight: 8 }} />
            <Text style={[styles.secondaryBtnText, { color: colors.primary }]}>Post Another Task</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryBtn, { borderColor: colors.border }]}
            onPress={() => navigation.getParent()?.navigate('MainTabs', { screen: 'Home' })}
          >
            <MaterialCommunityIcons name="home-outline" size={18} color={colors.primary} style={{ marginRight: 8 }} />
            <Text style={[styles.secondaryBtnText, { color: colors.primary }]}>Return Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: COLORS.background,
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 30,
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  iconWrap: { 
    marginBottom: 24,
  },
  title: { 
    fontSize: 24, 
    fontWeight: '800', 
    textAlign: 'center', 
    marginBottom: 12 
  },
  subtitle: { 
    fontSize: 15, 
    textAlign: 'center', 
    lineHeight: 22, 
    marginBottom: 30 
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
    width: '100%',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  primaryBtn: {
    borderRadius: 10,
    paddingVertical: 16, 
    width: '100%', 
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: COLORS.primary, 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 10, 
    elevation: 5,
  },
  primaryBtnText: { 
    color: COLORS.white, 
    fontSize: 16, 
    fontWeight: '700' 
  },
  secondaryBtn: {
    borderWidth: 1.5, 
    borderRadius: 10,
    paddingVertical: 15, 
    width: '100%', 
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  secondaryBtnText: { 
    fontSize: 16, 
    fontWeight: '700' 
  },
});

export default TaskSuccessScreen;
