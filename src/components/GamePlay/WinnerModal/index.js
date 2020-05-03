import React from "react";
import "./index.css";
import AppContext from "./../../../context/";
import { FirebaseContext } from "./../../../Firebase/";

function WinnerModal({ gameData }) {
  const { state } = React.useContext(AppContext);
  const firebase = React.useContext(FirebaseContext);

  const [win, setWin] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [loadingNextBtn, setLoadingNextBtn] = React.useState(false);

  const [countSecondNext, setCountSecondNext] = React.useState(10);

  const onNextAction = React.useCallback(() => {
    const nextAction = firebase.functions().httpsCallable("nextAction");

    nextAction({ roomType: state.room.type, roomId: state.room.id });
  }, [firebase, state.room.type, state.room.id]);

  React.useEffect(() => {
    if (gameData.player[state.userInfo.id].winner) {
      setWin(true);
    } else {
      setWin(false);
    }
    setLoading(false);
  }, [gameData.player, state.userInfo.id, countSecondNext]);

  React.useEffect(() => {
    let countdown = setInterval(() => {}, 1000);

    countdown = setInterval(
      () => setCountSecondNext(countSecondNext - 1),
      1000
    );

    if (countSecondNext === 0) {
      clearInterval(countdown);
      onNextAction();
      setLoadingNextBtn(true);
    }

    return () => {
      clearInterval(countdown);
    };
  }, [countSecondNext, onNextAction]);

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
              {loadingNextBtn ? (
                <h5 className="text-center mt-2 mb-2 text-white">Loading...</h5>
              ) : (
                <h5 className="text-center mt-2 mb-2 text-white">
                  {countSecondNext}
                </h5>
              )}
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

export default WinnerModal;
