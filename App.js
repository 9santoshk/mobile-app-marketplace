
import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { View, Text } from "react-native";

import Home from "./screens/Home";
import Details from "./screens/Details";
import Login from "./screens/Login";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "transparent",
  },
};

const firebaseConfig = {
  apiKey: "AIzaSyBLpQCNf8ownlLKmQFU9UKtO4RI2upxBR0",
  authDomain: "nft-android-app-386020.firebaseapp.com",
  projectId: "nft-android-app-386020",
  storageBucket: "nft-android-app-386020.appspot.com",
  messagingSenderId: "946086013420",
  appId: "1:946086013420:web:2ad4a9ee61fe50444ef8c9",
  measurementId: "G-3WVWXCF14Q"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();

const Stack = createStackNavigator();

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const { InterBold, InterSemiBold, InterMedium, InterRegular, InterLight } =
    useFonts({
      InterBold: require("./assets/fonts/Inter-Bold.ttf"),
      InterSemiBold: require("./assets/fonts/Inter-SemiBold.ttf"),
      InterMedium: require("./assets/fonts/Inter-Medium.ttf"),
      InterRegular: require("./assets/fonts/Inter-Regular.ttf"),
      InterLight: require("./assets/fonts/Inter-Light.ttf"),
    });
  const fontsLoaded = InterBold & InterSemiBold & InterMedium & InterRegular & InterLight;

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        setLoggedIn(false);
        setLoaded(true);
      } else {
        setLoggedIn(true);
        setLoaded(true);
      }
    });
  }, []);

  if (!loaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text> Loading </Text>
      </View>
    );
  }

  // if (!fontsLoaded) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center" }}>
  //       <Text> Loading fonts... </Text>
  //     </View>
  //   );
  // }

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={loggedIn ? "Home" : "Login"}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Details" component={Details} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;




