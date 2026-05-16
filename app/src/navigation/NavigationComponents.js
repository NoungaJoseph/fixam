import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Platform, StatusBar } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

import { useAppContext } from '../context/AppContext';

export const CustomHeader = ({ navigation, title, colors }) => {
  const { user } = useAuth();
  const { notificationCount } = useAppContext();
  
  // Top-level screens that should show the Menu button
  const isRootScreen = [
    'Dashboard', 'Home', 'My Wallet', 'My Tasks', 'My Jobs', 
    'Coin Balance', 'Messages', 'Settings', 'Invite Friends',
    'My Stats', 'Reports'
  ].includes(title);
  
  const isHome = title === 'Dashboard' || title === 'Home';
  
  // Logic to show Welcome text only on Home
  const displayTitle = isHome 
    ? `Welcome, ${user?.fullName ? user.fullName.split(' ')[0] : 'User'}` 
    : title;

  // Logic to show Notification Bell only on Home/Dashboard
  const showNotification = isHome;

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.openDrawer();
    }
  };

  return (
    <View style={[
      styles.header, 
      { 
        backgroundColor: colors.background, 
        borderBottomColor: isRootScreen ? 'transparent' : colors.border, 
        borderBottomWidth: isRootScreen ? 0 : 1 
      }
    ]}>
      {/* Left side: Menu or Back button */}
      <TouchableOpacity onPress={() => isRootScreen ? navigation.openDrawer() : handleBack()} style={styles.menuBtn}>
        <MaterialCommunityIcons 
          name={isRootScreen ? "menu" : "arrow-left"} 
          size={isRootScreen ? 28 : 26} 
          color={colors.primary} 
        />
      </TouchableOpacity>

      <Text style={[styles.headerTitle, { color: colors.text }]}>{displayTitle}</Text>

      {/* Right side: Notification Bell or Empty space */}
      <View style={styles.rightSlot}>
        {showNotification ? (
          <TouchableOpacity 
            onPress={() => navigation.navigate('Notifications')} 
            style={styles.menuBtn}
          >
            <MaterialCommunityIcons name="bell-outline" size={24} color={colors.primary} />
            {notificationCount > 0 && (
              <View style={[styles.notiBadge, { backgroundColor: colors.accent }]}>
                <Text style={styles.notiBadgeText}>{notificationCount > 9 ? '9+' : notificationCount}</Text>
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
  const { user } = useAuth();

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.drawerHeader, { borderBottomColor: colors.border }]}>
        <View style={[styles.drawerAvatar, { backgroundColor: colors.accent + '20', justifyContent: 'center', alignItems: 'center' }]}>
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.drawerAvatar} />
          ) : (
            <Text style={{ fontSize: 24, fontWeight: '800', color: colors.accent }}>{user?.fullName?.charAt(0) || 'U'}</Text>
          )}
        </View>
        <View>
          <Text style={[styles.drawerName, { color: colors.text }]}>{user?.fullName || 'User'}</Text>
          {user?.pendingName && (
            <Text style={{ fontSize: 10, color: colors.accent, fontWeight: '700' }}>Verification Pending...</Text>
          )}
        </View>
        <Text style={[styles.drawerEmail, { color: colors.textSecondary }]}>{user?.email || user?.phone || 'fixam@user.com'}</Text>
      </View>

      <View style={styles.drawerItems}>
        <DrawerItemList {...props} />
        
        <View style={[styles.drawerDivider, { backgroundColor: colors.border }]} />
        
        <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
          <MaterialCommunityIcons 
            name={isDarkMode ? "weather-sunny" : "weather-night"} 
            size={22} 
            color={colors.primary} 
          />
          <Text style={[styles.themeToggleText, { color: colors.text }]}>
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ padding: 25, borderTopWidth: 1, borderTopColor: colors.border }}>
        <Text style={{ fontSize: 11, color: colors.textSecondary, textAlign: 'center' }}>Fixam © 2026</Text>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    height: Platform.OS === 'ios' ? 100 : 90 + (StatusBar.currentHeight || 0),
    paddingTop: Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight || 20) + 10,
    paddingHorizontal: 20,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: Platform.OS === 'ios' ? '800' : '700',
    textAlignVertical: 'center',
  },
  menuBtn: { padding: 5, minWidth: 40, alignItems: 'center' },
  rightSlot: { minWidth: 40, alignItems: 'flex-end' },
  notiBadge: { 
    position: 'absolute', top: 2, right: 4, 
    minWidth: 16, height: 16, borderRadius: 8, 
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1.5, borderColor: '#FFF',
    paddingHorizontal: 2
  },
  notiBadgeText: { color: '#FFF', fontSize: 9, fontWeight: '900' },
  drawerHeader: { padding: 30, paddingTop: 50, borderBottomWidth: 1 },
  drawerAvatar: { width: 70, height: 70, borderRadius: 25, marginBottom: 15 },
  drawerName: { fontSize: 18, fontWeight: '800' },
  drawerEmail: { fontSize: 14, marginTop: 4 },
  drawerItems: { flex: 1, paddingTop: 20 },
  drawerDivider: { height: 1, marginVertical: 20, marginHorizontal: 20 },
  themeToggle: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10, gap: 15 },
  themeToggleText: { fontSize: 15, fontWeight: '700' },
});
