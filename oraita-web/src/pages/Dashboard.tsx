import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import { useAuth } from '../context/AuthContext';
import { useDashboard } from '../hooks/useDashboard';
import type { Lesson } from '../store/lessonsSlice';

type Tab = 'joined' | 'created' | 'favorites';

const TABS: { key: Tab; label: string }[] = [
    { key: 'joined',    label: 'שיעורים שנרשמתי' },
    { key: 'created',   label: 'השיעורים שלי' },
    { key: 'favorites', label: 'שמורים' },
];

const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('he-IL', {
        day: 'numeric', month: 'long', year: 'numeric'
    });

function LessonRow({ lesson, onDelete }: { lesson: Lesson; onDelete?: (id: string) => void }) {
    return (
        <div className="d-flex justify-content-between align-items-center py-3 border-bottom text-end">
            <div>
                <span className="badge bg-warning text-dark small mb-1">{lesson.category}</span>
                <h6 className="fw-bold mb-1">{lesson.title}</h6>
                <p className="text-muted small mb-1">{lesson.creator.name}</p>
                <div className="d-flex gap-3 small text-muted">
                    <span>📅 {formatDate(lesson.date)}</span>
                    <span>🕒 {lesson.time}</span>
                    <span>📍 {lesson.city}</span>
                </div>
            </div>
            <div className="d-flex gap-2">
                <Link to={`/lesson/${lesson._id}`} className="btn btn-dark btn-sm text-decoration-none">
                    צפה בשיעור
                </Link>
                {onDelete && (
                    <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => onDelete(lesson._id)}
                    >
                        🗑️ מחק
                    </button>
                )}
            </div>
        </div>
    );
}

function Dashboard() {
    const { user } = useAuth();
    const { loading, error, joinedLessons, createdLessons, favoriteLessons, deleteLesson } = useDashboard();
    const [activeTab, setActiveTab] = useState<Tab>('joined');

    const counts: Record<Tab, number> = {
        joined:    joinedLessons.length,
        created:   createdLessons.length,
        favorites: favoriteLessons.length,
    };

    const displayedLessons =
        activeTab === 'joined'  ? joinedLessons :
        activeTab === 'created' ? createdLessons :
                                  favoriteLessons;

    if (loading) return <Layout><p className="text-center mt-5">טוען...</p></Layout>;
    if (error)   return <Layout><p className="text-center mt-5 text-danger">{error}</p></Layout>;

    return (
        <Layout>
            <main className="container py-5">

                <div className="text-end mb-4">
                    <h1 className="fw-bold mb-1">לוח בקרה</h1>
                    <p className="text-muted">שלום, {user?.name}</p>
                </div>

                {/* Stat cards — reusable component with props */}
                <div className="row g-3 mb-4">
                    <div className="col-md-4">
                        <StatCard icon="📅" count={joinedLessons.length} label="שיעורים שנרשמתי" iconBg="#FFFDE7" />
                    </div>
                    <div className="col-md-4">
                        <StatCard icon="👥" count={createdLessons.length} label="שיעורים שנוצרו" iconBg="#E3F2FD" />
                    </div>
                    <div className="col-md-4">
                        <StatCard icon="❤️" count={favoriteLessons.length} label="שיעורים שמורים" iconBg="#FCE4EC" />
                    </div>
                </div>

                <div className="card border-0 shadow-sm">

                    {/* Tabs — .map() over TABS array */}
                    <div className="card-header bg-white border-0 pt-3 px-3 pb-0">
                        <ul className="nav nav-tabs border-0">
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
                    </div>

                    {/* Lesson list — LessonRow component + .map() */}
                    <div className="card-body p-4">
                        {displayedLessons.length === 0 ? (
                            <p className="text-center text-muted py-3">אין שיעורים להצגה</p>
                        ) : (
                            displayedLessons.map(lesson => (
                                <LessonRow
                                    key={lesson._id}
                                    lesson={lesson}
                                    onDelete={activeTab === 'created' ? deleteLesson : undefined}
                                />
                            ))
                        )}
                    </div>
                </div>

            </main>
        </Layout>
    );
}

export default Dashboard;
