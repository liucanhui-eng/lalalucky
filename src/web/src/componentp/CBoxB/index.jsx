import "./index.scss";

const Index = ({ children }) => {
  return (
    <>
      <div className="com-box-b relative w-full shadow-md ">
        <div className="absolute top-0 left-0 w-1 h-1 bg-[#000]"></div>
        <div className="absolute top-0 right-0 w-1 h-1 bg-[#000]"></div>
        <div className="absolute bottom-0 left-0 w-1 h-1 bg-[#000]"></div>
        <div className="absolute bottom-0 right-0 w-1 h-1 bg-[#000]"></div>
        {children}
      </div>
    </>
  );
};
export default Index;

 