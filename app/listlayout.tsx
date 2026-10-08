import React from "react";

import { useThemeColors } from "../styles/color";

import ListLayoutView from "../components/ListLayoutView";

import { useListLayout } from "../hooks/useListLayout";

type LayoutProps = {
  template: string;
  layout: string;
  headtext:string;
  userEmail: any;
  login: any;
};

export default function ListLayout({
  template,
  layout,
  headtext,
  userEmail,
  login,
}: LayoutProps) {

  const {
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
    headtext,
    userEmail,
    login,
  });

  const {
    hue,
    setHue,
    bgColor,
    bgbodyColor,
    gradientConfig,
    gradientLeafbtn,
  } = useThemeColors();

  return (
    <ListLayoutView
      template={template}
      layout={layout}
      headtext={headtext}
      hue={hue}
      setHue={setHue}
      items={items}
      openNoteIndex={openNoteIndex}
      setOpenNoteIndex={setOpenNoteIndex}
      loading={loading}
      bgColor={bgColor}
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