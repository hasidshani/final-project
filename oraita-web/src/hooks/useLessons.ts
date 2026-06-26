import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store/store';
import { fetchLessons, setCategoryFilter, setCityFilter } from '../store/lessonsSlice';

/**
 * Encapsulates all lessons state + filters.
 * AllLessons page just calls this and renders the result.
 */
export function useLessons() {
    const dispatch = useDispatch<AppDispatch>();
    const { list, loading, error, categoryFilter, cityFilter } = useSelector(
        (state: RootState) => state.lessons
    );

    useEffect(() => {
        dispatch(fetchLessons());
    }, [dispatch]);

    // Hide past lessons — only recomputes when list or filters change
    const filtered = useMemo(() => {
        const now = new Date();
        return list.filter(lesson => {
            if (new Date(`${lesson.date}T${lesson.time}`) <= now) return false;
            const matchesCategory = !categoryFilter || lesson.category === categoryFilter;
            const matchesCity     = !cityFilter     || lesson.city     === cityFilter;
            return matchesCategory && matchesCity;
        });
    }, [list, categoryFilter, cityFilter]);

    return {
        filtered,
        loading,
        error,
        categoryFilter,
        cityFilter,
        setCategory: (cat: string)  => dispatch(setCategoryFilter(cat)),
        setCity:     (city: string) => dispatch(setCityFilter(city)),
    };
}
