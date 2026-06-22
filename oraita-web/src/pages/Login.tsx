
import React, { useState } from 'react';
function Login() {
    const [email, setEmail] =
    useState('');

    const [password, setPassword] =
        useState('');
    const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
) => {

    e.preventDefault();

    try {

        const response = await fetch(
            'http://localhost:3000/api/users/login',
            {
                method: 'POST',
                headers: {
                    'Content-Type':
                        'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const data =
            await response.json();

        console.log(data);

        if (response.ok) {

            localStorage.setItem(
                'accessToken',
                data.accessToken
            );

            localStorage.setItem(
                'refreshToken',
                data.refreshToken
            );
            // Show success message
            alert(
                'Login successful'
            );
            // Redirect to dashboard
            window.location.href =
            '/dashboard';

        } else {

            alert(
                data.message
            );

        }

    } catch (error) {

        console.error(error);

        alert(
            'Server error'
        );

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
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>כתובת אימייל</label>
                            <div className="input-wrapper">
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(
                                            e.target.value
                                        )
                                    }
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
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(
                                            e.target.value
                                        )
                                    }
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