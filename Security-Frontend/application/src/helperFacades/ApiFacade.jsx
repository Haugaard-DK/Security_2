import { API_URL } from "../settings";

function ApiFacade() {
  function handleHttpErrors(res) {
    if (!res.ok) {
      return Promise.reject({
        status: res.status,
        fullError: res.json(),
      });
    }

    return res.json();
  }

  const prepareRequest = (method, body, token) => {
    const request = {
      method: method,
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
      },
    };

    if (token) {
      request.headers["x-access-token"] = token;
    }

    if (body) {
      request.body = JSON.stringify(body);
    }

    return request;
  };

  const submitRequest = async (endpoint, request) => {
    return fetch(API_URL + endpoint, request).then(handleHttpErrors);
  };

  return { prepareRequest, submitRequest };
}

const apiFacade = ApiFacade();
export default apiFacade;
