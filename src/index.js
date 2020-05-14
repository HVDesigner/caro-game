import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/App/";
import * as serviceWorker from "./serviceWorker";
import "bootstrap/dist/css/bootstrap.min.css";

import GlobalState from "./context/GlobalState";

import { FirebaseAppProvider, SuspenseWithPerf } from "reactfire";
import Loading from "./components/Loading/";

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

ReactDOM.render(
  <React.StrictMode>
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <SuspenseWithPerf fallback={<Loading />} traceId={"load-app-status"}>
        <GlobalState>
          <App />
        </GlobalState>
      </SuspenseWithPerf>
    </FirebaseAppProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.unregister();
