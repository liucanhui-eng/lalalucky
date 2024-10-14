import React from "react";
import { useNavigate } from "react-router-dom";

import btnPlay from "./assets/btnPlay.svg";
import btnPlay1 from "./assets/btnPlay1.svg";
import btnWaiting from "./assets/btnWaiting.svg";
import btnWaiting1 from "./assets/btnWaiting1.svg";
import btnDeposit from "./assets/btnDeposit.svg";
import { isIIAuthenticated } from "../../common/ic-client";

const Butt = ({ isLogin, walletBalance, isLoading, handleBingo }) => {
  

  const navigate = useNavigate();

  const handleClick = async () => {
    handleBingo();
  };

  const renderButtonImage = () => {
    if (!walletBalance) {
      return <img src={btnPlay} />;
    }

    if (isLogin) {
      if (parseFloat(walletBalance) < 0.001) {
        return <img src={btnDeposit} onClick={handleClick} />;
      } else if (isLoading) {
        return <img src={btnWaiting} />;
      } else {
        return <img src={btnPlay} onClick={handleClick} />;
      }
    } else {
      return <img src={btnPlay} onClick={handleClick} />;
    }
  };

  return <>{renderButtonImage()}</>;
};

export default Butt;
