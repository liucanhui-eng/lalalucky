import "./index.scss";
import React, { useEffect, useState, useRef } from "react";

import { Popover, Row, Col, Skeleton } from "@nutui/nutui-react";
import { TriangleDown, TriangleUp } from '@nutui/icons-react'

import imgAsk from "./assets/ask.svg";

import WinNumCard from '../WinNumCard'
import WinNumCardBottom from '../WinNumCardBottom'

import { product as ProjectL_backend} from "declarations/product";

export default function Index(props) {
  const {level} = props


  const [isLoading, setIsLoading] = useState(false);

  const [modalContent, setModalContent] = useState(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const buttonRefs = useRef([]);

  const handleButtonClick = (content, index) => {
    const buttonRect = buttonRefs.current[index].getBoundingClientRect();
    setModalPosition({
      top: buttonRect.top + window.scrollY - 10, // 10px gap above the button
      left: buttonRect.left + buttonRect.width / 2 // Center horizontally
    });
    setModalContent(content);
  };

  const handleClose = () => {
    setModalContent(null);
  };

  useEffect(() => {
    if (modalContent) {
      // Recalculate modal position on resize
      const handleResize = () => {
        const buttonRect = buttonRefs.current.find(ref => ref).getBoundingClientRect();
        setModalPosition({
          top: buttonRect.top + window.scrollY - 10, // Adjusted gap
          left: buttonRect.left + buttonRect.width / 2
        });
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [modalContent]);



  const getModalComponent = () => {
    switch (modalContent) {
      case 'content0':
        return <div className="num-box">
          {dataList0.map((item, index) => {
            return (
              <div key={index} className="num-box-item">
                <div className="num-box-item-title">{item.title}</div>
                <div className="num-box-item-info">{item.info}</div>
              </div>
            );
          })}
        </div>;
      case 'content1':
        return <div className="num-box">
          {dataList1.map((item, index) => {
            return (
              <div key={index} className="num-box-item">
                <div className="num-box-item-title">{item.title}</div>
                <div className="num-box-item-info">{item.info}</div>
              </div>
            );
          })}
        </div>;
      case 'content2':
        return <div className="num-box">
          {dataList2.map((item, index) => {
            return (
              <div key={index} className="num-box-item">
                <div className="num-box-item-title">{item.title}</div>
                <div className="num-box-item-info">{item.info}</div>
              </div>
            );
          })}
        </div>;
      case 'content3':
        return <div className="num-box">
          {dataList3.map((item, index) => {
            return (
              <div key={index} className="num-box-item">
                <div className="num-box-item-title">{item.title}</div>
                <div className="num-box-item-info">{item.info}</div>
              </div>
            );
          })}
        </div>;
      default:
        return null;
    }
  };



  const [pageData, setPageData] = useState({});
  const [dataList0, setDataList0] = useState([]);
  const [dataList1, setDataList1] = useState([]);
  const [dataList2, setDataList2] = useState([]);
  const [dataList3, setDataList3] = useState([]);



  useEffect(() => {
    getPageData();

  }, []);

  const getPageData = () => {
    setIsLoading(true);

    ProjectL_backend
      .show()
      .then(r3 => {
        const pageData = {};
        const dataList0 = [];
        const dataList1 = [];
        const dataList2 = [];
        const dataList3 = [];
        if (r3) {
          pageData.win1 = r3.win1;
          pageData.win2 = r3.win2;
          pageData.win3 = r3.win3;
          pageData.win4 = r3.win4;
          pageData.win5 = r3.win5;
          pageData.win6 = r3.win6;
          // dataList.push(...dealWin(r3.win1, "win1"));
          // dataList.push(...dealWin(r3.win2, "win2"));
          // dataList.push(...dealWin(r3.win3, "win3"));
          dataList0.push(...dealWin(r3.win3, "win3"));
          dataList1.push(...dealWin(r3.win4, "win4"));
          dataList2.push(...dealWin(r3.win5, "win5"));
          dataList3.push(...dealWin(r3.win6, "win6"));
        }
        setPageData(pageData);
        setDataList0(sortByField(dataList0, 'title'));
        setDataList1(sortByField(dataList1, 'title'));
        setDataList2(sortByField(dataList2, 'title'));
        setDataList3(sortByField(dataList3, 'title'));
        // console.log('dataList3',dataList3)
        // localStorage.setItem('winnumpagedata', JSON.stringify(pageData));

        // dataList.splice(50);
        // setDataList(dataList);
        // setData(r3);
        // localStorage.setItem('winnumdata', JSON.stringify(r3))
        // localStorage.setItem('winnumdatalist', JSON.stringify(dataList))
      })
      .catch((err) => {
        console.log("异常~", err);
      })
      .finally(() => {
        setIsLoading(false);
      });

  };

  function sortByField(arr, field, ascending = true) {
    return arr.sort((a, b) => {
      if (a[field] < b[field]) {
        return ascending ? -1 : 1;
      }
      if (a[field] > b[field]) {
        return ascending ? 1 : -1;
      }
      return 0;
    });
  }
  
  const dealWin = (win, wintype) => {
    if (win && win.length > 0) {
      return win.map((item) => {
        let itemNew = {};
        itemNew.title = String(item);
        if (wintype == "win1") {
          itemNew.info = "100X";
        }
        if (wintype == "win2") {
          itemNew.info = "50X";
        }
        if (wintype == "win3") {
          itemNew.info = "20X";
        }
        if (wintype == "win4") {
          itemNew.info = "10X";
        }
        if (wintype == "win5") {
          itemNew.info = "5X";
        }
        if (wintype == "win6") {
          itemNew.info = "2X";
        }
        return itemNew;
      });
    } else {
      return [];
    }
  };



  return (
    <div className="play-win-num">
      <div className="title-box">
        <div className="title">Win number</div>
        <div className="tips">
          {/* <div> Chance</div>
          <div className="tips-icon">
            <img
              width="18"
              height="18"
              src={imgAsk}
              onClick={() => {
                console.log("click image");
              }}
            />
          </div> */}
        </div>
      </div>
      <div className="win-num-card-box">

        <div className="win-num-card-row">
          <WinNumCard isActive={level == '1'} data={{ tips: pageData.win1?.length, num: 100, bottom: pageData.win1 }} />
          <div className="w8"></div>
          <WinNumCard isActive={level == '2'}  data={{ tips: pageData.win2?.length, num: 50, bottom: pageData.win2 }} />
        </div>
        <div className="win-num-card-row">
          <WinNumCard isActive={level == '3'} data={{ tips: pageData.win3?.length, num: 20 }} />
          <div className="w8"></div>
          <WinNumCard isActive={level == '4'} data={{ tips: pageData.win4?.length, num: 10 }} />
          <div className="w8"></div>
          <WinNumCard isActive={level == '5'} data={{ tips: pageData.win5?.length, num: 5 }} />
          <div className="w8"></div>
          <WinNumCard isActive={level == '6'} data={{ tips: pageData.win6?.length, num: 2 }} />
        </div>
        <div className="win-num-card-row">
          <div onClick={() => handleButtonClick('content0', 0)}
            ref={el => buttonRefs.current[0] = el} className="win-num-card-bottom">
            <TriangleDown />
          </div>
          <div className="w8"></div>
          <div onClick={() => handleButtonClick('content1', 0)}
            ref={el => buttonRefs.current[0] = el} className="win-num-card-bottom">
            <TriangleDown />
          </div>
          <div className="w8"></div>
          <div onClick={() => handleButtonClick('content2', 1)}
            ref={el => buttonRefs.current[1] = el} className="win-num-card-bottom">
            <TriangleDown />
          </div>
          <div className="w8"></div>
          <div onClick={() => handleButtonClick('content3', 2)}
            ref={el => buttonRefs.current[2] = el} className="win-num-card-bottom">
            <TriangleDown />
          </div>
        </div>


        {/* <Row className="row-data">
          <Col className="row-data-left" span="12">
            <WinNumCard data={{ tips: pageData.win1?.length, num: 100, bottom: pageData.win1 }} />
          </Col>
          <Col className="row-data-right" span="12">
            <WinNumCard data={{ tips: pageData.win2?.length, num: 50, bottom: pageData.win2 }} />
          </Col>
        </Row>
        <Row className="row-data-1">
          <Col className="row-data-date" span="6">
            <WinNumCard data={{ tips: pageData.win3?.length, num: 20 }} />
          </Col>
          <Col className="row-data-name" span="6">
            <WinNumCard data={{ tips: pageData.win4?.length, num: 10 }} />
          </Col>
          <Col className="row-data-type" span="6">
            <WinNumCard data={{ tips: pageData.win5?.length, num: 5 }} />
          </Col>
          <Col className="row-data-date" span="6">
            <WinNumCard data={{ tips: pageData.win6?.length, num: 2 }} />
          </Col>
        </Row>
        <Row className="row-data-2">
          <Col className="row-data-name" span="6">
            <div onClick={() => handleButtonClick('content0', 0)}
              ref={el => buttonRefs.current[0] = el} className="win-num-card-bottom">
              <TriangleDown />
            </div>
          </Col>
          <Col className="row-data-name" span="6">
            <div onClick={() => handleButtonClick('content1', 0)}
              ref={el => buttonRefs.current[0] = el} className="win-num-card-bottom">
              <TriangleDown />
            </div>
          </Col>
          <Col className="row-data-name" span="6">

            <div onClick={() => handleButtonClick('content2', 1)}
              ref={el => buttonRefs.current[1] = el} className="win-num-card-bottom">
              <TriangleDown />
            </div>
          </Col>
          <Col className="row-data-name" span="6">
            <div onClick={() => handleButtonClick('content3', 2)}
              ref={el => buttonRefs.current[2] = el} className="win-num-card-bottom">
              <TriangleDown />
            </div>
          </Col>
        </Row> */}

        {/* <Row className="row-data-2">
          <Col className="row-data-name" span="8">
            <Popover
              visible={customized1}
              onClick={() => {
                customized1 ? setCustomized1(false) : setCustomized1(true)
              }}
              location="bottom-start"
              className="customClass"
            >
              <WinNumCardBottom isUp={isUp1} />
              {customized1 && (
                <div className="num-box" >
                  {dataList1.map((item, index) => {
                    return (
                      <div key={index} className="num-box-item">
                        <div className="num-box-item-title">{item.title}</div>
                        <div className="num-box-item-info">{item.info}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Popover>
          </Col>
          <Col className="row-data-type" span="8">
            <Popover
              visible={customized2}
              onClick={() => {
                customized2 ? setCustomized2(false) : setCustomized2(true)
              }}
              location="bottom"
              className="customClass"
            >

              <WinNumCardBottom isUp={isUp2} />
              {customized2 && (

                <div className="num-box">
                  {dataList2.map((item, index) => {
                    return (
                      <div key={index} className="num-box-item">
                        <div className="num-box-item-title">{item.title}</div>
                        <div className="num-box-item-info">{item.info}</div>
                      </div>
                    );
                  })}
                </div>

              )}
            </Popover>
          </Col>
          <Col className="row-data-date" span="8">

            <Popover
              visible={customized3}
              onClick={() => {
                customized3 ? setCustomized3(false) : setCustomized3(true)
              }}
              location="bottom-end"
              className="customClass"
            >
              <WinNumCardBottom isUp={isUp3} />
              {customized3 && (
                <div className="num-box">
                  {dataList3.map((item, index) => {
                    return (
                      <div key={index} className="num-box-item">
                        <div className="num-box-item-title">{item.title}</div>
                        <div className="num-box-item-info">{item.info}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Popover>
          </Col>
        </Row> */}
      </div>
      {/* <div className="flex space-x-4 mb-4">
        <button
          onClick={() => handleButtonClick('content1', 0)}
          ref={el => buttonRefs.current[0] = el}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Button 1
        </button>
        <button
          onClick={() => handleButtonClick('content2', 1)}
          ref={el => buttonRefs.current[1] = el}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
        >
          Button 2
        </button>
        <button
          onClick={() => handleButtonClick('content3', 2)}
          ref={el => buttonRefs.current[2] = el}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
        >
          Button 3
        </button>
      </div> */}
      {/* <div className="num-box">
        <Skeleton rows={3} visible={!isLoading}>
          {dataList.map((item, index) => {
            return (
              <div key={index} className="num-box-item">
                <div className="num-box-item-title">{item.title}</div>
                <div className="num-box-item-info">{item.info}</div>
              </div>
            );
          })}
        </Skeleton>
      </div> */}
      {modalContent && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ top: 0, left: 0 }}
        >
          <div className="fixed inset-0 bg-black opacity-50" onClick={handleClose}></div>
          <div
            className="absolute "
            style={{ left: '50%', transform: 'translateX(-50%)' }}
          >
            {getModalComponent()}

          </div>
        </div>
      )}
    </div>
  );
}
