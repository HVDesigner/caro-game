import React from "react";

function Numeric() {
  const numeric = [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]];
  return (
    <React.Fragment>
      {numeric.map((row, rowkey) => {
        return (
          <span key={rowkey} className="row_">
            <span
              style={{
                minWidth: "1em",
                textAlign: "center",
                fontSize: "12px",
              }}
              className="text-white d-flex flex-fill justify-content-center align-items-center "
            ></span>
            {row.map((colValue, colkey) => (
              <span
                key={colkey}
                className="number-bottom text-white text-center"
                style={{
                  fontSize: "12px",
                }}
              >
                {colValue}
              </span>
            ))}
          </span>
        );
      })}
    </React.Fragment>
  );
}

export default Numeric;
