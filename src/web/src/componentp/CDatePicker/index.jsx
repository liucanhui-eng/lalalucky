import React, { useState } from "react";
import { DatePicker, Cell, ConfigProvider } from "@nutui/nutui-react";
import enUS from "@nutui/nutui-react/dist/locales/en-US";

const Index = ({ value, visible, onClose, onChange, onConfirm }) => {
  const defaultValue = new Date();
  const defaultDescription = `${defaultValue.getFullYear()}-${
    defaultValue.getMonth() + 1
  }`;

  const formatter1 = (type, option) => {
    switch (type) {
      case "year":
        option.text += ` year`;
        break;
      case "month":
        option.text += ` Month`;
        break;
      case "day":
        option.text += `日`;
        break;
      case "hour":
        option.text += `时`;
        break;
      default:
        option.text += "";
    }
    return option;
  };

 

  return (
    <>
      <ConfigProvider locale={enUS}>
        <DatePicker
          formatter={formatter1}
          type="year-month"
          title="Date Picker"
          visible={visible}
          value={value || defaultValue}
          defaultValue={new Date(`${defaultDescription}`)}
          onClose={() => onClose()}
          threeDimensional={false}
          onChange={(options, values) => onChange(options, values)}
          onConfirm={(options, values) => onConfirm(options, values)}
        />
      </ConfigProvider>
    </>
  );
};
export default Index;
