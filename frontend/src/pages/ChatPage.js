import { useEffect, useState } from "react";
import ChatBox from "../components/chats/ChatBox";
import MyChats from "../components/chats/MyChats";
import SideDrawer from "../components/SideDrawer";
import { Box } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
const ChatPage = () => {
  const [user, setUser, setSelectedChat] = useState();
  const [fetchAgain, setFetchAgain] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    setSelectedChat();
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (!user) {
      return navigate("/");
    }

    setUser(user);
  }, [navigate]);
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer user={user} />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && (
          <MyChats
            fetchAgain={fetchAgain}
            setFetchAgain={setFetchAgain}
            user={user}
          />
        )}
        {user && (
          <ChatBox
            fetchAgain={fetchAgain}
            setFetchAgain={setFetchAgain}
            user={user}
          />
        )}
      </Box>
    </div>
  );
};

export default ChatPage;
