import { createStore,compose, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import {
    userSigninReducer,
} from "./reducers/CommonReducers";

const initialState = {
    loginInfo: {
        isLoggedIn: false,
        uname: '',
        uid: ''
    }
};
export const rootReducer = combineReducers({
    loginInfo: userSigninReducer,
});


const composeEnhancer =  window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'];
const store = createStore(
    rootReducer,
    initialState,
    composeEnhancer(applyMiddleware(thunk))
);

export type RootState = ReturnType<typeof rootReducer>
export default store;
