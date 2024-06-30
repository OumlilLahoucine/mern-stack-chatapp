import { memo } from "react";
import { useEffect, useRef } from "react";
import OnlineFriend from "./OnlineFriend";

function OnlineFriends({ onlineFriends }) {
  const container = useRef(null);

  let isDragging = false;
  let startX;
  let scrollLeft;

  // Dragging
  useEffect(() => {
    const onMouseDown = (e) => {
      isDragging = true;
      startX = e.pageX - container.current.offsetLeft;
      scrollLeft = container.current.scrollLeft;
      container.current.style.cursor = "pointer";
    };
    const onMouseLeaveAndUp = () => {
      isDragging = false;
      container.current.style.cursor = "default";
    };
    const onmouseMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - container.current.offsetLeft;
      const walk = (x - startX) * 1.5; // Adjust scroll speed
      container.current.scrollLeft = scrollLeft - walk;
    };

    container.current.addEventListener("mousedown", onMouseDown);
    container.current.addEventListener("mouseleave", onMouseLeaveAndUp);
    container.current.addEventListener("mouseup", onMouseLeaveAndUp);
    container.current.addEventListener("mousemove", onmouseMove);

    return () => {
      container.current?.removeEventListener("mousedown", onMouseDown);
      container.current?.removeEventListener("mouseleave", onMouseLeaveAndUp);
      container.current?.removeEventListener("mouseup", onMouseLeaveAndUp);
      container.current?.removeEventListener("mousemove", onmouseMove);
    };
  }, []);

  return (
    <ul
      ref={container}
      className="flex w-auto items-center gap-6 overflow-x-scroll"
    >
      {onlineFriends.map((friend) => (
        <OnlineFriend friend={friend} key={friend._id} />
      ))}
    </ul>
  );
}

export default memo(OnlineFriends);
