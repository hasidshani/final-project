import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// Form fields defined as data — rendered with .map() so no copy-paste
const FIELDS = [
    { key: 'name',     label: 'שם מלא',                type: 'text',     placeholder: 'ישראל ישראלי',  icon: '👤', required: true  },
    { key: 'email',    label: 'כתובת אימייל',            type: 'email',    placeholder: 'you@example.com', icon: '✉️', required: true  },
    { key: 'phone',    label: 'מספר טלפון (אופציונלי)',  type: 'tel',      placeholder: '050-123-4567',   icon: '📞', required: false },
    { key: 'password', label: 'סיסמה',                   type: 'password', placeholder: '........',       icon: '🔒', required: true  },
];

type FormData = Record<string, string>;

function Register() {
    const [formData, setFormData] = useState<FormData>(
        Object.fromEntries(FIELDS.map(f => [f.key, '']))
    );
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (key: string, value: string) =>
        setFormData(prev => ({ ...prev, [key]: value }));

    const handleSubmit = async (e: { preventDefault(): void }) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await api.post('/users/register', formData);
            navigate('/login');
        } catch (err: any) {
            const serverErrors = err.response?.data?.errors;
            if (serverErrors?.length > 0) {
                setError(serverErrors.join(' | '));
            } else {
                setError(err.response?.data?.message || 'שגיאה בשרת, נסו שוב');
            }
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
                    <h2 className="fw-bold">צרו את החשבון שלכם</h2>
                    <p className="text-muted">הצטרפו לקהילת לימוד התורה שלנו</p>
                </div>

                <div className="card border-0 shadow-sm">
                    <div className="card-body p-4">
                        {error && <div className="error-message">{error}</div>}

                        <form onSubmit={handleSubmit}>
                            {/* All fields rendered from FIELDS array with .map() */}
                            {FIELDS.map(field => (
                                <div key={field.key} className="mb-3 text-end">
                                    <label className="form-label fw-bold small">{field.label}</label>
                                    <div className="input-icon-wrapper">
                                        <input
                                            type={field.type}
                                            className="form-control"
                                            placeholder={field.placeholder}
                                            value={formData[field.key]}
                                            onChange={(e) => handleChange(field.key, e.target.value)}
                                            required={field.required}
                                        />
                                        <span className="input-icon">{field.icon}</span>
                                    </div>
                                </div>
                            ))}

                            <button
                                type="submit"
                                className="btn btn-dark w-100 py-2 fw-bold mt-1"
                                disabled={loading}
                            >
                                {loading ? 'יוצר חשבון...' : 'צרו חשבון'}
                            </button>
                        </form>
                    </div>
                </div>

                <p className="text-center text-muted mt-3 small">
                    כבר יש לכם חשבון?{' '}
                    <a href="/login" className="text-decoration-none fw-bold" style={{ color: '#D4A373' }}>
                        התחברו
                    </a>
                </p>
            </div>
        </div>
    );
}

export default Register;
