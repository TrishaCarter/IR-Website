import { useState } from 'react';
import { TextInput, PasswordInput, Button, Checkbox, Group, Anchor, Divider, Box, Text, Center, Stack, Title } from '@mantine/core';
import { IconMail, IconLock, IconBrandGoogle } from '@tabler/icons-react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../firebase';
import { useRouter } from 'next/router';

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

    let signInEmailPass = async () => {
        console.log('Signing in...');
        console.log('Email:', email);
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                let jwt = user.getIdToken();

                fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email })
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Success:', data);
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });

                console.log(user);
                setLoginMessage('Logged in successfully. Redirecting to dashboard...');
                router.push('/dashboard');
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage)
                setLoginMessage('Error: ' + errorMessage);
            });
    }

    let signInGoogle = async () => {
        console.log('Signing in with Google...');
        await signInWithPopup(auth, googleProvider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                // const credential = GoogleAuthProvider.credentialFromResult(result);
                // const token = credential.accessToken;
                // // The signed-in user info.
                // const user = result.user;
                console.log(result);
                setLoginMessage('Logged in successfully. Redirecting to dashboard...');

                // ----------- TODO -------------
                // Make sure to take account token here to make JWT
                // ------------------------------
                router.push('/dashboard');
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                // The email of the user's account used.
                const email = error.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);

            });
    }


    return (
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
                    leftIcon={<IconBrandGoogle size={18} />}
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
    );
}