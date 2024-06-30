function Form({ onSubmit, children, isLogin = true }) {
  const desc = isLogin
    ? "Login to continue skychat app."
    : "Create your free skychat account";
  return (
    <div className="mx-auto my-0 w-full rounded-xl bg-white p-8 text-center text-slate-500 shadow-sm sm:my-4 sm:w-[360px] md:my-10">
      <div>
        <img src="/images/logo.png" alt="Logo" className="mx-auto mb-4 w-48" />
        <p className="mb-6 text-lg font-medium text-slate-500">{desc}</p>
      </div>
      <div className="h-[1px] w-full bg-slate-200"></div>
      <form onSubmit={onSubmit} className="mt-6" encType="multipart/form-data">
        {children}
      </form>
    </div>
  );
}

export default Form;
