import React from "react";
import "./../GamePlay.css";
import Square from "./../../Square/";
import GamePlay from "./../../../Core/game";
import { Container, Row, Col } from "react-bootstrap";
import UserIMG from './../../../assets/profile_pic.jpg';

function GamePlayComponent({ time }) {
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
        "P"
    ];
    const numeric = [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]]

    const [caroTable, setCaroTable] = React.useState([
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]);

    const [turn, setTurn] = React.useState(Math.floor(Math.random() * 2) + 1);

    const [statusGame, setStatusGame] = React.useState({
        isPlay: true,
        winner: ""
    });

    const [counter, setCounter] = React.useState(time);

    const [choicePosition, setChoicePosition] = React.useState({
        rowkey: "",
        colkey: "",
        clickCount: 0
    });

    React.useEffect(() => {
        let timer = setInterval(() => { }, 1000);

        if (counter > 0) {
            timer = setInterval(() => setCounter(counter - 1), 1000);
        }

        if (counter === 0) {
            let winner_ = turn === 1 ? 2 : 1;
            setCounter(0);
            setStatusGame({
                isPlay: false,
                winner: winner_
            });
        }
        return () => clearInterval(timer);
    }, [counter, turn, statusGame.isPlay, setStatusGame, setCounter]);

    const changeTurn = () => {
        turn === 1 ? setTurn(2) : setTurn(1);
    };

    const onClickSquare = (rowkey, colkey) => {
        if (statusGame.isPlay) {
            if (caroTable[rowkey][colkey] === 0 || caroTable[rowkey][colkey] === 3) {
                if (
                    choicePosition.rowkey === "" &&
                    choicePosition.colkey === "" &&
                    choicePosition.clickCount === 0
                ) {
                    setChoicePosition({ rowkey, colkey, clickCount: 1 });
                    setCaroTable(choicePositionShow(rowkey, colkey));
                }

                if (
                    (choicePosition.rowkey !== rowkey ||
                        choicePosition.colkey !== colkey) &&
                    choicePosition.clickCount === 1
                ) {
                    setCaroTable(
                        choicePositionHide(choicePosition.rowkey, choicePosition.colkey)
                    );
                    setCaroTable(choicePositionShow(rowkey, colkey));

                    setChoicePosition({ rowkey, colkey, clickCount: 1 });
                }

                if (
                    choicePosition.rowkey === rowkey &&
                    choicePosition.colkey === colkey &&
                    choicePosition.clickCount === 1
                ) {
                    changeTurn();

                    setCaroTable(updatePosition(rowkey, colkey));

                    setCounter(time);

                    const gameNewStatus_ = GamePlay(caroTable).checkAround(
                        rowkey,
                        colkey
                    );
                    if (gameNewStatus_.isPlay === false) {
                        setCounter(0);
                    }

                    setStatusGame(gameNewStatus_);

                    setChoicePosition({ rowkey: "", colkey: "", clickCount: 0 });
                }
            }
        }
    };

    const updatePosition = (rowkey, colkey) => {
        let _caroTableLocal = caroTable;

        let _changeCol = _caroTableLocal[rowkey];

        _changeCol.splice(colkey, 1, turn);

        _caroTableLocal.splice(rowkey, 1, _changeCol);

        return _caroTableLocal;
    };

    const choicePositionShow = (rowkey, colkey) => {
        let _caroTableLocal = caroTable;

        let _changeCol = _caroTableLocal[rowkey];

        _changeCol.splice(colkey, 1, 3);

        _caroTableLocal.splice(rowkey, 1, _changeCol);

        return _caroTableLocal;
    };

    const choicePositionHide = (rowkey, colkey) => {
        let _caroTableLocal = caroTable;

        let _changeCol = _caroTableLocal[rowkey];

        _changeCol.splice(colkey, 1, 0);

        _caroTableLocal.splice(rowkey, 1, _changeCol);

        return _caroTableLocal;
    };

    return (
        <Container
            fluid
            className="game-play"
            style={{ minHeight: "100vh", width: "100vw" }}
        >
            <Row>
                <Col className="p-0">
                    <div style={{ width: "100vw" }} className="d-flex flex-fill">
                        <div
                            style={{ width: "100%" }}
                            className="d-flex flex-fill justify-content-center align-items-center p-2"
                        >
                            {/* <p>Turn: {turn === 1 ? "X" : "O"}</p> */}
                            <img
                                src={UserIMG}
                                alt="user"
                                className="rounded-circle"
                                style={{ width: "40px", height: "40px" }}
                            ></img>
                        </div>
                        <div
                            style={{ width: "100%" }}
                            className="d-flex flex-fill justify-content-center align-items-center"
                        >
                            <p>{counter}</p>
                        </div>
                        <div
                            style={{ width: "100%" }}
                            className="d-flex flex-fill justify-content-center align-items-center p-2"
                        >
                            {/* <p>Turn: {turn === 1 ? "X" : "O"}</p> */}
                            <span
                                className="rounded-circle bg-primary"
                                style={{ width: "40px", height: "40px" }}
                            ></span>
                        </div>
                        {/* <p>Winner: {statusGame.winner ? statusGame.winner : ""}</p> */}
                    </div>
                </Col>
            </Row>
            <Row>
                <Col className="p-0" xs="10">
                    <div className="game-play-body">
                        <div style={{ width: "100vw" }}>
                            {caroTable.map((row, rowkey) => {
                                return (
                                    <span key={rowkey} className="row_">
                                        <span
                                            style={{
                                                minWidth: "5vw",
                                                textAlign: "center",
                                                fontSize: "4vw"
                                            }}
                                            className="text-white d-flex flex-fill justify-content-center align-items-center"
                                        >
                                            {alphabet[rowkey]}
                                        </span>
                                        {row.map((colValue, colkey) => (
                                            <Square
                                                key={colkey}
                                                rowkey={rowkey}
                                                colkey={colkey}
                                                onClickSquare={onClickSquare}
                                                value={colValue}
                                            />
                                        ))}
                                    </span>
                                );
                            })}
                            {numeric.map((row, rowkey) => {
                                return (<span key={rowkey} className="row_">
                                    <span
                                        style={{
                                            minWidth: "5vw",
                                            fontSize: "4vw"
                                        }}
                                        className="text-white d-flex flex-fill justify-content-center align-items-center"
                                    >
                                    </span>
                                    {row.map((colValue, colkey) => (
                                        <span key={colkey} className="number-bottom text-white">{colValue}</span>
                                    ))}
                                </span>)
                            })}
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}
export default GamePlayComponent;
