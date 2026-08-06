import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import CommentCard from '../components/CommentCard';
import { useAuth } from '../context/AuthContext';
import { useSingleLesson } from '../hooks/useSingleLesson';
import { useComments } from '../hooks/useComments';
import { useMatchRequests } from '../hooks/useMatchRequests';
import type { MatchRequest } from '../hooks/useMatchRequests';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1200&auto=format&fit=crop';

type ParticipantInfo = { _id: string; name: string; openToMatch?: boolean; gender?: 'זכר' | 'נקבה'; profilePicture?: string };

// One row in the participants list — handles its own request/respond UI so
// the page component doesn't have to track per-row state.
function ParticipantRow({
    participant, lessonId, currentUserId, isSelf, relation, canRequest, onSend, onRespond,
}: {
    participant: ParticipantInfo;
    lessonId: string;
    currentUserId?: string;
    isSelf: boolean;
    relation?: MatchRequest;
    canRequest: boolean;
    onSend: (toUserId: string, lessonId: string, note: string) => Promise<void>;
    onRespond: (id: string, status: 'accepted' | 'declined') => Promise<void>;
}) {
    const [composing, setComposing] = useState(false);
    const [note, setNote] = useState('');
    const [sending, setSending] = useState(false);
    const [responding, setResponding] = useState(false);
    const [rowError, setRowError] = useState('');

    const handleSend = async () => {
        setSending(true);
        setRowError('');
        try {
            await onSend(participant._id, lessonId, note);
            setComposing(false);
            setNote('');
        } catch (err: any) {
            setRowError(err.response?.data?.message || 'שגיאה בשליחת הבקשה');
        } finally {
            setSending(false);
        }
    };

    const handleRespond = async (status: 'accepted' | 'declined') => {
        if (!relation) return;
        setResponding(true);
        setRowError('');
        try {
            await onRespond(relation._id, status);
        } catch {
            setRowError('שגיאה בעדכון הבקשה');
        } finally {
            setResponding(false);
        }
    };

    let leftContent: React.ReactNode = null;

    if (isSelf) {
        leftContent = <span className="small text-muted">(את/ה)</span>;
    } else if (relation?.status === 'accepted') {
        const phone = relation.from._id === participant._id ? relation.from.phone : relation.to.phone;
        leftContent = <span className="small text-muted">📞 {phone}</span>;
    } else if (relation?.status === 'pending' && relation.from._id === currentUserId) {
        leftContent = <span className="small text-muted">ממתין/ה לתשובה</span>;
    } else if (relation?.status === 'pending' && relation.to._id === currentUserId) {
        leftContent = (
            <div className="d-flex gap-1">
                <button className="btn btn-sm btn-success" onClick={() => handleRespond('accepted')} disabled={responding}>אשר</button>
                <button className="btn btn-sm btn-outline-secondary" onClick={() => handleRespond('declined')} disabled={responding}>דחה</button>
            </div>
        );
    } else if (canRequest) {
        // A prior request from this viewer to this participant was declined —
        // still allowed to try again, but say so instead of silently resetting
        // to the same button as if nothing had happened.
        const previouslyDeclined = relation?.status === 'declined' && relation.from._id === currentUserId;

        leftContent = composing ? (
            <div className="d-flex flex-column gap-1 text-end" style={{ minWidth: 'min(260px, 100%)' }}>
                <textarea
                    className="form-control form-control-sm"
                    placeholder="הודעה קצרה (לא חובה)"
                    value={note}
                    maxLength={200}
                    rows={3}
                    onChange={e => setNote(e.target.value)}
                />
                <span className="text-muted" style={{ fontSize: '0.75rem' }}>{note.length}/200</span>
                <div className="d-flex gap-1 justify-content-end">
                    <button className="btn btn-sm btn-dark" onClick={handleSend} disabled={sending}>
                        {sending ? 'שולח...' : 'שליחה'}
                    </button>
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => setComposing(false)}>ביטול</button>
                </div>
            </div>
        ) : (
            <div className="d-flex flex-column align-items-end gap-1">
                {previouslyDeclined && <span className="small text-muted">הבקשה הקודמת נדחתה</span>}
                <button className="btn btn-sm btn-outline-dark" onClick={() => setComposing(true)}>
                    🤝 {previouslyDeclined ? 'שליחת בקשה מחדש' : 'בקש ליצור קשר'}
                </button>
            </div>
        );
    }

    const nameWithAvatar = (
        <>
            <span className="fw-semibold small">{participant.name}</span>
            <div className="avatar-sm">
                {participant.profilePicture ? <img src={participant.profilePicture} alt={participant.name} /> : '👤'}
            </div>
        </>
    );

    return (
        <li className="list-group-item text-end px-0">
            <div className="d-flex justify-content-between align-items-center">
                {leftContent}
                {isSelf ? (
                    <div className="d-flex align-items-center gap-2">{nameWithAvatar}</div>
                ) : (
                    <Link to={`/user/${participant._id}`} className="d-flex align-items-center gap-2 text-decoration-none text-dark">
                        {nameWithAvatar}
                    </Link>
                )}
            </div>
            {rowError && <div className="text-danger small mt-1">{rowError}</div>}
        </li>
    );
}

