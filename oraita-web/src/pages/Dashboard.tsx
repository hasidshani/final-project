import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import { useAuth } from '../context/AuthContext';
import { useDashboard } from '../hooks/useDashboard';
import { useMatchRequests } from '../hooks/useMatchRequests';
import type { MatchRequest } from '../hooks/useMatchRequests';
import type { Lesson } from '../store/lessonsSlice';
import api from '../services/api';

type Tab = 'joined' | 'created' | 'favorites' | 'past' | 'match';

const TABS: { key: Tab; label: string }[] = [
    { key: 'joined',    label: 'שיעורים שנרשמתי' },
    { key: 'created',   label: 'השיעורים שלי' },
    { key: 'favorites', label: 'שמורים' },
    { key: 'past',      label: 'שיעורים שעברו' },
    { key: 'match',     label: 'בקשות היכרות' },
];

// Opt-in toggle for the match-request feature — lives at the top of the Dashboard
// since there's no dedicated profile/settings page in the app.
function MatchPreferenceCard() {
    const { user, updateUser } = useAuth();
    const [saving, setSaving] = useState(false);
    const [error, setError]   = useState('');
    const [choosingGender, setChoosingGender] = useState(false);

    const save = async (openToMatch: boolean, gender?: 'זכר' | 'נקבה') => {
        setSaving(true);
        setError('');
        try {
            const res = await api.patch('/users/match-preference', { openToMatch, ...(gender ? { gender } : {}) });
            updateUser({ openToMatch: res.data.user.openToMatch, gender: res.data.user.gender });
            setChoosingGender(false);
        } catch (err: any) {
            setError(err.response?.data?.message || 'שגיאה בעדכון ההעדפה');
        } finally {
            setSaving(false);
        }
    };

    const toggle = () => {
        const next = !user?.openToMatch;
        if (next && !user?.gender) {
            setChoosingGender(true);
            return;
        }
        save(next);
    };

    // Accounts that opted in before gender-based matching existed have
    // openToMatch=true but no gender yet — prompt them too, not just on a fresh click.
    const showGenderPrompt = choosingGender || (!!user?.openToMatch && !user?.gender);

    return (
        <div className="card border-0 shadow-sm mb-4">
            <div className="card-body d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div className="text-end">
                    <h6 className="fw-bold mb-1">🤝 פתיחות להיכרויות</h6>
                    <p className="text-muted small mb-0">
                        כשאתה לוחץ על פעיל, משתתפים מהמין השני ששותפים איתך לשיעורים (שגם פתוחים להיכרויות) יוכלו לבקש ליצור איתך קשר ותוכלו להכיר.
                    </p>
                    {showGenderPrompt && (
                        <div className="d-flex gap-2 mt-2 justify-content-end align-items-center flex-wrap">
                            <span className="small text-muted">כדי לדעת אילו הצעות להציג — האם הנך:</span>
                            <button className="btn btn-sm btn-outline-dark" onClick={() => save(true, 'זכר')} disabled={saving}>בן</button>
                            <button className="btn btn-sm btn-outline-dark" onClick={() => save(true, 'נקבה')} disabled={saving}>בת</button>
                            {choosingGender && (
                                <button className="btn btn-sm btn-outline-secondary" onClick={() => setChoosingGender(false)} disabled={saving}>ביטול</button>
                            )}
                        </div>
                    )}
                    {error && <p className="text-danger small mb-0 mt-1">{error}</p>}
                </div>
                <button
                    className={`btn btn-sm fw-bold ${user?.openToMatch ? 'btn-success' : 'btn-outline-secondary'}`}
                    onClick={toggle}
                    disabled={saving}
                >
                    {user?.openToMatch ? '✅ פעיל' : 'לא פעיל'}
                </button>
            </div>
        </div>
    );
}

