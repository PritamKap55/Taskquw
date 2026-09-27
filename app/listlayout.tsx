import React from "react";

import { getThemeColors } from "../app/color";

import ListLayoutView from "../components/ListLayoutView";

import { useListLayout } from "../hooks/useListLayout";

type LayoutProps = {
  template: string;
  layout: string;
};

export default function ListLayout({
  template,
  layout,
}: LayoutProps) {

  const {
    hue,
    setHue,

    items,

    openNoteIndex,
    setOpenNoteIndex,

    loading,

    handleChange,
    submit,
    deleteRow,

    params,
  } = useListLayout({
    template,
    layout,
  });

  const {
    bgbodyColor,
    gradientConfig,
    gradientLeafbtn,
  } = getThemeColors(hue);

  return (
    <ListLayoutView
      template={template}
      layout={layout}

      hue={hue}
      setHue={setHue}

      items={items}

      openNoteIndex={openNoteIndex}
      setOpenNoteIndex={
        setOpenNoteIndex
      }

      loading={loading}

      bgbodyColor={bgbodyColor}
      gradientConfig={
        gradientConfig
      }
      gradientLeafbtn={
        gradientLeafbtn
      }

      handleChange={handleChange}
      submit={submit}
      deleteRow={deleteRow}

      sheetId={String(
        params?.id ?? ""
      )}
    />
  );
}