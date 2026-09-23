
import { Dimensions, StyleSheet } from 'react-native';
const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
    },

    leftMenu: {
        fontSize: 22,
        position: 'absolute',
        left: 10
    },

    settings: {
        fontSize: 22,
        position: 'absolute',
        right: 10
    },


    menu: {
        position: 'absolute',
        top: 60,
        left: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        paddingVertical: 5,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        minWidth: 150,
        zIndex: 10,
    },

    menuItem: {
        paddingHorizontal: 15,
        paddingVertical: 12,
    },

    menuText: {
        fontSize: 16,
        color: '#222',
    },

    overlay: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },


    slidecontainer: {
        width: '100%',
        flexDirection: 'row',

    },

    rainbow: {
        height: 25,
    },
    slider: {
        position: 'absolute',
        width: '105%',
        height: 25,
        left: -8
        ,
    },
    container: {
        width: '100%',

        zIndex: 10,
    },

    headerLayout: {
        height: "9%",
        alignItems: "center",
        justifyContent: "flex-end",
    },
    bodyLayout: {
        height: "68%",
        backgroundColor: "#f0f4dd",
    },

    footerLayout: {

        height: "18%",
        alignItems: "center",
        justifyContent: "center",
    },
    footerMobile: {
        height: "5%",
        alignItems: "center",
        justifyContent: "center",
    },


    fileList: {
        padding: 10,
        gap: 15, // if unsupported, use margin instead
    },

    fileItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        margin: 8,
        borderWidth: 1,
        backgroundColor: "#2c3e50",
        borderRadius: 50,
        flex: 1,
    },

    active: {
        borderWidth: 3,
        borderColor: "#40924f",
        backgroundColor: "black",
    },

    fileNumber: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "rgba(255,255,255,0.2)",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
    },

    numberText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#FFF",
    },

    fileName: {
        fontSize: 14,
        flexShrink: 1,
        color: "#FFF"
    },

    buttonWrapper: {
        // Keeps the button size constrained to the text width and centers it on the screen
        alignSelf: 'center',
        marginVertical: 10,
    },
    leafBtn: {
        minWidth: 100,
        height: 50,

        paddingHorizontal: 22,

        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        borderBottomRightRadius: 35,
        borderBottomLeftRadius: 35,

        borderWidth: 3,
        borderColor: '#FFF',

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    btnText: {
        color: '#FFFFFF',        // color: black;
        fontWeight: 'bold',    // font-weight: bold;
        fontSize: 18,
    },

    arrow: {
        position: "absolute",
        right: 20,
        top: "50%",
        transform: [{ translateY: -10 }],
        fontSize: 40,
        lineHeight: 40,
        color: "#FFFFFF",
    },
    tableContainer: {
        maxHeight: 'auto',
        borderRadius: 4,
    },
    row: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
    },

    headerRow: {
        backgroundColor: "#316630",
    },
    cell: {
        width: 120,
        padding: 10,
    },

    actionContainer: {
        flexDirection: "row",
    },

    icon: {
        fontSize: 20,
        marginHorizontal: 10,
    },
    button: {
        borderWidth: 1,
        padding: 10,
        marginTop: 10,
        alignItems: "center",
    },

    buttonText: {
        fontWeight: "bold",
    },
    input: {
        borderWidth: 1,
        marginVertical: 10,
        padding: 10,
    },


    inputBox: {
        flexDirection: "row",
        borderRadius: 4,
        overflow: "hidden",
        paddingTop: 5,
        paddingBottom: 5,
        width: "90%",
        alignSelf: "center",
        alignItems: "center",
    },
    inputlabel: {
        // backgroundColor: "#22653a",
        color: "white",
        paddingVertical: 10,
        paddingHorizontal: 10,
        width: "25%",
        textAlign: "center",
    },

    inputtext: {
        flex: 1,
        //paddingVertical: 5,
        // paddingHorizontal: 5,
        backgroundColor: "#FFF",
        color: "#1b5e52",
    },
    carousel: {
        width: width,
        justifyContent: "center",
        alignItems: "center",
    },

    slide: {
        width: width, // use actual screen width
        //justifyContent: "center",
        alignItems: "center",
    },

    card: {
        width: width - 20,
        height: "100%",
        backgroundColor: "#FFF",
    },

    roleText: {
        color: "#4285F4",
        fontWeight: "600",
    },
    selectedText: {
        color: "#fff",
    },

    roleButton: {
        width: "48%",
        borderWidth: 1,
        borderColor: "#4285F4",

        padding: 14,
        alignItems: "center",
    },
    selectedButton: {
        backgroundColor: "#4285F4",
    },
    loaderOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.7)",
        zIndex: 999,
    },
});



export const gradientLeafbtn: {
    colors: readonly [string, string];
    locations: readonly [number, number];
    start: { x: number; y: number };
    end: { x: number; y: number };
} = {
    colors: ["#f4f806", "#03870c"],
    locations: [0, 1],
    start: { x: 0, y: 0 }, // Left sides
    end: { x: 1, y: 0 },   // Right side
};

