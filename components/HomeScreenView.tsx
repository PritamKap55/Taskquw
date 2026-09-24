import React from "react";
import { Pressable, Text, TextInput, View, } from "react-native";

import { styles } from "../app/loginstyles";

type HomeScreenViewProps = {
    bgColor: string;
    email: string;
    online: boolean;
    setEmail: (email: string) => void;
    changeColor: () => void;
    login: () => void;
};

export default function HomeScreenView({bgColor,email,online,setEmail,changeColor,login,}: HomeScreenViewProps) {
    return (
        <>
            <Pressable style={{ flex: 1 }} onPress={changeColor}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: bgColor, }}>
                    <View style={[styles.container, { width: "90%" }]}>

                        <Text style={styles.heading}>
                            Welcome!...
                        </Text>

                        {online === true ? (
                            <Pressable style={styles.button} onPress={login}>
                                <Text style={styles.buttonText}>
                                    Login
                                </Text>
                            </Pressable>
                        ) : (
                            <>
                                <View
                                    style={{
                                        width: "100%",
                                        flexDirection: "row",
                                        alignItems: "center",
                                    }}
                                >
                                    <Text
                                        style={{
                                            width: "30%",
                                            color: "white",
                                            textAlign: "center",
                                        }}
                                    >
                                        Email
                                    </Text>

                                    <TextInput
                                        style={{
                                            width: "70%",
                                            backgroundColor: "white",
                                            padding: 10,
                                        }}
                                        value={email}
                                        onChangeText={setEmail}
                                        placeholder="Enter email"
                                    />
                                </View>

                                <Pressable style={styles.button} onPress={login}>
                                    <Text style={styles.buttonText}>
                                        Offline
                                    </Text>
                                </Pressable>
                            </>
                        )}
                    </View>
                </View>
            </Pressable>
        </>
    );
}