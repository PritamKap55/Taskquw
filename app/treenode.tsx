import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
};

const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  onNodePress,
  openNodes,
  onToggle,
  template,
}) => {
  const isOpen =
    template === "New" ? true : openNodes.includes(node.id);

  const hasChildren =
    !!node.children && node.children.length > 0;

  return (
    <View style={styles.container}>

      {/* Current Node */}
      <View style={styles.nodeRow}>

        {/* Expand / Collapse */}
        <TouchableOpacity
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
                ? "−"
                : "+"
              : ""}
          </Text>
        </TouchableOpacity>

        {/* Folder / Bullet + Name */}
        <TouchableOpacity
          style={styles.nodeContent}
          onPress={() => onNodePress(node.id)}
        >
          <Text
            style={[
              styles.nodeIcon,
              !hasChildren && styles.bullet,
            ]}
          >
            {hasChildren
              ? isOpen
                ? "📂"
                : "📁"
              : "•"}
          </Text>

          <Text style={styles.nodeName}>
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
});

export default TreeNode;