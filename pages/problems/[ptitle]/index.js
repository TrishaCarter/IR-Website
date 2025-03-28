import { Title, Text, Box, Flex, Grid, Button, Select, Textarea, RemoveScroll, NativeSelect, Divider, List } from "@mantine/core"
import { useRouter } from "next/router"
import Navbar from "../../../components/Navbar"
import { useCallback, useEffect, useState } from "react";
import { auth, getProblemBySlug } from "../../../firebase";
import { Editor } from "@monaco-editor/react";

export default function ProblemPage() {
    let router = useRouter()
    let { ptitle } = router.query
    const [prob, setProblem] = useState({});
    const [code, setCode] = useState("");

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
            body: {
                code: code,
                user: auth.currentUser.uid
            }
        }).then((res) => {
            console.log(res)
        }).catch(err => console.error(err));

    }

    useEffect(() => {
        getProblemBySlug(ptitle).then((prob) => {
            console.log(prob);
            setProblem(prob);
            setCode(prob.defaultCode);
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
                    <List mx={20}>
                        {prob.examples && prob.examples.map((example, index) => {
                            return <Box key={index} my={10}>
                                <Text c={theme.secondaryTextColor}> {index + 1}. {example}</Text>
                            </Box>
                        })}
                    </List>


                    <Divider my={10} />

                    <Title order={3} c={theme.primaryTextColor}>Constraints</Title>
                    <List mx={20}>
                        {prob.constraints && prob.constraints.map((constraint, index) => {
                            return <Box key={index} my={10}>
                                <Text c={theme.secondaryTextColor}> {index + 1}. {constraint}</Text>
                            </Box>
                        })}
                    </List>

                </Box>

                <Box w={"60%"} style={{ border: `1px solid ${theme.accentColor} ` }} id="codeBox" mr={0}>
                    <Flex w={"100%"} h={"10%"} p={0} m={0} pr={20} justify={"flex-end"} align={"center"}>
                        <NativeSelect data={["C"]} variant="default" h={"70%"} w={100} />
                    </Flex>
                    <Editor height={"80%"} defaultLanguage="c" onChange={onCodeChange} value={code} theme="vs-dark" />
                    <Flex w={"100%"} h={"10%"} p={0} m={0} pr={20} justify={"center"} align={"center"}>
                        <Button onClick={checkSolution}>Submit</Button>
                    </Flex>
                </Box>
            </Flex>
        </Flex>
    </RemoveScroll >
}