import FriendAvatar from "../friend/FriendAvatar";
import convertTime from "../../utils/convertTime";
import { useSelected } from "../../contexts/selected";
import {
  NotYetViewIcon,
  ViewIcon,
  NotYetDeliveredIcon,
} from "../../ui/Vectors";

function RecentChat({ chat, isOnline }) {
  const { setSelectedUser } = useSelected();

  const user = {
    _id: chat.userId,
    username: chat.username,
    image: chat?.image,
    lastConnection: chat?.lastConnection,
  };

  const message = chat.isMessage
    ? chat.content.length > 24
      ? chat.content.split("").slice(0, 22).join("") + "..."
      : chat.content
    : null;

  return (
    <li
      onClick={() => {
        if (chat.unread !== 0) chat.unread = 0;
        setSelectedUser(user);
      }}
      role="button"
      tabIndex="0"
      className={`grid grid-cols-[auto_1fr] gap-3 overflow-clip rounded-xl border-2 border-transparent bg-white p-2 shadow-sm transition-all hover:cursor-pointer hover:border-primary focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary focus:ring-opacity-30 sm:gap-4 sm:p-3 ${chat.isMessage && !chat.fromMe && chat.unread !== 0 ? "border-green-300" : ""}`}
    >
      <FriendAvatar
        image={chat.image}
        username={chat.username}
        isOnline={isOnline}
      />
      <div className="">
        <div className="mb-0.5 flex items-center justify-between">
          <p className="font-semibold capitalize sm:text-[17px]">
            {chat.username}
          </p>
          <p
            className={`text-xs font-medium ${chat.isMessage ? "text-slate-500" : "text-primary"}`}
          >
            {chat.isMessage ? convertTime(chat.createdAt) : "Chat now"}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p
            className={`max-w-full text-sm sm:text-[15px] ${chat.isMessage ? "text-slate-500" : "text-slate-400"} ${!chat.fromMe && chat.unread ? "font-semibold" : "font-normal"}`}
          >
            {chat.isMessage ? (
              chat.fromMe ? (
                <span className="flex items-center gap-1">
                  {chat.status === "sent" && <NotYetDeliveredIcon />}
                  {chat.status === "delivered" && <NotYetViewIcon />}
                  {chat.status === "read" && <ViewIcon />}
                  <span>
                    You:&nbsp;
                    {message}
                  </span>
                </span>
              ) : (
                message
              )
            ) : (
              "No message. Start chat now."
            )}
          </p>
          {chat.isMessage && !chat.fromMe && chat.unread !== 0 && (
            <span className="rounded-full bg-primary px-1.5 py-0.5 text-xs font-medium tracking-wide text-white">
              {chat.unread}
            </span>
          )}
        </div>
      </div>
    </li>
  );
}

export default RecentChat;
