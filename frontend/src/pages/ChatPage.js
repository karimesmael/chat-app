import React, { useEffect, useState } from "react";
import axios from "axios";

const ChatPage = () => {
  const [chats, setChats] = useState([]);

  const getChats = async () => {
    const { data } = await axios.get("http://localhost:5000/api/chats");
    setChats(data);
  };

  useEffect(() => {
    getChats();
  }, []);

  return (
    <div>
      {chats.map((chat) => (
        <p key={chat._id}>{chat.chatName}</p>
      ))}
    </div>
  );
};

export default ChatPage;
