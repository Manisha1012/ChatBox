import './App.css';
import {useSelector} from "react-redux";

import LoginComponent from "./components/LoginComponent";
import ChatBoxComponent from './components/ChatBoxComponent';


function App() {
  
  /* -------------- LOGIN INFO ------------ */
  const loginInfo = useSelector((state) => state.loginInfo);
 
  return (
    <>
    { loginInfo.isLoggedIn ? 
      <ChatBoxComponent />
      : <LoginComponent /> }
    </>
  );
}

export default App;
