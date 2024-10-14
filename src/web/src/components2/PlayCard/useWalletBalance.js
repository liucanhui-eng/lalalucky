import { useState, useEffect } from 'react';
import { product as ProjectL_backend } from "declarations/product";

export const useWalletBalance = (userInfo) => {
  const [walletBalance, setWalletBalance] = useState(null);

  const getWalletBalance = async () => {
    if (!userInfo) {
      console.log("用户信息缺失");
      return;
    }
    const { userCount, userName } = userInfo;

    if (!userCount || !userName) return;

    try {
      const data = await ProjectL_backend.show_user(userCount, userName);
      if (!data || data.length === 0) return;
      
      const balance = parseFloat(Number(data[0].wallet_balance) / 100000000);
      console.log(`钱包余额: ${balance}`);
      setWalletBalance(balance);
    } catch (err) {
      console.error("获取钱包余额时出错：", err);
    }
  };

  useEffect(() => {
    if (userInfo) getWalletBalance();
  }, [userInfo]);

  return walletBalance;
};
