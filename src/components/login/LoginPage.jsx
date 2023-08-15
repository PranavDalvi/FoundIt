import React, { useState } from "react";
import { UserAuth } from "../../context/AuthContext";
import { Alert, Avatar, Button } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import "./loginPage.scss"

export const LoginPage = () => {

  const { authError, user, logOut } = UserAuth();
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { googleSignIn } = UserAuth();
  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      setError(error);
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      setError(error);
    }
  };
  console.log(user)

  return (
    <div>
      <div className='loginConatiner'>
        <div className='subLoginContainer'>
          {user === null ? (
            <>
              <p>To perform various tasks like filling lost forms, adding comments, filling found form requires loging into the account</p>
              <Button variant="contained" onClick={handleGoogleSignIn}>
                Sign in
              </Button>
            </>)
            : (<>
              <div className="userName">
                <Avatar
                  alt={`${user.displayName}`}
                  src={user.photoURL}
                />
                <span className="spacers">
                Welcome {user.displayName},
                </span>
              </div>
              <p>Head to <Link to="/"> Home page</Link> to help others to find their lost items.</p>
              <p>Did you misplaced some thing? Great we got your back <Link to="/lostform">file your lost form here</Link>.</p>
              <Button variant="contained" onClick={handleSignOut}>Sign out</Button>
            </>)}

          {error !== null && (
            <div>
              <Alert severity="error"> Error: {`${error}`}</Alert>
            </div>
          )}
          {authError !== null && (
            <div>
              <Alert severity="error">Error: {`${authError}`}</Alert>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
