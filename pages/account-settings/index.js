import { useState } from 'react';
import { TextInput, PasswordInput, Button, Switch, Group, Box, Title, Avatar, FileButton, Center } from '@mantine/core';
import { auth } from '../../firebase';
import { updateProfile, updatePassword } from 'firebase/auth';

const theme = {
    background: '#16171b',
    secondaryBackground: '#262729',
    primaryTextColor: '#c9c9c9',
    secondaryTextColor: '#aaaaaa',
    accentColor: '#629C44',
};

export default function AccountSettings() {
    const user = auth.currentUser;
    const [username, setUsername] = useState(user?.displayName || '');
    const [email, setEmail] = useState(user?.email || '');
    const [password, setPassword] = useState('');
    const [darkMode, setDarkMode] = useState(false);
    const [avatar, setAvatar] = useState(user?.photoURL || '');
    
    const handleUpdateProfile = async () => {
        try {
            await updateProfile(user, {
                displayName: username,
                photoURL: avatar,
            });
            alert('Profile updated successfully!');
        } catch (error) {
            alert('Error updating profile: ' + error.message);
        }
    };

    const handleUpdatePassword = async () => {
        try {
            if (password) {
                await updatePassword(user, password);
                alert('Password updated successfully!');
            }
        } catch (error) {
            alert('Error updating password: ' + error.message);
        }
    };

    return (
        <Center style={{ background: theme.background, height: '100vh' }}>
            <Box sx={{ maxWidth: 400, padding: '20px', background: theme.secondaryBackground, borderRadius: '8px', color: theme.primaryTextColor }}>
                <Title order={2} mb="md" style={{ color: theme.accentColor }}>Account Settings</Title>
                <Avatar src={avatar} alt="Profile Picture" size={80} mb="md" />
                <FileButton onChange={(file) => setAvatar(URL.createObjectURL(file))} accept="image/*">
                    {(props) => <Button {...props}>Upload New Picture</Button>}
                </FileButton>
                <TextInput label="Username" value={username} onChange={(e) => setUsername(e.target.value)} mb="sm" />
                <TextInput label="Email" value={email} disabled mb="sm" />
                <PasswordInput label="New Password" value={password} onChange={(e) => setPassword(e.target.value)} mb="sm" />
                <Switch label="Dark Mode" checked={darkMode} onChange={(event) => setDarkMode(event.currentTarget.checked)} mb="md" />
                <Group position="apart" mt="md">
                    <Button onClick={handleUpdateProfile}>Save Changes</Button>
                    <Button color="red" onClick={handleUpdatePassword}>Update Password</Button>
                </Group>
            </Box>
        </Center>
    );
}
