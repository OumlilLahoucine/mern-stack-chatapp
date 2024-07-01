import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../contexts/auth";
import { useSelected } from "../contexts/selected";
import MessageBox from "../features/message/MessageBox";
import SideBar from "./SideBar";

const URL = process.env.REACT_APP_PROXY;
const socket = io(URL);

function AppLayout() {
  const { user } = useAuth();
  const { selectedUser } = useSelected();
  const [onlineFriends, setOnlineFriends] = useState([]);

  useEffect(() => {
    socket.emit("newUser", user._id);
  }, []);

  // Get all Online Friends
  useEffect(() => {
    const handleGetOnlineFriends = (data) => {
      setOnlineFriends(data);
    };

    socket.on("getOnlineFriends", handleGetOnlineFriends);

    return () => {
      socket.off("getOnlineFriends", handleGetOnlineFriends);
    };
  }, [socket]);

  // Get The New Online Friend
  useEffect(() => {
    const handleSetOnlineFriend = (data) => {
      if (data.online)
        setOnlineFriends((cur) => {
          const duplicates = cur.filter((user) => user._id === data._id);
          return duplicates.length === 0 ? [data, ...cur] : cur;
        });
      else
        setOnlineFriends((cur) =>
          cur.filter((element) => element._id !== data._id),
        );
    };

    socket.on("setOnlineFriend", handleSetOnlineFriend);

    return () => {
      socket.off("setOnlineFriend", handleSetOnlineFriend);
    };
  }, [socket]);

  return (
    <div className="grid h-screen grid-cols-[1fr] overflow-hidden md:grid-cols-[1fr_1fr] lg:grid-cols-[1fr_2fr]">
      <SideBar
        socket={socket}
        className={`${selectedUser && "hidden md:block"}`}
        onlineFriends={onlineFriends}
        setOnlineFriends={setOnlineFriends}
      />
      <MessageBox
        className={`${!selectedUser && "hidden md:block"}`}
        socket={socket}
        onlineFriends={onlineFriends}
      />
    </div>
  );
}

export default AppLayout;
