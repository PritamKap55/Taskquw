// tablelayoutedit.tsx

import React from "react";

import TableLayoutEditView from "../components/TableLayoutEditView";

import { useTableLayoutEdit } from "../hooks/useTableLayoutEdit";

import { useThemeColors } from "../styles/color";

export default function TableLayoutEdit() {
    const {
        formData,
        selectedId,

        handleChange,
        addColumn,
        deleteColumn,
        submit,
    } = useTableLayoutEdit();

    const {
        bgbodyColor,
        gradientConfig,
        bglabelColor,
        gradientLeafbtn,
    } = useThemeColors();

    return (
        <TableLayoutEditView
            formData={formData}
            selectedId={selectedId}

            bgbodyColor={bgbodyColor}
            bglabelColor={bglabelColor}
            gradientConfig={gradientConfig}
            gradientLeafbtn={gradientLeafbtn}

            handleChange={handleChange}
            addColumn={addColumn}
            deleteColumn={deleteColumn}
            submit={submit}
        />
    );
}