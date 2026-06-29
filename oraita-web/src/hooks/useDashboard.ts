import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import type { Lesson } from '../store/lessonsSlice';

/**
 * Fetches all dashboard data for the logged-in user:
 * lessons they joined, lessons they created, and their favorites.
 */
export function useDashboard() {
    const { user } = useAuth();
    const [lessons, setLessons]         = useState<Lesson[]>([]);
    const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
    const [loading, setLoading]         = useState(true);
    const [error, setError]             = useState('');

    useEffect(() => {
        Promise.all([api.get('/lessons'), api.get('/users/me')])
            .then(([lessonsRes, meRes]) => {
                setLessons(lessonsRes.data.lessons ?? []);
                setFavoriteIds(
                    (meRes.data.user.favorites ?? []).map((f: any) => f.toString())
                );
            })
            .catch(() => setError('שגיאה בטעינת הנתונים'))
            .finally(() => setLoading(false));
    }, []);

    const joinedLessons = useMemo(
        () => lessons.filter(l => user && l.participants.includes(user._id)),
        [lessons, user]
    );
    const createdLessons = useMemo(
        () => lessons.filter(l => user && l.creator._id === user._id),
        [lessons, user]
    );
    const favoriteLessons = useMemo(
        () => lessons.filter(l => favoriteIds.includes(l._id)),
        [lessons, favoriteIds]
    );

    const deleteLesson = async (id: string) => {
        await api.delete(`/lessons/${id}`);
        setLessons(prev => prev.filter(l => l._id !== id));
    };

    return { loading, error, joinedLessons, createdLessons, favoriteLessons, deleteLesson };
}
