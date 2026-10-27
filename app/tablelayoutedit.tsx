// tablelayoutedit.tsx

import React from "react";

import TableLayoutEditView from "../components/TableLayoutEditView";

import { useTableLayoutEdit } from "../hooks/useTableLayoutEdit";

import { useLocalSearchParams } from "expo-router";
import { useThemeColors } from "../styles/color";

type TableLayoutEditProps = {
  template?: string;
  layout: string;
  headtext: string;
  userEmail: any;
  login: any;
  canEdit: string;

};


export default function TableLayoutEdit({headtext,userEmail,login,canEdit,}:TableLayoutEditProps) {
    const params = useLocalSearchParams();
    const {
        formData,
        selectedId,
        handleChange,
        addColumn,
        deleteColumn,
        submit,
    } = useTableLayoutEdit();

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
            />
    );
}