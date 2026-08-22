import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
} from "react-native";

import { getThemeColors } from "./color";
import HeaderComp from "./headercomp";
import { styles } from "./styles";

export default function AboutUs() {
  const [hue, setHue] = useState(0);

  const {
    bgbodyColor,
    bgColor,
    gradientConfig,
    oppositeColor,
  } = getThemeColors(hue);

  const loadHue = async () => {
    try {
      const savedValue = await AsyncStorage.getItem("myHue");

      if (savedValue !== null) {
        setHue(parseInt(savedValue, 10));
      }
    } catch (error) {
      console.error("Error loadHue", error);
    }
  };

  useEffect(() => {
    loadHue();
  }, []);

  return (
    <>
      <HeaderComp hue={hue} setHue={setHue} />

      <View
        style={[
          styles.bodyLayout,
          {
            backgroundColor: bgbodyColor,
          },
        ]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            padding: 20,
            paddingBottom: 100,
          }}
        >
          {/* App Title */}
          <View style={aboutStyles.header}>
            <View
              style={[
                aboutStyles.logoCircle,
                {
                  backgroundColor: bgColor,
                },
              ]}
            >
              <Text style={aboutStyles.logoText}>🌿</Text>
            </View>

            <Text
              style={[
                aboutStyles.appName,
                {
                  color: bgColor,
                },
              ]}
            >
              Your App Name
            </Text>

            <Text style={aboutStyles.version}>
              Version 1.0.0
            </Text>
          </View>

          {/* About App */}
          <View
            style={[
              aboutStyles.card,
              {
                backgroundColor: "#FFFFFF",
              },
            ]}
          >
            <Text
              style={[
                aboutStyles.title,
                {
                  color: bgColor,
                },
              ]}
            >
              About the App
            </Text>

            <Text style={aboutStyles.description}>
              Welcome to our app. We are dedicated to creating
              a simple, useful, and enjoyable experience for
              our users.
            </Text>

            <Text style={aboutStyles.description}>
              Our app helps users organize, manage, and access
              their information in a simple and convenient way.
            </Text>
          </View>

          {/* Features */}
          <View
            style={[
              aboutStyles.card,
              {
                backgroundColor: "#FFFFFF",
              },
            ]}
          >
            <Text
              style={[
                aboutStyles.title,
                {
                  color: bgColor,
                },
              ]}
            >
              Features
            </Text>

            <Text style={aboutStyles.item}>
              • Simple and easy-to-use interface
            </Text>

            <Text style={aboutStyles.item}>
              • Organized data management
            </Text>

            <Text style={aboutStyles.item}>
              • Easy access to your information
            </Text>

            <Text style={aboutStyles.item}>
              • Fast and user-friendly experience
            </Text>

            <Text style={aboutStyles.item}>
              • Data storage and synchronization support
            </Text>
          </View>

          {/* Developer */}
          <View
            style={[
              aboutStyles.card,
              {
                backgroundColor: "#FFFFFF",
              },
            ]}
          >
            <Text
              style={[
                aboutStyles.title,
                {
                  color: bgColor,
                },
              ]}
            >
              Developer
            </Text>

            <Text style={aboutStyles.label}>
              Created by
            </Text>

            <Text
              style={[
                aboutStyles.developerName,
                {
                  color: oppositeColor,
                },
              ]}
            >
              Pritam Kap
            </Text>
          </View>

          {/* Contact */}
          <View
            style={[
              aboutStyles.card,
              {
                backgroundColor: "#FFFFFF",
              },
            ]}
          >
            <Text
              style={[
                aboutStyles.title,
                {
                  color: bgColor,
                },
              ]}
            >
              Contact Us
            </Text>

            <Text style={aboutStyles.description}>
              If you have any questions, suggestions, feedback,
              or need support, please feel free to contact us.
            </Text>

            <Text
              style={[
                aboutStyles.email,
                {
                  color: bgColor,
                },
              ]}
            >
              your-email@example.com
            </Text>
          </View>

          {/* Privacy */}
          <View
            style={[
              aboutStyles.card,
              {
                backgroundColor: "#FFFFFF",
              },
            ]}
          >
            <Text
              style={[
                aboutStyles.title,
                {
                  color: bgColor,
                },
              ]}
            >
              Data & Privacy
            </Text>

            <Text style={aboutStyles.description}>
              We respect your privacy. Please refer to our
              Privacy Policy to learn more about how your
              information is collected, used, and stored.
            </Text>
          </View>

          {/* Copyright */}
          <View style={aboutStyles.bottom}>
            <Text style={aboutStyles.copyright}>
              © 2026 Pritam Kap
            </Text>

            <Text style={aboutStyles.copyright}>
              All rights reserved.
            </Text>
          </View>
        </ScrollView>
      </View>

      {/* Footer */}
      <LinearGradient
        {...gradientConfig}
        style={styles.footerLayout}
      />

      <View
        style={[
          styles.footerMobile,
          {
            backgroundColor: bgColor,
          },
        ]}
      />
    </>
  );
}

const aboutStyles = {
  header: {
    alignItems: "center" as const,
    marginBottom: 20,
  },

  logoCircle: {
    width: 75,
    height: 75,
    borderRadius: 40,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    marginBottom: 10,
  },

  logoText: {
    fontSize: 38,
  },

  appName: {
    fontSize: 26,
    fontWeight: "700" as const,
  },

  version: {
    marginTop: 4,
    fontSize: 13,
    color: "#777",
  },

  card: {
    borderRadius: 15,
    padding: 18,
    marginBottom: 15,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,

    elevation: 3,
  },

  title: {
    fontSize: 19,
    fontWeight: "700" as const,
    marginBottom: 10,
  },

  description: {
    fontSize: 15,
    lineHeight: 23,
    color: "#444",
    marginBottom: 8,
  },

  item: {
    fontSize: 15,
    lineHeight: 28,
    color: "#444",
  },

  label: {
    fontSize: 14,
    color: "#777",
    marginBottom: 4,
  },

  developerName: {
    fontSize: 20,
    fontWeight: "700" as const,
  },

  email: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: "600" as const,
  },

  bottom: {
    alignItems: "center" as const,
    marginTop: 10,
    marginBottom: 20,
  },

  copyright: {
    fontSize: 12,
    color: "#888",
    lineHeight: 20,
  },
};