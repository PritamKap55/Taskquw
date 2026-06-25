import React, { useState } from 'react';
import { View, Button ,FlatList ,Text} from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';



GoogleSignin.configure({
  webClientId:
    '470784951477-1mcdh3c1puclmb9ttot8mchl3onvsshb.apps.googleusercontent.com',

  scopes: [
    'https://www.googleapis.com/auth/drive.readonly',
  ],
});

export default function HomeScreen() {
   const [files, setFiles] = useState<any[]>([]);

  const getSheets = async () => {
    try {
      // Google login
      await GoogleSignin.hasPlayServices();

      await GoogleSignin.signIn();

      // get token
      const tokens = await GoogleSignin.getTokens();

      const accessToken = tokens.accessToken;

      // get only spreadsheet files
      const query =
        "mimeType='application/vnd.google-apps.spreadsheet'";

      const url =
        `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
          query
        )}&fields=files(id,name)`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      console.log("Sheets List:");
      console.log(data.files);
      setFiles(data.files);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <Button
        title="Get Sheets"
        onPress={getSheets}
      />

      <FlatList
  data={files}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <Text>{item.name}</Text>
  )}
/>
    </View>
  );
}