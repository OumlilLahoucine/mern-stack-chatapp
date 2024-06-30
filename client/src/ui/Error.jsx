import { ErrorIcon } from "./Vectors";

function Error({
  message,
  center = false,
  form = false,
  forMessage = false,
  withBM = true,
}) {
  return (
    <div
      className={`${center ? "flex items-center justify-center rounded-md border border-danger bg-red-100 px-2 py-2" : ""} ${form && "-mt-2"} ${forMessage && "mb-8 mt-8"} ${withBM && "mb-4"}`}
    >
      <p
        className={`flex gap-1 text-sm font-normal text-red-500 ${!center && "items-center"}`}
      >
        <span className={`${center ? "mt-1" : ""}`}>
          <ErrorIcon />
        </span>
        <span className="m-0 ml-0.5 pt-1 text-start">{message}</span>
      </p>
    </div>
  );
}

export default Error;
