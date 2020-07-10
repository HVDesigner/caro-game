import React from "react";
import { Spinner } from "react-bootstrap";

function LoadingOverlay() {
  return (
    <div
      className="w-100vw h-100 position-absolute container"
      style={{ zIndex: 9999, backgroundColor: "#48484891", minHeight: "100vh" }}
    >
      <div className="d-flex justify-content-center align-items-center w-100 h-100">
        <Spinner animation="border" role="status" variant="success">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    </div>
  );
}

export default LoadingOverlay;
