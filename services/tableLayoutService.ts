import { getAccessToken } from "../app/googleAuth";

export type TableRow = (string | number)[][];

export const getTableSheetData = async (
  sheetId: string
): Promise<TableRow> => {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return [];
    }

    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1`,
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

    return data?.values || [];
  } catch (error) {
    console.error("Error Get Sheet:", error);
    return [];
  }
};