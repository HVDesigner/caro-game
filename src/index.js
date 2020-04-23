import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/App/";
import * as serviceWorker from "./serviceWorker";
import "bootstrap/dist/css/bootstrap.min.css";

import GlobalState from "./context/GlobalState";
import FirebaseProvider from "./Firebase/";

ReactDOM.render(
  <React.StrictMode>
    <FirebaseProvider>
      <GlobalState>
        <App />
      </GlobalState>
    </FirebaseProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.unregister();
