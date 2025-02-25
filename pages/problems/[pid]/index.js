import { Title, Text, Box, Flex, Grid, Button, Select, Textarea, RemoveScroll, NativeSelect, Divider, List } from "@mantine/core"
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

    let pInfo = {
        title: "Two Sum",
        author: "LeetCode Development Team",
        description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\nYou can return the answer in any order.`,
        examples: [
            {
                input: "nums=[2,7,11,15], target=9",
                output: "[0,1]",
                explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]"
            }
        ],
        constraints: [
            "2 <= nums.length <= 10^4",
            "-10^9 <= nums[i] <= 10^9",
            "-10^9 <= target <= 10^9",
            "Only one valid answer exists"
        ],
        defaultCode: `/**
 * Note: The returned array must be malloced, assume caller calls free().
 */
int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    
}
        `
    }
    const [code, setCode] = useState(pInfo.defaultCode);
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

                    <Divider my={10} />

                    <Title order={3} c={theme.primaryTextColor}>Examples</Title>
                    {pInfo.examples.map((example, index) => {
                        return <Box key={index} p={10} my={10}>
                            <Title order={4}>Example {index + 1}</Title>
                            <Text c={theme.secondaryTextColor}>Input: {example.input}</Text>
                            <Text c={theme.secondaryTextColor}>Output: {example.output}</Text>
                            <Text c={theme.secondaryTextColor}>Explanation: {example.explanation}</Text>
                        </Box>
                    })}

                    <Divider my={10} />

                    <Title order={3} c={theme.primaryTextColor}>Constraints</Title>
                    <List mx={20}>
                        {pInfo.constraints.map((constraint, index) => {
                            return <List.Item c={theme.secondaryTextColor}>{constraint}</List.Item>
                        })}
                    </List>

                </Box>

                <Box w={"60%"} style={{ border: `1px solid ${theme.accentColor} ` }} id="codeBox" mr={0}>
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
    </RemoveScroll >
}