import "./index.scss";
import React, { useEffect, useState } from "react";
import { Tabs, Overlay, Loading } from "@nutui/nutui-react";

import MoneyCard from "../../components2/MoneyCard";
import MoneyDeposit from "../../components2/MoneyDeposit";
import MoneyWithdraw from "../../components2/MoneyWithdraw";
import MoneyRecord from "../../components2/MoneyRecord";
import MoneyRecordList from "../../components2/MoneyRecordList";
import UserInfo from '../../componentp/UserInfo';

import { useUser } from "../../componentp/UserProvider";
import { isIIAuthenticated, getUserInfo } from "../../common/ic-client";
import { useDepositManager } from "../../common/ic-client/deposit";


import { product as ProjectL_backend } from "declarations/product";
export default function Index() {
  const [isLoading, setIsLoading] = useState(false);
  const [tabvalue, setTabvalue] = useState("0");
  const [moneyCardData, setMoneyCardData] = useState({ num: 0 });
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {  
  }, []); 


  return (
    <>
      <div className="w-full pb-[16px]">
        <UserInfo />
      </div>
      <div className="page-money-v2">
        <MoneyCard  />
        <div className="mt-[16px]"></div>
        <Tabs
          autoHeight
          className="tabs"
          value={tabvalue}
          onChange={(value) => {
            setTabvalue(value);
          }}
        >
          <Tabs.TabPane title="Deposit"> </Tabs.TabPane>
          <Tabs.TabPane title="Record"> </Tabs.TabPane>
          <Tabs.TabPane title="Withdraw"> </Tabs.TabPane>
        </Tabs>
        <div className="h16"></div>

        {tabvalue == "0" && <MoneyDeposit isLogin={isLogin} />}
        {tabvalue == "1" && <MoneyRecordList isLogin={isLogin} />}
        {tabvalue == "2" && <MoneyWithdraw  />}

      </div>
    </>
  );
}
