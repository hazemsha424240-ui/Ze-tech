// ProtectedRoute: بيحوّل الزائر اللي معندوش توكن تسجيل دخول لصفحة الدخول
import { Navigate } from 'react-router-dom';
import { hasToken } from '../services/api';

export default function ProtectedRoute({ children }) {
  return hasToken() ? children : <Navigate to="/login" replace />;
}
