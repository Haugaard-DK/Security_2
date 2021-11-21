import authFacade from "./helperFacades/AuthFacade";
import tokenFacade from "./helperFacades/TokenFacade";
import userFacade from "./helperFacades/UserFacade";
import messageFacade from "./helperFacades/MessageFacade";

function Facade() {
  /** Auth related */
  const login = (username, password, recaptcha) => {
    return authFacade.login(username, password, recaptcha);
  };

  const logout = () => {
    authFacade.logout();
  };

  const isLoggedIn = () => {
    return authFacade.isLoggedIn();
  };

  const register = (username, password, recaptcha) => {
    return authFacade.register(username, password);
  };

  const isAdmin = () => {
    return authFacade.isAdmin();
  };

  /** User related */
  const getProfile = () => {
    let decodedToken = tokenFacade.getDecodedToken();
    let username = decodedToken.username;

    return lookupUser(username);
  };

  const lookupUser = (username) => {
    let token = tokenFacade.getToken();
    return userFacade.lookup(username, token);
  };

  const getAllUsers = () => {
    let token = tokenFacade.getToken();
    return userFacade.getAllUsers(token);
  };

  const postMessage = (message) => {
    let token = tokenFacade.getToken();
    return messageFacade.postMessage(token, message);
  };

  const getAllMessages = () => {
    let token = tokenFacade.getToken();
    return messageFacade.getAllMessages(token);
  };

  return {
    /** Auth related */
    login,
    logout,
    isLoggedIn,
    register,
    isAdmin,

    /** User related */
    getProfile,
    lookupUser,
    getAllUsers,
    postMessage,
    getAllMessages,
  };
}

const facade = Facade();
export default facade;
