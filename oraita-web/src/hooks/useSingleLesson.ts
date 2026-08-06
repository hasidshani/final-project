import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

interface LessonCreator { _id: string; name: string; email: string; profilePicture?: string; }
interface Participant   { _id: string; name: string; openToMatch?: boolean; gender?: 'זכר' | 'נקבה'; }

export interface SingleLessonData {
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
    // Always the real count, even when `participants` is empty because the
    // viewer is anonymous (names/emails are only sent to logged-in requests).
    participantsCount: number;
    maxParticipants: number;
    rating: number;
    ratings: Array<{ user: string; value: number }>;
}

/**
 * Fetches one lesson and provides join / favorite actions.
 * SingleLesson page only needs to render — all logic is here.
 */
export function useSingleLesson(id: string | undefined) {
    const { user, updateUser } = useAuth();
    const navigate  = useNavigate();

    const [lesson,     setLesson]     = useState<SingleLessonData | null>(null);
    const [loading,    setLoading]    = useState(true);
    const [error,      setError]      = useState('');
    const [actionMsg,  setActionMsg]  = useState('');
    const [joining,    setJoining]    = useState(false);
    const [leaving,    setLeaving]    = useState(false);
    const [favoriting, setFavoriting] = useState(false);
    const [rating,     setRating]     = useState(false);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        api.get(`/lessons/${id}`)
            .then(res => setLesson(res.data.lesson))
            .catch(() => setError('השיעור לא נמצא'))
            .finally(() => setLoading(false));
    }, [id]);

    const join = async () => {
        if (!user) { navigate('/login'); return; }
        setJoining(true);
        setActionMsg('');
        try {
            await api.post(`/lessons/${id}/join`);
            const res = await api.get(`/lessons/${id}`);
            setLesson(res.data.lesson);
            setActionMsg('נרשמת לשיעור בהצלחה!');
        } catch (err: any) {
            setActionMsg(err.response?.data?.message || 'שגיאה בהרשמה');
        } finally {
            setJoining(false);
        }
    };

    const leave = async () => {
        if (!user) { navigate('/login'); return; }
        setLeaving(true);
        setActionMsg('');
        try {
            await api.delete(`/lessons/${id}/join`);
            const res = await api.get(`/lessons/${id}`);
            setLesson(res.data.lesson);
            setActionMsg('ההרשמה בוטלה בהצלחה');
        } catch (err: any) {
            setActionMsg(err.response?.data?.message || 'שגיאה בביטול ההרשמה');
        } finally {
            setLeaving(false);
        }
    };

    const isFavorited = !!(user && lesson && (user.favorites ?? []).includes(lesson._id));

    const toggleFavorite = async () => {
        if (!user) { navigate('/login'); return; }
        if (!lesson) return;
        setFavoriting(true);
        setActionMsg('');
        try {
            if (isFavorited) {
                await api.delete(`/users/favorites/${id}`);
                updateUser({ favorites: (user.favorites ?? []).filter(fid => fid !== lesson._id) });
                setActionMsg('הוסר מהמועדפים');
            } else {
                await api.post(`/users/favorites/${id}`);
                updateUser({ favorites: [...(user.favorites ?? []), lesson._id] });
                setActionMsg('נוסף למועדפים!');
            }
        } catch (err: any) {
            setActionMsg(err.response?.data?.message || 'שגיאה');
        } finally {
            setFavoriting(false);
        }
    };

    const rateLesson = async (value: number) => {
        if (!user) { navigate('/login'); return; }
        setRating(true);
        setActionMsg('');
        try {
            const res = await api.post(`/lessons/${id}/rate`, { value });
            setLesson(prev => {
                if (!prev) return prev;
                const existingRatings = prev.ratings ?? [];
                const existing = existingRatings.findIndex(r => r.user === user._id);
                const newRatings = [...existingRatings];
                if (existing >= 0) newRatings[existing] = { user: user._id, value };
                else newRatings.push({ user: user._id, value });
                return { ...prev, rating: res.data.rating, ratings: newRatings };
            });
            setActionMsg('הדירוג נשמר בהצלחה!');
        } catch (err: any) {
            setActionMsg(err.response?.data?.message || 'שגיאה בשמירת הדירוג');
        } finally {
            setRating(false);
        }
    };

    const isParticipant = user
        ? (lesson?.participants ?? []).some(p => p._id === user._id)
        : false;

    const isFull = lesson
        ? lesson.participantsCount >= lesson.maxParticipants
        : false;

    // True when the lesson date has already passed
    const isPast = lesson
        ? new Date(lesson.date.split('T')[0]) < new Date(new Date().toISOString().split('T')[0])
        : false;

    const userRating = user
        ? (lesson?.ratings ?? []).find(r => r.user === user._id)?.value ?? 0
        : 0;

    return {
        lesson, loading, error, actionMsg,
        joining, leaving, favoriting, rating,
        join, leave, toggleFavorite, isFavorited, rateLesson,
        isParticipant, isFull, isPast, userRating,
    };
}
