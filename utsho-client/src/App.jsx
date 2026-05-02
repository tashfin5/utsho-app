import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { App as CapacitorApp } from '@capacitor/app';

import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import Schedule from './pages/Schedule';
import StudyResources from './pages/StudyResources';
import NoticeBoard from './pages/NoticeBoard';
import AttendanceTracker from './pages/AttendanceTracker';

import Students from './pages/Students';
import Teachers from './pages/Teachers';

// ✅ NEW IMPORT
import ProtectedRoute from './components/ProtectedRoute';

function App() {

  useEffect(() => {
    const handleBackButton = async () => {
      await CapacitorApp.addListener('backButton', () => {
        const currentPath = window.location.pathname.toLowerCase();

        // List the paths where pressing 'back' should minimize the app
        const exitPaths = ['/', '/login', '/admindashboard', '/studentdashboard', '/teacherdashboard'];

        if (exitPaths.includes(currentPath)) {
          // If on a dashboard or login, minimize the app
          CapacitorApp.minimizeApp();
        } else {
          // Otherwise, just go back to the previous page in the app
          window.history.back();
        }
      });
    };

    handleBackButton();

    // Cleanup listener just in case
    return () => {
      CapacitorApp.removeAllListeners();
    };
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Protected Routes */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        <Route path="/teacher" element={
          <ProtectedRoute>
            <TeacherDashboard />
          </ProtectedRoute>
        } />

        <Route path="/student" element={
          <ProtectedRoute>
            <StudentDashboard />
          </ProtectedRoute>
        } />

        <Route path="/schedule" element={
          <ProtectedRoute>
            <Schedule />
          </ProtectedRoute>
        } />

        <Route path="/resources" element={
          <ProtectedRoute>
            <StudyResources />
          </ProtectedRoute>
        } />

        <Route path="/notices" element={
          <ProtectedRoute>
            <NoticeBoard />
          </ProtectedRoute>
        } />

        <Route path="/attendance" element={
          <ProtectedRoute>
            <AttendanceTracker />
          </ProtectedRoute>
        } />

        <Route path="/students" element={
          <ProtectedRoute>
            <Students />
          </ProtectedRoute>
        } />

        <Route path="/teachers" element={
          <ProtectedRoute>
            <Teachers />
          </ProtectedRoute>
        } />

      </Routes>
    </Router>
  );
}

export default App;