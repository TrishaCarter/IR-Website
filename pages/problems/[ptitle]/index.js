import '@mantine/core/styles.css';
import {
    Title, Text, Box, Flex,
    Button, NativeSelect, Divider,
} from "@mantine/core";
import { RemoveScroll } from "react-remove-scroll";
import { useRouter } from "next/router";
import Navbar from "../../../components/Navbar";
import { useCallback, useContext, useEffect, useState } from "react";
import { auth, getProblemBySlug, getProblemSolutions, trackSolution, updateUserScore } from "../../../firebase";
import { Editor } from "@monaco-editor/react";
import { notifications } from '@mantine/notifications';
import { AuthContext } from '../../_app';
import Head from 'next/head';

export default function ProblemPage() {
    let router = useRouter();
    let { ptitle } = router.query;
    let uid = auth.currentUser?.uid;
    const [prob, setProblem] = useState({});
    const [code, setCode] = useState("");
    const [probID, setProbID] = useState("");

    const onCodeChange = useCallback((value) => {
        setCode(value);
    }, []);

    let calculateScore = async (userPerf) => {
        let probSols = await getProblemSolutions(prob.id);
        console.log(probSols);

        let solMetrics = probSols.map(s => Number(s.cpu_metric));
        console.log(solMetrics);

        const bestPerf = Math.min(...solMetrics);

        if (solMetrics.length === 0) {
            return 100;
        }

        if (userPerf <= 0 || bestPerf <= 0) return 0;

        const ratio = bestPerf / userPerf;
        console.log('Ratio:', ratio);

        const score = Math.min(100, Math.pow(ratio, 0.8) * 100);
        console.log("Best performance:", bestPerf);
        console.log("User performance:", userPerf);
        console.log("Score:", Math.round(score));

        return Math.round(score);
    };


    const runTestCases = async () => {
        let combinedCode = null;
        const testPromises = prob.examples.map((example, index) => {
            // Build a structured "inputs" array for this test case.
            const structuredInputs = example.inputs.map(inp => {
                return {
                    name: inp.name,
                    type: inp.type || "int",
                    // If inp.value is a string starting with "[" assume it's JSON
                    value: (typeof inp.value === "string" && inp.value.trim().startsWith("["))
                        ? JSON.parse(inp.value)
                        : inp.value
                };
            });

            // Build the test case object with both inputs and output
            const testCasePayload = {
                code: code,
                functionName: prob.functionName,
                resultType: prob.resultType,
                testCase: {
                    inputs: structuredInputs,
                    output: example.output
                }
            };

            console.log(`Test case ${index + 1} payload:`, testCasePayload);


            console.log("Sending a fetch...");

            return fetch(`https://proxy-service-205616280235.us-central1.run.app/run_test`, {
                //return fetch(`http://localhost:443/run_test`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(testCasePayload),
            })
                .then(response => response.json())
                .then(data => {
                    combinedCode = data.code;
                    console.log(`Test case ${index + 1} response:`, data);
                    if (data.passed === true) {
                        notifications.show({
                            title: `Test Case ${index + 1} passed`,
                            message: "Test passed",
                            color: "green",
                            autoClose: 10000,
                        });
                        return true;
                    } else {
                        notifications.show({
                            title: `Test Case ${index + 1} failed`,
                            message: "Your solution did not pass this test case",
                            color: "red",
                            autoClose: 10000,
                        });
                        return false;
                    }
                })
                .catch((error) => {
                    notifications.show({
                        title: `Test Case ${index + 1} error`,
                        message: "Error executing test case",
                        color: "red",
                        autoClose: 10000,
                    });
                    console.error("Error in test case:", error);
                    return false;
                });

        });

        // Wait for all test case promises to complete
        const testResults = await Promise.all(testPromises);
        console.log("Test results:", testResults);
        return {
            passed: testResults.every(result => result === true),
            code: combinedCode
        };
    };

    const checkSolution = async () => {

        // Check with regex for includes, and stop process if found
        let reg = /.*#\s*include.*/gm;
        if (reg.test(code)) {
            notifications.show({
                title: "Submission halted",
                message: "Your code contains 'include' statements.",
                color: "red",
                autoClose: 10000,
            });
            return; // Stop further processing
        }

        // Run test cases; only proceed if all pass.
        const results = await runTestCases();
        console.log("All test cases ran");
        console.log(results.passed);

        if (!results.passed) {
            notifications.show({
                title: "Submission halted",
                message: "One or more test cases failed.",
                color: "red",
                autoClose: 10000,
            });
            return; // Stop further processing
        }

        notifications.show({
            title: "All test cases passed",
            message: "Compiling your code...",
            color: "green",
            autoClose: 10000,
        });

        console.log(probID);
        console.log(results.code);


        fetch(`https://proxy-service-205616280235.us-central1.run.app/check`, {
            //fetch(`http://localhost:443/check`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                code: results.code,
                user: auth.currentUser?.uid,
                cuda: false,
                probID: probID,
                numArgs: prob.args.length,
                functionName: prob.functionName,
            })
        })
            .then(response => {
                if (!response.ok) {
                    console.log(response);
                    // } else {
                }
                return response.text();
            })
            .then(data => {
                // if (data === undefined) return;
                console.log("Response data:", data);
                let userPerf = JSON.parse(data).output;

                calculateScore(userPerf).then((score) => {
                    console.log("Score:", score);

                    trackSolution(uid, prob.id, {
                        code: code,
                        finished: true,
                        probid: prob.id,
                        uid: uid,
                        score: score,
                        cpu_metric: userPerf
                    })
                        .then(() => {
                            notifications.show({
                                title: "Code compiled successfully!",
                                message: `Score: ${score}`,
                                color: "green",
                                autoClose: 10000,
                            });
                        });
                });
            });
    };

    useEffect(() => {
        getProblemBySlug(ptitle).then((prob) => {
            console.log(prob);
            setProblem(prob);
            setProbID(prob.probID);
            setCode(prob.defaultCode);
        })
    }, [])

    const { user, loading } = useContext(AuthContext);
    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading])

    let theme = {
        background: "#16171b",
        secondaryBackground: "#262729",
        primaryTextColor: "#c9c9c9",
        secondaryTextColor: "#aaaaaa",
        accentColor: "#629C44",
    };

    return (
        <RemoveScroll>
            <Head>
                <title>{prob.title} - Refactr</title>
            </Head>
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
                        style={{ border: `1px solid ${theme.accentColor}`, overflowY: "auto" }}
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
