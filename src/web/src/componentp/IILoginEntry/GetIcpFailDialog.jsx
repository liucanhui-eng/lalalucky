import { Notify } from '@nutui/nutui-react';
import CDialog from '../CDialog';
import IconCopy from '../IconCopy';

export default function GetIcpFailDialog({ visible, onClose }) {
  const handleCopy = () => {
    navigator.clipboard.writeText('Support@luckylottery.fun');
    Notify.success('Copied to clipboard');
  }

  return (
    <CDialog visible={visible} title="Failure" confirmText="OK" onConfirm={onClose}>
      <div className='font-pfsc pb-[35px] font-semibold text-[18px] leading-[24px]'>
        <div className='text-[#000] break-keep'>Sorry, you can't get the reward, if in doubt, you can try to contact us。</div>
        <div className='text-[#5F40A1] flex items-center gap-[8px] mt-[16px]'>
          <a href="mailto:Support@luckylottery.fun" className='underline'>Support@luckylottery.fun</a>
          <IconCopy className="text-[#867AA0]" onClick={handleCopy} />
        </div>
      </div>
    </CDialog>
  )
}