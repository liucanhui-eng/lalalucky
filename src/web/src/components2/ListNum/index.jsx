import "./index.scss";
import { Row, Col } from "@nutui/nutui-react";
import React, { useEffect, useState } from "react";
import { Space, Button, Skeleton } from "@nutui/nutui-react";
import { product as ProjectL_backend} from "declarations/product";
export default function Index(props) {
  const { dataList } = props; 



  const CardBox = (props) => {
    const { dataType } = props;
    const titleClass = classNames({
      'card-box': true
    });
    return (
      <div className={titleClass}>
        <div></div>
        <div></div>
        <div></div>
      </div>
    );
  };


  return (
    <>
      <div className="list-num">
        <CardBox />
        <CardBox />
        <CardBox />
      </div>
    </>
  );
}
