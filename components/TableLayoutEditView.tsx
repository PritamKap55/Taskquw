// components/TableLayoutEditView.tsx

import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { styles } from "../styles/styles";
import HeaderComp from "./headercomp";

type FormField = {
  label: string;
  value: string;
};

type Props = {
  formData: FormField[];
  selectedId: string;

  bgbodyColor: string;
  bglabelColor: string;
  gradientConfig: any;
  gradientLeafbtn: any;

  hue: number;
  setHue: (hue: number) => void;
  bgColor: string;
  login: any;
  headtext: string;

  handleChange: (
    index: number,
    value: string
  ) => void;

  addColumn: () => void;

  deleteColumn: (
    index: number
  ) => void;

  submit: () => void;
};

export default function TableLayoutEditView({
  formData,
  selectedId,

  bgbodyColor,
  bglabelColor,
  gradientConfig,
  gradientLeafbtn,
  hue, setHue,
  bgColor, login, headtext,
  handleChange,
  addColumn,
  deleteColumn,
  submit,

}: Props) {
  return (
    <>
      <HeaderComp HeaderName={headtext} login={login} hue={hue} setHue={setHue} bgColor={bgColor} />
      <View
        style={[
          styles.bodyLayout,
          {
            paddingTop: 25,
            backgroundColor: bgbodyColor,
          },
        ]}
      >
        <ScrollView>
          {formData.map((item, index) => (
            <View
              key={index}
              style={styles.inputBox}
            >
              <Text
                style={[
                  styles.inputlabel,
                  {
                    backgroundColor:
                      bglabelColor,
                  },
                ]}
              >
                {selectedId === "1"
                  ? "Name"
                  : item.label}
              </Text>

              <TextInput
                style={styles.inputtext}
                value={item.value}
                onChangeText={text =>
                  handleChange(index, text)
                }
              />

              {selectedId === "1" && (
                <TouchableOpacity
                  onPress={() =>
                    deleteColumn(index)
                  }
                >
                  <Text
                    style={{
                      fontSize: 20,
                      marginLeft: 10,
                    }}
                  >
                    ❌
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>
      </View>

      <LinearGradient
        {...gradientConfig}
        style={styles.footerLayout}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          {selectedId === "1" && (
            <TouchableOpacity
              onPress={addColumn}
            >
              <LinearGradient
                {...gradientLeafbtn}
                style={styles.leafBtn}
              >
                <Text style={styles.btnText}>
                  Add
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={submit}
          >
            <LinearGradient
              {...gradientLeafbtn}
              style={styles.leafBtn}
            >
              <Text style={styles.btnText}>
                Submit
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </>
  );
}