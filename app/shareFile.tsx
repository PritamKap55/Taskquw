// sharefile.tsx

import React from "react";

import { useLocalSearchParams } from "expo-router";
import ShareFileView from "../components/ShareFileView";
import { useShareFile } from "../hooks/useShareFile";
import { useThemeColors } from "../styles/color";

export default function ShareFile() {
  const params = useLocalSearchParams();
  const {
    email,
    setEmail,
    role,
    setRole,
    sharedUsers,
    loading,
    handleShareFile,
  } = useShareFile();

  const {
    hue,
    setHue,
    bgColor,
    bgbodyColor,
    bglabelColor,
    gradientConfig,
    gradientLeafbtn,
    oppositeColor,

  } = useThemeColors();

  return (
    <ShareFileView
      email={email}
      setEmail={setEmail}
      headtext={String(params.headtext ?? "")}
      role={role}
      setRole={setRole}
      sharedUsers={sharedUsers}
      loading={loading}
      bgbodyColor={bgbodyColor}
      bglabelColor={bglabelColor}
      gradientConfig={gradientConfig}
      gradientLeafbtn={gradientLeafbtn}
      oppositeColor={oppositeColor}
      userEmail={params.userEmail}
      login={params.login}
      hue={hue}
      setHue={setHue}
      bgColor={bgColor}
      onShare={handleShareFile}
    />
  );
}