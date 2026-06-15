// All lessons page component
function AllLessons() {
    return (
        <>
            {/* Navigation bar */}
            <nav className="navbar">
                <div className="nav-right">
                    <div className="logo">אורייתא ✡</div>
                    <ul className="nav-links">
                        <li><a href="#">דף הבית</a></li>
                        <li><a href="#">לוח בקרה</a></li>
                    </ul>
                </div>
                <div className="nav-left">
                    <button className="btn-outline">יצירת שיעור ⊕</button>
                    <span className="user-link">התחברות 👤</span>
                </div>
            </nav>

            {/* Search header */}
            <header className="search-header">

                <h1>כל השיעורים</h1>

                <div className="search-bar-container">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="חפשו שיעור, נושא או שם של מורה..."
                    />
                    <button className="btn-search">
                        🔍 חפשו
                    </button>
                </div>

                <div className="filter-row">

                    <div className="category-buttons">
                        <button className="filter-btn active">הכל</button>
                        <button className="filter-btn">חסידות</button>
                        <button className="filter-btn">מוסר</button>
                        <button className="filter-btn">הלכה</button>
                        <button className="filter-btn">משנה</button>
                        <button className="filter-btn">גמרא</button>
                        <button className="filter-btn">פרשת שבוע</button>
                    </div>

                    <div className="city-dropdown-box">
                        <select className="city-select-dropdown">
                            <option value="">כל הערים</option>
                            <option value="pardes-hana">פרדס חנה</option>
                            <option value="netanya">נתניה</option>
                        </select>
                    </div>

                </div>

            </header>

            {/* Lessons grid */}
            <main className="lessons-search-container">

                <div className="search-lessons-grid">

                    {/* Lesson card 1 */}
                    <div className="lesson-search-card">

                        <div className="card-image-box">
                            <img
                                src="https://images.unsplash.com/photo-1544923246-77307dd654ca?q=80&w=400&auto=format&fit=crop"
                                alt="Lesson"
                            />
                            <span className="card-tag">פרשת שבוע</span>
                        </div>

                        <div className="card-body-content">
                            <div className="card-rating">⭐ 4.8</div>
                            <h3>מעמיק בפרשת וירא</h3>
                            <p className="teacher-name">הרב דוד כהן</p>

                            <div className="card-meta-details">
                                <span>📍 פרדס חנה</span>
                                <span>📅 12 במאי 2026 | 🕒 19:00</span>
                            </div>

                            <a href="#" className="btn-details-action">
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
                            <span className="card-tag">גמרא</span>
                        </div>

                        <div className="card-body-content">
                            <div className="card-rating">⭐ 4.5</div>
                            <h3>מבוא ללימוד התלמוד</h3>
                            <p className="teacher-name">הרבנית שרה לוי</p>

                            <div className="card-meta-details">
                                <span>📍 נתניה</span>
                                <span>📅 13 במאי 2026 | 🕒 18:30</span>
                            </div>

                            <a href="#" className="btn-details-action">
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
                            <span className="card-tag">הלכה</span>
                        </div>

                        <div className="card-body-content">
                            <div className="card-rating">⭐ 4.9</div>
                            <h3>הלכות שבת למעשה</h3>
                            <p className="teacher-name">הרב אברהם מזרחי</p>

                            <div className="card-meta-details">
                                <span>📍 פרדס חנה</span>
                                <span>📅 15 במאי 2026 | 🕒 20:00</span>
                            </div>

                            <a href="#" className="btn-details-action">
                                לפרטים נוספים
                            </a>
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

export default AllLessons;