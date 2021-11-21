import apiFacade from "./ApiFacade";

function MessageFacade() {
  const postMessage = (token, message) => {
    const body = {
      messageText: message,
    };
    const request = apiFacade.prepareRequest("POST", body, token);
    console.log(message);
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
