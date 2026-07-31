const API_URL =
    "https://notification-server-bay.vercel.app/api/expoNotification";

export async function sendNotification(
    token,
    body = ""
) {
    try {
        const title = "Taskquw";
        const data = {
            screen: "detailspage",
        };
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            token,
            title,
            body,
            data,
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        const response = await fetch(API_URL, requestOptions);
        const result = await response.json();

        console.log("Notification Response:", result);

        return result;
    } catch (error) {
        console.error("Notification Error:", error);
        throw error;
    }
}