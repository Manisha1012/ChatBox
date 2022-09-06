import { actionToSignInUserIntoApp } from "../actions/CommonAction";
import { useDispatch} from "react-redux";
import { useState } from 'react';

function LoginComponent()
{
    /* --------------- LOGIN VAR & FUNCTION ------------ */
    const dispatch = useDispatch();

    const [password, setPassword] = useState('');

    const enterPassword = (e) => {
        let pass = e.target.value;
        setPassword(pass);
    }

    const login = (e) => {
        e.preventDefault();
        dispatch(actionToSignInUserIntoApp(password));
    }

    return (<>
    <div className="login">
          <form className="login-inputarea">
            <input type="text" className="login-input" placeholder="Enter password to login..." value={password} onChange={enterPassword}/>
            <button type="submit" className="login-send-btn" onClick={login}>Login</button>
          </form>
      </div>
    </>);
}

export default LoginComponent;