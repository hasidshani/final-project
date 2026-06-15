// Create lesson page component
function CreateLesson() {
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

                {/* Authentication area */}
                <div className="nav-left" id="auth-status">
                </div>
            </nav>

            {/* Create lesson form */}
            <main className="form-page-container">

                <div className="form-card-wide">

                    {/* Page header */}
                    <header className="form-header">
                        <h1>יצירת שיעור חדש</h1>
                        <p>מלאו את הפרטים כדי לפרסם שיעור תורה חדש בקהילה</p>
                    </header>

                    <form className="create-lesson-form">

                        {/* Lesson title */}
                        <div className="form-row">
                            <div className="form-group-full">
                                <label htmlFor="lesson-title">שם השיעור</label>
                                <input
                                    type="text"
                                    id="lesson-title"
                                    placeholder="לדוגמה: עומק הפרשה בחיי היום-יום"
                                    required
                                />
                            </div>
                        </div>

                        {/* Lesson description */}
                        <div className="form-row">
                            <div className="form-group-full">
                                <label htmlFor="lesson-desc">תיאור השיעור</label>
                                <textarea
                                    id="lesson-desc"
                                    rows={5}
                                    placeholder="ספרו קצת על התכנים שיועברו בשיעור, למי הוא מתאים ומה כדאי להביא..."
                                    required
                                />
                            </div>
                        </div>

                        {/* Category and city */}
                        <div className="form-row-split">

                            <div className="form-group">
                                <label htmlFor="category">קטגוריה</label>

                                <select id="category" required>
                                    <option value="">בחרו קטגוריה</option>
                                    <option value="chasidut">חסידות</option>
                                    <option value="musar">מוסר</option>
                                    <option value="halacha">הלכה</option>
                                    <option value="mishna">משנה</option>
                                    <option value="gemara">גמרא</option>
                                    <option value="parasha">פרשת שבוע</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="city">עיר</label>

                                <select id="city" required>
                                    <option value="">בחרו עיר</option>
                                    <option value="pardes-hana">פרדס חנה</option>
                                    <option value="netanya">נתניה</option>
                                </select>
                            </div>

                        </div>

                        {/* Date and time */}
                        <div className="form-row-split">

                            <div className="form-group">
                                <label htmlFor="date">תאריך</label>
                                <input
                                    type="date"
                                    id="date"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="time">שעה</label>
                                <input
                                    type="time"
                                    id="time"
                                    required
                                />
                            </div>

                        </div>

                        {/* Image upload */}
                        <div className="form-row">
                            <div className="form-group-full">

                                <label>תמונת השיעור</label>

                                <div className="file-upload-wrapper">

                                    <input
                                        type="file"
                                        id="lesson-image"
                                        className="file-input"
                                        accept="image/*"
                                    />

                                    <label
                                        htmlFor="lesson-image"
                                        className="file-upload-label"
                                    >
                                        <span className="upload-icon">📸</span>
                                        <span className="upload-text">
                                            לחצו להעלאת תמונה או גררו לכאן
                                        </span>
                                    </label>

                                </div>

                            </div>
                        </div>

                        {/* Submit button */}
                        <div className="form-footer">
                            <button
                                type="submit"
                                className="btn-publish"
                            >
                                פרסם שיעור ←
                            </button>
                        </div>

                    </form>

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

export default CreateLesson;