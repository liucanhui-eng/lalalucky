import "./index.scss";
import React, { useEffect } from "react";

import iconBack from "./assets/iconBack.svg";
import iconCopy from "./assets/iconCopy.svg";

import { useNavigate, Link } from "react-router-dom";

import { Toast } from "@nutui/nutui-react";

import copy from "copy-to-clipboard";

import CollapsibleList from "../../componentp/CollapsibleList";

const InfoPage = () => {
  const navigate = useNavigate();

  const email = "Support@luckylottery.fun";
  const subject = "";
  const body = "";

  // 构造 mailto 链接
  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;

  useEffect(() => {
    // 添加背景色
    document.body.style.backgroundColor = "#C2C3C7";

    // 清除样式，防止内存泄漏
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  return (
    <div className="cpage-info-v1 bg-[#C2C3C7] min-h-screen w-full  sm:w-full md:w-[90%] lg:w-[80%] xl:w-[70%] 2xl:w-[60%]">
      <div className="header">
        <div
          className="left"
          onClick={() => {
            // navigate("/v2");
            navigate(-1); 
          }}
        >
          <span className="flex justify-center align-middle w-[20px] h-[20px] rounded-full bg-[#867AA0]">
            <img width="11" height="10" src={iconBack} />
          </span>
          <span className="lable ml-[4px]">BACK</span>
        </div>
        <div className="right">
          {/* <span className="lable">Contact Us：</span> */}
          <span className="value-box">
            <a href={mailtoLink} target="_blank" rel="noopener noreferrer">
              Support@luckylottery.fun
            </a>
          </span>
          <span>
            <img
              width="12"
              height="12"
              src={iconCopy}
              style={{ color: "#867AA0" }}
              onClick={() => {
                try {
                  copy("Support@luckylottery.fun");
                  Toast.show("Copied");
                } catch {
                  Toast.show("Copy fail");
                }
              }}
            />
          </span>
        </div>
      </div>
      <div className="titleall mt-[8px]">Lucky Lottery Whitepaper</div>
      <div className="content mt-[16px]">
        <CollapsibleList></CollapsibleList>
      </div>
      <div className="h-[96px]"></div>
    </div>
  );
};

export default InfoPage;
