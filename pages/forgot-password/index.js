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
                {/* Header */}
                <Title order={1} align="left" weight={700} style={{ color: theme.accentColor, marginBottom: 8 }}>
                    Forgot Password
                </Title>
                <Text size="sm" style={{ color: theme.primaryTextColor, marginBottom: 24 }}>
                    Need to reset your password? Enter your email address below, <br />and we will send you a link to reset your password.
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
                </Stack>
                <br />

                {/* Sign In Button */}
                < Button fullWidth size="md" radius="md" style={{ backgroundColor: theme.accentColor }}>
                    Send email
                </Button>

                {/* Footer */}
                <Text align="center" size="sm" style={{ color: theme.primaryTextColor, marginTop: 16 }}>
                    <Anchor href="/login" style={{ color: theme.accentColor }}>
                        Return to login here
                    </Anchor>
                </Text>
            </Box>
        </Center >
    );
}