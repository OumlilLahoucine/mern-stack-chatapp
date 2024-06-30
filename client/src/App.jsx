import { lazy, Suspense } from "react";
// import dotenv from "dotenv";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/auth";
import { SelectedProvider } from "./contexts/selected";
import Spinner from "./ui/Spinner";

const Login = lazy(() => import("./features/auth/Login"));
const SignUp = lazy(() => import("./features/auth/SignUp"));
const AppLayout = lazy(() => import("./ui/AppLayout"));

function App() {
  const { isAuth } = useAuth();
  return (
    <BrowserRouter>
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route
            path="/"
            element={
              isAuth ? (
                <SelectedProvider>
                  <AppLayout />
                </SelectedProvider>
              ) : (
                <Navigate to="login" replace={true} />
              )
            }
          />
          <Route
            path="login"
            element={isAuth ? <Navigate to="/" replace={true} /> : <Login />}
          />
          <Route
            path="register"
            element={isAuth ? <Navigate to="/" replace={true} /> : <SignUp />}
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
