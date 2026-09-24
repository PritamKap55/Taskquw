import NetInfo from "@react-native-community/netinfo";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import { useEffect, useState } from "react";

export function useHomeScreen() {
    const [bgColor, setBgColor] = useState("#008080");
    const [email, setEmail] = useState("pritam");
    const [online, setOnline] = useState(true);

    const changeColor = (): void => {
        const randomColor =
            "#" +
            Math.floor(Math.random() * 16777215)
                .toString(16)
                .padStart(6, "0");

        setBgColor(randomColor);
    };

    const login = async (): Promise<void> => {
        try {
            await GoogleSignin.hasPlayServices();

            const userInfo = await GoogleSignin.signIn();

            const userEmail = userInfo.data?.user?.email ?? "";

            setEmail(userEmail);

            router.push({
                pathname: "/account",
                params: {
                    email: userEmail,
                },
            });
        } catch (error) {
            console.error("Error login", error);
        }
    };

    const checkInternet = async (): Promise<boolean> => {
        const state = await NetInfo.fetch();

        console.log("Connected:", state.isConnected);
        console.log("Internet reachable:", state.isInternetReachable);

        return Boolean(
            state.isConnected && state.isInternetReachable
        );
    };

    useEffect(() => {
        const checkAndLogin = async (): Promise<void> => {
            const internetAvailable = await checkInternet();

            if (internetAvailable) {
                setOnline(true);
                await login();
            } else {
                setOnline(false);
            }
        };

        checkAndLogin();
    }, []);

    return {
        bgColor,
        email,
        online,
        setEmail,
        changeColor,
        login,
    };
}