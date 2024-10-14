import "./index.scss";
import React, { useEffect, useState, useRef } from "react";

import WinNumBox from "../WinNumBox";
import CBoxB from "../../componentp/CBoxB";

import { Overlay } from "@nutui/nutui-react";
export default function Index({ level, ticketNo, pageData }) { 
  const [itemType, setItemType] = useState(0); 
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

  useEffect(() => {}, []);

  const handleWinNumBoxClick = (item) => {
    console.log("========item", item);
    setItemType(item);
  };

  const onClose = () => {
    setItemType(0)
  }

  return (
    <div className="win-num-board">
      <div className="win-num-board-row">
        <WinNumBox
          key={`win-num-box-win1`}
          data={pageData.win1} 
          isActive={level == "1"}
          isUp={itemType == 1}
          handleClick={() => {
            handleWinNumBoxClick(1);
          }}
        />
        <div className="ml-[2px]"></div>
        <WinNumBox
          key={`win-num-box-win2`}
          data={pageData.win2} 
          isActive={level == "2"}
          isUp={itemType == 2}
          handleClick={() => {
            handleWinNumBoxClick(2);
          }}
        />
      </div>
      <div className="win-num-board-row  ">
        {itemType == 1 && (
          <div className="win-num-board-poprow">
            <div className="win-num-board-poprow-box">
              <CBoxB>
                <div className="win-num-board-num-box">
                  {pageData &&
                    pageData.win1 &&
                    pageData.win1.data &&
                    pageData.win1.data.length > 0 &&
                    pageData.win1.data.map((item, index) => {
                      return (
                        <div
                          key={`win-num-board-num-${index}`}
                          className={`win-num-board-num ${ticketNo==item?'win-num-board-num-a':'win-num-board-num-b'} `} 
                        >
                          {item}
                        </div>
                      );
                    })}
                </div>
              </CBoxB>
            </div>
          </div>
        )}
        {itemType == 2 && (
          <div className="win-num-board-poprow">
            <div className="win-num-board-poprow-box">
              <CBoxB>
                <div className="win-num-board-num-box">
                  {pageData &&
                    pageData.win2 &&
                    pageData.win2.data &&
                    pageData.win2.data.length > 0 &&
                    pageData.win2.data.map((item, index) => {
                      return (
                        <div
                          key={`win-num-board-num-${index}`}
                          className={`win-num-board-num ${ticketNo==item?'win-num-board-num-a':'win-num-board-num-b'} `} 
                        >
                          {item}
                        </div>
                      );
                    })}
                </div>
              </CBoxB>
            </div>
          </div>
        )}
      </div>
      <div className="win-num-board-row mt-[4px]">
        <WinNumBox
          key={`win-num-box-win3`}
          data={pageData.win3} 
          isActive={level == "3"}
          isUp={itemType == 3}
          handleClick={() => {
            handleWinNumBoxClick(3);
          }}
        />
        <div className="ml-[4px]"></div>
        <WinNumBox
          key={`win-num-box-win4`}
          data={pageData.win4}
          isActive={level == "4"}
          isUp={itemType == 4}
          handleClick={() => {
            handleWinNumBoxClick(4);
          }}
        />
        <div className="ml-[2px]"></div>
        <WinNumBox
          key={`win-num-box-win5`}
          data={pageData.win5}
          isActive={level == "5"}
          isUp={itemType == 5}
          handleClick={() => {
            handleWinNumBoxClick(5);
          }}
        />
        <div className="ml-[4px]"></div>
        <WinNumBox
          key={`win-num-box-win6`}
          data={pageData.win6}
          isActive={level == "6"}
          isUp={itemType == 6}
          handleClick={() => {
            handleWinNumBoxClick(6);
          }}
        />
      </div>
      <div className="win-num-board-row  ">
        {itemType == 3 && (
          <div className="win-num-board-poprow">
            <div className="win-num-board-poprow-box">
              <CBoxB>
                <div className="win-num-board-num-box">
                  {pageData &&
                    pageData.win3 &&
                    pageData.win3.data &&
                    pageData.win3.data.length > 0 &&
                    pageData.win3.data.map((item, index) => {
                      return (
                        <div
                          key={`win-num-board-num-${index}`}
                          className={`win-num-board-num ${ticketNo==item?'win-num-board-num-a':'win-num-board-num-b'} `} 
                        >
                          {item}
                        </div>
                      );
                    })}
                </div>
              </CBoxB>
            </div>
          </div>
        )}
        {itemType == 4 && (
          <div className="win-num-board-poprow">
            <div className="win-num-board-poprow-box">
              <CBoxB>
                <div className="win-num-board-num-box">
                  {pageData &&
                    pageData.win4 &&
                    pageData.win4.data &&
                    pageData.win4.data.length > 0 &&
                    pageData.win4.data.map((item, index) => {
                      return (
                        <div
                          key={`win-num-board-num-${index}`}
                          className={`win-num-board-num ${ticketNo==item?'win-num-board-num-a':'win-num-board-num-b'} `} 
                        >
                          {item}
                        </div>
                      );
                    })}
                </div>
              </CBoxB>
            </div>
          </div>
        )}
        {itemType == 5 && (
          <div className="win-num-board-poprow">
            <div className="win-num-board-poprow-box">
              <CBoxB>
                <div className="win-num-board-num-box">
                  {pageData &&
                    pageData.win5 &&
                    pageData.win5.data &&
                    pageData.win5.data.length > 0 &&
                    pageData.win5.data.map((item, index) => {
                      return (
                        <div
                          key={`win-num-board-num-${index}`}
                          className={`win-num-board-num ${ticketNo==item?'win-num-board-num-a':'win-num-board-num-b'} `} 
                        >
                          {item}
                        </div>
                      );
                    })}
                </div>
              </CBoxB>
            </div>
          </div>
        )}
        {itemType == 6 && (
          <div className="win-num-board-poprow">
            <div className="win-num-board-poprow-box">
              <CBoxB>
                <div className="win-num-board-num-box">
                  {pageData &&
                    pageData.win6 &&
                    pageData.win6.data &&
                    pageData.win6.data.length > 0 &&
                    pageData.win6.data.map((item, index) => {
                      return (
                        <div
                          key={`win-num-board-num-${index}`}
                          className={`win-num-board-num ${ticketNo==item?'win-num-board-num-a':'win-num-board-num-b'} `} 
                        >
                          {item}
                        </div>
                      );
                    })}
                </div>
              </CBoxB>
            </div>
          </div>
        )}
      </div>

      <Overlay visible={itemType!=0} 
        onClick={onClose}  />
    </div>
  );
}
