import Layout from '../components/Layout';
import aboutBannerImg from '../assets/about-banner.jpg';

const BANNER_IMAGE = aboutBannerImg;

const FEATURES = [
    '📍 למצוא שיעורי תורה לפי עיר ומיקום.',
    '📖 לבחור שיעורים לפי נושא וסגנון לימוד.',
    '👨‍🏫 להכיר רבנים ומרצים מומלצים.',
    '⭐ לשמור שיעורים למועדפים, להירשם אליהם ולשתף חוות דעת לאחר ההשתתפות.',
    '💬 לקרוא ולהוסיף תגובות של משתתפים נוספים.',
];

function AboutPage() {
    return (
        <Layout>
            <div className="page-banner">
                <img src={BANNER_IMAGE} alt="" />
                <div className="hero-overlay" />
                <div className="page-banner-content">
                    <h1 className="hero-wordmark mb-0" style={{ fontSize: 'clamp(2rem, 5.5vw, 3.25rem)' }}>
                        שלום וברוכים הבאים לאורייתא! 🌿
                    </h1>
                </div>
            </div>

            <main className="container py-5">
                <div
                    className="card about-card-frame shadow-sm mx-auto p-4 p-md-5 text-end"
                    style={{ maxWidth: 760, marginTop: -48, position: 'relative' }}
                >

                    <p className="lead mb-4">
                        שמי שני, בת 24 והאהבה שלי ללימוד תורה היא זו שהובילה אותי להקים את האתר הזה.
                    </p>

                    <p className="mb-4">
                        בשנים האחרונות אני מתחזקת, משתדלת להשתתף בשיעורי תורה באופן קבוע ומאמינה שלימוד תורה
                        מעניק כוח, משמעות וחיבור עמוק לחיים. מתוך החוויה האישית שלי הבנתי שלא תמיד פשוט למצוא
                        שיעור תורה שמתאים בדיוק למה שמחפשים – מבחינת מיקום, נושא, סגנון השיעור או הרב שמעביר אותו.
                    </p>

                    <p className="mb-4">
                        מתוך הרצון להקל על כל מי שמחפש להתחזק וללמוד תורה, יצרתי את אורייתא – פלטפורמה שמאפשרת
                        למצוא שיעורי תורה בצורה פשוטה ונוחה.
                    </p>

                    <p className="fw-bold mb-3">באתר תוכלו:</p>

                    <ul className="list-unstyled mb-4">
                        {FEATURES.map(feature => (
                            <li key={feature} className="mb-2">{feature}</li>
                        ))}
                    </ul>

                    <p className="fw-bold mb-2" style={{ fontSize: '1.35rem' }}>
                        ❤️ הרבה מעבר לשיעור תורה...
                    </p>

                    <p className="mb-4">
                        אחד הרעיונות שהיו חשובים לי במיוחד הוא לאפשר גם יצירת היכרויות למטרת נישואין מתוך עולם התורה.
                    </p>

                    <p className="mb-4">
                        לכן, בדף הבקרה קיימת אפשרות לסמן שאתם פתוחים להצעת שידוך. משתמשים שבוחרים להפעיל את
                        האפשרות יכולים ליצור קשר אחד עם השני מתוך כוונה להכיר.
                    </p>

                    <p className="mb-4">
                        מי יודע... אולי דווקא בדרך לשיעור התורה הבא שלכם תמצאו גם את בן או בת הזוג שלכם. 💙
                    </p>

                    <p className="mb-4">
                        אני מקווה שהאתר יסייע לכם למצוא שיעורים שיעשירו את עולמכם, להכיר אנשים טובים בדרך,
                        ולהמשיך לצמוח ולהתחזק בכל יום מחדש.
                    </p>

                    <p className="fw-bold text-center mb-0" style={{ color: '#D4A373' }}>
                        ברוכים הבאים לאורייתא – המקום שבו תורה, קהילה וחיבורים נפגשים. ✨
                    </p>

                </div>
            </main>
        </Layout>
    );
}

export default AboutPage;
