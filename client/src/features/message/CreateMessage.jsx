import { useEffect, useRef, useState } from "react";
import { CloseIcon, SendMessageIcon, SmallLoader } from "../../ui/Vectors";
import { useAuth } from "../../contexts/auth";
import Error from "../../ui/Error";

function CreateMessage({
  selectedUser,
  postMessage,
  message: createdMessage,
  socket,
  isLoadingPostMessage,
  error,
}) {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const input = useRef(null);

  // useEffect(() => {
  //   input.current.focus();
  // }, [message]);

  useEffect(() => {
    if (!isLoadingPostMessage) setMessage("");
  }, [selectedUser._id, createdMessage, isLoadingPostMessage]);

  function handleSend(e) {
    e.preventDefault();
    if (!message) return;
    const data = { to: selectedUser._id, content: message };
    postMessage(data, socket);
  }

  useEffect(() => {
    socket.emit("typing", {
      from: user._id,
      to: selectedUser._id,
      typing: message.length > 0,
    });
  }, [message]);

  return (
    <div className="border-t border-t-slate-200">
      <div
        className={`my-4 flex items-center gap-3 rounded-xl border bg-slate-100 px-3 py-2 shadow-sm focus-within:border-2 focus-within:border-primary focus-within:outline-none focus-within:ring-4 focus-within:ring-primary focus-within:ring-opacity-30 ${error ? "border-red-400" : "border-transparent"}`}
      >
        <input
          disabled={isLoadingPostMessage}
          type="text"
          spellCheck="false"
          className="w-full border-0 bg-transparent font-medium text-slate-600 outline-none placeholder:font-normal placeholder:text-slate-500"
          placeholder="Search users or messages"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          ref={input}
        />
        {isLoadingPostMessage ? (
          <SmallLoader isWhite={false} />
        ) : error ? (
          <div className="h-auto min-w-max">
            <Error message={error} center={true} withBM={false} />
          </div>
        ) : (
          message && (
            <button onClick={() => setMessage("")}>
              <CloseIcon />
            </button>
          )
        )}
        <button
          disabled={isLoadingPostMessage}
          onClick={handleSend}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-transparent transition-colors duration-500"
        >
          <SendMessageIcon disabled={isLoadingPostMessage} />
        </button>
      </div>
    </div>
  );
}

export default CreateMessage;
