import CheckBox from "@react-native-community/checkbox";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import Loader from "../app/loader";
import { styles } from "../styles/styles";
import HeaderComp from "./headercomp";

type Props = {
    template?: string;
    layout: string;
    headtext: string;
    hue: number;
    setHue: (value: number) => void;
    items: any[];
    openNoteIndex: number | null;
    setOpenNoteIndex: (value: number | null) => void;
    loading: boolean;
    bgColor: string;
    bgbodyColor: string;
    gradientConfig: any;
    gradientLeafbtn: any;
    handleChange: (index: number, field: "text" | "note" | "bool", value: any) => void;
    submit: (index: number, field: "text" | "note" | "bool", value: any) => void;
    deleteRow: (index: number) => void;
    sheetId: string;
    userEmail: any;
    login: any;
};

export default function ListLayoutView(
    {
        template, layout, headtext, items, hue, setHue, openNoteIndex, setOpenNoteIndex, loading, bgColor, bgbodyColor, gradientConfig, gradientLeafbtn, handleChange, submit, deleteRow, sheetId, userEmail, login
    }: Props) {



    return (
        <>

            {template == "" && (
                <HeaderComp HeaderName={headtext} login={login} hue={hue} setHue={setHue} bgColor={bgColor} />
            )}

            <View style={{ height: template == "" ? "68%" : "100%", backgroundColor: bgbodyColor, }}>
                <ScrollView
                    style={{
                        flex: 1,
                        padding: 10,
                    }}
                >

                    {items.map(
                        (item, index) => (

                            <View
                                key={index}
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginBottom: 10,
                                }}
                            >

                                {(layout === "Check List" ||
                                    template === "Check List") && (

                                        <CheckBox
                                            value={
                                                String(item.bool)
                                                    .trim()
                                                    .toUpperCase() ===
                                                "TRUE"
                                            }

                                            onValueChange={
                                                value =>
                                                    handleChange(
                                                        index,
                                                        "bool",
                                                        value
                                                            ? "TRUE"
                                                            : "FALSE"
                                                    )
                                            }

                                            tintColors={{
                                                true: "#000000",
                                                false: "#000000",
                                            }}
                                        />
                                    )}

                                <TextInput
                                    editable={login === "Login"}
                                    style={{
                                        flex: 1,
                                        borderBottomWidth: 1,
                                        marginHorizontal: 10,
                                    }}

                                    value={item.text}

                                    onChangeText={text =>
                                        handleChange(
                                            index,
                                            "text",
                                            text
                                        )
                                    }

                                    onBlur={() =>
                                        submit(
                                            index,
                                            "text",
                                            item.text
                                        )
                                    }
                                />

                                <TouchableOpacity
                                    onPress={() =>
                                        setOpenNoteIndex(
                                            openNoteIndex === index
                                                ? null
                                                : index
                                        )
                                    }
                                >
                                    <Text
                                        style={{
                                            fontSize: 20,
                                        }}
                                    >
                                        {item.note === ""
                                            ? "📌"
                                            : "📋"}
                                    </Text>
                                </TouchableOpacity>
                                {login == "Login" && (
                                    <TouchableOpacity
                                        onPress={() =>
                                            deleteRow(index)
                                        }
                                    >
                                        <Text
                                            style={{
                                                fontSize: 20,
                                                marginLeft: 10,
                                            }}
                                        >
                                            ❌
                                        </Text>
                                    </TouchableOpacity>
                                )}

                                {openNoteIndex === index && (

                                    <TextInput
                                        multiline
                                        numberOfLines={4}

                                        value={item.note}

                                        placeholder="Write note..."
                                        editable={login === "Login"}
                                        onChangeText={text =>
                                            handleChange(
                                                index,
                                                "note",
                                                text
                                            )
                                        }

                                        onBlur={() =>
                                            submit(
                                                index,
                                                "note",
                                                item.note
                                            )
                                        }

                                        style={{
                                            position: "absolute",
                                            top: 40,
                                            left: "50%",
                                            transform: [
                                                {
                                                    translateX: -100,
                                                },
                                            ],
                                            width: 200,
                                            borderWidth: 1,
                                            backgroundColor: "#fff",
                                            padding: 8,
                                            zIndex: 9,
                                        }}
                                    />
                                )}

                            </View>
                        )
                    )}

                </ScrollView>

            </View>

            {template == "" && (

                <LinearGradient
                    {...gradientConfig}
                    style={styles.footerLayout}
                >

                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent:
                                "space-between",
                        }}
                    >

                        <TouchableOpacity
                            onPress={() =>
                                router.push({
                                    pathname:
                                        "/shareFile",
                                    params: {
                                        id: sheetId,
                                    },
                                })
                            }
                        >
                            {login == "Login" && (
                                <LinearGradient
                                    {...gradientLeafbtn}
                                    style={styles.leafBtn}
                                >
                                    <Text
                                        style={styles.btnText}
                                    >
                                        Share
                                    </Text>
                                </LinearGradient>
                            )}

                        </TouchableOpacity>

                    </View>

                </LinearGradient>
            )}

            <Loader visible={loading} />
        </>
    );
}