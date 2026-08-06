import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import PrivateRoute from './components/PrivateRoute';

// Lazy-loaded pages — each page loads only when navigated to
const Home          = lazy(() => import('./pages/HomePage'));
const Login         = lazy(() => import('./pages/Login'));
const Register      = lazy(() => import('./pages/Register'));
const Dashboard     = lazy(() => import('./pages/Dashboard'));
const Profile       = lazy(() => import('./pages/Profile'));
const CreateLesson  = lazy(() => import('./pages/CreateLesson'));
const AllLessons    = lazy(() => import('./pages/AllLessons'));
const SingleLesson  = lazy(() => import('./pages/SingleLesson'));
const TeacherProfile = lazy(() => import('./pages/TeacherProfile'));
const About          = lazy(() => import('./pages/AboutPage'));
const NotFound      = lazy(() => import('./pages/NotFound'));

function App() {
    return (
        <BrowserRouter>
            <Suspense fallback={<div className="text-center p-5">טוען...</div>}>
                <Routes>

                    {/* Public routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/alllessons" element={<AllLessons />} />
                    <Route path="/lesson/:id" element={<SingleLesson />} />
                    <Route path="/teacherprofile/:id" element={<TeacherProfile />} />
                    <Route path="/about" element={<About />} />

                    {/* Protected routes — require login */}
                    <Route path="/dashboard" element={
                        <PrivateRoute><Dashboard /></PrivateRoute>
                    } />
                    <Route path="/profile" element={
                        <PrivateRoute><Profile /></PrivateRoute>
                    } />
                    <Route path="/createlesson" element={
                        <PrivateRoute><CreateLesson /></PrivateRoute>
                    } />
                    <Route path="/editlesson/:id" element={
                        <PrivateRoute><CreateLesson /></PrivateRoute>
                    } />

                    {/* 404 */}
                    <Route path="*" element={<NotFound />} />

                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}

export default App;
