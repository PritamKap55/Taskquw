import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import { useLocalSearchParams } from "expo-router";

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
  const [nodetext, setNodetext] = useState("");
  const [selectnode, setSelectnode] = useState(0);
  const [selectnodetext, setSelectnodetext] = useState("");
  const [openNodes, setOpenNodes] = useState<number[]>([]);

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

  const handleNodePress = (id: number) => {
    console.log(id);
    setSelectnode(id);
    const node = findNodeById(treeData, selectnode);
    setSelectnodetext(node?.name ?? "")
  };

  const findNodeById = (
    nodes: TreeNodeType[],
    id: number
  ): TreeNodeType | null => {
    for (const node of nodes) {
      if (node.id === id) {
        return node;
      }

      if (node.children?.length) {
        const found = findNodeById(node.children, id);
        if (found) {
          return found;
        }
      }
    }

    return null;
  };

  const addChildNode = (
    nodes: TreeNodeType[],
    parentId: number,
    newChild: TreeNodeType
  ): TreeNodeType[] => {
    return nodes.map((node) => {
      if (node.id === parentId) {
        return {
          ...node,
          children: [...(node.children || []), newChild],
        };
      }

      return {
        ...node,
        children: node.children
          ? addChildNode(node.children, parentId, newChild)
          : [],
      };
    });
  };

  const handleAddRoot = () => {
    if (!nodetext.trim()) {
      Alert.alert(
        "Validation",
        "Please enter a node name."
      );
      return;
    }
    const node = findNodeById(treeData, selectnode);

    const newNode: TreeNodeType = {
      id: getLastId(treeData) + 1,
      name: nodetext,
      parent: node?.parent ?? 0,
      rowNumber: 6,
      children: [],
    };

    saveNode(newNode);

    setTreeData((prev) =>
      addChildNode(prev, node?.parent ?? 0, newNode)
    );
  };

  const handleAddChild = () => {

    if (!nodetext.trim()) {
      Alert.alert(
        "Validation",
        "Please enter a node name."
      );
      return;
    }
    const node = findNodeById(treeData, selectnode);

    const newNode: TreeNodeType = {
      id: getLastId(treeData) + 1,
      name: nodetext,
      parent: selectnode,
      rowNumber: 6,
      children: [],
    };

    saveNode(newNode);

    setTreeData((prev) =>
      addChildNode(prev, node?.parent ?? 0, newNode)
    );
  };

  const getLastId = (nodes: TreeNodeType[]): number => {
    let maxId = 0;

    const traverse = (items: TreeNodeType[]) => {
      for (const item of items) {
        if (item.id > maxId) {
          maxId = item.id;
        }

        if (item.children?.length) {
          traverse(item.children);
        }
      }
    };

    traverse(nodes);

    return maxId;
  };

  const saveNode = async (node: TreeNodeType) => {
    try {
      const accessToken = await getAccessToken();
      if (!accessToken) return;

      const res = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${params?.id}/values/Sheet1!A:C:append?valueInputOption=USER_ENTERED`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            values: [
              [
                node.id,
                node.name,
                node.parent,
              ],
            ],
          }),
        }
      );

      const data = await res.json();

      console.log("Saved:", data);

      getSheetData(); // Refresh tree
    } catch (err) {
      console.log(err);
    }
  };

  const toggleNode = (id: number) => {
    setOpenNodes((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const deleteNodeFromSheet = async () => {
    try {

      const node = findNodeById(treeData, selectnode);
      if (node == null) return;
      const accessToken = await getAccessToken();
      if (!accessToken) return false;

      const rows = getRowsToDelete(node);

      // Delete from bottom to top
      rows.sort((a: number, b: number) => b - a);

      const requests = rows.map((row: number) => ({
        deleteDimension: {
          range: {
            sheetId: 0, // Sheet1
            dimension: "ROWS",
            startIndex: row - 1,
            endIndex: row,
          },
        },
      }));

      const res = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${params?.id}:batchUpdate`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            requests,
          }),
        }
      );

      const data = await res.json();

      console.log(data);

      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const getRowsToDelete = (
    node: TreeNodeType,
    rows: number[] = []
  ): number[] => {
    rows.push(node.rowNumber);

    node.children?.forEach((child) => {
      getRowsToDelete(child, rows);
    });

    return rows;
  };

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
              onNodePress={handleNodePress}
              openNodes={openNodes}
              onToggle={toggleNode}
            />
          )}
        </View>

      </View>
      <LinearGradient {...gradientConfig} style={[styles.footerLayout]}>
        <Text style={styles.inputlabel}>{selectnodetext}</Text>
        <View style={styles.inputBox}>
          <Text style={styles.inputlabel}>Text</Text>
          <TextInput
            placeholder="Enter File name"
            value={nodetext}
            onChangeText={setNodetext}
            style={styles.inputtext}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            onPress={handleAddRoot}
          >
            <LinearGradient {...gradientLeafbtn} style={styles.leafBtn} >
              <Text>Root</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleAddChild}
          >
            <LinearGradient {...gradientLeafbtn} style={styles.leafBtn} >
              <Text> Child </Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => deleteNodeFromSheet()}
          >
            <LinearGradient {...gradientLeafbtn} style={styles.leafBtn} >
              <Text> Delete </Text>
            </LinearGradient>
          </TouchableOpacity>

        </View>

      </LinearGradient>

    </>
  );
};

export default TreeLayout;