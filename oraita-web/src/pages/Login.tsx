import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Post-Google-login "add a phone number?" prompt state
    const [phonePrompt, setPhonePrompt] = useState<'ask' | 'input' | null>(null);
    const [phone, setPhone] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [phoneSaving, setPhoneSaving] = useState(false);

    const { login, updateUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // If redirected from a protected page, return there after login
    const from = (location.state as any)?.from?.pathname || '/dashboard';

    const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
        setError('');
        setLoading(true);
        try {
            const { data } = await api.post('/users/google', {
                credential: credentialResponse.credential,
            });
            login(data.user, data.accessToken, data.refreshToken);

            if (!data.user.phone) {
                setPhonePrompt('ask');
            } else {
                navigate(from, { replace: true });
            }
        } catch {
            setError('שגיאה בהתחברות עם גוגל, נסו שוב');
        } finally {
            setLoading(false);
        }
    };

    const handleSavePhone = async (e: { preventDefault(): void }) => {
        e.preventDefault();
        setPhoneError('');
        setPhoneSaving(true);
        try {
            await api.patch('/users/phone', { phone });
            updateUser({ phone });
            navigate(from, { replace: true });
        } catch {
            setPhoneError('שגיאה בשמירת מספר הטלפון, נסו שוב');
        } finally {
            setPhoneSaving(false);
        }
    };

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
                        {phonePrompt === 'ask' && (
                            <div className="text-center">
                                <p className="fw-bold mb-3">התחברתם בהצלחה! 🎉</p>
                                <p className="text-muted mb-4">
                                    האם תרצו להוסיף מספר טלפון לחשבון שלכם? (אופציונלי)
                                </p>
                                <div className="d-flex gap-2">
                                    <button
                                        type="button"
                                        className="btn btn-dark flex-fill py-2 fw-bold"
                                        onClick={() => setPhonePrompt('input')}
                                    >
                                        כן, אוסיף
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary flex-fill py-2 fw-bold"
                                        onClick={() => navigate(from, { replace: true })}
                                    >
                                        לא תודה
                                    </button>
                                </div>
                            </div>
                        )}

                        {phonePrompt === 'input' && (
                            <form onSubmit={handleSavePhone}>
                                <p className="fw-bold mb-3 text-center">מה מספר הטלפון שלכם?</p>
                                {phoneError && <div className="error-message">{phoneError}</div>}
                                <div className="mb-4 text-end">
                                    <label className="form-label fw-bold small">מספר טלפון</label>
                                    <div className="input-icon-wrapper">
                                        <input
                                            type="tel"
                                            className="form-control"
                                            placeholder="050-123-4567"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            required
                                        />
                                        <span className="input-icon">📞</span>
                                    </div>
                                </div>
                                <div className="d-flex gap-2">
                                    <button
                                        type="submit"
                                        className="btn btn-dark flex-fill py-2 fw-bold"
                                        disabled={phoneSaving}
                                    >
                                        {phoneSaving ? 'שומר...' : 'שמור והמשך'}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary flex-fill py-2 fw-bold"
                                        onClick={() => navigate(from, { replace: true })}
                                    >
                                        דלג
                                    </button>
                                </div>
                            </form>
                        )}

                        {!phonePrompt && (
                        <>
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

                        <div className="d-flex align-items-center my-3">
                            <hr className="flex-grow-1" />
                            <span className="mx-2 text-muted small">או</span>
                            <hr className="flex-grow-1" />
                        </div>

                        <div className="d-flex justify-content-center">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => setError('שגיאה בהתחברות עם גוגל')}
                            />
                        </div>
                        </>
                        )}
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
