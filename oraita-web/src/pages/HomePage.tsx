import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
// Home page component
function Home() {
    return (

        <Layout> 

            {/* Hero section */}
            <header className="hero">
                <span className="badge">אורייתא ✡</span>

                <h1>
                    שיעורי תורה
                    <br />
                    <span className="highlight">ליד הבית</span>
                </h1>

                <p className="subtitle">
                    התחברו למורי תורה מקומיים, גלו שיעורים מעוררי השראה והצטרפו לקהילת הלמידה שלנו.
                </p>
            </header>

            {/* City selection section */}
            <section className="city-selection">
                <h2>בחרו את העיר שלכם</h2>
                <p>מצאו שיעורי תורה בקרבת מקום</p>

                <div className="city-grid">

                    <div className="city-card">
                        <div className="icon-circle">📍</div>
                        <h3>נתניה</h3>
                        <span>45 שיעורים</span>
                    </div>

                    <div className="city-card">
                        <div className="icon-circle">📍</div>
                        <h3>פרדס חנה</h3>
                        <span>18 שיעורים</span>
                    </div>

                </div>
            </section>

            {/* Categories section */}
            <section className="categories-section">

                <div className="section-header">
                    <h2>גלו לפי קטגוריה</h2>
                    <p>חקרו תחומים שונים בלימוד התורה</p>
                </div>

                <div className="category-grid">

                    <div className="category-card">
                        <div className="cat-icon-box bg-purple">⭐</div>
                        <span>חסידות</span>
                    </div>

                    <div className="category-card">
                        <div className="cat-icon-box bg-pink">❤️</div>
                        <span>מוסר</span>
                    </div>

                    <div className="category-card">
                        <div className="cat-icon-box bg-lavender">💜</div>
                        <span>הלכה</span>
                    </div>

                    <div className="category-card">
                        <div className="cat-icon-box bg-green">📔</div>
                        <span>משנה</span>
                    </div>

                    <div className="category-card">
                        <div className="cat-icon-box bg-blue">🎓</div>
                        <span>גמרא</span>
                    </div>

                    <div className="category-card">
                        <div className="cat-icon-box bg-yellow">📖</div>
                        <span>פרשת שבוע</span>
                    </div>

                </div>

            </section>

            {/* Call to action section */}
            <section className="cta-box">
            <div className="cta-btns">
                <Link
                    to="/login"
                    className="btn-dark"
                    style={{ textDecoration: 'none' }}
                >
                    התחברות →
                </Link>

                <Link
                    to="/alllessons"
                    className="btn-light-outline"
                    style={{ textDecoration: 'none' }}
                >
                    עיינו בשיעורים
                </Link>
            </div>
            </section>
            </Layout>
    );
}
export default Home;