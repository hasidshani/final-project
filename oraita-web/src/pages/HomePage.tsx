import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store/store';
import { setCategoryFilter } from '../store/lessonsSlice';

// Data arrays — rendered with .map() to avoid copy-paste
const CITIES = [
    { name: 'נתניה',     emoji: '🏙️', count: '45 שיעורים' },
    { name: 'פרדס חנה', emoji: '🌳', count: '18 שיעורים' },
];

const CATEGORIES = [
    { name: 'חסידות',     icon: '⭐', bg: '#E8EAF6' },
    { name: 'מוסר',       icon: '❤️', bg: '#FCE4EC' },
    { name: 'הלכה',       icon: '💜', bg: '#F3E5F5' },
    { name: 'משנה',       icon: '📔', bg: '#E8F5E9' },
    { name: 'גמרא',       icon: '🎓', bg: '#E3F2FD' },
    { name: 'פרשת שבוע', icon: '📖', bg: '#FFFDE7' },
];

function Home() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const handleCategoryClick = (cat: string) => {
        dispatch(setCategoryFilter(cat));
        navigate('/alllessons');
    };

    return (
        <Layout>

            {/* ── Hero ── */}
            <section className="py-5 text-center bg-white border-bottom">
                <div className="container py-3">
                    <span
                        className="badge rounded-pill border fs-6 px-3 py-2 mb-4 fw-normal"
                        style={{ background: '#E9E5D9', color: '#1a1a1a' }}
                    >
                        אורייתא ✡
                    </span>
                    <h1 className="display-4 fw-bold mb-3">
                        שיעורי תורה
                        <br />
                        <span style={{ color: '#D4A373' }}>ליד הבית</span>
                    </h1>
                    <p className="lead text-muted mx-auto mb-4" style={{ maxWidth: 560 }}>
                        התחברו למורי תורה מקומיים, גלו שיעורים מעוררי השראה והצטרפו לקהילת הלמידה שלנו.
                    </p>
                    <div className="d-flex justify-content-center gap-3 flex-wrap">
                        <Link to="/alllessons" className="btn btn-dark px-4 py-2 fw-bold">
                            גלו שיעורים →
                        </Link>
                        <Link to="/register" className="btn btn-outline-dark px-4 py-2 fw-bold">
                            הצטרפו בחינם
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── City Selection ── */}
            <section className="py-5" style={{ background: '#f8f7f4' }}>
                <div className="container text-center">
                    <h2 className="fw-bold mb-2">בחרו את העיר שלכם</h2>
                    <p className="text-muted mb-4">מצאו שיעורי תורה בקרבת מקום</p>

                    {/* Cities rendered with .map() */}
                    <div className="row row-cols-1 row-cols-md-2 g-4 justify-content-center mx-auto" style={{ maxWidth: 540 }}>
                        {CITIES.map(city => (
                            <div key={city.name} className="col">
                                <Link to="/alllessons" className="text-decoration-none">
                                    <div className="card border-0 shadow-sm card-hover">
                                        <div className="card-body py-4 text-center">
                                            <div className="fs-1 mb-2">{city.emoji}</div>
                                            <h4 className="fw-bold mb-1 text-dark">{city.name}</h4>
                                            <span className="text-muted small">{city.count}</span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Categories ── */}
            <section className="container py-5 text-center">
                <h2 className="fw-bold mb-2">גלו לפי קטגוריה</h2>
                <p className="text-muted mb-4">חקרו תחומים שונים בלימוד התורה</p>

                {/* Categories rendered with .map() */}
                <div className="d-flex flex-wrap justify-content-center gap-3">
                    {CATEGORIES.map(cat => (
                        <div
                            key={cat.name}
                            className="card border-0 shadow-sm card-hover text-center"
                            style={{ width: 130, cursor: 'pointer' }}
                            onClick={() => handleCategoryClick(cat.name)}
                        >
                            <div className="card-body py-3 px-2">
                                <div
                                    className="d-flex align-items-center justify-content-center rounded-3 mx-auto mb-2"
                                    style={{ width: 56, height: 56, background: cat.bg, fontSize: '1.5rem' }}
                                >
                                    {cat.icon}
                                </div>
                                <span className="fw-bold small text-dark">{cat.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="mx-3 mx-md-5 my-5 rounded-4 py-5 text-center" style={{ background: '#FDF9EC' }}>
                <div className="container">
                    <h2 className="fw-bold mb-2">מוכנים להתחיל?</h2>
                    <p className="text-muted mb-4">הצטרפו אלינו והתחילו ללמוד תורה עם הקהילה</p>
                    <div className="d-flex justify-content-center gap-3 flex-wrap">
                        <Link to="/login" className="btn btn-dark px-4 py-2 fw-bold">
                            התחברות →
                        </Link>
                        <Link to="/alllessons" className="btn btn-outline-dark px-4 py-2 fw-bold">
                            עיינו בשיעורים
                        </Link>
                    </div>
                </div>
            </section>

        </Layout>
    );
}

export default Home;
