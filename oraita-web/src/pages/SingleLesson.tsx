// Single lesson page component
function SingleLesson() {
    return (
        <>
            {/* Navigation bar */}
            <nav className="navbar">
                <div className="nav-right">
                    <div className="logo">אורייתא ✡</div>
                    <ul className="nav-links">
                        <li><a href="#">דף הבית</a></li>
                        <li><a href="#">כל השיעורים</a></li>
                        <li><a href="#">לוח בקרה</a></li>
                    </ul>
                </div>
                <div className="nav-left">
                    <button className="btn-outline">יצירת שיעור ⊕</button>
                    <span className="user-link">התחברות 👤</span>
                </div>
            </nav>

            {/* Lesson banner */}
            <div className="lesson-banner">
                <img
                    src="https://images.unsplash.com/photo-1544923246-77307dd654ca?q=80&w=1200&auto=format&fit=crop"
                    alt="Torah Study Banner"
                />
                <span className="banner-tag">פרשת שבוע</span>
            </div>

            {/* Main lesson content */}
            <main className="single-lesson-container">

                <div className="lesson-layout">

                    {/* Main lesson column */}
                    <div className="lesson-main-col">

                        <h1 className="lesson-page-title">
                            מעמיק בפרשת וירא
                        </h1>

                        <div className="lesson-meta-bar">
                            <span>📍 פרדס חנה</span>
                            <span className="meta-divider">|</span>
                            <span>📅 12 במאי 2026</span>
                            <span className="meta-divider">|</span>
                            <span>🕒 19:00</span>
                        </div>

                        {/* Lesson description */}
                        <div className="lesson-description">

                            <p>
                                הצטרפו אלינו לשיעור מעמיק ומרתק בפרשת השבוע.
                                בשיעור זה נצלול אל נבכי פרשת וירא,
                                נבחן את סיפורי האבות דרך מדרשי חז"ל
                                ופרשני המקרא הקלאסיים, ונחלץ תובנות
                                רוחניות ומוסריות לחיי היומיום שלנו.
                            </p>

                            <p>
                                השיעור מתאים לכל הרמות וכולל זמן
                                לשאלות ותשובות ודיון פתוח בין המשתתפים.
                                מומלץ להביא חומש וכלי כתיבה.
                            </p>

                        </div>

                        {/* Rating summary */}
                        <div className="rating-summary-box">
                            <span className="rating-stars">⭐ 4.8</span>
                            <span className="rating-count">
                                (על בסיס 12 ביקורות)
                            </span>
                        </div>

                        {/* Reviews section */}
                        <section className="reviews-section">

                            <h2>מה אומרים המשתתפים</h2>

                            <div className="reviews-list">

                                <div className="review-card">

                                    <div className="review-header">
                                        <span className="reviewer-name">
                                            משה לוי
                                        </span>

                                        <span className="review-stars">
                                            ⭐⭐⭐⭐⭐
                                        </span>
                                    </div>

                                    <p className="review-comment">
                                        שיעור מדהים! הרב מצליח לחבר
                                        את פשט הפסוקים לחיי המעשה
                                        בצורה יוצאת מן הכלל.
                                    </p>

                                </div>

                                <div className="review-card">

                                    <div className="review-header">
                                        <span className="reviewer-name">
                                            רחל גולדשטיין
                                        </span>

                                        <span className="review-stars">
                                            ⭐⭐⭐⭐
                                        </span>
                                    </div>

                                    <p className="review-comment">
                                        תוכן מעולה ומאיר עיניים.
                                        האווירה בשיעור נעימה מאוד.
                                    </p>

                                </div>

                            </div>

                            {/* Add review form */}
                            <div className="add-review-box">

                                <h3>הוסיפו ביקורת</h3>

                                <form className="review-form">

                                    <div className="form-group">
                                        <label>דירוג:</label>

                                        <select className="rating-selector">
                                            <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                                            <option value="4">⭐⭐⭐⭐ (4)</option>
                                            <option value="3">⭐⭐⭐ (3)</option>
                                            <option value="2">⭐⭐ (2)</option>
                                            <option value="1">⭐ (1)</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>התגובה שלכם:</label>

                                        <textarea
                                            className="review-textarea"
                                            rows={4}
                                            placeholder="כתבו את התרשמותכם מהשיעור..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn-submit-review"
                                    >
                                        שליחת ביקורת
                                    </button>

                                </form>

                            </div>

                        </section>

                    </div>

                    {/* Side column */}
                    <div className="lesson-side-col">

                        {/* Favorite button */}
                        <button className="btn-favorite">
                            ❤️ שמירה במועדפים
                        </button>

                        {/* Register button */}
                        <button className="btn-register">
                            📋 הירשם לשיעור
                        </button>

                        {/* Participants list */}
                        <div className="participants-box">

                            <h3>👥 משתתפים בשיעור</h3>

                            <div className="participant-item">
                                <span>שרה כהן</span>
                                <span className="participant-phone">
                                    📞 050-123-4567
                                </span>
                            </div>

                            <div className="participant-item">
                                <span>משה לוי</span>
                                <span className="participant-no-phone">
                                    ללא טלפון
                                </span>
                            </div>

                        </div>

                    </div>

                </div>

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

export default SingleLesson;