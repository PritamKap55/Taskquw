import { getAccessToken } from "./googleAuth";

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
  sheetId: string,
  selectedId: string
): Promise<{ FormField: FormField[], tokens: string[]; }> => {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return {
      FormField: [],
      tokens: [],
    };
  }

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values:batchGet` +
    `?ranges=Sheet1!1:1&ranges=Sheet1!${selectedId}:${selectedId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    return {
      FormField: [],
      tokens: [],
    };
  }

  const data = await response.json();

  const headers = data.valueRanges?.[0]?.values?.[0] || [];
  const row = data.valueRanges?.[1]?.values?.[0] || [];

  const formFields: FormField[] = headers.map((key: string, index: number) => ({
    label: key,
    value: row[index] || "",
  }));


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
    FormField: formFields,
    tokens,
  };
};

export const updateTableRow = async (
  sheetId: string,
  selectedId: string,
  formData: FormField[]
) => {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    throw new Error("Access token not available");
  }

  const updatedRow = formData.map(item => item.value);

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!${selectedId}:${selectedId}?valueInputOption=RAW`,
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
  sheetId: string,
  formData: FormField[]
) => {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    throw new Error("Access token not available");
  }

  const newRow = formData.map(item => item.value);

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1:append?valueInputOption=RAW`,
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