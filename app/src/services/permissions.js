import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const PERMISSIONS_KEY = 'fixam:native-permissions-requested:v1';

export const requestStartupPermissions = async () => {
  const alreadyAsked = await AsyncStorage.getItem(PERMISSIONS_KEY);
  if (alreadyAsked === 'yes') return;

  try {
    const isExpoGo = Constants.appOwnership === 'expo';
    if (Device.isDevice && !isExpoGo) {
      const notificationStatus = await Notifications.getPermissionsAsync();
      if (!notificationStatus.granted) {
        await Notifications.requestPermissionsAsync({
          ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
          },
        });
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Fixam',
          importance: Notifications.AndroidImportance.DEFAULT,
        });
      }
    }

    const locationStatus = await Location.getForegroundPermissionsAsync();
    if (!locationStatus.granted) {
      await Location.requestForegroundPermissionsAsync();
    }
  } finally {
    await AsyncStorage.setItem(PERMISSIONS_KEY, 'yes').catch(() => {});
  }
};
