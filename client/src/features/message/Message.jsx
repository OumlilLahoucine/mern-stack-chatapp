import { useState } from "react";
import {
  CopyIcon,
  NotYetViewIcon,
  VerticalMenuIcon,
  ViewIcon,
  NotYetDeliveredIcon,
} from "../../ui/Vectors";
import convertTime from "../../utils/convertTime";

function Message({ message, received }) {
  const { content, createdAt, status } = message;
  const [showOptions, setShowOptions] = useState(false);
  let style = "";
  if (received) style = "rounded-br-lg bg-slate-200 text-slate-500";
  else style = "rounded-bl-lg bg-slate-100 text-slate-500";
  return (
    <li className={`flex ${received ? "justify-start" : "justify-end"}`}>
      <div className="min-w-32 max-w-[83%]">
        <div
          className={`relative  rounded-t-lg bg-primary p-4 pt-2 font-medium ${style}`}
        >
          <p className="mb-4 break-words">{content}</p>
          <div className="absolute bottom-2 right-3 flex items-center gap-[2px]">
            {!received && status === "sent" && <NotYetDeliveredIcon />}
            {!received && status === "delivered" && <NotYetViewIcon />}
            {!received && status === "read" && <ViewIcon />}

            <span className="text-xs">{convertTime(createdAt)}</span>
          </div>

          <button
            className={`absolute top-1 ${received ? "-right-5" : "-left-5"}`}
            onClick={() => {
              setShowOptions((cur) => !cur);
            }}
          >
            <VerticalMenuIcon />
          </button>
        </div>
        {showOptions && <Options />}
      </div>
    </li>
  );
}

function Options() {
  return (
    <ul className="flex w-36 flex-col gap-3 rounded-b-lg border border-slate-200 bg-white p-2 text-sm font-medium text-slate-700 shadow-sm">
      <li className="flex items-center gap-2">
        <CopyIcon /> Copy
      </li>
      <li>Delete</li>
    </ul>
  );
}
export default Message;
