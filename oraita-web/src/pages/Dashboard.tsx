import Layout from '../components/Layout';

// Dashboard page component
function Dashboard() {
    return (
        
       <Layout>
            {/* Dashboard content */}
            <main className="dashboard-container">

                {/* Dashboard header */}
                <header className="dash-header">
                    <div className="dash-title">
                        <h1>לוח בקרה</h1>
                        <p className="welcome-msg">שלום, דוד</p>
                    </div>
                </header>

                {/* Statistics cards */}
                <section className="stats-row">
                    <div className="stat-card">
                        <div className="stat-icon bg-light-yellow">📅</div>
                        <div className="stat-number">2</div>
                        <div className="stat-label">שיעורים קרובים</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon bg-light-blue">👥</div>
                        <div className="stat-number">1</div>
                        <div className="stat-label">שיעורים שנוצרו</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon bg-light-pink">❤️</div>
                        <div className="stat-number">1</div>
                        <div className="stat-label">שיעורים שמורים</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon bg-light-purple">🔔</div>
                        <div className="stat-number">2</div>
                        <div className="stat-label">התראות חדשות</div>
                    </div>
                </section>

                {/* Dashboard tabs */}
                <section className="content-panel">

                    <div className="panel-tabs">
                        <button className="tab-btn active">
                            שיעורים קרובים
                            <span className="tab-badge">2</span>
                        </button>

                        <button className="tab-btn">
                            השיעורים שלי
                            <span className="tab-badge">1</span>
                        </button>

                        <button className="tab-btn">
                            שמורים
                            <span className="tab-badge">1</span>
                        </button>

                        <button className="tab-btn">
                            התראות
                            <span className="tab-badge">2</span>
                        </button>
                    </div>

                    {/* Lessons list */}
                    <div className="panel-list">

                        <div className="panel-item">

                            <div className="item-details">

                                <span className="item-tag">פרשת שבוע</span>

                                <h3 className="item-title">
                                    מעמיק בפרשת וירא
                                </h3>

                                <p className="item-instructor">
                                    הרב דוד כהן
                                </p>

                                <div className="item-meta">
                                    <span>📅 12 במאי 2026</span>
                                    <span>🕒 19:00</span>
                                    <span>📍 ירושלים</span>
                                </div>

                            </div>

                            <div className="item-actions">
                                <a href="#" className="btn-small-dark">
                                    👥 ראה משתתפים
                                </a>
                                <br />
                                <br />
                                <button className="btn-small-outline">
                                    בטל הרשמה
                                </button>
                            </div>

                            <div className="item-image-wrapper">
                                <img
                                    src="https://images.unsplash.com/photo-1544923246-77307dd654ca?q=80&w=150&auto=format&fit=crop"
                                    alt="Lesson"
                                />
                            </div>

                        </div>

                        <div className="panel-item">

                            <div className="item-details">

                                <span className="item-tag">גמרא</span>

                                <h3 className="item-title">
                                    מבוא ללימוד התלמוד
                                </h3>

                                <p className="item-instructor">
                                    הרבנית שרה לוי
                                </p>

                                <div className="item-meta">
                                    <span>📅 13 במאי 2026</span>
                                    <span>🕒 18:30</span>
                                    <span>📍 תל אביב</span>
                                </div>

                            </div>

                            <div className="item-actions">
                                <a href="#" className="btn-small-dark">
                                    👥 ראה משתתפים
                                </a>
                                <br />
                                <br />
                                <button className="btn-small-outline">
                                    בטל הרשמה
                                </button>
                            </div>

                            <div className="item-image-wrapper">
                                <img
                                    src="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=150&auto=format&fit=crop"
                                    alt="Lesson"
                                />
                            </div>

                        </div>

                    </div>

                </section>

            </main>
         </Layout>

      
    );
}
export default Dashboard;