import React, { useState, useEffect, createContext } from "react";
import { auth } from "./../services/firebase";


export const UserContext = createContext({ user: null });
export default (props) => {
  const [user, setuser] = useState(null);
  const [afterFetch, setAfterFetch] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const { displayName, email, photoURL} = user;

        setuser({
          displayName,
          email,
          photoURL
        });
      }

      setAfterFetch(true);
    });
  }, []);

  return (
    <UserContext.Provider value={[user, afterFetch]}>{props.children}</UserContext.Provider>
  );
};