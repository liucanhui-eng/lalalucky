import "./index.scss";
import iconArrow from "./assets/iconArrow.svg";
import React, { useEffect, useState, useRef } from "react";

import CTitleBox from "../../componentp/CTitleBox";
import WinnerBoardHistoryList from "../../components2/WinnerBoardHistoryList";
import WinNumBoard from "../../components2/WinNumBoard";
import CLoading from "../../componentp/CLoading";
import { play_record } from "declarations/play_record";

import { product as ProjectL_backend } from "declarations/product";
export default function Index() {
  const layerRef = useRef(null);
  const [datePickerName, setDatePickerName] = useState("Sep 2024");
  const [showCDateBox, setShowCDateBox] = useState(false);

  const [currentBatch, setCurrentBatch] = useState("");
  const [pname, setPname] = useState("");
  const [pageData, setPageData] = useState({});

  const [dateData, setDateData] = useState([
    {
      name: "Sep 2024",
      value: "202409",
    },
  ]);

  //
  const [batchData, setBatchData] = useState([]);
  //
  const [dataWinNumBoard, setDataWinNumBoard] = useState({
    win1: {},
    win2: {},
    win3: {},
    win4: {},
    win5: {},
    win6: {},
  });
  //
  const [dataWinnerBoardHistoryList, setDataWinnerBoardHistoryList] = useState(
    []
  );

  useEffect(() => {
    getPageData();
  }, []);

  const logData = (label, data) => {
    console.log(`%c[${label}]`, "color: purple; font-weight: bold;", data);
  };

  const getPageData = async () => {
    CLoading.show();
    try {
      const showInfo = await ProjectL_backend.show();
      logData("show Response Data", showInfo);
      setPname(showInfo.ticket_type);

      const pname = showInfo.ticket_type;
      const pageDataNew = {
        pname: showInfo.ticket_type,
      };
      const mergedObj = Object.assign({}, pageData, pageDataNew);
      setPageData(mergedObj);

      logData("show_batch_time_list request Data", pname);
      const batchList = await play_record.show_batch_time_list(pname);
      logData("show_batch_time_list Response Data", batchList);
      dealBatchData(batchList);

      const batch = Number(batchList[batchList.length - 1].batch);
      console.log(batch, "---------------------");
      setCurrentBatch(batch);
      //
      await requestShowPInfo(`${pname}_${batch}`, pname, batch);
      await requestShowPlayWinRecord(`${pname}_${batch}`, pname, batch);

      CLoading.hide();
    } catch (err) {
      CLoading.hide();
      logData("play_record err", err);
    } finally {
    }
  };

  //
  const requestShowPInfo = async (pid, pname, batch) => {
    try {
      logData("show_p_info request Data", { pid, pname, batch });
      const pInfo = await play_record.show_p_info(pid, pname, String(batch));
      logData("show_p_info Response Data", pInfo);
      dealdataWinNumBoard(pInfo);
    } catch (err) {
      logData("show_p_info err", err);
    }
  };

  //
  const requestShowPlayWinRecord = async (pid, pname, batch) => {
    try {
      logData("show_play_win_record request Data", { pid, pname, batch });
      const playWinRecordInfo = await play_record.show_play_win_record(
        pid,
        pname,
        String(batch)
      );
      logData("show_play_win_record Response Data", playWinRecordInfo);
      dealDataWinnerBoardHistoryList(playWinRecordInfo);
    } catch (err) {
      logData("show_play_win_record err", err);
    }
  };

  //
  const dealBatchData = (dataInfo) => {
    const batchData =
      dataInfo && dataInfo.length > 0
        ? dataInfo.map((item) => ({
            name: `BATCH.${String(item.batch).padStart(3, "0")} `,
            value: Number(item.batch),
            start_time: ctime(Number(item.start_time)),
          }))
        : [];
    console.log("========,batchData", batchData);
    setBatchData(batchData);
  };

  const ctime = (t) => {
    const date = new Date(t * 1000);
    const Y = date.getFullYear() + "-";
    const M =
      (date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1) + "-";
    const D = date.getDate() + " ";
    const h = date.getHours() + ":";
    const m = date.getMinutes() + ":";
    const s = date.getSeconds();
    if (t) {
      return Y + M + D + h + m + s;
    } else {
      return "";
    }
  };

  //
  const dealDataWinnerBoardHistoryList = (dataInfo) => {
    const dataWinnerBoardHistoryList =
      dataInfo && dataInfo.length > 0
        ? dataInfo[0].map((item) => ({
            avatar: item.user_portrait,
            name: item.user_name,
            num: Number(item.ticket_no),
            info: `${item.level}X`,
          }))
        : [];

    setDataWinnerBoardHistoryList(dataWinnerBoardHistoryList);
  };

  //
  const dealdataWinNumBoard = (dataInfo) => {
    const dataWinNumBoard =
      dataInfo && dataInfo.length > 0
        ? [
            { level: "1", title: "100X", key: "win1" },
            { level: "2", title: "50X", key: "win2" },
            { level: "3", title: "20X", key: "win3" },
            { level: "4", title: "10X", key: "win4" },
            { level: "5", title: "5X", key: "win5" },
            { level: "6", title: "2X", key: "win6" },
          ].reduce((acc, { level, title, key }) => {
            acc[key] = {
              level,
              title,
              tips: `${dataInfo[0][key].length} slots`,
              data: dataInfo[0][key]
                .map((item) => {
                  let itemNew = Number(item);
                  return itemNew;
                })
                .sort((a, b) => a - b),
            };
            return acc;
          }, {})
        : {};

    const pageDataNew = {
      total_count: Number(dataInfo[0].total_count).toLocaleString(),
      rate: Number(dataInfo[0].rate).toFixed(2),
      total_bonus: (
        Number(dataInfo[0].total_bonus) / 100000000
      ).toLocaleString(),
      pay_out: Number(dataInfo[0].pay_out),
    };
    const mergedObj = Object.assign({}, pageData, pageDataNew);
    setPageData(mergedObj);

    setDataWinNumBoard(dataWinNumBoard);
  };

  const handleCDateBoxClick = (item) => {
    console.log("aaaa", item);
    setDatePickerName(item.name);
    setShowCDateBox(false);
  };

  const handleBatchItemClick = async (item) => {
    console.log("aaaab", item);
    setCurrentBatch(Number(item.value));

    CLoading.show();
    setDataWinNumBoard({});
    setDataWinnerBoardHistoryList([]);

    await requestShowPInfo(
      pname + "_" + Number(item.value),
      pname,
      Number(item.value)
    );
    await requestShowPlayWinRecord(
      pname + "_" + Number(item.value),
      pname,
      Number(item.value)
    );
    CLoading.hide();
  };

  return (
    <>
      <div className="page-history-v2">
        <div className="page-history-v2-top">
          <div
            className="row-title-a relative"
            onClick={() => {
              setShowCDateBox(true);
            }}
          >
            <div className="lable">{datePickerName}</div>
            {/* <div
              className="ml-[8px]"
              onClick={() => {
                //setShowDatePicker(true);
              }}
            >
              <img width="15" height="12" src={iconArrow}></img>
            </div> */}
            {/* {showCDateBox && (
              <div
                ref={layerRef}
                className="row-title-aa absolute top-[15px] left-0"
              >
                <CDateBox
                  handleClick={(item) => {
                    handleCDateBoxClick(item);
                  }}
                  data={dateData}
                ></CDateBox>
              </div>
            )} */}
          </div>

          <div className=" mt-[8px] w-[99%]">
            <CTitleBox>
              <div
                className="batch-box-container"
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    batchData.length > 1 ? "repeat(2, 1fr)" : "1fr",
                  gap: "10px",
                  gridRowGap: "8px",
                }}
              >
                {batchData.map((item) => (
                  <div
                    onClick={() => {
                      handleBatchItemClick(item);
                    }}
                    className={`batch-box ${
                      currentBatch == item.value ? "batch-box-a" : "batch-box-n"
                    }`}
                    key={item.value}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            </CTitleBox>
          </div>
          <div className="info-box mt-[16px]">
            <div className="info-box-item  ">
              Total Tickets: {pageData.total_count}
            </div>
            <div className="info-box-item ml-[4px]">
              Total Funds: {pageData.total_bonus} ICP
            </div>
          </div>
          <div className="info-box mt-[4px]">
            <div className="info-box-item  ">Win Rate: {pageData.rate}%</div>
            <div className="info-box-item ml-[4px]">
              Funds Payout: {pageData.pay_out}%
            </div>
          </div>
        </div>

        <div className="page-history-v2-middle mt-[24px]">
          <WinNumBoard pageData={dataWinNumBoard}></WinNumBoard>
        </div>
        <div className="list-play-v2-title mt-[24px]">
          <div className="list-play-v2-title font-rpp">Winner Board</div>
        </div>
        <div className="page-history-v2-bottom">
          <div className="page-history-v2-bottom-scroll-content">
            <div className="mt-[4px]">
              <WinnerBoardHistoryList
                dataList={dataWinnerBoardHistoryList}
              ></WinnerBoardHistoryList>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
