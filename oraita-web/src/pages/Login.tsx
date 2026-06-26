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

    // If redirected from a protected page, return there after login
    const from = (location.state as any)?.from?.pathname || '/dashboard';

    const handleSubmit = async (e: { preventDefault(): void }) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { data } = await api.post('/users/login', { email, password });
            login(data.user, data.accessToken, data.refreshToken);
            navigate(from, { replace: true });
        } catch (err: any) {
            setError(err.response?.data?.message || 'שגיאה בשרת, נסו שוב');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex justify-content-center align-items-center">
            <div style={{ width: '100%', maxWidth: '460px', padding: '20px' }}>

                <div className="text-center mb-4">
                    <div
                        className="d-inline-flex align-items-center justify-content-center rounded-3 mb-3"
                        style={{ width: 50, height: 50, background: '#D4A373', fontSize: '1.5rem' }}
                    >
                        ✡
                    </div>
                    <h2 className="fw-bold">ברוכים השבים</h2>
                    <p className="text-muted">היכנסו כדי להמשיך את מסע הלמידה שלכם</p>
                </div>

                <div className="card border-0 shadow-sm">
                    <div className="card-body p-4">
                        {error && <div className="error-message">{error}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3 text-end">
                                <label className="form-label fw-bold small">כתובת אימייל</label>
                                <div className="input-icon-wrapper">
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    <span className="input-icon">✉️</span>
                                </div>
                            </div>

                            <div className="mb-4 text-end">
                                <label className="form-label fw-bold small">סיסמה</label>
                                <div className="input-icon-wrapper">
                                    <input
                                        type="password"
                                        className="form-control"
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
                                className="btn btn-dark w-100 py-2 fw-bold"
                                disabled={loading}
                            >
                                {loading ? 'מתחבר...' : 'התחברו'}
                            </button>
                        </form>
                    </div>
                </div>

                <p className="text-center text-muted mt-3 small">
                    אין לכם חשבון?{' '}
                    <a href="/register" className="text-decoration-none fw-bold" style={{ color: '#D4A373' }}>
                        הירשמו
                    </a>
                </p>
            </div>
        </div>
    );
}

export default Login;
