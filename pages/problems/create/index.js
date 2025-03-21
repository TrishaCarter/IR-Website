import { useEffect, useState } from 'react';
import { TextInput, Textarea, Button, Group, Title, Flex, Container, ScrollArea, Space, Text } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { ActionIcon } from '@mantine/core';
import Navbar from '../../../components/Navbar';
import { createProblem } from '../../../firebase';
import { Editor } from "@monaco-editor/react";
import { isNotEmpty, useForm } from '@mantine/form';

export default function CreateProblem() {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('Refactr Dev Team');
    const [description, setDescription] = useState('');
    const [constraints, setConstraints] = useState([""]);
    const [examples, setExamples] = useState([""]);
    const [defaultCode, setDefaultCode] = useState("/** * Note: The returned array must be malloced, assume caller calls free(). */\nint* twoSum(int* nums, int numsSize, int target, int* returnSize) { \n\n} ");

    const [titleErr, setTitleErr] = useState(false);
    const [authorErr, setAuthorErr] = useState(false);
    const [descriptionErr, setDescriptionErr] = useState(false);
    const [constraintsErr, setConstraintsErr] = useState(false);
    const [examplesErr, setExamplesErr] = useState(false);
    const [defaultCodeErr, setDefaultCodeErr] = useState(false);

    let theme = {
        background: '#16171b',
        secondaryBackground: '#262729',
        primaryTextColor: '#c9c9c9',
        secondaryTextColor: '#aaaaaa',
        accentColor: '#629C44',
    }

    let handleFormSubmit = async () => {

        if (title === "") setTitleErr(true);
        if (author === "") setAuthorErr(true);
        if (description === "") setDescriptionErr(true);
        if (constraints[0] === "") setConstraintsErr(true);
        if (examples[0] === "") setExamplesErr(true);
        if (defaultCode === "") setDefaultCodeErr(true);

        // i'm sorry
        if (title === "" || author === "" || description === "" || constraints.length === 0 || examples.length === 0 || defaultCode === "") {
            return
        } else {
            try {

                let data = {
                    title: title,
                    author: author,
                    description: description,
                    constraints: constraints,
                    examples: examples,
                    defaultCode: defaultCode
                }

                await createProblem(data);
                console.log("Problem added to DB");
                setTitle('');
                setAuthor('');
                setDescription('');
                setConstraints([""]);
                setExamples([""]);
                setDefaultCode("/** * Note: The returned array must be malloced, assume caller calls free(). */\nint* twoSum(int* nums, int numsSize, int target, int* returnSize) { \n\n} ");
                setTitleErr(false);
                setAuthorErr(false);
                setDescriptionErr(false);
                setConstraintsErr(false);
                setExamplesErr(false);
                setDefaultCodeErr(false);
            } catch (error) {
                console.error('Error creating problem: ', error);
            }
        }

    }

    return <Flex
        w={"100vw"} mah={"100vh"} m={0} direction={"column"} align={"center"}

        bg={theme.background} c={theme.primaryTextColor}
    >
        <Navbar />
        <ScrollArea w={"100vw"} h={"90vh"} style={{ overflowY: "scroll" }}>
            <Title order={2} align="center" mt="md" mb="lg" pt={40}>
                Create a Problem
            </Title>
            <Container style={{ width: "50%", margin: "auto" }}>

                <Text>Title</Text>
                {titleErr && <Text color="red">Title is required</Text>}
                <TextInput
                    placeholder="Enter the problem title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    mb="md"
                    w={"30vw"}
                />

                <Text>Author</Text>
                {authorErr && <Text c="red">Author is required</Text>}
                <TextInput
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    mb="md"
                    w={"30vw"}
                />

                <Text>Description</Text>
                {descriptionErr && <Text c="red">Description is required</Text>}
                <Textarea
                    placeholder="Enter the problem description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    mb="md"
                    w={"50vw"}
                />
                <Text>Constraints</Text>
                {constraintsErr && <Text c="red">Must have atleast 1 constraint</Text>}
                {constraints.map((_, index) => (
                    <Group key={index} mt="xs">
                        <TextInput
                            placeholder={`Constraint ${index + 1}`}
                            value={constraints[index]}
                            onChange={(e) => {
                                let newConstraints = [...constraints];
                                newConstraints[index] = e.target.value;
                                setConstraints(newConstraints);
                            }}
                            w={"30vw"}
                        />
                        <ActionIcon
                            color="red"
                            variant="outline"
                            onClick={() => setConstraints(constraints.filter((_, i) => i !== index))}
                            disabled={constraints.length === 1} // Prevent removing the last one
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

                <Text mt={20}>Examples</Text>
                {examplesErr && <Text c="red">Must have atleast 1 example</Text>}
                {examples.map((_, index) => (
                    <Group key={index} mt="xs">
                        <TextInput
                            placeholder={`Examples ${index + 1}`}
                            value={examples[index]}
                            onChange={(e) => {
                                let newExamples = [...examples];
                                newExamples[index] = e.target.value;
                                setExamples(newExamples);
                            }}
                            w={"30vw"}
                        />
                        <ActionIcon
                            color="red"
                            variant="outline"
                            onClick={() => setExamples(examples.filter((_, i) => i !== index))}
                            disabled={examples.length === 1} // Prevent removing the last one
                        >
                            <IconTrash size={18} />
                        </ActionIcon>
                    </Group>
                ))}

                <Button
                    variant="light"
                    mt="md"
                    onClick={() => setExamples([...examples, ""])}
                >
                    Add Constraint
                </Button>

                <Text mt={20}>Default Code</Text>
                {defaultCodeErr && <Text c="red">Default code is required</Text>}
                <Editor
                    height="300px"
                    theme="vs-dark"
                    defaultLanguage="c"
                    value={defaultCode}
                    onChange={(value) => setDefaultCode(value)}
                    options={{ fontSize: 14, minimap: { enabled: false } }}
                />

                <br /><br />
                <Flex w={"100%"} justify={"center"}>
                    <Button type="submit" w={"20vw"} onClick={handleFormSubmit} >
                        Add Problem to DB
                    </Button>
                </Flex>
            </Container>
            <Space h={40} />
        </ScrollArea>
    </Flex >
}
