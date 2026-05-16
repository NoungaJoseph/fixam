import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, ScrollView,
  TextInput, Image, StatusBar, Dimensions, FlatList, Platform, Modal, RefreshControl
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import FirstRunNotice from '../../components/Common/FirstRunNotice';
import { LinearGradient } from 'expo-linear-gradient';
import { CustomHeader } from '../../navigation/NavigationComponents';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: '1', name: 'Electrician', icon: 'lightning-bolt' },
  { id: '2', name: 'Plumber', icon: 'pipe-wrench' },
  { id: '3', name: 'Cleaning', icon: 'broom' },
  { id: '4', name: 'Beauty', icon: 'content-cut' },
  { id: '5', name: 'Babysitting', icon: 'baby-face-outline' },
  { id: '6', name: 'Carpenter', icon: 'saw-blade' },
  { id: '7', name: 'Painter', icon: 'format-paint' },
  { id: '8', name: 'Landscaping', icon: 'flower-outline' },
];

const HomeScreen = ({ navigation }) => {
  const { providers, fetchAppData } = useAppContext();
  const { user } = useAuth();
  const { colors, isDarkMode } = useTheme();
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const carouselRef = useRef(null);
  const carouselIndexRef = useRef(0);
  const carouselImages = [
    require('../../../assets/onboarding/direct_local_service.png'),
    require('../../../assets/onboarding/verification.png'),
    require('../../../assets/onboarding/p1.png'),
    require('../../../assets/onboarding/c1.png'),
    require('../../../assets/onboarding/c2.png'),
  ];
  const [filters, setFilters] = useState({
    distance: 10,
    rating: 4.0,
    priceRange: 'all'
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchAppData(), fetchProviders()]);
    setRefreshing(false);
  };

  const getProviderDistance = (provider) => {
    const rawDistance = provider.distanceKm ?? provider.distance ?? provider.distanceInKm;
    const parsedDistance = Number(rawDistance);
    return Number.isFinite(parsedDistance) ? parsedDistance : null;
  };

  const filteredProviders = providers.filter(p => {
    const searchLower = search.trim().toLowerCase();

    const name = (p.user?.fullName || '').toLowerCase();
    const skills = (p.skills || []).join(' ').toLowerCase();
    const area = (p.serviceArea || '').toLowerCase();
    const combinedInfo = `${name} ${skills} ${area}`;

    // Broad search: must contain the category if active
    if (activeCat && !skills.includes(activeCat.toLowerCase())) return false;

    // Search terms check (must contain every word from the search bar)
    const searchTerms = searchLower.split(/\s+/).filter(t => t.length > 0);
    const matchesSearch = searchTerms.every(term => combinedInfo.includes(term));
    if (!matchesSearch) return false;

    if (filtersApplied) {
      const rating = Number(p.rating || 0);
      if (rating < filters.rating) return false;

      const distance = getProviderDistance(p);
      if (distance !== null && distance > filters.distance) return false;
    }

    return true;
  });

  const clearSearchAndFilters = () => {
    setActiveCat(null);
    setSearch('');
    setFiltersApplied(false);
    setFilters({ distance: 10, rating: 4.0, priceRange: 'all' });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      carouselIndexRef.current = (carouselIndexRef.current + 1) % carouselImages.length;
      carouselRef.current?.scrollTo({ x: carouselIndexRef.current * (width - 28), animated: true });
    }, 3000);
    return () => clearInterval(timer);
  }, [carouselImages.length]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      <CustomHeader navigation={navigation} title="Home" colors={colors} />
      <FirstRunNotice role={user?.role} colors={colors} isDarkMode={isDarkMode} />

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.accent]} tintColor={colors.accent} />
        }
      >

        {/* ── Search Bar ─────────────────────── */}
        <View style={styles.searchSection}>
          <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <MaterialCommunityIcons name="magnify" size={22} color={colors.placeholder} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search services or professionals..."
              placeholderTextColor={colors.placeholder}
              value={search}
              onChangeText={setSearch}
              returnKeyType="search"
              onSubmitEditing={() => {
                if (search.trim()) navigation.navigate('ProviderList', { search });
              }}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <MaterialCommunityIcons name="close-circle" size={18} color={colors.placeholder} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={[
              styles.filterBtn,
              { backgroundColor: colors.card, borderColor: colors.border }
            ]}
            onPress={() => setShowFilters(true)}
          >
            <MaterialCommunityIcons name="tune-variant" size={20} color={colors.text} />
            {filtersApplied && <View style={[styles.filterDot, { backgroundColor: colors.accent }]} />}
          </TouchableOpacity>
        </View>

        {/* Post Task CTA */}
        <TouchableOpacity
          style={[styles.postTaskCard, { backgroundColor: isDarkMode ? colors.surface : colors.primary }]}
          onPress={() => navigation.navigate('Tasks', { screen: 'PostTask' })}
        >
          <View style={styles.postTaskContent}>
            <Text style={styles.postTaskTitle}>What do you need done?</Text>
            <Text style={[styles.postTaskSubtitle, { color: isDarkMode ? colors.textSecondary : 'rgba(255,255,255,0.7)' }]}>
              Post a task and get offers within minutes
            </Text>
            <View style={[styles.postBtn, { backgroundColor: colors.accent }]}>
              <Text style={styles.postBtnText}>Post a Task</Text>
              <MaterialCommunityIcons name="plus" size={20} color="#FFF" />
            </View>
          </View>
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3063/3063822.png' }}
            style={styles.postTaskImg}
          />
        </TouchableOpacity>

        <View style={styles.carouselBlock}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Learn Fixam</Text>
            <Text style={[styles.viewAll, { color: colors.textSecondary }]}>Swipe tips</Text>
          </View>
          <ScrollView ref={carouselRef} horizontal showsHorizontalScrollIndicator={false} snapToInterval={width - 28} decelerationRate="fast" contentContainerStyle={styles.carouselTrack}>
            {carouselImages.map((image, index) => (
              <View key={index} style={[styles.carouselSlide, { backgroundColor: isDarkMode ? '#171717' : '#F5F7FA' }]}>
                <Image source={image} style={styles.carouselImage} resizeMode="cover" />
                <View style={styles.carouselCopy}>
                  <Text style={styles.carouselCopyTitle}>Tip {index + 1}</Text>
                  <Text style={styles.carouselCopyText}>Post clear details, compare providers, chat safely, and track work from the task page.</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>



        {/* ── Recommended Provider ─────────── */}
        {providers.length > 0 && !search && !activeCat && (() => {
          const recommended = providers.find(p => p.user?.fullName?.includes('Emma')) || providers[0];
          if (!recommended) return null;
          return (
            <View style={styles.recommendedSection}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Recommended Professional</Text>
                <View style={[styles.promotedBadge, { backgroundColor: colors.accent }]}>
                  <Text style={styles.promotedText}>PROMOTED</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={[styles.recommendedCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => navigation.navigate('ProviderProfile', { provider: recommended })}
              >
                <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']} style={styles.recommendedGradient} />
                <Image 
                  source={recommended.user?.avatar ? { uri: recommended.user.avatar } : { uri: `https://ui-avatars.com/api/?name=${recommended.user?.fullName || 'User'}&background=random` }} 
                  style={styles.recommendedImg} 
                />
                <View style={styles.recommendedInfo}>
                  <Text style={styles.recommendedName}>{recommended.user?.fullName || 'Professional'}</Text>
                  <View style={styles.recommendedMeta}>
                    <View style={styles.recBadge}>
                      <MaterialCommunityIcons name="star" size={14} color="#FBBF24" />
                      <Text style={styles.recBadgeText}>{recommended.rating || '0.0'}</Text>
                    </View>
                    <View style={styles.recBadge}>
                      <MaterialCommunityIcons name="briefcase-outline" size={14} color="#FFF" />
                      <Text style={styles.recBadgeText}>{recommended.skills?.[0] || 'Expert'}</Text>
                    </View>
                    <View style={styles.recBadge}>
                      <MaterialCommunityIcons name="map-marker-outline" size={14} color="#FFF" />
                      <Text style={styles.recBadgeText}>{recommended.serviceArea || 'Nearby'}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          );
        })()}

        {/* ── Category Filter Chips ──────────── */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Categories</Text>
          <TouchableOpacity onPress={() => { clearSearchAndFilters(); navigation.navigate('ProviderList'); }}>
            <Text style={[styles.viewAll, { color: colors.accent }]}>View All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catChipsScroll}>
          {CATEGORIES.map(cat => {
            const isActive = activeCat === cat.name;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.catChip,
                  {
                    backgroundColor: isActive ? colors.accent : colors.card,
                    borderColor: isActive ? colors.accent : colors.border,
                  }
                ]}
                onPress={() => {
                  setActiveCat(isActive ? null : cat.name);
                }}
              >
                <View style={[styles.catChipIcon, { backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : colors.background }]}>
                  <MaterialCommunityIcons name={cat.icon} size={18} color={isActive ? '#FFF' : colors.accent} />
                </View>
                <Text style={[styles.catChipText, { color: isActive ? '#FFF' : colors.text }]}>{cat.name}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── Nearby Providers ──────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {activeCat ? `${activeCat} Pros` : search ? 'Search Results' : 'Nearby Professionals'}
          </Text>
          {(activeCat || search || filtersApplied) && (
            <TouchableOpacity onPress={clearSearchAndFilters}>
              <Text style={[styles.viewAll, { color: colors.accent }]}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>

        {filteredProviders.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="account-search-outline" size={60} color={colors.placeholder} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No results found</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>Try a different search or category</Text>
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.providersScroll}
          >
            {filteredProviders.map(p => (
              <TouchableOpacity
                key={p.id}
                style={[styles.providerCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => navigation.navigate('ProviderProfile', { provider: p })}
              >
                <View style={{ position: 'relative' }}>
                  <Image
                    source={p.user?.avatar ? { uri: p.user.avatar } : { uri: `https://ui-avatars.com/api/?name=${p.user?.fullName || 'User'}&background=random` }}
                    style={styles.providerImg}
                  />
                  {p.verification === 'VERIFIED' && (
                    <View style={styles.verifiedBadgeCard}>
                      <MaterialCommunityIcons name="check-decagram" size={16} color="#10B981" />
                    </View>
                  )}
                </View>
                <View style={[styles.ratingBadge, { backgroundColor: colors.card }]}>
                  <MaterialCommunityIcons name="star" size={12} color="#FBBF24" />
                  <Text style={[styles.ratingText, { color: colors.text }]}>{p.rating || '0.0'}</Text>
                </View>
                <View style={styles.providerInfo}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Text style={[styles.providerName, { color: colors.text }]} numberOfLines={1}>{p.user?.fullName || 'No Name'}</Text>
                  </View>
                  <Text style={[styles.providerSkill, { color: colors.textSecondary }]}>
                    {p.skills && p.skills.length > 0 ? p.skills[0] : 'Professional'}
                  </Text>
                  <View style={styles.distanceRow}>
                    <MaterialCommunityIcons name="map-marker" size={12} color={colors.placeholder} />
                    <Text style={[styles.distanceText, { color: colors.placeholder }]}>{p.serviceArea || 'Nearby'}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

      </ScrollView>

      {/* Filter Modal */}
      <Modal visible={showFilters} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Search Filters</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <MaterialCommunityIcons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.filterLabel, { color: colors.text }]}>Max Distance: {filters.distance} km</Text>
            <View style={styles.filterOptions}>
              {[5, 10, 20, 50].map(d => (
                <TouchableOpacity 
                  key={d} 
                  style={[styles.filterChip, { backgroundColor: filters.distance === d ? colors.accent : colors.background }]}
                  onPress={() => setFilters({...filters, distance: d})}
                >
                  <Text style={{ color: filters.distance === d ? '#FFF' : colors.text }}>{d}km</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.filterLabel, { color: colors.text, marginTop: 20 }]}>Minimum Rating: {filters.rating}+</Text>
            <View style={styles.filterOptions}>
              {[3.5, 4.0, 4.5, 4.8].map(r => (
                <TouchableOpacity 
                  key={r} 
                  style={[styles.filterChip, { backgroundColor: filters.rating === r ? colors.accent : colors.background }]}
                  onPress={() => setFilters({...filters, rating: r})}
                >
                  <Text style={{ color: filters.rating === r ? '#FFF' : colors.text }}>{r}★</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity 
              style={[styles.applyBtn, { backgroundColor: colors.accent }]}
              onPress={() => {
                setFiltersApplied(true);
                setShowFilters(false);
              }}
            >
              <Text style={styles.applyBtnText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  searchSection: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  searchBar: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 14, height: 50, borderRadius: 16, borderWidth: 1,
  },
  searchInput: { 
    flex: 1, 
    fontSize: 15, 
    fontWeight: Platform.OS === 'ios' ? '500' : 'normal',
    textAlignVertical: 'center',
    paddingVertical: 0,
  },
  filterBtn: { width: 50, height: 50, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  filterDot: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4 },
  postTaskCard: {
    margin: 20, borderRadius: 25, padding: 25,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5,
  },
  postTaskContent: { flex: 1 },
  postTaskTitle: { color: '#FFF', fontSize: 18, fontWeight: Platform.OS === 'ios' ? '800' : 'bold', marginBottom: 5 },
  postTaskSubtitle: { fontSize: 12, marginBottom: 15 },
  postBtn: { alignSelf: 'flex-start', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 6 },
  postBtnText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  postTaskImg: { width: 80, height: 80 },
  carouselBlock: { marginBottom: 20 },
  carouselTrack: { paddingHorizontal: 20, gap: 8 },
  carouselSlide: { width: width - 36, height: 156, borderRadius: 8, overflow: 'hidden' },
  carouselImage: { width: '100%', height: '100%', position: 'absolute' },
  carouselCopy: { flex: 1, justifyContent: 'flex-end', padding: 16, backgroundColor: 'rgba(0,0,0,0.32)' },
  carouselCopyTitle: { fontSize: 18, color: '#FFF', fontWeight: '900' },
  carouselCopyText: { fontSize: 13, color: 'rgba(255,255,255,0.86)', lineHeight: 18, marginTop: 4 },
  recommendedSection: { marginBottom: 25 },
  recommendedCard: { marginHorizontal: 20, height: 180, borderRadius: 25, overflow: 'hidden', borderWidth: 1 },
  recommendedImg: { width: '100%', height: '100%' },
  recommendedGradient: { ...StyleSheet.absoluteFillObject, zIndex: 1 },
  recommendedInfo: { position: 'absolute', bottom: 20, left: 20, zIndex: 2 },
  recommendedName: { color: '#FFF', fontSize: 20, fontWeight: '900' },
  recommendedMeta: { flexDirection: 'row', gap: 10, marginTop: 8 },
  recBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  recBadgeText: { color: '#FFF', fontSize: 11, fontWeight: '700' },
  promotedBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginLeft: 10 },
  promotedText: { color: '#FFF', fontSize: 9, fontWeight: '900' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 10, marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '800' },
  viewAll: { fontSize: 14, fontWeight: '700' },
  catChipsScroll: { paddingLeft: 20, paddingRight: 10, paddingBottom: 16, gap: 10 },
  catChip: {
    flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10, paddingHorizontal: 14,
    borderRadius: 30, borderWidth: 1,
  },
  catChipIcon: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  catChipText: { 
    fontSize: 13, 
    fontWeight: Platform.OS === 'ios' ? '700' : 'bold',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  providersScroll: { paddingLeft: 20, paddingRight: 10 },
  providerCard: { width: 160, borderRadius: 20, marginRight: 15, padding: 10, borderWidth: 1 },
  providerImg: { width: '100%', height: 110, borderRadius: 15, backgroundColor: '#F3F4F6' },
  verifiedBadgeCard: { position: 'absolute', bottom: 6, right: 6, backgroundColor: '#FFF', borderRadius: 10, padding: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  ratingBadge: { position: 'absolute', top: 18, right: 18, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  ratingText: { fontSize: 11, fontWeight: '800' },
  providerInfo: { marginTop: 10, paddingHorizontal: 5 },
  providerName: { 
    fontSize: 14, 
    fontWeight: Platform.OS === 'ios' ? '800' : 'bold',
    includeFontPadding: false,
  },
  providerSkill: { fontSize: 11, marginTop: 2 },
  distanceRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  distanceText: { fontSize: 10, fontWeight: '500' },
  emptyState: { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 20 },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginTop: 12 },
  emptySubtitle: { fontSize: 14, marginTop: 6, textAlign: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  modalTitle: { fontSize: 20, fontWeight: '900' },
  filterLabel: { fontSize: 15, fontWeight: '800', marginBottom: 12 },
  filterOptions: { flexDirection: 'row', gap: 10 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  applyBtn: { marginTop: 40, height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  applyBtnText: { color: '#FFF', fontSize: 16, fontWeight: '900' },
});

export default HomeScreen;
