import { registerForPushNotifications } from "@/notification";
import { sendNotification } from "../app/sendNotification";

export type FileItem = {
  id: string;
  name: string;
  properties?: {
    layout?: string;
    [key: string]: any;
  };
  permissions?: any[];
};

export const getGoogleSheets = async (
  accessToken: string
): Promise<FileItem[]> => {

  const query =
    "mimeType='application/vnd.google-apps.spreadsheet' " +
    "and properties has { key='app' and value='PKapp' } " +
    "and trashed=false";

  const url =
    `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
      query
    )}&fields=files(id,name,properties,permissions)`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Drive API error: ${response.status}`
    );
  }

  const data = await response.json();

  return data.files ?? [];
};

export async function notificationAccess(
  sheetId: string,
  accessToken: string,
  NF_token: string,
  writerPermission: boolean
): Promise<void> {

  const range = encodeURIComponent("Sheet2!A:B");

  const getResponse = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!getResponse.ok) {
    console.error(
      "Sheet read failed:",
      getResponse.status
    );
    return;
  }

  const data = await getResponse.json();

  const values: string[][] = data.values || [];

  const exists = values.some(
    row => row[0] === NF_token
  );

  console.log(
    "exists:",
    exists,
    "writer:",
    writerPermission
  );

  // Writer / owner
  if (!exists && writerPermission) {

    const appendResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet2!A:A:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values: [[NF_token, "True"]],
        }),
      }
    );

    const appendData = await appendResponse.json();

    if (!appendResponse.ok) {
      console.error(
        "Insert failed:",
        appendData
      );
    } else {
      console.log(
        "NF token inserted:",
        appendData
      );
    }

    return;
  }

  // Reader
  if (!exists && !writerPermission) {

    const tokens =
      data.values
        ?.filter(
          (row: string[]) =>
            row?.[1] === "True"
        )
        ?.map(
          (row: string[]) => row?.[0]
        ) || [];

    sendNotification(
      tokens,
      "Add Notification token :" + sheetId,
      "silent",
      {
        userNF_token: NF_token,
        userType: "1",
        sheetId,
        NF_Type: 1,
      }
    ).catch(console.error);
  }
}