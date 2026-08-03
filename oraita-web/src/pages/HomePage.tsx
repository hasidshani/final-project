import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store/store';
import { fetchLessons, setCategoryFilter } from '../store/lessonsSlice';
import { isLessonUpcoming } from '../utils/lessonDate';

const CITY_META: { name: string; emoji: string }[] = [
    { name: 'נתניה',     emoji: '🏙️' },
    { name: 'פרדס חנה', emoji: '🌳' },
];

const CATEGORIES = [
    { name: 'חסידות',     icon: '⭐', bg: '#E8EAF6' },
    { name: 'מוסר',       icon: '❤️', bg: '#FCE4EC' },
    { name: 'הלכה',       icon: '💜', bg: '#F3E5F5' },
    { name: 'משנה',       icon: '📔', bg: '#E8F5E9' },
    { name: 'גמרא',       icon: '🎓', bg: '#E3F2FD' },
    { name: 'פרשת שבוע', icon: '📖', bg: '#FFFDE7' },
];

// Filler images for the hero's scrolling photo strip — used to round out
// the strip when there aren't yet enough real lesson photos in the DB.
const STOCK_HERO_IMAGES = [
    'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=800&auto=format&fit=crop',
];

// Real lesson photos first, topped up with stock images, always padded to a
// FIXED count (12) so the marquee track's width is constant, then duplicated
// once so the CSS marquee loops seamlessly.
function buildHeroImages(lessonImages: string[]): string[] {
    const realImages = [...new Set(lessonImages.filter(Boolean))];
    const pool = realImages.length > 0 ? [...realImages, ...STOCK_HERO_IMAGES] : STOCK_HERO_IMAGES;
    const trimmed = Array.from({ length: 12 }, (_, i) => pool[i % pool.length]);
    return [...trimmed, ...trimmed];
}

function Home() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const lessons = useSelector((state: RootState) => state.lessons.list);
    const lessonsLoading = useSelector((state: RootState) => state.lessons.loading);

    useEffect(() => {
        dispatch(fetchLessons());
    }, [dispatch]);

    const CITIES = useMemo(
        () => CITY_META.map(city => ({
            ...city,
            count: lessons.filter(l => l.city === city.name && isLessonUpcoming(l)).length,
        })),
        [lessons]
    );

    // The hero strip's image set is chosen ONCE, after the initial lessons
    // fetch settles (success or fail), then frozen forever — swapping an
    // <img src> mid-scroll has no transition and reads as the strip
    // "jumping" to different pictures. Faded in via CSS once ready instead
    // of popping straight from placeholder to final content.
    const [heroImages, setHeroImages] = useState<string[]>(() => buildHeroImages([]));
    const [heroReady, setHeroReady] = useState(false);
    const sawLoadingRef = useRef(false);
    const frozenRef = useRef(false);

    useEffect(() => {
        if (frozenRef.current) return;
        if (lessonsLoading) {
            sawLoadingRef.current = true;
            return;
        }
        if (sawLoadingRef.current) {
            frozenRef.current = true;
            setHeroImages(buildHeroImages(lessons.map(l => l.image)));
            setHeroReady(true);
        }
    }, [lessonsLoading, lessons]);

    const handleCategoryClick = (cat: string) => {
        dispatch(setCategoryFilter(cat));
        navigate('/alllessons');
    };

    return (
        <Layout>

            {/* ── Hero — scrolling photo strip behind the title ── */}
            <section className="hero-section text-center">
                <div className={`hero-marquee${heroReady ? ' hero-marquee-ready' : ''}`} aria-hidden="true">
                    <div className="hero-marquee-track">
                        {heroImages.map((src, i) => (
                            <img
                                key={i}
                                src={src}
                                alt=""
                                loading={i < 12 ? 'eager' : 'lazy'}
                                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                        ))}
                    </div>
                </div>
                <div className="hero-overlay" />

                <div className="hero-content container py-3">
                    <h1 className="hero-wordmark mb-2">אורייתא ✡</h1>
                    <p className="fs-3 fw-bold mb-3" style={{ color: '#FFF7EC' }}>
                        שיעורי תורה <span style={{ color: 'var(--gold)' }}>ליד הבית</span>
                    </p>
                    <p className="lead mx-auto mb-4" style={{ maxWidth: 560, color: '#f1ede4' }}>
                        התחברו למורי תורה מקומיים, גלו שיעורים מעוררי השראה והצטרפו לקהילת הלמידה שלנו.
                    </p>
                    <div className="d-flex justify-content-center gap-3 flex-wrap">
                        <Link to="/alllessons" className="btn btn-gold px-4 py-2 fw-bold">
                            גלו שיעורים →
                        </Link>
                        <Link to="/register" className="btn btn-outline-light px-4 py-2 fw-bold">
                            הצטרפו בחינם
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── City Selection ── */}
            <section className="py-5" style={{ background: '#f8f7f4' }}>
                <div className="container text-center">
                    <h2 className="fw-bold mb-2">בחרו את העיר שלכם</h2>
                    <p className="text-muted mb-4">מצאו שיעורי תורה בקרבת מקום</p>

                    {/* Cities rendered with .map() */}
                    <div className="row row-cols-1 row-cols-md-2 g-4 justify-content-center mx-auto" style={{ maxWidth: 540 }}>
                        {CITIES.map(city => (
                            <div key={city.name} className="col">
                                <Link to="/alllessons" className="text-decoration-none">
                                    <div className="card border-0 shadow-sm card-hover">
                                        <div className="card-body py-4 text-center">
                                            <div className="fs-1 mb-2">{city.emoji}</div>
                                            <h4 className="fw-bold mb-1 text-dark">{city.name}</h4>
                                            <span className="text-muted small">{city.count} שיעורים</span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Categories ── */}
            <section className="container py-5 text-center">
                <h2 className="fw-bold mb-2">גלו לפי קטגוריה</h2>
                <p className="text-muted mb-4">חקרו תחומים שונים בלימוד התורה</p>

                {/* Categories rendered with .map() */}
                <div className="d-flex flex-wrap justify-content-center gap-3">
                    {CATEGORIES.map(cat => (
                        <div
                            key={cat.name}
                            className="card border-0 shadow-sm card-hover text-center"
                            style={{ width: 130, cursor: 'pointer' }}
                            onClick={() => handleCategoryClick(cat.name)}
                        >
                            <div className="card-body py-3 px-2">
                                <div
                                    className="d-flex align-items-center justify-content-center rounded-3 mx-auto mb-2"
                                    style={{ width: 56, height: 56, background: cat.bg, fontSize: '1.5rem' }}
                                >
                                    {cat.icon}
                                </div>
                                <span className="fw-bold small text-dark">{cat.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="mx-3 mx-md-5 my-5 rounded-4 py-5 text-center" style={{ background: '#FDF9EC' }}>
                <div className="container">
                    <h2 className="fw-bold mb-2">מוכנים להתחיל?</h2>
                    <p className="text-muted mb-4">הצטרפו אלינו והתחילו ללמוד תורה עם הקהילה</p>
                    <div className="d-flex justify-content-center gap-3 flex-wrap">
                        <Link to="/login" className="btn btn-dark px-4 py-2 fw-bold">
                            התחברות →
                        </Link>
                        <Link to="/alllessons" className="btn btn-outline-dark px-4 py-2 fw-bold">
                            עיינו בשיעורים
                        </Link>
                    </div>
                </div>
            </section>

        </Layout>
    );
}

export default Home;
