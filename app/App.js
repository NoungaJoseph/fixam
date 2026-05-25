import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { theme } from './src/services/theme';
import { AuthProvider } from './src/context/AuthContext';
import { SocketProvider } from './src/context/SocketContext';
import { AppProvider } from './src/context/AppContext';
import { LanguageProvider } from './src/context/LanguageContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { NavigationStateProvider } from './src/context/NavigationStateContext';
import AppNavigator from './src/navigation/AppNavigator';
import CallModal from './src/components/CallModal';
import SupportChatButton from './src/components/SupportChatButton';

export default function App() {
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
                      <StatusBar style="auto" />
                      <AppNavigator />
                      <SupportChatButton />
                      <CallModal />
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
