import React from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, ScrollView,
  StatusBar, FlatList
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CustomHeader } from '../../navigation/NavigationComponents';
import { useAppContext } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';

const PACKAGES = [
  { id: 'p1', coins: 1, price: '1,000 FCFA', label: 'Starter Pack', bonus: 0 },
  { id: 'p2', coins: 4, price: '4,000 FCFA', label: 'Pro Pack', popular: true, bonus: 0 },
  { id: 'p3', coins: 10, price: '10,000 FCFA', label: 'Value Pack', bonus: 0 },
  { id: 'p4', coins: 20, price: '20,000 FCFA', label: 'Mega Pack', bonus: 0 },
];

const HISTORY = [];

const CoinSystemScreen = ({ navigation }) => {
  const { isDarkMode, colors } = useTheme();
  const { walletBalance } = useAppContext();

  const renderHistory = ({ item }) => (
    <View style={[styles.historyItem, { borderBottomColor: colors.border }]}>
      <View style={[styles.historyIcon, item.amount > 0 ? styles.gainIcon : styles.lossIcon]}>
        <MaterialCommunityIcons 
          name={item.amount > 0 ? 'arrow-down-left' : 'arrow-up-right'} 
          size={18} color={item.amount > 0 ? '#10B981' : '#EF4444'} 
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.historyTitle, { color: colors.text }]}>{item.type === 'Purchase' ? item.package : item.task}</Text>
        <Text style={[styles.historyDate, { color: colors.textSecondary }]}>{item.date}</Text>
      </View>
      <Text style={[styles.historyAmount, item.amount > 0 ? styles.gainText : styles.lossText]}>
        {item.amount > 0 ? '+' : ''}{item.amount}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <CustomHeader navigation={navigation} title="Coin Balance" colors={colors} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={[styles.balanceCard, { borderBottomColor: colors.border }]}>
          <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>Current Balance</Text>
          <View style={styles.balanceRow}>
            <Text style={[styles.balanceVal, { color: colors.text }]}>{walletBalance}</Text>
            <View style={styles.coinIconWrap}>
              <MaterialCommunityIcons name="database" size={28} color={colors.accent} />
            </View>
          </View>
          <View style={styles.balanceFooter}>
            <MaterialCommunityIcons name="information-outline" size={14} color={colors.textSecondary} />
            <Text style={[styles.balanceSub, { color: colors.textSecondary }]}>1 coin is required to accept a task</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Top Up Coins</Text>
        <View style={styles.packagesVertical}>
          {PACKAGES.map(pkg => (
            <TouchableOpacity 
              key={pkg.id} 
              style={[
                styles.packageCard, 
                { borderBottomColor: colors.border }
              ]}
              onPress={() => navigation.navigate('CoinPaymentForm', { package: pkg })}
            >
              <View style={styles.pkgIcon}>
                <MaterialCommunityIcons name="database" size={24} color={pkg.popular ? colors.accent : colors.primary} />
              </View>
              
              <View style={{ flex: 1 }}>
                <Text style={[styles.pkgName, { color: colors.text }]}>{pkg.coins} Coins</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={[styles.pkgLabelText, { color: colors.textSecondary }]}>{pkg.label}</Text>
                  {pkg.bonus > 0 && (
                    <Text style={{ fontSize: 10, color: '#10B981', fontWeight: '800' }}>+{pkg.bonus} FREE</Text>
                  )}
                </View>
              </View>

              <View style={styles.pkgPriceCol}>
                <Text style={[styles.pkgPrice, { color: colors.accent }]}>{pkg.price}</Text>
                {pkg.popular && (
                  <View style={[styles.popularBadge, { backgroundColor: colors.accent }]}>
                    <Text style={styles.popularText}>POPULAR</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Transaction History</Text>
          <TouchableOpacity>
            <Text style={[styles.seeAll, { color: colors.accent }]}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.historyList}>
          {HISTORY.length === 0 ? (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <MaterialCommunityIcons name="history" size={40} color={colors.placeholder} />
              <Text style={{ color: colors.textSecondary, marginTop: 10, fontSize: 13, fontWeight: '600' }}>No transactions yet</Text>
            </View>
          ) : (
            HISTORY.map(item => (
              <View key={item.id}>
                {renderHistory({ item })}
              </View>
            ))
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 50 },
  balanceCard: { marginHorizontal: 20, marginVertical: 16, paddingVertical: 22, borderBottomWidth: 1 },
  balanceLabel: { fontSize: 13, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 },
  balanceRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 15 },
  balanceVal: { fontSize: 52, fontWeight: '900' },
  coinIconWrap: { padding: 8 },
  balanceFooter: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  balanceSub: { fontSize: 12, fontWeight: '600' },
  sectionTitle: { fontSize: 18, fontWeight: '900', marginHorizontal: 20, marginVertical: 15 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 20 },
  seeAll: { fontSize: 14, fontWeight: '700' },
  packagesVertical: { paddingHorizontal: 20, gap: 12, marginBottom: 25 },
  packageCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18, borderBottomWidth: 1, gap: 15 },
  pkgIcon: { width: 42, height: 42, justifyContent: 'center', alignItems: 'flex-start' },
  pkgName: { fontSize: 17, fontWeight: '900' },
  pkgLabelText: { fontSize: 12, fontWeight: '700', marginTop: 2 },
  pkgPriceCol: { alignItems: 'flex-end', gap: 5 },
  pkgPrice: { fontSize: 16, fontWeight: '900' },
  popularBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  popularText: { fontSize: 8, fontWeight: '900', color: '#FFF' },
  historyList: { marginHorizontal: 20 },
  historyItem: { flexDirection: 'row', alignItems: 'center', padding: 18, borderBottomWidth: 1 },
  historyIcon: { width: 42, height: 42, justifyContent: 'center', alignItems: 'flex-start', marginRight: 15 },
  gainIcon: { backgroundColor: '#ECFDF5' },
  lossIcon: { backgroundColor: '#FEF2F2' },
  historyTitle: { fontSize: 14, fontWeight: '700' },
  historyDate: { fontSize: 11, marginTop: 2 },
  historyAmount: { fontSize: 16, fontWeight: '800' },
  gainText: { color: '#10B981' },
  lossText: { color: '#EF4444' },
});

export default CoinSystemScreen;
