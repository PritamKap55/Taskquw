import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { getThemeColors } from "./color";
import { getAccessToken } from "./googleAuth";
import HeaderComp from './headercomp';
import { gradientLeafbtn, styles } from './styles';

export default function ShareFile() {
  const [hue, setHue] = useState(0);
  const { bgbodyColor, bgColor, gradientConfig, } = getThemeColors(hue);
  const params = useLocalSearchParams();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"reader" | "writer">("reader");
  const [loading, setLoading] = useState(false);
  const [sharedUsers, setSharedUsers] = useState<any[]>([]);

  const loadHue = async () => {



    try {
      const savedValue = await AsyncStorage.getItem('myHue');
      if (savedValue !== null) {
        setHue(parseInt(savedValue, 10));
      }
    } catch (error) {
      console.error("Error loadHue", error);
    }
  };

  const shareFile = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter an email address.");
      return;
    }

    try {
      setLoading(true);
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
  const getSharedUsers = async () => {
    try {
      setLoading(true);

      const accessToken = await getAccessToken();

      if (!accessToken) {
        Alert.alert("Error", "Unable to get access token.");
        return;
      }

      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${params?.id}/permissions?fields=permissions(id,type,emailAddress,displayName,role)`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        setSharedUsers(result.permissions || []);

        // Example:
        // setSharedUsers(result.permissions);
      } else {
        Alert.alert(
          "Error",
          result.error?.message || "Unable to get shared users."
        );
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHue();
    getSharedUsers();
  }, []);

  return (
    <>
      <HeaderComp hue={hue} setHue={setHue} />

      <View style={[{ height: "68%", backgroundColor: bgbodyColor, },]} >

        <View style={styles.inputBox}>
          <Text style={styles.inputlabel}>Email</Text>

          <TextInput
            placeholder="Enter Email"
            value={email}
            onChangeText={setEmail}
            style={styles.inputtext}
          />
        </View>


        <Text style={styles.inputlabel}>Permission</Text>

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
            <Text style={[
              styles.roleText,
              role === "writer" && styles.selectedText,
            ]}
            >
              Editor
            </Text>

          </TouchableOpacity>
        </View>

        {sharedUsers.map((user: { id: React.Key | null | undefined; displayName: any; emailAddress: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; role: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }) => (
          <View
            key={user.id}
            style={{
              padding: 10,
              borderBottomWidth: 1,
              borderBottomColor: "#ddd",
            }}
          >
            <Text>
              {user.displayName || "Unknown user"}
            </Text>

            <Text>
              {user.emailAddress}
            </Text>

            <Text>
              Role: {user.role}
            </Text>
          </View>
        ))}
      </View>
      <LinearGradient {...gradientConfig} style={[styles.footerLayout]}>

        <TouchableOpacity onPress={shareFile}>
          <LinearGradient {...gradientLeafbtn} style={styles.leafBtn} >
            <Text>Share File</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </>
  );
}

