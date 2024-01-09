import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import Login from "../components/auth/Login";
import Signup from "../components/auth/Signup";
import { useEffect } from "react";
import Footer from "../UI/Footer";
const HomePage = () => {
  useEffect(() => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("expiration");
  }, []);

  return (
    <Container maxW={"xl"} centerContent>
      <Box
        d="flex"
        textAlign="center"
        p="3px"
        bg="white"
        w="100%"
        m="20px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize={"25px"} fontFamily={"Work sans"}>
          Free-Talk-Chat
        </Text>
      </Box>
      <Box p={4} bg="white" w="100%" borderRadius="lg" borderWidth="1px">
        <Tabs variant={"soft-rounded"}>
          <TabList mb={"1em"}>
            <Tab w={"50%"}>Login</Tab>
            <Tab w={"50%"}>Signup</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
      <Footer />
    </Container>
  );
};

export default HomePage;
