import { useEffect, useState } from "react";
import Invitation from "./Invitation";
import Loader from "../../ui/Loader";
import Error from "../../ui/Error";
import NoData from "../../ui/NoData";

function NotificationBox({
  socket,
  invitations,
  setInvitations,
  isLoading,
  getInvitations,
  error: getInvitationsError,
  setOnlineFriends,
}) {
  const [error, setError] = useState(false);

  // Get Invitations
  useEffect(() => {
    getInvitations();
  }, []);

  return (
    <aside
      className={`mt-3 flex flex-1 flex-col overflow-auto px-3 pb-2 sm:p-5 sm:pt-0`}
    >
      {isLoading ? (
        <Loader center={false} />
      ) : getInvitationsError ? (
        <Error message={getInvitationsError} center={true} />
      ) : invitations.length ? (
        <>
          {error && <Error message="Error, try again later" center={true} />}

          <ul>
            {invitations.map((inv) => (
              <Invitation
                invitation={inv}
                key={`${inv.from}${inv.to}`}
                setInvitations={setInvitations}
                socket={socket}
                setError={setError}
                setOnlineFriends={setOnlineFriends}
              />
            ))}
          </ul>
        </>
      ) : (
        <NoData message="No invitations!" />
      )}
    </aside>
  );
}

export default NotificationBox;
