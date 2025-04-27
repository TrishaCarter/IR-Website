import { useEffect, useState } from 'react';
import { TextInput, PasswordInput, Button, Checkbox, Group, Anchor, Header, Divider, Box, Text, Center, Stack, Title, RemoveScroll } from '@mantine/core';
import { IconMail, IconLock, IconBrandGoogle } from '@tabler/icons-react';
import { setPersistence, browserSessionPersistence, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, db } from '../../firebase';
import { getDoc, setDoc, doc } from 'firebase/firestore';
import { notifications } from '@mantine/notifications';
import { loginUser } from '@/handlers';
import { useRouter } from 'next/router';
import Head from "next/head"

export default function SignInPage() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // State used for success or failure message on login
    const [loginMessage, setLoginMessage] = useState('');

    let theme = {
        background: '#16171b',
        secondaryBackground: '#262729',
        primaryTextColor: '#c9c9c9',
        secondaryTextColor: '#aaaaaa',
        accentColor: '#629C44',
    }

    let createUserDoc = async (uid, data) => {
        try {
            await setDoc(doc(db, 'USERS', uid), data);
        } catch (error) {
            console.error('Firestore Error: ', error);
        }
    }

    let getUserDoc = async (uid) => {
        let docRef = doc(db, 'USERS', uid);
        let docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            return docSnap.data();
        } else {
            console.log("No such document!");
            return null;
        }
    }

    let signInEmailPass = async () => {
        try {
            await setPersistence(auth, browserSessionPersistence);
            let gAuth = await signInWithEmailAndPassword(auth, email, password);
            let uid = gAuth.user.uid;

            let userDoc = await getUserDoc(uid);
            if (userDoc) {
                notifications.show({ // Show success notification
                    title: 'Login Successful',
                    message: 'Logged in successfully. Redirecting to dashboard...',
                    color: 'green',
                });
                loginUser(uid).then(() => {
                    router.push('/dashboard');
                }).catch((error) => {
                    console.error('Error with User Cookie:', error);
                });
                return;
            }

            let userData = {
                email: gAuth.user.email,
                displayName: gAuth.user.displayName
            }

            try {
                createUserDoc(uid, userData);
                console.log("User data created successfully.");
                notifications.show({ // Show success notification
                    title: 'Login Successful',
                    message: 'Logged in successfully. Redirecting to dashboard...',
                    color: 'green',
                });
                router.push('/dashboard');
            } catch (error) {
                console.error('Error creating user data:', error);
            }

        } catch (error) {
            console.log("Error with Google Sign In Popup:")
            console.error(error);
            notifications.show({ // Show error notification
                title: 'Login Failed',
                message: error.message,
                color: 'red',
            });
        }
    }

    let signInGoogle = async () => {

        try {
            await setPersistence(auth, browserSessionPersistence);
            let gAuth = await signInWithPopup(auth, googleProvider);
            let uid = gAuth.user.uid;

            let userDoc = await getUserDoc(uid);
            if (userDoc) {
                console.log('User data found:', userDoc);
                setLoginMessage('Logged in successfully. Redirecting to dashboard...');
                notifications.show({ // Show success notification
                    title: 'Login Successful',
                    message: 'Logged in successfully. Redirecting to dashboard...',
                    color: 'green',
                });
                loginUser(uid).then(() => {
                    router.push('/dashboard');
                }).catch((error) => {
                    console.error('Error with User Cookie:', error);
                });
                return;
            }

            let userData = {
                email: gAuth.user.email,
                displayName: gAuth.user.displayName,
            }

            try {
                createUserDoc(uid, userData);
                console.log("User data created successfully.");
                router.push('/dashboard');
            } catch (error) {
                console.error('Error creating user data:', error);
            }

        } catch (error) {
            console.log("Error with Google Sign In Popup:")
            console.error(error);
            notifications.show({ // Show error notification
                title: 'Login Failed',
                message: error.message,
                color: 'red',
            });
        }

    }

    return <RemoveScroll>
        <Head>
            <title>Log In - Refactr</title>
        </Head>
        <Center style={{ minHeight: '100vh', backgroundColor: theme.background }}>
            <Box sx={{ maxWidth: 400, width: '100%', padding: 24, borderRadius: 8 }}>
                {/* <Title order={1}>IR Website (Name tbd)</Title> */}
                {/* Header */}
                <Title order={1} align="left" weight={700} style={{ color: theme.accentColor, marginBottom: 8 }}>
                    Log in
                </Title>
                <Text size="sm" style={{ color: theme.primaryTextColor, marginBottom: 24 }}>
                    Log in by entering your email address and password.
                </Text>

                {/* Email Input */}
                <Stack spacing="sm">
                    <TextInput
                        icon={<IconMail size={18} />}
                        label="Email address"
                        placeholder="email@address.com"
                        value={email}
                        onChange={(e) => setEmail(e.currentTarget.value)}
                        radius="md"
                        styles={{ input: { backgroundColor: theme.secondaryBackground, color: theme.secondaryTextColor }, label: { color: theme.primaryTextColor } }}
                    />

                    {/* Password Input */}
                    <PasswordInput
                        icon={<IconLock size={18} />}
                        label="Password"
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.currentTarget.value)}
                        radius="md"
                        styles={{
                            input: {
                                backgroundColor: theme.secondaryBackground, color: theme.secondaryTextColor
                            }, label: { color: theme.primaryTextColor }
                        }}
                    />
                </Stack>

                {/* Forgot Password */}
                <Anchor href="#" size="sm" style={{ color: theme.primaryTextColor, display: 'block', marginTop: 8, marginBottom: 24 }}>
                    Forgot password?
                </Anchor>

                <Checkbox label="Remember me" size="sm" color="green" styles={{
                    label: {
                        color: theme.primaryTextColor
                    }
                }} />
                <br />

                {/* Sign In Button */}
                < Button
                    fullWidth size="md" radius="md"
                    onClick={signInEmailPass}
                    style={{ backgroundColor: theme.accentColor }}>
                    Log in
                </Button>

                {/* Remember Me + Divider */}
                <Stack position="apart" align='center' mt="md">
                    <Divider size="sm" label="Or" labelPosition="center" style={{ width: '45%' }} />
                </Stack>

                {/* Google Sign In */}
                <Button
                    fullWidth
                    variant="outline"
                    // leftIcon={<IconBrandGoogle size={18} />}
                    color="gray"
                    mt="md"
                    radius="md"
                    style={{ borderColor: theme.accentColor, color: theme.accentColor }}
                    onClick={signInGoogle}
                >
                    Sign in with Google
                </Button>

                {/* Footer */}
                <Text align="center" size="sm" style={{ color: theme.primaryTextColor, marginTop: 16 }}>
                    Don’t have an account?{' '}
                    <Anchor href="/signup" style={{ color: theme.accentColor }}>
                        Sign up here
                    </Anchor>
                </Text>

                <br />

                <Text align="center" size="sm" style={{ color: theme.primaryTextColor, marginTop: 16 }}>
                    {loginMessage}
                </Text>
            </Box>
        </Center >
    </RemoveScroll>
}