// Not found page component
function NotFound() {
    return (
        <>
            {/* Logo */}
            <div className="error-logo-container">
                <a
                    href="#"
                    className="error-logo-link"
                >
                    אורייתא ✡
                </a>
            </div>
            {/* Error content */}
            <div className="error-center-wrapper">
                <div className="error-icon">
                    📖
                </div>
                <h1 className="error-title">
                    הדף לא נמצא
                </h1>
                <p className="error-subtitle">
                    הדף שחיפשתם אינו קיים או שאין לכם הרשאה לצפות בו.
                </p>
                <div className="error-actions-row">
                    <a
                        href="#"
                        className="btn-error-primary"
                    >
                        חזרה לדף הבית ←
                    </a>
                    <a
                        href="#"
                        className="btn-error-secondary"
                    >
                        להרשמה - לחצו כאן
                    </a>
                </div>
            </div>
        </>
    );
}
export default NotFound;