import React from "react";
import { Badge } from "react-bootstrap";

function Counter({ time }) {
  const [counter, setCounter] = React.useState(time);

  React.useEffect(() => {
    let timer = setInterval(() => {}, 1000);

    if (counter > 0) {
      timer = setInterval(() => setCounter(counter - 1), 1000);
    }

    if (counter === 0) {
      setCounter(0);
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [counter]);

  return (
    <div
      style={{ width: "100%" }}
      className="d-flex justify-content-center align-items-center p-1"
    >
      <Badge pill variant="success">
        <p className="text-white roboto-font" style={{ fontSize: "13px" }}>
          {counter}s
        </p>
      </Badge>
    </div>
  );
}

export default Counter;
