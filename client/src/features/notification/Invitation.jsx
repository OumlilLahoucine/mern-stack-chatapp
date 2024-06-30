import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/auth";
import useInviteUsers from "../../hooks/useInviteUsers";
import Button from "../../ui/Button";
import { SmallLoader } from "../../ui/Vectors";
import FriendAvatar from "../friend/FriendAvatar";

function Invitation({ socket, invitation, setInvitations, setError }) {
  const { cancelInviteUser, acceptUser, response, isLoading, error } =
    useInviteUsers();
  const { user } = useAuth();
  const [clickedButton, setClickedButton] = useState(1); // 1: for first and 0: for reject
  let status = invitation.fromMe ? "cancel" : "accept";

  useEffect(() => {
    if (error) setError(true);
    if (response) setError(false);
  }, [error, response]);

  useEffect(() => {
    if (response === "remove") {
      if (!invitation.fromMe) {
        socket.emit("sendInvitaion", {
          from: invitation.from,
          username: invitation.username,
          image: invitation?.image,
          to: invitation.to,
          type: "reject",
        });
      } else {
        socket.emit("sendInvitaion", {
          from: invitation.from,
          username: user.username,
          image: user?.image,
          to: invitation.to,
          type: "cancel",
        });
      }
      setInvitations((cur) => cur.filter((inv) => inv.to !== invitation.to));
    }

    if (response === "accept") {
      setInvitations((cur) =>
        cur.map((inv) =>
          inv.to === invitation.to
            ? { ...inv, accepted: true, fromMe: true }
            : inv,
        ),
      );
      socket.emit("sendInvitaion", {
        from: invitation.from,
        username: invitation.username,
        image: invitation?.image,
        to: invitation.to,
        type: "accept",
      });
      socket.emit("setOnline", {
        user1: { _id: user._id, username: user.username, image: user?.image },
        user2: {
          _id: invitation.from,
          username: invitation.username,
          image: invitation?.image,
        },
      });
    }
  }, [setInvitations, response]);

  async function handleReject() {
    setClickedButton(0);
    await cancelInviteUser(invitation.from);
  }
  async function handleInvite() {
    setClickedButton(1);
    if (status === "cancel") {
      await cancelInviteUser(invitation.to);
    }
    if (status === "accept") {
      await acceptUser(invitation.from);
    }
  }

  return (
    <li className="flex items-center gap-3 overflow-clip rounded-xl border-2 border-transparent bg-white p-2 shadow-sm transition-all hover:cursor-pointer hover:border-primary sm:gap-4 sm:p-2">
      <FriendAvatar
        image={invitation.image}
        username={invitation.username}
        isOnline={false}
      />
      <p className="font-semibold capitalize sm:text-[17px]">
        {invitation.username}
      </p>
      <span className="ml-auto">
        {(invitation?.accepted || response === "accept") && (
          <p className="mr-1 font-medium text-primary">Congrats!</p>
        )}
        {!invitation?.accepted &&
          !response &&
          (status ? (
            <div className="flex gap-1">
              <Button action={handleInvite} disabled={isLoading}>
                {isLoading && clickedButton ? (
                  <>
                    <SmallLoader /> Loading
                  </>
                ) : (
                  status
                )}
              </Button>
              {status === "accept" && (
                <Button
                  danger={true}
                  action={handleReject}
                  disabled={isLoading}
                >
                  {isLoading && !clickedButton ? (
                    <>
                      <SmallLoader /> Loading
                    </>
                  ) : (
                    "reject"
                  )}
                </Button>
              )}
            </div>
          ) : (
            <p className="font-medium text-primary">Congrats!</p>
          ))}
      </span>
    </li>
  );
}

export default Invitation;
