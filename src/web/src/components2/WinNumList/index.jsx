import "./index.scss";
import React, { useEffect, useState, useRef } from "react";

import WinNumBoxB from "../WinNumBoxB";
import WinNumBoxS from "../WinNumBoxS";
import WinNumBoxSB from "../WinNumBoxSB";
import WinNumTipBox from "../WinNumTipBox";

import { product as ProjectL_backend } from "declarations/product";

export default function Index({ level, data }) {
  const [pageData, setPageData] = useState({
    win1s:  "",  
    win2s:"",  
    win1: "",  
    win2: "",  
    win3:"",  
    win4: "",  
    win5:"",  
    win6:"",  
  });
  const [dataList0, setDataList0] = useState([]);
  const [dataList1, setDataList1] = useState([]);
  const [dataList2, setDataList2] = useState([]);
  const [dataList3, setDataList3] = useState([]);

  // -----------
  const [isVisible, setIsVisible] = useState(false);
  const [itemType, setItemType] = useState(0);
  const [dataListTip, setDataListTip] = useState([]);
  const layerRef = useRef(null);

  const handleClickOutside = (event) => {
    // 如果点击的区域不在层内，隐藏层
    if (layerRef.current && !layerRef.current.contains(event.target)) {
      setIsVisible(false);
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

  const handleBottonClick = (itemType) => {
    setItemType(itemType);
    setIsVisible(true);
    if (itemType == 3) {
      setDataListTip(dataList0);
    }
    if (itemType == 4) {
      setDataListTip(dataList1);
    }
    if (itemType == 5) {
      setDataListTip(dataList2);
    }
    if (itemType == 6) {
      console.log("======================dataList3", dataList3);
      setDataListTip(dataList3);
    }
  };
  // ----------- end

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

      const pageData = {
        win1s: data.win1?.[0] ? String(data.win1[0]) : "", // 处理win1[0]为空的情况
        win2s: data.win2?.[0] ? `${data.win2[0]} | ${data.win2[1] || ""}` : "", // 处理win2[0]和win2[1]为空的情况
        win1: data.win1,
        win2: data.win2,
        win3: data.win3,
        win4: data.win4,
        win5: data.win5,
        win6: data.win6,
      };

      const winKeys = ["win3", "win4", "win5", "win6"];
      const dataLists = winKeys.map((key) =>
        sortByField(dealWin(data[key], key), "title")
      );

      setPageData(pageData);

      // 动态设置DataList，避免重复代码
      [setDataList0, setDataList1, setDataList2, setDataList3].forEach(
        (setter, index) => {
          setter(dataLists[index]);
        }
      );

      console.log(
        "%c[INFO] show: Processed data",
        "color: green; font-weight: bold",
        pageData
      );
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

  // 使用localeCompare替代直接比较，更加健壮
  const sortByField = (arr, field, ascending = true) => {
    return arr.sort((a, b) =>
      ascending
        ? a[field].localeCompare(b[field])
        : b[field].localeCompare(a[field])
    );
  };

  const dealWin = (win, wintype) => {
    if (!win || win.length === 0) return [];

    const infoMap = {
      win1: "100X",
      win2: "50X",
      win3: "20X",
      win4: "10X",
      win5: "5X",
      win6: "2X",
    };

    return win.map((item) => ({
      title: String(item),
      info: infoMap[wintype] || "", // 如果wintype不在infoMap中，默认显示""
    }));
  };
 
  return (
    <div className="win-num-list-v2">
      <div className="win-num-card-box">
        <div className="win-num-card-row">
          <WinNumBoxB
            isActive={level == "1"}
            data={{
              tips: pageData.win1?.length + " slot",
              title: "100X",
              info: pageData.win1s,
            }}
          />
          <div className="w8"></div>
          <WinNumBoxB
            btype={2}
            isActive={level == "2"}
            data={{
              tips: pageData.win2?.length + " slots",
              title: "50X",
              info: pageData.win2s,
            }}
          />
        </div>
        <div className="win-num-card-row mt-[4px]">
          <WinNumBoxS
            isActive={level == "3"}
            data={{ tips: pageData.win3?.length + " slots", num: "20X" }}
          />
          <div className="w8"></div>
          <WinNumBoxS
            isActive={level == "4"}
            data={{ tips: pageData.win4?.length + " slots", num: "10X" }}
          />
          <div className="w8"></div>
          <WinNumBoxS
            isActive={level == "5"}
            data={{ tips: pageData.win5?.length + " slots", num: "5X" }}
          />
          <div className="w8"></div>
          <WinNumBoxS
            isActive={level == "6"}
            data={{ tips: pageData.win6?.length + " slots", num: "2X" }}
          />
        </div>
        <div className="win-num-card-row mt-[-2px]">
          <div
            onClick={() => {
              handleBottonClick(3);
            }}
            className="win-num-card-bottom"
          >
            <WinNumBoxSB isUp={itemType == 3} />
          </div>
          <div className="w8"></div>
          <div
            onClick={() => {
              handleBottonClick(4);
            }}
            className="win-num-card-bottom"
          >
            <WinNumBoxSB isUp={itemType == 4} />
          </div>
          <div className="w8"></div>
          <div
            onClick={() => {
              handleBottonClick(5);
            }}
            className="win-num-card-bottom"
          >
            <WinNumBoxSB isUp={itemType == 5} />
          </div>
          <div className="w8"></div>
          <div
            onClick={() => {
              handleBottonClick(6);
            }}
            className="win-num-card-bottom"
          >
            <WinNumBoxSB isUp={itemType == 6} />
          </div>
        </div>
      </div>
      <div className="win-num-card-bottom-tips-box">
        {isVisible && dataListTip && dataListTip.length > 0 && (
          <div ref={layerRef} className="win-num-card-bottom-tips"> 
            <div  className="num-box-con">
              {dataListTip.map((item, index) => {
                return (
                  <div
                    key={index}
                    className={`num-box-item ${
                      data && data.ticketno && data.ticketno == item.title
                        ? "num-box-item-b"
                        : "num-box-item-a"
                    }`}
                  >
                    <div className="num-box-item-title">{item.title}</div>
                  </div>
                );
              })}
            </div>
            {/* <WinNumTipBox
              content={
                <div className="num-box-con">
                  {dataListTip.map((item, index) => {
                    return (
                      <div key={index} className={`num-box-item ${data&& data.ticketno && data.ticketno== item?'num-box-item-b':'num-box-item-a'}`}  >
                        <div className="num-box-item-title">{item.title}</div>
                      </div>
                    );
                  })}
                </div>
              }
            /> */}
          </div>
        )}
      </div>
    </div>
  );
}
