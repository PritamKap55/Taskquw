import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { styles } from "../app/styles";
import HeaderComp from "./headercomp";

type TableRow = (string | number)[][];

type Props = {
    template?: string;
    layout: string;
    params: any;
    headtext: string;
    hue: number;
    setHue: (value: number) => void;
    items: TableRow;
    bgColor: string;
    bgbodyColor: string;
    bgF4Color: string;
    oppositeColor: string;
    gradientConfig: any;
    gradientLeafbtn: any;
    userEmail: any;
    login: any;
};

export default function TableLayoutView({
    template,
    layout,
    params,
    headtext, hue, setHue,
    items,
    bgColor,
    bgbodyColor,
    bgF4Color,
    oppositeColor,
    gradientConfig,
    gradientLeafbtn,
    userEmail,
    login,
}: Props) {
    return (
        <>
            {template == "" && (
                <HeaderComp HeaderName={headtext} login={login} hue={hue} setHue={setHue} bgColor={bgColor} />
            )}

            <View
                style={{
                    height: template =="" ? "68%" : "100%",
                    backgroundColor: bgbodyColor,
                }}
            >
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={true}
                >
                    <ScrollView showsVerticalScrollIndicator={true}>
                        <View style={styles.tableContainer}>

                            {/* Header */}
                            <View
                                style={[
                                    styles.row,
                                    {
                                        backgroundColor: oppositeColor,
                                    },
                                ]}
                            >
                                {items[0]?.map((header, i) => (
                                    <Text
                                        key={i}
                                        style={[
                                            styles.cell,
                                            {
                                                color: "#FFF",
                                            },
                                        ]}
                                    >
                                        {header}
                                    </Text>
                                ))}

                                <TouchableOpacity
                                    onPress={() =>
                                        router.push({
                                            pathname: "/tablelayoutedit",
                                            params: {
                                                layout: "",
                                                id: params?.id,
                                                headtext: "Column Edit",
                                                selectedId: 1,
                                            },
                                        })
                                    }
                                >
                                    <Text style={styles.icon}>➕✏️</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Rows */}
                            {items.slice(1).map((row, rowIndex) => (
                                <View
                                    key={rowIndex}
                                    style={[
                                        styles.row,
                                        {
                                            backgroundColor:
                                                rowIndex % 2 === 0
                                                    ? bgbodyColor
                                                    : bgF4Color,
                                        },
                                    ]}
                                >
                                    {items[0]?.map((_, colIndex) => (
                                        <Text
                                            key={colIndex}
                                            style={styles.cell}
                                        >
                                            {row[colIndex] || ""}
                                        </Text>
                                    ))}

                                    {/* Actions */}
                                    <View style={styles.actionContainer}>

                                        <TouchableOpacity
                                            onPress={() =>
                                                router.push({
                                                    pathname: "/tablelayoutedit",
                                                    params: {
                                                        layout: "",
                                                        id: params?.id,
                                                        headtext: "Table Edit",
                                                        selectedId: rowIndex + 2,
                                                    },
                                                })
                                            }
                                        >
                                            <Text style={styles.icon}>✏️</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity>
                                            <Text style={styles.icon}>❌</Text>
                                        </TouchableOpacity>

                                    </View>
                                </View>
                            ))}

                        </View>
                    </ScrollView>
                </ScrollView>
            </View>

            {/* Footer */}
            {template =="" && (
                <LinearGradient
                    {...gradientConfig}
                    style={styles.footerLayout}
                >
                    {/* Add New Row */}
                    <TouchableOpacity
                        onPress={() =>
                            router.push({
                                pathname: "/tablelayoutedit",
                                params: {
                                    layout: "",
                                    id: params?.id,
                                    headtext: "Table Edit",
                                    selectedId: items.length + 1,
                                },
                            })
                        }
                    >
                        <LinearGradient
                            {...gradientLeafbtn}
                            style={styles.leafBtn}
                        >
                            <Text style={styles.btnText}>
                                + Add New Row
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Share */}
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <TouchableOpacity>
                            <LinearGradient
                                {...gradientLeafbtn}
                                style={styles.leafBtn}
                            >
                                <Text style={styles.btnText}>
                                    Share
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            )}
        </>
    );
}