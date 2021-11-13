import { useEffect, useState } from "react";
import facade from "../facade";
import { Alert } from "react-bootstrap";

export default function Users() {
  const [getUsers, setUsers] = useState("Loading..");
  const [error, setError] = useState(null);

  useEffect(() => {
    facade
      .getAllUsers()
      .then((users) => {
        setUsers(
          users.map((user) => {
            return (
              <ul key={"user_" + user.userName}>
                <li key={"username_" + user.userName}>
                  Username: {user.userName}
                </li>
                <li key={"created_" + user.userName}>
                  Joined at: {user.created}
                </li>
                <li key={"rolesList_" + user.userName}>Role(s)</li>
                <ul key={"roles_" + user.userName}>
                  {user.roleList.map((role) => {
                    return (
                      <li key={user.userName + "_" + role.roleName}>
                        {role.roleName}
                      </li>
                    );
                  })}
                </ul>
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

  return (
    <>
      <h2>All Users</h2>
      {error ? (
        <>{error && <Alert variant="danger">{error}</Alert>}</>
      ) : (
        <>
          <ul>{getUsers}</ul>
        </>
      )}
    </>
  );
}
