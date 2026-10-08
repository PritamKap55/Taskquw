// createsheet.tsx

import React from "react";
import CreateSheetView from "../components/CreateSheetView";
import { useCreateSheet } from "../hooks/useCreateSheet";

export default function CreateSheet() {
  const createSheet = useCreateSheet();

  return (
    <CreateSheetView
      fileName={createSheet.fileName}
      setFileName={createSheet.setFileName}
      index={createSheet.index}
      setIndex={createSheet.setIndex}
      width={createSheet.width}
      loading={createSheet.loading}
      bgbodyColor={createSheet.bgbodyColor}
      gradientConfig={createSheet.gradientConfig}
      bglabelColor={createSheet.bglabelColor}
      oppositeColor={createSheet.oppositeColor}
      gradientLeafbtn={createSheet.gradientLeafbtn}
      onCreate={createSheet.getOrCreateFile}
    />
  );
}