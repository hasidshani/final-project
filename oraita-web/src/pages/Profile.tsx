import { useState, useRef } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

// Upload image to /api/file and return the URL — same flow as CreateLesson
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

function Profile() {
    const { user, updateUser } = useAuth();

    // Profile info form
    const [name, setName]   = useState(user?.name ?? '');
    const [email, setEmail] = useState(user?.email ?? '');
    const [phone, setPhone] = useState(user?.phone ?? '');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imgSrc, setImgSrc]       = useState(user?.profilePicture ?? '');
    const [pictureRemoved, setPictureRemoved] = useState(false);
    const [profileError, setProfileError]     = useState('');
    const [profileSuccess, setProfileSuccess] = useState('');
    const [savingProfile, setSavingProfile]   = useState(false);

    // Password form
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword]         = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [passwordError, setPasswordError]     = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [savingPassword, setSavingPassword]   = useState(false);

    const photoRef = useRef<HTMLInputElement>(null);

    const handlePhotoClick = () => photoRef.current?.click();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImgSrc(URL.createObjectURL(file));
            setPictureRemoved(false);
        }
    };

    const handleRemovePicture = () => {
        setImageFile(null);
        setImgSrc('');
        setPictureRemoved(true);
    };

    const handleProfileSubmit = async (e: { preventDefault(): void }) => {
        e.preventDefault();
        setProfileError('');
        setProfileSuccess('');
        setSavingProfile(true);
        try {
            let profilePicture = user?.profilePicture ?? '';
            if (imageFile) {
                profilePicture = await uploadImage(imageFile);
            } else if (pictureRemoved) {
                profilePicture = '';
            }

            const res = await api.patch('/users/profile', { name, email, phone, profilePicture });
            updateUser(res.data.user);
            setImageFile(null);
            setPictureRemoved(false);
            setImgSrc(res.data.user.profilePicture ?? '');
            setProfileSuccess('הפרופיל עודכן בהצלחה');
        } catch (err: any) {
            const serverErrors = err.response?.data?.errors;
            if (serverErrors?.length > 0) {
                setProfileError(serverErrors.join(' | '));
            } else {
                setProfileError(err.response?.data?.message || 'שגיאה בשרת, נסו שוב');
            }
        } finally {
            setSavingProfile(false);
        }
    };

    const handlePasswordSubmit = async (e: { preventDefault(): void }) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');

        if (newPassword !== confirmNewPassword) {
            setPasswordError('הסיסמה החדשה ואימות הסיסמה אינם תואמים');
            return;
        }

        setSavingPassword(true);
        try {
            await api.patch('/users/password', { currentPassword, newPassword });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            setPasswordSuccess('הסיסמה עודכנה בהצלחה');
        } catch (err: any) {
            const serverErrors = err.response?.data?.errors;
            if (serverErrors?.length > 0) {
                setPasswordError(serverErrors.join(' | '));
            } else {
                setPasswordError(err.response?.data?.message || 'שגיאה בשרת, נסו שוב');
            }
        } finally {
            setSavingPassword(false);
        }
    };

    return (
        <Layout>
            <div className="page-warm-bg">
                <main className="container py-5 d-flex flex-column align-items-center gap-4">

                    <div className="text-end w-100" style={{ maxWidth: '700px' }}>
                        <h1 className="fw-bold mb-1">הפרופיל שלי</h1>
                        <p className="text-muted">עדכנו את הפרטים האישיים והתמונה שלכם</p>
                    </div>

                    {/* Profile info card */}
                    <div className="card border-0 shadow-sm w-100" style={{ maxWidth: '700px' }}>
                        <div className="card-body p-4 p-md-5">
                            {profileError && <div className="error-message">{profileError}</div>}
                            {profileSuccess && <div className="alert alert-success text-end">{profileSuccess}</div>}

                            <form className="d-flex flex-column gap-3 text-end" onSubmit={handleProfileSubmit}>

                                {/* Avatar picker — hidden input + preview + camera button, same pattern as CreateLesson */}
                                <div>
                                    <label className="form-label fw-bold">תמונת פרופיל (אופציונלי)</label>

                                    <input
                                        type="file"
                                        ref={photoRef}
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={handleFileChange}
                                    />

                                    <div className="d-flex flex-column align-items-center gap-2 mb-2">
                                        <div className="position-relative">
                                            <div className="profile-avatar" style={{ margin: 0 }}>
                                                {imgSrc ? (
                                                    <img src={imgSrc} alt="תצוגה מקדימה" />
                                                ) : (
                                                    <span>👤</span>
                                                )}
                                            </div>
                                            <button
                                                type="button"
                                                className="btn btn-dark btn-sm rounded-circle position-absolute bottom-0 end-0"
                                                onClick={handlePhotoClick}
                                                title="בחר תמונה"
                                                style={{ width: 36, height: 36 }}
                                            >
                                                📷
                                            </button>
                                        </div>

                                        {imgSrc && (
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={handleRemovePicture}
                                            >
                                                🗑️ הסרת תמונה
                                            </button>
                                        )}

                                        {imageFile && (
                                            <p className="small text-muted mb-0">נבחר: {imageFile.name}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="profile-name" className="form-label fw-bold">שם מלא</label>
                                    <input
                                        type="text"
                                        id="profile-name"
                                        className="form-control"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="profile-email" className="form-label fw-bold">כתובת אימייל</label>
                                    <input
                                        type="email"
                                        id="profile-email"
                                        className="form-control"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="profile-phone" className="form-label fw-bold">מספר טלפון (אופציונלי)</label>
                                    <input
                                        type="tel"
                                        id="profile-phone"
                                        className="form-control"
                                        placeholder="050-123-4567"
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                    />
                                </div>

                                <div className="text-center mt-2">
                                    <button
                                        type="submit"
                                        className="btn btn-dark px-5 py-2 fw-bold"
                                        disabled={savingProfile}
                                    >
                                        {savingProfile ? 'שומר...' : 'שמירת שינויים'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Password card */}
                    <div className="card border-0 shadow-sm w-100" style={{ maxWidth: '700px' }}>
                        <div className="card-body p-4 p-md-5">
                            <h5 className="fw-bold text-end mb-3">שינוי סיסמה</h5>

                            {passwordError && <div className="error-message">{passwordError}</div>}
                            {passwordSuccess && <div className="alert alert-success text-end">{passwordSuccess}</div>}

                            <form className="d-flex flex-column gap-3 text-end" onSubmit={handlePasswordSubmit}>
                                <div>
                                    <label htmlFor="current-password" className="form-label fw-bold">סיסמה נוכחית</label>
                                    <input
                                        type="password"
                                        id="current-password"
                                        className="form-control"
                                        value={currentPassword}
                                        onChange={e => setCurrentPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="new-password" className="form-label fw-bold">סיסמה חדשה</label>
                                    <input
                                        type="password"
                                        id="new-password"
                                        className="form-control"
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)}
                                        required
                                        minLength={6}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="confirm-new-password" className="form-label fw-bold">אימות סיסמה חדשה</label>
                                    <input
                                        type="password"
                                        id="confirm-new-password"
                                        className="form-control"
                                        value={confirmNewPassword}
                                        onChange={e => setConfirmNewPassword(e.target.value)}
                                        required
                                        minLength={6}
                                    />
                                </div>

                                <div className="text-center mt-2">
                                    <button
                                        type="submit"
                                        className="btn btn-outline-dark px-5 py-2 fw-bold"
                                        disabled={savingPassword}
                                    >
                                        {savingPassword ? 'מעדכן...' : 'עדכון סיסמה'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                </main>
            </div>
        </Layout>
    );
}

export default Profile;
