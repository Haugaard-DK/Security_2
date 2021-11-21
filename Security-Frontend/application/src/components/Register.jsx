import { Form, Button, Alert } from "react-bootstrap";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import facade from "../facade";
import { Col, Row } from "react-bootstrap";

export default function Register({ setLoggedIn, recaptchaRef }) {
  const history = useHistory();
  const init = {
    username: "",
    password: "",
    verifyPassword: "",
  };
  const [userCredentials, setUserCredentials] = useState(init);
  const [error, setError] = useState(null);

  const performRegistration = (event) => {
    event.preventDefault();

    setError(null);

    if (
      userCredentials.username !== "" &&
      userCredentials.password !== "" &&
      userCredentials.verifyPassword !== ""
    ) {
      if (userCredentials.password !== userCredentials.verifyPassword) {
        setError("The passwords are not the same.");
        return;
      }
      recaptchaRef.current
        .executeAsync()
        .then((recaptcha) => {
          facade
            .register(
              userCredentials.username,
              userCredentials.password,
              recaptcha
            )
            .then(() => {
              setLoggedIn(true);
              history.push("/MatChat/");
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
      setError(
        "All fields are mandatory, please verify you have provided all of the requested details."
      );
    }
  };

  const onChange = (event) => {
    setUserCredentials({
      ...userCredentials,
      [event.target.id]: event.target.value,
    });
  };

  return (
    <>
      <h2>Register</h2>
      <Form onChange={onChange}>
        <Form.Group>
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your username"
            id="username"
          />
        </Form.Group>

        <Row>
          <Col>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                id="password"
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Verify Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Verify your password"
                id="verifyPassword"
              />
            </Form.Group>
          </Col>
        </Row>

        {error && <Alert variant="danger">{error}</Alert>}

        <Button variant="primary" type="submit" onClick={performRegistration}>
          Register New User
        </Button>
      </Form>
    </>
  );
}
