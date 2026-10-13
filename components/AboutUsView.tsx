
import * as Application from "expo-application";
import React from "react";
import { Image, ScrollView, Text, View } from "react-native";

import { useThemeColors } from "../styles/color";
import { styles } from "../styles/styles";

export default function AboutUsView() {
    const {
        bgbodyColor,
        bgColor,
        gradientConfig,
        oppositeColor,
    } = useThemeColors();

    return (
        <>
            <View
                style={[
                    styles.bodyLayout,
                    { backgroundColor: bgbodyColor, height: "100%", },
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
                    <View style={styles.header}>
                        <View
                            style={[
                                styles.logoCircle,

                            ]}
                        >
                            <Image
                                source={require("../assets/images/Logo.png")}
                                style={{ width: 70, height: 70 }}
                                resizeMode="contain"
                            />

                        </View>

                        <Text
                            style={[styles.appName, { color: bgColor }]}
                        >
                            Task quw
                        </Text>

                        <Text style={styles.version}>
                            Version {Application.nativeApplicationVersion ?? "1.0.0"}
                        </Text>
                    </View>

                    {/* About App */}
                    <View
                        style={[
                            styles.Infocard,
                            { backgroundColor: "#FFFFFF" },
                        ]}
                    >
                        <Text style={[styles.title, { color: bgColor }]}>
                            About the App
                        </Text>

                        <Text style={styles.description}>
                            Welcome to our app. We are dedicated to creating
                            a simple, useful, and enjoyable experience for
                            our users.
                        </Text>

                        <Text style={styles.description}>
                            Our app helps users organize, manage, and access
                            their information in a simple and convenient way.
                        </Text>
                    </View>

                    {/* Features */}
                    <View
                        style={[
                            styles.Infocard,
                            { backgroundColor: "#FFFFFF" },
                        ]}
                    >
                        <Text style={[styles.title, { color: bgColor }]}>
                            Features
                        </Text>

                        <Text style={styles.item}>
                            • Simple and easy-to-use interface
                        </Text>
                        <Text style={styles.item}>
                            • Organized data management
                        </Text>
                        <Text style={styles.item}>
                            • Easy access to your information
                        </Text>
                        <Text style={styles.item}>
                            • Fast and user-friendly experience
                        </Text>
                        <Text style={styles.item}>
                            • Data storage and synchronization support
                        </Text>
                    </View>

                    {/* Developer */}
                    <View
                        style={[
                            styles.Infocard,
                            { backgroundColor: "#FFFFFF" },
                        ]}
                    >
                        <Text style={[styles.title, { color: bgColor }]}>
                            Developer
                        </Text>

                        <Text style={styles.label}>Created by</Text>

                        <Text
                            style={[
                                styles.developerName,
                                { color: oppositeColor },
                            ]}
                        >
                            Pritam Kap
                        </Text>
                    </View>

                    {/* Contact */}
                    <View
                        style={[
                            styles.Infocard,
                            { backgroundColor: "#FFFFFF" },
                        ]}
                    >
                        <Text style={[styles.title, { color: bgColor }]}>
                            Contact Us
                        </Text>

                        <Text style={styles.description}>
                            If you have any questions, suggestions, feedback,
                            or need support, please feel free to contact us.
                        </Text>

                        <Text style={[styles.email, { color: bgColor }]}>
                            your-email@example.com
                        </Text>
                    </View>

                    {/* Privacy */}
                    <View
                        style={[
                            styles.Infocard,
                            { backgroundColor: "#FFFFFF" },
                        ]}
                    >
                        <Text style={[styles.title, { color: bgColor }]}>
                            Data & Privacy
                        </Text>

                        <Text style={styles.description}>
                            We respect your privacy. Please refer to our
                            Privacy Policy to learn more about how your
                            information is collected, used, and stored.
                        </Text>
                    </View>

                    {/* Copyright */}
                    <View style={styles.bottom}>
                        <Text style={styles.copyright}>
                            © 2026 Pritam Kap
                        </Text>

                        <Text style={styles.copyright}>
                            All rights reserved.
                        </Text>
                    </View>
                </ScrollView>
            </View>



        </>
    );
}
