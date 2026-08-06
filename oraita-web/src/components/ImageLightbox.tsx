import { useEffect } from 'react';

type ImageLightboxProps = {
    src: string;
    alt: string;
    onClose: () => void;
};

// Full-size click-to-enlarge view for a profile picture — dismissible via
// backdrop click, the close button, or Escape.
function ImageLightbox({ src, alt, onClose }: ImageLightboxProps) {
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onClose]);

    return (
        <div className="lightbox-overlay" onClick={onClose}>
            <button
                type="button"
                className="btn btn-light btn-sm rounded-circle lightbox-close"
                onClick={onClose}
                aria-label="סגירה"
            >
                ✕
            </button>
            <img
                src={src}
                alt={alt}
                className="lightbox-img"
                onClick={e => e.stopPropagation()}
            />
        </div>
    );
}

export default ImageLightbox;
