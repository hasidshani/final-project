import { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import type { Lesson } from '../store/lessonsSlice';
import { isLessonUpcoming } from '../utils/lessonDate';

/**
 * Fetches all lessons for a specific teacher, split into upcoming and past.
 * Also computes derived stats: avgRating (across all their lessons, since
 * only past lessons can carry a rating), cities list.
 */
export function useTeacherProfile(teacherId: string | undefined) {
    const [allLessons, setAllLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState('');

    useEffect(() => {
        if (!teacherId) return;
        api.get('/lessons')
            .then(res => {
                const all: Lesson[] = res.data.lessons ?? [];
                setAllLessons(all.filter(l => l.creator._id === teacherId));
            })
            .catch(() => setError('שגיאה בטעינת הנתונים'))
            .finally(() => setLoading(false));
    }, [teacherId]);

    const upcomingLessons = useMemo(
        () => allLessons.filter(isLessonUpcoming),
        [allLessons]
    );

    const pastLessons = useMemo(
        () => allLessons.filter(l => !isLessonUpcoming(l)),
        [allLessons]
    );

    const creatorName = allLessons[0]?.creator.name ?? '';

    const cities = useMemo(
        () => [...new Set(allLessons.map(l => l.city))].join(', '),
        [allLessons]
    );

    const avgRating = useMemo(() => {
        const rated = allLessons.filter(l => l.rating > 0);
        if (rated.length === 0) return null;
        return (rated.reduce((sum, l) => sum + l.rating, 0) / rated.length).toFixed(1);
    }, [allLessons]);

    return {
        upcomingLessons,
        pastLessons,
        loading,
        error,
        creatorName,
        cities,
        avgRating,
        totalCount: allLessons.length,
    };
}
