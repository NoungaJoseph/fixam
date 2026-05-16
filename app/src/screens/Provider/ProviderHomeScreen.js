import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, ScrollView,
  TextInput, StatusBar, FlatList, Platform, Modal, Image, Dimensions
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import FirstRunNotice from '../../components/Common/FirstRunNotice';
import { CustomHeader } from '../../navigation/NavigationComponents';

const ProviderHomeScreen = ({ navigation }) => {
  const {
    isProviderOnline,
    updateProviderStatus,
    walletBalance,
    visibleJobs,
    favoriteJobs,
    favoriteJobIds,
    hideJob,
    toggleFavoriteJob
  } = useAppContext();
  const { user } = useAuth();
  const { colors, isDarkMode } = useTheme();
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [filters, setFilters] = useState({ distance: 10, sortBy: 'newest' });
  const carouselRef = useRef(null);
  const carouselIndexRef = useRef(0);
  const carouselImages = [
    require('../../../assets/onboarding/direct_local_service.png'),
    require('../../../assets/onboarding/verification.png'),
    require('../../../assets/onboarding/p1.png'),
    require('../../../assets/onboarding/c1.png'),
    require('../../../assets/onboarding/c2.png'),
  ];

  const sourceJobs = showFavorites ? favoriteJobs : visibleJobs;
  const filteredJobs = sourceJobs.filter(job =>
    job.title?.toLowerCase().includes(search.toLowerCase()) ||
    job.category?.toLowerCase().includes(search.toLowerCase()) ||
    job.location?.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const timer = setInterval(() => {
      carouselIndexRef.current = (carouselIndexRef.current + 1) % carouselImages.length;
      carouselRef.current?.scrollTo({ x: carouselIndexRef.current * (slideWidth + 12), animated: true });
    }, 3000);
    return () => clearInterval(timer);
  }, [carouselImages.length]);

  const getPostedAgo = (dateValue) => {
    const created = new Date(dateValue);
    if (!dateValue || Number.isNaN(created.getTime())) return 'Posted recently';
    const hours = Math.max(1, Math.floor((Date.now() - created.getTime()) / 3600000));
    if (hours < 24) return `Posted ${hours} hour${hours === 1 ? '' : 's'} ago`;
    const days = Math.floor(hours / 24);
    return `Posted ${days} day${days === 1 ? '' : 's'} ago`;
  };

  const renderJobItem = ({ item }) => {
    const proposalCount = item.assignments?.length || 0;
    const tags = [item.category, ...(item.description || '').split(' ').filter(word => word.length > 5)].filter(Boolean).slice(0, 3);
    const isFavorite = favoriteJobIds.includes(item.id);

    return (
      <TouchableOpacity
        style={[styles.taskRow, { borderBottomColor: colors.border }]}
        onPress={() => navigation.navigate('TaskDetails', { task: item })}
        activeOpacity={0.86}
      >
        <View style={styles.metaLine}>
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>{getPostedAgo(item.createdAt)}</Text>
          <Text style={[styles.metaDot, { color: colors.textSecondary }]}>.</Text>
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>Proposals: {proposalCount}</Text>
        </View>

        <View style={styles.titleLine}>
          <Text style={[styles.jobTitle, { color: colors.text }]} numberOfLines={2}>{item.title}</Text>
          <View style={styles.iconActions}>
            <TouchableOpacity onPress={(event) => { event.stopPropagation?.(); hideJob(item.id); }}>
              <MaterialCommunityIcons name="thumb-down-outline" size={24} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={(event) => { event.stopPropagation?.(); toggleFavoriteJob(item.id); }}>
              <MaterialCommunityIcons name={isFavorite ? 'heart' : 'heart-outline'} size={25} color={isFavorite ? colors.accent : colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[styles.terms, { color: colors.textSecondary }]}>
          Fixed-price - {item.category || 'General'} - Est. Budget: {Number(item.budget || 0).toLocaleString()} FCFA
        </Text>

        <Text style={[styles.description, { color: colors.text }]} numberOfLines={3}>
          {item.description || 'No description provided yet.'}
        </Text>
        <Text style={[styles.moreLink, { color: colors.accent }]}>more</Text>

        <View style={styles.tags}>
          {tags.map((tag, index) => (
            <View key={`${tag}-${index}`} style={[styles.tag, { backgroundColor: isDarkMode ? '#303030' : '#EEF2F7' }]}>
              <Text style={[styles.tagText, { color: colors.textSecondary }]} numberOfLines={1}>{tag}</Text>
            </View>
          ))}
        </View>

        <View style={styles.trustRow}>
          <Text style={[styles.smallText, { color: colors.textSecondary }]}>0 reviews</Text>
          <Text style={[styles.smallText, { color: colors.textSecondary }]}>0 spent</Text>
        </View>

        <View style={styles.locationRow}>
          <View style={styles.trustItem}>
            <MaterialCommunityIcons name="map-marker-outline" size={17} color={colors.textSecondary} />
            <Text style={[styles.locationText, { color: colors.textSecondary }]} numberOfLines={1}>{item.location || 'On-site'}</Text>
          </View>
          <TouchableOpacity style={[styles.applyButton, { backgroundColor: colors.accent }]} onPress={() => navigation.navigate('TaskDetails', { task: item })}>
            <Text style={styles.applyText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      <CustomHeader navigation={navigation} title="Dashboard" colors={colors} />
      <FirstRunNotice role={user?.role} colors={colors} isDarkMode={isDarkMode} />

      <ScrollView stickyHeaderIndices={[3]} showsVerticalScrollIndicator={false}>
        <View style={styles.topSection}>
          <View style={[styles.statusStrip, { backgroundColor: isDarkMode ? '#151515' : '#F7F9FB' }]}>
            <View>
              <Text style={[styles.statusLabel, { color: colors.textSecondary }]}>SERVICE STATUS</Text>
              <Text style={[styles.statusValue, { color: isProviderOnline ? '#12A800' : '#EF4444' }]}>
                {isProviderOnline ? 'Online and available' : 'Currently offline'}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.toggleBase, isProviderOnline ? styles.toggleOn : styles.toggleOff]}
              onPress={() => updateProviderStatus(!isProviderOnline)}
            >
              <View style={[styles.toggleCircle, isProviderOnline ? styles.circleRight : styles.circleLeft]} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.walletPanel}>
          <View>
            <Text style={[styles.walletLabel, { color: colors.textSecondary }]}>Coin balance</Text>
            <Text style={[styles.walletText, { color: colors.text }]}>{walletBalance} Coins</Text>
          </View>
          <TouchableOpacity style={[styles.walletAction, { backgroundColor: colors.accent }]} onPress={() => navigation.getParent()?.getParent()?.navigate('Wallet', { screen: 'CoinSystem' })}>
            <Text style={styles.walletActionText}>Top up</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.carouselBlock}>
          <View style={styles.carouselHeader}>
            <Text style={[styles.carouselTitle, { color: colors.text }]}>Learn Fixam</Text>
            <Text style={[styles.carouselHint, { color: colors.textSecondary }]}>Swipe tips</Text>
          </View>
          <ScrollView ref={carouselRef} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carouselTrack} snapToInterval={slideWidth + 12} decelerationRate="fast">
            {carouselImages.map((image, index) => (
              <View key={index} style={[styles.carouselSlide, { backgroundColor: isDarkMode ? '#171717' : '#F5F7FA' }]}>
                <Image source={image} style={styles.carouselImage} resizeMode="cover" />
                <View style={styles.carouselCopy}>
                  <Text style={[styles.carouselCopyTitle, { color: colors.text }]}>Tip {index + 1}</Text>
                  <Text style={[styles.carouselCopyText, { color: colors.textSecondary }]}>Use clear task details, chat safely, and keep enough coins before applying.</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={[styles.searchSection, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
          <View style={[styles.searchBar, { backgroundColor: isDarkMode ? '#171717' : '#F5F5F5' }]}>
            <MaterialCommunityIcons name="magnify" size={22} color={colors.placeholder} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search jobs"
              placeholderTextColor={colors.placeholder}
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilters(true)}>
            <MaterialCommunityIcons name="tune-variant" size={24} color={colors.accent} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.favoriteStrip, { borderBottomColor: colors.border }]}
          onPress={() => setShowFavorites((value) => !value)}
        >
          <View style={styles.trustItem}>
            <MaterialCommunityIcons name={showFavorites ? 'heart' : 'heart-outline'} size={22} color={colors.accent} />
            <Text style={[styles.favoriteText, { color: colors.text }]}>{showFavorites ? 'Showing favorite jobs' : 'Favorite jobs'}</Text>
          </View>
          <Text style={[styles.favoriteCount, { color: colors.textSecondary }]}>{favoriteJobs.length}</Text>
        </TouchableOpacity>

        <FlatList
          data={filteredJobs}
          renderItem={renderJobItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="clipboard-text-outline" size={60} color={colors.border} />
              <Text style={[styles.emptyText, { color: colors.placeholder }]}>{showFavorites ? 'No favorite jobs yet' : 'No jobs available nearby'}</Text>
            </View>
          }
        />
      </ScrollView>

      <Modal visible={showFilters} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Job filters</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <MaterialCommunityIcons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.filterLabel, { color: colors.text }]}>Max distance: {filters.distance} km</Text>
            <View style={styles.filterOptions}>
              {[2, 5, 10, 25].map(d => (
                <TouchableOpacity
                  key={d}
                  style={[styles.filterChip, { backgroundColor: filters.distance === d ? colors.accent : colors.background }]}
                  onPress={() => setFilters({ ...filters, distance: d })}
                >
                  <Text style={{ color: filters.distance === d ? '#FFF' : colors.text }}>{d}km</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.filterLabel, { color: colors.text, marginTop: 20 }]}>Sort by</Text>
            <View style={styles.filterOptions}>
              {['newest', 'closest', 'highest budget'].map(s => (
                <TouchableOpacity
                  key={s}
                  style={[styles.filterChip, { backgroundColor: filters.sortBy === s ? colors.accent : colors.background }]}
                  onPress={() => setFilters({ ...filters, sortBy: s })}
                >
                  <Text style={{ color: filters.sortBy === s ? '#FFF' : colors.text }}>{s.charAt(0).toUpperCase() + s.slice(1)}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={[styles.applyFilters, { backgroundColor: colors.accent }]} onPress={() => setShowFilters(false)}>
              <Text style={styles.applyFiltersText}>Apply filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const slideWidth = Dimensions.get('window').width - 64;

const styles = StyleSheet.create({
  container: { flex: 1 },
  topSection: { paddingHorizontal: 22, paddingVertical: 10 },
  statusStrip: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderRadius: 10 },
  statusLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  statusValue: { fontSize: 15, fontWeight: '800', marginTop: 3 },
  toggleBase: { width: 48, height: 26, borderRadius: 13, padding: 3 },
  toggleOn: { backgroundColor: '#12A800' },
  toggleOff: { backgroundColor: '#CBD5E1' },
  toggleCircle: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#FFF' },
  circleLeft: { alignSelf: 'flex-start' },
  circleRight: { alignSelf: 'flex-end' },
  walletPanel: { marginHorizontal: 22, marginBottom: 18, paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'rgba(148, 163, 184, 0.24)' },
  walletLabel: { fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
  walletText: { fontSize: 21, fontWeight: '900', marginTop: 2 },
  walletAction: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 999 },
  walletActionText: { color: '#FFF', fontSize: 14, fontWeight: '900' },
  carouselBlock: { marginBottom: 18 },
  carouselHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 22, marginBottom: 10 },
  carouselTitle: { fontSize: 18, fontWeight: '900' },
  carouselHint: { fontSize: 12, fontWeight: '800' },
  carouselTrack: { paddingHorizontal: 22, gap: 12 },
  carouselSlide: { width: slideWidth, height: 160, borderRadius: 10, overflow: 'hidden' },
  carouselImage: { width: '100%', height: '100%', position: 'absolute' },
  carouselCopy: { flex: 1, justifyContent: 'flex-end', padding: 16, backgroundColor: 'rgba(0,0,0,0.32)' },
  carouselCopyTitle: { fontSize: 18, fontWeight: '900', color: '#FFF' },
  carouselCopyText: { fontSize: 13, lineHeight: 18, marginTop: 4, color: 'rgba(255,255,255,0.86)' },
  searchSection: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 22, paddingVertical: 12, borderBottomWidth: 1 },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 12, paddingHorizontal: 14, height: 48 },
  searchInput: { flex: 1, fontSize: 15, fontWeight: Platform.OS === 'ios' ? '600' : 'normal' },
  filterButton: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  favoriteStrip: { paddingHorizontal: 22, paddingVertical: 14, borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  favoriteText: { fontSize: 16, fontWeight: '900' },
  favoriteCount: { fontSize: 14, fontWeight: '900' },
  listContent: { paddingHorizontal: 22, paddingBottom: 100 },
  taskRow: { paddingVertical: 20, borderBottomWidth: 1 },
  metaLine: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' },
  metaText: { fontSize: 13, fontWeight: '700' },
  metaDot: { fontSize: 18, lineHeight: 18, fontWeight: '900' },
  titleLine: { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  jobTitle: { flex: 1, fontSize: 22, fontWeight: '800', lineHeight: 27, marginBottom: 12 },
  iconActions: { flexDirection: 'row', gap: 18, paddingTop: 3 },
  terms: { fontSize: 14, lineHeight: 21, fontWeight: '600', marginBottom: 18 },
  description: { fontSize: 16, lineHeight: 24 },
  moreLink: { fontSize: 16, fontWeight: '800', textDecorationLine: 'underline', marginBottom: 18 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
  tag: { maxWidth: 170, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999 },
  tagText: { fontSize: 13, fontWeight: '800' },
  trustRow: { flexDirection: 'row', alignItems: 'center', gap: 18, flexWrap: 'wrap', marginBottom: 16 },
  trustItem: { flexDirection: 'row', alignItems: 'center', gap: 6, flexShrink: 1 },
  smallText: { fontSize: 13, fontWeight: '700' },
  locationRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  locationText: { maxWidth: 210, fontSize: 14, fontWeight: '700' },
  applyButton: { paddingHorizontal: 20, paddingVertical: 11, borderRadius: 999 },
  applyText: { color: '#FFF', fontSize: 14, fontWeight: '900' },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  emptyText: { marginTop: 15, fontSize: 15, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: 25, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  modalTitle: { fontSize: 20, fontWeight: '900' },
  filterLabel: { fontSize: 15, fontWeight: '800', marginBottom: 12 },
  filterOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999 },
  applyFilters: { marginTop: 40, height: 56, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  applyFiltersText: { color: '#FFF', fontSize: 16, fontWeight: '900' },
});

export default ProviderHomeScreen;
