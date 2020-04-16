import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/App/";
import * as serviceWorker from "./serviceWorker";
import "bootstrap/dist/css/bootstrap.min.css";

import GlobalState from "./context/GlobalState";

ReactDOM.render(
  <React.StrictMode>
    <GlobalState>
      <App />
    </GlobalState>
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.unregister();
