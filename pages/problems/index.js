const { Title, Text } = require("@mantine/core");
const { useRouter } = require("next/router");
const { useEffect } = require("react");


function ProblemHomepage() {

    return <>
        <Title>Problems Homepage</Title>
        <Text>Page to list popular problems, or search for new ones</Text>
    </>
}