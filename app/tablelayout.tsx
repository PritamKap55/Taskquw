import React from "react";

import TableLayoutView from "../components/TableLayoutView";
import { useTableLayout } from "../hooks/useTableLayout";
import { useThemeColors } from "../styles/color";

type LayoutProps = {
  template?: string;
  layout: string;
  headtext: string;
  userEmail: any;
  login: any;
};

export default function TableLayout({
  template,
  layout,
  headtext,
  userEmail,
  login,
}: LayoutProps) {

  const {
    params,
    items,
    loading,
  } = useTableLayout({
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
    gradientLeafbtn,
    bgbodyColor,
    bgF4Color,
    oppositeColor,
    gradientConfig,
  } = useThemeColors();

  return (
    <TableLayoutView
      template={template}
      layout={layout}
      headtext={headtext}
      hue={hue}
      setHue={setHue}
      params={params}
      items={items}
      bgColor={bgColor}
      bgbodyColor={bgbodyColor}
      bgF4Color={bgF4Color}
      oppositeColor={oppositeColor}
      gradientConfig={gradientConfig}
      gradientLeafbtn={gradientLeafbtn}
      userEmail={userEmail}
      login={login}
    />
  );
}