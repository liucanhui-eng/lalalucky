import { useEffect, useState } from "react";
import { Notify } from "@nutui/nutui-react";
import UsernameInput from "./UsernameInput";
import AvatarEditor from "./AvatarEditor";
import { pay_center } from "declarations/pay_center";
import { useUser } from '../UserProvider';
import CreateUserButton from './CreateUserButton';
import SaveButton from './SaveButton';
import CancelButton from './CancelButton';
import SignOutButton from './SignOutButton';
import { iiLogout } from "../../common/ic-client";
import CLoading from "../CLoading";
import CPopup from '../CPopup';



/** 设置用户信息弹窗 */
export default function SetUserInfoPopup({ visible, title, onUserUpdated, isCreate, onClose }) {
  const user = useUser();
  const [avatar, setAvatar] = useState('');
  const [name, setName] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    (async () => {
      if (!visible) {
        return;
      }
      setAvatar(user?.logo);
      if (user?.new_user) {
        setName((user?.principal_id || '').slice(0, 23));
      } else {
        setName(user?.user_name);
      }
    })();
  }, [visible]);

  const handleUpdateUserInfo = async () => {
    if (updating) {
      return;
    }

    // 什么内容都没改，直接关闭
    if (avatar === user.logo && name === user.user_name) {
      onClose?.();
      return;
    }

    if (!name) {
      Notify.warn('Please enter your user name');
      return;
    }

    if (!name.trim()) {
      Notify.warn('User Name cannot be empty characters');
      return;
    }

    setUpdating(true);
    try {
      CLoading.show();
      // 更新用户信息
      let res = await pay_center.update_user(avatar, name);

      if (typeof res === 'string') {
        res = JSON.parse(res);
      }
      
      console.log('更新用户信息结果', res);
      if (res.code === 200) {
        // 更新用户信息缓存
        await user.update();
        onUserUpdated?.();
        onClose?.();
        Notify.success('Success!')
      } else {
        Notify.warn(`Update user info failed: ${res.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('更新用户信息失败', err);
      Notify.warn(`Update user info failed: ${err.message || 'Unknown error'}`);
    } finally {
      CLoading.hide();
      setUpdating(false);
    }
  };

  const handleSignOut = async () => {
    await iiLogout();
    await user.clear();
    onClose?.();
  };

  return (
    <CPopup
      title={title}
      visible={visible}
      position="bottom"
      closeOnOverlayClick={false}
      onClose={onClose}
    >
      <div className="text-[14px] text-[#000] font-semibold">
          <div className='mt-[21px] mb-[14px] flex items-center justify-between'>
            <div>Headshot</div>
            {!isCreate && <SignOutButton onClick={handleSignOut} />}
          </div>
          <AvatarEditor avatar={avatar} onChange={setAvatar}/>
          <div className='mt-[12px] mb-[4px]'>User Name</div>
          <UsernameInput className="mt-4px" value={name} maxLength={30} onChange={setName} />
          
          <div className='mt-[8px] px-[12px] text-[#000]/[.45] text-[12px]'>
          By registering with OpenChat you agree to abide by our terms and conditions
          </div>
          <div className="w-full py-[32px] flex items-center justify-center gap-[8px]">
            {isCreate ? 
              <CreateUserButton onClick={handleUpdateUserInfo} /> 
              : 
              (<>
                <CancelButton onClick={() => {onClose?.()}} />
                <SaveButton onClick={handleUpdateUserInfo} />
              </>)
            }
          </div>
        </div>
    </CPopup>
  );
}