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

// memo prevents re-render when parent re-renders but props haven't changed
const LessonCard = memo(function LessonCard({
    id,
    title,
    teacher,
    category,
    city,
    date,
    time,
    rating,
    image
}: LessonCardProps) {

    // Format ISO date string to readable Hebrew date
    const formattedDate = new Date(date).toLocaleDateString('he-IL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="lesson-search-card">

            <div className="card-image-box">
                <img
                    src={image || 'https://images.unsplash.com/photo-1544923246-77307dd654ca?q=80&w=400&auto=format&fit=crop'}
                    alt={title}
                    onError={(e) => {
                        (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1544923246-77307dd654ca?q=80&w=400&auto=format&fit=crop';
                    }}
                />
                <span className="card-tag">{category}</span>
            </div>

            <div className="card-body-content">
                <div className="card-rating">⭐ {rating > 0 ? rating.toFixed(1) : 'חדש'}</div>
                <h3>{title}</h3>
                <p className="teacher-name">{teacher}</p>
                <div className="card-meta-details">
                    <span>📍 {city}</span>
                    <span>📅 {formattedDate} | 🕒 {time}</span>
                </div>
                <Link to={`/lesson/${id}`} className="btn-details-action">
                    לפרטים נוספים
                </Link>
            </div>

        </div>
    );
});

export default LessonCard;
