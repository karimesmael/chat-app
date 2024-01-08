import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { isValidEmail } from "../../util/validation";

const Signup = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [loading, setLoading] = useState(false);

  const showHandler = () => {
    setShow(!show);
  };

  const showToast = (description) => {
    toast({
      title: "Validation Error",
      description: description,
      status: "error",
      duration: 1800,
      isClosable: true,
    });
  };

  const submitHandler = async () => {
    if (!name || !email || !password) {
      showToast("Please fill all required fields with sign '*'");
      return;
    }

    if (name.trim().length < 3) {
      showToast("Name should be at least 3 ch");
      return;
    }
    if (password.trim().length < 6) {
      showToast("Password should be at least 6 ch");
      return;
    }
    if (password !== confirmPassword) {
      showToast("confirm password does not match password");
      return;
    }
    if (!isValidEmail(email)) {
      showToast("please enter Valid email");
      return;
    }

    setLoading(true);
    try {
      const config = {
        headers: { "Content-Type": "application/json" },
      };
      const { data } = await axios.post(
        "/api/users/signup",
        { name, email, password },
        config
      );
      localStorage.setItem("userInfo", JSON.stringify(data));
      const expiration = new Date();
      expiration.setHours(expiration.getHours() + 1);
      localStorage.setItem("expiration", expiration.toISOString());
      toast({
        title: "Account created.",
        description: "We've created your account for you.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return navigate("chats");
    } catch (error) {
      toast({
        title: "error",
        description: error.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return setLoading(false);
    }
  };

  return (
    <VStack spacing={"5px"}>
      <FormControl id="name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter your name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>E-mail</FormLabel>
        <Input
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement w={"4.5rem"}>
            <Button h={"1.75rem"} size={"sm"} onClick={showHandler}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm password"
            onChange={(e) => setConfirmPassword(e.target.value)}
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
        marginTop={".8rem"}
        onClick={submitHandler}
        isLoading={loading}
      >
        Signup
      </Button>
    </VStack>
  );
};

export default Signup;
