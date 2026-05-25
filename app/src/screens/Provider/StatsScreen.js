import React from 'react';
import {
  StyleSheet, View, Text, ScrollView, TouchableOpacity,
  StatusBar, Dimensions
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { CustomHeader } from '../../navigation/NavigationComponents';
import { useLanguage } from '../../context/LanguageContext';

const { width } = Dimensions.get('window');

const StatsScreen = ({ navigation }) => {
  const { colors, isDarkMode } = useTheme();
  const { t } = useLanguage();

  const stats = [
    { label: t('home.completedJobs'), value: '0', icon: 'check-circle-outline', color: '#10B981' },
    { label: t('home.totalEarnings'), value: '0 XAF', icon: 'cash-multiple', color: '#2563EB' },
    { label: t('home.avgRating'), value: '0.0', icon: 'star-outline', color: '#FBBF24' },
    { label: t('home.successRate'), value: '0%', icon: 'trending-up', color: '#8B5CF6' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      <CustomHeader navigation={navigation} title={t('drawer.myStats')} colors={colors} />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: colors.text }]}>{t('home.performanceOverview')}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t('home.performanceSubtitle')}</Text>

        <View style={styles.statsGrid}>
          {stats.map((item, index) => (
            <View key={index} style={[styles.statCard, { borderBottomColor: colors.border }]}>
              <View style={styles.iconBox}>
                <MaterialCommunityIcons name={item.icon} size={24} color={item.color} />
              </View>
              <Text style={[styles.statValue, { color: colors.text }]}>{item.value}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{item.label}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.chartPlaceholder, { borderBottomColor: colors.border }]}>
          <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>{t('home.earningsChart')}</Text>
          <MaterialCommunityIcons name="chart-bell-curve-cumulative" size={100} color={colors.border} />
        </View>

        <View style={[styles.infoBox, { borderBottomColor: colors.border }]}>
          <MaterialCommunityIcons name="lightbulb-on-outline" size={20} color={colors.accent} />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            {t('home.statsTip')}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: '900', marginBottom: 5 },
  subtitle: { fontSize: 14, marginBottom: 25 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 15 },
  statCard: { 
    width: (width - 55) / 2, 
    padding: 20, 
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  iconBox: { width: 48, height: 48, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  statValue: { fontSize: 20, fontWeight: '900', marginBottom: 4 },
  statLabel: { fontSize: 12, fontWeight: '700', textAlign: 'center' },
  chartPlaceholder: { marginTop: 25, borderBottomWidth: 1, padding: 30, alignItems: 'center', justifyContent: 'center', height: 220 },
  placeholderText: { fontSize: 14, fontWeight: '700', marginBottom: 20 },
  infoBox: { marginTop: 25, paddingVertical: 18, borderBottomWidth: 1, flexDirection: 'row', gap: 12, alignItems: 'center' },
  infoText: { flex: 1, fontSize: 13, lineHeight: 18, fontWeight: '500' },
});

export default StatsScreen;
