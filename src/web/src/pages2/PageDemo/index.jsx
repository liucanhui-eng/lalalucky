import "./index.scss";
import { useState } from "react";

import WinNumBox from "../../components2/WinNumBox";

export default function App() {
  const [data, setData] = useState( 
    {
      title: "aaa",
      tips: "aaa",
      list: [23, 334, 556, 777],
    },
  );
  return (
    <div className="App">
      <div className="flex ">
        <WinNumBox 
          data={data}
          isActive={true}
        ></WinNumBox>
        <WinNumBox title="title2"></WinNumBox>
      </div>
    </div>
  );
}
