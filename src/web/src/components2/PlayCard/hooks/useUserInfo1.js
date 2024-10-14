import { useMemo, useCallback } from "react";
import { product as ProjectL_backend } from "declarations/product";

// 自定义 hook：用于获取用户信息和钱包余额
export const useUserInfo1 = () => {
  // 获取用户信息
  const getUserInfo = useMemo(() => {
    const userInfo = localStorage.getItem("userInfo");
    return userInfo ? JSON.parse(userInfo) : null;
  }, []);

  // 获取钱包余额
  const getWalletBalance = useCallback(async (setWalletBalance) => {
    const userInfo = getUserInfo();
    if (!userInfo) return;

    try {
      const data = await ProjectL_backend.show_user(userInfo.userCount, userInfo.userName);
      if (data && data.length) {
        const balance = parseFloat(data[0].wallet_balance) / 100000000;
        setWalletBalance(balance);
      }
    } catch (err) {
      console.error("Error fetching wallet balance:", err);
    }
  }, [getUserInfo]);

  return { getUserInfo, getWalletBalance };
};
