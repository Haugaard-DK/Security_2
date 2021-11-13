import { Form, Button, Alert } from "react-bootstrap";
import React, { useState } from "react";
import facade from "../facade";

export default function User() {
  const [getRequestedUser, setRequestedUser] = useState(null);
  const [getRequestedUsername, setRequestedUsername] = useState("");
  const [error, setError] = useState(null);

  const performLookup = (event) => {
    event.preventDefault();

    setError(null);
    setRequestedUser("Loading..");

    if (getRequestedUsername !== "") {
      facade
        .lookupUser(getRequestedUsername)
        .then((data) => {
          setRequestedUser(
            <>
              <li key="username">Username: {data.userName}</li>
              <li key="created">Joined at: {data.created}</li>
              <li key="roles">
                Roles:
                <ul>
                  {data.roleList.map((role) => {
                    return <li key={role.roleName}>{role.roleName}</li>;
                  })}
                </ul>
              </li>
            </>
          );
        })
        .catch((err) => {
          setRequestedUser(null);

          if (err.status) {
            err.fullError.then((e) => setError(e.message));
          }

          setError("An error occurred while processing your request.");
        });
    } else {
      setError("You must provide a username!");
    }
  };

  const onChange = (event) => {
    setRequestedUsername(event.target.value);
  };

  return (
    <>
      <h2>User Lookup</h2>
      <Form onChange={onChange}>
        <Form.Group>
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            id="username"
          />
        </Form.Group>

        {error && <Alert variant="danger">{error}</Alert>}

        <Button variant="primary" type="submit" onClick={performLookup}>
          Lookup
        </Button>
      </Form>

      {getRequestedUser && <ul>{getRequestedUser}</ul>}
    </>
  );
}
