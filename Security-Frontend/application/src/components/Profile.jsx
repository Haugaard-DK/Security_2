import { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import facade from "../facade";

export default function Profile() {
  const [getProfile, setProfile] = useState("Loading..");
  const [error, setError] = useState(null);

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

  return (
    <>
      <h2>Profile</h2>
      {error ? (
        <>{error && <Alert variant="danger">{error}</Alert>}</>
      ) : (
        <>
          <ul>{getProfile}</ul>
        </>
      )}
    </>
  );
}
