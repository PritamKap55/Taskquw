import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getThemeColors } from "./color";


type TreeNodeType = {
  id: number;
  name: string;
  children?: TreeNodeType[];
};

type TreeNodeProps = {
  node: TreeNodeType;
  onNodePress: (id: number) => void;
  openNodes: number[];
  onToggle: (id: number) => void;
  template: string;
  selectedNodeId: number | null;
};

const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  onNodePress,
  openNodes,
  onToggle,
  template,
  selectedNodeId,
}) => {
  const isOpen =
    template === "New" ? true : openNodes.includes(node.id);

  const hasChildren =
    !!node.children && node.children.length > 0;

  const [hue, setHue] = useState(0);


  const loadHue = async () => {
    try {
      const savedValue = await AsyncStorage.getItem('myHue');
      if (savedValue !== null) {
        setHue(parseInt(savedValue, 10));
      }
    } catch (error) {
      console.error("Error loadHue", error);
    }
  };
  const { oppositeColor, oppositeColor1 } = getThemeColors(hue);
  useEffect(() => {
    loadHue();
  }, []);
  return (
    <View style={styles.container}>

      {/* Current Node */}
      <View style={styles.nodeRow}>

        {/* <TouchableOpacity
          style={styles.toggleContainer}
          disabled={!hasChildren}
          onPress={() => {
            if (hasChildren) {
              onToggle(node.id);
            }
          }}
        >
          <Text style={styles.toggle}>
            {hasChildren
              ? isOpen
                ? <MaterialCommunityIcons
                  name="folder-open"
                  size={24}
                  color={oppositeColor}
                />
                : <MaterialCommunityIcons
                  name="folder"
                  size={24}
                  color={oppositeColor1}
                />
              : "•"}
          </Text>
        </TouchableOpacity> */}


        <TouchableOpacity
          style={styles.nodeContent}
          onPress={() => {
            onNodePress(node.id);

            onToggle(node.id);

          }}
        >
          <Text
            style={[
              styles.nodeIcon,
              !hasChildren && styles.bullet,
            ]}
          >
            {hasChildren
              ? isOpen
                ? <MaterialCommunityIcons
                  name="folder-open"
                  size={24}
                  color={oppositeColor}
                />
                : <MaterialCommunityIcons
                  name="folder"
                  size={24}
                  color={oppositeColor1}
                />
              : "•"}
          </Text>

          <Text style={[
            styles.nodeName,
            selectedNodeId === node.id && styles.selectedNodeName,
          ]}>
            {node.name}
          </Text>
        </TouchableOpacity>

      </View>

      {/* Children */}
      {isOpen && hasChildren && (
        <View style={styles.children}>

          {/* Vertical line */}
          <View style={styles.verticalLine} />

          <View style={styles.childrenContent}>

            {node.children?.map((child, index) => {

              const isLast =
                index === node.children!.length - 1;

              return (
                <View
                  key={child.id}
                  style={styles.childWrapper}
                >

                  {/* Horizontal connector */}
                  <View
                    style={[
                      styles.horizontalLine,
                      isLast && styles.lastHorizontalLine,
                    ]}
                  />

                  <TreeNode
                    node={child}

                    onNodePress={onNodePress}
                    openNodes={openNodes}
                    onToggle={onToggle}
                    template={template}
                    selectedNodeId={selectedNodeId}
                  />

                </View>
              );
            })}

          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({

  container: {
    marginVertical: 3,
  },

  // --------------------------------
  // NODE
  // --------------------------------

  nodeRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 38,
  },

  // + / -
  toggleContainer: {
    width: 28,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },

  toggle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#555",
  },

  // Folder + name
  nodeContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 5,
  },

  nodeIcon: {
    fontSize: 17,
    width: 25,
    textAlign: "center",
  },

  // Bullet for final item
  bullet: {
    fontSize: 18,
    color: "#555",
  },

  nodeName: {
    fontSize: 16,
    color: "#222",
    marginLeft: 5,
  },

  // --------------------------------
  // CHILDREN
  // --------------------------------

  children: {
    flexDirection: "row",
    marginLeft: 14,
  },

  // Vertical tree line
  verticalLine: {
    width: 1,
    backgroundColor: "#BDBDBD",
    marginLeft: 14,
    marginRight: 8,
  },

  childrenContent: {
    flex: 1,
  },

  // Each child
  childWrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
    minHeight: 36,
  },

  // Horizontal tree line
  horizontalLine: {
    width: 18,
    height: 1,
    backgroundColor: "#BDBDBD",
    marginTop: 19,
    marginRight: 3,
  },

  // Last item's horizontal line
  lastHorizontalLine: {
    backgroundColor: "#BDBDBD",
  },
  selectedNodeName: {
    color: "#028702",
    fontWeight: "700",
  },
});

export default TreeNode;