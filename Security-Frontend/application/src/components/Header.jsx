import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { NavLink, Redirect } from "react-router-dom";
import facade from "../facade";

export default function Header({ isLoggedIn, setLoggedIn, isAdmin }) {
  const performLogout = () => {
    setLoggedIn(false);
    facade.logout();

    return <Redirect to="/login" />;
  };

  return (
    <ul className="header">
      <Container>
        <Row>
          <Col md={8}>
            <li>
              <NavLink exact activeClassName="active" to="/MatChat/">
                Home
              </NavLink>
            </li>
            {isLoggedIn && (
              <>
                <li>
                  <NavLink activeClassName="active" to="/MatChat/info/user">
                    Find User
                  </NavLink>
                </li>
                {isAdmin && (
                  <li>
                    <NavLink activeClassName="active" to="/MatChat/info/users">
                      All Users
                    </NavLink>
                  </li>
                )}
                <li>
                  <NavLink activeClassName="active" to="/MatChat/chat">
                    Chat
                  </NavLink>
                </li>
              </>
            )}
          </Col>
          <Col md={4}>
            {isLoggedIn ? (
              <>
                <li>
                  <NavLink activeClassName="active" to="/MatChat/profile">
                    My Profile
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    activeClassName=""
                    to="/MatChat/login"
                    onClick={performLogout}
                  >
                    Logout
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink activeClassName="active" to="/MatChat/login">
                    Login
                  </NavLink>
                </li>
                <li>
                  <NavLink activeClassName="active" to="/MatChat/register">
                    Register
                  </NavLink>
                </li>
              </>
            )}
          </Col>
        </Row>
      </Container>
    </ul>
  );
}
