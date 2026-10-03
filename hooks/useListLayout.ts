import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

import { list } from "../app/data";
import { sendNotification } from "../app/sendNotification";
import { getInDeviceLayout, saveInDeviceLayout } from "../services/dataStorage";
import { ListItem, checkWritePermission, deleteSheetRow, getSheetData, updateSheetValue, } from "../services/listLayoutService";

type Props = {
    template?: string;
    layout: string;
    userEmail: string;
    login: string;
};

export function useListLayout({ template, layout, userEmail, login,
}: Props) {
    const params = useLocalSearchParams();
    const [fileName, setFileName] = useState("");
    const [hue, setHue] = useState(0);
    const [items, setItems] = useState<ListItem[]>([]);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [openNoteIndex, setOpenNoteIndex] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [notificationRef, setNotificationRef] = useState(false);
    const [nftokensRef, setNftokensRef] = useState<string[]>([]);

    const loadHue = async (): Promise<void> => {
        try {
            const savedValue =
                await AsyncStorage.getItem("myHue");

            if (savedValue !== null) {
                setHue(parseInt(savedValue, 10));
            }
        } catch (error) {
            console.error("Error loadHue", error);
        }
    };

    const removeSheetIdFromStorage =
        async (): Promise<void> => {
            try {
                const sheetId = String(params?.id ?? "");

                if (!sheetId) {
                    return;
                }

                const savedValue =
                    await AsyncStorage.getItem(sheetId);

                if (savedValue !== null) {
                    await AsyncStorage.removeItem(sheetId);
                }
            } catch (error) {
                console.error(
                    "Error removing sheetId:",
                    error
                );
            }
        };

    const getData = async (): Promise<void> => {
        setLoading(true);

        try {
            const sheetId = String(
                params?.id ?? ""
            );
            if (login == "login") {
                const result = await getSheetData(sheetId);
                setItems(result.items);
                // Save local copy
                await saveInDeviceLayout(userEmail, sheetId, result.items);
                setNftokensRef(result.tokens);
            } else {
                const result = await getInDeviceLayout(userEmail, sheetId);
                setItems(result);
            }

        } catch (error) {
            console.error(
                "Error loading sheet:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    const submit = async (
        index: number,
        field: "text" | "note" | "bool",
        value: string | boolean
    ): Promise<void> => {

        setLoading(true);

        try {
            const sheetId = String(
                params?.id ?? ""
            );

            const canEdit =
                await checkWritePermission(sheetId);

            if (!canEdit) {
                Alert.alert(
                    "Permission Denied",
                    "You don't have permission to edit this file."
                );

                return;
            }

            await updateSheetValue(
                sheetId,
                index,
                field,
                value
            );

            await getData();

            if (notificationRef) {
                await callNotification();
            }

            setNotificationRef(false);

        } catch (error) {
            console.error(
                "Error Submit:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (
        index: number,
        field: "text" | "note" | "bool",
        value: any
    ): void => {

        const newItems = [...items];

        newItems[index] = {
            ...newItems[index],
            [field]: value,
        };

        setItems(newItems);

        if (field === "bool") {
            submit(
                index,
                field,
                value
            );
        }
    };

    const deleteRow = async (
        rowIndex: number
    ): Promise<void> => {

        Alert.alert(
            "Delete Row",
            "Are you sure you want to delete this row?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",

                    onPress: async () => {
                        setLoading(true);

                        try {
                            const sheetId = String(
                                params?.id ?? ""
                            );

                            await deleteSheetRow(
                                sheetId,
                                rowIndex
                            );

                            await getData();

                        } catch (error) {
                            console.error(
                                "Error Delete:",
                                error
                            );
                        } finally {
                            setLoading(false);
                        }
                    },
                },
            ]
        );
    };

    const callNotification =
        async (): Promise<void> => {
            try {
                await sendNotification(
                    nftokensRef,
                    String(
                        params?.headtext ?? ""
                    ),
                    "normal",
                    {
                        sheetId: params?.id,
                        NF_Type: 2,
                    }
                );
            } catch (error) {
                console.error(
                    "Error call_notification:",
                    error
                );
            }
        };

    useEffect(() => {
        alert("login" + login);
        loadHue();
        removeSheetIdFromStorage();

        if (template === "New") {
            setItems(list.values);
        } else {
            getData();
        }
    }, []);

    return {
        hue,
        setHue,
        items,
        openNoteIndex,
        setOpenNoteIndex,
        loading,
        handleChange,
        submit,
        deleteRow,
        nftokensRef,
        callNotification,
        params,
        layout,
        template,
    };
}