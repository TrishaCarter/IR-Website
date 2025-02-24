import { Title, Text, Box, Flex, Grid, Button, Select, Textarea, RemoveScroll, NativeSelect } from "@mantine/core"
import { useRouter } from "next/router"
import Navbar from "../../../components/Navbar"
import { useCallback, useState } from "react";
// import CodeMirror from "@uiw/react-codemirror"
// import { langs } from "@uiw/codemirror-extensions-langs"
// import { dracula } from "@uiw/codemirror-theme-dracula";
import { Editor } from "@monaco-editor/react";

export default function ProblemPage() {
    let router = useRouter()
    let { pid } = router.query

    let defaultCode = `#include <stdio.h>

int main() {

    /* Write your code here */

    return 0;
}
`
    const [code, setCode] = useState(defaultCode);
    const onCodeChange = useCallback((value) => {
        setCode(value);
    }, []);

    const printCode = () => {
        console.log(code);
    }

    let theme = {
        background: '#16171b',
        secondaryBackground: '#262729',
        primaryTextColor: '#c9c9c9',
        secondaryTextColor: '#aaaaaa',
        accentColor: '#629C44',
    }

    let pInfo = {
        title: "Test Problem Title",
        author: "Maker of the problem",
        description: "Super fun description Super fun description Super fun description Super fun description Super fun description Super fun description Super fun description v Super fun description v Super fun description Super fun description Super fun description Super fun description Super fun description",

    }

    return <RemoveScroll>
        <Navbar />
        <Flex w={"100vw"} h={"90vh"} m={0} pt={10} direction={"column"} align={"center"}
            style={{ backgroundColor: theme.background, color: theme.primaryTextColor }}
        >
            <Box w={"96vw"} mh={70} mx={0} p={"md"} mb={10} style={{ border: `1px solid ${theme.accentColor}` }}>
                <Title order={2} c={theme.primaryTextColor}>{pInfo.title}</Title>
                <Text c={theme.secondaryTextColor}>By: {pInfo.author}</Text>
            </Box>
            <Flex w={"96vw"} justify={"space-between"} p={0} m={0}>
                <Box w={"40%"} h={"70vh"} mr={10} style={{ border: `1px solid ${theme.accentColor}` }} pt={10} px={"md"}>
                    <Title order={2} c={theme.primaryTextColor}>Description</Title>
                    <Text c={theme.secondaryTextColor}>{pInfo.description}</Text>
                </Box>

                <Box w={"60%"} style={{ border: `1px solid ${theme.accentColor}` }} id="codeBox" mr={0}>
                    {/* <CodeMirror
                        value={code} height="200px"
                        extensions={[langs.c()]}
                        onChange={onCodeChange}
                        theme={dracula}
                        style={{ height: "100%" }}

                    /> */}
                    <Flex w={"100%"} h={"10%"} p={0} m={0} pr={20} justify={"flex-end"} align={"center"}>
                        <NativeSelect data={["C"]} variant="default" h={"70%"} w={100} />
                    </Flex>
                    <Editor height={"80%"} defaultLanguage="c" onChange={onCodeChange} value={code} theme="vs-dark" />
                    <Flex w={"100%"} h={"10%"} p={0} m={0} pr={20} justify={"center"} align={"center"}>
                        <Button onClick={printCode}>Submit</Button>
                    </Flex>
                </Box>
            </Flex>
        </Flex>
    </RemoveScroll>
}