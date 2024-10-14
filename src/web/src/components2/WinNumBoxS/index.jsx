import "./index.scss"; 

export default function Index(props) {
  const { isActive, data } = props;
  const { tips, num } = data;
  return (
    <>
      <div  className={`win-num-box-s relative w-full     shadow-md ${!isActive ? 'win-num-box-s-n' : 'win-num-box-s-a'}`} >
        <div className="absolute top-0 left-0 w-1 h-1 bg-[#000]"></div>
        <div className="absolute top-0 right-0 w-1 h-1 bg-[#000]"></div>

        {/* <div className="absolute top-[14px] h-[14px] w-11/12   bg-[#C2C3C7]"></div> */}
        <div className="absolute top-[20px] h-[14px] w-11/12 left-1/2 transform -translate-x-1/2 -translate-y-1/2   bg-[#C2C3C7]"></div>
        <div className="win-num-box-s-top">
          {tips}
        </div>
        <div className="win-num-box-s-center">
          {num}
        </div>
      </div>
    </>
  );
}
