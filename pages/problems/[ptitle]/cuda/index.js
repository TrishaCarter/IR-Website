import { Title, Text, Box, Flex, Grid, Button, Select, Textarea, RemoveScroll, NativeSelect, Divider, List } from "@mantine/core"
import { useRouter } from "next/router"
import Navbar from "@/components/Navbar"
import { useCallback, useEffect, useState } from "react";
import { auth, getProblemBySlug } from "@/firebase";
import { Editor } from "@monaco-editor/react";

export default function ProblemPage() {
    let router = useRouter()
    let { ptitle } = router.query
    const [prob, setProblem] = useState({});
    const [code, setCode] = useState("");
    const [probID, setProbID] = useState(0);

    const onCodeChange = useCallback((value) => {
        setCode(value);
    }, []);

    const checkSolution = () => {
        console.log(code);
        fetch("http://localhost:1738/check", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                code: code,
                user: auth.currentUser.uid,
                cuda: true,
                probID: probID
            })
        })
            .then(response => {
                if (!response.ok) {
                    // throw new Error(`HTTP error ${response.status}: ${response.error}`);
                    console.log(response);

                }
                let stuff = response.text();
                return stuff; // Use .json() if your response is JSON
            })
            .then(data => {
                console.log("Response data:", data);
            })
    }

    useEffect(() => {
        getProblemBySlug(ptitle).then((prob) => {
            console.log(prob);
            setProblem(prob);
            setProbID(prob.probID)
            // setCode(prob.defaultCode);
            setCode(`#include <cuda_runtime.h>

__global__ void multiply(int* a, int* b, int* c) {
    int i = threadIdx.x + blockIdx.x * blockDim.x;
    c[i] = a[i] * b[i];
}

int main() {
    int a[] = {1, 2, 3};
    int b[] = {1, 2, 3};
    int c[3];

    multiply<<<1, 3>>>(a, b, c);

    return 0;
}
`)
        })
    }, [])

    let theme = {
        background: '#16171b',
        secondaryBackground: '#262729',
        primaryTextColor: '#c9c9c9',
        secondaryTextColor: '#aaaaaa',
        accentColor: '#629C44',
    }

    return <RemoveScroll>
        <Navbar />
        <Flex w={"100vw"} h={"90vh"} m={0} pt={10} direction={"column"} align={"center"}
            style={{ backgroundColor: theme.background, color: theme.primaryTextColor }}
        >
            <Box w={"96vw"} mh={70} mx={0} p={"md"} mb={10} style={{ border: `1px solid ${theme.accentColor}` }}>
                <Title order={2} c={theme.primaryTextColor}>{prob.title}</Title>
                <Text c={theme.secondaryTextColor}>By: {prob.author}</Text>
            </Box>
            <Flex w={"96vw"} justify={"space-between"} p={0} m={0}>
                <Box w={"40%"} h={"70vh"} mr={10} style={{ border: `1px solid ${theme.accentColor}` }} pt={10} px={"md"} >
                    <Title order={2} c={theme.primaryTextColor}>Description</Title>
                    <Text c={theme.secondaryTextColor}>{prob.description}</Text>

                    <Divider my={10} />

                    <Title order={3} c={theme.primaryTextColor}>Examples</Title>
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

                    <Title order={3} c={theme.primaryTextColor}>Constraints</Title>
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

                <Box w={"60%"} style={{ border: `1px solid ${theme.accentColor} ` }} id="codeBox" mr={0} p={10}>
                    <Editor height={"90%"} defaultLanguage="c" onChange={onCodeChange} value={code} theme="vs-dark" />
                    <Flex w={"100%"} h={"10%"} p={0} m={0} pr={20} justify={"center"} align={"center"}>
                        <Button onClick={checkSolution}>Submit</Button>
                    </Flex>
                </Box>
            </Flex>
        </Flex>
    </RemoveScroll >
}