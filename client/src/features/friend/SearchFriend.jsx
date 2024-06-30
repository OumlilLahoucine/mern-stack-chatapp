import { useEffect, useRef, memo } from "react";
import { CloseIcon, SearchIcon } from "../../ui/Vectors";

function SearchFriend({ addFriend, query, setQuery }) {
  const input = useRef(null);
  // useEffect(() => {
  //   input.current.focus();
  // }, [query]);
  useEffect(() => {
    setQuery("");
  }, [addFriend]);

  return (
    <div className="flex items-center gap-3 rounded-xl border-2 border-transparent bg-white px-5 py-4 shadow-sm focus-within:border-2 focus-within:border-primary focus-within:outline-none focus-within:ring-4 focus-within:ring-primary focus-within:ring-opacity-30">
      <input
        type="text"
        spellCheck="false"
        className="w-full border-0 bg-transparent font-medium text-slate-600 outline-none placeholder:font-normal placeholder:text-slate-500"
        placeholder={
          addFriend ? "Search for new friends" : "Search friends or messages"
        }
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        ref={input}
      />

      {query && (
        <button onClick={() => setQuery("")}>
          <CloseIcon />
        </button>
      )}
      <button>
        <SearchIcon />
      </button>
    </div>
  );
}

export default memo(SearchFriend);
