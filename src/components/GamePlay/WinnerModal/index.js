import React from "react";
import "./index.css";
import AppContext from "./../../../context/";

function WinnerModal({ gamePlayer }) {
  const { state } = React.useContext(AppContext);

  const [win, setWin] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (gamePlayer[state.userInfo.id].winner) {
      setWin(true);
    } else {
      setWin(false);
    }
    setLoading(false);
  }, [gamePlayer, state.userInfo.id]);

  return (
    <div className="winner-modal d-flex justify-content-center align-items-center">
      <div className="winner-modal-content p-3 brown-border shadow rounded">
        {loading ? (
          <h5 className="text-warning text-stroke-carotv text-center mb-0">
            Loading...
          </h5>
        ) : (
          <React.Fragment>
            {win ? (
              <React.Fragment>
                <h5 className="text-warning text-stroke-carotv text-center mb-3">
                  Chúc mừng
                </h5>
                <h1 className="text-warning text-stroke-carotv">BẠN THẮNG</h1>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <h5 className="text-muted text-stroke-carotv text-center mb-3">
                  Rất tiếc
                </h5>
                <h1 className="text-secondary text-stroke-carotv">BẠN THUA</h1>
              </React.Fragment>
            )}
            <div className="brown-border shadow rounded next-btn wood-btn">
              <h5 className="text-center mt-2 mb-2 text-white">Tiếp tục</h5>
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

export default WinnerModal;
