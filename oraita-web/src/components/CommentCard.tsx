type CommentCardProps = {
    authorName: string;
    date: string;
    text: string;
};

function CommentCard({ authorName, date, text }: CommentCardProps) {
    return (
        <div className="card border-0 shadow-sm">
            <div className="card-body text-end">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="small text-muted">{date}</span>
                    <span className="fw-bold">{authorName}</span>
                </div>
                <p className="mb-0 text-secondary">{text}</p>
            </div>
        </div>
    );
}

export default CommentCard;
