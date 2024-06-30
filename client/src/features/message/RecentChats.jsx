import RecentChat from "./RecentChat";

function RecentChats({ recentChats, onlineFriends }) {
  return (
    <ul className="flex flex-col gap-2 sm:gap-4">
      {recentChats.length
        ? recentChats.map((chat) => (
            <RecentChat
              chat={chat}
              key={chat.userId}
              isOnline={onlineFriends.some((item) => item._id === chat.userId)}
            />
          ))
        : null}
    </ul>
  );
}

export default RecentChats;
