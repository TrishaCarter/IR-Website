
import { Container, Space, Text, SimpleGrid, Box, Divider, Button, Stack, Flex, Grid } from "@mantine/core"
import Navbar from "../../components/Navbar"

export default function Profile() {

    let boxStyling = {
        backgroundColor: "grey",
        padding: "20px",
        borderRadius: "8px",
    }

    return <Flex direction="column" align={"center"}>
        <Navbar />
        <Space h="lg" />
        <Grid grow columns={12} w={"90%"}>
            <Grid.Col span={8}>
                <Box style={boxStyling}>
                    <Text align="center" size="xl">Profile</Text>
                    <Divider />
                    <Space h="md" />
                    <SimpleGrid cols={2} spacing="md">
                        <Text>Username:</Text>
                        <Text>John Doe</Text>
                        <Text>Email:</Text>
                    </SimpleGrid>
                </Box>
            </Grid.Col>

            <Grid.Col span={4}>
                <Box style={boxStyling}>
                    <Text align="center" size="xl">Actions</Text>
                    <Divider />
                    <Space h="md" />
                    <Stack spacing="md">
                        <Button fullWidth color="blue">Change Password</Button>
                        <Button fullWidth color="red">Delete Account</Button>
                    </Stack>
                </Box>
            </Grid.Col>
        </Grid>

    </Flex>
}