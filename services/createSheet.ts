// services/createSheetService.ts

import { registerForPushNotifications } from "@/notification";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export const createOrGetFile = async (
  fileName: string,
  layout: string
): Promise<string> => {
  if (!fileName.trim()) {
    throw new Error("Please enter an account name");
  }

  const { accessToken } = await GoogleSignin.getTokens();

  if (!accessToken) {
    throw new Error("Access token not available");
  }

  const token = await registerForPushNotifications();

  // Check existing file
  const query =
    `name='${fileName}' ` +
    `and mimeType='application/vnd.google-apps.spreadsheet' ` +
    `and trashed=false`;

  const searchRes = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!searchRes.ok) {
    throw new Error("Failed to search Google Drive");
  }

  const searchData = await searchRes.json();

  if (searchData.files?.length > 0) {
    return searchData.files[0].id;
  }

  // Create spreadsheet
  const createRes = await fetch(
    "https://www.googleapis.com/drive/v3/files",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: fileName,
        mimeType: "application/vnd.google-apps.spreadsheet",
        properties: {
          app: "PKapp",
          layout,
        },
      }),
    }
  );

  if (!createRes.ok) {
    throw new Error("Failed to create spreadsheet");
  }

  const createData = await createRes.json();
  const spreadsheetId = createData.id;

  await new Promise(resolve => setTimeout(resolve, 1000));

  // Create Sheet2
  const sheet2Res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requests: [
          {
            addSheet: {
              properties: {
                title: "Sheet2",
              },
            },
          },
        ],
      }),
    }
  );

  if (!sheet2Res.ok) {
    throw new Error("Failed to create Sheet2");
  }

  // Sheet1 headers
  const sheet1Res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:C1?valueInputOption=RAW`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        values: [["text", "note", "bool"]],
      }),
    }
  );

  if (!sheet1Res.ok) {
    throw new Error("Failed to write Sheet1");
  }

  // Sheet2 values
  const sheet2ValuesRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet2!A1:B2?valueInputOption=RAW`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        range: "Sheet2!A1:B2",
        majorDimension: "ROWS",
        values: [
          ["Notifications token", "Admin"],
          [token ?? "", "True"],
        ],
      }),
    }
  );

  if (!sheet2ValuesRes.ok) {
    throw new Error("Failed to write Sheet2");
  }

  return spreadsheetId;
};