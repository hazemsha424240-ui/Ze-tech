// مكوّن Header: اللوجو وروابط التنقل (روابط الموقع العام، أو رابط View website في صفحات الأدمن)
import { Link } from 'react-router-dom';

export default function Header({ variant }) {
  return (
    <header className="top">
      <div className="wrap">
        <Link className="logo" to="/"><i>Z</i>Ze tech</Link>
        {variant === 'public' && (
          <nav>
            <a href="#services">Services</a>
            <a href="#about">About</a>
            <a href="#why">Why us</a>
            <a href="#contact">Contact</a>
            <Link className="adm" to="/login">Admin</Link>
          </nav>
        )}
        {variant === 'admin' && (
          <nav><Link to="/">View website</Link></nav>
        )}
      </div>
    </header>
  );
}
