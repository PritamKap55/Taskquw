// tablelayoutedit.tsx

import React from "react";

import TableLayoutEditView from "../components/TableLayoutEditView";

import { useTableLayoutEdit } from "../hooks/useTableLayoutEdit";

import { useLocalSearchParams } from "expo-router";
import { useThemeColors } from "../styles/color";


export default function TableLayoutEdit() {


    const params = useLocalSearchParams();

    const login = String(params.login ?? "");
    const userEmail = String(params.userEmail ?? "");
    const headtext = String(params.headtext ?? "");
    const canEdit = String(params.canEdit ?? "");
    const template = String(params.template ?? "");

    const { formData, selectedId, handleChange, addColumn, deleteColumn, submit,
    } = useTableLayoutEdit({ userEmail, login, });

    const ThemeColors = useThemeColors();

    return (
        <TableLayoutEditView
            formData={formData}
            selectedId={selectedId}
            bgbodyColor={ThemeColors.bgbodyColor}
            bglabelColor={ThemeColors.bglabelColor}
            gradientConfig={ThemeColors.gradientConfig}
            gradientLeafbtn={ThemeColors.gradientLeafbtn}
            handleChange={handleChange}
            addColumn={addColumn}
            deleteColumn={deleteColumn}
            submit={submit}
            hue={ThemeColors.hue}
            setHue={ThemeColors.setHue}
            bgColor={ThemeColors.bgColor}
            login={login}
            headtext={headtext}
            userEmail={userEmail}
            canEdit={canEdit}
            template={template}
        />
    );
}