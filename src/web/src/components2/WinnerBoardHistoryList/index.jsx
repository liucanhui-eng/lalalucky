import "./index.scss";

import ListNoDataInfo from "../ListNoDataInfo";
import CAvatar from "../../componentp/CAvatar";

const Index = ({ dataList }) => {
  const formatString = (str) => {
    return str.length > 10 ? str.slice(0, 10) + "..." : str;
  };
  return (
    <>
      <div className="winner-board-history-list">
        <div className="list-play-box">
          {(!dataList || dataList.length <= 0) && <ListNoDataInfo />}
          {dataList &&
            dataList.length > 0 &&
            dataList.map((item, index) => {
              return (
                <div className="row-data" key={index}>
                  <div className="row-data-img flx">
                    <span className=" flx">
                      <CAvatar avatar={item.avatar} size="small" />
                    </span>
                    <span className="row-data-name ml-[10px]">
                      {formatString(item.name)}
                    </span>
                  </div>
                  <div className="row-data-num ">{item.num}</div>
                  <div className="row-data-x  ">{item.info}</div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default Index;
