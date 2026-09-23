import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { getThemeColors } from "./color";
import { styles } from "./styles";

interface LoaderProps {
  visible?: boolean;
  color?: string;
}

const Loader = ({ visible = false }: LoaderProps) => {

  const [hue, setHue] = useState(0);
  const { oppositeColor } = getThemeColors(hue);



  const loadHue = async () => {

    try {
      const savedValue = await AsyncStorage.getItem('myHue');
      if (savedValue !== null) {
        setHue(parseInt(savedValue, 10));
      }

    } catch (error) {
      console.error("Error loadHue", error);
    }
  };

  useEffect(() => {
    loadHue();
  }, []);

  if (!visible) return null;

  return (
    <View style={styles.loaderOverlay}>
      <ActivityIndicator size="large" color={oppositeColor} />
    </View>
  );
};


export default Loader;