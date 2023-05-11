import * as React from 'react';
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

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
    const [isLoading, setIsLoading] = React.useState(false);

    const [accessToken, setAccessToken] = React.useState(null);
    const [user, setUser] = React.useState(null);


    // const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: "946086013420-9msni00t6ghhf1gsr078ipq69llsbv7t.apps.googleusercontent.com",
        iosclientId: "946086013420-q1phm0nb9196d1m1f6qbu7qmjgmlng28.apps.googleusercontent.com",
        androidclientId: "946086013420-50l2fkelgr79e55d5bq4nuen9h1ek73m.apps.googleusercontent.com",
        scopes: ['profile', 'email'],
    });

    React.useEffect(() => {
        if (response?.type === "success") {
            // console.log('response', response)
            setAccessToken(response.authentication.accessToken);
            fetchUserInfo();
        }
    }, [response])

    React.useEffect(() => {
        if (accessToken) {
            fetchUserInfo();
        }
    }, [accessToken])

    async function fetchUserInfo() {
        let response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        const userInfo = await response.json();
        setUser(userInfo);

        // Check if user already exists in Firebase
        const usersRef = firebase.firestore().collection('users');
        const existingUser = await usersRef.doc(userInfo.email).get();

        if (!existingUser.exists) {
            // Create a new user in Firebase
            const newUser = {
                name: userInfo.name,
                email: userInfo.email,
                photoUrl: userInfo.picture,
            };
            await usersRef.doc(userInfo.email).set(newUser);
        }
    }

    const signInWithGoogleAsync = async () => {
        try {
            setIsLoading(true);
            const result = await promptAsync();

            // const result = await Google.logInAsync({
            //     clientId: "946086013420-9msni00t6ghhf1gsr078ipq69llsbv7t.apps.googleusercontent.com",
            //     iosclientId: "946086013420-q1phm0nb9196d1m1f6qbu7qmjgmlng28.apps.googleusercontent.com",
            //     androidClientId: "946086013420-50l2fkelgr79e55d5bq4nuen9h1ek73m.apps.googleusercontent.com",
            //     scopes: ['profile', 'email'],
            // });

            if (result.type === 'success') {
                // Build Firebase credential with the Google ID token
                const credential = firebase.auth.GoogleAuthProvider.credential(result.idToken);

                // Sign in with Firebase
                await firebase.auth().signInWithCredential(credential);

                // Fetch user data and create user document in Firebase
                const user = firebase.auth().currentUser;
                const usersRef = firebase.firestore().collection('users');
                const userDoc = await usersRef.doc(user.email).get();
                if (userDoc.exists) {
                    setUser(userDoc.data());
                } else {
                    const newUser = {
                        name: user.displayName,
                        email: user.email,
                        photoUrl: user.photoURL,
                    };
                    await usersRef.doc(user.email).set(newUser);
                    setUser(newUser);
                }
            } else {
                console.log('Google sign-in failed');
            }
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    };


    const ShowUserInfo = () => {
        if (user) {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 35, fontWeight: 'bold', marginBottom: 20 }}>Welcome</Text>
                    <Image source={{ uri: user.picture }} style={{ width: 100, height: 100, borderRadius: 50 }} />
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{user.name}</Text>
                </View>
            )
        }
    }

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
                            signInWithGoogleAsync();
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

