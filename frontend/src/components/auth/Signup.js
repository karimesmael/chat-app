import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import {
  isValidEmail,
  isValidName,
  isValidPassword,
} from "../../util/validation";

const Signup = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [name, setName] = useState();
  const [validName, setValidName] = useState(true);
  const [validEmail, setValidEmail] = useState(true);
  const [validPassword, setValidPassword] = useState(true);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState(true);
  const [loading, setLoading] = useState(false);

  const nameHandler = (e) => {
    const value = e.target.value;
    setName(value);
    if (isValidName(value)) {
      return setValidName(true);
    } else {
      return setValidName(false);
    }
  };

  const emailHandler = (e) => {
    let value = e.target.value;
    setEmail(value);
    if (isValidEmail(value)) {
      setValidEmail(true);
    } else {
      setValidEmail(false);
    }
  };

  const passwordHandler = (e) => {
    let value = e.target.value;
    setConfirmPassword(false);
    setPassword(value);
    if (isValidPassword(value)) {
      setValidPassword(true);
    } else {
      setValidPassword(false);
    }
  };

  const confirmPasswordHandler = (e) => {
    let value = e.target.value;
    if (value === password) {
      setConfirmPassword(true);
    } else {
      setConfirmPassword(false);
    }
  };

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
    if (!validName || !validEmail || !validPassword || !confirmPassword) {
      showToast("Please ensure all fields are filled correctly");
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
        description: error.response.data.message || "Network error",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return setLoading(false);
    }
  };

  return (
    <VStack spacing={"5px"}>
      <FormControl id="name" isRequired isInvalid={!validName}>
        <FormLabel>Name</FormLabel>
        <Input placeholder="Enter your name" onChange={nameHandler} />
        <FormErrorMessage>
          Name should be at least 3 characters
        </FormErrorMessage>
      </FormControl>
      <FormControl id="email" isRequired isInvalid={!validEmail}>
        <FormLabel>E-mail</FormLabel>
        <Input placeholder="Enter your email" onChange={emailHandler} />
        <FormErrorMessage>Please enter valid email</FormErrorMessage>
      </FormControl>
      <FormControl id="password" isRequired isInvalid={!validPassword}>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter your password"
            onChange={passwordHandler}
          />
          <InputRightElement w={"4.5rem"}>
            <Button h={"1.75rem"} size={"sm"} onClick={showHandler}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
        <FormErrorMessage>
          Password should be at least 6 characters
        </FormErrorMessage>
      </FormControl>
      <FormControl id="password" isRequired isInvalid={!confirmPassword}>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm password"
            onChange={confirmPasswordHandler}
          />
          <InputRightElement w={"4.5rem"}>
            <Button h={"1.75rem"} size={"sm"} onClick={showHandler}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
        <FormErrorMessage>Passwords do not match</FormErrorMessage>
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
