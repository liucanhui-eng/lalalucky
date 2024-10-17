export default function CreateUserButton({ onClick }) {
  return (
    <div 
      onClick={onClick}
      className="retro-button retro-button-primary"
    >
      SAVE
    </div>
  );
}