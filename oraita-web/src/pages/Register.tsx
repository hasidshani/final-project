// Register page component
function Register() {
    return (
        <div className="auth-bg">
            <div className="login-container">
                {/* Page header */}
                <div className="login-header">
                    <div className="logo-box">✡</div>
                    <h1 className="logo-text">אורייתא ✡</h1>
                    <h2>צרו את החשבון שלכם</h2>
                    <p>הצטרפו לקהילת לימוד התורה שלנו</p>
                </div>
                {/* Registration form card */}
                <div className="login-card">
                    <form>
                        {/* Full name field */}
                        <div className="input-group">
                            <label>שם מלא</label>
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    placeholder="ישראל ישראלי"
                                />
                                <span className="input-icon">👤</span>
                            </div>
                        </div>
                        {/* Email field */}
                        <div className="input-group">
                            <label>כתובת אימייל</label>
                            <div className="input-wrapper">
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                />
                                <span className="input-icon">✉️</span>
                            </div>
                        </div>
                        {/* Optional phone field */}
                        <div className="input-group">
                            <label>מספר טלפון (אופציונלי)</label>
                            <div className="input-wrapper">
                                <input
                                    type="tel"
                                    placeholder="050-123-4567"
                                />
                                <span className="input-icon">📞</span>
                            </div>
                        </div>
                        {/* Password field */}
                        <div className="input-group">
                            <label>סיסמה</label>
                            <div className="input-wrapper">
                                <input
                                    type="password"
                                    placeholder="........"
                                />
                                <span className="input-icon">🔒</span>
                            </div>
                        </div>
                        {/* Confirm password field */}
                        <div className="input-group">
                            <label>אימות סיסמה</label>

                            <div className="input-wrapper">
                                <input
                                    type="password"
                                    placeholder="........"
                                />
                                <span className="input-icon">🔒</span>
                            </div>
                        </div>
                        {/* Submit button */}
                        <button
                            type="submit"
                            className="btn-login"
                            style={{marginTop:'10px'}}
                        >
                            צרו חשבון
                        </button>
                    </form>
                </div>
                {/* Login link */}
                <div className="login-footer">
                    <span>
                        כבר יש לכם חשבון?
                        <a href="/login">
                            התחברו
                        </a>
                    </span>
                </div>
            </div>
        </div>
    );
}
export default Register;