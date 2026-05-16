import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import ProviderTabNavigator from './ProviderTabNavigator';
import { useTheme } from '../context/ThemeContext';
import { View, ActivityIndicator } from 'react-native';
import { COLORS } from '../services/theme';

const AppNavigator = () => {
  const { user, isLoading, isRestoring } = useAuth();
  const { colors } = useTheme();

  if (isLoading || isRestoring) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!user ? (
        <AuthNavigator />
      ) : (user.role?.toUpperCase() === 'PROVIDER' && user.providerProfile?.profileMode !== 'PERSONAL') ? (
        <ProviderTabNavigator />
      ) : (
        <TabNavigator />
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
