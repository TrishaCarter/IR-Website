import { useEffect, useState } from 'react';
import { TextInput, Textarea, Button, Group, Title, Flex, Container, ScrollArea, Space, Text, Divider, ActionIcon } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import Navbar from '../../../components/Navbar';
import { createProblem } from '../../../firebase';
import { Editor } from "@monaco-editor/react";

export default function CreateProblem() {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('Refactr Dev Team');
    const [description, setDescription] = useState('');
    // Constraints for the solution, e.g. "num" or "target"
    const [constraints, setConstraints] = useState([""]);
    // Function arguments for the problem (used to build examples)
    const [args, setArgs] = useState([""]);
    // Examples now is an array of objects with { inputs, output }.
    // Each inputs is an array of objects with { name, value }.
    const [examples, setExamples] = useState([
        {
            inputs: args.map(arg => ({ name: arg, value: "" })),
            output: ""
        }
    ]);
    const [defaultCode, setDefaultCode] = useState(
        "/** * Note: The returned array must be malloced, assume caller calls free(). */\nint* twoSum(int* nums, int numsSize, int target, int* returnSize) { \n\n} "
    );

    const [titleErr, setTitleErr] = useState(false);
    const [authorErr, setAuthorErr] = useState(false);
    const [descriptionErr, setDescriptionErr] = useState(false);
    const [constraintsErr, setConstraintsErr] = useState(false);
    const [argsErr, setArgsErr] = useState(false);
    const [examplesErr, setExamplesErr] = useState(false);
    const [defaultCodeErr, setDefaultCodeErr] = useState(false);

    let theme = {
        background: '#16171b',
        secondaryBackground: '#262729',
        primaryTextColor: '#c9c9c9',
        secondaryTextColor: '#aaaaaa',
        accentColor: '#629C44',
    };

    // When constraints change, update each example's inputs to ensure they match.
    useEffect(() => {
        setExamples(prevExamples =>
            prevExamples.map(example => {
                const newInputs = constraints.map(constraint => {
                    // Try to preserve any existing value for this constraint.
                    const existing = example.inputs.find(inp => inp.name === constraint);
                    return existing ? existing : { name: constraint, value: "" };
                });
                return { ...example, inputs: newInputs };
            })
        );
    }, [constraints]);

    // When function arguments (args) change, update each example's inputs accordingly.
    useEffect(() => {
        setExamples(prevExamples =>
            prevExamples.map(example => {
                const newInputs = args.map(arg => {
                    const existing = example.inputs.find(inp => inp.name === arg);
                    return existing ? existing : { name: arg, value: "" };
                });
                return { ...example, inputs: newInputs };
            })
        );
    }, [args]);

    let handleFormSubmit = async () => {
        // Basic client-side validations.
        if (title === "") setTitleErr(true);
        if (author === "") setAuthorErr(true);
        if (description === "") setDescriptionErr(true);
        if (constraints[0] === "") setConstraintsErr(true);
        if (args[0] === "") setArgsErr(true);
        // Check that every example has all inputs and a non-empty output.
        if (examples.length === 0 || examples.some(ex => ex.inputs.some(inp => inp.value === "") || ex.output === "")) {
            setExamplesErr(true);
        }
        if (title === "" || author === "" || description === "" || constraints.length === 0 || args.length === 0 || examples.length === 0 || defaultCode === "") {
            return;
        } else {
            try {
                let data = {
                    title: title,
                    slugTitle: title.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().replace(/\s+/g, '-'),
                    author: author,
                    description: description,
                    constraints: constraints,
                    // examples are sent as an array of objects with inputs and output.
                    examples: examples,
                    defaultCode: defaultCode
                };

                await createProblem(data);
                console.log("Problem added to DB");
                // Reset state
                setTitle('');
                setAuthor('Refactr Dev Team');
                setDescription('');
                setConstraints([""]);
                setArgs([""]);
                setExamples([
                    {
                        inputs: [""].map(arg => ({ name: arg, value: "" })),
                        output: ""
                    }
                ]);
                setDefaultCode("/** * Note: The returned array must be malloced, assume caller calls free(). */\nint* twoSum(int* nums, int numsSize, int target, int* returnSize) { \n\n} ");
                setTitleErr(false);
                setAuthorErr(false);
                setDescriptionErr(false);
                setConstraintsErr(false);
                setArgsErr(false);
                setExamplesErr(false);
                setDefaultCodeErr(false);
            } catch (error) {
                console.error('Error creating problem: ', error);
            }
        }
    };

    return (
        <Flex w={"100vw"} mah={"100vh"} m={0} direction={"column"} align={"center"} bg={theme.background} c={theme.primaryTextColor}>
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
                    {authorErr && <Text color="red">Author is required</Text>}
                    <TextInput
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        mb="md"
                        w={"30vw"}
                    />

                    <Text>Description</Text>
                    {descriptionErr && <Text color="red">Description is required</Text>}
                    <Textarea
                        placeholder="Enter the problem description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        mb="md"
                        w={"50vw"}
                    />

                    <Text>Solution Constraints</Text>
                    {constraintsErr && <Text color="red">Must have at least 1 constraint</Text>}
                    {constraints.map((constraint, index) => (
                        <Group key={index} mt="xs">
                            <TextInput
                                placeholder={`Constraint ${index + 1}`}
                                value={constraint}
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
                                disabled={constraints.length === 1}
                            >
                                <IconTrash size={18} />
                            </ActionIcon>
                        </Group>
                    ))}
                    <Button variant="light" mt="md" mb={"md"} onClick={() => setConstraints([...constraints, ""])}>
                        Add Constraint
                    </Button>

                    <Text>Function Arguments</Text>
                    {argsErr && <Text color="red">Must have at least 1 argument given to the function</Text>}
                    {args.map((arg, index) => (
                        <Group key={index} mt="xs">
                            <TextInput
                                placeholder={`Argument ${index + 1}`}
                                value={arg}
                                onChange={(e) => {
                                    let newArgs = [...args];
                                    newArgs[index] = e.target.value;
                                    setArgs(newArgs);
                                }}
                                w={"30vw"}
                            />
                            <ActionIcon
                                color="red"
                                variant="outline"
                                onClick={() => setArgs(args.filter((_, i) => i !== index))}
                                disabled={args.length === 1}
                            >
                                <IconTrash size={18} />
                            </ActionIcon>
                        </Group>
                    ))}
                    <Button variant="light" mt="md" mb={"md"} onClick={() => setArgs([...args, ""])}>
                        Add Function Argument
                    </Button>

                    <Text>Examples</Text>
                    {examplesErr && <Text c="red">Each example must have values for all arguments and an output</Text>}
                    {examples.map((example, exIndex) => (
                        <Group key={exIndex} direction="column" p="md" mb="md" display="block" style={{ border: '1px solid #ccc', borderRadius: '4px' }}>
                            <Title order={4} mt="xs">Example {exIndex + 1}</Title>
                            {args.map((arg, cIndex) => (
                                <Group key={cIndex} mt="xs" align="flex-end" ml={"md"}>
                                    <Text size="sm" weight={500} style={{ width: "5vw", textAlign: "center" }}>
                                        {arg ? arg.toUpperCase() : "ARG"}
                                    </Text>
                                    <TextInput
                                        placeholder={`Value for ${arg || "argument"}`}
                                        value={example.inputs.find(inp => inp.name === arg)?.value || ""}
                                        onChange={(e) => {
                                            const newExamples = [...examples];
                                            newExamples[exIndex].inputs = newExamples[exIndex].inputs.map(inp =>
                                                inp.name === arg ? { ...inp, value: e.target.value } : inp
                                            );
                                            setExamples(newExamples);
                                        }}
                                        style={{ width: "15vw" }}
                                    />
                                </Group>
                            ))}
                            <TextInput
                                label="Output"
                                placeholder="Expected output"
                                value={example.output}
                                onChange={(e) => {
                                    const newExamples = [...examples];
                                    newExamples[exIndex].output = e.target.value;
                                    setExamples(newExamples);
                                }}
                                w={"30vw"}
                                ml={"md"}
                                mt="xs"
                            />
                            <Button
                                variant="light"
                                mt="md"
                                onClick={() => setExamples(examples.filter((_, i) => i !== exIndex))}
                                disabled={examples.length === 1}
                            >
                                Remove Example
                            </Button>
                        </Group>
                    ))}
                    <Button variant="light" mt="md" onClick={() =>
                        setExamples([
                            ...examples,
                            { inputs: args.map(arg => ({ name: arg, value: "" })), output: "" }
                        ])
                    }>
                        Add Example
                    </Button>

                    <Text mt={20}>Default Code</Text>
                    {defaultCodeErr && <Text color="red">Default code is required</Text>}
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
                        <Button type="submit" w={"20vw"} onClick={handleFormSubmit}>
                            Add Problem to DB
                        </Button>
                    </Flex>
                </Container>
                <Space h={40} />
            </ScrollArea>
        </Flex>
    );
}