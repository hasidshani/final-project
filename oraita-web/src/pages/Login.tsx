import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // If the user was redirected here from a protected page, go back there after login
    const from = (location.state as any)?.from?.pathname || '/dashboard';

    const handleSubmit = async (e: { preventDefault(): void }) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data } = await api.post('/users/login', { email, password });

            // Save tokens + user into AuthContext (also stores in localStorage)
            login(data.user, data.accessToken, data.refreshToken);

            // Navigate to dashboard (or the page they were trying to reach)
            navigate(from, { replace: true });

        } catch (err: any) {
            setError(err.response?.data?.message || 'שגיאה בשרת, נסו שוב');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-bg">
            <div className="login-container">
                <div className="login-header">
                    <div className="logo-box">✡</div>
                    <h1 className="logo-text">אורייתא</h1>
                    <h2>ברוכים השבים</h2>
                    <p>היכנסו כדי להמשיך את מסע הלמידה שלכם</p>
                </div>

                <div className="login-card">
                    {/* Inline error message instead of alert() */}
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>כתובת אימייל</label>
                            <div className="input-wrapper">
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <span className="input-icon">✉️</span>
                            </div>
                        </div>

                        <div className="input-group">
                            <label>סיסמה</label>
                            <div className="input-wrapper">
                                <input
                                    type="password"
                                    placeholder="........"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <span className="input-icon">🔒</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-login"
                            disabled={loading}
                        >
                            {loading ? 'מתחבר...' : 'התחברו'}
                        </button>
                    </form>
                </div>

                <div className="login-footer">
                    <span>
                        אין לכם חשבון?{' '}
                        <a href="/register">הירשמו</a>
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Login;
