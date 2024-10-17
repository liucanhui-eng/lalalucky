export default function SignInButton({ onClick }) {
  return (
    <div 
      onClick={onClick}
      className="retro-button retro-button-primary w-[112px] text-[10px]"
     >
      SIGN IN
    </div>
  );
}