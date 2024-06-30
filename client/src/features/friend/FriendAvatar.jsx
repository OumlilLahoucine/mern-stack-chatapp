import { memo } from "react";

function FriendAvatar({ image, username, isOnline, small = false }) {
  const imageUrl = image
    ? `http://127.0.0.1:3000/images/profile/${image}`
    : "images/avatar.png";
  return (
    <div className={`relative ${small ? "h-10 w-10" : "h-12 w-12"}`}>
      <img
        crossOrigin="anonymous"
        src={imageUrl}
        alt={username}
        className="h-full w-full rounded-full object-cover"
      />
      {isOnline && (
        <span className="absolute bottom-0 right-0 inline-block h-3 w-3 rounded-full border-2 border-white bg-primary"></span>
      )}
    </div>
  );
}

export default memo(FriendAvatar);
