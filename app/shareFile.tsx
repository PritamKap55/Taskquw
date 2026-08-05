import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { getAccessToken } from "./googleAuth";

export default function ShareFile() {

  const params = useLocalSearchParams();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"reader" | "writer">("reader");
  const [loading, setLoading] = useState(false);

  const shareFile = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter an email address.");
      return;
    }

    try {
      setLoading(true);
      console.log("fileId", params?.id)
      const accessToken = await getAccessToken();
      if (!accessToken) return;
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${params?.id}/permissions`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role,
            type: "user",
            emailAddress: email.trim(),
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Success", "File shared successfully.");
        setEmail("");
      } else {
        Alert.alert(
          "Error",
          result.error?.message || "Unable to share file."
        );
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Share Google Drive File</Text>

      <Text style={styles.label}>Email Address</Text>

      <TextInput
        style={styles.input}
        placeholder="example@gmail.com"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Permission</Text>

      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.roleButton,
            role === "reader" && styles.selectedButton,
          ]}
          onPress={() => setRole("reader")}
        >
          <Text
            style={[
              styles.roleText,
              role === "reader" && styles.selectedText,
            ]}
          >
            Viewer
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.roleButton,
            role === "writer" && styles.selectedButton,
          ]}
          onPress={() => setRole("writer")}
        >
          <Text
            style={[
              styles.roleText,
              role === "writer" && styles.selectedText,
            ]}
          >
            Editor
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.shareButton}
        onPress={shareFile}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.shareText}>Share File</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 30,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 14,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  roleButton: {
    width: "48%",
    borderWidth: 1,
    borderColor: "#4285F4",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
  },
  selectedButton: {
    backgroundColor: "#4285F4",
  },
  roleText: {
    color: "#4285F4",
    fontWeight: "600",
  },
  selectedText: {
    color: "#fff",
  },
  shareButton: {
    backgroundColor: "#4285F4",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  shareText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});