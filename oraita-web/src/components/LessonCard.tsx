// Lesson card props
type LessonCardProps = {
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
                <a
                    href="#"
                    className="btn-details-action"
                >
                    לפרטים נוספים
                </a>
            </div>

        </div>
    );
}
export default LessonCard;