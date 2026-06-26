import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const base = (process.env.SERVER_URL || 'http://localhost:3000') + '/';

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, 'public/');
    },
    filename: (_req, file, cb) => {
        const ext = file.originalname.split('.').filter(Boolean).slice(1).join('.');
        cb(null, `${Date.now()}.${ext}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif|webp/;
        const ok = allowed.test(path.extname(file.originalname).toLowerCase()) &&
                   allowed.test(file.mimetype);
        cb(null, ok);
    }
});

router.post('/', upload.single('file'), (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const filePath = req.file.path.replace(/\\/g, '/');
    const url = base + filePath;
    console.log('File uploaded:', url);
    return res.status(200).json({ url });
});

export default router;
