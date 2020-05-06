import React, { createContext } from "react";
import app from "firebase/app";
import "firebase/functions";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCHFTkRPLU8yWYTDWKk1QhtogcOVoafHww",
  authDomain: "caro-new.firebaseapp.com",
  databaseURL: "https://caro-new.firebaseio.com",
  projectId: "caro-new",
  storageBucket: "caro-new.appspot.com",
  messagingSenderId: "999626416120",
  appId: "1:999626416120:web:a06a9eb6b15601ed4f000d",
  measurementId: "G-QJH0BH5X24",
};

const FirebaseContext = createContext(null);

export { FirebaseContext };

export default ({ children }) => {
  if (!app.apps.length) {
    app.initializeApp(firebaseConfig);
  }
  return (
    <FirebaseContext.Provider value={app}>{children}</FirebaseContext.Provider>
  );
};
