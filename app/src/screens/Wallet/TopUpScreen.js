import React, { useState } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, ScrollView,
  StatusBar, SafeAreaView, Image
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { useAppContext } from '../../context/AppContext';

const PACKAGES = [
  { id: 'p1', coins: 10, price: '1,000', popular: false, bonus: 0 },
  { id: 'p2', coins: 25, price: '2,000', popular: true, bonus: 0 },
  { id: 'p3', coins: 60, price: '5,000', popular: false, bonus: 0 },
  { id: 'p4', coins: 150, price: '10,000', popular: false, bonus: 0 },
];

const TopUpScreen = ({ navigation }) => {
  const { colors, isDarkMode } = useTheme();
  const { walletBalance } = useAppContext();
  const [selectedPkg, setSelectedPkg] = useState('p2');

  const handleContinue = () => {
    const pkg = PACKAGES.find(p => p.id === selectedPkg);
    navigation.navigate('CoinPaymentForm', { package: { ...pkg, price: `${pkg.price} FCFA`, label: 'Coin Pack' } });
  };

  return (
    <LinearGradient colors={isDarkMode ? ['#0F172A', '#1E1B4B', '#020617'] : ['#FFFFFF', '#F8FAFC', '#F1F5F9']} style={styles.background}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: colors.card }]}>
            <MaterialCommunityIcons name="arrow-left" size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Top Up Coins</Text>
          <View style={{ width: 42 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Balance display */}
          <View style={[styles.balanceCard, { backgroundColor: colors.accent }]}>
            <View style={styles.balanceInfo}>
              <Text style={styles.balanceLabel}>Current Balance</Text>
              <View style={styles.balanceRow}>
                <MaterialCommunityIcons name="database" size={24} color="#FFF" />
                <Text style={styles.balanceValue}>{walletBalance} Coins</Text>
              </View>
            </View>
            <View style={styles.balanceIcon}>
              <MaterialCommunityIcons name="wallet-plus-outline" size={40} color="rgba(255,255,255,0.3)" />
            </View>
          </View>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Package</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Choose a coin package to continue. Coins are used to unlock job requests.</Text>

          {PACKAGES.map((pkg) => {
            const isSelected = selectedPkg === pkg.id;
            return (
              <TouchableOpacity
                key={pkg.id}
                onPress={() => setSelectedPkg(pkg.id)}
                style={[
                  styles.pkgCard,
                  { borderBottomColor: colors.border }
                ]}
              >
                {pkg.popular && (
                  <View style={[styles.popularBadge, { backgroundColor: colors.accent }]}>
                    <Text style={styles.popularText}>BEST VALUE</Text>
                  </View>
                )}
                
                <View style={styles.pkgIcon}>
                  <MaterialCommunityIcons name="database" size={28} color={isSelected ? colors.accent : colors.primary} />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={[styles.pkgCoins, { color: colors.text }]}>{pkg.coins} Coins</Text>
                  {pkg.bonus > 0 && (
                    <Text style={[styles.pkgBonus, { color: '#22C55E' }]}>+ {pkg.bonus} Bonus Coins</Text>
                  )}
                </View>

                <View style={styles.priceRow}>
                  <Text style={[styles.priceValue, { color: colors.text }]}>{pkg.price}</Text>
                  <Text style={[styles.priceUnit, { color: colors.textSecondary }]}> FCFA</Text>
                </View>

                <View style={[styles.radio, { borderColor: isSelected ? colors.accent : colors.border }]}>
                  {isSelected && <View style={[styles.radioInner, { backgroundColor: colors.accent }]} />}
                </View>
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            style={[styles.continueBtn, { backgroundColor: colors.accent }]}
            onPress={handleContinue}
          >
            <Text style={styles.continueBtnText}>Continue to Payment</Text>
            <MaterialCommunityIcons name="arrow-right" size={20} color="#FFF" />
          </TouchableOpacity>

          <View style={styles.secureRow}>
            <MaterialCommunityIcons name="shield-check" size={16} color="#22C55E" />
            <Text style={[styles.secureText, { color: colors.textSecondary }]}>Secure payment powered by Fixam Pay</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14 },
  backBtn: { width: 42, height: 42, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  content: { padding: 22, paddingBottom: 40 },
  balanceCard: { borderRadius: 8, padding: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 25 },
  balanceLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '600', marginBottom: 5 },
  balanceRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  balanceValue: { color: '#FFF', fontSize: 24, fontWeight: '900' },
  sectionTitle: { fontSize: 18, fontWeight: '900', marginBottom: 8 },
  subtitle: { fontSize: 14, lineHeight: 20, marginBottom: 20 },
  pkgCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18, gap: 14, position: 'relative', borderBottomWidth: 1 },
  popularBadge: { position: 'absolute', top: -10, right: 20, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
  popularText: { color: '#FFF', fontSize: 10, fontWeight: '900' },
  pkgIcon: { width: 42, height: 42, justifyContent: 'center', alignItems: 'flex-start' },
  pkgCoins: { fontSize: 18, fontWeight: '900' },
  pkgBonus: { fontSize: 12, fontWeight: '700', marginTop: 2 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline' },
  priceValue: { fontSize: 18, fontWeight: '900' },
  priceUnit: { fontSize: 12, fontWeight: '700' },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  radioInner: { width: 12, height: 12, borderRadius: 6 },
  continueBtn: { height: 56, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 15 },
  continueBtnText: { color: '#FFF', fontSize: 16, fontWeight: '900' },
  secureRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 20 },
  secureText: { fontSize: 12, fontWeight: '600' },
});

export default TopUpScreen;
