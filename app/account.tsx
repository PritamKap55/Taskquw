import React from "react";
import { getThemeColors } from "./color";
import AccountView from "../components/AccountView";
import { useAccount } from "../hooks/useAccount";

export default function Account() {

    const {
        files,
        selectedFile,
        setSelectedFile,
        hue,
        setHue,
        sheetStatus,
        loading,
    } = useAccount();

    const {
        bgbodyColor,
        bgColor,
        gradientConfig,
        gradientLeafbtn,
    } = getThemeColors(hue);

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
        />
    );
}