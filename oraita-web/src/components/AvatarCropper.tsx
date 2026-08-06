import { useState, useRef, useEffect } from 'react';

const FRAME_SIZE = 280;
const OUTPUT_SIZE = 500;
const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

type Offset = { x: number; y: number };

type AvatarCropperProps = {
    file: File;
    onConfirm: (file: File, previewUrl: string) => void;
    onCancel: () => void;
};

// Modal that lets the user drag-to-reposition and zoom a freshly-picked
// profile picture inside a circular frame, then bakes the visible region
// into a square image via canvas before handing it back — so the uploaded
// file is already correctly cropped and every avatar spot in the app
// (comments, TeacherProfile, participants list) needs no special handling.
function AvatarCropper({ file, onConfirm, onCancel }: AvatarCropperProps) {
    const [url, setUrl] = useState('');
    const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(null);
    const [zoom, setZoom] = useState(1);
    const [offset, setOffset] = useState<Offset>({ x: 0, y: 0 });

    const imgRef = useRef<HTMLImageElement>(null);
    const dragRef = useRef<{ startX: number; startY: number; startOffset: Offset } | null>(null);

    // Object URL creation and revocation are paired inside the same effect run
    // (rather than creating once via a useState initializer and revoking on
    // cleanup) so this survives React StrictMode's dev-only double-invoke of
    // effects — otherwise the URL gets revoked out from under the still-visible <img>.
    useEffect(() => {
        const objectUrl = URL.createObjectURL(file);
        setUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [file]);

    const baseScale = naturalSize ? FRAME_SIZE / Math.min(naturalSize.w, naturalSize.h) : 1;
    const displayScale = baseScale * zoom;
    const dispW = naturalSize ? naturalSize.w * displayScale : 0;
    const dispH = naturalSize ? naturalSize.h * displayScale : 0;

    // Keeps the image edges from ever showing a gap inside the circular frame
    const clamp = (val: Offset, dW: number, dH: number): Offset => {
        const maxX = Math.max(0, (dW - FRAME_SIZE) / 2);
        const maxY = Math.max(0, (dH - FRAME_SIZE) / 2);
        return {
            x: Math.min(maxX, Math.max(-maxX, val.x)),
            y: Math.min(maxY, Math.max(-maxY, val.y)),
        };
    };

    const handleImgLoad = () => {
        const img = imgRef.current;
        if (!img) return;
        setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        dragRef.current = { startX: e.clientX, startY: e.clientY, startOffset: offset };
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!dragRef.current) return;
        const dx = e.clientX - dragRef.current.startX;
        const dy = e.clientY - dragRef.current.startY;
        setOffset(clamp(
            { x: dragRef.current.startOffset.x + dx, y: dragRef.current.startOffset.y + dy },
            dispW, dispH
        ));
    };

    const handlePointerUp = () => {
        dragRef.current = null;
    };

    const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const nextZoom = Number(e.target.value);
        setZoom(nextZoom);
        if (!naturalSize) return;
        const nextScale = baseScale * nextZoom;
        setOffset(prev => clamp(prev, naturalSize.w * nextScale, naturalSize.h * nextScale));
    };

    const handleConfirm = () => {
        const img = imgRef.current;
        if (!img || !naturalSize) return;

        // Map the visible frame region back to source-image pixel coordinates
        const imgLeft = FRAME_SIZE / 2 - dispW / 2 + offset.x;
        const imgTop = FRAME_SIZE / 2 - dispH / 2 + offset.y;
        const sx = -imgLeft / displayScale;
        const sy = -imgTop / displayScale;
        const sSize = FRAME_SIZE / displayScale;

        const canvas = document.createElement('canvas');
        canvas.width = OUTPUT_SIZE;
        canvas.height = OUTPUT_SIZE;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, sx, sy, sSize, sSize, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

        canvas.toBlob(blob => {
            if (!blob) return;
            const croppedFile = new File([blob], 'profile.jpg', { type: 'image/jpeg' });
            onConfirm(croppedFile, URL.createObjectURL(blob));
        }, 'image/jpeg', 0.9);
    };

    return (
        <div className="cropper-overlay" onClick={onCancel}>
            <div className="card border-0 shadow-lg p-4" style={{ maxWidth: 360 }} onClick={e => e.stopPropagation()}>
                <h6 className="fw-bold text-center mb-3">מיקום ותצוגה של התמונה</h6>

                <div className="d-flex justify-content-center mb-3">
                    <div
                        className="cropper-frame"
                        style={{ width: FRAME_SIZE, height: FRAME_SIZE }}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerLeave={handlePointerUp}
                    >
                        <img
                            ref={imgRef}
                            src={url}
                            alt="עריכת תמונת פרופיל"
                            onLoad={handleImgLoad}
                            draggable={false}
                            style={{
                                position: 'absolute',
                                width: dispW || undefined,
                                height: dispH || undefined,
                                left: FRAME_SIZE / 2 - dispW / 2 + offset.x,
                                top: FRAME_SIZE / 2 - dispH / 2 + offset.y,
                                userSelect: 'none',
                            }}
                        />
                    </div>
                </div>

                <input
                    type="range"
                    className="form-range mb-3"
                    min={MIN_ZOOM}
                    max={MAX_ZOOM}
                    step={0.01}
                    value={zoom}
                    onChange={handleZoomChange}
                />

                <p className="text-muted small text-center mb-3">
                    גררו את התמונה כדי למקם אותה, והשתמשו במחוון כדי להתקרב
                </p>

                <div className="d-flex gap-2 justify-content-center">
                    <button type="button" className="btn btn-dark px-4" onClick={handleConfirm} disabled={!naturalSize}>
                        אישור
                    </button>
                    <button type="button" className="btn btn-outline-secondary px-4" onClick={onCancel}>
                        ביטול
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AvatarCropper;
