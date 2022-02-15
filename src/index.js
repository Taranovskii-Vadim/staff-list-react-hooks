import React from "react";
import ReactDOM from "react-dom";
import "../node_modules/antd/dist/antd.css";
import "./style/index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import StaffState from "./context/StaffContext/StaffState";

ReactDOM.render(
  <React.StrictMode>
    <StaffState>
      <App />
    </StaffState>
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.unregister();
