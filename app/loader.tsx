import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useThemeColors  } from "../styles/color";
import { styles } from "../styles/styles";

interface LoaderProps {
  visible?: boolean;
  color?: string;
}

const Loader = ({ visible = false }: LoaderProps) => {

  const { oppositeColor } = useThemeColors();

  if (!visible) return null;
  return (
    <View style={styles.loaderOverlay}>
      <ActivityIndicator size="large" color={oppositeColor} />
    </View>
  );
};

export default Loader;