import { Routes, Route } from "react-router-dom";

import PublicLayout from "./components/layout/PublicLayout";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ProfilePage from "./pages/auth/ProfilePage";
import CoursesPage from "./pages/courses/CoursesPage";
import CourseDetailsPage from "./pages/courses/CourseDetailsPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
    return (
        <Routes>
            <Route element={<PublicLayout />}>
                <Route path="/" element={<LandingPage />} />
                
                {/* Public */}
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/courses/:id" element={<CourseDetailsPage />} />
                
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
                    element={<NotFoundPage />}
                />
            </Route>
        </Routes>
    );
}