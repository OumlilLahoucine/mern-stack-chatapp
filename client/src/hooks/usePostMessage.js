import { useState } from "react";
import { useAuth } from "../contexts/auth";

const URL = process.env.REACT_APP_PROXY;
const MESSAGES_URL = `${URL}/api/v1/messages`;

function usePostMessage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const postMessage = async (data, socket) => {
    setMessage(null);
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch(`${MESSAGES_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      // if (result.status !== "success") throw Error("Error, try again later.");
      // throw Error(result.message);
      socket.emit("addMessage", result.data);
      // setMessage(result.data);
    } catch (err) {
      setError("Error, try again later.");
    } finally {
      setIsLoading(false);
    }
  };
  return { postMessage, message, isLoading, error };
}

export default usePostMessage;
