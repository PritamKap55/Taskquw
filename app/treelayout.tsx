import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useLocalSearchParams } from "expo-router";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

import TreeView from "./treeview";

type TreeNodeType = {
  id: number;
  name: string;
  parent: number;
  rowNumber: number;
  children: TreeNodeType[];
};

const TreeLayout = ({
  hue = "#4f46e5",
}: {
  hue?: string;
}) => {
  const params = useLocalSearchParams();

  const [loading, setLoading] = useState(false);

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

      await GoogleSignin.hasPlayServices();

      // Sign in if not already signed in
      const userInfo = await GoogleSignin.signIn();

      const tokens = await GoogleSignin.getTokens();
      const accessToken = tokens.accessToken;

      const spreadsheetId = params?.id;

      if (!spreadsheetId) {
        console.log("Spreadsheet ID missing");
        return;
      }

      const res = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:C100`,
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

      // Skip header row
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

      console.log(
        "Generated Tree:",
        tree
      );

    } catch (error) {
      console.log(
        "Error:",
        error
      );
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
    <View style={styles.container}>
      
      <View
        style={[
          styles.headerLayout,
          {
            backgroundColor: hue,
          },
        ]}
      >
        <Text style={styles.headerText}>
          {params?.name || "Tree"}
        </Text>
      </View>

      <View style={styles.bodyLayout}>
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

      <View
        style={[
          styles.footerLayout,
          {
            backgroundColor: hue,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  headerLayout: {
    padding: 16,
    alignItems: "center",
  },

  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },

  bodyLayout: {
    flex: 1,
    padding: 12,
  },

  footerLayout: {
    height: 60,
  },
});

export default TreeLayout;