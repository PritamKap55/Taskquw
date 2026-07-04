import {
  useNavigation,
  useRoute
} from "@react-navigation/native";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

type TreeNodeType = {
  id: number;
  name: string;
  children?: TreeNodeType[];
};

type TreeNodeProps = {
  node: TreeNodeType;
};

const TreeNode: React.FC<TreeNodeProps> = ({ node }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();

  const hasChildren =
    node.children &&
    node.children.length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.nodeRow}>

        <TouchableOpacity
          style={styles.toggleContainer}
          onPress={() =>
            hasChildren &&
            setIsOpen(!isOpen)
          }
        >
          <Text style={styles.toggle}>
            {hasChildren
              ? (isOpen ? "−" : "+")
              : ""}
          </Text>
        </TouchableOpacity>

        <View style={styles.nodeCard}>
          <View style={styles.contentRow}>
            <Text>⬇️ </Text>

            <Text style={styles.nodeName}>
              {node.name}
            </Text>

            <TouchableOpacity>
              <Text> ➡️ </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                console.log(
                  "Delete:",
                  node.id
                );
              }}
            >
              <Text> ❌ </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {isOpen && hasChildren && (
        <View style={styles.children}>
          {node.children?.map(
            (child) => (
              <TreeNode
                key={child.id}
                node={child}
              />
            )
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
  },
  nodeRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  toggleContainer: {
    width: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  toggle: {
    fontSize: 18,
  },
  nodeCard: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    marginLeft: 5,
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  nodeName: {
    flex: 1,
    fontSize: 16,
  },
  children: {
    marginLeft: 30,
    marginTop: 5,
  },
});

export default TreeNode;