import CDialog from '../CDialog';

/** 成功获取Icp弹窗 */
export default function GetIcpSuccessDialog({ visible, onClose }) {
  return (
    <CDialog visible={visible} title="Successfully" confirmText="OK" onConfirm={onClose}>
      <div className='pb-[100px] font-pfsc text-[18px] text-[#000] font-semibold break-keep leading-[24px]'>
      Congratulations! You got 1 FREE ICP.
      </div>
    </CDialog>
  )
}