import { Navigate, Route, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import AdminDashboard from './pages/AdminDashboard';
import CharityMedical from './pages/CharityMedical';
import Home from './pages/Home';
import Library from './pages/Library';
import Login from './pages/Login';
import MemberDashboard from './pages/MemberDashboard';
import SportsEvents from './pages/SportsEvents';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Navbar />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/library" element={<Library />} />
        <Route path="/sports-events" element={<SportsEvents />} />
        <Route path="/charity-medical" element={<CharityMedical />} />
        <Route path="/login" element={<Login />} />
        <Route path="/member" element={<MemberDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </div>
  );
}
