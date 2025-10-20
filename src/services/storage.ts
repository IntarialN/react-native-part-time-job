import AsyncStorage from '@react-native-async-storage/async-storage';
import type {Shift, Coordinates} from '../types';

type CachedShiftsPayload = {
  shifts: Shift[];
  location: Coordinates | null;
  includeFilled: boolean;
  timestamp: number;
};

const CACHE_KEY = '@handswork/shifts-cache';

export const saveShiftsCache = async (
  payload: CachedShiftsPayload,
): Promise<void> => {
  try {
    const serialized = JSON.stringify(payload);
    await AsyncStorage.setItem(CACHE_KEY, serialized);
  } catch (error) {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.warn('Failed to cache shifts', error);
    }
  }
};

export const readShiftsCache = async (): Promise<CachedShiftsPayload | null> => {
  try {
    const serialized = await AsyncStorage.getItem(CACHE_KEY);
    if (!serialized) {
      return null;
    }

    const parsed = JSON.parse(serialized) as CachedShiftsPayload;
    return parsed;
  } catch (error) {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.warn('Failed to read shifts cache', error);
    }
    return null;
  }
};

export const clearShiftsCache = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(CACHE_KEY);
  } catch (error) {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.warn('Failed to clear shifts cache', error);
    }
  }
};

