import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { message } from 'antd';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = sessionStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    useEffect(() => {
        if (user) {
            sessionStorage.setItem('user', JSON.stringify(user));
        } else {
            sessionStorage.removeItem('user');
        }
    }, [user]);

    const navigate = useNavigate();

    const login = async (username, password) => {
        try {
            const response = await axios.post('https://dummyjson.com/auth/login', { username, password });
            const data = response.data;
            if (data.accessToken) {
                setUser(data);
                sessionStorage.setItem('user', JSON.stringify(data));
                navigate('/dashboard');
            }
        } catch (error) {
            message.error('Login failed');
            console.error('Login failed', error);
        }
    };

    const logout = () => {
        setUser(null);
        sessionStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
