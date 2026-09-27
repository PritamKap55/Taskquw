import AsyncStorage from "@react-native-async-storage/async-storage";

export const getSheetsCacheKey = (email: string) => {
  return `${email}Account`;
};

export const saveAccount = async (
  email: string,
  files: any[]
): Promise<void> => {
  try {
    const key = getSheetsCacheKey(email+"Account");

    await AsyncStorage.setItem(
      key,
      JSON.stringify(files)
    );

    console.log("Sheets saved to device");
  } catch (error) {
    console.error("Error saving sheets:", error);
  }
};

export const getAccount = async (
  email: string
): Promise<any[]> => {
  try {
    const key = getSheetsCacheKey(email+"Account");

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