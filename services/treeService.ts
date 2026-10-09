import AsyncStorage from "@react-native-async-storage/async-storage";

export type TreeNodeType = {
    id: number;
    name: string;
    parent: number;
    rowNumber: number;
    children: TreeNodeType[];
};

const getCacheKey = (spreadsheetId: string) =>
    `treeData_${spreadsheetId}`;

/**
 * Get tree data from Google Sheets
 */
export const fetchTreeFromSheet = async (
    spreadsheetId: string,
    accessToken: string
): Promise<TreeNodeType[]> => {
    const res = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:C100`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    if (!res.ok) {
        throw new Error(`Google Sheets error: ${res.status}`);
    }

    const data = await res.json();

    if (!data.values) {
        return [];
    }

    const rows = data.values.slice(1);

    const list: TreeNodeType[] = rows.map(
        (r: string[], index: number) => ({
            id: Number(r[0]),
            name: r[1] || "",
            parent: Number(r[2] || 0),
            rowNumber: index + 2,
            children: [],
        })
    );

    return buildTree(list);
};

/**
 * Convert flat list into tree
 */
const buildTree = (
    items: TreeNodeType[]
): TreeNodeType[] => {
    const map: Record<number, TreeNodeType> = {};
    const roots: TreeNodeType[] = [];

    items.forEach((item) => {
        map[item.id] = {
            ...item,
            children: [],
        };
    });

    items.forEach((item) => {
        if (item.parent === 0) {
            roots.push(map[item.id]);
        } else {
            map[item.parent]?.children.push(map[item.id]);
        }
    });

    return roots;
};


export const appendTreeNode = async (
    spreadsheetId: string,
    accessToken: string,
    node: TreeNodeType
): Promise<void> => {
    const res = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A:C:append?valueInputOption=USER_ENTERED`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                values: [
                    [
                        node.id,
                        node.name,
                        node.parent,
                    ],
                ],
            }),
        }
    );

    if (!res.ok) {
        throw new Error(`Save node failed: ${res.status}`);
    }
};

/**
 * Delete rows from Google Sheet
 */
export const deleteTreeRows = async (
    spreadsheetId: string,
    accessToken: string,
    rows: number[]
): Promise<void> => {
    const sortedRows = [...rows].sort(
        (a, b) => b - a
    );

    const requests = sortedRows.map((row) => ({
        deleteDimension: {
            range: {
                sheetId: 0,
                dimension: "ROWS",
                startIndex: row - 1,
                endIndex: row,
            },
        },
    }));

    const res = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                requests,
            }),
        }
    );

    if (!res.ok) {
        throw new Error(`Delete failed: ${res.status}`);
    }
};