import { Routes, Route } from "react-router-dom";

import PublicLayout from "./components/layout/PublicLayout";
import LandingPage from "./pages/LandingPage";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

import CoursesPage from "./pages/courses/CoursesPage";
import CourseDetailsPage from "./pages/courses/CourseDetailsPage";

import StudentDashboardPage from "./pages/dashboard/StudentDashboardPage";
import ProfessorDashboardPage from "./pages/dashboard/ProfessorDashboardPage";
import ManagerDashboardPage from "./pages/dashboard/ManagerDashboardPage";

import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import UnauthorizedPage from "./pages/UnauthorizedPage";

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

                {/* Student */}
                <Route element={<ProtectedRoute allowedRoles={["Student"]} />}>
                    <Route path="/student/dashboard" element={<StudentDashboardPage />} />
                </Route>

                {/* Professor */}
                <Route element={<ProtectedRoute allowedRoles={["Professor"]} />}>
                    <Route path="/professor/dashboard" element={<ProfessorDashboardPage />} />
                    
                </Route>

                {/* Admin */}
                <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
                    <Route path="/manager/dashboard" element={<ManagerDashboardPage />} />
                </Route>

                {/* 401 */}
                <Route path="/unauthorized" element={<UnauthorizedPage />} />

                {/* 404 */}
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
    );
}