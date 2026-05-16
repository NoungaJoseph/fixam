import React, { useState, useEffect } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, ScrollView,
  StatusBar, SafeAreaView, TextInput, ActivityIndicator,
  Image, Alert
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const ADMIN_PAYMENT_PHONE = '682803006';
const ADMIN_PAYMENT_NAME = 'NOUNGA JOSEPH YOUMI';

const CoinPaymentFormScreen = ({ navigation, route }) => {
  const { colors, isDarkMode } = useTheme();
  const { user } = useAuth();
  const { package: pkg } = route.params || {};

  const [paymentId, setPaymentId] = useState('');
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    email: user?.email || ''
  });
  const [receiptImage, setReceiptImage] = useState(null);
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

  const pickReceiptImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled) {
        setReceiptImage(result.assets[0]);
      }
    } catch (error) {
      console.log('Image picker error:', error);
    }
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
    if (!receiptImage) {
      Alert.alert('Error', 'Please upload a payment receipt or screenshot');
      return;
    }

    try {
      setLoading(true);

      // Upload receipt
      const receiptName = receiptImage.fileName || receiptImage.uri?.split('/').pop() || `receipt-${paymentId}.jpg`;
      const receiptType = receiptImage.mimeType || (receiptName.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg');
      const formDataToSend = new FormData();
      formDataToSend.append('amount', pkg.coins || 0);
      formDataToSend.append('bonus', pkg.bonus || 0);
      formDataToSend.append('price', pkg.price);
      formDataToSend.append('paymentId', paymentId);
      formDataToSend.append('fullName', formData.fullName);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('receipt', {
        uri: receiptImage.uri,
        type: receiptType,
        name: receiptName
      });

      const response = await api.post('/transactions/request-coins', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Navigate to success screen
      navigation.replace('CoinPaymentSuccess', {
        transaction: response.data.data,
        package: pkg
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

          {/* Payment Instructions */}
          <View style={[styles.sectionCard, { borderBottomColor: colors.border }]}>
            <View style={styles.instructionHeader}>
              <MaterialCommunityIcons name="information" size={24} color={colors.accent} />
              <Text style={[styles.instructionTitle, { color: colors.accent }]}>Payment Instructions</Text>
            </View>
            <Text style={[styles.instructionText, { color: colors.accent }]}>
              Send {pkg.price} to the payment account below, then upload the payment receipt or screenshot. Keep your transaction ID visible.
            </Text>
            <View style={[styles.phoneNumber, { marginBottom: 10, borderBottomColor: colors.border }]}>
              <MaterialCommunityIcons name="account" size={20} color={colors.accent} />
              <Text style={[styles.phoneText, { color: colors.text }]}>{ADMIN_PAYMENT_NAME}</Text>
            </View>
            <View style={[styles.phoneNumber, { borderBottomColor: colors.border }]}>
              <MaterialCommunityIcons name="phone" size={20} color={colors.accent} />
              <Text style={[styles.phoneText, { color: colors.text }]}>{ADMIN_PAYMENT_PHONE}</Text>
            </View>
          </View>

          {/* Receipt Upload Section */}
          <View style={[styles.sectionCard, { borderBottomColor: colors.border }]}>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>PAYMENT RECEIPT</Text>

            <TouchableOpacity
              onPress={pickReceiptImage}
              style={[
                styles.uploadBox,
                { borderColor: colors.border }
              ]}
            >
              {receiptImage ? (
                <View style={styles.receiptPreview}>
                  <Image
                    source={{ uri: receiptImage.uri }}
                    style={styles.receiptImage}
                  />
                  <TouchableOpacity
                    onPress={() => setReceiptImage(null)}
                    style={[styles.removeBtn, { backgroundColor: '#10B981' }]}
                  >
                    <MaterialCommunityIcons name="check" size={20} color="#FFF" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.uploadContent}>
                  <MaterialCommunityIcons name="cloud-upload" size={40} color={colors.accent} />
                  <Text style={[styles.uploadTitle, { color: colors.text }]}>Upload Receipt</Text>
                  <Text style={[styles.uploadSubtitle, { color: colors.textSecondary }]}>
                    Click to select receipt image or screenshot
                  </Text>
                </View>
              )}
            </TouchableOpacity>
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
                <Text style={styles.submitText}>Submit Payment Request</Text>
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
