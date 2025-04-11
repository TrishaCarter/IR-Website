import {
    Title, Text, Box, Flex,
    Button, NativeSelect, Divider
} from "@mantine/core";
import { RemoveScroll } from "react-remove-scroll";
import { useRouter } from "next/router";
import Navbar from "../../../components/Navbar";
import { useCallback, useEffect, useState } from "react";
import { auth, getProblemBySlug, trackSolution } from "../../../firebase";
import { Editor } from "@monaco-editor/react";

export default function ProblemPage() {
    let router = useRouter();
    let { ptitle } = router.query;
    let uid = auth.currentUser?.uid;
    const [prob, setProblem] = useState({});
    const [code, setCode] = useState("");
    const [passedCases, setPassedCases] = useState([]);
    const [testCasesPassed, setTestCasesPassed] = useState(false);

    const onCodeChange = useCallback((value) => {
        setCode(value);
    }, []);

    const runTestCases = () => {

        prob.examples.forEach((example, index) => {
            let body = {
                code: code,
                functionName: prob.slugTitle,
                testCase: example.inputs,
                output: example.output,
            }
            console.log(body);

            fetch("http://localhost:1739/run_test", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            })
                .then((response) => {
                    return response.json()
                })
                .then((data) => {
                    console.log(data);
                    if (data["passed"] === true) {
                        console.log(`Test Case ${index + 1} passed`);
                        setPassedCases([...passedCases, index + 1]);
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                    // If an error, return false and don't move to compilation
                    return false;
                })
        })
    }

    const checkSolution = () => {
        setTestCasesPassed(false);

        // 1 Check if code is valid solution based on test cases
        let testCasesPassed = runTestCases();
        console.log("All test cases ran");


        // If any test case fails, return false
        if (testCasesPassed === false) {
            console.log(":(");
            setTestCasesPassed(false);
            return false
        }

        // 2 If valid, send to server for compilation
        fetch("http://localhost:1738/check", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                code: code,
                user: auth.currentUser?.uid,
            }),
        })
            .then((response) => {
                console.log(response);
                return response.text();
            })
            .then((data) => {
                console.log("Response data:", data);
                // 3 If compilation successful, send to server for tracking
                trackSolution(uid, prob.id, {
                    code: code,
                    finished: true,
                    probid: prob.id,
                    uid: uid,
                    // Generate random numbers for metrics for now
                    cpu_metric: Math.floor(Math.random() * 100),
                    gpu_metric: Math.floor(Math.random() * 100),
                });
            });
    }

    useEffect(() => {
        if (ptitle) {
            getProblemBySlug(ptitle).then((p) => {
                console.log(p);
                setProblem(p);
                setCode(p.defaultCode);
            });
        }
    }, [ptitle]);

    let theme = {
        background: "#16171b",
        secondaryBackground: "#262729",
        primaryTextColor: "#c9c9c9",
        secondaryTextColor: "#aaaaaa",
        accentColor: "#629C44",
    };

    return (
        <RemoveScroll>
            <Navbar />
            <Flex
                w={"100vw"}
                h={"90vh"}
                m={0}
                pt={10}
                direction={"column"}
                align={"center"}
                style={{ backgroundColor: theme.background, color: theme.primaryTextColor }}
            >
                {/* Title / Author */}
                <Box
                    w={"96vw"}
                    mh={70}
                    mx={0}
                    p={"md"}
                    mb={10}
                    style={{ border: `1px solid ${theme.accentColor}` }}
                >
                    <Title order={2} style={{ color: theme.primaryTextColor }}>
                        {prob.title}
                    </Title>
                    <Text style={{ color: theme.secondaryTextColor }}>
                        By: {prob.author}
                    </Text>
                </Box>

                {/* Main Layout */}
                <Flex w={"96vw"} justify={"space-between"} p={0} m={0}>
                    {/* Left Column: Description, Examples, Constraints */}
                    <Box
                        w={"40%"}
                        h={"70vh"}
                        mr={10}
                        style={{ border: `1px solid ${theme.accentColor}` }}
                        pt={10}
                        px={"md"}
                        sx={{ overflowY: "auto" }}
                    >
                        {/* Description */}
                        <Title order={2} style={{ color: theme.primaryTextColor }}>
                            Description
                        </Title>
                        <Text style={{ color: theme.secondaryTextColor }}>
                            {prob.description}
                        </Text>

                        <Divider my={10} />

                        {/* Examples in a cleaner, card-like layout */}
                        <Title order={3} style={{ color: theme.primaryTextColor }}>
                            Examples
                        </Title>
                        {prob.examples && prob.examples.map((example, index) => {
                            // Build a user-friendly input string
                            const inputString = example.inputs
                                ?.map((inp) => {
                                    const val = Array.isArray(inp.value)
                                        ? JSON.stringify(inp.value)
                                        : inp.value;
                                    return `${inp.name} = ${val}`;
                                })
                                .join(", ");

                            const outputString = Array.isArray(example.output)
                                ? JSON.stringify(example.output)
                                : example.output;

                            return (
                                <Box
                                    key={index}
                                    my={10}
                                    p={10}
                                    style={{
                                        borderLeft: `1px solid ${theme.accentColor}`,
                                        borderRadius: 4,
                                    }}
                                >
                                    <Text weight={600} mb={6}>
                                        Example {index + 1}:
                                    </Text>
                                    <Text style={{ color: theme.secondaryTextColor }}>
                                        <strong>Input:</strong> {inputString}
                                    </Text>
                                    <Text style={{ color: theme.secondaryTextColor }}>
                                        <strong>Output:</strong> {outputString}
                                    </Text>
                                    {example.explanation && (
                                        <Text style={{ color: theme.secondaryTextColor }}>
                                            <strong>Explanation:</strong> {example.explanation}
                                        </Text>
                                    )}
                                </Box>
                            );
                        })}

                        <Divider my={10} />

                        {/* Constraints in a simple line-based layout */}
                        <Title order={3} style={{ color: theme.primaryTextColor }}>
                            Constraints
                        </Title>
                        <Box
                            my={10}
                            p={10}
                            style={{
                                borderLeft: `1px solid ${theme.accentColor}`,
                                borderRadius: 4,
                            }}
                        >
                            {prob.constraints &&
                                prob.constraints.map((constraint, index) => (
                                    <Text
                                        key={index}
                                        style={{
                                            color: theme.secondaryTextColor,
                                            marginBottom: 4,
                                            whiteSpace: "pre-wrap",
                                        }}
                                    >
                                        {index + 1}. {constraint}
                                    </Text>
                                ))}
                        </Box>
                    </Box>

                    {/* Right Column: Code Editor */}
                    <Box
                        w={"60%"}
                        style={{ border: `1px solid ${theme.accentColor}` }}
                        id="codeBox"
                        mr={0}
                    >
                        <Flex
                            w={"100%"}
                            h={"10%"}
                            p={0}
                            m={0}
                            pr={20}
                            justify={"flex-end"}
                            align={"center"}
                        >
                            <NativeSelect data={["C"]} variant="default" h={"70%"} w={100} />
                        </Flex>
                        <Editor
                            height={"80%"}
                            defaultLanguage="c"
                            onChange={onCodeChange}
                            value={code}
                            theme="vs-dark"
                        />
                        <Flex
                            w={"100%"}
                            h={"10%"}
                            p={0}
                            m={0}
                            pr={20}
                            justify={"center"}
                            align={"center"}
                        >
                            <Button onClick={checkSolution}>Submit</Button>
                        </Flex>
                    </Box>
                </Flex>
            </Flex>
        </RemoveScroll>
    );
}