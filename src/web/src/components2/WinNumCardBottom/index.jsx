import "./index.scss";
import { TriangleDown,TriangleUp } from '@nutui/icons-react'


export default function Index(props) {
  const {isUp,onClick} = props;
  return (
    <>
      <div onClick={onClick} className="win-num-card-bottom">
       {!isUp &&  <TriangleDown />}
       {isUp && <TriangleUp />}
      </div>
    </>
  );
}
