import { useState } from 'react';
import { TextInput, PasswordInput, Button, Checkbox, Group, Anchor, Divider, Box, Text, Center, Stack, Title } from '@mantine/core';
import { IconMail, IconLock, IconBrandGoogle } from '@tabler/icons-react';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../firebase';
import { useRouter } from 'next/router';

export default function SignInPage() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // State used for success or failure message on signup
    const [signupText, setSignupText] = useState('');

    let theme = {
        background: '#16171b',
        secondaryBackground: '#262729',
        primaryTextColor: '#c9c9c9',
        secondaryTextColor: '#aaaaaa',
        accentColor: '#629C44',
    }

    let signUpEmailPass = async () => {
        console.log('Signing up...');
        console.log('Email:', email);
        console.log('Password', password);

        await createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log(user);
                setSignupText('Account created successfully. Redirecting to login page...');
                router.push('/login');
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                // ..
            });
    }

    let signupGoogle = async () => {
        console.log('Signing up with Google...');
        await signInWithPopup(auth, googleProvider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                // const credential = GoogleAuthProvider.credentialFromResult(result);
                // const token = credential.accessToken;
                // // The signed-in user info.
                // const user = result.user;
                console.log(result);
                setSignupText('Account created successfully. Redirecting to login page...');

                // ----------- TODO -------------
                // Make sure to take account token here to make JWT
                // ------------------------------

                router.push('/dashboard');
            }).catch((error) => {
                // Handle Errors here.
                // const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage);
                // The email of the user's account used.
                // const email = error.email;
                // The AuthCredential type that was used.
                // const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
            });
    }

    return (
        <Center style={{ minHeight: '100vh', backgroundColor: theme.background }}>
            <Box sx={{ minWidth: 400, width: '100%', padding: 24, borderRadius: 8 }}>
                {/* <Title order={1}>IR Website (Name tbd)</Title> */}
                {/* Header */}
                <Title order={1} align="left" weight={700} style={{ color: theme.accentColor, marginBottom: 8 }}>
                    Create Your Account
                </Title>
                <br />

                {/* Google Sign In */}
                <Button
                    fullWidth
                    variant="outline"
                    leftIcon={<IconBrandGoogle size={18} />}
                    color="gray"
                    mt="md"
                    radius="md"
                    style={{ borderColor: theme.accentColor, color: theme.accentColor, minWidth: '300px', width: "25vw" }}
                    onClick={signupGoogle}
                >
                    Sign in with Google
                </Button>

                {/* Divider */}
                <Stack position="apart" align='center' mt="md">
                    <Divider size="sm" label="Or" labelPosition="center" style={{ width: '45%' }} />
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
                    <Text>Password must be atleast 6 characters long</Text>
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

                <br />

                <Text align="center" size="sm" style={{ color: theme.primaryTextColor }}>
                    {signupText}
                </Text>
            </Box>
        </Center >
    );
}