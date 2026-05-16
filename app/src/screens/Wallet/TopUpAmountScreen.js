import React, { useState } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, ScrollView,
  StatusBar, SafeAreaView, TextInput, KeyboardAvoidingView, Platform
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';

const TopUpAmountScreen = ({ navigation }) => {
  const { colors, isDarkMode } = useTheme();
  const [amount, setAmount] = useState('');

  const COIN_PRICE = 100; // 1 coin = 100 FCFA

  const handleContinue = () => {
    const numAmount = parseInt(amount);
    if (!amount || isNaN(numAmount) || numAmount < 500) {
      alert('Minimum top-up is 500 FCFA');
      return;
    }
    
    const coins = Math.floor(numAmount / COIN_PRICE);
    const pkg = { 
      id: 'custom', 
      coins: coins, 
      price: numAmount.toLocaleString(), 
      bonus: 0
    };
    
    navigation.navigate('TopUpPayment', { package: pkg });
  };

  return (
    <LinearGradient colors={isDarkMode ? ['#0F172A', '#1E1B4B', '#020617'] : ['#FFFFFF', '#F8FAFC', '#F1F5F9']} style={styles.background}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: colors.card }]}>
              <MaterialCommunityIcons name="arrow-left" size={22} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Custom Amount</Text>
            <View style={{ width: 42 }} />
          </View>

          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="currency-usd" size={40} color={colors.accent} />
            </View>
            
            <Text style={[styles.title, { color: colors.text }]}>How much do you want to add?</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Enter the amount in FCFA. You'll receive approximately 1 coin for every {COIN_PRICE} FCFA.
            </Text>

            <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.currencyPrefix, { color: colors.textSecondary }]}>FCFA</Text>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                placeholderTextColor={colors.placeholder}
                keyboardType="numeric"
                autoFocus
              />
            </View>

            {amount.length > 0 && (
              <View style={[styles.calcBox, { backgroundColor: colors.accent + '10', borderColor: colors.accent }]}>
                <View style={styles.calcRow}>
                  <Text style={[styles.calcLabel, { color: colors.textSecondary }]}>Estimated Coins:</Text>
                  <Text style={[styles.calcValue, { color: colors.text }]}>{Math.floor(parseInt(amount) / COIN_PRICE) || 0} Coins</Text>
                </View>
              </View>
            )}

            <View style={styles.quickAmounts}>
              {[1000, 2000, 5000, 10000].map(amt => (
                <TouchableOpacity 
                  key={amt} 
                  style={[styles.quickBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
                  onPress={() => setAmount(amt.toString())}
                >
                  <Text style={[styles.quickText, { color: colors.text }]}>{amt.toLocaleString()}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.continueBtn, { backgroundColor: colors.accent }]}
              onPress={handleContinue}
            >
              <Text style={styles.continueBtnText}>Continue to Payment</Text>
              <MaterialCommunityIcons name="arrow-right" size={20} color="#FFF" />
            </TouchableOpacity>

            <Text style={[styles.hint, { color: colors.textSecondary }]}>
              Minimum amount is 500 FCFA.
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
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
  content: { padding: 24, alignItems: 'center' },
  iconCircle: { width: 80, height: 80, backgroundColor: 'rgba(249, 115, 22, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 22, fontWeight: '900', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 30, lineHeight: 20 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', width: '100%', height: 70, borderRadius: 8, borderWidth: 0, borderBottomWidth: 2, paddingHorizontal: 4, marginBottom: 20 },
  currencyPrefix: { fontSize: 18, fontWeight: '800', marginRight: 15 },
  input: { flex: 1, fontSize: 28, fontWeight: '900' },
  calcBox: { width: '100%', borderRadius: 8, padding: 16, borderWidth: 1, marginBottom: 20 },
  calcRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  calcLabel: { fontSize: 13, fontWeight: '600' },
  calcValue: { fontSize: 15, fontWeight: '800' },
  quickAmounts: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 30 },
  quickBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999 },
  quickText: { fontSize: 14, fontWeight: '700' },
  continueBtn: { width: '100%', height: 56, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  continueBtnText: { color: '#FFF', fontSize: 16, fontWeight: '900' },
  hint: { fontSize: 12, marginTop: 15, fontStyle: 'italic' },
});

export default TopUpAmountScreen;
