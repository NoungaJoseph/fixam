import React from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, ScrollView, StatusBar, Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CustomHeader } from '../../navigation/NavigationComponents';
import { useTheme } from '../../context/ThemeContext';
import { useAppContext } from '../../context/AppContext';

const TRANSACTIONS = [];

const WalletScreen = ({ navigation }) => {
  const { colors, isDarkMode } = useTheme();
  const { walletBalance } = useAppContext();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor="transparent" translucent />
      <CustomHeader navigation={navigation} title="My Wallet" colors={colors} />

      {/* Internal Header Removed as per Point 2 - relying on Global Header */}

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Current Balance Card */}
        <View style={[styles.balanceCard, { borderBottomColor: colors.border }]}>
          <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>CURRENT BALANCE</Text>
          <View style={styles.balanceRow}>
            <Text style={[styles.balanceAmount, { color: colors.text }]}>{walletBalance}</Text>
            <Text style={[styles.balanceCurrency, { color: colors.textSecondary }]}>Coins</Text>
          </View>

          <TouchableOpacity 
            style={[styles.topUpBtn, { backgroundColor: colors.accent }]}
            onPress={() => navigation.navigate('TopUp')}
          >
            <MaterialCommunityIcons name="plus-circle-outline" size={20} color="#FFF" />
            <Text style={styles.topUpText}>Top Up Balance</Text>
          </TouchableOpacity>
        </View>

        {/* Transaction History Header */}
        <View style={styles.historyHeaderRow}>
          <Text style={[styles.historyTitle, { color: colors.text }]}>Recent Transactions</Text>
          <TouchableOpacity>
            <Text style={[styles.seeAll, { color: colors.accent }]}>See All</Text>
          </TouchableOpacity>
        </View>

        {/* Transactions List */}
        <View style={styles.transactionsContainer}>
          {TRANSACTIONS.map((item) => (
            <View key={item.id} style={[styles.transactionCard, { borderBottomColor: colors.border }]}>
              <View style={styles.iconWrap}>
                <MaterialCommunityIcons name={item.icon} size={22} color={colors.primary} />
              </View>
              
              <View style={styles.transactionInfo}>
                <Text style={[styles.transactionTitle, { color: colors.text }]}>{item.title}</Text>
                <Text style={[styles.transactionDate, { color: colors.textSecondary }]}>{item.date}</Text>
              </View>

              <View style={styles.transactionRight}>
                <Text style={[styles.transactionAmount, { color: item.amount.includes('+') ? '#10B981' : colors.text }]}>{item.amount}</Text>
                <View style={[styles.statusBadge, { backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.1)' : item.statusBg }]}>
                  <Text style={[styles.statusText, { color: item.statusColor }]}>{item.status}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Refer Card */}
        <TouchableOpacity 
          style={[styles.offerCard, { borderTopColor: colors.border, borderBottomColor: colors.border }]}
          onPress={() => navigation.navigate('Invitation')}
        >
          <View style={styles.offerIconWrap}>
            <MaterialCommunityIcons name="gift-outline" size={24} color={colors.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.offerTitle, { color: colors.text }]}>Earn Free Coins</Text>
            <Text style={[styles.offerSubtitle, { color: colors.textSecondary }]}>Invite your friends to Fixam and earn 3 bonus coins.</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  balanceCard: {
    paddingVertical: 28,
    marginTop: 10, marginBottom: 30, borderBottomWidth: 1,
  },
  circleTopRight: {
    position: 'absolute', top: -30, right: -20,
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  circleBottomLeft: {
    position: 'absolute', bottom: -40, left: -20,
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  balanceLabel: { fontSize: 11, letterSpacing: 1.5, marginBottom: 10, fontWeight: '800' },
  balanceRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 30 },
  balanceAmount: { fontSize: 48, fontWeight: '900' },
  balanceCurrency: { fontSize: 18, fontWeight: '700', marginLeft: 8 },
  topUpBtn: {
    borderRadius: 8, paddingVertical: 14,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3
  },
  topUpText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  historyHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  historyTitle: { fontSize: 18, fontWeight: '900' },
  seeAll: { fontSize: 14, fontWeight: '700' },
  transactionsContainer: { marginBottom: 30 },
  transactionCard: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 16, borderBottomWidth: 1,
  },
  iconWrap: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  transactionInfo: { flex: 1, marginLeft: 15 },
  transactionTitle: { fontSize: 15, fontWeight: '800', marginBottom: 4 },
  transactionDate: { fontSize: 12 },
  transactionRight: { alignItems: 'flex-end' },
  transactionAmount: { fontSize: 16, fontWeight: '900', marginBottom: 6 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 12 },
  statusText: { fontSize: 10, fontWeight: '900' },
  offerCard: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 20, borderTopWidth: 1, borderBottomWidth: 1, gap: 15,
  },
  offerIconWrap: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  offerTitle: { fontSize: 16, fontWeight: '800', marginBottom: 4 },
  offerSubtitle: { fontSize: 13, lineHeight: 18 },
});

export default WalletScreen;
