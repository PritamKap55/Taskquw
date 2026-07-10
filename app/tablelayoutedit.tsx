import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { getAccessToken } from "./googleAuth";
import HeaderComp from "./headercomp";
import { gradientLeafbtn, styles } from "./styles";

const TableLayoutEdit = () => {
    const [hue, setHue] = useState(0);
    const bgbodyColor = `hsl(${hue}, 100%, 95%)`;
    const bgF1Color = `hsl(${hue}, 100%, 94%)`;
    const bgF2Color = `hsl(${hue}, 100%, 75%)`;
    const bgF3Color = `hsl(${hue}, 100%, 27%)`;
    const gradientConfig: {
        colors: readonly [string, string, string];
        locations: readonly [number, number, number];
    } = {
        colors: [bgF1Color, bgF2Color, bgF3Color],
        locations: [0, 0.5, 1],
    };

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
                const accessToken = await getAccessToken();
                if (!accessToken) return;

                const response = await fetch(
                    `https://sheets.googleapis.com/v4/spreadsheets/${params?.id}/values:batchGet?ranges=Sheet1!1:1&ranges=Sheet1!${params?.selectedId}:${params?.selectedId}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                const data = await response.json();
                const headers = data.valueRanges?.[0]?.values?.[0] || [];
                const row = data.valueRanges?.[1]?.values?.[0] || [];

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
                const accessToken = await getAccessToken();
                if (!accessToken) return;
                await fetch(
                    `https://sheets.googleapis.com/v4/spreadsheets/${params?.id}/values/Sheet1!${params?.selectedId}:${params.selectedId}?valueInputOption=RAW`,
                    {
                        method: "PUT",
                        headers: {
                            Authorization:
                                `Bearer ${accessToken}`,
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
                const accessToken = await getAccessToken();
                if (!accessToken) return;
                await fetch(
                    `https://sheets.googleapis.com/v4/spreadsheets/${params?.id}/values/Sheet1:append?valueInputOption=RAW`,
                    {
                        method: "POST",
                        headers: {
                            Authorization:
                                `Bearer ${accessToken}`,
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            values: [newRow],
                        }),
                    }
                );
            }

            Alert.alert("Success", "Data saved");

            //navigation.goBack();
            router.replace({ pathname: "/tablelayout" ,params: { layout: params?.layout, id: params?.id, headtext: params?.name },});

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
        <>

            <HeaderComp hue={hue} setHue={setHue} />
            <View style={[styles.bodyLayout, { backgroundColor: bgbodyColor }]}>
                <ScrollView>
                    {formData.map(
                        (item, index) => (
                            <View key={index} style={styles.inputBox}>
                                <Text style={styles.inputlabel}>
                                    {params?.selectedId === "1" ? "Name" : item.label}
                                </Text>

                                <TextInput style={styles.inputtext}
                                    value={item.value}
                                    onChangeText={(text) => handleChange(index, text)}
                                />
                            </View>
                        )
                    )}
                </ScrollView>
            </View>
            <LinearGradient {...gradientConfig} style={[styles.footerLayout]}>

                {params?.selectedId === "1" && (
                    <TouchableOpacity onPress={AddColumn} >
                        <LinearGradient {...gradientLeafbtn} style={styles.leafBtn} >
                            <Text style={styles.buttonText} > Add </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                )}

                <TouchableOpacity onPress={Submit}>
                    <LinearGradient {...gradientLeafbtn} style={styles.leafBtn} >
                        <Text style={styles.btnText}>
                            Submit
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </LinearGradient>
        </>
    );
};
export default TableLayoutEdit;