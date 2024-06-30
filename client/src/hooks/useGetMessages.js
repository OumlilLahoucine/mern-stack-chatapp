import { useState } from "react";
import { useAuth } from "../contexts/auth";

const URL = process.env.REACT_APP_PROXY;
const MESSAGES_URL = `${URL}/api/v1/messages`;

function useGetMessages() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);

  const getMessages = async (id) => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch(`${MESSAGES_URL}/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      const result = await res.json();

      if (result.status !== "success") throw Error(result.message);

      setMessages(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  return { getMessages, messages, setMessages, isLoading, error };
}

export default useGetMessages;
