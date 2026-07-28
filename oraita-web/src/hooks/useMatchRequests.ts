import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export interface MatchRequestParty {
    _id: string;
    name: string;
    phone?: string; // only present once the request is accepted
}

export interface MatchRequest {
    _id: string;
    from: MatchRequestParty;
    to: MatchRequestParty;
    lesson: { _id: string; title: string };
    note: string;
    status: 'pending' | 'accepted' | 'declined';
    createdAt: string;
}

/**
 * Fetches all match requests (sent or received) for the logged-in user,
 * and provides actions to send a new request or respond to one.
 */
export function useMatchRequests() {
    const { user, refreshMatchCount } = useAuth();
    const [requests, setRequests] = useState<MatchRequest[]>([]);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState('');

    const fetchRequests = useCallback(() => {
        // Anonymous visitors can land on pages that use this hook (e.g. a public
        // lesson page) — skip the call entirely rather than hitting an
        // authenticated route and triggering the global 401 → /login redirect.
        if (!user) {
            setLoading(false);
            return;
        }
        setLoading(true);
        api.get('/matchrequests/me')
            .then(res => setRequests(res.data.requests ?? []))
            .catch(() => setError('שגיאה בטעינת בקשות ההיכרות'))
            .finally(() => setLoading(false));
    }, [user]);

    useEffect(() => { fetchRequests(); }, [fetchRequests]);

    const incoming = requests.filter(r => user && r.to._id === user._id && r.status === 'pending');
    const outgoing = requests.filter(r => user && r.from._id === user._id && r.status === 'pending');
    const accepted = requests.filter(r => r.status === 'accepted');
    // Requests the viewer sent that were declined — surfaced so the sender is
    // actually told "no" instead of the request silently vanishing (it can
    // still be re-sent afterward, this is purely about visibility).
    const declined = requests.filter(r => user && r.from._id === user._id && r.status === 'declined');

    const sendRequest = async (toUserId: string, lessonId: string, note: string) => {
        await api.post(`/matchrequests/${toUserId}`, { lessonId, note });
        fetchRequests();
    };

    const respond = async (id: string, status: 'accepted' | 'declined') => {
        await api.patch(`/matchrequests/${id}`, { status });
        fetchRequests();
        refreshMatchCount(); // pending-incoming count changed — keep the navbar badge in sync
    };

    return { requests, incoming, outgoing, accepted, declined, loading, error, sendRequest, respond, refetch: fetchRequests };
}
