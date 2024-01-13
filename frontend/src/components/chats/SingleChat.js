import "./styles.css";
import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import "./styles.css";
import { Button, IconButton, Spinner, useToast, Stack } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../../util/ChatLogics";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowBackIcon, AttachmentIcon } from "@chakra-ui/icons";
import ProfileModal from "../user/ProfileModal";
import { ChatState } from "../../Context/ChatProvider";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import Chat from "./Chat";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../../animations/typing.json";
import { isImage } from "../../util/validation";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};
const ENDPOINT = "https://free-talk-cha.onrender.com";
const socket = io(ENDPOINT);
let selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const toast = useToast();
  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();
  const [isTyping, setIsTyping] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.emit("setup", user);
    socket.on("connected", () => {
      setSocketConnected(true);
    });

    socket.on("typing", (userId) => {
      if (user._id !== userId) {
        setIsTyping(true);
      }
    });
    socket.on("stop typing", (userId) => {
      if (user._id !== userId) {
        setIsTyping(false);
      }
    });
  });

  useEffect(() => {
    socket.on("message recieved", (newMessage) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessage.chatId._id
      ) {
        if (!notification.includes(newMessage)) {
          setNotification((notification) => [newMessage, ...notification]);
          setFetchAgain((prev) => !prev);
        }
      } else {
        setMessages((messages) => [...messages, newMessage]);
        setFetchAgain((prev) => !prev);
      }
    });
    return () => {
      socket.off("connected");
      socket.off("message recieved");
      socket.disconnect();
    };
  }, []);

  const fetchMessages = async () => {
    if (!selectedChat) return;
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        "/api/message/" + selectedChat._id,
        config
      );
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.log("fetch message : " + error);
      // setTimeout(() => {
      //   fetchMessages();
      // }, 3000);
    }
  };

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      if (newMessage.trim() === "") return;
      setNewMessage("");
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post(
          "/api/message/",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        setMessages([...messages, data]);
        socket.emit("new message", data);
        setFetchAgain((prev) => !prev);
      } catch (error) {
        toast({
          status: "error",
          title: error.message,
          duration: 3000,
        });
      }
    }
    return;
  };

  const sendImageHandler = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.click();

    fileInput.addEventListener("change", async () => {
      const file = fileInput.files[0];
      if (!isImage(file)) {
        return alert("please choose valid image");
      }
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "chat-app");
      formData.append("cloud_name", "db7t3kcn0");
      setImageLoading(true);
      try {
        const url = "https://api.cloudinary.com/v1_1/db7t3kcn0/image/upload";
        const res = await fetch(url, {
          method: "POST",
          body: formData,
        });
        let pic = (await res.json()).url;
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        console.log(pic);
        const { data } = await axios.post(
          "/api/message/image",
          {
            url: pic,
            chatId: selectedChat._id,
          },
          config
        );
        console.log(data);
        setMessages([...messages, data]);
        socket.emit("new message", data);
        setFetchAgain((prev) => !prev);
        setImageLoading(false);
      } catch (error) {
        console.log(error);
      }
    });
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;

    socket.emit("typing", selectedChat._id);
    clearTimeout(timer);
    let duration = 3000;
    setTimer(
      setTimeout(() => {
        socket.emit("stop typing", selectedChat._id);
      }, duration)
    );
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              //   display={{ base: "flex", md: "none" }}
              display={"flex"}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading && (
              <Spinner
                size={"xl"}
                w={5}
                h={5}
                alignSelf={"flex-start"}
                margin={"auto"}
              />
            )}
            <div className="messages">
              <Chat messages={messages} />
            </div>
            {imageLoading && (
              <Stack
                direction="column"
                spacing={40}
                alignSelf={"flex-end"}
                marginRight={25}
              >
                <Spinner
                  thickness="4px"
                  speed="0.85s"
                  emptyColor="gray.200"
                  color="blue.500"
                  size="xl"
                />
              </Stack>
            )}

            <FormControl onKeyDown={sendMessage} mt={3}>
              {isTyping && (
                <Lottie
                  options={defaultOptions}
                  width={"70px"}
                  height={"30px"}
                  style={{ marginBottom: 15, marginLeft: 1 }}
                />
              )}
              <Box
                display={"flex"}
                direction="column"
                justifyContent={"space-between"}
              >
                <AttachmentIcon
                  marginRight={2}
                  boxSize={8}
                  onClick={sendImageHandler}
                />
                <Input
                  variant={"filled"}
                  bg="#DDD"
                  placeholder="enter a message"
                  onChange={typingHandler}
                  value={newMessage}
                />
                <Stack direction="row" spacing={4}>
                  <Button
                    colorScheme="teal"
                    variant="solid"
                    onClick={() => {
                      sendMessage({ key: "Enter" });
                    }}
                    type="submit"
                  >
                    Send
                  </Button>
                </Stack>
              </Box>
            </FormControl>
          </Box>
        </>
      ) : (
        // to get socket.io on same page
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
