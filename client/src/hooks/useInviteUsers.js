import { useState } from "react";
import { useAuth } from "../contexts/auth";

const URL = process.env.REACT_APP_PROXY;
const FRIENDS_URL = `${URL}/api/v1/invitations`;

function useInviteUsers() {
  const { user } = useAuth();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [invitations, setInvitations] = useState([]);

  // Get Invitations
  const getInvitations = async () => {
    setInvitations([]);
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch(`${FRIENDS_URL}/invitations`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      const result = await res.json();
      if (result.status !== "success") throw Error(result.message);

      setInvitations(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Invite user
  const inviteUser = async (id) => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch(`${FRIENDS_URL}/${id}/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      const result = await res.json();

      if (result.status !== "success") return Error(result.message);
      setResponse(result.data);
      // if (result.data === "sent")
      //   socket.emit("sendInvitaion", {
      //     from: user._id,
      //     username: user.username,
      //     image: user?.image,
      //     to: id,
      //     type: "sent",
      //   });
    } catch (err) {
      // setError(err.message);
      setError("Error");
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel Invitation
  const cancelInviteUser = async (id) => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch(`${FRIENDS_URL}/${id}/cancelInvite`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      const result = await res.json();

      if (result.status !== "success") return Error(result.message);

      setResponse(result.data);

      // if (result.data === "remove")
      //   socket.emit("sendInvitaion", {
      //     from: user._id,
      //     username: user.username,
      //     image: user?.image,
      //     to: id,
      //     type: "cancel",
      //   });
    } catch (err) {
      // setError(err.message);
      setError("Error");
    } finally {
      setIsLoading(false);
    }
  };

  // Accept Invitation
  const acceptUser = async (id) => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch(`${FRIENDS_URL}/${id}/accept`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      const result = await res.json();

      if (result.status !== "success") return Error(result.message);

      setResponse(result.data);

      // if (result.data === "accept")
      //   socket.emit("sendInvitaion", {
      //     from: id,
      //     username,
      //     image,
      //     to: user._id,
      //     type: "accept",
      //   });
    } catch (err) {
      // setError(err.message);
      setError("Error");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    inviteUser,
    cancelInviteUser,
    acceptUser,
    isLoading,
    error,
    response,
    getInvitations,
    invitations,
    setInvitations,
  };
}

export default useInviteUsers;
