// services/shareFileService.ts

import { getAccessToken } from "./googleAuth";

export type SharedUser = {
    id: string;
    type?: string;
    emailAddress?: string;
    displayName?: string;
    role?: "owner" | "organizer" | "fileOrganizer" | "writer" | "commenter" | "reader";
};

export const shareFile = async (
    fileId: string,
    email: string,
    role: "reader" | "writer"
) => {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        throw new Error("Unable to get access token.");
    }

    const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}/permissions`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                role,
                type: "user",
                emailAddress: email.trim(),
            }),
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.error?.message || "Unable to share file."
        );
    }

    return result;
};

export const getSharedUsers = async (
    fileId: string
): Promise<SharedUser[]> => {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        throw new Error("Unable to get access token.");
    }

    const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}/permissions?fields=permissions(id,type,emailAddress,displayName,role)`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.error?.message ||
            "Unable to get shared users."
        );
    }

    return result.permissions || [];
};