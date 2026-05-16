import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useAppContext } from '../context/AppContext';
import { CustomDrawerContent } from './NavigationComponents';

import HomeScreen from '../screens/Home/HomeScreen';
import ProviderListScreen from '../screens/Providers/ProviderListScreen';
import ProviderProfileScreen from '../screens/Providers/ProviderProfileScreen';
import PostTaskScreen from '../screens/Tasks/PostTaskScreen';
import TaskSuccessScreen from '../screens/Tasks/TaskSuccessScreen';
import JobStatusScreen from '../screens/Tasks/JobStatusScreen';
import LiveTaskMapScreen from '../screens/Tasks/LiveTaskMapScreen';
import ChatScreen from '../screens/Chat/ChatScreen';
import ChatListScreen from '../screens/Chat/ChatListScreen';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import ProviderProfileEditItemScreen from '../screens/Dashboard/ProviderProfileEditItemScreen';
import ProviderProfileSectionEditScreen from '../screens/Dashboard/ProviderProfileSectionEditScreen';
import WalletScreen from '../screens/Wallet/WalletScreen';
import RatingScreen from '../screens/Profile/RatingScreen';
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
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="ProviderList" component={ProviderListScreen} />
    <Stack.Screen name="ProviderProfile" component={ProviderProfileScreen} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
    <Stack.Screen name="Chat" component={ChatScreen} />
    <Stack.Screen name="Rating" component={RatingScreen} />
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

const WalletStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="WalletMain" component={WalletScreen} />
    <Stack.Screen name="TopUp" component={TopUpScreen} />
    <Stack.Screen name="TopUpAmount" component={TopUpAmountScreen} />
    <Stack.Screen name="TopUpPayment" component={TopUpPaymentScreen} />
    <Stack.Screen name="TopUpSuccess" component={TopUpSuccessScreen} />
    <Stack.Screen name="CoinPaymentForm" component={CoinPaymentFormScreen} />
    <Stack.Screen name="CoinPaymentSuccess" component={CoinPaymentSuccessScreen} />
  </Stack.Navigator>
);

const TaskStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MyTasksMain" component={PostTaskScreen} />
    <Stack.Screen name="MyJobs" component={PostTaskScreen} />
    <Stack.Screen name="PostTask" component={PostTaskScreen} initialParams={{ startOnPost: true }} />
    <Stack.Screen name="TaskSuccess" component={TaskSuccessScreen} />
    <Stack.Screen name="JobStatus" component={JobStatusScreen} />
    <Stack.Screen name="LiveTaskMap" component={LiveTaskMapScreen} />
    <Stack.Screen name="ProviderProfile" component={ProviderProfileScreen} />
    <Stack.Screen name="Chat" component={ChatScreen} />
    <Stack.Screen name="Rating" component={RatingScreen} />
  </Stack.Navigator>
);

const MessagesStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ChatList" component={ChatListScreen} />
    <Stack.Screen name="Chat" component={ChatScreen} />
    <Stack.Screen name="LiveTaskMap" component={LiveTaskMapScreen} />
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
        const hideTabBar = ['Chat', 'ProviderList', 'ProviderProfile', 'DocUpload', 'Selfie', 'VerificationSuccess', 'TopUpAmount', 'TopUpPayment', 'TopUpSuccess', 'CoinPaymentSuccess'].includes(routeName);
        return {
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.placeholder,
        tabBarStyle: {
          display: hideTabBar ? 'none' : 'flex',
          height: 68, paddingBottom: 9, paddingTop: 8,
          backgroundColor: colors.tabBar, borderTopWidth: 1, borderTopColor: colors.border,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '700' },
      }}}
    >
      <Tab.Screen name="Home" component={HomeStack} options={{ tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "home" : "home-outline"} size={25} color={color} />, title: t('tabs.home') }} />
      <Tab.Screen name="My Tasks" component={TaskStack} options={{ title: 'Tasks', tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "list-circle" : "list-circle-outline"} size={26} color={color} /> }} />
      <Tab.Screen
        name="Create Task"
        component={TaskStack}
        initialParams={{ screen: 'PostTask', params: { startOnPost: true } }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('Create Task', { screen: 'PostTask', params: { startOnPost: true } });
          },
        })}
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.createTabButton, { backgroundColor: colors.accent, borderColor: colors.tabBar, transform: [{ scale: focused ? 1.04 : 1 }] }]}>
              <Ionicons name="add" size={34} color="#FFF" />
            </View>
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen name="Messages" component={MessagesStack} options={{ title: t('tabs.messages'), tabBarBadge: unreadCount > 0 ? unreadCount : null, tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "chatbubble-ellipses" : "chatbubble-ellipses-outline"} size={25} color={color} /> }} />
      <Tab.Screen name="Settings" component={ProfileStack} options={{ title: t('tabs.settings'), tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "menu" : "menu-outline"} size={26} color={color} /> }} />
    </Tab.Navigator>
  );
};

const TabNavigator = () => {
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
          drawerIcon: ({ color }) => <MaterialCommunityIcons name="home-outline" size={24} color={color} />
        }}
      />
      <Drawer.Screen
        name="Wallet"
        component={WalletStack}
        options={{
          drawerLabel: 'My Wallet',
          drawerIcon: ({ color }) => <MaterialCommunityIcons name="wallet-outline" size={24} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Tasks"
        component={TaskStack}
        options={{
          drawerLabel: 'My Tasks',
          drawerIcon: ({ color }) => <MaterialCommunityIcons name="clipboard-text-outline" size={24} color={color} />,
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
    </Drawer.Navigator>
  );
};

export default TabNavigator;

const styles = {
  createTabButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};
