import { getAccessToken } from "./googleAuth";

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
export async function fetchTreeFromSheet(
    sheetId: string
): Promise<{
    tree: TreeNodeType[];
    tokens: string[];
}> {

    const accessToken = await getAccessToken();
    if (!accessToken) {
        return {
            tree: [],
            tokens: [],
        };
    }

    const res = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A1:C100`,
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
        return {
            tree: [],
            tokens: [],
        };
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

    // Sheet2 notification tokens
    const range = encodeURIComponent("Sheet2!A:A");

    const tokenResponse = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    const tokenData = await tokenResponse.json();

    const tokens = (tokenData.values || [])
        .slice(1)
        .map((row: any[]) => row[0])
        .filter(Boolean);

    return {
        tree: buildTree(list),
        tokens,
    };
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

/**
 * Update existing tree node name in Google Sheet
 */
export const updateTreeNode = async (
    spreadsheetId: string,
    accessToken: string,
    rowNumber: number,
    newName: string
): Promise<void> => {

    const res = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!B${rowNumber}?valueInputOption=USER_ENTERED`,
        {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                values: [[newName]],
            }),
        }
    );

    if (!res.ok) {
        throw new Error(`Update node failed: ${res.status}`);
    }
};