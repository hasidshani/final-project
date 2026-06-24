import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="footer">

            <div className="footer-top">

                <div className="footer-col">

                    <div className="logo">
                        אורייתא ✡
                    </div>

                    <p>
                        מחברים קהילות דרך לימוד תורה
                    </p>

                </div>

                <div className="footer-col">

                    <Link to="/createlesson">
                        יצירת שיעור ⊕
                    </Link>
                    
                    
                    <Link to="/dashboard">
                        לוח בקרה
                    </Link>
                    

                </div>

                <div className="footer-col">

                    <Link to="/">
                        דף הבית
                    </Link>

                    <Link to="/alllessons">
                        כל השיעורים
                    </Link>

                    <Link to="/teacherprofile">
                        פרופיל מורה
                    </Link>

                </div>

            </div>

            <div className="footer-bottom">
                © 2026 אורייתא. כל הזכויות שמורות.
            </div>

        </footer>
    );
}

export default Footer;