import "./index.scss";
import iconUp from "./assets/up.svg";
import iconDown from "./assets/down.svg";

export default function Index(props) {
  const { title, isUp, handleClick } = props;
  return (
    <>
      <div
        onClick={handleClick}
        className="com-card-box relative w-full     shadow-md   "
      > 
        <div className="absolute top-0 left-0 w-1 h-1 bg-[#000]"></div>
        <div className="absolute top-0 right-0 w-1 h-1 bg-[#000]"></div>
        <div className="absolute bottom-0 left-0 w-1 h-1 bg-[#000]"></div>
        <div className="absolute bottom-0 right-0 w-1 h-1 bg-[#000]"></div>

        <div className="com-card-box-title font-bold text-gray-800">
          <div className="com-card-box-title-content"> {title}</div>
        </div>
        <div className="bottom w-full  ">
          {isUp && <img width="14" height="10" src={iconUp} />}
          {!isUp && <img width="14" height="10" src={iconDown} />}
        </div>
      </div>
    </>
  );
}
