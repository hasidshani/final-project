import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

interface LessonCreator { _id: string; name: string; email: string; phone?: string; }
interface Participant   { _id: string; name: string; phone?: string; }

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
    maxParticipants: number;
    rating: number;
}

/**
 * Fetches one lesson and provides join / favorite actions.
 * SingleLesson page only needs to render — all logic is here.
 */
export function useSingleLesson(id: string | undefined) {
    const { user } = useAuth();
    const navigate  = useNavigate();

    const [lesson,     setLesson]     = useState<SingleLessonData | null>(null);
    const [loading,    setLoading]    = useState(true);
    const [error,      setError]      = useState('');
    const [actionMsg,  setActionMsg]  = useState('');
    const [joining,    setJoining]    = useState(false);
    const [favoriting, setFavoriting] = useState(false);

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

    const addFavorite = async () => {
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

    const isParticipant = user
        ? (lesson?.participants ?? []).some(p => p._id === user._id)
        : false;

    const isFull = lesson
        ? lesson.participants.length >= lesson.maxParticipants
        : false;

    return { lesson, loading, error, actionMsg, joining, favoriting, join, addFavorite, isParticipant, isFull };
}
