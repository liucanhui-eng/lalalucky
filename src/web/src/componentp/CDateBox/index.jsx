import "./index.scss";
import CBox from "../CBox";

export default function Index({ data, handleClick,currentItem }) {
  return (
    <>
      <CBox>
        <div className="com-date-box-v2">
          {data.map((item) => {
            return (
              <>
                <div
                  key={item.value}
                  onClick={() => { 
                    handleClick(item);
                  }} 
                  className={`com-date-box-row ${currentItem.value ==item.value?"com-date-box-row-a":"com-date-box-row-n" }`}
                >
                  {item.name}
                </div>
              </>
            );
          })}
        </div>
      </CBox>
    </>
  );
}
