import './index.scss';
import { Avatar } from "@nutui/nutui-react";
import DefaultAvatar from './default-avatar.png';
import { useMemo } from "react";



export default function CAvatar({ avatar = '', size = 'normal', onClick, className }) {
  const avatarUrl = useMemo(() => {
    if (avatar.startsWith('data:image')) {
      return avatar;
    }
    return DefaultAvatar;
  }, [avatar]);

  return (
    <Avatar 
      className={`border-[2px] border-solid border-[#000] ${className || ''}`}
      size={size}
      src={avatarUrl} 
      onClick={onClick}
    />
  );
}