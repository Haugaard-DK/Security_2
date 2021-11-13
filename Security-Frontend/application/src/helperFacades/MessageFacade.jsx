import apiFacade from "./ApiFacade";

function MessageFacade() {
  const postMessage = (token) => {
    const request = apiFacade.prepareRequest("POST", null, token);
    return apiFacade.submitRequest("/message/postMessage", request);
  };

  const getAllMessages = (token) => {
    const request = apiFacade.prepareRequest("GET", null, token);
    return apiFacade.submitRequest("/message/allMessages", request);
  };

  return { postMessage, getAllMessages };
}

const messageFacade = MessageFacade();
export default messageFacade;
