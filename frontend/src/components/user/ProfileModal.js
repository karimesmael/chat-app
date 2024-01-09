import { EditIcon, ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  IconButton,
  Text,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { checkAuth, logout } from "../../util/auth";
import { useEffect, useState } from "react";
import { isImage } from "../../util/validation";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [valid, setValid] = useState(false);
  const { setUser } = ChatState();

  useEffect(() => {
    const loggeduser = checkAuth();
    if (loggeduser === "EXPIRED" || !loggeduser) {
      return logout();
    }
    setValid(user._id === loggeduser._id);
  }, [user]);

  const editHandler = () => {
    checkAuth();
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
        const { data } = await axios.put(
          "/api/users/",
          {
            pic,
          },
          config
        );
        console.log(data);
        setUser(data);
        localStorage.removeItem("userInfo");
        localStorage.setItem("userInfo", JSON.stringify(data));
        return;
      } catch (error) {
        console.log(error);
        return alert("failed to change photo please try again");
      }
    });
  };

  const deleteHandler = async () => {
    checkAuth();
    const agreed = window.confirm(
      "Are you sure you want to delete your profile picture  ?"
    );
    if (!agreed) return;
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.delete("/api/users/", config);
      console.log(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
      return window.location.reload();
    } catch (error) {
      console.log(error);
      return alert("failed to delete photo please try again");
    }
  };

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
        />
      )}
      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent h="410px">
          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            {valid && (
              <Menu>
                <MenuButton>
                  {user.pic === "" ? (
                    <EditIcon />
                  ) : (
                    <Image
                      borderRadius="full"
                      boxSize="150px"
                      src={user.pic}
                      alt={user.name}
                    />
                  )}
                </MenuButton>
                {user.pic ? (
                  <MenuList>
                    <MenuItem onClick={editHandler}>
                      Edit Profile Picture
                    </MenuItem>
                    <MenuItem onClick={deleteHandler}>
                      Delete Profile Picture
                    </MenuItem>
                  </MenuList>
                ) : (
                  <MenuList>
                    <MenuItem onClick={editHandler}>
                      Add profile picture
                    </MenuItem>
                  </MenuList>
                )}
              </Menu>
            )}
            <Text
              fontSize={{ base: "28px", md: "30px" }}
              fontFamily="Work sans"
            >
              Email: {user.email}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
