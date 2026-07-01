import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import ListLayout from './listlayout';
import TableLayout from './tablelayout';
import TreeLayout from './treelayout';

export default function DetailsPage() {
  const [files, setFiles] = useState<any>(null);
  const params = useLocalSearchParams();

  
  
  return (
    <>
      {params.layout?.includes("List") && (
        <ListLayout  />
      )}
      {params.layout === "Tree" && (
        <TreeLayout />
      )}
      {params.layout === "Table" && (
        <TableLayout />
      )}
    </>
  );
}

