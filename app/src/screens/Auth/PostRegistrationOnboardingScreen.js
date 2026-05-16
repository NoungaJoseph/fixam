import React, { useRef, useState } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, Image, StatusBar,
  FlatList, Dimensions, SafeAreaView, ActivityIndicator
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../services/theme';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../services/api';

const { width } = Dimensions.get('window');

const getSlides = (role) => {
  if (role === 'provider') {
    return [
      {
        key: 'profile',
        title: 'Build a profile clients can trust',
        text: 'Add clear skills, a professional photo, service areas, and fair starting prices so clients know exactly what you do.',
        image: require('../../../assets/onboarding/p1.png'),
        icon: 'account-badge-outline',
      },
      {
        key: 'requests',
        title: 'Manage every request in one place',
        text: 'Review new jobs, ask questions in chat, accept only the work you can deliver, and keep clients updated.',
        image: require('../../../assets/onboarding/verification.png'),
        icon: 'briefcase-check-outline',
      },
      {
        key: 'trust',
        title: 'Earn reviews and grow steadily',
        text: 'Arrive on time, complete the work, collect cash directly after delivery, and ask the client to rate your service.',
        image: require('../../../assets/onboarding/c2.png'),
        icon: 'star-check-outline',
      },
    ];
  }

  return [
    {
      key: 'post',
      title: 'Post clear task details',
      text: 'Describe the work, location, preferred time, and budget so nearby professionals can respond quickly.',
      image: require('../../../assets/onboarding/c1.png'),
      icon: 'clipboard-text-outline',
    },
    {
      key: 'verify',
      title: 'Choose verified providers',
      text: 'Check the verification badge, ratings, reviews, skill match, and response history before accepting help.',
      image: require('../../../assets/onboarding/verification.png'),
      icon: 'shield-check-outline',
    },
    {
      key: 'delivery',
      title: 'Pay directly after the job',
      text: 'Fixam connects you with the provider. When the job is done properly, pay cash on delivery and leave a review.',
      image: require('../../../assets/onboarding/c2.png'),
      icon: 'cash-check',
    },
  ];
};

const PostRegistrationOnboardingScreen = ({ navigation, route }) => {
  const role = route.params?.role || 'client';
  const userData = route.params?.userData || {};
  const slides = getSlides(role);
  const { loginDirect } = useAuth();
  const { t } = useLanguage();
  const [index, setIndex] = useState(0);
  const listRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const finish = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await api.post('/auth/register', {
        ...userData,
        role: role.toUpperCase()
      });
      loginDirect(res.data.user, res.data.token);
    } catch (error) {
      console.log('Registration error:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Failed to complete registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const next = () => {
    if (index < slides.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1 });
    } else {
      finish();
    }
  };

  return (
    <LinearGradient colors={['#FFFFFF', '#F4F8FF', '#EAF2FF']} style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <View style={{ width: 42 }} />
          <TouchableOpacity onPress={finish}>
            <Text style={styles.skip}>{t('common.skip')}</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          ref={listRef}
          data={slides}
          horizontal
          pagingEnabled
          bounces={false}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.key}
          onMomentumScrollEnd={(event) => {
            setIndex(Math.round(event.nativeEvent.contentOffset.x / width));
          }}
          renderItem={({ item }) => (
            <View style={styles.slide}>
              <View style={styles.imageFrame}>
                <Image source={item.image} style={styles.image} resizeMode="cover" />
                <View style={styles.iconBadge}>
                  <MaterialCommunityIcons name={item.icon} size={24} color="#FFF" />
                </View>
              </View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.text}>{item.text}</Text>
            </View>
          )}
        />

        <View style={styles.footer}>
          <View style={styles.dots}>
            {slides.map((slide, i) => (
              <View key={slide.key} style={[styles.dot, i === index && styles.dotActive]} />
            ))}
          </View>
          <TouchableOpacity style={styles.nextBtn} onPress={next} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <>
                <Text style={styles.nextText}>{index === slides.length - 1 ? 'Enter Fixam' : t('common.continue')}</Text>
                <MaterialCommunityIcons name="arrow-right" size={20} color="#FFF" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  header: { height: 66, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerBtn: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
  skip: { fontSize: 14, fontWeight: '800', color: COLORS.textSecondary },
  slide: { width, paddingHorizontal: 24, alignItems: 'center' },
  imageFrame: { width: '100%', height: 340, borderRadius: 8, overflow: 'hidden', backgroundColor: '#DDEBFF' },
  image: { width: '100%', height: '100%' },
  iconBadge: { position: 'absolute', right: 18, bottom: 18, width: 54, height: 54, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.accent },
  title: { fontSize: 28, lineHeight: 34, fontWeight: '900', color: COLORS.primary, textAlign: 'center', marginTop: 34 },
  text: { fontSize: 15, lineHeight: 24, color: COLORS.textSecondary, textAlign: 'center', marginTop: 14 },
  footer: { paddingHorizontal: 24, paddingBottom: 34, alignItems: 'center' },
  dots: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#C7D2FE' },
  dotActive: { width: 26, backgroundColor: COLORS.accent },
  nextBtn: { width: '100%', height: 58, borderRadius: 8, backgroundColor: COLORS.accent, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  nextText: { color: '#FFF', fontSize: 16, fontWeight: '900' },
});

export default PostRegistrationOnboardingScreen;
