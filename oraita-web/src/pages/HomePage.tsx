// Home page component
function Home() {
    return (
        <>
            {/* Navigation bar */}
            <nav className="navbar">
                <div className="nav-right">
                    <ul className="nav-links">
                        <li><a href="#" className="active">דף הבית</a></li>
                        <li><a href="#">לוח בקרה</a></li>
                    </ul>
                </div>
                <div className="nav-left">
                    <a
                        href="#"
                        className="btn-outline"
                        style={{textDecoration:'none',display:'inline-block'}}
                    >
                        יצירת שיעור ⊕
                    </a>
                    <a
                        href="#"
                        className="user-link"
                        style={{textDecoration:'none'}}
                    >
                        התחברות 👤
                    </a>
                </div>
            </nav>

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
                <div className="cta-content">
                    <h2>הצטרפו לקהילת התורה</h2>
                    <p>
                        התחילו את מסע הלמידה שלכם היום. צרו חשבון כדי להצטרף לשיעורים, להתחבר למורים ולצמוח רוחנית.
                    </p>
                    <div className="cta-btns">
                        <a href="#" className="btn-dark">
                            התחילו עכשיו ←
                        </a>
                        <a href="#" className="btn-light-outline">
                            עיינו בשיעורים
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">

                <div className="footer-top">

                    <div className="footer-col">
                        <div className="logo">אורייתא ✡</div>
                        <p>מחברים קהילות דרך לימוד תורה</p>
                    </div>

                    <div className="footer-col">
                        <h4>פלטפורמה</h4>
                        <a href="#">יצירת שיעור ⊕</a>
                        <a href="#">לוח בקרה</a>
                    </div>

                    <div className="footer-col">
                        <h4>קישורים שימושיים</h4>
                        <a href="#">דף הבית</a>
                        <a href="#">כל השיעורים</a>
                    </div>

                </div>

                <div className="footer-bottom">
                    © 2026 אורייתא. כל הזכויות שמורות.
                </div>

            </footer>
        </>
    );
}
export default Home;