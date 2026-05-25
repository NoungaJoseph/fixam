import React, { useState, useRef } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, Image, StatusBar,
  FlatList, Dimensions, SafeAreaView
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { useLanguage } from '../../context/LanguageContext';

const { width } = Dimensions.get('window');

const OnboardingScreen = ({ navigation }) => {
  const { t } = useLanguage();
  
  const SLIDES = [
    {
      id: '1',
      title: t('onboarding.slide1Title'),
      desc: t('onboarding.slide1Desc'),
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop',
      badge: { text: 'Verified Pros', icon: 'decagram', color: '#0D9488' }
    },
    {
      id: '2',
      title: t('onboarding.slide2Title'),
      desc: t('onboarding.slide2Desc'),
      image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=2070&auto=format&fit=crop',
      badge: { text: 'Trusted Pro', icon: 'shield-check', color: '#FFFFFF' }
    },
    {
      id: '3',
      title: t('onboarding.slide3Title'),
      desc: t('onboarding.slide3Desc'),
      image: null,
      customImage: true
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems[0]) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.replace('Login');
    }
  };

  const handleSkip = () => {
    navigation.replace('Login');
  };

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.slide}>
        {/* Visual Content */}
        <View style={styles.visualContainer}>
          {index === 0 && (
            <View style={styles.imageWrap}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop' }}
                style={styles.slideImage}
              />
              <View style={styles.badgeTopRight}>
                <MaterialIcons name="workspace-premium" size={18} color="#0D9488" />
                <Text style={styles.badgeText}>{t('onboarding.verifiedPros')}</Text>
              </View>
            </View>
          )}

          {index === 1 && (
            <View style={styles.imageWrap}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?q=80&w=800&auto=format&fit=crop' }}
                style={styles.slideImageDark}
              />
              <View style={styles.badgeTopLeft}>
                <MaterialIcons name="verified" size={18} color="#0D9488" />
                <Text style={styles.badgeText}>{t('onboarding.trustedPro')}</Text>
              </View>
              <View style={styles.badgeBottomRight}>
                <View style={styles.starCircle}>
                  <MaterialIcons name="star" size={20} color="#0D9488" />
                </View>
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.ratingTitle}>{t('onboarding.rating')}</Text>
                  <Text style={styles.ratingSub}>{t('onboarding.verifiedExpert')}</Text>
                </View>
              </View>
            </View>
          )}

          {index === 2 && (
            <View style={styles.imageWrap}>
              <Image
                source={require('../../../assets/gettingstarted/agree.png')}
                style={styles.directServiceImage}
                resizeMode="cover"
              />
              <View style={styles.connectionCard}>
                <View style={styles.premiumMark}><Text style={styles.premiumMarkText}>FIXAM</Text></View>
                <Text style={styles.connectionTitle}>{t('onboarding.directService')}</Text>
                <View style={styles.flowRow}>
                  <View style={styles.flowStep}><Text style={styles.flowText}>1</Text></View>
                  <View style={styles.flowLine} />
                  <View style={styles.flowStep}><Text style={styles.flowText}>2</Text></View>
                  <View style={styles.flowLine} />
                  <View style={styles.flowStep}><Text style={styles.flowText}>3</Text></View>
                </View>
              </View>

              <View style={styles.slide3OverlayRow}>
                <View style={styles.slide3MiniCard}>
                  <MaterialIcons name="verified-user" size={16} color="#0D9488" />
                  <Text style={styles.slide3MiniText}>{t('onboarding.verifiedProfiles')}</Text>
                </View>
                <View style={styles.slide3MiniCard}>
                  <MaterialIcons name="payments" size={16} color="#0D9488" />
                  <Text style={styles.slide3MiniText}>{t('onboarding.cashOnDelivery')}</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Text Content */}
        <View style={styles.textContent}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitleFr}>{item.subtitleFr}</Text>
          <Text style={styles.desc}>{item.desc}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />

      {/* Header */}
      <View style={styles.header}>
        {currentIndex === 0 ? (
          <Text style={styles.headerLogo}>Fixam</Text>
        ) : (
          <TouchableOpacity onPress={() => flatListRef.current?.scrollToIndex({ index: currentIndex - 1 })}>
            <MaterialIcons name="arrow-back" size={24} color="#0F172A" />
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>{t('onboarding.skip')}</Text>
        </TouchableOpacity>
      </View>

      {/* FlatList for Swiping */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfig}
        bounces={false}
      />

      {/* Bottom Area */}
      <View style={styles.bottomArea}>
        {/* Dots */}
        <View style={styles.dotsRow}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, currentIndex === i && styles.dotActive]} />
          ))}
        </View>

        {/* Next / Get Started Button */}
        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextBtnText}>{currentIndex === 2 ? t('onboarding.getStarted') : t('onboarding.next')}</Text>
          <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingTop: 20, paddingBottom: 10,
    height: 60,
  },
  headerLogo: { fontSize: 22, fontWeight: '800', color: '#0F172A' },
  skipText: { fontSize: 16, fontWeight: '600', color: '#4B5563' },
  langHeader: { fontSize: 14, fontWeight: '600', color: '#475569' },

  slide: { width, alignItems: 'center' },
  
  visualContainer: { width: '100%', alignItems: 'center', marginTop: 10 },
  
  imageWrap: {
    width: width - 60, height: 340,
    backgroundColor: '#EEF2FB', borderRadius: 24,
    position: 'relative',
  },
  slideImage: { width: '100%', height: '100%', borderRadius: 24 },
  slideImageDark: { width: '100%', height: '100%', borderRadius: 24 },

  badgeTopRight: {
    position: 'absolute', top: 20, right: -15,
    backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5,
  },
  badgeTopLeft: {
    position: 'absolute', top: 20, left: -15,
    backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5,
  },
  badgeBottomRight: {
    position: 'absolute', bottom: -20, right: -10,
    backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5,
  },
  badgeText: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginLeft: 6 },
  starCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFF7ED', justifyContent: 'center', alignItems: 'center' },
  ratingTitle: { fontSize: 13, fontWeight: '800', color: '#0F172A' },
  ratingSub: { fontSize: 10, color: '#475569', marginTop: 2 },

  slide3Visual: { width: width - 60, height: 340, justifyContent: 'center' },
  directServiceImage: { width: '100%', height: '100%', borderRadius: 24 },
  connectionCard: {
    position: 'absolute', left: 18, right: 18, bottom: 22,
    backgroundColor: 'rgba(255,255,255,0.94)', borderRadius: 16, paddingVertical: 18, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
    borderWidth: 1, borderColor: '#F1F5F9',
  },
  premiumMark: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999, backgroundColor: '#0D1B2A', marginBottom: 10 },
  premiumMarkText: { color: '#FFF', fontSize: 10, fontWeight: '900', letterSpacing: 1.4 },
  connectionTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 14 },
  flowRow: { flexDirection: 'row', alignItems: 'center' },
  flowStep: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#0D9488', justifyContent: 'center', alignItems: 'center' },
  flowText: { color: '#FFF', fontSize: 13, fontWeight: '900' },
  flowLine: { width: 34, height: 2, backgroundColor: '#BDD6FF' },
  slide3OverlayRow: { position: 'absolute', top: 18, left: 14, right: 14, flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  slide3MiniCard: { flex: 1, minHeight: 44, backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 12, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', gap: 6 },
  slide3MiniText: { flex: 1, color: '#0F172A', fontSize: 11, fontWeight: '800' },
  s3CardsRow: { flexDirection: 'row', gap: 16 },
  s3DarkCard: { flex: 1, backgroundColor: '#0F172A', borderRadius: 16, padding: 18, gap: 10 },
  s3DarkCardText: { color: '#FFF', fontSize: 15, fontWeight: '600' },
  premiumBadge: { alignSelf: 'flex-start', color: '#9CC3FF', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  s3LightCard: { flex: 1, backgroundColor: '#DCE8F9', borderRadius: 16, padding: 18, gap: 10 },
  s3LightCardText: { color: '#0F172A', fontSize: 15, fontWeight: '600' },
  cashBadge: { alignSelf: 'flex-start', color: '#0F172A', fontSize: 10, fontWeight: '900', letterSpacing: 1 },

  textContent: { alignItems: 'center', marginTop: 40, paddingHorizontal: 20 },
  title: { fontSize: 28, fontWeight: '800', color: '#0F172A', textAlign: 'center', marginBottom: 6 },
  subtitleFr: { fontSize: 18, fontWeight: '600', color: '#8F9BB3', textAlign: 'center', marginBottom: 16 },
  desc: { fontSize: 15, color: '#4B5563', textAlign: 'center', lineHeight: 24, paddingHorizontal: 10 },

  bottomArea: { paddingHorizontal: 30, paddingBottom: 40, alignItems: 'center' },
  dotsRow: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#D1D5DB' },
  dotActive: { width: 24, backgroundColor: '#0D9488' },
  nextBtn: { backgroundColor: '#0D9488', width: '100%', paddingVertical: 18, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  nextBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  
  langPillContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 24 },
  langLabel: { fontSize: 13, fontWeight: '600', color: '#4B5563', marginRight: 10 },
  langPill: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6, backgroundColor: '#FFF' },
  langPillText: { fontSize: 12, fontWeight: '700', color: '#0F172A' },
});

export default OnboardingScreen;
