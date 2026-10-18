
import * as Application from "expo-application";
import React from "react";
import {Image, ScrollView, Text, View } from "react-native";

import { useThemeColors } from "../styles/color";
import { styles } from "../styles/styles";

export default function AppinfoView() {
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
                            This app provides a simple way for  people to
                            communicate and share information using Google Sheets
                            as the backend database.
                        </Text>

                        <Text style={styles.description}>
                            Users can create, view, and update data through the app,
                            while changes made directly in Google Sheets can also
                            be reflected in the app.
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
                            • Four layouts: List, Checklist, Table, and Tree View
                        </Text>

                        <Text style={styles.item}>
                            • Supports up to 1,000 records per sheet
                        </Text>

                        <Text style={styles.item}>
                            • Add and manage data directly in the app
                        </Text>

                        <Text style={styles.item}>
                            • View and edit data directly in Google Sheets
                        </Text>

                        <Text style={styles.item}>
                            • Changes in Google Sheets can be reflected in the app
                        </Text>

                        <Text style={styles.item}>
                            • Choose your preferred app color theme
                        </Text>

                        <Text style={styles.item}>
                            • Receive notifications when updates are detected
                        </Text>

                        <Text style={styles.item}>
                            • Simple data sharing between people
                        </Text>
                    </View>

                    {/* Layouts */}
                    <View
                        style={[
                            styles.Infocard,
                            { backgroundColor: "#FFFFFF" },
                        ]}
                    >
                        <Text style={[styles.title, { color: bgColor }]}>
                            Available Layouts
                        </Text>

                        <Text style={styles.item}>
                            • List View – Display records in a simple list
                        </Text>

                        <Text style={styles.item}>
                            • Checklist – Organize tasks and items in checklist form
                        </Text>

                        <Text style={styles.item}>
                            • Table View – View information in rows and columns
                        </Text>

                        <Text style={styles.item}>
                            • Tree View – Organize information in a hierarchical structure
                        </Text>
                    </View>

                    {/* Google Account & Sharing */}
                    <View
                        style={[
                            styles.Infocard,
                            { backgroundColor: "#FFFFFF" },
                        ]}
                    >
                        <Text style={[styles.title, { color: bgColor }]}>
                            Account & Sharing
                        </Text>

                        <Text style={styles.description}>
                            Sign in using your Google account and grant the required
                            Google Drive and Google Sheets permissions to access
                            your data.
                        </Text>

                        <Text style={styles.description}>
                            Share your sheet with another person using one of the
                            following access levels:
                        </Text>

                        <Text style={styles.item}>
                            • Read Access – View shared information
                        </Text>

                        <Text style={styles.item}>
                            • Write Access – View and modify shared information
                        </Text>
                    </View>

                    {/* Data Storage */}
                    <View
                        style={[
                            styles.Infocard,
                            { backgroundColor: "#FFFFFF" },
                        ]}
                    >
                        <Text style={[styles.title, { color: bgColor }]}>
                            Data Storage & Synchronization
                        </Text>

                        <Text style={styles.description}>
                            Google Sheets is used as the backend data source.
                            The app does not maintain a separate permanent database
                            for communication records.
                        </Text>

                        <Text style={styles.description}>
                            Data availability depends on the connected Google Sheet
                            and the permissions granted to your account.
                        </Text>

                        <Text style={styles.description}>
                            If the Google Sheet is updated, the changes can be
                            reflected in the app when the data is refreshed or
                            synchronized.
                        </Text>

                        <Text style={styles.description}>
                            If the connected Google Sheet is deleted or access is
                            revoked, the app may no longer be able to access the
                            associated data. Account deletion is not necessarily
                            automatic.
                        </Text>
                    </View>

                    {/* Security & Privacy */}
                    <View
                        style={[
                            styles.Infocard,
                            { backgroundColor: "#FFFFFF" },
                        ]}
                    >
                        <Text style={[styles.title, { color: bgColor }]}>
                            Security & Privacy
                        </Text>

                        <Text style={styles.description}>
                            This app is designed for basic communication and
                            information sharing. It is not intended for storing
                            confidential or highly sensitive information.
                        </Text>

                        <Text style={styles.description}>
                            Access to shared data depends on Google account
                            permissions and Google Sheets sharing settings.
                            Anyone with sufficient access to the sheet may be
                            able to view or modify its contents.
                        </Text>

                        <Text style={styles.description}>
                            Please avoid sharing passwords, financial details,
                            or other sensitive personal information through this app.
                        </Text>
                    </View>

                    {/* Notifications & Theme */}
                    <View
                        style={[
                            styles.Infocard,
                            { backgroundColor: "#FFFFFF" },
                        ]}
                    >
                        <Text style={[styles.title, { color: bgColor }]}>
                            Personalization & Notifications
                        </Text>

                        <Text style={styles.description}>
                            Customize the appearance of the app by selecting
                            your preferred color theme.
                        </Text>

                        <Text style={styles.description}>
                            Notifications may be sent when changes or updates
                            are detected, depending on notification permissions
                            and the app's notification configuration.
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
                            For questions, suggestions, feedback, or technical
                            support, please contact the developer.
                        </Text>

                        <Text style={[styles.email, { color: bgColor }]}>
                            your-email@example.com
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
