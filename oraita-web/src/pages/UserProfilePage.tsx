import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

type PublicProfile = {
    _id: string;
    name: string;
    profilePicture?: string;
    gender?: 'זכר' | 'נקבה';
    phone?: string; // only present if the viewer has an accepted match with this user
};

function UserProfilePage() {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [profile, setProfile] = useState<PublicProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState('');

    useEffect(() => {
        if (!id) return;
        if (user && id === user._id) {
            navigate('/profile', { replace: true });
            return;
        }
        api.get(`/users/${id}`)
            .then(res => setProfile(res.data.user))
            .catch(() => setError('המשתמש לא נמצא'))
            .finally(() => setLoading(false));
    }, [id, user, navigate]);

    if (loading) return <Layout><p className="text-center mt-5">טוען...</p></Layout>;

    if (error || !profile) return (
        <Layout>
            <p className="text-center mt-5">{error || 'המשתמש לא נמצא'}</p>
            <div className="text-center">
                <Link to="/alllessons" className="btn btn-dark">חזרה לכל השיעורים</Link>
            </div>
        </Layout>
    );

    return (
        <Layout>
            <div className="profile-cover" />

            <div className="container">
                <div className="card border-0 shadow-sm mx-auto text-center pb-4 px-4 position-relative" style={{ maxWidth: 500 }}>
                    <button
                        onClick={() => navigate(-1)}
                        className="btn btn-sm btn-link text-muted position-absolute"
                        style={{ top: 16, right: 16 }}
                    >
                        ← חזרה
                    </button>

                    <div className="profile-avatar">
                        {profile.profilePicture ? <img src={profile.profilePicture} alt={profile.name} /> : '👤'}
                    </div>

                    <h1 className="fw-bold mb-2">{profile.name}</h1>

                    {profile.phone && (
                        <p className="text-muted mb-3">📞 {profile.phone}</p>
                    )}

                    <Link to={`/teacherprofile/${profile._id}`} className="btn btn-outline-dark btn-sm mt-2">
                        צפייה בשיעורים
                    </Link>
                </div>
            </div>

            <div className="py-5" />
        </Layout>
    );
}

export default UserProfilePage;
