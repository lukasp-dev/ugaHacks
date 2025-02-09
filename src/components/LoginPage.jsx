import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useLocation } from "react-router-dom";
import useLoginApi from "../api/login";

const LoginPage = ({ onLogin, onSignUp }) => {
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();

  const handleLogin = async () => {
    await loginWithRedirect({
      redirectUri: window.location.origin + "/home", // Auth0 로그인 후 리디렉트
    });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#f2f2f2",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          width: "300px",
          textAlign: "center",
        }}
      >
        <h2>{isAuthenticated ? "Welcome!" : "Log In"}</h2>

        {isAuthenticated ? (
          <>
            <p>
              Logged in as: <strong>{user.name}</strong>
            </p>
            <button
              onClick={() => logout({ returnTo: window.location.origin })}
              style={{
                width: "100%",
                padding: "0.75rem",
                background: "red",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "1rem",
                marginTop: "1rem",
              }}
            >
              Log Out
            </button>
          </>
        ) : (
          <>
            <p>Please log in using Auth0</p>
            <button
              onClick={handleLogin}
              style={{
                width: "100%",
                padding: "0.75rem",
                background: "#4C8BF5",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              Log In with Auth0
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