function MatchRequestRow({ request, mode, onRespond }: {
    request: MatchRequest;
    mode: 'incoming' | 'outgoing' | 'accepted' | 'declined';
    onRespond: (id: string, status: 'accepted' | 'declined') => Promise<void>;
}) {
    const { user } = useAuth();
    const [responding, setResponding] = useState(false);

    const respond = async (status: 'accepted' | 'declined') => {
        setResponding(true);
        try { await onRespond(request._id, status); } finally { setResponding(false); }
    };

    // The "other side" of the request is whichever party isn't the viewer —
    // for accepted requests the viewer can be either the original sender or
    // recipient, so this can't be inferred from `mode` alone (that previously
    // showed the viewer's own name/phone whenever they were the original recipient).
    const other = request.from._id === user?._id ? request.to : request.from;

    return (
        <div className="d-flex justify-content-between align-items-start py-3 border-bottom text-end">
            <div>
                <Link to={`/user/${other._id}`} className="d-flex align-items-center gap-2 mb-1 text-decoration-none text-dark">
                    <h6 className="fw-bold mb-0">{other.name}</h6>
                    <div className="avatar-sm">
                        {other.profilePicture ? <img src={other.profilePicture} alt={other.name} /> : '👤'}
                    </div>
                </Link>
                <p className="text-muted small mb-1">שיתוף שיעור: {request.lesson.title}</p>
                {request.note && <p className="small mb-1 fst-italic">"{request.note}"</p>}
                {mode === 'accepted' && <p className="small mb-0">📞 {other.phone}</p>}
            </div>
            {mode === 'incoming' && (
                <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-success" onClick={() => respond('accepted')} disabled={responding}>אשר</button>
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => respond('declined')} disabled={responding}>דחה</button>
                </div>
            )}
            {mode === 'outgoing' && <span className="badge bg-light text-dark border">ממתין לתשובה</span>}
            {mode === 'declined' && <span className="badge bg-light text-danger border">נדחתה</span>}
        </div>
    );
}

function MatchRequestsPanel({ incoming, outgoing, accepted, declined, loading, error, respond }: {
    incoming: MatchRequest[];
    outgoing: MatchRequest[];
    accepted: MatchRequest[];
    declined: MatchRequest[];
    loading: boolean;
    error: string;
    respond: (id: string, status: 'accepted' | 'declined') => Promise<void>;
}) {
    if (loading) return <p className="text-center text-muted py-3">טוען...</p>;
    if (error)   return <p className="text-center text-danger py-3">{error}</p>;

    if (incoming.length === 0 && outgoing.length === 0 && accepted.length === 0 && declined.length === 0) {
        return <p className="text-center text-muted py-3">אין בקשות היכרות כרגע</p>;
    }

    return (
        <div>
            {incoming.length > 0 && (
                <>
                    <h6 className="fw-bold text-end mb-2">בקשות שהתקבלו</h6>
                    {incoming.map(r => <MatchRequestRow key={r._id} request={r} mode="incoming" onRespond={respond} />)}
                </>
            )}
            {outgoing.length > 0 && (
                <>
                    <h6 className="fw-bold text-end mb-2 mt-4">בקשות שנשלחו</h6>
                    {outgoing.map(r => <MatchRequestRow key={r._id} request={r} mode="outgoing" onRespond={respond} />)}
                </>
            )}
            {accepted.length > 0 && (
                <>
                    <h6 className="fw-bold text-end mb-2 mt-4">אנשי קשר</h6>
                    {accepted.map(r => <MatchRequestRow key={r._id} request={r} mode="accepted" onRespond={respond} />)}
                </>
            )}
            {declined.length > 0 && (
                <>
                    <h6 className="fw-bold text-end mb-2 mt-4">בקשות שנדחו</h6>
                    {declined.map(r => <MatchRequestRow key={r._id} request={r} mode="declined" onRespond={respond} />)}
                </>
            )}
        </div>
    );
}

const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('he-IL', {
        day: 'numeric', month: 'long', year: 'numeric'
    });

