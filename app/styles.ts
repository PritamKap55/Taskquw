import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
    },
    headerLayout: {
        height: "9%",
        backgroundColor: "#26362C",
    },
    bodyLayout: {
        height: "70%",
        backgroundColor: "#f0f4dd",
    },

    footerLayout: {
        height: "20%",
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
});

export const gradientConfig: {
    colors: readonly [string, string, string];
    locations: readonly [number, number, number];
} = {
    colors: ["#e4e6db", "#c0cfb2", "#8ca98a"],
    locations: [0, 0.5, 1],
};

export const gradientLeafbtn: {
  colors: readonly [string, string];
  locations: readonly [number, number];
  start: { x: number; y: number };
  end: { x: number; y: number };
} = {
  colors: [ "#f4f806","#03870c"],
  locations: [0, 1],
  start: { x: 0, y: 0 }, // Left sides
  end: { x: 1, y: 0 },   // Right side
};