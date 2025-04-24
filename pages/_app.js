import '@mantine/notifications/styles.css';
import '@mantine/core/styles.css';

import Head from 'next/head';
import { MantineProvider } from '@mantine/core';
import { useState, useEffect, createContext, useContext } from "react";
import { auth } from "@/firebase"; // Import auth from your Firebase setup
import { onAuthStateChanged } from "firebase/auth";
import { Notifications } from '@mantine/notifications';


let theme = {
    background: "#16171b",
    secondaryBackground: "#262729",
    primaryTextColor: "#c9c9c9",
    secondaryTextColor: "#aaaaaa",
    accentColor: "#629C44",
};

export default function App({ Component, pageProps }) {
    return (
        <MantineProvider defaultColorScheme='dark'>
            <Head>
                <title>Mantine Template</title>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
                />
                <link rel="shortcut icon" href="/favicon.svg" />
            </Head>
            <AuthProvider>
                <Notifications bg={theme.background} />
                <Component {...pageProps} />
            </AuthProvider>
        </MantineProvider>
    );
}

// Create Auth Context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => { // Create an async function
            try {
                await setPersistence(auth, browserSessionPersistence); // Set persistence
                // Listen for user authentication state changes
                const unsubscribe = onAuthStateChanged(auth, (user) => {
                    setUser(user || null);
                    setLoading(false);
                });

                return () => unsubscribe(); // Cleanup subscription
            } catch (error) {
                console.error("Firebase Auth Persistence Error:", error);
                setLoading(false); // Ensure loading is set to false even on error
            }
        };

        initializeAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// Custom Hook for Accessing Auth Context
export const useAuth = () => useContext(AuthContext);