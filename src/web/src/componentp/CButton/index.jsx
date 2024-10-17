

import "./index.scss";
import {
  Button,
} from "@nutui/nutui-react";

export default function Index(props) {
  const { txt, isLoading,onClick,disabled=false } = props;
  return (
    <>
      <Button
      disabled={disabled}
        onClick={onClick}
        loading={isLoading}
        type="info"
        className="cbutton"
      >
        {txt}
      </Button>
    </>
  );
}
