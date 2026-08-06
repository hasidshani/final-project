import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
    const { user, logout, pendingMatchCount } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = async () => {
        setMenuOpen(false);
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
        <nav className="navbar navbar-expand-lg bg-white border-bottom px-4 py-3">
            <Link to="/" className="navbar-brand fw-bold fs-5 text-dark text-decoration-none" onClick={() => setMenuOpen(false)}>
                אורייתא ✡
            </Link>

            {/* Hamburger — hidden at lg and up, where the menu is always shown inline */}
            <button
                type="button"
                className="navbar-toggler"
                aria-label="פתיחת תפריט"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen(open => !open)}
            >
                <span className="navbar-toggler-icon"></span>
            </button>

            {/* Links + auth actions — collapses into a stacked dropdown below lg.
                Uses justify-content-lg-between (not an ms-/me-auto margin
                utility) to split the two groups apart, since justify-content
                genuinely respects dir="rtl" — this project's plain (non-RTL)
                bootstrap.min.css compiles ms-/me- utilities to hard-coded
                physical margin-left/margin-right, which doesn't. */}
            <div className={`navbar-collapse ${menuOpen ? 'show' : 'collapse'}`}>
                <div className="d-flex flex-column flex-lg-row justify-content-lg-between align-items-lg-center gap-3 gap-lg-4 w-100 mt-3 mt-lg-0">
                    <ul className="navbar-nav list-unstyled d-flex flex-column flex-lg-row gap-2 gap-lg-3 mb-0">
                        {navLinks.map(link => (
                            <li className="nav-item" key={link.to}>
                                <Link
                                    to={link.to}
                                    className="nav-link text-muted fw-semibold position-relative"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    {link.label}
                                    {link.badge > 0 && (
                                        <span className="badge rounded-pill bg-danger ms-1">{link.badge}</span>
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center gap-3">
                        {user ? (
                            <>
                                <Link
                                    to="/createlesson"
                                    className="btn btn-gold btn-sm text-decoration-none"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    יצירת שיעור ⊕
                                </Link>
                                <Link
                                    to="/profile"
                                    className="text-muted small text-decoration-none"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    שלום, {user.name} ⚙️
                                </Link>
                                <button onClick={handleLogout} className="btn btn-outline-secondary btn-sm">
                                    התנתקות
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>
                                התחברות 👤
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
