import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const todayStr = () => new Date().toISOString().split('T')[0];
const nowTimeStr = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};
const isDateTimePast = (dateStr: string, timeStr: string) =>
    new Date(`${dateStr}T${timeStr}`) <= new Date();

const CATEGORIES = ['חסידות', 'מוסר', 'הלכה', 'משנה', 'גמרא', 'פרשת שבוע'];
const CITIES = ['פרדס חנה', 'נתניה'];

// Upload image to /api/file and return the URL
const uploadImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('file', file);
        api.post('/file', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then(res => resolve(res.data.url))
            .catch(reject);
    });
};

function CreateLesson() {
    const { id } = useParams<{ id: string }>();
    const isEditMode = Boolean(id);
    const { user } = useAuth();

    const [title, setTitle]           = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory]     = useState('');
    const [city, setCity]             = useState('');
    const [date, setDate]             = useState('');
    const [time, setTime]             = useState('');
    const [imageFile, setImageFile]   = useState<File | null>(null);
    const [existingImage, setExistingImage] = useState('');
    const [imgSrc, setImgSrc]         = useState('');
    const [error, setError]           = useState('');
    const [loading, setLoading]       = useState(false);
    const [pageLoading, setPageLoading] = useState(isEditMode);

    const photoRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    // In edit mode, load the existing lesson and prefill the form
    useEffect(() => {
        if (!isEditMode) return;
        api.get(`/lessons/${id}`)
            .then(res => {
                const lesson = res.data.lesson;
                if (user && lesson.creator._id !== user._id) {
                    navigate(`/lesson/${id}`, { replace: true });
                    return;
                }
                setTitle(lesson.title);
                setDescription(lesson.description);
                setCategory(lesson.category);
                setCity(lesson.city);
                setDate(lesson.date.split('T')[0]);
                setTime(lesson.time);
                setExistingImage(lesson.image || '');
                setImgSrc(lesson.image || '');
            })
            .catch(() => setError('השיעור לא נמצא'))
            .finally(() => setPageLoading(false));
    }, [id, isEditMode, user, navigate]);

    const handlePhotoClick = () => {
        photoRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImgSrc(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!isEditMode && date && time && isDateTimePast(date, time)) {
            setError('לא ניתן לקבוע שיעור לתאריך או שעה שכבר עברו');
            return;
        }

        setLoading(true);
        try {
            // Step 1: Upload image first (if a new one was selected) → get URL
            let imageUrl = existingImage;
            if (imageFile) {
                imageUrl = await uploadImage(imageFile);
            }

            const payload = { title, description, category, city, date, time, image: imageUrl };

            if (isEditMode) {
                await api.patch(`/lessons/${id}`, payload);
                navigate(`/lesson/${id}`);
            } else {
                await api.post('/lessons', payload);
                navigate('/alllessons');
            }
        } catch (err: any) {
            const serverErrors = err.response?.data?.errors;
            if (serverErrors?.length > 0) {
                setError(serverErrors.join(' | '));
            } else {
                setError(err.response?.data?.message || 'שגיאה בשרת, נסו שוב');
            }
        } finally {
            setLoading(false);
        }
    };

    const today  = todayStr();
    const minTime = date === today ? nowTimeStr() : '';

    if (pageLoading) return <Layout><div className="text-center p-5">טוען...</div></Layout>;

    return (
        <Layout>
            <main className="container py-5 d-flex justify-content-center">
                <div className="card border-0 shadow-sm w-100" style={{ maxWidth: '800px' }}>
                    <div className="card-body p-5">

                        <div className="text-center mb-4">
                            <h1 className="fw-bold mb-2">{isEditMode ? 'עריכת שיעור' : 'יצירת שיעור חדש'}</h1>
                            <p className="text-muted">
                                {isEditMode ? 'עדכנו את פרטי השיעור' : 'מלאו את הפרטים כדי לפרסם שיעור תורה חדש בקהילה'}
                            </p>
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <form className="d-flex flex-column gap-3 text-end" onSubmit={handleSubmit}>

                            {/* Image picker — hidden input + preview + icon button */}
                            <div>
                                <label className="form-label fw-bold">תמונה לשיעור (אופציונלי)</label>

                                {/* Hidden file input */}
                                <input
                                    type="file"
                                    ref={photoRef}
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange}
                                />

                                {/* Preview box with camera icon */}
                                <div className="d-flex justify-content-center position-relative mb-2">
                                    <div
                                        style={{ height: '200px', width: '100%', maxWidth: '400px', overflow: 'hidden' }}
                                        className="rounded border bg-light d-flex align-items-center justify-content-center"
                                    >
                                        {imgSrc ? (
                                            <img
                                                src={imgSrc}
                                                alt="תצוגה מקדימה"
                                                style={{ height: '200px', width: '100%', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <span className="text-muted" style={{ fontSize: '3rem' }}>🖼️</span>
                                        )}
                                    </div>

                                    {/* Icon button to open file picker */}
                                    <div className="position-absolute bottom-0 end-0 mb-1 me-1">
                                        <button
                                            type="button"
                                            className="btn btn-dark btn-sm rounded-circle"
                                            onClick={handlePhotoClick}
                                            title="בחר תמונה"
                                            style={{ width: 40, height: 40 }}
                                        >
                                            📷
                                        </button>
                                    </div>
                                </div>

                                {imageFile && (
                                    <p className="small text-muted text-center">נבחר: {imageFile.name}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="lesson-title" className="form-label fw-bold">שם השיעור</label>
                                <input
                                    type="text"
                                    id="lesson-title"
                                    className="form-control"
                                    placeholder="לדוגמה: עומק הפרשה בחיי היום-יום"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="lesson-desc" className="form-label fw-bold">תיאור השיעור</label>
                                <textarea
                                    id="lesson-desc"
                                    className="form-control"
                                    rows={5}
                                    placeholder="ספרו קצת על התכנים שיועברו בשיעור..."
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Category + City side by side */}
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label htmlFor="category" className="form-label fw-bold">קטגוריה</label>
                                    <select
                                        id="category"
                                        className="form-select"
                                        value={category}
                                        onChange={e => setCategory(e.target.value)}
                                        required
                                    >
                                        <option value="">בחרו קטגוריה</option>
                                        {CATEGORIES.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="city" className="form-label fw-bold">עיר</label>
                                    <select
                                        id="city"
                                        className="form-select"
                                        value={city}
                                        onChange={e => setCity(e.target.value)}
                                        required
                                    >
                                        <option value="">בחרו עיר</option>
                                        {CITIES.map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Date + Time side by side */}
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label htmlFor="date" className="form-label fw-bold">תאריך</label>
                                    <input
                                        type="date"
                                        id="date"
                                        className="form-control"
                                        value={date}
                                        min={isEditMode ? undefined : today}
                                        onChange={e => { setDate(e.target.value); setTime(''); }}
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="time" className="form-label fw-bold">שעה</label>
                                    <input
                                        type="time"
                                        id="time"
                                        className="form-control"
                                        value={time}
                                        min={isEditMode ? undefined : (minTime || undefined)}
                                        onChange={e => setTime(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="text-center mt-2">
                                <button
                                    type="submit"
                                    className="btn btn-dark px-5 py-2 fw-bold fs-5"
                                    disabled={loading}
                                >
                                    {loading
                                        ? (isEditMode ? 'שומר...' : 'מפרסם...')
                                        : (isEditMode ? 'שמור שינויים ←' : 'פרסם שיעור ←')}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </main>
        </Layout>
    );
}

export default CreateLesson;
