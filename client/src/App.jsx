import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import UploadStudents from "./pages/UploadStudents";
import LateEntries from "./pages/LateEntries";
import MarkLate from "./pages/MarkLate";

const RedirectHome = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "SECURITY") return <Navigate to="/mark-late" replace />;
  return <Navigate to="/dashboard" replace />;
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected with layout */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["ADMIN", "STAFF"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/students"
              element={
                <ProtectedRoute allowedRoles={["ADMIN", "STAFF"]}>
                  <Students />
                </ProtectedRoute>
              }
            />
            <Route
              path="/upload"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <UploadStudents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/late-entries"
              element={
                <ProtectedRoute allowedRoles={["ADMIN", "STAFF"]}>
                  <LateEntries />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mark-late"
              element={
                <ProtectedRoute allowedRoles={["SECURITY"]}>
                  <MarkLate />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<RedirectHome />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
