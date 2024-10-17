import "./index.scss";
import imgAsk from "./assets/ask.svg";
import imgTitle from "./assets/title.jpg";

import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();
  return (
    <>
      <div className="title-box-v2" onClick={() => {
        navigate("/info");
      }}>
        <div
          className="title-box-v2-tips"
        >
          <div> How does it work</div>
          <div className="tips-icon">
            
          </div>
        </div>
        <div
          className="title-box-v2-txt"
        >
          LUCKY LOTTERY
          {/* <img width="307" height="28" src={imgTitle} /> */}
        </div>
      </div>
    </>
  );
}
