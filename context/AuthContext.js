import React, { createContext, useState, useEffect } from 'react';
import supabase from '../supabaseClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const session = supabase.auth.getSession();
        setUser(session?.user || null);

        supabase.auth.onAuthStateChange((_, session) => {
            setUser(session?.user || null);
        });
    }, []);

    const signIn = async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
    };

    const signUp = async (email, password) => {
        const { error } = await supabase.auth.signUp(
            { email, password },
            { redirectTo: null }
        );
        if (error) throw error;
    };

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};
