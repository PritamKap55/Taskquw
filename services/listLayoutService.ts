import { getAccessToken } from "../app/googleAuth";

export type ListItem = {
    text: string;
    note: string;
    bool: boolean;
};

export async function checkWritePermission(
    sheetId: string
): Promise<boolean> {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        return false;
    }

    const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${sheetId}?fields=capabilities`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    if (!response.ok) {
        return false;
    }

    const data = await response.json();

    return data.capabilities?.canEdit ?? false;
}

export async function updateSheetValue(
    sheetId: string,
    rowIndex: number,
    field: "text" | "note" | "bool",
    value: string | boolean
): Promise<void> {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        return;
    }

    const colMap = {
        text: "A",
        note: "B",
        bool: "C",
    };

    const col = colMap[field];

    await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!${col}${rowIndex + 2}?valueInputOption=USER_ENTERED`,
        {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                values: [[value]],
            }),
        }
    );
}

export async function getSheetData(
    sheetId: string
): Promise<{
    items: ListItem[];
    tokens: string[];
}> {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        return {
            items: [],
            tokens: [],
        };
    }

    // Sheet1
    const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A2:C100`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    const data = await response.json();

    const values = data?.values || [];

    const items: ListItem[] = values.map(
        (row: any[]) => ({
            text: row[0] || "",
            note: row[1] || "",
            bool:
                row[2] === "TRUE" ||
                row[2] === true,
        })
    );

    while (items.length < 10) {
        items.push({
            text: "",
            note: "",
            bool: false,
        });
    }

    // Extra empty row
    items.push({
        text: "",
        note: "",
        bool: false,
    });

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
        items,
        tokens,
    };
}

export async function deleteSheetRow(
    sheetId: string,
    rowIndex: number
): Promise<void> {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        return;
    }

    await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}:batchUpdate`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                requests: [
                    {
                        deleteDimension: {
                            range: {
                                sheetId: 0,
                                dimension: "ROWS",
                                startIndex: rowIndex + 1,
                                endIndex: rowIndex + 2,
                            },
                        },
                    },
                ],
            }),
        }
    );
}