import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store/store';
import { fetchLessons, setCategoryFilter, setCityFilter } from '../store/lessonsSlice';
import LessonCard from '../components/LessonCard';
import Layout from '../components/Layout';

const CATEGORIES = ['חסידות', 'מוסר', 'הלכה', 'משנה', 'גמרא', 'פרשת שבוע'];

function AllLessons() {
    const dispatch = useDispatch<AppDispatch>();
    const { list, loading, error, categoryFilter, cityFilter } = useSelector(
        (state: RootState) => state.lessons
    );

    // Fetch all lessons from the API on first render
    useEffect(() => {
        dispatch(fetchLessons());
    }, [dispatch]);

    // Client-side filtering — only recomputes when list or filters change
    const filtered = useMemo(() => {
        return list.filter((lesson) => {
            const matchesCategory = !categoryFilter || lesson.category === categoryFilter;
            const matchesCity = !cityFilter || lesson.city === cityFilter;
            return matchesCategory && matchesCity;
        });
    }, [list, categoryFilter, cityFilter]);

    return (
        <Layout>

            {/* Search / filter header */}
            <header className="search-header">
                <h1>כל השיעורים</h1>

                <div className="filter-row">
                    {/* Category filter buttons */}
                    <div className="category-buttons">
                        <button
                            className={`filter-btn ${!categoryFilter ? 'active' : ''}`}
                            onClick={() => dispatch(setCategoryFilter(''))}
                        >
                            הכל
                        </button>
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                className={`filter-btn ${categoryFilter === cat ? 'active' : ''}`}
                                onClick={() => dispatch(setCategoryFilter(cat))}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* City filter dropdown */}
                    <div className="city-dropdown-box">
                        <select
                            className="city-select-dropdown"
                            value={cityFilter}
                            onChange={(e) => dispatch(setCityFilter(e.target.value))}
                        >
                            <option value="">כל הערים</option>
                            <option value="פרדס חנה">פרדס חנה</option>
                            <option value="נתניה">נתניה</option>
                        </select>
                    </div>
                </div>
            </header>

            {/* Lessons grid */}
            <main className="lessons-search-container">

                {loading && (
                    <div className="text-center p-5">טוען שיעורים...</div>
                )}

                {error && (
                    <div className="text-center p-5" style={{ color: 'red' }}>
                        שגיאה בטעינת השיעורים: {error}
                    </div>
                )}

                {!loading && !error && filtered.length === 0 && (
                    <div className="text-center p-5">
                        לא נמצאו שיעורים בקטגוריה זו
                    </div>
                )}

                {!loading && !error && filtered.length > 0 && (
                    <div className="search-lessons-grid">
                        {filtered.map((lesson) => (
                            <LessonCard
                                key={lesson._id}
                                id={lesson._id}
                                title={lesson.title}
                                teacher={lesson.creator?.name || 'מורה'}
                                category={lesson.category}
                                city={lesson.city}
                                date={lesson.date}
                                time={lesson.time}
                                rating={lesson.rating}
                                image={lesson.image}
                            />
                        ))}
                    </div>
                )}

            </main>
        </Layout>
    );
}

export default AllLessons;
