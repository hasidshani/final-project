import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e: { preventDefault(): void }) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.post('/users/register', { name, email, phone, password });

            // Registration succeeded — send them to login
            navigate('/login');

        } catch (err: any) {
            // Show server error inline (JOI errors or "email already exists")
            const serverErrors = err.response?.data?.errors;
            if (serverErrors && serverErrors.length > 0) {
                setError(serverErrors.join(' | '));
            } else {
                setError(err.response?.data?.message || 'שגיאה בשרת, נסו שוב');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-bg">
            <div className="login-container">

                <div className="login-header">
                    <div className="logo-box">✡</div>
                    <h1 className="logo-text">אורייתא ✡</h1>
                    <h2>צרו את החשבון שלכם</h2>
                    <p>הצטרפו לקהילת לימוד התורה שלנו</p>
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
                            <label>שם מלא</label>
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    placeholder="ישראל ישראלי"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                                <span className="input-icon">👤</span>
                            </div>
                        </div>

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
                            <label>מספר טלפון (אופציונלי)</label>
                            <div className="input-wrapper">
                                <input
                                    type="tel"
                                    placeholder="050-123-4567"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                                <span className="input-icon">📞</span>
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
                            style={{ marginTop: '10px' }}
                            disabled={loading}
                        >
                            {loading ? 'יוצר חשבון...' : 'צרו חשבון'}
                        </button>

                    </form>
                </div>

                <div className="login-footer">
                    <span>
                        כבר יש לכם חשבון?{' '}
                        <a href="/login">התחברו</a>
                    </span>
                </div>

            </div>
        </div>
    );
}

export default Register;
