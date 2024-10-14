import "./index.scss";
import iconSuccess from "./assets/iconSuccess.svg";
import iconFail from "./assets/iconFail.svg";
import iconPlaying from "./assets/iconPlaying.svg";

import imgCardbox from "./assets/imgCardbox.svg";
import imgDown from "./assets/down.svg";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useSpring, animated } from "@react-spring/web";
import { Toast, Popup } from "@nutui/nutui-react";
import CoinRain from "../CoinRain";
import ThreeDigitOdometer from "../ThreeDigitOdometer";
import Title from "./Title";
import Butt from "./Butt";
import CDialog from "../../componentp/CDialog";
import { product as ProjectL_backend } from "declarations/product";
import { formatNumber1, formatNumber } from "../../common/utils";
import { useUser } from "../../componentp/UserProvider";
import { e8sToIcp } from "../../common/ic-client/utils";
import { isIIAuthenticated, getUserInfo } from "../../common/ic-client";
import CLoading from "../../componentp/CLoading";

import CTitleBox from "../../componentp/CTitleBox";
import CBoxW from "../../componentp/CBoxW";
import CPopup from "../../componentp/CPopup";

export default function Index(props) {
  const user = useUser();
  const { handlP } = props;

  

  const [dialogLogin, showDialogLogin] = useState(false); // 登录提示
  const [showBottom, setShowBottom] = useState(false); // info显示
  const [userInfo, setUserInfo] = useState({});
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    (async () => {
      // console.log('[user] info', user)
      // const isAuthenticated = await isIIAuthenticated();
      // if (!isAuthenticated) {
      //   setIsLogin(false);
      // } else {
      //   const _userInfo = await getUserInfo();
      //   console.log('[_userInfo] info', _userInfo)
      //   setUserInfo(_userInfo);
      //   setIsLogin(true);
      // }
      if (user && user.wallet_blance) {
        setIsLogin(true);
      } else {
        setIsLogin(false);
      }
      setUserInfo(user || {});
    })();
  }, [user]);

  const levelMapping = {
    6: "2",
    5: "5",
    4: "10",
    3: "20",
    2: "50",
    1: "100",
  };
  const [paused, setPaused] = useState(false);
  // 定义旋转动画
  const propsImg = useSpring({
    to: {
      transform: paused ? "rotate(0deg)" : "rotate(360deg)",
    },
    from: { transform: "rotate(0deg)" },
    config: { duration: 1000 }, // 旋转的时间
    reset: true,
    onRest: () => {
      if (!paused) {
        // 当动画结束后（即完成一个循环时）执行
        setPaused(true);
        setTimeout(() => {
          setPaused(false);
        }, 1000); // 1 秒停顿
      }
    },
    // 如果动画已经暂停，则不再进行动画
    pause: paused,
  });

  const navigate = useNavigate();
  const odometerRef = useRef();
  const handleStart = () => {
    odometerRef.current.start();
  };
  const handleStop = (dataA) => {
    odometerRef.current.setTargetValues(dataA); // 设置目标值
    odometerRef.current.stop();
  };

  const [trigger, setTrigger] = useState(false);
  const handleCoinRain = () => {
    // 每次点击按钮时，触发撒金币效果
    setTrigger(true);
    // 重置 trigger 状态为 false 以便下次点击可以再次触发
    setTimeout(() => {
      setTrigger(false);
    }, 0); // 可以立即重置
  };

  const [isLoading, setIsLoading] = useState(false);
  const [dataType, setDataType] = useState(0);
  const [ticketLevel, setTicketLevel] = useState("");
  const [walletBalance, setWalletBalance] = useState(null);
  const [data, setData] = useState({
    dataType: 1,
    totalCount: 0,
    ticketNum: 0,
  });
  const [inventory, setInventory] = useState(0);

  useEffect(() => {
    getPageData();
  }, []);

  useEffect(() => {
    // 初始调用一次
    getInventory();
    // 设置定时器，每隔3秒调用一次该方法
    const intervalId = setInterval(getInventory, 5000);
    // 清除定时器，防止内存泄漏
    return () => clearInterval(intervalId);
  }, []);

  const getInventory = async () => {
    try {
      const data = await ProjectL_backend.show_inventory();
      setInventory(Number(data));
    } catch (err) {
      console.error("异常~", err);
    } finally {
    }
  };

  useEffect(() => {
    if (user.wallet_blance) {
      setWalletBalance(e8sToIcp(user.wallet_blance));
    } else {
      setWalletBalance("--");
    }
  }, [user]);

  const getPageData = async () => {
    const startTime = new Date().getTime(); // 记录开始时间
    console.log(
      `%c[show] Start: %c${new Date().toISOString()}`,
      "color: green; font-weight: bold;",
      "color: black;"
    );
    CLoading.show();
    try {
      setIsLoading(true);
      console.log(
        "%c[show] Fetching data from ProjectL_backend.show()",
        "color: blue; font-weight: bold;"
      );

      const r3 = await ProjectL_backend.show();
      console.log(
        `%c[show] Response Data:`,
        "color: purple; font-weight: bold;",
        r3
      );

      const playCardData = {
        batch:String(r3.batch).padStart(3, '0'),
        dataType: 1,
        ticketNum: 0,
        inventory: Number(r3.inventory),
        totalCount: Number(r3.total_count),
        rate: String(r3.rate),
        price: e8sToIcp(r3.price),
      };

      

      setData(playCardData);
      console.log(
        `%c[show] Processed Data:`,
        "color: teal; font-weight: bold;",
        playCardData
      );
    } catch (err) {
      console.error(`%c[show] Error:`, "color: red; font-weight: bold;", err);
    } finally {
      CLoading.hide();
      const endTime = new Date().getTime(); // 记录结束时间
      console.log(
        `%c[show] End: %c${new Date().toISOString()}`,
        "color: green; font-weight: bold;",
        "color: black;"
      );
      console.log(
        `%c[show] Duration: %c${endTime - startTime}ms`,
        "color: blue; font-weight: bold;",
        "color: black;"
      );
      setIsLoading(false);
    }
  };

  const handleBingo = async () => {

    // 库存没有 不能play
    if(inventory<=0){
      return;
    }

    if (!(await isIIAuthenticated())) {
      showDialogLogin(true);
      return;
    }


    console.log("walletBalance", walletBalance);
    if (!walletBalance || Number(walletBalance) < 0.001) {
      navigate("/v2/money");
      return;
    }

    handlP("restart");
    setDataType(1);
    setIsLoading(true);
    handleStart();
    playGame(1);
  };

  const showError = (message) => {
    Toast.show({
      content: message,
      wordBreak: "break-word",
    });
    setIsLoading(false);
  };

  const handleResponse = async (data) => {
    if (String(data.ticketno).length === 3) {
      data.ticketno = "0" + data.ticketno;
    }

    switch (data.code) {
      case 500:
        showError("User does not exist.");
        handleStop([0, 0, 0, 0]);
        setDataType(0);
        return;
      case 501:
        showError("Insufficient funds.");
        handleStop([0, 0, 0, 0]);
        setDataType(0);
        return;
      case 502:
        showError("The event has ended.");
        handleStop([0, 0, 0, 0]);
        setDataType(0);
        return;
      case 503:
        showError("The event has not yet started.");
        handleStop([0, 0, 0, 0]);
        setDataType(0);
        return;
      case 200:
        handleStop(String(data.ticketno).split(""));
        const level = data.level;
        await user.update();
        if (level in levelMapping) {
          setTicketLevel(levelMapping[level]);
        }

        if (data.win) {
          setDataType("2");
          handleCoinRain();
        } else {
          setDataType("3");
        }
        break;
      default:
        handleStop([0, 0, 0, 0]);
        setDataType(0);
        // Toast.show(data.message);
        break;
    }

    handlP("reload", data);
    setIsLoading(false);
  };

  const playGame = async (retry = 1) => {
    try {
      const commitInfo = await ProjectL_backend.commit();

      console.log(
        `%c[commit] Response Data:`,
        "color: blue; font-weight: bold;",
        commitInfo
      );
      try {
        console.log(
          `%c[play] Request Data:`,
          "color: blue; font-weight: bold;",
          commitInfo,
          String(userInfo.user_name),
          String(userInfo.logo)
        );
        const info = await ProjectL_backend.play(
          commitInfo,
          String(userInfo.user_name),
          String(userInfo.logo)
        );
        console.log(
          `%c[play] Response Data:`,
          "color: blue; font-weight: bold;",
          info
        );

        const data = JSON.parse(info);
        handleResponse(data);
        getInventory();
        // getWalletBalance();
      } catch (err) {
        handleStop([0, 0, 0, 0]);
        setDataType(0);
        if (retry > 0) {
          console.log(`play调用失败，重试中...剩余重试次数：${retry}`);
          // 调用自己，重试一次
          await playGame(retry - 1);
        } else {
          showError(`${err}`);
          console.log("抽奖异常~", err);
        }
      }
    } catch (err) {
      handleStop([0, 0, 0, 0]);
      setDataType(0);
      console.log("抽奖异常~", err);
    }
  };


  


  return (
    <div className="play-card-box-v2">
      <CTitleBox>
        <div className="play-card">
          <div className="play-card-top">
            <div className="play-card-no">BATCH.{data.batch}</div>
            {data.rate && (
              <div
                onClick={() => {
                  setShowBottom(true);
                }}
                className="play-card-tips"
              >
                {formatNumber(data.rate)}% Win Rate{" "}
                <img width="14" height="10" className="ml-1" src={imgDown} />
              </div>
            )}
          </div>

          {dataType == 0 && (
            <div className="title title1">
              <Title isLogin={isLogin} walletBalance={walletBalance} />
            </div>
          )}
          {dataType == 1 && (
            <div className="title title1">Generating your number ...</div>
          )}
          {dataType == 2 && (
            <div className="title title2">
              {ticketLevel}X Won! Congratulations!
            </div>
          )}
          {dataType == 3 && (
            <div className="title title3">You are closer to the next win</div>
          )}
          <div className="num-box-container">
            <CBoxW>
              <div className="num-box-v2">
                <div>
                  {dataType == 1 && (
                    <animated.div style={propsImg}>
                      <img width="28" height="28" src={iconPlaying} />
                    </animated.div>
                  )}
                  {dataType == 2 && (
                    <img width="45" height="53" src={iconSuccess} />
                  )}
                  {dataType == 3 && (
                    <img width="37" height="42" src={iconFail} />
                  )}
                </div>
                <div className="num num1">
                  <span className={dataType == 0 ? "block" : "hidden"}>
                    WIN
                  </span>
                  <span className={dataType != 0 ? "block" : "hidden"}>
                    <ThreeDigitOdometer ref={odometerRef} initialSpeed={100} />
                  </span>
                </div>
                <div>
                  {dataType == 1 && (
                    <animated.div style={propsImg}>
                      <img width="28" height="28" src={iconPlaying} />
                    </animated.div>
                  )}
                  {dataType == 2 && (
                    <img width="45" height="53" src={iconSuccess} />
                  )}
                  {dataType == 3 && (
                    <img width="37" height="42" src={iconFail} />
                  )}
                </div>
              </div>
            </CBoxW>
          </div>
          <div className="bottom">
            <div className="left">
              <div className="left-info">Remaining</div>
              <div className="left-no">
                <span className="inventory">{inventory}</span>{" "}
                <span className="totalCount">/{data.totalCount}</span>
              </div>
            </div>
            <div className="center">
              <div className="center-info">ICP Balance</div>
              <div className="center-num">
                {formatNumber1(walletBalance) || "--"}
              </div>
            </div>
            <div className="right">
              <div className="right-1">One Play</div>
              <div className="right-2"> {data.price} ICP</div>
            </div>
          </div>
        </div>
      </CTitleBox>
      <div className="btn-box">
        <Butt
          isLogin={isLogin}
          walletBalance={walletBalance}
          isLoading={isLoading}
          handleBingo={handleBingo}
        />
        <CoinRain trigger={trigger} />
      </div>

      <CDialog
        title="Need To Login"
        visible={dialogLogin}
        footer={null}
        height={100}
        onConfirm={() => {
          showDialogLogin(false);
        }}
      >
        <div className="dialog-content">
          Please sign in to your account first.
        </div>
      </CDialog>

      <CPopup
        position="bottom"
        title=""
        className="px-0"
        closeOnOverlayClick={true}
        visible={showBottom}
        onClose={() => {
          setShowBottom(false);
        }}
        lockScroll
      >
        <div className="max-h-[500px] overflow-y-auto">
          <div className="title">Instant Win Rules</div>

          <div className="subtitle mt-[8px]">Warning:</div>

          <div className="content mt-[16px]">
            You must be at least 18 years old or of legal age in your
            jurisdiction to participate.
          </div>

          <div className="subtitle mt-[40px]">Notice:</div>

          <div className="content mt-[16px]">
            The following settings are as displayed on the play page.
          </div>

          <div className="subtitle mt-[40px]">Batch 001</div>
          <div className="subtitle mt-[16px]">Pool Size and Probability:</div>
          <div className="content mt-[16px]">
            <ul>
              <li>Total tickets: 10,000</li>
              <li>Price per ticket: 0.1 ICP</li>
              <li>Total prize pool: 1,000 ICP</li>
              <li>Winning probability: 20.3%</li>
              <li>Prize distribution rate: 90%</li>
            </ul>
          </div>

          <div className="subtitle mt-[40px]">Win Prizes:</div>

          <div className="content mt-[16px]">
            Winning numbers are displayed on the play page and are pre-generated
            using the Internet Computer Random Generator
          </div>
          <div className="content mt-[16px]">
            <ul>
              <li>
                Prize 1: 100x, 10 slot; A winner will receive{" "}
                <strong> 100 times the price of one ticket.</strong>
              </li>
              <li>Prize 2: 50x, 20 slots</li>
              <li>Prize 3: 20x, 50 slots</li>
              <li>Prize 4: 10x, 150 slots</li>
              <li>Prize 5: 5x, 300 slots</li>
              <li>Prize 6: 2x, 1500 slots</li>
            </ul>
          </div>
          <div className="mt-[16px]">
            <strong> Total Winning Slots：2030 of 10,000</strong>
          </div>

          <div className="subtitle mt-[40px]">Start and End:</div>
          <div className="content mt-[16px]">
            <ul>
              <li>
                Starts from the launch and ends when all tickets are sold.
              </li>
            </ul>
          </div>

          <div className="subtitle mt-[40px]">Play:</div>
          <div className="content mt-[16px]">
            <ul>
              <li>
                Clicking the "Play" button initiates a lottery draw.
                <strong>
                  {" "}
                  A random number between 0 and 9999 will be generated in real
                  time
                </strong>
                to determine the winner.
              </li>
              <li>
                If the user leaves the page before the result is displayed, the
                draw remains valid.
              </li>
              <li>
                Winning results will be automatically recorded in the user's
                account balance.
              </li>
              <li>
                Draw results will be shown on the Play page. Users can also view
                their Play and Win records on the{" "}
                <strong>Money-Record page.</strong>
              </li>
            </ul>
          </div>

          <div className="subtitle mt-[40px]">Deposit and Withdraw:</div>
          <div className="content mt-[16px]">
            <ul>
              <li>User deposits are managed by smart contracts.</li>
              <li>
                Users can withdraw their account balance at any time, no
                limitation.
              </li>
              <li>
                The network transaction fee for withdrawals will be paid by the
                recipient of the withdrawal address.
              </li>
            </ul>
          </div>

          <div className="subtitle mt-[40px]">Information Disclosure:</div>
          <div className="content mt-[16px]">
            <ul>
              <li>
                After a lottery batch ends, users can view all winning
                information for that lottery batch on the History page.
              </li>
            </ul>
          </div>

          <div className="subtitle mt-[40px]">Privacy Protection:</div>
          <div className="content mt-[16px]">
            <ul>
              <li>All users are verified through Decentralized Identity.</li>
              <li>
                All transactions are processed through the Internet Computer
                network.
              </li>
              <li>We will not disclose user privacy in any form.</li>
            </ul>
          </div>

          <div className="subtitle mt-[40px]">Note:</div>
          <div className="content mt-[16px]">
            <ul>
              <li>
                ICP: This refers to Internet Computer Points, the native token
                of the Internet Computer blockchain.
              </li>
              <li>
                Slot: This term might refer to the number of times a specific
                prize can be won.
              </li>
              <li>
                Decentralized Identity: A self-sovereign identity solution where
                individuals control their own digital identity.
              </li>
            </ul>
          </div>

          <div className="mt-[20px] h-[20px]"></div>
        </div>
      </CPopup>
    </div>
  );
}
