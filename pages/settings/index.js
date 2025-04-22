import { useState, useEffect } from 'react';
import { TextInput, PasswordInput, Button, Switch, Group, Box, Title, Avatar, FileButton, Center, FileInput } from '@mantine/core';
import { auth, updateUserProfilePic, uploadProfilePic, getUserDoc } from '../../firebase';
import { updatePassword } from 'firebase/auth';
import Navbar from "../../components/Navbar";
import { useRouter } from 'next/router';

const theme = {
    background: '#16171b',
    secondaryBackground: '#262729',
    primaryTextColor: '#c9c9c9',
    secondaryTextColor: '#aaaaaa',
    accentColor: '#629C44',
};

export default function AccountSettings() {
    let router = useRouter();
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState(auth.currentUser?.displayName || '');
    const [email, setEmail] = useState(user?.email || '');
    const [password, setPassword] = useState('');
    const [darkMode, setDarkMode] = useState(false);
    const [avatar, setAvatar] = useState(auth.currentUser?.photoURL || null);
    const [preview, setPreview] = useState(null);

    // State for tracking changed inputs
    const [avatarChanged, setAvatarChanged] = useState(false);
    const [usernameChanged, setUsernameChanged] = useState(false);
    const [emailChanged, setEmailChanged] = useState(false);
    const [passwordChanged, setPasswordChanged] = useState(false);

    useEffect(() => {
        let getUser = async () => {
            let userData = await auth.currentUser;
            let userDoc = await getUserDoc(auth.currentUser.uid);

            if (userData == null) {
                console.log("No user logged in");
                router.push("/login")
                return;
            }
            console.log(userData);

            setEmail(userData.email);
            setUsername(userDoc.username || '');
            setPreview(userDoc.photoURL || null);
        }

        getUser();
    }, [])

    const handleImageUpload = async (e) => {
        const selected = e
        console.log("SELECTED:", selected);

        setPreview(URL.createObjectURL(selected));
        setAvatar(selected);
        setAvatarChanged(true);
    }

    const handleUpdatePassword = async () => {
        try {
            if (password) {
                await updatePassword(auth.currentUser, password);
                alert('Password updated successfully!');
            }
        } catch (error) {
            alert('Error updating password: ' + error.message);
        }
    };

    const handleUpdateProfile = async () => {
        try {
            if (avatarChanged) {
                console.log("FILE:", avatar);
                let downloadURL = await uploadProfilePic(avatar, auth.currentUser?.uid);
                await updateUserProfilePic(auth.currentUser?.uid, downloadURL);
                alert("Profile picture updated successfully!");
            }

            if (usernameChanged) {
                await
                    alert("Username updated successfully!");
            }
        } catch (error) {
            console.log(error);

        }
    };

    return (
        <>
            <Navbar />
            < Center c={theme.primaryTextColor} style={{ background: theme.background, minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }
            }>
                <Title order={1} mb="md" style={{ color: theme.primaryTextColor, fontSize: '3rem' }}> Account Settings </Title>
                <Box sx={{ maxWidth: 600, padding: '40px', background: theme.secondaryBackground, borderRadius: '8px', color: theme.primaryTextColor }}>
                    <Center style={{ marginBottom: '30px', flexDirection: 'column' }}>
                        <Avatar src={preview} alt="Profile Picture" size={150} mb="md" />
                        <FileButton onChange={(e) => handleImageUpload(e)} accept='image/png,image/jpeg'>
                            {(props) => <Button {...props} >Upload image</Button>}
                        </FileButton>
                    </Center>
                    < TextInput label="Username" value={username} onChange={(e) => setUsername(e.target.value)} mb="sm" size="md" />
                    <TextInput label="Email" value={email} disabled mb="sm" size="md" />
                    <PasswordInput label="New Password" value={password} onChange={(e) => setPassword(e.target.value)} mb="lg" size="md" />
                    <Group position="apart" mt="xl" >
                        <Button onClick={handleUpdateProfile} size="xl" > Save Changes </Button>
                        < Button color="red" onClick={handleUpdatePassword} size="xl" > Update Password </Button>
                    </Group>
                </Box>
            </Center>
        </>
    );
}
