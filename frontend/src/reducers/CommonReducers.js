import {
    USER_LOGIN_REQUEST
} from "../constants/CommonConstants";

export const userSigninReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_LOGIN_REQUEST:
            if(action.pass == '0987'){
                return { isLoggedIn: true, uname: 'Jeff', uid:101} ;
            } else if(action.pass == '1212'){
                return { isLoggedIn: true, uname: 'Mark', uid:102} ;
            } else {
                return { isLoggedIn: false} ;
            }
        default:
            return state;
    }
};
