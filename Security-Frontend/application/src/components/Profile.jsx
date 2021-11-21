import { useEffect, useState } from "react";
import { Alert, Button, Form, Image, Col, Row } from "react-bootstrap";
import facade from "../facade";
import { storage } from "../firebase";
import tokenFacade from "../helperFacades/TokenFacade";

export default function Profile() {
  const [getProfile, setProfile] = useState("Loading..");
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState(null);

  useEffect(() => {
    facade
      .getProfile()
      .then((profile) => {
        setProfile(
          <>
            <li key="username">Username: {profile.userName}</li>
            <li key="created">Joined at: {profile.created}</li>
            <li key="roles">
              Roles:
              <ul>
                {profile.roleList.map((role) => {
                  return <li key={role.roleName}>{role.roleName}</li>;
                })}
              </ul>
            </li>
          </>
        );
      })
      .catch((err) => {
        if (err.status) {
          err.fullError.then((e) => setError(e.message));
        }

        setError("An error occurred while processing your request.");
      });
  }, []);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    console.log(imageError);
    if (image !== null) {
      setImageUploading(true);

      const uploadTask = storage
        .ref("images/" + tokenFacade.getDecodedToken().username + ".jpg")
        .put(image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          console.log(error);
          setImageUploading(false);
        },
        () => {
          storage
            .ref("images")
            .child(tokenFacade.getDecodedToken().username + ".jpg")
            .getDownloadURL()
            .then((url) => {
              setImageUrl(url);
              setImageUploading(false);
            });
        }
      );
    } else {
      setImageError("No image selected");
    }
  };

  useEffect(() => {
    storage
      .ref("images")
      .child(tokenFacade.getDecodedToken().username + ".jpg")
      .getDownloadURL()
      .then((url) => {
        setImageUrl(url);
      })
      .catch(() => {
        storage
          .ref("images")
          .child("default.jpg")
          .getDownloadURL()
          .then((url) => {
            setImageUrl(url);
          });
      });
  }, []);

  return (
    <>
      <h2>Profile</h2>
      {error ? (
        <>{error && <Alert variant="danger">{error}</Alert>}</>
      ) : (
        <>
          <ul>{getProfile}</ul>
          <Row>
            <Col xs={6} md={4}>
              <Image src={imageUrl} fluid />
            </Col>
          </Row>

          <Form onChange={handleChange}>
            <Form.Group>
              <Form.Label>Change Profile Image</Form.Label>
              <Form.Control
                type="file"
                placeholder="Change Profile Image"
                id="image_change"
              />
            </Form.Group>
          </Form>

          {imageUploading ? (
            <>
              <Button>Change Image</Button>
            </>
          ) : (
            <Button onClick={handleUpload}>Change Image</Button>
          )}
        </>
      )}
    </>
  );
}
