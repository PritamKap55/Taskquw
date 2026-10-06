import AsyncStorage from "@react-native-async-storage/async-storage";
import { ListItem } from "./listLayoutService";

export const getSheetsCacheKey = (email: string) => {
  return `${email}Account`;
};

export const saveInDeviceAccount = async (
  email: string,
  files: any[]
): Promise<void> => {
  try {
    const key = getSheetsCacheKey(email + "Account");

    await AsyncStorage.setItem(
      key,
      JSON.stringify(files)
    );

  } catch (error) {
    console.error("Error saving sheets:", error);
  }
};

export const getInDeviceAccount = async (
  email: string
): Promise<any[]> => {
  try {
    const key = getSheetsCacheKey(email + "Account");

    const savedData = await AsyncStorage.getItem(key);

    if (!savedData) {
      return [];
    }

    return JSON.parse(savedData);
  } catch (error) {
    console.error("Error reading sheets:", error);
    return [];
  }
};

export const saveInDeviceLayout = async (
  email: string,
  sheetId: string,
  files: ListItem[]
): Promise<void> => {
  try {
    const key = getSheetsCacheKey(email + sheetId + "Layout");

    await AsyncStorage.setItem(
      key,
      JSON.stringify(files)
    );
  } catch (error) {
    console.error("Error saving sheets:", error);
  }
};


export const getInDeviceLayout = async (
  email: string,
  sheetId: string,
): Promise<any[]> => {
  try {
    const key = getSheetsCacheKey(email + sheetId + "Layout");

    const savedData = await AsyncStorage.getItem(key);
    if (!savedData) {
      return [];
    }

    return JSON.parse(savedData);
  } catch (error) {
    console.error("Error reading sheets:", error);
    return [];
  }
};

export const saveInDeviceTable = async (
  email: string,
  sheetId: string,
  files: ListItem[]
): Promise<void> => {
  try {
    const key = getSheetsCacheKey(email + sheetId + "Layout");

    await AsyncStorage.setItem(
      key,
      JSON.stringify(files)
    );
  } catch (error) {
    console.error("Error saving sheets:", error);
  }
};


export const getInDeviceTable = async (
  email: string,
  sheetId: string,
): Promise<any[]> => {
  try {
    const key = getSheetsCacheKey(email + sheetId + "Layout");

    const savedData = await AsyncStorage.getItem(key);
    if (!savedData) {
      return [];
    }

    return JSON.parse(savedData);
  } catch (error) {
    console.error("Error reading sheets:", error);
    return [];
  }
};

export const saveInDevicetree = async (
  email: string,
  sheetId: string,
  files: ListItem[]
): Promise<void> => {
  try {
    const key = getSheetsCacheKey(email + sheetId + "Layout");

    await AsyncStorage.setItem(
      key,
      JSON.stringify(files)
    );
  } catch (error) {
    console.error("Error saving sheets:", error);
  }
};


export const getInDeviceTree = async (
  email: string,
  sheetId: string,
): Promise<any[]> => {
  try {
    const key = getSheetsCacheKey(email + sheetId + "Layout");

    const savedData = await AsyncStorage.getItem(key);

    if (!savedData) {
      return [];
    }

    return JSON.parse(savedData);
  } catch (error) {
    console.error("Error reading sheets:", error);
    return [];
  }
};