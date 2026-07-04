import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import HeaderComp from "./headercomp";
import { styles } from "./styles";

export default function ListLayout() {
  const params = useLocalSearchParams();
  const [fileName, setFileName] = useState("");
  const [items, setItems] = useState<(string | number)[][]>([
    ["id", "name", "age"],
    [1, "Pritam", 25],
    [2, "Vshal", 28],
    [3, "Jane", 28],
  ]);

  const getSheetData = async () => {
    try {

      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();
      const accessToken = tokens.accessToken;

      const res = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${params?.id}/values/Sheet1`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await res.json();

      setItems(data?.values || []);

    } catch (error) {
      console.log("Get Sheet Error:", error);
    }
  };

  useEffect(() => {
    if (params?.id) {
      getSheetData();
    }
  }, []);
  return (
    <>

      <HeaderComp />

      {/* Table */}
      <ScrollView horizontal>
        <View style={styles.tableContainer}>

          {/* Header Row */}
          <View style={[styles.row, styles.headerRow]}>
            {items[0]?.map((header, i) => (
              <Text key={i} style={styles.cell}>
                {header}
              </Text>
            ))}

            <TouchableOpacity
            // onPress={() => navigate("TableLayoutEdit", {access_token,files,selectedId: 1,})}
            >
              <Text style={styles.icon}>➕✏️</Text>
            </TouchableOpacity>
          </View>

          {/* Data Rows */}
          {items.slice(1).map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {items[0].map((_, colIndex) => (
                <Text key={colIndex} style={styles.cell}>
                  {row[colIndex] || ""}
                </Text>
              ))}

              <View style={styles.actionContainer}>
                <TouchableOpacity
                // onPress={() => navigate("TableLayoutEdit", {access_token,files,selectedId: rowIndex + 2,})}
                >
                  <Text style={styles.icon}>✏️</Text>
                </TouchableOpacity>

                <TouchableOpacity>
                  <Text style={styles.icon}>❌</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Add Row */}
      <TouchableOpacity
        style={styles.button}
      // onPress={() =>navigate("TableLayoutEdit", {access_token,files,selectedId: "0",})}
      >
        <Text style={styles.buttonText}>
          + Add New Row
        </Text>
      </TouchableOpacity>

      {/* Footer */}
      <View>
        <Text>Name</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter File Name"
          value={fileName}
          onChangeText={setFileName}
        />

        <TouchableOpacity
          style={styles.button}
          // onPress={() => getOrCreateFile()}
        >
          <Text style={styles.buttonText}>
            Download PDF
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          // onPress={() => getOrCreateFile()}
        >
          <Text style={styles.buttonText}>
            Download CSV
          </Text>
        </TouchableOpacity>
      </View>

    </>

  );
}

