type tButtonProps = {
  children: React.ReactNode;
  icon: string;
  onClick: () => void;
};

function Button({ children, icon, onClick }: tButtonProps) {
  return (
    <button
      type="button"
      className="btn flex h-auto w-full flex-col gap-1 py-2"
      onClick={() => onClick()}
    >
      <span>{children}</span>
      <span>
        <img src={icon} alt="yield" />
      </span>
    </button>
  );
}

export default Button;
