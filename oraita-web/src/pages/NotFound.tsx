import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center text-center px-3">

            {/* Logo */}
            <Link
                to="/"
                className="fw-bold fs-5 text-dark text-decoration-none position-absolute"
                style={{ top: 24, right: '8%' }}
            >
                אורייתא ✡
            </Link>

            {/* Error content */}
            <div className="fs-1 mb-3">📖</div>
            <h1 className="fw-bold mb-2" style={{ fontSize: '2.5rem' }}>הדף לא נמצא</h1>
            <p className="text-muted mb-4" style={{ maxWidth: 480, fontSize: '1.1rem', lineHeight: 1.6 }}>
                הדף שחיפשתם אינו קיים או שאין לכם הרשאה לצפות בו.
            </p>

            <div className="d-flex gap-3 flex-wrap justify-content-center">
                <Link to="/" className="btn btn-dark px-4 py-2 fw-bold">
                    חזרה לדף הבית ←
                </Link>
                <Link to="/register" className="btn btn-outline-dark px-4 py-2 fw-bold">
                    להרשמה - לחצו כאן
                </Link>
            </div>

        </div>
    );
}

export default NotFound;
