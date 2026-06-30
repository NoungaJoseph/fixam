import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  StyleSheet, View, Text, ScrollView, TouchableOpacity,
  ActivityIndicator, Alert, Platform
} from 'react-native';
import SafeAreaView from '../../components/Common/TealSafeAreaView';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { CustomHeader } from '../../navigation/NavigationComponents';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../services/api';

// Safe imports with fallback in case native modules are not linked/found in the dev client
let Print;
let Sharing;
try {
  Print = require('expo-print');
  Sharing = require('expo-sharing');
} catch (error) {
  console.log('ExpoPrint/Sharing modules are not available natively', error.message);
}

const ReportsScreen = ({ navigation }) => {
  const { colors, isDarkMode } = useTheme();
  const { t, language } = useLanguage();
  
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selectedMonthToGenerate, setSelectedMonthToGenerate] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [expandedReportId, setExpandedReportId] = useState(null);

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

  const handleDownload = async (report) => {
    const monthName = monthNames[report.month - 1];
    const reportLabel = `${monthName} ${report.year}`;

    try {
      if (!Print || !Print.printToFileAsync) {
        throw new Error('ExpoPrint native module is not available');
      }

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Fixam Provider Performance Report</title>
          <style>
            body {
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              color: #333;
              padding: 40px;
              line-height: 1.6;
            }
            .header {
              text-align: center;
              border-bottom: 3px solid #0D9488;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 32px;
              font-weight: 800;
              color: #0D9488;
            }
            .subtitle {
              font-size: 16px;
              color: #666;
              margin-top: 5px;
            }
            .title {
              font-size: 24px;
              font-weight: 700;
              margin-top: 20px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .section-title {
              font-size: 18px;
              font-weight: 700;
              color: #0D9488;
              border-bottom: 1px solid #ddd;
              padding-bottom: 8px;
              margin-top: 30px;
              margin-bottom: 15px;
            }
            .stats-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 15px;
              margin-bottom: 30px;
            }
            .stat-card {
              background-color: #f9f9f9;
              border: 1px solid #eaeaea;
              border-radius: 8px;
              padding: 15px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.02);
            }
            .stat-label {
              font-size: 12px;
              text-transform: uppercase;
              color: #888;
              font-weight: 700;
              margin-bottom: 5px;
            }
            .stat-value {
              font-size: 20px;
              font-weight: 800;
              color: #222;
            }
            .footer {
              text-align: center;
              margin-top: 60px;
              font-size: 12px;
              color: #999;
              border-top: 1px solid #eee;
              padding-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">FIXAM</div>
            <div class="subtitle">Official Service Provider Statement</div>
            <div class="title">Performance & Earnings Report</div>
            <div style="font-size: 14px; color: #444; margin-top: 8px; font-weight: 700;">Period: ${reportLabel}</div>
          </div>

          <div class="section-title">Performance Summary</div>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-label">Profile Views</div>
              <div class="stat-value">${report.views}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Search Appearances</div>
              <div class="stat-value">${report.searches}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Completed Jobs</div>
              <div class="stat-value">${report.jobsCompleted}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Rating</div>
              <div class="stat-value">${Number(report.rating).toFixed(1)} / 5.0</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Success Rate</div>
              <div class="stat-value">${Number(report.successRate).toFixed(0)}%</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Coins Purchased</div>
              <div class="stat-value">${report.coinsPurchased} Coins</div>
            </div>
          </div>

          <div class="section-title">Financial Summary</div>
          <div class="stats-grid" style="grid-template-columns: 1fr;">
            <div class="stat-card" style="background-color: #f0fdfa; border-color: #99f6e4;">
              <div class="stat-label" style="color: #0d9488;">Total Earnings</div>
              <div class="stat-value" style="color: #0f766e; font-size: 26px;">${report.earnings.toLocaleString()} FCFA</div>
            </div>
          </div>

          <div class="footer">
            <p>Generated on ${new Date().toLocaleDateString()} via the Fixam App.</p>
            <p>&copy; ${new Date().getFullYear()} Fixam. All rights reserved.</p>
          </div>
        </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      
      if (Sharing && Sharing.shareAsync) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert(
          t('home.reportDownloaded', 'Report Exported'),
          t('home.reportSavedLocal', `The report PDF has been saved at: ${uri}`)
        );
      }
    } catch (e) {
      console.log('PDF Generation failed or native module unavailable, showing fallback alert', e.message);
      
      const summaryText = `
Profile Views: ${report.views}
Search Appearances: ${report.searches}
Completed Jobs: ${report.jobsCompleted}
Total Earnings: ${report.earnings.toLocaleString()} FCFA
Rating: ${Number(report.rating).toFixed(1)} / 5.0
Success Rate: ${Number(report.successRate).toFixed(0)}%
Coins Purchased: ${report.coinsPurchased} Coins
      `.trim();

      Alert.alert(
        `${t('home.reports', 'Report')} - ${reportLabel}`,
        `${t('home.reportSaved', 'Your report has been successfully compiled:')}\n\n${summaryText}`
      );
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <CustomHeader navigation={navigation} title={t('home.reports')} colors={colors} />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
        <Text style={[styles.title, { color: colors.text }]}>{t('home.earningsReports', 'Earnings & Stats Reports')}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {t('home.reportsSubtitle', 'Generate and export your monthly financial statements & performance stats.')}
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
              const isExpanded = expandedReportId === report.id;
              const monthName = monthNames[report.month - 1];
              const reportLabel = `${monthName} ${report.year}`;

              return (
                <View key={report.id} style={[styles.reportCard, { backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC', borderColor: colors.border }]}>
                  <TouchableOpacity 
                    style={styles.reportCardHeader} 
                    onPress={() => setExpandedReportId(isExpanded ? null : report.id)}
                  >
                    <View style={styles.iconWrap}>
                      <MaterialCommunityIcons name="file-pdf-box" size={28} color="#EF4444" />
                    </View>
                    <View style={styles.reportInfo}>
                      <Text style={[styles.monthText, { color: colors.text }]}>{reportLabel}</Text>
                      <Text style={[styles.statsSummaryText, { color: colors.textSecondary }]}>
                        {report.jobsCompleted} Jobs • {report.earnings.toLocaleString()} FCFA
                      </Text>
                    </View>
                    <MaterialCommunityIcons 
                      name={isExpanded ? "chevron-up" : "chevron-down"} 
                      size={24} 
                      color={colors.textSecondary} 
                    />
                  </TouchableOpacity>

                  {isExpanded && (
                    <View style={[styles.reportDetails, { borderTopColor: colors.border }]}>
                      {/* Grid of stats */}
                      <View style={styles.statsGrid}>
                        <View style={styles.gridItem}>
                          <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>{t('profile.profileViews', 'Views')}</Text>
                          <Text style={[styles.gridValue, { color: colors.text }]}>{report.views}</Text>
                        </View>
                        <View style={styles.gridItem}>
                          <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>{t('profile.searchAppearances', 'Searches')}</Text>
                          <Text style={[styles.gridValue, { color: colors.text }]}>{report.searches}</Text>
                        </View>
                        <View style={styles.gridItem}>
                          <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>{t('profile.completedJobs', 'Completed Jobs')}</Text>
                          <Text style={[styles.gridValue, { color: colors.text }]}>{report.jobsCompleted}</Text>
                        </View>
                        <View style={styles.gridItem}>
                          <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>{t('profile.earnings', 'Earnings')}</Text>
                          <Text style={[styles.gridValue, { color: colors.text, fontSize: 13 }]}>{report.earnings.toLocaleString()} FCFA</Text>
                        </View>
                        <View style={styles.gridItem}>
                          <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>{t('profile.rating', 'Rating')}</Text>
                          <Text style={[styles.gridValue, { color: colors.text }]}>{Number(report.rating).toFixed(1)} / 5</Text>
                        </View>
                        <View style={styles.gridItem}>
                          <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>{t('profile.successRate', 'Success Rate')}</Text>
                          <Text style={[styles.gridValue, { color: colors.text }]}>{Number(report.successRate).toFixed(0)}%</Text>
                        </View>
                        <View style={styles.gridItem}>
                          <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>{t('profile.coinsPurchased', 'Coins Bought')}</Text>
                          <Text style={[styles.gridValue, { color: colors.text }]}>{report.coinsPurchased}</Text>
                        </View>
                      </View>

                      {/* Export/Download Button */}
                      <TouchableOpacity 
                        style={[styles.exportBtn, { backgroundColor: colors.accent }]}
                        onPress={() => handleDownload(report)}
                      >
                        <Text style={styles.exportBtnText}>{t('home.exportReport', 'Export Report')}</Text>
                        <MaterialCommunityIcons name="export" size={18} color="#FFF" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
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
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reportInfo: { flex: 1 },
  monthText: { fontSize: 15, fontWeight: '800', marginBottom: 2 },
  statsSummaryText: { fontSize: 12, fontWeight: '600' },
  reportDetails: {
    padding: 16,
    borderTopWidth: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  gridItem: {
    width: '48%',
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
  },
  gridLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  gridValue: {
    fontSize: 14,
    fontWeight: '800',
  },
  exportBtn: {
    height: 44,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  exportBtnText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 14,
  },
});

export default ReportsScreen;
