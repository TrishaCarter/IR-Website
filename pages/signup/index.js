import { useState } from 'react';
import { TextInput, PasswordInput, Button, Checkbox, Group, Anchor, Divider, Box, Text, Center, Stack, Title, RemoveScroll } from '@mantine/core';
import { IconMail, IconLock, IconBrandGoogle } from '@tabler/icons-react';
import { createUserWithEmailAndPassword, setPersistence, browserSessionPersistence, signInWithPopup } from 'firebase/auth';
import { getDoc, setDoc, doc } from 'firebase/firestore';
import { loginUser } from '@/handlers';
import { auth, googleProvider, db } from '../../firebase';
import { useRouter } from 'next/router';
import { notifications } from '@mantine/notifications';
import Head from 'next/head';

export default function SignInPage() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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

    let signUpEmailPass = async () => {
        await setPersistence(auth, browserSessionPersistence);
        await createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                notifications.show({ // Show success notification
                    title: 'Account Created!',
                    message: 'Account created successfully. Redirecting to dashboard...',
                    color: 'green',
                });
                router.push('/login');
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                notifications.show({ // Show success notification
                    title: 'Error creating account',
                    message: 'Please try again.',
                    color: 'red',
                });
            });
    }

    let signupGoogle = async () => {
        try {
            await setPersistence(auth, browserSessionPersistence);
            let gAuth = await signInWithPopup(auth, googleProvider);
            let uid = gAuth.user.uid;

            let userDoc = await getUserDoc(uid);
            if (userDoc) {
                console.log('User data found:', userDoc);
                notifications.show({ // Show success notification
                    title: 'Google Login Successful',
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
                notifications.show({ // Show success notification
                    title: 'Google Login Successful',
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
            notifications.show({ // Show success notification
                title: 'Error with Google Sign In',
                message: 'Please try again.',
                color: 'red',
            });

        }
    }

    return <RemoveScroll>
        <Head>
            <title>Sign Up - Refactr</title>
        </Head>
        <Center style={{ minHeight: '100vh', minWidth: '100vw', backgroundColor: theme.background }}>
            <Box sx={{ minWidth: 400, width: '100%', padding: 24, borderRadius: 8 }}>
                {/* <Title order={1}>IR Website (Name tbd)</Title> */}
                {/* Header */}
                <Title order={1} align="left" weight={700} style={{ color: theme.accentColor, marginBottom: 8 }}>
                    Create Your Account
                </Title>
                <br />

                {/* Google Sign In */}
                <Button
                    miw={"100%"}
                    // bg={theme.accentColor}
                    c={theme.accentColor}
                    variant='outline'
                    // leftIcon={<IconBrandGoogle size={18} />}
                    mt="md"
                    radius="md"
                    style={{ borderColor: theme.accentColor, color: theme.accentColor }}
                    onClick={signupGoogle}
                >
                    Sign in with Google
                </Button>

                {/* Divider */}
                <Stack position="apart" align='center' mt={"xl"} mb={"lg"} >
                    <Divider size="sm" label="OR" labelPosition="center" style={{ width: '75%' }} />
                </Stack>

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
                    <Text c={theme.secondaryTextColor}>Password must be atleast 6 characters long</Text>
                </Stack>

                <br />

                {/* Sign Up Button */}
                < Button
                    fullWidth size="md" radius="md"
                    onClick={signUpEmailPass}
                    style={{ backgroundColor: theme.accentColor }}
                >
                    Create Account
                </Button>

                {/* Footer */}
                <Text align="center" size="sm" style={{ color: theme.primaryTextColor, marginTop: 16 }}>
                    Already have an account?{' '}
                    <Anchor href="/login" style={{ color: theme.accentColor }}>
                        Log in here
                    </Anchor>
                </Text>

            </Box>
        </Center >
    </RemoveScroll>;
}