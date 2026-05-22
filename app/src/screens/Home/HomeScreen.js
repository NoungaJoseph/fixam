import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, ScrollView,
  TextInput, Image, StatusBar, Dimensions, Platform, RefreshControl
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { getMediaUrl } from '../../services/api';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: '1', name: 'Cleaning', icon: 'broom', color: '#0D9488' },
  { id: '2', name: 'Plumbing', icon: 'pipe-wrench', color: '#0D9488' },
  { id: '3', name: 'Electrical', icon: 'lightning-bolt', color: '#F59E0B' },
  { id: '4', name: 'Carpentry', icon: 'saw-blade', color: '#0D9488' },
  { id: '5', name: 'Painting', icon: 'format-paint', color: '#0D9488' },
  { id: '6', name: 'Beauty', icon: 'content-cut', color: '#EC4899' },
  { id: '7', name: 'Babysitting', icon: 'baby-face-outline', color: '#8B5CF6' },
  { id: '8', name: 'Landscaping', icon: 'flower-outline', color: '#22C55E' },
];

const LEARN_CARDS = [
  {
    id: '1',
    step: 'STEP 1',
    title: 'Post your task\nin seconds',
    desc: 'Describe what you need and set your budget',
    image: require('../../../assets/onboarding/learn_step1.png'),
    colors: ['#0D9488', '#14B8A6']
  },
  {
    id: '2',
    step: 'STEP 2',
    title: 'Receive competitive\noffers',
    desc: 'Expert providers will bid for your request',
    image: require('../../../assets/onboarding/learn_step2.png'),
    colors: ['#2563EB', '#3B82F6']
  },
  {
    id: '3',
    step: 'STEP 3',
    title: 'Choose the best\nprofessional',
    desc: 'Check reviews, portfolios, and confirm the hire',
    image: require('../../../assets/onboarding/learn_step3.png'),
    colors: ['#8B5CF6', '#A78BFA']
  },
  {
    id: '4',
    step: 'TIPS',
    title: 'Release payment\nsafely',
    desc: 'Funds are secure until the task is completed',
    image: require('../../../assets/onboarding/learn_tips.png'),
    colors: ['#F59E0B', '#FBBF24']
  }
];

