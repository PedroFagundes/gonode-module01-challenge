const express = require("express");

const server = express();
server.use(express.json());

server.use((request, response, next) => {
  console.time("Request");
  console.log(`Method: ${request.method}; URL: ${request.url}`);

  next();

  console.timeEnd("Request");
});

function checkUserExists(request, response, next) {
  if (!request.body.name) {
    return response.status(400).json({ message: "User name is required" });
  }

  return next();
}

function checkUserInArray(request, response, next) {
  const user = users[request.params.index];

  if (!user) {
    return response.status(400).json({ message: "User does not exists" });
  }

  request.user = user;

  return next();
}

const users = ["Pedro", "Diego", "Robson"];

server.get("/users", (request, response) => {
  return response.json(users);
});

server.get("/users/:index", checkUserInArray, (request, response) => {
  return response.json(request.user);
});

server.post("/users", checkUserExists, (request, response) => {
  const { name } = request.body;

  users.push(name);

  return response.json(users);
});

server.put(
  "/users/:index",
  checkUserExists,
  checkUserInArray,
  (request, response) => {
    const { index } = request.params;
    const { name } = request.body;

    users[index] = name;

    return response.json(users);
  }
);

server.delete("/users/:index", checkUserInArray, (request, response) => {
  const { index } = request.params;

  users.splice(index, 1);

  return response.send();
});

server.listen(3000);
