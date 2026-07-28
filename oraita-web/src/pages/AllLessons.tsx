import { useLessons } from '../hooks/useLessons';
import LessonCard from '../components/LessonCard';
import Layout from '../components/Layout';

const CATEGORIES = ['חסידות', 'מוסר', 'הלכה', 'משנה', 'גמרא', 'פרשת שבוע'];

function AllLessons() {
    const { filtered, loading, error, categoryFilter, cityFilter, setCategory, setCity } = useLessons();

    return (
        <Layout>
            <div className="page-warm-bg">
            <header className="py-5 border-bottom text-center">
                <h1 className="fw-bold mb-4">כל השיעורים</h1>

                <div className="d-flex flex-wrap justify-content-center align-items-center gap-2">
                    <button
                        className={`btn btn-sm btn-filter ${!categoryFilter ? 'active' : 'btn-outline-secondary'}`}
                        onClick={() => setCategory('')}
                    >
                        הכל
                    </button>

                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            className={`btn btn-sm btn-filter ${categoryFilter === cat ? 'active' : 'btn-outline-secondary'}`}
                            onClick={() => setCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}

                    <select
                        className="form-select form-select-sm w-auto"
                        value={cityFilter}
                        onChange={e => setCity(e.target.value)}
                    >
                        <option value="">כל הערים</option>
                        <option value="פרדס חנה">פרדס חנה</option>
                        <option value="נתניה">נתניה</option>
                    </select>
                </div>
            </header>

            <main className="container py-5">
                {loading && <p className="text-center text-muted">טוען שיעורים...</p>}

                {error && <p className="text-center text-danger">{error}</p>}

                {!loading && !error && filtered.length === 0 && (
                    <p className="text-center text-muted">לא נמצאו שיעורים בקטגוריה זו</p>
                )}

                {!loading && !error && filtered.length > 0 && (
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                        {filtered.map(lesson => (
                            <div key={lesson._id} className="col">
                                <LessonCard
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
                            </div>
                        ))}
                    </div>
                )}
            </main>
            </div>
        </Layout>
    );
}

export default AllLessons;
