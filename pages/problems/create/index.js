import { useEffect, useState } from 'react';
import {
    TextInput,
    Textarea,
    Button,
    Group,
    Title,
    Flex,
    Container,
    ScrollArea,
    Space,
    Text,
    Divider,
    ActionIcon
} from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import Navbar from '../../../components/Navbar';
import { createProblem } from '../../../firebase';
import { Editor } from "@monaco-editor/react";
import Head from 'next/head';

export default function CreateProblem() {
    // Basic problem info
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('Refactr Dev Team');
    const [description, setDescription] = useState('');

    // Metadata for code testing / generation
    const [functionName, setFunctionName] = useState('');
    const [resultType, setResultType] = useState('int'); // defaults to int

    // Optional additional constraints the solution must satisfy
    const [constraints, setConstraints] = useState([]);

    // Function arguments - these represent the inputs to the function under test.
    // We store them as strings.
    const [args, setArgs] = useState([]);

    // Examples: each example is an object with an array of inputs and an expected output.
    // Each input in an example has { name, value }.
    const [examples, setExamples] = useState([
        {
            // initially, if no args are defined, we start with an empty list.
            inputs: args.map(arg => ({ name: arg, value: "" })),
            output: ""
        }
    ]);

    // The default code that will be displayed in the editor.
    const [defaultCode, setDefaultCode] = useState("");

    // Error states for form validation
    const [titleErr, setTitleErr] = useState(false);
    const [functionNameErr, setFunctionNameErr] = useState(false);
    const [resultTypeErr, setResultTypeErr] = useState(false);
    const [authorErr, setAuthorErr] = useState(false);
    const [descriptionErr, setDescriptionErr] = useState(false);
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

    // When function arguments (args) change, update each example's inputs to match.
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
        // Basic client-side validations:
        if (title.trim() === "") setTitleErr(true);
        if (functionName.trim() === "") setFunctionNameErr(true);
        if (resultType.trim() === "") setResultTypeErr(true);
        if (author.trim() === "") setAuthorErr(true);
        if (description.trim() === "") setDescriptionErr(true);
        if (args.length === 0 || args[0].trim() === "") setArgsErr(true);
        if (
            examples.length === 0 ||
            examples.some(ex => ex.inputs.some(inp => inp.value === "") || ex.output.trim() === "")
        ) {
            setExamplesErr(true);
        }
        if (defaultCode.trim() === "") setDefaultCodeErr(true);

        // If any required field is missing, do not submit.
        if (
            title.trim() === "" ||
            functionName.trim() === "" ||
            resultType.trim() === "" ||
            author.trim() === "" ||
            description.trim() === "" ||
            args.length === 0 ||
            examples.length === 0 ||
            defaultCode.trim() === ""
        ) {
            return;
        }

        try {
            let data = {
                title: title,
                functionName: functionName,
                resultType: resultType,
                // Create a slug from the title.
                slugTitle: title.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().replace(/\s+/g, '-'),
                author: author,
                description: description,
                constraints: constraints,  // can be empty
                // Send examples as an array of objects with inputs and output.
                examples: examples,
                defaultCode: defaultCode,
                args: args  // optional: include the function arguments list as metadata
            };

            await createProblem(data);
            console.log("Problem added to DB");
            // Reset state after submission:
            setTitle('');
            setFunctionName('');
            setResultType('int');
            setAuthor('Refactr Dev Team');
            setDescription('');
            setConstraints([]);
            setArgs([]);
            setExamples([{ inputs: [], output: "" }]);
            setDefaultCode("");
            // Reset error states
            setTitleErr(false);
            setFunctionNameErr(false);
            setResultTypeErr(false);
            setAuthorErr(false);
            setDescriptionErr(false);
            setArgsErr(false);
            setExamplesErr(false);
            setDefaultCodeErr(false);
        } catch (error) {
            console.error('Error creating problem: ', error);
        }
    };

    return <>
        <Head>
            <title>Create a Problem - Refactr</title>
        </Head>
        <Flex w={"100vw"} mah={"100vh"} m={0} direction={"column"} align={"center"} bg={theme.background} c={theme.primaryTextColor}>
            <Navbar />
            <ScrollArea w={"100vw"} h={"90vh"} style={{ overflowY: "scroll" }}>
                <Title order={2} align="center" mt="md" mb="lg" pt={40}>
                    Create a Problem
                </Title>
                <Container style={{ width: "50%", margin: "auto" }}>
                    {/* Title */}
                    <Text>Title</Text>
                    {titleErr && <Text color="red">Title is required</Text>}
                    <TextInput
                        placeholder="Enter the problem title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        mb="md"
                        w={"30vw"}
                    />

                    {/* Function Name */}
                    <Text>Function Name</Text>
                    {functionNameErr && <Text color="red">Function Name is required</Text>}
                    <TextInput
                        placeholder="Enter the function name (e.g., gcd)"
                        value={functionName}
                        onChange={(e) => setFunctionName(e.target.value)}
                        mb="md"
                        w={"30vw"}
                    />

                    {/* Result Type */}
                    <Text>Result Type</Text>
                    {resultTypeErr && <Text color="red">Result Type is required</Text>}
                    <TextInput
                        placeholder="Enter the return type (e.g., int, int*, float)"
                        value={resultType}
                        onChange={(e) => setResultType(e.target.value)}
                        mb="md"
                        w={"30vw"}
                    />

                    {/* Author */}
                    <Text>Author</Text>
                    {authorErr && <Text color="red">Author is required</Text>}
                    <TextInput
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        mb="md"
                        w={"30vw"}
                    />

                    {/* Description */}
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

                    {/* Solution Constraints */}
                    <Text>Solution Constraints</Text>
                    {constraints.length === 0 && <Text color="gray">Optional: add any constraints your solution must satisfy.</Text>}
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
                                disabled={constraints.length === 0}
                            >
                                <IconTrash size={18} />
                            </ActionIcon>
                        </Group>
                    ))}
                    <Button variant="light" mt="md" mb={"md"} onClick={() => setConstraints([...constraints, ""])}>
                        Add Constraint
                    </Button>

                    {/* Function Arguments */}
                    <Text>Function Arguments</Text>
                    {argsErr && <Text color="red">At least 1 function argument is required</Text>}
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

                    {/* Examples */}
                    <Text>Examples</Text>
                    {examplesErr && <Text color="red">Each example must have values for all arguments and an output</Text>}
                    {examples.map((example, exIndex) => (
                        <Group key={exIndex} direction="column" p="md" mb="md" display="block" style={{ border: '1px solid #ccc', borderRadius: '4px' }}>
                            <Title order={4} mt="xs">Example {exIndex + 1}</Title>
                            {args.map((arg, cIndex) => (
                                <Group key={cIndex} mt="xs" align="flex-end" ml="md">
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
                                ml="md"
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

                    {/* Default Code */}
                    <Text mt={20}>Default Code</Text>
                    {defaultCodeErr && <Text color="red">Default code is required</Text>}
                    <Editor
                        height={"300px"}
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
    </>
}