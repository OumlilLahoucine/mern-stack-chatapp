import { useSelected } from "../../contexts/selected";
import FriendAvatar from "./FriendAvatar";

function OnlineFriend({ friend }) {
  const { setSelectedUser } = useSelected();

  const username = friend.username.split("").slice(0, 5).join("") + ".";
  return (
    <li className="overflow-none w-12">
      <button onClick={() => setSelectedUser(friend)}>
        <FriendAvatar
          image={friend.image}
          username={friend.username}
          isOnline={true}
        />
        <p className="mt-1 text-sm font-medium text-slate-500">{username}</p>
      </button>
    </li>
  );
}

export default OnlineFriend;
