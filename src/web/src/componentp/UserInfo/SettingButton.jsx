import SettingSvg from './assets/setting.svg';

export default function SettingButton({ onClick }) {
  return (
    <div 
      onClick={onClick}
      className="w-[24px] h-[24px] bg-no-repeat bg-center bg-transparent cursor-pointer"
      style={{ backgroundImage: `url(${SettingSvg})` }} />
  );
}