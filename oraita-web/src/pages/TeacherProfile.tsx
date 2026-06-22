// Navbar component
import Navbar from "../components/Navbar";
// Teacher profile page component
function TeacherProfile() {
    return (
        <>
            {/* Navigation bar */}
            <Navbar />

            {/* Cover banner */}
            <div className="profile-cover-banner"></div>

            {/* Teacher profile section */}
            <header className="profile-identity-container">

                {/* Back button */}
                <div className="back-button-container">
                    <a
                        href="#"
                        className="btn-back"
                    >
                        ← חזרה לכל השיעורים
                    </a>
                </div>

                {/* Avatar */}
                <div className="profile-avatar-wrapper">
                    <span className="profile-avatar-icon">
                        👤
                    </span>
                </div>

                {/* Teacher name */}
                <h1 className="profile-teacher-name">
                    הרב דוד כהן
                </h1>

                {/* Teacher bio */}
                <p className="profile-teacher-bio">
                    מרצה למחשבת ישראל, בעל ניסיון של מעל עשור
                    בהוראת תנ"ך ופרשת השבוע, ומחבר סדרת המאמרים
                    'אורות הפרשה'. מתמחה בחיבור עולם החסידות
                    לחיי המעשה.
                </p>

                {/* Teacher statistics */}
                <div className="profile-stats-row">

                    <div className="profile-stat-badge">
                        <span className="stat-badge-icon">📚</span>
                        <span className="stat-badge-text">
                            מספר שיעורים:
                            <strong>12</strong>
                        </span>
                    </div>

                    <div className="profile-stat-badge">
                        <span className="stat-badge-icon">⭐</span>
                        <span className="stat-badge-text">
                            דירוג ממוצע:
                            <strong>4.8</strong>
                        </span>
                    </div>

                    <div className="profile-stat-badge">
                        <span className="stat-badge-icon">📍</span>
                        <span className="stat-badge-text">
                            עיר:
                            <strong>פרדס חנה</strong>
                        </span>
                    </div>

                </div>

            </header>

            {/* Teacher lessons */}
            <main className="teacher-catalog-container">

                <h2 className="catalog-section-title">
                    השיעורים של המורה
                </h2>

                <div className="search-lessons-grid">

                    {/* Lesson card 1 */}
                    <div className="lesson-search-card">

                        <div className="card-image-box">
                            <img
                                src="https://images.unsplash.com/photo-1544923246-77307dd654ca?q=80&w=400&auto=format&fit=crop"
                                alt="Lesson"
                            />
                            <span className="card-tag">
                                פרשת שבוע
                            </span>
                        </div>

                        <div className="card-body-content">
                            <div className="card-rating">
                                ⭐ 4.8
                            </div>

                            <h3>
                                מעמיק בפרשת וירא
                            </h3>

                            <div className="card-meta-details">
                                <span>📍 פרדס חנה</span>
                                <span>📅 12 במאי 2026 | 🕒 19:00</span>
                            </div>

                            <a
                                href="#"
                                className="btn-details-action"
                            >
                                לפרטים נוספים
                            </a>
                        </div>

                    </div>

                    {/* Lesson card 2 */}
                    <div className="lesson-search-card">

                        <div className="card-image-box">
                            <img
                                src="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=400&auto=format&fit=crop"
                                alt="Lesson"
                            />
                            <span className="card-tag">
                                חסידות
                            </span>
                        </div>

                        <div className="card-body-content">
                            <div className="card-rating">
                                ⭐ 4.9
                            </div>

                            <h3>
                                תורת הבעל שם טוב לחיים
                            </h3>

                            <div className="card-meta-details">
                                <span>📍 פרדס חנה</span>
                                <span>📅 18 במאי 2026 | 🕒 20:30</span>
                            </div>

                            <a
                                href="#"
                                className="btn-details-action"
                            >
                                לפרטים נוספים
                            </a>
                        </div>

                    </div>

                    {/* Lesson card 3 */}
                    <div className="lesson-search-card">

                        <div className="card-image-box">
                            <img
                                src="https://images.unsplash.com/photo-1435527173128-983b87a01f4d?q=80&w=400&auto=format&fit=crop"
                                alt="Lesson"
                            />
                            <span className="card-tag">
                                מוסר
                            </span>
                        </div>

                        <div className="card-body-content">
                            <div className="card-rating">
                                ⭐ 4.7
                            </div>

                            <h3>
                                פרקי אבות ותיקון המידות
                            </h3>

                            <div className="card-meta-details">
                                <span>📍 נתניה</span>
                                <span>📅 24 במאי 2026 | 🕒 19:15</span>
                            </div>

                            <a
                                href="#"
                                className="btn-details-action"
                            >
                                לפרטים נוספים
                            </a>
                        </div>

                    </div>

                </div>

                {/* Teacher actions */}
                <section
                    className="cta-box"
                    style={{marginTop:'60px',marginBottom:'20px'}}
                >
                    <div className="cta-content">

                        <div className="cta-btns">

                            <a
                                href="#"
                                className="btn-dark"
                                style={{
                                    textDecoration:'none',
                                    display:'inline-block',
                                    lineHeight:'1.2'
                                }}
                            >
                                יצירת שיעור חדש ⊕
                            </a>

                            <a
                                href="#"
                                className="btn-light-outline"
                                style={{
                                    textDecoration:'none',
                                    display:'inline-block',
                                    lineHeight:'1.2'
                                }}
                            >
                                חזרה לכל השיעורים
                            </a>

                        </div>

                    </div>
                </section>

            </main>

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

export default TeacherProfile;