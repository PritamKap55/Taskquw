import React from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import TreeView from "../app/treeview";
import { styles } from "../styles/styles";
import HeaderComp from "./headercomp";

type Props = {
  template?: string;
  layout: string;
  headtext: string;
  hue: number;
  setHue: (value: number) => void;
  bgColor: string;
  bgbodyColor: string;
  bglabelColor: string;

  gradientConfig: any;
  gradientLeafbtn: any;

  loading: boolean;

  treeData: any[];

  selectnodetext: string;

  nodetext: string;

  userEmail: any;
  login: any;
  setNodetext: (value: string) => void;

  openNodes: number[];

  handleNodePress: (id: number) => void;
  toggleNode: (id: number) => void;

  handleAddRoot: () => void;
  handleAddChild: () => void;
  handleDelete: () => void;
};

export default function TreeLayoutView({
  template,
  layout, headtext, hue, setHue, bgColor,
  bgbodyColor,
  bglabelColor,

  gradientConfig,
  gradientLeafbtn,

  loading,

  treeData,

  selectnodetext,

  nodetext,

  userEmail, login,
  setNodetext,

  openNodes,

  handleNodePress,
  toggleNode,

  handleAddRoot,
  handleAddChild,
  handleDelete,
}: Props) {
  return (
    <>
      {template == "" && (
        <HeaderComp HeaderName={headtext} login={login} hue={hue} setHue={setHue} bgColor={bgColor} />
      )}

      <View
        style={{
          height:
            template == ""
              ? "68%"
              : "100%",

          backgroundColor:
            bgbodyColor,
        }}
      >
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
              onToggle={toggleNode} template={""}            //   template={template}
            />
          )}
        </View>
      </View>

      {template == "" && (
        <LinearGradient
          {...gradientConfig}
          style={styles.footerLayout}
        >
          <Text style={styles.inputlabel}>
            {selectnodetext}
          </Text>

          <View style={styles.inputBox}>
            {login == "Login" && (
              <Text
                style={[
                  styles.inputlabel,
                  {
                    backgroundColor:
                      bglabelColor,
                  },
                ]}
              >
                Text
              </Text>)}
            {login == "Login" && (

              <TextInput
                placeholder="Enter File name"
                value={nodetext}
                onChangeText={setNodetext}
                style={styles.inputtext}
              />)}
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent:
                "space-between",
            }}
          >
            {login == "Login" && (
              <TouchableOpacity
                onPress={handleAddRoot}
              >
                <LinearGradient
                  {...gradientLeafbtn}
                  style={styles.leafBtn}
                >
                  <Text
                    style={styles.btnText}
                  >
                    Root
                  </Text>
                </LinearGradient>
              </TouchableOpacity>)}
            {login == "Login" && (
              <TouchableOpacity
                onPress={handleAddChild}
              >
                <LinearGradient
                  {...gradientLeafbtn}
                  style={styles.leafBtn}
                >
                  <Text
                    style={styles.btnText}
                  >
                    Child
                  </Text>
                </LinearGradient>
              </TouchableOpacity>)}
            {login == "Login" && (
              <TouchableOpacity
                onPress={handleDelete}
              >
                <LinearGradient
                  {...gradientLeafbtn}
                  style={styles.leafBtn}
                >
                  <Text
                    style={styles.btnText}
                  >
                    Delete
                  </Text>
                </LinearGradient>
              </TouchableOpacity>)}
          </View>
        </LinearGradient>
      )}
    </>
  );
}