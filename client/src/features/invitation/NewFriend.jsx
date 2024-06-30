import { useEffect } from "react";
import { useAuth } from "../../contexts/auth";
import useInviteUsers from "../../hooks/useInviteUsers";
import Button from "../../ui/Button";
import FriendAvatar from "../friend/FriendAvatar";
import { SmallLoader } from "../../ui/Vectors";

function NewFriend({ user, socket, setInvitations, setError }) {
  const { user: currentUser } = useAuth();
  const {
    inviteUser,
    cancelInviteUser,
    acceptUser,
    response,
    isLoading,
    error,
  } = useInviteUsers();
  // sent, remove, accept
  let status = "invite";
  if (response) {
    if (response === "sent") {
      status = "cancel";
    } else if (response === "remove") status = "invite";
    else status = "";
  } else if (user.fromMe !== null) {
    status = user.fromMe ? "cancel" : "accept";
  }

  useEffect(() => {
    if (error) setError(true);
    if (response) setError(false);
  }, [error, response]);

  useEffect(() => {
    if (response === "sent") {
      socket.emit("sendInvitaion", {
        from: currentUser._id,
        username: currentUser.username,
        image: currentUser?.image,
        to: user._id,
        type: "sent",
      });
      setInvitations((cur) => [
        {
          from: currentUser._id,
          to: user._id,
          username: user.username,
          image: user?.image,
          fromMe: true,
        },
        ...cur,
      ]);
    } else if (response === "remove") {
      socket.emit("sendInvitaion", {
        from: currentUser._id,
        username: currentUser.username,
        image: currentUser?.image,
        to: user._id,
        type: "cancel",
      });
      setInvitations((cur) => cur.filter((inv) => inv.to !== user._id));
    } else if (response === "accept") {
      socket.emit("sendInvitaion", {
        from: user._id,
        username: user.username,
        image: user?.image,
        to: currentUser._id,
        type: "accept",
      });
      setInvitations((cur) => cur.filter((inv) => inv.from !== user._id));
      socket.emit("setOnline", {
        user1: {
          _id: currentUser._id,
          username: currentUser.username,
          image: currentUser?.image,
        },
        user2: {
          _id: user._id,
          username: user.username,
          image: user?.image,
        },
      });
    }
  }, [response]);

  async function handleInvite() {
    if (status === "invite") {
      await inviteUser(user._id);
    }
    if (status === "cancel") {
      await cancelInviteUser(user._id);
    }
    if (status === "accept") {
      await acceptUser(user._id);
    }
  }

  return (
    <li className="flex items-center gap-3 overflow-clip rounded-xl border-2 border-transparent bg-white p-2 shadow-sm transition-all hover:cursor-pointer hover:border-primary sm:gap-4 sm:p-2">
      <FriendAvatar
        image={user.image}
        username={user.username}
        isOnline={false}
      />
      <p className="font-semibold capitalize sm:text-[17px]">{user.username}</p>
      <span className="ml-auto">
        {status ? (
          <Button action={handleInvite} disabled={isLoading}>
            {isLoading ? (
              <>
                <SmallLoader /> Loading
              </>
            ) : (
              status
            )}
          </Button>
        ) : (
          <p className="font-medium text-primary">Congrats!</p>
        )}
      </span>
    </li>
  );
}

export default NewFriend;
