import { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import type { Lesson } from '../store/lessonsSlice';

/**
 * Fetches all future lessons for a specific teacher.
 * Also computes derived stats: avgRating, cities list.
 */
export function useTeacherProfile(teacherId: string | undefined) {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState('');

    useEffect(() => {
        if (!teacherId) return;
        api.get('/lessons')
            .then(res => {
                const all: Lesson[] = res.data.lessons ?? [];
                const now = new Date();
                setLessons(
                    all.filter(l => {
                        const dateStr = l.date.split('T')[0];
                        return l.creator._id === teacherId &&
                            new Date(`${dateStr}T${l.time}`) > now;
                    })
                );
            })
            .catch(() => setError('שגיאה בטעינת הנתונים'))
            .finally(() => setLoading(false));
    }, [teacherId]);

    const creatorName = lessons[0]?.creator.name ?? '';

    const cities = useMemo(
        () => [...new Set(lessons.map(l => l.city))].join(', '),
        [lessons]
    );

    const avgRating = useMemo(() => {
        const rated = lessons.filter(l => l.rating > 0);
        if (rated.length === 0) return null;
        return (rated.reduce((sum, l) => sum + l.rating, 0) / rated.length).toFixed(1);
    }, [lessons]);

    return { lessons, loading, error, creatorName, cities, avgRating };
}
