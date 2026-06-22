// Import necessary modules and components
import React, { useState } from 'react';

// Register page component
function Register() {

    const [name, setName] =
        useState('');

    const [email, setEmail] =
        useState('');

    const [phone, setPhone] =
        useState('')

    const [password, setPassword] =
        useState('');

    // Register form submit
    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();
        
        try {

    const response = await fetch(
        'http://localhost:3000/api/users/register',
        {
            method: 'POST',
            headers: {
                'Content-Type':
                    'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                phone,
                password
            })
        }
    );

    const data =
        await response.json();

    console.log(data);

    if (response.ok) {
        // Show success message
        alert(
            'User registered successfully'
        );
        // Redirect to login page
        window.location.href =
        '/login';
        


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

                {/* Page header */}
                <div className="login-header">
                    <div className="logo-box">✡</div>

                    <h1 className="logo-text">
                        אורייתא ✡
                    </h1>

                    <h2>
                        צרו את החשבון שלכם
                    </h2>

                    <p>
                        הצטרפו לקהילת לימוד התורה שלנו
                    </p>
                </div>

                {/* Registration form card */}
                <div className="login-card">

                    <form onSubmit={handleSubmit}>

                        {/* Full name field */}
                        <div className="input-group">
                            <label>
                                שם מלא
                            </label>

                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    placeholder="ישראל ישראלי"
                                    value={name}
                                    onChange={(e) =>
                                        setName(
                                            e.target.value
                                        )
                                    }
                                />

                                <span className="input-icon">
                                    👤
                                </span>
                            </div>
                        </div>

                        {/* Email field */}
                        <div className="input-group">
                            <label>
                                כתובת אימייל
                            </label>

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

                        {/* Optional phone field */}
                        <div className="input-group">
                            <label>
                                מספר טלפון (אופציונלי)
                            </label>

                            <div className="input-wrapper">
                                <input
                                    type="tel"
                                    placeholder="050-123-4567"
                                    value={phone}
                                    onChange={(e) =>
                                        setPhone(
                                            e.target.value
                                        )
                                    }
                                />

                                <span className="input-icon">
                                    📞
                                </span>
                            </div>
                        </div>

                        {/* Password field */}
                        <div className="input-group">
                            <label>
                                סיסמה
                            </label>

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

                        {/* Submit button */}
                        <button
                            type="submit"
                            className="btn-login"
                            style={{
                                marginTop: '10px'
                            }}
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












































