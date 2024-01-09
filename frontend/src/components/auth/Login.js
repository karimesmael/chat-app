import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";

const Login = () => {
  const toast = useToast();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = ChatState();
  const showHandler = () => {
    setShow(!show);
  };

  const login = async (email, password) => {
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    const { data } = await axios.post(
      "/api/users/login",
      { email, password },
      config
    );
    return data;
  };

  const submitHandler = async (guest) => {
    if (!guest) {
      if (!email || !password) {
        toast({
          title: "Validation Error",
          description: "Please fill all required fields with sign '*'",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
    }

    setLoading(true);
    try {
      let data;
      if (guest === "guest") {
        data = await login("guest@example.com", "123456");
      } else {
        data = await login(email, password);
      }
      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      const expiration = new Date();
      expiration.setHours(expiration.getHours() + 1);
      localStorage.setItem("expiration", expiration.toISOString());

      toast({
        title: "Login Successful",
        status: "success",
        duration: 2000,
      });
      setLoading(false);
      navigate("chats");
      return window.location.reload();
    } catch (error) {
      toast({
        description: "wrong email or password",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return setLoading(false);
    }
  };

  return (
    <VStack spacing={"5px"}>
      <FormControl id="email" isRequired>
        <FormLabel>E-mail</FormLabel>
        <Input
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <InputRightElement w={"4.5rem"}>
            <Button h={"1.75rem"} size={"sm"} onClick={showHandler}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme="blue"
        width={"100%"}
        marginTop={"1rem"}
        onClick={submitHandler}
        isLoading={loading}
      >
        Login
      </Button>
      <Button
        variant={"solid"}
        colorScheme="red"
        width={"100%"}
        onClick={() => {
          submitHandler("guest");
        }}
      >
        Login as Guest
      </Button>
    </VStack>
  );
};

export default Login;
