import React from "react";

import { useThemeColors } from "./color";

import TreeLayoutView from "../components/TreeLayoutView";

import { useTreeLayout } from "../hooks/useTreeLayout";

type LayoutProps = {
  template: string;
  layout: string;
  headtext: string;
  userEmail: any;
  login: any;
};

export default function TreeLayout({
  template,
  layout,
  headtext,
  userEmail,
  login,
}: LayoutProps) {
  const {
    loading,

    nodetext,
    setNodetext,

    selectnodetext,

    openNodes,
    treeData,

    handleNodePress,
    toggleNode,

    handleAddRoot,
    handleAddChild,
    handleDelete,
  } = useTreeLayout({
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
    bglabelColor,
    gradientLeafbtn,
  } = useThemeColors();

  return (
    <TreeLayoutView
      template={template}
      layout={layout}
      headtext={headtext}
      hue={hue}
      setHue={setHue}
      bgColor={bgColor}
      bgbodyColor={bgbodyColor}
      bglabelColor={bglabelColor}

      gradientConfig={gradientConfig}
      gradientLeafbtn={gradientLeafbtn}

      loading={loading}

      treeData={treeData}

      selectnodetext={selectnodetext}

      nodetext={nodetext}
      userEmail={userEmail} 
      login={login}
      setNodetext={setNodetext}

      openNodes={openNodes}

      handleNodePress={
        handleNodePress
      }

      toggleNode={toggleNode}

      handleAddRoot={
        handleAddRoot
      }

      handleAddChild={
        handleAddChild
      }

      handleDelete={
        handleDelete
      }
    />
  );
}