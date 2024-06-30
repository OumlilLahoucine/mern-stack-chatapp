import { useSelected } from "../../contexts/selected";
import CreateMessage from "./CreateMessage";
import MessageHeader from "./MessageHeader";
import Messages from "./Messages";
import useGetMessages from "../../hooks/useGetMessages";
import usePostMessage from "../../hooks/usePostMessage";
import WelcomeBox from "../../ui/WelcomeBox";

function MessageBox({ className, socket, onlineFriends }) {
  const { selectedUser, setSelectedUser } = useSelected();
  const {
    postMessage,
    message,
    isLoading: isLoadingPostMessage,
    error: postMessageError,
  } = usePostMessage();
  const {
    getMessages,
    messages,
    setMessages,
    isLoading: isLoadingGetMessages,
    error: getMessagesError,
  } = useGetMessages();

  return (
    <main
      className={`grid h-screen grid-rows-[auto_1fr_auto] bg-white px-2 text-slate-700 sm:px-4 ${className}`}
    >
      {selectedUser ? (
        <>
          <MessageHeader
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            socket={socket}
            isOnline={onlineFriends.some(
              (item) => item._id === selectedUser._id,
            )}
          />
          <Messages
            selectedUser={selectedUser}
            getMessages={getMessages}
            messages={messages}
            setMessages={setMessages}
            isLoading={isLoadingGetMessages}
            socket={socket}
            error={getMessagesError}
          />
          <CreateMessage
            selectedUser={selectedUser}
            postMessage={postMessage}
            message={message}
            socket={socket}
            isLoadingPostMessage={isLoadingPostMessage}
            error={postMessageError}
          />
        </>
      ) : (
        <WelcomeBox />
      )}
    </main>
  );
}

export default MessageBox;
