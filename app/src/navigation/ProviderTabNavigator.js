import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useAppContext } from '../context/AppContext';
import { CustomDrawerContent } from './NavigationComponents';

import ProviderHomeScreen from '../screens/Provider/ProviderHomeScreen';
import TaskDetailsScreen from '../screens/Provider/TaskDetailsScreen';
import TaskDiscoveryScreen from '../screens/Provider/TaskDiscoveryScreen';
import MyJobsScreen from '../screens/Provider/MyJobsScreen';
import CoinSystemScreen from '../screens/Provider/CoinSystemScreen';
import ChatScreen from '../screens/Chat/ChatScreen';
import ChatListScreen from '../screens/Chat/ChatListScreen';
import StatsScreen from '../screens/Provider/StatsScreen';
import ReportsScreen from '../screens/Provider/ReportsScreen';
import LiveTaskMapScreen from '../screens/Tasks/LiveTaskMapScreen';
import ReviewTaskScreen from '../screens/Tasks/ReviewTaskScreen';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import ProviderProfileEditItemScreen from '../screens/Dashboard/ProviderProfileEditItemScreen';
import ProviderProfileSectionEditScreen from '../screens/Dashboard/ProviderProfileSectionEditScreen';
import SettingsScreen from '../screens/Profile/SettingsScreen';
import NotificationsScreen from '../screens/Profile/NotificationsScreen';
import NotificationSettingsScreen from '../screens/Profile/NotificationSettingsScreen';
import PrivacySecurityScreen from '../screens/Profile/PrivacySecurityScreen';
import ProfileLanguageScreen from '../screens/Profile/ProfileLanguageScreen';
import FeedbackScreen from '../screens/Profile/FeedbackScreen';
import VerificationScreen from '../screens/Profile/VerificationScreen';
import DocUploadScreen from '../screens/Profile/DocUploadScreen';
import SelfieScreen from '../screens/Profile/SelfieScreen';
import VerificationSuccessScreen from '../screens/Profile/VerificationSuccessScreen';
import HiddenProfileScreen from '../screens/Profile/HiddenProfileScreen';
import ChangePasswordScreen from '../screens/Profile/ChangePasswordScreen';
import HelpCenterScreen from '../screens/Profile/HelpCenterScreen';
import InvitationScreen from '../screens/Profile/InvitationScreen';
import TopUpScreen from '../screens/Wallet/TopUpScreen';
import TopUpAmountScreen from '../screens/Wallet/TopUpAmountScreen';
import TopUpPaymentScreen from '../screens/Wallet/TopUpPaymentScreen';
import TopUpSuccessScreen from '../screens/Wallet/TopUpSuccessScreen';
import CoinPaymentFormScreen from '../screens/Wallet/CoinPaymentFormScreen';
import CoinPaymentSuccessScreen from '../screens/Wallet/CoinPaymentSuccessScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={ProviderHomeScreen} />
    <Stack.Screen name="TaskDiscovery" component={TaskDiscoveryScreen} />
    <Stack.Screen name="TaskDetails" component={TaskDetailsScreen} />
    <Stack.Screen name="LiveTaskMap" component={LiveTaskMapScreen} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
    <Stack.Screen name="Chat" component={ChatScreen} />
  </Stack.Navigator>
);

const JobsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MyJobsMain" component={MyJobsScreen} />
    <Stack.Screen name="MyJobs" component={MyJobsScreen} />
    <Stack.Screen name="TaskDetails" component={TaskDetailsScreen} />
    <Stack.Screen name="LiveTaskMap" component={LiveTaskMapScreen} />
    <Stack.Screen name="Chat" component={ChatScreen} />
    <Stack.Screen name="ReviewTask" component={ReviewTaskScreen} />
  </Stack.Navigator>
);

const WalletStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="CoinSystem" component={CoinSystemScreen} />
    <Stack.Screen name="WalletMain" component={CoinSystemScreen} />
    <Stack.Screen name="TopUp" component={TopUpScreen} />
    <Stack.Screen name="TopUpAmount" component={TopUpAmountScreen} />
    <Stack.Screen name="TopUpPayment" component={TopUpPaymentScreen} />
    <Stack.Screen name="TopUpSuccess" component={TopUpSuccessScreen} />
    <Stack.Screen name="CoinPaymentForm" component={CoinPaymentFormScreen} />
    <Stack.Screen name="CoinPaymentSuccess" component={CoinPaymentSuccessScreen} />
  </Stack.Navigator>
);

const StatsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="StatsMain" component={StatsScreen} />
  </Stack.Navigator>
);

const MessagesStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ChatList" component={ChatListScreen} />
    <Stack.Screen name="Chat" component={ChatScreen} />
    <Stack.Screen name="LiveTaskMap" component={LiveTaskMapScreen} />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SettingsMain" component={SettingsScreen} />
    <Stack.Screen name="UserProfile" component={DashboardScreen} />
    <Stack.Screen name="ProviderProfileEditItem" component={ProviderProfileEditItemScreen} />
    <Stack.Screen name="ProviderProfileSectionEdit" component={ProviderProfileSectionEditScreen} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
    <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
    <Stack.Screen name="PrivacySecurity" component={PrivacySecurityScreen} />
    <Stack.Screen name="LanguageSelection" component={ProfileLanguageScreen} />
    <Stack.Screen name="Feedback" component={FeedbackScreen} />
    <Stack.Screen name="Verification" component={VerificationScreen} />
    <Stack.Screen name="DocUpload" component={DocUploadScreen} />
    <Stack.Screen name="Selfie" component={SelfieScreen} />
    <Stack.Screen name="VerificationSuccess" component={VerificationSuccessScreen} />
    <Stack.Screen name="HiddenProfile" component={HiddenProfileScreen} />
    <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
  </Stack.Navigator>
);

const BottomTabNavigator = () => {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { unreadCount } = useAppContext();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const routeName = getFocusedRouteNameFromRoute(route) ?? route.name;
        const hideTabBar = ['Chat', 'TaskDetails', 'DocUpload', 'Selfie', 'VerificationSuccess', 'TopUpAmount', 'TopUpPayment', 'TopUpSuccess', 'CoinPaymentSuccess'].includes(routeName);
        return {
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.placeholder,
        tabBarStyle: {
          display: hideTabBar ? 'none' : 'flex',
          height: 65, paddingBottom: 10, paddingTop: 10,
          backgroundColor: colors.tabBar, borderTopWidth: 1, borderTopColor: colors.border,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '700' },
      }}}
    >
      <Tab.Screen name="Home" component={HomeStack} options={{ tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "home" : "home-outline"} size={25} color={color} /> }} />
      <Tab.Screen name="My Jobs" component={JobsStack} options={{ title: t('tabs.myJobs'), tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "briefcase" : "briefcase-outline"} size={25} color={color} /> }} />
      <Tab.Screen name="Stats" component={StatsStack} options={{ title: 'Stats', tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "stats-chart" : "stats-chart-outline"} size={25} color={color} /> }} />
      <Tab.Screen name="Messages" component={MessagesStack} options={{ title: t('tabs.messages'), tabBarBadge: unreadCount > 0 ? unreadCount : null, tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "chatbubble-ellipses" : "chatbubble-ellipses-outline"} size={25} color={color} /> }} />
      <Tab.Screen name="Settings" component={ProfileStack} options={{ title: t('tabs.settings'), tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "menu" : "menu-outline"} size={26} color={color} /> }} />
    </Tab.Navigator>
  );
};

const ProviderTabNavigator = () => {
  const { colors } = useTheme();
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: colors.accent + '15',
        drawerActiveTintColor: colors.accent,
        drawerInactiveTintColor: colors.textSecondary,
        drawerLabelStyle: { fontSize: 15, fontWeight: '700', marginLeft: -10 },
        drawerStyle: { width: '75%' },
      }}
    >
      <Drawer.Screen
        name="MainTabs"
        component={BottomTabNavigator}
        options={{
          drawerLabel: 'Home',
          drawerIcon: ({ color }) => <MaterialCommunityIcons name="home-variant-outline" size={24} color={color} />
        }}
      />
      <Drawer.Screen
        name="Jobs"
        component={JobsStack}
        options={{
          drawerLabel: 'My Jobs',
          drawerIcon: ({ color }) => <MaterialCommunityIcons name="briefcase-outline" size={24} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Wallet"
        component={WalletStack}
        options={{
          drawerLabel: 'Coin Balance',
          drawerIcon: ({ color }) => <MaterialCommunityIcons name="database-outline" size={24} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Invitation"
        component={InvitationScreen}
        options={{
          drawerLabel: 'Invite Friends',
          drawerIcon: ({ color }) => <MaterialCommunityIcons name="gift-outline" size={24} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Stats"
        component={StatsScreen}
        options={{
          drawerLabel: 'My Stats',
          drawerIcon: ({ color }) => <MaterialCommunityIcons name="chart-bar" size={24} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Reports"
        component={ReportsScreen}
        options={{
          drawerLabel: 'Reports',
          drawerIcon: ({ color }) => <MaterialCommunityIcons name="file-chart-outline" size={24} color={color} />,
        }}
      />
    </Drawer.Navigator>
  );
};

export default ProviderTabNavigator;
