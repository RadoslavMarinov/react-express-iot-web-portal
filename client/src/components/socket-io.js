import io from "socket.io-client";
// const socket = io("http://localhost:3000");
const socket = io("https://electricity-manager1.herokuapp.com/");

socket.on("connect", () => {
  console.log("Greetings from server: ");
});

socket.on("greeting", data => {
  console.log("DATA:", data);
});

export { socket };

// import { config } from "./config";
// import io from "socket.io-client";
// const socket = io(config.backEndServer.url);

// console.log(config);

// socket.on("connect", function() {
//   console.log(
//     "Socket IO Client Connected to Server:",
//     config.backEndServer.url
//   );
// });

// setInterval(() => {
//   socket.emit("test", { data: "client test" });
// }, 2000);

// socket.on("event", function(data) {});
// socket.on("disconnect", function() {});
