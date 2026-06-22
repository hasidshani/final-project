import { Link } from 'react-router-dom';
// Lesson card props
type LessonCardProps = {
     id:number;
    title:string;
    teacher:string;
    category:string;
    city:string;
    date:string;
    time:string;
    rating:number;
    image:string;
};

// Lesson card component
function LessonCard({
    id,
    title,
    teacher,
    category,
    city,
    date,
    time,
    rating,
    image
}:LessonCardProps) {
    return (
        <div className="lesson-search-card">

            <div className="card-image-box">

                <img
                    src={image}
                    alt={title}
                />
                <span className="card-tag">
                    {category}
                </span>
            </div>
            <div className="card-body-content">

                <div className="card-rating">
                    ⭐ {rating}
                </div>
                <h3>
                    {title}
                </h3>
                <p className="teacher-name">
                    {teacher}
                </p>
                <div className="card-meta-details">

                    <span>
                        📍 {city}
                    </span>

                    <span>
                        📅 {date} | 🕒 {time}
                    </span>
                </div>
                <Link
                    to={`/lesson/${id}`}
                    className="btn-details-action"
                >
                    לפרטים נוספים
                </Link>
            </div>

        </div>
    );
}
export default LessonCard;