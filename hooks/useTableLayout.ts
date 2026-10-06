import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import { tableData } from "../app/data";
import { getTableSheetData } from "../services/tableLayoutService";

export type TableRow = (string | number)[][];

type UseTableLayoutProps = {
    template?: string;
    layout: string;
    headtext:string;
    userEmail: string;
    login: string;
};

export const useTableLayout = ({
    template,
    layout, headtext,userEmail, login,
}: UseTableLayoutProps) => {
    const params = useLocalSearchParams();

    const [hue, setHue] = useState(0);
    const [items, setItems] = useState<TableRow>([]);
    const [loading, setLoading] = useState(false);

    const loadHue = async () => {
        try {
            const savedValue = await AsyncStorage.getItem("myHue");

            if (savedValue !== null) {
                setHue(parseInt(savedValue, 10));
            }
        } catch (error) {
            console.error("Error loadHue:", error);
        }
    };

    const getSheetData = async () => {
        if (!params?.id) return;

        try {
            setLoading(true);

            const sheetData = await getTableSheetData(
                String(params.id)
            );

            setItems(sheetData);
        } catch (error) {
            console.error("Error loading table:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadHue();

        if (params?.id) {
            getSheetData();
        } else {
            setItems(tableData);
        }
    }, []);

    return {
        params,
        template,
        hue,
        setHue,
        items,
        setItems,
        loading,
        getSheetData,
    };
};