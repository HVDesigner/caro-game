import React from "react";
import "./index.css";
import { Container, Col, Row } from "react-bootstrap";
import { useFirestore, useFirestoreDocData } from "reactfire";

// SVG
import ExitSVG from "./../../assets/Exit.svg";

// Context
import AppContext from "./../../context/";

const quizList = [
  {
    title: `Trên tay cầm một cây thước và một cây bút, làm thế nào để bạn vẽ được một vòng tròn thật chính xác ?`,
    result: [
      { title: "Bỏ cây thước đi và cầm compa lên rồi vẽ.", type: true },
      {
        title: "Chọn 2 điểm trên thước và xoay quanh 1 điểm cố định.",
        type: false,
      },
    ],
  },
  {
    title: `Từ nào trong tiếng Việt có 9 ký tự "h" ?`,
    result: [
      { title: "Không có từ nào.", type: false },
      {
        title: "Chính.",
        type: true,
      },
    ],
  },
  {
    title: `Có cổ nhưng không có miệng là gì ?`,
    result: [
      { title: "Cái chai.", type: false },
      {
        title: "Cái áo.",
        type: true,
      },
    ],
  },
  {
    title: `Điền số thích hợp ? 
    1+4 =5
    2+5=12
    3+6=21
    8+11=?
    `,
    result: [
      { title: "35.", type: false },
      {
        title: "96.",
        type: true,
      },
    ],
  },
  {
    title: `Mỗi năm có 7 tháng 31 ngày. Đố bạn có nhiêu tháng có 28 ngày ?`,
    result: [
      { title: "12 tháng.", type: true },
      {
        title: "7 tháng.",
        type: false,
      },
    ],
  },
  {
    title: `Con gì có thể đủ sức mang cả 1 khúc gỗ nặng 1 tấn, mà không thể mang được 1 viên sỏi ?`,
    result: [
      { title: "Con sông.", type: true },
      {
        title: "Con xe.",
        type: false,
      },
    ],
  },
  {
    title: `Giữa trời và đất là cái gì ?`,
    result: [
      { title: `Chữ "và".`, type: true },
      {
        title: "Tầng khí quyển.",
        type: false,
      },
    ],
  },
  {
    title: `Từ nào trong tiếng việt có 3 chữ n ?`,
    result: [
      { title: `Ban.`, type: true },
      {
        title: "Không có từ nào.",
        type: false,
      },
    ],
  },
  {
    title: `Hai đầu mà chẳng có đuôi nhiều chân mà lại đứng hoài chẳng đi là cái gì ?`,
    result: [
      { title: `Con sông.`, type: false },
      {
        title: "Cây cầu.",
        type: true,
      },
    ],
  },
  {
    title: `Một người đàn ông quên mật khẩu gồm 5 chữ số để mở khóa, bạn hãy giúp anh ta tìm lại mật khẩu với điều kiện sau:
    -	Chữ số thứ 5 cộng với chữ số thứ 4 bằng 14
    -	Chữ số đầu tiên nhở hơn 2 lần chữ số thứ 2 một đơn vị
    -	Chữ số thứ 4 lớn hơn chữ số thứ 2 một đơn vị
    -	Chữ cố thứ 2 cộng với chữ số thứ 3 bằng 10
    -	Tổng 5 chữ số bằng 30
    `,
    result: [
      { title: `64658.`, type: false },
      {
        title: "74658.",
        type: true,
      },
    ],
  },
  {
    title: `Tìm số trong dấu ?`,
    result: [
      { title: `10.`, type: false },
      {
        title: "5.",
        type: true,
      },
    ],
  },
  {
    title: `Một người viết liên tiếp nhóm chữ "Hội quán cờ caro" thành 1 dãy như sau: Hoiquancocarohoiquancocaro...
    Vậy chữ cái thứ 2020 trong dãy trên là chữ gì ?`,
    result: [
      { title: `U.`, type: true },
      {
        title: "C.",
        type: false,
      },
    ],
  },
  {
    title: `Đố bạn có bao nhiêu chữ C trong câu sau đây: "Cơm, canh, cháo gì tớ cũng thích ăn"`,
    result: [
      { title: `Có 5 chữ C.`, type: false },
      {
        title: "Có 1 chữ C.",
        type: true,
      },
    ],
  },
  {
    title: `Cái gì tay trái cầm được còn tay phải có muốn cầm cũng không được ?`,
    result: [
      { title: `Ngón tay phải.`, type: false },
      {
        title: "Cùi trỏ tay phải.",
        type: true,
      },
    ],
  },
  {
    title: `Điền số thích hợp ?`,
    result: [
      { title: `90.`, type: true },
      {
        title: "15.",
        type: false,
      },
    ],
  },
  {
    title: `Có 3 quả táo trên bàn và bạn lấy đi 2 quả. Hỏi bạn còn bao nhiêu quả táo ?`,
    result: [
      { title: `2 quả táo.`, type: true },
      {
        title: "Không còn quả nào.",
        type: false,
      },
    ],
  },
  {
    title: `Chứng minh con gái = con dê`,
    result: [
      {
        title: `Con gái => thiên thần => tiền thân => trước khỉ => mùi => con dê.`,
        type: true,
      },
      {
        title: "Con gái => thiên thần => tiên nhân => tiên nữ => con dê.",
        type: false,
      },
    ],
  },
  {
    title: `Nắng 3 năm tôi không bỏ bạn, mưa một ngày sao bạn lại bỏ tôi là cái gì ?`,
    result: [
      {
        title: `Cái bóng.`,
        type: true,
      },
      {
        title: "Cái thằng bạn.",
        type: false,
      },
    ],
  },
  {
    title: `Điền số thích hợp vào dấu  ?`,
    result: [
      {
        title: `35.`,
        type: false,
      },
      {
        title: "24.",
        type: true,
      },
    ],
  },
];

function FunQuiz() {
  const { state, changeRoute } = React.useContext(AppContext);

  const funQuizRef = useFirestore().collection("fun-quiz").doc(state.user.uid);

  const funQuiz = useFirestoreDocData(funQuizRef);

  return (
    <Container className="bg-brown-wood h-100vh">
      <Row>
        <Col>
          <div className="pt-3">
            <h2 className="text-warning text-center text-stroke-carotv">
              Đố Vui
            </h2>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="brown-border p-3 bg-white rounded shadow">
            <h5 className="m-0">{quizList[funQuiz.step].title}</h5>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="mt-3 d-flex">
            <h5 className="text-success text-center text-stroke-carotv flex-fill">
              Đúng: +{funQuiz.step >= 0 && funQuiz.step < 9 ? 3000 : 5000} xu
            </h5>
            <h5 className="text-danger text-center text-stroke-carotv flex-fill">
              Sai: -{funQuiz.step >= 0 && funQuiz.step < 9 ? 1500 : 2500} xu
            </h5>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="mt-3">
            <h5 className="text-warning text-stroke-carotv">
              Chọn phương án chính xác nhất:
            </h5>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div>
            {quizList[funQuiz.step].result.map((value, key) => {
              return (
                <div
                  className="brown-border p-3 bg-white rounded shadow mt-3 answer"
                  key={key}
                >
                  <h5 className="m-0 text-center">{value.title}</h5>
                </div>
              );
            })}
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="d-flex justify-content-center mt-3 pt-2">
            <img
              style={{ width: "40%" }}
              src={ExitSVG}
              alt="exit"
              onClick={() => {
                changeRoute("dashboard");
              }}
              className="wood-btn mb-2"
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default FunQuiz;
