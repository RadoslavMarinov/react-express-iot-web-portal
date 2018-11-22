import code from "jwt-simple";
const KEY = "taina";

function updateSession(sess_o) {
  localStorage.setItem("sessionId", code.encode(sess_o, KEY));
}

export { updateSession };
