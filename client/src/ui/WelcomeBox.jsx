function WelcomeBox() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2">
      <img src="images/logo.png" alt="Chat app Logo" className="w-52" />
      <p className="text-center text-lg font-medium text-slate-500">
        Welcome to <span className="font-semibold text-primary">Skychat</span>!
        Let's start a new conversation now.
      </p>
    </div>
  );
}

export default WelcomeBox;
