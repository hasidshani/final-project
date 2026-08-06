import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import LessonCard from '../components/LessonCard';
import { useTeacherProfile } from '../hooks/useTeacherProfile';

type Tab = 'upcoming' | 'past';

const TABS: { key: Tab; label: string }[] = [
    { key: 'upcoming', label: 'שיעורים קרובים' },
    { key: 'past',     label: 'שיעורים קודמים' },
];

function TeacherProfile() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { upcomingLessons, pastLessons, loading, error, creatorName, creatorPicture, cities, avgRating, totalCount } = useTeacherProfile(id);
    const [activeTab, setActiveTab] = useState<Tab>('upcoming');

    if (loading) return <Layout><p className="text-center mt-5">טוען...</p></Layout>;

    if (error) return (
        <Layout>
            <p className="text-center mt-5">{error}</p>
            <div className="text-center">
                <Link to="/alllessons" className="btn btn-dark">חזרה לכל השיעורים</Link>
            </div>
        </Layout>
    );

    if (totalCount === 0) return (
        <Layout>
            <p className="text-center mt-5">לא נמצאו שיעורים עבור מורה זה</p>
            <div className="text-center mt-3">
                <Link to="/alllessons" className="btn btn-dark">חזרה לכל השיעורים</Link>
            </div>
        </Layout>
    );

    const counts: Record<Tab, number> = { upcoming: upcomingLessons.length, past: pastLessons.length };
    const displayedLessons = activeTab === 'upcoming' ? upcomingLessons : pastLessons;

    // Stat badges defined as an array — rendered with .map()
    const statBadges = [
        { icon: '📚', label: 'מספר שיעורים', value: totalCount },
        ...(avgRating ? [{ icon: '⭐', label: 'דירוג ממוצע', value: avgRating }] : []),
        { icon: '📍', label: 'ערים', value: cities },
    ];

    return (
        <Layout>
            {/* Cover banner */}
            <div className="profile-cover" />

            {/* Identity card — avatar overlaps cover via negative margin in CSS */}
            <div className="container">
                <div className="card border-0 shadow-sm mx-auto text-center pb-4 px-4 position-relative" style={{ maxWidth: 900 }}>
                    <button
                        onClick={() => navigate(-1)}
                        className="btn btn-sm btn-link text-muted position-absolute"
                        style={{ top: 16, right: 16 }}
                    >
                        ← חזרה
                    </button>

                    <div className="profile-avatar">
                        {creatorPicture ? <img src={creatorPicture} alt={creatorName} /> : '👤'}
                    </div>

                    <h1 className="fw-bold mb-3">{creatorName}</h1>

                    {/* Stat badges — .map() over statBadges array */}
                    <div className="d-flex flex-wrap justify-content-center gap-2 border-top pt-4">
                        {statBadges.map((badge, i) => (
                            <span key={i} className="badge bg-light text-dark border py-2 px-3 fs-6 fw-normal">
                                {badge.icon} {badge.label}: <strong>{badge.value}</strong>
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Lesson grid — reuses LessonCard component */}
            <main className="container py-5">
                <h2 className="fw-bold mb-4 text-end">השיעורים של המורה</h2>

                {/* Tabs — .map() over TABS array, same pattern as Dashboard */}
                <ul className="nav nav-tabs border-0 justify-content-end mb-4">
                    {TABS.map(tab => (
                        <li key={tab.key} className="nav-item">
                            <button
                                className={`nav-link ${activeTab === tab.key ? 'active fw-bold' : 'text-muted'}`}
                                onClick={() => setActiveTab(tab.key)}
                            >
                                {tab.label}
                                <span className="badge bg-light text-dark border ms-2 small">
                                    {counts[tab.key]}
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>

                {displayedLessons.length === 0 ? (
                    <p className="text-center text-muted py-3 mb-5">
                        {activeTab === 'upcoming' ? 'אין שיעורים קרובים כרגע' : 'אין עדיין שיעורים שהתקיימו'}
                    </p>
                ) : (
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-5">
                        {displayedLessons.map(lesson => (
                            <div key={lesson._id} className="col">
                                <LessonCard
                                    id={lesson._id}
                                    title={lesson.title}
                                    teacher={lesson.creator.name}
                                    category={lesson.category}
                                    city={lesson.city}
                                    date={lesson.date}
                                    time={lesson.time}
                                    rating={lesson.rating}
                                    image={lesson.image}
                                />
                            </div>
                        ))}
                    </div>
                )}

                <div className="text-center">
                    <Link to="/alllessons" className="btn btn-outline-dark">חזרה לכל השיעורים</Link>
                </div>
            </main>
        </Layout>
    );
}

export default TeacherProfile;
