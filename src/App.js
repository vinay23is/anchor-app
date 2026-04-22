import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Requests from "./pages/Requests";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import BottomNav from "./components/BottomNav";
import Cursor from "./components/Cursor";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <>
      <Routes>
        <Route path="/login"   element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/"        element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
        <Route path="/chat/:chatId" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
      {user && <BottomNav />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Cursor />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
