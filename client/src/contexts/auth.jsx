import Cookies from "js-cookie";
import { createContext, useContext, useEffect, useReducer } from "react";
import axios from "axios";
const AuthContext = createContext();

const initialState = {
  isAuth: false,
  user: null, // user = {token, username, image}
  isLoading: false,
  error: "",
};

const URL = process.env.REACT_APP_PROXY;
const AUTH_URL = `${URL}/api/v1/auth`;

function reducer(state, action) {
  switch (action.type) {
    case "user/store":
      return { ...state, isAuth: true, user: action.payload, isLoading: false };
    case "user/logout":
      return { ...state, isAuth: false, user: null };
    case "user/error":
      return { ...state, error: action.payload, isLoading: false };
    case "user/loading":
      return { ...state, isLoading: true, error: "" };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const user = Cookies.get("user");
    if (user) {
      dispatch({ type: "user/store", payload: JSON.parse(user) });
    }
  }, []);

  async function register(body) {
    dispatch({ type: "user/loading" });
    // try {

    try {
      const res = await axios.post(`${AUTH_URL}/register`, body, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const result = res.data;
      // if (result.status !== "success") throw Error(result.message);

      // Store in Cookies
      Cookies.set("user", JSON.stringify(result.data), {
        expires: 1,
        path: "",
      });
      //   // Store in reducer
      dispatch({ type: "user/store", payload: result.data });
    } catch (err) {
      dispatch({ type: "user/error", payload: err.response.data.message });
    }
  }

  async function login(body) {
    dispatch({ type: "user/loading" });
    console.log(`${AUTH_URL}/login`)
    try {
      const res = await fetch(`${AUTH_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await res.json();
      if (result.status !== "success") throw Error(result.message);

      // Store in Cookies
      Cookies.set("user", JSON.stringify(result.data), {
        expires: 1,
        path: "",
      });
      // Store in reducer
      dispatch({ type: "user/store", payload: result.data });
    } catch (err) {
      console.log(err);
      dispatch({ type: "user/error", payload: err.message });
    }
  }

  function logout(socket) {
    // Remove user from socket
    socket.emit("logout", state.user._id);
    // Remove user from Cookies
    Cookies.remove("user", { path: "" });
    // Remove user in reducer
    dispatch({ type: "user/logout" });
  }

  return (
    <AuthContext.Provider
      value={{ ...state, register, login, logout, dispatch }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined)
    throw Error("Context used outside of the provider");

  return context;
}
