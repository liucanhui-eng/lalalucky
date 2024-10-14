import "./index.scss";
import React, { useState, useEffect } from "react";
import { Input, Toast, Button, Overlay, Dialog } from "@nutui/nutui-react";

import imgAsk from "./assets/ask.svg";
import iconCheckBox1 from "./assets/iconCheckBox1.svg";
import iconCheckBox2 from "./assets/iconCheckBox2.svg";
import CButton from "../../componentp/CButton";
import CInput from "../../componentp/CInput";
import CDialog from "../../componentp/CDialog";

import CLoading from "../../componentp/CLoading";
import { pay_center } from "declarations/pay_center";

const icpMinNum = 0.001;

import { useUser } from "../../componentp/UserProvider";
import { e8sToIcp } from "../../common/ic-client/utils";

const email = "support@luckylottery.fun";
const subject = "";
const body = "";

// 构造 mailto 链接
const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
  subject
)}&body=${encodeURIComponent(body)}`;

export default function Index(props) {
  const user = useUser();
  const [userInfo, setUserInfo] = useState(null);
  const [num, setNum] = useState(null);
  useEffect(() => {
    (async () => {
      setUserInfo(user || null);
      if (user.wallet_blance) {
        setNum(e8sToIcp(user.wallet_blance));
        // setAddress(user.ic_account_id);
      }else{
        setAddress('')
        setAmount('')
        setAddressEmpty(false)
        setAmountFormatError(false)
        setAmountEmpty(false)
        setAmountMini(false)
      }
    })();
  }, [user]);

  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [visible, setVisible] = useState(false);
  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);

  const [addressFormatError, setAddressFormatError] = useState(false);
  const [userAddressEmpty, setAddressEmpty] = useState(false);
  const [amountFormatError, setAmountFormatError] = useState(false);
  const [amountEmpty, setAmountEmpty] = useState(false);
  const [amountMini, setAmountMini] = useState(false);

  const handleWithdraw = () => {
    if (address == "") {
      setAddressEmpty(true);
      return;
    }
    if (amount == "") {
      setAmountEmpty(true);
      return;
    }
    setIsLoading(true);
    CLoading.show();

    console.log("withdraw request:::", Number(amount) * 100000000, address);
    pay_center
      .withdraw(Number(amount) * 100000000, address)
      .then((info) => {
        setVisible(false);
        console.log("withdraw response:::", info);
        const data = JSON.parse(info);
        console.log("withdraw data:::", data);
        console.log("withdraw data::: String(data.code) ", String(data.code) );


        // 499 签名错误
        // 500 提现金额不能小于0.0001 ICP
        // 501 用户不存在
        // 502 余额不足
        // 503 转账失败

        // 200 请求成功
        // 500 amount is too small mast than 0.001
        // 501 plase login first 用户未登录
        // 502 balance is not enough 余额不足
        // 503 please play more than 1 ICP  不满足提现条件
        // 504 please deposit more than 1 ICP  不满足提现条件
        // 505 链上转账失败

        if (data && String(data.code) == "499") {
          Toast.show({
            content: `Signature error.`,
            wordBreak: "break-word",
          });
          return;
        }
        if (data && String(data.code) == "500") {
          Toast.show({
            content: `Withdrawal amount cannot be less than ${icpMinNum} ICP.`,
            wordBreak: "break-word",
          });
          return;
        }
        if (data && String(data.code) == "501") {
          Toast.show({
            content: `Please login first.`,
            wordBreak: "break-word",
          });
          return;
        }
        if (data && String(data.code) == "502") {
          Toast.show({
            content: `Balance is insufficient.`,
            wordBreak: "break-word",
          });
          // setVisible2(true)
          return;
        }
        if (data && String(data.code) == "503") {
          console.log('================')
          // Toast.show({
          //   content: `Transfer failed.`,
          //   wordBreak: "break-word",
          // });
          setVisible2(true);
          return;
        }
        if (data && String(data.code) == "504") {
          // Toast.show({
          //   content: `Transfer failed.`,
          //   wordBreak: "break-word",
          // });
          setVisible2(true);
          return;
        }
        if (data && String(data.code) == "505") {
          Toast.show({
            content: `Withdrawal failed, please try again later.`,
            wordBreak: "break-word",
          });
          return;
        }

        if (data && String(data.code) == "200") {
          // Toast.show("Successful withdrawal！");
          Toast.show({
            content: `Successful withdraw！`,
            wordBreak: "break-word",
          });
          // todo 更新 user信息
          // handleReload();
        } else {
          Toast.show("Fail withdraw");
        }
      })
      .catch((err) => {
        console.log("异常~", err);
        setIsLoading(false);
        Toast.show("Fail withdraw");
      })
      .finally(() => {
        setIsLoading(false);

        CLoading.hide();
      });
  };

  const handleMax = () => {
    setAmount(num);
    if (isValidNineDigitNumber(num)) {
      setAmountMini(false);
    } else {
      setAmountMini(true);
    }

    if (num != "") {
      setAmountEmpty(false);
    } else {
      setAmountEmpty(true);
    }
  };

  const isValidNineDigitNumber = (num) => {
    if (Number(num) >= icpMinNum) {
      return true;
    } else {
      return false;
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
    <>
      <div className="money-withdraw-v2">
        <div className="title-box">
          Withdraw is processed through the Internet Computer Network. Wrong
          crypto address will result in the loss of funds.
        </div>
        <div className="input-box mt-[24px]">
          <div className="input-box-lable">Withdraw Address</div>
          <div className="input-box-input-box">
            <CInput
            clearable={true}
              type="text"
              value={address}
              onChange={(address) => {
                if (address != "") {
                  setAddressEmpty(false);
                } else {
                  setAddressEmpty(true);
                }
                setAddress(address);
              }}
              className="input-box-input"
              placeholder="Enter Address"
            />
          </div>
          {addressFormatError && (
            <div className="error">The withdrawal address format is wrong.</div>
          )}
          {userAddressEmpty && (
            <div className="error">
              Please check the withdrawal address length and character content
              and try again.
            </div>
          )}
          {/* <div className="input-box-tip">
            Please add ICP address provided by your Binance Account.
          </div> */}

          <div className="input-box-lable mt-[8px]">Choose Network</div>
          <CInput readOnly={true} value="Internet Computer" />

          <div className="input-box-lable mt-[8px]">Withdraw Amount</div>
          <div className="input-box-input-box">
            <CInput
            clearable={true}
              type="digit"
              autoComplete="off"
              value={amount}
              onChange={(amount) => {
                setAmount(amount);
                if (isValidNineDigitNumber(amount)) {
                  setAmountMini(false);
                } else {
                  setAmountMini(true);
                }
                if (num < amount) {
                  setAmountFormatError(true);
                } else {
                  setAmountFormatError(false);
                }
                if (amount != "") {
                  setAmountEmpty(false);
                } else {
                  setAmountEmpty(true);
                }
              }}
              placeholder={`Minimum ${icpMinNum}`}
            />

            <div className="w-[72px] ml-[8px] ">
              <CInput readOnly={true} value="ICP" />
            </div>
            <div onClick={handleMax} className="max ml8">
              MAX
            </div>
          </div>
          <div className=" input-box-input-box1">
            {amountFormatError && (
              <div className="error">Insufficient balance</div>
            )}
            {amountEmpty && (
              <div className="error">Please enter the Withdraw Amount</div>
            )}
            {amountMini && <div className="error">minimal {icpMinNum} ICP</div>}
          </div>

          <div className="title-box">
            <div className="tips">
              <div> Network Fee 0.0001 ICP</div>
              <div className="tips-icon">
                
              </div>
            </div>
          </div>

          <div className="btn-box">
            <CButton
              disabled={
                amountMini ||
                userAddressEmpty ||
                amountEmpty ||
                amountFormatError
              }
              onClick={() => {
                // if (address == "") {
                //   setAddressEmpty(true);
                //   return;
                // }
                // if (amount == "") {
                //   setAmountEmpty(true);
                //   return;
                // }
                setVisible(true);
              }}
              loading={isLoading}
              txt="Withdraw"
            ></CButton>
          </div>
        </div>
        <div className="email-box mt-[8px]">
          <div className="email-box-title">
            <a href={mailtoLink} target="_blank" rel="noopener noreferrer">
              support@luckylottery.fun
            </a>
          </div>
          <div className="mt-[6px]">
            If you have trouble to withdraw or have{" "}
          </div>
          <div>not received your withdrawal, please</div>
          <div>contact us with your withdrawal</div>
          <div>address.</div>
        </div>

        <CDialog
          title="Withdraw"
          visible={visible}
          footer={null}
          height={200}
          onCancel={() => {
            setVisible(false);
          }}
          onConfirm={() => {
            setVisible(false);
            handleWithdraw();
          }}
        >
          <div className="dialog-content-box-withdraw">
            <div className="info1">Withdraw {amount} ICP to address：</div>
            <div className="info2 mt-[4px]">{address}</div>
            <div className="info3 mt-[8px]">Fees 0.0001 ICP</div>
            <div className="info4 mt-[4px]">Welcome to follow us：</div>
            <div className="info5 mt-[4px]">https://x.com/luckylotteryfun</div>
          </div>
        </CDialog>

        <CDialog
          title="Fees Instructions"
          visible={visible1}
          footer={null}
          height={150}
          onConfirm={() => {
            setVisible1(false);
          }}
        >
          <div className="dialog-content-box-fees">
            Withdraw will be sent on the blockchain, generation a TXID, with
            network fees charged.
          </div>
        </CDialog>

        <CDialog
          title="Withdraw"
          visible={visible2}
          footer={null}
          height={170}
          onConfirm={() => {
            setVisible2(false);
          }}
        >
          <div className="dialog-content-box-draw">
            <div className="info">
              Please complete the following actions to activate the withdrawal
              function：
            </div>
            <div className="row mt-[8px]">
              <div className="img">
                <img
                  width="16"
                  height="16"
                  src={iconCheckBox1}
                  onClick={() => {}}
                />
              </div>
              <div className="lable">PLAY at least 1ICP</div>
            </div>
            <div className="row mt-[4px]">
              <div className="img">
                <img
                  width="16"
                  height="16"
                  src={iconCheckBox2}
                  onClick={() => {}}
                />
              </div>
              <div className="lable">DEPOSIT at least 1ICP</div>
            </div>
          </div>
        </CDialog>
      </div>
    </>
  );
}
