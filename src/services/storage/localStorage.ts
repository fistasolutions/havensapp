/**
 * Local Storage Service
 * Wrapper around AsyncStorage for type-safe local data storage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Store data in local storage
 */
export const setItem = async <T>(key: string, value: T): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error(`Error storing ${key}:`, error);
    throw error;
  }
};

/**
 * Get data from local storage
 */
export const getItem = async <T>(key: string): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? (JSON.parse(jsonValue) as T) : null;
  } catch (error) {
    console.error(`Error getting ${key}:`, error);
    return null;
  }
};

/**
 * Remove item from local storage
 */
export const removeItem = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key}:`, error);
    throw error;
  }
};

/**
 * Clear all local storage
 */
export const clear = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing storage:', error);
    throw error;
  }
};

/**
 * Get all keys from local storage
 */
export const getAllKeys = async (): Promise<string[]> => {
  try {
    return await AsyncStorage.getAllKeys();
  } catch (error) {
    console.error('Error getting all keys:', error);
    return [];
  }
};

/**
 * Get multiple items from local storage
 */
export const getMultiple = async <T>(
  keys: string[],
): Promise<Record<string, T | null>> => {
  try {
    const items = await AsyncStorage.multiGet(keys);
    const result: Record<string, T | null> = {};
    items.forEach(([key, value]) => {
      result[key] = value != null ? (JSON.parse(value) as T) : null;
    });
    return result;
  } catch (error) {
    console.error('Error getting multiple items:', error);
    return {};
  }
};

/**
 * Set multiple items in local storage
 */
export const setMultiple = async <T>(
  items: Array<[string, T]>,
): Promise<void> => {
  try {
    const keyValuePairs: Array<[string, string]> = items.map(([key, value]) => [
      key,
      JSON.stringify(value),
    ]);
    await AsyncStorage.multiSet(keyValuePairs);
  } catch (error) {
    console.error('Error setting multiple items:', error);
    throw error;
  }
};

