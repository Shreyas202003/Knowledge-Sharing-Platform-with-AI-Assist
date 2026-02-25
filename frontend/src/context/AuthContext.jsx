import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            // Potentially fetch user profile here to verify token
            checkAuth();
        } else {
            setLoading(false);
        }
    }, []);

    const checkAuth = async () => {
        try {
            // Use the refresh endpoint as a way to check if we have a valid session/cookie
            const res = await api.post('/auth/refresh');
            const { accessToken, ...userData } = res.data.data;
            localStorage.setItem('accessToken', accessToken);
            setUser(userData);
        } catch (err) {
            localStorage.removeItem('accessToken');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = (userData, accessToken) => {
        localStorage.setItem('accessToken', accessToken);
        setUser(userData);
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } finally {
            localStorage.removeItem('accessToken');
            setUser(null);
            window.location.href = '/login';
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
