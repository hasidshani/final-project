import { memo } from 'react';
import { Link } from 'react-router-dom';

type LessonCardProps = {
    id: string;
    title: string;
    teacher: string;
    category: string;
    city: string;
    date: string;
    time: string;
    rating: number;
    image: string;
};

const FALLBACK = 'https://images.unsplash.com/photo-1544923246-77307dd654ca?q=80&w=400&auto=format&fit=crop';

// memo prevents re-render when parent re-renders but props haven't changed
const LessonCard = memo(function LessonCard({
    id, title, teacher, category, city, date, time, rating, image
}: LessonCardProps) {

    const formattedDate = new Date(date).toLocaleDateString('he-IL', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <div className="card h-100 border-0 shadow-sm">
            <div className="position-relative">
                <img
                    src={image || FALLBACK}
                    alt={title}
                    className="card-img-top lesson-card-img"
                    onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
                />
                <span className="lesson-badge">{category}</span>
            </div>

            <div className="card-body d-flex flex-column text-end">
                <p className="small fw-bold text-muted mb-1">
                    ⭐ {rating > 0 ? rating.toFixed(1) : 'חדש'}
                </p>
                <h5 className="card-title mb-1">{title}</h5>
                <p className="text-muted small mb-2">{teacher}</p>
                <div className="small text-muted border-top pt-2 mb-3">
                    <div>📍 {city}</div>
                    <div>📅 {formattedDate} | 🕒 {time}</div>
                </div>
                <Link to={`/lesson/${id}`} className="btn btn-outline-dark btn-sm mt-auto">
                    לפרטים נוספים
                </Link>
            </div>
        </div>
    );
});

export default LessonCard;
