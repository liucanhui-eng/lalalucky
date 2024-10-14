import "./index.scss";
import { ConfigProvider, Loading, Skeleton } from "@nutui/nutui-react";
import React, { useState, useEffect } from "react";
import imgRefresh from "./assets/refresh.svg";
import imgInputBox from "./assets/imgInputBox.png";
import imgBtn1 from "./assets/imgBtn1.png";
import imgBtn2 from "./assets/imgBtn2.png";

import { formatNumber0 } from "../../common/utils"; // 导入formatNumber方法

import CTitleBox from "../../componentp/CTitleBox";
import CLoading from "../../componentp/CLoading";
import { useUser } from "../../componentp/UserProvider";
import { e8sToIcp } from "../../common/ic-client/utils";
import { isIIAuthenticated, getUserInfo } from "../../common/ic-client";
import { useDepositManager } from "../../common/ic-client/deposit";

export default function Index({ handleP }) {
  const user = useUser();
  const useDeposit = useDepositManager();

  const [walletBalance, setWalletBalance] = useState(null);
  const [userInfo, setUserInfo] = useState({});
  const [isLogin, setIsLogin] = useState(false);

  // 全局开关，控制是否启用日志
  const isLoggingEnabled = true; // 将其设置为 false 来关闭日志

  // 封装的日志函数
  const log = (message, ...optionalParams) => {
    if (isLoggingEnabled) {
      console.log(message, ...optionalParams);
    }
  };

  useEffect(() => {
    (async () => {
      console.log("[user] info", user);
      const isAuthenticated = await isIIAuthenticated();
      if (!isAuthenticated) {
        setIsLogin(false);
      } else {
        setWalletBalance(e8sToIcp(user.wallet_blance));
        setUserInfo(user);
        setIsLogin(true);
      }
    })();
  }, [user]);

  const handleDeposit = async () => {
    log("%cFetching data...", "color: orange; font-weight: bold;");
    // console.time("Data fetch time");

    CLoading.show();
    try {
      // const data = await pay_center.deposit_test(123, 1000000000, '123456');
      // log("%cpay_center fetched:", "color: #007ACC; font-weight: bold;", data);

      await useDeposit.updateBlance();

      await user.update();
    } catch (err) {
      log("%cData fetch error:", "color: red; font-weight: bold;", err);
    } finally {
      CLoading.hide();
      // console.timeEnd("Data fetch time");
      log("%cData fetch completed", "color: purple; font-weight: bold;");
    }
  };

  return (
    <>
      <div className="money-card-v2">
        <div className="title">Your balance(ICP)</div>

        <div className="input-box">
        <CTitleBox>
          <div className="money-card-v2-container ">
         
            <div className="center info-num">
              {!isLogin && (
                <div className="info-num-no">
                  <div>-</div>
                  <div>-</div>
                </div>
              )}
              {isLogin && (
                <div className="info-num-info">
                  {String(formatNumber0(walletBalance)).length > 4 && (
                    <div className="num1">{formatNumber0(walletBalance)}</div>
                  )}
                  {String(formatNumber0(walletBalance)).length <= 4 && (
                    <div className="num">{formatNumber0(walletBalance)}</div>
                  )}
                </div>
              )}
            </div>
            
          </div>
          </CTitleBox>
          </div>
        {/* <div className="mt-[8px]">
          <img
            width="96"
            height="88"
            src={imgBtn1}
            onClick={async () => {
              // await user.update();
              if (userInfo.ic_account_id) {
                handleDeposit();
              }
            }}
          />
        </div> */}
      </div>
    </>
  );
}
