import { useEffect, useState } from 'react';
import { pay_center } from "declarations/pay_center";
import { getDeviceId } from '../../common/ic-client';
import CDialog from '../CDialog';

/** 获取ICP弹窗 */
export default function GetIcpDialog({ checkStart, onGetICP }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (checkStart) {
      (async () => {
        const deviceId = await getDeviceId();
        const canGetIcp = await pay_center.give_airdrop(deviceId);
        setVisible(canGetIcp);
      })();
    } else {
      setVisible(false);
    }
  }, [checkStart]);

  const handleCancel = () => {
    setVisible(false);
  }

  const handleConfirm = () => {
    onGetICP?.();
    setVisible(false);
  }

  return (
    <CDialog visible={visible} title="Sign Up Gift" confirmText="GET ICP" cancelText="Close" onCancel={handleCancel} onConfirm={handleConfirm}>
      <div className='pb-[71px] font-pfsc text-[#000] text-[18px] font-semibold break-keep leading-[24px]'>
        Sign Up and get 1 FREE ICP to play!<br />Limited 500 Users！
      </div>
    </CDialog>
  )
}