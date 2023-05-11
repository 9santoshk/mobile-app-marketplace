import { USERS_DATA_STATE_CHANGE, USER_STATE_CHANGE, CLEAR_DATA } from '../constants/index';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

export function clearData() {
    return ((dispatch) => {
        dispatch({ type: CLEAR_DATA })
    })
}

export function fetchUser() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then((snapshot) => {
                if (snapshot.exists) {
                    console.log(snapshot.data());
                    dispatch({ type: USER_STATE_CHANGE, currentUser: snapshot.data() });
                }
                else {
                    console.log('does not exist');
                }
            })
    })
}



export function fetchUsersData(uid, getPosts) {
    return ((dispatch, getState) => {
        const found = getState().usersState.users.some(el => el.uid === uid);
        if (!found) {
            firebase.firestore()
                .collection("users")
                .doc(uid)
                .get()
                .then((snapshot) => {
                    if (snapshot.exists) {
                        let user = snapshot.data();
                        user.uid = snapshot.id;

                        dispatch({ type: USERS_DATA_STATE_CHANGE, user });
                    }
                    else {
                        console.log('does not exist');
                    }
                })

        }

    })
}


// export default fetchUser;