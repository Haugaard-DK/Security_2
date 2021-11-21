import React, { useState, useEffect, useCallback, createRef } from "react";
import { Route, Switch } from "react-router-dom";
import "./style/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./components/Home";
import Header from "./components/Header";
import NoRoute from "./components/NoRoute";
import { Container } from "react-bootstrap";
import PrivateRoute from "./components/PrivateRoute";
import User from "./components/User";
import Users from "./components/Users";
import Profile from "./components/Profile";
import Login from "./components/Login";
import Register from "./components/Register";
import Chatting from "./components/Chat";
import facade from "./facade";
import ReCAPTCHA from "react-google-recaptcha";

function App() {
  const [isLoggedIn, setLoggedIn] = useState(facade.isLoggedIn());
  const recaptchaRef = createRef();

  const tokenValidationCheck = useCallback(() => {
    if (isLoggedIn) {
      let currentStatus = facade.isLoggedIn();

      if (!currentStatus) {
        setLoggedIn(false);
        facade.logout();
      }
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const interval = setInterval(() => {
      tokenValidationCheck();
    }, 1000); /* Every Second */
    return () => clearInterval(interval);
  }, [tokenValidationCheck]);

  return (
    <div>
      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey="6Lc4hUwdAAAAADD-cqbIXnBZEBNegMGoHrwOZZqt"
        size="invisible"
      />

      <Header
        isLoggedIn={isLoggedIn}
        setLoggedIn={setLoggedIn}
        isAdmin={facade.isAdmin()}
      />

      <Container className="mt-5">
        <Switch>
          <Route exact path="/MatChat/">
            <Home recaptchaRef={recaptchaRef} />
          </Route>
          <PrivateRoute
            path="/MatChat/info/user"
            isLoggedIn={isLoggedIn}
            component={User}
          />
          <PrivateRoute
            path="/MatChat/info/users"
            isLoggedIn={isLoggedIn}
            component={Users}
          />

          <PrivateRoute
            path="/MatChat/profile"
            isLoggedIn={isLoggedIn}
            component={Profile}
            recaptchaRef={recaptchaRef}
          />

          <PrivateRoute
            path="/MatChat/chat"
            isLoggedIn={isLoggedIn}
            component={Chatting}
          />

          <Route path="/MatChat/login">
            <Login setLoggedIn={setLoggedIn} recaptchaRef={recaptchaRef} />
          </Route>
          <Route path="/MatChat/register">
            <Register setLoggedIn={setLoggedIn} recaptchaRef={recaptchaRef} />
          </Route>
          <Route>
            <NoRoute />
          </Route>
        </Switch>
      </Container>
    </div>
  );
}

export default App;
