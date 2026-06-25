import { GoogleSignin, SignInResponse } from '@react-native-google-signin/google-signin';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function LoginScreen() {
  const [userInfo, setUserInfo] = useState<SignInResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [sheets, setSheets] = useState<any[]>([]);

  useEffect(() => {
    GoogleSignin.configure({
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.readonly',
      ],
      webClientId:
        '470784951477-1mcdh3c1puclmb9ttot8mchl3onvsshb.apps.googleusercontent.com',
    });
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      await GoogleSignin.hasPlayServices();

      const response = await GoogleSignin.signIn();

      setUserInfo(response);

      const tokens = await GoogleSignin.getTokens();

      const result = await fetch(
        'https://www.googleapis.com/drive/v3/files?q=mimeType="application/vnd.google-apps.spreadsheet"&fields=files(id,name)',
        {
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
          },
        }
      );

      const data = await result.json();

      setSheets(data.files || []);

    } catch (error) {
      console.log('Google Sign-In Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await GoogleSignin.signOut();

      setUserInfo(null);
      setSheets([]);

    } catch (error) {
      console.log(error);
    }
  };

  if (userInfo && userInfo.type === 'success') {
    const user = userInfo.data.user;

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome
        </Text>

        {user.photo && (
          <Image
            source={{ uri: user.photo }}
            style={styles.image}
          />
        )}

        <Text style={styles.name}>
          {user.name}
        </Text>

        <Text style={styles.email}>
          {user.email}
        </Text>

        <Text style={styles.sheetTitle}>
          Google Sheets List
        </Text>

        <FlatList
          data={sheets}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.sheetCard}>
              <Text style={styles.sheetName}>
                {item.name}
              </Text>

              <Text style={styles.sheetId}>
                ID: {item.id}
              </Text>
            </View>
          )}
        />

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Google Sheets App
      </Text>

      {loading ? (
        <ActivityIndicator
          size="large"
        />
      ) : (
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleGoogleLogin}
        >
          <Text style={styles.buttonText}>
            Sign In With Google
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    padding:20,
    justifyContent:'center',
    backgroundColor:'#fff',
  },

  title:{
    fontSize:28,
    textAlign:'center',
    marginBottom:30,
    fontWeight:'bold'
  },

  welcome:{
    fontSize:24,
    fontWeight:'bold',
    textAlign:'center'
  },

  image:{
    width:80,
    height:80,
    borderRadius:40,
    alignSelf:'center',
    marginTop:20
  },

  name:{
    fontSize:22,
    textAlign:'center',
    marginTop:10
  },

  email:{
    textAlign:'center',
    marginBottom:20
  },

  sheetTitle:{
    fontSize:20,
    fontWeight:'bold',
    marginTop:20,
    marginBottom:10
  },

  sheetCard:{
    padding:15,
    borderWidth:1,
    borderColor:'#ddd',
    borderRadius:10,
    marginBottom:10
  },

  sheetName:{
    fontSize:16,
    fontWeight:'bold'
  },

  sheetId:{
    color:'gray',
    marginTop:5
  },

  loginButton:{
    backgroundColor:'#4285F4',
    padding:15,
    borderRadius:10
  },

  logoutButton:{
    backgroundColor:'red',
    padding:15,
    borderRadius:10,
    marginTop:20
  },

  buttonText:{
    color:'#fff',
    textAlign:'center',
    fontWeight:'bold'
  }
});