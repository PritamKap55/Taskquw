import { getAccessToken } from "./googleAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";

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


export type FormField = {
  label: string;
  value: string;
};

export const getTableRow = async (
  spreadsheetId: string,
  selectedId: string
): Promise<FormField[]> => {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    throw new Error("Access token not available");
  }

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchGet` +
      `?ranges=Sheet1!1:1&ranges=Sheet1!${selectedId}:${selectedId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to get sheet data");
  }

  const data = await response.json();

  const headers = data.valueRanges?.[0]?.values?.[0] || [];
  const row = data.valueRanges?.[1]?.values?.[0] || [];

  return headers.map((key: string, index: number) => ({
    label: key,
    value: row[index] || "",
  }));
};

export const updateTableRow = async (
  spreadsheetId: string,
  selectedId: string,
  formData: FormField[]
) => {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    throw new Error("Access token not available");
  }

  const updatedRow = formData.map(item => item.value);

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!${selectedId}:${selectedId}?valueInputOption=RAW`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        range: `Sheet1!${selectedId}:${selectedId}`,
        majorDimension: "ROWS",
        values: [updatedRow],
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update row");
  }
};

export const appendTableRow = async (
  spreadsheetId: string,
  formData: FormField[]
) => {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    throw new Error("Access token not available");
  }

  const newRow = formData.map(item => item.value);

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1:append?valueInputOption=RAW`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        values: [newRow],
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to add row");
  }
};