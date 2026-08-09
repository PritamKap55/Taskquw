const API_URL =
    "https://notification-server-bay.vercel.app/api/expoNotification";

export async function sendNotification(
    tokens,
    body = "",
    //type = "normal"
    type = "",
    extraData = {}

) {
    try {
        const title = "Taskquw";
        const data = {
            screen: "detailspage",
            notificationType: type,
            ...extraData,
        };


        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            tokens,
            title,
            body,
            data,
        });
        console.log("myHeaders raw", raw);
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };
        console.log("myHeaders requestOptions", requestOptions);
        const response = await fetch(API_URL, requestOptions);
        const result = await response.json();

        return result;
    } catch (error) {
        console.error("Error Notification", error);
        throw error;
    }
}