import "./index.scss";

import iconUp from "./assets/up.svg";
import iconDown from "./assets/down.svg";
export default function Index({ isActive,data, handleClick, isUp }) {
   
  return (
    <div className="win-num-box-container" onClick={handleClick}>
      <div
        className={`win-num-box  relative w-full shadow-md ${
          !isActive ? "win-num-box-n" : "win-num-box-a"
        }`}
      >
        {/* 背景条 */}
        <div className="absolute top-[14px] h-[14px] w-11/12   bg-[#C2C3C7]"></div>
        {/* 四个角的元素 */}
        <div className="absolute top-0 left-0 w-1 h-1 bg-[#000]"></div>
        <div className="absolute top-0 right-0 w-1 h-1 bg-[#000]"></div>
        <div className="absolute bottom-0 left-0 w-1 h-1 bg-[#000]"></div>
        <div className="absolute bottom-0 right-0 w-1 h-1 bg-[#000]"></div>

        <div className="win-num-box-content">
          <div className="win-num-box-content-top">{data&&data.tips}</div>
          <div className="win-num-box-content-center">{data&&data.title}</div>
        </div>
        <div className="win-num-box-bottom">
          {isUp && <img width="14" height="10" src={iconUp} />}
          {!isUp && <img width="14" height="10" src={iconDown} />}
        </div>
      </div>
    </div>
  );
}
