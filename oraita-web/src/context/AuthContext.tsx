import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from '../services/api';

// Shape of the logged-in user
interface AuthUser {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    openToMatch?: boolean;
    gender?: 'זכר' | 'נקבה';
    favorites?: string[];
}

interface AuthContextType {
    user: AuthUser | null;
    loading: boolean;
    login: (userData: AuthUser, accessToken: string, refreshToken: string) => void;
    logout: () => void;
    updateUser: (updates: Partial<AuthUser>) => void;
    pendingMatchCount: number;
    refreshMatchCount: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [pendingMatchCount, setPendingMatchCount] = useState(0);

    // On app load — check if a token exists and restore the session
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setLoading(false);
            return;
        }
        api.get('/users/me')
            .then((res) => setUser(res.data.user))
            .catch(() => {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
            })
            .finally(() => setLoading(false));
    }, []);

    // Fetch the pending-incoming-match-requests count once per session (not
    // per page navigation — this used to live in Navbar, which remounts on
    // every route change and was hammering the API on every click).
    const refreshMatchCount = () => {
        if (!user) { setPendingMatchCount(0); return; }
        api.get('/matchrequests/me')
            .then((res) => {
                const count = (res.data.requests ?? []).filter(
                    (r: any) => r.to._id === user._id && r.status === 'pending'
                ).length;
                setPendingMatchCount(count);
            })
            .catch(() => {});
    };

    useEffect(() => {
        refreshMatchCount();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?._id]);

    const login = (userData: AuthUser, accessToken: string, refreshToken: string) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        setUser(userData);
    };

    const updateUser = (updates: Partial<AuthUser>) => {
        setUser((prev) => (prev ? { ...prev, ...updates } : prev));
    };

    const logout = async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            if (refreshToken) {
                await api.post('/users/logout', { refreshToken });
            }
        } catch {
            // ignore errors on logout
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setUser(null);
            setPendingMatchCount(0);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, updateUser, pendingMatchCount, refreshMatchCount }}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook for easy access in any component
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
}
