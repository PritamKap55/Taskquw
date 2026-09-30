import React from "react";

import { getThemeColors } from "../app/color";

import ListLayoutView from "../components/ListLayoutView";

import { useListLayout } from "../hooks/useListLayout";

type LayoutProps = {
  template: string;
  layout: string;
  userEmail: any;
  login: any;
};

export default function ListLayout({
  template,
  layout,
  userEmail,
  login,
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
    userEmail,
    login,
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
      setOpenNoteIndex={setOpenNoteIndex}

      loading={loading}

      bgbodyColor={bgbodyColor}
      gradientConfig={gradientConfig}
      gradientLeafbtn={gradientLeafbtn}

      handleChange={handleChange}
      submit={submit}
      deleteRow={deleteRow}


      sheetId={String(
        params?.id ?? ""
      )} userEmail={userEmail} login={login} />
  );
}