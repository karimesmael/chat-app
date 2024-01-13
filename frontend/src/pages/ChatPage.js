import { useEffect } from "react";
import ChatBox from "../components/chats/ChatBox";
import MyChats from "../components/chats/MyChats";
import SideDrawer from "../components/chats/SideDrawer";
import { Box } from "@chakra-ui/react";
import { checkAuth } from "../util/auth";
import { ChatState } from "../Context/ChatProvider";
import { useNavigate } from "react-router-dom";
const ChatPage = () => {
  const { user, setFetchAgain, fetchAgain } = ChatState();
  const navigate = useNavigate();

  useEffect(() => {
    const data = checkAuth();
    if (!data || data === "EXPIRED") {
      navigate("/");
    }
    setInterval(() => {
      const data = checkAuth();
      if (!data || data === "EXPIRED") {
        navigate("/");
      }
    }, 3000);
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
