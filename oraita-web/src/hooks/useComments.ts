import { useState, useEffect } from 'react';
import api from '../services/api';

export interface Comment {
    _id: string;
    text: string;
    user: { _id: string; name: string };
    createdAt: string;
}

/**
 * Fetches comments for a lesson and provides an addComment action.
 * SingleLesson page just renders the list and the form.
 */
export function useComments(lessonId: string | undefined) {
    const [comments,     setComments]     = useState<Comment[]>([]);
    const [commentText,  setCommentText]  = useState('');
    const [commentError, setCommentError] = useState('');

    useEffect(() => {
        if (!lessonId) return;
        api.get(`/comments/lesson/${lessonId}`)
            .then(res => setComments(res.data.comments))
            .catch(() => {}); // comments are optional — don't block the page
    }, [lessonId]);

    const addComment = async (e: { preventDefault(): void }) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        setCommentError('');
        try {
            const res = await api.post(`/comments/${lessonId}`, { text: commentText });
            setComments(prev => [res.data.comment, ...prev]); // prepend — newest first
            setCommentText('');
        } catch (err: any) {
            setCommentError(err.response?.data?.message || 'שגיאה בשליחת הביקורת');
        }
    };

    return { comments, commentText, setCommentText, commentError, addComment };
}
