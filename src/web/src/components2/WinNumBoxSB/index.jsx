import "./index.scss";
import iconUp from "./assets/up.svg";
import iconDown from "./assets/down.svg";

export default function Index(props) {
  const { isUp } = props; 
  return (
    <>
      <div  className="win-num-box-sb relative w-full     shadow-md   ">
        {/* 四个角的元素 */}
    
        <div className="absolute bottom-0 left-0 w-1 h-1 bg-[#000]"></div>
        <div className="absolute bottom-0 right-0 w-1 h-1 bg-[#000]"></div>
        {/* <div className="absolute top-[16px] h-[14px] w-11/12  left-1/2 transform -translate-x-1/2 -translate-y-1/2  bg-[#C2C3C7]"></div>
  */}
        <div className="bottom w-full  ">
          {isUp && <img width="14" height="10" src={iconUp} />}
          {!isUp && <img width="14" height="10" src={iconDown} />}
        </div>
      </div>
    </>
  );
}
