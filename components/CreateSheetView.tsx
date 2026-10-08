// components/CreateSheetView.tsx

import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import ListLayout from "../app/listlayout";
import TableLayout from "../app/tablelayout";
import TreeLayout from "../app/treelayout";
import { styles } from "../styles/styles";

type Props = {
  fileName: string;
  setFileName: (value: string) => void;

  index: number;
  setIndex: (value: number) => void;

  width: number;
  loading: boolean;

  bgbodyColor: string;
  gradientConfig: any;
  bglabelColor: string;
  oppositeColor: string;
  gradientLeafbtn: any;

  onCreate: () => void;
};

export default function CreateSheetView({
  fileName,
  setFileName,
  index,
  setIndex,
  width,
  loading,
  bgbodyColor,
  gradientConfig,
  bglabelColor,
  oppositeColor,
  gradientLeafbtn,
  onCreate,
}: Props) {
  return (
    <>
      <View
        style={[
          styles.bodyLayout,
          {
            backgroundColor: bgbodyColor,
          },
        ]}
      >
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const pageIndex = Math.round(
              event.nativeEvent.contentOffset.x / width
            );

            setIndex(pageIndex);
          }}
        >
          {/* List */}
          <View style={styles.slide}>
            <View
              style={styles.card}
              pointerEvents="none"
            >
              <ListLayout
                template="New"
                layout=""
                userEmail={undefined}
                login={undefined}
                headtext=""
              />
            </View>
          </View>

          {/* Check List */}
          <View style={styles.slide}>
            <View
              style={styles.card}
              pointerEvents="none"
            >
              <ListLayout
                template="New"
                layout="Check List"
                userEmail={undefined}
                login={undefined}
                headtext=""
              />
            </View>
          </View>

          {/* Table */}
          <View style={styles.slide}>
            <View
              style={styles.card}
              pointerEvents="none"
            >
              <TableLayout
                template="New"
                layout=""
                headtext=""
                userEmail={undefined}
                login={undefined}
              />
            </View>
          </View>

          {/* Tree */}
          <View style={styles.slide}>
            <View style={styles.card}>
              <TreeLayout
                template="New"
                layout=""
                headtext=""
                userEmail={undefined}
                login={undefined}
              />
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Footer */}
      <LinearGradient
        {...gradientConfig}
        style={styles.footerLayout}
      >
        <View style={styles.inputBox}>
          <Text
            style={[
              styles.inputlabel,
              {
                backgroundColor: bglabelColor,
              },
            ]}
          >
            Name
          </Text>

          <TextInput
            placeholder="Enter File name"
            value={fileName}
            onChangeText={setFileName}
            style={styles.inputtext}
          />
        </View>

        <TouchableOpacity onPress={onCreate}>
          <LinearGradient
            {...gradientLeafbtn}
            style={styles.leafBtn}
          >
            <Text style={styles.btnText}>
              Create New Account
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>

      {loading && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator
            size="large"
            color={oppositeColor}
          />
        </View>
      )}
    </>
  );
}