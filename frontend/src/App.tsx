import { Routes, Route } from "react-router-dom";

import PublicLayout from "./components/layout/PublicLayout";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ProfilePage from "./pages/auth/ProfilePage";

export default function App() {
    return (
        <Routes>
            <Route element={<PublicLayout />}>
                <Route path="/" element={<LandingPage />} />
                
                {/* Public */}
                <Route path="/courses" element={<h1>Courses</h1>} />
                <Route path="/courses/:id" element={<h1>Course Details</h1>} />
                
                {/* Authentication */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/my-profile" element={<ProfilePage />} />

                {/* Student */}
                <Route path="/student/dashboard" element={<h1>Student Dashboard</h1>} />
                <Route path="/student/my-courses" element={<h1>My Courses</h1>} />

                {/* Professor */}
                <Route path="/professor/dashboard" element={<h1>Professor Dashboard</h1>} />
                <Route path="/professor/courses" element={<h1>Professor Courses</h1>} />
                <Route path="/professor/courses/:id" element={<h1>Assigned Course Details</h1>} />

                {/* Admin */}
                <Route path="/admin/dashboard" element={<h1>Admin Dashboard</h1>} />
                <Route path="/admin/users" element={<h1>Users</h1>} />
                <Route path="/admin/courses" element={<h1>Courses Management</h1>} />

                {/* 404 */}
                <Route
                    path="*"
                    element={
                        <div className="flex h-screen items-center justify-center">
                            <h1 className="text-3xl font-bold">404 | Page Not Found</h1>
                        </div>
                    }
                />
            </Route>
        </Routes>
    );
}