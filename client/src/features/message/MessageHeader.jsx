import { useState, useEffect } from "react";
import { BackIcon, SearchIcon, VerticalMenuIcon } from "../../ui/Vectors";
import FriendAvatar from "../friend/FriendAvatar";
import { formatTime, formatDate } from "../../utils/lastSeen";

function MessageHeader({ selectedUser, setSelectedUser, socket, isOnline }) {
  const [isTyping, setIsTyping] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const loadingStates = ["", ".", "..", "..."];

  let lastSeenText = "Offline";

  if (selectedUser.lastConnection) {
    const lastSeen = new Date(selectedUser.lastConnection);
    const now = new Date();
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const diff = now - lastSeen;
    const oneDay = 24 * 60 * 60 * 1000;

    if (lastSeen.toDateString() === now.toDateString()) {
      lastSeenText = `last seen today at ${formatTime(lastSeen)}`;
    } else if (diff < 7 * oneDay) {
      lastSeenText = `last seen ${daysOfWeek[lastSeen.getDay()]} at ${formatTime(lastSeen)}`;
    } else {
      lastSeenText = `last seen ${formatDate(lastSeen)}`;
    }
  }

  useEffect(() => {
    setIsTyping(false);
  }, [selectedUser._id]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isTyping)
        setLoadingText((prev) => {
          const currentIndex = loadingStates.indexOf(prev);
          const nextIndex = (currentIndex + 1) % loadingStates.length;
          return loadingStates[nextIndex];
        });
      else return "";
    }, 400); // Update every 500 milliseconds

    return () => clearInterval(interval);
  }, [isTyping]);

  // Realtime Typing
  useEffect(() => {
    const handleIsTyping = (data) => {
      if (data.from === selectedUser._id) setIsTyping(data.isTyping);
    };
    socket.on("isTyping", handleIsTyping);

    return () => {
      socket.off("isTyping", handleIsTyping);
    };
  }, [socket]);

  return (
    <header className="flex items-center border-b border-b-slate-200 py-1.5">
      {/* LeftSide */}
      <button
        onClick={() => setSelectedUser(null)}
        className="mr-1 block px-1 md:hidden"
      >
        <BackIcon />
      </button>
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <FriendAvatar
            image={selectedUser.image}
            username={selectedUser.username}
            small={true}
          />
          <div className="flex flex-col gap-0">
            <p className="text-[17px] font-semibold capitalize">
              {selectedUser.username}
            </p>
            <span className="text-xs font-medium text-slate-500">
              {isTyping
                ? `Typing${loadingText}`
                : isOnline
                  ? "Online"
                  : lastSeenText
                    ? lastSeenText
                    : "Offline"}
            </span>
          </div>
        </div>
        {/* rightSide */}
        <div className="flex items-center gap-3 sm:gap-4">
          <SearchIcon />
          <VerticalMenuIcon />
        </div>
      </div>
    </header>
  );
}

export default MessageHeader;
