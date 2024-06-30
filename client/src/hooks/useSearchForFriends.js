import { useEffect, useState } from "react";
import { useAuth } from "../contexts/auth";

const URL = process.env.REACT_APP_PROXY;
const FRIENDS_URL = `${URL}/api/v1/users`;

function useSearchForFriends(query) {
  const { user } = useAuth();
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const searchFriends = async () => {
      setError(null);
      setUsers([]);
      setIsLoading(true);
      try {
        const res = await fetch(`${FRIENDS_URL}/friends?s=${query}`, {
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });

        const result = await res.json();
        if (result.status !== "success") throw Error(result.message);

        setUsers(result.data);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (!query) {
      setUsers([]);
      setError(null);
      return;
    }
    searchFriends();

    return () => {
      controller.abort();
    };
  }, [query]);

  return { users, isLoading, error };
}
export default useSearchForFriends;
