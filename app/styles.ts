
import { Dimensions, StyleSheet } from 'react-native';
const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
    },
    settings: {
        fontSize: 22,
        position: 'absolute',
        right: 10
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
        // padding: 5px 13px;
        paddingVertical: 5,
        paddingHorizontal: 13,

        // border-radius: 60px 0 60px 0;
        borderTopLeftRadius: 60,
        borderBottomRightRadius: 60,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 0,

        // display: flex; align-items: center; justify-content: center;
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnText: {
        color: 'black',        // color: black;
        fontWeight: 'bold',    // font-weight: bold;
        fontSize: 16,
    },
    tableContainer: {
        maxHeight: 'auto',
        borderRadius: 4,
    },
    row: {
        flexDirection: "row",
        borderWidth: 0.5,
        //minHeight: 50,
        alignItems: "center",
    },

    headerRow: {
        backgroundColor: "#ddd",
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
        backgroundColor: "#22653a",
        color: "white",
        paddingVertical: 10,
        paddingHorizontal: 10,
        width: "25%",
        textAlign: "center",
    },

    inputtext: {
        flex: 1,
        paddingVertical: 5,
        paddingHorizontal: 5,
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