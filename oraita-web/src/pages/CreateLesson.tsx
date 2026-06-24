import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../services/api';

function CreateLesson() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [city, setCity] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e: { preventDefault(): void }) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.post('/lessons', { title, description, category, city, date, time });
            navigate('/alllessons');

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

    return (
        <Layout>
            <main className="form-page-container">
                <div className="form-card-wide">

                    <header className="form-header">
                        <h1>יצירת שיעור חדש</h1>
                        <p>מלאו את הפרטים כדי לפרסם שיעור תורה חדש בקהילה</p>
                    </header>

                    {error && <div className="error-message">{error}</div>}

                    <form className="create-lesson-form" onSubmit={handleSubmit}>

                        <div className="form-row">
                            <div className="form-group-full">
                                <label htmlFor="lesson-title">שם השיעור</label>
                                <input
                                    type="text"
                                    id="lesson-title"
                                    placeholder="לדוגמה: עומק הפרשה בחיי היום-יום"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group-full">
                                <label htmlFor="lesson-desc">תיאור השיעור</label>
                                <textarea
                                    id="lesson-desc"
                                    rows={5}
                                    placeholder="ספרו קצת על התכנים שיועברו בשיעור..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row-split">

                            <div className="form-group">
                                <label htmlFor="category">קטגוריה</label>
                                <select
                                    id="category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    required
                                >
                                    <option value="">בחרו קטגוריה</option>
                                    <option value="חסידות">חסידות</option>
                                    <option value="מוסר">מוסר</option>
                                    <option value="הלכה">הלכה</option>
                                    <option value="משנה">משנה</option>
                                    <option value="גמרא">גמרא</option>
                                    {/* Fixed: was "פרשת השבוע" — schema expects "פרשת שבוע" */}
                                    <option value="פרשת שבוע">פרשת שבוע</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="city">עיר</label>
                                <select
                                    id="city"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    required
                                >
                                    <option value="">בחרו עיר</option>
                                    <option value="פרדס חנה">פרדס חנה</option>
                                    <option value="נתניה">נתניה</option>
                                </select>
                            </div>

                        </div>

                        <div className="form-row-split">

                            <div className="form-group">
                                <label htmlFor="date">תאריך</label>
                                <input
                                    type="date"
                                    id="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="time">שעה</label>
                                <input
                                    type="time"
                                    id="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    required
                                />
                            </div>

                        </div>

                        <div className="form-footer">
                            <button
                                type="submit"
                                className="btn-publish"
                                disabled={loading}
                            >
                                {loading ? 'מפרסם...' : 'פרסם שיעור ←'}
                            </button>
                        </div>

                    </form>
                </div>
            </main>
        </Layout>
    );
}

export default CreateLesson;
