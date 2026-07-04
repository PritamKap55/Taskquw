import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useRoute } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";

const TreeLayoutEdit = () => {
  const route = useRoute();



  const [selectedRow, setSelectedRow] = useState([]);
  const [fieldName, setFieldName] = useState("");
  const [checked, setChecked] = useState(false);
  const params = useLocalSearchParams();

  useEffect(() => {


    GetValue();

  }, []);

  async function GetValue() {
    try {

      if (params?.selectedId !== "") {

        await GoogleSignin.hasPlayServices();
        await GoogleSignin.signIn();
        const tokens = await GoogleSignin.getTokens();
        const accesstoken = tokens.accessToken;


        const res = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${params?.id}/values/Sheet1!${params?.selectedId}:${params?.selectedId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accesstoken}`,
            },
          }
        );

        const data = await res.json();

        const row =
          data.values?.[0] || [];

        setSelectedRow(row);

        // Assuming column B = name
        if (row.length > 1) {
          setFieldName(row[1]);
        }

        console.log("Selected Row:", row);
      }

    } catch (error) {
      console.log("error", error)
    }
  }

  async function Update() {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();
      const accesstoken = tokens.accessToken;

      await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${params?.id}/values/Sheet1!B${params?.selectedId}?valueInputOption=USER_ENTERED`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accesstoken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            values: [[fieldName]],
          }),
        }
      );

      Alert.alert(
        "Success",
        "Updated"
      );

    } catch (error) {
      console.log("error", error)
    }
  }

  async function Add() {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();
      const accesstoken = tokens.accessToken;

      await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${params?.id}/values/Sheet1!B1:append?valueInputOption=USER_ENTERED`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accesstoken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            values: [
              [20, fieldName, 5]
            ]
          }),
        }
      );

      Alert.alert(
        "Success",
        "Added"
      );

    } catch (error) {
      console.log("Error", error);
    }
  }

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Edit
      </Text>

      <TextInput
        style={styles.input}
        value={fieldName}
        onChangeText={setFieldName}
        placeholder="Enter name"
      />

      <View style={styles.checkboxRow}>
        <Text>Checkbox</Text>

        <Switch
          value={checked}
          onValueChange={setChecked}
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={Update}
      >
        <Text style={styles.buttonText}>
          Update
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={Add}
      >
        <Text style={styles.buttonText}>
          Add
        </Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20
  },

  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20
  },

  checkboxRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20
  },

  button: {
    padding: 14,
    borderRadius: 8,
    backgroundColor: "#4f46e5",
    marginBottom: 10,
    alignItems: "center"
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold"
  }
});

export default TreeLayoutEdit;