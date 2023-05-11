import { USER_STATE_CHANGECLEAR_DATA } from "../constants"

const initalState = {
    currentUser: null,
}

export const user = (state = initalState, action) => {
    switch (action.type) {
        case USER_STATE_CHANGE:
            return {
                ...state,
                currentUser: action.currentUser
            }
        case CLEAR_DATA:
            return {
                currentUser: null,
            }
        default:
            return state;
    }
}