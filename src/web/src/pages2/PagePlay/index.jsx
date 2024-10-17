import "./index.scss";

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import PlayCard from "../../components2/PlayCard";
import ListPlay from "../../components2/ListPlayV2";
import WinNumBoard from "../../components2/WinNumBoard";

import { product as ProjectL_backend } from "declarations/product";
export default function Index() {
  const [dataWinNumBoard, setDataWinNumBoard] = useState({
    win1: {},
    win2: {},
    win3: {},
    win4: {},
    win5: {},
    win6: {},
  });

  const childRef = useRef(null); // 创建子组件的引用
  const navigate = useNavigate();
  const [level, setLevel] = useState("");
  const [ticketNo, setTicketNo] = useState("");
  const [ticketData, setTicketData] = useState(null);

  const handlP = (info, data) => {
    if (info == "nologin") {
      navigate("/v2/money");
    }
    if (info == "reload") {
      if (childRef.current) {
        childRef.current.getListPlayData(); // 调用子组件的 refreshData 方法
      }
      console.log("============reload", data);
      setTicketData(data);
      setTicketNo(data.ticketno);
      setLevel(data.level);
    }
    if (info == "loading") {
      setLevel("");
      setTicketNo("");
    }
    if (info == "restart") {
      setLevel("");
      setTicketNo("");
    }
    if (info == "refresh") {
      console.log("================aaa");
    }
  };

  useEffect(() => {
    getPageData();
  }, []);

  const getPageData = async () => {
    console.time("show Execution Time"); // 开始计时
    console.log("%c[INFO] show: Called", "color: blue; font-weight: bold");

    try {
      const data = await ProjectL_backend.show();

      console.log(
        "%c[INFO] show: API response received",
        "color: green; font-weight: bold",
        data
      );
      if (!data) {
        console.log(
          "%c[WARN] show: No data returned",
          "color: orange; font-weight: bold"
        );
        return;
      }

      dealdataWinNumBoard(data);

      
    } catch (err) {
      console.error(
        "%c[ERROR] show: Exception occurred",
        "color: red; font-weight: bold",
        err
      );
    } finally {
      console.timeEnd("show Execution Time"); // 结束计时
    }
  };

  const dealdataWinNumBoard = (dataInfo) => {
    const dataWinNumBoard = dataInfo
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
            tips: `${dataInfo[key].length} slots`,
            data: dataInfo[key].map((item) => {
              let itemNew = Number(item);
              return itemNew;
            }).sort((a, b) => a - b),
          };
          return acc;
        }, {})
      : {};

    console.log("dataWinNumBoard:::::", dataWinNumBoard);
    setDataWinNumBoard(dataWinNumBoard);
  };

  return (
    <>
      <div className="page-play">
        <div className="page-play-top">
          {/* <WinNumList level={level} data={ticketData} /> */}
          <WinNumBoard level={level} ticketNo={ticketNo} pageData={dataWinNumBoard}></WinNumBoard>
        </div>
        <div className="page-play-middle">
          <div className="h24"></div>
          <PlayCard handlP={handlP} />
          <div className="h24"></div>
        </div>
        <div className="list-play-v2-title">
          <div className="list-play-v2-title font-rpp">PLAYBOARD</div>
          <div className="list-play-v2-tips">The latest 50 lottery draws</div>
        </div>
        <div className="page-play-bottom">
          <div className="page-play-bottom-scroll-content">
            <ListPlay ref={childRef} />
          </div>
        </div>
      </div>
    </>
  );
}
