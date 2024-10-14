import { useEffect, useState } from 'react';
import CAvatar from '../CAvatar';
import { useUser } from '../UserProvider';
import { isIIAuthenticated } from '../../common/ic-client';
import SignInButton from './SignInButton';
import SettingButton from './SettingButton';
import SetUserInfoPopup from '../SetUserInfoPopup';

export default function UserInfo() {
  const user = useUser();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSetUserInfo, setShowSetUserInfo] = useState(false);
  const [name, setName] = useState(user?.name || '');

  useEffect(() => {
    if (user?.user_name?.length > 30) {
      setName(user.user_name.slice(0, 23));
    } else {
      setName(user.user_name);
    }
    
    (async () => {
      const isAuthenticated = await isIIAuthenticated();
      setIsAuthenticated(isAuthenticated);
      
    })();
  }, [user]);

  const handleSignIn = () => {
    // 调用ii登录入口的点击事件，让登录入口收口登录认证和注册的逻辑
    document.getElementById('__ii_signin_entry__').click();
  };

  const handleSetting = () => {
    setShowSetUserInfo(true);
  }

  return (
    <>
      <div className='w-full h-[40px] px-[8px] flex justify-between items-center gap-[16px]'>
        <div className='flex flex-1 items-center gap-[8px] overflow-hidden'>
          {isAuthenticated ? <><CAvatar avatar={user.logo} size='normal' onClick={handleSetting} className="cursor-pointer" /><div className='text-14px font-pfsc font-semibold leading-[20px] cursor-pointer' onClick={handleSetting}>{name}</div></> : <><CAvatar avatar={user.logo} size='normal' onClick={handleSignIn} className="cursor-pointer" /><SignInButton onClick={handleSignIn} /></>}
        </div>
        {isAuthenticated && <SettingButton onClick={handleSetting} />}
      </div>
      <SetUserInfoPopup title='Configuration' visible={showSetUserInfo} isCreate={false} onClose={() => setShowSetUserInfo(false)}/>
    </>
  );
}