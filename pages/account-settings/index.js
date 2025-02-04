import { useState } from 'react';
import { TextInput, PasswordInput, Button, Switch, Group, Box, Title, Avatar, FileButton, Center } from '@mantine/core';
import { auth } from '../../firebase';
import { updateProfile, updatePassword } from 'firebase/auth';
import Navbar from "../../components/Navbar";

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
        <>
            <Navbar />
            <Center style={{ background: theme.background, minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Title order={1} mb="md" style={{ color: theme.primaryTextColor, fontSize: '3rem' }}>Account Settings</Title>
                <Box sx={{ maxWidth: 600, padding: '40px', background: theme.secondaryBackground, borderRadius: '8px', color: theme.primaryTextColor }}>
                    <Center style={{ marginBottom: '30px', flexDirection: 'column' }}>
                        <Avatar src={avatar} alt="Profile Picture" size={150} mb="md"/> {/* Increased size from 100 to 150 */}
                        <FileButton onChange={(file) => setAvatar(URL.createObjectURL(file))} accept="image/*"> 
                            {(props) => <Button {...props} size="md">Upload New Picture</Button>}
                        </FileButton>
                    </Center> 
                    <TextInput label="Username" value={username} onChange={(e) => setUsername(e.target.value)} mb="sm" size="md" />
                    <TextInput label="Email" value={email} disabled mb="sm" size="md" />
                    <PasswordInput label="New Password" value={password} onChange={(e) => setPassword(e.target.value)} mb="lg" size="md" />
                    <Switch label="Dark Mode" checked={darkMode} onChange={(event) => setDarkMode(event.currentTarget.checked)} mb="xl" size="lg" />
                    <Group position="apart" mt="xl">
                        <Button onClick={handleUpdateProfile} size="xl">Save Changes</Button>
                        <Button color="red" onClick={handleUpdatePassword} size="xl">Update Password</Button>
                    </Group>
                </Box>
            </Center>
        </>
    );
}
