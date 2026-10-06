import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
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


      {params.layout?.includes("List") && (
        <ListLayout template={''} layout={''} headtext={String(params.headtext ?? "")} userEmail={params.email ?? ""} login={params.login ?? ""} />
      )}
      {params.layout === "Tree" && (
        <TreeLayout template={''} layout={''} headtext={String(params.headtext ?? "")} userEmail={params.email ?? ""} login={params.login ?? ""} />
      )}
      {params.layout === "Table" && (
        <TableLayout template={''} layout={''} headtext={String(params.headtext ?? "")} userEmail={params.email ?? ""} login={params.login ?? ""} />
      )}
    </>
  );
}

