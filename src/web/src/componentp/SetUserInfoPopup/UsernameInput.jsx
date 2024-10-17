import { useState } from 'react';
import { Input } from "@nutui/nutui-react";

export default function UsernameInput({ value = '', maxLength = 30, onChange, className = '' }) {

  const [valueLength, setValueLength] = useState(value?.length || 0);

  return (
    <div className={`flex items-center border-[2px] border-solid border-[#000] bg-[#FFF1E8] px-[10px] ${className}`}>
      <Input 
        className='!bg-transparent [&>input]:!bg-[#FFF1E8] [&>input]:!text-[#867AA0] !px-[12px] !py-[8px]' 
        placeholder='Please enter your name' 
        value={value}
        autocomplete='off'
        autofill='off'
        onChange={(val) => {
          onChange(val);
          setValueLength(val.length);
        }}
        maxLength={maxLength}
      />
      <div className="right text-[12px]">
        {valueLength} / {maxLength}
      </div>
    </div>
  )
}