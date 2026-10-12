import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useThemeColors } from "../styles/color";
import { styles } from "../styles/styles";

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
  const { oppositeColor, oppositeColor1 } = useThemeColors();
  useEffect(() => {
    loadHue();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.nodeRow}>
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


export default TreeNode;