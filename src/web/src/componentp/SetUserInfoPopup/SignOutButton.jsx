import SignOutSvg from './assets/sign-out.svg';

export default function SignOutButton({ onClick }) {
  return (
    <div  onClick={onClick} className='w-fit flex items-center gap-[5px] cursor-pointer'>
      <div className='text-[#C11717] text-[14px] font-semibold font-pfsc'>SIGN OUT</div>
      <div
        className="w-[24px] h-[24px] leading-[32px] border-none bg-transparent bg-no-repeat bg-center"
        style={{ backgroundImage: `url(${SignOutSvg})` }}
      />
    </div>
  );
}