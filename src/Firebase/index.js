import * as firebase from "firebase/app";
import "firebase/database";
import "firebase/functions";

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

firebase.initializeApp(firebaseConfig);

function firebaseClient() {
  const database = firebase.database();
  const functions = firebase.functions();

  return { database, functions };
}

export default firebaseClient;
