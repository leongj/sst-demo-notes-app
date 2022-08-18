import React, { useState } from "react";
// import { useNavigate } from "react-router-dom"; // No longer required
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";
import "./Login.css";
import { Auth } from "aws-amplify";
import { useAppContext } from "../lib/contextLib";
import { onError } from "../lib/errorLib";
import { useFormFields } from "../lib/hooksLib";

export default function Login() {
  // Don't fully understand this app context bit. Don't know why the only
  // thing returned from useAppContext is related to authentication.
  // Aren't there other uses for the AppContext?
  const { userHasAuthenticated } = useAppContext();
  // const nav = useNavigate(); // No longer required
  const [isLoading, setIsLoading] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: "",
  });
  
  function validateForm() {
    return fields.email.length > 0 && fields.password.length > 0;
  }

  // This is where we integrate with Cognito
  async function handleSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    try {
      await Auth.signIn(fields.email, fields.password);
      userHasAuthenticated(true);
      //  nav("/");  // This is now handled by UnauthenticatedRoute
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  return (
    <div className="Login">
      <Form onSubmit={handleSubmit}>
        <Form.Group size="lg" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            autoFocus
            type="email"
            value={fields.email}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group size="lg" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={fields.password}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <LoaderButton 
          block="true" 
          size="lg" 
          type="submit" 
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Login
        </LoaderButton>
      </Form>
    </div>
  );
}