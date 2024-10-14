import "./index.scss";
import { Input } from "@nutui/nutui-react";

export default function Index(props) {
  const {
    value,
    placeholder,
    type,
    readOnly = false,
    onChange,
    clearable = false,
  } = props;
  return (
    <>
      <Input
        clearable={clearable}
        value={value}
        readOnly={readOnly}
        disabled={readOnly}
        onChange={onChange}
        type={type}
        className={readOnly ? "cinput-readonly" : "cinput"}
        placeholder={placeholder}
      />
    </>
  );
}
