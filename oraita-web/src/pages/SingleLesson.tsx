import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

interface LessonCreator {
    _id: string;
    name: string;
    email: string;
    phone?: string;
}

interface Participant {
    _id: string;
    name: string;
    phone?: string;
}

interface Lesson {
    _id: string;
    title: string;
    description: string;
    category: string;
    city: string;
    date: string;
    time: string;
    image: string;
    creator: LessonCreator;
    participants: Participant[];
    maxParticipants: number;
    rating: number;
}

interface Comment {
    _id: string;
    text: string;
    user: { _id: string; name: string };
    createdAt: string;
}

function SingleLesson() {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loadingLesson, setLoadingLesson] = useState(true);
    const [lessonError, setLessonError] = useState('');

    const [commentText, setCommentText] = useState('');
    const [actionMsg, setActionMsg] = useState('');
    const [joining, setJoining] = useState(false);
    const [favoriting, setFavoriting] = useState(false);

    // Fetch lesson data
    useEffect(() => {
        if (!id) return;
        setLoadingLesson(true);
        api.get(`/lessons/${id}`)
            .then((res) => setLesson(res.data.lesson))
            .catch(() => setLessonError('השיעור לא נמצא'))
            .finally(() => setLoadingLesson(false));
    }, [id]);

    // Fetch comments
    useEffect(() => {
        if (!id) return;
        api.get(`/comments/lesson/${id}`)
            .then((res) => setComments(res.data.comments))
            .catch(() => {}); // comments are optional — don't block the page
    }, [id]);

    // Join lesson
    const handleJoin = async () => {
        if (!user) { navigate('/login'); return; }
        setJoining(true);
        setActionMsg('');
        try {
            await api.post(`/lessons/${id}/join`);
            // Refresh lesson to update participants list
            const res = await api.get(`/lessons/${id}`);
            setLesson(res.data.lesson);
            setActionMsg('נרשמת לשיעור בהצלחה!');
        } catch (err: any) {
            setActionMsg(err.response?.data?.message || 'שגיאה בהרשמה');
        } finally {
            setJoining(false);
        }
    };

    // Add to favorites
    const handleFavorite = async () => {
        if (!user) { navigate('/login'); return; }
        setFavoriting(true);
        setActionMsg('');
        try {
            await api.post(`/users/favorites/${id}`);
            setActionMsg('נוסף למועדפים!');
        } catch (err: any) {
            setActionMsg(err.response?.data?.message || 'שגיאה');
        } finally {
            setFavoriting(false);
        }
    };

    // Post comment
    const handleComment = async (e: { preventDefault(): void }) => {
        e.preventDefault();
        if (!commentText.trim() || !user) return;
        try {
            const res = await api.post(`/comments/${id}`, { text: commentText });
            // Add new comment to the top of the list
            setComments((prev) => [res.data.comment, ...prev]);
            setCommentText('');
        } catch (err: any) {
            setActionMsg(err.response?.data?.message || 'שגיאה בשליחת הביקורת');
        }
    };

    // Loading state
    if (loadingLesson) {
        return (
            <Layout>
                <div className="text-center p-5">טוען שיעור...</div>
            </Layout>
        );
    }

    // Error / not found state
    if (lessonError || !lesson) {
        return (
            <Layout>
                <div className="text-center p-5">{lessonError || 'השיעור לא נמצא'}</div>
            </Layout>
        );
    }

    const formattedDate = new Date(lesson.date).toLocaleDateString('he-IL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const isParticipant = user
        ? lesson.participants.some((p) => p._id === user._id)
        : false;

    const isFull = lesson.participants.length >= lesson.maxParticipants;

    return (
        <Layout>

            {/* Lesson banner */}
            <div className="lesson-banner">
                <img
                    src={lesson.image || 'https://images.unsplash.com/photo-1544923246-77307dd654ca?q=80&w=1200&auto=format&fit=crop'}
                    alt={lesson.title}
                    onError={(e) => {
                        (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1544923246-77307dd654ca?q=80&w=1200&auto=format&fit=crop';
                    }}
                />
                <span className="banner-tag">{lesson.category}</span>
            </div>

            <main className="single-lesson-container">
                <div className="lesson-layout">

                    {/* Main column */}
                    <div className="lesson-main-col">

                        <h1 className="lesson-page-title">{lesson.title}</h1>

                        <div className="lesson-meta-bar">
                            <span>📍 {lesson.city}</span>
                            <span className="meta-divider">|</span>
                            <span>📅 {formattedDate}</span>
                            <span className="meta-divider">|</span>
                            <span>🕒 {lesson.time}</span>
                            <span className="meta-divider">|</span>
                            <span>👤 {lesson.creator.name}</span>
                        </div>

                        <div className="lesson-description">
                            <p>{lesson.description}</p>
                        </div>

                        <div className="rating-summary-box">
                            <span className="rating-stars">
                                ⭐ {lesson.rating > 0 ? lesson.rating.toFixed(1) : 'אין דירוג עדיין'}
                            </span>
                        </div>

                        {/* Feedback message */}
                        {actionMsg && (
                            <div className="error-message" style={{ background: '#e6f4ea', color: '#2d6a4f', borderColor: '#2d6a4f' }}>
                                {actionMsg}
                            </div>
                        )}

                        {/* Comments section */}
                        <section className="reviews-section">
                            <h2>ביקורות משתתפים</h2>

                            <div className="reviews-list">
                                {comments.length === 0 && (
                                    <p>אין ביקורות עדיין. היו הראשונים!</p>
                                )}
                                {comments.map((c) => (
                                    <div key={c._id} className="review-card">
                                        <div className="review-header">
                                            <span className="reviewer-name">{c.user?.name}</span>
                                            <span style={{ fontSize: '0.8rem', color: '#888' }}>
                                                {new Date(c.createdAt).toLocaleDateString('he-IL')}
                                            </span>
                                        </div>
                                        <p className="review-comment">{c.text}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Add comment — only for logged-in users */}
                            {user ? (
                                <div className="add-review-box">
                                    <h3>הוסיפו ביקורת</h3>
                                    <form className="review-form" onSubmit={handleComment}>
                                        <div className="form-group">
                                            <label>התגובה שלכם:</label>
                                            <textarea
                                                className="review-textarea"
                                                rows={4}
                                                placeholder="כתבו את התרשמותכם מהשיעור..."
                                                value={commentText}
                                                onChange={(e) => setCommentText(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <button type="submit" className="btn-submit-review">
                                            שליחת ביקורת
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                <p>
                                    <a href="/login">התחברו</a> כדי להוסיף ביקורת
                                </p>
                            )}
                        </section>
                    </div>

                    {/* Side column */}
                    <div className="lesson-side-col">

                        {/* Favorite button */}
                        <button
                            className="btn-favorite"
                            onClick={handleFavorite}
                            disabled={favoriting}
                        >
                            ❤️ {favoriting ? 'שומר...' : 'שמירה במועדפים'}
                        </button>

                        {/* Join button */}
                        {isParticipant ? (
                            <button className="btn-register" disabled>
                                ✅ רשום לשיעור
                            </button>
                        ) : isFull ? (
                            <button className="btn-register" disabled>
                                ❌ השיעור מלא
                            </button>
                        ) : (
                            <button
                                className="btn-register"
                                onClick={handleJoin}
                                disabled={joining}
                            >
                                📋 {joining ? 'נרשם...' : 'הירשם לשיעור'}
                            </button>
                        )}

                        {/* Participants count */}
                        <div className="participants-box">
                            <h3>
                                👥 משתתפים ({lesson.participants.length}/{lesson.maxParticipants})
                            </h3>
                            {lesson.participants.map((p) => (
                                <div key={p._id} className="participant-item">
                                    <span>{p.name}</span>
                                    {p.phone ? (
                                        <span className="participant-phone">📞 {p.phone}</span>
                                    ) : (
                                        <span className="participant-no-phone">ללא טלפון</span>
                                    )}
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </main>
        </Layout>
    );
}

export default SingleLesson;
