import {  NoDataIcon } from "./Vectors";

function NoData({ message }) {
  return (
    <p className="flex items-center justify-center gap-1 border py-2">
      <span>
        <NoDataIcon />
      </span>
      <span className="mt-0.5 text-sm font-medium text-slate-500">
        {message}
      </span>
    </p>
  );
}

export default NoData;
