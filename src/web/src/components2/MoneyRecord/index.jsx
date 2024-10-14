import "./index.scss";
import { Row, Col, Divider, Space, Skeleton, Toast } from "@nutui/nutui-react";
import React, { useEffect, useState } from "react";

import { product as ProjectL_backend} from "declarations/product";
export default function Index() {
  const [isLoading, setIsLoading] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [num1Count, setNum1Count] = useState(0);
  const [num2Count, setNum2Count] = useState(0);
  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    const userInfo = localStorage.getItem("userInfo");
    console.log("record show_user  userInfo", userInfo);
    const userInfoObj = JSON.parse(userInfo);

    if (!userInfoObj || !userInfoObj.userCount || !userInfoObj.userName) {
      // Toast.show("未登录~");
      console.log('show_user login')
      return;
    }
    setIsLoading(true);
    ProjectL_backend.show_user(
      userInfoObj.userCount,
      userInfoObj.userName
    ).then((info) => {
      console.log("show_user info:::::", info);
      // const data = JSON.parse(info);
      let dataList = [];
      let num1Count = 0;
      let num2Count = 0;
      if (info && info.length > 0) {
        const ledgers = info[0].ledgers;

        ledgers.map(item => {
          let itemNew = {};
          itemNew.name = Object.keys(item.event)[0];
          if (Number(item.amount) > 0) {
            let num1 = Number(item.amount) / 100000000;
            num1Count += num1;
            itemNew.num1 = num1;
          } else {
            let num2 = Number(item.amount) / 100000000;
            num2Count += num2;
            itemNew.num2 = num2;
          }
          itemNew.date = formatPast(ctime(Number(item.time)));
          dataList.push(itemNew)
        })

      }
      setDataList(dataList);
      setNum1Count(num1Count);
      setNum2Count(num2Count);

    }).catch((err) => {
      console.log("异常~", err);
    })
      .finally(() => {
        setIsLoading(false);
      });
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

  const formatPast = (date, type = "default", zeroFillFlag = true) => {
    // 定义countTime变量，用于存储计算后的数据
    let countTime;
    // 获取当前时间戳
    let time = new Date().getTime();
    // 转换传入参数为时间戳
    let afferentTime = new Date(date).getTime();
    // 当前时间戳 - 传入时间戳
    time = Number.parseInt(`${time - afferentTime}`);
    if (time < 10000) {
      // 10秒内
      return "JUST NOW";
    } else if (time < 60000) {
      // 超过10秒少于1分钟内
      countTime = Math.floor(time / 1000);
      return `${countTime}s ago`;
    } else if (time < 3600000) {
      // 超过1分钟少于1小时
      countTime = Math.floor(time / 60000);
      return `${countTime}min ago`;
    } else if (time < 86400000) {
      // 超过1小时少于24小时
      countTime = Math.floor(time / 3600000);
      return `${countTime}h ago`;
    } 
    else if (time >= 86400000 && type == "default") {
      // 超过二十四小时（一天）且格式参数为默认"default"
      countTime = Math.floor(time / 86400000);
      //大于等于365天
      if (countTime >= 365) {
        return `${Math.floor(countTime / 365)}year ago`;
      }
      //大于等于30天
      if (countTime >= 30) {
        return `${Math.floor(countTime / 30)}month ago`;
      }
      return `${countTime}day ago`;
    } 
    else {
      // 一天（24小时）以上且格式不为"default"则按传入格式参数显示不同格式
      // 数字补零
      let Y = new Date(date).getFullYear();
      let M = new Date(date).getMonth() + 1;
      let zeroFillM = M > 9 ? M : "0" + M;
      let D = new Date(date).getDate();
      let zeroFillD = D > 9 ? D : "0" + D;
      // 传入格式为"-" "/" "."
      if (type == "-" || type == "/" || type == ".") {
        return zeroFillFlag
          ? Y + type + zeroFillM + type + zeroFillD
          : Y + type + M + type + D;
      }
      // 传入格式为"年月日"
      if (type == "年月日") {
        return zeroFillFlag
          ? Y + type[0] + zeroFillM + type[1] + zeroFillD + type[2]
          : Y + type[0] + M + type[1] + D + type[2];
      }
      // 传入格式为"月日"
      if (type == "月日") {
        return zeroFillFlag
          ? zeroFillM + type[0] + zeroFillD + type[1]
          : M + type[0] + D + type[1]
      }
      // 传入格式为"年"
      if (type == "年") {
        return Y + type
      }

    }
  };


  return (
    <>
      <div className="money-record">
        <Skeleton title animated rows={3} visible={!isLoading}>
          <Row className="row-title-t">
            <Col className="row-data-name" span="6">
              Total
            </Col>
            <Col className="row-data-muti" span="7">
              +{num1Count}  ICP
            </Col>
            <Col className="row-data-nu" span="7">
              {num2Count}  ICP
            </Col>
            <Col className="row-data-date" span="4">

            </Col>
          </Row>
          <Row className="row-title">
            <Col className="row-data-name" span="6">
              ACTION
            </Col>
            <Col className="row-data-muti" span="6">
              IN
            </Col>
            <Col className="row-data-nu" span="6">
              OUT
            </Col>
            <Col className="row-data-date" span="6">
              TIME
            </Col>
          </Row>
          <Divider ></Divider>
          <div className="row-data-box">
            {dataList && dataList.length > 0 && dataList.map((item, index) => {
              return (
                <div key={index}>
                  <Row className="row-data">
                    <Col className="row-data-name" span="6">
                      <Space>{item.name}</Space>
                    </Col>
                    <Col className="row-data-num1" span="6">

                      <Space> {item.num1 && <span>+{item.num1}</span>}</Space>
                    </Col>
                    <Col className="row-data-num2" span="6">
                      <Space> {item.num2 && <span>{item.num2}</span>}</Space>
                    </Col>
                    <Col className="row-data-date" span="6">
                      {item.date}
                    </Col>
                  </Row>
                </div>
              );
            })}
          </div>
        </Skeleton>
      </div>
    </>
  );
}
