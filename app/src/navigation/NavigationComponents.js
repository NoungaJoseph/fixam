import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Platform, StatusBar, Switch } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';
import { getMediaUrl } from '../services/api';

export const CustomHeader = ({ navigation, title, colors }) => {
  const { user } = useAuth();
  const { notificationCount } = useAppContext();

  const ROOT_SCREENS = ['Dashboard', 'Home', 'My Wallet', 'My Tasks', 'Coin Balance', 'Messages', 'Settings', 'Invite Friends', 'My Stats', 'Reports'];
  const isRootScreen = ROOT_SCREENS.includes(title);
  const isHome = title === 'Dashboard' || title === 'Home';

  const displayTitle = isHome
    ? `Welcome, ${user?.fullName ? user.fullName.split(' ')[0] : 'User'}`
    : title;

  return (
    <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: isRootScreen ? 'transparent' : colors.border, borderBottomWidth: isRootScreen ? 0 : 1 }]}>
      <TouchableOpacity
        onPress={() => isRootScreen ? navigation.openDrawer() : navigation.canGoBack() ? navigation.goBack() : navigation.openDrawer()}
        style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <MaterialCommunityIcons
          name={isRootScreen ? 'menu' : 'arrow-left'}
          size={22}
          color={colors.text}
        />
      </TouchableOpacity>

      <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>{displayTitle}</Text>

      <View style={styles.rightSlot}>
        {isHome ? (
          <TouchableOpacity
            style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => navigation.navigate('Notifications')}
          >
            <MaterialCommunityIcons name="bell-outline" size={22} color={colors.text} />
            {notificationCount > 0 && (
              <View style={[styles.badge, { backgroundColor: '#EF4444' }]}>
                <Text style={styles.badgeText}>{notificationCount > 9 ? '9+' : notificationCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>
    </View>
  );
};

export const CustomDrawerContent = (props) => {
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const avatarUri = getMediaUrl(user?.avatar);
  const isProvider = user?.role?.toUpperCase() === 'PROVIDER' && user?.providerProfile?.profileMode !== 'PERSONAL';

  const handleLogout = () => {
    if (logout) logout();
  };

  // Determine active route
  const activeRouteName = props.state?.routeNames[props.state?.index] || 'MainTabs';
  const menuItems = [
    { route: 'MainTabs', label: 'Home', icon: 'home-outline', color: '#0D9488' },
    { route: 'Wallet', label: isProvider ? 'Coin Balance' : 'My Wallet', icon: isProvider ? 'database-outline' : 'wallet-outline', color: '#0D9488' },
    { route: 'Invitation', label: 'Invite Friends', icon: 'gift-outline', color: '#6366F1' },
    ...(isProvider ? [
      { route: 'Stats', label: 'My Stats', icon: 'chart-bar', color: '#2563EB' },
      { route: 'Reports', label: 'Reports', icon: 'file-chart-outline', color: '#F59E0B' },
    ] : []),
  ];

  const renderMenuItem = (item) => {
    const active = activeRouteName === item.route;
    return (
      <TouchableOpacity
        key={item.route}
        style={[
          styles.customMenuItem,
          active ? [styles.activeCapsule, { backgroundColor: isDarkMode ? 'rgba(13,148,136,0.18)' : '#E6F2F2' }] : null
        ]}
        onPress={() => props.navigation.navigate(item.route)}
      >
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name={item.icon} size={22} color={active ? '#0D9488' : item.color} />
        </View>
        <Text
          style={[
            styles.menuLabelText,
            {
              color: active ? (isDarkMode ? '#99F6E4' : '#0A5F59') : colors.text,
              fontWeight: active ? '800' : '700'
            }
          ]}
        >
          {item.label}
        </Text>
        {!active && (
          <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} style={{ marginLeft: 'auto' }} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <DrawerContentScrollView
      {...props}
      scrollEnabled={true}
      style={{ backgroundColor: 'transparent' }}
      contentContainerStyle={{ flexGrow: 1, backgroundColor: 'transparent' }}
    >
      <View style={{ 
        flex: 1, 
        backgroundColor: isDarkMode ? '#0F172A' : '#FFF',
        borderTopRightRadius: 24,
        borderBottomRightRadius: 24,
        borderRightWidth: 1.5,
        borderRightColor: isDarkMode ? '#1E293B' : '#E2E8F0',
        borderTopWidth: 1.5,
        borderTopColor: isDarkMode ? '#1E293B' : '#E2E8F0',
        borderBottomWidth: 1.5,
        borderBottomColor: isDarkMode ? '#1E293B' : '#E2E8F0',
        overflow: 'hidden'
      }}>
      {/* Profile Header */}
      <View style={[styles.drawerHeader, { backgroundColor: isDarkMode ? '#0F172A' : '#FFF' }]}>
        <View style={styles.drawerAvatarWrap}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.drawerAvatar} />
          ) : (
            <View style={[styles.drawerAvatarFallback, { backgroundColor: isDarkMode ? '#1E293B' : '#E2E8F0' }]}>
              <Text style={[styles.drawerAvatarInitial, { color: '#0D9488' }]}>{(user?.fullName || 'N').charAt(0)}</Text>
            </View>
          )}
          <View style={styles.drawerOnlineDot} />
        </View>
        <Text style={[styles.drawerName, { color: colors.text }]}>{user?.fullName || 'Nounga Joseph'}</Text>
        <Text style={[styles.drawerEmail, { color: isDarkMode ? '#94A3B8' : '#64748B' }]}>{user?.email || 'noungajoseph58@gmail.com'}</Text>
      </View>

      {/* Menu Items */}
      <View style={styles.drawerMenuSection}>
        {menuItems.map(renderMenuItem)}

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: isDarkMode ? '#1E293B' : '#E2E8F0' }]} />

        {/* Dark Mode Toggle */}
        <View style={styles.darkModeRow}>
          <View style={[styles.iconContainer, { backgroundColor: '#EEF2FF' }]}>
            <MaterialCommunityIcons name="weather-night" size={22} color="#6366F1" />
          </View>
          <Text style={[styles.darkModeText, { color: colors.text }]}>Dark Mode</Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: '#E2E8F0', true: '#0D9488' }}
            thumbColor="#FFF"
            style={{ transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }] }}
          />
        </View>
      </View>

      {/* Bottom Section */}
      <View style={styles.drawerBottom}>
        {/* Invite & Earn Card */}
        <TouchableOpacity
          style={[styles.inviteCard, { backgroundColor: isDarkMode ? '#115E59' : '#E6F2F2', borderColor: isDarkMode ? '#0D9488' : '#B2DFDB' }]}
          onPress={() => props.navigation.navigate('Invitation')}
          activeOpacity={0.8}
        >
          {/* Gift Box Icon */}
          <View style={styles.giftIconContainer}>
            <MaterialCommunityIcons name="gift" size={28} color="#0D9488" />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[styles.inviteTitle, { color: isDarkMode ? '#F8FAFC' : '#0F172A' }]}>Invite & Earn</Text>
            <Text style={[styles.inviteSub, { color: isDarkMode ? '#CCFBF1' : '#64748B' }]}>
              Invite a friend and earn <Text style={{ fontWeight: '800', color: '#0D9488' }}>1 coin</Text>
            </Text>
          </View>
          <View style={styles.inviteArrowCircle}>
            <MaterialCommunityIcons name="chevron-right" size={16} color="#0D9488" />
          </View>
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        {/* Footer */}
        <Text style={[styles.footerText, { color: '#64748B' }]}>Fixam © 2025 • v1.0.4</Text>
      </View>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  // Header
  header: {
    height: Platform.OS === 'ios' ? 100 : 80 + (StatusBar.currentHeight || 0),
    paddingTop: Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight || 20) + 8,
    paddingHorizontal: 16,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  headerTitle: { fontSize: 17, fontWeight: '800', flex: 1, textAlign: 'center', marginHorizontal: 8 },
  iconBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1, position: 'relative' },
  rightSlot: { width: 40, alignItems: 'flex-end' },
  badge: { position: 'absolute', top: -3, right: -3, minWidth: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#FFF', paddingHorizontal: 2 },
  badgeText: { color: '#FFF', fontSize: 9, fontWeight: '900' },

  // Drawer Header
  drawerHeader: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 20 : 60,
    paddingBottom: 20,
  },
  drawerAvatarWrap: { 
    position: 'relative', 
    width: 76, 
    height: 76, 
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  drawerAvatar: { width: 76, height: 76, borderRadius: 38, borderWidth: 3, borderColor: '#FFF' },
  drawerAvatarFallback: { width: 76, height: 76, borderRadius: 38, borderWidth: 3, borderColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
  drawerAvatarInitial: { fontSize: 30, fontWeight: '900' },
  drawerOnlineDot: { 
    position: 'absolute', 
    bottom: 2, 
    right: 2, 
    width: 16, 
    height: 16, 
    borderRadius: 8, 
    backgroundColor: '#22C55E', 
    borderWidth: 3, 
    borderColor: '#FFF', 
    zIndex: 10 
  },
  drawerName: { fontSize: 20, fontWeight: '800', marginBottom: 2, color: '#0F172A' },
  drawerEmail: { fontSize: 13, fontWeight: '500' },

  // Drawer Menu
  drawerMenuSection: { flex: 1, paddingTop: 8 },
  divider: { height: 1, marginHorizontal: 20, marginVertical: 14 },

  // Custom Menu Row
  customMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 16,
  },
  activeCapsule: {
    backgroundColor: '#E6F2F2',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIconContainer: {
    backgroundColor: '#FFF',
  },
  inactiveIconContainer: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  menuLabelText: {
    fontSize: 15,
    marginLeft: 14,
  },

  // Dark Mode Row
  darkModeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  darkModeText: { fontSize: 15, fontWeight: '700', flex: 1, marginLeft: 14 },

  // Bottom Section
  drawerBottom: { 
    paddingHorizontal: 20, 
    paddingBottom: 24, 
    marginTop: 32 
  },

  // Invite Card
  inviteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
  },
  giftIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inviteTitle: { fontSize: 15, fontWeight: '800', marginBottom: 2 },
  inviteSub: { fontSize: 12, lineHeight: 16 },
  inviteArrowCircle: { 
    width: 28, 
    height: 28, 
    borderRadius: 14, 
    backgroundColor: '#99F6E4', 
    alignItems: 'center', 
    justifyContent: 'center',
    marginLeft: 8
  },

  // Logout
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#FEE2E2',
    borderRadius: 16,
    marginBottom: 16,
  },
  logoutText: { fontSize: 15, fontWeight: '800', color: '#EF4444' },

  // Footer
  footerText: { fontSize: 12, textAlign: 'center', fontWeight: '500' },
});
