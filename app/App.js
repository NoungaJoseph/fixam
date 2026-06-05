import React, { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { theme } from './src/services/theme';
import { AuthProvider } from './src/context/AuthContext';
import { SocketProvider } from './src/context/SocketContext';
import { AppProvider } from './src/context/AppContext';
import { LanguageProvider } from './src/context/LanguageContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { useAuth } from './src/context/AuthContext';
import { NavigationStateProvider } from './src/context/NavigationStateContext';
import AppNavigator from './src/navigation/AppNavigator';
import CallModal from './src/components/CallModal';
import SupportChatButton from './src/components/SupportChatButton';
import BiometricLockScreen from './src/components/BiometricLockScreen';
import * as SecureStore from 'expo-secure-store';
import * as Sentry from '@sentry/react-native';

import notificationService from './src/services/notificationService';

Sentry.init({
  dsn: 'https://abc@o123.ingest.sentry.io/456',
  tracesSampleRate: 1.0,
});

const AppChrome = () => {
  const { isDarkMode } = useTheme();
  const { user, token, isRestoring, logout } = useAuth();
  const [locked, setLocked] = useState(false);
  const backgroundAtRef = useRef(null);

  useEffect(() => {
    if (user && token) {
      notificationService.initialize().catch(console.error);
    }
  }, [user, token]);

  useEffect(() => {
    let cancelled = false;
    const checkInitialLock = async () => {
      if (isRestoring || !user) return;
      const biometricEnabled = await SecureStore.getItemAsync('biometric_enabled');
      const storedToken = await SecureStore.getItemAsync('authToken');
      if (!cancelled && biometricEnabled === 'true' && storedToken) {
        setLocked(true);
      }
    };
    checkInitialLock().catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [isRestoring, user]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (state) => {
      if (state === 'background') {
        backgroundAtRef.current = Date.now();
        return;
      }
      if (state === 'active' && user && token && backgroundAtRef.current) {
        const elapsed = Date.now() - backgroundAtRef.current;
        backgroundAtRef.current = null;
        if (elapsed > 30000) {
          const biometricEnabled = await SecureStore.getItemAsync('biometric_enabled');
          if (biometricEnabled === 'true') setLocked(true);
        }
      }
    });
    return () => subscription.remove();
  }, [token, user]);

  if (locked && user) {
    return <BiometricLockScreen user={user} onUnlock={() => setLocked(false)} onUsePassword={() => { setLocked(false); logout(); }} />;
  }

  return (
    <>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} backgroundColor={isDarkMode ? '#0B1120' : '#F8FAFC'} />
      <AppNavigator />
      <SupportChatButton />
      <CallModal />
    </>
  );
};

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <LanguageProvider>
            <ThemeProvider>
              <AuthProvider>
                <SocketProvider>
                  <AppProvider>
                    <NavigationStateProvider>
                      <AppChrome />
                    </NavigationStateProvider>
                  </AppProvider>
                </SocketProvider>
              </AuthProvider>
            </ThemeProvider>
          </LanguageProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default Sentry.wrap(App);
