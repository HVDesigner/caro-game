import React from "react";
import "./index.css";
import AppContext from "./../../context/";
import { TOGGLE_DIALOG } from "./../../context/ActionTypes";

function DialogComponent() {
  const { state, dispatch } = React.useContext(AppContext);

  return (
    <div
      className="h-100vh w-100vw position-absolute d-flex justify-content-center align-items-center"
      style={{ zIndex: 9999, backgroundColor: "#48484891", minHeight: "100vh" }}
    >
      <div className="dialog-carotv brown-border shadow p-2 text-center rounded">
        <h3 className="text-warning text-stroke-carotv">Cảnh báo</h3>
        <p className="text-white text-stroke-carotv mb-2">
          {state.dialog.message}
        </p>
        <div className="brown-border p-1 rounded btn-close wood-btn">
          <p
            className="mb-0 text-white text-stroke-carotv"
            onClick={() => {
              dispatch({
                type: TOGGLE_DIALOG,
                payload: {
                  status: false,
                },
              });
            }}
          >
            OK
          </p>
        </div>
      </div>
    </div>
  );
}

export default DialogComponent;
