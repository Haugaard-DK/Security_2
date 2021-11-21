import { Form, Button, Alert } from "react-bootstrap";
import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import facade from "../facade";

export default function Login({ setLoggedIn, recaptchaRef }) {
  const { state } = useLocation();
  const pageAfterLogin = state ? state.from : "/MatChat/";
  const history = useHistory();
  const init = { username: "", password: "" };
  const [loginCredentials, setLoginCredentials] = useState(init);
  const [error, setError] = useState(null);

  const performLogin = (event) => {
    event.preventDefault();

    setError(null);

    if (loginCredentials.username !== "" && loginCredentials.password !== "") {
      recaptchaRef.current
        .executeAsync()
        .then((recaptcha) => {
          facade
            .login(
              loginCredentials.username,
              loginCredentials.password,
              recaptcha
            )
            .then(() => {
              setLoggedIn(true);
              history.push(pageAfterLogin);
            })
            .catch((err) => {
              if (err.status) {
                err.fullError.then((e) => setError(e.message));
              }

              setError("An error occurred while processing your request.");
            });
        })
        .then(() => {
          recaptchaRef.current.reset();
        });
    } else {
      setError("Username and/or password is missing!");
    }
  };

  const onChange = (event) => {
    setLoginCredentials({
      ...loginCredentials,
      [event.target.id]: event.target.value,
    });
  };

  return (
    <>
      <h2>Login</h2>
      <Form onChange={onChange}>
        <Form.Group>
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            id="username"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" id="password" />
        </Form.Group>

        {error && <Alert variant="danger">{error}</Alert>}

        <Button variant="primary" type="submit" onClick={performLogin}>
          Login
        </Button>
      </Form>
    </>
  );
}
