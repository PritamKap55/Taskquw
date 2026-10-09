// createsheet.tsx

import React from "react";
import CreateSheetView from "../components/CreateSheetView";
import { useCreateSheet } from "../hooks/useCreateSheet";
import { useThemeColors } from "../styles/color";

export default function CreateSheet() {
  const createSheet = useCreateSheet();

  const ThemeColors = useThemeColors();

  return (
    <CreateSheetView
      fileName={createSheet.fileName}
      setFileName={createSheet.setFileName}
      index={createSheet.index}
      setIndex={createSheet.setIndex}
      width={createSheet.width}
      loading={createSheet.loading}
      bgbodyColor={ThemeColors.bgbodyColor}
      gradientConfig={ThemeColors.gradientConfig}
      bglabelColor={ThemeColors.bglabelColor}
      oppositeColor={ThemeColors.oppositeColor}
      gradientLeafbtn={ThemeColors.gradientLeafbtn}
      onCreate={createSheet.getOrCreateFile}
      hue={ThemeColors.hue}
      setHue={ThemeColors.setHue}
      bgColor={ThemeColors.bgColor}
      login={createSheet.login}
    />
  );
}