import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  StyleSheet, View, Text, ScrollView, TouchableOpacity,
  ActivityIndicator, Alert, Modal, Platform
} from 'react-native';
import SafeAreaView from '../../components/Common/TealSafeAreaView';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { CustomHeader } from '../../navigation/NavigationComponents';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../services/api';

const ReportsScreen = ({ navigation }) => {
  const { colors, isDarkMode } = useTheme();
  const { t, language } = useLanguage();
  
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selectedMonthToGenerate, setSelectedMonthToGenerate] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedReportForModal, setSelectedReportForModal] = useState(null);

  const monthNamesEn = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthNamesFr = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const isFr = language?.startsWith('fr');
  const monthNames = isFr ? monthNamesFr : monthNamesEn;

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/providers/reports/all');
      if (res.data?.success) {
        setReports(res.data.data || []);
      }
    } catch (e) {
      console.log('Failed to fetch reports', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsub = navigation.addListener('focus', fetchReports);
    fetchReports();
    return unsub;
  }, [fetchReports, navigation]);

  // Generate list of past 12 months that are eligible for report generation but not yet generated
  const eligibleMonths = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const currentDay = now.getDate();
    const lastDayOfCurrentMonth = new Date(currentYear, currentMonth, 0).getDate();

    const eligible = [];
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const y = d.getFullYear();
      const m = d.getMonth() + 1;

      // Current month is only eligible on the last day of the month (month end)
      const isCurrent = y === currentYear && m === currentMonth;
      const isMonthEnd = isCurrent && currentDay === lastDayOfCurrentMonth;
      const isPast = y < currentYear || (y === currentYear && m < currentMonth);

      if (isPast || isMonthEnd) {
        // Check if already generated in reports list
        const alreadyGenerated = reports.some(r => r.year === y && r.month === m);
        if (!alreadyGenerated) {
          eligible.push({
            year: y,
            month: m,
            label: `${monthNames[d.getMonth()]} ${y}`
          });
        }
      }
    }
    return eligible;
  }, [reports, monthNames]);

  const handleGenerateReport = async () => {
    if (!selectedMonthToGenerate) return;
    try {
      setGenerating(true);
      const res = await api.post('/providers/reports/generate', {
        year: selectedMonthToGenerate.year,
        month: selectedMonthToGenerate.month
      });
      if (res.data?.success) {
        Alert.alert(
          t('home.success', 'Success'),
          t('home.reportGeneratedMsg', `The report for ${selectedMonthToGenerate.label} has been generated successfully!`)
        );
        setSelectedMonthToGenerate(null);
        fetchReports();
      }
    } catch (e) {
      Alert.alert(
        t('common.error', 'Error'),
        e.response?.data?.message || t('home.generateError', 'Failed to generate report.')
      );
    } finally {
      setGenerating(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <CustomHeader navigation={navigation} title={t('home.reports')} colors={colors} />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
        <Text style={[styles.title, { color: colors.text }]}>{t('home.earningsReports', 'Earnings & Stats Reports')}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {t('home.reportsSubtitle', 'Generate and view your monthly performance statements.')}
        </Text>

        {/* Generate Reports Section */}
        {eligibleMonths.length > 0 && (
          <View style={[styles.generateSection, { backgroundColor: isDarkMode ? '#1E293B' : '#F1F5F9', borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('home.generateReportTitle', 'Generate Month-End Report')}</Text>
            <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
              {t('home.generateReportDesc', 'Select a finished month to compile your stats and earnings report.')}
            </Text>
            
            <View style={styles.pickerRow}>
              <TouchableOpacity 
                style={[styles.dropdownButton, { backgroundColor: isDarkMode ? '#0F172A' : '#FFFFFF', borderColor: colors.border }]}
                onPress={() => setShowDropdown(!showDropdown)}
              >
                <Text style={[styles.dropdownText, { color: colors.text }]}>
                  {selectedMonthToGenerate ? selectedMonthToGenerate.label : t('home.selectMonth', 'Select Month')}
                </Text>
                <MaterialCommunityIcons name={showDropdown ? "chevron-up" : "chevron-down"} size={20} color={colors.text} />
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.actionGenerateBtn, 
                  { 
                    backgroundColor: selectedMonthToGenerate ? colors.accent : '#94A3B8',
                    opacity: (!selectedMonthToGenerate || generating) ? 0.6 : 1 
                  }
                ]}
                onPress={handleGenerateReport}
                disabled={!selectedMonthToGenerate || generating}
              >
                {generating ? <ActivityIndicator size="small" color="#FFF" /> : (
                  <>
                    <Text style={styles.actionGenerateBtnText}>{t('home.generate', 'Generate')}</Text>
                    <MaterialCommunityIcons name="play-circle-outline" size={18} color="#FFF" />
                  </>
                )}
              </TouchableOpacity>
            </View>

            {showDropdown && (
              <View style={[styles.dropdownList, { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF', borderColor: colors.border }]}>
                <ScrollView nestedScrollEnabled={true} style={{ maxHeight: 150 }}>
                  {eligibleMonths.map((item) => (
                    <TouchableOpacity 
                      key={item.label} 
                      style={styles.dropdownItem} 
                      onPress={() => {
                        setSelectedMonthToGenerate(item);
                        setShowDropdown(false);
                      }}
                    >
                      <Text style={[styles.dropdownItemText, { color: colors.text }]}>{item.label}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        )}

        {/* Reports List */}
        <View style={styles.reportsListContainer}>
          <Text style={[styles.listTitle, { color: colors.text }]}>{t('home.generatedReports', 'Generated Reports')}</Text>
          
          {loading ? (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <ActivityIndicator size="large" color={colors.accent} />
            </View>
          ) : reports.length === 0 ? (
            <View style={{ padding: 60, alignItems: 'center' }}>
              <MaterialCommunityIcons name="file-document-outline" size={80} color={colors.border} />
              <Text style={{ color: colors.textSecondary, marginTop: 20, fontSize: 16, fontWeight: '700' }}>{t('home.noReports', 'No reports generated yet')}</Text>
              <Text style={{ color: colors.textSecondary, textAlign: 'center', marginTop: 10 }}>
                {t('home.reportsGenerated', 'Reports will be available to generate once the current month ends.')}
              </Text>
            </View>
          ) : (
            reports.map((report) => {
              const monthName = monthNames[report.month - 1];
              const reportLabel = `${monthName} ${report.year}`;

              return (
                <View key={report.id} style={[styles.reportCard, { backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC', borderColor: colors.border }]}>
                  <View style={styles.reportCardHeader}>
                    <View style={styles.iconWrap}>
                      <MaterialCommunityIcons name="file-document-edit-outline" size={26} color={colors.accent} />
                    </View>
                    <View style={styles.reportInfo}>
                      <Text style={[styles.monthText, { color: colors.text }]}>{reportLabel}</Text>
                      <Text style={[styles.statsSummaryText, { color: colors.textSecondary }]}>
                        {report.jobsCompleted} Jobs • {report.earnings.toLocaleString()} FCFA
                      </Text>
                    </View>
                    <TouchableOpacity 
                      style={[styles.viewReportBtn, { backgroundColor: colors.accent }]}
                      onPress={() => setSelectedReportForModal(report)}
                    >
                      <Text style={styles.viewReportBtnText}>{t('home.viewReport', 'View')}</Text>
                      <MaterialCommunityIcons name="eye" size={16} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* View Report Detail Modal */}
      <Modal visible={!!selectedReportForModal} transparent animationType="slide" onRequestClose={() => setSelectedReportForModal(null)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF', borderColor: colors.border }]}>
            {/* Header */}
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <View style={styles.modalHeaderTitleBox}>
                <MaterialCommunityIcons name="file-document-outline" size={24} color={colors.accent} />
                <Text style={[styles.modalHeaderTitle, { color: colors.text }]}>
                  {selectedReportForModal ? `${monthNames[selectedReportForModal.month - 1]} ${selectedReportForModal.year}` : ''}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedReportForModal(null)} style={styles.closeHeaderBtn}>
                <MaterialCommunityIcons name="close" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {selectedReportForModal && (
              <ScrollView contentContainerStyle={styles.modalScrollContent} showsVerticalScrollIndicator={false}>
                {/* Logo & Subtitle statement */}
                <View style={styles.statementMeta}>
                  <Text style={[styles.statementMetaLogo, { color: colors.accent }]}>FIXAM STATEMENT</Text>
                  <Text style={[styles.statementMetaDesc, { color: colors.textSecondary }]}>
                    Official performance breakdown for the month of {monthNames[selectedReportForModal.month - 1]} {selectedReportForModal.year}.
                  </Text>
                </View>

                {selectedReportForModal.views === 0 && 
                 selectedReportForModal.searches === 0 && 
                 selectedReportForModal.jobsCompleted === 0 && 
                 selectedReportForModal.earnings === 0 ? (
                  <View style={[styles.noDataBox, { borderColor: colors.border }]}>
                    <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#D97706" style={{ marginBottom: 12 }} />
                    <Text style={[styles.noDataText, { color: colors.text }]}>
                      {t('home.noDataAvailable', 'No data available for this month')}
                    </Text>
                  </View>
                ) : (
                  <>
                    {/* Earnings card */}
                    <View style={[styles.modalEarningsCard, { backgroundColor: isDarkMode ? '#0F172A' : '#F0FDFA', borderColor: isDarkMode ? '#1E293B' : '#CCFBF1' }]}>
                      <Text style={[styles.modalEarningsLabel, { color: colors.accent }]}>{t('profile.earnings', 'Total Earnings')}</Text>
                      <Text style={[styles.modalEarningsValue, { color: isDarkMode ? '#FFF' : '#0F766E' }]}>
                        {selectedReportForModal.earnings.toLocaleString()} FCFA
                      </Text>
                    </View>

                    {/* Stats grid */}
                    <Text style={[styles.sectionHeading, { color: colors.text }]}>{t('home.performanceStats', 'Performance Stats')}</Text>
                    
                    <View style={styles.modalStatsGrid}>
                      <View style={[styles.modalStatCell, { backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC', borderColor: colors.border }]}>
                        <MaterialCommunityIcons name="eye-outline" size={24} color="#3B82F6" style={{ marginBottom: 6 }} />
                        <Text style={[styles.modalStatValue, { color: colors.text }]}>{selectedReportForModal.views}</Text>
                        <Text style={[styles.modalStatLabel, { color: colors.textSecondary }]}>{t('profile.profileViews', 'Profile Views')}</Text>
                      </View>

                      <View style={[styles.modalStatCell, { backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC', borderColor: colors.border }]}>
                        <MaterialCommunityIcons name="magnify" size={24} color="#8B5CF6" style={{ marginBottom: 6 }} />
                        <Text style={[styles.modalStatValue, { color: colors.text }]}>{selectedReportForModal.searches}</Text>
                        <Text style={[styles.modalStatLabel, { color: colors.textSecondary }]}>{t('profile.searchAppearances', 'Searches')}</Text>
                      </View>

                      <View style={[styles.modalStatCell, { backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC', borderColor: colors.border }]}>
                        <MaterialCommunityIcons name="briefcase-outline" size={24} color="#F59E0B" style={{ marginBottom: 6 }} />
                        <Text style={[styles.modalStatValue, { color: colors.text }]}>{selectedReportForModal.jobsCompleted}</Text>
                        <Text style={[styles.modalStatLabel, { color: colors.textSecondary }]}>{t('profile.completedJobs', 'Completed Jobs')}</Text>
                      </View>

                      <View style={[styles.modalStatCell, { backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC', borderColor: colors.border }]}>
                        <MaterialCommunityIcons name="star-outline" size={24} color="#10B981" style={{ marginBottom: 6 }} />
                        <Text style={[styles.modalStatValue, { color: colors.text }]}>{Number(selectedReportForModal.rating).toFixed(1)} / 5</Text>
                        <Text style={[styles.modalStatLabel, { color: colors.textSecondary }]}>{t('profile.rating', 'Avg Rating')}</Text>
                      </View>

                      <View style={[styles.modalStatCell, { backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC', borderColor: colors.border }]}>
                        <MaterialCommunityIcons name="check-circle-outline" size={24} color="#EF4444" style={{ marginBottom: 6 }} />
                        <Text style={[styles.modalStatValue, { color: colors.text }]}>{Number(selectedReportForModal.successRate).toFixed(0)}%</Text>
                        <Text style={[styles.modalStatLabel, { color: colors.textSecondary }]}>{t('profile.successRate', 'Success Rate')}</Text>
                      </View>

                      <View style={[styles.modalStatCell, { backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC', borderColor: colors.border }]}>
                        <MaterialCommunityIcons name="database-outline" size={24} color="#EC4899" style={{ marginBottom: 6 }} />
                        <Text style={[styles.modalStatValue, { color: colors.text }]}>{selectedReportForModal.coinsPurchased}</Text>
                        <Text style={[styles.modalStatLabel, { color: colors.textSecondary }]}>{t('profile.coinsPurchased', 'Coins Purchased')}</Text>
                      </View>
                    </View>
                  </>
                )}

                {/* Close Button */}
                <TouchableOpacity 
                  style={[styles.closeModalBtn, { backgroundColor: colors.accent }]}
                  onPress={() => setSelectedReportForModal(null)}
                >
                  <Text style={styles.closeModalBtnText}>{t('common.close', 'Close')}</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: '900', marginBottom: 5 },
  subtitle: { fontSize: 13, marginBottom: 20, lineHeight: 18 },
  generateSection: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
    position: 'relative',
    zIndex: 10,
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', marginBottom: 4 },
  sectionSubtitle: { fontSize: 12, marginBottom: 16 },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dropdownButton: {
    flex: 1.3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  dropdownText: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionGenerateBtn: {
    flex: 1,
    flexDirection: 'row',
    height: 46,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionGenerateBtnText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 14,
  },
  dropdownList: {
    position: 'absolute',
    top: 106,
    left: 16,
    right: 16,
    borderRadius: 8,
    borderWidth: 1,
    elevation: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    zIndex: 99,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownItemText: {
    fontSize: 14,
    fontWeight: '600',
  },
  reportsListContainer: { zIndex: 1 },
  listTitle: { fontSize: 18, fontWeight: '800', marginBottom: 12 },
  reportCard: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
  },
  reportCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(20, 184, 166, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reportInfo: { flex: 1 },
  monthText: { fontSize: 15, fontWeight: '800', marginBottom: 2 },
  statsSummaryText: { fontSize: 12, fontWeight: '600' },
  viewReportBtn: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  viewReportBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
  
  // Modal layout
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    maxHeight: '85%',
    borderTopWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 15,
    borderBottomWidth: 1,
    marginBottom: 15,
  },
  modalHeaderTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: '900',
  },
  closeHeaderBtn: {
    padding: 4,
  },
  modalScrollContent: {
    paddingBottom: 20,
  },
  statementMeta: {
    marginBottom: 16,
  },
  statementMetaLogo: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  statementMetaDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  modalEarningsCard: {
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 24,
  },
  modalEarningsLabel: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  modalEarningsValue: {
    fontSize: 26,
    fontWeight: '900',
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 12,
  },
  modalStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 28,
  },
  modalStatCell: {
    width: '48%',
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    alignItems: 'center',
  },
  modalStatValue: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 2,
  },
  modalStatLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  closeModalBtn: {
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  closeModalBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
  noDataBox: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: 'dashed',
    marginVertical: 20,
  },
  noDataText: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default ReportsScreen;
