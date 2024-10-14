import "./index.scss";
import React, { useEffect } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { Toast } from "@nutui/nutui-react";
import TitleV2 from "../../components2/TitleV2";
import { useNavigate } from "react-router-dom";

import imgTabbox from "./assets/tabbox.svg";
import iconMoney from "./assets/iconMoney.svg";
import iconPlay from "./assets/iconPlay.svg";
import iconHistory from "./assets/iconHistory.svg";

import { UserProvider } from "../../componentp/UserProvider";
import IILoginEntry from "../../componentp/IILoginEntry";

const TabSwitchPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 添加背景色
    document.body.style.backgroundColor = "#C2C3C7";

    // 清除样式，防止内存泄漏
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  const handleTabClick = (e) => {
    e.preventDefault(); // 阻止默认点击行为
    Toast.show({
      content: `Win History will be provided until the first batch is completed`,
      wordBreak: "break-word",
    });
  };

  return (
    <UserProvider>
      <div className="tab-switch-page-v2 bg-[#C2C3C7] flex flex-col h-screen w-full">
        <div className="tab-switch-page-v2-content flex-grow overflow-y-auto">
          <div className="container">
            <TitleV2 />
            <div className="h-[16px]"></div>
            <Outlet />
            <div className="h-[100px]"></div>
          </div>
        </div>

        <IILoginEntry />
        <div className="tab-switch-page-v2-bottom flex justify-center  items-center fixed bottom-[0] left-0 right-0">
          <div
            className="container mx-auto"
            style={{
              backgroundImage: `url("${imgTabbox}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              width: "320px",
              height: "64px",
            }}
          >
            <NavLink
              to="/v2/money"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link noactive"
              }
            >
              <div>
                <img
                  width="28"
                  height="28"
                  src={iconMoney}
                  onClick={() => {}}
                />
              </div>
              <div className="label">Money</div>
            </NavLink>
            <NavLink
              to="/v2/play"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link noactive"
              }
            >
              <div>
                <img width="28" height="28" src={iconPlay} onClick={() => {}} />
              </div>
              <div className="label">Play</div>
            </NavLink>
            <NavLink
              to="/v2/history"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link noactive"
              }
            >
              <div>
                <img
                  width="28"
                  height="28"
                  src={iconHistory}
                  onClick={() => {}}
                />
              </div>
              <div className="label">History</div>
            </NavLink>
            {/* <NavLink
              to="/v2/history"
              className={({ isActive }) =>
                isActive
                  ? "nav-link active disabled"
                  : "nav-link noactive disabled"
              }
              onClick={handleTabClick}
            >
              <div>
                <img
                  width="28"
                  height="28"
                  src={iconHistory}
                  onClick={() => {}}
                />
              </div>
              <div className="label">History</div>
            </NavLink> */}
          </div>
          <div className="h-[8px]"></div>
        </div>
      </div>
    </UserProvider>
  );
};

export default TabSwitchPage;
