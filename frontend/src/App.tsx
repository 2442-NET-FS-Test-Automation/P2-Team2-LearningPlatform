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

export default function App() {
    return (
        <Routes>
            <Route element={<PublicLayout />}>
                <Route path="/" element={<LandingPage />} />
                
                {/* Public */}
                <Route path="/courses" element={<CoursesPage />} />
                
                {/* Authentication */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Student */}
                <Route path="/student/dashboard" element={<StudentDashboardPage />} />
                <Route path="/courses/:id" element={<CourseDetailsPage />} />

                {/* Professor */}
                <Route path="/professor/dashboard" element={<ProfessorDashboardPage />} />

                {/* Admin */}
                <Route path="/manager/dashboard" element={<ManagerDashboardPage />} />

                {/* 404 */}
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
    );
}