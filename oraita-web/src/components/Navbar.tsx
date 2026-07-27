import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
    const { user, logout, pendingMatchCount } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    // Nav links rendered with .map() — dashboard only shown when logged in.
    // The dashboard link carries a badge count when there are pending
    // incoming match requests, so they're discoverable without a full
    // notification system. The count comes from AuthContext (fetched once
    // per session) rather than a hook here — Navbar remounts on every route
    // change, so a fetch here would refire on every single navigation.
    const navLinks = [
        { to: '/', label: 'דף הבית', badge: 0 },
        { to: '/about', label: 'אודות', badge: 0 },
        { to: '/alllessons', label: 'כל השיעורים', badge: 0 },
        ...(user ? [{ to: '/dashboard', label: 'לוח בקרה', badge: pendingMatchCount }] : []),
    ];

    return (
        <nav className="navbar bg-white border-bottom px-4 py-3">
            <div className="d-flex justify-content-between align-items-center w-100">

                {/* Right side — logo + links */}
                <div className="d-flex align-items-center gap-4">
                    <Link to="/" className="fw-bold fs-5 text-dark text-decoration-none">
                        אורייתא ✡
                    </Link>
                    <ul className="list-unstyled d-flex gap-3 mb-0">
                        {navLinks.map(link => (
                            <li key={link.to}>
                                <Link to={link.to} className="nav-link text-muted fw-semibold position-relative">
                                    {link.label}
                                    {link.badge > 0 && (
                                        <span className="badge rounded-pill bg-danger ms-1">{link.badge}</span>
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Left side — auth actions */}
                <div className="d-flex align-items-center gap-3">
                    {user ? (
                        <>
                            <Link to="/createlesson" className="btn btn-gold btn-sm text-decoration-none">
                                יצירת שיעור ⊕
                            </Link>
                            <span className="text-muted small">שלום, {user.name}</span>
                            <button onClick={handleLogout} className="btn btn-outline-secondary btn-sm">
                                התנתקות
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="nav-link">התחברות 👤</Link>
                    )}
                </div>

            </div>
        </nav>
    );
}

export default Navbar;
