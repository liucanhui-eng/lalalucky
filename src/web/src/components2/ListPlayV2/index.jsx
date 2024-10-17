import "./index.scss";
import iconWin from "./assets/iconWin.svg";
import iconMiss from "./assets/iconMiss.svg";
import React, {
  useImperativeHandle,
  forwardRef,
  useEffect,
  useState,
} from "react";

import ListNoDataInfo from "../ListNoDataInfo";
import CAvatar from "../../componentp/CAvatar";

import { product as ProjectL_backend } from "declarations/product";
import { formatPast, maskString, ctime } from "../../common/utils"; // 导入formatNumber方法

const Index = forwardRef((props, ref) => {
  // 全局开关，控制是否启用日志
  const isLoggingEnabled = false; // 将其设置为 false 来关闭日志

  // 封装的日志函数
  const log = (message, ...optionalParams) => {
    if (isLoggingEnabled) {
      console.log(message, ...optionalParams);
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    log(
      "%cComponent mounted, starting initial data fetch",
      "color: green; font-weight: bold;"
    );
    getListPlayData();

    const intervalId = setInterval(() => {
      if (!isLoading) {
        log(
          "%cStarting periodic data fetch",
          "color: blue; font-weight: bold;"
        );
        getListPlayData();
      }
    }, 5000);

    return () => {
      clearInterval(intervalId);
      log(
        "%cComponent unmounted, cleared interval",
        "color: red; font-weight: bold;"
      );
    };
  }, []);

  const getListPlayData = async () => {
    setIsLoading(true);

    log("%cFetching data...", "color: orange; font-weight: bold;");
    // console.time("Data fetch time");

    try {
      const data = await ProjectL_backend.query_play_record();
      log(
        "%cR query_play_record fetched:",
        "color: #007ACC; font-weight: bold;",
        data
      );

      const listPlayDataList =
        data?.map((item) => ({
          img: item.user_portrait,
          name: item.user_name,
          type: item.win ? "WIN!" : "MISSED!",
          win: String(item.win),
          date: formatPast(Number(item.play_time)) ,
        })) || [];

      log(
        "%cFormatted data list:",
        "color: #32CD32; font-weight: bold;",
        listPlayDataList
      );
      setDataList(listPlayDataList);
    } catch (err) {
      log("%cData fetch error:", "color: red; font-weight: bold;", err);
    } finally {
      setIsLoading(false);
      // console.timeEnd("Data fetch time");
      log("%cData fetch completed", "color: purple; font-weight: bold;");
    }
  };

  const formatString = (str) => {
    return str.length > 10 ? str.slice(0, 10) + "..." : str;
  };

  // 定义暴露给父组件的接口
  useImperativeHandle(ref, () => ({
    getListPlayData, // 暴露的刷新方法
  }));

  return (
    <>
      <div className="list-play-v2">
        {/* <div className="list-play-v2-title">
          <div className="list-play-v2-title font-rpp">PLAYBOARD</div>
          <div className="list-play-v2-tips">The latest 50 lottery draw</div>
        </div> */}
        <div className="list-play-box">
          {(!dataList || dataList.length <= 0) && <ListNoDataInfo />}
          {dataList &&
            dataList.length > 0 &&
            dataList.map((item, index) => {
              return (
                <div className="row-data" key={index}>
                  <div className="row-data-img flx">
                    <CAvatar avatar={item.img} size="small" />
                  </div>
                  <div className="row-data-name ml-[10px]">
                    {formatString(item.name)}
                  </div>
                  <div className="row-data-type ml-[24px]">
                    <div className="row-data-type-icon">
                      {item.win == "false" && (
                        <span>
                          <img width="24" height="24" src={iconMiss} />
                        </span>
                      )}
                      {item.win == "true" && (
                        <span>
                          <img width="24" height="24" src={iconWin} />
                        </span>
                      )}
                    </div>
                    <div className="ml-[8px]"> {item.type}</div>
                  </div>
                  <div className="row-data-date" span="8">
                    {item.date}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
});

export default Index;
