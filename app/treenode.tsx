import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Shadow } from 'react-native-shadow-2';

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



const TreeNode: React.FC<TreeNodeProps> = ({ node, onNodePress, openNodes, onToggle, template },) => {
  //const [isOpen, setIsOpen] = useState(false);
  //const isOpen = true; //openNodes.includes(node.id);

  const isOpen = template === "New" ? true : openNodes.includes(node.id);

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
            onToggle(node.id)
          }
        >
          <Text style={styles.toggle}>
            {hasChildren
              ? (isOpen ? "−" : "+")
              : ""}
          </Text>
        </TouchableOpacity>
        <Shadow offset={[2, 4]}
          distance={2}
          startColor="rgba(0, 0, 0, 0.3)">
          <View style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#f7f2d5",
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 2,
          }}>
            <View style={styles.contentRow}>
              <TouchableOpacity
                onPress={() => {
                  onNodePress(node.id)
                }}
              >
                <Text style={styles.nodeName}>
                  {node.name}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Shadow>
      </View>

      {isOpen && hasChildren && (
        <View style={styles.children}>
          {node.children?.map(
            (child) => (
              <TreeNode
                key={child.id}
                node={child}
                onNodePress={onNodePress} openNodes={openNodes} onToggle={onToggle} template={template} />
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
    padding: 10,
    borderWidth: 1,
    marginLeft: 5,

  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  nodeName: {

    fontSize: 16,
  },
  children: {
    marginLeft: 30,
    marginTop: 5,
  },
});

export default TreeNode;