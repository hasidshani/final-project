function Login() {
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
                    <form>
                        <div className="input-group">
                            <label>כתובת אימייל</label>
                            <div className="input-wrapper">
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                />
                                <span className="input-icon">
                                    ✉️
                                </span>
                            </div>
                        </div>
                        <div className="input-group">
                            <label>סיסמה</label>
                            <div className="input-wrapper">
                                <input
                                    type="password"
                                    placeholder="........"
                                />
                                <span className="input-icon">
                                    🔒
                                </span>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="btn-login"
                        >
                            התחברו
                        </button>
                    </form>
                </div>
                <div className="login-footer">
                    <span>
                        אין לכם חשבון?
                        <a href="/register">
                            הירשמו
                        </a>
                    </span>
                </div>
            </div>
        </div>
    );
}
export default Login;