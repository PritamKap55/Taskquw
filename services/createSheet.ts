// services/createSheetService.ts

import { registerForPushNotifications } from "@/notification";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export const createOrGetFile = async (
  fileName: string,
  layout: string
): Promise<[string | false, string]> => {
  if (!fileName.trim()) {
    return [false, "Please enter an account name"];
  }

  const { accessToken } = await GoogleSignin.getTokens();

  if (!accessToken) {

    return [false, "Access token not available. Please try again later."];

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
    return [false, "Unable to connect to Google Drive. Please check your internet connection and try again."];
  }

  const searchData = await searchRes.json();

  if (searchData.files?.length > 0) {

    return [false, "Account name already exists"];
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
  console.log("createRes1", createRes);
  if (!createRes.ok) {
    return [false, "Unable to create your account. Please try again later."];
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
    return [false, "Unable to create your account. Please try again later."];
  }

  let values: string[][] = [];

  switch (layout) {
    case "List":
      values = [
        ["Text", "Note", "bool",],
      ];
      break;

    case "Check List":
      values = [
        ["Text", "Note", "bool",],
      ];
      break;

    case "Table":
      values = [
        ["Col1", "Col2", "Col3"],
      ];
      break;

    case "Tree":
      values = [
        ["Id", "Text", "Parent Id"],
        ["1", "Root", "0"],
        ["2", "Child", "1"],
      ];
      break;

    default:
      values = [
        ["Id", "Text"],
        ["1", "First Item"],
        ["2", "Second Item"],
      ];
  }


  // Sheet1 headers
  const sheet1Res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:C3?valueInputOption=RAW`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values }),
    }
  );

  if (!sheet1Res.ok) {
    return [false, "Unable to create your account. Please try again later."];
  }

  // Sheet2 insert values
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
    return [false, "Unable to create your account. Please try again later."];
  }
  return [spreadsheetId, "Account created successfully."];
};