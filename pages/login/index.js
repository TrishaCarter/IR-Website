import { useState } from 'react';
import { TextInput, PasswordInput, Button, Checkbox, Group, Anchor, Divider, Box, Text, Center, Stack, Title } from '@mantine/core';
import { IconMail, IconLock, IconBrandGoogle } from '@tabler/icons-react';

export default function SignInPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    let theme = {
        background: '#16171b',
        secondaryBackground: '#262729',
        primaryTextColor: '#c9c9c9',
        secondaryTextColor: '#aaaaaa',
        accentColor: '#629C44',
    }

    return (
        <Center style={{ minHeight: '100vh', backgroundColor: theme.background }}>
            <Box sx={{ maxWidth: 400, width: '100%', padding: 24, borderRadius: 8 }}>
                {/* <Title order={1}>IR Website (Name tbd)</Title> */}
                {/* Header */}
                <Title order={1} align="center" weight={700} style={{ color: theme.accentColor, marginBottom: 8 }}>
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
                < Button fullWidth size="md" radius="md" style={{ backgroundColor: theme.accentColor }}>
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
                >
                    Sign in with Google
                </Button>

                {/* Footer */}
                <Text align="center" size="sm" style={{ color: theme.primaryTextColor, marginTop: 16 }}>
                    Don’t have an account?{' '}
                    <Anchor href="#" style={{ color: theme.accentColor }}>
                        Sign up here
                    </Anchor>
                </Text>
            </Box>
        </Center >
    );
}