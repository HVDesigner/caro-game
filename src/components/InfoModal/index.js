import React from "react";
import "./index.css";
import UserSVG from "./../../assets/Dashboard/user.svg";

function InfoModal() {
  return (
    <div
      className="d-flex position-absolute w-100vw h-100vh justify-content-center align-items-center"
      style={{ zIndex: "9999", backgroundColor: "#48484891" }}
    >
      <div
        className="brown-border shadow bg-brown-wood p-2 rounded d-flex flex-column"
        style={{ maxWidth: "80vw", maxHeight: "80vh", height: "80vh" }}
      >
        <h3 className="text-stroke-carotv text-warning text-center">
          Thông tin
        </h3>
        <div className="d-flex flex-column justify-content-center align-items-center w-100">
          <img src={UserSVG} alt="user" style={{ maxWidth: "60px" }} />
          <p className="text-stroke-carotv text-white m-0">Name</p>
        </div>

        <div className="overflow-auto h-100 mb-2" style={{ maxHeight: "100%" }}>
          <table className="table table-bordered h-100 m-0 table-info-modal">
            <tbody>
              <tr>
                <td className="text-stroke-carotv text-warning">Elo Gomoku</td>
                <td>0</td>
              </tr>
              <tr>
                <td className="text-stroke-carotv text-warning">
                  Elo Chặn 2 đầu
                </td>
                <td>0</td>
              </tr>
              <tr>
                <td className="text-stroke-carotv text-warning" colSpan="2">
                  Thắng
                </td>
              </tr>
              <tr>
                <td className="text-stroke-carotv text-white">Gomoku</td>
                <td>0</td>
              </tr>
              <tr>
                <td className="text-stroke-carotv text-white">Chắn 2 đầu</td>
                <td>0</td>
              </tr>
              <tr>
                <td className="text-stroke-carotv text-warning" colSpan="2">
                  Thua
                </td>
              </tr>
              <tr>
                <td className="text-stroke-carotv text-white">Gomoku</td>
                <td>0</td>
              </tr>
              <tr>
                <td className="text-stroke-carotv text-white">Chắn 2 đầu</td>
                <td>0</td>
              </tr>
              <tr>
                <td className="text-stroke-carotv text-warning" colSpan="2">
                  Hòa
                </td>
              </tr>
              <tr>
                <td className="text-stroke-carotv text-white">Gomoku</td>
                <td>0</td>
              </tr>
              <tr>
                <td className="text-stroke-carotv text-white">Chắn 2 đầu</td>
                <td>0</td>
              </tr>
              <tr>
                <td className="text-stroke-carotv text-warning">Tỉ lệ thắng</td>
                <td>100%</td>
              </tr>
              <tr>
                <td className="text-stroke-carotv text-warning">Yêu thích</td>
                <td>0</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="d-flex w-100">
          <div
            className="flex-fill text-center brown-border shadow rounded bg-gold-wood wood-btn"
            style={{ backgroundSize: "cover" }}
          >
            Yêu thích
          </div>
          <div
            className="flex-fill text-center brown-border shadow rounded ml-1 bg-gold-wood wood-btn"
            style={{ backgroundSize: "cover" }}
          >
            Đóng
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoModal;
