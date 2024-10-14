import "./index.scss";
import { Row, Col } from "@nutui/nutui-react";
import React, { useEffect, useState } from "react";

export default function Index() {
  const [dataList, setDataList] = useState([]);
  useEffect(() => {
    setDataList([
      {
        winnum: 888,
        mutiple: "100X",
        num: 1,
        probability: "0.10% / 0.10",
      },
      {
        winnum: 8889,
        mutiple: "100X",
        num: 1,
        probability: "0.10% / 0.10",
      },
      {
        winnum: 88899,
        mutiple: "100X",
        num: 1,
        probability: "0.10% / 0.10",
      },
      {
        winnum: 888999,
        mutiple: "100X",
        num: 1,
        probability: "0.10% / 0.10",
      },
    ]);
  }, []);

  return (
    <>
      <div className="list-win">
        <Row className="row-title">
          <Col className="row-data-num" span="8">
            Win number
          </Col>
          <Col className="row-data-muti" span="4">
            Mutiple
          </Col>
          <Col className="row-data-nu" span="4">
            Number
          </Col>
          <Col className="row-data-probability" span="8">
            Probability/Payout Ratio
          </Col>
        </Row>
        {dataList.map((item,index) => {
          return (
            <div key={index}>
              <Row   className="row-data">
                <Col className="row-data-num" span="8">
                  {item.winnum}
                </Col>
                <Col className="row-data-muti" span="4">
                  {item.mutiple}
                </Col>
                <Col className="row-data-nu" span="4">
                  {item.num}
                </Col>
                <Col className="row-data-probability" span="8">
                  {item.probability}
                </Col>
              </Row>
            </div>
          );
        })}
      </div>
    </>
  );
}
