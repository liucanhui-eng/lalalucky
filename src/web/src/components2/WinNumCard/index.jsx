import "./index.scss";

export default function Index(props) {
  const { data ,isActive } = props;
  const { tips, num, bottom} = data;

  return (
    <>
      <div className={!isActive?"win-num-card":"win-num-card-active"}>
        <div className="tips">{tips} slots</div>
        <div className="num">{num}X</div>
        {bottom&&bottom.length>0&& <div className="bottom">
          {bottom.map((item, index) => {
            return (
              <div key={index} className="bottom-num">{String(item)}</div>
            );
          })}
        </div>}
      </div>
    </>
  );
}
