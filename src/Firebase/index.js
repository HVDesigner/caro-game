import React, { createContext } from "react";
import app from "firebase/app";
import "firebase/functions";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCx5AD4sWwFIMuNyT1T3eftcC-783_0Ssc",
  authDomain: "carotv-683cc.firebaseapp.com",
  databaseURL: "https://carotv-683cc.firebaseio.com",
  projectId: "carotv-683cc",
  storageBucket: "carotv-683cc.appspot.com",
  messagingSenderId: "290104411772",
  appId: "1:290104411772:web:36d46751f697f0b254ebf9",
  measurementId: "G-WXMV1VTJT8",
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
