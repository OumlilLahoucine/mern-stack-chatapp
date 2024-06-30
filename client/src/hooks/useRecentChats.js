import { useState } from "react";
import { useAuth } from "../contexts/auth";

const URL = process.env.REACT_APP_PROXY;
const FRIENDS_URL = `${URL}/api/v1/users`;

function useRecentChats() {
  const { user } = useAuth();
  const [recentChats, setRecentChats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getRecentChats = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch(`${FRIENDS_URL}/recent`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      const result = await res.json();

      if (result.status !== "success") throw Error(result.message);

      setRecentChats(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { recentChats, setRecentChats, isLoading, error, getRecentChats };
}

export default useRecentChats;
