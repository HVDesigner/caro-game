import React from "react";

function Numeric() {
  const numeric = [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]];
  return (
    <React.Fragment>
      {numeric.map((row, rowkey) => {
        return (
          <span key={rowkey} className="row_ d-flex">
            <span
              style={{
                minWidth: "1em",
                textAlign: "center",
                fontSize: "12px",
              }}
              className="text-white d-flex flex-fill justify-content-center align-items-center"
            ></span>
            {row.map((colValue, colkey) => (
              <span
                title={colValue}
                key={colkey}
                className="number-bottom text-white text-center number-row"
                style={{
                  fontSize: "12px",
                }}
              ></span>
            ))}
          </span>
        );
      })}
    </React.Fragment>
  );
}

export default Numeric;
