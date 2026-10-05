import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export const useThemeColors = () => {
  const [hue, setHue] = useState(0);

  const bgbodyColor = `hsl(${hue}, 100%, 95%)`;
  const bgF1Color = `hsl(${hue}, 100%, 94%)`;
  const bgF2Color = `hsl(${hue}, 100%, 75%)`;
  const bgF3Color = `hsl(${hue}, 100%, 27%)`;
  const bgF4Color = `hsl(${hue}, 100%, 90%)`;
  const bgColor = `hsl(${hue}, 100%, 27%)`;
  const bglabelColor = `hsl(${hue}, 50%, 26%)`;

  const oppositeHue = (hue + 180) % 360;

  const oppositeColor = `hsl(${oppositeHue}, 100%, 20%)`;
  const oppositeColor1 = `hsl(${oppositeHue}, 100%, 30%)`;
  const oppositeColor2 = `hsl(${oppositeHue}, 100%, 30%)`;
  const oppositeColor3 = `hsl(${(hue - 77 + 360) % 360}, 100%, 50%)`;
  const oppositeColor4 = `hsl(${(hue + 270) % 360}, 100%, 40%)`;

  const gradientConfig = {
    colors: [bgF1Color, bgF2Color, bgF3Color] as const,
    locations: [0, 0.5, 1] as const,
  };

  const gradientLeafbtn = {
    colors: [oppositeColor3, bgColor] as const,
    locations: [0, 1] as const,
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  };

  const loadHue = async (): Promise<void> => {
    try {
      const savedValue =
        await AsyncStorage.getItem("myHue");

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

  return {
    hue,
    setHue,
    bgbodyColor,
    bgF1Color,
    bgF2Color,
    bgF3Color,
    bgF4Color,
    bgColor,
    gradientConfig,
    bglabelColor,
    oppositeColor,
    oppositeColor1,
    oppositeColor2,
    oppositeColor3,
    oppositeColor4,
    gradientLeafbtn,
  };
};