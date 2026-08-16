import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { getThemeColors } from './color';
import HeaderComp from "./headercomp";
import { styles } from "./styles";


export default function AppInfo() {
    const [hue, setHue] = useState(0);
    const { bgbodyColor, bgColor, gradientConfig, } = getThemeColors(hue);
    const loadHue = async () => {
        try {
            const savedValue = await AsyncStorage.getItem('myHue');
            if (savedValue !== null) {
                setHue(parseInt(savedValue, 10));
            }
        } catch (error) {
            console.error("Error loadHue", error);
        }
    };

    useEffect(() => {
        loadHue();
    }, []);
    return (
        <>
            <HeaderComp hue={hue} setHue={setHue} />
            <View style={[styles.bodyLayout, { backgroundColor: bgbodyColor }]}>
                <Text >About Us</Text>

                <Text>
                    Welcome to our app. We are dedicated to creating a simple,
                    useful, and enjoyable experience for our users.
                </Text>
            </View>
            <LinearGradient {...gradientConfig} style={[styles.footerLayout]}>


            </LinearGradient>
            <View style={[styles.footerMobile, { backgroundColor: bgColor }]}>

            </View>
        </>
    );
}

