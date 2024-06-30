function FormButton({ children, disabled = false }) {
  return (
    <button
      disabled={disabled}
      className="mb-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-4 font-semibold text-white shadow-sm transition-all duration-500 hover:bg-danger focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary focus:ring-opacity-30 disabled:cursor-not-allowed disabled:bg-slate-500 disabled:transition-none"
    >
      {children}
    </button>
  );
}

export default FormButton;
