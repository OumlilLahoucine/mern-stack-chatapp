import { useState } from "react";
import FriendsSection from "../friend/FriendsSection";
import SearchFriend from "../friend/SearchFriend";
import NewFriends from "./NewFriends";
import useSearchForNewUsers from "../../hooks/useSearchForNewUsers";
import Loader from "../../ui/Loader";
import Error from "../../ui/Error";
import NoData from "../../ui/NoData";

function InviteBox({ socket, setInvitations }) {
  const [query, setQuery] = useState("");
  const { users, isLoading, error } = useSearchForNewUsers(query);

  return (
    <div
      className={`mt-3 flex flex-1 flex-col overflow-auto px-3 pb-2 sm:p-5 sm:pt-0`}
    >
      <FriendsSection title="new friends">
        <SearchFriend addFriend={true} query={query} setQuery={setQuery} />
      </FriendsSection>
      {query ? (
        isLoading ? (
          <Loader center={false} />
        ) : error ? (
          <Error message={error} center={true} />
        ) : users.length ? (
          <NewFriends
            users={users}
            socket={socket}
            setInvitations={setInvitations}
          />
        ) : (
          <NoData message="User not found!" />
        )
      ) : null}
    </div>
  );
}

export default InviteBox;
