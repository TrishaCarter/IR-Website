import { useEffect, useState } from 'react';
import { TextInput, Textarea, Button, Group, Title, Flex, Container } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { ActionIcon } from '@mantine/core';
import Navbar from '../../../components/Navbar';

export default function CreateProblem() {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('Refactr Dev Team');
    const [description, setDescription] = useState('');
    const [constraints, setConstraints] = useState([""]);

    useEffect(() => {
        console.log(constraints);
    }, [constraints]);

    let theme = {
        background: '#16171b',
        secondaryBackground: '#262729',
        primaryTextColor: '#c9c9c9',
        secondaryTextColor: '#aaaaaa',
        accentColor: '#629C44',
    }

    let addProblemToDB = async () => {
    }

    return <Flex w={"100vw"} h={"100vh"} m={0} direction={"column"} align={"center"} bg={theme.background} c={theme.primaryTextColor}>
        <Navbar />
        <Title order={2} align="center" mt="md" mb="lg" pt={40}>
            Create a Problem
        </Title>
        <Container>
            <TextInput
                label="Title"
                placeholder="Enter the problem title"
                value={title}
                onChange={(event) => setTitle(event.currentTarget.value)}
                required
                mb="md"
                w={"40vw"}
            />
            <TextInput
                label="Author"
                value={author}
                onChange={(event) => setAuthor(event.currentTarget.value)}
                required
                mb="md"
                w={"40vw"}
            />
            <Textarea
                label="Description"
                placeholder="Enter the problem description"
                value={description}
                onChange={(event) => setDescription(event.currentTarget.value)}
                required
                mb="md"
                w={"60vw"}
            />
            <Title order={4} mt="md">Constraints</Title>
            {constraints.map((constraint, index) => (
                <Group key={index} mt="xs">
                    <TextInput
                        placeholder={`Constraint ${index + 1}`}
                        value={constraint}
                        onChange={(event) => {
                            const newConstraints = [...constraints];
                            newConstraints[index] = event.currentTarget.value;
                            setConstraints(newConstraints);
                        }}
                        w={"30vw"}
                    />
                    <ActionIcon
                        color="red"
                        variant="outline"
                        onClick={() => setConstraints(constraints.filter((_, i) => i !== index))}
                        disabled={constraints.length === 1} // Prevent removing the last constraint
                    >
                        <IconTrash size={18} />
                    </ActionIcon>
                </Group>
            ))}
            <Button
                variant="light"
                mt="md"
                onClick={() => setConstraints([...constraints, ""])}
            >
                Add Constraint
            </Button>

            <br /><br />
            <Flex w={"100%"} justify={"center"}>
                <Button type="submit" w={"20vw"} onClick={addProblemToDB}>
                    Add Problem to DB
                </Button>
            </Flex>
        </Container>
    </Flex >
}
