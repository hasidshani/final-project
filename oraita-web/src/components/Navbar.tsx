import { Link } from 'react-router-dom';

function Navbar() {

    return (

        <nav className="navbar">

            <div className="nav-right">

                {/* Logo */}
                <Link
                    to="/"
                    className="logo"
                    style={{
                        textDecoration: 'none'
                    }}
                >
                    אורייתא ✡
                </Link>

                <ul className="nav-links">

                    <li>
                        <Link
                            to="/"
                            className="active"
                        >
                            דף הבית
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/dashboard"
                        >
                            לוח בקרה
                        </Link>
                    </li>

                </ul>

            </div>

            <div className="nav-left">

                <Link
                    to="/create-lesson"
                    className="btn-outline"
                    style={{
                        textDecoration: 'none',
                        display: 'inline-block'
                    }}
                >
                    יצירת שיעור ⊕
                </Link>

                <Link
                    to="/login"
                    className="user-link"
                    style={{
                        textDecoration: 'none'
                    }}
                >
                    התחברות 👤
                </Link>

            </div>

        </nav>

    );
}

export default Navbar;