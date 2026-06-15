import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateLesson from './pages/CreateLesson';
import AllLessons from './pages/AllLessons';
import SingleLesson from './pages/SingleLesson';
import TeacherProfile from './pages/TeacherProfile';
import NotFound from './pages/NotFound';

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Home page */}
                <Route
                    path="/"
                    element={<Home />}
                />

                {/* Login page */}
                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* Register page */}
                <Route
                    path="/register"
                    element={<Register />}
                />

                {/* Dashboard page */}
                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                {/* All lessons page */}
                <Route
                    path="/all-lessons"
                    element={<AllLessons />}
                />

                {/* Create lesson page */}
                <Route
                    path="/create-lesson"
                    element={<CreateLesson />}
                />

                {/* Single lesson page */}
                <Route
                    path="/lesson"
                    element={<SingleLesson />}
                />

                {/* Teacher profile page */}
                <Route
                    path="/teacher-profile"
                    element={<TeacherProfile />}
                />

                {/* 404 page */}
                <Route
                    path="*"
                    element={<NotFound />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;