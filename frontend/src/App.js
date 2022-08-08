import React, { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import './App.css';
import Routes from "./Routes";
import { LinkContainer } from "react-router-bootstrap";
import { AppContext } from "./lib/contextLib";
import { Auth } from "aws-amplify";
import { useNavigate } from "react-router-dom";
import { onError } from "./lib/errorLib";

function App() {
  const [isAuthenticating, setIsAuthenticating] = useState(true); // tracks whether we might be in the auth process right now
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const nav = useNavigate();

  // useEffect is called everytime the component is rendered
  // but by passing an empty array, it only runs on the first render
  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {
      await Auth.currentSession();
      // If above loads without error
      userHasAuthenticated(true);
    } catch (e) {
      if (e !== "No current user") {
        onError(e);
      }
    }

    // user session should be loaded now, or none exists
    setIsAuthenticating(false);
  }

  async function handleLogout() {
    await Auth.signOut(); // wipe the currentSession

    userHasAuthenticated(false);
    
    nav("/login");
  }

  return (
    !isAuthenticating && ( // page only renders if auth session check has finished
      <div className="App container py-3">
        <Navbar collapseOnSelect bg="light" expand="md" classname="mb-3">
          <LinkContainer to="/">
            <Navbar.Brand className="font-weight-bold text-muted">
              Scratch
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Nav activeKey={window.location.pathname}>
              {
                isAuthenticated ? (
                  <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                ) : (
                  <>
                    <LinkContainer to="/signup">
                      <Nav.Link>Signup</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/login">
                      <Nav.Link>Login</Nav.Link>
                    </LinkContainer>
                  </>
                )
              }
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
          <Routes />
        </AppContext.Provider>
      </div>
    )
  );
}

export default App;
