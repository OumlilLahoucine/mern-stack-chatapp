import { useState } from "react";
import NewFriend from "./NewFriend";
import Error from "../../ui/Error";

function NewFriends({ users, socket, setInvitations }) {
  const [error, setError] = useState(false);
  return (
    <div className="flex-1 overflow-auto whitespace-nowrap">
      {error && <Error message="Error, try again later" center={true} />}
      <ul className="flex flex-col gap-2 sm:gap-2">
        {users?.map((user) => (
          <NewFriend
            user={user}
            key={user._id}
            socket={socket}
            setInvitations={setInvitations}
            setError={setError}
          />
        ))}
      </ul>
    </div>
  );
}

export default NewFriends;
