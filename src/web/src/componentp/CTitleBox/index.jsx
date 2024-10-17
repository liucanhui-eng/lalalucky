import "./index.scss";

export default function Index({ children }) {
  return (
    <>
      <div className="com-title-box relative ">
        <div className="com-title-box-l   top-0 left-0  "></div>
        <div className="com-title-box-l   top-0 right-0 "></div>
        <div className="com-title-box-l   bottom-0 left-0  "></div>
        <div className="com-title-box-lb  bottom-0 right-0  "></div>

        <div className="com-title-box-content    relative w-full shadow-md   border-[4px] border-[#000] bg-[#FFF1E8] z-10  ">
          <div className="absolute top-0 left-0 w-[4px] h-[4px] bg-[#000]"></div>
          <div className="absolute top-0 right-0 w-[4px] h-[4px] bg-[#000]"></div>
          <div className="absolute bottom-0 left-0 w-[4px] h-[4px] bg-[#000]"></div>
          <div className="absolute bottom-0 right-0 w-[4px] h-[4px] bg-[#000]"></div>

          <div className="com-title-box-content-line-1   "></div>
          <div className="com-title-box-content-line-2   "></div>
          <div className="com-title-box-content-b">{children}</div>
        </div>
      </div>
    </>
  );
}
