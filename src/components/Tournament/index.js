import React from "react";
// import { Container, Row, Col } from "react-bootstrap";
import TournamentBanner from "./../../assets/tournament-banner.svg";
import UserSVG from "./../../assets/Dashboard/user.svg";
import "./index.css";
import AppContext from "./../../context/";

import {
  useFirestore,
  useFirestoreCollectionData,
  SuspenseWithPerf,
} from "reactfire";

function Tournament() {
  const { changeRoute } = React.useContext(AppContext);

  const [showDetail, setShowDetail] = React.useState(false);
  const [showRegisterModal, setShowRegisterModal] = React.useState(false);

  // Gomoku true
  // Block-head false
  const [gamePlay, setGamePlay] = React.useState(true);

  return (
    <React.Fragment>
      <div className="bg-brown-wood h-100vh w-100vw position-relative">
        {showDetail ? <RuleTour setShowDetail={setShowDetail} /> : ""}
        {showRegisterModal ? (
          <RegisterModal setShowRegisterModal={setShowRegisterModal} />
        ) : (
          ""
        )}

        <div className="d-flex flex-fill flex-column h-100">
          <div className="d-flex w-100 justify-content-center">
            <img
              alt="panner"
              src={TournamentBanner}
              style={{ width: "80vw" }}
            />
          </div>
          <div className="d-flex">
            <div className="flex-fill">
              <h3
                className="pl-2 pr-2 text-center mb-1 text-warning text-stroke-carotv"
                style={gamePlay ? { textDecoration: "underline" } : {}}
                onClick={() => {
                  setGamePlay(true);
                }}
              >
                Gomoku
              </h3>
            </div>
            <div className="flex-fill">
              <h3
                className="pl-2 pr-2 text-center mb-1 text-warning text-stroke-carotv"
                style={!gamePlay ? { textDecoration: "underline" } : {}}
                onClick={() => {
                  setGamePlay(false);
                }}
              >
                Chặn 2 đầu
              </h3>
            </div>
          </div>
          <div
            className="h-100 w-100 position-relative"
            style={{ maxHeight: "100%" }}
          >
            <SuspenseWithPerf
              fallback={
                <div className="pl-2 pr-2 position-absolute w-100 h-100">
                  <div className="regiter-tournament-user brown-border pl-2 pr-2 rounded shadow overflow-auto w-100">
                    <p className="text-warning text-stroke-carotv text-center mt-2">
                      Loading...
                    </p>
                  </div>
                </div>
              }
              traceId={"load-tournament-player"}
            >
              <UserListComponent gamePlay={gamePlay} />
            </SuspenseWithPerf>
          </div>
          <div className="d-flex flex-fill p-2">
            <div
              className="w-100 brown-border mr-1 rounded-pill bg-gold-wood wood-btn"
              onClick={() => {
                setShowDetail(true);
              }}
            >
              <h4 className="m-0 text-center pt-2 pb-2 text-white text-stroke-carotv">
                Chi tiết
              </h4>
            </div>
            <div
              className="w-100 brown-border mr-1 rounded-pill bg-gold-wood wood-btn"
              onClick={() => {
                setShowRegisterModal(true);
              }}
            >
              <h4 className="m-0 text-center pt-2 pb-2 text-warning text-stroke-carotv">
                Đăng ký
              </h4>
            </div>
            <div
              className="w-100 brown-border ml-1 rounded-pill bg-gold-wood wood-btn"
              onClick={() => {
                changeRoute("dashboard");
              }}
            >
              <h4 className="m-0 text-center pt-2 pb-2 text-white text-stroke-carotv">
                Thoát
              </h4>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Tournament;

function UserListComponent({ gamePlay }) {
  const tournamentRef = useFirestore()
    .collection("tournament")
    .where("game-play", "==", gamePlay ? "gomoku" : "block-head");

  const tournamentUserList = useFirestoreCollectionData(tournamentRef);

  return (
    <div className="pl-2 pr-2 position-absolute w-100 h-100">
      <div className="regiter-tournament-user brown-border pl-2 pr-2 rounded shadow overflow-auto w-100">
        {tournamentUserList.length === 0 ? (
          <p className="text-warning text-stroke-carotv text-center mt-2">
            Chưa có người đăng ký.
          </p>
        ) : (
          tournamentUserList.map((value, key) => {
            return (
              <div key={value.uid} className="d-flex flex-fill pb-2 pt-2">
                <h3
                  className="text-white text-stroke-carotv mb-0"
                  style={{ minWidth: "1.5em" }}
                >
                  {key + 1}
                </h3>
                <img src={UserSVG} alt="user" className="mr-2" />
                <div className="mr-auto w-100">
                  <h4 className="m-0 text-white text-stroke-carotv">Name</h4>
                  <p className="m-0 text-warning text-stroke-carotv">Name</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function RuleTour({ setShowDetail }) {
  return (
    <div className="d-flex flex-column position-absolute w-100vw h-100vh tournament-detail justify-content-center align-items-center">
      <div
        className="tournament-detail-content overflow-auto rounded brown-border shadow p-3"
        style={{ maxHeight: "60vh", maxWidth: "80vw" }}
      >
        <h3 className="text-center text-warning text-stroke-carotv">
          Thông tin giải đấu
        </h3>
        <h4 className="text-warning text-stroke-carotv">Luật:</h4>
        <p className="text-white text-stroke-carotv">Gomoku và Chặn 2 đầu</p>
        <h4 className="text-warning text-stroke-carotv">Thời gian:</h4>
        <p className="text-white text-stroke-carotv">- Mỗi tuần một lần.</p>
        <p className="text-white text-stroke-carotv">
          - Thời gian đăng ký: Từ 0h thứ 2 đến thứ 23h59 thứ 6 trong tuần.
        </p>
        <p className="text-white text-stroke-carotv">
          - Thứ 7 sẽ thi đấu 2 vòng loại và vòng tứ kết, Chủ nhật sẽ thi đấu bán
          kết, tranh giải ba và chung kết.
        </p>
        <h4 className="text-warning text-stroke-carotv">Điều kiện tham gia:</h4>
        <p className="text-white text-stroke-carotv">
          Nộp 20.000 xu cho mỗi lượt đăng ký.
        </p>
        <h4 className="text-warning text-stroke-carotv">Hình thức thi đấu:</h4>
        <p className="text-white text-stroke-carotv">
          - Giải đấu diễn ra khi có đủ 32 người trên danh sách đăng ký.
        </p>
        <p className="text-white text-stroke-carotv">
          - <strong>Vòng loại:</strong> Mỗi cặp đấu sẽ tiến hành đánh 4 ván (Nếu
          hòa 2-2 thì ai là người thắng với ít quân cờ nhất và nghĩ ít thời gian
          hơn trên tổng 2 ván thắng của mỗi người sẽ là người chiến thắng)
        </p>
        <p className="text-white text-stroke-carotv mb-2">
          - <strong>Trận chung kết:</strong> Thi đấu 6 ván nếu hòa 3-3 thì cũng
          phân bại bằng số quân cờ và số thời gian nghĩ như bên trên
        </p>
        <div
          className="tournament-detail-close-btn brown-border rounded p-2 wood-btn"
          onClick={() => {
            setShowDetail(false);
          }}
        >
          <p className="text-warning text-stroke-carotv m-0 text-center">
            Đóng
          </p>
        </div>
      </div>
    </div>
  );
}

function RegisterModal({ setShowRegisterModal }) {
  const { state } = React.useContext(AppContext);

  const userRef = useFirestore()
    .collection("tournament")
    .where("uid", "==", state.user.uid);

  const userData = useFirestoreCollectionData(userRef);

  console.log(userData);

  return (
    <div className="d-flex flex-column position-absolute w-100vw h-100vh tournament-detail justify-content-center align-items-center">
      <div
        className="tournament-detail-content overflow-auto rounded brown-border shadow p-3"
        style={{ maxHeight: "60vh", maxWidth: "80vw" }}
      >
        <h3 className="text-center text-warning text-stroke-carotv">Đăng ký</h3>
        <div
          className="tournament-detail-close-btn brown-border rounded p-2 wood-btn mb-2"
          onClick={() => {}}
        >
          <h4 className="text-warning text-stroke-carotv m-0 text-center">
            Gomoku
          </h4>
        </div>
        <div
          className="tournament-detail-close-btn brown-border rounded p-2 wood-btn mb-2"
          onClick={() => {}}
        >
          <h4 className="text-warning text-stroke-carotv m-0 text-center">
            Chặn 2 đầu
          </h4>
        </div>
        <div
          className="tournament-detail-close-btn brown-border rounded p-2 wood-btn"
          onClick={() => {
            setShowRegisterModal(false);
          }}
        >
          <p className="text-warning text-stroke-carotv m-0 text-center">
            Đóng
          </p>
        </div>
      </div>
    </div>
  );
}
