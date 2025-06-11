import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Outlet,
  useParams,
} from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import Header from "./components/Header";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyPage from "./pages/Verify";
import PostList from "./pages/PostList";
import PostEditor from "./pages/PostEditor";
import RequireAuth from "./guard/requireAuth";
import PostDetail from "./pages/PostDetail";
import CommentPane from "./components/CommentPane";

function PostWithComments() {
  const { id } = useParams<{ id: string }>();
  return (
    <>
      <PostDetail />
      <CommentPane postId={id!} />
    </>
  );
}

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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<HeaderLayout />}>
      {/* Home */}
      <Route index element={<PostList />} />

      {/* Auth pages */}
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="verify/:token" element={<VerifyPage />} />

      {/* Protected: new posts */}
      <Route
        path="new"
        element={
          <RequireAuth>
            <PostEditor />
          </RequireAuth>
        }
      />

      {/* Post detail + comments */}
      <Route path=":id" element={<PostWithComments />} />
    </Route>
  )
);

export default function AppRouter() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
