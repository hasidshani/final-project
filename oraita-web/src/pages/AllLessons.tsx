import LessonCard from '../components/LessonCard';
// Lessons data
const lessons = [
    {
        title:"מעמיק בפרשת וירא",
        teacher:"הרב דוד כהן",
        category:"פרשת שבוע",
        city:"פרדס חנה",
        date:"12 במאי 2026",
        time:"19:00",
        rating:4.8,
        image:"https://images.unsplash.com/photo-1544923246-77307dd654ca?q=80&w=400&auto=format&fit=crop"
    },
    {
        title:"מבוא ללימוד התלמוד",
        teacher:"הרבנית שרה לוי",
        category:"גמרא",
        city:"נתניה",
        date:"13 במאי 2026",
        time:"18:30",
        rating:4.5,
        image:"https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=400&auto=format&fit=crop"
    },
    {
        title:"הלכות שבת למעשה",
        teacher:"הרב אברהם מזרחי",
        category:"הלכה",
        city:"פרדס חנה",
        date:"15 במאי 2026",
        time:"20:00",
        rating:4.9,
        image:"https://images.unsplash.com/photo-1435527173128-983b87a01f4d?q=80&w=400&auto=format&fit=crop"
    }
];
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
                    {/* Map through lessons data and render a LessonCard for each lesson */}
                    {lessons.map((lesson) => (
                    <LessonCard
                        key={lesson.title}
                        title={lesson.title}
                        teacher={lesson.teacher}
                        category={lesson.category}
                        city={lesson.city}
                        date={lesson.date}
                        time={lesson.time}
                        rating={lesson.rating}
                        image={lesson.image}
                    />
                    ))}
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