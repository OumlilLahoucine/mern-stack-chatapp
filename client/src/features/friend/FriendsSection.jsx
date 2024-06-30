import { memo } from "react";

function FriendsSection({ title, icon = false, iconAction = null, children }) {
  return (
    <div className="mb-4 sm:mb-5">
      <div className="mb-2 flex items-center justify-between sm:mb-3">
        <h1 className="text-lg font-semibold capitalize">{title}</h1>
        {icon && <button onClick={iconAction}>{icon}</button>}
      </div>
      {children}
    </div>
  );
}

export default memo(FriendsSection);
