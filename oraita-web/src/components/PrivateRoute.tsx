import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { ReactNode } from 'react';

function PrivateRoute({ children }: { children: ReactNode }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    // While checking auth on page refresh, show a spinner instead of a blank
    // screen — this check can take tens of seconds against a cold-started
    // Render backend, which otherwise reads as a stuck/broken page.
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <div className="spinner-border" style={{ color: 'var(--gold)' }} role="status">
                    <span className="visually-hidden">טוען...</span>
                </div>
            </div>
        );
    }

    // Not logged in — redirect to login, saving where the user wanted to go
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}

export default PrivateRoute;
