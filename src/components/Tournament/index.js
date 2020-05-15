import React from "react";
// import { Container, Row, Col } from "react-bootstrap";
import TournamentBanner from "./../../assets/tournament-banner.svg";
import UserSVG from "./../../assets/Dashboard/user.svg";
import "./index.css";
import AppContext from "./../../context/";

function Tournament() {
  const [userRegister] = React.useState([
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
  ]);
  const { changeRoute } = React.useContext(AppContext);

  return (
    <div className="bg-brown-wood h-100vh w-100vw">
      <div className="d-flex flex-fill flex-column h-100">
        <div className="d-flex w-100 justify-content-center">
          <img
            alt="panner"
            src={TournamentBanner}
            style={{ width: "80vw" }}
            className="mt-1"
          />
        </div>
        <div
          className="h-100 w-100 position-relative"
          style={{ maxHeight: "100%" }}
        >
          <div className="pl-2 pr-2 position-absolute w-100 h-100">
            <div className="regiter-tournament-user brown-border pl-2 pr-2 rounded shadow overflow-auto w-100">
              {userRegister.map((value) => {
                return (
                  <div
                    key={value}
                    className="d-flex flex-fill pb-2 pt-2"
                    style={{ borderBottom: "1.5px solid #5c3c25" }}
                  >
                    <img src={UserSVG} alt="user" className="mr-2" />
                    <div className="mr-auto w-100">
                      <h4 className="m-0 text-white text-stroke-carotv">
                        Name
                      </h4>
                      <p className="m-0 text-warning text-stroke-carotv">
                        Name
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="d-flex flex-fill p-2">
          <div className="w-100 brown-border mr-1 rounded-pill bg-gold-wood wood-btn">
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
  );
}

export default Tournament;
