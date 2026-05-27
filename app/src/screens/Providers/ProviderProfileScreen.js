import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, StatusBar, Linking, Share, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAppContext } from '../../context/AppContext';
import api, { getMediaUrl } from '../../services/api';
import UserAvatar from '../../components/UserAvatar';

const ProviderProfileScreen = ({ route, navigation }) => {
  const { colors, isDarkMode } = useTheme();
  const { t, currentLanguage } = useLanguage();
  const { favoriteProviderIds, toggleFavoriteProvider } = useAppContext();
  const provider = route.params?.provider || null;
  const [reviews, setReviews] = React.useState([]);



  React.useEffect(() => {
    const userId = provider?.user?.id;
    if (!userId) return;
    api.get(`/reviews/users/${userId}`)
      .then((res) => setReviews(res.data.data || []))
      .catch(() => setReviews([]));
  }, [provider?.user?.id]);

  if (!provider) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', padding: 24 }]}>
        <Text style={[styles.sectionTitle, { color: colors.text, textAlign: 'center' }]}>{t('profile.providerUnavailable')}</Text>
        <Text style={[styles.aboutText, { color: colors.textSecondary, textAlign: 'center', marginBottom: 18 }]}>{t('profile.providerUnavailableDesc')}</Text>
        <TouchableOpacity style={[styles.bookButton, { backgroundColor: colors.accent, flex: 0, paddingHorizontal: 20 }]} onPress={() => navigation.goBack()}>
          <Text style={styles.bookButtonText}>{t('common.goBack')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Pure dynamic data binding from DB
  const fullName = provider.user?.fullName || t('common.provider');
  const avatarUri = getMediaUrl(provider.user?.avatar);

  const ratingVal = provider.rating ? parseFloat(provider.rating).toFixed(1) : '0.0';
  const reviewCountVal = provider.reviewCount || reviews.length || 0;
  const jobsCompletedCount = provider.jobsCompleted || reviews.filter(r => r.rating >= 4).length || 0;
  const experienceLevel = provider.experienceLevel || t('profile.standardLevel');
  const bio = provider.bio || t('profile.noBiography');
  const serviceArea = provider.serviceArea || 'Douala, Cameroon';
  const isOnline = provider.user?.isOnline || false;
  const isFavorite = favoriteProviderIds?.includes(provider.id);
  
  const ratePrice = provider.rate 
    ? `${provider.rate.toLocaleString()} FCFA` 
    : t('profile.contactForPrice');

  const skills = provider.skills && provider.skills.length > 0 
    ? provider.skills 
    : [];

  const socialLinks = provider.socialLinks || {};
  const hasSocialLinks = Object.values(socialLinks).some(Boolean);

  const joinedDate = provider.user?.createdAt 
    ? new Date(provider.user.createdAt).toLocaleDateString(currentLanguage === 'fr' ? 'fr-FR' : 'en-US', { month: 'long', year: 'numeric' })
    : t('common.recent');

  const handleShare = async () => {
    try {
      const uid = provider?.user?.id;
      const url = uid ? `https://fixam.app/profile/${uid}` : 'https://fixam.app/download';
      await Share.share({
        title: `${fullName} profile`,
        message: `Book ${fullName} on Fixam: ${url}`,
        ...(Platform.OS === 'ios' ? { url } : {}),
      });
    } catch (_) {}
  };

  // Expertise styling
  const getSkillStyles = (skill) => {
    const s = skill.toLowerCase();
    if (s.includes('plumbing')) {
      return { bg: '#ECFDF5', border: '#A7F3D0', text: '#065F46', icon: 'filter-variant' };
    }
    if (s.includes('pipe') || s.includes('install')) {
      return { bg: '#EFF6FF', border: '#BFDBFE', text: '#2563EB', icon: 'hammer-wrench' };
    }
    if (s.includes('repair')) {
      return { bg: '#F3E8FF', border: '#E9D5FF', text: '#5B21B6', icon: 'wrench' };
    }
    return { bg: '#FFF7ED', border: '#FED7AA', text: '#9A3412', icon: 'cog-outline' };
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#0F172A' : '#FAFAFA' }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        
        {/* Curved Gradient Header */}
        <View style={styles.headerContainer}>
          <LinearGradient
            colors={['#0E7490', '#0D9488']}
            style={styles.curvedHeader}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <SafeAreaView style={styles.headerSafeArea}>
              <View style={styles.headerActions}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.headerBtn, { backgroundColor: isDarkMode ? '#1E293B' : '#FFF' }]}>
                  <MaterialCommunityIcons name="arrow-left" size={24} color={isDarkMode ? '#FFF' : '#0F172A'} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('profile.providerProfile')}</Text>
                <TouchableOpacity onPress={handleShare} style={[styles.headerBtn, { backgroundColor: isDarkMode ? '#1E293B' : '#FFF' }]}>
                  <MaterialCommunityIcons name="share-variant-outline" size={20} color={isDarkMode ? '#FFF' : '#0F172A'} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => toggleFavoriteProvider?.(provider.id)} style={[styles.headerBtn, { backgroundColor: isDarkMode ? '#1E293B' : '#FFF' }]}>
                  <MaterialCommunityIcons name={isFavorite ? 'heart' : 'heart-outline'} size={21} color={isFavorite ? '#EF4444' : (isDarkMode ? '#FFF' : '#0F172A')} />
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </LinearGradient>

          {/* Hanging Avatar */}
          <View style={styles.avatarWrapper}>
            <View style={[styles.avatarBorderShadow, { backgroundColor: isDarkMode ? '#1E293B' : '#FFF' }]}>
              <UserAvatar uri={avatarUri} name={fullName} size={102} />
              {provider.verification === 'VERIFIED' && (
                <View style={styles.verifiedOverlay}>
                  <MaterialCommunityIcons name="check" size={16} color="#FFF" />
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Profile Details */}
        <View style={styles.profileDetailsSection}>
          <View style={styles.nameRow}>
            <Text style={[styles.heroName, { color: isDarkMode ? '#FFF' : '#0F172A' }]}>{fullName}</Text>
            {provider.verification === 'VERIFIED' && (
              <MaterialCommunityIcons name="check-decagram" size={22} color="#0D9488" />
            )}
          </View>

          {/* Verified Professional Badge */}
          {provider.verification === 'VERIFIED' && (
            <View style={styles.badgeWrapper}>
              <View style={[styles.verifiedProfessionalBadge, { backgroundColor: isDarkMode ? '#115E5920' : '#ECFDF5', borderColor: isDarkMode ? '#115E59' : '#A7F3D0' }]}>
                <MaterialCommunityIcons name="shield-check" size={14} color="#0D9488" style={{ marginRight: 4 }} />
                <Text style={styles.verifiedProfessionalText}>{t('profile.verifiedProfessional')}</Text>
              </View>
            </View>
          )}

          {/* Location */}
          <View style={styles.locationRow}>
            <MaterialCommunityIcons name="map-marker" size={16} color="#0D9488" />
            <Text style={[styles.locationText, { color: isDarkMode ? '#94A3B8' : '#64748B' }]}>{t('profile.nearby', { area: serviceArea })}</Text>
          </View>

          {/* Availability */}
          <View style={styles.availabilityRow}>
            <View style={[styles.greenDot, { backgroundColor: isOnline ? '#22C55E' : '#94A3B8' }]} />
            <Text style={[styles.availabilityText, { color: isOnline ? '#22C55E' : '#94A3B8' }]}>
              {isOnline ? t('profile.availableForWork') : t('home.offline')}
            </Text>
          </View>
        </View>

        {/* Stats Row Container Card */}
        <View style={styles.statsCardContainer}>
          <View style={[styles.statsCard, { backgroundColor: isDarkMode ? '#1E293B' : '#FFF', borderColor: isDarkMode ? '#1F2937' : '#F1F5F9' }]}>
            {/* Rating */}
            <View style={styles.statItem}>
              <View style={styles.statIconValRow}>
                <MaterialCommunityIcons name="star" size={16} color="#F59E0B" style={{ marginRight: 4 }} />
                <Text style={[styles.statVal, { color: isDarkMode ? '#FFF' : '#0F172A' }]}>{ratingVal}</Text>
              </View>
              <Text style={[styles.statLabel, { color: isDarkMode ? '#94A3B8' : '#64748B' }]}>{t('profile.rating')}</Text>
              <Text style={[styles.statSubLabel, { color: isDarkMode ? '#64748B' : '#94A3B8' }]}>({reviewCountVal})</Text>
            </View>

            <View style={[styles.statDivider, { backgroundColor: isDarkMode ? '#1F2937' : '#F1F5F9' }]} />

            {/* Reviews */}
            <View style={styles.statItem}>
              <View style={styles.statIconValRow}>
                <MaterialCommunityIcons name="shield-check-outline" size={16} color="#2563EB" style={{ marginRight: 4 }} />
                <Text style={[styles.statVal, { color: isDarkMode ? '#FFF' : '#0F172A' }]}>{reviewCountVal}</Text>
              </View>
              <Text style={[styles.statLabel, { color: isDarkMode ? '#94A3B8' : '#64748B' }]}>{t('profile.reviews')}</Text>
              <Text style={[styles.statSubLabel, { color: isDarkMode ? '#64748B' : '#94A3B8' }]}>&nbsp;</Text>
            </View>

            <View style={[styles.statDivider, { backgroundColor: isDarkMode ? '#1F2937' : '#F1F5F9' }]} />

            {/* Jobs Completed */}
            <View style={styles.statItem}>
              <View style={styles.statIconValRow}>
                <MaterialCommunityIcons name="briefcase-outline" size={16} color="#10B981" style={{ marginRight: 4 }} />
                <Text style={[styles.statVal, { color: isDarkMode ? '#FFF' : '#0F172A' }]}>{jobsCompletedCount}</Text>
              </View>
              <Text style={[styles.statLabel, { color: isDarkMode ? '#94A3B8' : '#64748B' }]}>{t('home.jobsCompleted')}</Text>
              <Text style={[styles.statSubLabel, { color: isDarkMode ? '#64748B' : '#94A3B8' }]}>&nbsp;</Text>
            </View>

            <View style={[styles.statDivider, { backgroundColor: isDarkMode ? '#1F2937' : '#F1F5F9' }]} />

            {/* Level */}
            <View style={styles.statItem}>
              <View style={styles.statIconValRow}>
                <MaterialCommunityIcons name="chart-bar" size={16} color="#8B5CF6" style={{ marginRight: 4 }} />
                <Text style={[styles.statVal, { color: isDarkMode ? '#FFF' : '#0F172A' }]}>{experienceLevel}</Text>
              </View>
              <Text style={[styles.statLabel, { color: isDarkMode ? '#94A3B8' : '#64748B' }]}>{t('home.levelLabel')}</Text>
              <Text style={[styles.statSubLabel, { color: isDarkMode ? '#64748B' : '#94A3B8' }]}>&nbsp;</Text>
            </View>
          </View>
        </View>

        {/* About Me Section */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFF' : '#0F172A' }]}>{t('profile.aboutMe')}</Text>
          <View style={styles.aboutRow}>
            <Text style={[styles.aboutText, { color: isDarkMode ? '#94A3B8' : '#475569' }]}>{bio}</Text>
            
            {/* Joined Card */}
            <View style={[styles.joinedCard, { backgroundColor: isDarkMode ? '#1E293B' : '#FFF', borderColor: isDarkMode ? '#1F2937' : '#F1F5F9' }]}>
              <MaterialCommunityIcons name="calendar-check-outline" size={24} color="#0D9488" />
              <Text style={styles.joinedTitle}>{t('profile.joined')}</Text>
              <Text style={[styles.joinedSub, { color: isDarkMode ? '#FFF' : '#0F172A' }]}>{joinedDate}</Text>
            </View>
          </View>
        </View>

        {/* Expertise Section */}
        {skills.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFF' : '#0F172A' }]}>{t('profile.expertise')}</Text>
            <View style={styles.skillsList}>
              {skills.slice(0, 4).map((skill, i) => {
                const itemStyles = getSkillStyles(skill);
                return (
                  <View 
                    key={i} 
                    style={[
                      styles.skillTag, 
                      { backgroundColor: isDarkMode ? '#1E293B' : itemStyles.bg, borderColor: isDarkMode ? '#1F2937' : itemStyles.border }
                    ]}
                  >
                    <MaterialCommunityIcons name={itemStyles.icon} size={15} color={isDarkMode ? '#2563EB' : itemStyles.text} style={{ marginRight: 5 }} />
                    <Text style={[styles.skillTagText, { color: isDarkMode ? '#FFF' : itemStyles.text }]}>{skill}</Text>
                  </View>
                );
              })}
              {skills.length > 4 && (
                <View style={[styles.skillTagMore, { backgroundColor: isDarkMode ? '#1F2937' : '#F1F5F9' }]}>
                  <Text style={[styles.skillTagMoreText, { color: isDarkMode ? '#FFF' : '#475569' }]}>+{skills.length - 4}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Highlights Section */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFF' : '#0F172A' }]}>{t('profile.highlights')}</Text>
          <View style={styles.highlightsGrid}>
            
            {/* Highlight 1 - Verified Professional Status */}
            <View style={[styles.highlightCard, { backgroundColor: isDarkMode ? '#1E293B' : '#FFF', borderColor: isDarkMode ? '#1F2937' : '#F1F5F9' }]}>
              <View style={[styles.highlightIconWrap, { backgroundColor: isDarkMode ? '#115E5920' : '#ECFDF5' }]}>
                <MaterialCommunityIcons name="shield-check" size={20} color="#10B981" />
              </View>
              <Text style={[styles.highlightText, { color: isDarkMode ? '#FFF' : '#0F172A' }]}>{t('profile.backgroundVerified')}</Text>
              {provider.verification === 'VERIFIED' && (
                <View style={styles.highlightCheckDot}>
                  <MaterialCommunityIcons name="check" size={10} color="#FFF" />
                </View>
              )}
            </View>

            {/* Highlight 2 - Job Success (based on rating) */}
            <View style={[styles.highlightCard, { backgroundColor: isDarkMode ? '#1E293B' : '#FFF', borderColor: isDarkMode ? '#1F2937' : '#F1F5F9' }]}>
              <View style={[styles.highlightIconWrap, { backgroundColor: isDarkMode ? '#1E3A8A20' : '#EFF6FF' }]}>
                <MaterialCommunityIcons name="trophy-outline" size={20} color="#2563EB" />
              </View>
              <Text style={[styles.highlightText, { color: isDarkMode ? '#FFF' : '#0F172A' }]}>{t('profile.jobSuccess')}</Text>
              {parseFloat(ratingVal) >= 4.5 && (
                <View style={styles.highlightCheckDot}>
                  <MaterialCommunityIcons name="check" size={10} color="#FFF" />
                </View>
              )}
            </View>

            {/* Highlight 3 - On-time Completion */}
            <View style={[styles.highlightCard, { backgroundColor: isDarkMode ? '#1E293B' : '#FFF', borderColor: isDarkMode ? '#1F2937' : '#F1F5F9' }]}>
              <View style={[styles.highlightIconWrap, { backgroundColor: isDarkMode ? '#5B21B620' : '#F3E8FF' }]}>
                <MaterialCommunityIcons name="clock-outline" size={20} color="#8B5CF6" />
              </View>
              <Text style={[styles.highlightText, { color: isDarkMode ? '#FFF' : '#0F172A' }]}>{t('profile.onTimeCompletion')}</Text>
              {parseFloat(ratingVal) >= 4.0 && (
                <View style={styles.highlightCheckDot}>
                  <MaterialCommunityIcons name="check" size={10} color="#FFF" />
                </View>
              )}
            </View>

            {/* Highlight 4 - Top Rated status */}
            <View style={[styles.highlightCard, { backgroundColor: isDarkMode ? '#1E293B' : '#FFF', borderColor: isDarkMode ? '#1F2937' : '#F1F5F9' }]}>
              <View style={[styles.highlightIconWrap, { backgroundColor: isDarkMode ? '#7C2D1220' : '#FFF7ED' }]}>
                <MaterialCommunityIcons name="thumb-up-outline" size={20} color="#F97316" />
              </View>
              <Text style={[styles.highlightText, { color: isDarkMode ? '#FFF' : '#0F172A' }]}>{t('profile.topRatedProvider')}</Text>
              {parseFloat(ratingVal) >= 4.8 && (
                <View style={styles.highlightCheckDot}>
                  <MaterialCommunityIcons name="check" size={10} color="#FFF" />
                </View>
              )}
            </View>

          </View>
        </View>

        {/* Linked Accounts Section - Render dynamic accounts only */}
        {hasSocialLinks && (
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFF' : '#0F172A' }]}>{t('profile.linkedAccounts')}</Text>
            {Object.keys(socialLinks).filter(key => socialLinks[key]).map((key) => {
              const label = key === 'tiktok' ? 'TikTok' : key === 'linkedin' ? 'LinkedIn' : key === 'facebook' ? 'Facebook' : 'Instagram';
              
              // Branded Social Media Logo URLs
              const logoUrls = {
                tiktok: 'https://cdn-icons-png.flaticon.com/512/3046/3046124.png',
                linkedin: 'https://cdn-icons-png.flaticon.com/512/174/174857.png',
                facebook: 'https://cdn-icons-png.flaticon.com/512/124/124010.png',
                instagram: 'https://cdn-icons-png.flaticon.com/512/174/174855.png'
              };
              
              const cleanUrl = socialLinks[key];
              
              // Robust handle extractor
              let handleText = cleanUrl;
              if (cleanUrl.includes('/')) {
                const parts = cleanUrl.replace(/\/$/, '').split('/');
                handleText = parts[parts.length - 1] || cleanUrl;
              }
              handleText = handleText.replace(/^@/, '');

              return (
                <TouchableOpacity 
                  key={key} 
                  style={[styles.linkedAccountCard, { backgroundColor: isDarkMode ? '#1E293B' : '#FFF', borderColor: isDarkMode ? '#1F2937' : '#F1F5F9', marginBottom: 8 }]}
                  onPress={() => Linking.openURL(cleanUrl)}
                >
                  <Image source={{ uri: logoUrls[key] }} style={{ width: 22, height: 22, resizeMode: 'contain' }} />
                  <Text style={[styles.linkedAccountLabel, { color: isDarkMode ? '#FFF' : '#0F172A' }]}>{label}</Text>
                  <Text style={styles.linkedAccountUser} numberOfLines={1}>@{handleText}</Text>
                  <MaterialCommunityIcons name="open-in-new" size={18} color="#94A3B8" style={{ marginLeft: 'auto' }} />
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Dynamic Reviews Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.reviewsHeaderRow}>
            <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFF' : '#0F172A' }]}>{t('profile.recentReviews')}</Text>
            {reviews.length > 0 && (
              <TouchableOpacity onPress={() => navigation.navigate('HelpCenter' /* or proper reviews navigation */)}>
                <Text style={styles.viewAllText}>{t('common.viewAll')}</Text>
              </TouchableOpacity>
            )}
          </View>

          {reviews.length === 0 ? (
            <View style={[styles.reviewCard, { backgroundColor: isDarkMode ? '#1E293B' : '#FFF', borderColor: isDarkMode ? '#1F2937' : '#F1F5F9', paddingVertical: 24, alignItems: 'center' }]}>
              <MaterialCommunityIcons name="star-outline" size={32} color="#94A3B8" style={{ marginBottom: 8 }} />
              <Text style={[styles.reviewComment, { color: colors.textSecondary, textAlign: 'center' }]}>
                {t('profile.noReviews')}
              </Text>
            </View>
          ) : (
            reviews.slice(0, 3).map((review, i) => {
              const reviewerName = review.job?.client?.fullName || t('profile.verifiedClient');
              const reviewerAvatarUri = getMediaUrl(review.job?.client?.avatar);
              const reviewDateText = review.createdAt 
                ? new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : t('common.recent');

              return (
                <View 
                  key={review.id || i} 
                  style={[styles.reviewCard, { backgroundColor: isDarkMode ? '#1E293B' : '#FFF', borderColor: isDarkMode ? '#1F2937' : '#F1F5F9', marginBottom: 12 }]}
                >
                  <View style={styles.reviewTopRow}>
                    <UserAvatar uri={reviewerAvatarUri} name={reviewerName} size={44} radius={14} style={styles.reviewAvatar} />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <View style={styles.reviewerNameRow}>
                        <Text style={[styles.reviewerName, { color: isDarkMode ? '#FFF' : '#0F172A' }]}>{reviewerName}</Text>
                        <View style={[styles.verifiedClientBadge, { backgroundColor: isDarkMode ? '#1E3A8A40' : '#EFF6FF' }]}>
                          <Text style={styles.verifiedClientText}>{t('profile.verifiedClient')}</Text>
                        </View>
                      </View>
                      <View style={styles.reviewRatingRow}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <MaterialCommunityIcons 
                            key={star} 
                            name={star <= (review.rating || 5) ? "star" : "star-outline"} 
                            size={14} 
                            color="#F59E0B" 
                            style={{ marginRight: 2 }} 
                          />
                        ))}
                        <Text style={[styles.reviewRatingText, { color: isDarkMode ? '#FFF' : '#0F172A' }]}>
                          {(review.rating || 5).toFixed(1)}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.reviewDate}>{reviewDateText}</Text>
                  </View>
                  <Text style={[styles.reviewComment, { color: isDarkMode ? '#CBD5E1' : '#475569' }]}>
                    {review.comment || t('profile.reviewFallback')}
                  </Text>
                </View>
              );
            })
          )}

          {/* Dynamic Dots Indicator based on review list count */}
          {reviews.length > 1 && (
            <View style={styles.dotsContainer}>
              {reviews.slice(0, 3).map((_, idx) => (
                <View 
                  key={idx} 
                  style={[
                    styles.dot, 
                    idx === 0 ? styles.dotActive : null, 
                    { backgroundColor: idx === 0 ? '#0D9488' : (isDarkMode ? '#475569' : '#CBD5E1') }
                  ]} 
                />
              ))}
            </View>
          )}
        </View>

      </ScrollView>

      {/* Dynamic Bottom Booking Bar */}
      <View style={[styles.bookingBarContainer, { backgroundColor: isDarkMode ? '#1E293B' : '#FFF', borderTopColor: isDarkMode ? '#1F2937' : '#F1F5F9' }]}>
        <View style={styles.bookingBar}>
          <TouchableOpacity 
            style={[styles.chatButton, { backgroundColor: isDarkMode ? '#0B1120' : '#FFF', borderColor: isDarkMode ? '#1F2937' : '#E2E8F0' }]}
            onPress={() => navigation.navigate('Chat', { receiverId: provider.user?.id, userName: fullName, avatar: avatarUri })}
          >
            <MaterialCommunityIcons name="message-text-outline" size={24} color={isDarkMode ? '#FFF' : '#0F172A'} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.bookButton}
            onPress={() => navigation.navigate('BookingForm', { providerId: provider.user?.id, providerName: fullName })}
          >
            <Text style={styles.bookButtonText}>{t('profile.bookNow')} - {ratePrice}</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  
  // Curved Header Styles
  headerContainer: {
    position: 'relative',
    height: 190,
    marginBottom: 65,
  },
  curvedHeader: {
    height: 140,
    borderBottomLeftRadius: 160,
    borderBottomRightRadius: 160,
    transform: [{ scaleX: 1.15 }],
    overflow: 'hidden',
  },
  headerSafeArea: {
    flex: 1,
    transform: [{ scaleX: 0.87 }], // Counteract scaleX stretch for layout items
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 35,
    gap: 10,
  },
  headerBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
    flex: 1,
    textAlign: 'center',
  },
  
  // Hanging Avatar Styles
  avatarWrapper: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    marginLeft: -55,
    zIndex: 10,
  },
  avatarBorderShadow: {
    position: 'relative',
    width: 110,
    height: 110,
    borderRadius: 55,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  heroAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 55,
  },
  verifiedOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
  },

  // Profile Details Styles
  profileDetailsSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 18,
    marginBottom: 16,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  heroName: {
    fontSize: 24,
    fontWeight: '800',
  },
  badgeWrapper: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  verifiedProfessionalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  verifiedProfessionalText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D9488',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
  },
  availabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  availabilityText: {
    fontSize: 13,
    fontWeight: '700',
  },

  // Stats Card Styles
  statsCardContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIconValRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 4,
  },
  statVal: {
    fontSize: 16,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  statSubLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 1,
  },
  statDivider: {
    width: 1,
    height: 36,
  },

  // Section Standard Container
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },

  // About Me Section Styles
  aboutRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  aboutText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '500',
  },
  joinedCard: {
    width: 96,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  joinedTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 6,
    marginBottom: 2,
  },
  joinedSub: {
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'center',
  },

  // Expertise Section Styles
  skillsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
  },
  skillTagText: {
    fontSize: 13,
    fontWeight: '700',
  },
  skillTagMore: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skillTagMoreText: {
    fontSize: 12,
    fontWeight: '800',
  },

  // Highlights Section Styles
  highlightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  highlightCard: {
    width: '48%',
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.01,
    shadowRadius: 3,
    elevation: 1,
    marginBottom: 12,
  },
  highlightIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  highlightText: {
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 16,
  },
  highlightCheckDot: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Linked Accounts Styles
  linkedAccountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.01,
    shadowRadius: 3,
    elevation: 1,
  },
  linkedAccountLabel: {
    fontSize: 15,
    fontWeight: '800',
    marginLeft: 10,
  },
  linkedAccountUser: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94A3B8',
    marginLeft: 12,
    flex: 1,
  },

  // Recent Reviews Styles
  reviewsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0D9488',
  },
  reviewCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 2,
  },
  reviewTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewAvatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
  },
  reviewerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  reviewerName: {
    fontSize: 15,
    fontWeight: '800',
  },
  verifiedClientBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  verifiedClientText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#2563EB',
  },
  reviewRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewRatingText: {
    fontSize: 12,
    fontWeight: '800',
    marginLeft: 4,
  },
  reviewDate: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  reviewComment: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '500',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 14,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 14,
  },

  // Booking Bar Styles
  bookingBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 8,
  },
  bookingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  chatButton: {
    width: 52,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 3,
    elevation: 1,
  },
  bookButton: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#0D9488',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 16,
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  bookButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
});

export default ProviderProfileScreen;
