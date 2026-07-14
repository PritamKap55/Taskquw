import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import TreeNode from "./treenode";

type TreeNodeType = {
  id: number;
  name: string;
  children?: TreeNodeType[];
};

type TreeViewProps = {
  data: TreeNodeType[];
  onNodePress: (id: number) => void;
  openNodes: number[];
  onToggle: (id: number) => void;
};


const TreeView: React.FC<TreeViewProps> = ({ data, onNodePress, openNodes, onToggle,}) => {


  return (
    <View style={styles.tree}>
      <FlatList
        data={data}
        keyExtractor={(item) =>
          item.id.toString()
        }
        renderItem={({ item }) => (
          <TreeNode node={item} onNodePress={onNodePress} openNodes={openNodes} onToggle={onToggle}/>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  tree: {
    padding: 10,
  },
});

export default TreeView;