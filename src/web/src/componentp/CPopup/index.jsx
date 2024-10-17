import { Popup } from '@nutui/nutui-react';

export default function CPopup(props) {
  const { children, title, className, style = {}, ...restProps } = props;

  return (<Popup style={{ maxWidth: '500px', maxHeight: 'max-content', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#C2C3C7', ...style }} {...restProps}>
    <div className={`font-pfsc flex flex-col h-full px-[24px] pt-[16px] ${className}`}>
      <div className="text-[18px] font-bold text-center">{title}</div>
      {children}
    </div>
  </Popup>)
}