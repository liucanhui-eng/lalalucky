import { useEffect, useState } from 'react';
import { Notify } from "@nutui/nutui-react";
import { getUserInfo, isIIAuthenticated, getDeviceId, getPricipal } from '../../common/ic-client';

import { pay_center } from "declarations/pay_center";
import GetIcpDialog from './GetIcpDialog';
import GetIcpSuccessDialog from './GetIcpSuccessDialog';
import GetIcpFailDialog from './GetIcpFailDialog';
import SetUserInfoPopup from '../SetUserInfoPopup';
import { useUser } from '../UserProvider';
import CLoading from '../CLoading';


export default function IILoginEntry() {
  const user = useUser();
  const [visible, setVisible] = useState(false);
  const [showSetUserInfo, setShowSetUserInfo] = useState(false);
  const [checkGetICP, setCheckGetICP] = useState(false);
  const [showGetIcpSuccess, setShowGetIcpSuccess] = useState(false);
  const [showGetIcpFail, setShowGetIcpFail] = useState(false);

  useEffect(() => {
    (async () => {
      const isAuthenticated = await isIIAuthenticated();
      if (!isAuthenticated) {
        setVisible(true);
        // 开始检查是否显示领取ICP弹窗逻辑
        setCheckGetICP(true);
      } else {
        await getUserInfo();
        user.updateFromCache();
        setVisible(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const isAuthenticated = await isIIAuthenticated();
      if (!isAuthenticated) {
        setVisible(true);
        // 开始检查是否显示领取ICP弹窗逻辑
        setCheckGetICP(true);
      }
    })();
  }, [user]);

  const handleIIAuth = async () => {
    try {
      // 登录并获取用户信息
      const userInfo = await getUserInfo(true);
      await user.updateFromCache();
      setVisible(false);
      setCheckGetICP(false);
      CLoading.hide();
      if (userInfo.new_user) {
        setShowSetUserInfo(true);
      } else {
        // 不需要设置用户信息，则直接检测是否可以领取空投
        handleGetAirdrop();
      }
    } catch (err) {
      console.error('Internet Computer Identity身份认证失败：', err);
      Notify.warn('Internet Identity Authentication failed: ' + err.message);
    }
  };

  const handleGetAirdrop = async () => {
    const deviceId = await getDeviceId();
    const canGetIcp = await pay_center.give_airdrop(deviceId);
    console.log('handleGetAirdrop: ', deviceId, canGetIcp);

    if (canGetIcp) {
      const isSuccess = await pay_center.claim_airdrop(await getPricipal(), deviceId);
      console.log('handleGetAirdrop get airdrop: ', isSuccess);
      if (isSuccess) {
        setShowGetIcpSuccess(true);
        // 领取空投之后，同步用户信息
        await getUserInfo();
        user.updateFromCache();
      } else {
        setShowGetIcpFail(true);
      }
    }
  };

  return (
    <>
      <div style={{display: visible ? 'block' : 'none'}} className="w-full mx-auto max-w-[500px] h-[40px] invisible" ></div>  
      <div id="__ii_signin_entry__" onClick={handleIIAuth} style={{display: visible ? 'block' : 'none'}} className='w-full left-[50%] translate-x-[-50%] max-w-[500px] h-[40px] leading-[40px] fixed  bottom-[72px] bg-[#B3A4D3] text-center text-[#000] font-pfsc text-[14px] font-semibold cursor-pointer'>
          Guest mode - tap here to sign in / sign up
      </div>
      <GetIcpDialog checkStart={checkGetICP} onGetICP={handleIIAuth}/>
      <SetUserInfoPopup title='Sign up with Lucky Lottery' visible={showSetUserInfo} onUserUpdated={handleGetAirdrop} isCreate={true} onClose={() => setShowSetUserInfo(false)} />
      <GetIcpSuccessDialog visible={showGetIcpSuccess} onClose={() => setShowGetIcpSuccess(false)}/>
      <GetIcpFailDialog visible={showGetIcpFail} onClose={() => setShowGetIcpFail(false)}/>
    </>
  )
}