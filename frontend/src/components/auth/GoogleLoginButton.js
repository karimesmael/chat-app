import React from "react";
import { GoogleLogin } from "react-google-login";

const GoogleLoginButton = () => {
  const CLIENT_ID =
    "463954511300-sfiku3ker0d6t8kp99m6sfuijbl3b0n8.apps.googleusercontent.com";

  const responseGoogle = (response) => {
    if (response && response.profileObj) {
      const userData = {
        googleId: response.profileObj.googleId,
        displayName: response.profileObj.name,
        email: response.profileObj.email,
        imageUrl: response.profileObj.imageUrl,
      };

      // Send the user data to your server for further processing
      console.log(userData);
      sendUserDataToServer(userData);
    } else {
      // Handle error or cancelation
      console.log("Google login failed or canceled.");
    }
  };

  const sendUserDataToServer = (userData) => {
    // You can use fetch or axios to send the user data to your server
    fetch("/auth/google/callback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response from the server, e.g., store user data in the React state
        console.log("Server response:", data);
      })
      .catch((error) => {
        console.error("Error sending user data to server:", error);
      });
  };

  return (
    <GoogleLogin
      clientId={CLIENT_ID}
      buttonText="Login with Google"
      onSuccess={responseGoogle}
      onFailure={responseGoogle}
      cookiePolicy={"single_host_origin"}
    />
  );
};

export default GoogleLoginButton;
