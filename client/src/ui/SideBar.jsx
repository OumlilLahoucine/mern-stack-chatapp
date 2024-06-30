import { useEffect, useState, lazy, Suspense } from "react";
import useInviteUsers from "../hooks/useInviteUsers";
import SideBarHeader from "./SideBarHeader";
import Spinner from "./Spinner";
import notificationSound from "/sounds/notification.mp3";

const FriendsBox = lazy(() => import("../features/friend/FriendsBox"));
const InviteBox = lazy(() => import("../features/invitation/InviteBox"));
const NotificationBox = lazy(
  () => import("../features/notification/NotificationBox"),
);

function SideBar({ socket, className, onlineFriends }) {
  const [tab, setTab] = useState("chat");
  const { getInvitations, invitations, setInvitations, isLoading, error } =
    useInviteUsers();
  const invitationsLength = invitations.filter(
    (inv) => inv.fromMe !== true,
  ).length;

  // Get invitations In First Render
  useEffect(() => {
    getInvitations();
  }, []);
  // Realtime Invitations
  useEffect(() => {
    const handleInvitation = (data) => {
      if (data.type === "sent") {
        data.type = undefined;
        setInvitations((cur) => [data, ...cur]);
        const sound = new Audio(notificationSound);
        sound.play();
      } else if (data.type === "accept") {
        data.type = undefined;
        setInvitations((cur) =>
          cur.map((inv) =>
            inv.to === data.to ? { ...inv, accepted: true } : inv,
          ),
        );
      } else if (data.type === "cancel") {
        data.type = undefined;
        setInvitations((cur) =>
          cur.filter((invitation) => invitation.from !== data.from),
        );
      } else {
        data.type = undefined;
        setInvitations((cur) =>
          cur.filter((invitation) => invitation.to !== data.to),
        );
      }
    };

    socket.on("getInvitation", handleInvitation);

    return () => {
      socket.off("getInvitation", handleInvitation);
    };
  }, [socket]);

  return (
    <aside
      className={`flex h-screen flex-col overflow-hidden bg-slate-50 text-slate-700 ${className}`}
    >
      <SideBarHeader
        socket={socket}
        setTab={setTab}
        invitationsLength={invitationsLength}
      />
      <Suspense fallback={<Spinner />}>
        {tab === "chat" && (
          <FriendsBox socket={socket} onlineFriends={onlineFriends} />
        )}
        {tab === "add" && (
          <InviteBox socket={socket} setInvitations={setInvitations} />
        )}
        {tab === "notification" && (
          <NotificationBox
            socket={socket}
            invitations={invitations}
            setInvitations={setInvitations}
            isLoading={isLoading}
            getInvitations={getInvitations}
            error={error}
          />
        )}
      </Suspense>
    </aside>
  );
}

export default SideBar;
