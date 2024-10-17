import "./index.scss";
import { Row, Col } from "@nutui/nutui-react";
import React, { useEffect, useState } from "react";

export default function Index(props) {
  const {dataList} = props; 

  return (
    <>
      <div className="list-win-h">

      <div className="type-box">
        <div className="type-item">NO.001</div>
        <div className="type-date">July. 2024</div>
      </div>
      <div className="h16"></div>
      <div className="title-box">
        <div className="title">Win number</div>
        
      </div>

      <div className="num-box"> 
          {dataList.map((item, index) => {
            return (
              <div key={index} className="num-box-item">
                <div className="num-box-item-title">{item.title}</div>
                <div className="num-box-item-info">{item.info}</div>
              </div>
            );
          })} 
      </div>


        {/* <Row className="row-title">
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
        {dataList.map((item, index) => {
          return (
            <div key={index}>
              <Row key={index} className="row-data">
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
        })} */}
      </div>
    </>
  );
}
