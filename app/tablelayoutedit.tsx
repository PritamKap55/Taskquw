import React, { useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
    useNavigation,
    useRoute
} from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";

const TableLayoutEdit = ({ hue = "#4f46e5" }) => {
    type FormField = {
        label: string;
        value: string;
    };
    const route = useRoute();
    const navigation = useNavigation();

    const params = useLocalSearchParams();

    const [formData, setFormData] = useState<FormField[]>([]);

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

                const response = await fetch(
                    `https://sheets.googleapis.com/v4/spreadsheets/${params?.id}/values:batchGet?ranges=Sheet1!1:1&ranges=Sheet1!${params?.selectedId}:${params?.selectedId}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${accesstoken}`,
                        },
                    }
                );

                const data = await response.json();

                console.log(
                    "Sheet Data:",
                    data
                );

                const headers =
                    data.valueRanges?.[0]
                        ?.values?.[0] || [];

                const row =
                    data.valueRanges?.[1]
                        ?.values?.[0] || [];

                const formatted =
                    headers.map(
                        (key: any, index: string | number) => ({
                            label: key,
                            value:
                                row[index] || "",
                        })
                    );

                setFormData(formatted);
            }
        } catch (error) {

            console.log("error", error)

        }
    }

    async function Submit() {
        try {

            if (params?.selectedId !== "0") {

                const updatedRow =
                    formData.map(
                        item => item.value
                    );
                await GoogleSignin.hasPlayServices();
                await GoogleSignin.signIn();
                const tokens = await GoogleSignin.getTokens();
                const accesstoken = tokens.accessToken;

                await fetch(
                    `https://sheets.googleapis.com/v4/spreadsheets/${params?.id}/values/Sheet1!${params?.selectedId}:${params.selectedId}?valueInputOption=RAW`,
                    {
                        method: "PUT",
                        headers: {
                            Authorization:
                                `Bearer ${accesstoken}`,
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            range:
                                `Sheet1!${params?.selectedId}:${params?.selectedId}`,
                            majorDimension:
                                "ROWS",
                            values: [
                                updatedRow
                            ],
                        }),
                    }
                );

            } else {

                const newRow =
                    formData.map(
                        item => item.value
                    );
                await GoogleSignin.hasPlayServices();
                await GoogleSignin.signIn();
                const tokens = await GoogleSignin.getTokens();
                const accesstoken = tokens.accessToken;

                await fetch(
                    `https://sheets.googleapis.com/v4/spreadsheets/${params?.id}/values/Sheet1:append?valueInputOption=RAW`,
                    {
                        method: "POST",
                        headers: {
                            Authorization:
                                `Bearer ${accesstoken}`,
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            values: [newRow],
                        }),
                    }
                );
            }

            Alert.alert(
                "Success",
                "Data saved"
            );

            navigation.goBack();

        } catch (error) {
            console.log("error", error)
        }
    }

    const handleChange = (
        index: number,
        newValue: string
    ) => {
        const updated = [
            ...formData
        ];

        updated[index].value =
            newValue;

        setFormData(updated);
    };

    const AddColumn = () => {
        setFormData([
            ...formData,
            {
                label: "",
                value: ""
            }
        ]);
    };

    return (
        <View style={styles.container}>

            <View
                style={[
                    styles.header,
                    {
                        backgroundColor: hue
                    }
                ]}
            >
                <Text style={styles.headerText}>
                    Edit
                </Text>
            </View>

            <ScrollView
                style={styles.body}
            >
                {formData.map(
                    (item, index) => (
                        <View
                            key={index}
                            style={
                                styles.inputBox
                            }
                        >
                            <Text
                                style={
                                    styles.label
                                }
                            >
                                {params?.selectedId ===
                                    "1"
                                    ? "Name"
                                    : item.label}
                            </Text>

                            <TextInput
                                style={
                                    styles.input
                                }
                                value={
                                    item.value
                                }
                                onChangeText={(
                                    text
                                ) =>
                                    handleChange(
                                        index,
                                        text
                                    )
                                }
                            />
                        </View>
                    )
                )}
            </ScrollView>

            <View
                style={styles.footer}
            >
                {params?.selectedId ===
                    "1" && (
                        <TouchableOpacity
                            style={
                                styles.button
                            }
                            onPress={
                                AddColumn
                            }
                        >
                            <Text
                                style={
                                    styles.buttonText
                                }
                            >
                                Add
                            </Text>
                        </TouchableOpacity>
                    )}

                <TouchableOpacity
                    style={
                        styles.button
                    }
                    onPress={
                        Submit
                    }
                >
                    <Text
                        style={
                            styles.buttonText
                        }
                    >
                        Submit
                    </Text>
                </TouchableOpacity>

            </View>
        </View>
    );
};

const styles =
    StyleSheet.create({
        container: {
            flex: 1,
        },

        header: {
            padding: 15,
            alignItems:
                "center",
        },

        headerText: {
            color: "#fff",
            fontSize: 20,
            fontWeight:
                "bold",
        },

        body: {
            flex: 1,
            padding: 15,
        },

        inputBox: {
            marginBottom: 15,
        },

        label: {
            fontWeight:
                "bold",
            marginBottom: 5,
        },

        input: {
            borderWidth: 1,
            borderRadius: 8,
            padding: 10,
        },

        footer: {
            padding: 15,
            flexDirection:
                "row",
            justifyContent:
                "space-around",
        },

        button: {
            backgroundColor:
                "#4f46e5",
            padding: 12,
            borderRadius: 8,
            minWidth: 120,
            alignItems:
                "center",
        },

        buttonText: {
            color: "#fff",
            fontWeight:
                "bold",
        },
    });

export default TableLayoutEdit;