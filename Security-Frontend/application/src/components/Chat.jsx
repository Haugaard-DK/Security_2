import { Form, Button, Alert } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import facade from "../facade";

export default function Chatting() {
  const init = { messageText: "" };
  const [messageMessage, setMessage] = useState(init);
  const [error, setError] = useState(null);
  const [getMessages, setMessages] = useState("Loading..");

  useEffect(() => {
    facade
      .getAllMessages()
      .then((messages) => {
        setMessages(
          messages.map((message) => {
            return (
              <ul key={"chat_"}>
                <li key={"message_" + message.messageText}></li>
                <li key={"username_" + message.user_id}>
                  Username: {message.user_id}
                </li>
                <li key={"created_" + message.message_id}>
                  Joined at: {message.created}
                </li>
              </ul>
            );
          })
        );
      })
      .catch((err) => {
        if (err.status) {
          err.fullError.then((e) => setError(e.message));
        }

        setError("An error occurred while processing your request.");
      });
  }, []);

  const postMessage = (event) => {
    event.preventDefault();

    setError(null);

    if (messageMessage.messageText != "") {
      facade
        .postMessage()
        .then(() => {
          setMessage(messageMessage.messageText(event));
        })
        .catch((err) => {
          if (err.status) {
            err.fullError.then((e) => setError(e.message));
          }

          setError("An error occurred while processing your request.");
        });
    } else {
      setError("You must provide a message!");
    }
  };

  const onChange = (event) => {
    setMessage(event.target.value);
  };

  return (
    <>
      <h2>Post Message</h2>
      <Form onChange={onChange}>
        <Form.Group>
          <Form.Label>Message</Form.Label>
          <Form.Control type="text" placeholder="Enter message" id="message" />
        </Form.Group>

        {error && <Alert variant="danger">{error}</Alert>}

        <Button variant="primary" type="submit" onClick={postMessage}>
          Post message
        </Button>
      </Form>
    </>
  );
}
