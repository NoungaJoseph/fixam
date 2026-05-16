import React from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, ScrollView,
  Image, StatusBar, SafeAreaView, Linking, Share, Platform
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../services/api';

const ProviderProfileScreen = ({ route, navigation }) => {
  const { colors, isDarkMode } = useTheme();
  const provider = route.params?.provider || null;
  const [reviews, setReviews] = React.useState([]);

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
        <Text style={[styles.sectionTitle, { color: colors.text, textAlign: 'center' }]}>Provider profile unavailable</Text>
        <Text style={[styles.aboutText, { color: colors.textSecondary, textAlign: 'center', marginBottom: 18 }]}>This application is missing provider details. Please refresh the task and try again.</Text>
        <TouchableOpacity style={[styles.hireBtn, { backgroundColor: colors.accent, flex: 0, paddingHorizontal: 20 }]} onPress={() => navigation.goBack()}>
          <Text style={styles.hireBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const skills = provider.skills || [];
  const portfolio = provider.portfolio || [];
  const certificates = provider.certificates || [];
  const socialLinks = provider.socialLinks || {};

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
          <Text style={[styles.headerTitle, { color: colors.text }]}>Provider Profile</Text>
          <TouchableOpacity
            style={[styles.shareBtn, { backgroundColor: colors.card }]}
            onPress={async () => {
              try {
                const uid = provider?.user?.id;
                const url = uid ? `https://fixam.app/profile/${uid}` : 'https://fixam.app/download';
                await Share.share({
                  title: `${provider?.user?.fullName || 'Fixam'} profile`,
                  message: `Book ${provider?.user?.fullName || 'this provider'} on Fixam: ${url}`,
                  ...(Platform.OS === 'ios' ? { url } : {}),
                });
              } catch (_) {}
            }}
          >
            <MaterialCommunityIcons name="share-variant-outline" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
          
          {/* Profile Hero */}
          <View style={styles.profileHero}>
            <View style={[styles.avatarContainer, { borderColor: colors.accent }]}>
              <Image
                source={provider.user?.avatar ? { uri: provider.user.avatar } : { uri: `https://ui-avatars.com/api/?name=${provider.user?.fullName || 'User'}&background=random` }}
                style={styles.heroAvatar}
              />
              {provider.user?.isOnline && <View style={styles.onlineStatus} />}
              {/* Verified badge overlay on avatar - like TikTok */}
              {provider.verification === 'VERIFIED' && (
                <View style={styles.verifiedOverlay}>
                  <MaterialCommunityIcons name="check-decagram" size={22} color="#FFF" />
                </View>
              )}
            </View>
            <View style={styles.nameRow}>
              <Text style={[styles.heroName, { color: colors.text }]}>{provider.user?.fullName || 'No Name'}</Text>
              {provider.verification === 'VERIFIED' && (
                <MaterialCommunityIcons name="check-decagram" size={24} color="#10B981" />
              )}
            </View>
            {provider.verification === 'VERIFIED' && (
              <View style={styles.verifiedBanner}>
                <MaterialCommunityIcons name="shield-check" size={14} color="#10B981" />
                <Text style={styles.verifiedBannerText}>Verified Professional</Text>
              </View>
            )}
            <View style={{ alignItems: 'center' }}>
              <View style={styles.locationRow}>
                 <MaterialCommunityIcons name="map-marker" size={14} color={colors.accent} />
                 <Text style={[styles.locationText, { color: colors.textSecondary }]}>
                   {provider.serviceArea || 'Nearby'} • Douala, Cameroon
                 </Text>
              </View>
            </View>

            {/* Social Links Row */}
            {Object.values(socialLinks).some(link => !!link) && (
              <View style={styles.socialIconsRow}>
                {socialLinks.linkedin ? (
                  <TouchableOpacity style={[styles.socialIconBtn, { backgroundColor: '#0077B5' }]} onPress={() => Linking.openURL(socialLinks.linkedin)}>
                    <MaterialCommunityIcons name="linkedin" size={18} color="#FFF" />
                  </TouchableOpacity>
                ) : null}
                {socialLinks.facebook ? (
                  <TouchableOpacity style={[styles.socialIconBtn, { backgroundColor: '#1877F2' }]} onPress={() => Linking.openURL(socialLinks.facebook)}>
                    <MaterialCommunityIcons name="facebook" size={18} color="#FFF" />
                  </TouchableOpacity>
                ) : null}
                {socialLinks.instagram ? (
                  <TouchableOpacity style={[styles.socialIconBtn, { backgroundColor: '#E4405F' }]} onPress={() => Linking.openURL(socialLinks.instagram)}>
                    <MaterialCommunityIcons name="instagram" size={18} color="#FFF" />
                  </TouchableOpacity>
                ) : null}
                {socialLinks.tiktok ? (
                  <TouchableOpacity style={[styles.socialIconBtn, { backgroundColor: '#000000' }]} onPress={() => Linking.openURL(socialLinks.tiktok)}>
                    <MaterialCommunityIcons name="tiktok" size={18} color="#FFF" />
                  </TouchableOpacity>
                ) : null}
              </View>
            )}
          </View>

          {/* Stats Row */}
          <View style={[styles.statsRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statVal, { color: colors.text }]}>{provider.rating || '0.0'}</Text>
              <View style={styles.statLabelRow}>
                <MaterialCommunityIcons name="star" size={12} color="#F59E0B" />
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Rating</Text>
              </View>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statVal, { color: colors.text }]}>{provider.reviewCount || '0'}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Reviews</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statVal, { color: colors.text }]}>{provider.experienceLevel || 'N/A'}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Level</Text>
            </View>
          </View>

          {/* About */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>About Me</Text>
            <Text style={[styles.aboutText, { color: colors.textSecondary }]}>
              {provider.bio || 'No bio added yet.'}
            </Text>
          </View>

          {/* Skills */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Expertise</Text>
            <View style={styles.skillsList}>
              {skills.map((skill, i) => (
                <View key={i} style={[styles.skillTag, { backgroundColor: colors.accent + '15' }]}>
                  <MaterialCommunityIcons name="check-circle" size={14} color={colors.accent} />
                  <Text style={[styles.skillTagText, { color: colors.accent }]}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>

          {portfolio.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Previous Work</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.portfolioRow}>
                {portfolio.map((item, i) => (
                  <View key={`${item.title}-${i}`} style={[styles.portfolioCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.portfolioImage} />}
                    <Text style={[styles.portfolioTitle, { color: colors.text }]}>{item.title || 'Work sample'}</Text>
                    <Text style={[styles.portfolioDesc, { color: colors.textSecondary }]} numberOfLines={2}>{item.description || 'Completed project'}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {certificates.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Certificates</Text>
              {certificates.map((cert, i) => (
                <View key={`${cert.title}-${i}`} style={[styles.certificateCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <MaterialCommunityIcons name="certificate-outline" size={24} color={colors.accent} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.certificateTitle, { color: colors.text }]}>{cert.title || 'Certificate'}</Text>
                    <Text style={[styles.certificateMeta, { color: colors.textSecondary }]}>{cert.issuer || 'Issuer'}{cert.year ? ` • ${cert.year}` : ''}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {Object.values(socialLinks).some(Boolean) && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Linked Accounts</Text>
              {[
                ['linkedin', 'LinkedIn', 'linkedin'],
                ['facebook', 'Facebook', 'facebook'],
                ['instagram', 'Instagram', 'instagram'],
                ['tiktok', 'TikTok', 'music-note']
              ].filter(([key]) => socialLinks[key]).map(([key, label, icon]) => (
                <TouchableOpacity key={key} style={[styles.socialLinkRow, { borderBottomColor: colors.border }]} onPress={() => Linking.openURL(socialLinks[key])}>
                  <MaterialCommunityIcons name={icon} size={22} color={colors.accent} />
                  <Text style={[styles.socialLinkText, { color: colors.text }]}>{label}</Text>
                  <MaterialCommunityIcons name="open-in-new" size={18} color={colors.textSecondary} />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Reviews */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Reviews ({provider.reviewCount || 0})</Text>
            </View>

            {reviews.length === 0 ? (
              <Text style={[styles.aboutText, { color: colors.textSecondary }]}>No reviews yet.</Text>
            ) : reviews.map((review) => (
              <View key={review.id} style={[styles.reviewCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.reviewTop}>
                  <View style={[styles.revAvatar, { backgroundColor: colors.accent + '20', justifyContent: 'center', alignItems: 'center' }]}>
                    <MaterialCommunityIcons name="account" size={20} color={colors.accent} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.revUser, { color: colors.text }]}>{review.job?.title || 'Completed task'}</Text>
                    <View style={styles.starsRow}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <MaterialCommunityIcons key={star} name={star <= review.rating ? 'star' : 'star-outline'} size={13} color="#F59E0B" />
                      ))}
                    </View>
                  </View>
                  <Text style={[styles.revDate, { color: colors.textSecondary }]}>{new Date(review.createdAt).toLocaleDateString()}</Text>
                </View>
                {review.comment ? <Text style={[styles.revComment, { color: colors.textSecondary }]}>{review.comment}</Text> : null}
              </View>
            ))}
          </View>

        </ScrollView>

        {/* Floating Action Button Bar */}
        <View style={[styles.footerBar, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
          <TouchableOpacity 
            style={[styles.chatBtn, { backgroundColor: colors.card, borderColor: colors.border }]} 
            onPress={() => navigation.navigate('Chat', { receiverId: provider.user?.id, userName: provider.user?.fullName, avatar: provider.user?.avatar })}
          >
            <MaterialCommunityIcons name="message-text-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.hireBtn, { backgroundColor: colors.accent }]}
            onPress={() => navigation.navigate('Chat', { receiverId: provider.user?.id, userName: provider.user?.fullName, avatar: provider.user?.avatar })}
          >
            <Text style={styles.hireBtnText}>Book Now • {provider.rate ? `${provider.rate} FCFA` : 'Contact for Price'}</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
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
  shareBtn: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  profileHero: { alignItems: 'center', marginVertical: 20 },
  avatarContainer: { width: 110, height: 110, borderRadius: 35, borderWidth: 3, padding: 3, position: 'relative' },
  heroAvatar: { width: '100%', height: '100%', borderRadius: 30 },
  onlineStatus: { position: 'absolute', bottom: -5, right: -5, width: 22, height: 22, borderRadius: 11, backgroundColor: '#10B981', borderWidth: 4, borderColor: '#FFF' },
  verifiedOverlay: { position: 'absolute', bottom: -4, right: -4, width: 32, height: 32, borderRadius: 16, backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center', borderWidth: 2.5, borderColor: '#FFF' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 15, marginBottom: 6 },
  heroName: { fontSize: 24, fontWeight: '900' },
  verifiedBanner: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#ECFDF5', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, marginBottom: 8 },
  verifiedBannerText: { fontSize: 12, fontWeight: '800', color: '#10B981' },
  socialIconsRow: { flexDirection: 'row', gap: 12, marginTop: 15, justifyContent: 'center' },
  socialIconBtn: { width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 2 },
  heroBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  heroBadgeText: { color: '#FFF', fontSize: 12, fontWeight: '800' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 10 },
  locationText: { fontSize: 13, fontWeight: '600' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', marginHorizontal: 20, paddingVertical: 20, borderRadius: 24, marginVertical: 15, borderWidth: 1 },
  statItem: { alignItems: 'center' },
  statVal: { fontSize: 19, fontWeight: '900' },
  statLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  statLabel: { fontSize: 12, fontWeight: '700' },
  statDivider: { width: 1, height: 35 },
  section: { paddingHorizontal: 22, marginVertical: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '900', marginBottom: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  seeAllText: { fontSize: 14, fontWeight: '700' },
  aboutText: { fontSize: 14, lineHeight: 22, fontWeight: '500' },
  skillsList: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  skillTag: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12 },
  skillTagText: { fontSize: 13, fontWeight: '700' },
  portfolioRow: { gap: 12, paddingRight: 22 },
  portfolioCard: { width: 180, borderRadius: 18, borderWidth: 1, padding: 12 },
  portfolioImage: { width: '100%', height: 110, borderRadius: 14, marginBottom: 10 },
  portfolioTitle: { fontSize: 14, fontWeight: '900' },
  portfolioDesc: { fontSize: 12, fontWeight: '600', marginTop: 4 },
  certificateCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 16, borderWidth: 1, padding: 14, marginBottom: 10 },
  certificateTitle: { fontSize: 14, fontWeight: '900' },
  certificateMeta: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  socialLinkRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, borderBottomWidth: 1 },
  socialLinkText: { flex: 1, fontSize: 15, fontWeight: '900' },
  reviewCard: { borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 1 },
  reviewTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  revAvatar: { width: 40, height: 40, borderRadius: 12 },
  revUser: { fontSize: 15, fontWeight: '800' },
  starsRow: { flexDirection: 'row', gap: 2, marginTop: 2 },
  revDate: { fontSize: 12, fontWeight: '600' },
  revComment: { fontSize: 13, lineHeight: 19, fontWeight: '500' },
  footerBar: { position: 'absolute', bottom: 0, width: '100%', padding: 20, paddingBottom: 35, borderTopWidth: 1, flexDirection: 'row', gap: 15 },
  chatBtn: { width: 60, height: 60, borderRadius: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  hireBtn: { flex: 1, height: 60, borderRadius: 18, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  hireBtnText: { color: '#FFF', fontSize: 16, fontWeight: '900' },
});

export default ProviderProfileScreen;
