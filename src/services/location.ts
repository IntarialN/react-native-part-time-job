import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import type {Coordinates} from '../types';

export type LocationPermissionStatus = 'granted' | 'denied' | 'blocked';

const requestAndroidPermission = async (): Promise<LocationPermissionStatus> => {
  const result = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: 'Доступ к геолокации',
      message: 'Приложению нужен доступ к геопозиции для поиска ближайших смен.',
      buttonPositive: 'Разрешить',
      buttonNegative: 'Запретить',
    },
  );

  if (result === PermissionsAndroid.RESULTS.GRANTED) {
    return 'granted';
  }

  if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    return 'blocked';
  }

  return 'denied';
};

const requestIOSPermission = async (): Promise<LocationPermissionStatus> => {
  const status = await Geolocation.requestAuthorization('whenInUse');

  switch (status) {
    case 'granted':
      return 'granted';
    case 'denied':
      return 'denied';
    default:
      return 'blocked';
  }
};

export const requestLocationPermission = async (): Promise<LocationPermissionStatus> => {
  if (Platform.OS === 'android') {
    return requestAndroidPermission();
  }

  return requestIOSPermission();
};

export const getCurrentCoordinates = async (): Promise<Coordinates> =>
  new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => {
        reject(new Error(error.message));
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        forceRequestLocation: true,
      },
    );
  });
