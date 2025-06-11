import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
    Outlet
  } from "react-router-dom";
  import React from "react";
  import { AuthProvider } from "./hooks/useAuth";
  import Header from "./components/Header";
  import Login from "./pages/Login";
  import Register from "./pages/Register";
  import VerifyNotice from "./pages/VerifyNotice";
  import PostList from "./pages/PostList";
  import RequireAuth from "./guard/requireAuth";
  import PostEditor from "./pages/PostEditor";  
  import PostDetail from "./pages/PostDetail";   
  import VerifyPage from "./pages/Verify";
  
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<HeaderLayout />}>
        <Route index element={<PostList />} />
  
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="verify/:token" element={<VerifyPage />} />
  
        <Route
          path="new"
          element={
            <RequireAuth>
              <PostEditor />
            </RequireAuth>
          }
        />
        <Route path=":id" element={<PostDetail />} />
      </Route>
    )
  );
  
  function HeaderLayout() {
    return (
      <>
        <Header />
        <div className="p-4">
          <Outlet />
        </div>
      </>
    );
  }
  
  export default function AppRouter() {
    return (
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    );
  }
  