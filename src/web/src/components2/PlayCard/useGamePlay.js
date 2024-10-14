import { useState, useCallback } from 'react';
import { product as ProjectL_backend } from "declarations/product";
import { Toast } from "@nutui/nutui-react";

export const useGamePlay = (walletBalance, handlP, handleStart, handleStop, levelMapping, setWalletBalance, setDataType, setTicketLevel) => {
  const [isLoading, setIsLoading] = useState(false);

  const showError = (message) => {
    Toast.show({ content: message });
    setIsLoading(false);
  };

  const handleResponse = (data) => {
    switch (data.code) {
      case 500:
        showError("User does not exist.");
        handleStop([0, 0, 0]);
        setDataType(0);
        return;
      case 200:
        handleStop(String(data.ticketno).split(""));
        const level = data.level;
        setWalletBalance(parseFloat(data.wallet_balance) / 100000000);
        if (level in levelMapping) setTicketLevel(levelMapping[level]);
        setDataType(data.win ? "2" : "3");
        break;
      default:
        handleStop([0, 0, 0]);
    }
    handlP("reload", data);
    setIsLoading(false);
  };

  const playGame = useCallback(async (retry = 1) => {
    try {
      const info1 = await ProjectL_backend.commit(userInfo.userCount);
      const info = await ProjectL_backend.play(userInfo.userCount, userInfo.userName, info1);
      handleResponse(JSON.parse(info));
    } catch (err) {
      if (retry > 0) playGame(retry - 1);
      else showError(`${err}`);
    }
  }, []);

  return { isLoading, playGame };
};
