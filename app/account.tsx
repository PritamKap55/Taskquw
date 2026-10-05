import React from "react";
import AccountView from "../components/AccountView";
import { useAccount } from "../hooks/useAccount";
import { useThemeColors } from "./color";

export default function Account() {

    const {
        files,
        selectedFile,
        setSelectedFile,
        sheetStatus,
        loading,
        userEmail,
        login,
    } = useAccount();

    const {
        hue,
        setHue,
        bgbodyColor,
        bgColor,
        gradientConfig,
        gradientLeafbtn,
    } = useThemeColors();

    return (
        <AccountView
            files={files}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            hue={hue}
            setHue={setHue}
            sheetStatus={sheetStatus}
            loading={loading}
            bgbodyColor={bgbodyColor}
            bgColor={bgColor}
            gradientConfig={gradientConfig}
            gradientLeafbtn={gradientLeafbtn}
            userEmail={userEmail}
            login={login}
        />
    );
}