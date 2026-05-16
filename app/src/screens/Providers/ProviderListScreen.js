import React, { useState } from 'react';
import {
  StyleSheet, View, Text, TextInput, TouchableOpacity,
  FlatList, Image, StatusBar, ScrollView, SafeAreaView
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppContext } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

const FILTERS = ['Rating', 'Price', 'Distance', 'Availability'];

const ProviderListScreen = ({ route, navigation }) => {
  const { colors, isDarkMode } = useTheme();
  const { providers } = useAppContext();
  const category = route.params?.category;
  const [search, setSearch] = useState(route.params?.search || '');
  const [activeFilter, setActiveFilter] = useState('Rating');

  React.useLayoutEffect(() => {
    const parent = navigation.getParent();
    if (parent) {
      parent.setOptions({ tabBarStyle: { display: 'none' } });
    }
    return () => {
      if (parent) {
        parent.setOptions({
          tabBarStyle: {
            display: 'flex',
            height: 65, paddingBottom: 10, paddingTop: 10,
            backgroundColor: colors.tabBar, borderTopWidth: 1, borderTopColor: colors.border,
          },
        });
      }
    };
  }, [navigation, colors.tabBar, colors.border]);

  // Improved filtering logic for real backend data
  const getProviderDistance = (provider) => {
    const rawDistance = provider.distanceKm ?? provider.distance ?? provider.distanceInKm;
    const parsedDistance = Number(rawDistance);
    return Number.isFinite(parsedDistance) ? parsedDistance : null;
  };

  const filtered = providers.filter(p => {
    const searchLower = search.trim().toLowerCase();
    const catLower = category?.toLowerCase();
    
    const name = (p.user?.fullName || '').toLowerCase();
    const skills = (p.skills || []).join(' ').toLowerCase();
    const area = (p.serviceArea || '').toLowerCase();
    const combinedInfo = `${name} ${skills} ${area}`;

    // Filter by Category if provided in route
    if (catLower && catLower !== 'all' && !skills.includes(catLower)) return false;

    // Filter by Search terms
    if (!searchLower) return true;
    const searchTerms = searchLower.split(/\s+/).filter(t => t.length > 0);
    return searchTerms.every(term => combinedInfo.includes(term));
  }).sort((a, b) => {
    if (activeFilter === 'Rating') {
      return Number(b.rating || 0) - Number(a.rating || 0);
    }

    if (activeFilter === 'Price') {
      return Number(a.rate || Number.MAX_SAFE_INTEGER) - Number(b.rate || Number.MAX_SAFE_INTEGER);
    }

    if (activeFilter === 'Distance') {
      const distanceA = getProviderDistance(a) ?? Number.MAX_SAFE_INTEGER;
      const distanceB = getProviderDistance(b) ?? Number.MAX_SAFE_INTEGER;
      return distanceA - distanceB;
    }

    if (activeFilter === 'Availability') {
      return Number(Boolean(b.isAvailable ?? b.user?.isOnline)) - Number(Boolean(a.isAvailable ?? a.user?.isOnline));
    }

    return 0;
  });

  const renderProvider = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={() => navigation.navigate('ProviderProfile', { provider: item })}
      activeOpacity={0.85}
    >
      <View style={styles.cardTop}>
        <Image 
          source={item.user?.avatar ? { uri: item.user.avatar } : { uri: `https://ui-avatars.com/api/?name=${item.user?.fullName || 'User'}&background=random` }} 
          style={[styles.avatar, { backgroundColor: isDarkMode ? '#1e293b' : '#f3f4f6' }]} 
        />
        <View style={styles.cardInfo}>
          <Text style={[styles.provName, { color: colors.text }]}>{item.user?.fullName || 'No Name'}</Text>
          <Text style={[styles.provSkill, { color: colors.accent }]}>
            {item.skills && item.skills.length > 0 ? item.skills[0] : 'Professional'}
          </Text>
          <View style={styles.locationRow}>
            <MaterialCommunityIcons name="map-marker-outline" size={13} color={colors.textSecondary} />
            <Text style={[styles.locationText, { color: colors.textSecondary }]}>
              {item.serviceArea || 'Nearby'}
            </Text>
          </View>
        </View>
        <View style={[styles.ratingBadge, { backgroundColor: isDarkMode ? 'rgba(251,191,36,0.1)' : '#FEF3C7' }]}>
          <MaterialCommunityIcons name="star" size={14} color="#F59E0B" />
          <Text style={[styles.ratingText, { color: '#B45309' }]}>{item.rating || '0.0'}</Text>
        </View>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.chatBtn, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('Chat', { receiverId: item.user?.id, userName: item.user?.fullName, avatar: item.user?.avatar })}
        >
          <MaterialCommunityIcons name="message-outline" size={16} color="#FFF" />
          <Text style={styles.chatBtnText}>Send Message</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.callBtn, { backgroundColor: colors.accent + '20', borderColor: colors.accent }]}
          onPress={() => alert(`Calling ${item.user?.fullName || 'Provider'}...`)}
        >
          <MaterialCommunityIcons name="phone-outline" size={20} color={colors.accent} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient 
      colors={isDarkMode ? ['#0F172A', '#1E1B4B', '#020617'] : ['#FFFFFF', '#F8FAFC', '#F1F5F9']} 
      style={styles.container}
    >
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: colors.card }]}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{category && category !== 'all' ? `${category} Pros` : 'Discover Pros'}</Text>
          <TouchableOpacity style={[styles.filterBtn, { backgroundColor: colors.card }]}>
            <MaterialCommunityIcons name="tune-variant" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <MaterialCommunityIcons name="magnify" size={22} color={colors.placeholder} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search by name or skill..."
              placeholderTextColor={colors.placeholder}
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <MaterialCommunityIcons name="close-circle" size={18} color={colors.placeholder} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Filter chips */}
        <View style={styles.filtersWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersRow}>
            {FILTERS.map(f => (
              <TouchableOpacity
                key={f}
                style={[
                  styles.filterChip, 
                  { backgroundColor: activeFilter === f ? colors.accent : colors.card, borderColor: colors.border },
                  activeFilter === f && { borderWidth: 0 }
                ]}
                onPress={() => setActiveFilter(f)}
              >
                <Text style={[styles.filterText, { color: activeFilter === f ? '#FFF' : colors.textSecondary }]}>
                  {f}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* List */}
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={renderProvider}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <MaterialCommunityIcons name="account-search-outline" size={80} color={colors.border} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No professionals found</Text>
              <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>Try adjusting your search or filters to find what you're looking for.</Text>
            </View>
          }
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20, paddingVertical: 15,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  backBtn: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '900' },
  filterBtn: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  searchContainer: { paddingHorizontal: 20, marginBottom: 15 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderRadius: 16, paddingHorizontal: 15, height: 52,
    borderWidth: 1,
  },
  searchInput: { flex: 1, fontSize: 15, fontWeight: '600' },
  filtersWrapper: { marginBottom: 15 },
  filtersRow: { paddingHorizontal: 20, gap: 10 },
  filterChip: {
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12,
    borderWidth: 1,
  },
  filterText: { fontSize: 13, fontWeight: '700' },
  list: { paddingHorizontal: 20, paddingBottom: 40 },
  card: {
    borderRadius: 22, padding: 16, marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 10, elevation: 1,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  avatar: { width: 60, height: 60, borderRadius: 18 },
  cardInfo: { flex: 1, marginLeft: 15 },
  provName: { fontSize: 17, fontWeight: '800' },
  provSkill: { fontSize: 13, fontWeight: '700', marginVertical: 3 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationText: { fontSize: 12, fontWeight: '600' },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  ratingText: { fontSize: 13, fontWeight: '800' },
  cardActions: { flexDirection: 'row', gap: 10 },
  chatBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, borderRadius: 14, paddingVertical: 12,
  },
  chatBtnText: { color: '#FFF', fontWeight: '800', fontSize: 14 },
  callBtn: {
    width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center', borderWidth: 1
  },
  empty: { paddingTop: 80, alignItems: 'center', paddingHorizontal: 40 },
  emptyTitle: { fontSize: 18, fontWeight: '800', marginTop: 20 },
  emptyDesc: { fontSize: 14, textAlign: 'center', marginTop: 10, lineHeight: 20 },
});

export default ProviderListScreen;
