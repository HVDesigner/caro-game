import React from "react";

function MenuModal({ showMenu, setShowMenu }) {
  return (
    <React.Fragment>
      {showMenu ? (
        <div className="menu-more d-flex justify-content-center">
          <div className="menu-more-content rounded d-flex flex-column justify-content-center align-self-center p-2 brown-border">
            <h4 className="text-center">MENU</h4>
            <span className="brown-border rounded wood-btn p-1 mb-2">
              <h5 className="text-center text-white mb-0">Đầu hàng</h5>
            </span>
            <span
              className="brown-border rounded wood-btn p-1"
              onClick={() => {
                setShowMenu(false);
              }}
            >
              <h5 className="text-center text-warning mb-0">Đóng</h5>
            </span>
          </div>
        </div>
      ) : (
        ""
      )}
    </React.Fragment>
  );
}

export default MenuModal;
