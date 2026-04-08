"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

// Decoded minimal user shape matching backend login return data properties
export interface AuthUser {
    id: string;
    email: string;
    name: string;
    role: 'ADMIN' | 'SELLER' | 'BUYER';
    createdAt: string;
    updatedAt?: string;
}

interface AuthContextType {
    user: AuthUser | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (userData: AuthUser, tokenData: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Initial Hydration from local storage immediately on mount
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        if (storedUser && storedToken) {
            try {
                setUser(JSON.parse(storedUser));
                setToken(storedToken);
            } catch (e) {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
        setIsLoading(false);
    }, []);

    const login = (userData: AuthUser, tokenData: string) => {
        setUser(userData);
        setToken(tokenData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', tokenData);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/login'; // Force clear flush security
    };

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
