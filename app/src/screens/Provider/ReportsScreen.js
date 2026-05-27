import React from 'react';
import {
  StyleSheet, View, Text, ScrollView, TouchableOpacity,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { CustomHeader } from '../../navigation/NavigationComponents';
import { useLanguage } from '../../context/LanguageContext';

const ReportsScreen = ({ navigation }) => {
  const { colors, isDarkMode } = useTheme();
  const { t } = useLanguage();

  const reports = [];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['left', 'right']}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      <CustomHeader navigation={navigation} title={t('home.reports')} colors={colors} />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: colors.text }]}>{t('home.earningsReports')}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t('home.reportsSubtitle')}</Text>

        <View style={styles.reportsList}>
          {reports.length === 0 ? (
            <View style={{ padding: 60, alignItems: 'center' }}>
              <MaterialCommunityIcons name="file-document-outline" size={80} color={colors.border} />
              <Text style={{ color: colors.textSecondary, marginTop: 20, fontSize: 16, fontWeight: '700' }}>{t('home.noReports')}</Text>
              <Text style={{ color: colors.textSecondary, textAlign: 'center', marginTop: 10 }}>{t('home.reportsGenerated')}</Text>
            </View>
          ) : (
            reports.map((item) => (
              <TouchableOpacity key={item.id} style={[styles.reportCard, { borderBottomColor: colors.border }]}>
                <View style={styles.iconWrap}>
                  <MaterialCommunityIcons name="file-pdf-box" size={28} color={colors.accent} />
                </View>
                <View style={styles.reportInfo}>
                  <Text style={[styles.monthText, { color: colors.text }]}>{item.month}</Text>
                  <Text style={[styles.statsText, { color: colors.textSecondary }]}>{item.jobs} Jobs • {item.total}</Text>
                </View>
                <MaterialCommunityIcons 
                  name={item.status === 'Ready' ? 'download' : 'check-circle'} 
                  size={22} 
                  color={item.status === 'Ready' ? colors.accent : '#10B981'} 
                />
              </TouchableOpacity>
            ))
          )}
        </View>

        <TouchableOpacity style={[styles.generateBtn, { backgroundColor: colors.primary }]}>
          <Text style={styles.generateBtnText}>{t('home.generateReport')}</Text>
          <MaterialCommunityIcons name="plus-circle-outline" size={20} color="#FFF" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: '900', marginBottom: 5 },
  subtitle: { fontSize: 14, marginBottom: 25 },
  reportsList: { gap: 12 },
  reportCard: { 
    flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1,
  },
  iconWrap: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start', marginRight: 15 },
  reportInfo: { flex: 1 },
  monthText: { fontSize: 16, fontWeight: '800', marginBottom: 2 },
  statsText: { fontSize: 12, fontWeight: '600' },
  generateBtn: { 
    marginTop: 30, height: 56, borderRadius: 8, flexDirection: 'row', 
    alignItems: 'center', justifyContent: 'center', gap: 10 
  },
  generateBtnText: { color: '#FFF', fontSize: 15, fontWeight: '800' },
});

export default ReportsScreen;
