import apiFacade from "./ApiFacade";

function UserFacade() {
  const lookup = (username, token) => {
    const request = apiFacade.prepareRequest("GET", null, token);
    return apiFacade.submitRequest("/info/user/" + username, request);
  };

  const getAllUsers = (token) => {
    const request = apiFacade.prepareRequest("GET", null, token);
    return apiFacade.submitRequest("/info/allUsers", request);
  };

  return { lookup, getAllUsers };
}

const userFacade = UserFacade();
export default userFacade;