const HomeScreen = ({ navigation }) => {
  const { providers, walletBalance, transactions, unreadCount, jobs, fetchAppData, notificationCount, favoriteProviderIds } = useAppContext();
  const { user } = useAuth();
  const { colors, isDarkMode } = useTheme();
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const learnScrollRef = useRef(null);

  useEffect(() => {
    let timer;
    if (LEARN_CARDS.length > 0) {
      timer = setInterval(() => {
        setSlideIndex(prevIndex => {
          const nextIndex = (prevIndex + 1) % LEARN_CARDS.length;
          learnScrollRef.current?.scrollTo({
            x: nextIndex * (width - 70 + 12),
            animated: true
          });
          return nextIndex;
        });
      }, 3500);
    }
    return () => clearInterval(timer);
  }, []);

  const handleScroll = (event) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / (width - 60));
    if (slide !== slideIndex) {
      setSlideIndex(slide);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAppData();
    setRefreshing(false);
  };

  const firstName = user?.fullName?.split(' ')[0] || 'there';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  // Real data counts
  const activeTaskCount = jobs?.filter(j => j.status === 'OPEN' || j.status === 'IN_PROGRESS').length || 0;
  const completedTaskCount = jobs?.filter(j => j.status === 'COMPLETED').length || 0;
  const savedCount = favoriteProviderIds?.length || 0;
  const txCount = transactions?.length || 0;

  // Level thresholds grow by 5 more tasks each level: 5, 15, 30, 50...
  const calculateLevel = (completedCount) => {
    let level = 1;
    while (level < 200 && completedCount >= getLevelThresholds(level).nextThreshold) {
      level += 1;
    }
    return level;
  };

  const getLevelThresholds = (level) => {
    const safeLevel = Math.min(Math.max(level, 1), 200);
    const currentThreshold = 5 * ((safeLevel - 1) * safeLevel) / 2;
    const nextThreshold = safeLevel >= 200 ? currentThreshold : 5 * (safeLevel * (safeLevel + 1)) / 2;
    return { currentThreshold, nextThreshold };
  };

  const currentLevel = calculateLevel(completedTaskCount);
  const { currentThreshold, nextThreshold } = getLevelThresholds(currentLevel);
  const tasksInCurrentLevel = completedTaskCount - currentThreshold;
  const tasksNeededForNextLevel = nextThreshold - currentThreshold;
  const nextRewardCoins = Math.min(currentLevel, 200);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* ═══ 1. HEADER with gradient ═══ */}
      <LinearGradient
        colors={isDarkMode ? ['#0F4C4A', '#1E3A5F'] : ['#0D9488', '#2563EB']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuBtn}>
            <MaterialCommunityIcons name="menu" size={24} color="#FFF" />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.greetText}>{greeting} 👋</Text>
            <Text style={styles.nameText}>{firstName}</Text>
            <View style={styles.locationRow}>
              <MaterialCommunityIcons name="map-marker" size={14} color="rgba(255,255,255,0.8)" />
              <Text style={styles.locationText}>Douala, Cameroon</Text>
              <MaterialCommunityIcons name="chevron-down" size={16} color="rgba(255,255,255,0.8)" />
            </View>
          </View>
          <TouchableOpacity style={styles.bellBtn} onPress={() => navigation.navigate('Notifications')}>
            <MaterialCommunityIcons name="bell-outline" size={22} color="#FFF" />
            {notificationCount > 0 && (
              <View style={styles.bellBadge}>
                <Text style={styles.bellBadgeText}>{notificationCount > 9 ? '9+' : notificationCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0D9488']} tintColor="#0D9488" />}
      >

        {/* ═══ 1.5. SEARCH BAR & FILTER ROW ═══ */}
        <View style={styles.searchRow}>
          <View style={[styles.searchBar, { backgroundColor: isDarkMode ? '#1E293B' : '#FFF', borderColor: isDarkMode ? '#334155' : '#E2E8F0' }]}>
            <MaterialCommunityIcons name="magnify" size={22} color={isDarkMode ? '#94A3B8' : '#64748B'} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search for professionals or services..."
              placeholderTextColor={isDarkMode ? '#64748B' : '#94A3B8'}
              value={search}
              onChangeText={setSearch}
              onSubmitEditing={() => {
                if (search.trim()) {
                  navigation.navigate('ProviderList', { search: search.trim() });
                  setSearch('');
                }
              }}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <MaterialCommunityIcons name="close-circle" size={18} color={isDarkMode ? '#64748B' : '#94A3B8'} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity 
            style={[styles.filterBtn, { backgroundColor: isDarkMode ? '#1E293B' : '#FFF', borderColor: isDarkMode ? '#334155' : '#E2E8F0' }]}
            onPress={() => {
              navigation.navigate('ProviderList');
            }}
          >
            <MaterialCommunityIcons name="tune-variant" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* ═══ 2. WALLET BALANCE CARD ═══ */}
        <TouchableOpacity
          style={[styles.walletCard, { backgroundColor: isDarkMode ? '#134E4A' : '#0D9488' }]}
          onPress={() => navigation.navigate('TopUp')}
          activeOpacity={0.85}
        >
          {/* Left Column: Wallet Balance & Top Up stacked */}
          <View style={styles.walletLeftCol}>
            <View style={styles.walletHeaderRow}>
              <View style={styles.walletIconWrap}>
                <MaterialCommunityIcons name="wallet" size={20} color="#FFF" />
              </View>
              <Text style={styles.walletLabel}>WALLET BALANCE</Text>
            </View>
            <Text style={styles.walletAmount} numberOfLines={1}>{(walletBalance || 0).toLocaleString()} Coins 🪙</Text>
            
            <TouchableOpacity
              style={styles.topUpBtn}
              onPress={() => navigation.navigate('TopUp')}
            >
              <Text style={styles.topUpText}>Top up</Text>
              <MaterialCommunityIcons name="plus" size={14} color="#0D9488" />
            </TouchableOpacity>
          </View>

          <View style={styles.walletDivider} />

          {/* Right Column: Transactions */}
          <View style={styles.walletRightCol}>
            <Text style={styles.walletLabel}>TRANSACTIONS</Text>
            <Text style={styles.walletTxCount} numberOfLines={1}>{txCount}</Text>
            <Text style={styles.walletSub}>This Month</Text>
          </View>
        </TouchableOpacity>

        {/* ═══ 3. PROGRESS CARD ═══ */}
        <LinearGradient
          colors={isDarkMode ? ['#1E293B', '#0F172A'] : ['#1E3A5F', '#0F172A']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.progressCard}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.progressTitle}>You're doing great! 🔥</Text>
            <Text style={styles.progressCount}>{completedTaskCount} Tasks Completed</Text>
            <Text style={styles.progressSub}>{Math.max(nextThreshold - completedTaskCount, 0)} more tasks to level up</Text>
            <View style={styles.progressBar}>
              {[1,2,3,4,5].map((i) => {
                const stepValue = (tasksNeededForNextLevel > 0 ? (tasksInCurrentLevel / tasksNeededForNextLevel) : 1) * 5;
                return (
                  <View key={i} style={[styles.progressSegment, { backgroundColor: i <= stepValue ? '#0D9488' : 'rgba(255,255,255,0.15)' }]} />
                );
              })}
            </View>
          </View>
          <View style={styles.progressRight}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>Level {currentLevel} ↑</Text>
            </View>
            <Text style={styles.rewardLabel}>Next reward</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <MaterialCommunityIcons name="star-circle" size={16} color="#FBBF24" />
              <Text style={styles.rewardAmount}>{nextRewardCoins} Coins</Text>
            </View>
          </View>
        </LinearGradient>

        {/* ═══ 4. CTA - "What do you need done?" ═══ */}
        <TouchableOpacity
          style={[styles.ctaCard, { backgroundColor: isDarkMode ? '#1E293B' : '#FFF', borderColor: isDarkMode ? '#334155' : '#E2E8F0' }]}
          onPress={() => navigation.navigate('Create Task', { screen: 'PostTask', params: { startOnPost: true } })}
          activeOpacity={0.85}
        >
          <View style={{ flex: 1 }}>
            <Text style={[styles.ctaTitle, { color: colors.text }]}>What do you need done?</Text>
            <Text style={[styles.ctaSub, { color: colors.textSecondary }]}>Post a task and get offers within minutes</Text>
            <LinearGradient colors={['#0D9488', '#14B8A6']} style={styles.ctaBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <Text style={styles.ctaBtnText}>Post a Task</Text>
              <MaterialCommunityIcons name="plus" size={16} color="#FFF" />
            </LinearGradient>
          </View>
          <Image
            source={require('../../../assets/done.png')}
            style={styles.ctaImg}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* ═══ 4.5. LEARN FIXAM CAROUSEL ═══ */}
        <View style={styles.learnHeader}>
          <Text style={[styles.learnTitle, { color: colors.text }]}>Learn Fixam</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>

        {/* Step cards list */}
        <ScrollView
          ref={learnScrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={styles.learnScroll}
        >
          {LEARN_CARDS.map((card) => (
            <LinearGradient
              key={card.id}
              colors={card.colors}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={styles.learnCard}
            >
              <View style={styles.learnLeft}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepBadgeText}>{card.step}</Text>
                </View>
                <Text style={styles.learnCardTitle}>{card.title}</Text>
                <Text style={styles.learnCardDesc}>{card.desc}</Text>
              </View>
              <Image source={card.image} style={styles.learnCardImage} resizeMode="contain" />
            </LinearGradient>
          ))}
        </ScrollView>

        {/* Pagination Dots */}
        <View style={styles.dotsRow}>
          {LEARN_CARDS.map((_, index) => (
            <View
              key={index}
              style={[
                styles.slideDot,
                slideIndex === index && styles.slideDotActive
              ]}
            />
          ))}
        </View>

        {/* ═══ 5. QUICK ACTIONS ═══ */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickItem} onPress={() => navigation.navigate('My Tasks')}>
            <View style={[styles.quickIcon, { backgroundColor: isDarkMode ? '#134E4A' : '#E6F7F5' }]}>
              <MaterialCommunityIcons name="clipboard-check-outline" size={24} color="#0D9488" />
              {activeTaskCount > 0 && (
                <View style={[styles.quickBadge, { backgroundColor: '#EF4444' }]}>
                  <Text style={styles.quickBadgeText}>{activeTaskCount}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.quickLabel, { color: colors.text }]}>My Tasks</Text>
            <Text style={[styles.quickSub, { color: colors.textSecondary }]}>{activeTaskCount} Active</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickItem} onPress={() => navigation.navigate('Messages')}>
            <View style={[styles.quickIcon, { backgroundColor: isDarkMode ? '#134E4A' : '#E6F7F5' }]}>
              <MaterialCommunityIcons name="chat-processing-outline" size={24} color="#0D9488" />
              {unreadCount > 0 && (
                <View style={[styles.quickBadge, { backgroundColor: '#EF4444' }]}>
                  <Text style={styles.quickBadgeText}>{unreadCount}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.quickLabel, { color: colors.text }]}>Messages</Text>
            <Text style={[styles.quickSub, { color: colors.textSecondary }]}>{unreadCount} Unread</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickItem} onPress={() => navigation.navigate('FavoriteProviders')}>
            <View style={[styles.quickIcon, { backgroundColor: isDarkMode ? '#422006' : '#FFF7ED' }]}>
              <MaterialCommunityIcons name="star" size={24} color="#F59E0B" />
            </View>
            <Text style={[styles.quickLabel, { color: colors.text }]}>Favorites</Text>
            <Text style={[styles.quickSub, { color: colors.textSecondary }]}>{savedCount} Saved</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickItem} onPress={() => navigation.navigate('ProviderList', { verifiedOnly: true })}>
            <View style={[styles.quickIcon, { backgroundColor: isDarkMode ? '#052E16' : '#ECFDF5' }]}>
              <MaterialCommunityIcons name="check-decagram" size={24} color="#22C55E" />
            </View>
            <Text style={[styles.quickLabel, { color: colors.text }]}>Verified Pros</Text>
            <Text style={[styles.quickSub, { color: colors.textSecondary }]}>Top Rated</Text>
          </TouchableOpacity>
        </View>

        {/* ═══ 6. POPULAR CATEGORIES ═══ */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Popular Categories</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ProviderList')}>
            <Text style={styles.viewAll}>View all</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.catPill, { backgroundColor: isDarkMode ? '#1E293B' : '#FFF', borderColor: isDarkMode ? '#334155' : '#E2E8F0' }]}
              onPress={() => navigation.navigate('ProviderList', { category: cat.name })}
            >
              <MaterialCommunityIcons name={cat.icon} size={16} color={cat.color} />
              <Text style={[styles.catText, { color: colors.text }]}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ═══ 7. RECOMMENDED PROFESSIONALS ═══ */}
        {providers.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Recommended Professionals</Text>
              <TouchableOpacity onPress={() => navigation.navigate('ProviderList')}>
                <Text style={styles.viewAll}>View all</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.proScroll}>
              {providers.slice(0, 10).map(p => (
                <TouchableOpacity
                  key={p.id}
                  style={[styles.proCard, { backgroundColor: isDarkMode ? '#1E293B' : '#FFF', borderColor: isDarkMode ? '#334155' : '#E2E8F0' }]}
                  onPress={() => navigation.navigate('ProviderProfile', { provider: p })}
                  activeOpacity={0.8}
                >
                  <View style={styles.proImgWrap}>
                    <Image
                      source={getMediaUrl(p.user?.avatar) ? { uri: getMediaUrl(p.user.avatar) } : { uri: `https://ui-avatars.com/api/?name=${p.user?.fullName || 'U'}&background=random&size=120` }}
                      style={styles.proImg}
                    />
                    {p.verification === 'VERIFIED' && (
                      <View style={styles.proVerified}>
                        <MaterialCommunityIcons name="check-decagram" size={18} color="#22C55E" />
                      </View>
                    )}
                  </View>
                  <Text style={[styles.proName, { color: colors.text }]} numberOfLines={1}>{p.user?.fullName || 'Professional'}</Text>
                  <Text style={[styles.proSkill, { color: colors.textSecondary }]} numberOfLines={1}>{p.skills?.[0] || 'Expert'}</Text>
                  <View style={styles.proRatingRow}>
                    <MaterialCommunityIcons name="star" size={14} color="#F59E0B" />
                    <Text style={[styles.proRating, { color: colors.text }]}>{p.rating || '0.0'}</Text>
                    <Text style={[styles.proReviews, { color: colors.textSecondary }]}>({p.reviewCount || 0})</Text>
                    <Text style={[styles.proDist, { color: colors.textSecondary }]}>{p.serviceArea ? `${p.serviceArea}` : '~ nearby'}</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.viewProfileBtn, { borderColor: isDarkMode ? '#334155' : '#E2E8F0' }]}
                    onPress={() => navigation.navigate('ProviderProfile', { provider: p })}
                  >
                    <Text style={styles.viewProfileText}>View Profile</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}

        {/* ═══ 8. INVITE & EARN BANNER ═══ */}
        <TouchableOpacity
          style={[styles.inviteCard, { backgroundColor: isDarkMode ? '#134E4A' : '#ECFDF5', borderColor: isDarkMode ? '#0D9488' : '#A7F3D0' }]}
          onPress={() => navigation.navigate('Invitation')}
          activeOpacity={0.85}
        >
          <MaterialCommunityIcons name="gift" size={36} color="#0D9488" />
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={[styles.inviteTitle, { color: colors.text }]}>Invite & Earn 🎉</Text>
            <Text style={[styles.inviteSub, { color: colors.textSecondary }]}>Invite a friend and earn 1 coin</Text>
          </View>
          <LinearGradient colors={['#0D9488', '#14B8A6']} style={styles.inviteBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Text style={styles.inviteBtnText}>Invite Now</Text>
          </LinearGradient>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingBottom: 110 },

  // 1. HEADER
  header: {
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 10 : 54,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  menuBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  greetText: { fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: '500' },
  nameText: { fontSize: 22, fontWeight: '900', color: '#FFF', marginTop: 1 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3, gap: 2 },
  locationText: { fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: '500' },
  bellBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  bellBadge: { position: 'absolute', top: -2, right: -2, backgroundColor: '#EF4444', minWidth: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#2563EB' },
  bellBadgeText: { color: '#FFF', fontSize: 10, fontWeight: '900' },

  // 1.5. SEARCH BAR & FILTER
  searchRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 50,
    borderRadius: 16,
    paddingHorizontal: 14,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  filterBtn: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },

  // 2. WALLET CARD
  walletCard: {
    marginHorizontal: 16, 
    marginTop: 16, 
    borderRadius: 24, 
    paddingHorizontal: 20, 
    paddingVertical: 22,
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 6 }, 
    shadowOpacity: 0.08, 
    shadowRadius: 12, 
    elevation: 4,
  },
  walletLeftCol: { 
    flex: 1.3,
    alignItems: 'flex-start',
  },
  walletHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  walletIconWrap: { 
    width: 32, 
    height: 32, 
    borderRadius: 10, 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  walletLabel: { 
    fontSize: 10.5, 
    color: 'rgba(255,255,255,0.75)', 
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  walletAmount: { 
    fontSize: 22, 
    fontWeight: '900', 
    color: '#FFF', 
    marginBottom: 12,
  },
  walletDivider: { 
    width: 1, 
    height: 70, 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    marginHorizontal: 16,
    alignSelf: 'center',
  },
  walletRightCol: { 
    flex: 0.9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletTxCount: { 
    fontSize: 28, 
    fontWeight: '900', 
    color: '#FFF', 
    marginTop: 4,
    marginBottom: 2,
  },
  walletSub: { 
    fontSize: 10.5, 
    color: 'rgba(255,255,255,0.65)', 
    fontWeight: '700',
  },
  topUpBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 4, 
    backgroundColor: '#FFF', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 14, 
  },
  topUpText: { 
    fontSize: 11.5, 
    fontWeight: '900', 
    color: '#0D9488' 
  },

  // 3. PROGRESS CARD
  progressCard: {
    marginHorizontal: 16, marginTop: 14, borderRadius: 24, paddingHorizontal: 22, paddingVertical: 26,
    flexDirection: 'row', alignItems: 'center', overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4,
  },
  progressTitle: { fontSize: 15, color: 'rgba(255,255,255,0.85)', fontWeight: '800' },
  progressCount: { fontSize: 22, fontWeight: '900', color: '#FFF', marginTop: 4 },
  progressSub: { fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 4, fontWeight: '600' },
  progressBar: { flexDirection: 'row', gap: 4, marginTop: 12 },
  progressSegment: { flex: 1, height: 6, borderRadius: 3 },
  progressRight: { alignItems: 'flex-end', marginLeft: 16 },
  levelBadge: { backgroundColor: '#0D9488', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14 },
  levelText: { color: '#FFF', fontSize: 12, fontWeight: '900' },
  rewardLabel: { fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 10, fontWeight: '700' },
  rewardAmount: { fontSize: 16, fontWeight: '900', color: '#22C55E' },

  // 4. CTA CARD
  ctaCard: {
    marginHorizontal: 16, marginTop: 14, borderRadius: 24, paddingHorizontal: 24, paddingVertical: 28,
    flexDirection: 'row', alignItems: 'center', borderWidth: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 4,
  },
  ctaTitle: { fontSize: 20, fontWeight: '900', marginBottom: 6 },
  ctaSub: { fontSize: 13, lineHeight: 18, marginBottom: 14, fontWeight: '600' },
  ctaBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingHorizontal: 18, paddingVertical: 12, borderRadius: 14 },
  ctaBtnText: { color: '#FFF', fontSize: 14, fontWeight: '800' },
  ctaImg: { width: 110, height: 110 },

  // 4.5. LEARN CAROUSEL
  learnHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 12,
  },
  learnTitle: {
    fontSize: 18,
    fontWeight: '900',
  },
  seeAllText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '700',
  },
  learnScroll: {
    paddingLeft: 20,
    paddingRight: 10,
    gap: 12,
  },
  learnCard: {
    width: width - 70,
    height: 160,
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  learnLeft: {
    flex: 1,
    justifyContent: 'space-between',
  },
  stepBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  stepBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '900',
  },
  learnCardTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '900',
    marginTop: 8,
    lineHeight: 22,
  },
  learnCardDesc: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  learnCardImage: {
    width: 100,
    height: 120,
    alignSelf: 'flex-end',
    backgroundColor: 'transparent',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
    marginBottom: 20,
  },
  slideDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
  },
  slideDotActive: {
    width: 18,
    backgroundColor: '#0D9488',
  },

  // 5. QUICK ACTIONS
  quickActions: {
    flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 12,
    marginTop: 20, marginBottom: 8,
  },
  quickItem: { alignItems: 'center', width: (width - 48) / 4 },
  quickIcon: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  quickBadge: { position: 'absolute', top: -4, right: -4, minWidth: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  quickBadgeText: { color: '#FFF', fontSize: 10, fontWeight: '900' },
  quickLabel: { fontSize: 12, fontWeight: '700', marginBottom: 2, textAlign: 'center' },
  quickSub: { fontSize: 10, textAlign: 'center' },

  // SECTION HEADER
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginTop: 20, marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '900' },
  viewAll: { fontSize: 13, fontWeight: '700', color: '#0D9488' },

  // 6. CATEGORIES
  catScroll: { paddingLeft: 16, paddingRight: 8, gap: 8 },
  catPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, borderWidth: 1 },
  catText: { fontSize: 13, fontWeight: '600' },

  // 7. PROFESSIONALS
  proScroll: { paddingLeft: 16, paddingRight: 8 },
  proCard: { width: 150, borderRadius: 16, padding: 14, marginRight: 12, borderWidth: 1, alignItems: 'center' },
  proImgWrap: { position: 'relative', marginBottom: 10 },
  proImg: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#E2E8F0' },
  proVerified: { position: 'absolute', bottom: -2, right: -2, backgroundColor: '#FFF', borderRadius: 10, padding: 1 },
  proName: { fontSize: 13, fontWeight: '800', textAlign: 'center', marginBottom: 2 },
  proSkill: { fontSize: 11, textAlign: 'center', marginBottom: 6 },
  proRatingRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 10, flexWrap: 'wrap', justifyContent: 'center' },
  proRating: { fontSize: 12, fontWeight: '800' },
  proReviews: { fontSize: 10 },
  proDist: { fontSize: 10 },
  viewProfileBtn: { width: '100%', paddingVertical: 8, borderRadius: 10, borderWidth: 1, alignItems: 'center' },
  viewProfileText: { fontSize: 12, fontWeight: '700', color: '#0D9488' },

  // 8. INVITE BANNER
  inviteCard: {
    marginHorizontal: 16, marginTop: 20, marginBottom: 10, borderRadius: 16, padding: 16,
    flexDirection: 'row', alignItems: 'center', borderWidth: 1,
  },
  inviteTitle: { fontSize: 15, fontWeight: '800' },
  inviteSub: { fontSize: 12, marginTop: 2, lineHeight: 16 },
  inviteBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  inviteBtnText: { color: '#FFF', fontSize: 12, fontWeight: '800' },
});

export default HomeScreen;
