// sharefile.tsx

import React from "react";

import ShareFileView from "../components/ShareFileView";
import { useShareFile } from "../hooks/useShareFile";
import { useThemeColors } from "../styles/color";

export default function ShareFile() {
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

      role={role}
      setRole={setRole}

      sharedUsers={sharedUsers}
      loading={loading}

      bgbodyColor={bgbodyColor}
      bglabelColor={bglabelColor}
      gradientConfig={gradientConfig}
      gradientLeafbtn={gradientLeafbtn}
      oppositeColor={oppositeColor}

      onShare={handleShareFile}
    />
  );
}