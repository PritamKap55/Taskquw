import React, { useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import { useRoute } from "@react-navigation/native";

import { GoogleSignin } from "@react-native-google-signin/google-signin";
import ListLayout from "./listlayout";
import TableLayout from "./tablelayout";
import TreeLayout from "./treelayout";

const { width } = Dimensions.get("window");

async function CreateSheet({ hue = "#4f46e5" }) {
  const route = useRoute();
  await GoogleSignin.hasPlayServices();
  await GoogleSignin.signIn();
  const tokens = await GoogleSignin.getTokens();
  const accesstoken = tokens.accessToken;


  const [layout, setLayout] = useState("List");
  const [fileName, setFileName] = useState("");
  const [index, setIndex] = useState(0);

  const scrollRef = useRef<ScrollView | null>(null);

  const layoutOptions = [
    "List",
    "Check List",
    "Table",
    "Tree"
  ];

  async function getOrCreateFile() {
    try {
      const query = `name='${fileName}' and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false`;

      const searchRes = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
          query
        )}`,
        {
          headers: {
            Authorization: `Bearer ${accesstoken}`,
          },
        }
      );

      const searchData = await searchRes.json();

      if (
        searchData.files &&
        searchData.files.length > 0
      ) {
        const fileId = searchData.files[0].id;

        Alert.alert(
          "File Exists",
          `ID: ${fileId}`
        );

        return fileId;
      }

      const createRes = await fetch(
        "https://www.googleapis.com/drive/v3/files",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accesstoken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: fileName,
            mimeType:
              "application/vnd.google-apps.spreadsheet",
            appProperties: {
              app: "PKapp",
              layout,
            },
          }),
        }
      );

      const createData = await createRes.json();

      Alert.alert(
        "Success",
        `Created ID: ${createData.id}`
      );

    } catch (err) {
      console.log("Error", err)
    }
  }

  const moveSlide = (direction: number) => {
    let newIndex = index + direction;

    if (newIndex < 0) {
      newIndex = layoutOptions.length - 1;
    }

    if (newIndex >= layoutOptions.length) {
      newIndex = 0;
    }

    setIndex(newIndex);
    setLayout(layoutOptions[newIndex]);

    scrollRef.current?.scrollTo({
      x: width * newIndex,
      animated: true,
    });
  };

  const currentSlide = (n: number) => {
    setIndex(n);
    setLayout(layoutOptions[n]);

    scrollRef.current?.scrollTo({
      x: width * n,
      animated: true,
    });
  };

  return (
    <View style={styles.container}>

      <View
        style={[
          styles.header,
          { backgroundColor: hue }
        ]}
      >
        <Text style={styles.headerText}>
          {layout}
        </Text>
      </View>

      <View style={styles.body}>

        <ScrollView
          horizontal
          pagingEnabled
          ref={scrollRef}
          showsHorizontalScrollIndicator={false}
        >
          <View style={styles.slide}>
            <ListLayout />
          </View>

          <View style={styles.slide}>
            <ListLayout />
          </View>

          <View style={styles.slide}>
            <TableLayout />
          </View>

          <View style={styles.slide}>
            <TreeLayout />
          </View>
        </ScrollView>

        <TouchableOpacity
          style={[styles.arrow, styles.left]}
          onPress={() => moveSlide(-1)}
        >
          <Text>❮</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.arrow, styles.right]}
          onPress={() => moveSlide(1)}
        >
          <Text>❯</Text>
        </TouchableOpacity>

        <View style={styles.dots}>
          {[0, 1, 2, 3].map((dot) => (
            <TouchableOpacity
              key={dot}
              style={[
                styles.dot,
                index === dot &&
                styles.activeDot
              ]}
              onPress={() =>
                currentSlide(dot)
              }
            />
          ))}
        </View>
      </View>

      <View style={styles.footer}>

        <Text>Name</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter Account Name"
          value={fileName}
          onChangeText={setFileName}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={getOrCreateFile}
        >
          <Text style={styles.buttonText}>
            Create Sheet
          </Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  header: {
    padding: 15,
    alignItems: "center"
  },

  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold"
  },

  body: {
    flex: 1,
    justifyContent: "center"
  },

  slide: {
    width,
    padding: 20
  },

  arrow: {
    position: "absolute",
    top: "50%",
    padding: 15
  },

  left: {
    left: 10
  },

  right: {
    right: 10
  },

  dots: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "gray",
    margin: 5
  },

  activeDot: {
    width: 14,
    height: 14
  },

  footer: {
    padding: 20
  },

  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginVertical: 10
  },

  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#4f46e5"
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold"
  }
});

export default CreateSheet;