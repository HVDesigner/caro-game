import React from 'react';
import './CreateRoom.css';
import { Form, Container, Row, Col, Nav } from 'react-bootstrap';
import CheckButton from './../../CheckButton/';
import LeftSVG from './../../../assets/chevron-left.svg';
import AppContext from './../../../context/'

function CreateRoom() {
    const { changeRoute } = React.useContext(AppContext)

    const [name, setName] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [bet, setBet] = React.useState("")

    // true: Gomoku
    // false: Block head
    const [gamePlay, setGamePlay] = React.useState(true)

    // true: 6-win
    // false: 6-no-win
    const [rule, setRule] = React.useState(true)

    return (
        <Container className="create-room-body">
            <Row className="sticky-top create-room-menu shadow-sm">
                <div className="menu-top">
                    <Nav>
                        <Nav.Item className="d-flex">
                            <Nav.Link
                                onClick={() => {
                                    changeRoute("lobby");
                                }}
                                className="wood-btn-back exit-create-room"
                            >
                                <img
                                    src={LeftSVG}
                                    alt="back-btn"
                                    style={{ height: "1.5em" }}
                                ></img>
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>
                </div>
            </Row>
            <Row className="pt-2">
                <Col>
                    <form className="d-flex flex-column">
                        <Form.Label className="mr-2 mb-0">Tên phòng:</Form.Label>
                        <input
                            type="text"
                            className="input-carotv text-white flex-fill mb-2"
                            placeholder="Nhập tên phòng..."
                            value={name}
                            onChange={e => { setName(e.target.value) }}
                        />

                        <Form.Label className="mr-2 mb-0">Mật khẩu:</Form.Label>
                        <input
                            type="password"
                            className="input-carotv text-white flex-fill mb-2"
                            placeholder="Nhập mật khẩu..."
                            value={password}
                            onChange={e => { setPassword(e.target.value) }}
                        />

                        <Form.Label className="mr-2 mb-0">Xu cược:</Form.Label>
                        <input
                            type="text"
                            className="input-carotv text-white flex-fill mb-2"
                            placeholder="Nhập số xu..."
                            value={bet}
                            onChange={e => { setBet(e.target.value) }}
                        />

                        <div className="d-flex">
                            <div className="flex-fill">
                                <Form.Label className="mr-2">Thể loại:</Form.Label>
                                <CheckButton text="Gomoku" value={gamePlay} func={() => { setGamePlay(true) }} />
                                <CheckButton text="Chặn 2 đầu" value={!gamePlay} func={() => { setGamePlay(false) }} />
                            </div>
                            <div className="flex-fill">
                                <Form.Label className="mr-2">Luật chơi:</Form.Label>
                                <CheckButton text="6 thắng" value={rule} func={() => { setRule(true) }} />
                                <CheckButton text="6 không thắng" value={!rule} func={() => { setRule(false) }} />
                            </div>
                        </div>

                        <Form.Label className="mr-2">Thời gian:</Form.Label>
                        <div className="d-flex">
                            <div className="flex-fill">
                                <CheckButton text="10s" value={true} />
                            </div>
                            <div className="flex-fill">
                                <CheckButton text="20s" value={false} />
                            </div>
                            <div className="flex-fill">
                                <CheckButton text="30s" value={false} />
                            </div>
                        </div>

                    </form>
                </Col>
            </Row>
            <Row>
                <Col>

                </Col>
            </Row>
        </Container>
    )
}

export default CreateRoom;
