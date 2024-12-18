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
                </Stack>

                <br />

                {/* Sign Up Button */}
                < Button fullWidth size="md" radius="md" style={{ backgroundColor: theme.accentColor }}>
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
    );
}