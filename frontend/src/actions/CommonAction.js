import {
    USER_LOGIN_REQUEST
} from "../constants/CommonConstants";

export const actionToSignInUserIntoApp = (pass) => async (dispatch) => {
    try {
         dispatch({ type: USER_LOGIN_REQUEST, pass: pass});
    } catch (error) {
        console.log('error');
    }
};