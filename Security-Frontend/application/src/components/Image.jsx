import { Tab } from "bootstrap";
import { useCallback, useState, useEffect } from "react";
import { Tabs, Alert } from "react-bootstrap";
import { Button, Form, Segment, Grid, Divider, Image } from "semantic-ui-react";
import facade from "../Facade";
import { storage } from "../firebase";
import tokenFacade from "../helperFacades/TokenFacade";

export default function MyProfile() {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState(null);

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
        .ref("images/" + tokenFacade.getDecodedToken().user_id + ".jpg")
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
            .child(tokenFacade.getDecodedToken().user_id + ".jpg")
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
      .child(tokenFacade.getDecodedToken().user_id + ".jpg")
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
      <Tabs defaultActiveKey="profile" id="uncontrolled-tab">
        {facade.isEmployee() ? (
          <Tab eventKey="employee_picture" title="Profile Picture">
            <Segment placeholder>
              <Grid columns={2} relaxed="very" stackable>
                <Grid.Column>
                  <Form>
                    <Form.Input
                      type="file"
                      label="Change Profile Image"
                      accept=".jpg"
                      onChange={handleChange}
                    />
                    {imageUploading ? (
                      <>
                        <Button loading>Change Image</Button>
                      </>
                    ) : (
                      <Button onClick={handleUpload}>Change Image</Button>
                    )}
                  </Form>
                </Grid.Column>
                <Grid.Column verticalAlign="middle">
                  <Image src={imageUrl} size="medium" rounded centered />
                </Grid.Column>
              </Grid>
              <Divider vertical>Or</Divider>
            </Segment>
          </Tab>
        ) : (
          <></>
        )}
      </Tabs>
    </>
  );
}
