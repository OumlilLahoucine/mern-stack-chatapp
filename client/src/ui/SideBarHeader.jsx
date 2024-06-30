import { useAuth } from "../contexts/auth";
import {
  AddUserIcon,
  ChatIcon,
  LogoutIcon,
  NotificationIcon,
} from "./Vectors";

function SideBarHeader({ socket, setTab, invitationsLength }) {
  const { logout } = useAuth();

  return (
    <div className="flex items-center gap-4 border-b px-3 py-3 sm:px-5 sm:py-4">
      <img src="images/logo.png" alt="Chat app Logo" className="w-28" />

      <button className="ml-auto" onClick={() => setTab("chat")}>
        <ChatIcon />
      </button>
      <button className="mt-1" onClick={() => setTab("add")}>
        <AddUserIcon />
      </button>
      <button
        onClick={() => setTab("notification")}
        className="relative h-6 w-6"
      >
        <NotificationIcon />
        {invitationsLength > 0 && (
          <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[9px] font-semibold tracking-wide text-white">
            {invitationsLength < 10 && "0"}
            {invitationsLength}
          </span>
        )}
      </button>
      <button onClick={() => logout(socket)}>
        <LogoutIcon />
      </button>
    </div>
  );
}

export default SideBarHeader;
