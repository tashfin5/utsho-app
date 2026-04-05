import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import Schedule from './pages/Schedule';
import StudyResources from './pages/StudyResources';
import NoticeBoard from './pages/NoticeBoard';
import AttendanceTracker from './pages/AttendanceTracker';

// --- NEW IMPORTS ADDED HERE ---
import Students from './pages/Students';
import Teachers from './pages/Teachers';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/resources" element={<StudyResources />} />
        <Route path="/notices" element={<NoticeBoard />} />
        <Route path="/attendance" element={<AttendanceTracker />} />
        
        {/* --- NEW ROUTES ADDED HERE --- */}
        <Route path="/students" element={<Students />} />
        <Route path="/teachers" element={<Teachers />} />
      </Routes>
    </Router>
  );
}

export default App;