import React from "react";

// SVG
import NhapMon from "./../../assets/medal/medal-1.svg";
import TapSu from "./../../assets/medal/medal-2.svg";
import TanThu from "./../../assets/medal/medal-3.svg";
import KyThu from "./../../assets/medal/medal8.svg";
import CaoThu from "./../../assets/medal/medal7.svg";
import SieuCaoThu from "./../../assets/medal/medal6.svg";
import KienTuong from "./../../assets/medal/medal5.svg";
import DaiKienTuong from "./../../assets/medal/medal2.svg";
import KyTien from "./../../assets/medal/medal1.svg";
import KyThanh from "./../../assets/medal/medal4.svg";
import NhatDaiTonSu from "./../../assets/medal/medal3.svg";

function Medal({ elo }) {
  if (0 <= elo && elo < 1150) {
    return <img src={NhapMon} alt="nhap mon" />;
  } else if (1150 <= elo && elo < 1300) {
    return <img src={TapSu} alt="tap su" />;
  } else if (1300 <= elo && elo < 1450) {
    return <img src={TanThu} alt="tan thu" />;
  } else if (1450 <= elo && elo < 1600) {
    return <img src={KyThu} alt="ky thu" />;
  } else if (1600 <= elo && elo < 1750) {
    return <img src={CaoThu} alt="cao thu" />;
  } else if (1750 <= elo && elo < 1900) {
    return <img src={SieuCaoThu} alt="sieu cao thu" />;
  } else if (1900 <= elo && elo < 2050) {
    return <img src={KienTuong} alt="kien tuong" />;
  } else if (2050 <= elo && elo < 2200) {
    return <img src={DaiKienTuong} alt="dai kien tuong" />;
  } else if (2200 <= elo && elo < 2350) {
    return <img src={KyTien} alt="ky tien" />;
  } else if (2350 <= elo && elo < 2500) {
    return <img src={KyThanh} alt="ky thanh" />;
  } else {
    return <img src={NhatDaiTonSu} alt="nhat dai ton su" />;
  }
}

export default Medal;
