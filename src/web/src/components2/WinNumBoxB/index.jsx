import "./index.scss";

export default function Index({ isActive, data ,btype=1}) {  
  const { tips, title, info } = data;
  return (
    <>
      <div  className={`win-num-box-b relative w-full shadow-md ${!isActive ? 'win-num-box-b-n' : 'win-num-box-b-a'}`}  >
        {/* 四个角的元素 */}
        <div className="absolute top-0 left-0 w-1 h-1 bg-[#000]"></div>
        <div className="absolute top-0 right-0 w-1 h-1 bg-[#000]"></div>
        <div className="absolute bottom-0 left-0 w-1 h-1 bg-[#000]"></div>
        <div className="absolute bottom-0 right-0 w-1 h-1 bg-[#000]"></div>
        <div className="absolute top-[14px] h-[14px] w-11/12   bg-[#C2C3C7]"></div>
        <div className="win-num-box-b-content">
          <div className="win-num-box-b-content-top">
            {tips}
          </div>
          <div className="win-num-box-b-content-center">
            {title}
          </div>
          <div  className={` ${btype==1 ? 'win-num-box-b-content-bottom' : 'win-num-box-b-content-bottom1'}`}   >
            {info}
          </div>
        </div>
      </div>
    </>
  );
}
