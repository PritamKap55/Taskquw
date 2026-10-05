import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import HeaderComp from '../components/headercomp';
import { useThemeColors } from "./color";
import ListLayout from './listlayout';
import TableLayout from './tablelayout';
import TreeLayout from './treelayout';

export default function DetailsPage() {
  const [files, setFiles] = useState<any>(null);
  const params = useLocalSearchParams();
  const {
    hue,
    setHue,
    bgbodyColor,
    bgColor,
    gradientConfig,
    gradientLeafbtn,
  } = useThemeColors();

  return (
    <>
     
      {/* {template === undefined && ( */}
      <HeaderComp HeaderName="Account" login={params.login} hue={hue} setHue={setHue} bgColor={bgColor} />
      {/* )} */}
      {params.layout?.includes("List") && (
        <ListLayout template={''} layout={''} userEmail={params.email ?? ""} login={params.login ?? ""} />
      )}
      {params.layout === "Tree" && (
        <TreeLayout template={''} />
      )}
      {params.layout === "Table" && (
        <TableLayout template={''} />
      )}
    </>
  );
}

