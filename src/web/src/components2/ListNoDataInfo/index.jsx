import "./index.scss";
import iconNoData from "./assets/iconNoData.svg";

export default function Index(props) {

  return (
    <>
      <div className="com-list-no-data-info">
        <div className="com-list-no-data-info-icon">
          <img
            src={iconNoData}
          />
        </div>
        <div className="com-list-no-data-info-text">
          No Information
        </div>

      </div>
    </>
  );
}