function SingleLesson() {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const [confirmingLeave, setConfirmingLeave] = useState(false);

    const {
        lesson, loading, error,
        actionMsg, joining, leaving, favoriting, rating,
        join, leave, toggleFavorite, isFavorited, rateLesson,
        isParticipant, isFull, isPast, userRating,
    } = useSingleLesson(id);

    const { comments, commentText, setCommentText, commentError, addComment } = useComments(id);
    const { requests: matchRequests, sendRequest: sendMatchRequest, respond: respondMatchRequest } = useMatchRequests();

    if (loading) return <Layout><div className="text-center p-5">טוען שיעור...</div></Layout>;
    if (error || !lesson) return <Layout><div className="text-center p-5">{error || 'השיעור לא נמצא'}</div></Layout>;

    const formattedDate = new Date(lesson.date).toLocaleDateString('he-IL', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <Layout>
            {/* Full-width banner */}
            <div className="lesson-banner">
                <img
                    src={lesson.image || FALLBACK_IMG}
                    alt={lesson.title}
                    onError={e => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
                />
                <span className="lesson-banner-tag">{lesson.category}</span>
            </div>

            <main className="container py-5">
                <div className="row g-4">

                    {/* Main column */}
                    <div className="col-lg-8 text-end">
                        <h1 className="fw-bold mb-3">{lesson.title}</h1>

                        <div className="d-flex flex-wrap gap-3 text-muted fw-semibold mb-4">
                            <span>📍 {lesson.city}</span>
                            <span>|</span>
                            <span>📅 {formattedDate}</span>
                            <span>|</span>
                            <span>🕒 {lesson.time}</span>
                            <span>|</span>
                            <Link to={`/teacherprofile/${lesson.creator._id}`} className="text-decoration-none text-muted">
                                👤 {lesson.creator.name}
                            </Link>
                        </div>

                        <p className="lead mb-4" style={{ whiteSpace: 'pre-wrap' }}>{lesson.description}</p>

                        <div className="d-inline-flex align-items-center bg-light px-3 py-2 rounded mb-4">
                            <span className="fw-bold">
                                ⭐ {lesson.rating > 0 ? lesson.rating.toFixed(1) : 'אין דירוג עדיין'}
                            </span>
                        </div>

                        {/* Star rating — shown only to participants after the lesson has passed */}
                        {isPast && isParticipant && (
                            <div className="card border-0 shadow-sm p-4 mb-4 text-end">
                                <h5 className="fw-bold mb-2">
                                    {userRating > 0 ? 'הדירוג שלך' : 'דרגו את השיעור'}
                                </h5>
                                <p className="text-muted small mb-3">
                                    {userRating > 0 ? 'לחצו על כוכב אחר כדי לשנות את הדירוג' : 'בחרו מ-1 עד 5 כוכבים'}
                                </p>
                                <div className="d-flex gap-1 justify-content-end" style={{ direction: 'ltr' }}>
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                            key={star}
                                            onClick={() => rateLesson(star)}
                                            disabled={rating}
                                            style={{
                                                fontSize: '2rem',
                                                background: 'none',
                                                border: 'none',
                                                cursor: rating ? 'default' : 'pointer',
                                                padding: '0 2px',
                                                color: star <= userRating ? '#D4A373' : '#ccc',
                                                transition: 'color 0.15s'
                                            }}
                                            title={`${star} כוכבים`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {actionMsg && (
                            <div className="alert alert-success text-end">{actionMsg}</div>
                        )}

                        {/* Comments — CommentCard component + .map() */}
                        <section>
                            <h3 className="fw-bold mb-4">ביקורות משתתפים</h3>

                            {comments.length === 0 ? (
                                <p className="text-muted mb-4">אין ביקורות עדיין. היו הראשונים!</p>
                            ) : (
                                <div className="d-flex flex-column gap-3 mb-4">
                                    {comments.map(c => (
                                        <CommentCard
                                            key={c._id}
                                            authorName={c.user?.name}
                                            authorPicture={c.user?.profilePicture}
                                            date={new Date(c.createdAt).toLocaleDateString('he-IL')}
                                            text={c.text}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Add comment — conditional rendering */}
                            {user ? (
                                <div className="card border-0 shadow-sm p-4">
                                    <h5 className="fw-bold mb-3">הוסיפו ביקורת</h5>
                                    {commentError && <div className="error-message">{commentError}</div>}
                                    <form onSubmit={addComment}>
                                        <div className="mb-3 text-end">
                                            <textarea
                                                className="form-control"
                                                rows={4}
                                                placeholder="כתבו את התרשמותכם מהשיעור..."
                                                value={commentText}
                                                onChange={e => setCommentText(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <button type="submit" className="btn btn-dark">שליחת ביקורת</button>
                                    </form>
                                </div>
                            ) : (
                                <p className="text-muted">
                                    <Link to="/login">התחברו</Link> כדי להוסיף ביקורת
                                </p>
                            )}
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="col-lg-4">
                        <div className="sticky-lg-top" style={{ top: 24 }}>

                            <button
                                className={`btn w-100 mb-3 fw-bold ${isFavorited ? 'btn-danger' : 'btn-outline-danger'}`}
                                style={{ transition: 'background-color 0.15s, color 0.15s' }}
                                onClick={toggleFavorite}
                                disabled={favoriting}
                            >
                                {isFavorited ? '💔' : '❤️'}{' '}
                                {favoriting ? 'שומר...' : isFavorited ? 'הסרה מהמועדפים' : 'שמירה במועדפים'}
                            </button>

                            {/* Join / cancel button — conditional rendering */}
                            {isParticipant ? (
                                confirmingLeave ? (
                                    <div className="d-flex gap-2 mb-3">
                                        <button
                                            className="btn btn-danger flex-fill fw-bold"
                                            onClick={() => { leave(); setConfirmingLeave(false); }}
                                            disabled={leaving}
                                        >
                                            {leaving ? 'מבטל...' : 'כן, בטל הרשמה'}
                                        </button>
                                        <button
                                            className="btn btn-outline-secondary flex-fill fw-bold"
                                            onClick={() => setConfirmingLeave(false)}
                                        >
                                            חזרה
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        className="btn btn-outline-success w-100 mb-3 fw-bold"
                                        onClick={() => setConfirmingLeave(true)}
                                    >
                                        ✅ רשום לשיעור — לחצו לביטול
                                    </button>
                                )
                            ) : isFull ? (
                                <button className="btn btn-secondary w-100 mb-3 fw-bold" disabled>❌ השיעור מלא</button>
                            ) : (
                                <button className="btn btn-dark w-100 mb-3 fw-bold" onClick={join} disabled={joining}>
                                    📋 {joining ? 'נרשם...' : 'הירשם לשיעור'}
                                </button>
                            )}

                            {/* Edit button — only visible to the lesson's creator */}
                            {user?._id === lesson.creator._id && (
                                <Link
                                    to={`/editlesson/${lesson._id}`}
                                    className="btn btn-outline-dark w-100 mb-3 fw-bold text-decoration-none"
                                >
                                    ✏️ ערוך שיעור
                                </Link>
                            )}

                            {/* Teacher card */}
                            <div className="card border-0 shadow-sm text-center mb-3">
                                <div className="card-body py-4">
                                    <div className="profile-avatar" style={{ width: 72, height: 72, fontSize: '2rem', margin: '0 auto 12px' }}>
                                    {lesson.creator.profilePicture ? (
                                        <img src={lesson.creator.profilePicture} alt={lesson.creator.name} />
                                    ) : '👤'}
                                </div>
                                    <Link
                                        to={`/teacherprofile/${lesson.creator._id}`}
                                        className="fw-bold fs-5 text-dark text-decoration-none d-block mb-2"
                                    >
                                        {lesson.creator.name}
                                    </Link>
                                    <Link
                                        to={`/teacherprofile/${lesson.creator._id}`}
                                        className="small text-decoration-none"
                                        style={{ color: '#D4A373', borderBottom: '1px dashed #D4A373' }}
                                    >
                                        צפה בפרופיל
                                    </Link>
                                </div>
                            </div>

                            {/* Participants list — .map() */}
                            <div className="card border-0 shadow-sm">
                                <div className="card-body">
                                    <h6 className="fw-bold mb-3 text-end">
                                        👥 משתתפים ({lesson.participantsCount}/{lesson.maxParticipants})
                                    </h6>
                                    {!user ? (
                                        <p className="text-muted small mb-0">
                                            <Link to="/login">התחברו</Link> כדי לראות את רשימת המשתתפים
                                        </p>
                                    ) : (
                                    <ul className="list-group list-group-flush">
                                        {lesson.participants.map(p => (
                                            <ParticipantRow
                                                key={p._id}
                                                participant={p}
                                                lessonId={lesson._id}
                                                currentUserId={user?._id}
                                                isSelf={p._id === user?._id}
                                                relation={isParticipant ? matchRequests.find(r =>
                                                    (r.from._id === user?._id && r.to._id === p._id) ||
                                                    (r.from._id === p._id && r.to._id === user?._id)
                                                ) : undefined}
                                                canRequest={
                                                    isParticipant &&
                                                    p._id !== user?._id &&
                                                    !!user?.openToMatch &&
                                                    !!p.openToMatch &&
                                                    !!user?.gender &&
                                                    !!p.gender &&
                                                    user.gender !== p.gender
                                                }
                                                onSend={sendMatchRequest}
                                                onRespond={respondMatchRequest}
                                            />
                                        ))}
                                    </ul>
                                    )}
                                    {isParticipant && !user?.openToMatch && (
                                        <p className="small text-muted text-end mt-3 mb-0">
                                            רוצים ליצור קשר עם משתתפים אחרים? הפעילו את האפשרות בלוח הבקרה.
                                        </p>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </main>
        </Layout>
    );
}

export default SingleLesson;
