import React, {useContext, useEffect, useState} from "react";
import "./Login.css"
import { signInWithGoogle } from "./../../services/firebase";
import { Redirect } from 'react-router-dom';
import { UserContext } from "../../providers/UserProvider";
import Loading from "../../widgets/Loading";


export default function Login() {
  const [userState, afterFetch] = useContext(UserContext);
  const [redirectState, setredirectState] = useState(null);

  useEffect(() => {
      if(userState && afterFetch){
          setredirectState('/');
      }
  }, [userState,afterFetch]);

  if(afterFetch){
    if(redirectState){
        return (<Redirect to={redirectState} />)
    }

    return (
      <div className="login-page">
        <div className="title">
          <h1>Welcome To Whatsapp Without Saving Contact</h1>
          <h3>just save the number in this website and you can start chat via website app</h3>
        </div>
        <div className="login-buttons">
          <button className="login-provider-button" onClick={signInWithGoogle}>
            <img src="https://img.icons8.com/ios-filled/50/000000/google-logo.png" alt="google icon"/>
            <span> Continue with Google</span>
          </button>
        </div>
      </div>
    );
  }else{
    return (
     <Loading />
    )
  }
}