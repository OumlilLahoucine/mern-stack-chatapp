function Button({ children, disabled = false, action = null, danger = false }) {
  const className = danger
    ? "bg-danger focus:border-danger focus:ring-danger"
    : "bg-primary focus:border-primary focus:ring-primary";
  return (
    <button
      disabled={disabled}
      className={`mb-0 flex items-center justify-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold capitalize text-white shadow-sm transition-all duration-500 hover:bg-blue-400 focus:outline-none focus:ring-0 focus:ring-opacity-30 disabled:cursor-not-allowed disabled:bg-slate-500 disabled:transition-none sm:px-4 sm:py-2 ${className}`}
      onClick={action}
    >
      {children}
    </button>
  );
}

export default Button;
