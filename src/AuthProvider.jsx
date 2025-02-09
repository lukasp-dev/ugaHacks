import { Auth0Provider } from "@auth0/auth0-react";

const AuthProvider = ({ children }) => {
  return (
    <Auth0Provider
      domain="dev-abcq3ymfsytkbcuf.us.auth0.com"
      clientId="snfdBh0qBEKJxN1UHF8kHRQx0e2W1bXV"
      authorizationParams={{
        redirect_uri: "http://localhost:5173",
        audience: "https://express-api",
        scope: "openid profile email", 
      }}
    >
      {children}
    </Auth0Provider>
  );
};

export default AuthProvider;
