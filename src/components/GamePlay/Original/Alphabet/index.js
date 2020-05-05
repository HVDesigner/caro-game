import React from "react";

function Alphabet({ rowkey }) {
  const alphabet = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "W",
  ];

  return (
    <span
      style={{
        minWidth: "1em",
        textAlign: "center",
        fontSize: "12px",
      }}
      className="text-white d-flex flex-fill justify-content-center align-items-center"
    >
      {alphabet[rowkey]}
    </span>
  );
}

export default Alphabet;