function LessonRow({ lesson, onDelete, onLeave }: { lesson: Lesson; onDelete?: (id: string) => void; onLeave?: (id: string) => void }) {
    const [confirming, setConfirming] = useState(false);

    const action = onDelete ?? onLeave;
    const confirmQuestion = onDelete ? 'האם אתה בטוח שברצונך למחוק?' : 'האם אתה בטוח שברצונך לבטל את ההרשמה?';
    const confirmLabel = onDelete ? 'כן, מחק' : 'כן, בטל הרשמה';
    const triggerLabel = onDelete ? '🗑️ מחק' : '✋ בטל הרשמה';
    const triggerClass = onDelete ? 'btn-outline-danger' : 'btn-outline-warning';

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
            <div className="d-flex gap-2 align-items-center flex-wrap justify-content-end">
                <Link to={`/lesson/${lesson._id}`} className="btn btn-dark btn-sm text-decoration-none">
                    צפה בשיעור
                </Link>
                {action && (
                    confirming ? (
                        <>
                            <span className="small text-danger fw-semibold">{confirmQuestion}</span>
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => { action(lesson._id); setConfirming(false); }}
                            >
                                {confirmLabel}
                            </button>
                            <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => setConfirming(false)}
                            >
                                ביטול
                            </button>
                        </>
                    ) : (
                        <button
                            className={`btn btn-sm ${triggerClass}`}
                            onClick={() => setConfirming(true)}
                        >
                            {triggerLabel}
                        </button>
                    )
                )}
            </div>
        </div>
    );
}

function Dashboard() {
    const { user } = useAuth();
    const { loading, error, joinedLessons, createdLessons, favoriteLessons, pastLessons, deleteLesson, leaveLesson } = useDashboard();
    const {
        incoming: incomingRequests, outgoing: outgoingRequests, accepted: acceptedRequests, declined: declinedRequests,
        loading: matchLoading, error: matchError, respond: respondMatchRequest,
    } = useMatchRequests();
    const [activeTab, setActiveTab] = useState<Tab>('joined');

    const counts: Record<Tab, number> = {
        joined:    joinedLessons.length,
        created:   createdLessons.length,
        favorites: favoriteLessons.length,
        past:      pastLessons.length,
        match:     incomingRequests.length,
    };

    const displayedLessons =
        activeTab === 'joined'    ? joinedLessons :
        activeTab === 'created'   ? createdLessons :
        activeTab === 'favorites' ? favoriteLessons :
        activeTab === 'past'      ? pastLessons :
                                    [];

    if (loading) return <Layout><p className="text-center mt-5">טוען...</p></Layout>;
    if (error)   return <Layout><p className="text-center mt-5 text-danger">{error}</p></Layout>;

    return (
        <Layout>
            <div className="page-warm-bg">
            <main className="container py-5">

                <div className="text-end mb-4">
                    <h1 className="fw-bold mb-1">לוח בקרה</h1>
                    <p className="text-muted">שלום, {user?.name}</p>
                </div>

                <MatchPreferenceCard />

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
                        <ul className="nav nav-tabs border-0 flex-nowrap overflow-x-auto pb-1">
                            {TABS.map(tab => (
                                <li key={tab.key} className="nav-item flex-shrink-0">
                                    <button
                                        className={`nav-link text-nowrap ${activeTab === tab.key ? 'active fw-bold' : 'text-muted'}`}
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

                    {/* Lesson list — LessonRow component + .map() — or the match-requests panel */}
                    <div className="card-body p-4">
                        {activeTab === 'match' ? (
                            <MatchRequestsPanel
                                incoming={incomingRequests}
                                outgoing={outgoingRequests}
                                accepted={acceptedRequests}
                                declined={declinedRequests}
                                loading={matchLoading}
                                error={matchError}
                                respond={respondMatchRequest}
                            />
                        ) : displayedLessons.length === 0 ? (
                            <p className="text-center text-muted py-3">אין שיעורים להצגה</p>
                        ) : (
                            displayedLessons.map(lesson => {
                                const isOwner = lesson.creator._id === user?._id;
                                const canDelete = activeTab === 'created' || (activeTab === 'past' && isOwner);
                                return (
                                    <LessonRow
                                        key={lesson._id}
                                        lesson={lesson}
                                        onDelete={canDelete ? deleteLesson : undefined}
                                        onLeave={activeTab === 'joined' ? leaveLesson : undefined}
                                    />
                                );
                            })
                        )}
                    </div>
                </div>

            </main>
            </div>
        </Layout>
    );
}

export default Dashboard;
