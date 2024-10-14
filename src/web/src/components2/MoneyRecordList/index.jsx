import "./index.scss";
import React, { useEffect, useState, useRef } from "react";
import iconArrow from "./assets/iconArrow.svg";
import { Row, Col } from "@nutui/nutui-react";
import { pay_center } from "declarations/pay_center";

import { useUser } from "../../componentp/UserProvider";
import CLoading from "../../componentp/CLoading";
import CDatePicker from "../../componentp/CDatePicker";
import CDateBox from "../../componentp/CDateBox";
import { e8sToIcp } from "../../common/ic-client/utils";
import { formatNumber, maskString, ctime } from "../../common/utils"; // 导入formatNumber方法

import ListNoDataInfo from "../ListNoDataInfo";

export default function Index() {
  const user = useUser();
  const layerRef = useRef(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerName, setDatePickerName] = useState("All");

  const [currentDatePicker, setCurrentDatePicker] = useState({
    name: "ALL",
    value: "all",
  });

  const [showCDateBox, setShowCDateBox] = useState(false);

  const [dataList, setDataList] = useState([]);
  const [dataList0, setDataList0] = useState([]);
  const [countInfo, setCountInfo] = useState({
    total1: "--",
    winCount: "--",
    depositCount: "--",
    bonusCount: "--",
    total2: "--",
    playCount: "--",
    withdrawCount: "--",
  });

  const [activeButton, setActiveButton] = useState(null);

  const handleClickOutside = (event) => {
    // setShowCDateBox(false);
    // 如果点击的区域不在层内，隐藏层
    if (layerRef.current && !layerRef.current.contains(event.target)) {
      setShowCDateBox(false);
    }
  };

  useEffect(() => {
    // 监听点击事件和触摸事件
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside); // 适配移动端

    return () => {
      // 移除监听器，防止内存泄漏
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    (async () => {
      if (user.user_name) {
        getData();
      } else {
        setDataList([]);
        setDataList0([]);
        setCountInfo({
          total1: "--",
          winCount: "--",
          depositCount: "--",
          bonusCount: "--",
          total2: "--",
          playCount: "--",
          withdrawCount: "--",
        });
      }
    })();
  }, [user]);

  const getData = () => {
    CLoading.show();
    pay_center
      .show_user()
      .then((info) => {
        console.log("show_user info:::::", info);
        let dataList = [];
        if (info) {
          const ledgers = info.ledgers;
          ledgers.map((item) => {
            let itemNew = {};
            itemNew.name = Object.keys(item.event)[0];

            // itemNew.amount = Number(e8sToIcp(Number(item.amount)));
            // if (Number(item.amount) > 0) {
            //   itemNew.num1 = e8sToIcp(Number(item.amount));
            // } else {
            //   itemNew.num2 = e8sToIcp(Number(item.amount));
            // }
            itemNew.amount = Number(item.amount) / 100000000;
            if (Number(item.amount) > 0) {
              itemNew.num1 = Number(item.amount) / 100000000;
            } else {
              itemNew.num2 = Number(item.amount) / 100000000;
            }
            itemNew.date0 = Number(item.time);
            itemNew.date = ctime(Number(item.time), 2);
            if (item.win_times && item.win_times.length > 0) {
              itemNew.win_times = Number(item.win_times[0]);
            } else {
              itemNew.win_times = "";
            }
            dataList.push(itemNew);
          });
        }
        dealData(dataList);
        setDataList0(dataList);
      })
      .catch((err) => {
        console.log("异常~", err);
      })
      .finally(() => {
        CLoading.hide();
      });
  };

  const dealData = (dataList) => {
    setActiveButton(null);
    setDataList(dataList);
  
    // 预处理分类并计算对应的总和
    const counts = dataList.reduce(
      (acc, item) => {
        const key = item.name.toLowerCase();
        const amount = item.amount * 1000;
  
        if (acc.hasOwnProperty(key)) {
          acc[key] += amount;
        }
        return acc;
      },
      {
        deposit: 0,
        play: 0,
        win: 0,
        withdraw: 0,
        bonus: 0,
      }
    );
  
    console.log("playCount::", counts.play);
  
    // 计算 total1 和 total2
    const total1 = (counts.win + counts.deposit + counts.bonus) / 1000;
    const total2 = (counts.play + counts.withdraw) / 1000;
  
    // 设置 countInfo
    setCountInfo({
      total1: total1 === 0 ? "--" : "+" + total1,
      winCount: counts.win === 0 ? "--" : "+" + counts.win / 1000,
      depositCount: counts.deposit === 0 ? "--" : "+" + counts.deposit / 1000,
      bonusCount: counts.bonus === 0 ? "--" : "+" + counts.bonus / 1000,
      total2: total2 === 0 ? "--" : total2,
      playCount: counts.play === 0 ? "--" : counts.play / 1000,
      withdrawCount: counts.withdraw === 0 ? "--" : counts.withdraw / 1000,
    });
  };
  

  const handleFilterData = (name) => {
    if (activeButton == name || name == "") {
      setActiveButton(null);
      setDataList(dataList0);
    } else {
      setActiveButton(name);
      const dataListNew = dataList0.filter(
        (item) => item.name.toLowerCase() == name
      );
      setDataList(dataListNew);
    }
  };

  // const handleDatePickerClose = () => {
  //   setShowDatePicker(false);
  // };
  // const handleDatePickerChange = (options, values) => {
  //   console.log("===========000", options, values);
  // };
  // const handleDatePickerConfirm = (options, values) => {
  //   console.log("===========111", options, values);
  //   console.log("===========111", JSON.stringify(dataList0), 2);
  //   const filteredData = filterDataByDate(dataList0, values[0] + values[1]);
  //   console.log("===========111", JSON.stringify(filteredData), 2);
  //   setDataList(filteredData);
  //   dealData(filteredData);
  // };

  const filterDataByDate = (data, yearMonth) => {
    const year = yearMonth.slice(0, 4);
    const month = yearMonth.slice(4, 6);

    const startDate = new Date(year, month - 1, 1).getTime(); // 月初时间戳
    const endDate = new Date(year, month, 1).getTime(); // 下月月初时间戳

    return data.filter(
      (item) => item.date0 >= startDate && item.date0 < endDate
    );
  };

  const handleCDateBoxClick = (item) => {
    console.log("=========", item.value);
    setCurrentDatePicker(item);
    setShowCDateBox(false);
    setDatePickerName(item.name);
    if (item.value == "all") {
      setDataList(dataList0);
      dealData(dataList0);
    } else {
      const filteredData = filterDataByDate(dataList0, item.value);
      setDataList(filteredData);
      dealData(filteredData);
    }
  };

  return (
    <>
      <div className="money-record-list-v2">
        <div className="row-title-a relative">
          <div
            className="lable"
            onClick={() => {
              // handleFilterData("");
              setShowCDateBox(true);
            }}
          >
            {datePickerName}
          </div>
          <div
            className="ml-[8px]"
            onClick={() => {
              // handleFilterData("");
              setShowCDateBox(true);
            }}
          >
            <img width="15" height="12" src={iconArrow}></img>
          </div>
          {showCDateBox && (
            <div
              ref={layerRef}
              className="row-title-aa absolute top-[15px] left-0"
            >
              <CDateBox
                currentItem={currentDatePicker}
                handleClick={(item) => {
                  handleCDateBoxClick(item);
                }}
                data={[
                  {
                    name: "ALL",
                    value: "all",
                  },
                  {
                    name: "May 2024",
                    value: "202405",
                  },
                  {
                    name: "Jun 2024",
                    value: "202406",
                  },
                  {
                    name: "Jul 2024",
                    value: "202407",
                  },
                  {
                    name: "Aug 2024",
                    value: "202408",
                  },
                  {
                    name: "Sep 2024",
                    value: "202409",
                  },
                  {
                    name: "Oct 2024",
                    value: "202410",
                  },
                  {
                    name: "Nov 2024",
                    value: "202411",
                  },
                  {
                    name: "Dec 2024",
                    value: "202412",
                  },
                ]}
              ></CDateBox>
            </div>
          )}
        </div>
        {/* <CDatePicker
          visible={showDatePicker}
          onClose={handleDatePickerClose}
          onChange={handleDatePickerChange}
          onConfirm={handleDatePickerConfirm}
        /> */}
        <div className="mt-[8px]">
          <Row className="custom-row">
            <Col
              span="12"
              className="custom-col custom-border-right custom-border-bottom"
            >
              <div className="row-content-total">
                <div className="lable">total</div>
              </div>
              <div className="row-content-num">
                <div className="lable">{countInfo.total1}</div>
              </div>
            </Col>
            <Col
              span="12"
              className="custom-col custom-border-bottom custom-border-right"
            >
              <div className="row-content-total">
                <div className="lable">total</div>
              </div>
              <div className="row-content-num">
                <div className="lable">{countInfo.total2}</div>
              </div>
            </Col>
          </Row>
          <Row className="custom-row">
            <Col
              span="12"
              className="custom-col custom-border-right custom-border-bottom"
              onClick={() => {
                if (countInfo.winCount != "--") {
                  handleFilterData("win");
                }
              }}
            >
              <div
                className={`${
                  countInfo.winCount == "--"
                    ? "row-content-label-d"
                    : "row-content-label"
                }`}
              >
                <div className="lable">win</div>
              </div>
              <div
                className={` ${
                  activeButton == "win"
                    ? "row-content-num-a"
                    : "row-content-num"
                }`}
              >
                <div className="lable">{countInfo.winCount}</div>
              </div>
            </Col>
            <Col
              span="12"
              className={`custom-col custom-border-bottom custom-border-right`}
              onClick={() => {
                if (countInfo.playCount != "--") {
                  handleFilterData("play");
                }
              }}
            >
              <div
                className={`${
                  countInfo.playCount == "--"
                    ? "row-content-label-d"
                    : "row-content-label"
                }`}
              >
                <div className="lable">play</div>
              </div>
              <div
                className={` ${
                  activeButton == "play"
                    ? "row-content-num-a"
                    : "row-content-num"
                }`}
              >
                <div className="lable">{countInfo.playCount}</div>
              </div>
            </Col>
          </Row>
          <Row className="custom-row">
            <Col
              span="12"
              className="custom-col custom-border-right custom-border-bottom"
              onClick={() => {
                if (countInfo.depositCount != "--") {
                  handleFilterData("deposit");
                }
              }}
            >
              <div
                className={`${
                  countInfo.depositCount == "--"
                    ? "row-content-label-d"
                    : "row-content-label"
                }`}
              >
                <div className="lable">Deposit</div>
              </div>
              <div
                className={` ${
                  activeButton == "deposit"
                    ? "row-content-num-a"
                    : "row-content-num"
                }`}
              >
                <div className="lable">{countInfo.depositCount}</div>
              </div>
            </Col>
            <Col
              span="12"
              className="custom-col custom-border-bottom custom-border-right"
              onClick={() => {
                if (countInfo.withdrawCount != "--") {
                  handleFilterData("withdraw");
                }
              }}
            >
              <div
                className={`${
                  countInfo.withdrawCount == "--"
                    ? "row-content-label-d"
                    : "row-content-label"
                }`}
              >
                <div className="lable">Withdraw</div>
              </div>
              <div
                className={` ${
                  activeButton == "withdraw"
                    ? "row-content-num-a"
                    : "row-content-num"
                }`}
              >
                <div className="lable">{countInfo.withdrawCount}</div>
              </div>
            </Col>
          </Row>

          <Row className="custom-row">
            <Col
              span="12"
              className="custom-col custom-border-right custom-border-bottom"
              onClick={() => {
                if (countInfo.bonusCount != "--") {
                  handleFilterData("bonus");
                }
              }}
            >
              <div
                className={`${
                  countInfo.bonusCount == "--"
                    ? "row-content-label-d"
                    : "row-content-label"
                }`}
              >
                <div className="lable">BONUS</div>
              </div>
              <div
                className={` ${
                  activeButton == "bonus"
                    ? "row-content-num-a"
                    : "row-content-num"
                }`}
              >
                <div className="lable">{countInfo.bonusCount}</div>
              </div>
            </Col>
            <Col
              span="12"
              className="custom-col custom-border-bottom custom-border-right"
            >
              <div className="row-content-label-d">
                <div className="lable">--</div>
              </div>
              <div className="row-content-num">
                <div className="lable">--</div>
              </div>
            </Col>
          </Row>
        </div>
        <div className="h16"></div>
        <div className="data-box">
          {/* {(!dataList || dataList.length == 0) && (
            <div className="data-box-e">No Information</div>
          )} */}

          {(!dataList || dataList.length <= 0) && <ListNoDataInfo />}

          {dataList &&
            dataList.length > 0 &&
            dataList.map((item, index) => {
              return (
                <div className="data-row" key={index}>
                  <div className="data-row-name">
                    <span className="name">{item.name}</span>
                    <span className="date"> {item.date}</span>
                  </div>
                  <div className="info">
                    <span>{item.num1 && <span>+{item.num1}</span>}</span>
                    <span>{item.num2 && <span>{item.num2}</span>}</span>
                    <span className="info-u">
                      ICP
                      {item.win_times && <span>({item.win_times}X)</span>}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}
