import { memo, useRef, useEffect } from "react";
import { useAuth } from "../../contexts/auth";
import Message from "./Message";
import Loader from "../../ui/Loader";
import Error from "../../ui/Error";
import NoData from "../../ui/NoData";
import viewSound from "/sounds/view.mp3";
function Messages({
  selectedUser,
  getMessages,
  messages,
  setMessages,
  isLoading,
  socket,
  error,
}) {
  const { user } = useAuth();
  const lastElement = useRef(null);

  // Get Messages and Change status to 'read'
  useEffect(() => {
    setMessages([]);
    getMessages(selectedUser._id);
    socket.emit("updateStatusToRead", {
      userId: user._id,
      selectedUserId: selectedUser._id,
    });
  }, [selectedUser._id]);

  // Realtime Update Status to 'read'
  useEffect(() => {
    const handleUpdateStatusToRead = (data) => {
      if (selectedUser._id === data.friendId) {
        setMessages((cur) =>
          cur.map((item) =>
            item.to === data.friendId ? { ...item, status: "read" } : item,
          ),
        );
      }
    };

    socket.on("updateMessageStatusToRead", handleUpdateStatusToRead);

    return () => {
      socket.off("updateMessageStatusToRead", handleUpdateStatusToRead);
    };
  }, [socket, selectedUser]);

  // I read the message or Not Yet
  useEffect(() => {
    const handleYouAreReadMessage = (data) => {
      if (data.from === selectedUser._id) {
        socket.emit("yesIReadMessage", {
          _id: data._id,
          friend: user._id,
          user: selectedUser._id,
        });
      }
    };

    socket.on("YouAreReadMessage", handleYouAreReadMessage);

    return () => {
      socket.off("YouAreReadMessage", handleYouAreReadMessage);
    };
  }, [socket, selectedUser]);

  // Get New Messages
  useEffect(() => {
    const handleMessage = (data) => {
      if (data.from === selectedUser._id) {
        setMessages((cur) => [...cur, data]);
        const sound = new Audio(viewSound);
        sound.play();
      }
    };

    socket.on("getMessage", handleMessage);

    return () => {
      socket.off("getMessage", handleMessage);
    };
  }, [socket, selectedUser]);

  // Get My Message
  useEffect(() => {
    const handleMessage = (data) => {
      if (data.from === user._id && data.to === selectedUser._id) {
        setMessages((cur) => [...cur, data]);
      }
    };

    socket.on("getMyMessage", handleMessage);

    return () => {
      socket.off("getMyMessage", handleMessage);
    };
  }, [socket, selectedUser]);

  // Update Message Status to 'delivered'
  useEffect(() => {
    const handleUpdateMessageStatus = (data) => {
      if (data.to === selectedUser._id) {
        setMessages((cur) =>
          cur.map((item) =>
            item._id === data._id ? { ...item, status: data.status } : item,
          ),
        );
      }
    };

    socket.on("updateMessageStatus", handleUpdateMessageStatus);

    return () => {
      socket.off("updateMessageStatus", handleUpdateMessageStatus);
    };
  }, [socket, selectedUser]);

  useEffect(() => {
    lastElement.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isLoading) return <Loader />;
  if (error)
    return (
      <Error message={error} center={true} forMessage={true} withBM={false} />
    );
  if (!messages.length)
    return <NoData message="No message yet! Send it now." />;
  return (
    <ul
      className="my-4 flex flex-col gap-4 overflow-y-scroll pr-1 sm:pr-2"
      style={{ scrollbarWidth: "thin" }}
    >
      {messages.map((message) => (
        <Message
          message={message}
          key={message._id}
          received={message.from === selectedUser._id}
        />
      ))}

      <div ref={lastElement}></div>
    </ul>
  );
}

export default memo(Messages);
