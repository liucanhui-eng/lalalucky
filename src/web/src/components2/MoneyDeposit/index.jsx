import "./index.scss";
import React, { useState, useEffect } from "react";
import { Toast } from "@nutui/nutui-react";
import imgAsk from "./assets/ask.svg";
import imgCopy from "./assets/copy.svg";
import imgInfo from "./assets/imgInfo.png";
import imgOne from "./assets/imgOne.png";
import imgTwo from "./assets/imgTwo.png";
import imgA from "./assets/imgA.jpg";
import imgCode from "./assets/iconCode.svg";
import iconCode from "./assets/iconCode.svg";
import copy from "copy-to-clipboard";
import CButton from "../../componentp/CButton";
import CInput from "../../componentp/CInput";
import CDialog from "../../componentp/CDialog";

import { QRCodeCanvas } from "qrcode.react";
const alink =
  "https://www.binance.com/zh-CN/my/wallet/account/main/withdrawal/crypto/ICP";

import { product as ProjectL_backend } from "declarations/product";
import { pay_center } from "declarations/pay_center";

import CLoading from "../../componentp/CLoading";
import { useUser } from "../../componentp/UserProvider";
import { isIIAuthenticated, getUserInfo } from "../../common/ic-client";
import { useDepositManager } from "../../common/ic-client/deposit";

const email = "support@luckylottery.fun";
const subject = "";
const body = "";

// 构造 mailto 链接
const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
  subject
)}&body=${encodeURIComponent(body)}`;

export default function Index({ handleClick }) {
  const user = useUser();
  const useDeposit = useDepositManager();
  const [userInfo, setUserInfo] = useState(null);
  const [visible3, setVisible3] = useState(false);
  const [inputValue, setInputValue] = useState("https://example.com");
  const [bgColor, setBgColor] = useState("#C2C3C7"); // 默认白色背景
  const [fgColor, setFgColor] = useState("#000000"); // 默认黑色前景

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
      // CLoading.show();
      // const isAuthenticated = await isIIAuthenticated();
      // if (!isAuthenticated) {
      //   setUserInfo(null);
      //   // CLoading.hide();
      // } else {

      //   const _userInfo = await getUserInfo();
      //   setUserInfo(_userInfo);
      //   // CLoading.hide();
      // }
      setUserInfo(user || null);
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

  const formatString = (str) => {
    if (!str) {
      return "";
    }
    // 检查字符串的长度是否超过11个字符
    if (str.length > 11) {
      // 截取前5个和后5个字符，中间加上省略号
      return `${str.slice(0, 5)}...${str.slice(-5)}`;
    }
    // 如果长度不超过11个，直接返回原字符串
    return str;
  };

  return (
    <div className="money-charge-v2">
      <div className="title">
        <div className="title-lable">
          <strong>Ready to play? Deposit ICP now and try your luck!</strong>
        </div>
        {userInfo && userInfo.ic_account_id && (
          <div className="title-lable mt-[8px]">
            <span>Your ICP Adress:</span>
            <span className="ml-[14px] title-lable-value">
              {formatString(userInfo.ic_account_id)}
            </span>
            <span className="ml-[8px]">
              <img
                style={{ color: "#867AA0" }}
                width="20"
                height="20"
                src={imgCopy}
                onClick={() => {
                  try {
                    copy(userInfo.ic_account_id);
                    Toast.show("Copied");
                  } catch {
                    Toast.show("Copy fail");
                  }
                }}
              />
            </span>
          </div>
        )}
      </div>
      {userInfo && userInfo.ic_account_id && (
        <>
          <div className="info-box mt-[16px]">
            <div className="info-img">
              {/* <img src={imgCode} onClick={() => { }} /> */}
              <QRCodeCanvas
                value={userInfo.ic_account_id}
                size={80}
                level="H"
                bgColor={bgColor}
                fgColor={fgColor}
              />
            </div>
          </div>

          <div className="login-box mt-[16px]">
            <div className="btn-box">
              <CButton
                onClick={() => { 
                  if(userInfo.ic_account_id){
                    handleDeposit();
                  }
                }}
                txt="UPDATE balance"
              ></CButton>
            </div>
          </div>
          <div className="email-box mt-[16px]">
            <div className="email-box-title">
              <a href={mailtoLink} target="_blank" rel="noopener noreferrer">
                support@luckylottery.fun
              </a>
            </div>
            <div className="mt-[6px]">Deposits less than 0.1 ICP may not</div>
            <div>show in your balance until they reach </div>
            <div>0.1 ICP.If you're having trouble sign in</div>
            <div>or seeing the wrong balance, please</div>
            <div>contact us.</div>

 
          </div>
        </>
      )}
      {/* 二维码 */}
      <CDialog
        title=""
        visible={visible3}
        footer={null}
        height={180}
        onConfirm={() => {
          setVisible3(false);
        }}
      >
        <div className="dialog-content-qcode">
          <div className="dialog-content">
            Scan via the Binance app to deposit ICP
          </div>
          <div className="dialog-img">
            <img src={imgCode} onClick={() => {}} />
          </div>
        </div>
      </CDialog>
    </div>
  );
}
