type CommentCardProps = {
    authorName: string;
    authorPicture?: string;
    date: string;
    text: string;
};

function CommentCard({ authorName, authorPicture, date, text }: CommentCardProps) {
    return (
        <div className="card border-0 shadow-sm">
            <div className="card-body text-end">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="small text-muted">{date}</span>
                    <div className="d-flex align-items-center gap-2">
                        <span className="fw-bold">{authorName}</span>
                        <div className="avatar-sm">
                            {authorPicture ? <img src={authorPicture} alt={authorName} /> : '👤'}
                        </div>
                    </div>
                </div>
                <p className="mb-0 text-secondary">{text}</p>
            </div>
        </div>
    );
}

export default CommentCard;
