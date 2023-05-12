import React, { useState, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
// import { gbtn } from '../assets/images/gbtn'
import { COLORS, NFTData } from "../constants";
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { getAuth, onAuthStateChanged, GoogleAuthProvider } from 'firebase/auth';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

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

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
    // const [isLoading, setIsLoading] = React.useState(false);
    // const [accessToken, setAccessToken] = React.useState(null);
    const [user, setUser] = useState(null);


    // const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: "946086013420-9msni00t6ghhf1gsr078ipq69llsbv7t.apps.googleusercontent.com",
        iosclientId: "946086013420-q1phm0nb9196d1m1f6qbu7qmjgmlng28.apps.googleusercontent.com",
        androidclientId: "946086013420-50l2fkelgr79e55d5bq4nuen9h1ek73m.apps.googleusercontent.com",
        scopes: ['profile', 'email'],
    });
    const auth = getAuth(app);

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
                navigation.navigate('Home');
            }
        });
    }, []);


    const handleLogin = async () => {
        try {
            const result = await promptAsync();

            if (result.type === 'success') {
                const { idToken, accessToken } = result;
                const credential = firebase.auth.GoogleAuthProvider.credential(idToken, accessToken);
                const userCredential = await firebase.auth().signInWithCredential(credential);
                const { uid, displayName, email, photoURL } = userCredential.user;
                const userDoc = firebase.firestore().collection('users').doc(uid);
                await userDoc.set({
                    displayName,
                    email,
                    photoURL,
                });
            } else {
                Alert.alert('Error', 'Google sign-in was cancelled or failed');
            }
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <View style={styles.container}>
            {/* {user && <ShowUserInfo />} */}
            {user === null &&
                <>
                    <Text style={{ fontSize: 35, fontWeight: 'bold' }}>Welcome</Text>
                    <Text style={{ fontSize: 25, fontWeight: 'bold', marginBottom: 20, color: 'gray' }}>Please login</Text>
                    <TouchableOpacity
                        disabled={!request}
                        onPress={() => {
                            handleLogin();
                            // promptAsync();
                        }}
                    >
                        <Image source={require('../assets/images/gbtn.png')} style={{ width: 300, height: 40 }} />
                    </TouchableOpacity>
                </>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

