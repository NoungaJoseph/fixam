import React, { useState, useEffect } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, ScrollView,
  StatusBar, SafeAreaView, TextInput, ActivityIndicator,
  Alert
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const PAYMENT_METHODS = [
  { id: 'MTN', label: 'MTN MoMo', color: '#FFCC00', textColor: '#111827', icon: 'cellphone-wireless' },
  { id: 'ORANGE', label: 'Orange Money', color: '#F16E00', textColor: '#FFFFFF', icon: 'cellphone-check' },
];

const CoinPaymentFormScreen = ({ navigation, route }) => {
  const { colors, isDarkMode } = useTheme();
  const { user } = useAuth();
  const { package: pkg } = route.params || {};

  const [paymentId, setPaymentId] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('MTN');
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    email: user?.email || ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generatePaymentId();
  }, []);

  const generatePaymentId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    const id = `PAY-${timestamp}-${random}`;
    setPaymentId(id);
  };

  const handleSubmitPayment = async () => {
    // Validate form
    if (!formData.fullName.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return;
    }
    if (!formData.phone.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }
    if (!formData.email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }
    try {
      setLoading(true);

      const response = await api.post('/wallet/mobile-money/initiate', {
        coins: pkg.coins || 0,
        bonus: pkg.bonus || 0,
        price: pkg.price,
        paymentId,
        provider: selectedMethod,
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
      });

      // Navigate to success screen
      navigation.replace('CoinPaymentSuccess', {
        transaction: response.data.data,
        package: pkg,
        message: response.data.message,
      });
    } catch (error) {
      console.log('Payment submission error:', error);
      Alert.alert('Error', 'Failed to submit payment request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.background, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <MaterialCommunityIcons name="chevron-left" size={28} color={colors.accent} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Payment Form</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Package Info Card */}
          <View style={[styles.packageCard, { borderBottomColor: colors.border }]}>
            <View style={styles.packageHeader}>
              <View>
                <Text style={[styles.packageCoins, { color: colors.text }]}>{pkg.coins} Coins</Text>
                <Text style={[styles.packageLabel, { color: colors.textSecondary }]}>{pkg.label}</Text>
              </View>
              <View style={[styles.priceBadge, { backgroundColor: colors.accentSoft }]}>
                <Text style={[styles.priceText, { color: colors.accent }]}>{pkg.price}</Text>
              </View>
            </View>
            {pkg.bonus > 0 && (
              <View style={styles.bonusSection}>
                <MaterialCommunityIcons name="gift" size={20} color="#10B981" />
                <Text style={styles.bonusText}>+{pkg.bonus} Free Bonus Coins!</Text>
              </View>
            )}
          </View>

          {/* Payment ID Section */}
          <View style={[styles.sectionCard, { borderBottomColor: colors.border }]}>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>TRANSACTION ID</Text>
            <View style={[styles.paymentIdBox, { borderColor: colors.border }]}>
              <Text style={[styles.paymentId, { color: colors.accent }]}>{paymentId}</Text>
              <TouchableOpacity>
                <MaterialCommunityIcons name="content-copy" size={20} color={colors.accent} />
              </TouchableOpacity>
            </View>
          </View>

          {/* User Info Section */}
          <View style={[styles.sectionCard, { borderBottomColor: colors.border }]}>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>YOUR INFORMATION</Text>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Full Name</Text>
              <TextInput
                style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                placeholder="Enter your full name"
                placeholderTextColor={colors.placeholder}
                value={formData.fullName}
                onChangeText={(text) => setFormData({ ...formData, fullName: text })}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Phone Number</Text>
              <TextInput
                style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                placeholder="+237 6XXXXXXXX"
                placeholderTextColor={colors.placeholder}
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Email Address</Text>
              <TextInput
                style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                placeholder="your.email@example.com"
                placeholderTextColor={colors.placeholder}
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                keyboardType="email-address"
              />
            </View>
          </View>

          {/* Payment Method */}
          <View style={[styles.sectionCard, { borderBottomColor: colors.border }]}>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>PAYMENT METHOD</Text>
            <View style={styles.methodRow}>
              {PAYMENT_METHODS.map((method) => {
                const active = selectedMethod === method.id;
                return (
                  <TouchableOpacity
                    key={method.id}
                    onPress={() => setSelectedMethod(method.id)}
                    style={[
                      styles.methodCard,
                      {
                        borderColor: active ? colors.accent : colors.border,
                        backgroundColor: active ? colors.accentSoft : colors.card,
                      }
                    ]}
                  >
                    <View style={[styles.methodLogo, { backgroundColor: method.color }]}>
                      <MaterialCommunityIcons name={method.icon} size={20} color={method.textColor} />
                    </View>
                    <Text style={[styles.methodText, { color: colors.text }]}>{method.label}</Text>
                    {active ? <MaterialCommunityIcons name="check-circle" size={18} color={colors.accent} /> : null}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Payment Instructions */}
          <View style={[styles.sectionCard, { borderBottomColor: colors.border }]}>
            <View style={styles.instructionHeader}>
              <MaterialCommunityIcons name="information" size={24} color={colors.accent} />
              <Text style={[styles.instructionTitle, { color: colors.accent }]}>How payment works</Text>
            </View>
            <Text style={[styles.instructionText, { color: colors.accent }]}>
              Enter your mobile money number and continue. You will receive a confirmation prompt on your phone for {pkg.price}.
            </Text>
          </View>

          {/* Coin Calculation */}
          <View style={[styles.sectionCard, { borderBottomColor: colors.border }]}>
            <View style={styles.calculationRow}>
              <Text style={[styles.calcLabel, { color: colors.textSecondary }]}>Base Coins</Text>
              <Text style={[styles.calcValue, { color: colors.text }]}>{pkg.coins} Coins</Text>
            </View>
            {pkg.bonus > 0 && (
              <View style={styles.calculationRow}>
                <Text style={[styles.calcLabel, { color: '#10B981' }]}>Bonus Coins</Text>
                <Text style={[styles.calcValue, { color: '#10B981' }]}>+{pkg.bonus} Coins</Text>
              </View>
            )}
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.calculationRow}>
              <Text style={[styles.totalLabel, { color: colors.text }]}>Total Coins</Text>
              <Text style={[styles.totalValue, { color: colors.accent }]}>{pkg.coins + (pkg.bonus || 0)} Coins</Text>
            </View>
          </View>

          <View style={{ height: 20 }} />
        </ScrollView>

        {/* Submit Button */}
        <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
          <TouchableOpacity
            onPress={handleSubmitPayment}
            disabled={loading}
            style={[
              styles.submitBtn,
              { backgroundColor: colors.accent, opacity: loading ? 0.6 : 1 }
            ]}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <MaterialCommunityIcons name="check-circle" size={20} color="#FFF" />
                <Text style={styles.submitText}>Pay with {selectedMethod === 'MTN' ? 'MTN MoMo' : 'Orange Money'}</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800'
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 120
  },
  packageCard: {
    borderBottomWidth: 1,
    padding: 18,
    marginBottom: 20
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  packageCoins: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 4
  },
  packageLabel: {
    fontSize: 13,
    fontWeight: '600'
  },
  priceBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8
  },
  priceText: {
    fontSize: 14,
    fontWeight: '800'
  },
  bonusSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8
  },
  bonusText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#10B981'
  },
  sectionCard: {
    borderBottomWidth: 1,
    padding: 18,
    marginBottom: 16
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12
  },
  paymentIdBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1
  },
  paymentId: {
    fontSize: 14,
    fontWeight: '800',
    fontFamily: 'monospace'
  },
  formGroup: {
    marginBottom: 14
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: '500'
  },
  instructionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12
  },
  instructionTitle: {
    fontSize: 14,
    fontWeight: '700'
  },
  instructionText: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
    fontWeight: '500'
  },
  phoneNumber: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    borderBottomWidth: 1
  },
  phoneText: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'monospace'
  },
  methodRow: {
    gap: 12,
  },
  methodCard: {
    minHeight: 64,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  methodLogo: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
  },
  uploadBox: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  uploadContent: {
    alignItems: 'center'
  },
  uploadTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 4
  },
  uploadSubtitle: {
    fontSize: 12,
    fontWeight: '500'
  },
  receiptPreview: {
    position: 'relative',
    alignItems: 'center'
  },
  receiptImage: {
    width: 200,
    height: 150,
    borderRadius: 8
  },
  removeBtn: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  calculationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10
  },
  calcLabel: {
    fontSize: 13,
    fontWeight: '600'
  },
  calcValue: {
    fontSize: 14,
    fontWeight: '700'
  },
  divider: {
    height: 1,
    marginVertical: 8
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '800'
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '900'
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1
  },
  submitBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
    borderRadius: 8
  },
  submitText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800'
  }
});

export default CoinPaymentFormScreen;
