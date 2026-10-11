// components/ShareFileView.tsx

import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { SharedUser } from "../services/shareFileService";
import { styles } from "../styles/styles";
import HeaderComp from "./headercomp";

type Props = {
  email: string;
  headtext: string;
  setEmail: (value: string) => void;
  role: "reader" | "writer";
  setRole: (role: "reader" | "writer") => void;
  sharedUsers: SharedUser[];
  loading: boolean;
  bgbodyColor: string;
  bglabelColor: string;
  gradientConfig: any;
  gradientLeafbtn: any;
  oppositeColor?: string;
  userEmail: any;
  login: any;
  bgColor: string;
  hue: number;
  setHue: (hue: number) => void;
  onShare: () => void;
};

export default function ShareFileView({
  email,
  setEmail,
  role,
  setRole,
  sharedUsers,
  loading,
  bgbodyColor,
  bglabelColor,
  gradientConfig,
  gradientLeafbtn,
  oppositeColor,
  hue, setHue, bgColor, login, headtext,
  onShare,
}: Props) {
  return (
    <>
      <HeaderComp HeaderName={headtext} login={login} hue={hue} setHue={setHue} bgColor={bgColor} />
      <View
        style={[
          {
            height: "68%",
            backgroundColor: bgbodyColor,
          },
        ]}
      >
        {/* Email */}
        <View style={styles.inputBox}>
          <Text
            style={[
              styles.inputlabel,
              {
                backgroundColor: bglabelColor,
              },
            ]}
          >
            Email
          </Text>

          <TextInput
            placeholder="Enter Email"
            value={email}
            onChangeText={setEmail}
            style={styles.inputtext}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        {/* Role */}
        <View style={styles.row}>
          <TouchableOpacity
            style={[
              styles.roleButton,
              role === "reader" &&
              styles.selectedButton,
            ]}
            onPress={() => setRole("reader")}
          >
            <Text
              style={[
                styles.roleText,
                role === "reader" &&
                styles.selectedText,
              ]}
            >
              Viewer
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.roleButton,
              role === "writer" &&
              styles.selectedButton,
            ]}
            onPress={() => setRole("writer")}
          >
            <Text
              style={[
                styles.roleText,
                role === "writer" &&
                styles.selectedText,
              ]}
            >
              Editor
            </Text>
          </TouchableOpacity>
        </View>

        {/* Shared users */}
        {sharedUsers.map(user => (
          <View
            key={user.id}
            style={{
              padding: 10,
              borderBottomWidth: 1,
              borderBottomColor: "#ddd",
            }}
          >
            <Text>
              {user.displayName ||
                "Unknown user"}
            </Text>

            <Text>
              {user.emailAddress || ""}
            </Text>

            <Text>
              Role: {user.role || ""}
            </Text>
          </View>
        ))}
      </View>

      {/* Footer */}
      <LinearGradient
        {...gradientConfig}
        style={styles.footerLayout}
      >
        <TouchableOpacity
          onPress={onShare}
          disabled={loading}
        >
          <LinearGradient
            {...gradientLeafbtn}
            style={styles.leafBtn}
          >
            {loading ? (
              <ActivityIndicator
                size="small"
                color={oppositeColor}
              />
            ) : (
              <Text style={styles.btnText}>
                Share File
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </>
  );
}