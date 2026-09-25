import React from "react";
import {
    FlatList,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import Loader from "../app/loader";
import { styles } from "../app/styles";
import { FileItem } from "../services/accountSheets";
import HeaderComp from "./headercomp";

type Props = {
    files: FileItem[];
    selectedFile: FileItem | null;
    setSelectedFile: (
        file: FileItem | null
    ) => void;

    hue: number;
    setHue: (hue: number) => void;

    sheetStatus: Record<
        string,
        string | null
    >;

    loading: boolean;

    bgbodyColor: string;
    bgColor: string;

    gradientConfig: any;
    gradientLeafbtn: any;
};

export default function AccountView({
    files,
    selectedFile,
    setSelectedFile,
    hue,
    setHue,
    sheetStatus,
    loading,
    bgbodyColor,
    bgColor,
    gradientConfig,
    gradientLeafbtn,
}: Props) {

    return (
        <>
            <HeaderComp/>
            <View
                style={[
                    styles.bodyLayout,
                    {
                        backgroundColor:
                            bgbodyColor,
                    },
                ]}
            >

                <FlatList
                    data={files}
                    keyExtractor={item => item.id}
                    numColumns={1}
                    contentContainerStyle={
                        styles.fileList
                    }

                    renderItem={({
                        item,
                        index,
                    }) => (

                        <TouchableOpacity
                            style={[
                                styles.fileItem,

                                selectedFile?.id === item.id &&
                                styles.active,
                            ]}

                            onPress={() => {

                                setSelectedFile(item);

                                router.push({
                                    pathname:
                                        "/detailspage",

                                    params: {
                                        layout:
                                            item.properties?.layout,

                                        id: item.id,

                                        headtext:
                                            item.name,
                                    },
                                });

                            }}
                        >

                            <View
                                style={[
                                    styles.fileNumber,

                                    sheetStatus[item.id] ===
                                    "1" && {
                                        backgroundColor:
                                            "#00A300",

                                        borderRadius: 18,
                                    },
                                ]}
                            >

                                <Text
                                    style={styles.numberText}
                                >
                                    {String(index + 1)
                                        .padStart(2, "0")}
                                </Text>

                            </View>

                            <Text
                                style={styles.fileName}
                            >
                                {item.name}
                            </Text>

                            <Text
                                style={styles.arrow}
                            >
                                ›
                            </Text>

                        </TouchableOpacity>
                    )}
                />

            </View>

            <LinearGradient
                {...gradientConfig}
                style={styles.footerLayout}
            >

                <TouchableOpacity
                    onPress={() =>
                        router.push({
                            pathname:
                                "/createsheet",

                            params: {
                                headtext:
                                    "Create Page",
                            },
                        })
                    }
                >

                    <LinearGradient
                        {...gradientLeafbtn}
                        style={styles.leafBtn}
                    >

                        <Text style={styles.btnText}>
                            Create New Account
                        </Text>

                    </LinearGradient>

                </TouchableOpacity>

            </LinearGradient>

            <View
                style={[
                    styles.footerMobile,
                    {
                        backgroundColor:
                            bgColor,
                    },
                ]}
            />

            <Loader visible={loading} />
        </>
    );
}