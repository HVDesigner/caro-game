import React from "react";
import AppContext from "./../../../context/";
import { Badge } from "react-bootstrap";

function PositionPoint({ mousePosition }) {
  const { state } = React.useContext(AppContext);
  return (
    <React.Fragment>
      {state.user.platform === "web" && state["square-position"].status ? (
        <Badge
          variant="success"
          className="position-label position-absolute"
          style={{
            left: `${mousePosition.x + 10}px`,
            top: `${mousePosition.y + 15}px`,
          }}
        >
          {`${state["square-position"].row} - ${state["square-position"].col}`}
        </Badge>
      ) : (
        ""
      )}
    </React.Fragment>
  );
}

export default PositionPoint;
