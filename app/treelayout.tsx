import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { router, useLocalSearchParams } from "expo-router";

import { LinearGradient } from "expo-linear-gradient";
import { getAccessToken } from "./googleAuth";
import HeaderComp from "./headercomp";
import { gradientLeafbtn, styles } from "./styles";
import TreeView from "./treeview";

type TreeNodeType = {
  id: number;
  name: string;
  parent: number;
  rowNumber: number;
  children: TreeNodeType[];
};

const TreeLayout = () => {
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [hue, setHue] = useState(0);
  const bgbodyColor = `hsl(${hue}, 100%, 95%)`;
  const bgF1Color = `hsl(${hue}, 100%, 94%)`;
  const bgF2Color = `hsl(${hue}, 100%, 75%)`;
  const bgF3Color = `hsl(${hue}, 100%, 27%)`;

  const gradientConfig: {
    colors: readonly [string, string, string];
    locations: readonly [number, number, number];
  } = {
    colors: [bgF1Color, bgF2Color, bgF3Color],
    locations: [0, 0.5, 1],
  };


  const [treeData, setTreeData] = useState<TreeNodeType[]>([
    {
      id: 1,
      name: "Parent 1",
      parent: 0,
      rowNumber: 1,
      children: [
        {
          id: 2,
          name: "Child 1",
          parent: 1,
          rowNumber: 2,
          children: [
            {
              id: 3,
              name: "Grandchild 1",
              parent: 2,
              rowNumber: 3,
              children: [],
            },
          ],
        },
        {
          id: 4,
          name: "Child 2",
          parent: 1,
          rowNumber: 4,
          children: [
            {
              id: 6,
              name: "Grandchild 2",
              parent: 4,
              rowNumber: 5,
              children: [],
            },
          ],
        },
      ],
    },
  ]);

  const getSheetData = async () => {
    try {
      setLoading(true);

      const accessToken = await getAccessToken();
      if (!accessToken) return;

      const res = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${params?.id}/values/Sheet1!A1:C100`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await res.json();


      console.log("Sheet Response:", data);

      if (!data.values) {
        setTreeData([]);
        return;
      }

      const rows = data.values.slice(1);

      const list: TreeNodeType[] = rows.map(
        (r: string[], index: number) => ({
          id: Number(r[0]),
          name: r[1] || "",
          parent: Number(r[2] || 0),
          rowNumber: index + 2,
          children: [],
        })
      );

      const buildTree = (
        items: TreeNodeType[]
      ): TreeNodeType[] => {
        const map: Record<
          number,
          TreeNodeType
        > = {};

        const roots: TreeNodeType[] = [];

        items.forEach((item) => {
          map[item.id] = {
            ...item,
            children: [],
          };
        });

        items.forEach((item) => {
          if (item.parent === 0) {
            roots.push(
              map[item.id]
            );
          } else {
            map[
              item.parent
            ]?.children.push(
              map[item.id]
            );
          }
        });

        return roots;
      };

      const tree = buildTree(list);

      setTreeData(tree);

      console.log("Generated Tree:", tree);

    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params?.id) {
      getSheetData();
    }
  }, []);

  return (
    <>
      <HeaderComp hue={hue} setHue={setHue} />
      <View style={[styles.bodyLayout, { backgroundColor: bgbodyColor }]}>

        <View>
          {loading ? (
            <ActivityIndicator
              size="large"
            />
          ) : (
            <TreeView
              data={treeData}
            />
          )}
        </View>

      </View>
      <LinearGradient {...gradientConfig} style={[styles.footerLayout]}>

        <TouchableOpacity onPress={() => router.push({ pathname: "/createsheet", })}>
          <LinearGradient {...gradientLeafbtn} style={styles.leafBtn} >
            <Text style={styles.btnText}>
              Create New Account
            </Text>
          </LinearGradient>
        </TouchableOpacity>

      </LinearGradient>
    </>
  );
};

export default TreeLayout;