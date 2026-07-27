import { Link } from 'react-router-dom';

const FOOTER_LINKS = [
    {
        heading: 'פעולות',
        links: [
            { to: '/createlesson', label: 'יצירת שיעור ⊕' },
            { to: '/dashboard',    label: 'לוח בקרה' },
        ],
    },
    {
        heading: 'ניווט',
        links: [
            { to: '/',           label: 'דף הבית' },
            { to: '/about',      label: 'אודות' },
            { to: '/alllessons', label: 'כל השיעורים' },
        ],
    },
];

function Footer() {
    return (
        <footer className="bg-white border-top py-5 mt-auto">
            <div className="container">
                <div className="row g-4 text-end">

                    {/* Brand column */}
                    <div className="col-md-5">
                        <p className="fw-bold fs-5 mb-2" style={{ color: '#1a1a1a' }}>אורייתא ✡</p>
                        <p className="text-muted small">מחברים קהילות דרך לימוד תורה</p>
                    </div>

                    {/* Link columns — rendered with .map() */}
                    {FOOTER_LINKS.map(col => (
                        <div key={col.heading} className="col-md-3">
                            <h6 className="fw-bold mb-3">{col.heading}</h6>
                            <div className="d-flex flex-column gap-2">
                                {col.links.map(link => (
                                    <Link
                                        key={link.to}
                                        to={link.to}
                                        className="text-muted text-decoration-none small footer-link"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}

                </div>

                <div className="border-top mt-4 pt-3 text-center text-muted small">
                    © 2026 אורייתא. כל הזכויות שמורות.
                </div>
            </div>
        </footer>
    );
}

export default Footer;
