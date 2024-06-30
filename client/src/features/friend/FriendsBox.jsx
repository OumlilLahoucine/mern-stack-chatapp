import { useEffect, useState, useMemo } from "react";
import { FilterIcon, MenuIcon } from "../../ui/Vectors";
import RecentChats from "../message/RecentChats";
import FriendsSection from "./FriendsSection";
import OnlineFriends from "./OnlineFriends";
import SearchFriend from "./SearchFriend";
import useRecentChats from "../../hooks/useRecentChats";
import { useAuth } from "../../contexts/auth";
import { sortMessagesByTypeAndCreatedAt } from "../../utils/sortRecentChats";
import { useSelected } from "../../contexts/selected";
import useSearchForFriends from "../../hooks/useSearchForFriends";
import Loader from "../../ui/Loader";
import NoData from "../../ui/NoData";
import Error from "../../ui/Error";
import messageSound from "/sounds/message.mp3";

function FriendsBox({ socket, onlineFriends }) {
  const { user } = useAuth();
  const { selectedUser, setSelectedUser } = useSelected();
  const [query, setQuery] = useState("");
  const {
    users: searchedUsers,
    isLoading: loadingSearchRecentChats,
    error: serachedUsersError,
  } = useSearchForFriends(query);

  const {
    recentChats,
    setRecentChats,
    isLoading: loadingRecentChats,
    error: recentChatsError,
    getRecentChats,
  } = useRecentChats();

  useEffect(() => {
    getRecentChats();
  }, []);
  // Sorting Recent Chats by the Created Time of the Message
  const sortedRecentChats = recentChats.sort(sortMessagesByTypeAndCreatedAt);
  const sortedSearchedRecentChats = searchedUsers.sort(
    sortMessagesByTypeAndCreatedAt,
  );

  // Realtime Recent Chats
  useEffect(() => {
    const handleRecentChats = (data) => {
      setRecentChats((cur) => {
        return cur.map((chat) =>
          chat.userId === data.from || chat.userId === data.to
            ? {
                ...chat,
                isMessage: true,
                content: data.content,
                fromMe: data.from === user._id,
                status: data.status,
                createdAt: data.createdAt,
                unread: selectedUser?._id === data.from ? 0 : chat.unread + 1,
              }
            : chat,
        );
      });

      if (data.to === user._id && data.from !== selectedUser?._id) {
        const sound = new Audio(messageSound);
        sound.play();
      }
    };

    socket.on("updateRecentChats", handleRecentChats);

    return () => {
      socket.off("updateRecentChats", handleRecentChats);
    };
  }, [socket, selectedUser]);

  // Realtime Accept Invitation
  useEffect(() => {
    const handleReloadRecentChats = () => {
      getRecentChats();
    };

    socket.on("reloadRecentChats", handleReloadRecentChats);

    return () => {
      socket.off("reloadRecentChats", handleReloadRecentChats);
    };
  }, [socket, getRecentChats]);

  // Realtime Message Viewed
  useEffect(() => {
    const handleUpdateMessageStatus = (data) => {
      setRecentChats((cur) =>
        cur.map((item) =>
          item.userId === data.friendId
            ? { ...item, status: "read", unread: 0 }
            : item,
        ),
      );
    };
    socket.on("updateMessageStatusToRead", handleUpdateMessageStatus);
    return () => {
      socket.off("updateMessageStatusToRead", handleUpdateMessageStatus);
    };
  }, []);

  // Realtime Update Last Connection
  useEffect(() => {
    const handleUpdateLastConnection = (data) => {
      // Update in recentChats
      setRecentChats((cur) =>
        cur.map((element) =>
          element.userId === data.userId
            ? { ...element, lastConnection: data.lastConnection }
            : element,
        ),
      );
      // Update in selectedUser Context
      setSelectedUser((user) =>
        user?._id === data.userId
          ? { ...user, lastConnection: data.lastConnection }
          : user,
      );
    };

    socket.on("updateLastConnectionInRecentChats", handleUpdateLastConnection);

    return () => {
      socket.off(
        "updateLastConnectionInRecentChats",
        handleUpdateLastConnection,
      );
    };
  }, [socket]);

  const memoizedOnlineFriends = useMemo(() => {
    return onlineFriends;
  }, [onlineFriends]);

  let status = "";
  if (loadingRecentChats || loadingSearchRecentChats) status = "loading";
  else if (query) {
    if (serachedUsersError) status = "error";
    else if (!sortedSearchedRecentChats.length) status = "noData";
    else status = "done";
  } else {
    if (recentChatsError) status = "error";
    else if (!sortedRecentChats.length) status = "noData";
    else status = "done";
  }

  return (
    <div
      className={`mt-3 flex flex-1 flex-col overflow-auto px-3 pb-2 sm:p-5 sm:pt-0`}
    >
      <FriendsSection title="chat">
        <SearchFriend addFriend={false} query={query} setQuery={setQuery} />
      </FriendsSection>

      <div className="flex-1 overflow-auto whitespace-nowrap">
        {!query && onlineFriends.length ? (
          <FriendsSection title="online friends" icon={<MenuIcon />}>
            <OnlineFriends onlineFriends={memoizedOnlineFriends} />
          </FriendsSection>
        ) : null}

        <FriendsSection title="recent chats" icon={<FilterIcon />}>
          {status === "loading" && <Loader center={false} />}
          {query && status === "error" && (
            <Error message={serachedUsersError} center={true} />
          )}
          {query && status === "noData" && <NoData message="User not found!" />}
          {query && status === "done" && (
            <RecentChats
              recentChats={sortedSearchedRecentChats}
              onlineFriends={memoizedOnlineFriends}
            />
          )}
          {!query && status === "error" && (
            <Error message={recentChatsError} center={true} />
          )}
          {!query && status === "noData" && (
            <NoData message="There are no chats yet!" />
          )}
          {!query && status === "done" && (
            <RecentChats
              recentChats={sortedRecentChats}
              onlineFriends={memoizedOnlineFriends}
            />
          )}
        </FriendsSection>
      </div>
    </div>
  );
}

export default FriendsBox;
